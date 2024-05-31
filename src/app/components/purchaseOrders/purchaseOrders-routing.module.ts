import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Ordenes de compra'}, loadChildren: () => import('./list/list.purchaseOrders.module').then(m => m.ListPurchaseOrdersModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Orden de compra'}, loadChildren: () => import('./edit/edit.purchaseOrders.module').then(m => m.EditPurchaseOrdersModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Orden de compra'}, loadChildren: () => import('./add/add.purchaseOrders.module').then(m => m.AddPurchaseOrdersModule) },
        { path: 'process/:idx', data: {breadcrumb: 'Procesar Orden de compra'}, loadChildren: () => import('./process/process.purchaseOrders.module').then(m => m.ProcessPurchaseOrdersModule) }

    ])],
    exports: [RouterModule]
})
export class PurchaseOrdersRoutingModule { }