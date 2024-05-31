import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddIncidenceComponent } from './add.incidence.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddIncidenceComponent }
	])],
	exports: [RouterModule]
})
export class AddIncidenceRoutigModule { }

