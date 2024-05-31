import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditAssociationComponent } from './edit.association.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditAssociationComponent }
	])],
	exports: [RouterModule]
})
export class EditAssociationRoutigModule { }