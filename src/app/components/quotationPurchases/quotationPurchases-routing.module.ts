import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Cotizaciones de compra'}, loadChildren: () => import('./list/list.quotationPurchases.module').then(m => m.ListQuotationPurchasesModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Cotización'}, loadChildren: () => import('./edit/edit.quotationPurchases.module').then(m => m.EditQuotationPurchasesModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Cotización'}, loadChildren: () => import('./add/add.quotationPurchases.module').then(m => m.AddQuotationPurchasesModule) },
        { path: 'process/:idx', data: {breadcrumb: 'Procesar Cotización'}, loadChildren: () => import('./process/process.quotationPurchases.module').then(m => m.ProcessQuotationPurchasesModule) }

    ])],
    exports: [RouterModule]
})
export class QuotationPurchasesRoutingModule { }