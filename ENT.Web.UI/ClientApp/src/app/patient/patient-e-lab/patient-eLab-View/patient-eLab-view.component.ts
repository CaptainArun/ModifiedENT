import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "src/app/core/custom-http.service";
import { eLabService } from "src/app/e-lab/eLab.service";

@Component({
  selector: "app-PatienteLabViewComponent",
  templateUrl: "./patient-eLab-view.component.html",
  styleUrls: ["./patient-eLab-view.component.css"],
})
export class patienteLabViewComponent implements OnInit {

  //#region Property Declaration
  eLabOrderForm: FormGroup;
  visitDateandtimeView: any = "";
  PhysicianNameView: any = "";
  OrderNumber: any = "";
  //#endregion Property Declaration

  //#region constructor
  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<patienteLabViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService,
    public eLabService: eLabService
  ) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.eLabOrderForm = this.fb.group({
      eLab: this.fb.array([this.eLabOrder()]),
    });
    this.ViewSetValues();
  }
  //#endregion ngOnInit

  //#region eLabOrder dynamic controls
  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: [""],
      UrgencyView: [""],
      DateView: [""],
      Notes: [""],
    });
  }

  get eLabOrderDynamic() {
    return <FormArray>this.eLabOrderForm.get("eLab");
  }
  //#endregion eLabOrder dynamic controls

  //#region View Set Values
  ViewSetValues() {
    this.visitDateandtimeView = this.data.visitDateandTime;
    this.PhysicianNameView = this.data.physicianName;
    this.OrderNumber = this.data.LabOrderNo;
    for (let i = 0; i < this.data.labOrderItems.length; i++) {
      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>this.eLabOrderForm.controls["eLab"];
      form.controls[i].get("TestName").setValue(this.data.labOrderItems[i].setupMasterDesc);
      form.controls[i].get("UrgencyView").setValue(this.data.labOrderItems[i].urgencyDescription);
      form.controls[i].get("DateView").setValue(new Date(this.data.labOrderItems[i].LabOnDate).toLocaleDateString()
      );
      form.controls[i].get("Notes").setValue(this.data.labOrderItems[i].LabNotes);

      this.eLabOrderDynamic.removeAt(this.data.labOrderItems.length);
    }
  }
  //#endregion View Set Values

  //#region Close the form
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion Close the form
}
