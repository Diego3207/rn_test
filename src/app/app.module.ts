import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy , CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';

import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './service/httpInterceptor.service';
@NgModule
({
    declarations:
	[
        AppComponent,
    ],

    imports:
	[
        //TableModule,
        AppRoutingModule,
        AppLayoutModule,
		ProgressSpinnerModule, //para uso del spiner en el componente principal
		CommonModule,  //para el uso del ngif en el componente principal
        ToastModule
    ],

    providers:
	[
        { provide: LocationStrategy, useClass: HashLocationStrategy },

        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
