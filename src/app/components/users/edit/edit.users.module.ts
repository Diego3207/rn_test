import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUsersComponent } from './edit.users.component';
import { EditUsersRoutigModule } from './edit.users-routing.module';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
	imports: [
		CommonModule,
		EditUsersRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		InputMaskModule,
		FileUploadModule,
		DropdownModule,
		InputSwitchModule,
		ImageModule,
		PasswordModule
		
	],
	declarations: [EditUsersComponent],
	providers: [UserService, MessageService, ConfirmationService] 
})
export class EditUsersModule { }
