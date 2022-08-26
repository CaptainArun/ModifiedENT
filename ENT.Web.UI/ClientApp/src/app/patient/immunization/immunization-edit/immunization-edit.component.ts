import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NewPatientService } from "../../newPatient.service";
import { immunizationModel } from "../../models/immunizationModel";
import { TableConfig } from "../../../ux/columnConfig";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-immunization-edit",
  templateUrl: "./immunization-edit.component.html",
  styleUrls: ["./immunization-edit.component.css"],
})
export class ImmunizationEditComponent implements OnInit {
  ImmunizationForm: FormGroup;
  ImmunModel: immunizationModel = new immunizationModel();
  tableConfig: TableConfig = new TableConfig();
  isVisible?: boolean;
  identify: any;
  tempArr: any[] = [];
  PatientId: number = 1;
  RecordedBy: any[] = [];
  facilityId: number = 0;
  recordedDuring: any = "";
  res: any;
  datesTime: any;
  recordDuring: any;
  visitID: any;
  datesTime2: Date;
  RouteIdvalue: any;
  BodySitevalue: any;
  constructor(
    private fb: FormBuilder,
    public newpatsvc: NewPatientService,
    private ImmunizationEditService: NewPatientService,
    private router: Router,
    public dialogRef: MatDialogRef<ImmunizationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilService
  ) {}
  ngOnInit() {
    this.getDataAndTime();
    this.ImmunizationForm = this.fb.group({
      ImmunizationID: [""],
      VisitID: [""],
      RecordedDate: ["", Validators.required],
      RecordedBy: ["", Validators.required],
      ImmunizationDate: ["", Validators.required],
      ImmunizationTime: [""],
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
      RecordedTime: [""],
      PatientName: [""],
      visitDateandTime: [""],
      recordedDuring: [""],
    });
    this.setImmunization();
    this.recordBy();
    this.getRouteIdvalue();
    this.getBodySitevalue();
    this.ImmunizationForm.get('visitDateandTime').disable();
    this.ImmunizationForm.get('recordedDuring').disable();
  }
  
  getRouteIdvalue(){
    this.ImmunizationEditService.getRoutevalue().then((res) => {
      this.RouteIdvalue=res; 
    });
  }
  getBodySitevalue(){
    this.ImmunizationEditService.getBodySitevalue().then((res) => {
      this.BodySitevalue=res; 
    });
  }
  //Date and time
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
  //Immunization time
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

    this.datesTime2 = ImmunizationDate;
  }
  //Set dat
  setImmunization() {
    this.ImmunizationForm.get("ImmunizationDate").setValue(
      new Date(this.data.ImmunizationDate)
    );
    this.ImmunizationForm.get("ImmunizationTime").setValue(new Date(this.data.ImmunizationDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));

    this.ImmunizationForm.get("ImmunizationID").setValue(
      this.data.ImmunizationID
    );
    this.ImmunizationForm.get("VisitID").setValue(this.data.VisitID);
    this.ImmunizationForm.get("RecordedDate").setValue(
      new Date(this.data.RecordedDate)
    );
    this.ImmunizationForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ImmunizationForm.get("RecordedBy").setValue(this.data.RecordedBy);
    this.ImmunizationForm.get("recordedDuring").setValue(
      this.data.recordedDuring
    );
    this.ImmunizationForm.get("InjectingPhysician").setValue(
      this.data.InjectingPhysician
    );
    this.ImmunizationForm.get("VaccineName").setValue(this.data.VaccineName);
    this.ImmunizationForm.get("ProductName").setValue(this.data.ProductName);
    this.ImmunizationForm.get("Manufacturer").setValue(this.data.Manufacturer);
    this.ImmunizationForm.get("BatchNo").setValue(this.data.BatchNo);
    this.ImmunizationForm.get("Route").setValue(this.data.Route);
    this.ImmunizationForm.get("FacilityName").setValue(this.data.FacilityName);
    this.ImmunizationForm.get("BodySite").setValue(this.data.BodySite);
    this.ImmunizationForm.get("DoseUnits").setValue(this.data.DoseUnits);
    this.ImmunizationForm.get("Notes").setValue(this.data.Notes);
    this.ImmunizationForm.get("PatientAge").setValue(this.data.PatientAge);
    this.ImmunizationForm.get("PatientName").setValue(this.data.PatientName);
    this.ImmunizationForm.get("visitDateandTime").setValue(
      this.data.visitDateandTime);

  
  }
  //submit
  updateImmunization() {
    if (this.ImmunizationForm.valid) {
      this.dateTime();
      this.ImmunizationdateTime();
      this.ImmunModel.ImmunizationID = this.data.ImmunizationID;
      this.ImmunModel.VisitID = this.data.VisitID;
      this.ImmunModel.RecordedDate = this.datesTime;
      this.ImmunModel.RecordedBy = this.ImmunizationForm.get("RecordedBy").value;
      this.ImmunModel.ImmunizationDate = this.datesTime2;
      this.ImmunModel.ImmunizationTime =
        this.ImmunizationForm.get("ImmunizationTime").value
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
      this.ImmunModel.PatientAge = this.ImmunizationForm.get("PatientAge").value;
      this.ImmunModel.Notes = this.ImmunizationForm.get("Notes").value;

      this.ImmunModel.RecordedTime =
        this.ImmunizationForm.get("RecordedTime").value;

      this.ImmunModel.visitDateandTime =
        this.ImmunizationForm.get("visitDateandTime").value;
      this.ImmunModel.recordedDuring = this.recordedDuring;


      this.ImmunizationEditService.AddUpdatePatientImmunizationData(
        this.ImmunModel
      ).then((res) => {
        if (res != null && res.ImmunizationID > 0) {
          this.util
            .showMessage(
              "",
              "Patient immunization saved successfully",
              BMSMessageBoxColorMode.Information,
              BMSMessageBoxMode.MessageBox
            )
            .then((res) => {
              this.dialogRef.close("updated");
            });
        }
      });

      this.dateTime();
      this.ImmunizationdateTime();
      this.dialogClose();
    }
  }
  //close
  dialogClose(): void {
    this.dialogRef.close();
  }
  //closeedit
  close() {
    this.ImmunizationForm.reset();
    this.setImmunization();
  }
  //record by
  recordBy() {
    this.ImmunizationEditService.GetProviderNames(this.facilityId).then(
      (res) => {
        this.RecordedBy = res;
      }
    );
  }
  //recoed during
  RecordedDuring(index: any) {
    this.newpatsvc
      .GetVisitsForPatient(this.newpatsvc.patientId)
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (i == index) {
            this.recordedDuring = data[i].recordedDuring;
            this.visitID = data[i].VisitId;
          }
        }
      });
  }
  //date and time
  getDataAndTime() {
    this.ImmunizationEditService.GetVisitsForPatient(
      this.newpatsvc.patientId
    ).then((res) => {
      for (let i = 0; i < res.length; i++) {
        this.tempArr[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    });
  }
}
