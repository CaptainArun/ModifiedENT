import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PatientROSModel } from "../../../triage/models/patientROSModel";
import { NewPatientService } from "../../newPatient.service";
import { TriageService } from "../../../triage/triage.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { physicalExamModel } from "../../models/physicalExamModel";

@Component({
  selector: "app-physical-exam-edit",
  templateUrl: "./physical-exam-edit.component.html",
  styleUrls: ["./physical-exam-edit.component.css"],
})
export class PhysicalExamEditComponent implements OnInit {
    phyExamForm: FormGroup;
    physicalExamModel: physicalExamModel = new physicalExamModel();
    visitDandt: any[] = [];
    recordedDuring: any = "";
    visitID: number;
    facilityId: number = 0;
    recordby: any[] = [];
      getDate: Date;
      getDateAndTime: Date;
      getTimeHH: number;
      getTimeMin: number;
  constructor(
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public triageSvc: TriageService,
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<PhysicalExamEditComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilService
  ) {}
  ngOnInit() {
    this.phyExamForm = this.fb.group({
        PhysicalExamID: [""],
        VisitID: [""],
        RecordedDate: [""],
        RecordedBy: [""],
        HeadValue: [""],
        HeadDesc: [""],
        EARValue: [""],
        EARDesc: [""],
        MouthValue: [""],
        MouthDesc: [""],
        ThroatValue: [""],
        ThroatDesc: [""],
        HairValue: [""],
        HairDesc: [""],
        NeckValue: [""],
        NeckDesc: [""],
        SpineValue: [""],
        SpineDesc: [""],
        SkinValue: [""],
        SkinDesc: [""],
        LegValue: [""],
        LegDesc: [""],
        SensationValue: [""],
        SensationDesc: [""],
        EyeValue: [""],
        EyeDesc: [""],
        NoseValue: [""],
        NoseDesc: [""],
        TeethValue: [""],
        TeethDesc: [""],
        ChestValue: [""],
        ChestDesc: [""],
        ThoraxValue: [""],
        ThoraxDesc: [""],
        AbdomenValue: [""],
        AbdomenDesc: [""],
        PelvisValue: [""],
        PelvisDesc: [""],
        NailsValue: [""],
        NailsDesc: [""],
        FootValue: [""],
        FootDesc: [""],
        HandValue: [""],
        HandDesc: [""],
        Createddate: [""],
        CreatedBy: [""],
        DateTime: [""],
        ModifiedBy: [""],
        RecordedTime: [""],
        visitDateandTime: [""],
        RecordedDuring: [""],
        RecordedByphy:[""],
      });
      this.getProviderNames();
      this.getVisitForPatient();
      this.setvalues();
      this.phyExamForm.get("visitDateandTime").disable();
      this.phyExamForm.get("RecordedDuring").disable();

  }
  dialogClose(): void {
    this.dialogRef.close();
  }
  getProviderNames() {
    this.newpatsvc.GetProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }
  getVisitForPatient() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
      }
    });
  }
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

  cancelForm() {
    this.phyExamForm.reset();
    this.setvalues();
  }
  setvalues() {
    this.phyExamForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));
    this.phyExamForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
     
    this.phyExamForm.get("RecordedDuring").setValue(this.data.recordedDuring);

    this.phyExamForm.get("RecordedByphy").setValue(this.data.RecordedBy);
    this.phyExamForm
      .get("visitDateandTime")
      .setValue(this.data.visitDateandTime);
    this.phyExamForm.get("HeadValue").setValue(this.data.HeadValue);
    this.phyExamForm.get("HeadDesc").setValue(this.data.HeadDesc);
    this.phyExamForm.get("EARValue").setValue(this.data.EARValue);
    this.phyExamForm.get("EARDesc").setValue(this.data.EARDesc);
    this.phyExamForm.get("MouthValue").setValue(this.data.MouthValue);
    this.phyExamForm.get("MouthDesc").setValue(this.data.MouthDesc);
    this.phyExamForm.get("ThroatValue").setValue(this.data.ThroatValue);
    this.phyExamForm.get("ThroatDesc").setValue(this.data.ThroatDesc);
    this.phyExamForm.get("HairValue").setValue(this.data.HairValue);
    this.phyExamForm.get("HairDesc").setValue(this.data.HairDesc);
    this.phyExamForm.get("NeckValue").setValue(this.data.NeckValue);
    this.phyExamForm.get("NeckDesc").setValue(this.data.NeckDesc);
    this.phyExamForm.get("SpineValue").setValue(this.data.SpineValue);
    this.phyExamForm.get("SpineDesc").setValue(this.data.SpineDesc);
    this.phyExamForm.get("SkinValue").setValue(this.data.SkinValue);
    this.phyExamForm.get("SkinDesc").setValue(this.data.SkinDesc);
    this.phyExamForm.get("LegValue").setValue(this.data.LegValue);
    this.phyExamForm.get("LegDesc").setValue(this.data.LegDesc);
    this.phyExamForm.get("SensationValue").setValue(this.data.SensationValue);
    this.phyExamForm.get("SensationDesc").setValue(this.data.SensationDesc);
    this.phyExamForm.get("EyeValue").setValue(this.data.EyeValue);
    this.phyExamForm.get("EyeDesc").setValue(this.data.EyeDesc);
    this.phyExamForm.get("NoseValue").setValue(this.data.NoseValue);
    this.phyExamForm.get("NoseDesc").setValue(this.data.NoseDesc);
    this.phyExamForm.get("TeethValue").setValue(this.data.TeethValue);
    this.phyExamForm.get("TeethDesc").setValue(this.data.TeethDesc);
    this.phyExamForm.get("ChestValue").setValue(this.data.ChestValue);
    this.phyExamForm.get("ChestDesc").setValue(this.data.ChestDesc);
    this.phyExamForm.get("ThoraxValue").setValue(this.data.ThoraxValue);
    this.phyExamForm.get("ThoraxDesc").setValue(this.data.ThoraxDesc);
    this.phyExamForm.get("AbdomenValue").setValue(this.data.AbdomenValue);
    this.phyExamForm.get("AbdomenDesc").setValue(this.data.AbdomenDesc);
    this.phyExamForm.get("PelvisValue").setValue(this.data.PelvisValue);
    this.phyExamForm.get("PelvisDesc").setValue(this.data.PelvisDesc);
    this.phyExamForm.get("NailsValue").setValue(this.data.NailsValue);
    this.phyExamForm.get("NailsDesc").setValue(this.data.NailsDesc);
    this.phyExamForm.get("FootValue").setValue(this.data.FootValue);
    this.phyExamForm.get("FootDesc").setValue(this.data.FootDesc);
    this.phyExamForm.get("HandValue").setValue(this.data.HandValue);
    this.phyExamForm.get("HandDesc").setValue(this.data.HandDesc);
  }
  getData() {
    this. sendDateWithTime() ;
  if (this.phyExamForm.valid) {
    this.physicalExamModel.PhysicalExamID = this.data.PhysicalExamID;
    this.physicalExamModel.VisitID = this.visitID;
    this.physicalExamModel. RecordedTime=this.phyExamForm.get("RecordedTime").value;
    this.physicalExamModel. visitDateandTime=this.phyExamForm.get("visitDateandTime").value;
    this.physicalExamModel.RecordedBy=this.phyExamForm.get("RecordedByphy").value;
    this.physicalExamModel. RecordedDuring=this.recordedDuring;
    this.physicalExamModel.RecordedDate= this.getDateAndTime;
    this.physicalExamModel.HeadValue = this.phyExamForm.get("HeadValue").value;
    this.physicalExamModel.HeadDesc = this.phyExamForm.get("HeadDesc").value;
    this.physicalExamModel.EARValue = this.phyExamForm.get("EARValue").value;
    this.physicalExamModel.EARDesc = this.phyExamForm.get("EARDesc").value;
    this.physicalExamModel.MouthValue = this.phyExamForm.get("MouthValue").value;
    this.physicalExamModel.MouthDesc = this.phyExamForm.get("MouthDesc").value;
    this.physicalExamModel.ThroatValue = this.phyExamForm.get("ThroatValue").value;
    this.physicalExamModel.ThroatDesc = this.phyExamForm.get("ThroatDesc").value;
    this.physicalExamModel.HairDesc = this.phyExamForm.get("HairDesc").value;
    this.physicalExamModel.NeckValue = this.phyExamForm.get("NeckValue").value;
    this.physicalExamModel.NeckDesc = this.phyExamForm.get("NeckDesc").value;
    this.physicalExamModel.SpineValue = this.phyExamForm.get("SpineValue").value;
    this.physicalExamModel.SpineDesc = this.phyExamForm.get("SpineDesc").value;
    this.physicalExamModel.SkinValue = this.phyExamForm.get("SkinValue").value;
    this.physicalExamModel.SkinDesc = this.phyExamForm.get("SkinDesc").value;
    this.physicalExamModel.LegValue = this.phyExamForm.get("LegValue").value;
    this.physicalExamModel.LegDesc = this.phyExamForm.get("LegDesc").value;
    this.physicalExamModel.SensationValue = this.phyExamForm.get("SensationValue").value;
    this.physicalExamModel.SensationDesc = this.phyExamForm.get("SensationDesc").value;
    this.physicalExamModel.EyeValue = this.phyExamForm.get("EyeValue").value;
    this.physicalExamModel.EyeDesc = this.phyExamForm.get("EyeDesc").value;
    this.physicalExamModel.NoseValue = this.phyExamForm.get("NoseValue").value;
    this.physicalExamModel.NoseDesc = this.phyExamForm.get("NoseDesc").value;
    this.physicalExamModel.TeethValue = this.phyExamForm.get("TeethValue").value;
    this.physicalExamModel.TeethDesc = this.phyExamForm.get("TeethDesc").value;
    this.physicalExamModel.ChestValue = this.phyExamForm.get("ChestValue").value;
    this.physicalExamModel.ChestDesc = this.phyExamForm.get("ChestDesc").value;
    this.physicalExamModel.ThoraxValue = this.phyExamForm.get("ThoraxValue").value;
    this.physicalExamModel.ThoraxDesc = this.phyExamForm.get("ThoraxDesc").value;
    this.physicalExamModel.AbdomenValue = this.phyExamForm.get("AbdomenValue").value;
    this.physicalExamModel.AbdomenDesc = this.phyExamForm.get("AbdomenDesc").value;
    this.physicalExamModel.PelvisValue = this.phyExamForm.get("PelvisValue").value;
    this.physicalExamModel.PelvisDesc = this.phyExamForm.get("PelvisDesc").value;
    this.physicalExamModel.NailsValue = this.phyExamForm.get("NailsValue").value;
    this.physicalExamModel.NailsDesc = this.phyExamForm.get("NailsDesc").value;
    this.physicalExamModel.FootValue = this.phyExamForm.get("FootValue").value;
    this.physicalExamModel.FootDesc = this.phyExamForm.get("FootDesc").value;
    this.physicalExamModel.HandValue = this.phyExamForm.get("HandValue").value;
    this.physicalExamModel.HandDesc = this.phyExamForm.get("HandDesc").value;
    this.physicalExamModel.HairValue = this.phyExamForm.get("HairValue").value;
  }
  this.triageSvc. addUpdatephysicalexamForVisit(this.physicalExamModel).then((res) => {
          this.util
        .showMessage(
          "",
          "Physical exam details Saved successfully",
          BMSMessageBoxColorMode.Information,
          BMSMessageBoxMode.MessageBox
        )
        .then((res) => {});
      this.dialogRef.close("update");
    });  
}
sendDateWithTime() {
  this.getDate = new Date(this.phyExamForm.get("RecordedDate").value);
  if (this.phyExamForm.get("RecordedDate").value != "") {
    if (
      this.phyExamForm
        .get("RecordedTime")
        .value.toString()
        .toLowerCase()
        .split(" ")[1] == "pm"
    ) {
      if (
        parseInt(
          this.phyExamForm
            .get("RecordedTime")
            .value.toString()
            .split(" ")[0]
            .toString()
            .split(":")[0]
        ) == 12
      ) {
        this.getTimeHH = 12;
      } else {
        this.getTimeHH =
          parseInt(
            this.phyExamForm
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) + 12;
      }
    } else if (
      this.phyExamForm
        .get("RecordedTime")
        .value.toString()
        .toLowerCase()
        .split(" ")[1] == "am"
    ) {
      if (
        parseInt(
          this.phyExamForm
            .get("RecordedTime")
            .value.toString()
            .split(" ")[0]
            .toString()
            .split(":")[0]
        ) == 12
      ) {
        this.getTimeHH = 0;
      } else {
        this.getTimeHH = parseInt(
          this.phyExamForm
            .get("RecordedTime")
            .value.toString()
            .split(" ")[0]
            .toString()
            .split(":")[0]
        );
      }
    }
    this.getTimeMin = parseInt(
      this.phyExamForm
        .get("RecordedTime")
        .value.toString()
        .split(" ")[0]
        .toString()
        .split(":")[1]
    );
    this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
  }
  this.getDateAndTime = this.getDate;
}
}
