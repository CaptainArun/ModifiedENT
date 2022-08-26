import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConsultVisitSummaryComponent } from './consult-visitSummary.component';
import { ConsultConsultationComponent } from './consult-consultation.component';
import { ConsultProgressNotesComponent } from './consult-progressNotes.component';
import { ConsultTablePopupComponent } from './consult-tablePopup.component';
import { ConsultOtSummaryComponent } from './consult-otsummary.component';
import { ConsultImagesPopupComponent } from './consult-imagesPopup.component';
import { ConsultDiagnosisPopupComponent } from './consult-diagnosis-popup.component'
import { OpdEditPatientRecordComponent } from './opd-editPatientRecord.component';
import { OpdViewPatientRecordComponent } from './opd-viewPatientRecord.component';
import { PatientPopupTimelineComponent } from './patient-popupTimeline.component';
import { PatientPopupTimelineVComponent } from './patient-popupTimeline-v.component';
import { OpdEditPatientRecordPhysicianComponent } from './opd-editPatientRecordPhysician.component';

@Component({
  selector: 'consult-physicianconsult',
  templateUrl: 'consult-physicianconsult.component.html'
})

export class ConsultPhysicianConsultComponent {

  isDisabled = true;
  public show: boolean = false;
  public show1: boolean = false;
  public show2: boolean = false;
  public show3: boolean = false;
  public show4: boolean = false;

  constructor(public dialog: MatDialog) { }



  openorders() {
    const dialogRef = this.dialog.open(ConsultTablePopupComponent, {
      height: 'auto',
      width: '67em',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
   openSummary() {
    const dialogRef = this.dialog.open(ConsultOtSummaryComponent, {
      height: '750px',
      width: '1500px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openImages() {
    const dialogRef = this.dialog.open(ConsultImagesPopupComponent, {
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDiagnosis() {
    const dialogRef = this.dialog.open(ConsultDiagnosisPopupComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditReport() {
    const dialogRef = this.dialog.open(OpdEditPatientRecordPhysicianComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openViewReport() {
    const dialogRef = this.dialog.open(OpdViewPatientRecordComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openTimeline() {
    const dialogRef = this.dialog.open(PatientPopupTimelineComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openTimelineV() {
    const dialogRef = this.dialog.open(PatientPopupTimelineVComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openAssessment() { }
  
  openVisitSummary() {
    const dialogRef = this.dialog.open(ConsultVisitSummaryComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openConsultation() {
    const dialogRef = this.dialog.open(ConsultConsultationComponent, {
      height: '750px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openProgressNotes() {
    const dialogRef = this.dialog.open(ConsultProgressNotesComponent, {
      height: 'auto',
      width: '1500px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
 
  textField() {
    this.show1 = !this.show1;
  }

  textField2() {
    this.show2 = !this.show2;
  }
  textField3() {
    this.show3 = !this.show3;
  }
  textField4() {
    this.show4 = !this.show4;
  }
  toggle() {
    this.show = !this.show;
  }

}
