import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListVehicleComponent } from './list.vehicle.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListVehicleComponent }
	])],
	exports: [RouterModule]
})
export class ListVehicleRoutigModule { }