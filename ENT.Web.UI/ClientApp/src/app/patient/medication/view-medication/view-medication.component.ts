import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomHttpService } from "src/app/core/custom-http.service";
import { TriageService } from "src/app/triage/triage.service";

@Component({
  selector: "app-view-medication",
  templateUrl: "./view-medication.component.html",
  styleUrls: ["./view-medication.component.css"],
})
export class ViewMedicationComponent implements OnInit {
  //#region "Property Declaration"
  ePrescriptionForm: FormGroup;
  routeName: any;
  setValue: any;
  //#endregion "Property Declaration"

  //#region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewMedicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public customHttp: CustomHttpService, public triageSvc: TriageService) { }

  //#endregion "constructor"

  //#region "ngOnInit"
  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.ePrescriptionForm = this.fb.group({
      ItemDrugName: ['', Validators.required],
      Route: [null, Validators.required],
      routeTooltip: [''],
      Diagnosis: ['', Validators.required],
      Qty: ['', Validators.required],
      Days: ['', Validators.required],
      Morning: [false, ''],
      Brunch: [false, ''],
      Noon: [false, ''],
      Evening: [false, ''],
      Night: [false, ''],
      Before: [false, ''],
      After: [false, ''],
      MedicationStatus: ['', Validators.required],
      SIG: ['']
    });
    this.bindRoute();
  }
  //#endregion "ngOnInit"

  //#region "Get Values"
  bindRoute() {
    this.triageSvc.getRoute().then(res => {
      this.routeName = res;
      if (this.data) {
        this.setValue = this.data;
        this.setePrescriptionData();
      }
    });
  }

  //#endregion "Get Values"

  //#region "Set Form Values"
  setePrescriptionData() {
    this.ePrescriptionForm.get('ItemDrugName').setValue(this.data.DrugName);
    this.ePrescriptionForm.get('Route').setValue(this.data.MedicationRouteCode);
    this.ePrescriptionForm.get('Diagnosis').setValue(this.data.ICDCode);
    this.ePrescriptionForm.get('Qty').setValue(this.data.TotalQuantity);
    this.ePrescriptionForm.get('Days').setValue(this.data.NoOfDays);
    this.ePrescriptionForm.get('Morning').setValue(this.data.Morning);
    this.ePrescriptionForm.get('Brunch').setValue(this.data.Brunch);
    this.ePrescriptionForm.get('Noon').setValue(this.data.Noon);
    this.ePrescriptionForm.get('Evening').setValue(this.data.Evening);
    this.ePrescriptionForm.get('Night').setValue(this.data.Night);
    this.ePrescriptionForm.get('Before').setValue(this.data.Before);
    this.ePrescriptionForm.get('After').setValue(this.data.After);
    this.ePrescriptionForm.get('SIG').setValue(this.data.SIG);
    if (this.data.Start == true) {
      this.ePrescriptionForm.get('MedicationStatus').setValue("start");
    }
    if (this.data.Hold == true) {
      this.ePrescriptionForm.get('MedicationStatus').setValue("hold");
    }
    if (this.data.Continued == true) {
      this.ePrescriptionForm.get('MedicationStatus').setValue("continue");
    }
    if (this.data.DisContinue == true) {
      this.ePrescriptionForm.get('MedicationStatus').setValue("discontinue");
    }
    for (const option of this.routeName) {
      if (this.ePrescriptionForm.get('Route').value == option.RouteCode) {
        this.ePrescriptionForm.get('routeTooltip').setValue(option.RouteDescription);
      }
    }
  }
  //#endregion "Set Form Values"

  //#region "SdialogClose"
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion "dialogClose"
}