import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TriageService } from '../triage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { AudiologyRequestModel } from '../models/audiologyRequestModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-audiology-request',
  templateUrl: './audiology-request.component.html',
  styleUrls: ['./audiology-request.component.css']
})

export class AudiologyRequestComponent implements OnInit, AfterViewInit {
  audiologyRequestForm: FormGroup;
  audiologyRequestModel: AudiologyRequestModel = new AudiologyRequestModel();
  doctorInfo: any;
  visitDandt: any[] = [];
  audiologyRequestList: any;
  providerId: number;
  visitDateandTime: any;
  audiologistTooltip: any;

  @ViewChild('autoCompleteAudiologistInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;

  constructor(public dialogRef: MatDialogRef<AudiologyRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public triageService: TriageService, public fb: FormBuilder, public custHttp: CustomHttpService, private util: UtilService) { }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.audiologyRequestForm = this.fb.group({
      SpecialTest: [false, ''],
      OAE: [false, ''],
      BERA: [false, ''],
      ASSR: [false, ''],
      HearingAid: [false, ''],
      TinnitusMasking: [false, ''],
      SpeechTherapy: [false, ''],
      Electrocochleography: [false, ''],
      VisitDateandTime: ['', Validators.required],
      ProviderName: ['', Validators.required]
    });
    this.doctorName();
    this.getAudiologyRequestList();
    this.getVisitDateAndTime();
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.audiologyRequestForm.get('ProviderName').setValue('');
        }
      });
  }

  getVisitDateAndTime() {
    this.triageService.getVisitRecordById(this.data).then(res => {
      this.visitDateandTime = res.VisitDateandTime;
      this.audiologyRequestForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
    });
  }

  doctorName() {
    this.audiologyRequestForm.get('ProviderName').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.GetAudiologyDoctors(key).then(data => {
            this.doctorInfo = data;
          });
        }
        else {
          this.doctorInfo = null;
          this.audiologistTooltip = null;
          this.providerId = 0;
        }
      }
      else {
        this.doctorInfo = null;
        this.audiologistTooltip = null;
        this.providerId = 0;
      }
    });
  }

  setAudiologistName(id, name) {
    this.providerId = id;
    this.audiologistTooltip = name;
  }

  getAudiologyRequestList() {
    this.triageService.getAudiologyRequestRecordByVisitID(this.data).then(res => {
      if (res != undefined && res != null) {
        this.audiologyRequestList = res;
        this.audiologyRequestForm.patchValue(this.audiologyRequestList);
        this.audiologistTooltip = res.ProviderName;
        this.providerId = this.audiologyRequestList.ProviderId;
      }
    });
  }

  selectAudiologyRequest() {
    if (this.providerId && (this.audiologyRequestForm.get('SpecialTest').value || this.audiologyRequestForm.get('OAE').value ||
      this.audiologyRequestForm.get('BERA').value || this.audiologyRequestForm.get('ASSR').value ||
      this.audiologyRequestForm.get('HearingAid').value || this.audiologyRequestForm.get('TinnitusMasking').value ||
      this.audiologyRequestForm.get('SpeechTherapy').value || this.audiologyRequestForm.get('Electrocochleography').value)) {
      this.audiologyRequestModel.VisitID = this.data;
      this.audiologyRequestModel.ProviderId = this.providerId;
      this.audiologyRequestModel.SpecialTest = this.audiologyRequestForm.get('SpecialTest').value;
      this.audiologyRequestModel.OAE = this.audiologyRequestForm.get('OAE').value;
      this.audiologyRequestModel.BERA = this.audiologyRequestForm.get('BERA').value;
      this.audiologyRequestModel.ASSR = this.audiologyRequestForm.get('ASSR').value;
      this.audiologyRequestModel.HearingAid = this.audiologyRequestForm.get('HearingAid').value;
      this.audiologyRequestModel.TinnitusMasking = this.audiologyRequestForm.get('TinnitusMasking').value;
      this.audiologyRequestModel.SpeechTherapy = this.audiologyRequestForm.get('SpeechTherapy').value;
      this.audiologyRequestModel.Electrocochleography = this.audiologyRequestForm.get('Electrocochleography').value;

      this.triageService.AddUpdateAudiologyRequest(this.audiologyRequestModel).then(res => {
        this.util.showMessage('', 'Audiology request data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
          if (res === true) {
            this.dialogRef.close('update');
          }
        });
      });
    }
    else if (!(this.audiologyRequestForm.get('SpecialTest').value || this.audiologyRequestForm.get('OAE').value ||
      this.audiologyRequestForm.get('BERA').value || this.audiologyRequestForm.get('ASSR').value ||
      this.audiologyRequestForm.get('HearingAid').value || this.audiologyRequestForm.get('TinnitusMasking').value ||
      this.audiologyRequestForm.get('SpeechTherapy').value || this.audiologyRequestForm.get('Electrocochleography').value)) {

      this.util.showMessage('', 'Please select atleast one test to save the request', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
    }
  }

  resetForm() {
    if (this.audiologyRequestList == null) {
      this.audiologyRequestForm.reset();
      this.audiologyRequestForm.get('VisitDateandTime').setValue(this.visitDateandTime);
    }
    else {
      this.getAudiologyRequestList();
    }
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
