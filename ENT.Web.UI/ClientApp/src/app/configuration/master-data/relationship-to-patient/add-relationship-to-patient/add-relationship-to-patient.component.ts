import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { relationshipToPatientStatusMasterModel } from "src/app/configuration/Models/relationshipToPatientMasterModel";

@Component({
  selector: "app-realtionship",
  styleUrls: ["./add-relationship-to-patient.component.css"],
  templateUrl: './add-relationship-to-patient.component.html'
})

export class addRealtionshipToPatientComponent implements OnInit {

  //#region "Property Declaration"
  RelationshipTypeForm: FormGroup;
  relationshipToPatientStatusMasterModel: relationshipToPatientStatusMasterModel = new relationshipToPatientStatusMasterModel();
  RSPId: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addRealtionshipToPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.RelationshipTypeForm = this.fb.group({
      RSPCode: ["", Validators.required],
      RSPDescription : ["", Validators.required],
      RSPOrder : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.RSPId = this.data.RSPId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data != null) {
      this.RelationshipTypeForm.get('RSPCode').setValue(this.data.RSPCode);
      this.RelationshipTypeForm.get('RSPDescription').setValue(this.data.RSPDescription);
      this.RelationshipTypeForm.get('RSPOrder').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update realtionship Type Data"
  submitRelationship() {
    if (this.RelationshipTypeForm.valid) {
      this.relationshipToPatientStatusMasterModel.RSPId  = 0;
      this.relationshipToPatientStatusMasterModel.RSPCode = this.RelationshipTypeForm.get("RSPCode").value;
      this.relationshipToPatientStatusMasterModel.RSPDescription = this.RelationshipTypeForm.get("RSPDescription").value;
      this.relationshipToPatientStatusMasterModel.OrderNo = this.RelationshipTypeForm.get("RSPOrder").value;
      this.configurationservice.saveRelationShip(this.relationshipToPatientStatusMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Relationship to patient  history Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
              .then((res) => {
                this.dialogRef.close("Updated");

              }
              );
          }
        });
    }
  }
  //#endregion

  //#region "clear the Form values"
  cleartheForm() {
    this.RelationshipTypeForm.reset();
    this.setValuesForForm();
  }
  //#endregion 

  //#region "To close the Pop up"
  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion    
}
