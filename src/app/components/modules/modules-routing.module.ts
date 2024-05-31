import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Modulos'}, loadChildren: () => import('./list/list.modules.module').then(m => m.ListModulesModule) },
        { path: 'edit/:id', data: {breadcrumb: 'Editar modulo'}, loadChildren: () => import('./edit/edit.modules.module').then(m => m.EditModulesModule) },
	    { path: 'add', data: {breadcrumb: 'Nuevo modulo'}, loadChildren: () => import('./add/add.modules.module').then(m => m.AddModulesModule) }
    ])],
    exports: [RouterModule]
})
export class ModulesRoutingModule { }