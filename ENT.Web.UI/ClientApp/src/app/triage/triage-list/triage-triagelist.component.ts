import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TriageService } from '../triage.service';
import { TriageSearchModel } from '../models/triageSearchModel';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'triage-triagelist',
  templateUrl: 'triage-triagelist.component.html'
})
export class TriageListComponent implements OnInit, AfterViewInit {
  //#region property declaration
  triagePatientSearchForm: FormGroup;
  triageSearchModel: TriageSearchModel = new TriageSearchModel();
  tableConfig: TableConfig = new TableConfig();
  allPatientVisitList: any;
  searchlist: any;
  count: any;
  show: boolean = true;
  TriageWaitingCount: any;
  TriageCompletedCount: any;
  TotalVisitCount: any;
  patientData: any;
  doctorData: any;
  patientid: any;
  doctorId: any;
  IsDateCorrect: boolean = false;
  VisitNumber: any;
  facilityData: any;

  public triageListCard: FlexCardConfig = new FlexCardConfig();

  //#endregion property declaration

  @ViewChild('autoCompleteVisitInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDoctorInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  //#region constructor
  constructor(private router: Router, private fb: FormBuilder, private customHttpSvc: CustomHttpService, private triageSvc: TriageService, public dialog: MatDialog,) {
   
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showIntake = true;
    // this.tableConfig.showCaseSheet = true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'visitStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' }
    // ];

    this.triageListCard.FlexDataConfig = [
    
      //Header
      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },
    
      //Content
      { PropertyName: 'VisitNo', DisplayName: 'Visit No', SectionType: "Content" },
      { PropertyName: 'VisitDate', DisplayName: 'Date Time', DisplayMode: 'DateTime', },//FormatString:"hh:mm a"
      { PropertyName: 'visitStatus', DisplayName: 'Visit Status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },

    ];
    
      //Icons
       this.triageListCard.showIntake = true;
       this.triageListCard.showCaseSheet = true;
  }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));

    this.triagePatientSearchForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      VisitNumber: [''],
      Facility: [0],
      Doctor: [''],
      Patient: ['']
    });
    this.totalAppointment();
    this.CheckValidDate();
    this.getVisitNumberbySearch();
    this.getFacilityNames();
    this.getDoctorName();
    this.getPatientname();
    this.getPatientsBySearch();
  }
  //#endregion ngOnInit

  //#region ngAfterViewInit
  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.triagePatientSearchForm.get('VisitNumber').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
            this.triagePatientSearchForm.get('Patient').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.triagePatientSearchForm.get('Doctor').setValue('');
        }
      });
  }
  //#endregion ngAfterViewInit

  //#region count details
  totalAppointment() {
    this.triageSvc.getCount().then(data => {
      this.count = data;
      this.TotalVisitCount = this.count.TotalVisitCount;
      this.TriageCompletedCount = this.count.TriageCompletedCount;
      this.TriageWaitingCount = this.count.TriageWaitingCount;
    });
  }
  //#endregion count details

  //#region check valid date in search
  public CheckValidDate(): void {
    this.triagePatientSearchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.triagePatientSearchForm.get('FromDate').value > this.triagePatientSearchForm.get('ToDate').value) {
        this.IsDateCorrect = true;
      } else {
        this.IsDateCorrect = false;
      }
    });

    this.triagePatientSearchForm.get('ToDate').valueChanges.subscribe((ToDate: any) => {
      if (this.triagePatientSearchForm.get('FromDate').value > this.triagePatientSearchForm.get('ToDate').value) {
        this.IsDateCorrect = true;
      } else {
        this.IsDateCorrect = false;
      }
    });
  }
  //#endregion check valid date in search

  //#region search visit number
  getVisitNumberbySearch() {
    if (this.triagePatientSearchForm.get('VisitNumber').value != null) {
      this.triagePatientSearchForm.get('VisitNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getVisitNumberForSearch(key).then(data => {
                this.VisitNumber = data;
              });
            }
            else {
              this.VisitNumber = null;
            }
          }
          else {
            this.VisitNumber = null;
          }
        });
    }
  }
  //#endregion

  //#region search facility name
  getFacilityNames() {
    this.triageSvc.getFacilityNames().then(res => {
      this.facilityData = res;
    });
  }
  //#endregion

  //#region search doctor name
  getDoctorName() {
    if (this.triagePatientSearchForm.get('Doctor').value != null) {
      this.triagePatientSearchForm.get('Doctor').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.GetDoctorname(key).then(data => {
                this.doctorData = data;
              })
            }
            else {
              this.doctorData = null;
              this.doctorId = 0;
            }
          } else {
            this.doctorData = null;
            this.doctorId = 0;
          }
        })
    }
  }

  setdoctor(number) {
    this.doctorId = number;
  }
  //#endregion search doctor name 

  //#region search patient name 
  getPatientname() {
    if (this.triagePatientSearchForm.get('Patient').value != null) {
      this.triagePatientSearchForm.get('Patient').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.triageSvc.GetPatientname(key).then(data => {
              this.patientData = data;
            })
          }
          else {
            this.patientData = null;
            this.patientid = 0;
          }
        }
        else {
          this.patientData = null;
          this.patientid = 0;
        }
      })
    }
  }

  setpatient(number) {
    this.patientid = number;
  }
  //#endregion search patient name 

  //#region page navigation
  openIntake(element: any) {
    this.setSessionStorage();
    this.router.navigate(['home/triage/visitIntake', element.Item.PatientId, element.Item.VisitId]);
  }

  visitCaseSheet(element: any) {
    this.setSessionStorage();
    this.router.navigate(['home/triage/triagecasesheet', element.Item.PatientId, element.Item.VisitId, element.Item.ProviderID]);
  }
  //#endregion page navigation

  //#region session storage
  setSessionStorage() {
    let setsessionvalue = {
      triageSearchModelValue: this.triageSearchModel,
      Doctor: this.triagePatientSearchForm.get("Doctor").value,
      Patient: this.triagePatientSearchForm.get("Patient").value,
    }
    sessionStorage.setItem("triageSearchModel", JSON.stringify(setsessionvalue));
  }
  //#endregion

  //#region search
  getPatientsBySearch() {
    if (sessionStorage.getItem('triageSearchModel')) {
      let triageSearchModelData = JSON.parse(sessionStorage.getItem('triageSearchModel'));
      this.triageSearchModel = triageSearchModelData.triageSearchModelValue;
      this.triagePatientSearchForm.get('FromDate').setValue(this.triageSearchModel.FromDate);
      this.triagePatientSearchForm.get('ToDate').setValue(this.triageSearchModel.ToDate);
      this.triagePatientSearchForm.get('VisitNumber').setValue(this.triageSearchModel.VisitNo);
      this.triagePatientSearchForm.get('Facility').setValue(this.triageSearchModel.FacilityId);
      this.triagePatientSearchForm.get("Doctor").setValue(triageSearchModelData.Doctor);
      this.triagePatientSearchForm.get("Patient").setValue(triageSearchModelData.Patient);
      this.doctorId = triageSearchModelData.triageSearchModelValue.ProviderId;
      this.patientid = triageSearchModelData.triageSearchModelValue.PatientId;
      this.triageSearchModel.ProviderId = this.doctorId;
      this.triageSearchModel.PatientId = this.patientid;
      this.triageSvc.getVisitedPatientsBySearch(this.triageSearchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        } else {
          this.allPatientVisitList = this.searchlist;
          this.show = false;
        }
      });
      sessionStorage.removeItem('triageSearchModel');
    }
    else {
      this.triageSearchModel.FromDate = this.triagePatientSearchForm.get('FromDate').value;
      this.triageSearchModel.ToDate = this.triagePatientSearchForm.get('ToDate').value;
      this.triageSearchModel.VisitNo = this.triagePatientSearchForm.get('VisitNumber').value;
      this.triageSearchModel.FacilityId = this.triagePatientSearchForm.get('Facility').value;
      this.triageSearchModel.ProviderId = this.doctorId;
      this.triageSearchModel.PatientId = this.patientid;
      this.triageSearchModel.SpecialityId = 0;
      this.triageSvc.getVisitedPatientsBySearch(this.triageSearchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        } else {
          this.allPatientVisitList = this.searchlist;
          this.show = false;
        }
      });
    }
  }
  //#endregion search

  //#region clear search
  clearForm() {
    this.triagePatientSearchForm.reset();
    this.triagePatientSearchForm.get('FromDate').setValue(new Date());
    this.triagePatientSearchForm.get('ToDate').setValue(new Date());
    this.triagePatientSearchForm.get('Facility').setValue(0);
    this.triageSearchModel.VisitNo = "";
    this.triageSearchModel.FromDate = this.triagePatientSearchForm.get('FromDate').value;
    this.triageSearchModel.ToDate = this.triagePatientSearchForm.get('ToDate').value;
    this.triageSearchModel.FacilityId = this.triagePatientSearchForm.get('Facility').value;
    this.triageSearchModel.PatientId = 0;
    this.triageSearchModel.ProviderId = 0;
    this.triageSvc.getVisitedPatientsBySearch(this.triageSearchModel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show = true;
      } else {
        this.allPatientVisitList = this.searchlist;
        this.show = false;
      }
    });
  }
  //#endregion clear search

}
