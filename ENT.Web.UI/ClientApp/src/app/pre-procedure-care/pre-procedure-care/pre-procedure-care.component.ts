import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAutocompleteTrigger, MatDialog, PageEvent } from "@angular/material";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CustomHttpService } from "../../core/custom-http.service";
import { ProcedureService } from "../procedure.service";
import { TableConfig } from "../../ux/columnConfig";
import { searchModel } from "../models/searchModel";
import { PreProcedureAnsthesiaComponent } from './anaesthesia-fittness-clearance/pre-procedure-ansthesia.component';
import { PreAnethesiaViewComponent } from './schedule-procedure/pre-anethesia-view.component';
import { FlexCardConfig } from "src/app/ux/bmstable/flexDesign/Card_Config";

@Component({
  selector: "pre-procedure-care",
  templateUrl: "pre-procedure-care.component.html",
  styleUrls: ["./pre-procedure-care.component.css"],
})
export class PreProcedureCareComponent implements OnInit {

  //#region Property Declaration

  tableConfig: TableConfig = new TableConfig();
  searchModel: searchModel = new searchModel()
  searchForm: FormGroup;
  TableData: any;
  getTotalCountValue: any;
  speciality: any;
  patientNameValue: any;
  PhysicianNameValue: any;
  searchlist: any;
  show1: boolean = false;
  PhysicianNameNumber: any;
  patientSearchId: any;
  IsDateCorect: boolean = false
  facilityData: any;
  AdmissionNumber: any[];
  PreProcedureListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompletePatientName', { static: false, read: MatAutocompleteTrigger }) triggerPatientName: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) triggerPhysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteNumber', { static: false, read: MatAutocompleteTrigger }) triggerNumber: MatAutocompleteTrigger;
  //#endregion Property Declaration

  //#region Constructor

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private customHttpSvc: CustomHttpService,
    private procedureService: ProcedureService,
  ) 
  {

    // this.tableConfig.showPagination = true;
    // this.tableConfig.showSchedule = true;
    // this.tableConfig.showAnaesthesia = true;
    // this.tableConfig.showDrugChart = true;
    // this.tableConfig.showDrugAdminChart = true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AdmissionNo', DisplayName: 'Admission No', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'procedureStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProcedureDesc', DisplayName: 'Procedure (short)', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'UrgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AdmissionDateTime', DisplayName: 'Admission Date & Time', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy hh:mm a", LinkUrl: '' },

    // ];
    
    this.PreProcedureListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'AdmissionNo', DisplayName: 'Admission No', SectionType: "Content" },
      { PropertyName: 'UrgencyType', DisplayName: 'UrgencyType', SectionType: "Content" },
      { PropertyName: 'procedureStatus', DisplayName: 'Procedure status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },
    ];

    //Icons

    this.PreProcedureListCard.showSchedule = true;
    this.PreProcedureListCard.showAnaesthesia = true;
    this.PreProcedureListCard.showDrugChart = true;
    this.PreProcedureListCard.showDrugAdminChart = true;
  }

  //#endregion Constructor

  //#region ngOnInit 

  ngOnInit() {

    this.searchForm = this.fb.group({

      FromDate: [new Date()],
      ToDate: [new Date()],
      Doctor: [""],
      PatientName: [""],
      FacilityId: [0],
      AdmissionNo: [""],

    });

    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.getTotalCount();
    this.getSpeciality();
    this.getpatientname();
    this.getPhysicianName();
    this.searchSubmit();
    this.CheckValidDate();
    this.getFacilitiesByuser();

  }
  ngAfterViewInit() {
    this.triggerNumber.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('AdmissionNo').setValue('');
      }
    });

    this.triggerPatientName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('PatientName').setValue('');
      }
    });

    this.triggerPhysician.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('Doctor').setValue('');
      }
    });


  }
  //#endregion ngOnInit

  //#region Check Date in Search
  public CheckValidDate(): void {

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
  //#endregion Check Date in Search

  //#region get Value

  //get Total Count number
  getTotalCount() {
    this.procedureService.getTotalCount().then((res) => {

      this.getTotalCountValue = res;
    });
  }

  //get Speciality drop Down Value
  getSpeciality() {
    this.procedureService.Getspecialities().then((res) => {
      this.speciality = res;
    })
  }

  //get patient name in search
  getpatientname() {
    if (this.searchForm.get('PatientName').value != null) {
      this.searchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.procedureService.getPatientName(key).then(data => {
                this.patientNameValue = data;
              })
            }
            else {
              this.patientNameValue = null;
              this.patientSearchId = 0;
            }
          }
          else {
            this.patientNameValue = null;
            this.patientSearchId = 0;
          }
        })
    }
  }

  //get physician name in search
  getPhysicianName() {
    if (this.searchForm.get('Doctor').value != null) {
      this.searchForm.get('Doctor').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.procedureService.getPhysicianName(key).then(data => {
                this.PhysicianNameValue = data;
              })
            }
            else {
              this.PhysicianNameValue = null;
              this.PhysicianNameNumber = (0);
            }
          } else {
            this.PhysicianNameValue = null;
            this.PhysicianNameNumber = (0);
          }
        })
    }
  }

  //set Patient Id in search
  setPatientSearchId(number) {
    this.patientSearchId = (number);
  }

  //set Physician Id in search
  setPhysicianNameNumber(number) {
    this.PhysicianNameNumber = (number);
  }

  // Cancel Function
  CancelForm() {
    this.searchForm.reset();
    this.searchForm.get('FromDate').setValue(new Date());
    this.searchForm.get('ToDate').setValue(new Date());
    this.searchForm.get('FacilityId').setValue(0);
    this.searchModel.FromDate = this.searchForm.get('FromDate').value;
    this.searchModel.ToDate = this.searchForm.get('ToDate').value;
    this.searchModel.FacilityId = this.searchForm.get('FacilityId').value;
    this.searchModel.AdmissionNo = this.searchForm.get('AdmissionNo').value;
    this.searchModel.PatientId = 0;
    this.searchModel.ProviderId = 0;
    this.procedureService.searchPreProcedure(this.searchModel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show1 = true;
        this.patientSearchId = 0;
        this.PhysicianNameNumber = 0;
      }
      else {
        this.TableData = this.searchlist;
        this.show1 = false;
        this.patientSearchId = 0;
        this.PhysicianNameNumber = 0;
      }
    })
  }
  //#endregion get Table Value

  //#region open Icon in Table/Grid

  // open View / Schedule Pop up
  viewProcedure(i: any) {
    i = i.Item;
    const dialogRef = this.dialog.open(PreAnethesiaViewComponent, {

      data: i,
      height: "auto",
      width: "150%"

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'update') {
        this.searchSubmit();
      }
    });
  }

  //open Anethesia Fitness pop up
  viewAnesthesia(i: any) {
    i = i.Item;
    const dialogRef = this.dialog.open(PreProcedureAnsthesiaComponent, {
      data: i,
      height: "auto",
      width: "auto",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'update') {
        this.searchSubmit();
      }
    });
  }

  // open  Drug Administration Chart by Routing
  viewAdminstrationDrugChart(i: any) {
    this.setsessionStorage();
    i = i.Item;
    const PatientID = i.PatientID;
    const AdmissionID = i.AdmissionID;

    this.router.navigate(['home/procedure/drugAdministrationChart', PatientID, AdmissionID]);
  }

  // open  Drug Chart by Routing
  openPreProcedureDrugChart(i: any) {
    this.setsessionStorage();
    i = i.Item;
    const AdmissionID = i.AdmissionID;
    const PatientID = i.PatientID;

    this.router.navigate(['/home/procedure/DrugchartAddListComponent', PatientID, AdmissionID]);
  }
  //#endregion open icon

  //#region "Set PreProceduresearchmodel"
  setsessionStorage() {
    let setsessionvalue = {
      PreProceduresearchmodelValue: this.searchModel,
      Doctor: this.searchForm.get("Doctor").value,
      PatientName: this.searchForm.get("PatientName").value,
    }
    sessionStorage.setItem("PreProceduresearchmodel", JSON.stringify(setsessionvalue));
  }
  //#endregion
  // search Function
  searchSubmit() {
    if (sessionStorage.getItem("PreProceduresearchmodel")) {

      let PreProceduresearchmodel = JSON.parse(sessionStorage.getItem("PreProceduresearchmodel"));
      this.searchModel = PreProceduresearchmodel.PreProceduresearchmodelValue;
      this.searchForm.get('FromDate').setValue(PreProceduresearchmodel.PreProceduresearchmodelValue.FromDate);
      this.searchForm.get('ToDate').setValue(PreProceduresearchmodel.PreProceduresearchmodelValue.ToDate);
      this.searchForm.get("Doctor").setValue(PreProceduresearchmodel.Doctor);
      this.searchForm.get("PatientName").setValue(PreProceduresearchmodel.PatientName);
      this.searchForm.get('FacilityId').setValue(PreProceduresearchmodel.PreProceduresearchmodelValue.FacilityId);
      this.searchForm.get('AdmissionNo').setValue(PreProceduresearchmodel.PreProceduresearchmodelValue.AdmissionNo);

      this.patientSearchId = this.searchModel.PatientId;
      this.PhysicianNameNumber = this.searchModel.ProviderId;
      this.procedureService.searchPreProcedure(this.searchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show1 = true;
        }
        else {
          this.TableData = (this.searchlist);
          this.show1 = false;
        }
      });
      sessionStorage.removeItem("PreProceduresearchmodel");
    }
    else {
      this.searchModel.FromDate = this.searchForm.get('FromDate').value;
      this.searchModel.ToDate = this.searchForm.get('ToDate').value;
      this.searchModel.ProviderId = this.PhysicianNameNumber;
      this.searchModel.PatientId = this.patientSearchId;
      this.searchModel.FacilityId = this.searchForm.get('FacilityId').value;
      this.searchModel.AdmissionNo = this.searchForm.get('AdmissionNo').value;

      this.procedureService.searchPreProcedure(this.searchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show1 = true;
        }
        else {
          this.TableData = (this.searchlist);
          this.show1 = false;
        }
      });
    }
  }

  getFacilitiesByuser() {
    this.procedureService.getFacility().then((res) => {
      this.facilityData = res;
    })
  }

  getAdmissionNumberbySearch() {
    if (this.searchForm.get('AdmissionNo').value != null) {
      this.searchForm.get('AdmissionNo').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.procedureService.getAdmissionNumberBySearch(key).then(data => {
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
