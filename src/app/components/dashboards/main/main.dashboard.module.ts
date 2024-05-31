import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDashboardComponent } from './main.dasboard.component';
import { MainDashboardRoutigModule } from './main.dashboard-routing.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';

import { FileUploadModule } from 'primeng/fileupload';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';



@NgModule({
    imports: [
        CommonModule,
        MainDashboardRoutigModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        FormsModule,
        TableModule,
        ChartModule,
        MenuModule,
        FileUploadModule,
        CarouselModule,
        GalleriaModule
    ],
    declarations: [MainDashboardComponent]
})
export class MainDashboardModule { }
