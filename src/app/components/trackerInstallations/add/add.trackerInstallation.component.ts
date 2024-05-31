import { Component, ViewChild } from '@angular/core';
import { TrackerInstallationService } from 'src/app/service/trackerInstallation.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { TrackerService } from 'src/app/service/tracker.service';
import { InstallerService } from 'src/app/service/installer.service';
import { TrackerInstallationEvidenceService  } from 'src/app/service/trackerInstallationEvidence.service'; 
import { EvidenceInstallationService  } from 'src/app/service/evidenceInstallation.service'; 
import { TrackerInstallationAccessoryService  } from 'src/app/service/trackerInstallationAccessory.service';
import { VehicleService } from 'src/app/service/vehicle.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute,Router } from '@angular/router';

import { MiscService } from 'src/app/service/misc.service';
import { MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/service/file.service';


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  templateUrl: './add.trackerInstallation.component.html',
  providers: [DatePipe]
})

export class AddTrackerInstallationComponent {
  @ViewChild('fileUpload') fileUpload: FileUpload;
  files : any[] = [];
  uploadedFiles: any[] = []; //lista de archivos por cargar
  submitted: boolean = false;
  form: FormGroup | any;
  TrackerInstallationCoordenates: string;
  listCustumers : any[] = [];
  listTrackers : any[] = [];
  listInstallers : any[] = [];
  listVehicles : any[] = [];
  listAccessories : any[] = [];
  listTypeCuts : any[] = [];
  listFilteredTypeCuts : any[] = [];
  listDescriptions : any[] = [];
  listFilteredDescriptions : any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private trackerInstallationService: TrackerInstallationService,
    private costumerService: CostumerService,
    private trackerService: TrackerService,
    private installerService: InstallerService,
    private productService: ProductService,
    private vehicleService: VehicleService,
    private trackerInstallationAccessoryService : TrackerInstallationAccessoryService,
    private trackerInstallationEvidenceService : TrackerInstallationEvidenceService,
    private evidenceInstallationService : EvidenceInstallationService,
    private messageService: MessageService,
    private miscService: MiscService,
    private fileService:FileService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
        trackerInstallationCostumerId: [null, [Validators.required]],
        trackerInstallationVehicleId:[null, [Validators.required]],
        trackerInstallationTrackerId: [null, [Validators.required]],
        trackerInstallationInstallerId: [null, [Validators.required]],
        trackerInstallationDate: [null, [Validators.required]],
        trackerInstallationEngineStop: [false,[Validators.required]],
        trackerInstallationTypeCut: [null, [Validators.required, Validators.maxLength(100)]],
        trackerInstallationAccessories: this.formBuilder.array([],[this. isAccessoryDuplicated]),
        trackerInstallationLocation: [null, [Validators.required, Validators.maxLength(100)]],
        
    }, formOptions);

    if(this.route.snapshot.paramMap.get('idCustomer') && this.route.snapshot.paramMap.get('idVehicle') )
    {
      this.form.controls['trackerInstallationCostumerId'].setValue(parseInt(this.route.snapshot.paramMap.get('idCustomer')));  
      this.getInfoCustomer(parseInt(this.route.snapshot.paramMap.get('idCustomer')));
      this.form.controls['trackerInstallationVehicleId'].setValue(parseInt(this.route.snapshot.paramMap.get('idVehicle')));  

    }

    this.getLists();

    this.form.get("trackerInstallationCostumerId").valueChanges.subscribe(selectedValue => {
      if(selectedValue != null)
        this.getInfoCustomer(selectedValue);
      
    });

    this.listTypeCuts =
    [
     'Ignición',
     'Bomba de gasolina',
     'Marcha'
    ];

    this.listDescriptions=
    [

      'Foto delantera del vehículo donde se aprecie la placa (Frontal)',
      'Foto del vehículo completo, esquinada (lateral general)',
      'Foto VIN de la unidad',
      'Equipo (donde se pueda ver el IMEI enviar antes de desconectar o ser intervenido).',
      'En caso de ser instalación nueva o cambio enviar IMEI de equipo que se conectara.',
      'Foto del tablero antes de la instalación (Tablero de relojes y testigos).',
      'Foto de donde se conectó el equipo (Toma de corriente).',
      'Foto de donde quedó oculto el equipo, indicando la ubicación en texto.',
      'Foto de conexión a tierra. ',
     'Foto del relevador y a donde quedo conectado (ignición, bomba de gasolina o marcha). ',
      'Foto de instalación de accesorios en caso de que aplique. ',
     'Foto del tablero después de la instalación (Tablero de relojes y testigos). ',
      'Foto de la unidad terminada'
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
  infoAccessoriesArray(): FormArray {
    return this.form.get('trackerInstallationAccessories') as FormArray;
  }

  addRow(){
     
    this.infoAccessoriesArray().push(this.newAccessoryArray()); 
      
  }
  removeRow(index:number){
    
      this.infoAccessoriesArray().removeAt(index); 
       
  }
  newAccessoryArray() {
    return this.formBuilder.group({
      trackerInstallationAccessoryProductId:  [null,[Validators.required]],
    });
  }
  isAccessoryDuplicated(control: FormArray){
    const uniqueValues = new Set();
    
    for (const item of control.controls) 
    {

    const obj = item.value. trackerInstallationAccessoryProductId
        if (uniqueValues.has(obj)) 
        {
            return { duplicated: true }; 
        }          
           
        uniqueValues.add(obj);
    }
        

    return null; //en este punto no hay error, se regresa null	
  }
  getLabel(id:number){
    let text = '';

    if(id != null )
        text = (this.listAccessories.find((obj) => obj.value ==  id)).label;

    return  text;
  }
  cancel(event) {
    event.preventDefault(); //
    this.router.navigate(['/trackerInstallations']);
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
   
  
    const installers = this.installerService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de instaladores", detail:error.message });
            return of(null); 
        })
    );
    const accessories = this.productService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
            return of(null); 
        })
    );
    

    forkJoin([customers,  installers, accessories]).subscribe(  ([dataCustomers,dataInstallers,dataAccessories] )=>
    {
        

        if(dataCustomers != null)
            this.listCustumers = dataCustomers['object']['records'];       

      
        
        if(dataInstallers != null)
          this.listInstallers = dataInstallers['object']['records']; 
        
        if(dataAccessories != null)
        {
          dataAccessories['object']['records'].forEach(element => {
            if(element['productCategoryId']['id'] == 3)
              this.listAccessories.push({'label':element['productBrand']+" "+ element['productModel'],'value':element['id']});
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
  getInfoCustomer(value:number){

    const trackers =  this.trackerService.getList(1,'{"customer_id":'+value+'}')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de rastreadores", detail:error.message });
            return of(null); 
        })
    );

     const vehicles = this.vehicleService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"vehicleCostumerId"}]',0,1,'[{"id":"asc"}]')

    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de vehiculos", detail:error.message });
            return of(null); 
        })
    );
    forkJoin([trackers,vehicles]).subscribe(([dataTrackers,dataVehicles])=>
    {
      if(dataTrackers != null){
        this.listTrackers = [];    
        dataTrackers['object'].forEach(element => {
            //if(element['trackerStatus']== 'nuevo')
            this.listTrackers.push({'label':element['trackerImei']+" / "+ element['trackerStatus'].toUpperCase(),'value':element['id']});
        });

      }else{
        this.listTrackers = [];
        this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin rastreadores disponibles para el cliente seleccionado', life: 4000 });
      }

      if(dataVehicles != null){
        this.listVehicles =  dataVehicles['object']['records']; 
      }else{
        this.listVehicles = [];
        this.messageService.add({ severity: 'warn', key: 'msg', summary: 'Advertencia', detail: 'Sin vehiculos relacionados para el cliente seleccionado', life: 4000 });

      }
      this.miscService.endRquest();
               
      },
      (err:any)=>{
        this.miscService.endRquest();
        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar accesorios", detail:err.message });
      });
    

  }

  onUpload(event: any) 
	{
      this.files = event.currentFiles;
     
      for(let i = 0 ; i < this.files.length; i++)
      {
      
        if(this.uploadedFiles.findIndex(item => item.file == this.files[i]) === -1){
           this.uploadedFiles.push({file:this.files[i],description:''});
          
           //asigna valores del File 
        }else {
          //PENDIENTE MEJORAR
        }
      } 
  }

  
  removeFile(obj:any){
      this.uploadedFiles = this.uploadedFiles.filter(e => e.file != obj.file);
      this.fileUpload.files = this.uploadedFiles;
      //this.removeRow('evidence',i);
  }
  saveEvidence(id:string)
  {     
        
    if(this.uploadedFiles.length > 0)
    {	
            var peticiones: any[] = []; 
            let descriptions = [];
            for(let i = 0 ; i < this.uploadedFiles.length; i++)
            {
                const ptt = this.fileService.upload(this.uploadedFiles[i].file, 'tracker_installation_evidence').pipe
                (
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
                return of(null);
                    })
                );				
                peticiones.push(ptt);			
                descriptions.push(this.uploadedFiles[i].description);        
            }
            
            forkJoin(peticiones).subscribe((data: any[]) => 
            {
                let files : any[] = [];
                for(let i = 0 ; i < data.length; i++)
                {
                    if(data[i] != null){
                        files.push({
                          //trackerInstallationEvidenceTrackerInstallationId: id,
                          evidenceInstallationPath: data[i].files[0].fd,
                          evidenceInstallationName : data[i].files[0].filename,
                          evidenceInstallationSize : (data[i].files[0].size / 1024).toFixed(2),
                          evidenceInstallationDescription :descriptions[i]                    
                        });
                    }           
                }
                this.saveEvidenceFiles(id,files);
            }, 
            err => 
            {		
                this.miscService.endRquest(); 
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
            }); 
    }
    else
    {
      this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }

    }
  private saveEvidenceFiles(idInstallation,files)
    {
    
        var peticiones: any[] = [];

        for(let i = 0 ; i < files.length; i++)
        {
          //aqui guardar en tabla gral
            peticiones.push(this.evidenceInstallationService.create(files[i]).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo "+ (i+1), detail:error.message });
                    return of(null);
                })
            ));	
        }

        forkJoin(peticiones).subscribe((data: any[]) => 
        {
            // aqui tabla intermedia de instalacion evidencia
           
            this.saveEvidenceInstallation(idInstallation,data);

            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
        }); 
  }
  saveEvidenceInstallation(idInstallation:number,arrayEvidenceID:any[]){
    let actions = [];
    let service = this.trackerInstallationEvidenceService;
    arrayEvidenceID.forEach(function (obj) {
      if(obj != null){

        let object = {trackerInstallationEvidenceTrackerInstallationId:idInstallation.toString(),trackerInstallationEvidenceEvidenceInstallationId  :obj['newId'].toString()}
        //console.log(object);
        const ptt= service.create(object).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar relacion entre instalacion y evidencia", detail:error.message });
                    return of(null);
                })
            );
        actions.push(ptt);	
      }
    
    });
    forkJoin(actions).subscribe((data: any[]) => 
        {
           
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error  general al guardar relacion entre instalacion y evidencia", detail:err.message });
        }); 

  }


  filterTypeCuts(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listTypeCuts as any[]).length; i++) {
        let type = (this.listTypeCuts as any[])[i];
        if (type.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(type);
        }
    }

    this.listFilteredTypeCuts = filtered;
  }

  filterDescriptions(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listDescriptions as any[]).length; i++) {
        let desc = (this.listDescriptions as any[])[i];
        if (desc.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(desc);
        }
    }

    this.listFilteredDescriptions = filtered;
  }

  private save() {
    this.miscService.startRequest();

    let installation = {};

    Object.keys(this.form.value).forEach(element => {
      if(element != "trackerInstallationAccessories"  && element != 'trackerInstallationEvidences')
        installation[element] = this.form.value[element];   
    });
   
    installation['trackerInstallationCostumerId'] = installation['trackerInstallationCostumerId'].toString(); 
    installation['trackerInstallationVehicleId'] = installation['trackerInstallationVehicleId'].toString();
    installation['trackerInstallationTrackerId'] =  installation['trackerInstallationTrackerId'].toString(); 
    installation['trackerInstallationInstallerId'] =  installation['trackerInstallationInstallerId'].toString();
    installation['trackerInstallationDate'] = this.datePipe.transform(this.form.value['trackerInstallationDate'], 'yyyy-MM-dd HH:mm:ss');

    this.trackerInstallationService.create(installation)
    .subscribe(data => {
        this.miscService.endRquest();
          
            if(this.uploadedFiles.length > 0)
              this.saveEvidence((data['newId']).toString());

            const actions = [];
            // update
            const update = this.trackerService.update({id:installation['trackerInstallationTrackerId'],trackerStatus:"activo"}).pipe(
              catchError((error) => 
              {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar estado de rastreador", detail:error.message });
                return of(null);
              })
            );		
            actions.push(update);

            if(this.form.value['trackerInstallationAccessories'].length > 0 ){
              
              this.form.value['trackerInstallationAccessories'].forEach(obj => {
                let accessory = {};
                accessory['trackerInstallationAccessoryTrackerInstallationId'] = (data['newId']).toString();
                accessory['trackerInstallationAccessoryProductId'] =  obj['trackerInstallationAccessoryProductId'].toString();


                const ptt = this.trackerInstallationAccessoryService.create(accessory).pipe(
                  catchError((error) => 
                  {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al agregar el accesorio", detail:error.message });
                    return of(null);
                  })
                );		
                actions.push(ptt);
              });

             
          }

          forkJoin(actions).subscribe(([] :any)=>
          {
            this.miscService.endRquest();
            this.router.navigate(['/trackerInstallations']);
          },
          (err:any)=>{
            this.miscService.endRquest();
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar infomación", detail:err.message });
          });




    }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar instalación', life: 3000 });
        this.miscService.endRquest();
    });
  }
}

