import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcessQuotationSalesComponent } from './process.quotationSales.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ProcessQuotationSalesComponent }
	])],
	exports: [RouterModule]
})
export class ListQuotationSalesRoutigModule { }