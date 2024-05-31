import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditServiceComponent } from './edit.service.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditServiceComponent }
	])],
	exports: [RouterModule]
})
export class EditServiceRoutigModule { }