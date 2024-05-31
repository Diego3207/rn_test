import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Cuentas Bancarias'}, loadChildren: () => import('./list/list.databank.module').then(m => m.ListDataBankModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Cuenta de Banco'}, loadChildren: () => import('./edit/edit.databank.module').then(m => m.EditDataBankModule) },
        { path: 'add', data: {breadcrumb: 'Nueva Cuenta de Banco'}, loadChildren: () => import('./add/add.databank.module').then(m => m.AddDataBankModule) }
    ])],
    exports: [RouterModule]
})
export class DataBankRoutingModule { }