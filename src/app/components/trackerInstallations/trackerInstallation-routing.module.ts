import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Instalaciones'}, loadChildren: () => import('./list/list.trackerInstallation.module').then(m => m.ListTrackerInstallationModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Instalación'}, loadChildren: () => import('./edit/edit.trackerInstallation.module').then(m => m.EditTrackerInstallationModule) },
        { path: 'add', data: {breadcrumb: 'Nueva Instalación'}, loadChildren: () => import('./add/add.trackerInstallation.module').then(m => m.AddTrackerInstallationModule) },
        { path: 'add/:idCustomer/:idVehicle', data: {breadcrumb: 'Nueva Instalación'}, loadChildren: () => import('./add/add.trackerInstallation.module').then(m => m.AddTrackerInstallationModule) },

    ])],
    exports: [RouterModule]
})
export class TrackerInstallationRoutingModule { }