import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditPurchaseOrdersComponent } from './edit.purchaseOrders.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditPurchaseOrdersComponent }
	])],
	exports: [RouterModule]
})
export class EditPurchaseOrdersRoutigModule { }