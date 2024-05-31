import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddSaleOrderComponent } from './add.saleOrder.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddSaleOrderComponent }
	])],
	exports: [RouterModule]
})
export class AddSaleOrderRoutingModule { }

