import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NewPatientService } from "../../../patient/newPatient.service";

@Component({
  selector: "app-view-procedure-convert",
  templateUrl: "./view-procedure-convert.component.html",
  styleUrls: ["./view-procedure-convert.component.css"],
})
export class ViewProcedureConvertComponent implements OnInit {
  constructor(
    public newPatientService: NewPatientService,
    public dialogRef: MatDialogRef<ViewProcedureConvertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
        }
  dialogClose(): void {
    this.dialogRef.close();
  }
}
