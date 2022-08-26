import { Component, OnInit, ViewChild } from "@angular/core";
import { AdmissionService } from "../admission.service";
import { TableConfig } from "../../ux/columnConfig";
import { CustomHttpService } from "../../core/custom-http.service";
import { MatAutocompleteTrigger, MatDialog } from "@angular/material";
import { ViewProcedureConvertComponent } from "./view-procedure-convert/view-procedure-convert.component";
import { EditProcedureConvertComponent } from "./edit-procedure-convert/edit-procedure-convert.component";
import { admissionsearchmodel } from "../Models/admissionsearchmodel";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FlexCardConfig } from "src/app/ux/bmstable/flexDesign/Card_Config";

@Component({
  selector: "app-procedure-convert",
  templateUrl: "./procedure-convert.component.html",
  styleUrls: ["./procedure-convert.component.css"],
})
export class ProcedureConvertComponent implements OnInit {

  //#region property declaration

  tableConfig: TableConfig = new TableConfig();
  admissionsearchmodel: admissionsearchmodel = new admissionsearchmodel();
  getAllProcedureReq: any;
  IsTableShow: boolean = false;
  searchForm: FormGroup;
  VisitNo: any;
  facilityData: any;
  patientname: any;
  searchPatientId: number = 0;
  physicianid: any = 0;
  Physician: any;
  searchlist: any;
  AppointmenttotalCount: any;
  totalCount: any = "";
  IsDateCorect: boolean = false;

