import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewPatientService } from '../../newPatient.service';
import { patientInsurancemodel } from '../../models/patientInsuranceModel';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-insurance-edit-record',
  templateUrl: './patient-insurance-edit-record.component.html',
  styleUrls: ['./patient-insurance-edit-record.component.css']
})
export class PatientInsuranceEditRecordComponent implements OnInit {
  //#region "Property Decleration"
  @ViewChild('multiple', { static: true }) attachement: any;
  requiredViewFilecount: boolean;

  insuranceEditForm: FormGroup;
  insuranceModule: patientInsurancemodel = new patientInsurancemodel;
  patientId: any = 1;
  visitDateTime: any[] = [];
  facilityId: number;
  recordedBy: any;
  visitID: number;
  patientRelationship: any[] = [];
  recordedDuring: any;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  multipleFileUpload: Array<File> = [];
  requiredViewFile: Array<clsViewFile> = [];
  FileUpload: Array<File> = [];
  fileToUpload: File;
  filepath: any = [];
  FileUploadNames: any[] = [];
  insuranceType: any;
  insurancecategory: any;

  //#endregion
   //#region "Constructor"
  constructor(private sanitizer: DomSanitizer,public custHTTP: CustomHttpService, public newPatientService: NewPatientService, public fb: FormBuilder, public dialogReg: MatDialogRef<PatientInsuranceEditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService) {
  }
    //#endregion
   //#region "ngOnInit"
  ngOnInit() {

    this.custHTTP.getDbName(localStorage.getItem('DatabaseName'));

    this.insuranceEditForm = this.fb.group(
      {
        InsuranceID: [''],
        VisitID: [''],
        RecordedDate: ['', Validators.required],
        RecordedBy: ['', Validators.required],
        InsuranceType: ['', Validators.required],
        InsuranceCategory: ['', Validators.required],
        InsuranceCompany: ['', Validators.required],
        Proposer: ['', Validators.required],
        RelationshipToPatient: ['', Validators.required],
        PolicyNo: ['', Validators.required],
        GroupPolicyNo: [''],
        CardNo: ['', Validators.required],
        ValidFrom: ['', Validators.required],
        ValidTo: ['', Validators.required],
        AdditionalInfo: [''],
        RecordedTime: ['', Validators.required],
        VisitDateandTime: ['', Validators.required],
        RecordedDuring: ['', Validators.required],
        PatientName: ['']
      })

    this.setFormValues();
    this.getVisitDateAndTime();
    this.getProviderName();
    this.getRelationshipToPatient();
    this.getInsuranceType();
    this.getInsurancecategory();
    this.CheckValidDate();
   // this.sendDateWithTime();
    this.insuranceEditForm.get('VisitDateandTime').disable();
    this.insuranceEditForm.get('RecordedDuring').disable();
  }
  //#endregion
  //#region Validate Date
  public CheckValidDate(): void {
    this.insuranceEditForm.get('ValidFrom').valueChanges.subscribe((EffectiveDate: any) => {
      if ((new Date(this.insuranceEditForm.get('ValidFrom').value) > new Date(this.insuranceEditForm.get('ValidTo').value))
        && ((this.insuranceEditForm.get('ValidFrom').value) != "" && (this.insuranceEditForm.get('ValidFrom').value) != null )
        && ((this.insuranceEditForm.get('ValidTo').value) != "" && (this.insuranceEditForm.get('ValidTo').value) != null))
      {
        this.util.showMessage("Yes", "ValidTo must be greater than ValidFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.insuranceEditForm.get('ValidFrom').setValue("");        
        });
        }
    });


