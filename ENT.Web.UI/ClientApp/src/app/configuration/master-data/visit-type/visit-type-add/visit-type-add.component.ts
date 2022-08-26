import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { VisitTypeModel } from "../../../Models/visitTypeModel";

@Component({
  selector: 'visit-type-add',
  templateUrl: './visit-type-add.component.html',
  styleUrls: ['./visit-type-add.component.css']
})

export class VisitTypeAddComponent implements OnInit {

  //#region "Property Declaration"
  addVisitTypeForm: FormGroup;
  visitTypeModel: VisitTypeModel = new VisitTypeModel();
  visitTypeId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<VisitTypeAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  //#endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addVisitTypeForm = this.fb.group({
      VisitTypeCode: ["", Validators.required],
      VisitTypeDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setVisitTypeData();

    if (this.data != null) {
      this.visitTypeId = this.data.VisitTypeID;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setVisitTypeData() {
    if (this.data) {
      this.addVisitTypeForm.get('VisitTypeCode').setValue(this.data.VisitTypeCode);
      this.addVisitTypeForm.get('VisitTypeDescription').setValue(this.data.VisitTypeDescription);
      this.addVisitTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Admission Type Data"
  addEditVisitType() {
    if (this.addVisitTypeForm.valid) {
      this.visitTypeModel.VisitTypeId = this.visitTypeId;
      this.visitTypeModel.VisitTypeCode = this.addVisitTypeForm.get("VisitTypeCode").value;
      this.visitTypeModel.VisitTypeDescription = this.addVisitTypeForm.get("VisitTypeDescription").value;
      this.visitTypeModel.OrderNo = this.addVisitTypeForm.get("OrderNo").value;
      this.configurationService.addUpdateVisitType(this.visitTypeModel).then(res => {
        if (res) {
          this.util.showMessage("", "Visit type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  //#endregion

  //#region "clear the Form values"
  clearForm() {
    this.addVisitTypeForm.reset();
    this.setVisitTypeData();
  }
  //#endregion 

  //#region "To close the Pop up"
  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion    
  
}