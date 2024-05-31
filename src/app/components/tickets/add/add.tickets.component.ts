import { Component } from '@angular/core';
import { TicketService } from 'src/app/service/ticket.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { MonitoringDeviceService } from 'src/app/service/monitoringDevice.service';
import { MonitoringDevice } from 'src/app/api/monitoringDevice';
import { TicketMonitoringDeviceService } from 'src/app/service/ticketMonitoringDevice.service';
import { TicketCoordinationService } from 'src/app/service/ticketCoordination.service';
import { DependencyPhoneService } from 'src/app/service/dependencyPhone.service';
import { SessionService } from 'src/app/service/session.service'
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Component({
  templateUrl: './add.tickets.component.html'
})

export class AddTicketComponent {
  submitted: boolean = false;
  listCostumers: any[] = [];
  listMonitoringDevices : any[] = [];
  selectedRegister: MonitoringDevice[] = [];
  disabled: boolean = false;
  form: FormGroup | any;
  visible: boolean = false;
  listPhones :any[]= [];


  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private costumerService: CostumerService,
    private monitoringDeviceService: MonitoringDeviceService,
    private ticketMonitoringDeviceService: TicketMonitoringDeviceService,
    private ticketCoordinationService: TicketCoordinationService,
    private dependencyPhoneService:DependencyPhoneService,
    private messageService: MessageService,
    private miscService: MiscService,
    private sessionService:SessionService,
    private confirmationService: ConfirmationService,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
      ticketCostumerId: [null, [Validators.required, Validators.maxLength(255)]],
      ticketUserId: [this.sessionService.getUserId(),[Validators.required]], 
      ticketDescription: [' ', Validators.required],
      ticketObservation: [' ', Validators.required],
      ticketCoordinations: this.formBuilder.array([],[Validators.required,Validators.minLength(1),this.isCoordinationDuplicated]),
    }, formOptions);
    this.list();
    
    this.form.get("ticketCostumerId").valueChanges.subscribe(selectedValue => 
      {
        if(selectedValue != null){
          console.log(selectedValue);
          this.getFilter(selectedValue);
        }
      });
  }

  ngOnDestroy() {

  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.save();
  }
  cancel(event) {
    event.preventDefault(); //
    this.router.navigate(['/tickets']);
  }

  private save() {

    let ticketProperties = {};
    Object.keys(this.form.value).forEach(element => {
        ticketProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal        
    });
    //Parseamos el ID a string
    ticketProperties['ticketCostumerId'] = (ticketProperties['ticketCostumerId']).toString();
    ticketProperties['ticketUserId'] = (ticketProperties['ticketUserId']).toString();

    this.ticketService.create(ticketProperties)
      .subscribe(data => {
        const actions = [];

        //Método para ingresar el número de folio
        const ptt = this.ticketService.update({
            'id': (data['newId']).toString(), 
            'ticketFolio': 'RNM/TDF/' + (data['newId']).toString()
        })
        .pipe(
            catchError((error) => 
            {
            throw this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al ingresar folio", detail:error.message });
            return of(null); 
            }) 
        ); 
        actions.push(ptt);   
        console.log(this.selectedRegister);
        //Método para agregar los dispositivos relacionados
        this.selectedRegister.forEach(obj => {

          obj['ticketMonitoringdeviceTicketId'] = (data['newId']).toString();
          obj['ticketMonitoringdeviceMonitoringDeviceId'] = (obj['id']).toString();

          const ptt = this.ticketMonitoringDeviceService.create(obj).pipe(
            catchError((error) => 
            {
              this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar dispositivo relacionado", detail:error.message });
              return of(null);
            })
          );		
          actions.push(ptt);
        });

        if (this.form.value['ticketCoordinations'].length > 0){

          this.form.value['ticketCoordinations'].forEach(obj => { 
            
            obj['ticketCoordinationTicketId'] =  (data['newId']).toString();
            obj['ticketCoordinationDependencyPhoneId'] = obj['ticketCoordinationDependencyPhoneId'].toString();

            const ptt = this.ticketCoordinationService.create(obj).pipe(
                catchError((error) => {
                    throw this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar telefono ",detail:  error.error.error });
                    return of(null);
                })
            );		
            actions.push(ptt);
          });
        }

        forkJoin(actions).subscribe(([] :any)=>
        {
            this.miscService.endRquest();
            this.router.navigate(['/tickets']);
        },
        (err:any)=>{
            this.miscService.endRquest();
				    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar detalles", detail:err.message });
        });
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }

  list(){
    this.miscService.startRequest();
    const customers = this.costumerService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
      catchError((error) => 
      {
        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de clientes", detail:error.message });
        return of(null); 
      })
    );

    const phones = this.dependencyPhoneService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar directorio", detail:error.message });
            return of(null); 
        })
    );

    forkJoin([customers,phones]).subscribe(  ([dataCustomers,dataPhones])=>
    {
      if(dataCustomers != null )
      {                    
        this.listCostumers = dataCustomers['object']['records'];

        let nuevoObjeto = {};
      //Recorremos el arreglo 
      dataPhones['object']['records'].forEach( x => { 
          if( !nuevoObjeto.hasOwnProperty(x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription'])){
              nuevoObjeto[x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription']] = {
              phones: []
            }
          }
          
          //Agregamos los datos de phones
          let labelx = x.dependencyPhoneDependencyId['dependencyDescription']+" / Tel: "+ x.dependencyPhoneNumber +" / Via: "+x.dependencyPhoneCommunicationChannel;
          let phone = {label:labelx, value:x.id };
            nuevoObjeto[x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription']].phones.push(phone);
          
        });


        let claves = Object.keys(nuevoObjeto); 
        for(let i=0; i< claves.length; i++){
          this.listPhones.push({label:claves[i] ,items:nuevoObjeto[claves[i]].phones});
          
        }

      }
        this.miscService.endRquest();	
    },
    (err : any) =>
    {
      this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
      this.miscService.endRquest();
    });
  }

 getFilter(value){
  console.log(this.selectedRegister);
    if(value != null){
      this.miscService.startRequest();

    const monitoringDevices = this.monitoringDeviceService.getFilter('[{"value":"'+ value+'","matchMode":"equals","field":"monitoringDeviceCostumerId"}]',0,1,'[{"id":"asc"}]')

    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de vehiculos", detail:error.message });
            return of(null); 
        })
    );

    forkJoin([monitoringDevices]).subscribe(([dataMonitoringDevices])=>
    {
      
      if(dataMonitoringDevices != null){
        this.listMonitoringDevices =  dataMonitoringDevices['object']['records']; 
        console.log(this.listMonitoringDevices);
      }else{
        this.listMonitoringDevices = [];
        this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin dispositivos relacionados para el cliente seleccionado', life: 4000 });

      }
      this.miscService.endRquest();
               
      },
      (err:any)=>{
        this.miscService.endRquest();
        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar accesorios", detail:err.message });
      });

    }
  } 
  newCoordinationArray() 
  {
    return this.formBuilder.group({
        
        ticketCoordinationDependencyPhoneId:[null,[Validators.required]]
    });
  }
  
  infoCoordinationsArray(): FormArray {
    return this.form.get('ticketCoordinations') as FormArray;
  }

  addRow()
  {
      this.infoCoordinationsArray().push(this.newCoordinationArray());
         
  }
  removeRow(index:number)
  {
      this.infoCoordinationsArray().removeAt(index); 
  }

  isCoordinationDuplicated(control: FormArray ) 
  {
      const uniqueValues = new Set();
      for (const item of control.controls) 
      {

        const obj = item.value.ticketCoordinationDependencyPhoneId
        if (uniqueValues.has(obj)) 
        {
          return { duplicated: true }; 
        }          
            
          uniqueValues.add(obj);
      }
      return null; //en este punto no hay error, se regresa null	
  }

}

