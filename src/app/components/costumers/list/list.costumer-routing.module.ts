import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCostumerComponent } from './list.costumer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListCostumerComponent }
	])],
	exports: [RouterModule]
})
export class ListCostumerRoutigModule { }