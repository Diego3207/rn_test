import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListPurchaseOrdersComponent } from './list.purchaseOrders.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListPurchaseOrdersComponent }
	])],
	exports: [RouterModule]
})
export class ListPurchaseOrdersRoutigModule { }