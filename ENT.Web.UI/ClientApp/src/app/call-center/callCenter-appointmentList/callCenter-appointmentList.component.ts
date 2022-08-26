import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { CallCenterService } from '../callCenter.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CallCenterAppointmentAddComponent } from '../callCenter-appointmentAddEdit/callCenter-appointmentAdd.component';
import { CustomHttpService } from '../../core/custom-http.service';
import { CallCenterSearchModel } from '../models/callCenterSearchModel';
import { TableConfig } from '../../ux/columnConfig';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'callCenter-appointmentList',
  templateUrl: './callCenter-appointmentList.component.html',
})
export class CallCenterAppointmentListComponent implements OnInit {

  //#region "Property Decelaration"
  callCenterForm: FormGroup;
  CallCenterSearchModel: CallCenterSearchModel = new CallCenterSearchModel();
  public tableConfig: TableConfig = new TableConfig();
  showResult: any = true;
  DoctorProviderID: number = 0;
  PatientID: number = 0;
  CallCenterCount: any;
  specialityData: any;
  appointmentStatus: any;
  callCenterData: any;
  doctorNameList: any;
  patientNameList: any;
  CallCenterDataCollection: any;
  DateChecker: boolean = false;
  facilityData: any;
  AppointmentNumber: any;
  public CallcenterappListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompleteAppointNumInput', { static: false, read: MatAutocompleteTrigger }) AppointmenNotAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) doctorAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) PatientAutotrigger: MatAutocompleteTrigger;
  //#endregion


  //#region "constructor"
  constructor(public dialog: MatDialog, private callCenterSvc: CallCenterService,
    private fb: FormBuilder, private customHttpSvc: CustomHttpService, private CallCenterSvc: CallCenterService) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = false;
    // this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showAdd = false;
    // this.tableConfig.showDelete = false;
    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   //{ PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'Appointment with', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AppointmentDate', DisplayName: 'Appointment Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    //   { PropertyName: 'AppointmentTime', DisplayName: 'Appointment Time', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Appointmentstatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Reason', DisplayName: 'Purpose', DisplayMode: 'Text', LinkUrl: '' }
    // ];
    
