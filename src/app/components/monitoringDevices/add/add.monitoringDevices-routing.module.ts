import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddMonitoringDeviceComponent } from './add.monitoringDevices.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddMonitoringDeviceComponent }
	])],
	exports: [RouterModule]
})
export class AddMonitoringDeviceRoutigModule { }

