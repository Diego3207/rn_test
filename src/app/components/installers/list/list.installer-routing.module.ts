import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListInstallerComponent } from './list.installer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListInstallerComponent }
	])],
	exports: [RouterModule]
})
export class ListInstallerRoutigModule { }