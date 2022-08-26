import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
/*import { log } from 'util';*/
import { StaffProfileModel } from '../models/staffProfileModel';
import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent,MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

/*import { StepperSelectionEvent } from '@angular/cdk/stepper';
*/
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffAddressModel } from '../models/staffAddressModel';
@Component({
  selector: 'app-staff-address',
  templateUrl: './staff-address.component.html',
  styleUrls: ['./staff-address.component.css']
})

export class StaffAddressComponent implements OnInit {

  //#region "Property Declearation"
  staffaddressform: FormGroup;
  addresstype: any;
  StaffAddressModel: StaffAddressModel = new StaffAddressModel();

  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<StaffAddressComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.staffaddressform = this.fb.group({
      AddressType: ['', Validators.required],
      Address1: [''],
      Address2: [''],
      Town: [''],
      District: [''],
      PINcode: [''],
      State: [''],
      Country: [''],
      ValidFrom: [''],
      ValidTo: [''],
      AddressTypeDescription: [''],
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getAddressType();
    this.getdata();
  }
  //#endregion

  //#region "Submit"
  submit() {
    if (this.staffaddressform.valid) {


      this.StaffAddressModel = new StaffAddressModel();
      this.StaffAddressModel.AddressType = this.staffaddressform.get('AddressType').value;
      this.StaffAddressModel.AddressTypeDesc = this.staffaddressform.get('AddressTypeDescription').value;
      this.StaffAddressModel.Address1 = this.staffaddressform.get('Address1').value;
      this.StaffAddressModel.Address2 = this.staffaddressform.get('Address2').value;

      this.StaffAddressModel.City = this.staffaddressform.get('Town').value;

      this.StaffAddressModel.District = this.staffaddressform.get('District').value;

      this.StaffAddressModel.Pincode = this.staffaddressform.get('PINcode').value;

      this.StaffAddressModel.State = this.staffaddressform.get('State').value;

      this.StaffAddressModel.Country = this.staffaddressform.get('Country').value;

      this.StaffAddressModel.ValidFrom = this.staffaddressform.get('ValidFrom').value;
      this.StaffAddressModel.ValidTo = this.staffaddressform.get('ValidTo').value;
      this.util.showMessage('', 'Staff Address details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.StaffAddressModel);
        }
      );
    }
  }
  //#endregion
  //#region "AddressType"
  getAddressType() {
    this.staffservice.getAddressType().then(res => {
      this.addresstype = res;
    })
  }
  //#endregion
  //#region "Get Data"
  getdata() {
    this.staffaddressform.get('AddressType').setValue(this.data.AddressType);
    this.staffaddressform.get('AddressTypeDescription').setValue(this.data.AddressTypeDesc);
    this.staffaddressform.get('Address1').setValue(this.data.Address1);
    this.staffaddressform.get('Address2').setValue(this.data.Address2);
    this.staffaddressform.get('Town').setValue(this.data.City);
    this.staffaddressform.get('District').setValue(this.data.District);
    this.staffaddressform.get('PINcode').setValue(this.data.Pincode);
    this.staffaddressform.get('State').setValue(this.data.State);
    this.staffaddressform.get('Country').setValue(this.data.Country);
    this.staffaddressform.get('ValidFrom').setValue(this.data.ValidFrom);
    this.staffaddressform.get('ValidTo').setValue(this.data.ValidTo);
  }
  //#endregion
  //#region "Clear"
  clear() {
    this.staffaddressform.reset();
    this.getdata();
  }
  //#endregion
  //#region "Address Type"
  AddressTypeEvent(description) {
    this.staffaddressform.get('AddressTypeDescription').setValue(description);
  }
  //#endregion
  //#region "Close"
  dialogClose():void{
    this.dialogRef.close();
  }
  //#endregion
}
