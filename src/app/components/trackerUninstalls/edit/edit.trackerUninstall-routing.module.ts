import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditTrackerUninstallComponent } from './edit.trackerUninstall.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditTrackerUninstallComponent }
	])],
	exports: [RouterModule]
})
export class EditTrackerInstallationRoutigModule { }