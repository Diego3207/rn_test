import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuotationSale } from 'src/app/api/quotationSale';
import { QuotationSaleService } from 'src/app/service/quotationSale.service';
import { SaleOrderService } from 'src/app/service/saleOrder.service';
import {ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode , ConfirmEventType  } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';
import { DatePipe, CurrencyPipe,formatDate  } from '@angular/common'; 


import { PackageService } from 'src/app/service/package.service';
import { ProductService } from 'src/app/service/product.service';
import { ServiceService } from 'src/app/service/service.service';
import { UserService } from 'src/app/service/user.service';

import { QuotationSaleProductService } from 'src/app/service/quotationSaleProduct.service';
import { QuotationSalePackageService } from 'src/app/service/quotationSalePackage.service';
import { QuotationSaleServiceService } from 'src/app/service/quotationSaleService.service';
import { CostumerService } from 'src/app/service/costumer.service';
import { ProviderProductService } from 'src/app/service/providerProduct.service';
import { ProviderServiceService } from 'src/app/service/providerService.service';
import { SessionService } from 'src/app/service/session.service';
import { ReportService }    from 'src/app/service/report.service';
import { QuotationSaleRecordService } from 'src/app/service/quotationSaleRecord.service';




import { Costumer } from 'src/app/api/costumer';
import { Product } from 'src/app/api/product';
import { User } from 'src/app/api/user';
import { Package } from 'src/app/api/package';
import { Service} from 'src/app/api/service';
import { ActivatedRoute } from '@angular/router';

import htmlToPdfmake from "html-to-pdfmake";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
    templateUrl: './list.quotationSales.component.html',
	providers: [DatePipe, CurrencyPipe]
})
export class ListQuotationSalesComponent implements OnInit, OnDestroy {
	form: FormGroup | any;
    selectedElements: QuotationSale[] = [];
    quotations: QuotationSale[];
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

	listCustomers: Costumer[] = [];
    listUsers: User[] = [];
    listProducts: any[] = [] ;
    listServices: any[] = [] ;
    listPackages: Package[] = [] ;

	visible: boolean;
	id:number = null;
	

    constructor(
		private formBuilder: FormBuilder,
        private miscService:MiscService,
        private cdref:ChangeDetectorRef ,
        private quotationSaleService: QuotationSaleService,
        private saleOrderService: SaleOrderService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
		private quotationSaleProductService: QuotationSaleProductService,
        private quotationSaleServiceService: QuotationSaleServiceService,
        private quotationSalePackageService: QuotationSalePackageService,
        private quotationSaleRecordService: QuotationSaleRecordService,
        private customerService: CostumerService ,
        private packageService: PackageService ,
        private userService: UserService ,
        private productService: ProductService ,
        private serviceService: ServiceService ,
        private reportService: ReportService,
        private providerProductService: ProviderProductService ,
        private providerServiceService: ProviderServiceService ,
        private sessionService:SessionService,
		private route: ActivatedRoute,
		private datePipe: DatePipe,
		private currencyPipe: CurrencyPipe)
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

		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; 

