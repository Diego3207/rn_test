import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddRolesComponent } from './add.roles.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddRolesComponent }
	])],
	exports: [RouterModule]
})
export class AddRolesRoutigModule { }