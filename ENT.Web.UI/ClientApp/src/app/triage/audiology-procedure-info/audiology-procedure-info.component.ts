import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { TriageService } from '../triage.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-audiology-procedure-info',
  templateUrl: './audiology-procedure-info.component.html',
  styleUrls: ['./audiology-procedure-info.component.css']
})

export class AudiologyProcedureInfoComponent implements OnInit, AfterViewInit {
  audiologyProcedureForm: FormGroup;
  audiologyList: any;
  disableSelect = true;
  totalStepsCount: number;

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

  constructor(public triageService: TriageService, public dialogRef: MatDialogRef<AudiologyProcedureInfoComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, public custHttp: CustomHttpService, public fb: FormBuilder) { }

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
    this.triageService.GetAudiologyRecords(this.data1.VisitID).then(res => {
      this.audiologyList = res;
      this.setFormValue();
    });
  }

  setFormValue() {

    // speechSpecialTestData
    if (this.audiologyList.speechSpecialTestData != null && this.audiologyList.speechSpecialTestData != undefined) {
      this.audiologyProcedureForm.get('SRTRight').setValue(this.audiologyList.speechSpecialTestData.SRTRight);
      this.audiologyProcedureForm.get('SRTLeft').setValue(this.audiologyList.speechSpecialTestData.SRTLeft);
      this.audiologyProcedureForm.get('SDSRight').setValue(this.audiologyList.speechSpecialTestData.SDSRight);
      this.audiologyProcedureForm.get('SDSLeft').setValue(this.audiologyList.speechSpecialTestData.SDSLeft);
      this.audiologyProcedureForm.get('SISIRight').setValue(this.audiologyList.speechSpecialTestData.SISIRight);
      this.audiologyProcedureForm.get('SISILeft').setValue(this.audiologyList.speechSpecialTestData.SISILeft);
      this.audiologyProcedureForm.get('TDTRight').setValue(this.audiologyList.speechSpecialTestData.TDTRight);
      this.audiologyProcedureForm.get('TDTLeft').setValue(this.audiologyList.speechSpecialTestData.TDTLeft);
      this.audiologyProcedureForm.get('ABLBRight').setValue(this.audiologyList.speechSpecialTestData.ABLBRight);
      this.audiologyProcedureForm.get('ABLBLeft').setValue(this.audiologyList.speechSpecialTestData.ABLBLeft);
      this.audiologyProcedureForm.get('NotesandInstructions').setValue(this.audiologyList.speechSpecialTestData.NotesandInstructions);
      if (this.audiologyList.speechSpecialTestData.Starttime != null && this.audiologyList.speechSpecialTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime').setValue(new Date(this.audiologyList.speechSpecialTestData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.speechSpecialTestData.Endtime != null && this.audiologyList.speechSpecialTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime').setValue(new Date(this.audiologyList.speechSpecialTestData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration').setValue(this.audiologyList.speechSpecialTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate').setValue(this.audiologyList.speechSpecialTestData.Nextfollowupdate);
      if (this.audiologyList.speechSpecialTestData.Nextfollowupdate != null && this.audiologyList.speechSpecialTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked').setValue(true);
      }
    }

    // oaeTestData
    if (this.audiologyList.oaeTestData != null && this.audiologyList.oaeTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar1').setValue(this.audiologyList.oaeTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar1').setValue(this.audiologyList.oaeTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions1').setValue(this.audiologyList.oaeTestData.NotesandInstructions);
      if (this.audiologyList.oaeTestData.Starttime != null && this.audiologyList.oaeTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime1').setValue(new Date(this.audiologyList.oaeTestData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.oaeTestData.Endtime != null && this.audiologyList.oaeTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime1').setValue(new Date(this.audiologyList.oaeTestData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration1').setValue(this.audiologyList.oaeTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate1').setValue(this.audiologyList.oaeTestData.Nextfollowupdate);
      if (this.audiologyList.oaeTestData.Nextfollowupdate != null && this.audiologyList.oaeTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked1').setValue(true);
      }
    }

    // beraTestData
    if (this.audiologyList.beraTestData != null && this.audiologyList.beraTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar2').setValue(this.audiologyList.beraTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar2').setValue(this.audiologyList.beraTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions2').setValue(this.audiologyList.beraTestData.NotesandInstructions);
      if (this.audiologyList.beraTestData.Starttime != null && this.audiologyList.beraTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime2').setValue(new Date(this.audiologyList.beraTestData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.beraTestData.Endtime != null && this.audiologyList.beraTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime2').setValue(new Date(this.audiologyList.beraTestData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration2').setValue(this.audiologyList.beraTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate2').setValue(this.audiologyList.beraTestData.Nextfollowupdate);
      if (this.audiologyList.beraTestData.Nextfollowupdate != null && this.audiologyList.beraTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked2').setValue(true);
      }
    }

    // assrTestData
    if (this.audiologyList.assrTestData != null && this.audiologyList.assrTestData != undefined) {
      this.audiologyProcedureForm.get('LTEar3').setValue(this.audiologyList.assrTestData.LTEar);
      this.audiologyProcedureForm.get('RTEar3').setValue(this.audiologyList.assrTestData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions3').setValue(this.audiologyList.assrTestData.NotesandInstructions);
      if (this.audiologyList.assrTestData.Starttime != null && this.audiologyList.assrTestData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime3').setValue(new Date(this.audiologyList.assrTestData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.assrTestData.Endtime != null && this.audiologyList.assrTestData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime3').setValue(new Date(this.audiologyList.assrTestData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration3').setValue(this.audiologyList.assrTestData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate3').setValue(this.audiologyList.assrTestData.Nextfollowupdate);
      if (this.audiologyList.assrTestData.Nextfollowupdate != null && this.audiologyList.assrTestData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked3').setValue(true);
      }
    }

    // hearingAidData
    if (this.audiologyList.hearingAidData != null && this.audiologyList.hearingAidData != undefined) {
      this.audiologyProcedureForm.get('LTEar4').setValue(this.audiologyList.hearingAidData.LTEar);
      this.audiologyProcedureForm.get('RTEar4').setValue(this.audiologyList.hearingAidData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions4').setValue(this.audiologyList.hearingAidData.NotesandInstructions);
      if (this.audiologyList.hearingAidData.Starttime != null && this.audiologyList.hearingAidData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime4').setValue(new Date(this.audiologyList.hearingAidData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.hearingAidData.Endtime != null && this.audiologyList.hearingAidData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime4').setValue(new Date(this.audiologyList.hearingAidData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration4').setValue(this.audiologyList.hearingAidData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate4').setValue(this.audiologyList.hearingAidData.Nextfollowupdate);
      if (this.audiologyList.hearingAidData.Nextfollowupdate != null && this.audiologyList.hearingAidData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked4').setValue(true);
      }
    }

    // tinnitusMaskingData
    if (this.audiologyList.tinnitusMaskingData != null && this.audiologyList.tinnitusMaskingData != undefined) {
      this.audiologyProcedureForm.get('LTEar5').setValue(this.audiologyList.tinnitusMaskingData.LTEar);
      this.audiologyProcedureForm.get('RTEar5').setValue(this.audiologyList.tinnitusMaskingData.RTEar);
      this.audiologyProcedureForm.get('NotesandInstructions5').setValue(this.audiologyList.tinnitusMaskingData.NotesandInstructions);
      if (this.audiologyList.tinnitusMaskingData.Starttime != null && this.audiologyList.tinnitusMaskingData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime5').setValue(new Date(this.audiologyList.tinnitusMaskingData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.tinnitusMaskingData.Endtime != null && this.audiologyList.tinnitusMaskingData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime5').setValue(new Date(this.audiologyList.tinnitusMaskingData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration5').setValue(this.audiologyList.tinnitusMaskingData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate5').setValue(this.audiologyList.tinnitusMaskingData.Nextfollowupdate);
      if (this.audiologyList.tinnitusMaskingData.Nextfollowupdate != null && this.audiologyList.tinnitusMaskingData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked5').setValue(true);
      }
    }

    // speechTherapyData
    if (this.audiologyList.speechTherapyData != null && this.audiologyList.speechTherapyData != undefined) {
      this.audiologyProcedureForm.get('Findings6').setValue(this.audiologyList.speechTherapyData.Findings);
      this.audiologyProcedureForm.get('ClinicalNotes6').setValue(this.audiologyList.speechTherapyData.ClinicalNotes);
      if (this.audiologyList.speechTherapyData.Starttime != null && this.audiologyList.speechTherapyData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime6').setValue(new Date(this.audiologyList.speechTherapyData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.speechTherapyData.Endtime != null && this.audiologyList.speechTherapyData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime6').setValue(new Date(this.audiologyList.speechTherapyData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration6').setValue(this.audiologyList.speechTherapyData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate6').setValue(this.audiologyList.speechTherapyData.Nextfollowupdate);
      if (this.audiologyList.speechTherapyData.Nextfollowupdate != null && this.audiologyList.speechTherapyData.Nextfollowupdate != undefined) {
        this.audiologyProcedureForm.get('checked6').setValue(true);
      }
    }

    // electrocochleographyData
    if (this.audiologyList.electrocochleographyData != null && this.audiologyList.electrocochleographyData != undefined) {
      this.audiologyProcedureForm.get('LTEar7').setValue(this.audiologyList.electrocochleographyData.LTEar);
      this.audiologyProcedureForm.get('RTEar7').setValue(this.audiologyList.electrocochleographyData.RTEar);
      this.audiologyProcedureForm.get('ClinicalNotes7').setValue(this.audiologyList.electrocochleographyData.ClinicalNotes);
      if (this.audiologyList.electrocochleographyData.Starttime != null && this.audiologyList.electrocochleographyData.Starttime != undefined) {
        this.audiologyProcedureForm.get('Starttime7').setValue(new Date(this.audiologyList.electrocochleographyData.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      if (this.audiologyList.electrocochleographyData.Endtime != null && this.audiologyList.electrocochleographyData.Endtime != undefined) {
        this.audiologyProcedureForm.get('Endtime7').setValue(new Date(this.audiologyList.electrocochleographyData.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
      }
      this.audiologyProcedureForm.get('Totalduration7').setValue(this.audiologyList.electrocochleographyData.Totalduration);
      this.audiologyProcedureForm.get('Nextfollowupdate7').setValue(this.audiologyList.electrocochleographyData.Nextfollowupdate);
      if (this.audiologyList.electrocochleographyData.Nextfollowupdate != null && this.audiologyList.electrocochleographyData.Nextfollowupdate != undefined) {
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
