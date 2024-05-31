import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTrackerInstallationComponent } from './list.trackerInstallation.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListTrackerInstallationComponent }
	])],
	exports: [RouterModule]
})
export class ListTrackerInstallationRoutigModule { }