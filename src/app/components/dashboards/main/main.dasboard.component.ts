import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../api/product';
import { AppConfig, LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../../service/dashboard.service';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

@Component({
    templateUrl: './main.dashboard.component.html'
})

export class MainDashboardComponent implements OnInit, OnDestroy
{

    //
    //subscription!: Subscription;
    //config!: AppConfig;



    //--------------------------------------

    dashboardService: DashboardService;

    xChart: any;

    chartOption:any;
    chartModelBrand:any;
    chartSupplyStatus:any;
    chartCategory:any;
    chartActiveClients:any;
    chartQuotation:any;
    chartSaleOrders:any;


    constructor(private _dashboardService: DashboardService, private layoutService: LayoutService)
    {
        /*this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.config = config;
            this.initCharts();
        });*/

        this.dashboardService = _dashboardService;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartOption = {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            },
            animations: {
                radius: {
                    duration: 400,
                    easing: 'linear',
                    loop: (context) => context.active
                }
            },
        }
    }


    ngOnInit(): void
    {

        //conteo por estado de productos
        this.dashboardService.getSupplyStatus().subscribe((res: any)=>
        {

            const records = res.object.records;
            const labels = records.map(record => record.status);
            const data = records.map(record => record.count);

            this.chartSupplyStatus = {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: Array.from({length: labels.length}, () => this.getRandomColor()),
                }]
            };
        },
        err =>
        {
            console.log(err);

        });

        //conteo de categorias
        this.dashboardService.getCategory().subscribe((res: any)=>
        {

            const records = res.object.records;
            const labels = records.map(record => record.product_category_description);
            const data = records.map(record => record.count);

            this.chartCategory = {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: Array.from({length: labels.length}, () => this.getRandomColor()),
                }]
            };
        },
        err =>
        {
            console.log(err);

        });

        //conteo de  marca, modelo
        this.dashboardService.getModelBrand().subscribe((res: any)=>
        {

            const records = res.object.records;
            const labels = records.map(record => record.product);
            const data = records.map(record => record.count);

            this.chartModelBrand = {
                labels: labels, //['Inactivos', 'Activos', 'Pendientes'],
                datasets: [{
                    data: data, //[40, 35, 25],
                    //backgroundColor: ['#64B5F6', '#7986CB', '#4DB6AC'],
                    //borderColor: [surfaceBorder]
                    backgroundColor: Array.from({length: labels.length}, () => this.getRandomColor()),
                }]
            };
        },
        err =>
        {
            console.log(err);

        });


        //lineal conteo de clientes activos
        this.dashboardService.getActiveClients().subscribe((res: any)=>
        {

            //registros totales
            const rec = res.object.records;

            //obtiene el maximo y minimo global
            const minDate = rec[0].date;
            const maxDate = rec[rec.length - 1].date;

            const rellenoCliente:any = this.rellenarMesesFaltantes(rec,minDate, maxDate);

            const labels = rellenoCliente.map(record => record.date);
            const data = rellenoCliente.map(record => record.count);


            this.chartActiveClients = {
                labels: labels,
                datasets: [{
                    label: 'Registro de clientes activos',
                    data: data,
                    tension: .2,
                    fill: true,
                    borderColor: '#66BB6A'
                    //backgroundColor: Array.from({length: labels.length}, () => this.getRandomColor()),
                }]
            };
        },
        err =>
        {
            console.log(err);

        });

        //lineal conte de cotizaciones
        this.dashboardService.getQuotationSale().subscribe((ar: any)=>
        {


            //registros totales
            const records = ar.object.records;

            //obtiene el maximo y minimo global
            const minDate = records[0].date;
            const maxDate = records[records.length - 1].date;

            //filtra el arreglo
            const recordsWithStatusNueva = ar.object.records.filter(record => record.quotation_sale_status === "nueva");
            const rellenoNuevo:any = this.rellenarMesesFaltantes(recordsWithStatusNueva,minDate, maxDate);
            //console.log(rellenoNuevo);

            const recordsWithStatusRechazada = ar.object.records.filter(record => record.quotation_sale_status === "rechazada");
            const rellenoRechazada:any = this.rellenarMesesFaltantes(recordsWithStatusRechazada,minDate, maxDate);
            //console.log(rellenoRechazada);

            const recordsWithStatusAceptada = ar.object.records.filter(record => record.quotation_sale_status === "aceptada");
            const rellenoAceptada:any = this.rellenarMesesFaltantes(recordsWithStatusAceptada,minDate, maxDate);
            //console.log(rellenoAceptada);


            this.chartQuotation = {
                labels: rellenoNuevo.map(record => record.date),
                datasets: [
                    {
                        label: 'Nuevas',
                        data: rellenoNuevo.map(record => record.count),
                        fill: true,
                        tension: .2,
                        borderColor: '#42A5F5'
                    },
                    {
                        label: 'Rechazadas',
                        data: rellenoRechazada.map(record => record.count),
                        fill: true,
                        //borderDash: [5, 5],
                        tension: .2,
                        borderColor: '#66BB6A'
                    },
                    {
                        label: 'Aceptadas',
                        data: rellenoAceptada.map(record => record.count),
                        fill: true,
                        borderColor: '#FFA726',
                        tension: .2,
                        //backgroundColor: 'rgba(255,167,38,0.2)'
                    }
                ]
            };
        },
        err =>
        {
            console.log(err);

        });

        //lineal ordenes de venta
        this.dashboardService.getSaleOrders().subscribe((res: any)=>
        {

            //registros totales
            const rec = res.object.records;

            //obtiene el maximo y minimo global
            const minDate = rec[0].date;
            const maxDate = rec[rec.length - 1].date;

            const rellenoNuevo:any = this.rellenarMesesFaltantes(rec,minDate, maxDate);

            const labels = rellenoNuevo.map(record => record.date);//records.map(record => record.date);
            const data = rellenoNuevo.map(record => record.count); //records.map(record => record.count);

            this.chartSaleOrders = {

                labels: labels,
                datasets: [{
                    label: 'Órdenes de venta activas',
                    tension: .2,
                    fill: true,
                    data: data,
                    borderColor: '#66BB6A'
                    //backgroundColor: Array.from({length: labels.length}, () => this.getRandomColor()),
                }]
            };
        },
        err =>
        {
            console.log(err);

        });
    }

    rellenarMesesFaltantes(data:any, minDateParam:string, maxDateParam:string)
    {
        const minDate = new Date(minDateParam+'-01T00:00:00');
        const maxDate = new Date(maxDateParam+'-01T00:00:00');

        const filledRecords = [];

        let currentDate = new Date(minDate);

        while (currentDate <= maxDate)
        {
            const dateString = currentDate.toISOString().slice(0, 7); // Formato YYYY-MM
            const existingRecord = data.find(record => record.date === dateString);

            if (existingRecord)
            {
                filledRecords.push(existingRecord);
            }
            else
            {
                filledRecords.push({
                    count: 0,
                    date: dateString,
                });
            }

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return filledRecords; /*{
            message: data.message,
            object: {
                records: filledRecords
            }
        };*/
    }

    getRandomColor(): string {
        // Genera componentes de color rojo, verde y azul de manera aleatoria
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        // Retorna el color en formato hexadecimal
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    }

    ngOnDestroy()
    {
        //this.subscription.unsubscribe();
    }
}
