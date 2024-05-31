import { Component, Input } from '@angular/core';
import { Provider } from 'src/app/api/provider';
import { ProductService } from 'src/app/service/product.service';
import { ServiceService } from 'src/app/service/service.service';
import { PurchaseOrderService } from 'src/app/service/purchaseOrder.service';
import { QuotationPurchaseService } from 'src/app/service/quotationPurchase.service';
import { PurchaseOrderProductService } from 'src/app/service/purchaseOrderProduct.service';
import { PurchaseOrderServiceService } from 'src/app/service/purchaseOrderService.service';
import { ProviderService } from 'src/app/service/provider.service';
import { MiscService } from 'src/app/service/misc.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService} from 'src/app/service/providerService.service';
import { QuotationPurchase } from 'src/app/api/quotationPurchase';

@Component({
  templateUrl: './add.purchaseOrders.component.html',

})
export class AddPurchaseOrdersComponent  {
    form: FormGroup | any;
   // listUnit: any[] = [];
    listType : any[] = [];
    infoQuotation: boolean = false;
    listQuotations: any[] = [];
    listProviders: Provider[] = [];
    disabledQuotation: boolean = false;
    disbledProvider: boolean = false;

    listUnitProducts: any[] = [];
    listUnitServices: any[] = [];
    listProducts: any[] = [] ;
    listServices: any[] = [] ;

    

    constructor(    
        private formBuilder: FormBuilder,
        private purchaseOrderService: PurchaseOrderService,
        private purchaseOrderProductService: PurchaseOrderProductService ,
        private purchaseOrderServiceService: PurchaseOrderServiceService ,
        private quotationService: QuotationPurchaseService ,       
        private providerService: ProviderService ,
        private productService: ProductService ,
        private serviceService: ServiceService ,
        private providerProductService: ProviderProductService ,
        private providerServiceService: ProviderServiceService ,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private miscService:MiscService,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
       
		this.form = this.formBuilder.group
		({
            purchaseOrderDescription:[null,[Validators.required,Validators.maxLength(255)]],
            purchaseOrderQuotationPurchaseId:null,
            purchaseOrderGuaranty:false, 
            purchaseOrderProviderId: [null,[Validators.required]], 
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

        this.list();
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{

       if (this.form.invalid ) {
        //this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });

            return;
        }
        this.miscService.startRequest();
        this.save();
        
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/orders']);
    }
    
   
   
    newProductsArray() {
        return this.formBuilder.group({
            purchaseOrderProductProductId: [null,[Validators.required]],
            purchaseOrderProductUnit:[null,[Validators.required]],
            purchaseOrderProductQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]], 
            purchaseOrderProductPrice:[null,[Validators.required ,Validators.min(1)]],
        });

    }
    newServicesArray() {
        return this.formBuilder.group({
            purchaseOrderServiceServiceId:[null,[Validators.required]],
            purchaseOrderServiceUnit: [null,[Validators.required]],
            purchaseOrderServiceQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]],  //[min]="1" [max]="99999999"
            purchaseOrderServicePrice:[null,[Validators.required ,Validators.min(1)]],

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
    removeRow(type:string,index:number){
        switch (type) {
            case 'product':
                this.infoProductsArray().removeAt(index);
                break;
            case 'service':
                this.infoServicesArray().removeAt(index); 
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

    private save(){
        //console.log(this.form);
        let order = {};

        Object.keys(this.form.value).forEach(element => {
            if( element == "purchaseOrderQuotationPurchaseId"){
                if(this.form.value[element] != null)
                    order[element] = (this.form.value[element]).toString();
            }else {
                order[element] = this.form.value[element];
            }
        });
       
        this.purchaseOrderService.create(order)
        .subscribe(data =>{
            const actions = [];
            this.form.controls['purchaseOrderProducts'].value.forEach(obj => {                
                obj['purchaseOrderProductProductId'] =  (obj['purchaseOrderProductProductId']).toString();
                obj['purchaseOrderProductPurchaseOrderId'] = (data['newId']).toString();

               
               const ptt = this.purchaseOrderProductService.create(obj).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear nuevo producto", detail:error.message });
                        return of(null);
                    })
                );		
                actions.push(ptt);
            });
           
            this.form.controls['purchaseOrderServices'].value.forEach(obj => {               
                obj['purchaseOrderServiceServiceId'] =  (obj['purchaseOrderServiceServiceId']).toString();
                obj['purchaseOrderServicePurchaseOrderId'] = (data['newId']).toString();

                const ptt = this.purchaseOrderServiceService.create(obj).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear nuevo servicio", detail:error.message });
                        return of(null);
                    })
                );		
                actions.push(ptt);
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
  
    clear(){

        this.listProducts = [];           
        this.listServices = [];
        this.form.controls.purchaseOrderProducts.clear();
        this.form.controls.purchaseOrderServices.clear();

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
    getFilter(value){
        this.clear();
        

        if(value != null){
            this.miscService.startRequest(); 
            
          
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


        }
    }

    getInfoQuotation(value){
        
        this.clear();

        if(value != null ) {
            this.quotationService.getById(value).subscribe( (data:any )=>
            {            
                this.infoQuotation = true;
    
                //Traer servicios y productos del proveedor de la cotizacion
                this.getItems(data);      
                
            },
            (err : any) =>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al traer información de la cotizacion con #ID '+value , detail:err.message, life: 3000 });
                this.miscService.endRquest();
            });
        }else{
            this.infoQuotation = false;
            this.form.controls['purchaseOrderProviderId'].setValue(null);
            
        }
    }
    getItems(dataInfo : QuotationPurchase ){
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
    list(){

        this.miscService.startRequest();

        const quotations =this.quotationService.getList(1)
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de cotizaciones", detail:error.message });
				return of(null); 
			})
		);
        const providers =this.providerService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de productos", detail:error.message });
				return of(null); 
			})
		);
        const products = this.productService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de productos", detail:error.message });
				return of(null); 
			})
		);
        
        const services =this.serviceService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de servicios", detail:error.message });
				return of(null); 
			})
		);
        
             
        forkJoin([providers,quotations]).subscribe(([dataProviders,dataQuotations] )=>
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

            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error general al obtener los catalogos',detail: err.message, life: 3000 });
            this.miscService.endRquest();
        });
            
    }
}
