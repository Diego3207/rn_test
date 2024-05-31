import { Component } from '@angular/core';
import { MonitoringDeviceService } from 'src/app/service/monitoringDevice.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Component({
  templateUrl: './add.monitoringDevices.component.html'
})

export class AddMonitoringDeviceComponent {
  submitted: boolean = false;
  typeDevices: any[] =  [];
  listCostumers: any[] = [];
  form: FormGroup | any;
  constructor(
    private formBuilder: FormBuilder,
    private monitoringDeviceService: MonitoringDeviceService,
    private costumerService: CostumerService,
    private messageService: MessageService,
    private miscService: MiscService,
    private confirmationService: ConfirmationService,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
      monitoringDeviceName: [null, [Validators.required, Validators.maxLength(255)]],
      monitoringDeviceCostumerId: [null, Validators.required],
      monitoringDeviceType: [null, Validators.required],
      monitoringDeviceProvider: 0,
    }, formOptions);
    this.list();
    this.typeDevices = [
        { name: 'Cámara'},
        { name: 'Panel'},
        { name: 'Sensor'},
        { name: 'Botón de Pánico'},
    ];
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
    this.router.navigate(['/monitoringDevices']);
  }

  private save() {
    // create monitoringDevices 
    this.monitoringDeviceService.create(this.form.value)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/monitoringDevices']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }

  list(){

      this.miscService.startRequest();
      //Método para listar métodos de Pago
      const costumers =this.costumerService.getAll(0,1,'[{"id":"asc"}]')
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
          return of(null); 
        })
      );
      
      //Hacemos fork join para mandar las peticiones
      forkJoin([costumers]).subscribe(([dataCostumers] )=>
      {
        console.log(dataCostumers);
        //Envia los Clientes
        if(dataCostumers != null)
        {
            dataCostumers['object']['records'].forEach(element => {
                this.listCostumers.push({'label': element['id']+" "+ element['costumerName'],'value': element['id'].toString()});
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

