import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NewPatientService } from "../../newPatient.service";

@Component({
  selector: "app-immunization-view",
  templateUrl: "./immunization-view.component.html",
  styleUrls: ["./immunization-view.component.css"],
})
export class ImmunizationViewComponent implements OnInit {
  immunization: FormGroup;
  visitDandt: any[] = [];
  visitID: any;
  constructor(
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public dialogRef: MatDialogRef<ImmunizationViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.immunization = this.fb.group({
      visitDateandTime: [""],
      RecordedDate: [""],
      RecordedBy: [""],
      RecordedTime: [""],
      recordedDuring: [""],
    });
    this.immunization.disable();
    this.setImmunizationView();
    this.getVisitForPatient();
  }
  //set data
  setImmunizationView() {
    this.immunization
      .get("visitDateandTime")
      .setValue(this.data.visitDateandTime);
    this.immunization
      .get("RecordedDate")
      .setValue(new Date(this.data.RecordedDate));
    this.immunization
      .get("RecordedTime")
      .setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.immunization.get("recordedDuring").setValue(this.data.recordedDuring);
    this.immunization.get("RecordedBy").setValue(this.data.RecordedBy);
  }
  //close
  dialogClose(): void {
    this.dialogRef.close();
  }
  //visit date and time
  getVisitForPatient() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    });
  }
}
