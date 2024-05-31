import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AssociationService } from 'src/app/service/association.service';
import { QuotationSaleServiceService } from 'src/app/service/quotationSaleService.service';
import { TrackerInstallationService } from 'src/app/service/trackerInstallation.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';


@Component({
  templateUrl: './add.association.component.html'
})

export class AddAssociationComponent {
  submitted: boolean = false;
  form: FormGroup | any;
  listServices : any[] = [];
  listInstallations : any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private messageService: MessageService,
    private miscService: MiscService,
    private quotationSaleServiceService: QuotationSaleServiceService, 
    private trackerInstallationService: TrackerInstallationService, 
    private router: Router) {
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
      associationTrackerServiceQuotationSaleServiceId: [null, Validators.required],
      associationTrackerServiceTrackerInstallationId: [null, Validators.required],
    }, formOptions);
    
    this.getLists();
  }

  getLists(){
    this.miscService.startRequest();
  
    const quotationSaleServices = this.quotationSaleServiceService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de clientes", detail:error.message });
            return of(null); 
        })
    );
   
  
    const trackerInstallations = this.trackerInstallationService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de instaladores", detail:error.message });
            return of(null); 
        })
    );    

    forkJoin([ quotationSaleServices,  trackerInstallations ]).subscribe(  ([ dataQuotationSaleServices , dataTrackerInstallations ] )=>
    {
        if(dataQuotationSaleServices != null )
        {                
          dataQuotationSaleServices['object']['records'].forEach(element => 
          {
            if( element['quotationSaleServiceSaleOrderInformation'] != null){
              this.listServices.push({'label': element['quotationSaleServiceQuotationSaleId']['quotationSaleFolio'] +" "+ element['quotationSaleServiceQuotationSaleId']['quotationSaleDescription'] ,'value': element['id']});
            }
          });
        } 

        if(dataTrackerInstallations != null )
        {                
          console.log(dataTrackerInstallations);
          dataTrackerInstallations['object']['records'].forEach(element => 
          {
            //if( element['quotationSaleServiceSaleOrderInformation'] != null){
              this.listInstallations.push({'label': "ID instalación: " + element['id'] +" IMEI: "+ element['trackerInstallationTrackerId']['trackerImei'] ,'value': element['id']});
            //}
          });
        }       
        
        this.miscService.endRquest();	
    },
    (err : any) =>
    {
        this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
        this.miscService.endRquest();
    });
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
    this.router.navigate(['/associations']);
  }

  private save() {

    let properties = {};        
    Object.keys(this.form.value).forEach(element => 
    {
      properties[element] = this.form.value[element];                      
    });

    //Parseamos los id a string
    properties['associationTrackerServiceQuotationSaleServiceId'] = (properties['associationTrackerServiceQuotationSaleServiceId']).toString();
    properties['associationTrackerServiceTrackerInstallationId'] = (properties['associationTrackerServiceTrackerInstallationId']).toString();

    this.associationService.create(properties)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/associations']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }
}

