import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTicketComponent } from './list.tickets.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListTicketComponent }
	])],
	exports: [RouterModule]
})
export class ListTicketRoutingModule { }