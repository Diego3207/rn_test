import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Renovaciones'}, loadChildren: () => import('./list/list.renovation.module').then(m => m.ListRenovationModule) },
        //{ path: 'edit/:idx', data: {breadcrumb: 'Editar Servicio'}, loadChildren: () => import('./edit/edit.service.module').then(m => m.EditServiceModule) },
        //{ path: 'add', data: {breadcrumb: 'Nuevo Servicio'}, loadChildren: () => import('./add/add.service.module').then(m => m.AddServiceModule) }
    ])],
    exports: [RouterModule]
})
export class RenovationRoutingModule { }