    this.insuranceEditForm.get('ValidTo').valueChanges.subscribe((StartDate: any) => {
      if ((new Date(this.insuranceEditForm.get('ValidFrom').value) > new Date(this.insuranceEditForm.get('ValidTo').value))
        && ((this.insuranceEditForm.get('ValidFrom').value) != "" && (this.insuranceEditForm.get('ValidFrom').value) != null)
        && ((this.insuranceEditForm.get('ValidTo').value) != "" && (this.insuranceEditForm.get('ValidTo').value) != null))
        if (new Date(this.insuranceEditForm.get('ValidFrom').value) > new Date(this.insuranceEditForm.get('ValidTo').value)) {
          this.util.showMessage("Yes", "ValidTo must be greater than ValidFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            this.insuranceEditForm.get('ValidTo').setValue("");
           //} else {
          //  this.submitdisable = false;
          //}
          });
        }
    });
  }
      //#endregion

  //#region "Send Date"

  sendDateWithTime() {

    this.getDate = new Date(this.insuranceEditForm.get("RecordedDate").value);

    if (this.insuranceEditForm.get("RecordedDate").value != "") {
      if (this.insuranceEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.insuranceEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.insuranceEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.insuranceEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.insuranceEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.insuranceEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.insuranceEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;

  }
  //#endregion
  //#region "Insurance type"
  getInsuranceType() {
    this.newPatientService.getInsuranceType().then(res => {
      this.insuranceType = res;
    })
  }
   //#endregion
  //#region "Insurance Category"
  getInsurancecategory() {
    this.newPatientService.getInsurancecategory().then(res => {
      this.insurancecategory = res;
    })
  }
  //#endregion
  //#region "Set data"
  setFormValues() {
    this.setFileData(this.data.filePath)
    this.insuranceEditForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.insuranceEditForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.insuranceEditForm.get('RecordedDuring').setValue(this.data.recordedDuring);
    this.insuranceEditForm.get('InsuranceType').setValue(this.data.InsuranceType);
    this.insuranceEditForm.get('InsuranceCategory').setValue(this.data.InsuranceCategory);
    this.insuranceEditForm.get('InsuranceCompany').setValue(this.data.InsuranceCompany);
    this.insuranceEditForm.get('Proposer').setValue(this.data.Proposer);
    this.insuranceEditForm.get('RelationshipToPatient').setValue(this.data.RelationshipToPatient);
    this.insuranceEditForm.get('PolicyNo').setValue(this.data.PolicyNo);
    this.insuranceEditForm.get('GroupPolicyNo').setValue(this.data.GroupPolicyNo);
    this.insuranceEditForm.get('CardNo').setValue(this.data.CardNo);
    this.insuranceEditForm.get('ValidFrom').setValue(this.data.ValidFrom);
    this.insuranceEditForm.get('ValidTo').setValue(this.data.ValidTo);
    this.insuranceEditForm.get('AdditionalInfo').setValue(this.data.AdditionalInfo);
    this.insuranceEditForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    //this.insuranceEditForm.get('RecordedTime').setValue(this.data.RecordedTime);
    this.insuranceEditForm.get('VisitDateandTime').setValue(this.data.visitDateandTime);   
    this.insuranceEditForm.get('PatientName').setValue(this.data.PatientName);
    //this.requiredViewFile = [];
    //for (let i = 0; i < this.data.filePath.length; i++) {
    //  let viewFile: clsViewFile = new clsViewFile();
    //  viewFile.FileName = this.data.filePath[i].FileName;
    //  viewFile.Size = this.data.filePath[i].FileSize;
    // // this.sanitizer.bypassSecurityTrustUrl(this.data.filePath[i].FileUrl);
    //  viewFile.FileUrl = this.data.filePath[i].FileUrl;
    //  this.filepath = viewFile.FileUrl;
    //  this.requiredViewFile.push(viewFile);
    //}

  }
    //#endregion
  //#region "Set File"
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
      this.FileUploadNames.push(lowerCaseFilename);
      this.requiredViewFile.push(viewFile);
    }
  }
      //#endregion
  //#region "update"
  updateFormdata() {
    if (this.insuranceEditForm.valid) {
      this.sendDateWithTime();
      this.insuranceModule.InsuranceID = this.data.InsuranceID;
      this.insuranceModule.VisitID = this.data.VisitID;
      this.insuranceModule.RecordedDate = this.getDateAndTime;
      this.insuranceModule.RecordedBy = this.insuranceEditForm.get('RecordedBy').value;
      this.insuranceModule.InsuranceType = this.insuranceEditForm.get('InsuranceType').value;
      this.insuranceModule.InsuranceCategory = this.insuranceEditForm.get('InsuranceCategory').value;
      this.insuranceModule.InsuranceCompany = this.insuranceEditForm.get('InsuranceCompany').value;
      this.insuranceModule.Proposer = this.insuranceEditForm.get('Proposer').value;
      this.insuranceModule.RelationshipToPatient = this.insuranceEditForm.get('RelationshipToPatient').value;
      this.insuranceModule.PolicyNo = this.insuranceEditForm.get('PolicyNo').value;
      this.insuranceModule.GroupPolicyNo = this.insuranceEditForm.get('GroupPolicyNo').value;
      this.insuranceModule.CardNo = this.insuranceEditForm.get('CardNo').value;
      this.insuranceModule.ValidFrom = this.insuranceEditForm.get('ValidFrom').value;
      this.insuranceModule.ValidTo = this.insuranceEditForm.get('ValidTo').value;
      this.insuranceModule.AdditionalInfo = this.insuranceEditForm.get('AdditionalInfo').value;
      this.insuranceModule.RecordedTime = this.insuranceEditForm.get('RecordedTime').value;
      this.insuranceModule.VisitDateandTime = this.insuranceEditForm.get('VisitDateandTime').value;
      this.insuranceModule.RecordedDuring = this.insuranceEditForm.get('RecordedDuring').value;
      // this.insuranceModule.PatientName = this.insuranceEditForm.get('PatientName').value;
      this.newPatientService.AddUpdatePatientInsuranceData(this.insuranceModule).then(ipData => {
        if (ipData.InsuranceID) {
          const formData = new FormData();
          this.multipleFileUpload.forEach(file => {
            formData.append('file', file, file.name);
          });
          if (this.multipleFileUpload == null || this.multipleFileUpload.length < 1) {
            this.util.showMessage('', 'Patient Insurance details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
              if (res === true) {
                this.dialogReg.close("Updated");
              }
            })
          }

          if (this.multipleFileUpload != null && this.multipleFileUpload.length > 0) {

            this.newPatientService.FileUploadMultiple(formData, ipData.InsuranceID, "Patient/Insurance").then((res) => {
              if (res[0] == "Files successfully uploaded") {

                this.util.showMessage('', 'Patient Insurance details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    if (res === true) {
                      this.dialogReg.close("Updated");
                    }
                  }
                );
              } else if (res[0].includes('Error Uploading file')) {
                this.util.showMessage("Error!!", res, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox)
              }
            })
          }
        }
        });
      }



    }
        //#endregion
  //#region "get visit Date"
  getVisitDateAndTime() {

    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
      }
    });
  }
          //#endregion
  //#region "autoRecord"
  autoRecordedDuring(data: any) {

    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (x == data) {
          this.insuranceEditForm.get('RecordedDuring').setValue(res[x].recordedDuring);
          this.visitID = res[x].VisitId;
        }
      }
    });
  }
            //#endregion
  //#region "recordedBy"
  getProviderName() {

    this.newPatientService.GetProviderNames(this.facilityId).then(res => {
    this.recordedBy = res;
    })
  }
  //#endregion
  //#region "Realationship"
  getRelationshipToPatient() {

    this.newPatientService.getAllRelationship().then(res => {
      for (let i = 0; i < res.length; i++) {
        this.patientRelationship[i] = res[i].RSPDescription;
      }
    })
  }
    //#endregion
  //#region "Reset"
  restFormData() {
    this.FileUploadNames = [];
    this.requiredViewFile = [];
    this.multipleFileUpload = [];
    this.insuranceEditForm.reset();
    this.setFormValues();

  }
      //#endregion
  //#region "close"
  dialogClose(): void {
    this.dialogReg.close();
  }
        //#endregion
  //#region "Multiple"

  uploadMultiple(file) {
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
      }
      else {
        this.requiredViewFilecount = true;
        this.requiredViewFile.push(viewFile);
        this.FileUploadNames.push(lowerCaseFilename); //file name storing...
      }
    }
    this.attachement.nativeElement.value = '';
  }
   //#endregion
  //#region "Remove"
  RemoveFile(fileName: string,index): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];

        this.requiredViewFile.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];
            let deletePath = (property.FileUrl.split(a)[0]);
            this.newPatientService.DeleteFile(deletePath, fileName).then(res => { })
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
     //#endregion


    //transform(value: any, prefix = '') {
  //  return this.sanitizer.bypassSecurityTrustUrl(prefix + this.filepath);
  //}
}
