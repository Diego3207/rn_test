import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListProviderComponent } from './list.provider.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListProviderComponent }
	])],
	exports: [RouterModule]
})
export class ListProviderRoutigModule { }