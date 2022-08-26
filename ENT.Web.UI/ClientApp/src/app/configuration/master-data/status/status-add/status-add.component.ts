import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { StatusModel } from "../../../Models/statusModel";

@Component({
    selector: 'status-add',
    templateUrl: './status-add.component.html',
    styleUrls: ['./status-add.component.css']
})

export class StatusAddComponent implements OnInit {

    //#region "Property Declaration"
    addStatusForm: FormGroup;
    statusModel: StatusModel = new StatusModel();
    statusId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<StatusAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addStatusForm = this.fb.group({
            StatusCode: ["", Validators.required],
            StatusDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setStatusData();

        if (this.data != null) {
            this.statusId = this.data.CarePlanStatusID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setStatusData() {
        if (this.data) {
            this.addStatusForm.get('StatusCode').setValue(this.data.CarePlanStatusCode);
            this.addStatusForm.get('StatusDescription').setValue(this.data.CarePlanStatusDesc);
            this.addStatusForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditStatus() {
        if (this.addStatusForm.valid) {
            this.statusModel.CarePlanStatusID = this.statusId;
            this.statusModel.CarePlanStatusCode = this.addStatusForm.get("StatusCode").value;
            this.statusModel.CarePlanStatusDesc = this.addStatusForm.get("StatusDescription").value;
            this.statusModel.OrderNo = this.addStatusForm.get("OrderNo").value;
            this.configurationService.addUpdateStatus(this.statusModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Status details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addStatusForm.reset();
        this.setStatusData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}