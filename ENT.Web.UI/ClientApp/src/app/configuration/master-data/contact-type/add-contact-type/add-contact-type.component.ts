import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { ContactTypeMasterModel } from "../../../Models/contactTypeMasterModel";

@Component({
  selector: "app-addcontacttype",
  styleUrls: ["./add-contact-type.component.css"],
  templateUrl: './add-contact-type.component.html'
})

export class addContactTypeComponent implements OnInit {

  //#region "Property Declaration"
  ContactTypeForm: FormGroup;
  ContactTypeMasterModel: ContactTypeMasterModel = new ContactTypeMasterModel();
  ContactTypeId : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addContactTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.ContactTypeForm = this.fb.group({
      ContactTypeCode : ["", Validators.required],
      ContactTypeDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.ContactTypeId  = this.data.ContactTypeId ;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.ContactTypeForm.get('ContactTypeCode').setValue(this.data.ContactTypeCode);
      this.ContactTypeForm.get('ContactTypeDesc').setValue(this.data.ContactTypeDesc);
      this.ContactTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update contact Type Data"
  submitContact() {
    if (this.ContactTypeForm.valid) {
      this.ContactTypeMasterModel.ContactTypeId   = 0;
      this.ContactTypeMasterModel.ContactTypeCode  = this.ContactTypeForm.get("ContactTypeCode").value;
      this.ContactTypeMasterModel.ContactTypeDesc  = this.ContactTypeForm.get("ContactTypeDesc").value;
      this.ContactTypeMasterModel.OrderNo = this.ContactTypeForm.get("OrderNo").value;
      this.configurationservice.savecontact(this.ContactTypeMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Contact Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.ContactTypeForm.reset();
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
