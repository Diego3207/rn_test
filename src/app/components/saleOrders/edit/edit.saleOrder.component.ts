import { Component, OnDestroy, OnInit, ElementRef, ViewChild, NgZone, NgModule } from '@angular/core';
import { SaleOrderService } from 'src/app/service/saleOrder.service';
import { CfdiService } from 'src/app/service/cfdi';
import { Supply } from 'src/app/api/supply';
import { SupplyService } from 'src/app/service/supply.service';
import { PayWayService } from 'src/app/service/payway';
import { PayMethodService } from 'src/app/service/paymethod';
import { QuotationSaleService } from 'src/app/service/quotationSale.service';
import { QuotationSaleProductService } from 'src/app/service/quotationSaleProduct.service';
import { QuotationSalePackageService } from 'src/app/service/quotationSalePackage.service';
import { QuotationSaleServiceService } from 'src/app/service/quotationSaleService.service';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
    templateUrl: './edit.saleOrder.component.html',
    providers: [DatePipe]
})

export class EditSaleOrderComponent implements OnInit, OnDestroy {
    @ViewChild('search') searchElementRef!: ElementRef;
    submitted: boolean = false;
    id:number;
    listCfdi: any[] = [];
    listPayWay: any[] = [];
    listPayMethod: any[] = [];
    listQuotationSale: any[] = [];
    selectedRegister: Supply[] = [];
    listAllRegisters: Supply[] = [] ;
    listProducts: any[] = [] ;
    listPackages: any[] = [] ;
    listServices: any[] = [] ;
    supplies: any[] = [];
    visible: boolean = false;
    disabled: boolean = false;
    size: number;
    form: FormGroup | any;
    formGroup: FormGroup | undefined;
   
