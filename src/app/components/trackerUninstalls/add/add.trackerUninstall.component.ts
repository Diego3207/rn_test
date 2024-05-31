import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { TrackerInstallationService } from 'src/app/service/trackerInstallation.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { TrackerService } from 'src/app/service/tracker.service';
import { InstallerService } from 'src/app/service/installer.service';
import { TrackerInstallationEvidenceService  } from 'src/app/service/trackerInstallationEvidence.service'; 
import { TrackerInstallationAccessoryService  } from 'src/app/service/trackerInstallationAccessory.service';
import { VehicleService } from 'src/app/service/vehicle.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';

import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/service/file.service';
import { SessionService } from 'src/app/service/session.service';
import { EvidenceInstallationService } from 'src/app/service/evidenceInstallation.service';
import { TrackerUninstallEvidenceService  } from 'src/app/service/trackerUninstallEvidence.service'; 
import { TrackerUninstallService  } from 'src/app/service/trackerUninstall.service'; 
import {  } from 'primeng/api';





interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  templateUrl: './add.trackerUninstall.component.html',
  providers: [DatePipe]
})

export class AddTrackerUninstallComponent {
  @ViewChild('fileUpload') fileUpload: FileUpload;
  @ViewChild('search') searchElementRef!: ElementRef;
  files : any[] = [];
  uploadedFiles: any[] = []; //lista de archivos por cargar
  submitted: boolean = false;
  form: FormGroup | any;
  listUninstallers : any[] = [];
  visible: boolean;
  idTrackerInstallation:number;
  installationInfo = {};


  constructor(
    private formBuilder: FormBuilder,
    private trackerInstallationService: TrackerInstallationService,
    private installerService: InstallerService,
    private trackerUninstallEvidenceService : TrackerUninstallEvidenceService,
    private trackerUninstallService: TrackerUninstallService,
    private trackerService: TrackerService,

    private trackerInstallationAccessoryService : TrackerInstallationAccessoryService,
    private trackerInstallationEvidenceService : TrackerInstallationEvidenceService,
    private messageService: MessageService,
    private miscService: MiscService,
    private sessionService:SessionService,
    private fileService:FileService,
    private route: ActivatedRoute,
    private evidenceInstallationService : EvidenceInstallationService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private ngZone: NgZone,
    private router: Router) { }


