import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcessPurchaseOrdersComponent } from './process.purchaseOrders.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ProcessPurchaseOrdersComponent }
	])],
	exports: [RouterModule]
})
export class ListPurchaseOrdersRoutigModule { }