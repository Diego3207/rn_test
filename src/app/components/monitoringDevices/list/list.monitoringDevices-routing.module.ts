import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListMonitoringDeviceComponent } from './list.monitoringDevices.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListMonitoringDeviceComponent }
	])],
	exports: [RouterModule]
})
export class ListMonitoringDeviceRoutingModule { }