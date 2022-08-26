import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatAutocompleteTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PostProcedureCareService } from '../postProcedureCare.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { PostSearchModel } from '../../post-procedure-care/models/postSearchModel';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'post-procedure-care-list',
  templateUrl: 'post-procedure-care-list.component.html'
})

export class postProcedureCareList implements OnInit {

  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  postSearchModel: PostSearchModel = new PostSearchModel();
  Griddata: any;
  Totalcount: any;
  TotalRequestCount: any;
  FitnessClearanceCount: any;
  ScheduledCount: any;
  searchlist: any;
  show: any = false;
  patientid: any;
  doctorid: any;
  speciality: any;
  doctor: any;
  patient: any;
  IsDateCorect: boolean = false;
  postSurgicalSearchForm: FormGroup;
  facilityData: any;
  AdmissionNumber: any;
  PostProcedureListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompleteAdmission', { static: false, read: MatAutocompleteTrigger }) Admission: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDoctor', { static: false, read: MatAutocompleteTrigger }) Doctor: MatAutocompleteTrigger;
  @ViewChild('autoComplepatient', { static: false, read: MatAutocompleteTrigger }) autocompletepatient: MatAutocompleteTrigger;

  //#endregion

  //#region "constructor"
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private postProcedureCareService: PostProcedureCareService, private customHttpSvc: CustomHttpService,) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showCaseSheet = true;
    // this.tableConfig.showDrugChart = true;
    // this.tableConfig.showDrugAdminChart = true;
    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AdmissionNo', DisplayName: 'Admission Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'Attending Physician', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'procedureNameDesc', DisplayName: 'Procedure (short)', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'urgencyType', DisplayName: 'Urgency Type', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AdmissionDateandTime', DisplayName: 'Admission Date and Time', DisplayMode: 'Text', LinkUrl: '' },
    // ];

    this.PostProcedureListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'AdmissionNo', DisplayName: 'Admission No', SectionType: "Content" },
      { PropertyName: 'urgencyType', DisplayName: 'UrgencyType', SectionType: "Content" },
      { PropertyName: 'ProcedureStatus', DisplayName: 'Procedure status', ApplyStatusFontcolor:"ApplyFont",SectionType: "Content" },
      { PropertyName: 'facilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },

    ];

    //Icons 
    this.PostProcedureListCard.showCaseSheet = true;
    this.PostProcedureListCard.showDrugChart = true;
    this.PostProcedureListCard.showDrugAdminChart = true;


  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {
    this.postSurgicalSearchForm = this.fb.group({
      FromDate: [new Date()],
      Todate: [new Date()],
      Doctor: [''],
      PatientName: [''],
      AdmissionNo: [''],
      FacilityId: [0]

    });
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.totalPostsurgical();
    this.getSpeciality();
    this.getDoctor();
    this.getpatient();
    this.searchform();
    this.CheckValidDate();
    this.getFacilitiesByuser();
  }
  //#endregion
  //#region "ng After"

  ngAfterViewInit() {
    this.Admission.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.postSurgicalSearchForm.get('AdmissionNo').setValue('');
        }
      });
    this.Doctor.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.postSurgicalSearchForm.get('Doctor').setValue('');
        }
      });
    this.autocompletepatient.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.postSurgicalSearchForm.get('PatientName').setValue('');
        }
      });
  }
    //#endregion

  //#region Check Date in Search
  public CheckValidDate(): void {

    this.postSurgicalSearchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.postSurgicalSearchForm.get('FromDate').value > this.postSurgicalSearchForm.get('Todate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.postSurgicalSearchForm.get('Todate').valueChanges.subscribe((FromDate: any) => {
      if (this.postSurgicalSearchForm.get('FromDate').value > this.postSurgicalSearchForm.get('Todate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
  //#endregion Check Date in Search
  //#region "Table Value"
  getAllGrid() {
    this.postProcedureCareService.getGridTable().then((res) => {
      this.Griddata = res;
    });
  }
  //#endregion

  //#region "Casesheet"
  viewcasesheet(i: any) {
    this.setsessionStorage();
    i = i.Item;
    const AdmissionID = i.AdmissionID;
    const PatientID = i.PatientId;
    const preprocedureid = i.PreProcedureID;
    this.router.navigate(['home/post-procedure-care/postProcedureCasesheet', PatientID, AdmissionID, preprocedureid]);
  }
  //#endregion

  //#region "Drug Chart"
  viewDrugchart(i: any) {
    this.setsessionStorage();
    i = i.Item;
    this.postProcedureCareService.drugchartrecordid = i;
    const AdmissionID = i.AdmissionID;
    const PatientID = i.PatientId;
    this.router.navigate(['home/post-procedure-care/postprocedureDrugchart', PatientID, AdmissionID]);
  }
  //#endregion

  //#region "Administration"
  viewAdministration(i: any) {
    this.setsessionStorage();
    i = i.Item;
    const AdmissionID = i.AdmissionID;
    const PatientID = i.PatientId;
    this.router.navigate(['home/post-procedure-care/postprocedureAdministration', PatientID, AdmissionID,]);
  }
  //#endregion

  //#region "Total"
  totalPostsurgical() {
    this.postProcedureCareService.gettotalCount().then(data => {
      this.Totalcount = data
      this.TotalRequestCount = this.Totalcount.TotalRequestCount;
      this.FitnessClearanceCount = this.Totalcount.FitnessClearanceCount;
      this.ScheduledCount = this.Totalcount.ScheduledCount;
    });
  }
  //#endregion


  //#region "Set Doctor"
  setdoctor(number) {
    this.doctorid = number;
  }
  //#endregion

  //#region "Set patient"
  setpatient(number) {
    this.patientid = number;
  }
  //#endregion

  //#region "speciality"
  getSpeciality() {
    this.postProcedureCareService.Getspeciality().then(res => {
      this.speciality = res;
    })
  }
  //#endregion

  //#region "Doctor"
  getDoctor() {
    if (this.postSurgicalSearchForm.get('Doctor').value != null) {
      this.postSurgicalSearchForm.get('Doctor').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.GetDoctor(key).then(data => {
                this.doctor = data;
              })
            }
            else {
              this.doctor = null;
              this.doctorid = 0;
            }
          }
        })
    }

  }
  //#endregion

  //#region "patient"
  getpatient() {
    if (this.postSurgicalSearchForm.get('PatientName').value != null) {
      this.postSurgicalSearchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.Getpatient(key).then(data => {
                var a = [];
                key = key.toLowerCase();
                for (let i of data) {
                  if (i.PatientFirstName.toLowerCase().includes(key) || i.PatientMiddleName.toLowerCase().includes(key) || i.PatientLastName.toLowerCase().includes(key)) {
                    a.push(i);
                  }
                }
                this.patient = a;
              })
            }
            else {
              this.patient = null;
              this.patientid = 0;
            }
          }
        })
    }
  }
  //#endregion

  //#region "Cancel"
  CancelForm() {

    this.postSurgicalSearchForm.reset();
    this.postSurgicalSearchForm.get('FromDate').setValue(new Date());
    this.postSurgicalSearchForm.get('Todate').setValue(new Date());
    this.postSurgicalSearchForm.get('FacilityId').setValue(0);
    this.postSearchModel.FromDate = this.postSurgicalSearchForm.get('FromDate').value;
    this.postSearchModel.ToDate = this.postSurgicalSearchForm.get('Todate').value;
    this.postSearchModel.FacilityId = this.postSurgicalSearchForm.get('FacilityId').value;
    this.postSearchModel.PatientId = 0;
    this.postSearchModel.ProviderId = 0;

    this.postProcedureCareService.searchAdmission(this.postSearchModel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show = true;
        this.doctorid = 0;
        this.patientid = 0;
      }
      else {
        this.Griddata = this.searchlist;
        this.show = false;
        this.doctorid = 0;
        this.patientid = 0;
      }
    })
  }
  //#endregion

  //#region "Set sessionStorageFor_postProceduresearchmodel"
  setsessionStorage() {

    let setsessionvalue = {
      postProceduresearchmodelValue: this.postSearchModel,
      Doctor: this.postSurgicalSearchForm.get("Doctor").value,
      PatientName: this.postSurgicalSearchForm.get("PatientName").value,
    }

    sessionStorage.setItem("postProceduresearchmodel", JSON.stringify(setsessionvalue));
  }
  //#endregion
  //#region "Add record"
  searchform() {
    if (sessionStorage.getItem("postProceduresearchmodel")) {
      let postSearchModelData = JSON.parse(sessionStorage.getItem("postProceduresearchmodel"));
      this.postSearchModel = postSearchModelData.postProceduresearchmodelValue;
      this.postSurgicalSearchForm.get('FromDate').setValue(postSearchModelData.postProceduresearchmodelValue.FromDate);
      this.postSurgicalSearchForm.get('Todate').setValue(postSearchModelData.postProceduresearchmodelValue.ToDate);
      this.postSurgicalSearchForm.get("Doctor").setValue(postSearchModelData.Doctor);
      this.postSurgicalSearchForm.get("PatientName").setValue(postSearchModelData.PatientName);
      this.postSurgicalSearchForm.get('FacilityId').setValue(postSearchModelData.postProceduresearchmodelValue.FacilityId);
      this.postSurgicalSearchForm.get('AdmissionNo').setValue(postSearchModelData.postProceduresearchmodelValue.AdmissionNo);
      this.doctorid = this.postSearchModel.ProviderId;
      this.patientid = this.postSearchModel.PatientId;
      this.postProcedureCareService.searchAdmission(this.postSearchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        }
        else {
          this.Griddata = this.searchlist;
          this.show = false;
        }
      });
      sessionStorage.removeItem("postProceduresearchmodel");
    }
    else {
      this.postSearchModel.FromDate = this.postSurgicalSearchForm.get('FromDate').value;
      this.postSearchModel.ToDate = this.postSurgicalSearchForm.get('Todate').value;
      this.postSearchModel.ProviderId = this.doctorid;
      this.postSearchModel.PatientId = this.patientid;
      this.postSearchModel.FacilityId = this.postSurgicalSearchForm.get('FacilityId').value;
      this.postSearchModel.AdmissionNo = this.postSurgicalSearchForm.get('AdmissionNo').value;

      this.postProcedureCareService.searchAdmission(this.postSearchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        }
        else {
          this.Griddata = this.searchlist;
          this.show = false;
        }
      });
    }
  }
  //#endregion

  getFacilitiesByuser() {
    this.postProcedureCareService.getFacility().then((res) => {
      this.facilityData = res;
    })
  }

  getAdmissionNumberbySearch() {
    if (this.postSurgicalSearchForm.get('AdmissionNo').value != null) {
      this.postSurgicalSearchForm.get('AdmissionNo').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.getAdmissionNumberBySearch(key).then(data => {
                this.AdmissionNumber = data;
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
