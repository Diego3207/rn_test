import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddBranchesComponent } from './add.branches.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddBranchesComponent }
	])],
	exports: [RouterModule]
})
export class AddBranchesRoutigModule { }