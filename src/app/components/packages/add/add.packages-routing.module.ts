import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddPackageComponent } from './add.packages.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddPackageComponent }
	])],
	exports: [RouterModule]
})
export class AddPackageRoutigModule { }