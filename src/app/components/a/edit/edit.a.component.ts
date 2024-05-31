import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './edit.a.component.html'
})
export class EditAComponent implements OnInit, OnDestroy {



    constructor( private route: ActivatedRoute ) 
	{

    }
	

    ngOnInit(): void 
	{
		var id=this.route.snapshot.paramMap.get("idx");
		//console.log(id);
		
    }


    ngOnDestroy() {
       
    }
}
