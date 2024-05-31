import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddServiceComponent } from './add.service.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddServiceComponent }
	])],
	exports: [RouterModule]
})
export class AddServiceRoutigModule { }