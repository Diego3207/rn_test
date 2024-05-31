import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'A List'}, loadChildren: () => import('./list/list.a.module').then(m => m.ListAModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'A Edit'}, loadChildren: () => import('./edit/edit.a.module').then(m => m.EditAModule) }
    ])],
    exports: [RouterModule]
})
export class ARoutingModule { }