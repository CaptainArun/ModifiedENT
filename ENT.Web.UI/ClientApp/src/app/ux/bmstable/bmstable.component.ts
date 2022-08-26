import { Component, Input, OnInit, OnChanges, ViewContainerRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


import { MaterialModuleControls } from '../../material.module';
import { MatPaginator } from '@angular/material';

import { ColumnConfig, TableConfig } from '../columnConfig';


@Component({
  selector: 'app-bms-table',
  templateUrl: 'bms-table.component.html'
})
export class BMSTableComponent implements OnInit, OnChanges {
  @Input()
  datas: Array<any> = [];

  @Input()
  config: TableConfig;

  @Input()
  showLoading: boolean = false;

  @Output()
  viewItem = new EventEmitter<any>();

  @Output()
  addItem = new EventEmitter<any>();

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

//Added icons code
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

  showPager: boolean = false;

  // @ViewChild(MatPaginator) pager: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  totalRows: number = 0;
  filteredData: Array<any> = [];
  currentData: Array<any> = [];
  filters: Array<any> = [];
  totalRecords: number = 0;
  public page: number = 0;
  public pageSize: number = 10;
  selectedItems: Array<any> = [];
  selectAll: boolean = false;
  pageSizeOptions = [5, 10, 25, 100];

  orderBy: string = "";
  ascending: boolean = true;

  isSorting: boolean = false;

  constructor(
    private router: Router,
    private datePipe: DatePipe
  ) {

  }

  getProperty(data: any, propertyName: string): any {
    return Reflect.get(data, propertyName);
    //return Reflect.getMetadata(data, propertyName);
  }


  ngOnInit() {
    //this.currentData =  this.datas ? this.datas.slice(0, this.pageSize ) : [];
  }


  ngOnChanges(changes: any) {
    if (this.config != undefined) {
      for (let i = 0; i < this.config.columnConfig.length; i++) {
        if (this.config.columnConfig[i].isVisible == undefined) {
          this.config.columnConfig[i].isVisible = true;
        }
        if (this.config.columnConfig[i].width == undefined) {
          this.config.columnConfig[i].width = "150px";
        }
      }
    }
    if (this.datas != undefined) {
      this.filteredData = this.datas
      this.configureTable();
    }
    if (this.showLoading) {
      this.currentData = [];
    }
  }

  configureTable() {
    if (this.config.showPagination) {
      this.totalRows = this.filteredData.length;
      this.currentData = this.filteredData.slice(0, this.pageSize);
      this.showPager = this.filteredData.length > 0 ? true : false;
      if (this.pager) { this.pager.firstPage(); }
    } else {
      this.currentData = this.filteredData;
      this.totalRows = this.filteredData.length;
    }
  }

  onPageChange(page: any) {
    this.pageSize = page.pageSize;
    let pageNo: number = page.pageIndex;
    let startData: number = (pageNo) * page.pageSize;
    let endData: number = (pageNo + 1) * page.pageSize;
    this.totalRows = this.filteredData.length;
    this.currentData = this.filteredData.slice(startData, endData);
    this.selectAll = false;
    this.selectedItems = [];

  }
  goToDetail(event: any) {
    this.viewItem.emit(event);
  }

  goToEdit(event: any) {
    this.editItem.emit(event);
  }
  goToAdd(event: any) {
    this.addItem.emit({ Event: event });
  }

  goToOpen(event: any) {
    this.openItem.emit(event);
  }

  goToDelete(event: any) {
    this.deleteItem.emit(event);
  }
  
  //Added icons code
  goToCancel(event: any) {
    this.cancelItem.emit(event);
  }

  goToPayment(event: any) {
    this.paymentItem.emit(event);
  }

  goToopeningItem(event: any) {
    this.openingItem.emit(event);
  }

  goToHistory(event: any) {
    this.historyItem.emit(event);
  }

  goToCaseSheet(event: any) {
    this.caseSheetItem.emit(event);
  }

  goToIntake(event: any) {
    this.intakeItem.emit(event);
  }

  goToSchedule(event: any) {
    this.scheduleItem.emit(event);
  }

  goToAnaesthesia(event: any) {
    this.anaesthesiaItem.emit(event);
  }

  goToDrugChart(event: any) {
    this.drugChartItem.emit(event);
  }

  goToDrugAdminChart(event: any) {
    this.drugAdminChartItem.emit(event);
  }

  goToEmail(event: any) {
    this.emailItem.emit(event);
  }

  goToReport(event: any) {
    this.reportItem.emit(event);
  }

  setOrder(colConfig: any) {
    this.isSorting = true;
    if (this.orderBy == colConfig.PropertyName) {
      this.ascending = !this.ascending;
    }
    else {
      this.orderBy = colConfig.PropertyName;
      this.ascending = true;
    }
    let chkConst = this.ascending ? -1 : 1;
    this.filteredData.sort(
      (left, right) => {
        if (this.getProperty(left, this.orderBy) < this.getProperty(right, this.orderBy)) { return 1 * chkConst; }
        if (this.getProperty(left, this.orderBy) > this.getProperty(right, this.orderBy)) { return -1 * chkConst; }
        return 0;

      }
    );
    this.configureTable();
  }

  onSelectAll(event: any) {
    let checked: boolean;
    if (event.target) {
      checked = event.target.checked;
    }
    else if (event.srcElement) {
      checked = event.srcElement.checked;
    }
    if (this.currentData) {
      for (let i = 0; i < this.currentData.length; i++) {
        this.currentData[i].checked = checked;
      }
      this.selectedItems = [];
      if (checked) {
        this.selectedItems = this.currentData.slice();
      }
      this.selectItem.emit({ Event: event, Item: undefined, Checked: checked, SelectedItems: this.selectedItems })
    }
  }

  onSelect(event: any) {

    let checked: boolean = event.Checked;


    if (checked) {
      this.selectedItems.push(event.Item);
    }
    else {
      let index: number = this.selectedItems.indexOf(event.Item);
      let temp: Array<any> = [];
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (i != index) {
          temp.push(this.selectedItems[i]);
        }

      }
      this.selectedItems = temp;
    }
    this.selectItem.emit({ Event: event, SelectedItems: this.selectedItems })
  }

  onBindItem(event: any) {
    if (!this.isSorting) {
      this.bindItem.emit(event);
    }
  }

  showFilter(colConfig: any) {
    colConfig.showFilterLoading = true;
    colConfig.filters = this.getFilterValues(colConfig);
    colConfig.showFilters = true;
    colConfig.showFilterLoading = false;
  }
  filterData(colConfig: any, value: any) {
    this.isSorting = true;
    this.filteredData = this.filteredData.filter(x => this.getProperty(x, colConfig.PropertyName) == value);
    this.configureTable();
    colConfig.filtered = true;
    colConfig.showFilters = false;
    colConfig.filterValue = value;
  }

  clearFilter(colConfig: any) {
    colConfig.filtered = false;
    colConfig.filterValue = "";
    this.filteredData = this.datas;
    for (let i = 0; i < this.config.columnConfig.length; i++) {
      if (this.config.columnConfig[i].filtered) {
        this.filterData(this.config.columnConfig[i], this.config.columnConfig[i].filterValue)
      }
    }
    colConfig.showFilters = false;
    this.configureTable();
  }

  getFilterValues(colConfig: any) {
    let filterValues: Array<any> = [];
    for (let i = 0; i < this.filteredData.length; i++) {
      if (filterValues.filter(x => x.value == this.getProperty(this.filteredData[i], colConfig.PropertyName)).length == 0) {
        if (colConfig.DisplayMode == 'DateTime') {
          filterValues.push({ value: this.datePipe.transform(this.getProperty(this.filteredData[i], colConfig.PropertyName), colConfig.FormatString) });
        }
        else {
          filterValues.push({ value: this.getProperty(this.filteredData[i], colConfig.PropertyName) });
        }
      }
    }
    return filterValues;
  }
}
