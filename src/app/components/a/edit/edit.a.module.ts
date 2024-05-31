import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAComponent } from './edit.a.component';
import { EditARoutigModule } from './edit.a-routing.module';


@NgModule({
	imports: [
		CommonModule,
		EditARoutigModule,
		
	],
	declarations: [EditAComponent]
})
export class EditAModule { }
