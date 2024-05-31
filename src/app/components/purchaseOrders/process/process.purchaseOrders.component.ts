import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/service/product.service';
import { ProductCategoryService } from 'src/app/service/productCategory.service';
import { ServiceService } from 'src/app/service/service.service';
import { UserService } from 'src/app/service/user.service';
import { LocationService } from 'src/app/service/location.service';
import { SupplyService } from 'src/app/service/supply.service';
import { SimCardService } from 'src/app/service/simCard.service';
import { TrackerService } from 'src/app/service/tracker.service'; 
import { PurchaseOrderEvidenceService } from 'src/app/service/purchaseOrderEvidence.service';
import { PurchaseOrder } from 'src/app/api/purchaseOrder'; 
import { PurchaseOrderService } from 'src/app/service/purchaseOrder.service'
import {ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode , ConfirmEventType, PrimeIcons  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe,formatDate  } from '@angular/common'; 
import { SessionService } from 'src/app/service/session.service'
//import { ProductFileService } from 'src/app/service/productFile.service';
import { FileService } from 'src/app/service/file.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as XLSX from 'xlsx';



@Component({
    templateUrl: './process.purchaseOrders.component.html',
    providers: [DatePipe, CurrencyPipe]
})
export class ProcessPurchaseOrdersComponent implements OnInit, OnDestroy {
    id:number;
    formReceived: FormGroup | any;
    formSupply: FormGroup | any;
    events: any[];
    listProducts: any[] = [] ;
    listServices: any[] = [] ;
    dataOrder: any =  {} ;
    received: boolean = false;
    files : any[] = [];
    uploadedFiles: any[] = []; //lista de archivos por cargar
    listStatus : any[] = [];
    listLocations : any[] = [];
    listUsers : any[] = [];
    activeIndex: number = 0;
    listEvidenceDelete : any[] = [];
    listEvidence : any[] = [];
    date: any = '';
    updateReceived : boolean = false;
    massiveOption : boolean = true;
    dataCSV : any[] = [];
    totalProducts : number = 0;
    listCategories: any[] = [];



    constructor(
        private miscService:MiscService,
        private cdref:ChangeDetectorRef ,
        private purchaseOrderEvidenceService: PurchaseOrderEvidenceService,
        private fileService:FileService,
        private supplyService: SupplyService,
        private simCardService: SimCardService,
        private trackerService: TrackerService,
        private purchaseOrderService: PurchaseOrderService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private userService: UserService ,
        private locationService:  LocationService ,
        private productService: ProductService ,
        private productCategoryService: ProductCategoryService ,
        private serviceService: ServiceService ,
        private sessionService:SessionService,
        private datePipe: DatePipe,
        private router: Router
        ) 
	{
        this.events = [
            {label:'Nueva',status: "nueva",check: true},     
            {label:'Recibida',status: "recibida",check: false}, 
            {label:'Abastecida',status: "abastecida", check: false}
        ];

        this.listStatus = [ 
            {label: "Disponible", value: "disponible"},
            {label: "Pendiente", value: "pendiente"}
        ];

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; 

        this.id = parseInt(this.route.snapshot.params['idx']);

		this.formReceived = this.formBuilder.group
		({
            id:[this.id, [Validators.required]],
            purchaseOrderStatus:'recibida',            
            purchaseOrderStatusObservation:['',[Validators.required]], 
            purchaseOrderUserReceivedId:this.sessionService.getUserId(),
        }, formOptions);

        this.formSupply = this.formBuilder.group
		({
            supplyAssignedPersonId: [null, [Validators.required]],
            supplies: this.formBuilder.array([],Validators.required) 

        }, formOptions);

    }
	

    
    ngOnInit() {
        this.getInfo();
        this.date =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.getLists();
    }
 
