import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { StaffService } from '../staff.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffHobbyModel } from '../models/staffHobbyModel'
import { CustomHttpService } from '../../core/custom-http.service';
@Component({
  selector: 'app-staffHobbyComponent',
  templateUrl: './staff-hobby.component.html',
  styleUrls: ['./staff-hobby.component.css']
})

export class staffHobbyComponent implements OnInit {


  form: FormGroup;
  StaffHobbyModel: StaffHobbyModel = new StaffHobbyModel();
  ExtracurricularActivitiesType: any;
  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffHobbyComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.form = this.fb.group({
      ActivityType: ['', Validators.required],
      Detailsname: [''],
      ActivityTypeDescription: ['']
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
    this.getExtracurricularActivitiesType();
  }
  //#endregion

  //#region "Submit"
  submit() {
    this.StaffHobbyModel.ActivityType = this.form.get('ActivityType').value
    this.StaffHobbyModel.ActivityTypeDescription = this.form.get('ActivityTypeDescription').value
    this.StaffHobbyModel.Details = this.form.get('Detailsname').value

    this.util.showMessage('', 'Staff Hobby details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      (res) => {
        this.dialogRef.close(this.StaffHobbyModel);
      }
    );

  }


  getdata() {
    this.form.get('ActivityType').setValue(this.data.ActivityType);
    this.form.get('ActivityTypeDescription').setValue(this.data.ActivityTypeDescription);
    this.form.get('Detailsname').setValue(this.data.Details);

  }
  clear() {
    this.form.reset();
    this.getdata();
  }
  ActivityType(description) {
    this.form.get('ActivityTypeDescription').setValue(description);
  }

  //#region "getExtracurricularActivitiesType"
  getExtracurricularActivitiesType() {
    this.staffservice.getExtracurricularActivitiesType().then(res => {
      this.ExtracurricularActivitiesType = res;
    })
  }
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion
}
