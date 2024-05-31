import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditMonitoringDeviceComponent } from './edit.monitoringDevices.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditMonitoringDeviceComponent }
	])],
	exports: [RouterModule]
})
export class EditLocationRoutigModule { }