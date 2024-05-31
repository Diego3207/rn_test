import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditProviderComponent } from './edit.provider.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditProviderComponent }
	])],
	exports: [RouterModule]
})
export class EditProviderRoutigModule { }