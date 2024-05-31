import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListQuotationSalesComponent } from './list.quotationSales.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListQuotationSalesComponent }
	])],
	exports: [RouterModule]
})
export class ListQuotationSalesRoutigModule { }