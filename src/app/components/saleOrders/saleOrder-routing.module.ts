import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Ordenes de Venta'}, loadChildren: () => import('./list/list.saleOrder.module').then(m => m.ListSaleOrderModule) },
        //{ path: 'edit/:idx', data: {breadcrumb: 'Editar Orden de Venta'}, loadChildren: () => import('./edit/edit.saleOrder.module').then(m => m.EditSaleOrderModule) },
        { path: 'resume/:idx', data: {breadcrumb: 'Reanudar Orden de Venta'}, loadChildren: () => import('./resume/resume.saleOrder.module').then(m => m.ResumeSaleOrderModule) },
        { path: 'add', data: {breadcrumb: 'Nueva Orden de Venta'}, loadChildren: () => import('./add/add.saleOrder.module').then(m => m.AddSaleOrderModule) }
    ])],
    exports: [RouterModule]
})
export class SaleOrderRoutingModule { }