		this.form = this.formBuilder.group
		({
            quotationSaleReasonStatus:[null, [Validators.required,Validators.maxLength(255)]], 
			quotationSaleStatus:['rechazada', [Validators.required]],
         }, formOptions);
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
   delete(deleteType:number, object : QuotationSale) {

        this.confirmationService.confirm({
            message: (deleteType == 1 ? '¿Confirma eliminar los registros seleccionados?' :'¿Confirma eliminar el registro?'),
            header :'Confirmar' ,
            icon: 'pi pi-info-circle',
            acceptLabel: 'Aceptar',
            rejectLabel:'Cancelar',
			key:'dialogDelete',			
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

    list(){
        this.quotationSaleService.getAll(this.limit,this.page,this.sort)
        .subscribe((data: any)=>{
            if(data != null)
            {
                this.quotations = data['object']['records'];
                this.totalRows = data['object']['totalRecords'];

            }else{
                this.quotations = [];
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
        this.quotationSaleService.getFilter(texto,this.limit, this.page,this.sort) // le sumo +1 ya que en sails le resto uno a la pagina (en sails quitare ese -1 )
            .subscribe((data: any)=>{
                if(data != null){
                    this.quotations = data['object']['records'];
                    this.totalRows = data['object']['totalRecords'];

                }else{
                    this.quotations = [];
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
        this.quotationSaleService.disable(id).subscribe((data: any)=>{
            this.list();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });

        }, (err : any) => {
            //console.log(err);
        });
    }

    confirmDeleteSelected() {
        var peticiones: any[] = [];

		for(let i = 0 ; i < this.selectedElements.length; i++)
		{
            const ptt = this.quotationSaleService.disable(this.selectedElements[i].id).pipe
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
            this.list();
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elementos eliminados exitosamente', life: 3000 });
            this.selectedElements = [];

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

	
	
	openDialogReject(id:number) {
		this.visible = true;
		this.id = id;    
	}
	closeDialogReject() {
		this.visible =false;
		this.form.controls.quotationSaleReasonStatus.setValue(null); 
	}

	rejectQuotation(){
		if ( !this.form.invalid ) {
			let quotation = {};   
			quotation['id'] = this.id.toString();
			Object.keys(this.form.value).forEach(element => {
				quotation[element] = this.form.value[element];				
			});

			quotation['quotationSaleDateStatus'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss');

			this.quotationSaleService.update(quotation)
			.subscribe(data =>{
				this.messageService.add({ severity: 'success',key: 'msg', summary: 'Guardado exitoso',life: 3000 });  
				
				this.closeDialogReject();
				
				this.list();
			
			},  (err : any) => {
				this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error  al guardar', detail: err.message, life: 3000 });  
				this.miscService.endRquest();  
			}); 
		} else {
			this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Falta agregar motivo de rechazo', life: 3000 });
			return;
		}

	}
	
	importPDF(quotationSale: QuotationSale)
	{		
        this.miscService.startRequest();
        this.reportService.quotationSale(quotationSale.id).subscribe((data: any)=>
        {
            const file = new Blob([data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            this.miscService.endRquest();
        }, 
        (err:any)=>
        {

            this.messageService.add({severity:'error', key: 'msg', summary:  err.error.message,detail: err.name,life: 3000});
            this.miscService.endRquest();
        });            
    }
    
    
	
	accept( id : number) {

        this.confirmationService.confirm({
            message: '¿Seguro que desea aceptar esta cotización?',
            header :'Acpetar cotización' ,
            icon: 'pi pi-info-circle',
            acceptLabel: 'Aceptar',
            rejectLabel:'Cancelar',
			key:'dialogAccept',			
            accept: () => {
                
                this.processAcceptance(id);
                this.createSalesOrder(id);
            }
        });

    }

    createSalesOrder(id:number){
        let saleOrder = {};
        saleOrder['saleOrderQuotationSaleId'] = id.toString();
        saleOrder['saleOrderShippingDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        saleOrder['saleOrderTransmitter'] = this.sessionService.getUserId().toString();
        this.saleOrderService.create(saleOrder)
        .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Orden de venta creada exitosamente', life: 3000 });
        }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
        });
    }

    processAcceptance(id:number){
         //consultar  informacion de la cotizacion para procesar productos y paquetes
        this.quotationSaleService.getById(id)
        .subscribe(data =>{
          
            let products = [];

            data['quotationSaleProducts'].forEach(obj => {

                  products.push(
                      {
                          idProduct:obj.quotationSaleProductProductId, 
                          quantity:obj.quotationSaleProductQuantity, 
                     }
                  );
  
            });
            data['quotationSalePackages'].forEach(obj => {
                for(let i = 0 ; i < obj.quotationSalePackageProducts.length; i++)
                    {
                        products.push(
                            {
                                idProduct:obj.quotationSalePackageProducts[i].packageProductProductId, 
                                quantity:(obj.quotationSalePackageProducts[i].packageProductQuantity) * obj.quotationSalePackageQuantity, 
                            }
                        );
    
                    }
                
            });

            
            let actions = [];
           
            products.forEach(obj => {
               //quantity, idProducto
               console.log(obj);

                for(let i = 0 ; i < obj.quantity; i++)
		        {

                    const ptt = this.quotationSaleRecordService.create({quotationSaleRecordQuotationSaleId:id.toString(), quotationSaleRecordProductId : (obj.idProduct).toString()}).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al crear registro en  quotationSaleRecord", detail:error.message });
                            return of(null);
                        })
                    );	
                    actions.push(ptt);

                }

                    
            });

            let quotation = {};
            quotation['id'] = id.toString();
			quotation['quotationSaleStatus']= 'aceptada';

			quotation['quotationSaleDateStatus'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd  HH:mm:ss');
            const ptt = this.quotationSaleService.update(quotation).pipe(
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar cotización", detail:error.message });
                    return of(null);
                })
            );	
            actions.push(ptt);

    
            forkJoin(actions).subscribe(([] :any )=>
            {
                this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Cotización aceptada exitosamente', life: 3000 }); 
                this.list();
                this.miscService.endRquest(); 
            },
            (err:any)=>
            {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general en el proceso de aceptar cotización', life: 3000 });
                this.miscService.endRquest();
            });
            
        });
         
    }

}

