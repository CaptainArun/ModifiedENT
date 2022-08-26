import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { immunizationModel } from "../../models/immunizationModel";
import { TableConfig } from "../../../ux/columnConfig";
import { MatDialog } from "@angular/material";
import { NewPatientService } from "../../newPatient.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "app-add-immunization",
  templateUrl: "./add-immunization.component.html",
  styleUrls: ["./add-immunization.component.css"],
})
export class AddImmunizationComponent implements OnInit {
  ImmunizationForm: FormGroup;
  ImmunModel: immunizationModel = new immunizationModel();
  tableConfig: TableConfig = new TableConfig();
  isVisible?: boolean;
  identify: any;
  ImmunizationdatesTime: any;
  tempArr: any[] = [];
  RecordedBy: any[] = [];
  facilityId: number = 0;
  recordDuring: any = "";
  res: any;
  datesTime: any;
  Popupdata: any;
  visit: any;
  visitID: any;
  recordedDuring: any = "";
  RouteIdvalue: any;
  BodySitevalue: any;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private ImmunizationService: NewPatientService,
    public customhttp: CustomHttpService,
    public dialogRef: MatDialogRef<AddImmunizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any,
    private util: UtilService
  ) { }
  ngOnInit() {
    this.ImmunizationForm = this.fb.group({
      ImmunizationID: [""],
      VisitID: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ["", Validators.required],
      ImmunizationDate: ["", Validators.required],
      ImmunizationTime: ["", Validators.required],
      InjectingPhysician: ["", Validators.required],
      VaccineName: ["", Validators.required],
      ProductName: [""],
      Manufacturer: [""],
      BatchNo: [""],
      Route: ["", Validators.required],
      BodySite: ["", Validators.required],
      DoseUnits: [""],
      FacilityName: ["", Validators.required],
      PatientAge: ["", Validators.required],
      Notes: [""],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      PatientName: [""],
      visitDateandTime: ["", Validators.required],
      recordedDuring: ["", Validators.required],
    });
    this.customhttp.getDbName(localStorage.getItem("DatabaseName"));
    this.getDataAndTime();
    this.recordBy();
    this.getRouteIdvalue();
    this.getBodySitevalue();
    this.GetPatientImmunizationList();
  }
  getRouteIdvalue() {
    this.ImmunizationService.getRoutevalue().then((res) => {
      this.RouteIdvalue = res;

    });
  }
  getBodySitevalue() {
    this.ImmunizationService.getBodySitevalue().then((res) => {
      this.BodySitevalue = res;
    });
  }


  //Submit
  submitData() {
    if (this.ImmunizationForm.valid) {
      this.dateTime();
      this.ImmunizationdateTime();
      this.ImmunModel.VisitID = this.visit;
      this.ImmunModel.RecordedDate = this.datesTime;
      this.ImmunModel.RecordedBy =
        this.ImmunizationForm.get("RecordedBy").value;
      this.ImmunModel.ImmunizationDate = this.ImmunizationdatesTime;
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
      this.ImmunModel.visitDateandTime =
        this.ImmunizationForm.get("visitDateandTime").value;
      this.ImmunModel.recordedDuring = this.recordedDuring;
      this.ImmunizationService.AddUpdatePatientImmunizationData(
        this.ImmunModel
      ).then((data) => {
        this.util
          .showMessage(
            "",
            "Patient immunization saved successfully",
            BMSMessageBoxColorMode.Information,
            BMSMessageBoxMode.MessageBox
          )
          .then((res) => {
            this.dialogRef.close("Update");
          });
      });
    }
  }

  //Record By
  recordBy() {
    this.ImmunizationService.GetProviderNames(this.facilityId).then((res) => {
      this.RecordedBy = res;
    });
  }
  //visit Date and Time
  getDataAndTime() {
    this.ImmunizationService.GetVisitsForPatient(
      this.ImmunizationService.patientId
    ).then((res) => {
      for (let i = 0; i < res.length; i++) {
        this.tempArr[i] = res[i].VisitDateandTime;
        this.visit = res[i].VisitId;
      }
    });
  }

  //patient immunization
  GetPatientImmunizationList() {
    this.ImmunizationService.GetPatientImmunizationList(this.ImmunizationService.patientId).then(
      (res) => {
        this.identify = res;
      }
    );
  }
  //Date and Time
  dateTime() {
    var RecordedDate: Date;
    var RecordedTimeHH: number;
    var RecordedTimemin: number;
    RecordedDate = new Date(this.ImmunizationForm.get("RecordedDate").value);

    if (this.ImmunizationForm.get("RecordedDate").value != "") {
      if (
        this.ImmunizationForm.get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "pm"
      ) {
        if (
          parseInt(
            this.ImmunizationForm.get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          RecordedTimeHH = 12;
        } else {
          RecordedTimeHH =
            parseInt(
              this.ImmunizationForm.get("RecordedTime")
                .value.toString()
                .split(" ")[0]
                .toString()
                .split(":")[0]
            ) + 12;
        }
      } else if (
        this.ImmunizationForm.get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.ImmunizationForm.get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          RecordedTimeHH = 0;
        } else {
          RecordedTimeHH = parseInt(
            this.ImmunizationForm.get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          );
        }
      }
      RecordedTimemin = parseInt(
        this.ImmunizationForm.get("RecordedTime")
          .value.toString()
          .split(" ")[0]
          .toString()
          .split(":")[1]
      );
      RecordedDate.setHours(RecordedTimeHH, RecordedTimemin, 0, 0);
    }

    this.datesTime = RecordedDate;
  }
  //Immunixation date and time
  ImmunizationdateTime() {
    var ImmunizationDate: Date;
    var ImmunizationTimeHH: number;
    var ImmunizationTimemin: number;
    ImmunizationDate = new Date(
      this.ImmunizationForm.get("ImmunizationDate").value
    );

    if (this.ImmunizationForm.get("ImmunizationDate").value != "") {
      if (
        this.ImmunizationForm.get("ImmunizationTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "pm"
      ) {
        if (
          parseInt(
            this.ImmunizationForm.get("ImmunizationTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          ImmunizationTimeHH = 12;
        } else {
          ImmunizationTimeHH =
            parseInt(
              this.ImmunizationForm.get("ImmunizationTime")
                .value.toString()
                .split(" ")[0]
                .toString()
                .split(":")[0]
            ) + 12;
        }
      } else if (
        this.ImmunizationForm.get("ImmunizationTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.ImmunizationForm.get("ImmunizationTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          ImmunizationTimeHH = 0;
        } else {
          ImmunizationTimeHH = parseInt(
            this.ImmunizationForm.get("ImmunizationTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          );
        }
      }
      ImmunizationTimemin = parseInt(
        this.ImmunizationForm.get("ImmunizationTime")
          .value.toString()
          .split(" ")[0]
          .toString()
          .split(":")[1]
      );
      ImmunizationDate.setHours(ImmunizationTimeHH, ImmunizationTimemin, 0, 0);
    }

    this.ImmunizationdatesTime = ImmunizationDate;
  }
  //Cancel data
  CancelData() {
    this.ImmunizationForm.reset();
    this.ImmunizationForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ImmunizationForm.get('RecordedDate').setValue(new Date());

    this.recordedDuring = "";

  }
  //Record during
  RecordedDuring(index: any) {
    this.ImmunizationService.GetVisitsForPatient(
      this.ImmunizationService.patientId
    ).then((data) => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].visitID;
          this.ImmunizationForm.get("recordedDuring").setValue(this.recordedDuring);
        }
      }
    });
  }
  //close
  dialogClose(): void {
    this.dialogRef.close();
  }
}
