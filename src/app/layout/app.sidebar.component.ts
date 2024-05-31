import { Component, ElementRef, OnDestroy } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnDestroy {

    constructor(public layoutService: LayoutService, public el: ElementRef) {}

    get logoColor() {
        let logo;
        
        if(this.layoutService.config.colorScheme == 'light'){
            logo = (this.layoutService.config.menuTheme === 'white' || this.layoutService.config.menuTheme === 'orange') ? 'dark' : 'white';
        } 
        else {
            logo = 'dark';
        }
        return logo;
    }

    resetOverlay() {
        if(this.layoutService.state.overlayMenuActive) {
            this.layoutService.state.overlayMenuActive = false;
        }
    }

    ngOnDestroy() {
        this.resetOverlay();
    }
}
