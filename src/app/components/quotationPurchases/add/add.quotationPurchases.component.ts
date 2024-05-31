import { Component, Input } from '@angular/core';
import { Provider } from 'src/app/api/provider';
import { Product } from 'src/app/api/product';
import { Service} from 'src/app/api/service';
import { ProductService } from 'src/app/service/product.service';
import { ServiceService } from 'src/app/service/service.service';
import { QuotationPurchaseService } from 'src/app/service/quotationPurchase.service';
import { QuotationPurchaseProductService } from 'src/app/service/quotationPurchaseProduct.service';
import { QuotationPurchaseServiceService } from 'src/app/service/quotationPurchaseService.service';
import { ProviderService } from 'src/app/service/provider.service';
import { MiscService } from 'src/app/service/misc.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService } from 'src/app/service/providerService.service';


@Component({
  templateUrl: './add.quotationPurchases.component.html',

})
export class AddQuotationPurchasesComponent  {
    form: FormGroup | any;
    listUnitProducts: any[] = [];
    listUnitServices: any[] = [];
    listProviders: Provider[] = [];
    listProducts: any[] = [] ;
    listServices: any[] = [] ;

    constructor(    
        private formBuilder: FormBuilder,
        private quotationPurchaseProductService: QuotationPurchaseProductService,
        private quotationPurchaseServiceService: QuotationPurchaseServiceService,
        private quotationPurchaseService: QuotationPurchaseService ,       
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
            quotationPurchaseProviderId: [null,[Validators.required]], 
            quotationPurchaseDescription: [null,[Validators.required]], 
            quotationPurchaseProducts: this.formBuilder.array([],[this.isProductDuplicated]), 
            quotationPurchaseServices: this.formBuilder.array([],[this.isServiceDuplicated]),
         }, formOptions);

        this.form.get("quotationPurchaseProviderId").valueChanges.subscribe(selectedValue => {
           this.getFilter(selectedValue);
           
        });


        this.listUnitProducts = [
            { label: 'Pieza', value:'pieza'},
            { label: 'Caja', value: 'caja'},
            { label: 'Paquete',value: 'paquete',type:'producto'}
            
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
            return;
        }

        this.miscService.startRequest();
        this.save();
        
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/quotationPurchases']);
    }
    
    newProductsArray() {
        return this.formBuilder.group({
            quotationPurchaseProductProductId: [null,[Validators.required]],
            quotationPurchaseProductUnit:[null,[Validators.required]],
            quotationPurchaseProductQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]], 
        });
    }
    newServicesArray() {
        return this.formBuilder.group({
            quotationPurchaseServiceServiceId:[null,[Validators.required]],
            quotationPurchaseServiceUnit: [null,[Validators.required]],
            quotationPurchaseServiceQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(99999999)]],  //[min]="1" [max]="99999999"
        });
    }

    infoProductsArray(): FormArray {
        return this.form.get('quotationPurchaseProducts') as FormArray;
    }
    infoServicesArray(): FormArray {
        return this.form.get('quotationPurchaseServices') as FormArray;
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

            const obj = item.value.quotationPurchaseProductProductId
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

            const obj = item.value. quotationPurchaseServiceServiceId
            if (uniqueValues.has(obj)) 
			{
			  return { duplicated: true }; 
            }          
            
			uniqueValues.add(obj);
		}
        

		return null; 
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
            this.listProducts = [];           
            this.listServices = [];
            this.form.controls.quotationPurchaseProducts.clear();
            this.form.controls.quotationPurchaseServices.clear();
            
        }
    }

    list(){

        this.providerService.getAll(0,1,'[{"id":"asc"}]').subscribe(res =>{                
            
            if(res != null)
                this.listProviders = res['object']['records'];

            this.miscService.endRquest(); 
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al traer información de cotización', detail: err.message, life: 3000 });
            this.miscService.endRquest();
        });   
            
    }
    private save(){

        let order = {};
        
        order['quotationPurchaseProviderId']= this.form.value['quotationPurchaseProviderId'];
        order['quotationPurchaseDescription']= this.form.value['quotationPurchaseDescription'];
        
        this.quotationPurchaseService.create(order)
        .subscribe(data =>{
            const actions = [];

            if( this.form.value['quotationPurchaseProducts'].length > 0 || this.form.value['quotationPurchaseServices'].length > 0 ){
                this.form.value['quotationPurchaseProducts'].forEach(obj => {
                    obj['quotationPurchaseProductQuotationPurchaseId'] = (data['newId']).toString();
                    obj['quotationPurchaseProductProductId'] = ( obj['quotationPurchaseProductProductId']).toString();

                    const ptt = this.quotationPurchaseProductService.create(obj).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al agregar producto", detail:error.message });
                            return of(null);
                        })
                    );		
                    actions.push(ptt);
                });
                this.form.value['quotationPurchaseServices'].forEach(obj => {
                    obj['quotationPurchaseServiceQuotationPurchaseId'] = (data['newId']).toString();
                    obj['quotationPurchaseServiceServiceId'] = (obj['quotationPurchaseServiceServiceId']).toString();
                
                const ptt = this.quotationPurchaseServiceService.create(obj).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al agregar servicio", detail:error.message });
                            return of(null);
                        })
                    );		
                    actions.push(ptt);
                });
        
                forkJoin(actions).subscribe(([] :any)=>
                {
                    this.miscService.endRquest();
                    this.router.navigate(['/quotationPurchases']);
                },
                (err:any)=>{
                    this.miscService.endRquest();
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar detalles", detail:err.message });
                });
            }else{
                this.miscService.endRquest();
                this.router.navigate(['/quotationPurchases']);
                
            }
                  
        },(err :any)=> {
            this.miscService.endRquest();
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:err.message, life: 3000 });
        });
    }
    
}
