import { Component, ElementRef, ViewChildren, NgZone, QueryList, ViewChild} from '@angular/core';
import { DependencyService } from 'src/app/service/dependency.service';
import { DependencyCategoryService } from 'src/app/service/dependencyCategory.service';
import { DependencyPhoneService } from 'src/app/service/dependencyPhone.service';
import { DependencyPhoneContactService } from 'src/app/service/dependencyPhoneContact.service';
import { Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

@Component({
    templateUrl: './add.dependency.component.html'
})
export class AddDependencyComponent  {
    @ViewChild('search') searchElementRef!: ElementRef;
    form: FormGroup | any;
    listCategories: any[] = [];
    listPhoneId : any[] = [];
    listChannel: any[] = [];
    listFilteredChannel: any[] = [];
    

    constructor(    
        private formBuilder: FormBuilder,
        private dependencyService: DependencyService,
        private dependencyCategoryService: DependencyCategoryService,
        private dependencyPhoneService: DependencyPhoneService,
        private dependencyPhoneContactService: DependencyPhoneContactService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private miscService:MiscService,
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

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
       
		this.form = this.formBuilder.group
		({
            dependencyDescription: [null,[Validators.required,Validators.maxLength(255)]],
            dependencyDependencyCategoryId: [null, [Validators.required]],
            dependencyAddress: [null,[Validators.required,Validators.maxLength(255)]],
            dependencyPhones: this.formBuilder.array([],[Validators.minLength(1),Validators.required]),
            
            


        }, formOptions);
        
        this.listChannel = [ //Correo Electronico
            'Llamada Telefónica',
            'SMS',
            'WhatsApp',
            'Telegram',
        ];
        this.list();
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{
        if (this.form.invalid ) {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });

            return;
        }
        this.miscService.startRequest();
        this.save();
        
    }
    cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/directory']);
	}
    
    newPhonesArray() {
        return this.formBuilder.group({
            dependencyPhoneNumber: [null,[Validators.required]],
            dependencyPhoneExtension: ['',[Validators.maxLength(50)]],
            dependencyPhoneCommunicationChannel: [null,[Validators.required,Validators.maxLength(150)]],
            dependencyPhoneHaveContact: false,
           //dependencyPhoneContact: this.formBuilder.array([]),
          // dependencyPhoneContact:  this.newPhoneContact() ,
            dependencyPhoneContact: this.formBuilder.array([this.newPhoneContact()]),
        });
    }
    newPhoneContact():FormGroup {
        return this.formBuilder.group({
            dependencyPhoneContactName: [null,[Validators.maxLength(255)]],
            dependencyPhoneContactJob: [null,[Validators.maxLength(255)]],
            dependencyPhoneContactEmail: [null,[Validators.email]] ,
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
    removeRow(index:number){
    
        this.infoPhonesArray().removeAt(index); 
       
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

        this.dependencyService.create(dependency)
        .subscribe(dataDependency =>{
            const contacts = [];
            const actionPhone = [];

            //1. Obtener telefonos 
            this.form.value['dependencyPhones'].forEach((phone, index) => {

                phone['dependencyPhoneDependencyId'] = (dataDependency['newId']).toString();
                phone['dependencyPhoneNumber'] = (phone['dependencyPhoneNumber']).replaceAll("-", "");

                if(phone['dependencyPhoneHaveContact'])
                    contacts.push({ phoneIndex:index, contact:phone['dependencyPhoneContact'][0]});

                delete phone.dependencyPhoneHaveContact;
                delete phone.dependencyPhoneContact;

                const ptt = this.dependencyPhoneService.create(phone).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar el teléfono: "+phone.dependencyPhoneNumber, detail:error.message });
                        return of(null);
                    })
                );
                actionPhone.push(ptt);  
                             
                
            });
            
            
            forkJoin(actionPhone).subscribe((dataPhoneId)=>
            {
                //2. Ejecutar Guardar contacto
                this.miscService.endRquest(); 
                if(contacts.length > 0){
                    this.listPhoneId = dataPhoneId;
                    this.saveContact(contacts);
                }else{
                   
                    this.router.navigate(['/directory']);

                }
                this.miscService.endRquest();
            }, 
            (err : any)=>{
                this.miscService.endRquest(); //fin del proceso por error
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general guardar teléfonos", detail:err.message });
            

            });


        },  (err : any)=> {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
            this.miscService.endRquest(); 
        });


      
    }
    saveContact(contactArray:any){
        let actions = [];
        contactArray.forEach((contact, index) => {


            const ptt = this.dependencyPhoneContactService.create(contact['contact']).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar contacto del teléfono: "+ this.form.value.dependencyPhones[contact['phoneIndex']].dependencyPhoneNumber, detail:error.message });
                    return of(null);
                })
            );
            actions.push(ptt);           
            
        });

        forkJoin(actions).subscribe((contactId)=>
        {
            //3. Actualizar telefono [idContacto]

            this.updatePhone(contactId,contactArray);

        }, 
        (err : any)=>{
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general guardar los contactos de los teléfonos  ", detail:err.message });
        });
    }
    updatePhone(contactId,contactInfo){
        let actions =[];
        contactId.forEach((contact, index) => {
            
            const ptt = this.dependencyPhoneService.update({id:this.listPhoneId[contactInfo[index]['phoneIndex']]['newId'],dependencyPhoneDependencyPhoneContactId:contact['newId'].toString()}).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar teléfono: "+ this.form.value.dependencyPhones[contactInfo[index]['phoneIndex']].dependencyPhoneNumber, detail:error.message });
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
    list(){

        this.miscService.startRequest();
        
        this.dependencyCategoryService.getAll(0,1,'[{"id":"asc"}]').subscribe(data =>{

            
            
            this.listCategories = (data == null ? []: data['object']['records']);
        
            this.miscService.endRquest();
        },  (err : any)=> {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
            this.miscService.endRquest(); 
        });
            
    }
}
