import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Sim Card'}, loadChildren: () => import('./list/list.simCards.module').then(m => m.ListSimCardsModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Sim Card'}, loadChildren: () => import('./edit/edit.simCards.module').then(m => m.EditSimCardsModule) },
        { path: 'add', data: {breadcrumb: 'Nueva Sim Card'}, loadChildren: () => import('./add/add.simCards.module').then(m => m.AddSimCardsModule) },
    ])],
    exports: [RouterModule]
})
export class SimCardsRoutingModule { }