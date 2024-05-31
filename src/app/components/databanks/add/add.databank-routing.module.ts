import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddDataBankComponent } from './add.databank.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddDataBankComponent }
	])],
	exports: [RouterModule]
})
export class AddDataBankRoutingModule { }

