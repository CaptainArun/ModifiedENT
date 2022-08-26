import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostprocedureCaseSheetModel } from '../../models/PostprocedureCaseSheetModel';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component'
import { UtilService } from '../../../core/util.service';
import { PostProcedureCareService } from "../../postProcedureCare.service"
import { ActivatedRoute } from '@angular/router';
import { SignoffModel } from '../../models/signoffModel';
import { CustomHttpService } from '../../../core/custom-http.service';
import { clsViewFile } from '../../../patient/models/clsViewFile';
import { DomSanitizer } from "@angular/platform-browser";
import { MatAutocompleteTrigger } from '@angular/material';
@Component({
  selector: 'app-post-procedure-add',
  templateUrl: './post-procedure-add.component.html',
  styleUrls: ['./post-procedure-add.component.css']
})

export class PostProcedureAddComponent implements OnInit {

  //#region "property declaration"
  @ViewChild('multiple', { static: true }) attachment: any;
  @ViewChild('autoattendingphysician', { static: false, read: MatAutocompleteTrigger }) triggerschedule: MatAutocompleteTrigger;
  @ViewChild('autoCompleteprocedurename', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCpt', { static: false, read: MatAutocompleteTrigger }) triggercpt: MatAutocompleteTrigger;

  postprocedureform: FormGroup;
  postprocedureCaseSheetModel: PostprocedureCaseSheetModel = new PostprocedureCaseSheetModel();
  signoffModel: SignoffModel = new SignoffModel();
  AdmittingPhysiciansurgeon: any;
  painlevel: any;
  CPTCode: any;
  AdmissionID: any;
  PatientID: any;
  preprocedureid: any;
  admissionbind: any;
  admisssionid: any = "";
  AdmissionDateTime: any = "";
  griddata: any;
  setvalue: any;
  recordby: any;
  recordduring: any;
  patientcondition: any;
  Procedurename: any;
  attendingphysician: any = 0;
  procedurename: any = 0;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  getproceduretime: any;
  getprocedureenddatetime: any;
  isShow: boolean = false;
  IsSignOff: boolean = false;
  PreProcedureDiagnosis: any = "";
  PlannedProcedure: any;
  UrgencyType: any;
  AnesthesiaFitnessRequiredDesc: any;
  OtherConsults: any;
  cptValueTooltip: any = "";
  patientConditionDescTooltip: any;
  recordedDuringValueToolTip: any;
  FileUpload: Array<File> = [];
  ViewFileUpload: Array<clsViewFile> = [];
  formdataArray: Array<FormData> = [];
  profilePics: any;
  imageFlag: boolean = true;
  multipleFileUpload: Array<File> = [];
  requiredViewFile: Array<clsViewFile> = [];
  time: any;
  FileUploadNames: any[] = [];
  regularprocedureStartTime: any;
  regularprocedureEndTime: any;
  temporaryDate: Date = new Date();
  //#endregion

  //#region "constructor"
  constructor(public fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private util: UtilService, private postProcedureCareService: PostProcedureCareService, private customHttpSvc: CustomHttpService, private sanitizer: DomSanitizer) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.AdmissionID = params.AdmissionID;
      this.PatientID = params.PatientId;
      this.preprocedureid = parseInt(params.preprocedureid);
    });

    this.postprocedureform = this.fb.group({
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      RecordedDuring: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      PreProcedureDiagnosis: [''],
      PlannedProcedure: [''],
      Urgency: [''],
      AnsthesiaFitnessRequired: [''],
      OtherConsults: [''],
      ProcedureStartDate: [new Date(), Validators.required],
      ProcedureEndDate: [new Date(), Validators.required],
      ProcedureStartTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      ProcedureEndTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      AttendingPhysician: ['', Validators.required],
      ProcedureNotes: ['', Validators.required],
      ProcedureName: ['', Validators.required],
      PrimaryCPTCode: [''],
      Speciments: [''],
      DiagnosticNotes: [''],
      Complication: [''],
      Bloodloss: [''],
      AdditionalInformation: [''],
      Procedurestatus: ['', Validators.required],
      PatientCondition: ['', Validators.required],
      Painlevel: [''],
      PainSleepMedication: [''],
      procedurestatusdesc: ['', Validators.required],
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: [''],
    });

    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));

    this.getAdmissionno();
    this.setDataForLabel();
    this.getRecordBy();
    this.getRecordDuring();
    this.getpainlevel();
    this.getpatientCondition();
    this.getAdmittingphysician();
    this.getCptcode();
    this.getprocedurename();
    this.recordDateAndTimeSet();
    this.sendproceduredate();
    this.sendprocedureenddate();
    this.changetime();
    this.CheckValidDate();
    //this.validTime();
   // this.fileupload();
  }

    //#endregion

  ngAfterViewInit() {
    this.triggerschedule.panelClosingActions.subscribe(attendingphysician => {
      if (!(attendingphysician && attendingphysician.source)) {
        this.postprocedureform.get('AttendingPhysician').setValue('');
      }
    });
    this.trigger.panelClosingActions.subscribe(procedurename => {
      if (!(procedurename && procedurename.source)) {
        this.postprocedureform.get('ProcedureName').setValue('');
      }
    });
    this.triggercpt.panelClosingActions.subscribe(preferedlanguage => {
      if (!(preferedlanguage && preferedlanguage.source)) {
        this.postprocedureform.get('PrimaryCPTCode').setValue('');
      }
    });
  }
  changetime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});

  }
  fileupload() {
    this.postProcedureCareService.getpostprocedurecasesheet(this.AdmissionID).then(res => {
      this.griddata = res;
      for (let i = 0; i < this.griddata.PostProcedureFile.length; i++) {
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = this.griddata.PostProcedureFile[i].FileName;
        viewFile.Size = this.griddata.PostProcedureFile[i].FileSize;
        viewFile.FileUrl = this.griddata.PostProcedureFile[i].FileUrl;
       // let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.griddata.PostProcedureFile[i].FileUrl);
       //return this.sanitizer.bypassSecurityTrustResourceUrl(this.griddata.PostProcedureFile[i].FileUrl);
        this.requiredViewFile.push(viewFile);
      }
    });
  }


  //#endregion 
 //#region Validate Date
 public CheckValidDate(): void {
  this.postprocedureform.get('ProcedureStartDate').valueChanges.subscribe((EffectiveDate: any) => {
    if (new Date(this.postprocedureform.get('ProcedureStartDate').value).toLocaleDateString()
      > new Date(this.postprocedureform.get('ProcedureEndDate').value).toLocaleDateString()
      && ((this.postprocedureform.get('ProcedureStartDate').value) != "" && (this.postprocedureform.get('ProcedureEndDate').value) != null)
      && ((this.postprocedureform.get('ProcedureStartDate').value) != "" && (this.postprocedureform.get('ProcedureEndDate').value) != null
      )) {
      this.util.showMessage("Yes", "ProcedureEndDate must be greater than ProcedureStartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        this.postprocedureform.get('ProcedureStartDate').setValue("");
      });    //} else {
      //  this.submitdisable = false;
      //}

    }

  });

  this.postprocedureform.get('ProcedureEndDate').valueChanges.subscribe((StartDate: any) => {
    if (new Date(this.postprocedureform.get('ProcedureStartDate').value) > new Date(this.postprocedureform.get('ProcedureEndDate').value)
      && ((this.postprocedureform.get('ProcedureStartDate').value) != "" && (this.postprocedureform.get('ProcedureEndDate').value) != null)
      && ((this.postprocedureform.get('ProcedureStartDate').value) != "" && (this.postprocedureform.get('ProcedureEndDate').value) != null)) {
      this.util.showMessage("Yes", "ProcedureEndDate must be greater than ProcedureStartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        this.postprocedureform.get('ProcedureEndDate').setValue("");
      });  //} else {
      //  this.submitdisable = false;
      //}

    }

  });
}
    //#endregion
    //#region Validate Time
  validStartTime() {
    if (this.postprocedureform.get("ProcedureStartTime").value && this.postprocedureform.get("ProcedureEndTime").value) {
    this.regularprocedureStartTime = this.postprocedureform.get("ProcedureStartTime").value
    this.regularprocedureEndTime = this.postprocedureform.get("ProcedureEndTime").value
    if (this.regularprocedureStartTime) {
      if (this.regularprocedureStartTime.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
        this.getTimeHH = 12;
      }
      else {
          this.getTimeHH = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) + 12;
      }
    }
      else if (this.regularprocedureStartTime.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
        this.getTimeHH = 0;
      }
      else {
          this.getTimeHH = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]
        );
      }
    }
      this.getTimeMin = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[1]);

      this.regularprocedureStartTime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
  }
    if (this.regularprocedureEndTime) {
      if (this.regularprocedureEndTime.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
        this.getTimeHH = 12;
      }
      else {
          this.getTimeHH = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) + 12;
      }
      } else if (this.regularprocedureEndTime.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) == 12
      ) {
        this.getTimeHH = 0;
      } else {
          this.getTimeHH = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]
        );
      }
    }
      this.getTimeMin = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[1]);

      this.regularprocedureEndTime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
  }
      if ((this.regularprocedureStartTime) >= (this.regularprocedureEndTime)) {
        this.util.showMessage("Yes", "ProcedureEndTime must be greater than ProcedureStartTime", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          if (res) {
            this.postprocedureform.get("ProcedureStartTime").setValue("");
            this.postprocedureform.get("ProcedureStartTime").setValue(this.time);
            this.postprocedureform.get("ProcedureStartTime").setValue(null);
          }
        });
      }
      }   
}
        //#endregion
  validEndTime() {
    this.regularprocedureStartTime = this.postprocedureform.get("ProcedureStartTime").value
    this.regularprocedureEndTime = this.postprocedureform.get("ProcedureEndTime").value
    if (this.regularprocedureStartTime) {
      if (this.regularprocedureStartTime.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.regularprocedureStartTime.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.regularprocedureStartTime.toString().split(" ")[0].toString().split(":")[1]);

      this.regularprocedureStartTime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    if (this.regularprocedureEndTime) {
      if (this.regularprocedureEndTime.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.regularprocedureEndTime.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.regularprocedureEndTime.toString().split(" ")[0].toString().split(":")[1]);

      this.regularprocedureEndTime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    if ((this.regularprocedureStartTime) >= (this.regularprocedureEndTime)) {
      this.util.showMessage("Yes", "ProcedureEndTime must be greater than ProcedureStartTime", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        if (res) {
          this.postprocedureform.get("ProcedureEndTime").setValue("");
          this.postprocedureform.get("ProcedureEndTime").setValue(this.time);
          this.postprocedureform.get("ProcedureEndTime").setValue(null);

        }
      });
    }
  }
  //#region "set data"
  setdata() {
    this.setFileData(this.griddata.PostProcedureFile)
    this.patientConditionDescTooltip = this.griddata.patientConditionDesc;
    this.recordedDuringValueToolTip = this.griddata.recordedDuringValue;
    this.postprocedureform.get('RecordedDuring').setValue(this.griddata.RecordedDuring);
    this.postprocedureform.get('RecordedBy').setValue(this.griddata.RecordedBy);
   // this.postprocedureform.get('procedurestatusdesc').setValue(this.griddata.ProcedureStatus);
    this.postprocedureform.get('AnsthesiaFitnessRequired').setValue(this.griddata.preProcedureModel.admissionModel.AnesthesiaFitnessRequiredDesc);
    this.postprocedureform.get('ProcedureNotes').setValue(this.griddata.ProcedureNotes);
    this.postprocedureform.get('PrimaryCPTCode').setValue(this.griddata.PrimaryCPT);
    this.cptValueTooltip = this.griddata.PrimaryCPT;
    this.postprocedureform.get('Speciments').setValue(this.griddata.Specimens);
    this.postprocedureform.get('RecordedDate').setValue(new Date(this.griddata.RecordedDate));
    this.postprocedureform.get('ProcedureStartDate').setValue(new Date(this.griddata.ProcedureStartDate));
    this.postprocedureform.get('ProcedureEndDate').setValue(new Date(this.griddata.ProcedureEndDate));
    this.postprocedureform.get('ProcedureStartTime').setValue(new Date(this.griddata.ProcedureStartDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('ProcedureEndTime').setValue(new Date(this.griddata.ProcedureEndDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('RecordedTime').setValue(new Date(this.griddata.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('DiagnosticNotes').setValue(this.griddata.DiagnosisNotes);
    this.postprocedureform.get('Complication').setValue(this.griddata.Complications);
    this.postprocedureform.get('Bloodloss').setValue(this.griddata.BloodLossTransfusion);
    this.postprocedureform.get('AdditionalInformation').setValue(this.griddata.AdditionalInfo);
    this.postprocedureform.get('Procedurestatus').setValue(this.griddata.ProcedureStatus);
    this.postprocedureform.get('procedurestatusdesc').setValue(this.griddata.ProcedureStatusNotes);
    this.postprocedureform.get('PatientCondition').setValue(this.griddata.PatientCondition);
    this.postprocedureform.get('Painlevel').setValue(this.griddata.PainLevel);
    this.postprocedureform.get('PainSleepMedication').setValue(this.griddata.PainSleepMedication);
    this.postprocedureform.get('ProcedureName').setValue(this.griddata.procedureNameDesc);
    this.postprocedureform.get('AttendingPhysician').setValue(this.griddata.attendingPhysicianName);
    this.attendingphysician = this.griddata.AttendingPhysician;
    this.procedurename = this.griddata.ProcedureName;
    this.PreProcedureDiagnosis = this.griddata.preProcedureModel.admissionModel.PreProcedureDiagnosis;
    this.PlannedProcedure = this.griddata.preProcedureModel.admissionModel.PlannedProcedure;
    this.UrgencyType = this.griddata.preProcedureModel.admissionModel.UrgencyType;
    this.AnesthesiaFitnessRequiredDesc = this.griddata.preProcedureModel.admissionModel.AnesthesiaFitnessRequiredDesc;
    this.OtherConsults = this.griddata.preProcedureModel.admissionModel.OtherConsults;
   //let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.griddata.PostProcedureFile[i].FileUrl);
   // return this.sanitizer.bypassSecurityTrustResourceUrl(this.griddata.PostProcedureFile[i].FileUrl);
  }
  //#endregion
  setFileData(Filedata) {
    this.requiredViewFile = [];
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      let lowerCaseFilename = (viewFile.FileName).toLowerCase();
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let FileData = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(FileData);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;
      this.FileUploadNames.push(lowerCaseFilename); //file name storing...
      this.requiredViewFile.push(viewFile);
    }
  }
  //#region "Set Tooltip"
  setcptValueTooltip(value) {
    this.cptValueTooltip = value;
  }
  //#endregion "Set Tooltip"

  //#region "setDataForLabel"
  setDataForLabel() {
    this.postProcedureCareService.getpostprocedurecasesheet(this.AdmissionID).then(res => {
      if (res != null) {
        this.postProcedureCareService.getpostprocedurecasesheet(this.AdmissionID).then(res => {
          this.griddata = res;
          if (res.SignOffStatus) {
            this.postprocedureform.disable();
            this.isShow = true;
            this.IsSignOff = true;
          }
          this.setdata();
        })
      } else {
        this.postProcedureCareService.getPostprocedureAdmission(this.AdmissionID).then(obj => {
          this.setvalue = obj;

          this.PreProcedureDiagnosis = this.setvalue.PreProcedureDiagnosis;
          this.PlannedProcedure = this.setvalue.PlannedProcedure;
          this.UrgencyType = this.setvalue.UrgencyType;
          this.AnesthesiaFitnessRequiredDesc = this.setvalue.AnesthesiaFitnessRequiredDesc;
          this.OtherConsults = this.setvalue.OtherConsults;
          this.postprocedureform.get('Procedurestatus').setValue(this.setvalue.procedureStatus);

        })
      }
    })
  }
  //#endregion

  //#region "get Admission number"
  getAdmissionno() {
    this.postProcedureCareService.getPostprocedureAdmission(this.AdmissionID).then(obj => {
      this.admissionbind = obj;
      this.admisssionid = this.admissionbind.AdmissionNo;
      this.AdmissionDateTime = new Date(this.admissionbind.AdmissionDateTime).toLocaleDateString() + " " + new Date(this.admissionbind.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
    })
  }
  //#endregion

  //#region "Submit"
  save() {

    if (this.postprocedureform.valid && this.procedurename && this.attendingphysician) {

      this.recordDateAndTimeSet();
      this.sendproceduredate();
      this.sendprocedureenddate();
      this.postprocedureCaseSheetModel.PostProcedureID = 0;
      this.postprocedureCaseSheetModel.PreProcedureID = this.preprocedureid;
      this.postprocedureCaseSheetModel.RecordedDate = this.getDateAndTime;
      this.postprocedureCaseSheetModel.RecordedDuring = this.postprocedureform.get('RecordedDuring').value;
      this.postprocedureCaseSheetModel.RecordedBy = this.postprocedureform.get('RecordedBy').value;
      this.postprocedureCaseSheetModel.DiagnosisNotes = this.postprocedureform.get('DiagnosticNotes').value;
      this.postprocedureCaseSheetModel.ProcedureStartDate = this.getproceduretime;
      this.postprocedureCaseSheetModel.ProcedureEndDate = this.getprocedureenddatetime;
      this.postprocedureCaseSheetModel.AttendingPhysician = this.attendingphysician;
      this.postprocedureCaseSheetModel.ProcedureNotes = this.postprocedureform.get('ProcedureNotes').value;
      this.postprocedureCaseSheetModel.ProcedureName = this.procedurename;
      this.postprocedureCaseSheetModel.PrimaryCPT = this.postprocedureform.get('PrimaryCPTCode').value;
      this.postprocedureCaseSheetModel.Specimens = this.postprocedureform.get('Speciments').value;
      this.postprocedureCaseSheetModel.DiagnosisNotes = this.postprocedureform.get('DiagnosticNotes').value;
      this.postprocedureCaseSheetModel.Complications = this.postprocedureform.get('Complication').value;
      this.postprocedureCaseSheetModel.BloodLossTransfusion = this.postprocedureform.get('Bloodloss').value;
      this.postprocedureCaseSheetModel.AdditionalInfo = this.postprocedureform.get('AdditionalInformation').value;
      this.postprocedureCaseSheetModel.ProcedureStatus = this.postprocedureform.get('Procedurestatus').value;
      this.postprocedureCaseSheetModel.ProcedureStatusNotes = this.postprocedureform.get('procedurestatusdesc').value;
      this.postprocedureCaseSheetModel.PatientCondition = this.postprocedureform.get('PatientCondition').value;
      this.postprocedureCaseSheetModel.PainLevel = this.postprocedureform.get('Painlevel').value;
      this.postprocedureCaseSheetModel.PainSleepMedication = this.postprocedureform.get('PainSleepMedication').value;
      this.postprocedureCaseSheetModel.SignOffDate = new Date();
      this.postprocedureCaseSheetModel.SignOffUser = "";

      this.postProcedureCareService.savepostprocedurecasesheet(this.postprocedureCaseSheetModel).then(data => {
        if (data.PostProcedureID) {
          const formData = new FormData();
          this.multipleFileUpload.forEach(file => {
            formData.append('file', file, file.name);
          });
          if (this.multipleFileUpload.length == null || this.multipleFileUpload.length < 1) {
            this.util.showMessage('', ' Post Procedure Case Sheet saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
          }
          if (this.multipleFileUpload.length != null && this.multipleFileUpload.length > 0) {
            this.postProcedureCareService.FileUploadMultiple(formData, data.PostProcedureID, "PostProcedure/CaseSheet").then((res) => {
              if (res[0] == "Files successfully uploaded") {
                this.util.showMessage('', 'Post Procedure Case Sheet saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    this.FileUploadNames = [];
                    this.setDataForLabel();
                  }
                );

              } else if (res[0].includes('Error Uploading file')) {
                this.util.showMessage('', 'Error Uploading file', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                  this.setDataForLabel();
                });

              }
            })
          } 

          }


        })

      
    }
    else {
      if (!this.attendingphysician) {
        this.postprocedureform.get('AttendingPhysician').markAsTouched();
      }
      if (!this.procedurename) {
        this.postprocedureform.get('ProcedureName').markAsTouched();
      }
    }
  }
  //#endregion

  //#region "reset"
  reset() {
    this.postprocedureform.reset();
    this.postprocedureform.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('ProcedureStartTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('ProcedureEndTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.postprocedureform.get('ProcedureStartDate').setValue(new Date());
    this.postprocedureform.get('ProcedureEndDate').setValue(new Date());
    this.postprocedureform.get('RecordedDate').setValue(new Date());


    this.requiredViewFile = [];
    this.multipleFileUpload = [];
    this.FileUploadNames = [];
    this.setDataForLabel();

    this.postprocedureform.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
  }
  //#endregion

  //#region "Record by"
  getRecordBy() {
    this.postProcedureCareService.getRecordedBy().then(res => {
      this.recordby = res;
    })
  }
  //#endregion

  //#region "Record During"
  getRecordDuring() {
    this.postProcedureCareService.GetRecordDuring().then(res => {
      this.recordduring = res;
    })
  }
  //#endregion

  //#region "Patient Condition"
  getpatientCondition() {
    this.postProcedureCareService.getpatientcondition().then(res => {
      this.patientcondition = res;
    })
  }
  //#endregion

  //#region "Pain level"
  getpainlevel() {
    this.postProcedureCareService.getpainlevel().then(res => {
      this.painlevel = res;
    })
  }
  //#endregion

  //#region "Set Attending physician"
  getAttendingphysician(number) {
    this.attendingphysician = number;
  }
  //#endregion

  //#region  Attending physician
  getprocedure(number) {
    this.procedurename = number;
  }
  //#endregion

  // #region "Physician"
  getAdmittingphysician() {
    if (this.postprocedureform.get('AttendingPhysician').value != null) {
      this.postprocedureform.get('AttendingPhysician').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.GetAdmittingphysician(key).then(data => {

                this.AdmittingPhysiciansurgeon = data;
              })
            }
            else {
              this.AdmittingPhysiciansurgeon = null;
            }
          }
        })
    }
  }
  //#endregion

  // #region "procedurename"
  getprocedurename() {
    if (this.postprocedureform.get('ProcedureName').value != null) {
      this.postprocedureform.get('ProcedureName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.Getprocedurename(key).then(data => {

                this.Procedurename = data;
              })
            }
            else {
              this.Procedurename = null;
            }
          } else {
            this.Procedurename = null;
          }
        })
    }
  }
  //#endregion

  // #region "Cptcode"
  getCptcode() {
    if (this.postprocedureform.get('PrimaryCPTCode').value != null) {
      this.postprocedureform.get('PrimaryCPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.Getcptcode(key).then(data => {
                this.CPTCode = data;
              })
            }
            else {
              this.CPTCode = null;
              this.cptValueTooltip = null;
            }
          } else {
            this.CPTCode = null;
            this.cptValueTooltip = null;
          }
        })
    }
  }
  //#endregion

  //#region "recorded Date"
  recordDateAndTimeSet() {

    this.getDate = new Date(this.postprocedureform.get("RecordedDate").value);

    if (this.postprocedureform.get("RecordedDate").value != "") {
      if (this.postprocedureform.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.postprocedureform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.postprocedureform.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.postprocedureform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.postprocedureform.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  //#endregion

  //#region "proceduredate"
  sendproceduredate() {

    this.getDate = new Date(this.postprocedureform.get("ProcedureStartDate").value);

    if (this.postprocedureform.get("ProcedureStartDate").value != "") {
      if (this.postprocedureform.get("ProcedureStartTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.postprocedureform.get("ProcedureStartTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("ProcedureStartTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.postprocedureform.get("ProcedureStartTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.postprocedureform.get("ProcedureStartTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("ProcedureStartTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.postprocedureform.get("ProcedureStartTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getproceduretime = this.getDate

  }
  //#endregion

  //#region "ProcedureEndDate"
  sendprocedureenddate() {

    this.getDate = new Date(this.postprocedureform.get("ProcedureEndDate").value);

    if (this.postprocedureform.get("ProcedureEndDate").value != "") {
      if (this.postprocedureform.get("ProcedureEndTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.postprocedureform.get("ProcedureEndTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("ProcedureEndTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.postprocedureform.get("ProcedureEndTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.postprocedureform.get("ProcedureEndTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.postprocedureform.get("ProcedureEndTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.postprocedureform.get("ProcedureEndTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getprocedureenddatetime = this.getDate

  }
  //#endregion

  //#region "Signoff Function"
  signOffModel() {

    if (this.postprocedureform.get('UserName').value && this.postprocedureform.get('Password').value) {

      this.signoffModel.AdmissionId = this.AdmissionID;
      this.signoffModel.ScreenName = "postprocedurecasesheet";
      this.signoffModel.UserName = this.postprocedureform.get('UserName').value;
      this.signoffModel.Password = this.postprocedureform.get('Password').value;
      this.signoffModel.Status = "";

      this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
        (res: any) => {
          if (res == true) {

            this.postProcedureCareService.signoff(this.signoffModel).then(res => {
              if (res.status == "Post Procedure CaseSheet Signed Off successfully") {

                this.util.showMessage('', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    if (res == true) {
                      this.postprocedureform.disable();
                      this.isShow = true;
                      this.IsSignOff = true;

                      //this.router.navigate(['home/triage/triagelist']);
                    }
                  }
                );
              }
            })
          }
        })
    } else {
      this.util.showMessage('', 'Plese Fill  the username Or Password to Signoff ', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      );
    }
  }

  //#endregion

  //#region "back"
  back() {
    this.router.navigate(['/home/post-procedure-care']);
  }
  //#endregion
  public FileUploadFunction(file): void {

    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      let Temporaryfiles: File = <File>files[i];
      this.multipleFileUpload.push(Temporaryfiles);

      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Temporaryfiles.name;
      viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
      let fileUrl = URL.createObjectURL(Temporaryfiles);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;
      let lowerCaseFilename = (viewFile.FileName).toLowerCase();
      let ConfrimFile = (this.FileUploadNames.length > 0) ? this.FileUploadNames.includes(lowerCaseFilename) : false;
      if (ConfrimFile) {
        this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
        });
      } else {
        this.requiredViewFile.push(viewFile);
        this.FileUploadNames.push(lowerCaseFilename); //file name storing...
      }
    }
    this.attachment.nativeElement.value = '';
  }

  ////#region File Upload
  //public imageUpload(file): void {
  //  this.convertToBase64(file);
  //  let files = file.target.files
  //  if (files.length === 0) {
  //    this.util.showMessage("Error!!", " please choose an image format ", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
  //    return;
  //  }
  //  if (files[0].type.match(/image.*/)) {
  //    let Temporaryfiles: File = <File>files[0];
  //    this.FileUpload = (Temporaryfiles);

  //    let viewFile: clsViewFile = new clsViewFile();
  //    viewFile.FileName = Temporaryfiles.name;
  //    viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
  //    this.ViewFileUpload = (viewFile);

  //    if (this.profilePics) {
  //      this.imageFlag = false;
  //    } else {
  //      this.imageFlag = true;
  //    }

  //  } else {
  //    this.util.showMessage("Error!!", "Not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
  //  }

  //}

  //convertToBase64(event) {
  //  const file = event.target.files && event.target.files[0];
  //  if (file) {
  //    var reader = new FileReader();
  //    reader.readAsDataURL(file);

  //    reader.onload = (event) => {
  //      this.profilePics = (<FileReader>event.target).result;
  //    }
  //  }
  //}


  
  RemoveFile(fileName: string, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];
        this.requiredViewFile.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];
            let deletePath = (property.FileUrl.split(a)[0]);
            this.postProcedureCareService.DeleteFile(deletePath, fileName).then(res => { })
          }
        });

        for (const tempFile of this.requiredViewFile) {
          if (tempFile.FileName != fileName) {
            temporaryFile.push(tempFile);
          }
        }
        this.requiredViewFile = [];
        this.requiredViewFile = temporaryFile;

        for (const tempFile of this.multipleFileUpload) {
          if (tempFile.name != fileName) {
            temporaryFileupload.push(tempFile);
          }
        }
        this.multipleFileUpload = [];
        this.multipleFileUpload = temporaryFileupload;
      }
    });

  }

}
