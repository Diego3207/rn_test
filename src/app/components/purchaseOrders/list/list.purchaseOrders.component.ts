import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseOrder } from 'src/app/api/purchaseOrder';
import { PurchaseOrderService } from 'src/app/service/purchaseOrder.service';
import { SupplyService } from 'src/app/service/supply.service';
import { ProductCategoryService } from 'src/app/service/productCategory.service';
import { ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode , ConfirmEventType  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { DatePipe } from '@angular/common'; 

@Component({
    templateUrl: './list.purchaseOrders.component.html',
    providers: [DatePipe]
})
export class ListPurchaseOrdersComponent implements OnInit, OnDestroy {
    selectedElements: PurchaseOrder[] = [];
   // confirmDisplaySelected: boolean = false;
   // confirmDisplay: boolean = false;
	//content:string;
    orders: PurchaseOrder[];
   // order: PurchaseOrder;
    totalRows: number = 0;
    limit:number = 10 ;
    page:number  ;
    sort:string = ''; 
    search:string = ''; 
    searching: boolean;
    showButton! : boolean;
    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    listCategories: any[] = [];

    matchModeOptionsDate: SelectItem[];

    constructor(
        private miscService:MiscService,
        private cdref:ChangeDetectorRef ,
        private datePipe: DatePipe,
        private purchaseOrderService: PurchaseOrderService, 
        private supplyService: SupplyService, 
        private productCategoryService: ProductCategoryService ,
        //private deletedSupplyService: DeletedSupplyService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService) 
	{
        
    }
	

    ngOnInit(): void 
	{
        this.matchModeOptionsText = [
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH  },
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH},
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsNumber= [
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsDate = [
            { label: 'Contiene', value:  FilterMatchMode.DATE_IS  },   
            { label: 'No contiene', value: FilterMatchMode.DATE_IS_NOT },  
            { label: 'Antes', value: FilterMatchMode.DATE_BEFORE },  
            { label: 'Después', value: FilterMatchMode.DATE_AFTER },           
        ];

       this.getCategories();
    }


    ngOnDestroy() {
       
    }

    load(event: LazyLoadEvent){
        
        this.page =  (event.first / event.rows) + 1; 
        this.limit = event.rows;
        let order: {}[] = [];
        let filter = [];

        event.multiSortMeta.forEach(function (obj) {
            let h = {};
            h[obj['field']] = (( obj['order'] == 1) ? "asc": "desc");
            order.push(h);
        });
        this.sort = JSON.stringify(order);
        for(let i in event.filters){
           
            let obj= event.filters[i];
           
            if(typeof event.filters[i].value === 'boolean'){

                if(event.filters[i].value != null){
                    obj['field'] = i;
                    filter.push(obj);
                }
            }else{
                //type => number/string/object
                if(event.filters[i].value){
                    obj['field'] = i;
                    filter.push(obj);
                }
            }
        }
        this.search =JSON.stringify(filter);
        this.miscService.startRequest();
        if(filter.length > 0){
            this.filtrer(this.search);
        }else{
            this.list();
            this.cdref.detectChanges();
        } 
    
    }
   delete(deleteType:number, object : PurchaseOrder) {

        this.confirmationService.confirm({
            message: (deleteType == 1 ? 'Al eliminar la orden de compra eliminará los suministros asociados ¿Confirma eliminar los registros seleccionados?' :'Al eliminar la orden de compra eliminará los suministros asociados ¿Confirma eliminar el registro?'),
            header :'Confirmar' ,
            icon: 'pi pi-info-circle',
            acceptLabel: 'Aceptar',
            rejectLabel:'Cancelar',
            accept: () => {
                switch (deleteType) {
                    case 1:
                        this.confirmDeleteSelected();
                        break;
                    case 2 :
                        this.confirmDelete(object);
                        break;

                }
            }
        });

    }
    getCategories(){
        this.productCategoryService.getAll(0,1,'[{"id":"asc"}]')
        .subscribe((data: any)=>{
            
            if(data != null)
                this.listCategories = data['object']['records'];  

            
            this.miscService.endRquest(); 
        });
    }
    list(){
        this.purchaseOrderService.getAll(this.limit,this.page,this.sort)
        .subscribe((data: any)=>{
            if(data != null)
            {
                //console.log(data);
                this.orders = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];

            }else{
                this.orders = [];
                this.totalRows = 0;
                this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
            }
            this.miscService.endRquest(); 
        }, (err : any) => {
            // Entra aquí si el servicio entrega un código http de error EJ: 404, 
            if( err.status == 416){
                // success  info  warn  error
                this.messageService.add({severity:'warn', key: 'msg',summary: err.error.message,life: 3000});
            
            }else{

                //status = 0 , cuando no esta el back arriba
                this.messageService.add({severity:'error', key: 'msg', summary:  err.error.message,detail: err.name,life: 3000});
            }
            this.miscService.endRquest(); 
        });
    }
    
    filtrer(texto: any){
        
        this.purchaseOrderService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
            .subscribe((data: any)=>{
                if(data != null){
                    this.orders = data['object']['records'];                    
                    this.totalRows = data['object']['totalRecords'];
    
                }else{
                    this.orders = [];
                    this.totalRows = 0;
                    this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
                }
                this.miscService.endRquest(); 
            }, err => {
                // Entra aquí si el servicio entrega un código http de error EJ: 404, 
                if( err.status == 416){
                    // success  info  warn  error
                    this.messageService.add({severity:'warn', key: 'msg',summary: err.error.message,life: 3000});
                
                }else{
    
                    //status = 0 , 
                    this.messageService.add({severity:'error', key: 'msg', summary:  err.error.message,detail: err.name,life: 3000});
                }
                this.miscService.endRquest(); 
            });
    }

    confirmDelete(obj:any) {
       this.purchaseOrderService.disable(obj.id).subscribe((data: any)=>{ 

            this.supplyService.getFilter('[{"value":"'+obj.id+'","matchMode":"equals","field":"supplyPurchaseOrderId"}]',0,1,'[{"id":"asc"}]').subscribe( (data:any )=>
            {    
                //Método para eliminar los suministros asociados   
                let deleteSupplies = data['object']['records'];    

                deleteSupplies.forEach((obj, index) => {
                    console.log(obj);
                    this.miscService.startRequest();         
                    this.supplyService.delete(obj.id).subscribe((data: any)=>{
                        this.list();
                        this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
                        this.miscService.endRquest();
                    }, (err : any) => {
                    //console.log(err);
                    });
                });
            },
            (err : any) =>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al eliminar los suministros asociados '+obj.id , detail:err.message, life: 3000 });
                this.miscService.endRquest();
            });

            //continúa el proceso de eliminar orden de compra
            this.list();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
            
        }, (err : any) => {
            //console.log(err);
        });  
    }
   
    confirmDeleteSelected() {
        var peticiones: any[] = []; 	
		
		for(let i = 0 ; i < this.selectedElements.length; i++)
		{
            const ptt = this.purchaseOrderService.disable(this.selectedElements[i].id).pipe
			(
				catchError((error) => 
				{
                    this.supplyService.getFilter('[{"value":"'+this.selectedElements[i].id+'","matchMode":"equals","field":"supplyPurchaseOrderId"}]',0,1,'[{"id":"asc"}]').subscribe( (data:any )=>
                    {    
                        //Método para eliminar los suministros asociados   
                        let deleteSupplies = data['object']['records'];    

                        deleteSupplies.forEach((obj, index) => {
                            console.log(obj);
                            this.miscService.startRequest();         
                            this.supplyService.delete(obj.id).subscribe((data: any)=>{
                                this.list();
                                this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
                                this.miscService.endRquest();
                            }, (err : any) => {
                            //console.log(err);
                            });
                        });
                    },
                    (err : any) =>
                    {
                        this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al eliminar los suministros asociados ', detail:err.message, life: 3000 });
                        this.miscService.endRquest();
                    });

                    //continúa el proceso de eliminar orden de compra
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error eliminar un registro", detail:error.message });
					return of(null);
				})
			);				
			peticiones.push(ptt);			        
        }
		
		forkJoin(peticiones).subscribe((respuestas: any[]) => 
		{
            this.list();
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elementos eliminados exitosamente', life: 3000 });
            this.selectedElements = [];        
            
		}, 
        (err : any) => 
		{		
			this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al eliminar', life: 3000 });
		});
		
    }
    getPageRange(page: number, limit: number, totalRows: number) 
    {

        
        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }
        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }
        if (!Number.isInteger(totalRows) || totalRows < 0) {
            totalRows = 0;
        }

        const startIndex = (page - 1) * limit + 1;
        const endIndex = Math.min(startIndex + limit - 1, totalRows);

        return `Mostrando del ${startIndex} al ${endIndex} de ${totalRows}`;
    }
    
    generateTempleteCSV(obj: any){
        this.miscService.startRequest();

        this.supplyService.getFilter('[{"value":"'+obj.id+'","matchMode":"equals","field":"supplyPurchaseOrderId"}]',0,1,'[{"id":"asc"}]').subscribe( (data:any )=>
        {            
                
            if(data != null){
                let supplies = data['object']['records'];    
                let dataCSV = [];

                if(supplies.length > 0){
                

                    //1. Procesar por categoria

                    // a) Rastreador=1 b) SIM=2 c) ACCESORIO=3 / OTRO=4

                    let categorys = {};

                    supplies.forEach((obj, index) => {

                        if( !categorys.hasOwnProperty(obj['supplyProductId']['productCategoryId'])){
                            categorys[obj['supplyProductId']['productCategoryId']] = {
                                elements: []
                            }
                        }

                        categorys[obj['supplyProductId']['productCategoryId']].elements.push(obj);
                    });


                    //2. Generar CSV por categoria
                    let count = 0;
                    for(let type in categorys){
                        //console.log(categorys[type]); 

                        
                        let dataCSV = [];

                        for(let i = 0 ; i <  categorys[type].elements.length ; i++)
                        {
                            let supply = categorys[type].elements[i];
                            let row = {
                                id : supply.id,
                                suministro : supply.supplyKey.toString(),
                                id_orden_compra : supply.supplyPurchaseOrderId['id'],
                                fecha_compra :  this.datePipe.transform(new Date(supply.supplyDateSupplied), 'yyyy-MM-dd'),  
                                producto : supply.supplyProductId['productBrand']+' '+supply.supplyProductId['productModel'],
                                status :  supply.supplyStatus,
                                ubicacion : supply.supplyLocationId['locationName'],
                                categoria : this.getCategory(supply['supplyProductId']['productCategoryId']),
                                observaciones : supply.supplyObservation,
                            }
                            switch(supply['supplyProductId']['productCategoryId']){ 
                                case 1:  
                                    //row['categoria'] = 'Rastreador' ;
                                    if(supply.supplyInformation != null){
                                        row['imei']= supply.supplyInformation.trackerImei;
                                        row['sim_card'] = supply.supplyInformation.trackerSimCardId;
                                        row['voltage_minimo'] = supply.supplyInformation.trackerMinimumVoltage;
                                        row['voltage_maximo'] = supply.supplyInformation.trackerMaximumVoltage;
                                    } 
                                   break; 
                                 
                                case 2: 
                                   // row['categoria'] = 'SIM' ;
                                    if(supply.supplyInformation != null){
                                        row['iccid'] = supply.supplyKey,
                                        row['numero'] =supply.supplyInformation.simCardNumber;
                                        row['tsp'] =supply.supplyInformation.simCardTsp;
                                        row['plan'] = supply.supplyInformation.simCardServicePlan;
                                        row['estado_sim'] = supply.supplyInformation.simCardStatus;
                                    }
                                   break; 
                                
                                default:  
                                    //row['categoria'] = ( supply['supplyProductId']['productCategoryId']  == 3 ? 'Accesorio' : 'Otro');
 
                                   break; 
                                
                            } 
                            

                            dataCSV.push(row);
                        }
    
                        let csvOptions = {
                            fieldSeparator: ',',
                            quoteStrings: '"',
                            decimalseparator: '.',
                            showLabels: true,
                            useBom: false,
                            noDownload: false,
                            headers:  Object.keys(dataCSV[0])
                        };
                        //new  AngularCsv(dataCSV, "orden_compra_"+ dataCSV[0].producto+"_"+dataCSV[0].categoria, csvOptions);
                        if(count > 0) {
                            setTimeout(() => {
                                new  AngularCsv(dataCSV, "orden_compra_"+ dataCSV[0].producto+"_"+dataCSV[0].categoria, csvOptions);
                            }, 1000 * count);
                            
                        } else {
                            new  AngularCsv(dataCSV, "orden_compra_"+ dataCSV[0].producto+"_"+dataCSV[0].categoria, csvOptions);
                        }                        
                        
                        count =+1;
                    }

                    
                
                
                   
                    this.miscService.endRquest();
                }else{
                    this.messageService.add({ severity:'warn',key: 'msg', summary: 'Orden de compra con sin suministros ' , detail:'', life: 3000 });
                    this.miscService.endRquest();
                }
                

          
                

            }
              
                
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al traer suministros de la compra con #ID '+obj.id , detail:err.message, life: 3000 });
            this.miscService.endRquest();
        });

       
     
    }

    getCategory(id:number){
        let category;
        category = this.listCategories.find(obj =>  obj.id == id);
        return category.productCategoryDescription;
    }


}
