import { Component } from '@angular/core';
import { SimCardService } from 'src/app/service/simCard.service';
import { SupplyService } from 'src/app/service/supply.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Component({
  templateUrl: './add.simCards.component.html'
})

export class AddSimCardsComponent {
  submitted: boolean = false;
  form: FormGroup | any;
  listSupplies: any[] = [];
  tsp: any[] =  [];

  constructor(
    private formBuilder: FormBuilder,
    private simCardService: SimCardService,
    private messageService: MessageService,
    private miscService: MiscService,
    private supplyService: SupplyService,
    private confirmationService: ConfirmationService,
    private router: Router) {
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
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

    this.list();
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
    this.router.navigate(['/simCards']);
  }

  private save() {
    let productProperties = {};
    Object.keys(this.form.value).forEach(element => {
        productProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal        
    });
  
    productProperties['simCardSupplyId'] = (productProperties['simCardSupplyId']).toString();

    this.simCardService.create(productProperties)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/simCards']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail:err.message , life: 3000 });
        this.miscService.endRquest();
      });
      
  }

  list(){

    this.miscService.startRequest();

    this.supplyService.getList(2,null)
    .subscribe(data => {
      
      if(data != null )
      {                    
        data['object'].forEach(element => 
          {
            this.listSupplies.push({label:  "Producto: "+element['product']+" / ICCID: "+element['supplyKey'],value: element['id']});
          });

         
      }else{
        this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin  suministros disponibles de tipo SIM para relacionar', life: 3000 });
        
      }
      this.miscService.endRquest();   
    }, (err: any) => {
      this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
      this.miscService.endRquest();   
    });
  }
}

