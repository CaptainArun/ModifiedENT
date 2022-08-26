import { Component, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { FlexCardConfig } from '../Card_Config';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-cardContainer',
  templateUrl: './cardContainer.component.html',
  styleUrls: ['./cardContainer.component.css']
})
export class cardContainerComponent implements OnInit {

  //#region Property
  headerList = [];
  ContentList = [];

  totalRows: number = 0;
  filteredData: Array<any> = [];
  currentData: Array<any> = [];
  filters: Array<any> = [];
  totalRecords: number = 0;
  public page: number = 0;
  public pageSize: number = 10;
  pageSizeOptions = [5, 10, 25, 100];


  //Data from component (using CI)
  @Input('dataForContainer') listData: Array<any>;  //list of [] Data
  @Input('configCard') config: FlexCardConfig;  //config setup of icons 


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;  //Paginator 


  //Emits data for component(using CI)
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


  //#endregion

  constructor() {}

  //#region - Logic (Seperating the HeaderSection and ContentSection data as per Card_view)

  ngOnChanges() {

    if (this.config && this.listData != null && this.listData != undefined) {

      this.configureTable();

      //FilterHeaderData - ColumnCardConfig interface && with FlexCardConfig property

      let filterHeaderData = this.config.FlexDataConfig;

      let Sampledata = filterHeaderData.forEach((data) => {

        if (data.SectionType === "Header") {
          this.headerList.push(data);
        }
        else {
          this.ContentList.push(data);
        }
      });
 
      this.listData.forEach((element) => {
        element.headerList = this.headerList;   // Adding Property headerList into listData particular obj...
        element.ContentList = this.ContentList; // Adding Property ContentList into listData particular obj...
      });
    }

    this.headerList = [];  // Empty headerList
    this.ContentList = []; // Empty ContentList
  }

  //#endregion

  ngOnInit() {}

  //#region - Logic (show-Pagination of Card_view)

  configureTable() {

    if (this.config.showPagination) {
      this.filteredData = this.listData; //Given the list of [] data to the filteredData
      this.totalRows = this.filteredData.length;
      this.currentData = this.filteredData.slice(0, this.pageSize);
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }
    else {
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
  }

  //#endregion

    // trackByFn(index, item) {
    //   return item.title;
    // }
   


  //#region - Emitting methods data for component 

  onBindItem(event: any) {
    this.bindItem.emit(event);
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

  //#endregion

}


