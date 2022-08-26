import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { PainScaleModel } from "../../../Models/painScaleModel";

@Component({
    selector: 'pain-scale-add',
    templateUrl: './pain-scale-add.component.html',
    styleUrls: ['./pain-scale-add.component.css']
})
export class PainScaleAddComponent implements OnInit {

    //#region "Property Declaration"
    addPainScaleForm: FormGroup;
    painScaleModel: PainScaleModel = new PainScaleModel();
    painScaleId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<PainScaleAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addPainScaleForm = this.fb.group({
            PainScaleCode: ["", Validators.required],
            PainScaleDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setPainScaleData();

        if (this.data != null) {
            this.painScaleId = this.data.PainScaleID;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setPainScaleData() {
        if (this.data) {
            this.addPainScaleForm.get('PainScaleCode').setValue(this.data.PainScaleCode);
            this.addPainScaleForm.get('PainScaleDescription').setValue(this.data.PainScaleDesc);
            this.addPainScaleForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditPainScale() {
        if (this.addPainScaleForm.valid) {
            this.painScaleModel.PainScaleID = this.painScaleId;
            this.painScaleModel.PainScaleCode = this.addPainScaleForm.get("PainScaleCode").value;
            this.painScaleModel.PainScaleDesc = this.addPainScaleForm.get("PainScaleDescription").value;
            this.painScaleModel.OrderNo = this.addPainScaleForm.get("OrderNo").value;
            this.configurationService.addUpdatePainScale(this.painScaleModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Pain level details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addPainScaleForm.reset();
        this.setPainScaleData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}