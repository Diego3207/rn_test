import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddQuotationSalesComponent } from './add.quotationSales.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddQuotationSalesComponent }
	])],
	exports: [RouterModule]
})
export class AddQuotationSalesRoutigModule { }