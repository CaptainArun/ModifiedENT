import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { StaffActivityTypeModel } from "../../../Models/staffActivityTypeModel"

@Component({
    selector: "app-StaffActivityAddComponent",
    templateUrl: './add-staff-activity-type.component.html',
    styleUrls: ["./add-staff-activity-type.component.css"],
})

export class StaffActivityAddComponent implements OnInit {
    //region "Property Decleration"
    StaffActivityForm: FormGroup;
    StaffActivityTypeModel: StaffActivityTypeModel = new StaffActivityTypeModel();
    showvalue: string = "Add";
    //showButton:string="Submit";
    isReadOnly: boolean = false;
    ActivityTypeId: number = 0;
    //endregion

    //region constructor
    constructor(public fb: FormBuilder,public dialogRef: MatDialogRef<StaffActivityAddComponent>,@Inject(MAT_DIALOG_DATA) public data,public configurationservice: ConfigurationService,public CustHttp: CustomHttpService,private util: UtilService,) { }
    //endregion

    ngOnInit() {
        this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.StaffActivityForm = this.fb.group({
            ActivityTypeCode: ["", Validators.required],
            ActivityTypeDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setValuesForForm();

        if (this.data != null) {
            this.ActivityTypeId = this.data.ActivityTypeId;
            this.showvalue = "Edit";
            //this.showButton="save";
            this.isReadOnly = true;
        }
    }

    //region "set Values For edit Form"
    setValuesForForm() {
        if (this.data) {
            this.StaffActivityForm.get('ActivityTypeCode').setValue(this.data.ActivityTypeCode);
            this.StaffActivityForm.get('ActivityTypeDesc').setValue(this.data.ActivityTypeDescription);
            this.StaffActivityForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //endregion

    //region "add/update values to staff activity grid"
    submitStaffActivity() {
        if (this.StaffActivityForm.valid) {
            this.StaffActivityTypeModel = new StaffActivityTypeModel();
            this.StaffActivityTypeModel.ActivityTypeId = 0;
            this.StaffActivityTypeModel.ActivityTypeCode = this.StaffActivityForm.get("ActivityTypeCode").value;
            this.StaffActivityTypeModel.ActivityTypeDescription = this.StaffActivityForm.get("ActivityTypeDesc").value;
            this.StaffActivityTypeModel.OrderNo = this.StaffActivityForm.get("OrderNo").value;

            this.configurationservice.addUpdateStaffActivity(this.StaffActivityTypeModel).then((res) => {
                if (res) {
                    this.util.showMessage("", "Staff Activity Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
                        .then((res) => {
                            this.dialogRef.close("Updated");
                        }
                        );
                }
            });
        }
    }
    //endregion

    //region "clear the Form values"
    cleartheForm() {
        this.StaffActivityForm.reset();
        this.setValuesForForm();
    }
    //endregion 

    //region "To close the Pop up"
    //To close the Pop up
    dialogClose(){
        this.dialogRef.close();
    }
    //endregion


}