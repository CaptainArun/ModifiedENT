import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
//import { specialityMasterModel } from "src/app/configuration/Models/specialityMasterModel";

@Component({
  selector: "app-edit-hospital",
  styleUrls: ["./edit-hospital.component.css"],
  templateUrl: './edit-hospital.component.html'
})

export class EditHospital implements OnInit {

 // addSpecialityForm: FormGroup;
  // specialityMasterModel: specialityMasterModel = new specialityMasterModel();

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EditHospital>,
  ) {

  }
  ngOnInit() {
    // this.addSpecialityForm = this.fb.group({
    //   TenantSpecialityCode: ["", Validators.required],
    //   TenantSpecialityDescription: ["", Validators.required],
    //   OrderNo: ["", Validators.required],
    // });

  }

  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }



}
