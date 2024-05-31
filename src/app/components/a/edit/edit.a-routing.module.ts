import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditAComponent } from './edit.a.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditAComponent }
	])],
	exports: [RouterModule]
})
export class EditARoutigModule { }