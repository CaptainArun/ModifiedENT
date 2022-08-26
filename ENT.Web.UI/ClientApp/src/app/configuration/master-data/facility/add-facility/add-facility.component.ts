import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { facilityModel } from "../../../Models/facilityModel";

@Component({
  selector: "app-facilityAddComponent",
  templateUrl: './add-facility.component.html',
  styleUrls: ["./add-facility.component.css"]
})
export class facilityAddComponent implements OnInit {

  //#region "Property Declaration"
  FacilityTypeForm: FormGroup;

  facilityModel: facilityModel = new facilityModel();
  FacilityID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  speciality: any;
  SpecialitiesValues: Array<Number> = [];

  //#endregion

  //#region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<facilityAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationservice: ConfigurationService, public CustHttp: CustomHttpService, private util: UtilService,) {}
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.FacilityTypeForm = this.fb.group({
      FacilityNumber: ["", Validators.required],
      FacilityName: ["", Validators.required],
      AddressOne: ["", Validators.required],
      AddressTwo: [""],
      City: ["", Validators.required],
      State: ["", Validators.required],
      Country: ["", Validators.required],
      PinCode: ["", Validators.required],
      TelePhone: ['', [Validators.required]],
      AlternateTelephone: [""],
      Email:['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      Speciality: ["", Validators.required],
    });

    this.setValuesforFacility();
    this.getSpeciallities();

    if (this.data != null) {
      this.FacilityID = this.data.FacilityId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region " get values for grid"
  getSpeciallities() {
    this.configurationservice.getAllSpecialities().then(data => {
      this.speciality = data;
    });
  }
  //#endRegion 

  //#region "set Values For Edit Form"
  setValuesforFacility() {
    if (this.data) {

      this.FacilityTypeForm.get('FacilityNumber').setValue(this.data.FacilityNumber);
      this.FacilityTypeForm.get('FacilityName').setValue(this.data.FacilityName);
      this.FacilityTypeForm.get('AddressOne').setValue(this.data.AddressLine1);
      this.FacilityTypeForm.get('AddressTwo').setValue(this.data.AddressLine2);
      this.FacilityTypeForm.get('City').setValue(this.data.City);
      this.FacilityTypeForm.get('State').setValue(this.data.State);
      this.FacilityTypeForm.get('Country').setValue(this.data.Country);
      this.FacilityTypeForm.get('PinCode').setValue(this.data.PINCode);
      this.FacilityTypeForm.get('TelePhone').setValue(this.data.Telephone);
      this.FacilityTypeForm.get('AlternateTelephone').setValue(this.data.AlternativeTelphone);
      this.FacilityTypeForm.get('Email').setValue(this.data.Email);
      if (this.data.SpecialityId.includes(',')) {
        for (let a of this.data.SpecialityId.split(',')) {
          this.SpecialitiesValues.push(parseInt(a))
        }
      } else {
        this.SpecialitiesValues.push(parseInt(this.data.SpecialityId));
      }
      this.FacilityTypeForm.get('Speciality').setValue(this.SpecialitiesValues);
    }
  }
  //#endregion

  //#region "Edit/Update facility Type Data"
  submitFacility() {
    if (this.FacilityTypeForm.valid) {

      this.facilityModel = new facilityModel();
      this.facilityModel.FacilityId = this.FacilityID;
      this.facilityModel.FacilityNumber = this.FacilityTypeForm.get("FacilityNumber").value;
      this.facilityModel.FacilityName = this.FacilityTypeForm.get("FacilityName").value;
      this.facilityModel.AddressLine1 = this.FacilityTypeForm.get("AddressOne").value;
      this.facilityModel.AddressLine2 = this.FacilityTypeForm.get("AddressTwo").value;
      this.facilityModel.City = this.FacilityTypeForm.get("City").value;
      this.facilityModel.State = this.FacilityTypeForm.get("State").value;
      this.facilityModel.Country = this.FacilityTypeForm.get("Country").value;
      this.facilityModel.PINCode = this.FacilityTypeForm.get("PinCode").value;
      this.facilityModel.Telephone = this.FacilityTypeForm.get("TelePhone").value;
      this.facilityModel.AlternativeTelphone = this.FacilityTypeForm.get("AlternateTelephone").value;
      this.facilityModel.Email = this.FacilityTypeForm.get("Email").value;
      this.facilityModel.SpecialityId = this.FacilityTypeForm.get("Speciality").value.toString();

      this.configurationservice.addUpdateFacility(this.facilityModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Facility details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.FacilityTypeForm.reset();
    this.setValuesforFacility();
  }
  //#endregion 

  //#region "To close the Pop up"
  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion  
}