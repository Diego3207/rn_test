import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Supply } from 'src/app/api/supply';
import { SupplyService } from 'src/app/service/supply.service'
import {ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode  } from 'primeng/api';
import { MiscService } from 'src/app/service/misc.service';
import jsPDF from "jspdf"; 
import autoTable from 'jspdf-autotable';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { DatePipe } from '@angular/common';


@Component({
    templateUrl: './list.supply.component.html',
    providers: [DatePipe]
})
export class ListSupplyComponent implements OnInit, OnDestroy {
    selectedSupplys: Supply[] = [];
    confirmDisplaySelected: boolean = false;
    confirmDisplay: boolean = false;
	content:string;
    supplys: Supply[];
    inventorySupplys: Supply[] = [];
    supply: Supply;
    totalRows: number = 0;
    limit:number = 10 ;
    page:number  ;
    sort:string = ''; 
    search:string = ''; 
    loading: boolean;
    searching: boolean;
    showButton! : boolean;
    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    matchModeOptionsDate: SelectItem[];
    

    constructor(
        private miscService:MiscService,
        private cdref:ChangeDetectorRef,
        private datePipe: DatePipe,
        private supplyService: SupplyService, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService) 
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

    load(event: LazyLoadEvent)
    {
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

    list()
    {
        this.supplyService.getAll(this.limit, this.page,this.sort)
        .subscribe((data: any)=>{
            if(data != null)
            {
                //console.log(data['object']['records']);
                this.supplys = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];

            }else{
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
    
    filtrer(texto: any)
    {
        this.supplyService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
        .subscribe((data: any)=>{
            if(data != null){
                this.supplys = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];

            }else{
                this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
            }
            this.miscService.endRquest();

        },  (err : any) => {
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

    delete(deleteType:number, object : Supply) {

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

    confirmDelete(id:number) {
        this.supplyService.disable(id).subscribe((data: any)=>{
            this.list();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
            
        }, err => {
        });  
    }

    confirmDeleteSelected() {
        var peticiones: any[] = []; 
		
		
		for(let i = 0 ; i < this.selectedSupplys.length; i++)
		{
            const ptt = this.supplyService.disable(this.selectedSupplys[i].id).pipe
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
            this.selectedSupplys = [];        
            this.list();
		}, 
		err => 
		{		
			this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al eliminar', life: 3000 });
		});
    }


    //TODO esta funcion debe ser parte de un helper
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

    getSupplies(type)
    {
        this.miscService.startRequest();
        this.supplyService.getAll(0,1,'[{"id":"asc"}]')
        .subscribe((data: any)=>{
            if(data != null)
            {
                switch (type) 
                {
                case 'pdf':
                    this.exportPdf(data['object']['records']);   
                break;
                case 'csv':
                    this.exportCSV(data['object']['records']); 
                break;
                }

            }else{
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

    exportPdf(dataService) { 
        this.inventorySupplys = dataService;
        const doc = new jsPDF();
        let columns = [["ID", "Orden Compra", "Fecha","Marca","Modelo","Estatus","Ubicación"]];
        let data = [];
        for(let i = 0 ; i < this.inventorySupplys.length ; i++)
        {
            let row = [ 
                this.inventorySupplys[i].supplyKey,
                this.inventorySupplys[i].supplyPurchaseOrderId['id'],
                this.datePipe.transform(new Date(this.inventorySupplys[i].supplyDateSupplied), 'yyyy-MM-dd'),  
                this.inventorySupplys[i].supplyProductId['productBrand'],
                this.inventorySupplys[i].supplyProductId['productModel'],
                this.inventorySupplys[i].supplyStatus,
                this.inventorySupplys[i].supplyLocationId['locationName']
            ]
            
            data.push(row);
        }
        
        autoTable(doc, {
            head: columns,
            body: data,
        })
        doc.setFontSize(11);
        doc.text(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 10, 10);
        doc.save("inventario.pdf") 
    }

    exportCSV(dataService){
        this.inventorySupplys = dataService;
        let data = [];
        for(let i = 0 ; i < this.inventorySupplys.length ; i++)
        {
            let row = {
                id : this.inventorySupplys[i].supplyKey,
                id_orden_compra :  this.inventorySupplys[i].supplyPurchaseOrderId['id'],
                fecha_compra :  this.datePipe.transform(new Date(this.inventorySupplys[i].supplyDateSupplied), 'yyyy-MM-dd'), 
                marca : this.inventorySupplys[i].supplyProductId['productBrand'],
                modelo : this.inventorySupplys[i].supplyProductId['productModel'], 
                descripción : this.inventorySupplys[i].supplyProductId['productDescription'],
                status :  this.inventorySupplys[i].supplyStatus,
                ubicacion : this.inventorySupplys[i].supplyLocationId['locationName'],
            }
            
            data.push(row);
        }

        let csvOptions = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            useBom: false,
            noDownload: false,
            encoding: "UTF-8",
            headers:  Object.keys(data[0])
          };
        new  AngularCsv(data, "inventario_"+ this.datePipe.transform(new Date(), 'yyyy_MM_dd'), csvOptions); 
    }
}
