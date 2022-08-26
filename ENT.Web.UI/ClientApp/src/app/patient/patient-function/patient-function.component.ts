import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FunctionalCognitiveModel } from '../../triage/models/functionalCognitiveModel';
import { TableConfig } from '../../ux/columnConfig';
import { CustomHttpService } from '../../core/custom-http.service';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { PatientFuntionViewComponent } from './patient-funtion-view/patient-funtion-view.component';
import { PatientFuntionAddComponent } from './patient-funtion-add/patient-funtion-add.component';
import { PatientFuntionEditComponent } from './patient-funtion-edit/patient-funtion-edit.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-function',
  templateUrl: './patient-function.component.html',
  styleUrls: ['./patient-function.component.css']
})
export class PatientFunctionComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: number;
  FuncData: any;


  constructor(public customhttp: CustomHttpService, public newPatsvc: NewPatientService, public dialogue: MatDialog, public activateRoute: ActivatedRoute, public config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RecordedDate', DisplayName: 'Recorded Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },
      { PropertyName: 'RecordedBy', DisplayName: 'Recorded By', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Gait', DisplayName: 'Gait', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'GaitNotes', DisplayName: 'Gait Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'ICD10', DisplayName: 'ICD Code', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'CPT', DisplayName: 'CPT Code', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Balance', DisplayName: 'Balance', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BalanceNotes', DisplayName: 'Balance Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'NeuromuscularNotes', DisplayName: 'Neuromuscular Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Mobility', DisplayName: 'Mobility', DisplayMode: 'Text',LinkUrl: '', isVisible: true },
      { PropertyName: 'MobilitySupportDevice', DisplayName: 'Mobility Support Device', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'MobilityNotes', DisplayName: 'Mobility Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Functionalstatus', DisplayName: 'Functional status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Cognitivestatus', DisplayName: 'Cognitive status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'PrimaryDiagnosisNotes', DisplayName: 'Primary Diagnosis Notes ', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'PrimaryProcedure', DisplayName: 'Primary Procedure', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Hospital', DisplayName: 'Hospital Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
    ];
  }

  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId'];
     // this.newPatsvc.patientId = this.patientId;
    });
    this.getCongtivieRecord();
  }
  openAddUpdateForm() {
    const dialogRef = this.dialogue.open(PatientFuntionAddComponent, {
      data: this.patientId,
      height: '650px',
      width: '1700px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getCongtivieRecord();
        this.getCongtivieRecord();
      }
    });
  }

  openCognitiveViewRec(element: any) {
    this.newPatsvc.getCognitiveRecbyID(element.Item.CognitiveID).then(data => {

      var patientDetail = data;
      const dialogRef = this.dialogue.open(PatientFuntionViewComponent, {
        data: patientDetail,
        height: '600px',
        width: '1500px',
        autoFocus: false,
      });


    });
  }

  openCognitiveEditRecord(element: any) {

    this.newPatsvc.getCognitiveRecbyID(element.Item.CognitiveID).then(data => {

      var patientDetail = data;
      const dialogRef = this.dialogue.open(PatientFuntionEditComponent, {
        data: patientDetail,
        height: '650px',
        width: '1700px',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getCongtivieRecord();
          this.getCongtivieRecord();
        }
      });
    });
    /**/
  }

  getCongtivieRecord() {
    this.newPatsvc.getCognitiveListforPatient(this.patientId).then(res => {
      this.FuncData = res;
    })
  }

  deleteCognitiveRecord(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.newPatsvc.deleteCognitiveRec(element.Item.CognitiveID).then(res => {
            this.getCongtivieRecord();
          })
        }
      });
  }

}
