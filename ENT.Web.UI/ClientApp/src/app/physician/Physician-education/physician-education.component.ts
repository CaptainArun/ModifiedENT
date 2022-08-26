import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { PhysicianEducationalDetailsModel } from '../models/physicianEducationalDetailsModel';

@Component({
  selector: 'app-PhysicianEducationComponent',
  templateUrl: './physician-education.component.html',
  styleUrls: ['./physician-education.component.css']
})
export class PhysicianEducationComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  educationalModel: PhysicianEducationalDetailsModel = new PhysicianEducationalDetailsModel();
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private util: UtilService, public dialogRef: MatDialogRef<PhysicianEducationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({
      //ProviderEducationId: [''],
      //ProviderID: [''],
      EducationType: ['', Validators.required],
      BoardorUniversity: ['', Validators.required],
      MonthandYearOfPassing: ['', Validators.required],
      NameOfSchoolorCollege: ['', Validators.required],
      MainSubjects: ['', Validators.required],
      PercentageofMarks: ['', Validators.required],
      HonoursorScholarshipHeading: [''],
      ProjectWorkUndertakenHeading: [''],
      PublicationsorPapers: [''],
      Qualification: ['', Validators.required],
      DurationOfQualification: ['', Validators.required],
      NameOfInstitution: ['', Validators.required],
      PlaceOfInstitution: [''],
      RegisterationAuthority: [''],
      RegisterationNumber: ['', Validators.required],
      ExpiryOfRegisterationNumber: ['', Validators.required],
    });
    this.getdata();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('EducationType').setValue(this.data.EducationType);
    this.form.get('BoardorUniversity').setValue(this.data.BoardorUniversity);
    this.form.get('MonthandYearOfPassing').setValue(this.data.MonthandYearOfPassing);
    this.form.get('NameOfSchoolorCollege').setValue(this.data.NameOfSchoolorCollege);
    this.form.get('MainSubjects').setValue(this.data.MainSubjects);
    this.form.get('PercentageofMarks').setValue(this.data.PercentageofMarks);
    this.form.get('HonoursorScholarshipHeading').setValue(this.data.HonoursorScholarshipHeading);
    this.form.get('ProjectWorkUndertakenHeading').setValue(this.data.ProjectWorkUndertakenHeading);
    this.form.get('PublicationsorPapers').setValue(this.data.PublicationsorPapers);
    this.form.get('Qualification').setValue(this.data.Qualification);
    this.form.get('DurationOfQualification').setValue(this.data.DurationOfQualification);
    this.form.get('NameOfInstitution').setValue(this.data.NameOfInstitution);
    this.form.get('PlaceOfInstitution').setValue(this.data.PlaceOfInstitution);
    this.form.get('RegisterationAuthority').setValue(this.data.RegisterationAuthority);
    this.form.get('RegisterationNumber').setValue(this.data.RegisterationNumber);
    this.form.get('ExpiryOfRegisterationNumber').setValue(this.data.ExpiryOfRegisterationNumber);
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

        this.educationalModel = new PhysicianEducationalDetailsModel();
        this.educationalModel.EducationType = this.form.get('EducationType').value;
        this.educationalModel.BoardorUniversity = this.form.get('BoardorUniversity').value;
        this.educationalModel.MonthandYearOfPassing = this.form.get('MonthandYearOfPassing').value;
        this.educationalModel.NameOfSchoolorCollege = this.form.get('NameOfSchoolorCollege').value;
        this.educationalModel.MainSubjects = this.form.get('MainSubjects').value;
        this.educationalModel.PercentageofMarks = this.form.get('PercentageofMarks').value;
        this.educationalModel.HonoursorScholarshipHeading = this.form.get('HonoursorScholarshipHeading').value;
        this.educationalModel.ProjectWorkUndertakenHeading = this.form.get('ProjectWorkUndertakenHeading').value;
        this.educationalModel.PublicationsorPapers = this.form.get('PublicationsorPapers').value;
        this.educationalModel.Qualification = this.form.get('Qualification').value;
        this.educationalModel.DurationOfQualification = this.form.get('DurationOfQualification').value;
        this.educationalModel.NameOfInstitution = this.form.get('NameOfInstitution').value;
        this.educationalModel.PlaceOfInstitution = this.form.get('PlaceOfInstitution').value;
        this.educationalModel.RegisterationAuthority = this.form.get('RegisterationAuthority').value;
        this.educationalModel.RegisterationNumber = this.form.get('RegisterationNumber').value;
        this.educationalModel.ExpiryOfRegisterationNumber = this.form.get('ExpiryOfRegisterationNumber').value;
      this.util.showMessage('', 'Physician Education details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.educationalModel);
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

}
