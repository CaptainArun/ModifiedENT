import { Component, Input, OnInit, OnChanges, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ColumnConfig, TableConfig } from '../columnConfig';

@Component({
    selector: 'app-bms-tablecell',
    templateUrl: 'bms-tablecell.component.html'

})

export class BMSTableCellComponent implements OnChanges {
    @Input()
    config: ColumnConfig;

    @Input()
    data: any;

    isRight: boolean = false;
    isPre: boolean = false;
    hasCss: boolean = false;
    ngOnChanges(changes: any) {
        if (this.config.CssClass) {
            this.hasCss = true;
        }
        if (this.config.DisplayMode === '') {
            this.config.DisplayMode = 'Text';
        }
        else if (this.config.DisplayMode === 'Multiline') {
            this.isPre = true;
        }
        else if (this.config.DisplayMode === 'Numeric') {
            this.isRight = true;
            if (!this.config.FormatString) {
                this.config.FormatString = '.3-3';
            }
        }
        else if ((this.config.DisplayMode === 'DateTime') && (this.config.FormatString === '')) {
            this.config.FormatString = 'dd/MM/yyyy';
        }
    }
    getProperty(data: any, propertyName: string): any {
        return Reflect.get(data, propertyName);
    }
}
