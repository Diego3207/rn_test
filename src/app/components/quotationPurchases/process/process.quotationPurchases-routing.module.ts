import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcessQuotationPurchasesComponent } from './process.quotationPurchases.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ProcessQuotationPurchasesComponent }
	])],
	exports: [RouterModule]
})
export class ProcessQuotationPurchasesRoutigModule { }