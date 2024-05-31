import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditPackageComponent } from './edit.packages.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditPackageComponent }
	])],
	exports: [RouterModule]
})
export class EditPackageRoutigModule { }