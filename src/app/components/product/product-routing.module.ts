import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Productos'}, loadChildren: () => import('./list/list.product.module').then(m => m.ListProductModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Producto'}, loadChildren: () => import('./edit/edit.product.module').then(m => m.EditProductModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo Producto'}, loadChildren: () => import('./add/add.product.module').then(m => m.AddProductModule) }
    ])],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }