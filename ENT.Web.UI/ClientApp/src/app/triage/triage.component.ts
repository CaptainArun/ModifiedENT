import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { TriageImagesPopupComponent } from './triage-images/triage-imagesPopup.component';
import { TriageVisitSummaryComponent } from './triage-visitSummary.component';
import { TriageEditEprescriptionComponent } from './triage-eprescription/triage-editEprescription.component';
import { TriageEditElabOrderComponent } from './triage-elab/triage-editElabOrder.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TriageService } from './triage.service';
import { DiagnosisModel } from './models/diagnosisModel';
import { ProcedureModel } from './models/procedureModel';
import { CarePlanModel } from './models/carePlanModel';
import { CustomHttpService } from '../core/custom-http.service';
import { AudiologyProcedureInfoComponent } from './audiology-procedure-info/audiology-procedure-info.component';
import { AudiologyRequestComponent } from './audiology-request/audiology-request.component';
import { VisitService } from '../visit/visit.service';
import { TableConfig } from '../ux/columnConfig';
import { signOffMOdel } from './models/signoffModel';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { VisitViewPatientHistoryComponent } from '../visit/visit-view-history/visit-viewPatientHistory.component';
import { clsViewFile } from '../patient/models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AddProcedureRequestComponent } from './procedure-request/add-procedure-request.component';
import { PatientVisitHistoryComponent } from '../visit/patient-visit-history/patient-visit-history.component';

@Component({
  selector: 'triage',
  templateUrl: './triage.component.html'
})

export class TriageComponent implements OnInit, AfterViewInit {
  diagnosisForm: FormGroup;
  procedureForm: FormGroup;
  carePlanForm: FormGroup;
  signOffForm: FormGroup;

  tableConfig: TableConfig = new TableConfig();
  diagnosisModel: DiagnosisModel = new DiagnosisModel();
  procedureModel: ProcedureModel = new ProcedureModel();
  carePlanModel: CarePlanModel = new CarePlanModel();
  signoffModel: signOffMOdel = new signOffMOdel();

  patientVisitHistoryList: any;
  showVisitHistory: boolean = false;
  problemAreavalues: any;
  symptoms: any;
  requestedProcedures: any;
  problemTypes: any;
  ICDCodes: string;
  ICDCode: string;
  CPTCodes: any;
  patientId: number;
  visitId: number;
  providerId: number;
  selectedIndex: number;
  diagnosisData: any;
  procedureData: any;
  carePlanData: any;
  visitDandt: any[] = [];
  visitID: number;
  recordedDuring: any = '';
  facilityId: number = 0;
  recordby: string;
  isReferedLab: boolean = false;
  patVisit: any[] = [];
  visitDateTimeValue: any;
  recordedDuringValue: any;
  problemStatus: any;
  procedureStatus: any;
  painScale: any;
  treatmentType: any;
  status: any;
  progress: any;
  isShow: boolean = false;
  problemAreaTooltip: any[];
  proArea: any;
  symptomsTooltip: any[];
  sympt: any;
  problemTypeTooltip: any[];
  proType: any;
  icdTooltip: any;
  cptTooltip: any;
  reqProcedureTooltip: any[];
  reqPro: any;
  getTimeHH: any;
  getDate: any;
  getTimeMin: any;
  getDateAndTime: any;
  routeData: any;
  icdTool: any;
  diagnosisImages: any;
  imgList: Array<File> = [];
  listOfImgFiles: Array<clsViewFile> = [];
  fileName: any[] = [];
  imgCount: boolean;
  DT: any;
  visitDT: any = [];
  uploadImg: boolean = false;
  showIcon: boolean = false;
  time: string;

  @ViewChild('image', { static: true }) image: ElementRef;
  @ViewChild('autoCompleteICD10Input', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router, private activeRoute: ActivatedRoute, private triageSvc: TriageService, public visitSvc: VisitService, private customHttpSvc: CustomHttpService, private util: UtilService, private sanitizer: DomSanitizer) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showHistory = true;

    this.tableConfig.columnConfig = [
      { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'VisitDate', DisplayName: 'Visit Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'Visittime', DisplayName: 'Visit Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ToConsult', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' }
    ];

    this.activeRoute.params.subscribe(params => {
      this.patientId = params['PatientId'],
      this.visitId = params['VisitId'],
      this.providerId = params['ProviderId']
    });

