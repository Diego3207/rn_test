import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ImageModule } from 'primeng/image';
import { PasswordModule } from 'primeng/password';

import { EditRolesComponent } from './edit.roles.component';
import { EditRolesRoutigModule } from './edit.roles-routing.module';
import { ModuleService } from 'src/app/service/module.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		InputMaskModule,
		DropdownModule,
		InputSwitchModule,
		ImageModule,
		
		EditRolesRoutigModule,
		
	],
	declarations: [EditRolesComponent],
	providers: [ModuleService, MessageService, ConfirmationService] 
})
export class EditRolesModule { }