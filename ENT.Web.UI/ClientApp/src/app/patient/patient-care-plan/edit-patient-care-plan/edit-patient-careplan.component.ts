import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarePlanModel } from '../../../triage/models/carePlanModel';
import { TriageService } from '../../../triage/triage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { NewPatientService } from '../../newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-edit-patient-careplan',
  templateUrl: './edit-patient-careplan.component.html',
  styleUrls: ['./edit-patient-careplan.component.css']
})
export class EditPatientCarePlanComponent implements OnInit {
  careplanform: FormGroup;
  carePlanModel: CarePlanModel = new CarePlanModel();
  patientId: number = 1;
  selectedIndex: any;
  status: any;
  progress: any;
  visitDateTime: any[] = [];
  visitID: number;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  recordedDuring: any = '';
  facilityId: number = 0;
  recordby: string;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private triageSvc: TriageService,
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<EditPatientCarePlanComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService,
    public newpatsvc: NewPatientService) {
  }
 ngOnInit() {
    this.careplanform = this.fb.group({
      VisitDateandTime: [''],
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      recordedDuring: [''],
      AdditionalNotes: ['',Validators.required],
      PlanningActivity: [''],
      Duration: [''],
      StartDate: [''],
      EndDate: [''],
      CarePlanStatus: [''],
      Progress: [''],
      NextVisitDate: [''],
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getProviderNames();
    this.getVisitForPatient();
   this.setcareplanForm();
   this.getcareplanstatus();
   this.getcareplanprogress();
   this.careplanform.get("VisitDateandTime").disable();
   this.careplanform.get("recordedDuring").disable();
   this.CheckValidDate();
 }
  //#region Validate Date
  public CheckValidDate(): void {
    this.careplanform.get('StartDate').valueChanges.subscribe((EffectiveDate: any) => {
      if ((new Date(this.careplanform.get('StartDate').value) > new Date(this.careplanform.get('EndDate').value))
        && ((this.careplanform.get('StartDate').value) != "" && (this.careplanform.get('StartDate').value) != null)
        && ((this.careplanform.get('EndDate').value) != "" && (this.careplanform.get('EndDate').value) != null)) {
        this.util.showMessage("Yes", "EndDate must be greater than StartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.careplanform.get('StartDate').setValue("");
        });
      }
    });


    this.careplanform.get('EndDate').valueChanges.subscribe((StartDate: any) => {
      if ((new Date(this.careplanform.get('StartDate').value) > new Date(this.careplanform.get('EndDate').value))
        && ((this.careplanform.get('StartDate').value) != "" && (this.careplanform.get('StartDate').value) != null)
        && ((this.careplanform.get('EndDate').value) != "" && (this.careplanform.get('EndDate').value) != null))
        if (new Date(this.careplanform.get('StartDate').value) > new Date(this.careplanform.get('EndDate').value)) {
          this.util.showMessage("Yes", "EndDate must be greater than StartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            this.careplanform.get('EndDate').setValue("");
            //} else {
            //  this.submitdisable = false;
            //}
          });
        }
    });
  }
      //#endregion
  //visit date and time
  getVisitForPatient() {
    this.triageSvc.getVisitForPatient(this.newpatsvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    })
 }
  //Record during
  RecordedDuring(index: any) {
 this.triageSvc.getVisitForPatient(this.newpatsvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
        }
      }
    })
  }
  //recordby
  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;
   })
  }
  //set data
  setcareplanForm() {
  
    this.careplanform.get('VisitDateandTime').setValue(this.data1.visitDateandTime);
    this.careplanform.get('recordedDuring').setValue(this.data1.recordedDuring);
    this.careplanform.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.careplanform.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.careplanform.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.careplanform.get('PlanningActivity').setValue (window.atob(this.data1.PlanningActivity));
    this.careplanform.get('Duration').setValue(this.data1.Duration);
    this.careplanform.get('StartDate').setValue(this.data1.StartDate);
    this.careplanform.get('EndDate').setValue(this.data1.EndDate);
    this.careplanform.get('CarePlanStatus').setValue(this.data1.CarePlanStatus);
    this.careplanform.get('Progress').setValue(this.data1.Progress);
    this.careplanform.get('NextVisitDate').setValue(this.data1.NextVisitDate);
    this.careplanform.get('AdditionalNotes').setValue(this.data1.AdditionalNotes);
  }
  //submit
  addUpdateProcedureVisitcase() {
    if (this.careplanform.valid) { 
      this.sendDateWithTime();
    this.carePlanModel.CarePlanId = this.data1.CarePlanId;
    this.carePlanModel.VisitID = this.data1.VisitID;
    this.carePlanModel.RecordedDate = this.getDateAndTime;
    this.carePlanModel.RecordedBy = this.careplanform.get('RecordedBy').value;
      this.carePlanModel.PlanningActivity = window.btoa(this.careplanform.get('PlanningActivity').value);
    this.carePlanModel.Duration = this.careplanform.get('Duration').value;
    this.carePlanModel.StartDate = this.careplanform.get('StartDate').value;
    this.carePlanModel.EndDate = this.careplanform.get('EndDate').value;
    this.carePlanModel.CarePlanStatus = this.careplanform.get('CarePlanStatus').value;
    this.carePlanModel.Progress = this.careplanform.get('Progress').value;
    this.carePlanModel.NextVisitDate = this.careplanform.get('NextVisitDate').value;
    this.carePlanModel.AdditionalNotes = this.careplanform.get('AdditionalNotes').value;


    this.triageSvc.addUpdateCareplan(this.carePlanModel).then(data => {

      this.selectedIndex = 2;
      this.util.showMessage('', 'Patient Care Plan saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
    });
    this.dialogRef.close("update");
  }
  }
  //close
  dialogClose(): void {
    this.dialogRef.close();
  }
  close() {
    this.careplanform.reset();
    this.setcareplanForm();
  }
  getcareplanstatus() {
    this.triageSvc.getcareplanstatus().then(res => {
      this.status = res;

    })
  }
  getcareplanprogress() {
    this.triageSvc.getcareplanprogress().then(res => {
      this.progress = res;
    })
  }
  sendDateWithTime() {
    this.getDate = new Date(this.careplanform.get("RecordedDate").value);
    if (this.careplanform.get("RecordedDate").value != "") {
      if (
        this.careplanform
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "pm"
      ) {
        if (
          parseInt(
            this.careplanform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH =
            parseInt(
              this.careplanform
                .get("RecordedTime")
                .value.toString()
                .split(" ")[0]
                .toString()
                .split(":")[0]
            ) + 12;
        }
      } else if (
        this.careplanform
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.careplanform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(
            this.careplanform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(
        this.careplanform
          .get("RecordedTime")
          .value.toString()
          .split(" ")[0]
          .toString()
          .split(":")[1]
      );
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }
}
