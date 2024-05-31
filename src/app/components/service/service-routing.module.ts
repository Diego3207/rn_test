import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Servicios'}, loadChildren: () => import('./list/list.service.module').then(m => m.ListServiceModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Servicio'}, loadChildren: () => import('./edit/edit.service.module').then(m => m.EditServiceModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Servicio'}, loadChildren: () => import('./add/add.service.module').then(m => m.AddServiceModule) }
    ])],
    exports: [RouterModule]
})
export class ServiceRoutingModule { }