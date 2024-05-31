import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddAssociationComponent } from './add.association.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddAssociationComponent }
	])],
	exports: [RouterModule]
})
export class AddAssociationRoutigModule { }

