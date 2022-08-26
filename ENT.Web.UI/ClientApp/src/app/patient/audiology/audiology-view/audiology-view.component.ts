import { Component, OnInit, AfterViewInit, Inject, ViewChild,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService } from '../../../core/custom-http.service';
import { NewPatientService } from '../../newPatient.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-audiology-view',
  templateUrl: './audiology-view.component.html',
  styleUrls: ['./audiology-view.component.css']
})

export class AudiologyViewComponent implements OnInit, AfterViewInit {
  audiologyProcedureForm: FormGroup;
  disableSelect = true;
  totalStepsCount: number;
  data1 : any;

  // mat-stepper FormGroup
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  eighthFormGroup: FormGroup;

  @ViewChild('stepper', {static: true}) private myStepper: MatStepper;

  constructor(public newPatientSvc: NewPatientService, public dialogRef: MatDialogRef<AudiologyViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public custHttp: CustomHttpService, public fb: FormBuilder) { }

  // Event fired when component initializes
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.firstFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.secondFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.thirdFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.fourthFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.fifthFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.sixthFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.seventhFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.eighthFormGroup= this.fb.group({
      matStepperTab: ["", Validators.required],
    });

    this.audiologyProcedureForm = this.fb.group({
      // specialTest
      SRTRight: [''],
      SRTLeft: [''],
      SDSRight: [''],
      SDSLeft: [''],
      SISIRight: [''],
      SISILeft: [''],
      TDTRight: [''],
      TDTLeft: [''],
      ABLBRight: [''],
      ABLBLeft: [''],
      NotesandInstructions: [''],
      Starttime: [''],
      Endtime: [''],
      Totalduration: [''],
      Nextfollowupdate: [''],
      checked: [''],

      // oae
      LTEar1: [''],
      RTEar1: [''],
      NotesandInstructions1: [''],
      Starttime1: [''],
      Endtime1: [''],
      Totalduration1: [''],
      Nextfollowupdate1: [''],
      checked1: [''],

      // bera
      LTEar2: [''],
      RTEar2: [''],
      NotesandInstructions2: [''],
      Starttime2: [''],
      Endtime2: [''],
      Totalduration2: [''],
      Nextfollowupdate2: [''],
      checked2: [''],

      // assr
      LTEar3: [''],
      RTEar3: [''],
      NotesandInstructions3: [''],
      Starttime3: [''],
      Endtime3: [''],
      Totalduration3: [''],
      Nextfollowupdate3: [''],
      checked3: [''],

      // hearingAidTrial
      LTEar4: [''],
      RTEar4: [''],
      NotesandInstructions4: [''],
      Starttime4: [''],
      Endtime4: [''],
      Totalduration4: [''],
      Nextfollowupdate4: [''],
      checked4: [''],

      // tinnitusMasking
      LTEar5: [''],
      RTEar5: [''],
      NotesandInstructions5: [''],
      Starttime5: [''],
      Endtime5: [''],
      Totalduration5: [''],
      Nextfollowupdate5: [''],
      checked5: [''],

      // speechTherapy
      Findings6: [''],
      ClinicalNotes6: [''],
      Starttime6: [''],
      Endtime6: [''],
      Totalduration6: [''],
      Nextfollowupdate6: [''],
      checked6: [''],

      // electrocochleography
      LTEar7: [''],
      RTEar7: [''],
      ClinicalNotes7: [''],
      Starttime7: [''],
      Endtime7: [''],
      Totalduration7: [''],
      Nextfollowupdate7: [''],
      checked7: ['']
    });
    this.getAudiologyProcedureList();
    this.audiologyProcedureForm.get('checked').disable();
    this.audiologyProcedureForm.get('checked1').disable();
    this.audiologyProcedureForm.get('checked2').disable();
    this.audiologyProcedureForm.get('checked3').disable();
    this.audiologyProcedureForm.get('checked4').disable();
    this.audiologyProcedureForm.get('checked5').disable();
    this.audiologyProcedureForm.get('checked6').disable();
    this.audiologyProcedureForm.get('checked7').disable();
  }

  // Event fired after view is initialized
  ngAfterViewInit() {
    this.totalStepsCount = this.myStepper._steps.length;
  }

  getAudiologyProcedureList() {
    this.newPatientSvc.getAudiologyRecordbyVisit(this.data.VisitID).then(res => {
      this.data1 = res;
      this.setFormValue();
    });
  }
 
  setFormValue() {

    // speechSpecialTestData
    if (this.data1.speechSpecialTestData != null && this.data1.speechSpecialTestData != undefined) {
      this.audiologyProcedureForm.get('SRTRight').setValue(this.data1.speechSpecialTestData.SRTRight);
      this.audiologyProcedureForm.get('SRTLeft').setValue(this.data1.speechSpecialTestData.SRTLeft);
      this.audiologyProcedureForm.get('SDSRight').setValue(this.data1.speechSpecialTestData.SDSRight);
      this.audiologyProcedureForm.get('SDSLeft').setValue(this.data1.speechSpecialTestData.SDSLeft);
      this.audiologyProcedureForm.get('SISIRight').setValue(this.data1.speechSpecialTestData.SISIRight);
      this.audiologyProcedureForm.get('SISILeft').setValue(this.data1.speechSpecialTestData.SISILeft);
      this.audiologyProcedureForm.get('TDTRight').setValue(this.data1.speechSpecialTestData.TDTRight);
      this.audiologyProcedureForm.get('TDTLeft').setValue(this.data1.speechSpecialTestData.TDTLeft);
      this.audiologyProcedureForm.get('ABLBRight').setValue(this.data1.speechSpecialTestData.ABLBRight);
      this.audiologyProcedureForm.get('ABLBLeft').setValue(this.data1.speechSpecialTestData.ABLBLeft);
      this.audiologyProcedureForm.get('NotesandInstructions').setValue(this.data1.speechSpecialTestData.NotesandInstructions);
      if (this.data1.speechSpecialTestData.Starttime != null && this.data1.speechSpecialTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime').setValue(new Date(this.data1.speechSpecialTestData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.speechSpecialTestData.Endtime != null && this.data1.speechSpecialTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime').setValue(new Date(this.data1.speechSpecialTestData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration').setValue(this.data1.speechSpecialTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate').setValue(this.data1.speechSpecialTestData.Nextfollowupdate);
      if (this.data1.speechSpecialTestData.Nextfollowupdate != null && this.data1.speechSpecialTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked').setValue(true);
      }
    }

    // oaeTestData
    if (this.data1.oaeTestData != null && this.data1.oaeTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar1').setValue(this.data1.oaeTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar1').setValue(this.data1.oaeTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions1').setValue(this.data1.oaeTestData.NotesandInstructions);
      if (this.data1.oaeTestData.Starttime != null && this.data1.oaeTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime1').setValue(new Date(this.data1.oaeTestData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.oaeTestData.Endtime != null && this.data1.oaeTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime1').setValue(new Date(this.data1.oaeTestData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration1').setValue(this.data1.oaeTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate1').setValue(this.data1.oaeTestData.Nextfollowupdate);
      if (this.data1.oaeTestData.Nextfollowupdate != null && this.data1.oaeTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked1').setValue(true);
      }
    }

    // beraTestData
    if (this.data1.beraTestData != null && this.data1.beraTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar2').setValue(this.data1.beraTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar2').setValue(this.data1.beraTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions2').setValue(this.data1.beraTestData.NotesandInstructions);
      if (this.data1.beraTestData.Starttime != null && this.data1.beraTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime2').setValue(new Date(this.data1.beraTestData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.beraTestData.Endtime != null && this.data1.beraTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime2').setValue(new Date(this.data1.beraTestData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration2').setValue(this.data1.beraTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate2').setValue(this.data1.beraTestData.Nextfollowupdate);
      if (this.data1.beraTestData.Nextfollowupdate != null && this.data1.beraTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked2').setValue(true);
      }
    }

    // assrTestData
    if (this.data1.assrTestData != null && this.data1.assrTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar3').setValue(this.data1.assrTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar3').setValue(this.data1.assrTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions3').setValue(this.data1.assrTestData.NotesandInstructions);
      if (this.data1.assrTestData.Starttime != null && this.data1.assrTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime3').setValue(new Date(this.data1.assrTestData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.assrTestData.Endtime != null && this.data1.assrTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime3').setValue(new Date(this.data1.assrTestData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration3').setValue(this.data1.assrTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate3').setValue(this.data1.assrTestData.Nextfollowupdate);
      if (this.data1.assrTestData.Nextfollowupdate != null && this.data1.assrTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked3').setValue(true);
      }
    }

    // hearingAidData
    if (this.data1.hearingAidData != null && this.data1.hearingAidData != undefined) {
      this.audiologyProcedureForm.get('LTEar4').setValue(this.data1.hearingAidData.LTEar);
      this.audiologyProcedureForm.get('RTEar4').setValue(this.data1.hearingAidData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions4').setValue(this.data1.hearingAidData.NotesandInstructions);
      if (this.data1.hearingAidData.Starttime != null && this.data1.hearingAidData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime4').setValue(new Date(this.data1.hearingAidData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.hearingAidData.Endtime != null && this.data1.hearingAidData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime4').setValue(new Date(this.data1.hearingAidData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration4').setValue(this.data1.hearingAidData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate4').setValue(this.data1.hearingAidData.Nextfollowupdate);
      if (this.data1.hearingAidData.Nextfollowupdate != null && this.data1.hearingAidData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked4').setValue(true);
      }
    }

    // tinnitusMaskingData
    if (this.data1.tinnitusMaskingData != null && this.data1.tinnitusMaskingData != undefined) {
      this.audiologyProcedureForm.get('LTEar5').setValue(this.data1.tinnitusMaskingData.LTEar);
      this.audiologyProcedureForm.get('RTEar5').setValue(this.data1.tinnitusMaskingData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions5').setValue(this.data1.tinnitusMaskingData.NotesandInstructions);
      if (this.data1.tinnitusMaskingData.Starttime != null && this.data1.tinnitusMaskingData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime5').setValue(new Date(this.data1.tinnitusMaskingData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.tinnitusMaskingData.Endtime != null && this.data1.tinnitusMaskingData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime5').setValue(new Date(this.data1.tinnitusMaskingData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration5').setValue(this.data1.tinnitusMaskingData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate5').setValue(this.data1.tinnitusMaskingData.Nextfollowupdate);
      if (this.data1.tinnitusMaskingData.Nextfollowupdate != null && this.data1.tinnitusMaskingData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked5').setValue(true);
      }
    }

    // speechTherapyData
    if (this.data1.speechTherapyData != null && this.data1.speechTherapyData != undefined) {
      this.audiologyProcedureForm.get('Findings6').setValue(this.data1.speechTherapyData.Findings);
      this.audiologyProcedureForm.get('ClinicalNotes6').setValue(this.data1.speechTherapyData.ClinicalNotes);
      if (this.data1.speechTherapyData.Starttime != null && this.data1.speechTherapyData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime6').setValue(new Date(this.data1.speechTherapyData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.speechTherapyData.Endtime != null && this.data1.speechTherapyData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime6').setValue(new Date(this.data1.speechTherapyData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration6').setValue(this.data1.speechTherapyData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate6').setValue(this.data1.speechTherapyData.Nextfollowupdate);
      if (this.data1.speechTherapyData.Nextfollowupdate != null && this.data1.speechTherapyData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked6').setValue(true);
      }
    }

    // electrocochleographyData
    if (this.data1.electrocochleographyData != null && this.data1.electrocochleographyData != undefined) {
      this.audiologyProcedureForm.get('LTEar7').setValue(this.data1.electrocochleographyData.LTEar);
      this.audiologyProcedureForm.get('RTEar7').setValue(this.data1.electrocochleographyData.RTEar);
      this.audiologyProcedureForm.get('ClinicalNotes7').setValue(this.data1.electrocochleographyData.ClinicalNotes);
      if (this.data1.electrocochleographyData.Starttime != null && this.data1.electrocochleographyData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime7').setValue(new Date(this.data1.electrocochleographyData.Starttime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      if (this.data1.electrocochleographyData.Endtime != null && this.data1.electrocochleographyData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime7').setValue(new Date(this.data1.electrocochleographyData.Endtime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      }
      this.audiologyProcedureForm.get('Totalduration7').setValue(this.data1.electrocochleographyData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate7').setValue(this.data1.electrocochleographyData.Nextfollowupdate);
      if (this.data1.electrocochleographyData.Nextfollowupdate != null && this.data1.electrocochleographyData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked7').setValue(true);
      }
    }

  }

  goPrevious() {
    this.myStepper.previous();
  }

  goNext() {
    this.myStepper.next();
  }

  dialogClose() {
    this.dialogRef.close();
  }

}
