import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResumeSaleOrderComponent } from './resume.saleOrder.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ResumeSaleOrderComponent }
	])],
	exports: [RouterModule]
})
export class ResumeSaleOrderRoutigModule { }