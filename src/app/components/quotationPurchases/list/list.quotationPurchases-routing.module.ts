import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListQuotationPurchasesComponent } from './list.quotationPurchases.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListQuotationPurchasesComponent }
	])],
	exports: [RouterModule]
})
export class ListQuotationPurchasesRoutigModule { }