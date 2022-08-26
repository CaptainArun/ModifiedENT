import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { eLabService } from '../../../eLab.service';

@Component({
  selector: 'app-eLabNewRequestViewComponent',
  templateUrl: './eLab-request-view.component.html',
  styleUrls: ['./eLab-request-view.component.css']
})

export class eLabNewRequestViewComponent implements OnInit {
  //#region Property Declaration
  eLabOrderForm: FormGroup;
  patientId: number = 0;
  visitDateandtimeView: any = "";
  PhysicianNameView: any = "";
  IsVisitDate: boolean;
  AdmissionDateandtimeView: any = "";
  //#endregion Property Declaration

  //#region constructor
  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<eLabNewRequestViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public eLabService: eLabService,) {
  }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.eLabOrderForm = this.fb.group({
      eLab: this.fb.array([this.eLabOrder()]),
    });

    this.ViewSetValues();
  }
  //#endregion ngOnInit

  //#region eLabOrder dynamic controls
  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: [''],
      UrgencyView: [''],
      DateView: [''],
      Notes: [''],
    })
  }

  get eLabOrderDynamic() {
    return <FormArray>this.eLabOrderForm.get('eLab');
  }
  //#endregion eLabOrder dynamic controls

  //#region View Set Values
  ViewSetValues() {

    this.patientId = this.data.patientId;

    if (this.data.visitDateandTime != null) {

      this.visitDateandtimeView = (this.data.visitDateandTime);
      this.IsVisitDate = true;
    } else {

      this.AdmissionDateandtimeView = (this.data.AdmissionDateandTime);
      this.IsVisitDate = false;
    }

    this.PhysicianNameView = (this.data.RequestingPhysician);

    for (let i = 0; i < this.data.labRequestItems.length; i++) {

      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>(this.eLabOrderForm.controls['eLab']);

      form.controls[i].get('TestName').setValue(this.data.labRequestItems[i].setupMasterDesc);
      form.controls[i].get('UrgencyView').setValue(this.data.labRequestItems[i].urgencyDescription);
      form.controls[i].get('DateView').setValue(new Date(this.data.labRequestItems[i].LabOnDate).toLocaleDateString());
      form.controls[i].get('Notes').setValue(this.data.labRequestItems[i].LabNotes);

      this.eLabOrderDynamic.removeAt(this.data.labRequestItems.length);
    }

  }
  //#endregion View Set Values

  //#region Close the form
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion Close the form

}
