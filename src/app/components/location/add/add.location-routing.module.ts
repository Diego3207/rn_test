import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddLocationComponent } from './add.location.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddLocationComponent }
	])],
	exports: [RouterModule]
})
export class AddLocationRoutigModule { }

