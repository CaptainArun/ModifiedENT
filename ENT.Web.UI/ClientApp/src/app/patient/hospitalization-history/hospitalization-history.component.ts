import { Component, OnInit, ViewChild } from '@angular/core';
import { hospitalizationHistoryModel } from '../models/hospitalizationHistoryModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HospitalizationHistoryViewRecordComponent } from './hospitalization-history-view-record/hospitalization-history-view-record.component';
import { HospitalizationHistoryEditRecordComponent } from './hospitalization-history-edit-record/hospitalization-history-edit-record.component';
import { HospitalizationHistoryAddRecordComponent } from './hospitalization-history-add-record/hospitalization-history-add-record.component';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';

@Component({
  selector: 'app-hospitalization-history',
  templateUrl: './hospitalization-history.component.html',
  styleUrls: ['./hospitalization-history.component.css']
})
export class HospitalizationHistoryComponent implements OnInit {

  @ViewChild('requiredDoc', { static: false }) requiredDoc: any;
  hospitalHistoryModel: hospitalizationHistoryModel = new hospitalizationHistoryModel;
  tableConfig: TableConfig = new TableConfig;
  patientID: number;
  patientList: any;
  deleteRecord: any;
  constructor(public newPatientService: NewPatientService,private config: UtilService, public dialog: MatDialog, public custHttp: CustomHttpService,private activatedRoute: ActivatedRoute) {
   this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      // { PropertyName: 'AdmissionDate', DisplayName: 'Admission Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      // { PropertyName: 'AdmissionType', DisplayName: 'Admission Type', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'InitialAdmissionStatus', DisplayName: 'Initial Admission Status', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'AdmittingPhysician', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'AttendingPhysician', DisplayName: 'Attending Physician', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ChiefComplaint', DisplayName: 'Chief Complaint', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'FacilityName', DisplayName: 'Facility', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'PrimaryDiagnosis', DisplayName: 'Primary Diagnosis', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ICDCode', DisplayName: 'ICD Code', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ProcedureType', DisplayName: 'Procedure Type', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'PrimaryProcedure', DisplayName: 'Primary Procedure', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'CPTCode', DisplayName: 'CPT Code', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ProblemStatus', DisplayName: 'ProblemStatus', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'DischargeDate', DisplayName: 'Discharge Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      // { PropertyName: 'DischargeStatusCode', DisplayName: 'Discharge Status Code', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'AdditionalNotes', DisplayName: 'Additional Notes', DisplayMode: 'Text', LinkUrl: '' }

      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AdmissionDate', DisplayName: 'Admission Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'AdmissionType', DisplayName: 'Admission type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'InitialAdmissionStatus', DisplayName: 'Initial Admission status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AdmittingPhysician', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ICDCode', DisplayName: 'Primary ICD Code', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProcedureType', DisplayName: 'Procedure type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemStatus', DisplayName: 'Problem Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DischargeDate', DisplayName: 'Discharge date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    ];

    this.activatedRoute.params.subscribe(params => {
      this.patientID = params['PatientId'];
  
      });
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
   this.getTotalHospitalHistory();
    this.ChooseDeleteRecord();
  }


  //Add record
  addPatient() {
    const viewDetails = this.dialog.open(HospitalizationHistoryAddRecordComponent, {
      data:this.patientID,
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    viewDetails.afterClosed().subscribe(result => {
      if (result == "Updated") {
        this.getTotalHospitalHistory();
      }
    })
  }

  //patientList
  getTotalHospitalHistory() {
    this.newPatientService.GetHospitalizationHistory(this.patientID).then(res => {
      this.patientList = res;
    });
  }

  //view record
  viewHospitalHistory(element: any) {
   this.newPatientService.GetHospitalizationRecordbyID(element.Item.HospitalizationID).then(data => {
    let patientDetail = data;
      const viewDetails = this.dialog.open(HospitalizationHistoryViewRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
    });
  }
  //update
  updateHospitalHistory(element: any) {
    this.newPatientService.GetHospitalizationRecordbyID(element.Item.HospitalizationID).then(res => {
      let editRecord = res;
      let editDetails = this.dialog.open(HospitalizationHistoryEditRecordComponent, {
        data: editRecord,
        height: 'auto',
        width: 'auto',
        autoFocus: true,
      })

      editDetails.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTotalHospitalHistory();
        }
      })
    })
  }
  //delete
  ChooseDeleteRecord() {
   this.newPatientService.GetHospitalizationHistory(this.patientID).then(res => {
      this.deleteRecord = res;
    })
  }
  //delete

deleteHospitalHistory(data: any){
 this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
   (res: any) => {
    if (res == true) {
      this.newPatientService.DeleteHospitalizationRecord(data.Item.HospitalizationID).then(res => {
       this.getTotalHospitalHistory();
    })
      }
     });
 }
 
}
