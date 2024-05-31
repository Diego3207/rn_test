import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDataBankComponent } from './edit.databank.component';
import { EditDataBankRoutigModule } from './edit.databank-routing.module';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

@NgModule({
	imports: [
		CommonModule,
		EditDataBankRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		RadioButtonModule,
		TableModule	
	],
	declarations: [EditDataBankComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditDataBankModule { }
