import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditIncidenceComponent } from './edit.incidence.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditIncidenceComponent }
	])],
	exports: [RouterModule]
})
export class EditIncidenceRoutigModule { }