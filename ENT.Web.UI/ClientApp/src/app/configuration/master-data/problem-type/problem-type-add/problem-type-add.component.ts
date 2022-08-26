import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProblemTypeModel } from "../../../Models/problemTypeModel";

@Component({
    selector: 'problem-type-add',
    templateUrl: './problem-type-add.component.html',
    styleUrls: ['./problem-type-add.component.css']
})
export class ProblemTypeAddComponent implements OnInit {

    //#region "Property Declaration"
    addProblemTypeForm: FormGroup;
    problemTypeModel: ProblemTypeModel = new ProblemTypeModel();
    problemTypeId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProblemTypeAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addProblemTypeForm = this.fb.group({
            ProblemTypeCode: ["", Validators.required],
            ProblemTypeDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setProblemTypeData();

        if (this.data != null) {
            this.problemTypeId = this.data.ProblemTypeId;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setProblemTypeData() {
        if (this.data) {
            this.addProblemTypeForm.get('ProblemTypeCode').setValue(this.data.ProblemTypeCode);
            this.addProblemTypeForm.get('ProblemTypeDescription').setValue(this.data.ProblemTypeDescription);
            this.addProblemTypeForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditProblemType() {
        if (this.addProblemTypeForm.valid) {
            this.problemTypeModel.ProblemTypeId = this.problemTypeId;
            this.problemTypeModel.ProblemTypeCode = this.addProblemTypeForm.get("ProblemTypeCode").value;
            this.problemTypeModel.ProblemTypeDescription = this.addProblemTypeForm.get("ProblemTypeDescription").value;
            this.problemTypeModel.OrderNo = this.addProblemTypeForm.get("OrderNo").value;
            this.configurationService.addUpdateProblemType(this.problemTypeModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Problem type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addProblemTypeForm.reset();
        this.setProblemTypeData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}