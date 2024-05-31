import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListBranchesComponent } from './list.branches.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListBranchesComponent }
	])],
	exports: [RouterModule]
})
export class ListBranchesRoutigModule { }