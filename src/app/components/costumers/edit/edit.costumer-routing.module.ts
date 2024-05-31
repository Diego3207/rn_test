import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditCostumerComponent } from './edit.costumer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditCostumerComponent }
	])],
	exports: [RouterModule]
})
export class EditCostumerRoutigModule { }