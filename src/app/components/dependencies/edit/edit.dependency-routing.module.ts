import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditDependencyComponent } from './edit.dependency.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditDependencyComponent }
	])],
	exports: [RouterModule]
})
export class EditDependencyRoutigModule { }