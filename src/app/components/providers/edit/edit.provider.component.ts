import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, NgZone, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProviderService } from 'src/app/service/provider.service';
import { ProviderContactService } from 'src/app/service/providerContact.service';
import { ProviderLocationService} from 'src/app/service/providerLocation.service';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService} from 'src/app/service/providerService.service';
import { ServiceService } from 'src/app/service/service.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

/*interface Giro {
    name: string;
    code: string;
  }*/


@Component({
    templateUrl: './edit.provider.component.html'
})
export class EditProviderComponent implements OnInit, OnDestroy {
    @ViewChildren('search') searchElementRef!: QueryList<ElementRef>;
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
    items: any[] = [];
    unitMeasures: any[] =  [];
   
    constructor(
        private formBuilder: FormBuilder,
        private miscService:MiscService,
        private providerService: ProviderService, 
        private providerContactService: ProviderContactService,
        private providerLocationService: ProviderLocationService,
        private providerProductService: ProviderProductService,
        private providerServiceService: ProviderServiceService,
        private productService: ProductService,
        private serviceService: ServiceService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private router: Router ) 
    {
    }

    ngAfterViewInit(): void {
        this.searchElementRef.changes.subscribe(inputs => {
          // Detecta cuando se agregan nuevos elementos al FormArray

          inputs.forEach((input,index) => {
            // Aquí puedes realizar cualquier acción que desees para los nuevos elementos creados.
            
            // Binding autocomplete to search input control
            let autocomplete = new google.maps.places.Autocomplete(
                input.nativeElement
            );
        
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        
                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                this.form.controls.providerLocations.controls[index].controls.providerLocationAddress.setValue(place.formatted_address);
                });
            }); 

          });
        });
    }   

    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; 

        this.id = parseInt(this.route.snapshot.params['idx']);

		this.form = this.formBuilder.group
		({
            id:[this.id, [Validators.required]],
            providerName:  [null,[Validators.required,Validators.maxLength(100)]],
            providerNationality:[null, [Validators.required,Validators.maxLength(55)]],
            providerLine: [null, [Validators.required,Validators.maxLength(255)]],
            providerProducts: this.formBuilder.array([],[this.isProductDuplicated]),
            providerServices: this.formBuilder.array([],[this.isServiceDuplicated]),
            providerContacts: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
            providerLocations: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
         }, formOptions);

         this.getData();

         this.items = [
            { name: 'Agricultura, cría y explotación de animales, aprovechamiento forestal, pesca y caza'},
            { name: 'Minería' },
            { name: 'Generación, transmisión, distribución y comercialización de energía eléctrica, agua y gas' },
            { name: 'Construcción'},
            { name: 'Industrias manufactureras' },
            { name: 'Comercio/Venta al por mayor' },
            { name: 'Comercio/Venta al por menor' },
            { name: 'Transportes, correos y almacenamiento'},
            { name: 'Información en medios masivos'},
            { name: 'Servicios financieros y de seguros' },
            { name: 'Servicios inmobiliarios y de alquiler de bienes muebles e intangibles' },
            { name: 'Servicios profesionales, científicos y tecnológicos' },
            { name: 'Dirección y administración de grupos empresariales o corporativos' },
            { name: 'Servicios educativos'},
            { name: 'Servicios de apoyo a los negocios y manejo de residuos, y servicios de remediación'},
            { name: 'Servicios de salud y de asistencia social'},
            { name: 'Servicios de esparcimiento culturales y deportivos, y otros servicios recreativos' },
            { name: 'Servicios de alojamiento temporal y de preparación de alimentos y bebidas'},
            { name: 'Otros servicios excepto actividades gubernamentales'},
            { name: 'Actividades legislativas, gubernamentales, de impartición de justicia' },
        ];

        this.unitMeasures = [
            { name: 'Día(s)', value:"dia"},
            { name: 'Mes(es)', value:"mes"},
            { name: 'Año(s)', value:"año"},
        ];
		
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{


        if (this.form.invalid) {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });
            return;
        }

        this.save();
    }
    cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/providers']);
	}
    newContactsArray() {
        return this.formBuilder.group({
            id:null,
            providerContactProviderId: null, 
            providerContactDescription:  [null,[Validators.required,Validators.maxLength(100)]],
            providerContactPhone:  [null,[Validators.required,Validators.maxLength(15)]],
            providerContactEmail:  [null,[ Validators.required,Validators.email]]//Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        });
    }

    newLocationsArray() {
        return this.formBuilder.group({
            id:null,
            providerLocationProviderId: null, 
            providerLocationDescription:  [null, [Validators.required,Validators.maxLength(100)]],
            providerLocationAddress:   [null, [Validators.required,Validators.maxLength(255)]],
        });
    }
    newProductsArray() {
        return this.formBuilder.group({
            id:null,
            providerProductProductId:  [null,Validators.required],
            providerProductProviderId:null,
            providerProductGuaranteeUnit: [null,[Validators.required ,Validators.min(1), Validators.max(365)]],
            providerProductGuaranteeUnitMeasure: [null, [Validators.required,]],
            providerProductGuaranteeSpecifications:'', 
        });
    }
    newServicesArray() {
        return this.formBuilder.group({
            id:null,
            providerServiceServiceId: [null,Validators.required],
            providerServiceProviderId: null,
            providerServiceGuaranteeUnit: [null,[Validators.required ,Validators.min(1), Validators.max(365)]],
            providerServiceGuaranteeUnitMeasure: [null, [Validators.required,]],
            providerServiceGuaranteeSpecifications: '', 
        });
    }
    
    infoContactsArray(): FormArray {
        return this.form.get('providerContacts') as FormArray;
    }
    
    infoLocationsArray(): FormArray {
        return this.form.get('providerLocations') as FormArray;
    }
    infoProductsArray(): FormArray {
        return this.form.get('providerProducts') as FormArray;
    }

    infoServicesArray(): FormArray {
        return this.form.get('providerServices') as FormArray;
    }
    
    addRow(type){
        switch (type) {
            case 'contact':
                this.infoContactsArray().push(this.newContactsArray());   
                break;
            case 'location':
                this.infoLocationsArray().push(this.newLocationsArray()); 
                break;
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
            case 'contact':
                this.infoContactsArray().removeAt(index); 
                if(object.value.id !== null)
                    this.deletedContacts.push(object.value.id);
                break;
            case 'location':                
                this.infoLocationsArray().removeAt(index); 
                if(object.value.id !== null)
                    this.deletedLocations.push(object.value.id);
                break;
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
    
        const obj = item.value.providerProductProductId
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
    
        const obj = item.value.providerServiceServiceId
            if (uniqueValues.has(obj)) 
            {
                return { duplicated: true }; 
            }          
               
            uniqueValues.add(obj);
        }
            
    
        return null; //en este punto no hay error, se regresa null	
    }
    private save(){

        let provider = {};
        Object.keys(this.form.value).forEach(element => {
           
            if(element != "providerContacts" && element != "providerLocations" && element != "providerProducts" && element != "providerServices")
            provider[element] = this.form.value[element];
           
        });

        this.providerService.update(provider)
        .subscribe(data =>{

            const actions = [];
            // -------- Contactos --------
            //-update/create
            this.form.value['providerContacts'].forEach(element => {
                
                if(element['id'] == null)
                {
                    // create
                    element['providerContactProviderId'] = (this.form.value['id']).toString();
                    element['providerContactPhone'] = (element['providerContactPhone']).replaceAll("-", "");
                    const ptt = this.providerContactService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento nuevo contacto", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
                    element['providerContactProviderId'] = (element['providerContactProviderId']).toString();
                    element['providerContactPhone'] = (element['providerContactPhone']).replaceAll("-", "");

                    const ptt = this.providerContactService.update(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar contacto existente", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);

                }
            });
            //-Disable ("delete")
            this.deletedContacts.forEach(id => {
                // update

                const ptt = this.providerContactService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente", detail:error.message });
                        return of(null);
                    })
                );		

               actions.push(ptt);
                
            });
            // -------- Direcciones --------
            //-update/create
            this.form.value['providerLocations'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['providerLocationProviderId'] = (this.form.value['id']).toString();

                    const ptt = this.providerLocationService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nueva direccion ", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
                    element['providerLocationProviderId'] = (element['providerLocationProviderId']).toString();


                    const ptt = this.providerLocationService.update(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar direccion existente", detail:error.message });
                            return of(null);
                        })
                    );		

                   actions.push(ptt);

                }
            });
            //-Disable ("delete")
            this.deletedLocations.forEach(id => {
                // update
                const ptt = this.providerLocationService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar direccion existente", detail:error.message });
                        return of(null);
                    })
                );		
                
            });
            // -------- productos --------
            //-update/create
            this.form.value['providerProducts'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['providerProductProviderId'] = (this.form.value['id']).toString();
                    element['providerProductProductId'] = ( element['providerProductProductId']).toString();

                    const ptt = this.providerProductService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo producto ", detail:error.message });
                            return of(null);
                        })
                    );
                   actions.push(ptt);
                }else{
                    // update
                    element['providerProductProviderId'] = (element['providerProductProviderId']).toString();
                    element['providerProductProductId'] = (element['providerProductProductId']).toString();


                    const ptt = this.providerProductService.update(element).pipe(
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
                const ptt = this.providerProductService.disable(id).pipe(
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
            this.form.value['providerServices'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['providerServiceProviderId'] = (this.form.value['id']).toString();
                    element['providerServiceServiceId'] = ( element['providerServiceServiceId']).toString();

                    const ptt = this.providerServiceService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo producto ", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
                    element['providerServiceProviderId'] = (element['providerServiceProviderId']).toString();
                    element['providerServiceServiceId'] = (element['providerServiceServiceId']).toString();


                    const ptt = this.providerServiceService.update(element).pipe(
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
                const ptt = this.providerServiceService.disable(id).pipe(
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
                this.router.navigate(['/providers']);
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
                    this.listServices.push({'label':element['serviceDescription'],'value': element['id']});
                });
            }

            this.providerService.getById(this.id)
            .subscribe(async data => {
                //agregar filas en la tabla
                for (let i=0; i < data['providerContacts'].length; i++){
                    this.addRow('contact');
                }
                for (let i=0; i < data['providerLocations'].length; i++){
                    this.addRow('location');
                }   
                for (let i=0; i < data['providerProducts'].length; i++){
                    this.addRow('product');
                }   
                for (let i=0; i < data['providerServices'].length; i++){
                    this.addRow('service');
                }

                await this.form.patchValue(data); // this.form.patchValue(data);
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
