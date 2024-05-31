import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTrackerUninstallComponent } from './list.trackerUninstall.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListTrackerUninstallComponent }
	])],
	exports: [RouterModule]
})
export class ListTrackerUninstallRoutigModule { }