import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarePlanModel } from '../../../triage/models/carePlanModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TriageService } from '../../../triage/triage.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-add-patient-careplan',
  templateUrl: './add-patient-careplan.component.html',
  styleUrls: ['./add-patient-careplan.component.css']
})
export class AdddPatientCarePlanComponent implements OnInit {
  careplanform: FormGroup;
  carePlanModel: CarePlanModel = new CarePlanModel();
  patientId: number = 1;
 facilityId: number = 0;
  recordby: any;
  //data: any[] = [];
  visitDateTime: any[] = [];
   recordedDuring: any = '';
  visitID: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  selectedIndex: any;
  progress: any;
  status: any;
constructor(public fb: FormBuilder, public newpatsvc: NewPatientService, public triageSvc: TriageService, public custHttp: CustomHttpService, public DialogRef: MatDialogRef<AdddPatientCarePlanComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService) {
   }
 ngOnInit() {
    this.careplanform = this.fb.group({
      PlanningActivity: [''],
      Notes: ['',Validators.required],
      Duration: [''],
      StartDate: [''],
      EndDate: [''],
      CarePlanStatus: [''],
      Progress: [''],
      NextVisitDate:[''],
      VisitDateandTime: ['',Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      recordedDuring: [''],
      RecordedBy:  ['', Validators.required],
          });
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getDateTime();
   this.getProviderName();
   this.getcareplanprogress();
   this.getcareplanstatus();
   this.CheckValidDate();
}
 //#region Validate Date
 public CheckValidDate(): void {
  this.careplanform.get('StartDate').valueChanges.subscribe((EffectiveDate: any) => {
    if (new Date(this.careplanform.get('StartDate').value) > new Date(this.careplanform.get('EndDate').value)) {
      this.util.showMessage("Yes", "EndDate must be greater than StartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        this.careplanform.get('StartDate').setValue("");
      });    //} else {
      //  this.submitdisable = false;
      //}

    }

  });

  this.careplanform.get('EndDate').valueChanges.subscribe((StartDate: any) => {
    if (new Date(this.careplanform.get('StartDate').value) > new Date(this.careplanform.get('EndDate').value)) {
      this.util.showMessage("Yes", "EndDate must be greater than StartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        this.careplanform.get('EndDate').setValue("");
      });  //} else {
      //  this.submitdisable = false;
      //}

    }

  });
}
    //#endregion
  //Date and Time
  getDateTime() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
       }
    })
  }
  //Recorded Date
  sendDateWithTime() {

    this.getDate = new Date(this.careplanform.get("RecordedDate").value);

    if (this.careplanform.get("RecordedDate").value != "") {
      if (this.careplanform.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.careplanform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.careplanform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.careplanform.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.careplanform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.careplanform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.careplanform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }
 //Submit
  addCareplanForm() {
    if (this.careplanform.valid) {
      this.sendDateWithTime();
      this.carePlanModel.VisitID = this.visitID;
      this.carePlanModel.RecordedDate = this.getDateAndTime;
      this.carePlanModel.RecordedBy = this.careplanform.get('RecordedBy').value;
      this.carePlanModel.PlanningActivity = window.btoa(this.careplanform.get('PlanningActivity').value);
      this.carePlanModel.Duration = this.careplanform.get('Duration').value;
      this.carePlanModel.StartDate = this.careplanform.get('StartDate').value;
      this.carePlanModel.EndDate = this.careplanform.get('EndDate').value;
      this.carePlanModel.CarePlanStatus = this.careplanform.get('CarePlanStatus').value;
      this.carePlanModel.Progress = this.careplanform.get('Progress').value;
      this.carePlanModel.NextVisitDate = this.careplanform.get('NextVisitDate').value;
      this.carePlanModel.AdditionalNotes = this.careplanform.get('Notes').value;

      this.triageSvc.addUpdateCareplan(this.carePlanModel).then(data => {
        this.selectedIndex = 2;
        this.util.showMessage('', 'Patient Care Plan saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            this.DialogRef.close("Update");
          }
        );
      });
    }
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
 //Recorded During
  RecordedDuring(index: any) {

    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          //          this.visitID = data[i].visitID;
          this.careplanform.get('recordedDuring').setValue(this.recordedDuring);
        }
      }
    })
  }
 //Record By
  getProviderName() {
    this.newpatsvc.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;

    })
  }
  //close
  dialogClose(): void {
    this.DialogRef.close();
  }
  Close() {

    this.careplanform.reset();
    this.careplanform.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.recordedDuring = "";
  }
}
