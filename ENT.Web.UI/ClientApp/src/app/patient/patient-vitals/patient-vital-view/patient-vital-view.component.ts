import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-patient-vital-view",
  templateUrl: "./patient-vital-view.component.html",
  styleUrls: ["./patient-vital-view.component.css"],
})
export class PatientVitalViewComponent implements OnInit {
  patientVitalsViewForm: FormGroup;
  IsBloodPressure: string;
  IsDiabetic: string;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PatientVitalViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any
  ) { }

  ngOnInit() {
    this.patientVitalsViewForm = this.fb.group({
      RecordedDate: ["", Validators.required],
      RecordedBy: ["", Validators.required],
      RecordedTime: [""],
      visitDateandTime: ["", Validators.required],
      recordedDuring: ["", Validators.required],
    });
    this.patientVitalsViewForm.disable();
    this.setVitalsView();

    if (this.data1.IsBloodPressure == "y") {
      this.IsBloodPressure = "YES";
    } else if(this.data1.IsBloodPressure == "n") {
      this.IsBloodPressure = "NO";
    }else{
      this.IsBloodPressure = "Unknown"
    }

    if (this.data1.IsDiabetic=="y") {
      this.IsDiabetic = "YES";
    } else if(this.data1.IsDiabetic=="n") {
      this.IsDiabetic = "NO";
    }else{
      this.IsDiabetic = "Unknown";
    }
    
  }
  setVitalsView() {
    this.patientVitalsViewForm
      .get("RecordedTime")
      .setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.patientVitalsViewForm
      .get("RecordedDate")
      .setValue(new Date(this.data1.RecordedDate));
    this.patientVitalsViewForm
      .get("RecordedBy")
      .setValue(this.data1.RecordedBy);
    this.patientVitalsViewForm
      .get("visitDateandTime")
      .setValue(this.data1.visitDateandTime);
    this.patientVitalsViewForm
      .get("recordedDuring")
      .setValue(this.data1.recordedDuring);
  }
  dialogClose(): void {
    this.dialogRef.close();
  }
}
