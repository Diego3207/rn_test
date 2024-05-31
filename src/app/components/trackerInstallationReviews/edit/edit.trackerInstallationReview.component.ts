import { Component, ElementRef, NgZone, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MiscService } from 'src/app/service/misc.service';
import { TrackerInstallationReviewService } from 'src/app/service/trackerInstallationReview.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { TrackerService } from 'src/app/service/tracker.service';
import { InstallerService } from 'src/app/service/installer.service';
import { TrackerInstallationReviewEvidenceService  } from 'src/app/service/trackerInstallationReviewEvidence.service'; 
import { VehicleService } from 'src/app/service/vehicle.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute,Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/service/file.service';
import { EvidenceInstallationService } from 'src/app/service/evidenceInstallation.service';




@Component({
    templateUrl: './edit.trackerInstallationReview.component.html',
    providers: [DatePipe]
})
export class EditTrackerInstallationReviewComponent implements OnInit, OnDestroy {
    @ViewChild('search') searchElementRef!: ElementRef;

    @ViewChild('fileUpload') fileUpload: FileUpload;
    files : any[] = [];
    uploadedFiles: any[] = []; //lista de archivos por cargar
    submitted: boolean = false;
    id:number;
    form: FormGroup | any;
    listUninstallers : any[] = [];
    deletedEvidences: any[] = [];
    listMimeType = ['application/pdf','image/png', 'image/jpeg'];
    dataUninstall = {}; 
                                                    


