import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSupplyComponent } from './list.supply.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListSupplyComponent }
	])],
	exports: [RouterModule]
})
export class ListSupplyRoutigModule { }