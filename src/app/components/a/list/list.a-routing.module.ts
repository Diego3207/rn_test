import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAComponent } from './list.a.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListAComponent }
	])],
	exports: [RouterModule]
})
export class ListARoutigModule { }