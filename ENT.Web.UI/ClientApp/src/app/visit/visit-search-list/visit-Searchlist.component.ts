import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { CustomHttpService } from "src/app/core/custom-http.service";
import { PatientVisitSearchModel } from "../models/patientVisitModel";
import { VisitService } from "../visit.service";

@Component({
  selector: ' visitSearchList ',
  templateUrl: './visit-Searchlist.component.html',
  styleUrls: ['./visit-Searchlist.component.css']
})
export class visitSearchListComponent implements OnInit, OnChanges, AfterViewInit {
  visitSearchListForm: FormGroup;
  PatientVisitSearchModel: PatientVisitSearchModel = new PatientVisitSearchModel();
  doctorNameList: any;
  patientNameList: any;
  DoctorProviderID: number = 0;
  PatientID: number = 0;
  DateChecker: boolean = false;
  showingNewVisit: boolean = true;
  patientVisitCollection: any;
  providerTooltip: any;
  patientTooltip: any;
  VisitNumber: any;
  AppointmentNumber: any;
  facilityData: any;
  VisitUI: boolean = true;
  AppointmentUI: boolean = false;
  
  @Output() patientVisitDataCollection = new EventEmitter();
  @Output() SearchModelData = new EventEmitter();
  @Input() selectionType: any;

  @ViewChild('autoCompleteVisitNumInput', { static: false, read: MatAutocompleteTrigger }) VisitNoAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteAppointNumInput', { static: false, read: MatAutocompleteTrigger }) AppointmenNotAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) doctorAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) PatientAutotrigger: MatAutocompleteTrigger;

  constructor(private fb: FormBuilder, private visitSvc: VisitService, public custHttp: CustomHttpService,) { }

  ngOnChanges() {
    this.VisitUI = false;
    this.AppointmentUI = false;
    let selectionTypeData = this.selectionType;
    if (selectionTypeData != "") {
      selectionTypeData == "Visit" ? (this.VisitUI = true) : (this.AppointmentUI = true);
      this.ClearPatientVisitSearch();
    }
    else {
      this.VisitUI = true;
    }

  }

