import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListModulesComponent } from './list.modules.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListModulesComponent }
	])],
	exports: [RouterModule]
})
export class ListModulesRoutigModule { }