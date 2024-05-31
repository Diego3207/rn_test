import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Ubicaciones'}, loadChildren: () => import('./list/list.location.module').then(m => m.ListLocationModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Ubicación'}, loadChildren: () => import('./edit/edit.location.module').then(m => m.EditLocationModule) },
        { path: 'add', data: {breadcrumb: 'Nueva ubicación'}, loadChildren: () => import('./add/add.location.module').then(m => m.AddLocationModule) },
    ])],
    exports: [RouterModule]
})
export class ProviderRoutingModule { }