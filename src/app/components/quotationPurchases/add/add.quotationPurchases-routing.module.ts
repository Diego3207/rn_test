import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddQuotationPurchasesComponent } from './add.quotationPurchases.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddQuotationPurchasesComponent }
	])],
	exports: [RouterModule]
})
export class AddQuotationPurchasesRoutigModule { }