    ngAfterViewInit(): void {
      // Binding autocomplete to search input control
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
  
      autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
          //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
              return;
              }
              this.form.controls.trackerUninstallAddress.setValue(place.formatted_address);
          });
      });
  }  
  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };

    this.idTrackerInstallation = parseInt(this.route.snapshot.params['idx']);

    this.form = this.formBuilder.group({

        trackerUninstallTrackerInstallationId: this.idTrackerInstallation,
        trackerUninstallAddress:[null, [Validators.required]],
        trackerUninstallDate: [null, [Validators.required]],
        trackerUninstallObservation :'',
        trackerUninstallTrackerIsNotFunctional :[false, [Validators.required]],
        trackerUninstallUninstallerUserId:[null, [Validators.required]] ,
        trackerUninstallRegisteredUserId : [this.sessionService.getUserId(),[Validators.required]],
        
    }, formOptions);

    this.getInfo();


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
    this.router.navigate(['/trackerUninstalls']);
  }  
  
  getInfo(){

    this.miscService.startRequest();
  
    const installation = this.trackerInstallationService.getById(this.idTrackerInstallation)
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar informacion de instalacion", detail:error.message });
            return of(null); 
        })
    );
   
   
    const uninstallers = this.installerService.getAll(0,1,'[{"id":"asc"}]')
    .pipe(
        catchError((error) => 
        {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de instaladores", detail:error.message });
            return of(null); 
        })
    );
    

    forkJoin([installation, uninstallers]).subscribe(  ([dataInstallation,dataInistallers] )=>
    {
        console.log(dataInstallation);
        if(dataInstallation != null)
             this.installationInfo = dataInstallation;       

        if(dataInistallers != null)
          this.listUninstallers = dataInistallers['object']['records']; 
        
      
        this.miscService.endRquest();	
    },
    (err : any) =>
    {
        this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
        this.miscService.endRquest();
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
      this.uploadedFiles = this.uploadedFiles.filter(e => e.file != obj);
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
  private saveEvidenceFiles(idUninstall,files)
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
            //contrir peticion 

            
            this.saveEvidenceUninstall(idUninstall,data);

            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
        }); 
  }
  saveEvidenceUninstall(idUninstall:number,arrayEvidenceID:any[]){
    let actions = [];
    let service = this.trackerUninstallEvidenceService;
    arrayEvidenceID.forEach(function (obj) {
      if(obj != null){

        let object = { trackerUninstallEvidenceTrackerUninstallId:idUninstall.toString(),trackerUninstallEvidenceEvidenceInstallationId  :obj['newId'].toString()}
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
           
            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error  general al guardar relacion entre instalacion y evidencia", detail:err.message });
        }); 

  }

  private save() {
    this.miscService.startRequest();

    let uninstall = {};
   // return;
    Object.keys(this.form.value).forEach(element => {
      if(element == "trackerUninstallTrackerInstallationId"  || element == "trackerUninstallUninstallerUserId"){
        uninstall[element] = this.form.value[element].toString();  
      }else if(element != 'trackerUninstallTrackerIsNotFunctional'){
        uninstall[element] = this.form.value[element];  
      }
         
    });
   
    uninstall['trackerUninstallDate'] = this.datePipe.transform(this.form.value['trackerUninstallDate'], 'yyyy-MM-dd HH:mm:ss');

    this.trackerUninstallService.create(uninstall)
    .subscribe(data => {
        this.miscService.endRquest();
          
            if(this.uploadedFiles.length > 0)
              this.saveEvidence((data['newId']).toString());

            const actions = [];
            
            // update instalacion
            const updateInstallation = this.trackerInstallationService.update({id:this.idTrackerInstallation,trackerInstallationIsUninstalled:true}).pipe(

              catchError((error) => 
              {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar Instalacion", detail:error.message });
                return of(null);
              })
            );		
            actions.push(updateInstallation);

            // update tracker
            if(this.form.value['trackerUninstallTrackerIsNotFunctional']){
                const updateTracker = this.trackerService.update({id:this.installationInfo['trackerInstallationTrackerId']['id'],trackerStatus:'baja', trackerIsNotFunctional:this.form.value['trackerUninstallTrackerIsNotFunctional']}).pipe(
                  catchError((error) => 
                  {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar rastreador de la instalacion", detail:error.message });
                    return of(null);
                  })
                );		
                actions.push(updateTracker);
            }

                        
         //comprobar que se hace con el equipo si se cambio a algun estados en el inventario

          forkJoin(actions).subscribe(([] :any)=>
          {
            this.miscService.endRquest();
            
            //Aqui mandar parametros para hacer una nueva instalacion
            this.confirmNewInstallation();

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

   confirmNewInstallation() {
    
        this.confirmationService.confirm({
          header :'Confirmar' ,
          message:'¿Desea  agregar nueva instalación  con el mismo cliente y/o vehículo de instalación que fue afectada?',
          icon: 'pi pi-info-circle',
          acceptLabel: 'SI',
          rejectLabel:'NO',
            accept: () => {
              //add/:idCustomer/:idVehicle'
                this.router.navigate( ['trackerInstallations/add', {idCustomer:  this.installationInfo['trackerInstallationCostumerId']['id'], idVehicle:  this.installationInfo['trackerInstallationVehicleId']['id']}]);
''
            },
            reject: (type) => {
              this.router.navigate(['/trackerUninstalls']);
            }
        });
    }

  showDialog() {
    this.visible = true;
  }
}

