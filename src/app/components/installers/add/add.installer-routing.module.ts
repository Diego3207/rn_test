import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddInstallerComponent } from './add.installer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddInstallerComponent }
	])],
	exports: [RouterModule]
})
export class AddInstallerRoutigModule { }

