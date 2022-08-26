import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RolesModel } from "src/app/configuration/Models/rolesModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

@Component({
    selector: 'roles-add',
    templateUrl: './roles-add.component.html',
    styleUrls: ['./roles-add.component.css']
})

export class RolesAddComponent implements OnInit {

    //#region "Property Declaration"
    addRolesForm: FormGroup;
    rolesModel: RolesModel = new RolesModel();
    roleId: number = 0;
    showName: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

    //#region "constructor"
    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<RolesAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
    //#endregion

    // #region "ngOnInit"
    ngOnInit() {
        this.addRolesForm = this.fb.group({
            RoleName: ["", Validators.required],
            RoleDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
        });
        this.setRolesData();

        if (this.data != null) {
            this.roleId = this.data.RoleId;
            this.showName = "Edit";
            this.isReadOnly = true;
        }
    }
    // #endregion

    //#region "set Values For Form"
    setRolesData() {
        if (this.data) {
            this.addRolesForm.get('RoleName').setValue(this.data.RoleName);
            this.addRolesForm.get('RoleDescription').setValue(this.data.RoleDescription);
            this.addRolesForm.get('OrderNo').setValue(this.data.OrderNo);
        }
    }
    //#endregion

    //#region "Edit/Update Admission Type Data"
    addEditRoles() {
        if (this.addRolesForm.valid) {
            this.rolesModel.RoleId = this.roleId;
            this.rolesModel.RoleName = this.addRolesForm.get("RoleName").value;
            this.rolesModel.RoleDescription = this.addRolesForm.get("RoleDescription").value;
            this.rolesModel.OrderNo = this.addRolesForm.get("OrderNo").value;
            this.configurationService.addUpdateRoles(this.rolesModel).then(res => {
                if (res) {
                    this.util.showMessage("", "Roles details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

                    });
                    this.dialogRef.close("Updated");
                }
            });
        }
    }
    //#endregion

    //#region "clear the Form values"
    clearForm() {
        this.addRolesForm.reset();
        this.setRolesData();
    }
    //#endregion 

    //#region "To close the Pop up"
    //To close the Pop up
    dialogClose(): void {
        this.dialogRef.close();
    }
    //#endregion    

}