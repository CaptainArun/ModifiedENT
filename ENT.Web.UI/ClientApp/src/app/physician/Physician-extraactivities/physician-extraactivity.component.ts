import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PhysicianContactInfoModel } from '../models/physicianContactInfoModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { PhysicianExtraActivitiesModel } from '../models/physicianExtraActivitiesModel';

@Component({
  selector: 'app-PhysicianExtraActivityComponent',
  templateUrl: './physician-extraactivity.component.html',
  styleUrls: ['./physician-extraactivity.component.css']
})
export class PhysicianExtraActivityComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  extraActivitiesModel: PhysicianExtraActivitiesModel = new PhysicianExtraActivitiesModel();
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private util: UtilService, public dialogRef: MatDialogRef<PhysicianExtraActivityComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({

      NatureOfActivity: ['', Validators.required],
      YearOfParticipation: ['', Validators.required],
      PrizesorAwards: ['', Validators.required],
      StrengthandAreaneedImprovement: [''],
    });
    this.getdata();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('NatureOfActivity').setValue(this.data.NatureOfActivity);
    this.form.get('YearOfParticipation').setValue(this.data.YearOfParticipation);
    this.form.get('PrizesorAwards').setValue(this.data.PrizesorAwards);
    this.form.get('StrengthandAreaneedImprovement').setValue(this.data.StrengthandAreaneedImprovement);
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
      this.extraActivitiesModel = new PhysicianExtraActivitiesModel();
      this.extraActivitiesModel.NatureOfActivity = this.form.get('NatureOfActivity').value;
      this.extraActivitiesModel.YearOfParticipation = this.form.get('YearOfParticipation').value;
      this.extraActivitiesModel.PrizesorAwards = this.form.get('PrizesorAwards').value;
      this.extraActivitiesModel.StrengthandAreaneedImprovement = this.form.get('StrengthandAreaneedImprovement').value;
      this.util.showMessage('', 'Physician ExtraActivity details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.extraActivitiesModel);
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
