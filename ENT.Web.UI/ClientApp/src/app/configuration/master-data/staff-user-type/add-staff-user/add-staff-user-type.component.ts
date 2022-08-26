import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { staffUserTypeModel } from "../../../Models/staffUserTypeModel";

@Component({
    selector: "app-staffUserAddComponent",
    templateUrl: './add-staff-user-type.component.html',
    styleUrls: ["./add-staff-user-type.component.css"],
})
export class staffUserAddComponent implements OnInit {

    //#region "Property Declaration"
    StaffUserTypeForm: FormGroup;
    staffUserTypeModel: staffUserTypeModel = new staffUserTypeModel();
    UserTypeId: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;

    //#endregion


    //#region "constructor"
    constructor(
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<staffUserAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        public configurationservice: ConfigurationService,
        public CustHttp: CustomHttpService,
        private util: UtilService,) {
    }
    //#endregion


    ngOnInit() {
        this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.StaffUserTypeForm = this.fb.group({
            UserTypeCode: ["", Validators.required],
            UserTypeDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setValuesForForm();

        if (this.data != null) {
            this.UserTypeId = this.data.UserTypeId;
            this.showvalue = "Edit";
            this.isReadOnly = true;
        }
    }

    //#region "set Values For edit Form"
    setValuesForForm() {
        if (this.data) {
            this.StaffUserTypeForm.get('UserTypeCode').setValue(this.data.UserTypeCode);
            this.StaffUserTypeForm.get('UserTypeDesc').setValue(this.data.UserTypeDescription);
            this.StaffUserTypeForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update staff user Type Data"
    submitStaffUser() {
        if (this.StaffUserTypeForm.valid) {
            this.staffUserTypeModel = new staffUserTypeModel();
            this.staffUserTypeModel.UserTypeId = 0;
            this.staffUserTypeModel.UserTypeCode = this.StaffUserTypeForm.get("UserTypeCode").value;
            this.staffUserTypeModel.UserTypeDescription = this.StaffUserTypeForm.get("UserTypeDesc").value;
            this.staffUserTypeModel.OrderNo = this.StaffUserTypeForm.get("OrderNo").value;
            this.configurationservice.addUpdateStaffUser(this.staffUserTypeModel).then((res) => {
                if (res) {
                    this.util.showMessage("", "Staff user Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
        this.StaffUserTypeForm.reset();
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