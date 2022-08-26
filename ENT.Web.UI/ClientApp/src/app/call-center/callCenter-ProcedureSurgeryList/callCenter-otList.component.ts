import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { CallCenterAppointmentAddComponent } from '../callCenter-appointmentAddEdit/callCenter-appointmentAdd.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CallCenterService } from '../callCenter.service';
import { TableConfig } from 'src/app/ux/columnConfig';
import { CallCenterOtSearchModel } from '../models/callCenterSearchModel';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'callCenter-otList',
  templateUrl: './callCenter-otList.component.html',
})
export class CallCenterOtListComponent implements OnInit,AfterViewInit {

  //#region "Property Decelaration"
  callCenterOTStatusForm: FormGroup;
  CallCenterSearchModel: CallCenterOtSearchModel = new CallCenterOtSearchModel();
  public tableConfig: TableConfig = new TableConfig();
  callCenterData: any;
  showResult: any = true;
  PatientID: number = 0;
  patientNameList: any;
  doctorNameList: any;
  DoctorProviderID: number = 0;
  ProcedureSurgeryCount: any;
  DateChecker: boolean = false;
  VisitNumber: any;
  facilityData: any;
  public CallcenterProcListCard: FlexCardConfig= new FlexCardConfig();

  @ViewChild('autoCompleteVisitNumInput', { static: false, read: MatAutocompleteTrigger }) VisitNoAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) doctorAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) PatientAutotrigger: MatAutocompleteTrigger;
  //#endregion

  //#region "constructor"
  constructor(public dialog: MatDialog, private customHttpSvc: CustomHttpService, public fb: FormBuilder, private callCenterSvc: CallCenterService) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = false;
    // this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showAdd = false;
    // this.tableConfig.showDelete = false;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'VisitNo', DisplayName: 'Visit No', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   //{ PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureRequestedDate', DisplayName: 'Procedure Requested Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    //   { PropertyName: 'AdmittingPhysicianName', DisplayName: 'Surgeon', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureReqTime', DisplayName: 'Surgery Time', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureNameDesc', DisplayName: 'Procedure', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureRequestStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' }
    // ];

    this.CallcenterProcListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'ProcedureReqTime', DisplayName: 'Surgery Time', SectionType: "Content" },
      { PropertyName: 'AdmittingPhysicianName', DisplayName: 'Surgeon', SectionType: "Content" },
      { PropertyName: 'ProcedureRequestStatus', DisplayName: 'Proc-Req Status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'facilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'AdmittingPhysicianName', DisplayName: 'Physician', SectionType: "Content" },

    ];

    //Icons
    this.CallcenterProcListCard.showEdit = true;

  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.callCenterOTStatusForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      Doctor: [''],
      Patient: [''],
      VisitNo: [''],
      Facility: [0]

    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getCountProcedureSurgeryCallCenter();
    this.searchOTStatusCallCenter();
    this.getPatientNameList();
    this.getDoctorNameList();
    this.CheckValidDate();
    this.getFacilitiesByuser();
    this.getVisitNobySearch();
  }
  //#endregion

ngAfterViewInit() {
  this.doctorAutotrigger.panelClosingActions
  .subscribe(e => {
    if (!(e && e.source)) {
      this.callCenterOTStatusForm.get('Doctor').setValue('');
    }
  });

this.PatientAutotrigger.panelClosingActions
  .subscribe(e => {
    if (!(e && e.source)) {
      this.callCenterOTStatusForm.get('Patient').setValue('');
    }
  });

this.VisitNoAutotrigger.panelClosingActions
  .subscribe(e => {
    if (!(e && e.source)) {
      this.callCenterOTStatusForm.get('VisitNo').setValue('');
    }
  });

}

  getFacilitiesByuser() {
    this.callCenterSvc.getFacilitiesByuser().then((res) => {
      this.facilityData = res;
    })
  }

  getVisitNobySearch() {
    if (this.callCenterOTStatusForm.get('VisitNo').value != null) {
      this.callCenterOTStatusForm.get('VisitNo').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.callCenterSvc.getVisitNumberBySearch(key).then(data => {
                this.VisitNumber = data;
              })
            }
            else {
              this.VisitNumber = null;
            }
          } else {
            this.VisitNumber = null;
          }
        });
    }
  }

