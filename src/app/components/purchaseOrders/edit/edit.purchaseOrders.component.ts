import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProviderService } from 'src/app/service/provider.service';
import { PurchaseOrderService } from 'src/app/service/purchaseOrder.service';
import { ProductService } from 'src/app/service/product.service';
import { ServiceService } from 'src/app/service/service.service';
import { QuotationPurchaseService } from 'src/app/service/quotationPurchase.service';
import { PurchaseOrderProductService } from 'src/app/service/purchaseOrderProduct.service';
import { PurchaseOrderServiceService } from 'src/app/service/purchaseOrderService.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { Provider } from 'src/app/api/provider';
import { Product } from 'src/app/api/product';
import { Service } from 'src/app/api/service';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService} from 'src/app/service/providerService.service';
import { QuotationPurchase } from 'src/app/api/quotationPurchase';
import { PurchaseOrder } from 'src/app/api/purchaseOrder';
import { isNull } from 'util';




@Component({
    templateUrl: './edit.purchaseOrders.component.html'
})
export class EditPurchaseOrdersComponent implements OnInit, OnDestroy {
    id:number;
    form: FormGroup | any;
    deletedProducts : any[] = [];
    deletedServices : any[] = [];
    
    useQuotation: boolean = false;
    listQuotations: any[] = [];
    listProviders: Provider[] = []; 
    disabledQuotation: boolean = false;

    listUnitProducts: any[] = [];
    listUnitServices: any[] = [];
    listProducts: any[] = [] ;
    listServices: any[] = [] ;
   // c : number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private miscService:MiscService,
        private purchaseOrderService :PurchaseOrderService ,
        private purchaseOrderProductService : PurchaseOrderProductService ,
        private purchaseOrderServiceService : PurchaseOrderServiceService ,
        private quotationPurchaseService: QuotationPurchaseService ,       
        private providerService: ProviderService ,
        private productService: ProductService ,
        private serviceService: ServiceService ,
        private providerProductService: ProviderProductService ,
        private providerServiceService: ProviderServiceService ,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; 

        this.id = parseInt(this.route.snapshot.params['idx']);

		this.form = this.formBuilder.group
		({
            id:[this.id, [Validators.required]],
            purchaseOrderDescription:[null,[Validators.required,Validators.maxLength(255)]],
            purchaseOrderGuaranty:null, 
            purchaseOrderQuotationPurchaseId:null, 
            purchaseOrderProviderId:[null,[Validators.required]], 
            purchaseOrderProducts: this.formBuilder.array([],[this.isProductDuplicated]), 
            purchaseOrderServices: this.formBuilder.array([],[this.isServiceDuplicated]),
        }, formOptions);


        this.listUnitProducts = [
            { label: 'Pieza', value:'pieza'},
            { label: 'Caja', value: 'caja'},
            { label: 'Paquete',value: 'paquete'}
            
        ]; 
        this.listUnitServices = [
            { label: 'Anual',value: 'anual'},
            { label: 'Mensual',value: 'mensual'},
            
        ];

        
        this.getInfo();
		
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{

        if (this.form.invalid) {
           // this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });
            return;
        }

        this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/orders']);
    }
    
