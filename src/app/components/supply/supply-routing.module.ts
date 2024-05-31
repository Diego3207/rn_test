import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Inventario'}, loadChildren: () => import('./list/list.supply.module').then(m => m.ListSupplyModule) },
        //{ path: 'edit/:idx', data: {breadcrumb: 'Editar Servicio'}, loadChildren: () => import('./edit/edit.service.module').then(m => m.EditServiceModule) },
        //{ path: 'add', data: {breadcrumb: 'Nuevo Servicio'}, loadChildren: () => import('./add/add.service.module').then(m => m.AddServiceModule) }
    ])],
    exports: [RouterModule]
})
export class SupplyRoutingModule { }