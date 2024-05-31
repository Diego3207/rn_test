import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCostumerComponent } from './edit.costumer.component';
import { EditCostumerRoutigModule } from './edit.costumer-routing.module';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
	imports: [
		CommonModule,
		EditCostumerRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		RadioButtonModule,
		TableModule,
		InputSwitchModule,
		InputMaskModule,
		AutoCompleteModule
	],
	declarations: [EditCostumerComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditCostumerModule { }
