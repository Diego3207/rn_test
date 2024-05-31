import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Desintalaciones'}, loadChildren: () => import('./list/list.trackerUninstall.module').then(m => m.ListTrackerUninstallModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Desinstalación'}, loadChildren: () => import('./edit/edit.trackerUninstall.module').then(m => m.EditTrackerUninstallModule) },
        { path: 'add/:idx', data: {breadcrumb: 'Nueva Desinstalación'}, loadChildren: () => import('./add/add.trackerUninstall.module').then(m => m.AddTrackerUninstallModule) },
    ])],
    exports: [RouterModule]
})
export class TrackerUninstallRoutingModule { }