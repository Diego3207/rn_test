import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

import { MiscService } from './service/misc.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	myProperty: boolean;

    constructor(private primengConfig: PrimeNGConfig, public miscService:MiscService) 
	{ }

    ngOnInit(): void 
	{
        this.primengConfig.ripple = true;
		
		this.miscService.myProperty$.subscribe((value) => 
		{
			this.myProperty = value;
		});
    }
}
