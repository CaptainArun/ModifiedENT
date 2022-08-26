import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientWorkHistoryModel } from '../../models/PatientWorkHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-work-history-edit',
  templateUrl: './work-history-edit.component.html',
  styleUrls: ['./work-history-edit.component.css']
})
export class WorkHistoryEditComponent implements OnInit {
 //#region "Property Decleration"
  PatientWorkHistoryEditForm: FormGroup;

  PatientWorkHistoryEditModel: PatientWorkHistoryModel = new PatientWorkHistoryModel;
  patientId: any = 1;
  visitDateTime: any[] = [];
  recordedDuring: any = '';
  visitID: any;
  facilityID: number = 0;
  recordby: any[] = [];
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
    //#endregion
  //#region "constructor"
  constructor(public workHistoryService: NewPatientService, public fb: FormBuilder, public dialogRef: MatDialogRef<WorkHistoryEditComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, public custHttp: CustomHttpService, private util: UtilService) { }
     //#endregion
   //#region "ngOnInit"
  ngOnInit() {
    this.PatientWorkHistoryEditForm = this.fb.group({

      PatientWorkHistoryID: [''],
      VisitID: [''],
      RecordedDate: ['', Validators.required],
      RecordedBy: [''],
      EmployerName: [''],
      ContactPerson: [''],
      Email:['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      CellPhone: [''],
      PhoneNo: ['', Validators.required],
      AddressLine1: [''],
      AddressLine2: [''],
      Town: [''],
      City: [''],
      District: [''],
      State: [''],
      Country: [''],
      PIN: [''],
      WorkDateFrom: [''],
      WorkDateTo: [''],
      AdditionalNotes: [''],
      RecordedTime: [''],
      visitDateandTime: [''],
      recordedDuring: ['']


    })
    this.getPatientWorkHistory();
    this.setUpdateWorkHistory();
    this.getProviderName();
    this.CheckValidDate();
    this.PatientWorkHistoryEditForm.get('visitDateandTime').disable();
    this.PatientWorkHistoryEditForm.get('recordedDuring').disable();
  }
       //#endregion

  //#region Validate Date
  public CheckValidDate(): void {
    this.PatientWorkHistoryEditForm.get('WorkDateFrom').valueChanges.subscribe((EffectiveDate: any) => {
      if ((new Date(this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryEditForm.get('WorkDateTo').value))
        && ((this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) != "" && (this.PatientWorkHistoryEditForm.get('WorkDateTo').value) != null)
        && ((this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) != "" && (this.PatientWorkHistoryEditForm.get('WorkDateTo').value) != null))
      if (new Date(this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryEditForm.get('WorkDateTo').value)) {
        this.util.showMessage("Yes", "WorkDateTo must be greater than WorkDateFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.PatientWorkHistoryEditForm.get('WorkDateFrom').setValue("");
        });    //} else {
        //  this.submitdisable = false;
        //}

      }
    });


    this.PatientWorkHistoryEditForm.get('WorkDateTo').valueChanges.subscribe((StartDate: any) => {
      if ((new Date(this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryEditForm.get('WorkDateTo').value))
        && ((this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) != "" && (this.PatientWorkHistoryEditForm.get('WorkDateTo').value) != null)
        && ((this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) != "" && (this.PatientWorkHistoryEditForm.get('WorkDateTo').value) != null))
        if (new Date(this.PatientWorkHistoryEditForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryEditForm.get('WorkDateTo').value)) {
          this.util.showMessage("Yes", "WorkDateTo must be greater than WorkDateFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            this.PatientWorkHistoryEditForm.get('WorkDateTo').setValue("");
          });  //} else {
          //  this.submitdisable = false;
          //}

        }
 
    });
  }
      //#endregion
   //#region "sendDate"
  sendDateWithTime() {

    this.getDate = new Date(this.PatientWorkHistoryEditForm.get("RecordedDate").value);

    if (this.PatientWorkHistoryEditForm.get("RecordedDate").value != "") {
      if (this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.PatientWorkHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;

  }
   //#endregion
   //#region "Set data"
  setUpdateWorkHistory() {
    this.PatientWorkHistoryEditForm.get('PatientWorkHistoryID').setValue(this.data1.PatientWorkHistoryID);
    this.PatientWorkHistoryEditForm.get('VisitID').setValue(this.data1.VisitID);
    this.PatientWorkHistoryEditForm.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.PatientWorkHistoryEditForm.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.PatientWorkHistoryEditForm.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.PatientWorkHistoryEditForm.get('EmployerName').setValue(this.data1.EmployerName);
    this.PatientWorkHistoryEditForm.get('ContactPerson').setValue(this.data1.ContactPerson);
    this.PatientWorkHistoryEditForm.get('Email').setValue(this.data1.Email);
    this.PatientWorkHistoryEditForm.get('CellPhone').setValue(this.data1.CellPhone);
    this.PatientWorkHistoryEditForm.get('PhoneNo').setValue(this.data1.PhoneNo);
    this.PatientWorkHistoryEditForm.get('AddressLine1').setValue(this.data1.AddressLine1);
    this.PatientWorkHistoryEditForm.get('AddressLine2').setValue(this.data1.AddressLine2);
    this.PatientWorkHistoryEditForm.get('Town').setValue(this.data1.Town);
    this.PatientWorkHistoryEditForm.get('City').setValue(this.data1.City);
    this.PatientWorkHistoryEditForm.get('District').setValue(this.data1.District);
    this.PatientWorkHistoryEditForm.get('State').setValue(this.data1.State);
    this.PatientWorkHistoryEditForm.get('Country').setValue(this.data1.Country);
    this.PatientWorkHistoryEditForm.get('PIN').setValue(this.data1.PIN);
    this.PatientWorkHistoryEditForm.get('WorkDateFrom').setValue(this.data1.WorkDateFrom);
    this.PatientWorkHistoryEditForm.get('WorkDateTo').setValue(this.data1.WorkDateTo);
    this.PatientWorkHistoryEditForm.get('AdditionalNotes').setValue(this.data1.AdditionalNotes);
    //this.PatientWorkHistoryEditForm.get('RecordedTime').setValue(this.data1.RecordedTime);
    this.PatientWorkHistoryEditForm.get('visitDateandTime').setValue(this.data1.visitDateandTime);
    this.PatientWorkHistoryEditForm.get('recordedDuring').setValue(this.data1.recordedDuring);
  }
     //#endregion
    //#region "update"

  updateWorkHistory() {
    this.sendDateWithTime();
    this.PatientWorkHistoryEditModel.PatientWorkHistoryID = this.data1.PatientWorkHistoryID; //this.PatientWorkHistoryEditForm.get('PatientWorkHistoryID').value;
    this.PatientWorkHistoryEditModel.VisitID = this.data1.VisitID;  //this.PatientWorkHistoryEditForm.get('VisitID').value;
    this.PatientWorkHistoryEditModel.RecordedDate = this.getDateAndTime;
    this.PatientWorkHistoryEditModel.RecordedBy = this.PatientWorkHistoryEditForm.get('RecordedBy').value;
    this.PatientWorkHistoryEditModel.EmployerName = this.PatientWorkHistoryEditForm.get('EmployerName').value;
    this.PatientWorkHistoryEditModel.ContactPerson = this.PatientWorkHistoryEditForm.get('ContactPerson').value;
    this.PatientWorkHistoryEditModel.Email = this.PatientWorkHistoryEditForm.get('Email').value;
    this.PatientWorkHistoryEditModel.CellPhone = this.PatientWorkHistoryEditForm.get('CellPhone').value;
    this.PatientWorkHistoryEditModel.PhoneNo = this.PatientWorkHistoryEditForm.get('PhoneNo').value;
    this.PatientWorkHistoryEditModel.AddressLine1 = this.PatientWorkHistoryEditForm.get('AddressLine1').value;
    this.PatientWorkHistoryEditModel.AddressLine2 = this.PatientWorkHistoryEditForm.get('AddressLine2').value;
    this.PatientWorkHistoryEditModel.Town = this.PatientWorkHistoryEditForm.get('Town').value;
    this.PatientWorkHistoryEditModel.City = this.PatientWorkHistoryEditForm.get('City').value;
    this.PatientWorkHistoryEditModel.District = this.PatientWorkHistoryEditForm.get('District').value;
    this.PatientWorkHistoryEditModel.State = this.PatientWorkHistoryEditForm.get('State').value;
    this.PatientWorkHistoryEditModel.Country = this.PatientWorkHistoryEditForm.get('Country').value;
    this.PatientWorkHistoryEditModel.PIN = this.PatientWorkHistoryEditForm.get('PIN').value;
    this.PatientWorkHistoryEditModel.WorkDateFrom = this.PatientWorkHistoryEditForm.get('WorkDateFrom').value;
    this.PatientWorkHistoryEditModel.WorkDateTo = this.PatientWorkHistoryEditForm.get('WorkDateTo').value;
    this.PatientWorkHistoryEditModel.AdditionalNotes = this.PatientWorkHistoryEditForm.get('AdditionalNotes').value;
    this.PatientWorkHistoryEditModel.RecordedTime = this.PatientWorkHistoryEditForm.get('RecordedTime').value;
    this.PatientWorkHistoryEditModel.visitDateandTime = this.PatientWorkHistoryEditForm.get('visitDateandTime').value;
    this.PatientWorkHistoryEditModel.recordedDuring = this.PatientWorkHistoryEditForm.get('recordedDuring').value;

    this.workHistoryService.addUpdateWorkHistory(this.PatientWorkHistoryEditModel).then(data => {
      this.util.showMessage('', 'Work History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.dialogRef.close("update");

    })


  }
       //#endregion
   //#region "getPatientWorkHistory"

  getPatientWorkHistory() {
    this.workHistoryService.GetVisitsForPatient(this.workHistoryService.patientId).then(res => {
     

      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        //this.identification[i] = res[i].VisitId;
      }

    })

  }
       //#endregion
    //#region "RecordedDuring"
  RecordedDuring(index: any) {
    this.workHistoryService.GetVisitsForPatient(this.workHistoryService.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].visitID;
        }
      }
    })
  }
         //#endregion
   //#region "recordby"
  getProviderName() {
    this.workHistoryService.GetProviderNames(this.facilityID).then(res => {
      this.recordby = res;
      
    })
  }
   //#endregion
   //#region "Cancel"
  cancelData() {
    this.PatientWorkHistoryEditForm.reset();
    this.setUpdateWorkHistory();
  }
     //#endregion
   //#region "Close"
  dialogClose(): void {
    this.dialogRef.close();
  }
       //#endregion

}