    constructor(
        private formBuilder: FormBuilder,
        private trackerInstallationReviewService: TrackerInstallationReviewService, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private installerService: InstallerService,
        private trackerInstallationReviewEvidenceService : TrackerInstallationReviewEvidenceService,
        private evidenceInstallationService : EvidenceInstallationService,
        private miscService:MiscService,
        private ngZone: NgZone,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private fileService:FileService,
        private router: Router ) 
    {
    }

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
                this.form.controls.trackerInstallationReviewAddress.setValue(place.formatted_address);
            });
        });
    }  

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);

        this.form = this.formBuilder.group({
            id:this.id,
            trackerInstallationReviewTrackerInstallationId: null,
            trackerInstallationReviewTechnicalUserId:[null, [Validators.required]],
            trackerInstallationReviewAddress: [null, [Validators.required,Validators.maxLength(255)]],
            trackerInstallationReviewDate : [null, [Validators.required]],
            trackerInstallationReviewObservation:'',
            
        }, formOptions);
       
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
        this.router.navigate(['/trackerInstallationReviews']);
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
        console.log(obj);
        this.uploadedFiles = this.uploadedFiles.filter(e => e.file != obj.file);
        this.fileUpload.files = this.fileUpload.files.filter(e => e != obj.file);
        if(obj.id !== null)
            this.deletedEvidences.push(obj);
    }
    saveEvidence(id:string)
    {     
        //1. solo guardar la evidencia nueva con su descripcion
        let newFiles = this.uploadedFiles.filter(e => !e.hasOwnProperty("id")) ;
        let descriptions = this.uploadedFiles.filter(e=> e.id== null) ;
    
        if(newFiles.length > 0)
        {	
                var peticiones: any[] = []; 
                let descriptions = [];

                for(let i = 0 ; i < newFiles.length; i++)
                {
                    
                        const ptt = this.fileService.upload(newFiles[i].file, 'tracker_installation_evidence').pipe
                        (
                            catchError((error) => 
                            {
                                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
                        return of(null);
                            })
                        );				
                        peticiones.push(ptt);
                        descriptions.push(newFiles[i].description);   
                            
                }
                
                forkJoin(peticiones).subscribe((data: any[]) => 
                {
                    let files : any[] = [];
                    for(let i = 0 ; i < data.length; i++)
                    {
                        if(data[i] != null){
                            files.push({
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
    private saveEvidenceFiles(idInstallationReview,files)
    {
    
        var peticiones: any[] = [];

        for(let i = 0 ; i < files.length; i++)
        {
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
            this.saveEvidenceInstallationReview(idInstallationReview,data);
            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); 
        }, 
        err => 
        {		
            this.miscService.endRquest(); 
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
        }); 
    }
    saveEvidenceInstallationReview(idInstallationReview:number,arrayEvidenceID:any[]){
        let actions = [];
        let service = this.trackerInstallationReviewEvidenceService;
        arrayEvidenceID.forEach(function (obj) {
          if(obj != null){
    
            let object = { trackerInstallationReviewEvidenceTrackerInstallationReviewId: idInstallationReview.toString(),trackerInstallationReviewEvidenceEvidenceInstallationId :obj['newId'].toString()}
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
      
private save()  
{
         
    this.miscService.startRequest();

    let review = {};

    Object.keys(this.form.value).forEach(element => {
        if(element == "trackerInstallationReviewTechnicalUserId"  || element == "trackerInstallationReviewTrackerInstallationId"){
            review[element] = this.form.value[element].toString();  
        }else{
            review[element] = this.form.value[element];  
        }
           
      });
     
      review['trackerInstallationReviewDate'] = this.datePipe.transform(this.form.value['trackerInstallationReviewDate'], 'yyyy-MM-dd HH:mm:ss');
  
    this.trackerInstallationReviewService.update(review)
        .subscribe(data => {
            //this.miscService.endRquest(); 
            const actions = [];
            
            if(this.uploadedFiles.length > 0){
                this.uploadedFiles.forEach((obj,index) => {
                  //  console.log(obj);
                   
                    if(obj['id'] != null) //id == null fueron guardados al subir la evidencia
                    {
                        // update  
                        //console.log(obj);             
                        const update = this.evidenceInstallationService.update({id:obj.idEvidenceInstallation, evidenceInstallationDescription:obj.description})
                        .pipe(
                            catchError((error) => 
                            {
                                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error ", detail:"Al actualizar descripción de evidencia:"+error.message });
                                return of(null);
                            })
                        );		
                        actions.push(update);
                    }
                });
                
               
                this.saveEvidence(this.form.value['id'].toString());

                //-Delete evidence
                this.deletedEvidences.forEach(obj => {
                    // update
                    const tblReview = this.trackerInstallationReviewEvidenceService.delete(obj.id).pipe
                    (
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar archivos de la base de datos de tabla intermedia", detail:error.message });
                            return of(null);
                        })
                    );	


                    actions.push(tblReview);	

                    const tblEvidencie = this.evidenceInstallationService.delete(obj.idEvidenceInstallation).pipe
                    (
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar archivos de la base de datos de datos tabla global", detail:error.message });
                            return of(null);
                        })
                    );	

                    actions.push(tblEvidencie);
                });

            }

            if(actions.length > 0){
                forkJoin(actions).subscribe(([] :any)=>
                {
                    this.miscService.endRquest();
                    this.router.navigate(['/trackerInstallationReviews']);
                },
                (err:any)=>{
                    this.miscService.endRquest();
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar", detail:err.message });
                });
            }else{
                this.miscService.endRquest();
                this.router.navigate(['/trackerInstallationReviews']);
            }
    
        }, (err: any) => {
            this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
            this.miscService.endRquest();
        });
      
    } 
   
    getInfo(){

        this.miscService.startRequest();
      
      
        
        const installers = this.installerService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de instaladores", detail:error.message });
                return of(null); 
            })
        );
        const review = this.trackerInstallationReviewService.getById(this.id)
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al traer información de la revisión", detail:error.message });
                return of(null); 
            })
        );

        
        
       
        forkJoin([installers,review]).subscribe(  ([dataInstallers,dataReview] )=>
        {
            
    
           
            if(dataInstallers != null)
              this.listUninstallers = dataInstallers['object']['records']; 
           

            
            if(dataReview!= null) {

                this.dataUninstall = dataReview;
            
                //Asigna valores
                
                for (let i=0; i < dataReview['trackerInstallationReviewEvidences'].length; i++){

                    let row = dataReview['trackerInstallationReviewEvidences'][i];

                    let mimeType =  this.getMimeType(row['trackerInstallationReviewEvidenceEvidenceInstallationId']['evidenceInstallationName'])[0];

                    let obj = {
                        //id:row['id'],
                        name: row['trackerInstallationReviewEvidenceEvidenceInstallationId']['evidenceInstallationName'],
                        size: row['trackerInstallationReviewEvidenceEvidenceInstallationId']['evidenceInstallationSize'] * 1024,
                        type: mimeType,
                        objectURL:this.fileService.downloadServer(row['trackerInstallationReviewEvidenceEvidenceInstallationId']['evidenceInstallationPath'])
                    }

                    this.uploadedFiles.push({id:row['id'],idEvidenceInstallation:row['trackerInstallationReviewEvidenceEvidenceInstallationId']['id'],file:obj, description:row['trackerInstallationReviewEvidenceEvidenceInstallationId']['evidenceInstallationDescription']});               

                }



                dataReview['trackerInstallationReviewDate'] = new Date(dataReview['trackerInstallationReviewDate']);

                this.form.patchValue(dataReview);
               
               
            }
                
           
            this.miscService.endRquest();	
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
          
    
    }
    
   
    getMimeType(text:string){
        let ext =  text.split(".");

        if(ext[1] == 'jpg' ) 
            ext[1]= 'jpeg';

        return this.listMimeType.filter(element => {
            return element.includes(ext[1]);
         });

    }
    
}
