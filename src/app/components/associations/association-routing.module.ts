import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Asociación servicio instalación'}, loadChildren: () => import('./list/list.association.module').then(m => m.ListAssociationModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar asociación'}, loadChildren: () => import('./edit/edit.association.module').then(m => m.EditAssociationModule) },
        { path: 'add', data: {breadcrumb: 'Nueva asociación'}, loadChildren: () => import('./add/add.association.module').then(m => m.AddAssociationModule) },
    ])],
    exports: [RouterModule]
})
export class AssociationRoutingModule { }