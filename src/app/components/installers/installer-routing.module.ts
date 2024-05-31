import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Instaladores'}, loadChildren: () => import('./list/list.installer.module').then(m => m.ListInstallerModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar instalador'}, loadChildren: () => import('./edit/edit.installer.module').then(m => m.EditInstallerModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo instalador'}, loadChildren: () => import('./add/add.installer.module').then(m => m.AddInstallerModule) },
    ])],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }