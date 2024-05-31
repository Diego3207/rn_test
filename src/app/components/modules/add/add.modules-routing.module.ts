import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddModulesComponent } from './add.modules.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddModulesComponent }
	])],
	exports: [RouterModule]
})
export class AddModulesRoutigModule { }