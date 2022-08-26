import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-view-allergies",
  templateUrl: "./view-allergies.component.html",
  styleUrls: ["./view-allergies.component.css"],
})
export class ViewAllergiesComponent implements OnInit {
  allergiesViewForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<ViewAllergiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.allergiesViewForm = this.fb.group({
      visitDateandTime: [""],
      RecordedDate: ["", Validators.required],
      RecordedTime: ["", Validators.required],
      recordedDuring: [""],
      RecordedBy: [""],
    });
    this.allergiesViewForm.disable();
    this.setValues();
  }

  setValues() {
    this.allergiesViewForm
      .get("visitDateandTime")
      .setValue(this.data.visitDateandTime);
    this.allergiesViewForm
      .get("RecordedDate")
      .setValue(new Date(this.data.RecordedDate));
    this.allergiesViewForm.get("RecordedBy").setValue(this.data.RecordedBy);
    this.allergiesViewForm
      .get("RecordedTime")
      .setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.allergiesViewForm
      .get("recordedDuring")
      .setValue(this.data.recordedDuring);
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
