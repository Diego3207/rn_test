import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSimCardsComponent } from './list.simCards.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListSimCardsComponent }
	])],
	exports: [RouterModule]
})
export class ListSimCardsRoutigModule { }