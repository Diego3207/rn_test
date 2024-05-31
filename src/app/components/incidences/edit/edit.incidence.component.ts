import { Component, OnDestroy, OnInit } from '@angular/core';
import { MiscService } from 'src/app/service/misc.service';
import { IncidenceService } from 'src/app/service/incidence.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { DependencyPhoneService } from 'src/app/service/dependencyPhone.service';
import { IncidenceEvidenceService } from 'src/app/service/indicenceEvidence.service';
import { IncidenceInvolvedDeviceService } from 'src/app/service/incidenceInvolvedDevice.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MonitoringDeviceService } from 'src/app/service/monitoringDevice.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DatePipe, CurrencyPipe,formatDate  } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/service/file.service'; 



@Component({
    templateUrl: './edit.incidence.component.html',
    providers: [DatePipe, CurrencyPipe]

})
export class EditIncidenceComponent implements OnInit, OnDestroy {
    submitted: boolean = false;
    id:number;
    form: FormGroup | any;

    listCostumer: any[] = [];
    listSource: any[] = [];
    listType: any[] = [];
   // listDevices: any[] = [];
    listFilteredDevices: any[] = [];
    listInvolved : any[] = [];
    uploadedFiles: any[] = []; //lista de archivos por cargar
    listPhones :any[]= [];
    dateStart : any = '';
    dateEnd : any = '';


    constructor(
        private formBuilder: FormBuilder,
        private incidenceService: IncidenceService,
        private dependencyPhoneService: DependencyPhoneService,
        private incidenceEvidenceService: IncidenceEvidenceService,
        private incidenceInvolvedDeviceService: IncidenceInvolvedDeviceService,
        private monitoringDeviceService: MonitoringDeviceService,
        private costumerService: CostumerService, 
        private messageService: MessageService, 
        private miscService:MiscService,
        private datePipe: DatePipe,
        private fileService  : FileService,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }

    ngAfterViewInit(): void 
    {
      
    }

    ngOnInit(): void 
    {
      const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
      this.id = parseInt(this.route.snapshot.params['idx']);
      this.form = this.formBuilder.group
      ({
        id:[this.id, Validators.required],
        incidenceCostumerId: [{disabled:true,value:null}, [Validators.required]],
        incidenceSourceInformation: [{disabled:true,value:null}, [Validators.required]],
        incidenceStartDateAttention: this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss'), // se pone al cargar el formulario
        incidenceInformantData:[{disabled:true,value:null}, [Validators.required]],
        incidenceType: [{disabled:true,value:null}, [Validators.required]],
        incidenceQuadrant: {disabled:true,value:''},
        incidenceStartDate: [{disabled:true,value:null}, [Validators.required]],
        incidenceEndDate: [{disabled:true,value:null}, [Validators.required]],
        incidenceCoordinations: this.formBuilder.array([],[this.isCoordinationDuplicated]),
        incidenceDescription:[{disabled:true,value:null},Validators.required],
        incidenceDescriptionInvolvedPeople: {disabled:true,value:''},
        incidenceDescriptionInvolvedVehicles: {disabled:true,value:''},
        incidenceObservation:{disabled:true,value:''},
        //incidenceUserAttendedId:[this.sessionService.getUserId(),[Validators.required]],
        incidenceIsPositive: [{disabled:true,value:null}, [Validators.required]],
        incidenceEndDateAttention: {disabled:true,value:null}, // se pone al momento de guardar la incidencia
        }, formOptions);

      
      this.listSource = [ 
        {label:'Personal del centro de monitoreo',value:'monitoreo'},
        {label:'Cliente',value:'cliente'}
      ];
      this.listType = [ 
        {label:'Operativa',value:'operativa'},
        {label:'Preventiva',value:'preventiva'},
        {label:'Informativa',value:'informativa'}
      ];
  
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
          // this.save();
    }
    cancel(event) {
      event.preventDefault(); //
      this.router.navigate(['/incidences']);
    }
    newCoordinationArray() 
    {
      return this.formBuilder.group({
          
          incidenceCoordinationDependencyPhoneId:[{disabled:true,value:null},[Validators.required]]
      });
    }
    
    infoCoordinationsArray(): FormArray {
      return this.form.get('incidenceCoordinations') as FormArray;
    }
    
