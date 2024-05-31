import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Usuarios'}, loadChildren: () => import('./list/list.users.module').then(m => m.ListUsersModule) },
        { path: 'edit/:id', data: {breadcrumb: 'Editar usuario'}, loadChildren: () => import('./edit/edit.users.module').then(m => m.EditUsersModule) },
		{ path: 'add', data: {breadcrumb: 'Nuevo usuario'}, loadChildren: () => import('./add/add.users.module').then(m => m.AddUsersModule) }
    ])],
    exports: [RouterModule]
})
export class UsersRoutingModule { }