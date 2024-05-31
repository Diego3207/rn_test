import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddVehicleComponent } from './add.vehicle.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddVehicleComponent }
	])],
	exports: [RouterModule]
})
export class AddVehicleRoutigModule { }

