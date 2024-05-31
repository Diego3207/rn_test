import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSaleOrderComponent } from './list.saleOrder.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListSaleOrderComponent }
	])],
	exports: [RouterModule]
})
export class ListSaleOrderRoutigModule { }