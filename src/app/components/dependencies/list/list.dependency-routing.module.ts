import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListDependencyComponent } from './list.dependency.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListDependencyComponent }
	])],
	exports: [RouterModule]
})
export class ListDependencyRoutigModule { }