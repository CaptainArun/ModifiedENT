import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomHttpService } from "../../../core/custom-http.service";
import { TriageService } from "../../../triage/triage.service";
import { NewPatientService } from "../../newPatient.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { physicalExamModel } from "../../models/physicalExamModel";

@Component({
  selector: "app-physical-exam-view",
  templateUrl: "./physical-exam-view.component.html",
  styleUrls: ["./physical-exam-view.component.css"],
})
export class PhysicalExamViewComponent implements OnInit {
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
  RecordedDuring: any;
  constructor(
    public customHttpSvc: CustomHttpService,
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public dialogRef: MatDialogRef<PhysicalExamViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public triageSvc: TriageService
  ) {
  }
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
      RecordedByphy: [""],
    });
    this.setvalues();
    this.getProviderNames();
    this.getVisitForPatient();
    this.phyExamForm.disable();
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
  setvalues() {
    this.phyExamForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));
    this.phyExamForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.phyExamForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));

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
  dialogClose(): void {
    this.dialogRef.close();
  }
}
