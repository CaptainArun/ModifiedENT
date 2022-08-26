import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { PhysicianAddressModel } from '../models/physicianAddressModel';
import { PhysicianService } from '../physician.service';

@Component({
  selector: 'app-PhysicianDetailComponent',
  templateUrl: './physician-addressdetail.component.html',
  styleUrls: ['./physician-addressdetail.component.css']
})
export class PhysicianAddressDetailComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  addressModel: PhysicianAddressModel = new PhysicianAddressModel();
  state: any;
  country: any;
  address: any;
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private util: UtilService, private physicianservice: PhysicianService, public dialogRef: MatDialogRef<PhysicianAddressDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({
      AddressType: ['', Validators.required],
      DoorOrApartmentNo: ['', Validators.required],
      ApartmentNameOrHouseName: [''],
      StreetName: [''],
      Locality: [''],
      Town: ['', Validators.required],
      City: [''],
      District: [''],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      PinCode: ['']
    });
    this.getdata();
    this.getCountryforPhysician();
    this.getAddressforPhysician();
    this.getStateforPhysician();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('AddressType').setValue(this.data.AddressType);
    this.form.get('DoorOrApartmentNo').setValue(this.data.DoorOrApartmentNo);
    this.form.get('ApartmentNameOrHouseName').setValue(this.data.ApartmentNameOrHouseName);
    this.form.get('StreetName').setValue(this.data.StreetName);
    this.form.get('Town').setValue(this.data.Town);
    this.form.get('Locality').setValue(this.data.Locality);
    this.form.get('City').setValue(this.data.City);
    this.form.get('District').setValue(this.data.District);
    this.form.get('State').setValue(this.data.State);
    this.form.get('Country').setValue(this.data.Country);
    this.form.get('PinCode').setValue(this.data.PinCode);
  }
    //#endregion
  //#region "dialogClose"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion
  //#region "Submit"
    submit() {
    if (this.form.valid) {
      this.addressModel = new PhysicianAddressModel();
      this.addressModel.AddressType = this.form.get('AddressType').value;
      this.addressModel.DoorOrApartmentNo = this.form.get('DoorOrApartmentNo').value;
      this.addressModel.ApartmentNameOrHouseName = this.form.get('ApartmentNameOrHouseName').value;
      this.addressModel.StreetName = this.form.get('StreetName').value;
      this.addressModel.Locality = this.form.get('Locality').value;
      this.addressModel.Town = this.form.get('Town').value;
      this.addressModel.City = this.form.get('City').value;
      this.addressModel.District = this.form.get('District').value;
      this.addressModel.State = this.form.get('State').value;
      this.addressModel.Country = this.form.get('Country').value;
      this.addressModel.PinCode = this.form.get('PinCode').value;
      this.util.showMessage('', 'Physician Address details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.addressModel);
        }
      );
    }
  }

 //#endregion
  //#region "Clear"
  clear() {
    this.form.reset();
    this.getdata();
  }
    //#endregion
  //#region "State"
  getStateforPhysician() {
    this.physicianservice.getStateforPhysician().then(res => {
      this.state = res;
    })
  }
  //#endregion
  //#region "Country"
  getCountryforPhysician() {
    this.physicianservice.getCountryforPhysician().then(res => {
      this.country = res;
    })
  }
  //#endregion
  //#region "Address"
  getAddressforPhysician() {
    this.physicianservice.getAddressforPhysician().then(res => {
      this.address = res;
    })
  }
  //#endregion
}
