import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list.users.component';
import { ListUsersRoutigModule } from './list.users-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/service/user.service'
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';

@NgModule({
	imports: [
		CommonModule,
		ListUsersRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		ImageModule
	],
	declarations: [ListUsersComponent],
	providers: [UserService, MessageService, ConfirmationService]
})
export class ListUsersModule { }

/*import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list.users.component';
import { ListUsersRoutigModule } from './list.users-routing.module';
import { ToolbarModule } from 'primeng/toolbar';


import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
 import { ButtonModule } from 'primeng/button';
 import { InputTextModule } from 'primeng/inputtext';
 //import { ToggleButtonModule } from 'primeng/togglebutton';
 //import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
 //import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
 //import { RatingModule } from 'primeng/rating';

@NgModule({
	imports: [
		CommonModule,
		ListUsersRoutigModule,
		
	FormsModule,
		TableModule,
	//RatingModule,
	ButtonModule,
		SliderModule,
	InputTextModule,
	//ToggleButtonModule,
	//RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
	//ToastModule
		ToolbarModule,
		
	],
	declarations: [ListUsersComponent]
})
export class ListUsersModule { }*/
