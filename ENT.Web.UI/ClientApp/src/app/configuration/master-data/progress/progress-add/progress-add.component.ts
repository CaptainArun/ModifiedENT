import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProgressModel } from "../../../Models/progressModel";

@Component({
    selector: 'progress-add',
    templateUrl: './progress-add.component.html',
    styleUrls: ['./progress-add.component.css']
})

export class ProgressAddComponent implements OnInit {

    //#region "Property Declaration"
    addProgressForm: FormGroup;
    progressModel: ProgressModel = new ProgressModel();
    progressId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProgressAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addProgressForm = this.fb.group({
            ProgressCode: ["", Validators.required],
            ProgressDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setProgressData();

        if (this.data != null) {
            this.progressId = this.data.CarePlanProgressID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setProgressData() {
        if (this.data) {
            this.addProgressForm.get('ProgressCode').setValue(this.data.CarePlanProgressCode);
            this.addProgressForm.get('ProgressDescription').setValue(this.data.CarePlanProgressDesc);
            this.addProgressForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditProgress() {
        if (this.addProgressForm.valid) {
            this.progressModel.CarePlanProgressID = this.progressId;
            this.progressModel.CarePlanProgressCode = this.addProgressForm.get("ProgressCode").value;
            this.progressModel.CarePlanProgressDesc = this.addProgressForm.get("ProgressDescription").value;
            this.progressModel.OrderNo = this.addProgressForm.get("OrderNo").value;
            this.configurationService.addUpdateProgress(this.progressModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Progress details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addProgressForm.reset();
        this.setProgressData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}