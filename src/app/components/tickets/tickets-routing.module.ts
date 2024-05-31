import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Tickets de monitoreo'}, loadChildren: () => import('./list/list.tickets.module').then(m => m.ListTicketModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Ticket de monitoreo'}, loadChildren: () => import('./edit/edit.tickets.module').then(m => m.EditTicketModule) },
        { path: 'add', data: {breadcrumb: 'Nuevo Ticket de monitoreo'}, loadChildren: () => import('./add/add.tickets.module').then(m => m.AddTicketModule) },
    ])],
    exports: [RouterModule]
})
export class TicketsRoutingModule { }