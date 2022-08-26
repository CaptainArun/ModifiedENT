import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { departmentTypeMasterModel } from "../../../Models/departmentMasterModel";


@Component({
  selector: "app-adddepartment",
  styleUrls: ["./add-department.component.css"],
  templateUrl: './add-department.component.html'
})
export class DepartmentAddComponent implements OnInit {
  
    //#region "Property Declaration"
    DepartmentTypeForm: FormGroup;
    DepartmentMasterModel:departmentTypeMasterModel=new departmentTypeMasterModel();
    DepartmentID: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion


      //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<DepartmentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion



  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.DepartmentTypeForm = this.fb.group({
      DepartmentCode: ["", Validators.required],
      DepartmentDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.DepartmentID = this.data.DepartmentID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      
      this.DepartmentTypeForm.get('DepartmentCode').setValue(this.data.DepartCode );
      this.DepartmentTypeForm.get('DepartmentDesc').setValue(this.data.DepartmentDesc );
      this.DepartmentTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion



 //#region "Edit/Update Department Type Data"
 submitDepartment() {
  if (this.DepartmentTypeForm.valid) {
    this.DepartmentMasterModel.DepartmentID = 0;
    this.DepartmentMasterModel.DepartCode  = this.DepartmentTypeForm.get("DepartmentCode").value;
    this.DepartmentMasterModel.DepartmentDesc  = this.DepartmentTypeForm.get("DepartmentDesc").value;
    this.DepartmentMasterModel.OrderNo = this.DepartmentTypeForm.get("OrderNo").value;
    this.configurationservice.saveDepartment(this.DepartmentMasterModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Department Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
          .then((res) => {
            this.dialogRef.close("Updated");

          }
          );
      }
    });
  }
}
//#endregion

 //#region "clear the Form values"
 cleartheForm() {
  this.DepartmentTypeForm.reset();
  this.setValuesForForm();
}
//#endregion 

//#region "To close the Pop up"
//To close the Pop up
dialogClose(): void {
  this.dialogRef.close();
}
//#endregion  
}