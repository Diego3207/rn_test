import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PackageService } from 'src/app/service/package.service';
import { PackageProductService } from 'src/app/service/packageProduct.service';
import { PackageServiceService} from 'src/app/service/packageService.service';
import { ServiceService } from 'src/app/service/service.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';




@Component({
    templateUrl: './edit.packages.component.html'
})
export class EditPackageComponent implements OnInit, OnDestroy {
    //provider: Provider ;
    //submitted: boolean = false;
    id:number;
    form: FormGroup | any;    
    listServices: any[] = [];
    listProducts: any[] = [];
    deletedContacts = [];
    deletedLocations = [];
    deletedProducts = [];
    deletedServices = [];


   
    constructor(
        private formBuilder: FormBuilder,
        private miscService:MiscService,
        private packageService: PackageService, 
        private packageProductService: PackageProductService,
        private packageServiceService: PackageServiceService,
        private productService: ProductService,
        private serviceService: ServiceService,
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
            packageName: [null,[Validators.required,Validators.maxLength(255)]],
            packageProducts: this.formBuilder.array([],[this.isProductDuplicated]),
            packageServices: this.formBuilder.array([],[this.isServiceDuplicated]),

         }, formOptions);

         this.getData();
		
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{

      //  this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/packages']);
    }
    newProductsArray() {
        return this.formBuilder.group({
            id:null,
            packageProductProductId:  [null,Validators.required],
            packageProductPackageId:null,
            packageProductQuantity:[null,[Validators.required ,Validators.min(1), Validators.max(999999999999)]]
        });
    }
    newServicesArray() {
        return this.formBuilder.group({
            id:null,
            packageServiceServiceId: [null,Validators.required],
            packageServicePackageId: null,
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
    removeRow(type,object,index:number){
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

        this.packageService.update(packageInfo)
        .subscribe(data =>{

            const actions = [];
            // -------- productos --------
            //-update/create
            this.form.value['packageProducts'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['packageProductPackageId'] = (this.form.value['id']).toString();
                    element['packageProductProductId'] = ( element['packageProductProductId']).toString();

                    const ptt = this.packageProductService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo producto ", detail:error.message });
                            return of(null);
                        })
                    );
                   actions.push(ptt);
                }else{
                    // update
                    element['packageProductPackageId'] = (element['packageProductPackageId']).toString();
                    element['packageProductProductId'] = (element['packageProductProductId']).toString();


                    const ptt = this.packageProductService.update(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar producto existente", detail:error.message });
                            return of(null);
                        })
                    );		

                   actions.push(ptt);

                }
            });
            //-Disable ("delete")
            this.deletedProducts.forEach(id => {
                // update
                const ptt = this.packageProductService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar producto existente", detail:error.message });
                        return of(null);
                    })
                );		
                actions.push(ptt);
            });
               // -------- servicios --------
            //-update/create
            this.form.value['packageServices'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['packageServicePackageId'] = (this.form.value['id']).toString();
                    element['packageServiceServiceId'] = ( element['packageServiceServiceId']).toString();

                    const ptt = this.packageServiceService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo producto ", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
                    element['packageServicePackageId'] = (element['packageServicePackageId']).toString();
                    element['packageServiceServiceId'] = (element['packageServiceServiceId']).toString();


                    const ptt = this.packageServiceService.update(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar producto existente", detail:error.message });
                            return of(null);
                        })
                    );		

                   actions.push(ptt);

                }
            });
            //-Disable ("delete")
            this.deletedServices.forEach(id => {
                // update
                const ptt = this.packageServiceService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar producto existente", detail:error.message });
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
            
           
            

        },  (err : any) => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });  
        
        });
   }
    getData(){

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
                    let temporality = (element['serviceTemporality'] != '' ? " / Temporalidad: "+element['serviceTemporality'] :'');
                    this.listServices.push({'label': element['serviceDescription'] +temporality,'value': element['id']});
                });
            }

            this.packageService.getById(this.id)
            .subscribe(async data => {
                //agregar filas en la tabla
                 
                for (let i=0; i < data['packageProducts'].length; i++){
                    this.addRow('product');
                }   
                for (let i=0; i < data['packageServices'].length; i++){
                    this.addRow('service');
                }

                await this.form.patchValue(data);
            },

            (err:any)=>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
                this.miscService.endRquest();
            });

            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }
}