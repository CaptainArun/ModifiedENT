import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { eLabService } from '../../eLab.service';
import { eLabMailModel } from '../../models/eLabMailModel';

@Component({
  selector: 'app-eMailComponent',
  templateUrl: './eLab-eMail.component.html',
  styleUrls: ['./eLab-eMail.component.css']
})

export class eMailComponent implements OnInit {

  //#region Property Declaration

  EmailForm: FormGroup;
  eLab: FormArray;
  mailModel: eLabMailModel = new eLabMailModel();
  showMmail: boolean = false;
  //#endregion Property Declaration

  //#region constructor   

  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<eMailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public eLabService: eLabService, private util: UtilService,) { }

  //#endregion constructor

  //#region ngOnInit

  ngOnInit(): void {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.EmailForm = this.fb.group({
      emailid: ["", [Validators.required, Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g)]],
      Password: [""],
      ApprovedBy: [""],
      ReportStatus: [""],
      ReportTime: [""],
      ReportDate: [""],
      SampleCollectedDate: [""],
      CommonNotes: [''],
      eLab: this.fb.array([this.eLabOrder()]),
    });

    if (this.data != null) {
      this.ViewSetValues();
    }

  }

  //#endregion ngOnInit

  //#region eLabOrder dynamic controls

  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: [''],
      SubName: [""],
      Urgency: [""],
      OnDate: [""],
      Value: [""],
      Range: [""],
      Notes: [""],
    })
  }
  get eLabOrderDynamic() {
    return <FormArray>this.EmailForm.get('eLab');
  }

  eLabDynamic(): FormArray {
    return <FormArray>this.EmailForm.get('eLab');
  }

  //#endregion eLabOrder dynamic controls

  //#region View Set Values

  ViewSetValues(): void {
    for (let i = 0; i < this.data.labOrderItems.length; i++) {
      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>(this.EmailForm.controls['eLab']);
      form.controls[i].get('TestName').setValue(this.data.labOrderItems[i].masterTestName);
      form.controls[i].get('SubName').setValue(this.data.labOrderItems[i].subMasterTestName);
      form.controls[i].get('Urgency').setValue(this.data.labOrderItems[i].urgencyDescription);
      form.controls[i].get('OnDate').setValue(new Date(this.data.labOrderItems[i].LabOnDate).toLocaleDateString());
      form.controls[i].get('Notes').setValue(this.data.labOrderItems[i].LabNotes);
      form.controls[i].get('Range').setValue(this.data.labOrderItems[i].NormalRange);

      if (this.data.labOrderItems[i].Value != null) {
        form.controls[i].get('Value').setValue(this.data.labOrderItems[i].Value);
        this.data.labOrderItems[i].red = this.IsRed(parseInt(this.data.labOrderItems[i].NormalRange), parseInt(this.data.labOrderItems[i].NormalRange.split('-')[1]), parseInt(this.data.labOrderItems[i].Value));

      }

      this.eLabOrderDynamic.removeAt(this.data.labOrderItems.length);

    }

    if (this.data.labOrderStatusReport != null) {
      this.showMmail = true;
      let data = this.data.labOrderStatusReport;
      this.EmailForm.get('SampleCollectedDate').setValue(new Date(data.SampleCollectedDate));
      this.EmailForm.get('ReportDate').setValue(new Date(data.ReportDate));
      this.EmailForm.get('ReportTime').setValue(new Date(data.ReportDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      this.EmailForm.get('ReportStatus').setValue(data.ReportStatus);
      this.EmailForm.get('ApprovedBy').setValue(data.ApprovedbyPhysician);
      this.EmailForm.get('CommonNotes').setValue(data.Notes);

    }
  }

  IsRed(rangeStart?: number, rangeEnd?: number, ActualValue?: number): boolean {
    if (rangeStart && rangeEnd && ActualValue) {
      if (rangeStart >= ActualValue || ActualValue >= rangeEnd) {
        return true;
      } else {
        return false;
      }
    } else if (rangeStart && ActualValue && !rangeEnd) {
      if (rangeStart < ActualValue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //#endregion View Set Values

  //#region Other Function

  resetForm(): void {
    this.EmailForm.reset();
    this.ViewSetValues();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

  //#endregion Other Function

  //#region Save Function

  OnFormSubmission(): void {
    if (this.EmailForm.valid) {
      this.mailModel.Content = this.data.LabOrderID;
      this.mailModel.To = this.EmailForm.get('emailid').value;
      this.eLabService.sendMailBylabOrderId(this.mailModel.To, this.mailModel.Content).then((res) => {
        if (res != null) {
          this.util.showMessage("", "Email sent successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            if (res) {
              this.dialogRef.close("Updated");
            }
          });
        }
      });
    }
  }

  //#endregion Save Function
}
