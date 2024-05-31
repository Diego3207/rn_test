import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddCostumerComponent } from './add.costumer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddCostumerComponent }
	])],
	exports: [RouterModule]
})
export class AddCostumerRoutingModule { }

