import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAssociationComponent } from './list.association.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListAssociationComponent }
	])],
	exports: [RouterModule]
})
export class ListAssociationRoutigModule { }