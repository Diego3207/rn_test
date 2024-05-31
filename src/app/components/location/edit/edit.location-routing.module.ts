import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditLocationComponent } from './edit.location.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditLocationComponent }
	])],
	exports: [RouterModule]
})
export class EditLocationRoutigModule { }