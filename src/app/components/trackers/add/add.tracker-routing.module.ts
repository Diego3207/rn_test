import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddTrackerComponent } from './add.tracker.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddTrackerComponent }
	])],
	exports: [RouterModule]
})
export class AddTrackerRoutigModule { }