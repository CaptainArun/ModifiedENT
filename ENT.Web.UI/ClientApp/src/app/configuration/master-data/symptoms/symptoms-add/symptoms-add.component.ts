import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { SymptomsModel } from "../../../Models/symptomsModel";

@Component({
    selector: 'symptoms-add',
    templateUrl: './symptoms-add.component.html',
    styleUrls: ['./symptoms-add.component.css']
})
export class SymptomsAddComponent implements OnInit {
    //#region "Property Declaration"
    addSymptomsForm: FormGroup;
    symptomsModel: SymptomsModel = new SymptomsModel();
    symptomsId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<SymptomsAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addSymptomsForm = this.fb.group({
            SymptomsCode: ["", Validators.required],
            SymptomsDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setSymptomsData();

        if (this.data != null) {
            this.symptomsId = this.data.SymptomsId;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setSymptomsData() {
        if (this.data) {
            this.addSymptomsForm.get('SymptomsCode').setValue(this.data.SymptomsCode);
            this.addSymptomsForm.get('SymptomsDescription').setValue(this.data.SymptomsDescription);
            this.addSymptomsForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditSymptoms() {
        if (this.addSymptomsForm.valid) {
            this.symptomsModel.SymptomsId = this.symptomsId;
            this.symptomsModel.SymptomsCode = this.addSymptomsForm.get("SymptomsCode").value;
            this.symptomsModel.SymptomsDescription = this.addSymptomsForm.get("SymptomsDescription").value;
            this.symptomsModel.OrderNo = this.addSymptomsForm.get("OrderNo").value;
            this.configurationService.addUpdateSymptoms(this.symptomsModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Symptoms details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addSymptomsForm.reset();
        this.setSymptomsData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion 

}