    constructor(
        private formBuilder: FormBuilder,
        private saleOrderService: SaleOrderService,
        private messageService: MessageService,
        private miscService:MiscService,
        private cfdiService:CfdiService,
        private payWayService:PayWayService,
        private supplyService:SupplyService,
        private payMethodService:PayMethodService,
        private quotationSaleService:QuotationSaleService,
        private quotationSaleProductService:QuotationSaleProductService,
        private quotationSalePackageService:QuotationSalePackageService,
        private quotationSaleServiceService:QuotationSaleServiceService,
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
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
          this.form.controls.saleOrderShippingAddress.setValue(place.formatted_address);
        });
      });
    }

    ngOnInit(): void 
    {
      const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
      this.id = parseInt(this.route.snapshot.params['idx']);
      this.form = this.formBuilder.group
      ({
        id:[this.id, Validators.required],
        saleOrderQuotationSaleId: [null,[Validators.required]],
        saleOrderDate: [null,[Validators.required]],
        saleOrderShippingDate: [null,[Validators.required]],
        saleOrderShippingAddress: [null,[Validators.required]],
        saleOrderCfdiId: null,
        saleOrderPayWayId: null,
        saleOrderPayMethodId: null,
        saleOrderAdditionalComments: null,
      }, formOptions);
      this.list();

      this.form.get("saleOrderQuotationSaleId").valueChanges.subscribe(selectedValue => 
      {
        this.getFilter(selectedValue);
      });

    }

    
    ngOnDestroy() 
    {

    }

    onSubmit() 
    {
      // stop here if form is invalid
      if (this.form.invalid) 
      {
        return;
      }
        this.save();
    }
    cancel(event) {
      event.preventDefault(); //
      this.router.navigate(['/saleOrders']);
    }


    private save()  
    {
      // En las siguientes variables se guardarán los valores del formulario
      let propertiesSaleOrder = {};

      //Iteramos el objeto de formulario para guardar el valor en las variables arriba declaradas
      Object.keys(this.form.value).forEach(element => 
      {
        console.log(element);
        propertiesSaleOrder[element] = this.form.value[element];                       
      });

       //Parseamos los id a string y actualizamos el formato de fecha
       propertiesSaleOrder['saleOrderQuotationSaleId'] = (propertiesSaleOrder['saleOrderQuotationSaleId']).toString();
        if (propertiesSaleOrder['saleOrderCfdiId']) propertiesSaleOrder['saleOrderCfdiId'] = (propertiesSaleOrder['saleOrderCfdiId']).toString();
        if (propertiesSaleOrder['saleOrderPayWayId']) propertiesSaleOrder['saleOrderPayWayId'] = (propertiesSaleOrder['saleOrderPayWayId']).toString();
        if (propertiesSaleOrder['saleOrderPayMethodId']) propertiesSaleOrder['saleOrderPayMethodId'] = (propertiesSaleOrder['saleOrderPayMethodId']).toString();
        if (propertiesSaleOrder['saleOrderDate']) propertiesSaleOrder['saleOrderDate'] = this.datePipe.transform(propertiesSaleOrder['saleOrderDate'], 'yyyy-MM-dd HH:mm:ss');
        if (propertiesSaleOrder['saleOrderShippingDate']) propertiesSaleOrder['saleOrderShippingDate'] = this.datePipe.transform(propertiesSaleOrder['saleOrderShippingDate'], 'yyyy-MM-dd HH:mm:ss');
       
      //Actualizamos la orden de Compra
      this.saleOrderService.update(propertiesSaleOrder)
      .subscribe(data => 
      {
        //Método para actualizar la tabla de suministros con los ID seleccionados
        this.selectedRegister.forEach(element => 
          {
            this.miscService.startRequest();
            this.supplyService.update({
              'id': element['id'].toString(), 
              'supplyStatus': 'vendido' , 
              'supplySaleOrderId': (propertiesSaleOrder['id']).toString()
            }).subscribe(data =>{
                //Actualizamos el estado de la cotización a pendiente
                  this.miscService.startRequest();
                  this.saleOrderService.update({
                    'id': (propertiesSaleOrder['id']).toString(), 
                    'saleOrderStatus': 'pendiente' 
                  }).subscribe(data =>{
                      this.miscService.endRquest();
                  },  (err : any)=> {
                      this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
                      this.miscService.endRquest(); 
                  });
                //////////////////////////////
                this.miscService.endRquest();
            },  (err : any)=> {
                this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail:err.error.error , life: 3000 });
                this.miscService.endRquest(); 
            });
          });

        ///Continuamos el proceso de orden de venta
        this.miscService.endRquest();
        this.router.navigate(['/saleOrders']);
      }, (err: any) => {
      //Manejo de la información cuando llega de manera incorrecta
      this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: err.message, life: 3000 });
      //this.miscService.endRquest();
      });
    } 

    list(){

      this.miscService.startRequest();

      //Método para listar Cotizaciones
      const quotationSales = this.quotationSaleService.getList(1)
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
          return of(null); 
        })
      );

      //Método para listar CFDIS
      const cfdis = this.cfdiService.getAll(0,1,'[{"id":"asc"}]')
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
          return of(null); 
        })
      );
      
      //Método para listar formas de Pago
      const payways =this.payWayService.getAll(0,1,'[{"id":"asc"}]')
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
          return of(null); 
        })
      );
      
      //Método para listar métodos de Pago
      const paymethods =this.payMethodService.getAll(0,1,'[{"id":"asc"}]')
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
          return of(null); 
        })
      );

      //Método para listar métodos de Pago
      const saleOrderInfo =this.saleOrderService.getById(this.id)
      .pipe(
        catchError((error) => 
        {
          this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar información de edición", detail:error.message });
          return of(null); 
        })
      );
      
      //Hacemos fork join para mandar las peticiones
      forkJoin([quotationSales,cfdis,payways,paymethods,saleOrderInfo]).subscribe(async ([dataQuotationSales, dataCfdis,dataPayWays,dataPayMethods, dataSaleOrderInfo] )=>
      {
        //Envia las cotizaciones
        if(dataQuotationSales != null)
        {                    
            dataQuotationSales['object'].forEach(element => {
              /*if(element['quotationSaleStatus'] == 'nueva')
              {*/
                this.listQuotationSale.push({'label': "ID:"+ element['quotation_sale_id']+" "+ element['quotation_sale_description'],'value': element['quotation_sale_id'].toString()});
              //}
            });
        }
       
        //Envia los Cfids
        if(dataCfdis != null )
        {                    
            dataCfdis['object']['records'].forEach(element => {
                this.listCfdi.push({'label': element['cfdiKey']+" "+ element['cfdiValue'],'value': element['id']});
            });
        }
        //Envia los PayWays
        if(dataPayWays != null)
        {
            dataPayWays['object']['records'].forEach(element => {
                this.listPayWay.push({'label': element['payWayKey']+" "+ element['payWayValue'],'value': element['id']});
            });
        }
        //Envia los PayMethods
        if(dataPayMethods != null)
        {
            dataPayMethods['object']['records'].forEach(element => {
                this.listPayMethod.push({'label': element['payMethodKey']+" "+ element['payMethodValue'],'value': element['id']});
            });
        }

        //Llena el formulario
        if(dataSaleOrderInfo != null)
        {
          dataSaleOrderInfo.saleOrderShippingDate = new Date(dataSaleOrderInfo.saleOrderShippingDate);
          dataSaleOrderInfo.saleOrderDate = new Date(dataSaleOrderInfo.saleOrderDate);
          
          this.listQuotationSale.push({label: dataSaleOrderInfo['saleOrderQuotationSaleId']['quotationSaleDescription'] , value : dataSaleOrderInfo['saleOrderQuotationSaleId']['id'] }); 
          
          dataSaleOrderInfo['saleOrderQuotationSaleId'] = dataSaleOrderInfo['saleOrderQuotationSaleId']['id'];
          
          this.supplies = dataSaleOrderInfo.saleOrderSupplies;
          console.log(dataSaleOrderInfo.saleOrderSupplies.length);
          await this.form.patchValue(dataSaleOrderInfo); //Agrega la data a los inputs
        }

        this.miscService.endRquest(); 
      },

      (err:any)=>
      {
          this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
          this.miscService.endRquest();
      });
          
  }

  getFilter(value){
      if(value != null){
          this.miscService.startRequest(); 

          //1. Hacer una peticion para traer los productos de un proveedor
          const products = this.quotationSaleProductService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"quotationSaleProductQuotationSaleId"}]',0,1,'[{"id":"asc"}]')
          .pipe(
              catchError((error) => 
              {
                  this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
                  return of(null); 
              })
          );

          //2. Hacer una peticion para traer los servicios de un proveedor
          const services = this.quotationSaleServiceService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"quotationSaleServiceQuotationSaleId"}]',0,1,'[{"id":"asc"}]')
          .pipe(
              catchError((error) => 
              {
                  this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
                  return of(null); 
              })
          );
          
          //3. Hacer una peticion para traer los paquetes de un proveedor
          const packages = this.quotationSalePackageService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"quotationSalePackageQuotationSaleId"}]',0,1,'[{"id":"asc"}]')
          .pipe(
              catchError((error) => 
              {
                  this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar productos", detail:error.message });
                  return of(null); 
              })
          );

          forkJoin([products,services,packages]).subscribe(([dataProducts,dataServices,dataPackages] )=>
          {
              if(dataProducts != null )
              {
                  dataProducts['object']['records'].forEach(element => {
                    this.listProducts.push({
                      "id": element.quotationSaleProductProductId.id , 
                      "brand": element.quotationSaleProductProductId.productBrand, 
                      "model": element.quotationSaleProductProductId.productModel, 
                      "quantity": element.quotationSaleProductQuantity,
                      "guarranty": element.quotationSaleProductProductId.productGuaranteeUnit + " " +  element.quotationSaleProductProductId.productGuaranteeUnitMeasure
                    });
                  });
              }

              if(dataServices != null )
              { 
                  dataServices['object']['records'].forEach(element => {
                    this.listServices.push({
                      "id": element.quotationSaleServiceServiceId.id , 
                      "description": element.quotationSaleServiceServiceId.serviceDescription,
                      "temporality": element.quotationSaleServiceServiceId.serviceTemporality,
                      "temporalityQuantity": element.quotationSaleServiceServiceId.serviceQuantityTemporality, 
                      "quantity": element.quotationSaleServiceQuantity
                    });
                  });
              }  

              if(dataPackages != null )
              {                 
                  dataPackages['object']['records'].forEach(element => {
                    
                    //iteramos los paquetes con producto para sumarlos a productlist
                    for (let i = 0; i < element.quotationSalePackageProducts.length; i++) 
                      {
                        var idProduct = element.quotationSalePackageProducts[i].infoDetail.id;

                        var result = this.listProducts.find((obj) => obj.id ==  idProduct)
                        
                        result == undefined ? this.listProducts.push({
                          "id": idProduct, 
                          "brand": element.quotationSalePackageProducts[i].infoDetail.productBrand, 
                          "model": element.quotationSalePackageProducts[i].infoDetail.productModel, 
                          "guarranty": element.quotationSalePackageProducts[i].infoDetail.productGuaranteeUnit + " " +  element.quotationSalePackageProducts[i].infoDetail.productGuaranteeUnitMeasure,
                          "quantity": element.quotationSalePackageProducts[i].packageProductQuantity * element.quotationSalePackageQuantity
                        }) : result.quantity = result.quantity + (element.quotationSalePackageProducts[i].packageProductQuantity * element.quotationSalePackageQuantity); 
                      }

                      //iteramos los paquetes con servicios para sumarlos a servicelist
                      for (let i = 0; i < element.quotationSalePackageServices.length; i++) 
                      {
                        
                        var idService = element.quotationSalePackageServices[i].infoDetail.id;

                        var result = this.listServices.find((obj) => obj.id ==  idService)
                        
                        result == undefined ? this.listServices.push({
                          "id": idService , 
                          "description": element.quotationSalePackageServices[i].infoDetail.serviceDescription,
                          "temporality": element.quotationSalePackageServices[i].infoDetail.serviceTemporality,
                          "temporalityQuantity": element.quotationSalePackageServices[i].infoDetail.serviceQuantityTemporality, 
                          "quantity": element.quotationSalePackageServices[i].packageServiceQuantity * element.quotationSalePackageQuantity
                        }) : result.quantity = result.quantity + (element.quotationSalePackageServices[i].packageServiceQuantity * element.quotationSalePackageQuantity); 

                      } 
                  }); 
                  
              }  

            this.miscService.endRquest(); 
          },

          (err:any)=>
          {
              this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los suministros del proveedor', life: 3000 });
              this.miscService.endRquest();
          });


      }else{
          this.listPackages = [];
          this.listProducts = [];   
          this.listServices = [];         
          this.form.controls.quotationPurchaseProducts = [];
      }
  } 

  //traer los suministros de la orden de venta
  getAllProducts(value, quantity){
    this.visible = true;
    this.size = quantity;
    if(value != null ) {
      this.supplyService.getFilter('[{"value":"'+value+'","matchMode":"equals","field":"supplyProductId"}]',0,1,'[{"id":"asc"}]')
      .subscribe( (data:any )=>
      {            
        data == null ? []: 
          data['object']['records'].forEach(element => {
            if(element.supplyStatus == "disponible"){
             /* this.listAllRegisters.push({
                "id": element.id, 
                "key": element.supplyKey, 
                "purchase": element.supplyPurchaseOrderId.id, 
                "date": element.supplyDateSupplied, 
                "status": element.supplyStatus,
                "product": element.supplyProductId['productBrand'] + " " +  element.supplyProductId['productModel']
              });*/
              this.listAllRegisters.push(element);
            }
        });
      },
      (err : any) =>
      {
          this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al cargar listado de productos' , detail:err.message, life: 3000 });
          this.miscService.endRquest();
      });
    }
  } 

  closeModalMap(){
    this.visible = false;
    this.listAllRegisters = [];
  }

  assignProduct() {
      this.listAllRegisters.forEach(element => {
        if(element["supplyIsSelected"] ){
            this.selectedRegister.push(element);
        }
      });
      this.closeModalMap();
      this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });
      
    }
    getStatusCheck(obj:any,index:number){
      let disabled = false;
      //console.log(x);
     
        let itemSelected = this.listAllRegisters.filter((obj) => obj.supplyIsSelected == true);
  
        if( !obj.isSelected  && this.size == itemSelected.length )  
            disabled = true;
          
  
        return disabled;
  
    }
  
}
