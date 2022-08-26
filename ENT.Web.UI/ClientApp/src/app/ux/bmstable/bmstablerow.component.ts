import { Component, Input, OnInit, OnChanges, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ColumnConfig, TableConfig } from '../columnConfig';

@Component({
  selector: 'app-bms-tablerow',
  templateUrl: 'bms-tablerow.component.html'
})
export class BMSTableRowComponent implements OnInit, OnChanges {

  @Input()
  data: any;

  @Input()
  config: TableConfig;

  @Input()
  index: any;

  @Output()
  viewItem = new EventEmitter<any>();

  @Output()
  editItem = new EventEmitter<any>();

  @Output()
  selectItem = new EventEmitter<any>();

  @Output()
  bindItem = new EventEmitter<any>();

  @Output()
  deleteItem = new EventEmitter<any>();

  @Output()
  openItem = new EventEmitter<any>();

  @Output()
  cancelItem = new EventEmitter<any>();

  @Output()
  paymentItem = new EventEmitter<any>();

  @Output()
  openingItem = new EventEmitter<any>();

  @Output()
  historyItem = new EventEmitter<any>();

  @Output()
  caseSheetItem = new EventEmitter<any>();

  @Output()
  intakeItem = new EventEmitter<any>();

  @Output()
  scheduleItem = new EventEmitter<any>();

  @Output()
  anaesthesiaItem = new EventEmitter<any>();

  @Output()
  drugChartItem = new EventEmitter<any>();

  @Output()
  drugAdminChartItem = new EventEmitter<any>();

  @Output()
  emailItem = new EventEmitter<any>();

  @Output()
  reportItem = new EventEmitter<any>();

  showView: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  showOpen: boolean = false;

  showCancel: Boolean = false;
  showPayment: Boolean = false;
  showOpeningItem: Boolean = false;
  showHistory: Boolean = false;
  showCaseSheet: Boolean = false;
  showIntake: Boolean = false;
  showSchedule: Boolean = false;
  showAnaesthesia: Boolean = false;
  showDrugChart: Boolean = false;
  showDrugAdminChart: Boolean = false;
  showEmail: Boolean = false;
  showReport: Boolean = false;


  ngOnInit() {

  }

  ngOnChanges(changes: any) {
    
    this.data.showView = this.config.showView;
    this.data.showEdit = this.config.showEdit;
    this.data.showOpen = this.config.showOpen;

    this.data.showCancel = this.config.showCancel;
    this.data.showPayment = this.config.showPayment;
    this.data.showOpeningItem = this.config.showOpeningItem;
    this.data.showHistory = this.config.showHistory;
    this.data.showCaseSheet = this.config.showCaseSheet;
    this.data.showIntake = this.config.showIntake;
    this.data.showSchedule = this.config.showSchedule;
    this.data.showAnaesthesia = this.config.showAnaesthesia;
    this.data.showDrugChart = this.config.showDrugChart;
    this.data.showDrugAdminChart = this.config.showDrugAdminChart;
    this.data.showEmail = this.config.showEmail;
    this.data.showReport = this.config.showReport;

    this.data.showDelete = this.config.showDelete;


    this.bindItem.emit({ Item: this.data });
  }

  getProperty(data: any, propertyName: string): any {
    return Reflect.get(data, propertyName);
  }

  goToDetail(event: any, data: any) {
    this.viewItem.emit({ Event: event, Item: data });
  }

  goToEdit(event: any, data: any) {
    this.editItem.emit({ Event: event, Item: data });
  }

  goToDelete(event: any, data: any) {
    this.deleteItem.emit({ Event: event, Item: data });
  }

  goToOpen(event: any, data: any) {
    this.openItem.emit({ Event: event, Item: data });
  }

  goToCancel(event: any, data: any) {
    this.cancelItem.emit({ Event: event, Item: data });
  }

  goToPayment(event: any, data: any) {
    this.paymentItem.emit({ Event: event, Item: data });
  }

  goToopeningItem(event: any, data: any) {
    this.openingItem.emit({ Event: event, Item: data });
  }

  goToHistory(event: any, data: any) {
    this.historyItem.emit({ Event: event, Item: data });
  }

  goToCaseSheet(event: any, data: any) {
    this.caseSheetItem.emit({ Event: event, Item: data });
  }

  goToIntake(event: any, data: any) {
    this.intakeItem.emit({ Event: event, Item: data });
  }

  goToSchedule(event: any, data: any) {
    this.scheduleItem.emit({ Event: event, Item: data });
  }

  goToAnaesthesia(event: any, data: any) {
    this.anaesthesiaItem.emit({ Event: event, Item: data });
  }

  goToDrugChart(event: any, data: any) {
    this.drugChartItem.emit({ Event: event, Item: data });
  }

  goToDrugAdminChart(event: any, data: any) {
    this.drugAdminChartItem.emit({ Event: event, Item: data });
  }

  goToEmail(event: any, data: any) {
    this.emailItem.emit({ Event: event, Item: data });
  }

  goToReport(event: any, data: any) {
    this.reportItem.emit({ Event: event, Item: data });
  }


  onSelect(event: any, data: any) {

    let checked: boolean;
    if (event.target) {
      checked = event.target.checked;
    }
    else if (event.srcElement) {
      checked = event.srcElement.checked;
    }
    this.selectItem.emit({ Event: event, Checked: checked, Item: data });
  }
}