  ngOnInit(): void {
    this.visitSearchListForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      DoctorName: [''],
      PatientName: [''],
      VisitNo: [''],
      AppointmentNumber: [''],
      Facility: [0]
    })
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.getFacilitiesByuser();
    this.searchPatientVisitSearch();
    this.getDoctorNameList();
    this.getPatientNameList();
    this.CheckValidDate();
    this.getVisitNobySearch();
    this.getAppointmentNumberbySearch();
  }

  getFacilitiesByuser() {
    this.visitSvc.getFacilitiesforVisits().then((res) => {
      this.facilityData = res;
    })
  }


  //#region "getDoctorNameList"
  getDoctorNameList() {
    if (this.visitSearchListForm.get('DoctorName').value != null) {
      this.visitSearchListForm.get('DoctorName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.visitSvc.getProvidersforVisitSearch(key).then(data => {
                this.doctorNameList = data;
              });
            }
            else {
              this.doctorNameList = null;
              this.DoctorProviderID = 0;
              this.providerTooltip = null;

            }
          }
          else {
            this.doctorNameList = null;
            this.providerTooltip = null;
          }
        });
    }
  }
  //#endregion

  //#region "getPatientNameList" 
  getPatientNameList() {
    if (this.visitSearchListForm.get('PatientName').value != null) {
      this.visitSearchListForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.visitSvc.getPatientsForVisitSearch(key).then(data => {
                this.patientNameList = data;
              })
            }
            else {
              this.patientNameList = null;
              this.PatientID = 0;
              this.patientTooltip = null;

            }
          }
          else {
            this.patientNameList = null;
            this.patientTooltip = null;
          }
        });
    }
  }
  //#endregion


  //#region "setDoctorProviderID" 
  setDoctorProviderID(DoctorProviderID: number, DoctorName: string) {
    this.DoctorProviderID = DoctorProviderID;
    this.providerTooltip = DoctorName;

  }
  //#endregion


  //#region "setPatientID" 
  setPatientID(PatientID: number, value1, value2, value3) {
    this.PatientID = PatientID;
    this.patientTooltip = value1 + ' ' + value2 + ' ' + value3;

  }
  //#endregion

  //#region Check Date in Search
  public CheckValidDate(): void {

    this.visitSearchListForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.visitSearchListForm.get('FromDate').value > this.visitSearchListForm.get('ToDate').value) {
        this.DateChecker = true;
      } else {
        this.DateChecker = false;
      }
    });

    this.visitSearchListForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
      if (this.visitSearchListForm.get('FromDate').value > this.visitSearchListForm.get('ToDate').value) {
        this.DateChecker = true;
      } else {
        this.DateChecker = false;
      }
    });
  }
  //#endregion 

  getVisitNobySearch() {
    if (this.visitSearchListForm.get('VisitNo').value != null) {
      this.visitSearchListForm.get('VisitNo').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.visitSvc.getVisitNumberBySearch(key).then(data => {
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

  getAppointmentNumberbySearch() {

    if (this.visitSearchListForm.get('AppointmentNumber').value != null) {
      this.visitSearchListForm.get('AppointmentNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.visitSvc.getAppointmentNumberBySearch(key).then(data => {
                this.AppointmentNumber = data;
              })
            }
            else {
              this.AppointmentNumber = null;
            }
          }
          else {
            this.AppointmentNumber = null;
          }
        });
    }
  }

  //#region "searchPatientVisitSearch" 
  searchPatientVisitSearch() {
    if (sessionStorage.getItem("PatientVisitSearchModel")) {
      let PatientVisitSearch = JSON.parse(sessionStorage.getItem("PatientVisitSearchModel"));
      this.PatientVisitSearchModel = PatientVisitSearch.PatientVisitSearchModelValue;
      this.DoctorProviderID = PatientVisitSearch.PatientVisitSearchModelValue.ProviderId;
      this.PatientID = PatientVisitSearch.PatientVisitSearchModelValue.PatientId;
      this.visitSearchListForm.get('FromDate').setValue(PatientVisitSearch.PatientVisitSearchModelValue.FromDate);
      this.visitSearchListForm.get('ToDate').setValue(PatientVisitSearch.PatientVisitSearchModelValue.ToDate);
      this.visitSearchListForm.get("DoctorName").setValue(PatientVisitSearch.ProviderName);
      this.visitSearchListForm.get("PatientName").setValue(PatientVisitSearch.PatientName);
      this.visitSearchListForm.get("Facility").setValue(PatientVisitSearch.PatientVisitSearchModelValue.FacilityId);
      if (PatientVisitSearch.VisitUI) {
        this.AppointmentUI = false;
        this.VisitUI = true;
        this.visitSearchListForm.get("VisitNo").setValue(PatientVisitSearch.PatientVisitSearchModelValue.VisitNo);
      }
      else {
        this.VisitUI = false;
        this.AppointmentUI = true;
        // this.visitSearchListForm.get("AppointmentNumber").setValue(PatientVisitSearch.PatientVisitSearchModelValue.AppointmentNo);
      }
      this.PatientVisitSearchModel.ProviderId = this.DoctorProviderID;
      this.PatientVisitSearchModel.PatientId = this.PatientID;
      let emittingobjValue = {
        PatientVisitSearchModelValue: this.PatientVisitSearchModel,
        ProviderName: this.visitSearchListForm.get('DoctorName').value,
        PatientName: this.visitSearchListForm.get('PatientName').value,
      }
      this.patientVisitDataCollection.emit(emittingobjValue);
      sessionStorage.removeItem("PatientVisitSearchModel");
    }
    else {
      this.PatientVisitSearchModel.FromDate = this.visitSearchListForm.get('FromDate').value;
      this.PatientVisitSearchModel.ToDate = this.visitSearchListForm.get('ToDate').value;
      this.PatientVisitSearchModel.FacilityId = this.visitSearchListForm.get('Facility').value;
      if (this.VisitUI) {
        let VisitNo = this.visitSearchListForm.get('VisitNo').value;
        this.PatientVisitSearchModel.VisitNo = (VisitNo == null ? "" : VisitNo);
        this.PatientVisitSearchModel.AppointmentNo = "";
      }
      else {
        let AppointmentNo = this.visitSearchListForm.get('AppointmentNumber').value;
        this.PatientVisitSearchModel.AppointmentNo = (AppointmentNo == null ? "" : AppointmentNo);
        this.PatientVisitSearchModel.VisitNo = "";
      }
      this.PatientVisitSearchModel.ProviderId = this.DoctorProviderID;
      this.PatientVisitSearchModel.PatientId = this.PatientID;
      let value1 = this.visitSearchListForm.get('DoctorName').value;
      let value2 = this.visitSearchListForm.get('PatientName').value;
      let DoctorName = (value1 == null ? "" : value1);
      let Patient = (value2 == null ? "" : value2);
      let emittingobjValue = {
        PatientVisitSearchModelValue: this.PatientVisitSearchModel,
        ProviderName: DoctorName,
        PatientName: Patient,
        VisitUI: this.VisitUI,
        AppointmentUI: this.AppointmentUI
      }
      this.patientVisitDataCollection.emit(emittingobjValue);
    }
  }
  //#endregion

  ngAfterViewInit() {
    this.doctorAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.visitSearchListForm.get('DoctorName').setValue('');
        }
      });

    this.PatientAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.visitSearchListForm.get('PatientName').setValue('');
        }
      });

    this.VisitNoAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.visitSearchListForm.get('VisitNo').setValue('');
        }
      });


    this.AppointmenNotAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.visitSearchListForm.get('AppointmentNumber').setValue('');
        }
      });

  }

  //#region "ClearPatientVisitSearch" 
  ClearPatientVisitSearch() {
    this.visitSearchListForm.reset();
    this.visitSearchListForm.get('FromDate').setValue(new Date());
    this.visitSearchListForm.get('ToDate').setValue(new Date());
    this.visitSearchListForm.get('Facility').setValue(0);
    this.DoctorProviderID = 0;
    this.PatientID = 0;
    this.PatientVisitSearchModel.VisitNo = "";
    this.PatientVisitSearchModel.AppointmentNo = "";
    let FromDate = this.visitSearchListForm.get('FromDate').value;
    let ToDate = this.visitSearchListForm.get('ToDate').value;
    this.PatientVisitSearchModel.FromDate = FromDate;
    this.PatientVisitSearchModel.ToDate = ToDate;
    this.PatientVisitSearchModel.ProviderId = this.DoctorProviderID;
    this.PatientVisitSearchModel.PatientId = this.PatientID;
    let value1 = this.visitSearchListForm.get('DoctorName').value;
    let value2 = this.visitSearchListForm.get('PatientName').value;
    let DoctorName = (value1 == null ? "" : value1);
    let Patient = (value2 == null ? "" : value2);
    let emittingobjValue = {
      PatientVisitSearchModelValue: this.PatientVisitSearchModel,
      ProviderName: DoctorName,
      PatientName: Patient,
      VisitUI: this.VisitUI,
      AppointmentUI: this.AppointmentUI,
      type: "cleared"
    }
    this.patientVisitDataCollection.emit(emittingobjValue);
  }
  //#endregion
}