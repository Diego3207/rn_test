import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTrackerComponent } from './add.tracker.component';
import { AddTrackerRoutigModule } from './add.tracker-routing.module';
import { ProviderService } from 'src/app/service/provider.service';
import { ProviderContactService } from 'src/app/service/providerContact.service';
import { ProviderLocationService } from 'src/app/service/providerLocation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TrackerService } from 'src/app/service/tracker.service';

@NgModule({
	imports: [
		CommonModule,
		AddTrackerRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		InputMaskModule,
		MultiSelectModule,
		DropdownModule,
		InputNumberModule
	],
	declarations: [AddTrackerComponent],
	providers: [TrackerService,ProviderContactService,ProviderLocationService, MessageService, ConfirmationService]
})
export class AddTrackerModule { }
