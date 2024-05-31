import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditTrackerInstallationComponent } from './edit.trackerInstallation.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditTrackerInstallationComponent }
	])],
	exports: [RouterModule]
})
export class EditTrackerInstallationRoutigModule { }