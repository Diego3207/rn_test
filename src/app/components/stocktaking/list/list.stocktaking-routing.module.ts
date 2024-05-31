import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListStocktakingComponent } from './list.stocktaking.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListStocktakingComponent }
	])],
	exports: [RouterModule]
})
export class ListStocktakingRoutigModule { }