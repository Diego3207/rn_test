import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Proveedores'}, loadChildren: () => import('./list/list.provider.module').then(m => m.ListProviderModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Proveedor'}, loadChildren: () => import('./edit/edit.provider.module').then(m => m.EditProviderModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Proveedor'}, loadChildren: () => import('./add/add.provider.module').then(m => m.AddProviderModule) }
    ])],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }