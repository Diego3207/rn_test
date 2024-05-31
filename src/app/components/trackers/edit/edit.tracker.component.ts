import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, NgZone, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackerService } from 'src/app/service/tracker.service';
import { SupplyService } from 'src/app/service/supply.service';
import { SimCardService } from 'src/app/service/simCard.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';



@Component({
    templateUrl: './edit.tracker.component.html'
})
export class EditTrackerComponent implements OnInit, OnDestroy {
    id:number;
    form: FormGroup | any;    
    listSupplies: any[] = [];
    listSuppliesRaw: any[] = [];
    listSimCards: any[] = [];

   
    constructor(
        private formBuilder: FormBuilder,
        private miscService:MiscService,
        private trackerService: TrackerService, 
        private simCardService: SimCardService,
        private supplyService: SupplyService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private router: Router ) 
    {
    }

    
    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; 

        this.id = parseInt(this.route.snapshot.params['idx']);

		this.form = this.formBuilder.group
		({
            id:[this.id, [Validators.required]],
            trackerSupplyId: [null,[Validators.required]],
            trackerImei: [null, [Validators.required,Validators.maxLength(16)]],
            trackerSimCardId: null,
            trackerMaximumVoltage: 0.00,
            trackerMinimumVoltage: 0.00,
         }, formOptions);
         

         this.getData();

         this.form.get("trackerSupplyId").valueChanges.subscribe(selectedValue => 
            {
                this.listSuppliesRaw['object'].forEach(element => {
                    if(element.id == selectedValue ){
                        this.form.controls.trackerImei.setValue(element.supplyKey);
                    }
                });
            }); 
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{


        if (this.form.invalid) {
            //this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });
            return;
        }

        this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/trackers']);
    }
    
    private save(){
        this.miscService.startRequest();  
        
        this.form.value.trackerSupplyId = (this.form.value.trackerSupplyId).toString();
        this.form.value.trackerSimCardId = (this.form.value.trackerSimCardId).toString();

        this.trackerService.update(this.form.value)
        .subscribe(data =>{
           
            this.router.navigate(['/trackers']);
            this.miscService.endRquest();  

        },  (err : any)=> {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
            this.miscService.endRquest(); 
        });
        
   }
    getData(){

        this.miscService.startRequest();

        const supplies = this.supplyService.getList(1,null)
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de suministros", detail:error.message });
				return of(null); 
			})
		);

        const sims = this.simCardService.getList(1,null)

        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de lineas", detail:error.message });
				return of(null); 
			})
		);
       
        
        const getTracker = this.trackerService.getById(this.id).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información de rastreador ", detail:error.message });
                return of(null);
            })
        );		
        
        
        

        forkJoin([supplies,sims,getTracker]).subscribe(([dataSupplies,dataSims,dataTracker] )=>
        {
            if(dataSupplies != null )
            {                    
                this.listSuppliesRaw = dataSupplies;   
                dataSupplies['object'].forEach(element => {
                    this.listSupplies.push({'label':  "Producto: "+element['product']+" / Serial: "+element['supplyKey'],'value': element['id']});

                });
            }

            if(dataSims != null )
            {               
                dataSims['object'].forEach(element => {
                    this.listSimCards.push({'label':  "ICCID: "+element['iccid'],'value': element['id']});
                });
            }

            if(dataTracker != null )
            {               
                this.getDetail(dataTracker);
            }


            this.miscService.endRquest(); 
        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
    }
    getDetail(data:any){
        const currentSim = this.simCardService.getById(data['trackerSimCardId']).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información de linea actual ", detail:error.message });
                return of(null);
            })
        );
        const currentSupply = this.supplyService.getById(data['trackerSupplyId']).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información  suministro actual", detail:error.message });
                return of(null);
            })
        );

        forkJoin([currentSim,currentSupply]).subscribe(([dataSim,dataSupply] )=>
        {
            if(dataSupply != null )
            {                    
                this.listSupplies.push({'label':  "Producto: "+dataSupply['supplyProductId']['productBrand']+" "+ dataSupply['supplyProductId']['productModel'] +" / Serial: "+dataSupply['supplyKey'],'value': dataSupply['id']});
            }else{
                this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin  suministros disponibles de tipo RASTREADOR para relacionar', life: 4000 });

            }

            if(dataSim != null )
            {  
               this.listSimCards.push({'label':  "ICCID: "+dataSim['simCardSupplyId']['supplyKey'],'value': dataSim['id']});
              
            }else{
                this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin  SIMs disponibles para relacionar', life: 4000 });

            }
             
            this.form.patchValue(data); 
            

        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
    }
}
