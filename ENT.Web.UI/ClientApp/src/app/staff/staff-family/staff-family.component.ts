import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
/*import { log } from 'util';*/
import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffFamilyModel } from '../models/staffFamilyModel'
@Component({
  selector: 'app-staffFamilyComponent',
  templateUrl: './staff-family.component.html',
  styleUrls: ['./staff-family.component.css']
})

export class staffFamilyComponent implements OnInit {

    //#region "Property Decleration"

  StaffFamilyModel: StaffFamilyModel = new StaffFamilyModel();
  stafffamilyform: FormGroup;
  salutation: any;
  gender: any;
  relation: any;
  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffFamilyComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.stafffamilyform = this.fb.group({
      Salutation: [''],
      Firstname: ['', Validators.required],
      MiddleName: ['', Validators.required],
      LastName: ['', Validators.required],
      Gender: [''],
      Age: ['', Validators.required],
      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      Relationshiptopatient: [''],
      Occupation:[''],
      AdditionalInformation: [''],
      Salutationdescription: [''],
      RelationshiptopatientValue: [''],
      samecellno: [''],
      GenderValue:[''],
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
    this.getSalutation();
    this.getRelation();
    this.getGender();
  }
  //#endregion

  //#region "Submit"
  submit() {
    if (this.stafffamilyform.valid) {
      this.StaffFamilyModel = new StaffFamilyModel();
      this.StaffFamilyModel.Salutation = this.stafffamilyform.get('Salutation').value;
      this.StaffFamilyModel.SalutationDesc = this.stafffamilyform.get('Salutationdescription').value;
      this.StaffFamilyModel.AdditionalInfo = this.stafffamilyform.get('AdditionalInformation').value;
      this.StaffFamilyModel.FirstName = this.stafffamilyform.get('Firstname').value;

      this.StaffFamilyModel.MiddleName = this.stafffamilyform.get('MiddleName').value;

      this.StaffFamilyModel.LastName = this.stafffamilyform.get('LastName').value;

      this.StaffFamilyModel.Gender = this.stafffamilyform.get('Gender').value;

      this.StaffFamilyModel.GenderDesc = this.stafffamilyform.get('GenderValue').value;

      this.StaffFamilyModel.Age = this.stafffamilyform.get('Age').value;

      this.StaffFamilyModel.CellNo = this.stafffamilyform.get('CellNumber').value;
      this.StaffFamilyModel.PhoneNo = this.stafffamilyform.get('PhoneNumber').value;

      this.StaffFamilyModel.WhatsAppNo = this.stafffamilyform.get('WhatsAppNumber').value;

      this.StaffFamilyModel.EMail = this.stafffamilyform.get('Email').value;
      this.StaffFamilyModel.AdditionalInfo = this.stafffamilyform.get('AdditionalInformation').value;
      this.StaffFamilyModel.Occupation = this.stafffamilyform.get('Occupation').value;
      this.StaffFamilyModel.RelationshipToEmployee = this.stafffamilyform.get('Relationshiptopatient').value;
      this.StaffFamilyModel.RelationshipToEmployeeDesc = this.stafffamilyform.get('RelationshiptopatientValue').value;
      this.util.showMessage('', 'Staff Family details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.StaffFamilyModel);
        }
      );
    }
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.stafffamilyform.get('Salutation').setValue(this.data.Salutation);
    this.stafffamilyform.get('Salutationdescription').setValue(this.data.SalutationDesc);
    this.stafffamilyform.get('Firstname').setValue(this.data.FirstName);
    this.stafffamilyform.get('MiddleName').setValue(this.data.MiddleName);
    this.stafffamilyform.get('LastName').setValue(this.data.LastName);
    this.stafffamilyform.get('Gender').setValue(this.data.Gender);
    this.stafffamilyform.get('GenderValue').setValue(this.data.GenderDesc);
    this.stafffamilyform.get('Age').setValue(this.data.Age);
    this.stafffamilyform.get('CellNumber').setValue(this.data.CellNo);
    this.stafffamilyform.get('PhoneNumber').setValue(this.data.PhoneNo);
    this.stafffamilyform.get('WhatsAppNumber').setValue(this.data.WhatsAppNo);
    this.stafffamilyform.get('Email').setValue(this.data.EMail);
    this.stafffamilyform.get('Relationshiptopatient').setValue(this.data.RelationshipToEmployee);
    this.stafffamilyform.get('RelationshiptopatientValue').setValue(this.data.RelationshipToEmployeeDesc);
    this.stafffamilyform.get('Occupation').setValue(this.data.Occupation);
    this.stafffamilyform.get('AdditionalInformation').setValue(this.data.AdditionalInfo);
  }
  //#endregion
  //#region "Clear"
  clear() {
    this.stafffamilyform.reset();
    this.getdata();
  }
  //#endregion
   //#region "Close"
  dialogClose():void{
    this.dialogRef.close();
  }
    //#endregion
  //#region "Relationshiptopatient"
  RelationshipToPatient(description) {
    this.stafffamilyform.get('RelationshiptopatientValue').setValue(description);
  }
      //#endregion
  //#region "CellNo"
  samecell() {
    if (this.stafffamilyform.get('samecellno').value) {
      this.stafffamilyform.get('WhatsAppNumber').setValue(this.stafffamilyform.get('CellNumber').value);
    } else {
      this.stafffamilyform.get('WhatsAppNumber').setValue("");
    }

  }
  //#endregion
  //#region "Salutaion"
  salutationdescription(description) {
    this.stafffamilyform.get('Salutationdescription').setValue(description);

  }
    //#endregion
  //#region "Gender description"
  genderdescription(description) {
    this.stafffamilyform.get('GenderValue').setValue(description);
  }
      //#endregion

  //#region Salutation
  getSalutation() {
    this.staffservice.getSalutation().then(res => {
      this.salutation = res;
    })
  }
  //#endregion
  //#region Gender
  getGender() {
    this.staffservice.getGender().then(res => {
      this.gender = res;
    })
  }
  //#endregion
  //#region Relation
  getRelation() {
    this.staffservice.getRelation().then(res => {
      this.relation = res;
    })
  }
  //#endregion
}