//#region Check Date in Search
public CheckValidDate(): void {

  this.callCenterOTStatusForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
    if (this.callCenterOTStatusForm.get('FromDate').value > this.callCenterOTStatusForm.get('ToDate').value) {
      this.DateChecker = true;
    } else {
      this.DateChecker = false;
    }
  });

  this.callCenterOTStatusForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
    if (this.callCenterOTStatusForm.get('FromDate').value > this.callCenterOTStatusForm.get('ToDate').value) {
      this.DateChecker = true;
    } else {
      this.DateChecker = false;
    }
  });
}
//#endregion Check Date in Search


  //#region "openSurgeryCallCenterEdit"
  openSurgeryCallCenterEdit(value) {
    const dialogRef = this.dialog.open(CallCenterAppointmentAddComponent, {
      data: value.Item,
      height: 'auto',
      width: 'auto',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Updated") {
        this.searchOTStatusCallCenter();
      }
    });
  }
  //#endregion

  //#region "getDoctorNameList"
  getDoctorNameList() {
    if (this.callCenterOTStatusForm.get('Doctor').value != null) {
      this.callCenterOTStatusForm.get('Doctor').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.callCenterSvc.getProvidersforCallCenter(key).then(data => {
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
      if (this.callCenterOTStatusForm.get('Patient').value != null) {
        this.callCenterOTStatusForm.get('Patient').valueChanges.subscribe(
          (key: string) => {
            if (key != null) {
              if (key.length > 2) {
                this.callCenterSvc.getAllPatientforCallCenter(key).then(data => {
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

  //#region "getCountProcedureSurgeryCallCenter"
  getCountProcedureSurgeryCallCenter() {
    this.callCenterSvc.getProcedureSurgeryCallCenterCount().then(data => {
      this.ProcedureSurgeryCount = data;      
    });
  }
  //#endregion

  //#region "setPatientID" 
  setPatientID(PatientID: number) {
    this.PatientID = PatientID;
  }
  //#endregion

   //#region "setDoctorProviderID" 
   setDoctorProviderID(DoctorProviderID: number) {
    this.DoctorProviderID = DoctorProviderID;
  }
  //#endregion

  //#region "ClearCallCenter" 
  ClearCallCenter() {
    this.callCenterOTStatusForm.reset();
    this.callCenterOTStatusForm.get('FromDate').setValue(new Date());
    this.callCenterOTStatusForm.get('ToDate').setValue(new Date());
    this.CallCenterSearchModel.FromDate = this.callCenterOTStatusForm.get('FromDate').value;
    this.CallCenterSearchModel.ToDate = this.callCenterOTStatusForm.get('ToDate').value;
    this.DoctorProviderID = 0;
    this.PatientID = 0;
    this.CallCenterSearchModel.PatientId = 0;
    this.CallCenterSearchModel.ProviderId = 0;
    this.callCenterSvc.SearchProcedureRequestsforCallCenter(this.CallCenterSearchModel).then(res => {
      let resultData = res;
      if (resultData.length == 0) {
        this.showResult = true;
      }
      else {
        this.showResult = false;
        this.callCenterData = resultData;        
        
      }
    })
  }
  //#endregion

  //#region "searchCallCenter" 
  searchOTStatusCallCenter() {
    this.CallCenterSearchModel.FromDate = this.callCenterOTStatusForm.get('FromDate').value;
    this.CallCenterSearchModel.ToDate = this.callCenterOTStatusForm.get('ToDate').value;
    this.CallCenterSearchModel.FacilityId = this.callCenterOTStatusForm.get('Facility').value;
    this.CallCenterSearchModel.VisitNo = this.callCenterOTStatusForm.get('VisitNo').value;
    this.CallCenterSearchModel.ProviderId = this.DoctorProviderID;
    this.CallCenterSearchModel.PatientId = this.PatientID;

    this.callCenterSvc.SearchProcedureRequestsforCallCenter(this.CallCenterSearchModel).then(res => {
    let resultData = res;
        if (resultData.length == 0) {
      this.showResult = true;
    }
    else {
      this.showResult = false;
      this.callCenterData= resultData;      
    }
    });
  }
  //#endregion

  
}

