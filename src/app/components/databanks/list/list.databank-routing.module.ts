import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListDataBankComponent } from './list.databank.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListDataBankComponent }
	])],
	exports: [RouterModule]
})
export class ListDataBankRoutigModule { }