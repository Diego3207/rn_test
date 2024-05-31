import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, NgZone, QueryList, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DependencyService } from 'src/app/service/dependency.service';
import { DependencyCategoryService } from 'src/app/service/dependencyCategory.service';
import { DependencyPhoneService } from 'src/app/service/dependencyPhone.service';
import { DependencyPhoneContactService } from 'src/app/service/dependencyPhoneContact.service';
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
    templateUrl: './edit.dependency.component.html'
})
export class EditDependencyComponent implements OnInit, OnDestroy {
    @ViewChild('search') searchElementRef!: ElementRef;
    //provider: Provider ;
    //submitted: boolean = false;
    id:number;
    form: FormGroup | any;    
    listCategories: any[] = [];
    //listPhoneId : any[] = [];
    deletedPhones = [];
    listChannel: any[] = [];
    listFilteredChannel: any[] = [];
   
    constructor(
        private formBuilder: FormBuilder,
        private miscService:MiscService,        
        private dependencyService: DependencyService,
        private dependencyCategoryService: DependencyCategoryService,
        private dependencyPhoneService: DependencyPhoneService,
        private dependencyPhoneContactService: DependencyPhoneContactService,
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
       // Binding autocomplete to search input control
       let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
        );
    
        autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
            //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        
                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                return;
                }
                this.form.controls.dependencyAddress.setValue(place.formatted_address);
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
            dependencyDescription: [null,[Validators.required,Validators.maxLength(255)]],
            dependencyDependencyCategoryId: [null, [Validators.required]],
            dependencyAddress: [null,[Validators.required,Validators.maxLength(255)]],
            dependencyPhones: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
         }, formOptions);

         this.listChannel = [ //Correo Electronico
            'Llamada Telefonica',
            'SMS',
            'WhatsApp',
            'Telegram',
        ];
         this.getData();

		
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{


        if (this.form.invalid) {
            console.log(this.form);
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });
            return;
        }

        this.save();
    }
    cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/directory']);
	}
    newPhonesArray() {
        return this.formBuilder.group({
            id: null,
            dependencyPhoneNumber: [null,[Validators.required]],
            dependencyPhoneExtension: ['',[Validators.maxLength(50)]],
            dependencyPhoneHaveContact: false,
            dependencyPhoneCommunicationChannel: [null,[Validators.required,Validators.maxLength(150)]],
            //dependencyPhoneContact: this.formBuilder.array([]),
            //dependencyPhoneContact:  this.newPhoneContact() ,
            dependencyPhoneContact: this.formBuilder.array([this.newPhoneContact()]),
        });
    }
    newPhoneContact():FormGroup {
        return this.formBuilder.group({
            id:null,
            dependencyPhoneContactName: [null,[Validators.maxLength(255)]],
            dependencyPhoneContactJob: [null,[Validators.maxLength(255)]],
            dependencyPhoneContactEmail: [null,[Validators.email]],
        });
    }
    infoPhonesArray(): FormArray {
        return this.form.get('dependencyPhones') as FormArray;
    }
    
    infoPhoneContactArray(phoneIndex:number): FormArray {
        return this.infoPhonesArray().at(phoneIndex).get("dependencyPhoneContact") as FormArray

    }
    
    addRow(){
        this.infoPhonesArray().push(this.newPhonesArray());               
    }
    removeRow(index:number,object:any){
        this.infoPhonesArray().removeAt(index); 
        if(object.value.id !== null)
            this.deletedPhones.push(object.value);
    }

    isPhoneDuplicated(control: FormArray ) 
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
    filterChannel(event: any) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.listChannel as any[]).length; i++) {
            let country = (this.listChannel as any[])[i];
            if (country[i].toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.listFilteredChannel = filtered;
    }
    private save(){
        this.miscService.startRequest();
        let dependency = {};

        Object.keys(this.form.value).forEach(element => {
            if(element != "dependencyPhones"){
                if( element == 'dependencyDependencyCategoryId'){
                    dependency[element] = this.form.value[element].toString();
                }else{
                    dependency[element] = this.form.value[element];
                }
            }
        });

        
        this.dependencyService.update(dependency)
        .subscribe(dataDependency =>{

            const actions= [];
            const contacts = [];
            let contactCreate = [];
            let contactCreateExistPhone = [];

            
            const phones = this.form.value['dependencyPhones'];

            // -update/create
            phones.forEach((phone,index) => {
                
                phone['dependencyPhoneDependencyId'] = (dependency['id']).toString();
                phone['dependencyPhoneNumber'] = (phone['dependencyPhoneNumber']).replaceAll("-", "");

                
                //create  id == null
                if(phone['id'] == null)
                {
                    //1. contact
                    if(phone['dependencyPhoneHaveContact'])
                        contactCreate.push(phone['dependencyPhoneContact'][0]);
                    
                    delete phone.dependencyPhoneHaveContact;
                    delete phone.dependencyPhoneContact;
                    //2. Obtener telefonos sin contacto en caso de tener                   
                    delete phone.id;
                    const ptt = this.dependencyPhoneService.create(phone).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar el teléfono: "+phone.dependencyPhoneNumber, detail:error.message });
                            return of(null);
                        })
                    );

                    actions.push(ptt);  
                }else{
                    // update id != null 
                    // procesar contactos
                   let contact = phone['dependencyPhoneContact'][0];

                    if(phone['dependencyPhoneHaveContact']){
                        //ckeck = true => si se liga contacto
                        if(contact.id == null){
                            //contacto nuevo y se debe agregar por que  check == true
                            delete contact.id;
                            contactCreateExistPhone.push({phoneId: phone['id'] , contact: contact });

                        }else{
                            //contacto existente y de debe actualizar por que  check == true
                            const contactAction = this.dependencyPhoneContactService.update(contact).pipe(
                                catchError((error) => 
                                {
                                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar telefono existente", detail:error.message });
                                    return of(null);
                                })
                            );		
            
                           actions.push(contactAction);

                        }
                    }else{
                        // ckeck = false => no se liga contacto
                        if(contact.id != null){                            
                           //existente contacto pero de debe eliminar (active = 0) y phone (idcontacto = null), ya que el  check == false
                            const contactDisabled = this.dependencyPhoneContactService.disable(contact.id).pipe(
                                catchError((error) => 
                                {
                                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente para el telefono"+ phone.dependencyPhoneNumber, detail:error.message });
                                    return of(null);
                                })
                            );
        
                            actions.push(contactDisabled);

                            const updatePhone = this.dependencyPhoneService.update({id:phone.id,dependencyPhoneDependencyPhoneContactId:null}).pipe(
                                catchError((error) => 
                                {
                                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente para el telefono"+ phone.dependencyPhoneNumber, detail:error.message });
                                    return of(null);
                                })
                            );
        
                            actions.push(updatePhone);
                            
                        }  

                        //contact.id == null | era nuevo pero no se liga contacto porque esta en check == false
                    }


                    //update telefono
                    delete phone.dependencyPhoneHaveContact;
                    delete phone.dependencyPhoneContact;

                    const  phoneAction= this.dependencyPhoneService.update(phone).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar telefono existente", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(phoneAction);

                  
                }
            });

            //-Disable ("delete")
            this.deletedPhones.forEach(obj => {
                // update el telefono y el contacto en caso de tener asignado
                const phone = this.dependencyPhoneService.disable(obj.id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar telefono existente"+ obj.dependencyPhoneNumber, detail:error.message });
                        return of(null);
                    })
                );

               actions.push(phone);
                if(obj.dependencyPhoneHaveContact){
                    const contact = this.dependencyPhoneContactService.disable(obj['dependencyPhoneContact'][0].id).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente para el telefono"+ obj.dependencyPhoneNumber, detail:error.message });
                            return of(null);
                        })
                    );

                    actions.push(contact);
                }
                
            });
            
            forkJoin(actions).subscribe((data)=>
            {

                let phones = [];
                data.forEach(obj => {
                    if( obj.hasOwnProperty('newId')){
                        phones.push(obj.newId);
                    }
                   
                });
                contactCreateExistPhone.forEach(obj => {
                    phones.push(obj.phoneId);
                    contactCreate.push(obj.contact);
                   
                });

                if(phones.length  > 0 && contactCreate.length > 0 &&  contactCreate.length == phones.length)
                    this.saveContact(contactCreate,phones);


               
                this.miscService.endRquest();  
                this.router.navigate(['/directory']);

                

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
        const categories = this.dependencyCategoryService.getAll(0,1,'[{"id":"asc"}]').pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de categorias", detail:error.message });
                return of(null); 
            })
        );
        
        const services =this.dependencyService.getById(this.id)
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar datos de dependencia", detail:error.message });
                return of(null); 
            })
        );
        
            
        forkJoin([categories,services]).subscribe(async ([dataCategories,dataDependency] )=>
        {
            this.listCategories = (dataCategories == null ? []: dataCategories['object']['records']);

            if(dataDependency != null)
            {
               
                //agregar filas en la tabla
                for (let i=0; i < dataDependency['dependencyPhones'].length; i++){
                    this.addRow();
                    if(dataDependency['dependencyPhones'][i]['dependencyPhoneDependencyPhoneContactId'] != null){
                        let contact = dataDependency['dependencyPhones'][i]['dependencyPhoneDependencyPhoneContactId'];
                        //poner datos de contacto[0]
                        this.form.controls.dependencyPhones.controls[i].controls.dependencyPhoneHaveContact.setValue(true);
                        this.form.controls.dependencyPhones.controls[i].controls.dependencyPhoneContact.controls[0].controls.id.setValue(contact['id']);
                        this.form.controls.dependencyPhones.controls[i].controls.dependencyPhoneContact.controls[0].controls.dependencyPhoneContactName.setValue(contact['dependencyPhoneContactName']);
                        this.form.controls.dependencyPhones.controls[i].controls.dependencyPhoneContact.controls[0].controls.dependencyPhoneContactJob.setValue(contact['dependencyPhoneContactJob']);
                        this.form.controls.dependencyPhones.controls[i].controls.dependencyPhoneContact.controls[0].controls.dependencyPhoneContactEmail.setValue(contact['dependencyPhoneContactEmail']);
                        
                    }

                }
                
                await this.form.patchValue(dataDependency); // this.form.patchValue(data);

            }
            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }
    saveContact(contactArray:any,phonesArray: any){
        let actions = [];
        contactArray.forEach((contact, index) => {


            const ptt = this.dependencyPhoneContactService.create(contact).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo contacto: "+ contact['contact'].dependencyPhoneContactName, detail:error.message });
                    return of(null);
                })
            );
            actions.push(ptt);           
            
        });

        forkJoin(actions).subscribe((createData)=>
        {
            //3. Actualizar telefono [idContacto]

            this.updatePhone(createData,phonesArray);

        }, 
        (err : any)=>{
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general guardar los contactos de los teléfonos  ", detail:err.message });
        });
    }
    updatePhone(contactArray :any,phonesArray :any){

        let actions =[];
        contactArray.forEach((contact, index) => {
            
            const ptt = this.dependencyPhoneService.update({id: phonesArray[index],dependencyPhoneDependencyPhoneContactId:contact['newId'].toString()}).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar teléfono: ", detail:error.message });
                    return of(null);
                })
            );
            actions.push(ptt);           
            
        });

        forkJoin(actions).subscribe((contactId)=>
        {
            //termina proceso
            this.miscService.endRquest();
            this.router.navigate(['/directory']);

           

        }, 
        (err : any)=>{
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general actualizar el campo contacto de los teléfonos ", detail:err.message });
        });


    }
}
