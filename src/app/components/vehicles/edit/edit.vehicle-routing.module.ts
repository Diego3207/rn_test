import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditVehicleComponent } from './edit.vehicle.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditVehicleComponent }
	])],
	exports: [RouterModule]
})
export class EditVehicleRoutigModule { }