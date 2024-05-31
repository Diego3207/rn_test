import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListIncidenceComponent } from './list.incidence.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListIncidenceComponent }
	])],
	exports: [RouterModule]
})
export class ListIncidenceRoutigModule { }