import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Incidencias'}, loadChildren: () => import('./list/list.incidence.module').then(m => m.ListIncidenceModule) },
        { path: 'view/:idx', data: {breadcrumb: 'Incidencia'}, loadChildren: () => import('./edit/edit.incidence.module').then(m => m.EditIncidenceModule) },
        { path: 'add', data: {breadcrumb: 'Nueva incidencia'}, loadChildren: () => import('./add/add.incidence.module').then(m => m.AddIncidenceModule) },
    ])],
    exports: [RouterModule]
})
export class IncidenceRoutingModule { }