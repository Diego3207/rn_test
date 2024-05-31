import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Rastreadores'}, loadChildren: () => import('./list/list.tracker.module').then(m => m.ListTrackerModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Rastreador'}, loadChildren: () => import('./edit/edit.tracker.module').then(m => m.EditTrackerModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Rastreador'}, loadChildren: () => import('./add/add.tracker.module').then(m => m.AddTrackerModule) }
    ])],
    exports: [RouterModule]
})
export class TrackerRoutingModule { }