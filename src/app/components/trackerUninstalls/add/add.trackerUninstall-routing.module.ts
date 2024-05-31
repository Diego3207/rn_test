import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddTrackerUninstallComponent } from './add.trackerUninstall.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddTrackerUninstallComponent }
	])],
	exports: [RouterModule]
})
export class AddTrackerUninstallRoutigModule { }

