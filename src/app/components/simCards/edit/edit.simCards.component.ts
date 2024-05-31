import { Component, ElementRef, NgZone, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/app/service/misc.service';
import { SimCardService } from 'src/app/service/simCard.service';
import { SupplyService } from 'src/app/service/supply.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';




@Component({
    templateUrl: './edit.simCards.component.html'
})
export class EditSimCardsComponent implements OnInit, OnDestroy {
    submitted: boolean = false;
    id:number;
    form: FormGroup | any;
    SimCardsCoordenates: string;
    tsp: any[] =  [];
    listSupplies: any[] = [];


    constructor(
        private formBuilder: FormBuilder,
        private simCardService: SimCardService, 
        private messageService: MessageService, 
        private supplyService: SupplyService,
        private confirmationService: ConfirmationService,
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
            simCardSupplyId: [null,[Validators.required,Validators.maxLength(100)]],
            simCardNumber: [null,[Validators.required,Validators.maxLength(100)]],
            simCardTsp: [null,[Validators.required,Validators.maxLength(100)]],
            simCardServicePlan: [null,[Validators.required,Validators.maxLength(100)]]
         }, formOptions);

         this.tsp = [
            { name: 'Telcel' },
            { name: 'Movistar'},
            { name: 'AT&T'},
            { name: 'Virgin Mobile'},
            { name: 'Unefon'},
            { name: 'CFE'},
          ];

        this.getData();

        	
    }

    ngOnDestroy() {
       
    }

    isValidSimCards(control: FormControl) 
    {
      if ( control.value == null ) {
        return { invalidated: true }; 
      }
      return null;
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
        this.router.navigate(['/simCards']);
    }

    private save()  
    {
    let productProperties = {};
    Object.keys(this.form.value).forEach(element => 
    {
        productProperties[element] = this.form.value[element];     
    });

    productProperties['simCardSupplyId'] = productProperties['simCardSupplyId'].toString();
    // update SimCards 
    this.simCardService.update(productProperties)
    .subscribe(data =>
        {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
        this.router.navigate(['/simCards']);  
        }, (err : any) => 
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
            this.miscService.endRquest();
        }); 
    } 
      
    getData(){

        this.miscService.startRequest();

        const supplies = this.supplyService.getList(2,null)
        .pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de suministros", detail:error.message });
				return of(null); 
			})
		);


        
        const getSim = this.simCardService.getById(this.id).pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información de rastreador ", detail:error.message });
                return of(null);
            })
        );		
        
        
        

        forkJoin([supplies,getSim]).subscribe(([dataSupplies,dataSim] )=>
        {
            if(dataSupplies != null )
            {                    
                dataSupplies['object'].forEach(element => {
                    this.listSupplies.push({'label':  "Producto: "+element['product']+" / Serial: "+element['supplyKey'],'value': element['id']});

                });
            }else{
                this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin  suministros  disponibles  de tipo SIM para relacionar ', life: 3000 });

            }
            

            if(dataSim != null )
            {               
                this.getDetail(dataSim);
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
        
       this.supplyService.getById(data['simCardSupplyId'])
        .subscribe(dataSupply => {
            if(dataSupply != null )
            {                    
                this.listSupplies.push({'label':  "Producto: "+dataSupply['supplyProductId']['productBrand']+" "+ dataSupply['supplyProductId']['productModel'] +" / Serial: "+dataSupply['supplyKey'],'value': dataSupply['id']});
            }

            this.form.patchValue(data); 
        });
      /*  forkJoin([currentSim,currentSupply]).subscribe(([dataSim,dataSupply] )=>
        {
            if(dataSupply != null )
            {                    
                this.listSupplies.push({'label':  "Producto: "+dataSupply['supplyProductId']['productBrand']+" "+ dataSupply['supplyProductId']['productModel'] +" / Serial: "+dataSupply['supplyKey'],'value': dataSupply['id']});
            }

            if(dataSim != null )
            {               
               this.listSimCards.push({'label':  "Número: "+dataSim['simCardNumber'],'value': dataSim['id']});
              
            }

            this.form.patchValue(data); 
            

        },

        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });*/
    }
}