    this.setDiagnosisData();
    this.setProcedureData();
    this.setCarePlanData();
  }

  ngOnInit() {
    this.diagnosisForm = this.fb.group({
      VisitDateandTime1: ['', Validators.required],
      RecordedDate1: ['', Validators.required],
      RecordedTime1: ['', Validators.required],
      recordedDuring1: ['', Validators.required],
      RecordedBy1: ['', Validators.required],
      ChiefComplaint: ['', Validators.required],
      ProblemAreaID: ['', Validators.required],
      ProblemDuration: ['', Validators.required],
      PreviousHistory: [''],
      SymptomsID: ['', Validators.required],
      OtherSymptoms: [''],
      PainScale: [''],
      PainNotes: [''],
      Timings: [''],
      ProblemTypeID: ['', Validators.required],
      ProblemStatus: ['', Validators.required],
      AggravatedBy: [''],
      Alleviatedby: [''],
      Observationotes: [''],
      InteractionSummary: [''],
      PAdditionalNotes: [''],
      Prognosis: [''],
      AssessmentNotes: [''],
      DiagnosisNotes: [''],
      ICD10: [''],
      Etiology: [''],
      DAdditionalNotes: ['']
    });

    this.procedureForm = this.fb.group({
      VisitDateandTime2: ['', Validators.required],
      RecordedDate2: ['', Validators.required],
      RecordedTime2: ['', Validators.required],
      recordedDuring2: ['', Validators.required],
      RecordedBy2: ['', Validators.required],
      ChiefComplaint2: ['', Validators.required],
      DiagnosisNotes2: [''],
      TreatmentType: ['', Validators.required],
      RequestedprocedureId: [''],
      ProcedureNotes: ['', Validators.required],
      ProcedureStatus: ['', Validators.required],
      Proceduredate: [''],
      PrimaryICD: [''],
      PrimaryCPT: [''],
      Recommendedtest: [''],
      NotesandInstructions: [''],
      AdditionalNotes: [''],
      FollowUpNotes: [''],
      ReferralNotes: [''],
      IsReferred: ['']
    });

    this.carePlanForm = this.fb.group({
      VisitDateandTime3: ['', Validators.required],
      RecordedDate3: ['', Validators.required],
      RecordedTime3: ['', Validators.required],
      recordedDuring3: ['', Validators.required],
      RecordedBy3: ['', Validators.required],
      PlanningActivity: [''],
      Duration: [''],
      StartDate: [''],
      EndDate: [''],
      CarePlanStatus: [''],
      Progress: [''],
      NextVisitDate: [''],
      AdditionalNotes1: ['']
    });

    this.signOffForm = this.fb.group({
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: ['']
    });

    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.openCurrentVisitImages();
    this.getProviderNames();
    this.getVisitForPatient();
    this.bindAllProblemAreavalues();
    this.bindAllSymptoms();
    this.bindAllProblemTypes();
    this.bindDiagnosisCode();
    this.bindICDCode();
    this.bindTreatmentCode();
    this.bindAllRequestedProcedures();
    this.getVisitsbyPatientID();
    this.bindProblemStatus();
    this.bindProcedureStatus();
    this.bindPainScale();
    this.bindTreatmentTypes();
    this.getCarePlanProgress();
    this.getCarePlanStatus();
    this.changeTime();
    this.CheckValidDate();
    this.patVisit.push(this.patientId);
    this.patVisit.push(this.visitId);
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.diagnosisForm.get('ICD10').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.procedureForm.get('PrimaryCPT').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.procedureForm.get('PrimaryICD').setValue('');
        }
      });
  }

  changeTime() {
    this.time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
  }

  getVisitsbyPatientID() {
    this.visitSvc.getVisitsbyPatientID(this.patientId).then(res => {
      this.patientVisitHistoryList = res;
      if (this.patientVisitHistoryList.length != 0) {
        this.patientVisitHistoryList = res;
        this.showVisitHistory = true;
      }
      else {
        this.showVisitHistory = false;
      }
    });
  }

  openVisitView(element: any) {
    this.visitSvc.getPatientVisitByVisitId(element.Item.VisitId).then(data => {
      var visitDetails = data;
      const dialogRef = this.dialog.open(VisitViewPatientHistoryComponent, {
        data: visitDetails,
        width: '1200px'
      });
    });
  }

  openVisitHistory(event: any) {
    this.visitSvc.getPatientVisitHistory(event.Item.VisitId).then(data => {
      const value = {
        PatientName: event.Item.PatientName,
        VisitHistory: data
      }
      const dialogRef = this.dialog.open(PatientVisitHistoryComponent, {
        data: value,
        height: 'auto',
        width: '1200px'
      });
    });
  }

  openVisitSummary() {
    this.triageSvc.getVisitIntakeDataForVisit(this.patientId, this.visitId).then(data => {
      var visitData = data;
      const dialogRef = this.dialog.open(TriageVisitSummaryComponent, {
        data: visitData,
        height: 'auto',
        width: 'auto',
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    });
  }

  openAudiologyProcedure() {
    this.triageSvc.getAudiologyRequestRecordByVisitID(this.visitId).then(res => {
      if (res != null && res != undefined) {
        const dialogRef = this.dialog.open(AudiologyProcedureInfoComponent, {
          data: res,
          height: 'auto',
          width: 'auto'
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      }
      else {
        this.util.showMessage('', 'There is no record for audiology procedure', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
          (res) => { }
        );
      }
    });
  }

  openCurrentVisitImages() {
    this.triageSvc.getDiagnosisRecordById(this.visitId).then(data => {
      this.diagnosisImages = data;
      let imgcount = [];
      imgcount = this.diagnosisImages.imageSet;
      if (imgcount != null && imgcount != []) {
        this.imgCount = (imgcount.length > 0) ? true : false;
      }
      this.openMultipleVisitImages();
    });
  }

  openMultipleVisitImages() {
    if (this.visitId != null && this.visitId != undefined) {
      this.triageSvc.getPreviousVisitRecordById(this.visitId).then(res => {
        this.DT = res;
        if (this.DT.length > 0) {
          for (let i = 0; i < this.DT.length; i++) {
            if (this.DT[i].VisitId > 0) {
              this.triageSvc.getDiagnosisRecordById(this.DT[i].VisitId).then(data => {
                if (data.imageSet != null && data.imageSet.length > 0) {
                  this.visitDT.push(data);
                }
              });
            }
          }
        }
      });
    }
  }

  openImages() {
    let imageData = {
      imageCount: this.imgCount,
      imageSet: this.diagnosisImages.imageSet,
      VisitID: this.visitId,
      visitDateandTime: this.diagnosisImages.visitDateandTime
    }
    if (this.imgCount == true || this.visitDT.length > 0) {
      const dialogRef = this.dialog.open(TriageImagesPopupComponent, {
        data: imageData,
        height: 'auto',
        width: '2000px'
      });
      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.util.showMessage('', 'There is no record for images', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
    }
  }

  openEprescription() {
    this.triageSvc.getRoute().then(data => {
      this.routeData = data;
      this.triageSvc.getMedicationRequestForVisit(this.visitId).then(res => {
        const value = {
          visitId: this.visitId,
          record: res,
          route: this.routeData
        }
        const dialogRef = this.dialog.open(TriageEditEprescriptionComponent, {
          data: value,
          height: 'auto',
          width: '2000px',
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      });
    });
  }

  openElabOrder() {
    this.triageSvc.getELabRequestforVisit(this.visitId).then(res => {
      const value = {
        visitId: this.visitId,
        record: res
      }
      const dialogRef = this.dialog.open(TriageEditElabOrderComponent, {
        data: value,
        height: 'auto',
        width: '2000px',
      });
      dialogRef.afterClosed().subscribe(result => {

      });
    });
  }

  openAudiologyRequest() {
    const dialogRef = this.dialog.open(AudiologyRequestComponent, {
      data: this.visitId,
      height: 'auto',
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openProcedureRequest() {
    const dialogRef = this.dialog.open(AddProcedureRequestComponent, {
      data: this.patVisit,
      height: 'auto',
      width: '2000px'
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  bindAllProblemAreavalues() {
    this.triageSvc.getAllProblemAreavalues().then(data => {
      this.problemAreavalues = data;
    });
  }

  setProblemAreaTooltip() {
    this.problemAreaTooltip = [];
    this.proArea = this.diagnosisForm.get('ProblemAreaID').value;
    for (const option of this.problemAreavalues) {
      for (const i of this.proArea) {
        if (i == option.ProblemAreaId) {
          this.problemAreaTooltip.push(option.ProblemAreaDescription);
        }
      }
    }
  }

  bindAllSymptoms() {
    this.triageSvc.getAllSymptoms().then(data => {
      this.symptoms = data;
    });
  }

  setSymptomsTooltip() {
    this.symptomsTooltip = [];
    this.sympt = this.diagnosisForm.get('SymptomsID').value;
    for (const option of this.symptoms) {
      for (const i of this.sympt) {
        if (i == option.SymptomsId) {
          this.symptomsTooltip.push(option.SymptomsDescription);
        }
      }
    }
  }

  bindAllRequestedProcedures() {
    this.triageSvc.getAllRequestedProcedures().then(data => {
      this.requestedProcedures = data;
    });
  }

  setReqProcedureTooltip() {
    this.reqProcedureTooltip = [];
    this.reqPro = this.procedureForm.get('RequestedprocedureId').value;
    for (const option of this.requestedProcedures) {
      for (const i of this.reqPro) {
        if (i == option.RequestedProcedureId) {
          this.reqProcedureTooltip.push(option.RequestedProcedureDescription);
        }
      }
    }
  }

  bindAllProblemTypes() {
    this.triageSvc.getAllProblemTypes().then(data => {
      this.problemTypes = data;
    });
  }

  setProblemTypeTooltip() {
    this.problemTypeTooltip = [];
    this.proType = this.diagnosisForm.get('ProblemTypeID').value;
    for (const option of this.problemTypes) {
      for (const i of this.proType) {
        if (i == option.ProblemTypeId) {
          this.problemTypeTooltip.push(option.ProblemTypeDescription);
        }
      }
    }
  }

  bindProblemStatus() {
    this.triageSvc.getProblemStatus().then(data => {
      this.problemStatus = data;
    });
  }

  bindProcedureStatus() {
    this.triageSvc.getProcedureStatus().then(data => {
      this.procedureStatus = data;
    });
  }

  bindPainScale() {
    this.triageSvc.getPainScale().then(data => {
      this.painScale = data;
    });
  }

  bindTreatmentTypes() {
    this.triageSvc.getTreatmentTypes().then(data => {
      this.treatmentType = data;
    });
  }

  bindDiagnosisCode() {
    if (this.diagnosisForm.get('ICD10').value != null) {
      this.diagnosisForm.get('ICD10').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllDiagnosisCodes(key).then(data => {
                this.ICDCodes = data;
              });
            }
            else {
              this.ICDCodes = null;
              this.icdTool = null;
            }
          }
          else {
            this.ICDCodes = null;
            this.icdTool = null;
          }
        });
    }
  }

  setICDTool(value1, value2) {
    this.icdTool = value1 + ' ' + value2;
  }

  bindICDCode() {
    if (this.procedureForm.get('PrimaryICD').value != null) {
      this.procedureForm.get('PrimaryICD').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllDiagnosisCodes(key).then(data => {
                this.ICDCode = data;
              });
            }
            else {
              this.ICDCode = null;
              this.icdTooltip = null;
            }
          }
          else {
            this.ICDCode = null;
            this.icdTooltip = null;
          }
        });
    }
  }

  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }

  bindTreatmentCode() {
    if (this.procedureForm.get('PrimaryCPT').value != null) {
      this.procedureForm.get('PrimaryCPT').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllTreatmentCodes(key).then(data => {
                this.CPTCodes = data;
              });
            }
            else {
              this.CPTCodes = null;
              this.cptTooltip = null;
            }
          }
          else {
            this.CPTCodes = null;
            this.cptTooltip = null;
          }
        });
    }
  }

  setCPTTooltip(value1, value2) {
    this.cptTooltip = value1 + ' ' + value2;
  }

  getVisitForPatient() {
    this.triageSvc.getVisitForPatient(this.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    });
  }

  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    });
  }

  getCarePlanStatus() {
    this.triageSvc.getcareplanstatus().then(res => {
      this.status = res;
    });
  }

  getCarePlanProgress() {
    this.triageSvc.getcareplanprogress().then(res => {
      this.progress = res;
    });
  }

  isRefered(event) {
    this.isReferedLab = event.checked;
    if (this.isReferedLab == false) {
      this.procedureForm.get('ReferralNotes').reset();
    }
  }

  // File Upload
  onImageUpload(event) {
    let files = event.target.files;
    if (files.length == 0) {
      this.util.showMessage("Error!!", "Please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
      return;
    }
    else {
      if (files[0].type.match(/image.*/)) {
        for (let i = 0; i < files.length; i++) {
          var selectedFiles: File = <File>files[i];
          this.imgList.push(selectedFiles);

          let viewFile: clsViewFile = new clsViewFile();
          viewFile.FileName = selectedFiles.name;
          viewFile.Size = Math.round(selectedFiles.size / 1024) + " KB";

          let fileUrl = URL.createObjectURL(selectedFiles);
          let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
          viewFile.FileBlobUrl = selectedFileBLOB;

          let fileNameCase = (viewFile.FileName).toLowerCase();
          let confirmFile = (this.fileName.length > 0) ? this.fileName.includes(fileNameCase) : false;
          if (confirmFile) {
            this.util.showMessage(" ", "File Already Exist " + selectedFiles.name, BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(res => { });
          } else {
            this.listOfImgFiles.push(viewFile);
            this.fileName.push(fileNameCase);
          }
        }
      } else {
        this.util.showMessage("Error!!", "Not an image format, please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
      }
      this.image.nativeElement.value = '';
    }
  }

  removeImgFiles(fileName: string, index: number) {
    this.util.showMessage("Delete", "Are you sure want to delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.listOfImgFiles.filter((obj) => {
          if (obj.FileUrl != null && obj.FileName == fileName) {
            let a = "/" + obj.FileUrl.split("/")[obj.FileUrl.split("/").length - 1];
            let deletePath = (obj.FileUrl.split(a)[0]);
            this.triageSvc.RemoveFile(deletePath, fileName).then((res) => { });
          }
        });
        this.fileName.splice(index, 1);
        this.imgList.splice(index, 1);
        this.listOfImgFiles.splice(index, 1);
      }
    });
  }

  setImageFiles(Filedata) {
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; // Actual file is base64 ...

      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let FileData = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(FileData);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;

      let fileNameCase = (viewFile.FileName).toLowerCase();
      this.fileName.push(fileNameCase);
      this.listOfImgFiles.push(viewFile);
    }
  }
  
  CheckValidDate() {
    this.carePlanForm.get('StartDate').valueChanges.subscribe((data: any) => {
      if (new Date(this.carePlanForm.get('StartDate').value) > new Date(this.carePlanForm.get('EndDate').value)
        && ((this.carePlanForm.get('StartDate').value) != "" && (this.carePlanForm.get('StartDate').value) != null)
        && ((this.carePlanForm.get('EndDate').value) != "" && (this.carePlanForm.get('EndDate').value) != null)) {
        this.util.showMessage("Yes", "StartDate must be less than EndDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.carePlanForm.get('StartDate').setValue("");
        });
      }
    });

    this.carePlanForm.get('EndDate').valueChanges.subscribe((data: any) => {
      if (new Date(this.carePlanForm.get('StartDate').value) > new Date(this.carePlanForm.get('EndDate').value)
        && ((this.carePlanForm.get('StartDate').value) != "" && (this.carePlanForm.get('StartDate').value) != null)
        && ((this.carePlanForm.get('EndDate').value) != "" && (this.carePlanForm.get('EndDate').value) != null)) {
        this.util.showMessage("Yes", "EndDate must be greater than StartDate", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.carePlanForm.get('EndDate').setValue("");
        });
      }
    });
  }

  sendDateandTime() {
    this.getDate = new Date(this.diagnosisForm.get("RecordedDate1").value);

    if (this.diagnosisForm.get("RecordedDate1").value != "") {
      if (this.diagnosisForm.get("RecordedTime1").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.diagnosisForm.get("RecordedTime1").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.diagnosisForm.get("RecordedTime1").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.diagnosisForm.get("RecordedTime1").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.diagnosisForm.get("RecordedTime1").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.diagnosisForm.get("RecordedTime1").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.diagnosisForm.get("RecordedTime1").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  sendDateWithTime() {
    this.getDate = new Date(this.procedureForm.get("RecordedDate2").value);

    if (this.procedureForm.get("RecordedDate2").value != "") {
      if (this.procedureForm.get("RecordedTime2").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.procedureForm.get("RecordedTime2").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.procedureForm.get("RecordedTime2").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.procedureForm.get("RecordedTime2").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.procedureForm.get("RecordedTime2").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.procedureForm.get("RecordedTime2").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.procedureForm.get("RecordedTime2").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  sendDateTime() {
    this.getDate = new Date(this.carePlanForm.get("RecordedDate3").value);

    if (this.carePlanForm.get("RecordedDate3").value != "") {
      if (this.carePlanForm.get("RecordedTime3").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.carePlanForm.get("RecordedTime3").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.carePlanForm.get("RecordedTime3").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.carePlanForm.get("RecordedTime3").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.carePlanForm.get("RecordedTime3").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.carePlanForm.get("RecordedTime3").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.carePlanForm.get("RecordedTime3").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  setDiagnosisData() {  
    this.triageSvc.getcaseSheetDataForVisit(this.visitId).then(data => {
      this.diagnosisData = data;

      if ((this.diagnosisData.diagnosisModel != undefined && this.diagnosisData.diagnosisModel != null) && this.diagnosisData.diagnosisModel.VisitID != 0) {
        this.diagnosisForm.get('VisitDateandTime1').setValue(this.diagnosisData.diagnosisModel.visitDateandTime);
        this.diagnosisForm.get('RecordedDate1').setValue(this.diagnosisData.diagnosisModel.RecordedDate);
        this.diagnosisForm.get('RecordedTime1').setValue(new Date(this.diagnosisData.diagnosisModel.RecordedDate).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
        this.diagnosisForm.get('recordedDuring1').setValue(this.diagnosisData.diagnosisModel.recordedDuring);
        this.diagnosisForm.get('RecordedBy1').setValue(this.diagnosisData.diagnosisModel.RecordedBy);
        this.diagnosisForm.get('ChiefComplaint').setValue(this.diagnosisData.diagnosisModel.ChiefComplaint);
        this.diagnosisForm.get('ProblemAreaID').setValue(this.diagnosisData.diagnosisModel.ProblemAreaArray);
        this.problemAreaTooltip = this.diagnosisData.diagnosisModel.ProblemAreaValues;
        this.diagnosisForm.get('ProblemDuration').setValue(this.diagnosisData.diagnosisModel.ProblemDuration);
        this.diagnosisForm.get('PreviousHistory').setValue(this.diagnosisData.diagnosisModel.PreviousHistory);
        this.diagnosisForm.get('SymptomsID').setValue(this.diagnosisData.diagnosisModel.SymptomsValueArray);
        this.symptomsTooltip = this.diagnosisData.diagnosisModel.SymptomsValues;
        this.diagnosisForm.get('OtherSymptoms').setValue(this.diagnosisData.diagnosisModel.OtherSymptoms);
        this.diagnosisForm.get('PainScale').setValue(this.diagnosisData.diagnosisModel.PainScale);
        this.diagnosisForm.get('PainNotes').setValue(this.diagnosisData.diagnosisModel.PainNotes);
        this.diagnosisForm.get('Timings').setValue(this.diagnosisData.diagnosisModel.Timings);
        this.diagnosisForm.get('ProblemTypeID').setValue(this.diagnosisData.diagnosisModel.ProblemTypeArray);
        this.problemTypeTooltip = this.diagnosisData.diagnosisModel.ProblemTypeValues;
        this.diagnosisForm.get('AggravatedBy').setValue(this.diagnosisData.diagnosisModel.AggravatedBy);
        this.diagnosisForm.get('Alleviatedby').setValue(this.diagnosisData.diagnosisModel.Alleviatedby);
        this.diagnosisForm.get('ProblemStatus').setValue(this.diagnosisData.diagnosisModel.ProblemStatus);
        this.diagnosisForm.get('Observationotes').setValue(this.diagnosisData.diagnosisModel.Observationotes);
        this.diagnosisForm.get('InteractionSummary').setValue(this.diagnosisData.diagnosisModel.InteractionSummary);
        this.diagnosisForm.get('PAdditionalNotes').setValue(this.diagnosisData.diagnosisModel.PAdditionalNotes);
        this.diagnosisForm.get('Prognosis').setValue(this.diagnosisData.diagnosisModel.Prognosis);
        this.diagnosisForm.get('AssessmentNotes').setValue(this.diagnosisData.diagnosisModel.AssessmentNotes);
        this.diagnosisForm.get('ICD10').setValue(this.diagnosisData.diagnosisModel.ICD10);
        this.icdTool = this.diagnosisData.diagnosisModel.ICD10;
        this.diagnosisForm.get('Etiology').setValue(this.diagnosisData.diagnosisModel.Etiology);
        this.diagnosisForm.get('DiagnosisNotes').setValue(this.diagnosisData.diagnosisModel.DiagnosisNotes);
        this.diagnosisForm.get('DAdditionalNotes').setValue(this.diagnosisData.diagnosisModel.DAdditionalNotes);
        if (this.diagnosisData.diagnosisModel.filePath.length > 0) {
          this.setImageFiles(this.diagnosisData.diagnosisModel.filePath);
        }

        if (this.diagnosisData.diagnosisModel.signOffstatus == "Yes") {
          this.diagnosisForm.disable();
          this.procedureForm.disable();
          this.carePlanForm.disable();
          this.signOffForm.disable();
          this.uploadImg = true;
          this.showIcon = true;
          this.isShow = true;  
        }
      }
      else {
        this.triageSvc.getVisitRecordById(this.visitId).then(obj => {
          this.visitDateTimeValue = obj.VisitDateandTime;
          this.recordedDuringValue = obj.recordedDuring;
          this.diagnosisForm.get('VisitDateandTime1').setValue(obj.VisitDateandTime);
          this.diagnosisForm.get('RecordedDate1').setValue(new Date());
          this.diagnosisForm.get('RecordedTime1').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
          this.diagnosisForm.get('recordedDuring1').setValue(obj.recordedDuring);
        });
      }
    });
  }

  setProcedureData() {
    this.triageSvc.getcaseSheetDataForVisit(this.visitId).then(data => {
      this.procedureData = data;

      if ((this.procedureData.procedureModel != undefined && this.procedureData.procedureModel != null) && this.procedureData.procedureModel.VisitID != 0) {
        this.procedureForm.get('VisitDateandTime2').setValue(this.procedureData.procedureModel.visitDateandTime);
        this.procedureForm.get('RecordedDate2').setValue(this.procedureData.procedureModel.RecordedDate);
        this.procedureForm.get('RecordedTime2').setValue(new Date(this.procedureData.procedureModel.RecordedDate).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
        this.procedureForm.get('recordedDuring2').setValue(this.procedureData.procedureModel.recordedDuring);
        this.procedureForm.get('RecordedBy2').setValue(this.procedureData.procedureModel.RecordedBy);
        this.procedureForm.get('ChiefComplaint2').setValue(this.procedureData.procedureModel.ChiefComplaint);
        this.procedureForm.get('DiagnosisNotes2').setValue(this.procedureData.procedureModel.DiagnosisNotes);
        this.procedureForm.get('TreatmentType').setValue(this.procedureData.procedureModel.TreatmentType);
        this.procedureForm.get('ProcedureNotes').setValue(this.procedureData.procedureModel.ProcedureNotes);
        this.procedureForm.get('RequestedprocedureId').setValue(this.procedureData.procedureModel.requestedProcedureArray);
        this.reqProcedureTooltip = this.procedureData.procedureModel.requestedProcedureValues;
        this.procedureForm.get('Proceduredate').setValue(this.procedureData.procedureModel.Proceduredate);
        this.procedureForm.get('PrimaryCPT').setValue(this.procedureData.procedureModel.PrimaryCPT);
        this.cptTooltip = this.procedureData.procedureModel.PrimaryCPT;
        this.procedureForm.get('ProcedureStatus').setValue(this.procedureData.procedureModel.ProcedureStatus);
        this.procedureForm.get('IsReferred').setValue(this.procedureData.procedureModel.IsReferred);
        if (this.procedureData.procedureModel.IsReferred == true) {
          this.isReferedLab = true;
        }
        else {
          this.isReferedLab = false;
        }
        this.procedureForm.get('ReferralNotes').setValue(this.procedureData.procedureModel.ReferralNotes);
        this.procedureForm.get('PrimaryICD').setValue(this.procedureData.procedureModel.PrimaryICD);
        this.icdTooltip = this.procedureData.procedureModel.PrimaryICD;
        this.procedureForm.get('FollowUpNotes').setValue(this.procedureData.procedureModel.FollowUpNotes);
        this.procedureForm.get('AdditionalNotes').setValue(this.procedureData.procedureModel.AdditionalNotes);
        if (this.procedureData.procedureModel.signOffstatus == "Yes") {
          this.diagnosisForm.disable();
          this.procedureForm.disable();
          this.carePlanForm.disable();
          this.signOffForm.disable();
          this.uploadImg = true;
          this.showIcon = true;
          this.isShow = true;
        }
      }
      else {
        this.triageSvc.getVisitRecordById(this.visitId).then(obj => {
          this.visitDateTimeValue = obj.VisitDateandTime;
          this.recordedDuringValue = obj.recordedDuring;
          this.procedureForm.get('VisitDateandTime2').setValue(obj.VisitDateandTime);
          this.procedureForm.get('RecordedDate2').setValue(new Date());
          this.procedureForm.get('RecordedTime2').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
          this.procedureForm.get('recordedDuring2').setValue(obj.recordedDuring);
        });
      }
    });
  }

  setCarePlanData() {
    this.triageSvc.getcaseSheetDataForVisit(this.visitId).then(data => {
      this.carePlanData = data;

      if ((this.carePlanData.carePlanModel != undefined && this.carePlanData.carePlanModel != null) && this.carePlanData.carePlanModel.VisitID != 0) {
        this.carePlanForm.get('VisitDateandTime3').setValue(this.carePlanData.carePlanModel.visitDateandTime);
        this.carePlanForm.get('RecordedDate3').setValue(this.carePlanData.carePlanModel.RecordedDate);
        this.carePlanForm.get('RecordedTime3').setValue(new Date(this.carePlanData.carePlanModel.RecordedDate).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
        this.carePlanForm.get('recordedDuring3').setValue(this.carePlanData.carePlanModel.recordedDuring);
        this.carePlanForm.get('RecordedBy3').setValue(this.carePlanData.carePlanModel.RecordedBy);
        this.carePlanForm.get('PlanningActivity').setValue(this.carePlanData.carePlanModel.PlanningActivity);
        this.carePlanForm.get('Duration').setValue(this.carePlanData.carePlanModel.Duration);
        this.carePlanForm.get('StartDate').setValue(this.carePlanData.carePlanModel.StartDate);
        this.carePlanForm.get('EndDate').setValue(this.carePlanData.carePlanModel.EndDate);
        this.carePlanForm.get('CarePlanStatus').setValue(this.carePlanData.carePlanModel.CarePlanStatus);
        this.carePlanForm.get('Progress').setValue(this.carePlanData.carePlanModel.Progress);
        this.carePlanForm.get('NextVisitDate').setValue(this.carePlanData.carePlanModel.NextVisitDate);
        this.carePlanForm.get('AdditionalNotes1').setValue(this.carePlanData.carePlanModel.AdditionalNotes);
        if (this.carePlanData.carePlanModel.signOffstatus == "Yes") {
          this.diagnosisForm.disable();
          this.procedureForm.disable();
          this.carePlanForm.disable();
          this.signOffForm.disable();
          this.uploadImg = true;
          this.showIcon = true;
          this.isShow = true;
        }
      }
      else {
        this.triageSvc.getVisitRecordById(this.visitId).then(obj => {
          this.visitDateTimeValue = obj.VisitDateandTime;
          this.recordedDuringValue = obj.recordedDuring;
          this.carePlanForm.get('VisitDateandTime3').setValue(obj.VisitDateandTime);
          this.carePlanForm.get('RecordedDate3').setValue(new Date());
          this.carePlanForm.get('RecordedTime3').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
          this.carePlanForm.get('recordedDuring3').setValue(obj.recordedDuring);
        });
      }
    });
  }

  addUpdateDiagnosisData() {
    if (this.diagnosisForm.valid) {
      this.sendDateandTime();
      this.diagnosisModel.DiagnosisId = 0;
      this.diagnosisModel.VisitID = this.visitId;
      this.diagnosisModel.RecordedDate = this.getDateAndTime;
      this.diagnosisModel.RecordedBy = this.diagnosisForm.get('RecordedBy1').value;
      this.diagnosisModel.ChiefComplaint = this.diagnosisForm.get('ChiefComplaint').value;
      this.diagnosisModel.ProblemAreaID = this.diagnosisForm.get('ProblemAreaID').value.toString();
      this.diagnosisModel.ProblemDuration = this.diagnosisForm.get('ProblemDuration').value;
      this.diagnosisModel.PreviousHistory = this.diagnosisForm.get('PreviousHistory').value;
      this.diagnosisModel.SymptomsID = this.diagnosisForm.get('SymptomsID').value.toString();
      this.diagnosisModel.OtherSymptoms = this.diagnosisForm.get('OtherSymptoms').value;
      this.diagnosisModel.PainScale = this.diagnosisForm.get('PainScale').value ? parseInt(this.diagnosisForm.get('PainScale').value) : 0;
      this.diagnosisModel.PainNotes = this.diagnosisForm.get('PainNotes').value;
      this.diagnosisModel.Timings = this.diagnosisForm.get('Timings').value;
      this.diagnosisModel.ProblemTypeID = this.diagnosisForm.get('ProblemTypeID').value.toString();
      this.diagnosisModel.AggravatedBy = this.diagnosisForm.get('AggravatedBy').value;
      this.diagnosisModel.Alleviatedby = this.diagnosisForm.get('Alleviatedby').value;
      this.diagnosisModel.ProblemStatus = this.diagnosisForm.get('ProblemStatus').value;
      this.diagnosisModel.Observationotes = this.diagnosisForm.get('Observationotes').value;
      this.diagnosisModel.InteractionSummary = this.diagnosisForm.get('InteractionSummary').value;
      this.diagnosisModel.PAdditionalNotes = this.diagnosisForm.get('PAdditionalNotes').value;
      this.diagnosisModel.Prognosis = this.diagnosisForm.get('Prognosis').value;
      this.diagnosisModel.AssessmentNotes = this.diagnosisForm.get('AssessmentNotes').value;
      this.diagnosisModel.ICD10 = this.diagnosisForm.get('ICD10').value;
      this.diagnosisModel.DiagnosisNotes = this.diagnosisForm.get('DiagnosisNotes').value;
      this.diagnosisModel.Etiology = this.diagnosisForm.get('Etiology').value;
      this.diagnosisModel.DAdditionalNotes = this.diagnosisForm.get('DAdditionalNotes').value;

      this.triageSvc.addUpdateDiagnosisForVisitcase(this.diagnosisModel).then(data => {
        if (data.DiagnosisId) {
          const formData = new FormData();
          this.imgList.forEach(file => {
            formData.append('file', file, file.name);
          });

          this.triageSvc.FileUpload(formData, data.DiagnosisId, "Patient/Diagnosis").then((res) => {
            if (!res[0].includes('Error')) {
              this.openCurrentVisitImages();
              this.util.showMessage('', 'Diagnosis details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  this.selectedIndex = 1;
                });
              this.imgList = [];
              this.listOfImgFiles = [];
              this.fileName = [];
              this.setDiagnosisData();
            }
          });
        }
        else {
          this.util.showMessage("Error!!", data, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }

  addUpdateProcedureData() {
    if (this.procedureForm.valid) {
      this.sendDateWithTime();
      this.procedureModel.procedureId = 0;
      this.procedureModel.VisitID = this.visitId;
      this.procedureModel.RecordedDate = this.getDateAndTime;
      this.procedureModel.RecordedBy = this.procedureForm.get('RecordedBy2').value;
      this.procedureModel.ChiefComplaint = this.procedureForm.get('ChiefComplaint2').value;
      this.procedureModel.DiagnosisNotes = this.procedureForm.get('DiagnosisNotes2').value;
      this.procedureModel.PrimaryICD = this.procedureForm.get('PrimaryICD').value;
      this.procedureModel.TreatmentType = this.procedureForm.get('TreatmentType').value;
      this.procedureModel.RequestedprocedureId = this.procedureForm.get('RequestedprocedureId').value.toString();
      this.procedureModel.ProcedureNotes = this.procedureForm.get('ProcedureNotes').value;
      this.procedureModel.PrimaryCPT = this.procedureForm.get('PrimaryCPT').value;
      this.procedureModel.Proceduredate = this.procedureForm.get('Proceduredate').value;
      this.procedureModel.ProcedureStatus = this.procedureForm.get('ProcedureStatus').value;
      this.procedureModel.ReferralNotes = this.procedureForm.get('ReferralNotes').value;
      this.procedureModel.FollowUpNotes = this.procedureForm.get('FollowUpNotes').value;
      this.procedureModel.AdditionalNotes = this.procedureForm.get('AdditionalNotes').value;
      if (this.procedureModel.IsReferred == true || this.procedureModel.IsReferred != null) {
        this.procedureModel.IsReferred = !this.isReferedLab;
      }
      else if (this.procedureModel.IsReferred == false || this.procedureModel.IsReferred == null) {
        this.procedureModel.IsReferred = this.isReferedLab;
      }

      this.triageSvc.addUpdateProcedureForVisitcase(this.procedureModel).then(data => {
        this.util.showMessage('', 'Procedure details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => { 
            this.selectedIndex = 2;
          }
        );
      });
    }
  }

  addUpdateCarePlanData() {
    if (this.carePlanForm.valid) {
      this.sendDateTime();
      this.carePlanModel.CarePlanId = 0;
      this.carePlanModel.VisitID = this.visitId;
      this.carePlanModel.patientId = this.patientId;
      this.carePlanModel.providerId = this.providerId
      this.carePlanModel.RecordedDate = this.getDateAndTime;
      this.carePlanModel.RecordedBy = this.carePlanForm.get('RecordedBy3').value;
      this.carePlanModel.PlanningActivity = this.carePlanForm.get('PlanningActivity').value;
      this.carePlanModel.StartDate = this.carePlanForm.get('StartDate').value;
      this.carePlanModel.EndDate = this.carePlanForm.get('EndDate').value;
      this.carePlanModel.Duration = this.carePlanForm.get('Duration').value;
      this.carePlanModel.CarePlanStatus = this.carePlanForm.get('CarePlanStatus').value;
      this.carePlanModel.Progress = this.carePlanForm.get('Progress').value;
      this.carePlanModel.NextVisitDate = this.carePlanForm.get('NextVisitDate').value;
      this.carePlanModel.AdditionalNotes = this.carePlanForm.get('AdditionalNotes1').value;

      this.triageSvc.addUpdateCarePlanForVisitCase(this.carePlanModel).then(data => {
        this.util.showMessage('', 'Care plan details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => { 
            this.selectedIndex = 3;
          }
        );
      });
    }
  }
  
  diagnosisClear() {
    this.imgList = [];
    this.listOfImgFiles = [];
    this.fileName = [];
    this.diagnosisForm.reset();
    this.diagnosisForm.get('VisitDateandTime1').setValue(this.visitDateTimeValue);
    this.diagnosisForm.get('RecordedDate1').setValue(new Date());
    this.diagnosisForm.get('RecordedTime1').setValue(this.time);
    this.diagnosisForm.get('RecordedTime1').setValue(null);
    this.diagnosisForm.get('RecordedTime1').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
    this.diagnosisForm.get('recordedDuring1').setValue(this.recordedDuringValue);
    this.setDiagnosisData();
  }

  procedureClear() {
    this.procedureForm.reset();
    this.procedureForm.get('VisitDateandTime2').setValue(this.visitDateTimeValue);
    this.procedureForm.get('RecordedDate2').setValue(new Date());
    this.procedureForm.get('RecordedTime2').setValue(this.time);
    this.procedureForm.get('RecordedTime2').setValue(null);
    this.procedureForm.get('RecordedTime2').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
    this.procedureForm.get('recordedDuring2').setValue(this.recordedDuringValue);
    this.isReferedLab = false;
    this.setProcedureData();
  }

  carePlanClear() {
    this.carePlanForm.reset();
    this.carePlanForm.get('VisitDateandTime3').setValue(this.visitDateTimeValue);
    this.carePlanForm.get('RecordedDate3').setValue(new Date());
    this.carePlanForm.get('RecordedTime3').setValue(this.time);
    this.carePlanForm.get('RecordedTime3').setValue(null);
    this.carePlanForm.get('RecordedTime3').setValue(new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
    this.carePlanForm.get('recordedDuring3').setValue(this.recordedDuringValue);
    this.setCarePlanData();
  }

  back() {
    this.router.navigate(['home/triage/triagelist']);
  }

  signOffModel() {
    this.signoffModel.VisitId = this.visitId;
    this.signoffModel.ScreenName = "casesheet";
    this.signoffModel.UserName = this.signOffForm.get('UserName').value;
    this.signoffModel.Password = this.signOffForm.get('Password').value;
    this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.triageSvc.signoffModel(this.signoffModel).then(data => {
            if (data.status == "Case Sheet signOff Success") {
              this.diagnosisForm.disable();
              this.procedureForm.disable();
              this.carePlanForm.disable();
              this.signOffForm.disable();
              this.uploadImg = true;
              this.showIcon = true;
              this.isShow = true;
              this.util.showMessage('', data.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  if (res == true) {
                    this.router.navigate(['home/triage/triagelist']);
                  }
                }
              );
            } else {
              this.util.showMessage('', data.status, BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
            }
          });
        }
      });
  }

}