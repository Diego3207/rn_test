import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddTicketComponent } from './add.tickets.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddTicketComponent }
	])],
	exports: [RouterModule]
})
export class AddTicketRoutigModule { }

