import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListPackageComponent } from './list.packages.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListPackageComponent }
	])],
	exports: [RouterModule]
})
export class ListPackageRoutigModule { }