    addRow()
    {
        this.infoCoordinationsArray().push(this.newCoordinationArray());
           
    }
    removeRow(index:number)
    {
        this.infoCoordinationsArray().removeAt(index); 
    }
    isCoordinationDuplicated(control: FormArray ) 
    {
        const uniqueValues = new Set();
        for (const item of control.controls) 
        {
  
          const obj = item.value.incidenceCoordinationDependencyPhoneId
          if (uniqueValues.has(obj)) 
          {
            return { duplicated: true }; 
          }          
              
            uniqueValues.add(obj);
        }
            
  
        return null; //en este punto no hay error, se regresa null	
    }
  
    /*private save()  
    {
    this.incidenceService.update(this.form.value)
    .subscribe(data =>
        {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
        this.router.navigate(['/incidences']);  
        }, (err : any) => 
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
            this.miscService.endRquest();
        }); 
    } */

    getInfo(){

      
      this.dependencyPhoneService.getAll(0,1,'[{"id":"asc"}]').subscribe(data => {  
        
        if(data != null){
          let nuevoObjeto = {};
          //Recorremos el arreglo 
          data['object']['records'].forEach( x => { 
            if( !nuevoObjeto.hasOwnProperty(x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription'])){
                nuevoObjeto[x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription']] = {
                phones: []
              }
            }
            
            //Agregamos los datos de phones
            let labelx = x.dependencyPhoneDependencyId['dependencyDescription']+" / Tel: "+ x.dependencyPhoneNumber +" / Via: "+x.dependencyPhoneCommunicationChannel;
            let phone = {label:labelx, value:x.id };
              nuevoObjeto[x.dependencyPhoneDependencyId['dependencyDependencyCategoryId']['dependencyCatergoryDescription']].phones.push(phone);
            
          });


          let claves = Object.keys(nuevoObjeto); 
          for(let i=0; i< claves.length; i++){
            this.listPhones.push({label:claves[i] ,items:nuevoObjeto[claves[i]].phones});
            
          }
        }

        this.incidenceService.getById(this.id)
        .subscribe(data => {  
            data['incidenceCostumerId'] = data['incidenceCostumerId']['costumerName'];
            data['incidenceEndDate'] = new Date(data['incidenceEndDate']);
            data['incidenceStartDate'] = new Date(data['incidenceEndDate']);
            this.listInvolved = data['incidenceInvolvedDevices'];
            //this.uploadedFiles = data['incidenceEvidences']

            //agregar filas para vias de coordinacion
            for (let i=0; i < data['incidenceCoordinations'].length; i++){
              this.addRow();    
            }

            for (let i=0; i < data['incidenceEvidences'].length; i++){


              let row = data['incidenceEvidences'][i];

              
              let obj = {
                  id:row['id'],
                  name: row['incidenceEvidenceName'],
                  size: row['incidenceEvidenceSize'] * 1024,
                  objectURL:this.fileService.downloadServer(row['incidenceEvidencePath'])
              }
              this.uploadedFiles.push(obj);               

          }
          this.dateStart = data['incidenceStartDateAttention'];
          this.dateEnd = data['incidenceEndDateAttention'];
          this.form.patchValue(data);

        });
      });

    }
    
   /* getDevices(value){
      if(value != null ) {
        let x = "monitoringDeviceCostumerId['id']";
        this.monitoringDeviceService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"'+x+'"}]',0,1,'[{"id":"asc"}]')
        .subscribe( (data:any )=>
        {            
           
              this.listDevices = (data == null ? []: data['object']['records']);
           
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al cargar listado de dispositivos ' , detail:err.message, life: 3000 });
            this.miscService.endRquest();
        });
      }
    }*/
    /*filterDevices(event: any) {
      let filtered: any[] = [];
      let query = event.query;
  
      for (let i = 0; i < (this.listDevices as any[]).length; i++) {
          let device = (this.listDevices as any[])[i];
          if (device['monitoringDeviceName'].toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(device['monitoringDeviceName']);
          }
      }
  
      this.listFilteredDevices = filtered;
  }*/

  /*getMimeType(text:string){
    let ext =  text.split(".");

    if(ext[1] == 'jpg' ) 
        ext[1]= 'jpeg';

    return this.listMimeType.filter(element => {
        return element.includes(ext[1]);
     });

}*/
      
}
