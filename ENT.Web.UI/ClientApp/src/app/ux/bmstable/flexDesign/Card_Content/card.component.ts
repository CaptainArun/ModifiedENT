import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FlexCardConfig } from '../Card_Config';

@Component({
  selector: 'app-cardContent',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardContentComponent implements OnInit, OnChanges {

  //#region - Property

  IconsShow: FlexCardConfig = new FlexCardConfig();
  headerData: any;
  ContentData: any;
  HoverData: any = "";
  showarrow = false;

//Data from cardContainerComponent (using CI)
  @Input('configIcons') configIcons: FlexCardConfig;
  @Input('ParticularCarddata') listParticularData: any;
  @Input('HeaderSectionData') Header: any;
  @Input('ContentSectionData') Content: any;
  @Input('index') index: any;


  //Emits data for cardContainerComponent (using CI)
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

  //#endregion

  ngOnChanges() {

    this.listParticularData.showView = this.configIcons.showView;
    this.listParticularData.showEdit = this.configIcons.showEdit;
    this.listParticularData.showOpen = this.configIcons.showOpen;
    this.listParticularData.showCancel = this.configIcons.showCancel;
    this.listParticularData.showPayment = this.configIcons.showPayment;
    this.listParticularData.showOpeningItem = this.configIcons.showOpeningItem;
    this.listParticularData.showHistory = this.configIcons.showHistory;
    this.listParticularData.showCaseSheet = this.configIcons.showCaseSheet;
    this.listParticularData.showIntake = this.configIcons.showIntake;
    this.listParticularData.showSchedule = this.configIcons.showSchedule;
    this.listParticularData.showAnaesthesia = this.configIcons.showAnaesthesia;
    this.listParticularData.showDrugChart = this.configIcons.showDrugChart;
    this.listParticularData.showDrugAdminChart = this.configIcons.showDrugAdminChart;
    this.listParticularData.showEmail = this.configIcons.showEmail;
    this.listParticularData.showReport = this.configIcons.showReport;
    this.listParticularData.showDelete = this.configIcons.showDelete;

    this.bindItem.emit({ Item: this.listParticularData });
  }

  ngOnInit() {
    if (this.Header && this.Content) {
      this.headerData = this.Header;
      this.ContentData = this.Content;
    }
  }



  //#region - Emitting methods data for component

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

  //#endregion

  //#region - Emitted data for Hover the data

  hoverobjData(data: any) {

    if (data != "") {
      this.HoverData = data;
      this.showarrow = false;
    }
    else {
      this.showarrow = true;
      this.HoverData = "";
    }

  }

  //#endregion

}