    newProductsArray() {
        return this.formBuilder.group({
            id:null,
            purchaseOrderProductProductId: [null,[Validators.required]],
            purchaseOrderProductUnit:[null,[Validators.required]],
            purchaseOrderProductQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]], 
            purchaseOrderProductPrice:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]],
        });

    }
    newServicesArray() {
        return this.formBuilder.group({
            id:null,
            purchaseOrderServiceServiceId:[null,[Validators.required]],
            purchaseOrderServiceUnit: [null,[Validators.required]],
            purchaseOrderServiceQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]],  //[min]="1" [max]="99999999"
            purchaseOrderServicePrice:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]],

        });
    }

    infoProductsArray(): FormArray {
        return this.form.get('purchaseOrderProducts') as FormArray;
    }
    infoServicesArray(): FormArray {
        return this.form.get('purchaseOrderServices') as FormArray;
    }
    
    addRow(type:string){
        switch (type) {
            case 'product':
                this.infoProductsArray().push(this.newProductsArray()); 
                break;
            case 'service':
                this.infoServicesArray().push(this.newServicesArray()); 
                break;
        }
    }
    removeRow(object:any,type:string,index:number){
        switch (type) {
            case 'product':
                this.infoProductsArray().removeAt(index);
                if(object.value.id !== null)
                    this.deletedProducts.push(object.value.id);
                break;
            case 'service':
                this.infoServicesArray().removeAt(index); 
                if(object.value.id !== null)
                    this.deletedServices.push(object.value.id);
                break;
        }
    }
    isProductDuplicated(control: FormArray ) 
	{
			
		const uniqueValues = new Set();

        for (const item of control.controls) 
		{

            const obj = item.value.purchaseOrderProductProductId
            if (uniqueValues.has(obj)) 
			{
			  return { duplicated: true }; 
            }          
            
			uniqueValues.add(obj);
		}
        

		return null; //en este punto no hay error, se regresa null	
	}
    isServiceDuplicated(control: FormArray ) 
	{
			
		const uniqueValues = new Set();

        for (const item of control.controls) 
		{

            const obj = item.value. purchaseOrderServiceServiceId
            if (uniqueValues.has(obj)) 
			{
			  return { duplicated: true }; 
            }          
            
			uniqueValues.add(obj);
		}
        

		return null; 
	}
    getFilter(value){
        console.log("getFilter");
        if(value != null){
            this.miscService.startRequest(); 
            this.listProducts = [];
            this.listServices = [];
          
            //1. Hacer una peticion para traer los productos/servicios de un proveedor
            const products = this.providerProductService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"providerProductProviderId"}]',0,1,'[{"id":"asc"}]')
            .pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
                    return of(null); 
                })
            );
            
            const services =this.providerServiceService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"providerServiceProviderId"}]',0,1,'[{"id":"asc"}]')
            .pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar  servicios", detail:error.message });
                    return of(null); 
                })
            );  
            forkJoin([products,services]).subscribe(([dataProducts,dataServices] )=>
            {
               
                if(dataProducts != null )
                {                    
                    dataProducts['object']['records'].forEach(element => {
                        this.listProducts.push({'label':element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel'],'value':element['providerProductProductId']['id'],description:element['providerProductProductId']['productDescription'],labelFilter:element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel']+" "+element['providerProductProductId']['productDescription']});
                    });
                }
                if(dataServices != null)
                {
                    dataServices['object']['records'].forEach(element => {
                        this.listServices.push({'label': element['providerServiceServiceId']['serviceDescription'],'value': element['providerServiceServiceId']['id']});
                    });
                }
    
               this.miscService.endRquest(); 
            },
    
            (err:any)=>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
                this.miscService.endRquest();
            });


        }else{
            
            
            if(!this.useQuotation){
                this.form.controls['purchaseOrderQuotationPurchaseId'].setValue(null);
                this.delete();        
            }
            
        }
    }

    delete(){

        for (let i=0; i < this.form.controls['purchaseOrderProducts'].length; i++){  
            if(this.form.controls['purchaseOrderProducts'].value[i]['id'] !== null)       
                this.deletedProducts.push(this.form.controls['purchaseOrderProducts'].value[i]['id']);
        }

        for (let i=0; i < this.form.controls['purchaseOrderServices'].length; i++){  
            if(this.form.controls['purchaseOrderServices'].value[i]['id'] !== null)       
                this.deletedServices.push(this.form.controls['purchaseOrderServices'].value[i]['id']);
        }
        this.listProducts = [];           
        this.listServices = [];
        
        this.form.controls.purchaseOrderProducts.clear();
        this.form.controls.purchaseOrderServices.clear();

        
    }

    
    getInfoQuotation(value){
        this.delete();
        if(value != null ) {
            this.quotationPurchaseService.getById(value).subscribe( (dataInfo:any )=>
            {            
                this.useQuotation = true;
                
                this.getItemsQuotation(dataInfo);
                
            },
            (err : any) =>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al traer información de la cotizacion con #ID '+value , detail:err.message, life: 3000 });
                this.miscService.endRquest();
            });
        }else{
            this.useQuotation = false;
            this.form.controls['purchaseOrderProviderId'].setValue(null);
            
            

        }

    }
 
   private save(){
        let order = {};

        Object.keys(this.form.value).forEach(element => {
            if( element == "purchaseOrderQuotationPurchaseId"){
                if(this.form.value[element] != null)
                    order[element] = (this.form.value[element]).toString();
            }else {
                order[element] = this.form.value[element];
            }
        });
        order['purchaseOrderProviderId']  = (order['purchaseOrderProviderId']).toString();   
    
        this.purchaseOrderService.update(order)
        .subscribe(data =>{
            
            const actions = [];

            // ------------ productos ------------
        
            //-update/crate
            this.form.controls['purchaseOrderProducts'].value.forEach(element => {              
                element['purchaseOrderProductProductId'] =  (element['purchaseOrderProductProductId']).toString();
                element['purchaseOrderProductPurchaseOrderId']  = (this.form.value['id']).toString();            
                if(element['id'] == null)
                {
                    // create                        
                    const create = this.purchaseOrderProductService.create(element)
                    .pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear nuevo producto", detail:error.message });
                            return of(null);
                        })
                    );		

                actions.push(create);
                }else{
                    // update
                    //element['id'] = element['id']; 
                    const update = this.purchaseOrderProductService.update(element)
                    .pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar producto existente", detail:error.message });
                            return of(null);
                        })
                    );		

                actions.push(update);

                }
            });
            //-Disable ("delete")
            this.deletedProducts.forEach(id => {
                // update
                const disabled = this.purchaseOrderProductService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar servicio existente", detail:error.message });
                        return of(null);
                    })
                );	
                actions.push(disabled);	
                
            });

            // ------------ servicios ------------

            //-update/crate
            this.form.controls['purchaseOrderServices'].value.forEach(element => {              
                element['purchaseOrderServiceServiceId'] =  (element['purchaseOrderServiceServiceId']).toString();
                element['purchaseOrderServicePurchaseOrderId']  = (this.form.value['id']).toString();            
                if(element['id'] == null)
                {
                    // create                        
                    const create = this.purchaseOrderServiceService.create(element)
                    .pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear nuevo servicio", detail:error.message });
                            return of(null);
                        })
                    );		

                actions.push(create);
                }else{
                    // update
                    //element['id'] = element['id'];                   

                    const update = this.purchaseOrderServiceService.update(element)
                    .pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar servicio existente", detail:error.message });
                            return of(null);
                        })
                    );		

                actions.push(update);

                }
            });
            //-Disable ("delete")
            this.deletedServices.forEach(id => {
                // update
                const disabled = this.purchaseOrderServiceService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar servicio existente", detail:error.message });
                        return of(null);
                    })
                );	
                actions.push(disabled);	
                
            });
            

            forkJoin(actions).subscribe(([] :any)=>
            {
                this.miscService.endRquest();
                this.router.navigate(['/orders']);
            },
            (err:any)=>{
                this.miscService.endRquest();
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar detalles", detail:err.message });
            });
                    
        },(err :any)=> {
            this.miscService.endRquest();
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:err.message, life: 3000 });
        });
    }
    getLabel(id:number,type:string){
        let text = '';
 
        if(id != null ){
 
             switch (type) {
                 case 'product':
                     text = (this.listProducts.find((obj) => obj.value ==  id)).label;
                     break;
                 case 'service':
                     text = (this.listServices.find((obj) => obj.value ==  id)).label;
                     break;

             }
        }
 
        
 
        return  text;
    }
    getInfo(){

        this.miscService.startRequest();
      
        
        const quotations = this.quotationPurchaseService.getList(1)
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de cotizaciones", detail:error.message });
				return of(null); 
			})
		);

        const providers = this.providerService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de proveedores", detail:error.message });
                return of(null); 
            })
        );
        const quotationInfo = this.purchaseOrderService.getById(this.id).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información de orden de compra", detail:error.message });
                return of(null);
            })
        );	

        forkJoin([providers,quotations,quotationInfo]).subscribe(   ([dataProviders, dataQuotations,dataInfo] )=>
        {
            if(dataQuotations != null && dataQuotations['object'].length > 0){
                dataQuotations['object'].forEach(element => {
                    this.listQuotations.push({'id':element['quotation_purchase_id'],'description':element['quotation_purchase_description']});
                });
            }else{
                this.messageService.add({ severity: 'warn',key: 'msg', summary: 'Adevertencia', detail: 'No existen otras cotizaciones aceptadas disponibles para relacionar', life: 4000 });

            }

            if(dataProviders != null)
                this.listProviders = dataProviders['object']['records']; 


            if(dataInfo != null){
               
                
                //Traer servicios y productos del proveedor de la orden
                if(dataInfo['purchaseOrderQuotationPurchaseId'] != null)
                    this.listQuotations.push({'id': dataInfo['purchaseOrderQuotationPurchaseId']['id'],'description':dataInfo['purchaseOrderQuotationPurchaseId']['quotationPurchaseDescription']}); 
                
               this.getItemsPurchase(dataInfo);

                

            }          

        
            //console.log(dataInfo);
            this.miscService.endRquest();
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
            this.miscService.endRquest();
        });

       
                
    }

    getItemsQuotation(dataInfo : QuotationPurchase){
        //1. Hacer una peticion para traer los productos/servicios de un proveedor
        const products = this.providerProductService.getFilter('[{"value":"'+dataInfo['quotationPurchaseProviderId']+'","matchMode":"equals","field":"providerProductProviderId"}]',0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
                return of(null); 
            })
        );
        
        const services =this.providerServiceService.getFilter('[{"value":"'+dataInfo['quotationPurchaseProviderId']+'","matchMode":"equals","field":"providerServiceProviderId"}]',0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar  servicios", detail:error.message });
                return of(null); 
            })
        );  
        forkJoin([products,services]).subscribe(([dataProducts,dataServices] )=>
        {
           
            if(dataProducts != null )
            {                    
                dataProducts['object']['records'].forEach(element => {
                    this.listProducts.push({'label':element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel'],'value':element['providerProductProductId']['id'],description:element['providerProductProductId']['productDescription'],labelFilter:element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel']+" "+element['providerProductProductId']['productDescription']});
                });
            }
            //console.log('getItemsQuotation');
            //console.log(this.listProducts);
            if(dataServices != null)
            {
                dataServices['object']['records'].forEach(element => {
                    this.listServices.push({'label': element['providerServiceServiceId']['serviceDescription'],'value': element['providerServiceServiceId']['id']});
                });
            }

            

            //Asigna valores

            this.form.controls['purchaseOrderQuotationPurchaseId'].setValue(dataInfo['id']);
            this.form.controls['purchaseOrderGuaranty'].setValue(dataInfo['quotationPurchaseGuaranty']);
            this.form.controls['purchaseOrderProviderId'].setValue(dataInfo['quotationPurchaseProviderId']);

            for (let i=0; i < dataInfo['quotationPurchaseProducts'].length; i++){
                
                this.addRow('product');
                     
             }

             for (let i=0; i < dataInfo['quotationPurchaseServices'].length; i++){
                
                this.addRow('service');
                     
             }

        
            for (let i=0; i < dataInfo['quotationPurchaseProducts'].length; i++){          
                let row = dataInfo['quotationPurchaseProducts'][i]; 

                this.form.controls['purchaseOrderProducts'].controls[i].controls['purchaseOrderProductProductId'].setValue(row['quotationPurchaseProductProductId']);
                this.form.controls['purchaseOrderProducts'].controls[i].controls['purchaseOrderProductUnit'].setValue(row['quotationPurchaseProductUnit']);      
                this.form.controls['purchaseOrderProducts'].controls[i].controls['purchaseOrderProductQuantity'].setValue(row['quotationPurchaseProductQuantity']);
                this.form.controls['purchaseOrderProducts'].controls[i].controls['purchaseOrderProductPrice'].setValue(row['quotationPurchaseProductPrice']);      
 
        
            }
            for (let i=0; i < dataInfo['quotationPurchaseServices'].length; i++){          
                let row = dataInfo['quotationPurchaseServices'][i];

                this.form.controls['purchaseOrderServices'].controls[i].controls['purchaseOrderServiceServiceId'].setValue(row['quotationPurchaseServiceServiceId']);
                this.form.controls['purchaseOrderServices'].controls[i].controls['purchaseOrderServiceUnit'].setValue(row['quotationPurchaseServiceUnit']);      
                this.form.controls['purchaseOrderServices'].controls[i].controls['purchaseOrderServiceQuantity'].setValue(row['quotationPurchaseServiceQuantity']);    
                this.form.controls['purchaseOrderServices'].controls[i].controls['purchaseOrderServicePrice'].setValue(row['quotationPurchaseServicePrice']);     
        
            }
 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
            this.miscService.endRquest();
        });
   }
   getItemsPurchase(dataInfo : PurchaseOrder){
    //console.log(dataInfo);
    //1. Hacer una peticion para traer los productos/servicios de un proveedor
    const products = this.providerProductService.getFilter('[{"value":"'+dataInfo['purchaseOrderProviderId']['id']+'","matchMode":"equals","field":"providerProductProviderId"}]',0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
            return of(null); 
        })
    );
    
    const services =this.providerServiceService.getFilter('[{"value":"'+dataInfo['purchaseOrderProviderId']['id']+'","matchMode":"equals","field":"providerServiceProviderId"}]',0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar  servicios", detail:error.message });
            return of(null); 
        })
    );  
    forkJoin([products,services]).subscribe(async ([dataProducts,dataServices] )=>
    {
       
        if(dataProducts != null )
        {                    
            dataProducts['object']['records'].forEach(element => {
                this.listProducts.push({'label':element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel'],'value':element['providerProductProductId']['id'],description:element['providerProductProductId']['productDescription'],labelFilter:element['providerProductProductId']['productBrand']+" "+ element['providerProductProductId']['productModel']+" "+element['providerProductProductId']['productDescription']});

            });
        }
        if(dataServices != null)
        {
            dataServices['object']['records'].forEach(element => {
                this.listServices.push({'label': element['providerServiceServiceId']['serviceDescription'],'value': element['providerServiceServiceId']['id']});
            });
        }


        //Asigna valores
       
        if(dataInfo['purchaseOrderQuotationPurchaseId'] > 0 || dataInfo['purchaseOrderQuotationPurchaseId'] != null){ 

            this.useQuotation = true;   
            this.form.controls['purchaseOrderQuotationPurchaseId'].setValue(dataInfo['purchaseOrderQuotationPurchaseId']);  
        }

       

        for (let i=0; i < dataInfo['purchaseOrderProducts'].length; i++){
            
            this.addRow('product');
           
        }

        for (let i=0; i < dataInfo['purchaseOrderServices'].length; i++){
            
            this.addRow('service');
        }

       
      
        
        for (let i=0; i < dataInfo['purchaseOrderProducts'].length; i++){          
            dataInfo['purchaseOrderProducts'][i]['purchaseOrderProductProductId']  = dataInfo['purchaseOrderProducts'][i]['purchaseOrderProductProductId']['id'];
    
        }
        for (let i=0; i < dataInfo['purchaseOrderServices'].length; i++){          
            dataInfo['purchaseOrderServices'][i]['purchaseOrderServiceServiceId'] =  dataInfo['purchaseOrderServices'][i]['purchaseOrderServiceServiceId']['id'];     
    
        }
        dataInfo['purchaseOrderProviderId'] =  dataInfo['purchaseOrderProviderId']['id'];
        if(dataInfo['purchaseOrderQuotationPurchaseId'] != null)
            dataInfo['purchaseOrderQuotationPurchaseId'] = dataInfo['purchaseOrderQuotationPurchaseId']['id'];

        await this.form.patchValue(dataInfo);
        

    },

    (err:any)=>
    {
        this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
        this.miscService.endRquest();
    });
}


   
}

