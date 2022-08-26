import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHttpService } from '../../../core/custom-http.service';
import { NewPatientService } from '../../newPatient.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { documentManagementModel } from '../../models/documentManagementModel';

@Component({
  selector: 'app-document-management-add',
  templateUrl: './document-management-add.component.html',
  styleUrls: ['./document-management-add.component.css']
})
export class DocumentManagementAddComponent implements OnInit {

  DocumentManagementForm: FormGroup;
  DocumentManagementModel: documentManagementModel = new documentManagementModel();
  tableData: any;
  recordedDuring: any = '';
  visitID: any;
  patientId: number = 1;
  visitDandT: any[] = [];

  facilityId: number = 0;
  recordby: any[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;

  constructor(public fb: FormBuilder, public custhttp: CustomHttpService, public serv: NewPatientService, public dialogue: MatDialog, public dialogRef: MatDialogRef<DocumentManagementAddComponent>, @Inject(MAT_DIALOG_DATA) public data1: any) { }

  ngOnInit() {
    this.DocumentManagementForm = this.fb.group({

      DocumentID: [''],
      VisitID: [''],
      RecordedDate: [''],
      RecordedBy: ['', Validators.required],
      DocumentName: [''],
      DocumentType: ['', Validators.required],
      DocumentNotes: [''],
      /*IsActive: [''],
      Createddate: [''],
      CreatedBy: [''],
      ModifiedDate: [''],
      ModifiedBy: [''],*/
      RecordedTime: ['', Validators.required],
      PatientName: [''],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['', Validators.required]

    });

    this.custhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getvisitDate();
    this.getProviderName();
  }
  getvisitDate() {
    this.serv.GetVisitsForPatient(this.patientId).then(res => {
     
      for (var i = 0; i < res.length; i++) {
        this.visitDandT[i] = res[i].VisitDateandTime;

      }
    });

  }

  sendDateWithTime() {

    this.getDate = new Date(this.DocumentManagementForm.get("RecordedDate").value);

    if (this.DocumentManagementForm.get("RecordedDate").value != "") {
      if (this.DocumentManagementForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.DocumentManagementForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.DocumentManagementForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.DocumentManagementForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.DocumentManagementForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.DocumentManagementForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.DocumentManagementForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }

  addUpdateDoc() {

    this.sendDateWithTime();

    this.DocumentManagementModel.DocumentID = 1;//this.DocumentManagementForm.get('DocumentID').value;
    this.DocumentManagementModel.VisitID = 1;
    this.DocumentManagementModel.RecordedDate = this.getDateAndTime;
    this.DocumentManagementModel.RecordedBy = this.DocumentManagementForm.get('RecordedBy').value;
    this.DocumentManagementModel.DocumentName = this.DocumentManagementForm.get('DocumentName').value;
    this.DocumentManagementModel.DocumentType = this.DocumentManagementForm.get('DocumentType').value;
    this.DocumentManagementModel.DocumentNotes = this.DocumentManagementForm.get('DocumentNotes').value;
    /* this.DocumentManagementModel.IsActive = this.DocumentManagementForm.get('IsActive').value;
     this.DocumentManagementModel.Createddate = this.DocumentManagementForm.get('Createddate').value;
     this.DocumentManagementModel.CreatedBy = this.DocumentManagementForm.get('CreatedBy').value;
     this.DocumentManagementModel.ModifiedDate = this.DocumentManagementForm.get('ModifiedDate').value;
     this.DocumentManagementModel.ModifiedBy = this.DocumentManagementForm.get('ModifiedBy').value;*/
    //this.DocumentManagementModel.RecordedTime = this.DocumentManagementForm.get('RecordedTime').value;
    this.DocumentManagementModel.PatientName = this.DocumentManagementForm.get('PatientName').value;
    this.DocumentManagementModel.visitDateandTime = this.DocumentManagementForm.get('visitDateandTime').value;
    this.DocumentManagementModel.recordedDuring = this.DocumentManagementForm.get('recordedDuring').value;


    this.serv.addUpdateDocumentManagement(this.DocumentManagementModel).then(data => {

    })
    this.dialogClose();
    this.dialogRef.close("update");
  }


  RecordedDuring(index: any) {
    this.serv.GetVisitsForPatient(this.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].visitID;
        }
      }
    })
  }
  getProviderName() {
    this.serv.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
      

    })
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
