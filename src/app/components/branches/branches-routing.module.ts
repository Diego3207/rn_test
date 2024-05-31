import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Sucursales'}, loadChildren: () => import('./list/list.branches.module').then(m => m.ListBranchesModule) },
        { path: 'edit/:id', data: {breadcrumb: 'Editar sucursal'}, loadChildren: () => import('./edit/edit.branches.module').then(m => m.EditBranchesModule) },
		{ path: 'add', data: {breadcrumb: 'Nueva sucursal'}, loadChildren: () => import('./add/add.branches.module').then(m => m.AddBranchesModule) }
    ])],
    exports: [RouterModule]
})
export class BranchesRoutingModule { }