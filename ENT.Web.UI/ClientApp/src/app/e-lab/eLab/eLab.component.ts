import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../core/custom-http.service';
import { eLabService } from '../eLab.service';
import { ElabSearchModel } from '../models/searchModelELab';
import { eMailComponent } from './eLab-eMail/eLab-eMail.component';
import { eLabUpdateReportComponent } from './eLab-update-report/eLab-update-report.component';
import { UtilService } from '../../core/util.service';
import { eLabNewRequestComponent } from './eLab-new-request/eLab-new-request-add-view.component';
import { eLabNewRequestViewComponent } from './eLab-new-request/eLab-request -View/eLab-request-view.component';
import { eLabNewRequestEditComponent } from './eLab-new-request/eLab-request -edit/eLab-request-edit.component';
import { TableConfig } from 'src/app/ux/columnConfig';
import { eLabOrderEditComponent } from './eLab-order-edit/eLab-order-edit.component';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-eLabComponent',
  templateUrl: './eLab.component.html',
  styleUrls: ['./eLab.component.css']
})

export class eLabComponent implements OnInit {

  //#region Property declaration
  tableConfigOrder: TableConfig = new TableConfig();
  tableConfigRequest: TableConfig = new TableConfig();
  searchForm: FormGroup;
  searchModel: ElabSearchModel = new ElabSearchModel();
  IsOrderList: boolean = true;
  TableDataOrder: any;
  TableDataRequest: any;
  countDetails: any;
  statusValue: any;
  patientRecord: any;
  patientId: number = 0;
  ProviderId: any = 0;
  providerRecord: any;
  labOrderNumber: any;
  noRecordShowOrder: boolean = false;
  noRecordShowRequest: any;
  IsDateCorect: boolean;
  orderListIsActive: boolean = false;
  requestListIsActive: boolean = false;
  @ViewChild('autoCompletePatientName', { static: false, read: MatAutocompleteTrigger }) triggerPatientName: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) triggerPhysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteNumber', { static: false, read: MatAutocompleteTrigger }) triggerNumber: MatAutocompleteTrigger;
  //#endregion Property declaration

  //#region Constructor
  constructor(public fb: FormBuilder, public dialog: MatDialog, private router: Router, private customHttpSvc: CustomHttpService, public elabService: eLabService, private util: UtilService,) {
    this.tableConfigOrder.showPagination = true;
    this.tableConfigOrder.showView = true;
    this.tableConfigOrder.showEdit = true;
    this.tableConfigOrder.showEmail = true;
    this.tableConfigOrder.showReport = true;
    this.tableConfigOrder.showCancel = true;

    this.tableConfigOrder.columnConfig = [
      { PropertyName: 'LabOrderNo', DisplayName: 'Order No', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'facilityName', DisplayName: 'facility name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'patientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'physicianName', DisplayName: 'Requesting Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time / Admission Date', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Createddate', DisplayName: 'Test On Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'LabOrderStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    ];

    this.tableConfigRequest.showPagination = true;
    this.tableConfigRequest.showView = true;
    this.tableConfigRequest.showEdit = true;

    this.tableConfigRequest.columnConfig = [

      { PropertyName: 'facilityName', DisplayName: 'facility name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'patientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RequestingPhysician', DisplayName: 'Requesting Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time / Admission Date', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RequestedDate', DisplayName: 'On Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'LabOrderStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    ];
  }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.searchForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      LabOrderNo: [''],
      status: [''],
      PatientId: [''],
      ProviderId: [''],

    });
    this.searchSubmitForm();
    this.getTableDataRequest();
    this.getCountDetails();
    this.getStatusValue();
    this.getPatientRecord();
    this.getProviderRecord();
    this.getLabOrderNumbers();
    this.CheckValidDate();
    this.setTableOrder()
  }

  ngAfterViewInit() {
    this.triggerNumber.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('LabOrderNo').setValue('');
      }
    });

    this.triggerPatientName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('PatientId').setValue('');
      }
    });

    this.triggerPhysician.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('ProviderId').setValue('');
      }
    });


  }
  //#endregion ngOnInit

  //#region Bind BMS Table data for Admission Or Visit
  onBindItemRequest(event: any) {
    if (event.Item.visitDateandTime == null) {
      event.Item.visitDateandTime = event.Item.AdmissionDateandTime;
    }
  }

  onBindItemOrder(event: any) {
    if (event.Item.visitDateandTime == null) {
      event.Item.visitDateandTime = event.Item.AdmissionDateandTime;
    }
  }
  //#endregion Bind BMS Table data for Admission Or Visit

  //#region Search Method
  searchSubmitForm() {

    this.IsOrderList = true;

    this.searchModel.FromDate = this.searchForm.get('FromDate').value;
    this.searchModel.ToDate = this.searchForm.get('ToDate').value;
    this.searchModel.LabOrderNo = this.searchForm.get('LabOrderNo').value;
    this.searchModel.status = this.searchForm.get('status').value;
    this.searchModel.PatientId = this.patientId;
    this.searchModel.ProviderId = this.ProviderId;

    this.elabService.getLabOrderGridData(this.searchModel).then((res) => {

      this.TableDataOrder = res;

      if (this.TableDataOrder.length == 0) {
        this.noRecordShowOrder = true;
      } else {
        this.noRecordShowOrder = false;
      }
    });
  }
  //#endregion Search Method

  //#region Search-Clear function
  clearForm() {

    this.searchForm.reset();

    this.IsOrderList = true;

    this.searchForm.get('FromDate').setValue(new Date());
    this.searchForm.get('ToDate').setValue(new Date());

    this.searchModel.FromDate = this.searchForm.get('FromDate').value;
    this.searchModel.ToDate = this.searchForm.get('ToDate').value;
    this.searchModel.LabOrderNo = null;
    this.searchModel.status = null;
    this.searchModel.PatientId = 0;
    this.searchModel.ProviderId = 0;

    this.elabService.getLabOrderGridData(this.searchModel).then((res) => {
      this.TableDataOrder = res;

      if (this.TableDataOrder.length == 0) {
        this.noRecordShowOrder = true;
      } else {
        this.noRecordShowOrder = false;
      }
    });

    if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {
      //this.util.showMessage("Error!!!", "Wrong Date Entered", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => {

      //});
      this.IsDateCorect = true;
    } else {
      this.IsDateCorect = false;
    }
  }
  //#endregion Search-Clear function

  //#region Get Methods

  // Order Number for search
  getLabOrderNumbers() {
    this.searchForm.get('LabOrderNo').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.elabService.getLabOrderNumbers(key).then((res) => {
            this.labOrderNumber = res;
          })
        } else {
          this.labOrderNumber = null;
        }
      } else {
        this.labOrderNumber = null;
      }
    })
  }

  //Patient record for search
  getPatientRecord() {
    this.searchForm.get('PatientId').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.elabService.GetPatientRecord(key).then((res) => {
            this.patientRecord = res;
          })
        } else {
          this.patientRecord = null;
          this.patientId = 0;
        }
      } else {
        this.patientRecord = null;
        this.patientId = 0;
      }
    })
  }

  //physician name for search
  getProviderRecord() {
    this.searchForm.get('ProviderId').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.elabService.getProviderRecord(key).then((res) => {
            this.providerRecord = res;
          })
        } else {
          this.providerRecord = null;
          this.ProviderId = 0;
        }
      } else {
        this.providerRecord = null;
        this.ProviderId = 0;
      }
    })
  }

  CheckValidDate() {

    this.searchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.searchForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
  //drop down status value
  getStatusValue() {
    this.elabService.getStatusValue().then(res => {
      this.statusValue = res;
    })
  }

  //count details
  getCountDetails() {
    this.elabService.getCountDetails().then(res => {
      this.countDetails = res;
    })
  }

  //request table data
  getTableDataRequest() {
    this.elabService.getTableDataRequest().then(res => {
      this.TableDataRequest = res;

      if (this.TableDataRequest.length == 0) {
        this.noRecordShowRequest = true;
      } else {
        this.noRecordShowRequest = false;
      }
    })
  }

  //#endregion Get Methods

  //#region set Values for search
  patientRecordId(number: number) {
    this.patientId = number;
  }

  providerRecordId(number: number) {
    this.ProviderId = number;
  }
  //#endregion set Values for search

  //#region set Order or request table methods
  setTableOrder() {
    this.IsOrderList = true;
    this.buttonIsActive();
    this.orderListIsActive = true;
  }

  setTableRequest() {
    this.IsOrderList = false;
    this.buttonIsActive();
    this.requestListIsActive = true;
  }
  //#endregion set Order or request table methods

  //#region open pop - up 

  //Add new Request for orders pop up
  openNewOrder() {
    const dialogRef = this.dialog.open(eLabNewRequestComponent, {
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Updated") {
        this.searchSubmitForm();
        this.getCountDetails();

      }
    });
  }

  //View Order Pop up
  viewItemOrder(element: any) {
    this.elabService.getViewRecordByOrder(element.Item.LabOrderNo).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eLabNewRequestComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
        }
      })
    });
  }

  //Edit Order Pop up
  openOrderEdit(element: any) {
    this.elabService.getViewRecordByOrder(element.Item.LabOrderNo).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eLabOrderEditComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
        }
      })
    });
  }
  //View Request Pop up
  ViewItemRequest(element: any) {
    this.elabService.getViewRecordByLabRequestID(element.Item.LabRequestID).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eLabNewRequestViewComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
        }
      })
    });
  }

  //Edit Request Pop up
  EditItemRequest(element: any) {
    this.elabService.getViewRecordByLabRequestID(element.Item.LabRequestID).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eLabNewRequestEditComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
          this.searchSubmitForm();
          this.getCountDetails();
          this.setTableOrder();
        } else if (result == "cancel") {
          this.getTableDataRequest();
          this.searchSubmitForm();
          this.getCountDetails();
          this.setTableRequest();
        }
      })
    });
  }

  //Open Report Update Pop up
  openUpdateReport(element: any) {
    this.elabService.getUpdateReportRecordByLabOrderID(element.Item.LabOrderID).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eLabUpdateReportComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
          this.searchSubmitForm();
        }
      })
    });
  }

  //Open Email Pop up
  openEMail(element: any) {
    this.elabService.getUpdateReportRecordByLabOrderID(element.Item.LabOrderID).then((data) => {
      let record = data;
      const dialogRef = this.dialog.open(eMailComponent, {
        data: record,
        height: 'auto',
        width: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTableDataRequest();
          this.searchSubmitForm();
        }
      })
    });
  }
  //#endregion open pop - up 

  //#region navigation to Billing Master 
  openBilling() {
    this.router.navigate(['home/e-lab/LabMaster']);
  }
  //#endregion navigation to Billing Master

  buttonIsActive() {
    this.orderListIsActive = false;
    this.requestListIsActive = false;
  }

  deleteOrderRecordById(element: any) {
    this.util.showMessage("Delete", "Are you sure want to cancel this Request? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.elabService.DeleteOrderRecordById(element.Item.LabOrderID).then(res => {
            this.searchSubmitForm();
          });

        }
      })
  }
}
