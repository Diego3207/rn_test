import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditProductComponent } from './edit.product.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: EditProductComponent }
	])],
	exports: [RouterModule]
})
export class EditProductRoutigModule { }