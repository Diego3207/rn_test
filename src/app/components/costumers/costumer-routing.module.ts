import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Clientes'}, loadChildren: () => import('./list/list.costumer.module').then(m => m.ListCostumerModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Cliente'}, loadChildren: () => import('./edit/edit.costumer.module').then(m => m.EditCostumerModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo Cliente'}, loadChildren: () => import('./add/add.costumer.module').then(m => m.AddCostumerModule) }
    ])],
    exports: [RouterModule]
})
export class CostumerRoutingModule { }