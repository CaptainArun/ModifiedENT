import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { sectionMasterModel } from "src/app/configuration/Models/sectionMasterModel";
import { CustomHttpService } from '../../../../core/custom-http.service';

@Component({
  selector: "app-section",
  styleUrls: ["./add-section.component.css"],
  templateUrl: './add-section.component.html'
})

export class addSectionComponent implements OnInit {

  //#region "Property Declaration"
  SectionTypeForm: FormGroup;
  sectionMasterModel: sectionMasterModel = new sectionMasterModel();
  BodySectionID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.SectionTypeForm = this.fb.group({
      BodySectionCode: ["", Validators.required],
      BodySectionDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.BodySectionID = this.data.BodySectionID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.SectionTypeForm.get('BodySectionCode').setValue(this.data.BodySectionCode);
      this.SectionTypeForm.get('BodySectionDesc').setValue(this.data.BodySectionDesc);
      this.SectionTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update section Type Data"
  submitSection() {
    if (this.SectionTypeForm.valid) {
      this.sectionMasterModel.BodySectionID  = 0;
      this.sectionMasterModel.BodySectionCode = this.SectionTypeForm.get("BodySectionCode").value;
      this.sectionMasterModel.BodySectionDesc = this.SectionTypeForm.get("BodySectionDesc").value;
      this.sectionMasterModel.OrderNo = this.SectionTypeForm.get("OrderNo").value;
      this.configurationservice.savesection(this.sectionMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","section Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.SectionTypeForm.reset();
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
