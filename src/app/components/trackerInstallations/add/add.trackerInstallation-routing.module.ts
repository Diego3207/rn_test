import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddTrackerInstallationComponent } from './add.trackerInstallation.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddTrackerInstallationComponent }
	])],
	exports: [RouterModule]
})
export class AddTrackerInstallationRoutigModule { }

