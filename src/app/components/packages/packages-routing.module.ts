import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Paquetes'}, loadChildren: () => import('./list/list.packages.module').then(m => m.ListPackageModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Paquete'}, loadChildren: () => import('./edit/edit.packages.module').then(m => m.EditPackageModule) },
        { path: 'add', data: {breadcrumb: 'Registrar Paquete'}, loadChildren: () => import('./add/add.packages.module').then(m => m.AddPackageModule) }
    ])],
    exports: [RouterModule]
})
export class PackageRoutingModule { }