import { Component, OnInit, ViewChild } from '@angular/core';
import { hospitalizationHistoryModel } from '../models/hospitalizationHistoryModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { PatientAdmissionViewRecordComponent } from './patient-admission-view/patient-admission-view.component';

@Component({
  selector: 'app-patient-admission',
  templateUrl: './patient-admission-home.component.html',
  styleUrls: ['./patient-admission-home.component.css']
})
export class PatientAdmissionHomeComponent implements OnInit {

  tableConfig: TableConfig = new TableConfig;
  patientID: number;
  patientList: any;
  constructor(public newPatientService: NewPatientService,private config: UtilService, public dialog: MatDialog, public custHttp: CustomHttpService,private activatedRoute: ActivatedRoute) {
   this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = false;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'AdmissionNo', DisplayName: 'Admission Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AdmissionDateTime', DisplayName: 'Admission Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'admissionTypeDesc', DisplayName: 'Admission Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProviderName', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'specialityName', DisplayName: 'Speciality', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProcedureDesc', DisplayName: 'Procedure Name (Short)', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'UrgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'arrivalCondition', DisplayName: 'Patient Arrival Condition', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'admissionStatusDesc', DisplayName: 'Initial Admission Status', DisplayMode: 'Text', LinkUrl: '' },
    ]; 


    this.activatedRoute.params.subscribe(params => {
      this.patientID = params['PatientId'];
  
      });
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
   this.getTotalHospitalHistory();
  }


  

  //patientList
  getTotalHospitalHistory() {
    this.newPatientService.GetpatientadmissionID(this.patientID).then(res => {
      this.patientList = res;
    });
  }

  //view record
  viewPatient(element: any) {
    this.newPatientService.Getpatientadmissionview(element.Item.AdmissionID).then(data => {
      var patientDetail = data;
      const viewDetails = this.dialog.open(PatientAdmissionViewRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: '75%',
        autoFocus: false,
      });
    });
  }



 
}

