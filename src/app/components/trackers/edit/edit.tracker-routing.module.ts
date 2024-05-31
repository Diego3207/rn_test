import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditTrackerComponent } from './edit.tracker.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditTrackerComponent }
	])],
	exports: [RouterModule]
})
export class EditTrackerRoutigModule { }