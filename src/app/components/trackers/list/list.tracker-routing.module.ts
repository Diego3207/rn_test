import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTrackerComponent } from './list.tracker.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListTrackerComponent }
	])],
	exports: [RouterModule]
})
export class ListTrackerRoutigModule { }