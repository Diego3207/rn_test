import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddPurchaseOrdersComponent } from './add.purchaseOrders.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddPurchaseOrdersComponent }
	])],
	exports: [RouterModule]
})
export class AddPurchaseOrdersRoutigModule { }