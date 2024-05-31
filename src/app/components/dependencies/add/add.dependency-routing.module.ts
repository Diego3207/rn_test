import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddDependencyComponent } from './add.dependency.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddDependencyComponent }
	])],
	exports: [RouterModule]
})
export class AddDependencyRoutigModule { }