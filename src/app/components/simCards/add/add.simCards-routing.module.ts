import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddSimCardsComponent } from './add.simCards.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddSimCardsComponent }
	])],
	exports: [RouterModule]
})
export class AddSimCardsRoutigModule { }

