import { Component, ElementRef, ViewChildren, NgZone, QueryList} from '@angular/core';
import { ProviderService } from 'src/app/service/provider.service';
import { ProviderContactService } from 'src/app/service/providerContact.service';
import { ProviderLocationService} from 'src/app/service/providerLocation.service';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService} from 'src/app/service/providerService.service';
import { ServiceService } from 'src/app/service/service.service';
import { ProductService } from 'src/app/service/product.service';

import { Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

@Component({
    templateUrl: './add.provider.component.html'
})
export class AddProviderComponent  {
    @ViewChildren('search') searchElementRef!: QueryList<ElementRef>;
    form: FormGroup | any;
    listServices: any[] = [];
    listProducts: any[] = [];
    items: any[] =  [];
    unitMeasures: any[] =  [];

    constructor(    
        private formBuilder: FormBuilder,
        private providerService: ProviderService,
        private providerContactService: ProviderContactService,
        private providerLocationService: ProviderLocationService,
        private providerProductService: ProviderProductService,
        private providerServiceService: ProviderServiceService,
        private productService: ProductService,
        private serviceService: ServiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private miscService:MiscService,
        private ngZone: NgZone,
        private router: Router ) 
    {
    }

    ngAfterViewInit(): void {
        this.searchElementRef.changes.subscribe(inputs => {
          // Detecta cuando se agregan nuevos elementos al FormArray

          inputs.forEach((input,index) => {
            // Aquí puedes realizar cualquier acción que desees para los nuevos elementos creados.
            console.log(index);
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
        
                this.form.controls.providerLocations.controls[index].controls.providerLocationLat.setValue(place.geometry.location?.lat());
                this.form.controls.providerLocations.controls[index].controls.providerLocationLng.setValue(place.geometry.location?.lng());
                this.form.controls.providerLocations.controls[index].controls.providerLocationAddress.setValue(place.formatted_address);
                });
            }); 
            //console.log(this.form.controls.providerLocations);
          });
        });
    }    

    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
       
		this.form = this.formBuilder.group
		({
            providerName: [null,[Validators.required,Validators.maxLength(100)]],
            providerNationality: [null, [Validators.required,Validators.maxLength(55)]],
            providerLine: [null,[Validators.required,Validators.maxLength(255)]],
            providerProducts: this.formBuilder.array([],[this.isProductDuplicated]),
            providerServices: this.formBuilder.array([],[this.isServiceDuplicated]),
            providerContacts: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
            providerLocations: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
         }, formOptions);
         this.list();

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
        if (this.form.invalid ) {
            console.log(this.form);
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });

            return;
        }
        this.miscService.startRequest();
        this.save();
        
    }
    cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/providers']);
	}
    
    
    newContactsArray() {
        return this.formBuilder.group({
            providerContactDescription:  [null,[Validators.required,Validators.maxLength(100)]],
            providerContactPhone:  [null,[Validators.required,Validators.maxLength(15)]],
            providerContactEmail:  [null,[Validators.required,Validators.email]] //
        });
    }
    newLocationsArray() {
        return this.formBuilder.group({
            providerLocationDescription:  [null,[Validators.required,Validators.maxLength(100)]],
            providerLocationAddress:  [null, [Validators.required,Validators.maxLength(255)]],
            providerLocationLng: null,
            providerLocationLat: null,
        });
    }
    newProductsArray() {
        return this.formBuilder.group({
            providerProductProductId:  [null,Validators.required],
            providerProductGuaranteeUnit: [0,[Validators.min(0), Validators.max(365)]],
            providerProductGuaranteeUnitMeasure: '',
            providerProductGuaranteeSpecifications: 'Defectos de fabricación', 
        });
    }
    newServicesArray() {
        return this.formBuilder.group({
            providerServiceServiceId:  [null,Validators.required],
            providerServiceGuaranteeUnit: [0,[Validators.min(0), Validators.max(365)]],
            providerServiceGuaranteeUnitMeasure: '',
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
    removeRow(type,index:number){
        switch (type) {
            case 'contact':
                this.infoContactsArray().removeAt(index); 
                break;
            case 'location':                
                this.infoLocationsArray().removeAt(index); 
                break;
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
       
        this.providerService.create(provider)
        .subscribe(data =>{
            const actions = [];
            this.form.value['providerContacts'].forEach(obj => {
                obj['providerContactProviderId'] = (data['newId']).toString();
                obj['providerContactPhone'] = (obj['providerContactPhone']).replaceAll("-", "");

                const ptt = this.providerContactService.create(obj).pipe(
					catchError((error) => 
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento de contacto", detail:error.message });
						return of(null);
					})
				);		

               actions.push(ptt);
            });

            
            this.form.value['providerLocations'].forEach(obj => {
                
                obj['providerLocationProviderId'] = (data['newId']).toString();

                const ptt = this.providerLocationService.create(obj).pipe(
					catchError((error) => 
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento de dirección", detail:error.message });
						return of(null);
					})
				);				

                actions.push(ptt);    
            });
            
            this.form.value['providerProducts'].forEach(product => {
                product['providerProductProviderId'] = (data['newId']).toString();
                product['providerProductProductId'] = (product['providerProductProductId']).toString();
                const ptt = this.providerProductService.create(product).pipe(
					catchError((error) => 
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar productos", detail:error.message });
						return of(null);
					})
				);				

                actions.push(ptt); 
            });
            
            this.form.value['providerServices'].forEach(service => {
                
                service['providerServiceProviderId'] = (data['newId']).toString();
                service['providerServiceServiceId'] = (service['providerServiceServiceId']).toString();
                const ptt = this.providerServiceService.create(service).pipe(
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
                this.router.navigate(['/providers']);
                this.miscService.endRquest();  

            }, 
            (err : any)=>{
                this.miscService.endRquest(); //fin del proceso por error
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al elementos múltiples ", detail:err.message });
			

            });

                  
        },  (err : any)=> {
            console.log(err);
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
            this.miscService.endRquest(); 
        });
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
                    this.listServices.push({'label':element['serviceDescription'],'value': element['id']});
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
