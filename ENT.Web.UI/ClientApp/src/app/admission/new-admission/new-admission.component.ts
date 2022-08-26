import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { admission01Model } from '../Models/admission01Model';
import { TableConfig } from '../../ux/columnConfig';
import { AdmissionService } from '../admission.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { MatDialog, MatAutocompleteTrigger } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { NewPatientService } from '../../patient/newPatient.service';
import { DatePipe } from '@angular/common';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { admissionsearchmodel } from '../../admission/Models/admissionsearchmodel';
import { Router } from '@angular/router';
import { NewPatientRegModel } from 'src/app/patient/models/newPatientRegModel';
import { NewAdmissionViewRecordComponent } from './new-admission-view-record/new-admission-view-record.component';
import { NewAdmissionEditRecordComponent } from './new-admission-edit-record/new-admission-edit-record.component';
import { NewAdmissionAddRecordComponent } from './new-admission-add-record/new-admission-add-record.component';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';


@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.css']
})
export class NewAdmissionComponent implements OnInit {
  admissionsearchmodel: admissionsearchmodel = new admissionsearchmodel();
  newAdmissionForm: FormGroup;
  newAdmissionModel: admission01Model = new admission01Model();
  tableConfig: TableConfig = new TableConfig();
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel();
  idname: any;
  totalAdmission: any;
  speciality: any;
  searchlist: any;
  Physician: any;
  AppointmenttotalCount: any;
  waitCount: any;
  patientname: any;
  scheduleCount: any;
  totalCount: any;
  show: any = false;
  physicianid: any;
  IsDateCorect: boolean = false;
  facilityData: any;
  AdmissionNumber: any;
  public AdmissionListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompleteAdmission', { static: false, read: MatAutocompleteTrigger }) admission: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatient', { static: false, read: MatAutocompleteTrigger }) patient: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDoctor', { static: false, read: MatAutocompleteTrigger }) doctor: MatAutocompleteTrigger;

  constructor(private router: Router, public fb: FormBuilder, public datePipe: DatePipe, public admissionServive: AdmissionService, public custHttp: CustomHttpService, public MatDialog: MatDialog, public newPatientService: NewPatientService, private config: UtilService) {

    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = true;
    // this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showAdd = false;
    // this.tableConfig.showDelete = true;
    // this.tableConfig.showPayment = true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AdmissionNo', DisplayName: 'Admission No', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '', width: "9%" },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'AdmissionDateTime', DisplayName: 'Admission Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '', width: "6%" },
    //   { PropertyName: 'admissionTypeDesc', DisplayName: 'Admission Type', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'ProviderName', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    // //{ PropertyName: 'specialityName', DisplayName: 'Speciality', DisplayMode: 'Text', LinkUrl: '', width: "5%" },
    //   { PropertyName: 'ProcedureDesc', DisplayName: 'Procedure Name (Short)', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'UrgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '', width: "5%" },
    //   { PropertyName: 'arrivalCondition', DisplayName: 'Patient Arrival Condition', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    //   { PropertyName: 'admissionStatusDesc', DisplayName: 'Initial Admission Status', DisplayMode: 'Text', LinkUrl: '', width: "8%" },
    // ];

    this.AdmissionListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'AdmissionNo', DisplayName: 'Admission No', SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },
      { PropertyName: 'admissionStatusDesc', DisplayName: 'Admission status', ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'arrivalCondition', DisplayName: 'Arrival Condition',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },

    ];

    //Icons
    this.AdmissionListCard.showView = true;
    this.AdmissionListCard.showIcon = false;
    this.AdmissionListCard.showEdit = true;
    this.AdmissionListCard.showAdd = false;
    this.AdmissionListCard.showDelete = true;
    this.AdmissionListCard.showPayment = true;
  }

  ngOnInit() {
    this.newAdmissionForm = this.fb.group({
      PatientName: [''],
      Physician: [''],
      FromDate: [new Date()],
      ToDate: [new Date()],
      Facility: [0],
      AdmissionNumber: [''],
    })
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.openAddUpdateform();
    this.getpatientname();
    this.getOrderingPhysician();
    this.getSpeciality();
    this.totalAppointment();
    this.CheckValidDate();
    this.getFacilitiesByuser();
    //this.getAdmissionNumberbySearch();
  }
  ngAfterViewInit() {
    this.admission.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.newAdmissionForm.get('AdmissionNumber').setValue('');
        }
      });
    this.patient.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.newAdmissionForm.get('PatientName').setValue('');
        }
      });
    this.doctor.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.newAdmissionForm.get('Physician').setValue('');
        }
      });
  }
  //#region Check Date in Search
  public CheckValidDate(): void {

    this.newAdmissionForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.newAdmissionForm.get('FromDate').value > this.newAdmissionForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.newAdmissionForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
      if (this.newAdmissionForm.get('FromDate').value > this.newAdmissionForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
  //#endregion Check Date in Search
  //Total
  getTotalDataFromService() {

    this.admissionServive.getadmission().then(res => {
      this.totalAdmission = res;
    })
  }
  //view Admission
  viewAdmissionRecord(data: any) {
    this.admissionServive.GetAdmissionDetailByID(data.Item.AdmissionID).then(res => {
      var insuranceDetails = res;
      const viewdetails = this.MatDialog.open(NewAdmissionViewRecordComponent, {
        data: insuranceDetails,
        height: 'auto',
        width: '1800px',
        autoFocus: false,
      })
    })
  }


  //Cancel form
  CancelForm() {
    this.newAdmissionForm.reset();
    this.newAdmissionForm.get('FromDate').setValue(new Date());
    this.newAdmissionForm.get('ToDate').setValue(new Date());
    this.newAdmissionForm.get('Facility').setValue(0);
    this.admissionsearchmodel.FromDate = this.newAdmissionForm.get('FromDate').value;
    this.admissionsearchmodel.ToDate = this.newAdmissionForm.get('ToDate').value;
    //  this.admissionsearchmodel.SpecialityId = 0;
    this.admissionsearchmodel.PatientId = 0;
    this.admissionsearchmodel.ProviderId = 0;
    this.admissionsearchmodel.AdmissionNo = "";
    this.admissionsearchmodel.FacilityId = this.newAdmissionForm.get('Facility').value;

    this.admissionServive.searchAdmission(this.admissionsearchmodel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show = true;
        this.physicianid = 0;
        this.idname = 0;
        // this.admissionsearchmodel.SpecialityId = 0;

      }
      else {
        this.totalAdmission = this.searchlist;
        this.show = false;
        this.physicianid = 0;
        this.idname = 0;
        // this.admissionsearchmodel.SpecialityId = 0;

      }
    })
  }
  //procedure physician
  setprocedurephysician(number) {
    this.idname = number;
  }
  //physician
  setphysician(number) {
    this.physicianid = number;
  }
  //physician
  getOrderingPhysician() {
    if (this.newAdmissionForm.get('Physician').value != null) {
      this.newAdmissionForm.get('Physician').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.GetOrderingphysician(key).then(data => {
                this.Physician = data;
              })
            }
            else {
              this.Physician = null;
              this.physicianid = 0;
            }
          }
        })
    }
  }
  //speciality
  getSpeciality() {
    this.admissionServive.Getspecialities().then(res => {
      this.speciality = res;
    })
  }
  //total
  totalAppointment() {
    this.admissionServive.getadmissioncount().then(data => {
      this.AppointmenttotalCount = data;
      this.totalCount = this.AppointmenttotalCount.TodayAdmissionCount;
      this.scheduleCount = this.AppointmenttotalCount.GeneralAdmissionCount;
      this.waitCount = this.AppointmenttotalCount.EmergencyAdmissionCount;
    });
  }
  //PatientName
  getpatientname() {
    if (this.newAdmissionForm.get('PatientName').value != null) {
      this.newAdmissionForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.Getpatientname(key).then(data => {
                this.patientname = data;
              })
            }
            else {
              this.patientname = null;
              this.idname = 0;
            }
          }
        })
    }
  }
  //edit
  editAdmissionRecord(element: any) {
    this.admissionServive.GetAdmissionDetailByID(element.Item.AdmissionID).then(res => {
      var editRecord = res;
      let editDetails = this.MatDialog.open(NewAdmissionEditRecordComponent, {
        data: editRecord,
        height: 'auto',
        width: 'auto',
        autoFocus: true,
      })
      editDetails.afterClosed().subscribe(result => {
        if (result == "Updated") {
          //this.getTotalDataFromService();
          this.openAddUpdateform();
        }
      })
    })
  }
  //delete
  deleteAdmissionRecord(data: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {

          this.admissionServive.DeleteAdmissionRecord(data.Item.AdmissionID).then(res => {
            // this.getTotalDataFromService();
            this.openAddUpdateform();
          })
        }
      });
  }
  //payment
  admissionpayment(event) {
    this.setsessionStorage();
    const elem = event.Item.AdmissionID;
    const PatientID = event.Item.PatientID;
    this.router.navigate(['/home/admission/admissionpayment', elem, PatientID]);
  }
  //add
  addNewAdmission() {
    const viewDetails = this.MatDialog.open(NewAdmissionAddRecordComponent, {
      height: 'auto',
      width: '30000px',
      autoFocus: false,
    });

    //view
    viewDetails.afterClosed().subscribe(result => {
      if (result == "Updated") {
        //this.getTotalDataFromService();
        this.openAddUpdateform();
      }
    })
  }

  //#region "setsession_admissionsearchmodel"
  setsessionStorage() {
    let setSessionValue = {
      admissionsearchmodelValue: this.admissionsearchmodel,
      PatientName: this.newAdmissionForm.get("PatientName").value,
      Physician: this.newAdmissionForm.get("Physician").value,
    }
    sessionStorage.setItem("admissionsearchmodel", JSON.stringify(setSessionValue));
  }
  //#endregion

  //Add Record
  openAddUpdateform() {
    if (sessionStorage.getItem("admissionsearchmodel")) {

      //session get...
      let admissionsearchmodelValue = JSON.parse(sessionStorage.getItem("admissionsearchmodel"));
      this.admissionsearchmodel = admissionsearchmodelValue.admissionsearchmodelValue;
      this.newAdmissionForm.get('FromDate').setValue(admissionsearchmodelValue.admissionsearchmodelValue.FromDate);
      this.newAdmissionForm.get('ToDate').setValue(admissionsearchmodelValue.admissionsearchmodelValue.ToDate);
      this.newAdmissionForm.get("PatientName").setValue(admissionsearchmodelValue.PatientName);
      this.newAdmissionForm.get("Physician").setValue(admissionsearchmodelValue.Physician);
      this.newAdmissionForm.get("Facility").setValue(admissionsearchmodelValue.admissionsearchmodelValue.FacilityId);
      this.newAdmissionForm.get("AdmissionNumber").setValue(admissionsearchmodelValue.admissionsearchmodelValue.AdmissionNo);
      this.physicianid = this.admissionsearchmodel.ProviderId;
      this.idname = this.admissionsearchmodel.PatientId
      this.admissionServive.searchAdmission(this.admissionsearchmodel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        }
        else {
          this.totalAdmission = this.searchlist;
          this.show = false;
        }
      });
      sessionStorage.removeItem("admissionsearchmodel");
    }
    else {
      this.admissionsearchmodel.FromDate = this.newAdmissionForm.get('FromDate').value;
      this.admissionsearchmodel.ToDate = this.newAdmissionForm.get('ToDate').value;
      this.admissionsearchmodel.ProviderId = this.physicianid;
      this.admissionsearchmodel.FacilityId = this.newAdmissionForm.get('Facility').value;
      this.admissionsearchmodel.AdmissionNo = this.newAdmissionForm.get('AdmissionNumber').value;
      this.admissionsearchmodel.PatientId = this.idname;
      this.admissionServive.searchAdmission(this.admissionsearchmodel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        }
        else {
          this.totalAdmission = this.searchlist;
          this.show = false;
        }
      });
    }
  }


  getFacilitiesByuser() {
    this.admissionServive.getFacility().then((res) => {
      this.facilityData = res;
    })
  }

  getAdmissionNumberbySearch() {
    if (this.newAdmissionForm.get('AdmissionNumber').value != null) {
      this.newAdmissionForm.get('AdmissionNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.getAdmissionNumberBySearch(key).then(data => {
                let res = [];
                res = data
                this.AdmissionNumber = res;
              })
            }
            else {
              this.AdmissionNumber = null;
            }
          }
        })
    }
  }
}
