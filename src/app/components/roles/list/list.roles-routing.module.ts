import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListRolesComponent } from './list.roles.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListRolesComponent }
	])],
	exports: [RouterModule]
})
export class ListRolesRoutigModule { }