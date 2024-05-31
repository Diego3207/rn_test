import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditSimCardsComponent } from './edit.simCards.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditSimCardsComponent }
	])],
	exports: [RouterModule]
})
export class EditSimCardsRoutigModule { }