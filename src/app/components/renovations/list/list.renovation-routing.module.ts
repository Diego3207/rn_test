import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListRenovationComponent } from './list.renovation.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListRenovationComponent }
	])],
	exports: [RouterModule]
})
export class ListRenovationRoutigModule { }