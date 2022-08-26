import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { TreatmentTypeModel } from "../../../Models/treatmentTypeModel";

@Component({
    selector: 'treatment-type-add',
    templateUrl: './treatment-type-add.component.html',
    styleUrls: ['./treatment-type-add.component.css']
})

export class TreatmentTypeAddComponent implements OnInit {

    //#region "Property Declaration"
    addTreatmentTypeForm: FormGroup;
    treatmentTypeModel: TreatmentTypeModel = new TreatmentTypeModel();
    treatmentTypeId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<TreatmentTypeAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addTreatmentTypeForm = this.fb.group({
            TreatmentTypeCode: ["", Validators.required],
            TreatmentTypeDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setTreatmentTypeData();

        if (this.data != null) {
            this.treatmentTypeId = this.data.TreatmentTypeID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setTreatmentTypeData() {
        if (this.data) {
            this.addTreatmentTypeForm.get('TreatmentTypeCode').setValue(this.data.TreatmentTypeCode);
            this.addTreatmentTypeForm.get('TreatmentTypeDescription').setValue(this.data.TreatmentTypeDesc);
            this.addTreatmentTypeForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditTreatmentType() {
        if (this.addTreatmentTypeForm.valid) {
            this.treatmentTypeModel.TreatmentTypeID = this.treatmentTypeId;
            this.treatmentTypeModel.TreatmentTypeCode = this.addTreatmentTypeForm.get("TreatmentTypeCode").value;
            this.treatmentTypeModel.TreatmentTypeDesc = this.addTreatmentTypeForm.get("TreatmentTypeDescription").value;
            this.treatmentTypeModel.OrderNo = this.addTreatmentTypeForm.get("OrderNo").value;
            this.configurationService.addUpdateTreatmentType(this.treatmentTypeModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Treatment type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addTreatmentTypeForm.reset();
        this.setTreatmentTypeData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}