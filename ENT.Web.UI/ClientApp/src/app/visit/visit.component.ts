import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { VisitEditPatientRecordComponent } from './visit-edit-record/visit-editPatientRecord.component';
import { VisitViewPatientHistoryComponent } from './visit-view-history/visit-viewPatientHistory.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VisitService } from './visit.service';
import { PatientVisitModel, PatientVisitSearchModel } from './models/patientVisitModel';
import { TableConfig } from '../ux/columnConfig';
import { CustomHttpService } from '../core/custom-http.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../core/util.service';
import { AddNewPatientComponent } from '../patient/add-new-patient/add-new-patient.component';
import { visitPopupHistoryComponent } from './visit-history-popup/visit-PopupHistory.component';
import { FlexCardConfig } from '../ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: ' app-visit ',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  minDate = new Date();
  VisitUiData: boolean = true;
  AppUiData: boolean = true;
  patientVisitForm: FormGroup;
  patientVisitModel: PatientVisitModel = new PatientVisitModel();
  PatientVisitSearchModel: PatientVisitSearchModel = new PatientVisitSearchModel();
  VisitListTable: TableConfig = new TableConfig();
  AppointmentListTable: TableConfig = new TableConfig();
  VisitHistoryTable: TableConfig = new TableConfig();
  visitType: any;
  recordedDuring: any;
  visitCount = [];
  urgencyType: any;
  patientArraivalCondition: any;
  hospitalName: any;
  toConsultData: any;
  visitStatus: any;
  patientVisitHistory: any;
  patientList: any;
  filteredOptions: any;
  filteredFacility: Observable<string[]>;
  patientById: any;
  show: boolean = false;
  showfield: boolean = true;
  visitCollection: any;
  VisitPaymentButton = 'VisitPayment';
  VisitDateandTimeType: any;
  ConsultationType: any;
  AppointmentType: any;
  showingNewVisit: boolean = true;
  showResult: any = true;
  visitSearchListEmitData: any;
  patientCardId: any;
  facilitiesVisitData: any;
  facilityIdValue: number = 0;
  visitList: boolean = false;
  appointmentList: boolean = false;
  patientVisitCollection: any;
  appointmentListData: any;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  Appointmentbtn: boolean = false;
  ParticularAppointid: any;
  dataListType: string;
  selectionTypeData: string = "";
  OrderNumber: any = "";
  AppointmentDataId: any;
  showParticularRes: boolean = false;
  time: any;
  visitAppointmentCount: any;
  public VisitListCard: FlexCardConfig = new FlexCardConfig();
  public AppointmentListCard: FlexCardConfig = new FlexCardConfig();
  //@ViewChild('facilityName', { static: false }) facilityName: ElementRef;

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private visitSvc: VisitService, private customHttpSvc: CustomHttpService, private util: UtilService) {
    // this.VisitListTable.showPagination = true;
    // this.VisitListTable.showView = true;
    // this.VisitListTable.showIcon = false;
    // this.VisitListTable.showEdit = true;
    // this.VisitListTable.showAdd = false;
    // this.VisitListTable.showDelete = false;
    // this.VisitListTable.showHistory = true;
    // this.VisitListTable.showPayment = true;


    // this.VisitListTable.columnConfig = [
    //   { PropertyName: 'VisitNo', DisplayName: 'Visit No', DisplayMode: 'Text', LinkUrl: '', width: '45%' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '', width: '50%' },
    //   { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '', width: '50%' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '', width: '50%' },
    //   { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'MRNumber', DisplayName: 'MR#', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'ProviderName', DisplayName: 'To visit', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'visitType', DisplayName: 'Visit Type', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'Appointment', DisplayName: 'Appointment', DisplayMode: 'Text', LinkUrl: '', width: '40%' },
    //   { PropertyName: 'visitStatus', DisplayName: 'Visit Status', DisplayMode: 'Text', LinkUrl: '', width: '35%' },
    // ];

    // this.AppointmentListTable.showPagination = true;
    // this.AppointmentListTable.showView = false;
    // this.AppointmentListTable.showIcon = false;
    // this.AppointmentListTable.showEdit = true;
    // this.AppointmentListTable.showAdd = false;
    // this.AppointmentListTable.showDelete = false;
    // this.AppointmentListTable.showOpen = false;
    // this.AppointmentListTable.columnConfig = [
    //   { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'Appointment with', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AppointmentDate', DisplayName: 'Appointment Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    //   { PropertyName: 'AppointmentTime', DisplayName: 'Appointment Time', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Appointmentstatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Reason', DisplayName: 'Purpose', DisplayMode: 'Text', LinkUrl: '' }
    // ]

    this.VisitHistoryTable.showPagination = true;
    this.VisitHistoryTable.showView = true;
    this.VisitHistoryTable.showIcon = false;
    this.VisitHistoryTable.showEdit = false;
    this.VisitHistoryTable.showAdd = false;
    this.VisitHistoryTable.showDelete = false;
    this.VisitHistoryTable.showOpen = false;
    this.VisitHistoryTable.columnConfig = [
      { PropertyName: 'VisitNo', DisplayName: 'Visit No', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'VisitDate', DisplayName: 'Visit Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'Visittime', DisplayName: 'Visit Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ToConsult', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' }
    ];

    
    //--------------------VisitListCard --------------------------

    this.VisitListCard.FlexDataConfig = [
      //Header
      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header" },
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content
      { PropertyName: 'VisitNo', DisplayName: 'Visit No', SectionType: "Content" },
      { PropertyName: 'visitType', DisplayName: 'Visit Type', SectionType: "Content" },
      { PropertyName: 'visitStatus', DisplayName: 'Visit Status', ApplyStatusFontcolor: "ApplyFont", SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
    ];

    //Icons 
    this.VisitListCard.showView = true;
    this.VisitListCard.showIcon = false;
    this.VisitListCard.showEdit = true;
    this.VisitListCard.showAdd = false;
    this.VisitListCard.showDelete = false;
    this.VisitListCard.showHistory = true;
    this.VisitListCard.showPayment = true;

    //---------------------AppointmentListCard-------------------------

    this.AppointmentListCard.FlexDataConfig = [

      //Header
      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content
      { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', SectionType: "Content" },
      { PropertyName: 'Appointmenttype', DisplayName: 'Appointment Type', SectionType: "Content" },
      { PropertyName: 'Appointmentstatus', DisplayName: 'Appointment status', ApplyStatusFontcolor: "ApplyFont", SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
      
    ];

    //Icons
    this.AppointmentListCard.showEdit = true;//t

  }
  // newRegistration() {
  //   this.router.navigate(['home/patient']);
  // }

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.patientVisitForm = this.fb.group({
      searchPatientList: [''],
      VisitDate: ['', Validators.required],
      VisitTime: ['', Validators.required],
      VisitDateandTime: [''],
      VisitType: ['', Validators.required],
      RecordedDuring: ['', Validators.required],
      UrgencyType: ['', Validators.required],
      PatientArrivalCondition: ['', Validators.required],
      ToConsult: ['', Validators.required],
      Provider: ['', Validators.required],
      ReferringHospital: [''],
      ReferringDoctor: [''],
      ConsultationType: ['', Validators.required],
      ChiefComplaint: [''],
      AccompaniedBy: [''],
      TransitionOfCarePatient: [''],
      TokenNumber: [''],
      Appointment: ['', Validators.required],
      VisitStatus: ['', Validators.required],
      PatientNextConsultation: [''],
      AdditionalInformation: [''],
      SkipVisitIntake: [''],
      FacilityName: [''],
      Facility: ['']
    });
    this.getAppointmentCountVisitCount();
    this.getAllVisitCount();
    this.getPatientList();
    //this.getAllappointmentList();
    this.getHospitalName();
    //this.getToConsult();
    this.getVisitType();
    this.getFacilitiesforVisits();
    this.getAllRecordedDuring();
    this.getUrgencyType();
    this.getPatientArraivalCondition();
    this.getVisitStatus();
    //this.getAllPatientVisit();
    this.ConsultationTypesForVisit();
    this.AppointmentBookedListForVisit();
    this.changetime();
  }
  lisit() {
    return document.getElementById("List");
  }

  Requests() {
    return document.getElementById("Requests");
  }

  changetime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
  }
  getPatientList() {
    this.patientVisitForm.get('searchPatientList').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.visitSvc.getPatientsForVisitSearch(key).then(data => {
              this.filteredOptions = data;
            });
          }
          else {
            this.filteredOptions = null;
            this.show = false;
            this.showingNewVisit = true;
            this.Appointmentbtn = false;
          }
        }
      });
  }
  getPatientId(id: number) {
    this.patientCardId = id;
    this.showingNewVisit = false;

    this.getOrderNumber();
    this.visitSvc.getPatientDetailsById(id).then(data => {
      if (data) {
        this.patientById = data;
        this.patientVisitForm.get('Facility').setValue(this.patientById.FacilityName);
        if (this.dataListType == "Appointment") {
          this.patientVisitForm.get('VisitStatus').setValue(1);
          this.patientVisitForm.get('Appointment').setValue("Yes");
        }
        this.facilityIdValue = this.patientById.FacilityId;
        this.getToConsult(this.facilityIdValue);
      }
    });
    this.show = true;
    this.getVisitsbyPatientID(id);
  }

  //#region get order number

  getOrderNumber() {
    this.visitSvc.getOrderNumber().then((res) => {
      this.OrderNumber = res[0];
    })
  }

  getVisitsbyPatientID(patientId: number) {
    this.visitSvc.getVisitsbyPatientID(patientId).then(data => {
      if (data != undefined) {
        this.patientVisitHistory = data;
        if (this.patientVisitHistory.length == 0) {
          this.showParticularRes = false;
        }
        else {
          this.showParticularRes = true;
        }
        this.VisitDateandTimeType = data;
      }
    });
  }

  ConsultationTypesForVisit() {
    this.visitSvc.ConsultationTypesForVisit().then(data => {
      this.ConsultationType = data;
    }
    );
  }

  AppointmentBookedListForVisit() {
    this.visitSvc.AppointmentBookedListForVisit().then(data => {
      this.AppointmentType = data;
    })
  }

  openVisitViewReport(element: any) {
    this.visitSvc.getPatientVisitByVisitId(element.Item.VisitId).then(data => {
      let visitDetails = data;
      const dialogRef = this.dialog.open(VisitViewPatientHistoryComponent, {
        data: visitDetails,
        width: '1200px',
      });
    });
  }

  deleteAdmissionRecord(data: any) {
    // this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
    // );
    const dialogRef = this.dialog.open(visitPopupHistoryComponent, {
      data: data.Item.PatientId,
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
  }

  openAddUpdateform() {
    const dialogRef = this.dialog.open(AddNewPatientComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
  }

  openVisitEditReport(element) {
    this.visitSvc.getPatientVisitByVisitId(element.Item.VisitId).then(data => {
      let visitDetails = data;
      const dialogRef = this.dialog.open(VisitEditPatientRecordComponent, {
        data: visitDetails,
        height: 'auto',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getVisitsbyPatientID(visitDetails.PatientId);
      });
    });
  }

  /* openTimeline() {
     const dialogRef = this.dialog.open(VisitPopupTimelineComponent, {
       height: 'auto',
     });
   }*/
  /*  openTimelinev() {
      const dialogRef = this.dialog.open(VisitPopupTimelineVComponent, {
        height: 'auto',
      });
    }*/
  /*  visitList() {
      const dialogRef = this.dialog.open(VisitPatientlistComponent, {
        height: 'auto',
        width: '1200px',
      });
    }*/

  getAllVisitCount() {
    this.visitSvc.getVisitCount().then(data => {
      if (data != undefined && data != null) {
        this.visitCount = data;
      }
    });
  }


  getAppointmentCountVisitCount() {
    this.visitSvc.getAppointmentCountsforVisit().then(data => {
      if (data != undefined && data != null) {
        this.visitAppointmentCount = data;
      }
    });
  }

  getVisitType() {
    this.visitSvc.getVisitType().then(data => {
      this.visitType = data;
    });
  }

  getAllRecordedDuring() {
    this.visitSvc.getAllRecordedDuringOptions().then(data => {
      this.recordedDuring = data;
    });
  }

  getFacilitiesforVisits() {
    this.visitSvc.getFacilitiesforVisits().then(data => {
      this.facilitiesVisitData = data;
    });
  }

  getUrgencyType() {
    this.visitSvc.getUrgencyType().then(data => {
      this.urgencyType = data;
    });
  }

  getPatientArraivalCondition() {
    this.visitSvc.getPatientArraivalCondition().then(data => {
      this.patientArraivalCondition = data;
    });
  }

  getHospitalName() {
    this.visitSvc.getHospital().then(data => {
      this.hospitalName = data;

      this.filteredFacility = this.patientVisitForm.get('Facility').valueChanges.pipe(
        startWith(''), map(value => this._filterFacility(value)));
    });
  }

  private _filterFacility(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.hospitalName.filter((x) => new RegExp(value, 'gi').test(x.FacilityName));
  }

  getToConsult(FacilityID) {
    this.visitSvc.getGetProvidersConsult(FacilityID).then(data => {
      this.toConsultData = data;

    });
  }

  getVisitStatus() {
    this.visitSvc.getVisitStatus().then(data => {
      this.visitStatus = data;
    });
  }

  getAllPatientVisit() {
    this.visitSvc.getAllPatientVisits().then(data => {
      this.patientVisitCollection = data;
    });
  }

  // getAllappointmentList() {
  //   this.visitSvc.getAllappointmentList().then(data => {
  //     this.appointmentListData = data;
  //   });
  // }

  sendDateWithTime() {
    this.getDate = new Date(this.patientVisitForm.get("VisitDate").value);

    if (this.patientVisitForm.get("VisitDate").value != "") {
      if (this.patientVisitForm.get("VisitTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.patientVisitForm.get("VisitTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitForm.get("VisitTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.patientVisitForm.get("VisitTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.patientVisitForm.get("VisitTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitForm.get("VisitTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.patientVisitForm.get("VisitTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  showfield1(VisitTypeId) {
    if (VisitTypeId == 2) {
      this.showfield = false;
    }
    else {
      this.showfield = true;
    }
  }

  // getfacilitiesIdValue(data) {
  //   if (data) {
  //     if (this.facilityIdValue > 0 && this.facilityIdValue != data.FacilityId) {
  //       let FacilityName = data.FacilityName;
  //       this.facilityIdValue = data.FacilityId;
  //       this.patientVisitForm.reset();
  //       this.patientVisitForm.get('Facility').setValue(FacilityName);
  //     }
  //     else {
  //       this.facilityIdValue = data.FacilityId;
  //     }
  //   }
  // }


  addUpdatePatientVisitPayment(data) {

    let savingType = data;

    if (this.patientVisitForm.valid) {
      this.sendDateWithTime();
      this.patientVisitModel.VisitId = 0;
      this.patientVisitModel.PatientId = this.patientById.PatientId;

      if (this.showfield = false) {
        this.patientVisitModel.visitDateandTime = this.patientVisitForm.get('visitDateandTime').value;
      }
      else {
        this.patientVisitModel.visitDateandTime = '';
      }
      this.patientVisitModel.VisitDate = this.getDateAndTime;
      this.patientVisitModel.Visittime = this.patientVisitForm.get('VisitTime').value;
      this.patientVisitModel.VisitTypeID = this.patientVisitForm.get('VisitType').value;
      this.patientVisitModel.RecordedDuringID = this.patientVisitForm.get('RecordedDuring').value;
      this.patientVisitModel.UrgencyTypeID = this.patientVisitForm.get('UrgencyType').value;
      this.patientVisitModel.PatientArrivalConditionID = this.patientVisitForm.get('PatientArrivalCondition').value;
      this.patientVisitModel.ToConsult = this.patientVisitForm.get('ToConsult').value;
      this.patientVisitModel.ProviderID = this.patientVisitForm.get('Provider').value;
      this.patientVisitModel.ReferringFacility = this.patientVisitForm.get('ReferringHospital').value;
      this.patientVisitModel.ReferringProvider = this.patientVisitForm.get('ReferringDoctor').value;
      this.patientVisitModel.ConsultationType = this.patientVisitForm.get('ConsultationType').value;
      this.patientVisitModel.ChiefComplaint = this.patientVisitForm.get('ChiefComplaint').value;
      this.patientVisitModel.AccompaniedBy = this.patientVisitForm.get('AccompaniedBy').value;
      this.patientVisitModel.TransitionOfCarePatient = this.patientVisitForm.get('TransitionOfCarePatient').value;
      this.patientVisitModel.TokenNumber = this.patientVisitForm.get('TokenNumber').value;
      this.patientVisitModel.Appointment = this.patientVisitForm.get('Appointment').value;
      this.patientVisitModel.VisitStatusID = this.patientVisitForm.get('VisitStatus').value;
      this.patientVisitModel.AdditionalInformation = this.patientVisitForm.get('AdditionalInformation').value;
      this.patientVisitModel.SkipVisitIntake = this.patientVisitForm.get('SkipVisitIntake').value;
      this.patientVisitModel.FacilityID = this.facilityIdValue;
      this.patientVisitModel.VisitNo = this.OrderNumber;
      this.patientVisitModel.VisitReason = "";
      this.patientVisitModel.PatientNextConsultation = "";
      if (savingType === 'AppointmentRecord') {
        this.patientVisitModel.AppointmentID = this.AppointmentDataId;
        this.visitSvc.addUpdateVisit(this.patientVisitModel).then(res => {
          const AppointmentID = this.ParticularAppointid;
          this.visitSvc.confirmVisitfromAppointment(AppointmentID).then(res => {
            if (res) {
              this.util.showMessage("", "Visit Request Details Saved Successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
                .then((res) => {
                  const elem = this.visitSvc.visitPaymentVisitId;
                  const PatientId = this.patientVisitModel.PatientId;
                  this.router.navigate(['/home/visits/visitpayment', elem, PatientId]);
                });
            }
          });
        });
      }
      else {
        this.visitSvc.addUpdateVisit(this.patientVisitModel).then(res => {
          const elem = this.visitSvc.visitPaymentVisitId;
          const PatientId = this.patientVisitModel.PatientId;
          this.router.navigate(['/home/visits/visitpayment', elem, PatientId]);
        });
      }
    }
  }

  visitpayment(event) {
    const VisitId = event.Item.VisitId;
    const PatientId = event.Item.PatientId;
    this.setsessionStorage();
    this.router.navigate(['/home/visits/visitpayment', VisitId, PatientId]);
  }

  //#region "Set PreProceduresearchmodel"
  setsessionStorage() {
    let setsessionvalue = this.visitSearchListEmitData;
    delete setsessionvalue.patientVisitDataCollection;
    setsessionvalue.patientVisitDataCollection
    setsessionvalue.VisitUI = true;
    setsessionvalue.AppointmentUI = false;
    sessionStorage.setItem("PatientVisitSearchModel", JSON.stringify(setsessionvalue));
  }
  //#endregion

  VisitDataCollection(data) {
    if (data != null) {
      this.visitSearchListEmitData = data;
      this.PatientVisitSearchModel = this.visitSearchListEmitData.PatientVisitSearchModelValue;
      this.switching();
    }
  }


  switching() {
    switch (this.selectionTypeData) {
      case 'Visit':
        this.reset();
        this.VisitListsvc();
        break;

      case 'Appointment':
        this.reset();
        this.AppointmentListsvc();
        break;

      default:
        this.VisitOpencolor();
        this.VisitListsvc();
        break;
    }
  }

  VisitOpencolor() {
    this.lisit().style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    this.lisit().style.color = "#fff";
    this.Requests().style.background = "#fff";
    this.Requests().style.color = "#717c8c";
  }

  VisitOpenList() {
    this.AppUiData = true;
    this.VisitUiData = false;
    this.patientVisitCollection = [];
    this.visitList = true;
    this.appointmentList = false;
    this.lisit().style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    this.lisit().style.color = "#fff";
    this.Requests().style.background = "#fff";
    this.Requests().style.color = "#717c8c";
    this.dataListType = "Visit";
    this.VisitList();
    this.getAllVisitCount();
  }

  AppointmentOpenList() {
    this.VisitUiData = true;
    this.AppUiData = false;
    this.appointmentListData = [];
    this.appointmentList = true;
    this.visitList = false;
    this.Requests().style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    this.Requests().style.color = "#fff";
    this.lisit().style.background = "#fff";
    this.lisit().style.color = "#717c8c";
    this.dataListType = "Appointment";
    this.AppointmentList();
    this.getAppointmentCountVisitCount();
  }

  VisitList() {
    let valuetype = this.dataListType;
    this.selectionTypeData = valuetype;
    this.switching();
  }

  AppointmentList() {
    let valuetype = this.dataListType;
    this.selectionTypeData = valuetype;
    this.switching();
  }

  VisitListsvc() {
    if (this.PatientVisitSearchModel != null) {
      this.visitSvc.getPatientVisitSearchData(this.PatientVisitSearchModel).then(data => {
        this.patientVisitCollection = data;
        this.PatientVisitSearchModel = null;
        if (this.patientVisitCollection.length == 0) {
          this.showResult = true;
          this.visitList = false;
        }
        else {
          this.showResult = false;
          this.visitList = true;
        }
      });
    }
  }

  AppointmentListsvc() {
    if (this.PatientVisitSearchModel != null) {
      let valuetype = this.dataListType;
      this.selectionTypeData = valuetype;
      this.visitSvc.getAppointmentsforSearchData(this.PatientVisitSearchModel).then(data => {
        this.appointmentListData = data;
        this.PatientVisitSearchModel = null;
        if (this.appointmentListData.length == 0) {
          this.showResult = true;
          this.appointmentList = false;
        }
        else {
          this.showResult = false;
          this.appointmentList = true;
        }
      });
    }

  }

  openappointmentEdit(event) {
    this.reset();
    this.Appointmentbtn = true;
    this.patientVisitForm.get('searchPatientList').setValue(event.Item.PatientName);
    let patientId = event.Item.PatientID;
    this.AppointmentDataId = event.Item.AppointmentID;
    this.getPatientId(patientId);
    this.setAppointmentRecord(this.AppointmentDataId);
  }

  setAppointmentRecord(AppointmentId) {
    this.visitSvc.getAppointmentRecordById(AppointmentId).then(data => {
      if (data) {
        let AppointmentRecord = data;
        this.ParticularAppointid = AppointmentRecord.AppointmentID;
        this.patientVisitForm.get('Facility').setValue(AppointmentRecord.FacilityName);
        this.facilityIdValue = AppointmentRecord.FacilityID;
      }
    });
  }
  ConfirmVisit() {
    this.addUpdatePatientVisitPayment('AppointmentRecord');
  }

  reset() {
    this.patientVisitForm.reset();
    this.patientVisitForm.get('VisitTime').setValue(this.time);
    this.patientVisitForm.get('VisitTime').setValue(null);
    this.show = false;
    this.showingNewVisit = true;
  }

}
