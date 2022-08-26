import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProblemAreaModel } from "../../../Models/problemAreaModel";

@Component({
    selector: 'problem-area-add',
    templateUrl: './problem-area-add.component.html',
    styleUrls: ['./problem-area-add.component.css']
})
export class ProblemAreaAddComponent implements OnInit {

    //#region "Property Declaration"
    addProblemAreaForm: FormGroup;
    problemAreaModel: ProblemAreaModel = new ProblemAreaModel();
    problemAreaId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProblemAreaAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addProblemAreaForm = this.fb.group({
            ProblemAreaCode: ["", Validators.required],
            ProblemAreaDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setProblemAreaData();

        if (this.data != null) {
            this.problemAreaId = this.data.ProblemAreaId;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setProblemAreaData() {
        if (this.data) {
            this.addProblemAreaForm.get('ProblemAreaCode').setValue(this.data.ProblemAreaCode);
            this.addProblemAreaForm.get('ProblemAreaDescription').setValue(this.data.ProblemAreaDescription);
            this.addProblemAreaForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditProblemArea() {
        if (this.addProblemAreaForm.valid) {
            this.problemAreaModel.ProblemAreaId = this.problemAreaId;
            this.problemAreaModel.ProblemAreaCode = this.addProblemAreaForm.get("ProblemAreaCode").value;
            this.problemAreaModel.ProblemAreaDescription = this.addProblemAreaForm.get("ProblemAreaDescription").value;
            this.problemAreaModel.OrderNo = this.addProblemAreaForm.get("OrderNo").value;
            this.configurationService.addUpdateProblemArea(this.problemAreaModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Problem area details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addProblemAreaForm.reset();
        this.setProblemAreaData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}