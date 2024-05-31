import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stocktaking } from 'src/app/api/stocktaking';
import { StocktakingService } from 'src/app/service/stocktaking.service'
import {ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode  } from 'primeng/api';
import jsPDF from "jspdf"; 

@Component({
    templateUrl: './list.stocktaking.component.html'
})
export class ListStocktakingComponent implements OnInit, OnDestroy {
    selectedStocktakings: Stocktaking[] = [];
    confirmDisplaySelected: boolean = false;
    confirmDisplay: boolean = false;
	content:string;
    stocktakings: Stocktaking[];
    stocktaking: Stocktaking;
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

    constructor(private StocktakingService: StocktakingService, private messageService: MessageService, private confirmationService: ConfirmationService) 
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
        //console.log(event);
        this.loading = true;
        
        this.page =  (event.first / event.rows) + 1; 
        this.limit = event.rows;
        let order: {}[] = [];
        let filter = [];
        //Para la seleccion multiple de debe presionar ctrl+Col1+Col2... 
        event.multiSortMeta.forEach(function (obj) {
            let h = {};
            h[obj['field']] = (( obj['order'] == 1) ? "asc": "desc");
            order.push(h);
        });
        this.sort = JSON.stringify(order);
        //console.log(this.sort);
        for(let i in event.filters){
           
            let obj= event.filters[i];
           
            if(typeof event.filters[i].value === 'boolean'){
                //type => boolean
                //posibles valores false/true/null
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
        //console.log(this.search);
       // setTimeout(() => {
            if(filter.length > 0){
                this.filtrer(this.search);
            }else{
                this.list();
            }  
          //}, 1000);
    
    }

    list(){
        this.StocktakingService.getAll(this.limit,this.page,this.sort)
        .subscribe((data: any)=>{
            this.stocktakings = data['object']['records'];                    
            this.totalRows = data['object']['totalRecords'];
            this.loading = false;
        }, err => {
            // Entra aquí si el servicio entrega un código http de error EJ: 404, 
            if(err.error['code'] == 301){
                // success  info  warn  error
                this.stocktakings = [];
                this.totalRows = 0;
                this.loading = false;
                this.messageService.add({severity:'warn', key: 'msg',summary:  err.error['message'],life: 3000});
            }
        });
    }

    	//TODO esta funcion debe ser parte de un helper
	getPageRange(page: number, limit: number, totalRows: number) 
	{
		console.log(page+"  "+ limit+"  "+ totalRows);
		
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
    
    filtrer(texto: any){
        this.StocktakingService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
            .subscribe((data: any)=>{
                this.stocktakings = data['object']['records'];                    
                this.totalRows = data['object']['totalRecords'];
                this.loading = false;
        }, err => {
            if(err.error['code'] == 301){
                //301 => sin coincidencias
                // success  info  warn  error
                this.stocktakings = [];
                this.totalRows = 0;
                this.loading = false;
                this.messageService.add({severity:'warn', key: 'msg', summary:  err.error['message'],life: 3000});
            }
        });
    }

    exportPdf() { 
        const doc = new jsPDF('p','pt'); 
        doc.save('download.pdf'); 
    }
}
