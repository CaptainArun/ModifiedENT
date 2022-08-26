import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

import { languageModel } from "../../../Models/languageModel";

@Component({
  selector: "app-addLanguageComponent",
  styleUrls: ["./add-language.component.css"],
  templateUrl: './add-language.component.html'
})
export class addLanguageComponent implements OnInit {
  
//#region "Property Declaration"
    LanguageForm: FormGroup;
    languageModel: languageModel = new languageModel();
    LanguageId: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

//#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addLanguageComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

//#region ngOnInit
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.LanguageForm = this.fb.group({
      LanguageCode: ["", Validators.required],
      LanguageDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.LanguageId = this.data.LanguageId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
  //#endregion ngOnInit

//#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.LanguageForm.get('LanguageCode').setValue(this.data.LanguageCode);
      this.LanguageForm.get('LanguageDescription').setValue(this.data.LanguageDescription);
      this.LanguageForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion

//#region "Edit/Update Data"
 save() {
  if (this.LanguageForm.valid) {

    this.languageModel.LanguageId = this.LanguageId;
    this.languageModel.LanguageCode = this.LanguageForm.get("LanguageCode").value;
    this.languageModel.LanguageDescription = this.LanguageForm.get("LanguageDescription").value;
    this.languageModel.OrderNo = this.LanguageForm.get("OrderNo").value;
    
    this.configurationservice.addUpdateLanguage(this.languageModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Language details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
  this.LanguageForm.reset();
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