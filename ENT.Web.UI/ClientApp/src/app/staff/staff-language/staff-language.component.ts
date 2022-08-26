import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material'
import { StaffLanguageModel } from '../models/staffLanguageModel';
import { UtilService } from '../../core/util.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { StaffService } from '../staff.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
@Component({
  selector: 'app-staffLanguageComponent',
  templateUrl: './staff-language.component.html',
  styleUrls: ['./staff-language.component.css']
})

export class staffLanguageComponent implements OnInit {

   //#region "Property Decleration"
  stafflanguageform: FormGroup;
  StaffLanguageModel: StaffLanguageModel = new StaffLanguageModel();
  language: any;
  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffLanguageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {

    this.stafflanguageform = this.fb.group({
      Language: ['', Validators.required],
      IsSpeak: [false],
      speaktext: [0],
      Read: [false],
      Readtext: [0],
      Write: [false],
      Writetext: [0],
      LanguageDescription: ['']
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
    this.getLanguage();
  }
  //#endregion

  //#region "Submit"
  submit() {
    this.StaffLanguageModel.Language = this.stafflanguageform.get('Language').value
    this.StaffLanguageModel.LanguageValue = this.stafflanguageform.get('LanguageDescription').value
    this.StaffLanguageModel.IsRead = this.stafflanguageform.get('Read').value
    this.StaffLanguageModel.IsSpeak = this.stafflanguageform.get('IsSpeak').value
    this.StaffLanguageModel.IsWrite = this.stafflanguageform.get('Write').value;

    this.StaffLanguageModel.SpeakingLevel = parseInt(this.stafflanguageform.get('speaktext').value);


    this.StaffLanguageModel.ReadingLevel = parseInt(this.stafflanguageform.get('Readtext').value);

    // this.StaffLanguageModel.Write = other.controls[0].get('Write').value;
    this.StaffLanguageModel.WritingLevel = parseInt(this.stafflanguageform.get('Writetext').value);

    this.util.showMessage('', 'Staff Language details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      (res) => {
        this.dialogRef.close(this.StaffLanguageModel);
      }
    );
 
  }
  //#endregion
//#region "Get data"
  getdata() {
    this.stafflanguageform.get('Language').setValue(this.data.Language);
    this.stafflanguageform.get('LanguageDescription').setValue(this.data.LanguageDescription);
    this.stafflanguageform.get('IsSpeak').setValue(this.data.IsSpeak);
    this.stafflanguageform.get('speaktext').setValue(this.data.SpeakingLevel.toString());
    this.stafflanguageform.get('Read').setValue(this.data.IsRead);
    this.stafflanguageform.get('Readtext').setValue(this.data.ReadingLevel.toString());
    this.stafflanguageform.get('Write').setValue(this.data.IsWrite);
    this.stafflanguageform.get('Writetext').setValue(this.data.WritingLevel.toString());
    this.onspeak();
    this.onread();
    this.onwrite();
  }
  //#endregion
  //#region "Clear"
  clear() {
    this.stafflanguageform.reset();
    this.getdata();
  }
  //#endregion
  //#region "Speak"
  onspeak() {
    if (this.stafflanguageform.get('IsSpeak').value) {
      this.stafflanguageform.get('speaktext').enable();
    } else {
      this.stafflanguageform.get('speaktext').disable();
    }
  }
  //#endregion
  ////#region "Speak"
  //onIsspeak() {
  //  if (this.stafflanguageform.get('IsSpeak').value) {
  //    this.stafflanguageform.get('speaktext').enable();
  //  } else {
  //    this.stafflanguageform.get('speaktext').disable();
  //  }
  //}
  ////#endregion
  //#region "read"
  onread() {
    if (this.stafflanguageform.get('Read').value) {
      this.stafflanguageform.get('Readtext').enable();
    } else {
      this.stafflanguageform.get('Readtext').disable();
    }
  }
  //#endregion
  ////#region "read"
  //onIsread() {
  //  if (this.stafflanguageform.get('Read').value) {
  //    this.stafflanguageform.get('Readtext').enable();
  //  } else {
  //    this.stafflanguageform.get('Readtext').disable();
  //  }
  //}
  ////#endregion
  //#region "write"
  onwrite() {
    if (this.stafflanguageform.get('Write').value) {
      this.stafflanguageform.get('Writetext').enable();
    } else {
      this.stafflanguageform.get('Writetext').disable();
    }
  }
  //#endregion
  ////#region "write"
  //onIswrite() {
  //  if (this.stafflanguageform.get('Write').value) {
  //    this.stafflanguageform.get('Writetext').enable();
  //  } else {
  //    this.stafflanguageform.get('Writetext').disable();
  //  }
  //}
   //#region "Close"
  dialogClose():void{
    this.dialogRef.close();
  }
  //#endregion
  //#region "Language"
  getLanguage() {
    this.staffservice.getLanguage().then(res => {
      this.language = res;
    })
  }
    //#endregion
  //#region "Language Description"
  languagedescription(description) {
    this.stafflanguageform.get('LanguageDescription').setValue(description);

  }
  //#endregion
}
