import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditModulesComponent } from './edit.modules.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditModulesComponent }
	])],
	exports: [RouterModule]
})
export class EditModulesRoutigModule { }