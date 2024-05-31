import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditTrackerInstallationReviewComponent } from './edit.trackerInstallationReview.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditTrackerInstallationReviewComponent }
	])],
	exports: [RouterModule]
})
export class EditTrackerInstallationReviewRoutigModule { }