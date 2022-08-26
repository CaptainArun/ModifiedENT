import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { CustomHttpService } from "../../core/custom-http.service";
import { DischargeService } from '../discharge.service';
import { DischargeModel } from '../models/DischargeModel';
import { MedicationRequestsModel } from '../models/medicationRequestsModel';
import { ELabRequestModel } from '../models/eLabRequestModel';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { SignOffModel } from '../models/signOffModel';
import { clsViewFile } from 'src/app/patient/models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-discharge-add',
  templateUrl: './discharge-add.component.html',
  styleUrls: ['./discharge-add.component.css']
})

export class DischargeAddComponent implements OnInit {
  dischargeProcedureForm: FormGroup;
  dischargeModel: DischargeModel = new DischargeModel();
  medicationRequestModel: MedicationRequestsModel = new MedicationRequestsModel();
  eLabRequestModel: ELabRequestModel = new ELabRequestModel();
  signOffModel: SignOffModel = new SignOffModel();
  admissionId: any;
  patientId: number;
  hold: boolean = false;
  discontinue: boolean = false;
  notes: boolean = false;
  refill: boolean = false;
  drugName: any;
  routeName: any;
  diagnosisName: any;
  itemDrugId: number;
  itemDiagnosisId: number;
  testName: any;
  urgencyName: any;
  route: any;
  isSignOff: boolean = false;
  isMedRequestconfirmed: boolean = false;
  isLabRequestconfirmed: boolean = false;
  imgList: Array<File> = [];
  listOfImgFiles: Array<clsViewFile> = [];
  fileName: any[] = [];
  uploadImg: boolean = false;
  showIcon: boolean = false;
  itemNameList = [];
  diagnosisNameList = [];
  // FileUpload: File;
  // ViewImageUpload: clsViewFile;
  // localUrl: any;
  // picture: any;
  // img: any;
  // showImg: boolean;
  // disableImg: boolean = false;

  @ViewChild('image', { static: false }) image: ElementRef;

  constructor(private router: Router, public dialog: MatDialog, private activatedRoute: ActivatedRoute, private dischargeSvc: DischargeService, private fb: FormBuilder, private sanitizer: DomSanitizer, private util: UtilService, public customHttp: CustomHttpService) { }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activatedRoute.params.subscribe(params => {
      this.admissionId = params['AdmissionId'],
        this.patientId = params['PatientId']
    });

