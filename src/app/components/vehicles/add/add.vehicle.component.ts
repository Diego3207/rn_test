import { Component } from '@angular/core';
import { VehicleService } from 'src/app/service/vehicle.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Component({
  templateUrl: './add.vehicle.component.html'
})

export class AddVehicleComponent {
  submitted: boolean = false;
  form: FormGroup | any;
  listCostumers : any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private costumerService: CostumerService,
    private messageService: MessageService,
    private miscService: MiscService,
    private router: Router) {
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({

      vehicleCostumerId: [null, Validators.required],
      vehicleBrand: [null, [Validators.required, Validators.maxLength(100)]],
      vehicleModel: [null, [Validators.required, Validators.maxLength(250)]],
      vehicleYear: [null, [Validators.required, Validators.maxLength(17)]],
      vehicleVin: [null, [Validators.required, Validators.maxLength(250)]],
      vehiclePlateNumber: [null, [Validators.required, Validators.maxLength(250)]],
      vehicleColor: [null, [Validators.required, Validators.maxLength(250)]],
    }, formOptions);
    this.getLists();
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
    this.router.navigate(['/vehicles']);
  }
  
  getLists(){

    this.miscService.startRequest();
  
    const customers = this.costumerService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de clientes", detail:error.message });
            return of(null); 
        })
    );
    
    forkJoin([customers]).subscribe(  ([dataCustomers])=>
    {
        if(dataCustomers != null )
        {                    
          this.listCostumers = dataCustomers['object']['records'];

        }
        this.miscService.endRquest();	
    },
    (err : any) =>
    {
        this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
        this.miscService.endRquest();
    });
      

  }
  private save() {

    this.form.value['vehicleCostumerId'] = this.form.value['vehicleCostumerId'].toString();
    this.vehicleService.create(this.form.value)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/vehicles']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }
}

