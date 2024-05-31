import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTrackerInstallationReviewComponent } from './list.trackerInstallationReview.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListTrackerInstallationReviewComponent }
	])],
	exports: [RouterModule]
})
export class ListTrackerInstallationReviewRoutigModule { }