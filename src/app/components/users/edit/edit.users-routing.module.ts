import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditUsersComponent } from './edit.users.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditUsersComponent }
	])],
	exports: [RouterModule]
})
export class EditUsersRoutigModule { }