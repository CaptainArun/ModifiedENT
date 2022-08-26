import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Inject } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';

import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffWorkHistoryModel } from '../models/staffWorkHistoryModels';
@Component({
  selector: 'app-staffWorkComponent',
  templateUrl: './staff-work.component.html',
  styleUrls: ['./staff-work.component.css']
})

export class staffWorkComponent implements OnInit {

  //#region "Property Decleartion"
  staffworkform: FormGroup;
  StaffWorkHistoryModel: StaffWorkHistoryModel = new StaffWorkHistoryModel();


  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffWorkComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.staffworkform = this.fb.group({
      EmployerName: ['', Validators.required],
      ContactPerson: ['', Validators.required],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      CellPhone: [''],
      PhoneNo: [''],
      Address1: [''],
      Address2: [''],
      Town: [''],
      City: [''],
      District: [''],
      State: [''],
      Country: [''],
      PIN: [''],
      FromDate: [''],
      ToDate: [''],
      AdditionalInformation:['']
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
  }
  //#endregion

  //#region "Submit"
  submit() {
    if (this.staffworkform.valid) {


      this.StaffWorkHistoryModel = new StaffWorkHistoryModel();
      this.StaffWorkHistoryModel.EmployerName = this.staffworkform.get('EmployerName').value;
      this.StaffWorkHistoryModel.ContactPerson = this.staffworkform.get('ContactPerson').value;
      this.StaffWorkHistoryModel.EMail = this.staffworkform.get('Email').value;

      this.StaffWorkHistoryModel.CellNo = this.staffworkform.get('CellPhone').value;

      this.StaffWorkHistoryModel.PhoneNo = this.staffworkform.get('PhoneNo').value;

      this.StaffWorkHistoryModel.Address1 = this.staffworkform.get('Address1').value;

      this.StaffWorkHistoryModel.Address2 = this.staffworkform.get('Address2').value;

      this.StaffWorkHistoryModel.Town = this.staffworkform.get('Town').value;

      this.StaffWorkHistoryModel.City = this.staffworkform.get('City').value;
      this.StaffWorkHistoryModel.District = this.staffworkform.get('District').value;

      this.StaffWorkHistoryModel.State = this.staffworkform.get('State').value;
      this.StaffWorkHistoryModel.Country = this.staffworkform.get('Country').value;

      this.StaffWorkHistoryModel.Pincode = this.staffworkform.get('PIN').value;
      this.StaffWorkHistoryModel.FromDate = this.staffworkform.get('FromDate').value;

      this.StaffWorkHistoryModel.ToDate = this.staffworkform.get('ToDate').value;
      this.StaffWorkHistoryModel.AdditionalInfo = this.staffworkform.get('AdditionalInformation').value;
      this.util.showMessage('', 'Staff Work History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.StaffWorkHistoryModel);
        }
      );
    }
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.staffworkform.get('EmployerName').setValue(this.data.EmployerName);
    this.staffworkform.get('ContactPerson').setValue(this.data.ContactPerson);
    this.staffworkform.get('Email').setValue(this.data.EMail);
    this.staffworkform.get('CellPhone').setValue(this.data.CellNo);
    this.staffworkform.get('PhoneNo').setValue(this.data.PhoneNo);
    this.staffworkform.get('Address1').setValue(this.data.Address1);
    this.staffworkform.get('Address2').setValue(this.data.Address2);
    this.staffworkform.get('Town').setValue(this.data.Town);
    this.staffworkform.get('City').setValue(this.data.City);
    this.staffworkform.get('District').setValue(this.data.District);
    this.staffworkform.get('State').setValue(this.data.State);
    this.staffworkform.get('Country').setValue(this.data.Country);
    this.staffworkform.get('PIN').setValue(this.data.Pincode);
    this.staffworkform.get('FromDate').setValue(this.data.FromDate);
    this.staffworkform.get('ToDate').setValue(this.data.ToDate);
    this.staffworkform.get('AdditionalInformation').setValue(this.data.AdditionalInfo);
  }
  //#endregion
  //#region "Clear"
  clear() {
    this.staffworkform.reset();
    this.getdata();
  }
    //#endregion

  //AddressTypeEvent(description) {
  //  this.staffworkform.get('AddressTypeDescription').setValue(description);
  //}
  //#region "Close"
  dialogClose():void{
    this.dialogRef.close();
  }
  //#endregion

}
