import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from '../../ux/columnConfig';
import { EPrescriptionEditComponent } from '../e-prescription-edit/e-prescription-edit.component';
import { EPrescriptionRequestEditComponent } from '../e-prescription-request-edit/e-prescription-request-edit.component';
import { EPrescriptionRxComponent } from '../e-prescription-rx/e-prescription-rx.component';
import { EPrescriptionService } from '../ePrescription.service';
import { SearchModel } from '../models/searchModel';

@Component({
  selector: 'e-prescription-list',
  templateUrl: './e-prescription-list.component.html',
  styleUrls: ['./e-prescription-list.component.css']
})
export class EPrescriptionListComponent implements OnInit, AfterViewInit {
  ePrescriptionForm: FormGroup;
  tableConfigRxList: TableConfig = new TableConfig();
  tableConfigRxRequest: TableConfig = new TableConfig();
  searchModel: SearchModel = new SearchModel();
  rx: any;
  rxRequest: any;
  rxNo: any;
  rxStatus: any;
  providerName: any;
  providerListId: number;
  patientName: any;
  patientListId: number;
  rxList: any;
  rxRequestList: any;
  isRxList: boolean = false;
  rxListIsActive: boolean = false;
  rxRequestListIsActive: boolean = false;
  show: boolean = true;
  showRequest: boolean = true;
  IsDateCorrect: boolean = false;
  searchList: any;
  routeData: any;
  providerTooltip: any;
  patientTooltip: any;
  facilityData: any;

