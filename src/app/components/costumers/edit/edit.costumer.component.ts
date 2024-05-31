import { Component, OnDestroy, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Costumer } from 'src/app/api/costumer';
import { CostumerService } from 'src/app/service/costumer.service';
import { DataBankService } from 'src/app/service/databank.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators, FormArray  } from '@angular/forms';
import { MiscService } from 'src/app/service/misc.service';
import { CostumerContactService } from 'src/app/service/costumerContact.service';
import { CostumerDataBankService } from 'src/app/service/costumerDataBank.service';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';


@Component({
    templateUrl: './edit.costumer.component.html'
})
export class EditCostumerComponent implements OnInit, OnDestroy {
    @ViewChild('search') public searchElementRef!: ElementRef;
    submitted: boolean = false;
    costumers: Costumer[];
    costumer: Costumer;
    listDataBanks: any[] = [];
    deletedContacts = [];
    deleteDataBanks = [];
    id:number;
    form: FormGroup | any;
    listAllGroups: any[] = [];
    listGroupFiltered: any[] = [];
   
    constructor(
        private formBuilder: FormBuilder,
        private costumerService: CostumerService, 
        private messageService: MessageService, 
        private miscService:MiscService,
        private costumerContactService: CostumerContactService,
        private costumerDataBankService: CostumerDataBankService,
        private dataBankService : DataBankService,
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
            this.form.controls.costumerCoordenates.setValue(place.geometry.location?.lat() + ',' + place.geometry.location?.lng());
            this.form.controls.costumerAddress.setValue(place.formatted_address);
          });
        });
      }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
            costumerName: [null, [Validators.required,Validators.maxLength(100)]],
            costumerBussinessName: ['', [Validators.maxLength(100)]],
            costumerRfc: ['', [Validators.maxLength(100)]],
            costumerAddress: ['', [Validators.maxLength(250)]],
            costumerWebSite: ['', [Validators.maxLength(100)]],
            costumerIsClient: [null,[Validators.required]],
            costumerGroup:'',
            costumerContacts: this.formBuilder.array([],Validators.minLength(1)),
            costumerDataBanks: this.formBuilder.array([],this.isDataBankDuplicated),
        }, formOptions);

        this.getData();	
    }

    
    ngOnDestroy() {
       
    }

    onSubmit() 
	{
        // stop here if form is invalid
        if (this.form.invalid) 
        {
            //console.log("entra al if");
            console.log(this.form.value);
            return;
        }
           // console.log("entra al else");
           // console.log(this.form.value);
            this.save();
    }
    cancel(event) {
		event.preventDefault(); //
		this.router.navigate(['/costumers']);
	}

    newContactsArray() 
    {
      return this.formBuilder.group({
        id:null,
        costumerContactCostumerId: null, 
        costumerContactName:  [null,Validators.maxLength(100)],
        costumerContactPhone:  null,
        costumerContactEmail:  [null,Validators.email],
        costumerContactDepartment: [null,Validators.maxLength(100)],
      });
    }
  
    newDataBanksArray() 
    {
      return this.formBuilder.group({
        id:null,
        costumerDataBankCostumerId: null,
        costumerDataBankDataBankId:  [null,Validators.required],
      });
    }
  
    infoContactsArray(): FormArray 
    {
      return this.form.get('costumerContacts') as FormArray;
    }
  
    infoDatabanksArray(): FormArray 
    {
      return this.form.get('costumerDataBanks') as FormArray;
    }
  
    addRow(type)
    {
      switch (type) 
      {
        case 'contact':
          this.infoContactsArray().push(this.newContactsArray());   
        break;
        case 'databank':
          this.infoDatabanksArray().push(this.newDataBanksArray()); 
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
            case 'databank':                
                this.infoDatabanksArray().removeAt(index); 
                if(object.value.id !== null)
                    this.deleteDataBanks.push(object.value.id);
                break;
        }

    }
  
    isDataBankDuplicated(control: FormArray ) 
    {
      const uniqueValues = new Set();
      for (const item of control.controls) 
      {
        const obj = item.value.costumerDataBankDataBankId
        if (uniqueValues.has(obj)) 
        {
          return { duplicated: true }; 
        }          
        uniqueValues.add(obj);
      }
      return null; //en este punto no hay error, se regresa null	
    }

    private save()  
    {
        //console.log("entra a save()");
        let costumer = {};
        Object.keys(this.form.value).forEach(element => 
        {
            if ( element != "costumerContacts" && element != "costumerDataBanks" ) {
                costumer[element] = this.form.value[element]; //copia las propiedades del objeto principal        
              }
        });
        
        if(costumer['costumerGroup']['label'] || costumer['costumerGroup']['label'] == '' ){
            costumer['costumerGroup'] = ( costumer['costumerGroup'] == '' || costumer['costumerGroup']['label'] == ''  ? '' : costumer['costumerGroup']['label']);
        }
        this.costumerService.update(costumer)
        .subscribe(data =>{

            const actions = [];
            //-update/create
            this.form.value['costumerContacts'].forEach(element => {
                
                if(element['id'] == null)
                {
                    // -------- contactos --------
                    // create
                    element['costumerContactCostumerId'] = (this.form.value['id']).toString();
                    element['costumerContactPhone'] = (element['costumerContactPhone']).replaceAll("-", "");
                    const ptt = this.costumerContactService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento nuevo contacto", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
                    element['costumerContactCostumerId'] = (element['costumerContactCostumerId']).toString();
                    element['costumerContactPhone'] = (element['costumerContactPhone']).replaceAll("-", "");

                    const ptt = this.costumerContactService.update(element).pipe(
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

                const ptt = this.costumerContactService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente", detail:error.message });
                        return of(null);
                    })
                );		

               actions.push(ptt);
                
            });
            
            // -------- cuenta bancaria --------
            //-update/create
            this.form.value['costumerDataBanks'].forEach(element => {
                if(element['id'] == null)
                {
                    // create
                    element['costumerDataBankCostumerId'] = (this.form.value['id']).toString();
                    element['costumerDataBankDataBankId'] = ( element['costumerDataBankDataBankId']).toString();

                    const ptt = this.costumerDataBankService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar nuevo producto ", detail:error.message });
                            return of(null);
                        })
                    );
                   actions.push(ptt);
                }else{
                    // update
                    element['costumerDataBankCostumerId'] = (element['costumerDataBankCostumerId']).toString();
                    element['costumerDataBankDataBankId'] = (element['costumerDataBankDataBankId']).toString();


                    const ptt = this.costumerDataBankService.update(element).pipe(
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
            this.deleteDataBanks.forEach(id => {
                // update
                const ptt = this.costumerDataBankService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar producto existente", detail:error.message });
                        return of(null);
                    })
                );		
                actions.push(ptt);
            });
               
            if(actions != null){
                forkJoin(actions).subscribe(([] :any)=>
                {
                    this.router.navigate(['/costumers']);
                    this.miscService.endRquest();  
                },
                (err : any)=>{
                    //console.log(err.message);
                    this.miscService.endRquest(); //fin del proceso por error
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al elementos múltiples ", detail:err.message });
                }); 
            } 
            this.router.navigate(['/costumers']);
            this.miscService.endRquest();  
        },  (err : any) => {

            let description='',title  ='';

            if(err.error.code == "E_MISSING_OR_INVALID_PARAMS"){
                title = err.error.code; 
                err.error.problems.forEach((element) => description += "\n"+ element);
                

            }else{
                description = err.error.message;
            }
            
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error '+ title, detail: description, life: 3000 });  
        
        });
    } 


    getData(){

        this.miscService.startRequest();

        
        const databanks = this.dataBankService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de productos", detail:error.message });
                return of(null); 
            })
        );
        const costumers = this.costumerService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de grupo de clientes", detail:error.message });
            return of(null); 
        })
        );    
        forkJoin([databanks,costumers]).subscribe(([resultDataBanks,resultCustomers] )=>
        {
            if(resultDataBanks != null )
            {                    
                resultDataBanks['object']['records'].forEach(element => {
                    this.listDataBanks.push({'label': element['dataBankBeneficiaryName']+" "+ element['dataBankInstitutionName']+" "+ element['dataBankType']+" "+ element['dataBankNumber'],'value': element['id']});
                    //console.log(this.listDataBanks);
                });
            }

            if(resultCustomers != null )
            {                    
                resultCustomers['object']['records'].forEach(element => 
                {
                if (element['costumerGroup'] != "" && element['costumerGroup'] != null  )
                {
                    this.listAllGroups.push( element['costumerGroup']);

                }
                
                });
            }
            this.listAllGroups = this.listAllGroups.filter((obj, index, arr) => {
                return arr.findIndex(element => JSON.stringify(element) === JSON.stringify(obj)) === index
            });

            this.costumerService.getById(this.id)
            .subscribe(async data => {
                //agregar filas en la tabla
                //console.log(data);
                for (let i=0; i < data['costumerContacts'].length; i++){
                
                    this.addRow('contact');
                }
                for (let i=0; i < data['costumerDataBanks'].length; i++){
                    this.addRow('databank');
                }   

                await this.form.patchValue(data); 
                //console.log(data);
                this.form.controls.costumerGroup.setValue({label: data['costumerGroup']});
                //console.log(this.form);
            });

            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }

    filterElement(event) {
        let filtered: any[] = [];
        let query = event.query;
  
        for (let i = 0; i < this.listAllGroups.length; i++) {
            //let country = this.listAllGroups[i];
            if (this.listAllGroups[i].toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push({label:this.listAllGroups[i]});
            }
        }
  
        this.listGroupFiltered = filtered;
    }
}
