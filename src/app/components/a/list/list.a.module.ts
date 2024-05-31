import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAComponent } from './list.a.component';
import { ListARoutigModule } from './list.a-routing.module';


@NgModule({
	imports: [
		CommonModule,
		ListARoutigModule,
		
	],
	declarations: [ListAComponent]
})
export class ListAModule { }
