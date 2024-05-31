import { Component, OnDestroy, OnInit } from '@angular/core';
import { MiscService } from 'src/app/service/misc.service';
import { VehicleService } from 'src/app/service/vehicle.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
    templateUrl: './edit.vehicle.component.html'
})
export class EditVehicleComponent implements OnInit, OnDestroy {
    submitted: boolean = false;
    id:number;
    form: FormGroup | any;
    locationCoordenates: string;
    listCostumers : any[] = [];
    constructor(
        private formBuilder: FormBuilder,
        private vehicleService: VehicleService, 
        private messageService: MessageService, 
        private costumerService : CostumerService,
        private miscService:MiscService,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }


    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
		    this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
            vehicleCostumerId:[null, [Validators.required]],
            vehicleBrand: [null, [Validators.required, Validators.maxLength(100)]],
            vehicleModel: [null, [Validators.required, Validators.maxLength(250)]],
            vehicleYear: [null, [Validators.required, Validators.maxLength(17)]],
            vehicleVin: [null, [Validators.required, Validators.maxLength(250)]],
            vehiclePlateNumber: [null, [Validators.required, Validators.maxLength(250)]],
            vehicleColor: [null, [Validators.required, Validators.maxLength(250)]],
         }, formOptions);


        /*this.vehicleService.getById(this.id)
        .subscribe(data => {
           this.form.patchValue(data);

        })*/
        this.getInfo();		
    }

    ngOnDestroy() {
       
    }

    onSubmit() 
	{
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
    getInfo(){
       
        this.miscService.startRequest();

        
        const costumers = this.costumerService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de suministros", detail:error.message });
                return of(null); 
            })
        );
        
        const getVehicle = this.vehicleService.getById(this.id).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al ", detail:error.message });
                return of(null);
            })
        );		
        
        
            
        forkJoin([costumers,getVehicle]).subscribe(([dataCostumers,dataVehicle] )=>
        {
            if(dataCostumers != null )
                this.listCostumers =  dataCostumers['object']['records'];     

            if(dataVehicle != null )
                this.form.patchValue(dataVehicle); 
            
            console.log(dataVehicle);
            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }
    private save()  
    {

        this.form.value['vehicleCostumerId'] = this.form.value['vehicleCostumerId'].toString();
        this.vehicleService.update(this.form.value)
        .subscribe(data =>
            {
            this.miscService.endRquest();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
            this.router.navigate(['/vehicles']);  
            }, (err : any) => 
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
                this.miscService.endRquest();
            }); 
    } 
    
}
