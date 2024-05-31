import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditBranchesComponent } from './edit.branches.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditBranchesComponent }
	])],
	exports: [RouterModule]
})
export class EditBranchesRoutigModule { }