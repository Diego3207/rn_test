import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Roles'}, loadChildren: () => import('./list/list.roles.module').then(m => m.ListRolesModule) },
        { path: 'edit/:id', data: {breadcrumb: 'Editar rol'}, loadChildren: () => import('./edit/edit.roles.module').then(m => m.EditRolesModule) },
	    { path: 'add', data: {breadcrumb: 'Nuevo rol'}, loadChildren: () => import('./add/add.roles.module').then(m => m.AddRolesModule) }
    ])],
    exports: [RouterModule]
})
export class RolesRoutingModule { }