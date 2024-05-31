import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditQuotationSalesComponent } from './edit.quotationSales.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditQuotationSalesComponent }
	])],
	exports: [RouterModule]
})
export class EditQuotationSalesRoutigModule { }