    ngOnDestroy() {
       
    }
    newSuppliesArray(id,name) {
        return this.formBuilder.group({ 
            supplyProductName : name,
            supplyProductId:[id,[Validators.required]],
            supplyPurchaseOrderId: [this.id],
            supplyKey: [null, [Validators.required]],
            supplyLocationId: [null, [Validators.required]],
            supplyStatus:[null, [Validators.required]] ,
            supplyUserSuppliedId : this.sessionService.getUserId(),
            supplyObservation: null, 
        });

    }
    addRow(id , name){
        this.infoSuppliesArray().push(this.newSuppliesArray(id , name)); 
    }
    removeRow(index:number){
        this.infoSuppliesArray().removeAt(index); 
    }

    infoSuppliesArray(): FormArray {
        return this.formSupply.get('supplies') as FormArray;
    }
    saveReceived(){
        
        this.miscService.startRequest();

        if (!this.formReceived.invalid  &&  (( this.uploadedFiles.length + this.listEvidence.length) > 0 )) {
            let received = this.formReceived.value;

            
            received['purchaseOrderDateStatus'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss');

            this.purchaseOrderService.update(received)
            .subscribe(data =>{
                this.dataOrder.purchaseOrderStatus = 'recibida'; // traer de nuevo la informacion de la ordern de compra y limpiar el formulario received
                let status = this.events.find(obj =>  obj.status.toUpperCase() == 'recibida'.toUpperCase() );
                status.check = true;
                
               
                this.saveEvidence();
                this.updateReceived = true;

                if(this.updateReceived){
                    this.deleteEvidence();
                }else{
                    return;
                }   

                this.activeIndex = 1;
                this.formSupply.controls.supplies.clear(); 
                this.dataOrder['purchaseOrderProducts'].forEach(obj => {  
                                 
                    for(let i=0; i < obj.purchaseOrderProductQuantity; i++){      
                       
                        let name =  obj.purchaseOrderProductProductId['productBrand'] +" "+ obj.purchaseOrderProductProductId['productModel'];
                        this.addRow(obj.purchaseOrderProductProductId['id'] , name);
    
                    }

                });
                
                
                this.miscService.endRquest();
                

            },(err :any)=> {
                this.miscService.endRquest();
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:err.message, life: 3000 });
            });
        }else {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error", detail:'Campos obligatorios pendiente'});                        
            this.miscService.endRquest();
        }
    }
    saveSupply(){
        if (!this.formSupply.invalid ) {

            //agregar opcion pendiente al array de status y comprobar si aun no existe esa propiedad en el array
            if(this.events.find((obj) => obj.status === "pendiente") == undefined)
                this.events.push({label:'Pendiente',status: "pendiante",  check: true});

            this.miscService.startRequest();
            const actions = [];
            this.formSupply.controls['supplies'].value.forEach(obj => {                
                obj['supplyAssignedPersonId'] =  (this.formSupply.controls['supplyAssignedPersonId'].value).toString();
                obj['supplyProductId'] = (obj['supplyProductId']).toString();
                obj['supplyDateSupplied'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                obj['supplyPurchaseOrderId'] = (obj['supplyPurchaseOrderId']).toString();
                obj['supplyLocationId'] = (obj['supplyLocationId']).toString();
                obj['supplyUserSuppliedId'] = (obj['supplyUserSuppliedId']).toString();
                        
                const ptt = this.supplyService.create(obj).pipe(
                    catchError((error) => {
                        throw this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear suministro con serial: "+obj.supplyKey,detail:  error.error.error });
                        return of(null);
                    })
                );		
                actions.push(ptt);
            });

            forkJoin(actions).subscribe((response:any)=>
            {
                //console.log(response);
               
                let ok = [];

                response.forEach((response)=>{
                    if(response != null)
                        ok.push(response);
                });     
                
                if(response.length  == ok.length){
                    this.miscService.endRquest(); 
                    this.router.navigate(['/orders']);
                }else{
                    this.miscService.endRquest(); 
                }

            },

            (err:any)=>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al crear suministros', life: 3000 });                    this.miscService.endRquest();
            });
        }else{
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:"Campos obligatorios pendientes", life: 3000 });

        }
    }

    getInfo(){

        this.miscService.startRequest();

        this.purchaseOrderService.getById(this.id)
        .subscribe(data => {
            this.dataOrder = data;
           //console.log(data);
           
            if(data.purchaseOrderStatus == 'recibida' ){
                this.updateReceived = true;
                let status = this.events.find(obj =>  obj.status.toUpperCase() == 'recibida'.toUpperCase() );
                status.check = true;
                //procesar productos
                
                this.activeIndex = 1;
                this.formSupply.controls.supplies.clear(); 

                data['purchaseOrderProducts'].forEach(obj => {  
                    this.totalProducts = this.totalProducts + obj.purchaseOrderProductQuantity;

                    for(let i=0; i < obj.purchaseOrderProductQuantity; i++){      
                       
                        let name =  obj.purchaseOrderProductProductId['productBrand'] +" "+ obj.purchaseOrderProductProductId['productModel'];
                        this.addRow(obj.purchaseOrderProductProductId['id'] , name);
    
                    }

                });
                this.listEvidence = data['purchaseOrderEvidences'];                
                this.formReceived.controls['purchaseOrderStatusObservation'].setValue(data['purchaseOrderStatusObservation']);
            
                
               
            }else if (data.purchaseOrderStatus == 'pendiente'){
                this.events[1].check = true; //status recibida
                this.events.splice(2,0,{label:'Pendiente',status: "pendiante",  check: true});
                this.activeIndex = 1;
                
                data['purchaseOrderProducts'].forEach(obj => {  

                    let pending = obj.purchaseOrderProductQuantity -  obj.purchaseOrderProductSupplies.length;
                    for(let i=0; i < pending; i++){      
                       
                        let name =  obj.purchaseOrderProductProductId['productBrand'] +" "+ obj.purchaseOrderProductProductId['productModel'];
                        this.addRow(obj.purchaseOrderProductProductId['id'] , name);
    
                    }

                });
            }

            this.miscService.endRquest();
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al traer datos', life: 3000 });
            this.miscService.endRquest();
        });
                
    }

    pushFile(fileName,fileId){
        this.listEvidenceDelete.push({"id": fileId , "name": fileName});
        this.listEvidence = this.listEvidence.filter(e => e['purchaseOrderEvidencePath'] != fileName);
    }

    onUpload(event: any) 
	{
        this.files = event.currentFiles;

        let find =  this.uploadedFiles.find(obj =>  obj == this.files[this.files.length - 1] );

        if(find == undefined ){
            this.uploadedFiles.push(this.files[this.files.length - 1]);
        }else{
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Advertencia', detail: 'Este archivo ya existe', life: 3000 })

        }
     
    }
    onRemove(event : any){
        for(let i = 0 ; i < this.uploadedFiles.length; i++)
        {
            if(this.uploadedFiles[i] === event.file){
                this.uploadedFiles.splice(i,1);
            }
        } 
       
    }
    saveEvidence()
	{     
        
		if(this.uploadedFiles.length > 0)
		{	
            var peticiones: any[] = []; 
            for(let i = 0 ; i < this.uploadedFiles.length; i++)
            {
                const ptt = this.fileService.upload(this.uploadedFiles[i], 'purchase_order_evidence').pipe
                (
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
				        return of(null);
                    })
                );				
                peticiones.push(ptt);			        
            }
            
            forkJoin(peticiones).subscribe((data: any[]) => 
            {
                let files : any[] = [];
                for(let i = 0 ; i < data.length; i++)
                {
                    if(data[i] != null){
                        files.push({
                            purchaseOrderEvidencePurchaseOrderId : this.id.toString(),
                            purchaseOrderEvidencePath: data[i].files[0].fd,
                            purchaseOrderEvidenceName : data[i].files[0].filename,
                            purchaseOrderEvidenceSize : (data[i].files[0].size / 1024).toFixed(2)                           
                        });
                    }           
                }
                this.saveEvidenceFiles(this.id,files);
            }, 
            err => 
            {		
                this.miscService.endRquest(); 
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
            }); 
		}
		else
		{
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }

    }

    private saveEvidenceFiles(idP,files)
    {
    
        var peticiones: any[] = [];

        for(let i = 0 ; i < files.length; i++)
        {
            peticiones.push(this.purchaseOrderEvidenceService.create(files[i]).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo "+ (i+1), detail:error.message });
                    return of(null);
                })
            ));	
        }

        forkJoin(peticiones).subscribe((data: any[]) => 
        {
            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
        }); 
    }

    getLists(){

        this.miscService.startRequest();
      
        const categories = this.productCategoryService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de categorias de producto", detail:error.message });
                return of(null); 
            })
        );
        const users = this.userService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de usuarios", detail:error.message });
                return of(null); 
            })
        );
        const locations = this.locationService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de ubicaciones", detail:error.message });
                return of(null); 
            })
        );

        forkJoin([categories,users,locations]).subscribe(  ([dataCategories,dataUsers, dataLocations] )=>
        {
            
            if(dataCategories != null)
                this.listCategories = dataCategories['object']['records'];  

            if(dataUsers != null)
                this.listUsers = dataUsers['object']['records'];       

            if(dataLocations != null)
                this.listLocations = dataLocations['object']['records']; 
               
           
            this.miscService.endRquest();	
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
          

    }
    deleteEvidence()
    {
        var peticiones: any[] = [];
        for(let i = 0 ; i < this.listEvidenceDelete.length; i++)
        {
           
            
            //delete evidence from database
            const pfdb = this.purchaseOrderEvidenceService.delete(this.listEvidenceDelete[i].id).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar archivos de la base se datos", detail:error.message });
                    return of(null);
                })
            );	
            peticiones.push(pfdb); 
        }

        forkJoin(peticiones).subscribe((respuestas: any[]) => 
        {
            this.miscService.endRquest(); //fin del proceso por guardado
           // this.router.snavigate(['/product']);
        }, 
        err => 
        {		
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al eliminar archivos de producto", detail:err.message });
        }); 
    }

    generateTempleteCSV(products: any){
        let data = [];

        for(let i = 0 ; i < products.length; i++)
        {
            let cont =  products[i].purchaseOrderProductQuantity - products[i].purchaseOrderProductSupplies.length;
            for(let j = 0 ; j < cont; j++)
            {
                let row = {

                    producto_nombre : products[i].purchaseOrderProductProductId['productBrand'] +" "+ products[i].purchaseOrderProductProductId['productModel'],   
                    producto_id: products[i].purchaseOrderProductProductId['id'],             
                    orden_compra_id: this.id,                
                    ubicacion_id: '',
                    estado_suministro:'disponible',
                    observaciones: '',
                    persona_resguarda_id: '',
                    serial: '',
                    categoria: this.getCategory(products[i].purchaseOrderProductProductId['productCategoryId'])
                }

                
                data.push(row);
            }
        }
       
        let csvOptions = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            useBom: false,
            noDownload: false,
            headers:  Object.keys(data[0])
          };
        new  AngularCsv(data, "plantillaCSV_"+data[0].producto_nombre, csvOptions);
     
    }
    getCategory(id:number){
        let category;
        category = this.listCategories.find(obj =>  obj.id == id);
        return category.productCategoryDescription;
    }
    importData(e: any) 
	{
        for (let i = 0; i < e.files.length; i++) {
            let file =e.files[i]; 
            let fileReader = new FileReader(); 
           
            fileReader.onload = (e) => {
             this.processCSV(fileReader.result);
             
            };            
            fileReader.readAsText(file);

          
          }
      
    }
    processCSV(text:any) {

        let keys = [];
        let lines = text.replace(/"+/g,'').split(/[\r\n]+/);
        //comprobar si la ultima posicion de lines esta vacia
        if(lines[lines.length - 1] == "")
            lines.pop(); //eliminar ultimo elemento del array (ya eque esta vacia la ultima posicion)

        keys = lines[0].split(',');
        lines.shift();//eliminar el primer elemento de lines (quitar las keys)
       
        lines.forEach((obj) => {
            let element = {};
            obj.split(',').forEach((obj, index) => {
                element[keys[index]] = obj; 
            });
            this.dataCSV.push(element);
        });
    }

    sendData(event: any) 
	{
        //let sims= [];
        //let trackers = [];
        //let others = [];
        let supplies = [];
        this.dataCSV.forEach((obj, index) => {
            let keys =  Object.keys(obj);
            keys.shift();
            let keysSupplyCSV = keys.slice(0, 7);
            //let keysDetailCSV = keys.slice(8);
            //let keysDetials = [];

            let supply = {};
            let keysSupply = ['supplyProductId','supplyPurchaseOrderId','supplyLocationId','supplyStatus','supplyObservation','supplyAssignedPersonId','supplyKey']
                
            keysSupplyCSV.forEach((element, index) => {
                supply[keysSupply[index]] = obj[element];
            });

            supply['supplyUserSuppliedId'] = this.sessionService.getUserId();
            supply['supplyDateSupplied'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss');
           
            
            /*switch (obj.categoria) {
                case 'rastreador':
                    let tracker = {};
                    keysDetials = ['trackerImei','trackerMaximumVoltage','trackerMinimumVoltage'];
                    keysDetailCSV.forEach((element, index) => {
                        tracker[keysDetials[index]] = obj[element];                    
                    });
                    supply['details'] = tracker;
                    trackers.push(supply);  
                    break;
                case 'sim':
                    let sim = {};
                    keysDetials = ['simCardNumber','simCardTsp','simCardServicePlan'];

                    keysDetailCSV.forEach((element, index) => {
                        sim[keysDetials[index]] = obj[element];
                    });
                    
                    supply['details'] = sim;
                    sims.push(supply);  
                    break;
                default:
                    others.push(supply);    
                    break;
                
            }*/
            supplies.push(supply);
                    
       
        });
        //this.sendRequests(trackers,sims,others);
        this.sendRequests(supplies);
    }
    clearCSV(){
        this.dataCSV = [];        
    }

    //sendRequests(trackers : any[], sims : any[], others : any[]){
    sendRequests(supplies : any[]){
        this.miscService.startRequest();
        let actions = [];

        /*trackers.forEach((obj)=>{

            let supply = {};

            Object.keys(obj).forEach(element => {
                if( element != "details"){
                    supply[element] = obj[element];
                }
            });
            const ptt = this.supplyService.create(supply).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear suministro con serial"+obj.supplyKey, detail:error.message });
                    return of(null);
                })
            );		

            actions.push(ptt);
        });

        sims.forEach((obj)=>{

            let supply = {};

            Object.keys(obj).forEach(element => {
                if( element != "details"){
                    supply[element] = obj[element];
                }
            });
            const ptt = this.supplyService.create(supply).pipe(
                catchError((error) => 
                {
                    //console.log("action supply");
                    //console.log(error);
                    let text = (error.error.code == undefined) ? error.error.split("}")[0] :error.error.code +"\n"+error.error.problems ;
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear suministro con serial: "+obj.supplyKey, detail:text });
                    return of(null);
                })
            );		

            actions.push(ptt);
        });

        others.forEach((obj)=>{

            const ptt = this.supplyService.create(obj).pipe(
                catchError((error) => 
                {
                    //console.log("action other");
                    //console.log(error);
                    let text = (error.error.code == undefined) ? error.error.split("}")[0] :error.error.code +"\n"+error.error.problems ;

                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear suministro con serial"+obj.supplyKey, detail:text });
                    return of(null);
                })
            );		

            actions.push(ptt);
        });

        */
       //validar cantidad de  filas importadas en el CSV  v/s cantidad de cada producto
        let quantity = 0;
        let currentSupplies = 0;

        this.dataOrder['purchaseOrderProducts'].forEach(obj => {  
                                 
            quantity += obj.purchaseOrderProductQuantity; 
            currentSupplies +=  obj.purchaseOrderProductSupplies.length;

        });

        if(supplies.length  <= (quantity - currentSupplies) ){
            supplies.forEach((obj)=>{

                const ptt = this.supplyService.create(obj).pipe(
                    catchError((error) => 
                    {
                        let text = (error.error.code == undefined) ? error.error.error :error.error.code +"\n"+error.error.problems ;

                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear suministro con serial "+obj.supplyKey, detail:text });
                        return of(null);
                    })
                );		

                actions.push(ptt);
            });
            forkJoin(actions).subscribe((dataId)=>
            {
                let ok = [];

                dataId.forEach((response)=>{
                    if(response != null)
                        ok.push(response);
                });
                if(ok.length == actions.length) {
                    this.miscService.endRquest();
                    this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Datos guardados exitosamente', life: 3000 }); 
                    this.router.navigate(['/orders']);
                
                

                }else{
                    this.miscService.endRquest();
                    this.messageService.add({ severity: 'warn', key: 'msg',summary: 'Advertencia', detail: 'Algunos suministros no fueron creados', life: 3000 }); 


                }
                
                /*if((ok.length > 0 || sims.length > 0 || trackers.length > 0) && others.length == 0 && ok.length == actions.length ){
                    //preparar los detalles 
                    let actionDetails = [];

                    trackers.forEach((tracker,index)=>{
                        let newTracker = tracker['details'];
                        newTracker['trackerSupplyId']= dataId[index]['newId'].toString();
                        newTracker['trackerMaximumVoltage'] = parseFloat(newTracker['trackerMaximumVoltage']);
                        newTracker['trackerMinimumVoltage'] = parseFloat(newTracker['trackerMinimumVoltage']);
                        const ptt = this.trackerService.create(newTracker).pipe(
                            catchError((error) => 
                            {
                                //console.log("action reasteador");
                                //console.log(error);
                                let text = (error.error.code == undefined) ? error.error.split("}")[0] :error.error.code +"\n"+error.error.problems ;
                                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear el rastreador con IMEI: "+ newTracker.trackerImei, detail:text });
                                return of(null);
                            })
                        );		
            
                        actionDetails.push(ptt);
                    });
                    sims.forEach((sim,index)=>{
                        let newSim = sim['details'];
                        let i = trackers.length  + index ;
                        newSim['simCardStatus']= 'disponible';
                        newSim['simCardSupplyId']= dataId[i]['newId'].toString();
                        
                        const ptt = this.simCardService.create( newSim).pipe(
                            catchError((error) => 
                            {
                                console.log("action linea");
                                console.log(error);
                                let text = (error.error.code == undefined) ? error.error.split("}")[0] :error.error.code +"\n"+error.error.problems ;
                                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear la linea con el número:"+newSim.simCardNumber, detail:text});
                                return of(null);
                            })
                        );		
            
                        actionDetails.push(ptt);
                    });

                    
                    if(actionDetails.length > 0){
                        forkJoin(actionDetails).subscribe((data )=>
                        {
                            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Datos guardados exitosamente', life: 3000 }); 
                            this.router.navigate(['/orders']);
                            this.miscService.endRquest();
                        },
                
                        (err:any)=>
                        {
                            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
                            this.miscService.endRquest();
                        });
                    }else{
                        this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Datos guardados exitosamente', life: 3000 }); 
                        this.router.navigate(['/orders']);
                        this.miscService.endRquest();
                    }
                }else if(others.length > 0 && ok.length == actions.length   && ok.length == actions.length) {
                
                        this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Datos guardados exitosamente', life: 3000 }); 
                        this.router.navigate(['/orders']);
                        this.miscService.endRquest();
                    

                }else if(others.length > 0 && actions.length > ok.length ){
                    this.miscService.endRquest();

                }*/
            
            },

            (err:any)=>
            {
                //console.log(err);
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
                this.miscService.endRquest();
            });
        }else{
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Cantidad de filas importadas excede a la cantidad especificada en la orden de compra.', life: 3000 });
            this.miscService.endRquest();
        }
    }
   
}


 