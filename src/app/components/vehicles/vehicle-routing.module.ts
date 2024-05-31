import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Vehículos'}, loadChildren: () => import('./list/list.vehicle.module').then(m => m.ListVehicleModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar vehículo'}, loadChildren: () => import('./edit/edit.vehicle.module').then(m => m.EditVehicleModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo Vehículo'}, loadChildren: () => import('./add/add.vehicle.module').then(m => m.AddVehicleModule) },
    ])],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }