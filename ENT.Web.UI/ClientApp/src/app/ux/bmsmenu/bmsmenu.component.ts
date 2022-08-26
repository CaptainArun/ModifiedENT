import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bms-menu',
    templateUrl: 'bmsmenu.component.html'
})
export class BMSMenu implements OnInit, OnChanges {

    @Input()
    items: Array<any> = [];
    menuOpen: boolean = true;
    currentMenuItem: string = '';

    @Output()
    menuClick = new EventEmitter<any>();

    ngOnInit() {

    }
    ngOnChanges(e: any) {

    }

    onSelctItem(event: any) {
        this.menuClick.emit(event);
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].Title !== event.Title) {
                this.items[i].isOpen = false;
            } else {
                if (this.menuOpen === true) {
                    this.items[i].isOpen = true;
                    this.currentMenuItem = this.items[i].Title;
                    this.menuOpen = false;
                } else {
                    if (this.items[i].Title === this.currentMenuItem) {
                        this.items[i].isOpen = false;
                        this.menuOpen = true;
                    } else {
                        this.items[i].isOpen = true;
                        this.currentMenuItem = this.items[i].Title;
                        this.menuOpen = false;
                    }

                }
            }
        }
    }
}


export interface IMenu {
    Title: string;
    Url: string;
    isOpen?: boolean;
    Items?: Array<IMenu>;
    Icon?: string;
}