  @ViewChild('autoCompleteRxInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDoctorInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  constructor(public fb: FormBuilder, public dialog: MatDialog, private ePrescriptionSvc: EPrescriptionService, private config: UtilService, public customHttp: CustomHttpService) {
    this.tableConfigRxList.showPagination = true;
    this.tableConfigRxList.showEdit = true;
    this.tableConfigRxList.showDelete = true;

    this.tableConfigRxList.columnConfig = [
      { PropertyName: 'MedicationNumber', DisplayName: 'Rx No', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'physicianName', DisplayName: 'Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'VisitDateandTime', DisplayName: 'Admission / Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'CreatedDate', DisplayName: 'Issue Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'MedicationStatus', DisplayName: 'Rx Status', DisplayMode: 'Text', LinkUrl: '' }
    ];

    this.tableConfigRxRequest.showPagination = true;
    this.tableConfigRxRequest.showEdit = true;

    this.tableConfigRxRequest.columnConfig = [
      { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RequestingPhysician', DisplayName: 'Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'VisitDateandTime', DisplayName: 'Admission / Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RequestedDate', DisplayName: 'Prescribed Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'MedicationRequestStatus', DisplayName: 'Rx Status', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }

  ngOnInit() {
    this.ePrescriptionForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      RxNo: [''],
      Facility: [0],
      ProviderName: [''],
      PatientName: ['']
    });
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.RxCount();
    this.CheckValidDate();
    this.getRxNo();
    this.getFacilityNames();
    this.getProviderName();
    this.getPatientList();
    this.getRxRequestList();
    this.setTableRxList();
    this.search();
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.ePrescriptionForm.get('RxNo').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
            this.ePrescriptionForm.get('PatientName').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.ePrescriptionForm.get('ProviderName').setValue('');
        }
      });
  }
 
  onBindItem(event: any) {
    if (event.Item) {
      if (event.Item.VisitDateandTime == null || event.Item.VisitDateandTime == "") {
        event.Item.VisitDateandTime = event.Item.AdmissionDateandTime;
      }
      else {
        event.Item.VisitDateandTime = event.Item.VisitDateandTime;
      }
    }
  }

  getRxList() {
    this.ePrescriptionSvc.getAllMedicationsList().then(res => {
      this.rxList = res;
    });
  }

  getRxRequestList() {
    this.ePrescriptionSvc.getAllMedicationRequestList().then(res => {
      this.rxRequestList = res;
      if (this.rxRequestList.length == 0) {
        this.showRequest = true;
      }
      else {
        this.showRequest = false;
      }
    });
  }

  RxCount() {
    this.ePrescriptionSvc.getRxCount().then(res => {
      this.rx = res.TodaymedicationCount;
      this.rxRequest = res.TodaymedicationRequestCount;
    });
  }

  CheckValidDate() {
    this.ePrescriptionForm.get('FromDate').valueChanges.subscribe((Date: any) => {
      if (this.ePrescriptionForm.get('FromDate').value > this.ePrescriptionForm.get('ToDate').value) {
        this.IsDateCorrect = true;
      } else {
        this.IsDateCorrect = false;
      }
    });

    this.ePrescriptionForm.get('ToDate').valueChanges.subscribe((Date: any) => {
      if (this.ePrescriptionForm.get('FromDate').value > this.ePrescriptionForm.get('ToDate').value) {
        this.IsDateCorrect = true;
      } else {
        this.IsDateCorrect = false;
      }
    });
  }

  getRxNo() {
    this.ePrescriptionForm.get('RxNo').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.ePrescriptionSvc.getRxNoforSearch(key).then(data => {
              this.rxNo = data;
            });
          }
          else {
            this.rxNo = null;
          }
        }
        else {
          this.rxNo = null;
        }
      });
  }

  getFacilityNames() {
    this.ePrescriptionSvc.getFacilityNames().then(res => {
      this.facilityData = res;
    });
  }

  getProviderName() {
    this.ePrescriptionForm.get('ProviderName').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.ePrescriptionSvc.getPhysicianforEPrescription(key).then(data => {
              if (data != null && data != undefined && data.length > 0) {
                this.providerName = data;
              }
            });
          }
          else {
            this.providerName = null;
            this.providerTooltip = null;
          }
        }
        else {
          this.providerName = null;
          this.providerTooltip = null;
        }
      });
  }

  setProviderName(ProviderId, value) {
    this.providerListId = ProviderId;
    this.providerTooltip = value;
  }

  getPatientList() {
    this.ePrescriptionForm.get('PatientName').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.ePrescriptionSvc.getPatientforEPrescription(key).then(data => {
              this.patientName = data;
            });
          }
          else {
            this.patientName = null;
            this.patientTooltip = null;
          }
        }
        else {
          this.patientName = null;
          this.patientTooltip = null;
        }
      });
  }

  setPatientName(PatientId, value1, value2, value3) {
    this.patientListId = PatientId;
    this.patientTooltip = value1 + ' ' + value2 + ' ' + value3;
  }
 
  setTableRxList() {
    this.isRxList = true;
    this.checkButtonIsActive();
    this.rxListIsActive = true;
  }

  setTableRxRequest() {
    this.isRxList = false;
    this.checkButtonIsActive();
    this.rxRequestListIsActive = true;
  }

  checkButtonIsActive() {
    this.rxListIsActive = false;
    this.rxRequestListIsActive = false;
  }

  openNewRx() {
    const dialogRef = this.dialog.open(EPrescriptionRxComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Updated') {
        this.search();
        this.RxCount();
      }
    });
  }

  editRxList(element: any) {
    this.ePrescriptionSvc.getMedicationRouteforEPrescription().then(data => {
      this.routeData = data;
      this.ePrescriptionSvc.getEPrescriptionRecord(element.Item.MedicationId).then(data => {
        let medicationItems = data;
        const value = {
          record: medicationItems,
          route: this.routeData
        }
        const dialogRef = this.dialog.open(EPrescriptionEditComponent, {
          data: value,
          height: 'auto',
          width: 'auto',
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'Updated') {
            this.search();
          }
        });
      });
    });
  }

  deleteRxList(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.ePrescriptionSvc.deleteEPrescriptionRecord(element.Item.MedicationId).then(res => {
            this.search();
            this.RxCount();
          });
        }
      });
  }

  editRxRequest(element: any) {
    this.ePrescriptionSvc.getMedicationRouteforEPrescription().then(data => {
      this.routeData = data;
      this.ePrescriptionSvc.getEPrescriptionRequestRecord(element.Item.MedicationRequestId).then(data => {
        let medicationRequestItems = data;
        const value = {
          record: medicationRequestItems,
          route: this.routeData
        }
        const dialogRef = this.dialog.open(EPrescriptionRequestEditComponent, {
          data: value,
          height: 'auto',
          width: 'auto',
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'Updated') {
            this.getRxRequestList();
            this.search();
            this.RxCount();
            this.setTableRxList();
          }
          else if (result == 'Cancel') {
            this.getRxRequestList();
            this.search();
            this.RxCount();
            this.setTableRxRequest();
          }
        });
      });
    });
  }

  search() {
    this.setTableRxList();
    this.searchModel.FromDate = this.ePrescriptionForm.get('FromDate').value;
    this.searchModel.ToDate = this.ePrescriptionForm.get('ToDate').value;
    this.searchModel.MedicationNo = this.ePrescriptionForm.get('RxNo').value;
    this.searchModel.FacilityId = this.ePrescriptionForm.get('Facility').value;
    this.searchModel.ProviderId = this.ePrescriptionForm.get('ProviderName').value ? this.providerListId : 0;
    this.searchModel.PatientId = this.ePrescriptionForm.get('PatientName').value ? this.patientListId : 0;
    
    this.ePrescriptionSvc.ePrescriptionSearch(this.searchModel).then(res => {
      this.searchList = res;
      if (this.searchList.length == 0) {
        this.show = true;
      }
      else {
        this.rxList = this.searchList;
        this.show = false;
      }
    });
  }

  reset() {
    this.setTableRxList();
    this.ePrescriptionForm.reset();
    this.ePrescriptionForm.get('FromDate').setValue(new Date());
    this.ePrescriptionForm.get('ToDate').setValue(new Date());
    this.ePrescriptionForm.get('Facility').setValue(0);
    this.searchModel.FromDate = this.ePrescriptionForm.get('FromDate').value;
    this.searchModel.ToDate = this.ePrescriptionForm.get('ToDate').value;
    this.searchModel.MedicationNo = this.ePrescriptionForm.get('RxNo').value;
    this.searchModel.FacilityId = this.ePrescriptionForm.get('Facility').value;
    this.searchModel.ProviderId = this.ePrescriptionForm.get('ProviderName').value ? this.providerListId : 0;
    this.searchModel.PatientId = this.ePrescriptionForm.get('PatientName').value ? this.patientListId : 0;

    this.ePrescriptionSvc.ePrescriptionSearch(this.searchModel).then(res => {
      this.searchList = res;
      if (this.searchList.length == 0) {
        this.show = true;
      }
      else {
        this.rxList = this.searchList;
        this.show = false;
      }
    });
  }

}




