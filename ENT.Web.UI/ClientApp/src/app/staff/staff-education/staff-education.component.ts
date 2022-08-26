import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffEducationModel } from '../models/staffEducationModel';
@Component({
  selector: 'app-staffEducationComponent',
  templateUrl: './staff-education.component.html',
  styleUrls: ['./staff-education.component.css']
})

export class staffEducationComponent implements OnInit {

  //#region "Property Decleration"
  staffeducationform: FormGroup;
  Yeardata: any;
  currentyear: any
  yearindex: any;
  //length = 1970;
  newyear = [new Date().getFullYear()];
  StaffEducationModel: StaffEducationModel = new StaffEducationModel();

  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffEducationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.staffeducationform = this.fb.group({
      University: ['', Validators.required],
      Month: ['', Validators.required],
      MonthValue: [''],
      Year: ['', Validators.required],
      InstituteName: ['', Validators.required],
      Percentage: [''],
      Branch: ['', Validators.required],
      MainSubject: [''],
      Scholorship: [''],
      Qualification: [''],
      Duration: [''],
      PlaceOfInstitute: [''],
      RegistrationAuthority: [''],
      RegistrationNo: [''],
      RegistrationExpiryDate: [''],
      AdditionalInfo:['']
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
    this.year();
  }
  //#endregion

  //#region "Month"
  Month = [
    { id: 1, Value: '01', month: 'January' },
    { id: 2, Value: '02', month: 'Feburary' },
    { id: 3, Value: '03', month: 'March' },
    { id: 4, Value: '04', month: 'April' },
    { id: 5, Value: '05', month: 'May' },
    { id: 6, Value: '06', month: 'june' },
    { id: 7, Value: '07', month: 'July' },
    { id: 8, Value: '08', month: 'August' },
    { id: 9, Value: '09', month: 'September' },
    { id: 10, Value: '10', month: 'October' },
    { id: 11, Value: '11', month: 'November' },
    { id: 12, Value: '12', month: 'December' },
  ];
  //#endregion
  //#region "Submit"
  submit() {
    if (this.staffeducationform.valid) {

      this.StaffEducationModel = new StaffEducationModel();
      this.StaffEducationModel.University = this.staffeducationform.get('University').value;
      // this.StaffEducationModel.p = qualification.controls[0].get('PhoneNumber').value;
      this.StaffEducationModel.InstituteName = this.staffeducationform.get('InstituteName').value;

      this.StaffEducationModel.Branch = this.staffeducationform.get('Branch').value;

      this.StaffEducationModel.MainSubject = this.staffeducationform.get('MainSubject').value;

      this.StaffEducationModel.Scholorship = this.staffeducationform.get('Scholorship').value;

      this.StaffEducationModel.Qualification = this.staffeducationform.get('Qualification').value;
      this.StaffEducationModel.Percentage = this.staffeducationform.get('Percentage').value;

      this.StaffEducationModel.Month = this.staffeducationform.get('Month').value;
      this.StaffEducationModel.MonthValue = this.staffeducationform.get('MonthValue').value;


      this.StaffEducationModel.Year = this.staffeducationform.get('Year').value;

      this.StaffEducationModel.PlaceOfInstitute = this.staffeducationform.get('PlaceOfInstitute').value;


      //education.controls[0].get('EducationTypeValue').setValue(description);

      this.StaffEducationModel.Duration = this.staffeducationform.get('Duration').value;

      this.StaffEducationModel.RegistrationAuthority = this.staffeducationform.get('RegistrationAuthority').value;
      this.StaffEducationModel.RegistrationNo = this.staffeducationform.get('RegistrationNo').value;

      this.StaffEducationModel.RegistrationExpiryDate = this.staffeducationform.get('RegistrationExpiryDate').value;
      this.StaffEducationModel.AdditionalInfo = this.staffeducationform.get('AdditionalInfo').value;
      this.util.showMessage('', 'Staff Education details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.StaffEducationModel);
        }
      );
    }
  }
   //#endregion
//#region "get data"
  getdata() {

    this.staffeducationform.get('University').setValue(this.data.University);
    this.staffeducationform.get('Month').setValue(this.data.Month);
    this.staffeducationform.get('Year').setValue(this.data.Year);
    this.staffeducationform.get('InstituteName').setValue(this.data.InstituteName);
    this.staffeducationform.get('Percentage').setValue(this.data.Percentage);
    this.staffeducationform.get('Branch').setValue(this.data.Branch);
    this.staffeducationform.get('MainSubject').setValue(this.data.MainSubject);
    this.staffeducationform.get('Scholorship').setValue(this.data.Scholorship);
    this.staffeducationform.get('Qualification').setValue(this.data.Qualification);
    this.staffeducationform.get('Duration').setValue(this.data.Duration);
    this.staffeducationform.get('PlaceOfInstitute').setValue(this.data.PlaceOfInstitute);
    this.staffeducationform.get('RegistrationAuthority').setValue(this.data.RegistrationAuthority);
    this.staffeducationform.get('RegistrationNo').setValue(this.data.RegistrationNo);
    this.staffeducationform.get('RegistrationExpiryDate').setValue(this.data.RegistrationExpiryDate);
    this.staffeducationform.get('AdditionalInfo').setValue(this.data.AdditionalInfo);
  }
  //#endregion
  //#region "Clear"
  clear() {
    this.staffeducationform.reset();
    this.getdata();
  }
  //#endregion
  //AddressTypeEvent(description) {
  //  this.staffeducationform.get('AddressTypeDescription').setValue(description);
  //}
  //#region "Close"
  dialogClose():void{
    this.dialogRef.close();
  }
  //#endregion
  //#region "Year"
  year() {
    this.Yeardata = []
    this.currentyear = this.newyear;
    for (this.yearindex = this.currentyear; this.yearindex > (this.currentyear - 70); this.yearindex--) {
      this.Yeardata.push(this.yearindex);

    }
  }
    //#endregion
  //#region "Month"
  Monthvalue(description) {
    this.staffeducationform.get('MonthValue').setValue(description);
  }
  //#endregion


}
