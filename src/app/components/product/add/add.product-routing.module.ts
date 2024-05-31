import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddProductComponent } from './add.product.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: AddProductComponent }
	])],
	exports: [RouterModule]
})
export class AddProductRoutigModule { }