  public ProcedureConvertListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompletePatientName', { static: false, read: MatAutocompleteTrigger }) triggerPatientName: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) triggerPhysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteNumber', { static: false, read: MatAutocompleteTrigger }) triggerNumber: MatAutocompleteTrigger;
  //#endregion property declaration

  //#region constructor
  constructor(
    public admissionService: AdmissionService,
    public custHttp: CustomHttpService,
    public MatDialog: MatDialog,
    public fb: FormBuilder
  ) {

    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = true;
    // this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showAdd = false;
    // this.tableConfig.showDelete = false;
    // this.tableConfig.columnConfig = [
    //   { PropertyName: "VisitNo", DisplayName: "Visit no", DisplayMode: "Text", LinkUrl: "", width: "8%" },
    //   { PropertyName: "facilityName", DisplayName: "facility Name", DisplayMode: "Text", LinkUrl: "", width: "10%" },
    //   { PropertyName: "PatientName", DisplayName: "Patient Name", DisplayMode: "Text", LinkUrl: "", width: "10%" },
    //   { PropertyName: "VisitDateandTime", DisplayName: "Visit Date and Time", DisplayMode: "Text", LinkUrl: "", width: "10%" },
    //   { PropertyName: "AdmittingPhysicianName", DisplayName: "Admitting Physician", DisplayMode: "Text", LinkUrl: "", width: "10%" },
    //   { PropertyName: "UrgencyType", DisplayName: "Urgency ", DisplayMode: "Text", LinkUrl: "", width: "8%" },
    //   { PropertyName: "ProcedureRequestedDate", DisplayName: "Procedure Request Date", DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: "", width: "8%" },
    //   { PropertyName: "ProcedureTypeName", DisplayName: "Procedure Type", DisplayMode: "Text", LinkUrl: "", width: "10%" },
    //   { PropertyName: "AdmissionStatusDesc", DisplayName: "Admission Status", DisplayMode: "Text", LinkUrl: "", width: "8%" },
    //   { PropertyName: "ProcedureNameDesc", DisplayName: "Procedure Name", DisplayMode: "Text", LinkUrl: "", width: "8%" }
    // ];



    this.ProcedureConvertListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'VisitNo', DisplayName: 'Visit No', SectionType: "Content" },
      { PropertyName: 'ProcedureTypeName', DisplayName: 'Procedure Type', SectionType: "Content" },
      { PropertyName: 'AdmissionStatusDesc', DisplayName: 'Admission Status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'facilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'AdmittingPhysicianName', DisplayName: 'Physician', SectionType: "Content" },

    ];
    
    //Icons 
    this.ProcedureConvertListCard.showView = true;
    this.ProcedureConvertListCard.showEdit = true;


  }

  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.searchForm = this.fb.group({
      PatientName: [''],
      Physician: [''],
      FromDate: [new Date()],
      ToDate: [new Date()],
      Facility: [0],
      VisitNo: [''],
    })
    //this.getallProcedureRequest();
    this.getOrderingPhysician();
    this.CheckValidDate();
    this.procedureRequestCount();
    this.getFacilitiesByuser();
    this.getpatientname();
    this.openAddUpdateform();
  }

  ngAfterViewInit() {
    this.triggerNumber.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('VisitNo').setValue('');
      }
    });

    this.triggerPatientName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('PatientName').setValue('');
      }
    });

    this.triggerPhysician.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.searchForm.get('Physician').setValue('');
      }
    });


  }
  //#endregion ngOnInit

  //#region get method
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

  getallProcedureRequest() {
    this.admissionService.GetAllProcedureReq().then((res) => {
      this.getAllProcedureReq = res;
      if (this.getAllProcedureReq != null && this.getAllProcedureReq.length > 0) {
        this.IsTableShow = true;
      } else {
        this.IsTableShow = false;
      }
    });
  }

  procedureRequestCount() {
    this.admissionService.getprocedureRequestCount().then(data => {
      this.AppointmenttotalCount = data;
      this.totalCount = this.AppointmenttotalCount.TodayProcedureRequestCount;
    });
  }

  getVisitNumberbySearch() {
    if (this.searchForm.get('VisitNo').value != null) {
      this.searchForm.get('VisitNo').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.getVisitNumberbySearch(key).then(data => {
                this.VisitNo = data;
              })
            }
            else {
              this.VisitNo = null;
            }
          }
        })
    }
  }

  getFacilitiesByuser() {
    this.admissionService.getFacility().then((res) => {
      this.facilityData = res;
    })
  }

  getpatientname() {
    if (this.searchForm.get('PatientName').value != null) {
      this.searchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.Getpatientname(key).then(data => {
                this.patientname = data;
              })
            }
            else {
              this.patientname = null;
              this.searchPatientId = 0;
            }
          }
        })
    }
  }
  //procedure physician
  setPatientID(number) {
    this.searchPatientId = number;
  }
  //physician
  setphysician(number) {
    this.physicianid = number;
  }
  getOrderingPhysician() {
    if (this.searchForm.get('Physician').value != null) {
      this.searchForm.get('Physician').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.GetOrderingphysician(key).then(data => {
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
  //#endregion get method

  CancelForm() {
    this.searchForm.reset();
    this.searchForm.get('FromDate').setValue(new Date());
    this.searchForm.get('ToDate').setValue(new Date());
    this.searchForm.get('Facility').setValue(0);
    this.admissionsearchmodel.FromDate = this.searchForm.get('FromDate').value;
    this.admissionsearchmodel.ToDate = this.searchForm.get('ToDate').value;
    this.admissionsearchmodel.PatientId = 0;
    this.admissionsearchmodel.ProviderId = 0;
    this.admissionsearchmodel.VisitNo = "";
    this.admissionsearchmodel.FacilityId = this.searchForm.get('Facility').value;

    this.admissionService.searchProcedureRequest(this.admissionsearchmodel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.IsTableShow = false;
        this.physicianid = 0;
        this.searchPatientId = 0;
        // this.admissionsearchmodel.SpecialityId = 0;

      }
      else {
        this.getAllProcedureReq = this.searchlist;
        this.IsTableShow = true;
        this.physicianid = 0;
        this.searchPatientId = 0;
        // this.admissionsearchmodel.SpecialityId = 0;

      }
    })
  }

  openAddUpdateform() {

    this.admissionsearchmodel.FromDate = this.searchForm.get('FromDate').value;
    this.admissionsearchmodel.ToDate = this.searchForm.get('ToDate').value;
    this.admissionsearchmodel.ProviderId = this.physicianid;
    this.admissionsearchmodel.FacilityId = this.searchForm.get('Facility').value;
    this.admissionsearchmodel.VisitNo = this.searchForm.get('VisitNo').value;
    this.admissionsearchmodel.PatientId = this.searchPatientId;
    this.admissionService.searchProcedureRequest(this.admissionsearchmodel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.IsTableShow = false;
      }
      else {
        this.getAllProcedureReq = this.searchlist;
        this.IsTableShow = true;
      }
    });
  }
  //#region view and edit function
  viewProcedureReq(data: any) {
    this.admissionService.GetProcedureReqbyId(data.Item.ProcedureRequestId).then(
      (res) => {
        var Details = res;
        let viewdetails = this.MatDialog.open(ViewProcedureConvertComponent, {
          data: Details,
          height: "auto",
          width: "2500px",
          autoFocus: false,
        });
      }
    );
  }

  editProcedureReq(element: any) {
    this.admissionService.GetProcedureReqbyId(element.Item.ProcedureRequestId).then(
      (res) => {
        var editRecord = res;
        let editDetails = this.MatDialog.open(EditProcedureConvertComponent, {
          data: editRecord,
          height: "auto",
          width: "2500px",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getallProcedureRequest();
          }
        });
      }
    );
  }
  //#endregion view and edit function
}
