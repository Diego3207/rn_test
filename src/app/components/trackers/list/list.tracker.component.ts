import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tracker } from 'src/app/api/tracker';
import { TrackerService } from 'src/app/service/tracker.service'
import { ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';
import { Router } from '@angular/router';


@Component({
    templateUrl: './list.tracker.component.html'
})
export class ListTrackerComponent implements OnInit, OnDestroy {
    selectedElements: Tracker[] = [];
    trackers:Tracker[];
    tracker: Tracker;
    totalRows: number = 0;
    limit:number = 10 ;
    page:number  ;
    sort:string = ''; 
    search:string = ''; 
    searching: boolean;
    showButton! : boolean;
    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    matchModeOptionsDate: SelectItem[];
    visible: boolean = false;
    dataCSV : any[] = [];

    tableData: any;
    tableTitle: any;
    customPagination = 1;
    recordsPerPage = 10;
    tableRecords = [];
    pageStartCount = 0;
    pageEndCount = 10;
    totalPageCount = 0;
    currentPage = 0;

    constructor(
        private miscService:MiscService,
        private cdref:ChangeDetectorRef,
        private trackerService: TrackerService, 
        private messageService: MessageService, 
        private router: Router,
        private confirmationService: ConfirmationService
        ) 
        {
            
        }
	

    ngOnInit(): void 
	{
        this.matchModeOptionsText = [
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH  },
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH},
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsNumber= [
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsDate = [
            { label: 'Contiene', value:  FilterMatchMode.DATE_IS  },   
            { label: 'No contiene', value: FilterMatchMode.DATE_IS_NOT },  
            { label: 'Antes', value: FilterMatchMode.DATE_BEFORE },  
            { label: 'Después', value: FilterMatchMode.DATE_AFTER },           
        ];
    }


    ngOnDestroy() {
       
    }

    load(event: LazyLoadEvent){
        
        this.page =  (event.first / event.rows) + 1; 
        this.limit = event.rows;
        let order: {}[] = [];
        let filter = [];

        event.multiSortMeta.forEach(function (obj) {
            let h = {};
            h[obj['field']] = (( obj['order'] == 1) ? "asc": "desc");
            order.push(h);
        });
        this.sort = JSON.stringify(order);
        for(let i in event.filters){
           
            let obj= event.filters[i];
           
            if(typeof event.filters[i].value === 'boolean'){

                if(event.filters[i].value != null){
                    obj['field'] = i;
                    filter.push(obj);
                }
            }else{
                //type => number/string/object
                if(event.filters[i].value){
                    obj['field'] = i;
                    filter.push(obj);
                }
            }
        }
        this.search =JSON.stringify(filter);
        this.miscService.startRequest();
        if(filter.length > 0){
            this.filtrer(this.search);
        }else{
            this.list();
            this.cdref.detectChanges();
        } 
    
    }

    list(){
        this.trackerService.getAll(this.limit,this.page,this.sort)
        .subscribe((data: any)=>{
            console.log(data);
            if(data != null)
            {
                this.trackers = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];

            }else{
                this.trackers = [];
                this.totalRows = 0;
                this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
            }
            this.miscService.endRquest(); 
        }, (err : any) => {
            // Entra aquí si el servicio entrega un código http de error EJ: 404, 
            if( err.status == 416){
                // success  info  warn  error
                this.messageService.add({severity:'warn', key: 'msg',summary: err.error.message,life: 3000});
            
            }else{

                //status = 0 , cuando no esta el back arriba
                this.messageService.add({severity:'error', key: 'msg', summary:  err.error.message,detail: err.name,life: 3000});
            }
            this.miscService.endRquest(); 
        });
    }
    
    filtrer(texto: any){
        this.trackerService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
            .subscribe((data: any)=>{
                if(data != null){
                    this.trackers = data['object']['records'];                    
                    this.totalRows = data['object']['totalRecords'];
    
                }else{
                    this.trackers = [];
                    this.totalRows = 0;
                    this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
                }
                this.miscService.endRquest(); 
            }, err => {
                // Entra aquí si el servicio entrega un código http de error EJ: 404, 
                if( err.status == 416){
                    // success  info  warn  error
                    this.messageService.add({severity:'warn', key: 'msg',summary: err.error.message,life: 3000});
                
                }else{
    
                    //status = 0 , 
                    this.messageService.add({severity:'error', key: 'msg', summary:  err.error.message,detail: err.name,life: 3000});
                }
                this.miscService.endRquest(); 
            });
    }

    confirmDelete(id:number) {
        this.trackerService.disable(id).subscribe((data: any)=>{
            this.list();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
            
        }, (err : any) => {
        });  
    }
    delete(deleteType:number, object : Tracker) {

        this.confirmationService.confirm({
            message: (deleteType == 1 ? '¿Confirma eliminar los registros seleccionados?' :'¿Confirma eliminar el registro?'),
            header :'Confirmar' ,
            icon: 'pi pi-info-circle',
            acceptLabel: 'Aceptar',
            rejectLabel:'Cancelar',
            accept: () => {
                switch (deleteType) {
                    case 1:
                        this.confirmDeleteSelected();
                        break;
                    case 2 :
                        this.confirmDelete(object.id);
                        break;

                }
            }
        });

    }

    confirmDeleteSelected() {
        var peticiones: any[] = []; 
		
		
		for(let i = 0 ; i < this.selectedElements.length; i++)
		{
            const ptt = this.trackerService.disable(this.selectedElements[i].id).pipe
			(
				catchError((error) => 
				{
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error eliminar un registro", detail:error.message });
					return of(null);
				})
			);				
			peticiones.push(ptt);			        
        }
		
		forkJoin(peticiones).subscribe((respuestas: any[]) => 
		{
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elementos eliminados exitosamente', life: 3000 });
            this.selectedElements = [];        
            this.list();
		}, 
        (err : any) => 
		{		
			this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al eliminar', life: 3000 });
		});
		
    }
    getPageRange(page: number, limit: number, totalRows: number) 
    {

        
        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }
        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }
        if (!Number.isInteger(totalRows) || totalRows < 0) {
            totalRows = 0;
        }

        const startIndex = (page - 1) * limit + 1;
        const endIndex = Math.min(startIndex + limit - 1, totalRows);

        return `Mostrando del ${startIndex} al ${endIndex} de ${totalRows}`;
    }
    showDialog()
    {
        this.visible = true;

    }
    importData(e: any) 
	{
        for (let i = 0; i < e.files.length; i++) 
        {
            let file =e.files[i]; 
            let fileReader = new FileReader(); 
            fileReader.onload = (e) => 
            {
            this.processCSV(fileReader.result);
            };            
            fileReader.readAsText(file);
        }
    }

    processCSV(text:any) {
        
        let keys = [];
        let lines = text.replace(/"+/g,'').split(/[\r\n]+/);
        lines.pop(); //eliminar ultimo elemento del array (ya eque esta vacia la ultima posicion)
        keys = ['trackerSupplyId','trackerImei','trackerMaximumVoltage','trackerMinimumVoltage'];
        lines.forEach((obj) => {
            let element = {};
            obj.split(',').forEach((obj, index) => {
                element[keys[index]] = obj; 
            });
            this.dataCSV.push(element);
        });
    }
    
    sendData(event: any) 
	{
        let trackers = [];
        this.dataCSV.forEach((obj, index) => 
        {
            let keys =  Object.keys(obj);
            let keysTrackerCSV = keys.slice(0, 7);
            let tracker = {};
            let keysTracker = ['trackerSupplyId','trackerImei','trackerMaximumVoltage','trackerMinimumVoltage'];
            keysTrackerCSV.forEach((element, index) => 
            {
                tracker[keysTracker[index]] = obj[element];   
            });
            trackers.push(tracker);
        });
        this.sendRequests(trackers);
    }

    sendRequests(trackers : any[]){
        this.miscService.startRequest();
        let actions = [];
        trackers.forEach((obj)=>{
            obj['trackerMaximumVoltage'] = parseFloat(obj['trackerMaximumVoltage']);
            obj['trackerMinimumVoltage'] = parseFloat(obj['trackerMinimumVoltage']);
            const ptt = this.trackerService.create(obj).pipe(
                catchError((error) => 
                {
                    let text = (error.error.code == undefined) ? error.error.split("}")[0] :error.error.code +"\n"+error.error.problems ;

                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear rastreador con el IMEI "+obj.trackerSupplyId, detail:text });
                    return of(null);
                })
            );		

            actions.push(ptt);
        });
        forkJoin(actions).subscribe((dataId)=>
        {
            let ok = [];

            dataId.forEach((response)=>{
                if(response != null)
                    ok.push(response);
            });
            if(ok.length == actions.length) {
                this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Datos guardados exitosamente', life: 3000 }); 
                this.router.navigate(['/trackers']);
                this.miscService.endRquest();  
            }else{
                this.miscService.endRquest();
                this.messageService.add({ severity: 'warn', key: 'msg',summary: 'Advertencia', detail: 'Algunos suministros no fueron creados', life: 3000 }); 
            }
        },
        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
            this.miscService.endRquest();
        });

    }

    clearCSV(){
        this.dataCSV = [];    
    }
}