    this.dischargeProcedureForm = this.fb.group({
      AdmissionNumber: [''],
      RequestedDate: [''],
      RecommendedProcedure: [''],
      AdmittingPhysician: [''],
      PreProcedureDiagnosis: [''],
      PlannedProcedure: [''],
      Urgency: [''],
      AnesthesiaFitness: [''],
      OtherConsults: [''],
      PostoperativeDiagnosis: [''],
      BloodLossInfo: [''],
      Specimens: [''],
      PainDiscomfortLevel: [''],
      Complications: [''],
      Procedure: [''],
      AdditionalInfo: [''],
      FollowUpDate: [''],
      FollowUpDetails: [''],
      Start: [false, ''],
      Hold: [false, ''],
      HoldMedication: [''],
      Discontinue: [false, ''],
      DiscontinueDrugs: [''],
      Notes: [false, ''],
      NotesPharmacist: [''],
      Refill: [false, ''],
      RefillNumber: [''],
      Date: [''],
      RefillNotes: [''],
      Username: [localStorage.getItem('LoggedinUser')],
      Password: [''],
      medication: this.fb.array([this.Medication()]),
      eLab: this.fb.array([this.eLabOrder()])
    });
    this.getDischargeRecord();
    this.bindRoute();
    this.bindUrgency();
  }

  Medication(): FormGroup {
    return this.fb.group({
      ItemDrugName: ['', Validators.required],
      Route: [null, Validators.required],
      routeTooltip: [''],
      Diagnosis: ['', Validators.required],
      Qty: ['', Validators.required],
      Days: ['', Validators.required],
      MedicationTime: new FormGroup(
        {
          Morning: new FormControl(false),
          Brunch: new FormControl(false),
          Noon: new FormControl(false),
          Evening: new FormControl(false),
          Night: new FormControl(false),
        },
        this.CheckboxValidator()
      ),
      MedicationIntake: new FormGroup(
        {
          Before: new FormControl(false),
          After: new FormControl(false),
        },
        this.CheckboxValidator()
      ),
      MedicationStatus: ['', Validators.required],
      SIG: ['']
    });
  }

  eLabOrder(): FormGroup {
    return this.fb.group({
      SetupMasterID: ['', Validators.required],
      TestName: ['', Validators.required],
      Urgency: ['', Validators.required],
      DateLab: ['', Validators.required],
      Notes: ['', Validators.required]
    });
  }

  get medicationDynamic() {
    return <FormArray>this.dischargeProcedureForm.get('medication');
  }

  get eLabDynamic() {
    return <FormArray>this.dischargeProcedureForm.get('eLab');
  }

  CheckboxValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        let control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireOneCheckboxToBeChecked: true,
        };
      }
      return null;
    };
  }

  getDischargeRecord() {
    this.dischargeSvc.getDischargeSummaryRecord(this.admissionId).then((res) => {
      if (res != null && res != undefined) {
        this.dischargeProcedureForm.get('AdmissionNumber').setValue(res.AdmissionNumber);
        this.dischargeProcedureForm.get('RequestedDate').setValue(new Date(res.AdmissionDate).toLocaleDateString());
        this.dischargeProcedureForm.get('RecommendedProcedure').setValue(res.RecommendedProcedure);
        this.dischargeProcedureForm.get('AdmittingPhysician').setValue(res.AdmittingPhysician);
        this.dischargeProcedureForm.get('PreProcedureDiagnosis').setValue(res.PreProcedureDiagnosis);
        this.dischargeProcedureForm.get('PlannedProcedure').setValue(res.PlannedProcedure);
        this.dischargeProcedureForm.get('Urgency').setValue(res.Urgency);
        this.dischargeProcedureForm.get('AnesthesiaFitness').setValue(res.AnesthesiaFitnessNotes);
        this.dischargeProcedureForm.get('OtherConsults').setValue(res.OtherConsults);
        this.dischargeProcedureForm.get('PostoperativeDiagnosis').setValue(res.PostOperativeDiagnosis);
        this.dischargeProcedureForm.get('BloodLossInfo').setValue(res.BloodLossInfo);
        this.dischargeProcedureForm.get('Specimens').setValue(res.Specimens);
        this.dischargeProcedureForm.get('PainDiscomfortLevel').setValue(res.PainLevelNotes);
        this.dischargeProcedureForm.get('Complications').setValue(res.Complications);
        this.dischargeProcedureForm.get('Procedure').setValue(res.ProcedureNotes);
        this.dischargeProcedureForm.get('AdditionalInfo').setValue(res.AdditionalInfo);
        this.dischargeProcedureForm.get('FollowUpDate').setValue(res.FollowUpDate);
        this.dischargeProcedureForm.get('FollowUpDetails').setValue(res.FollowUpDetails);
        if (res.DischargeFile.length > 0) {
          this.setImageFiles(res.DischargeFile);
        }
        // this.picture = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + res.DischargeImage);
        // this.picture = [this.picture.changingThisBreaksApplicationSecurity];
        // this.img = res.DischargeImage;
        // if (this.img != null) {
        //   this.showImg = true;
        // }
        // else {
        //   this.showImg = false;
        // }

        this.dischargeSvc.getMedicationRouteforDischarge().then(data => {
          this.routeName = data;
        });

        if (res.medicationRequest != null && res.medicationRequest.medicationRequestItems.length > 0) {
          for (let i = 0; i < res.medicationRequest.medicationRequestItems.length; i++) {
            this.medicationDynamic.push(this.Medication());
            const control = <FormArray>this.dischargeProcedureForm.controls['medication'];
            control.controls[i].get('ItemDrugName').setValue(res.medicationRequest.medicationRequestItems[i].DrugName);
            this.itemNameList[i] = res.medicationRequest.medicationRequestItems[i].DrugName;
            control.controls[i].get('Route').setValue(res.medicationRequest.medicationRequestItems[i].MedicationRouteCode);
            for (const option of this.routeName) {
              if (control.controls[i].get('Route').value == option.RouteCode) {
                control.controls[i].get('routeTooltip').setValue(option.RouteDescription);
              }
            }
            control.controls[i].get('Diagnosis').setValue(res.medicationRequest.medicationRequestItems[i].ICDCode);
            this.diagnosisNameList[i] = res.medicationRequest.medicationRequestItems[i].ICDCode;
            control.controls[i].get('Qty').setValue(res.medicationRequest.medicationRequestItems[i].TotalQuantity);
            control.controls[i].get('Days').setValue(res.medicationRequest.medicationRequestItems[i].NoOfDays);
            control.controls[i].get('MedicationTime').get('Morning').setValue(res.medicationRequest.medicationRequestItems[i].Morning);
            control.controls[i].get('MedicationTime').get('Brunch').setValue(res.medicationRequest.medicationRequestItems[i].Brunch);
            control.controls[i].get('MedicationTime').get('Noon').setValue(res.medicationRequest.medicationRequestItems[i].Noon);
            control.controls[i].get('MedicationTime').get('Evening').setValue(res.medicationRequest.medicationRequestItems[i].Evening);
            control.controls[i].get('MedicationTime').get('Night').setValue(res.medicationRequest.medicationRequestItems[i].Night);
            control.controls[i].get('MedicationIntake').get('Before').setValue(res.medicationRequest.medicationRequestItems[i].Before);
            control.controls[i].get('MedicationIntake').get('After').setValue(res.medicationRequest.medicationRequestItems[i].After);
            control.controls[i].get('SIG').setValue(res.medicationRequest.medicationRequestItems[i].SIG);
            if (res.medicationRequest.medicationRequestItems[i].Start == true) {
              control.controls[i].get('MedicationStatus').setValue("start");
            }
            if (res.medicationRequest.medicationRequestItems[i].Hold == true) {
              control.controls[i].get('MedicationStatus').setValue("hold");
            }
            if (res.medicationRequest.medicationRequestItems[i].Continued == true) {
              control.controls[i].get('MedicationStatus').setValue("continue");
            }
            if (res.medicationRequest.medicationRequestItems[i].DisContinue == true) {
              control.controls[i].get('MedicationStatus').setValue("discontinue");
            }
            this.medicationDynamic.removeAt(res.medicationRequest.medicationRequestItems.length);
          }
          this.dischargeProcedureForm.get('Start').setValue(res.medicationRequest.TakeRegularMedication);
          this.dischargeProcedureForm.get('Hold').setValue(res.medicationRequest.IsHoldRegularMedication);
          if (res.medicationRequest.IsHoldRegularMedication != false) {
            this.hold = true;
          }
          this.dischargeProcedureForm.get('HoldMedication').setValue(res.medicationRequest.HoldRegularMedicationNotes);
          this.dischargeProcedureForm.get('Discontinue').setValue(res.medicationRequest.IsDiscontinueDrug);
          if (res.medicationRequest.IsDiscontinueDrug != false) {
            this.discontinue = true;
          }
          this.dischargeProcedureForm.get('DiscontinueDrugs').setValue(res.medicationRequest.DiscontinueDrugNotes);
          this.dischargeProcedureForm.get('Notes').setValue(res.medicationRequest.IsPharmacist);
          if (res.medicationRequest.IsPharmacist != false) {
            this.notes = true;
          }
          this.dischargeProcedureForm.get('NotesPharmacist').setValue(res.medicationRequest.PharmacistNotes);
          this.dischargeProcedureForm.get('Refill').setValue(res.medicationRequest.IsRefill);
          if (res.medicationRequest.IsRefill != false) {
            this.refill = true;
          }
          this.dischargeProcedureForm.get('RefillNumber').setValue(res.medicationRequest.RefillCount);
          this.dischargeProcedureForm.get('Date').setValue(res.medicationRequest.RefillDate);
          this.dischargeProcedureForm.get('RefillNotes').setValue(res.medicationRequest.RefillNotes);

          if (res.medicationRequest != null && (res.medicationRequest.MedicationRequestStatus == 'Confirmed' || res.medicationRequest.MedicationRequestStatus == 'Cancelled')) {
            this.isMedRequestconfirmed = true;
            this.dischargeProcedureForm.get('medication').disable();
            this.dischargeProcedureForm.get('Start').disable();
            this.dischargeProcedureForm.get('Hold').disable();
            this.dischargeProcedureForm.get('HoldMedication').disable();
            this.dischargeProcedureForm.get('Discontinue').disable();
            this.dischargeProcedureForm.get('DiscontinueDrugs').disable();
            this.dischargeProcedureForm.get('Notes').disable();
            this.dischargeProcedureForm.get('NotesPharmacist').disable();
            this.dischargeProcedureForm.get('Refill').disable();
            this.dischargeProcedureForm.get('RefillNumber').disable();
            this.dischargeProcedureForm.get('Date').disable();
            if (res.medicationRequest.RefillDate != null) {
              this.refill = false;
            }
            this.dischargeProcedureForm.get('RefillNotes').disable();
          }
          else {
            this.isMedRequestconfirmed = false;
          }
        }

        if (res.elabRequest != null && res.elabRequest.labRequestItems.length > 0) {
          for (let i = 0; i < res.elabRequest.labRequestItems.length; i++) {
            this.eLabDynamic.push(this.eLabOrder());
            const control = <FormArray>this.dischargeProcedureForm.controls['eLab'];
            control.controls[i].get('SetupMasterID').setValue(res.elabRequest.labRequestItems[i].SetupMasterID);
            control.controls[i].get('TestName').setValue(res.elabRequest.labRequestItems[i].setupMasterDesc);
            control.controls[i].get('Urgency').setValue(res.elabRequest.labRequestItems[i].UrgencyCode);
            control.controls[i].get('DateLab').setValue(res.elabRequest.labRequestItems[i].LabOnDate);
            control.controls[i].get('Notes').setValue(res.elabRequest.labRequestItems[i].LabNotes);
            this.eLabDynamic.removeAt(res.elabRequest.labRequestItems.length);
          }
          if (res.elabRequest.LabOrderStatus == 'Confirmed') {
            this.isLabRequestconfirmed = true;
            this.dischargeProcedureForm.get('eLab').disable();
          }
          else {
            this.isLabRequestconfirmed = false;
          }
        }

        if (res.SignOff == true) {
          this.dischargeProcedureForm.disable();
          this.isSignOff = true;
          this.refill = false;
          this.uploadImg = true;
          this.showIcon = true;
          // if (res.DischargeImage == null) {
          //   this.disableImg = true;
          // }
          // else {
          //   this.disableImg = false;
          // }
        }
      }
    });
  }

  getDrugList(index) {
    const control = <FormArray>this.dischargeProcedureForm.controls['medication'];
    let key = control.controls[index].get('ItemDrugName').value;
    if (key != null && key.length > 2) {
      this.dischargeSvc.getDrugNameforDischarge(key).then(data => {
        this.drugName = data;
      });
    }
    else {
      this.drugName = null;
    }
  }

  DrugId(DrugCodeID, NDCCode, Description, index) {
    this.itemDrugId = DrugCodeID;
    this.itemNameList[index] = NDCCode + '/' + Description;
  }

  autoResetDrug(value, index) {
    const items = <FormArray>this.dischargeProcedureForm.controls['medication'];
    if (!this.itemNameList.includes(value)) {
      items.controls[index].get('ItemDrugName').setValue('');
    }
  }

  bindRoute() {
    this.dischargeSvc.getMedicationRouteforDischarge().then(data => {
      this.routeName = data;
    });
  }

  setRouteTooltip(index) {
    const arr = <FormArray>this.dischargeProcedureForm.controls['medication'];
    this.route = arr.controls[index].get('Route').value;
    for (const option of this.routeName) {
      if (this.route == option.RouteCode) {
        arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
      }
    }
  }

  getDiagnosisList(index) {
    const control = <FormArray>this.dischargeProcedureForm.controls['medication'];
    let key = control.controls[index].get('Diagnosis').value;
    if (key != null && key.length > 2) {
      this.dischargeSvc.getDiagnosisCodeforDischarge(key).then(data => {
        this.diagnosisName = data;
      });
    }
    else {
      this.diagnosisName = null;
    }
  }

  DiagnosisId(DiagnosisCodeID, ICDCode, Description, index) {
    this.itemDiagnosisId = DiagnosisCodeID;
    this.diagnosisNameList[index] = ICDCode + '-' + Description;
  }

  autoResetDiagnosis(value, index) {
    const items = <FormArray>this.dischargeProcedureForm.controls['medication'];
    if (!this.diagnosisNameList.includes(value)) {
      items.controls[index].get('Diagnosis').setValue('');
    }
  }

  isHold(event) {
    this.hold = event.checked;
    if (this.hold == false) {
      this.resetHold();
    }
  }

  resetHold() {
    this.dischargeProcedureForm.get('HoldMedication').reset();
  }

  isDiscontinue(event) {
    this.discontinue = event.checked;
    if (this.discontinue == false) {
      this.resetDiscontinue();
    }
  }

  resetDiscontinue() {
    this.dischargeProcedureForm.get('DiscontinueDrugs').reset();
  }

  isNotes(event) {
    this.notes = event.checked;
    if (this.notes == false) {
      this.resetNotes();
    }
  }

  resetNotes() {
    this.dischargeProcedureForm.get('NotesPharmacist').reset();
  }

  isRefill(event) {
    this.refill = event.checked;
    if (this.refill == false) {
      this.resetRefill();
    }
  }

  resetRefill() {
    this.dischargeProcedureForm.get('RefillNumber').reset();
    this.dischargeProcedureForm.get('Date').reset();
    this.dischargeProcedureForm.get('RefillNotes').reset();
  }

  getTestNameList(index) {
    const control = <FormArray>this.dischargeProcedureForm.controls['eLab'];
    this.testName = [];
    control.controls[index].get('SetupMasterID').setValue(0);
    let key = control.controls[index].get('TestName').value;
        if (key != null && key != undefined && key != '') {
          if (key.length > 2) {
            this.dischargeSvc.getTestNameforDischarge(key).then(data => {
              if (data.length > 0) {
              this.testName = data;
              }
              else {
                this.testName = [];
                control.controls[index].get('SetupMasterID').setValue(0);
              }
            });
          }
          else {
            this.testName = null;
            control.controls[index].get('SetupMasterID').setValue(0);
          }
        }
        else {
          this.testName = null;
          control.controls[index].get('SetupMasterID').setValue(0);
        }
  }

  SetupMasterID(index, number) {
    const setvalue = <FormArray>this.dischargeProcedureForm.controls['eLab'];
    setvalue.controls[index].get('SetupMasterID').setValue(number);
  }
 
  toValidateTestName(index: number) {
    const items = <FormArray>this.dischargeProcedureForm.controls['eLab'];
    if (!(items.controls[index].get('SetupMasterID').value > 0)) {
      items.controls[index].get('TestName').setValue('');
    }
  }

  bindUrgency() {
    this.dischargeSvc.getUrgencyTypeforDischarge().then(data => {
      this.urgencyName = data;
    });
  }

  onAddRowMedication() {
    this.medicationDynamic.push(this.Medication());
    this.drugName = null;
    this.diagnosisName = null;
  }

  onRemoveRowMedication(rowIndex: number) {
    this.medicationDynamic.removeAt(rowIndex);
  }

  onAddRowELabOrder() {
    this.eLabDynamic.push(this.eLabOrder());
    this.testName = null;
  }

  onRemoveRowELabOrder(rowIndex: number) {
    this.eLabDynamic.removeAt(rowIndex);
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
            this.dischargeSvc.RemoveFile(deletePath, fileName).then((res) => { });
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

  // imageUpload(file) {
  //   this.localUrl = [];
  //   if (file.target.files && file.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       this.localUrl = event.target.result;
  //     }
  //     reader.readAsDataURL(file.target.files[0]);
  //   }
  //   let files = file.target.files;
  //   if (files.length === 0) {
  //     this.util.showMessage("Error!!", "Please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
  //     return;
  //   }
  //   if (files[0].type.match(/image.*/)) {
  //     let Temporaryfiles: File = <File>files[0];
  //     this.FileUpload = (Temporaryfiles);

  //     let viewFile: clsViewFile = new clsViewFile();
  //     viewFile.FileName = Temporaryfiles.name;
  //     viewFile.Size = Math.round(Temporaryfiles.size / 1024) + "KB";
  //     this.ViewImageUpload = (viewFile);
  //   } else {
  //     this.util.showMessage("Error!!", "Not an image format, please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
  //   }
  //   this.image.nativeElement.value = '';
  // }

  // RemoveFile() {
  //   this.ViewImageUpload = (null);
  //   this.FileUpload = (null);
  // }

  submitData() {
    if (this.dischargeProcedureForm.valid) {
      this.dischargeModel.DischargeSummaryId = 0;
      this.dischargeModel.RecommendedProcedure = this.dischargeProcedureForm.get('RecommendedProcedure').value;
      this.dischargeModel.AdmissionNumber = this.dischargeProcedureForm.get('AdmissionNumber').value;
      this.dischargeModel.AdmissionDate = this.dischargeProcedureForm.get('RequestedDate').value;
      this.dischargeModel.AdmittingPhysician = this.dischargeProcedureForm.get('AdmittingPhysician').value;
      this.dischargeModel.PreProcedureDiagnosis = this.dischargeProcedureForm.get('PreProcedureDiagnosis').value;
      this.dischargeModel.PlannedProcedure = this.dischargeProcedureForm.get('PlannedProcedure').value;
      this.dischargeModel.Urgency = this.dischargeProcedureForm.get('Urgency').value;
      this.dischargeModel.AnesthesiaFitnessNotes = this.dischargeProcedureForm.get('AnesthesiaFitness').value;
      this.dischargeModel.OtherConsults = this.dischargeProcedureForm.get('OtherConsults').value;
      this.dischargeModel.PostOperativeDiagnosis = this.dischargeProcedureForm.get('PostoperativeDiagnosis').value;
      this.dischargeModel.BloodLossInfo = this.dischargeProcedureForm.get('BloodLossInfo').value;
      this.dischargeModel.Specimens = this.dischargeProcedureForm.get('Specimens').value;
      this.dischargeModel.PainLevelNotes = this.dischargeProcedureForm.get('PainDiscomfortLevel').value;
      this.dischargeModel.Complications = this.dischargeProcedureForm.get('Complications').value;
      this.dischargeModel.ProcedureNotes = this.dischargeProcedureForm.get('Procedure').value;
      this.dischargeModel.AdditionalInfo = this.dischargeProcedureForm.get('AdditionalInfo').value;
      this.dischargeModel.FollowUpDate = this.dischargeProcedureForm.get('FollowUpDate').value;
      this.dischargeModel.FollowUpDetails = this.dischargeProcedureForm.get('FollowUpDetails').value;
      this.medicationRequestModel.MedicationRequestId = 0;
      this.medicationRequestModel.VisitID = 0;
      this.medicationRequestModel.AdmissionID = parseInt(this.admissionId);
      this.medicationRequestModel.TakeRegularMedication = this.dischargeProcedureForm.get('Start').value;
      this.medicationRequestModel.IsHoldRegularMedication = this.dischargeProcedureForm.get('Hold').value;
      this.medicationRequestModel.HoldRegularMedicationNotes = this.dischargeProcedureForm.get('HoldMedication').value;
      this.medicationRequestModel.IsDiscontinueDrug = this.dischargeProcedureForm.get('Discontinue').value;
      this.medicationRequestModel.DiscontinueDrugNotes = this.dischargeProcedureForm.get('DiscontinueDrugs').value;
      this.medicationRequestModel.IsPharmacist = this.dischargeProcedureForm.get('Notes').value;
      this.medicationRequestModel.PharmacistNotes = this.dischargeProcedureForm.get('NotesPharmacist').value;
      this.medicationRequestModel.IsRefill = this.dischargeProcedureForm.get('Refill').value;
      this.medicationRequestModel.RefillCount = this.dischargeProcedureForm.get('RefillNumber').value;
      this.medicationRequestModel.RefillDate = this.dischargeProcedureForm.get('Date').value;
      this.medicationRequestModel.RefillNotes = this.dischargeProcedureForm.get('RefillNotes').value;
      this.eLabRequestModel.LabRequestID = 0;
      this.eLabRequestModel.VisitID = 0;
      this.eLabRequestModel.AdmissionID = parseInt(this.admissionId);

      this.medicationRequestModel.medicationRequestItems = [];
      const control = <FormArray>this.dischargeProcedureForm.controls['medication'];
      for (let row of control.controls) {
        this.medicationRequestModel.medicationRequestItems.push({
          MedicationRequestItemId: 0,
          MedicationRequestId: 0,
          DrugName: row.get('ItemDrugName').value,
          MedicationRouteCode: row.get('Route').value,
          ICDCode: row.get('Diagnosis').value,
          TotalQuantity: row.get('Qty').value,
          NoOfDays: row.get('Days').value,
          Morning: row.get('MedicationTime').get('Morning').value,
          Brunch: row.get('MedicationTime').get('Brunch').value,
          Noon: row.get('MedicationTime').get('Noon').value,
          Evening: row.get('MedicationTime').get('Evening').value,
          Night: row.get('MedicationTime').get('Night').value,
          Before: row.get('MedicationIntake').get('Before').value,
          After: row.get('MedicationIntake').get('After').value,
          Start: row.get('MedicationStatus').value == "start" ? true : false,
          Hold: row.get('MedicationStatus').value == "hold" ? true : false,
          Continued: row.get('MedicationStatus').value == "continue" ? true : false,
          DisContinue: row.get('MedicationStatus').value == "discontinue" ? true : false,
          SIG: row.get('SIG').value
        });
      }

      this.eLabRequestModel.labRequestItems = [];
      const ctrl = <FormArray>this.dischargeProcedureForm.controls['eLab'];
      for (let row of ctrl.controls) {
        this.eLabRequestModel.labRequestItems.push({
          LabRequestItemsID: 0,
          LabRequestID: 0,
          SetupMasterID: row.get('SetupMasterID').value,
          UrgencyCode: row.get('Urgency').value,
          LabOnDate: row.get('DateLab').value,
          LabNotes: row.get('Notes').value,
        });
      }
      this.dischargeModel.medicationRequest = this.medicationRequestModel;
      this.dischargeModel.elabRequest = this.eLabRequestModel;

      this.dischargeSvc.addUpdateDischargeData(this.dischargeModel).then(res => {
        if (res.DischargeSummaryId) {
          const formData = new FormData();
          this.imgList.forEach(file => {
            formData.append('file', file, file.name);
            // formData.append('file', this.FileUpload, this.FileUpload.name);
          });

          this.dischargeSvc.FileUpload(formData, res.DischargeSummaryId, "Discharge").then((res) => {
            if (res != null) {
              this.util.showMessage('', 'Discharge data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => { });
                this.imgList = [];
                this.listOfImgFiles = [];
                this.fileName = [];
                this.getDischargeRecord();
            }
          });
        }
      });
    }
  }

  back() {
    this.router.navigate(['home/discharge/dischargelist']);
  }

  resetForm() {
    this.imgList = [];
    this.listOfImgFiles = [];
    this.fileName = [];
    this.dischargeProcedureForm.reset();
    this.medicationDynamic.clear();
    this.onAddRowMedication();
    this.eLabDynamic.clear();
    this.onAddRowELabOrder();
    this.hold = false;
    this.discontinue = false;
    this.notes = false;
    this.refill = false;
    this.dischargeProcedureForm.get('Username').setValue(localStorage.getItem('LoggedinUser'));
    // this.RemoveFile();
    this.getDischargeRecord();
  }

  signOff() {
    if (this.dischargeProcedureForm.get('Username').value != '' && this.dischargeProcedureForm.get('Password').value != '') {
      this.signOffModel.AdmissionId = this.admissionId;
      this.signOffModel.ScreenName = "Discharge";
      this.signOffModel.UserName = this.dischargeProcedureForm.get('Username').value;
      this.signOffModel.Password = this.dischargeProcedureForm.get('Password').value;
      this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
        (res: any) => {
          if (res == true && this.dischargeProcedureForm.valid) {
            this.dischargeSvc.signOff(this.signOffModel).then(data => {
              if (data.status == "Discharge signOff Success") {
                this.dischargeProcedureForm.disable();
                this.isSignOff = true;
                this.util.showMessage('', data.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    if (res == true) {
                      this.router.navigate(['home/discharge/dischargelist']);
                    }
                  }
                );
              }
              else {
                this.util.showMessage('', data.status, BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
              }
            });
          }
          else if (res != false) {
            this.util.showMessage('', 'Discharge procedure form is invalid, please fill the required fields', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => { }
            )
          }
        });
    }
  }

}








