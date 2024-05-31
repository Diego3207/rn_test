import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddProviderComponent } from './add.provider.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddProviderComponent }
	])],
	exports: [RouterModule]
})
export class AddProviderRoutigModule { }