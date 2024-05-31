import { Component } from '@angular/core';
import { PackageService } from 'src/app/service/package.service';
import { PackageProductService } from 'src/app/service/packageProduct.service';
import { PackageServiceService} from 'src/app/service/packageService.service';
import { ServiceService } from 'src/app/service/service.service';
import { ProductService } from 'src/app/service/product.service';

import { Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

@Component({
    templateUrl: './add.packages.component.html'
})
export class AddPackageComponent  {
    form: FormGroup | any;
    listServices: any[] = [];
    listProducts: any[] = [];

    constructor(    
        private formBuilder: FormBuilder,
        private packageService: PackageService,
        private packageProductService: PackageProductService,
        private packageServiceService: PackageServiceService,
        private productService: ProductService,
        private serviceService: ServiceService,
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
            packageName: [null,[Validators.required,Validators.maxLength(255)]],
            packageProducts: this.formBuilder.array([],[this.isProductDuplicated]),
            packageServices: this.formBuilder.array([],[this.isServiceDuplicated]),
         }, formOptions);

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
        this.router.navigate(['/packages']);
    }
    
    
     newProductsArray() {
        return this.formBuilder.group({
            packageProductProductId:  [null,Validators.required],
            packageProductQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(999999999999)]]
        });
    }
    newServicesArray() {
        return this.formBuilder.group({
            packageServiceServiceId:  [null,Validators.required],
            packageServiceQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(999999999999)]]
        });
    }
    
    infoProductsArray(): FormArray {
        return this.form.get('packageProducts') as FormArray;
    }
    infoServicesArray(): FormArray {
        return this.form.get('packageServices') as FormArray;
    }
    
    addRow(type){
        switch (type) {
            case 'product':
                this.infoProductsArray().push(this.newProductsArray()); 
                break;
            case 'service':
                this.infoServicesArray().push(this.newServicesArray()); 
                break;
        }
             
    }
    removeRow(type,index:number){
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
    
        const obj = item.value.packageProductProductId
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
    
        const obj = item.value.packageServiceServiceId
            if (uniqueValues.has(obj)) 
            {
                return { duplicated: true }; 
            }          
               
            uniqueValues.add(obj);
        }
            
    
        return null; //en este punto no hay error, se regresa null	
    }
    private save(){
        let packageInfo = {};

        Object.keys(this.form.value).forEach(element => {
           if(element != "packageProducts" && element != "packageServices")
                packageInfo[element] = this.form.value[element];
            
        });
        if( this.form.value['packageProducts'].length > 0 ||  this.form.value['packageServices'].length > 0){
       
            this.packageService.create(packageInfo)
            .subscribe(data =>{
                const actions = [];
                
                this.form.value['packageProducts'].forEach(product => {
                    product['packageProductPackageId'] = (data['newId']).toString();
                    product['packageProductProductId'] = (product['packageProductProductId']).toString();
                    const ptt = this.packageProductService.create(product).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar productos", detail:error.message });
                            return of(null);
                        })
                    );				

                    actions.push(ptt); 
                });
                
                this.form.value['packageServices'].forEach(service => {
                    
                    service['packageServicePackageId'] = (data['newId']).toString();
                    service['packageServiceServiceId'] = (service['packageServiceServiceId']).toString();
                    const ptt = this.packageServiceService.create(service).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar servicio", detail:error.message });
                            return of(null);
                        })
                    );				

                    actions.push(ptt); 
                });
            
                forkJoin(actions).subscribe(([] :any)=>
                {
                this.router.navigate(['/packages']);
                    this.miscService.endRquest();  

                }, 
                (err : any)=>{
                    this.miscService.endRquest(); //fin del proceso por error
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al elementos múltiples ", detail:err.message });
                

                });

                    
            },  (err : any)=> {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
                this.miscService.endRquest(); 
            });
        }else{
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'warn', summary: "Error cantidad minima de un producto o un servicio "});
        

        }
    }
    list(){

        this.miscService.startRequest();

        
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
        
             
        forkJoin([products,services]).subscribe(([dataProducts,dataServices] )=>
        {
            if(dataProducts != null )
            {                    
               dataProducts['object']['records'].forEach(element => {
                    this.listProducts.push({'label': element['productBrand']+" "+ element['productModel'],'value': element['id']});
                });
            }
            if(dataServices != null)
            {
                dataServices['object']['records'].forEach(element => {
                  //  this.listServices.push({'label':element['serviceDescription'],'value': element['id']});
                    let temporality = (element['serviceTemporality'] != '' ? " / Temporalidad: "+element['serviceTemporality'] :'');
                    this.listServices.push({'label': element['serviceDescription'] +temporality,'value': element['id']});
                
                });
            }

           

            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }
}
