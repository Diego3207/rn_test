import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListServiceComponent } from './list.service.component';

@NgModule({
	imports: [RouterModule.forChild
	([
		{ path: '', component: ListServiceComponent }
	])],
	exports: [RouterModule]
})
export class ListServiceRoutigModule { }