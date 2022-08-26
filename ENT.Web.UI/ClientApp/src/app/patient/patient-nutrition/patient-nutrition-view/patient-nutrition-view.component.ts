import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-patient-nutrition-view",
  templateUrl: "./patient-nutrition-view.component.html",
  styleUrls: ["./patient-nutrition-view.component.css"],
})
export class PatientNutritionViewComponent implements OnInit {
  PatNutriForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PatientNutritionViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any

  ) { }
  ngOnInit() {
    this.PatNutriForm = this.fb.group({
      RecordedDate: [""],
      RecordedBy: [""],
      recordedDuring: [""],
      RecordedTime: [""],
      visitDateandTime: [""],
    });
    this.PatNutriForm.disable();
    this.setNutriView();
  }

  setNutriView() {
    this.PatNutriForm.get("RecordedDate").setValue(
      new Date(this.data1.RecordedDate)
    );
    this.PatNutriForm.get("RecordedTime").setValue(
      new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'})
    );
    this.PatNutriForm.get("RecordedBy").setValue(this.data1.RecordedBy);
    this.PatNutriForm.get("visitDateandTime").setValue(
      this.data1.visitDateandTime
    );
    this.PatNutriForm.get("recordedDuring").setValue(this.data1.recordedDuring);
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
