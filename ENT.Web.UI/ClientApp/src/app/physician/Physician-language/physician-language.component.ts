import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PhysicianContactInfoModel } from '../models/physicianContactInfoModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { PhysicianLanguageModel } from '../models/physicianLanguageModel';
import { PhysicianService } from '../physician.service';

@Component({
  selector: 'app-PhysicianLanguageComponent',
  templateUrl: './physician-language.component.html',
  styleUrls: ['./physician-language.component.css']
})
export class PhysicianLanguageComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  language: any;
  languageModel: PhysicianLanguageModel = new PhysicianLanguageModel();
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private physicianservice: PhysicianService, private util: UtilService, public dialogRef: MatDialogRef<PhysicianLanguageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#Endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({
      Language: ['', Validators.required],
      IsSpeak: [false],
      SpeakingLevel: [0],
      IsRead: [false],
      ReadingLevel: [0],
      IsWrite: [false],
      WritingLevel: [0]
    });
    //this.form.get('SpeakingLevel').disable();
    //this.form.get('ReadingLevel').disable();
    //this.form.get('WritingLevel').disable();
    this.getdata();
    this.getlanguageforPhysician();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('Language').setValue(this.data.Language);
    this.form.get('IsSpeak').setValue(this.data.IsSpeak);
    this.form.get('SpeakingLevel').setValue(this.data.SpeakingLevel.toString());
    this.form.get('IsRead').setValue(this.data.IsRead);
    this.form.get('ReadingLevel').setValue(this.data.ReadingLevel.toString());
    this.form.get('IsWrite').setValue(this.data.IsWrite);
    this.form.get('WritingLevel').setValue(this.data.WritingLevel.toString());
    this.onspeak();
    this.onread();
    this.onwrite();
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
      this.languageModel = new PhysicianLanguageModel();
      this.languageModel.Language = this.form.get('Language').value;
      this.languageModel.IsSpeak = this.form.get('IsSpeak').value;
      this.languageModel.SpeakingLevel = this.form.get('SpeakingLevel').value;
      this.languageModel.IsRead = this.form.get('IsRead').value;
      this.languageModel.ReadingLevel = this.form.get('ReadingLevel').value;
      this.languageModel.IsWrite = this.form.get('IsWrite').value;
      this.languageModel.WritingLevel = this.form.get('WritingLevel').value;

      this.util.showMessage('', 'Physician Language details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.languageModel);
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
  //#region "Language"
  getlanguageforPhysician() {
    this.physicianservice.getLanguageforPhysician().then(res => {
      this.language = res;
    })
  }
  //#endregion
  //#region "Write"
  onwrite() {
    if (this.form.get('IsWrite').value) {
      this.form.get('WritingLevel').enable();
      this.form.get('WritingLevel').setValidators(Validators.required)
    } else {
      this.form.get('WritingLevel').disable();
    }
  }
  //#endregion
  //#region "Speak"
  onspeak() {
    if (this.form.get('IsSpeak').value) {
      this.form.get('SpeakingLevel').enable();
      this.form.get('SpeakingLevel').setValidators(Validators.required)
    } else {
      this.form.get('SpeakingLevel').disable();
    }
  }
  //#endregion
  //#region "Read"
  onread() {
    if (this.form.get('IsRead').value) {
      this.form.get('ReadingLevel').enable();
      this.form.get('ReadingLevel').setValidators(Validators.required)
    } else {
      this.form.get('ReadingLevel').disable();
    }
  }
  //#endregion

  //#endregion

  ////#region "Read"
  //onIsread() {
  //  if (this.form.get('IsRead').value) {
  //    this.form.get('ReadingLevel').enable();
  //  } else {
  //    this.form.get('ReadingLevel').disable();
  //  }
  //}
  ////#endregion

   ////#region "write"
  //onIswrite() {
  //  if (this.form.get('IsWrite').value) {
  //    this.form.get('WritingLevel').enable();
  //  } else {
  //    this.form.get('WritingLevel').disable();
  //  }
  //}
  ////#endregion


   ////#region "set speaking level"
  //onIsSpeak() {
  //  if (this.form.get('IsSpeak').value) {
  //    this.form.get('SpeakingLevel').enable();
  //  } else {
  //    this.form.get('SpeakingLevel').disable();
  //  }
  //}
}
