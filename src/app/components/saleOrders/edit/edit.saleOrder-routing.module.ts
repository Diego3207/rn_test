import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditSaleOrderComponent } from './edit.saleOrder.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditSaleOrderComponent }
	])],
	exports: [RouterModule]
})
export class EditSaleOrderRoutigModule { }