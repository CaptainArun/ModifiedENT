import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { TriageELabRequestModel } from '../models/triageELabRequestModel';
import { TriageService } from '../triage.service';

@Component({
  selector: 'triage-editElabOrder',
  templateUrl: 'triage-editElabOrder.component.html',
  styleUrls: ['triage-editElabOrder.component.css']
})

export class TriageEditElabOrderComponent implements OnInit {
  eLabOrderForm: FormGroup;
  eLabRequestModel: TriageELabRequestModel = new TriageELabRequestModel();
  testName: any;
  testNameId: any;
  urgencyName: any;
  eLabData: any;
  setValue: any;
  eLabDetails: any;
  isLabRequestconfirmed: boolean = false;

  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<TriageEditElabOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private triageSvc: TriageService, private util: UtilService, public customHttp: CustomHttpService) { }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.eLabOrderForm = this.fb.group({
      eLab: this.fb.array([this.eLabOrder()])
    });
    if(this.data.record){
      this.setValue = this.data.record;
      this.setELabData();
    }
    this.bindUrgency();
    this.triageSvc.getVisitRecordById(this.data.visitId).then(data => {
      this.eLabDetails = data;
    });
  }

  eLabOrder(): FormGroup {
    return this.fb.group({
      SetupMasterID: ['', Validators.required],
      TestName: ['', Validators.required],
      Urgency: ['', Validators.required],
      Date: ['', Validators.required],
      Notes: ['', Validators.required]
    });
  }

  get eLabDynamic() {
    return <FormArray>this.eLabOrderForm.get('eLab');
  }

  getTestNameList(index) {
    const control = <FormArray>this.eLabOrderForm.controls['eLab'];
    this.testName = [];
    control.controls[index].get('SetupMasterID').setValue(0);
    let key = control.controls[index].get('TestName').value;
    if (key != null && key != undefined && key != '') {
      if (key.length > 2) {
        this.triageSvc.getELabTestName(key).then(data => {
          if (data.length > 0) {
            this.testName = data;
          }
          else {
            this.testName = [];
            control.controls[index].get('SetupMasterID').setValue(0);
          }
        });
      }
      else {
        this.testName = null;
        control.controls[index].get('SetupMasterID').setValue(0);
      }
    }
    else {
      this.testName = null;
      control.controls[index].get('SetupMasterID').setValue(0);
    }
  }

  SetupMasterID(index, SetupMasterID) {
    const setvalue = <FormArray>this.eLabOrderForm.controls['eLab'];
    setvalue.controls[index].get('SetupMasterID').setValue(SetupMasterID);
  }

  toValidateTestName(index: number) {
    const items = <FormArray>this.eLabOrderForm.controls['eLab'];
    if (!(items.controls[index].get('SetupMasterID').value > 0)) {
      items.controls[index].get('TestName').setValue('');
    }
  }

  bindUrgency() {
    this.triageSvc.getUrgencyId().then(data => {
      this.urgencyName = data;
    });
  }

  setELabData() {
    this.eLabData = this.setValue;
    if (this.setValue != undefined && this.setValue != null) {
      
      for (let i = 0; i < this.setValue.labRequestItems.length; i++) {
        this.eLabDynamic.push(this.eLabOrder());
        const control = <FormArray>this.eLabOrderForm.controls['eLab'];
        control.controls[i].get('SetupMasterID').setValue(this.setValue.labRequestItems[i].SetupMasterID);
        control.controls[i].get('TestName').setValue(this.setValue.labRequestItems[i].setupMasterDesc);
        control.controls[i].get('Urgency').setValue(this.setValue.labRequestItems[i].UrgencyCode);
        control.controls[i].get('Date').setValue(this.setValue.labRequestItems[i].LabOnDate);
        control.controls[i].get('Notes').setValue(this.setValue.labRequestItems[i].LabNotes);
        this.eLabDynamic.removeAt(this.setValue.labRequestItems.length);
      }
      if (this.setValue.LabOrderStatus == 'Confirmed') {
        this.isLabRequestconfirmed = true;
        this.eLabOrderForm.get('eLab').disable();
      }
      else {
        this.isLabRequestconfirmed = false;
      }
    }
  }

  onAddRowLabOrder() {
    this.eLabDynamic.push(this.eLabOrder());
    this.testName = null;
  }

  onRemoveRowLabOrder(rowIndex: number) {
    this.eLabDynamic.removeAt(rowIndex);
  }

  submitData() {
    if (this.eLabOrderForm.valid && this.eLabOrderForm.controls['eLab'].valid) {
      this.eLabRequestModel.labRequestItems = [];
      const control = <FormArray>this.eLabOrderForm.controls['eLab'];
      for (let row of control.controls) {
        this.eLabRequestModel.labRequestItems.push({
          LabRequestItemsID: 0,
          LabRequestID: 0,
          SetupMasterID: row.get('SetupMasterID').value,
          UrgencyCode: row.get('Urgency').value,
          LabOnDate: row.get('Date').value,
          LabNotes: row.get('Notes').value,
        });
      }
      this.eLabRequestModel.LabRequestID = 0;
      this.eLabRequestModel.VisitID = this.data.visitId;
      this.eLabRequestModel.AdmissionID = 0;

      this.triageSvc.addUpdateELabRequest(this.eLabRequestModel).then(res => {
        this.util.showMessage('', 'e-Lab order data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
          if (res === true) {
            this.dialogRef.close('update');
          }
        });
      });
    }
  }

  resetForm() {
    if (this.eLabData == null) {
      this.eLabOrderForm.reset();
      this.eLabDynamic.clear();
      this.onAddRowLabOrder();
    }
    else {
      this.eLabOrderForm.reset();
      this.eLabDynamic.clear();
      this.setELabData();
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

}
