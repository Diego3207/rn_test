import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Cotizaciones de Venta'}, loadChildren: () => import('./list/list.quotationSales.module').then(m => m.ListQuotationSalesModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Cotización'}, loadChildren: () => import('./edit/edit.quotationSales.module').then(m => m.EditQuotationSalesModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Cotización'}, loadChildren: () => import('./add/add.quotationSales.module').then(m => m.AddQuotationSalesModule) },
        { path: 'process/:idx', data: {breadcrumb: 'Procesar Cotización'}, loadChildren: () => import('./process/process.quotationSales.module').then(m => m.ProcessQuotationSalesModule) }

    ])],
    exports: [RouterModule]
})
export class QuotationSalesRoutingModule { }