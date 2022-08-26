import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewPatientService } from "../newPatient.service";
import { CustomHttpService } from "../../core/custom-http.service";
import { immunizationModel } from "../models/immunizationModel";
import { TableConfig } from "../../ux/columnConfig";
import { MatDialog } from "@angular/material";
import { ImmunizationViewComponent } from "./immunization-view/immunization-view.component";
import { ImmunizationEditComponent } from "./immunization-edit/immunization-edit.component";
import { AddImmunizationComponent } from "./add-immunization/add-immunization.component";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "app-immunization",
  templateUrl: "./immunization.component.html",
  styleUrls: ["./immunization.component.css"],
})
export class ImmunizationComponent implements OnInit {
  ImmunizationForm: FormGroup;
  ImmunModel: immunizationModel = new immunizationModel();
  tableConfig: TableConfig = new TableConfig();
  isVisible?: boolean;
  identify: any;
  tempArr: any[] = [];
  patientId: number;
  RecordedBy: any[] = [];
  facilityId: number = 0;
  recordDuring: any;
  res: any;
  datesTime: any;
  Popupdata: any;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private ImmunizationService: NewPatientService,
    public customhttp: CustomHttpService,
    public activateRoute: ActivatedRoute,
    private config: UtilService
  ) {
    this.tableConfig.showPagination = false;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      {
        PropertyName: "visitDateandTime",
        DisplayName: "visit Date and Time",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "ImmunizationDate",
        DisplayName: "Immunization date",
        DisplayMode: "DateTime",
        FormatString: "dd-MM-yyyy",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "ImmunizationDate",
        DisplayName: "Immunization time",
        DisplayMode: "DateTime",
        FormatString: "hh-mm",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "InjectingPhysician",
        DisplayName: "Injecting Physician",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "VaccineName",
        DisplayName: "Vaccine Name",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "Route",
        DisplayName: "Route",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "BodySite",
        DisplayName: "Body Site",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "DoseUnits",
        DisplayName: "Dose & Units",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "PatientAge",
        DisplayName: "Patient Age",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },  
    ];
  }
  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.ImmunizationService.patientId = this.patientId;
    });
    this.GetPatientImmunizationList();
  }
  //Submit data
  submitData() {
    if (this.ImmunizationForm.valid) {
      this.ImmunModel.VisitID = 1;
      this.ImmunModel.RecordedDate =
        this.ImmunizationForm.get("RecordedDate").value;
      this.ImmunModel.RecordedBy =
        this.ImmunizationForm.get("RecordedBy").value;
      this.ImmunModel.ImmunizationDate =
        this.ImmunizationForm.get("ImmunizationDate").value;
      this.ImmunModel.ImmunizationTime =
        this.ImmunizationForm.get("ImmunizationTime").value;
      this.ImmunModel.InjectingPhysician =
        this.ImmunizationForm.get("InjectingPhysician").value;
      this.ImmunModel.VaccineName =
        this.ImmunizationForm.get("VaccineName").value;
      this.ImmunModel.ProductName =
        this.ImmunizationForm.get("ProductName").value;
      this.ImmunModel.Manufacturer =
        this.ImmunizationForm.get("Manufacturer").value;
      this.ImmunModel.BatchNo = this.ImmunizationForm.get("BatchNo").value;
      this.ImmunModel.Route = this.ImmunizationForm.get("Route").value;
      this.ImmunModel.BodySite = this.ImmunizationForm.get("BodySite").value;
      this.ImmunModel.DoseUnits = this.ImmunizationForm.get("DoseUnits").value;
      this.ImmunModel.FacilityName =
        this.ImmunizationForm.get("FacilityName").value;
      this.ImmunModel.PatientAge =
        this.ImmunizationForm.get("PatientAge").value;
      this.ImmunModel.Notes = this.ImmunizationForm.get("Notes").value;
      this.ImmunModel.RecordedTime =
        this.ImmunizationForm.get("RecordedTime").value;
      this.ImmunModel.visitDateandTime =
        this.ImmunizationForm.get("visitDateandTime").value;
      this.ImmunModel.recordedDuring =
        this.ImmunizationForm.get("recordedDuring").value;
      this.ImmunizationService.AddUpdatePatientImmunizationData(
        this.ImmunModel
      ).then((data) => {
        this.GetPatientImmunizationList();
      });
    }
  }
  //Get data
  GetPatientImmunizationList() {
    this.ImmunizationService.GetPatientImmunizationList(
      this.ImmunizationService.patientId
    ).then((res) => {
      this.identify = res;
      
    });
  }
  //View Record
  ImmunizationViewRecord(element: any) {
    this.ImmunizationService.GetPatientImmunizationRecordbyID(
      element.Item.ImmunizationID
    ).then((data) => {
      let ImmunizationView = data;
      const dialogRef = this.dialog.open(ImmunizationViewComponent, {
        data: ImmunizationView,
        height: "auto",
        width: "auto",
        autoFocus: true,
      });
    });
  }
  //Edit Record
  ImmunizationEditRecord(element: any) {
    this.ImmunizationService.GetPatientImmunizationRecordbyID(
      element.Item.ImmunizationID
    ).then((data) => {
      let ImmunizationEdit = data;
      const dialogRef = this.dialog.open(ImmunizationEditComponent, {
        data: ImmunizationEdit,
        height: "auto",
        width: "auto",
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.Popupdata = result;
        if (this.Popupdata == "updated") {
          this.GetPatientImmunizationList();
          
    this.customhttp.getDbName(localStorage.getItem("DatabaseName"));
        }
      });
    });
  }
  //Delete record
  DeletePatientImmunizationRecord(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",
        BMSMessageBoxColorMode.Information,
        BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.ImmunizationService.DeletePatientImmunizationRecord(
            element.Item.ImmunizationID
          ).then((data) => {
            this.GetPatientImmunizationList();
          });
        }
      });
  }

  //Add data
  AddImmunization() {
    const dialogRef = this.dialog.open(AddImmunizationComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "Update") {
        this.GetPatientImmunizationList();
      }
    });
  }
}
