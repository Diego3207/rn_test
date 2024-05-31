import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditDataBankComponent } from './edit.databank.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditDataBankComponent }
	])],
	exports: [RouterModule]
})
export class EditDataBankRoutigModule { }