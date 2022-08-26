import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProcedureStatusModel } from "../../../Models/procedureStatusModel";

@Component({
    selector: 'procedure-status-add',
    templateUrl: './procedure-status-add.component.html',
    styleUrls: ['./procedure-status-add.component.css']
})

export class ProcedureStatusAddComponent implements OnInit {

    //#region "Property Declaration"
    addProcedureStatusForm: FormGroup;
    procedureStatusModel: ProcedureStatusModel = new ProcedureStatusModel();
    procedureStatusId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProcedureStatusAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addProcedureStatusForm = this.fb.group({
            ProcedureStatusCode: ["", Validators.required],
            ProcedureStatusDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setProcedureStatusData();

        if (this.data != null) {
            this.procedureStatusId = this.data.ProcedureStatusID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setProcedureStatusData() {
        if (this.data) {
            this.addProcedureStatusForm.get('ProcedureStatusCode').setValue(this.data.ProcedureStatusCode);
            this.addProcedureStatusForm.get('ProcedureStatusDescription').setValue(this.data.ProcedureStatusDesc);
            this.addProcedureStatusForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditProcedureStatus() {
        if (this.addProcedureStatusForm.valid) {
            this.procedureStatusModel.ProcedureStatusID = this.procedureStatusId;
            this.procedureStatusModel.ProcedureStatusCode = this.addProcedureStatusForm.get("ProcedureStatusCode").value;
            this.procedureStatusModel.ProcedureStatusDesc = this.addProcedureStatusForm.get("ProcedureStatusDescription").value;
            this.procedureStatusModel.OrderNo = this.addProcedureStatusForm.get("OrderNo").value;
            this.configurationService.addUpdateProcedureStatus(this.procedureStatusModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Procedure status details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addProcedureStatusForm.reset();
        this.setProcedureStatusData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}