import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Dispositivos de monitoreo'}, loadChildren: () => import('./list/list.monitoringDevices.module').then(m => m.ListMonitoringDeviceModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar dispositivo de monitoreo'}, loadChildren: () => import('./edit/edit.monitoringDevices.module').then(m => m.EditMonitoringDeviceModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo dispositivo de monitoreo'}, loadChildren: () => import('./add/add.monitoringDevices.module').then(m => m.AddMonitoringDeviceModule) },
    ])],
    exports: [RouterModule]
})
export class MonitoringDevicesRoutingModule { }