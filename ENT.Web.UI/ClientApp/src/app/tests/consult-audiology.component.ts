import { Component, OnInit } from '@angular/core';
import { MatDialog, MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { ConsultEditAudiologyComponent } from './consult-editAudiology.component';
import { ConsultViewAudiologyComponent } from './consult-viewAudiology.component';
import { ConsultAudiologyGraphComponent } from './consult-audiology-graph.component';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { TuningForkTestModel } from './models/tuningForkTestModel';
import { TestsService } from './tests.service';
import { CustomHttpService } from '../core/custom-http.service';

@Component({
  selector: 'consult-audiology',
  templateUrl: 'consult-audiology.component.html'
})

export class ConsultAudiologyComponent implements OnInit {


  audiologyForm: FormGroup;
  // tuningForkTestModel: TuningForkTestModel = new TuningForkTestModel();
  isFollowUp = false;
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private testsSvc: TestsService, private customHttpSvc: CustomHttpService) { }

  back() {
    this.router.navigate(['home/tests/consultlist']);
  }

  openEditReport() {
    const dialogRef = this.dialog.open(ConsultEditAudiologyComponent, {
      height: '750px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openViewReport() {
    const dialogRef = this.dialog.open(ConsultViewAudiologyComponent, {
      height: '750px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openGraph() {
    const dialogRef = this.dialog.open(ConsultAudiologyGraphComponent, {
      height: '700px',
      width: '1200px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {
    this.audiologyForm = this.fb.group({
      //TuningForkTestId: [''],
      //PatientId: [''],
      //VisitID: [''],
      //CaseSheetID: [''],
      //WeberLTEar: [''],
      //WeberRTEar: [''],
      //RinnersLTEar: [''],
      //RinnersRTEar: [''],
      Starttime: [''],
      Endtime: [''],
      Totalduration: [''],
      Findings: [''],
      Nextfollowupdate: ['']
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getTuningForkTest();
  }

  getTuningForkTest() {
    this.testsSvc.getTuningForkTestDataForPatientVisit(1, 2, 3).then(data => data);
  }

  addUpdateTuningForkTest() {
    // this.tuningForkTestModel.TuningForkTestId = 0;
    // this.tuningForkTestModel.PatientId = 1;
    // this.tuningForkTestModel.VisitID = 1;
    // this.tuningForkTestModel.CaseSheetID = 1;
    // this.tuningForkTestModel.WeberLTEar = "";
    // this.tuningForkTestModel.WeberRTEar = "";
    // this.tuningForkTestModel.RinnersLTEar = "";
    // this.tuningForkTestModel.RinnersRTEar = "";
    // this.tuningForkTestModel.Starttime = this.audiologyForm.get('Starttime').value;
    // this.tuningForkTestModel.Endtime = this.audiologyForm.get('Endtime').value;
    // this.tuningForkTestModel.Totalduration = this.audiologyForm.get('Totalduration').value;
    // this.tuningForkTestModel.Findings = this.audiologyForm.get('Findings').value;
    // this.tuningForkTestModel.Nextfollowupdate = this.audiologyForm.get('Nextfollowupdate').value;

    //this.testsSvc.addUpdateTuningForkTest(this.tuningForkTestModel).then(res => res);
  }
  onChange(event: MatCheckboxChange) {
    this.isFollowUp = event.checked;
  }
}

