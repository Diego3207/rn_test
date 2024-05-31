import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Directorio'}, loadChildren: () => import('./list/list.dependency.module').then(m => m.ListDependencyModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar registro'}, loadChildren: () => import('./edit/edit.dependency.module').then(m => m.EditDependencyModule) },
        { path: 'add', data: {breadcrumb: 'Registrar en directorio'}, loadChildren: () => import('./add/add.dependency.module').then(m => m.AddDependencyModule) }
    ])],
    exports: [RouterModule]
})
export class DependencyRoutingModule { }