import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditInstallerComponent } from './edit.installer.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditInstallerComponent }
	])],
	exports: [RouterModule]
})
export class EditInstallerRoutigModule { }