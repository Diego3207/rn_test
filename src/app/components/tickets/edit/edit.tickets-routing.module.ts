import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditTicketComponent } from './edit.tickets.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditTicketComponent }
	])],
	exports: [RouterModule]
})
export class EditTicketRoutigModule { }