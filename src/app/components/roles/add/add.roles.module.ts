import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ImageModule } from 'primeng/image';
import { PasswordModule } from 'primeng/password';

import { AddRolesComponent } from './add.roles.component';
import { AddRolesRoutigModule } from './add.roles-routing.module';
import { RoleService } from 'src/app/service/role.service';


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,		
		FormsModule,
		
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,		
		TableModule,
		InputMaskModule,
		FileUploadModule,
		DropdownModule,
		InputSwitchModule,
		ImageModule,
		PasswordModule,
		
		AddRolesRoutigModule,
	],
	
	declarations: [AddRolesComponent],
	
	providers: [
		RoleService, 
		
		MessageService, 
		ConfirmationService
	] 
})

export class AddRolesModule { }
