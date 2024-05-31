import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditQuotationPurchasesComponent } from './edit.quotationPurchases.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditQuotationPurchasesComponent }
	])],
	exports: [RouterModule]
})
export class EditQuotationPurchasesRoutigModule { }