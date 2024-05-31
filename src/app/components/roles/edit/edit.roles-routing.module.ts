import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditRolesComponent } from './edit.roles.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditRolesComponent }
	])],
	exports: [RouterModule]
})
export class EditRolesRoutigModule { }