import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Provider } from 'src/app/api/provider';
import { ProviderService } from 'src/app/service/provider.service'
import {ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

@Component({
    templateUrl: './list.provider.component.html'
})
export class ListProviderComponent implements OnInit, OnDestroy {
    selectedElements: Provider[] = [];
    providers: Provider[];
    provider: Provider;
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

    constructor(private miscService:MiscService,private cdref:ChangeDetectorRef ,private providerService: ProviderService, private messageService: MessageService, private confirmationService: ConfirmationService) 
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
        this.providerService.getAll(this.limit,this.page,this.sort)
        .subscribe((data: any)=>{
            if(data != null)
            {
                this.providers = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];

            }else{
                this.providers = [];
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
        this.providerService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
            .subscribe((data: any)=>{
                if(data != null){
                    this.providers = data['object']['records'];                    
                    this.totalRows = data['object']['totalRecords'];
    
                }else{
                    this.providers = [];
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
        this.providerService.disable(id).subscribe((data: any)=>{
            this.list();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
            
        }, (err : any) => {
        });  
    }
    delete(deleteType:number, object : Provider) {

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
            const ptt = this.providerService.disable(this.selectedElements[i].id).pipe
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
    


}
