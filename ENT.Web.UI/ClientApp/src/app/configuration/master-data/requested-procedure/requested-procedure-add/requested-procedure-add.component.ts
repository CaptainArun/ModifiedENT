import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { RequestedProcedureModel } from "../../../Models/requestedProcedureModel";

@Component({
    selector: 'requested-procedure-add',
    templateUrl: './requested-procedure-add.component.html',
    styleUrls: ['./requested-procedure-add.component.css']
})

export class RequestedProcedureAddComponent implements OnInit {

    //#region "Property Declaration"
    addRequestedProcedureForm: FormGroup;
    requestedProcedureModel: RequestedProcedureModel = new RequestedProcedureModel();
    requestedProcedureId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<RequestedProcedureAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addRequestedProcedureForm = this.fb.group({
            RequestedProcedureCode: ["", Validators.required],
            RequestedProcedureDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setRequestedProcedureData();

        if (this.data != null) {
            this.requestedProcedureId = this.data.RequestedProcedureId;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setRequestedProcedureData() {
        if (this.data) {
            this.addRequestedProcedureForm.get('RequestedProcedureCode').setValue(this.data.RequestedProcedureCode);
            this.addRequestedProcedureForm.get('RequestedProcedureDescription').setValue(this.data.RequestedProcedureDescription);
            this.addRequestedProcedureForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditRequestedProcedure() {
        if (this.addRequestedProcedureForm.valid) {
            this.requestedProcedureModel.RequestedProcedureId = this.requestedProcedureId;
            this.requestedProcedureModel.RequestedProcedureCode = this.addRequestedProcedureForm.get("RequestedProcedureCode").value;
            this.requestedProcedureModel.RequestedProcedureDescription = this.addRequestedProcedureForm.get("RequestedProcedureDescription").value;
            this.requestedProcedureModel.OrderNo = this.addRequestedProcedureForm.get("OrderNo").value;
            this.configurationService.addUpdateRequestedProcedure(this.requestedProcedureModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Requested procedure details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addRequestedProcedureForm.reset();
        this.setRequestedProcedureData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}