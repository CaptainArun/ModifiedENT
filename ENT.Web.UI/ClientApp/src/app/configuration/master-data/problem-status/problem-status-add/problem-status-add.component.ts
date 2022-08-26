import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProblemStatusModel } from "../../../Models/problemStatusModel";

@Component({
    selector: 'problem-status-add',
    templateUrl: './problem-status-add.component.html',
    styleUrls: ['./problem-status-add.component.css']
})
export class ProblemStatusAddComponent implements OnInit {

    //#region "Property Declaration"
    addProblemStatusForm: FormGroup;
    problemStatusModel: ProblemStatusModel = new ProblemStatusModel();
    problemStatusId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProblemStatusAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addProblemStatusForm = this.fb.group({
            ProblemStatusCode: ["", Validators.required],
            ProblemStatusDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setProblemStatusData();

        if (this.data != null) {
            this.problemStatusId = this.data.ProblemStatusID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setProblemStatusData() {
        if (this.data) {
            this.addProblemStatusForm.get('ProblemStatusCode').setValue(this.data.ProblemStatusCode);
            this.addProblemStatusForm.get('ProblemStatusDescription').setValue(this.data.ProblemStatusDesc);
            this.addProblemStatusForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditProblemStatus() {
        if (this.addProblemStatusForm.valid) {
            this.problemStatusModel.ProblemStatusID = this.problemStatusId;
            this.problemStatusModel.ProblemStatusCode = this.addProblemStatusForm.get("ProblemStatusCode").value;
            this.problemStatusModel.ProblemStatusDesc = this.addProblemStatusForm.get("ProblemStatusDescription").value;
            this.problemStatusModel.OrderNo = this.addProblemStatusForm.get("OrderNo").value;
            this.configurationService.addUpdateProblemStatus(this.problemStatusModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Problem status details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addProblemStatusForm.reset();
        this.setProblemStatusData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}