import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { MobilityMasterModel } from "../../../Models/mobilityMasterModel";


@Component({
    selector: "app-addmobility",
      styleUrls: ["./add-mobility.component.css"],
    templateUrl: './add-mobility.component.html'
    })
    export class MobilityAddComponent implements OnInit{

 //#region "Property Declaration"
 MobilityTypeForm: FormGroup;
 MobilityMasterModel: MobilityMasterModel= new MobilityMasterModel();
 MobilityID: number = 0;
 showvalue: string = "Add";
 isReadOnly: boolean = false;
 //#endregion


      //#region "constructor"
      constructor(
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<MobilityAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        public configurationservice: ConfigurationService,
        public CustHttp: CustomHttpService,
        private util: UtilService,) {
      }
      //#endregion



      ngOnInit() {
        this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    
        this.MobilityTypeForm = this.fb.group({
            MobilityCode: ["", Validators.required],
            MobilityDesc: ["", Validators.required],
          OrderNo: ["", Validators.required],
        });
        this.setValuesForForm();
        if (this.data != null) {
          this.MobilityID = this.data.MobilityID;
          this.showvalue = "Edit";
          this.isReadOnly = true;
        }
      }


        //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.MobilityTypeForm.get('MobilityCode').setValue(this.data.FCMobilityCode);
      this.MobilityTypeForm.get('MobilityDesc').setValue(this.data.FCMobilityDesc);
      this.MobilityTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
   //#endregion

 //#region "Edit/Update Mobility Type Data"
 submitMobility() {
    if (this.MobilityTypeForm.valid) {
      this.MobilityMasterModel.FCMobilityID = 0;
      this.MobilityMasterModel.FCMobilityCode = this.MobilityTypeForm.get("MobilityCode").value;
      this.MobilityMasterModel.FCMobilityDesc = this.MobilityTypeForm.get("MobilityDesc").value;
      this.MobilityMasterModel.OrderNo = this.MobilityTypeForm.get("OrderNo").value;
      this.configurationservice.saveMobility(this.MobilityMasterModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Mobility Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.MobilityTypeForm.reset();
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