    this.CallcenterappListCard.FlexDataConfig = [

      //Header
      
      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', SectionType: "Content" },
      { PropertyName: 'Appointmenttype', DisplayName: 'Appointment Type', SectionType: "Content" },
      { PropertyName: 'Appointmentstatus', DisplayName: 'Appointment status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Provider', SectionType: "Content" },

    ];
    //Icons
    this.CallcenterappListCard.showEdit = true;
  }
  //#endregion


  //#region "ngOnInit"
  ngOnInit() {
    this.callCenterForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      DoctorName: [''],
      PatientName: [''],
      AppointmentNumber: [''],
      Facility: [0],
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getCountAppointmentCallCenter();
    this.getDoctorNameList();
    this.getPatientNameList();
    this.searchCallCenter();
    this.CheckValidDate();
    this.getFacilitiesByuser();
    this.getAppointmentNumberbySearch();

  }
  //#endregion

  ngAfterViewInit() {
    this.doctorAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.callCenterForm.get('DoctorName').setValue('');
        }
      });

    this.PatientAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.callCenterForm.get('PatientName').setValue('');
        }
      });


    this.AppointmenNotAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.callCenterForm.get('AppointmentNumber').setValue('');
        }
      });

  }
  getFacilitiesByuser() {
    this.CallCenterSvc.getFacilitiesByuser().then((res) => {
      this.facilityData = res;
    })
  }

  getAppointmentNumberbySearch() {

    if (this.callCenterForm.get('AppointmentNumber').value != null) {
      this.callCenterForm.get('AppointmentNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.CallCenterSvc.getAppointmentNumberBySearch(key).then(data => {
                this.AppointmentNumber = data;
              })
            }
            else {
              this.AppointmentNumber = null;
            }
          }
        });
    }
  }

  //#region Check Date in Search
  public CheckValidDate(): void {

    this.callCenterForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.callCenterForm.get('FromDate').value > this.callCenterForm.get('ToDate').value) {
        this.DateChecker = true;
      } else {
        this.DateChecker = false;
      }
    });

    this.callCenterForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
      if (this.callCenterForm.get('FromDate').value > this.callCenterForm.get('ToDate').value) {
        this.DateChecker = true;
      } else {
        this.DateChecker = false;
      }
    });
  }
  //#endregion Check Date in Search

  //#region "getCountAppointmentCallCenter"
  getCountAppointmentCallCenter() {
    this.callCenterSvc.getAppointmentCallCenterCount().then(data => {
      this.CallCenterCount = data;
    });
  }
  //#endregion


  //#region "getDoctorNameList"
  getDoctorNameList() {
    if (this.callCenterForm.get('DoctorName').value != null) {
      this.callCenterForm.get('DoctorName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.CallCenterSvc.getProvidersforCallCenter(key).then(data => {
                this.doctorNameList = data;
              })
            }
            else {
              this.doctorNameList = null;
              this.DoctorProviderID = 0;
            }
          }
          else {
            this.doctorNameList = null;
          }
        });
    }
  }
  //#endregion


  //#region "getPatientNameList" 
  getPatientNameList() {
    if (this.callCenterForm.get('PatientName').value != null) {
      this.callCenterForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.CallCenterSvc.getAllPatientforCallCenter(key).then(data => {
                this.patientNameList = data;
              })
            }
            else {
              this.patientNameList = null;
              this.PatientID = 0;
            }
          }
          else {
            this.patientNameList = null;
          }
        });
    }
  }
  //#endregion


  //#region "setDoctorProviderID" 
  setDoctorProviderID(DoctorProviderID: number) {
    this.DoctorProviderID = DoctorProviderID;
  }
  //#endregion


  //#region "setPatientID" 
  setPatientID(PatientID: number) {
    this.PatientID = PatientID;
  }
  //#endregion


  //#region "openAppointmentCallCenterEdit" 
  openAppointmentCallCenterEdit(Value) {
    const dialogRef = this.dialog.open(CallCenterAppointmentAddComponent, {
      data: Value.Item,
      height: 'auto',
      width: 'auto',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Updated") {
        this.searchCallCenter();
      }
    });
  }
  //#endregion

  //#region "searchCallCenter" 
  searchCallCenter() {
    this.CallCenterSearchModel.FromDate = this.callCenterForm.get('FromDate').value;
    this.CallCenterSearchModel.ToDate = this.callCenterForm.get('ToDate').value;
    this.CallCenterSearchModel.ProviderId = this.DoctorProviderID;
    this.CallCenterSearchModel.PatientId = this.PatientID;
    this.CallCenterSearchModel.FacilityId = this.callCenterForm.get('Facility').value;
    this.CallCenterSearchModel.AppointmentNo = this.callCenterForm.get('AppointmentNumber').value;
    this.CallCenterSvc.getSearchCallCenterData(this.CallCenterSearchModel).then(res => {
      let resultData = res;
      if (resultData.length == 0) {
        this.showResult = true;
      }
      else {
        this.showResult = false;        
        this.CallCenterDataCollection = resultData;        
      }
    })
  }
  //#endregion

  //#region "ClearCallCenter" 
  ClearCallCenter() {
    this.callCenterForm.reset();
    this.DoctorProviderID = 0;
    this.PatientID = 0;
    this.callCenterForm.get('FromDate').setValue(new Date());
    this.callCenterForm.get('ToDate').setValue(new Date());
    this.callCenterForm.get('Facility').setValue(0);
    this.CallCenterSearchModel.FromDate = this.callCenterForm.get('FromDate').value;
    this.CallCenterSearchModel.ToDate = this.callCenterForm.get('ToDate').value;
    this.CallCenterSearchModel.PatientId = 0;
    this.CallCenterSearchModel.ProviderId = 0;
    this.CallCenterSearchModel.FacilityId = this.callCenterForm.get('Facility').value;

    this.CallCenterSvc.getSearchCallCenterData(this.CallCenterSearchModel).then(res => {
      let resultData = res;
      if (resultData.length == 0) {
        this.showResult = true;
      }
      else {
        this.showResult = false;
        this.CallCenterDataCollection = resultData;
      }
    })
  }
  //#endregion

}

