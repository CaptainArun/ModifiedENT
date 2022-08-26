import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { PatientFamilyHistoryModel } from '../models/PatientFamilyHistoryModel';

import { FamilyHealthHistoryViewComponent } from './family-health-history-view/family-health-history-view.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamilyHealthHistoryEditComponent } from './family-health-history-edit/family-health-history-edit.component';
import { FamilyHealthHistoryAddComponent } from './family-health-history-add/family-health-history-add.component';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-patient-family-history',
  templateUrl: './patient-family-history.component.html',
  styleUrls: ['./patient-family-history.component.css']
})
export class PatientFamilyHistoryComponent implements OnInit {

  PatientFamilyHistoryForm: FormGroup;
  PatientFamilyHistoryModel: PatientFamilyHistoryModel = new PatientFamilyHistoryModel();
  patientId: number;
  //icd: string;
  //facilityId: number = 0;
  //recordby: any;
  data: any[] = [];
  //visitDandt: any[] = [];
  identification: any;
  //recordedDuring: any = '';
  
  tableconfig: TableConfig = new TableConfig();
  
  //visitID: number;
 // familyHistoryTable: any;

  
  


  constructor(public fb: FormBuilder, public patfamser: NewPatientService, public custHttp: CustomHttpService,
    public dialog: MatDialog, private config: UtilService, public activateRoute: ActivatedRoute) {
    this.tableconfig.showPagination = true;
    this.tableconfig.showView = true;
    this.tableconfig.showIcon = false;
    this.tableconfig.showEdit = true;
    this.tableconfig.showAdd = false;
    this.tableconfig.showDelete = true;


    this.tableconfig.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '', isVisible: true},
      {PropertyName: 'FamilyMemberName', DisplayName: 'Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'Relationship', DisplayName: 'Relationship to Patient', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'IllnessType', DisplayName: 'Illness Type', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'DiagnosisNotes', DisplayName: 'Diagnosis', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'ProblemStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'ICDCode', DisplayName: 'ICD Code', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {PropertyName: 'PhysicianName', DisplayName: 'Physician Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
     //{ PropertyName: 'AdditionalNotes', DisplayName: 'Additional Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: false }

    ];
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.patfamser.patientId = this.patientId;
    });
    this.getfamilyHealth();
  }

  

  getfamilyHealth() {
    this.patfamser.getFamilyHealthHistory(this.patfamser.patientId).then(res => {
      this.identification = res;      
    });

  }

  openAddUpdateform() {
    const dialogRef = this.dialog.open(FamilyHealthHistoryAddComponent, {
     
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Update") {
        this.getfamilyHealth();
      }
    });

  }

  openFamilyEditRecord(element: any) {
    
    this.patfamser.getFamilyHealthHistorybyID(element.Item.FamilyHealthHistoryID).then(data => {
      
      var patientDetail = data;
      let dialogRef = this.dialog.open(FamilyHealthHistoryEditComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Update") {
          this.getfamilyHealth();
        }
      });
    });
    
  }



  openFamilyViewRecord(element: any) {
   
    this.patfamser.getFamilyHealthHistorybyID(element.Item.FamilyHealthHistoryID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(FamilyHealthHistoryViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
    });
   
  }

  deleteFamilyHealthHistory(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {

          this.patfamser.deletePatientFamilyHistory(element.Item.FamilyHealthHistoryID).then(res => {
            this.getfamilyHealth();
          })
        }
      });
  }
  
}
