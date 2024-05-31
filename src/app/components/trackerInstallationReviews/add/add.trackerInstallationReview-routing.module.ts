import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddTrackerInstallationReviewComponent } from './add.trackerInstallationReview.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddTrackerInstallationReviewComponent }
	])],
	exports: [RouterModule]
})
export class AddTrackerInstallationReviewRoutigModule { }

