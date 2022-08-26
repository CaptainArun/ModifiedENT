import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientWorkHistoryModel } from '../../models/PatientWorkHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../../core/util.service';

@Component({
  selector: 'app-work-history-add',
  templateUrl: './work-history-add.component.html',
  styleUrls: ['./work-history-add.component.css']
})
export class WorkHistoryAddComponent implements OnInit {
    //#region "Property Decleration"
  PatientWorkHistoryForm: FormGroup;
  PatientWorkHistoryModel: PatientWorkHistoryModel = new PatientWorkHistoryModel();
  identification: any[] = [];
  visitDateTime: any[] = [];
  //tableData: any;
  recordby: any[] = [];
  recordedDuring: any = '';
  visitID: number;

  patientId: number = 1;
  facilityID: number = 0;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  //#endregion

  //#region "constructor"
  constructor(public fb: FormBuilder, public PatientSer: NewPatientService, public customhttp: CustomHttpService, public dialogue: MatDialog, public dialogRef: MatDialogRef<WorkHistoryAddComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, public util: UtilService) { }
   //#endregion

   //#region "ngOnInit"
  ngOnInit() {
    this.PatientWorkHistoryForm = this.fb.group({
      PatientWorkHistoryID: [''],
      VisitID: [''],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ['', Validators.required],
      EmployerName: ['', Validators.required],
      ContactPerson: [''],
      Email: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
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
      WorkDateFrom: ['', Validators.required],
      WorkDateTo: ['', Validators.required],
      AdditionalNotes: [''],
      /*Createddate: [''],
      CreatedBy: [''],
      ModifiedDate: [''],
      ModifiedBy: [''],*/
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['']
    });

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));

    this.getserviceData();
    
    this.getProviderName();
    this.CheckValidDate();
  }
   //#endregion
  //#region Validate Date
  public CheckValidDate(): void {
    this.PatientWorkHistoryForm.get('WorkDateFrom').valueChanges.subscribe((EffectiveDate: any) => {
      if (new Date(this.PatientWorkHistoryForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryForm.get('WorkDateTo').value)) {
        this.util.showMessage("Yes", "WorkDateTo must be greater than WorkDateFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.PatientWorkHistoryForm.get('WorkDateFrom').setValue("");
        });    //} else {
        //  this.submitdisable = false;
        //}

      }

    });

      this.PatientWorkHistoryForm.get('WorkDateTo').valueChanges.subscribe((StartDate: any) => {
        if (new Date(this.PatientWorkHistoryForm.get('WorkDateFrom').value) > new Date(this.PatientWorkHistoryForm.get('WorkDateTo').value)) {
          this.util.showMessage("Yes", "WorkDateTo must be greater than WorkDateFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            this.PatientWorkHistoryForm.get('WorkDateTo').setValue("");
          });  //} else {
          //  this.submitdisable = false;
          //}

        }
    
 });
}
      //#endregion
   //#region "Send Date"
  sendDateWithTime() {

    this.getDate = new Date(this.PatientWorkHistoryForm.get("RecordedDate").value);

    if (this.PatientWorkHistoryForm.get("RecordedDate").value != "") {
      if (this.PatientWorkHistoryForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.PatientWorkHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.PatientWorkHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.PatientWorkHistoryForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.PatientWorkHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.PatientWorkHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.PatientWorkHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }
   //#endregion
 //#region "Submit"
  addUpdateData() {
    if (this.PatientWorkHistoryForm.valid) {

    this.sendDateWithTime();

    this.PatientWorkHistoryModel.PatientWorkHistoryID = 0;//this.PatientWorkHistoryForm.get('PatientWorkHistoryID').value;
    this.PatientWorkHistoryModel.VisitID = this.visitID; //this.PatientWorkHistoryForm.get('VisitID').value;
    this.PatientWorkHistoryModel.RecordedDate = this.getDateAndTime;
    this.PatientWorkHistoryModel.RecordedBy = this.PatientWorkHistoryForm.get('RecordedBy').value;
    this.PatientWorkHistoryModel.EmployerName = this.PatientWorkHistoryForm.get('EmployerName').value;
    this.PatientWorkHistoryModel.ContactPerson = this.PatientWorkHistoryForm.get('ContactPerson').value;
    this.PatientWorkHistoryModel.Email = this.PatientWorkHistoryForm.get('Email').value;
    this.PatientWorkHistoryModel.CellPhone = this.PatientWorkHistoryForm.get('CellPhone').value;
    this.PatientWorkHistoryModel.PhoneNo = this.PatientWorkHistoryForm.get('PhoneNo').value;
    this.PatientWorkHistoryModel.AddressLine1 = this.PatientWorkHistoryForm.get('AddressLine1').value;
    this.PatientWorkHistoryModel.AddressLine2 = this.PatientWorkHistoryForm.get('AddressLine2').value;
    this.PatientWorkHistoryModel.Town = this.PatientWorkHistoryForm.get('Town').value;
    this.PatientWorkHistoryModel.City = this.PatientWorkHistoryForm.get('City').value;
    this.PatientWorkHistoryModel.District = this.PatientWorkHistoryForm.get('District').value;
    this.PatientWorkHistoryModel.State = this.PatientWorkHistoryForm.get('State').value;
    this.PatientWorkHistoryModel.Country = this.PatientWorkHistoryForm.get('Country').value;
    this.PatientWorkHistoryModel.PIN = this.PatientWorkHistoryForm.get('PIN').value;
    this.PatientWorkHistoryModel.WorkDateFrom = this.PatientWorkHistoryForm.get('WorkDateFrom').value;
    this.PatientWorkHistoryModel.WorkDateTo = this.PatientWorkHistoryForm.get('WorkDateTo').value;
    this.PatientWorkHistoryModel.AdditionalNotes = this.PatientWorkHistoryForm.get('AdditionalNotes').value;
    /*this.PatientWorkHistoryModel.Createddate = this.PatientWorkHistoryForm.get('Createddate').value;
    this.PatientWorkHistoryModel.CreatedBy = this.PatientWorkHistoryForm.get('CreatedBy').value;
    this.PatientWorkHistoryModel.ModifiedDate = this.PatientWorkHistoryForm.get('ModifiedDate').value;
    this.PatientWorkHistoryModel.ModifiedBy = this.PatientWorkHistoryForm.get('ModifiedBy').value;*/
    //this.PatientWorkHistoryModel.RecordedTime = this.PatientWorkHistoryForm.get('RecordedTime').value;
    this.PatientWorkHistoryModel.visitDateandTime = this.PatientWorkHistoryForm.get('visitDateandTime').value;
    this.PatientWorkHistoryModel.recordedDuring = this.PatientWorkHistoryForm.get('recordedDuring').value;


    this.PatientSer.addUpdateWorkHistory(this.PatientWorkHistoryModel).then(res => {
      this.util.showMessage('', 'Work History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.dialogRef.close("update");

      //this.cancelData();

    })

  }
  }
     //#endregion
  //#region "Identification"
  getserviceData() {
    this.PatientSer.GetVisitsForPatient(this.PatientSer.patientId).then(res => {
      

      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.identification[i] = res[i].VisitId;
      }

    })

  }
   //#endregion
    //#region "RecordedDuring"

  RecordedDuring(index: any) {
    this.PatientSer.GetVisitsForPatient(this.PatientSer.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.PatientWorkHistoryForm.get("recordedDuring").setValue(this.recordedDuring);

        }
      }
    })
  }

    //#endregion
  //#region "recordby"
  getProviderName() {
    this.PatientSer.GetProviderNames(this.facilityID).then(res => {
      this.recordby = res;
      
    })
  }
      //#endregion
   //#region "Close"
  dialogClose(): void {
    this.dialogRef.close();
  }
        //#endregion
   //#region "cancelData"
  cancelData() {
    this.PatientWorkHistoryForm.reset();
    this.PatientWorkHistoryForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));

   this. recordedDuring = '';
  }
   //#endregion
}
