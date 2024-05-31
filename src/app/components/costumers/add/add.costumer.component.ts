import { Component, ElementRef, ViewChild, NgZone} from '@angular/core';
import { CostumerService } from 'src/app/service/costumer.service';
import { DataBankService } from 'src/app/service/databank.service';
import { CostumerDataBankService } from 'src/app/service/costumerDataBank.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CostumerContactService } from 'src/app/service/costumerContact.service';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
    templateUrl: './add.costumer.component.html'
})
export class AddCostumerComponent  {
  @ViewChild('search') searchElementRef!: ElementRef;
  submitted: boolean = false;
  listDataBanks: any[] = [];
  form: FormGroup | any;
  listAllGroups: any[] = [];
  listGroupFiltered: any[] = [];

  constructor(    
    private formBuilder: FormBuilder,
    private costumerService: CostumerService,
    private dataBankService: DataBankService,
    private costumerDataBankService: CostumerDataBankService,
    private costumerContactService: CostumerContactService,
    private messageService: MessageService,
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

    //console.log("------------------------>");
    console.log(this.searchElementRef.nativeElement);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());
        this.form.controls.costumerAddress.setValue(place.formatted_address);
      });
    });
  }

  ngOnInit(): void 
  {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
    this.form = this.formBuilder.group
      ({
      costumerName: [null, [Validators.required,Validators.maxLength(100)]],
      costumerBussinessName: ['', [Validators.maxLength(100)]],
      costumerRfc: ['', [Validators.maxLength(100)]],
      costumerAddress: ['', [Validators.maxLength(250)]],
      costumerWebSite: ['', [Validators.maxLength(100)]],
      costumerGroup:'',
      costumerContacts: this.formBuilder.array([],Validators.minLength(1)),
      costumerDataBanks: this.formBuilder.array([],this.isDataBankDuplicated),
      costumerIsClient: [false,[Validators.required]],
    }, formOptions);
    this.list();
  }

  onSubmit() 
  {
    // stop here if form is invalid
    if (this.form.invalid) 
    {
      return;
    }
      this.save();
  }
  cancel(event) {
		event.preventDefault(); //
		this.router.navigate(['/costumers']);
	}

  newContactsArray() 
  {
    return this.formBuilder.group({
      costumerContactName:  [null,Validators.maxLength(100)],
      costumerContactPhone:  null,
      costumerContactEmail:  [null,Validators.email],
      costumerContactDepartment: [null,Validators.maxLength(100)],
    });
  }

  newDataBanksArray() 
  {
    return this.formBuilder.group({
      costumerDataBankDataBankId:  null,
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

  removeRow(type,index:number)
  {
    switch (type) 
    {
      case 'contact':
        this.infoContactsArray().removeAt(index); 
      break;
      case 'databank':
        this.infoDatabanksArray().removeAt(index);
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
    // create Costumer
    //console.log(this.form.value);
    let costumer = {};

    Object.keys(this.form.value).forEach(element => 
    {
      if(element != "costumerContacts" && element != "costumerDataBanks" ){
        costumer[element] = this.form.value[element];
      }
    });
  
    if(costumer['costumerGroup']['label']){
      costumer['costumerGroup'] = ( costumer['costumerGroup'] == '' ? '' : costumer['costumerGroup']['label']);
    }
    //console.log(costumer);
   this.costumerService.create(costumer)
    .subscribe(data => {
      const actions = [];
      
      this.form.value['costumerContacts'].forEach(obj => {
        obj['costumerContactCostumerId'] = (data['newId']).toString();
        obj['costumerContactPhone'] = (obj['costumerContactPhone']).replaceAll("-", "");
        const ptt = this.costumerContactService.create(obj).pipe(
          catchError((error) => 
          {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento de contacto", detail:error.message });
            return of(null);
          })
        );		
        actions.push(ptt);
      });

      this.form.value['costumerDataBanks'].forEach(databank => {
        databank['costumerDataBankCostumerId'] = (data['newId']).toString();
        databank['costumerDataBankDataBankId'] = (databank['costumerDataBankDataBankId']).toString();
        const ptt = this.costumerDataBankService.create(databank).pipe(
          catchError((error) => 
          {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar productos", detail:error.message });
            return of(null);
          })
        );				
        actions.push(ptt); 
        
      });
      forkJoin(actions).subscribe(([] :any)=>
      {
        this.router.navigate(['/costumers']);
        this.miscService.endRquest();  
      }, 
      (err : any)=>{
        this.miscService.endRquest(); //fin del proceso por error
        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al elementos múltiples ", detail:err.message });
      });
      this.miscService.endRquest();
      this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
      this.router.navigate(['/costumers']);
    }, (err: any) => 
    {
      this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
      this.miscService.endRquest();
    });
  }

  list(){
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
        resultDataBanks['object']['records'].forEach(element => 
        {
          if (element['dataBankPlayer'] == "costumer")
          {
            this.listDataBanks.push({'label': element['dataBankBeneficiaryName']+" "+ element['dataBankInstitutionName']+" "+ element['dataBankType']+" "+ element['dataBankNumber'],'value': element['id']});
          }
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
        
    //console.log(this.listAllGroups);
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

