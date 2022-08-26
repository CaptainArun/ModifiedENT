import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { patientInsurancemodel } from '../../models/patientInsuranceModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-insurance-add-record',
  templateUrl: './patient-insurance-add-record.component.html',
  styleUrls: ['./patient-insurance-add-record.component.css']
})
export class PatientInsuranceAddRecordComponent implements OnInit {
  //#region "Property Decleration"
  @ViewChild('multiple', { static: false }) attachement: any;
  addInsuranceForm: FormGroup;
  insuranceModel: patientInsurancemodel = new patientInsurancemodel;

  visitDateTime: any[] = [];
  patientID: number = 1;
  recordedduring: any = '';
  visitID: any;
  //totalInfo: any;
  recordedBy: any[] = [];
  facilityId: number;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  patientRelationship: any[] = [];
  patientId: number;
 // UploadFile: any[];
 // fileNameDemo: any;
 // filesizeDemo: any;
//  fileToUpload: File;
  FileUploadNames: any[] = [];
  FileUpload: Array<File> = [];
  ViewFileUpload: Array<clsViewFile> = [];
  formdataArray: Array<FormData> = [];
  insurancecategory: any;
  selectedFile: File;
  insuranceType: any;
    //#endregion

  //ArrayOfSelectedFile = new Array<string>();
 //#region "Constructor"
  constructor(public newPatientService: NewPatientService, public fb: FormBuilder, public custHttp: CustomHttpService, public matDialog: MatDialogRef<PatientInsuranceAddRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public activateRoute: ActivatedRoute, private util: UtilService, private sanitizer: DomSanitizer) {
  }
    //#endregion
 //#region "ngOnInit"
  ngOnInit() {

    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
    });

    this.addInsuranceForm = this.fb.group(
      {
        InsuranceID: [''],
        VisitID: [''],
        RecordedDate: [new Date(), Validators.required],
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
        RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
        VisitDateandTime: ['', Validators.required],
        RecordedDuring: ['', Validators.required],

        PatientName: ['']
      });

    this.getVisitDateAndTime();
    this.getProviderName();
    this.getRelationshipToPatient();
    this.getInsurancecategory();
    this.getInsuranceType();
   this.CheckValidDate();

  }
   //#endregion
  //#region Validate Date
  public CheckValidDate(): void {
    this.addInsuranceForm.get('ValidFrom').valueChanges.subscribe((EffectiveDate: any) => {
      if (new Date(this.addInsuranceForm.get('ValidFrom').value) > new Date(this.addInsuranceForm.get('ValidTo').value)) {
        this.util.showMessage("Yes", "ValidTo must be greater than ValidFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          this.addInsuranceForm.get('ValidFrom').setValue("");
        });    //} else {
        //  this.submitdisable = false;
        //}

      }

    });

      this.addInsuranceForm.get('ValidTo').valueChanges.subscribe((StartDate: any) => {
        if (new Date(this.addInsuranceForm.get('ValidFrom').value) > new Date(this.addInsuranceForm.get('ValidTo').value)) {
          this.util.showMessage("Yes", "ValidTo must be greater than ValidFrom", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            this.addInsuranceForm.get('ValidTo').setValue("");
          });  //} else {
          //  this.submitdisable = false;
          //}

        }
     
    });
  }
      //#endregion
//#region "Insurance Type"
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
//#region "Submit"
  Submit() {

    if (this.addInsuranceForm.valid) {

      this.sendDateWithTime();

      //this.insuranceModel.InsuranceID = this.addInsuranceForm.get('InsuranceID').value;
      this.insuranceModel.VisitID = this.visitID; //this.addInsuranceForm.get('VisitID').value;
      this.insuranceModel.RecordedDate = this.getDateAndTime;
      this.insuranceModel.RecordedBy = this.addInsuranceForm.get('RecordedBy').value;
      this.insuranceModel.InsuranceType = this.addInsuranceForm.get('InsuranceType').value;
      this.insuranceModel.InsuranceCategory = this.addInsuranceForm.get('InsuranceCategory').value;
      this.insuranceModel.InsuranceCompany = this.addInsuranceForm.get('InsuranceCompany').value;
      this.insuranceModel.Proposer = this.addInsuranceForm.get('Proposer').value;
      this.insuranceModel.RelationshipToPatient = this.addInsuranceForm.get('RelationshipToPatient').value;
      this.insuranceModel.PolicyNo = this.addInsuranceForm.get('PolicyNo').value;
      this.insuranceModel.GroupPolicyNo = this.addInsuranceForm.get('GroupPolicyNo').value;
      this.insuranceModel.CardNo = this.addInsuranceForm.get('CardNo').value;
      this.insuranceModel.ValidFrom = this.addInsuranceForm.get('ValidFrom').value;
      this.insuranceModel.ValidTo = this.addInsuranceForm.get('ValidTo').value;
      this.insuranceModel.AdditionalInfo = this.addInsuranceForm.get('AdditionalInfo').value;
      //this.insuranceModel.RecordedTime = this.addInsuranceForm.get('RecordedTime').value;
      this.insuranceModel.VisitDateandTime = this.addInsuranceForm.get('VisitDateandTime').value;
      //this.insuranceModel.PatientName = this.addInsuranceForm.get('PatientName').value;

      this.newPatientService.AddUpdatePatientInsuranceData(this.insuranceModel).then(ipData => {


        if (ipData.InsuranceID) {

          const formData = new FormData();


          this.FileUpload.forEach(file => {
            formData.append('file', file, file.name);
          });
          if (this.FileUpload == null || this.FileUpload.length < 1) {
            this.util.showMessage('', 'Patient Insurance details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
              if (res === true) {
                this.matDialog.close("Updated");
              }
            })
          }
          if (this.FileUpload != null && this.FileUpload.length > 0) {
            this.newPatientService.FileUploadMultiple(formData, ipData.InsuranceID, "Patient/Insurance").then((res) => {


              if (res[0] == "Files successfully uploaded") {
              
                this.util.showMessage('', 'Patient Insurance details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    if (res === true) {
                      this.matDialog.close("Updated");
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
      //this.matDialog.close("Updated");
    }

  }
  //#endregion
  //#region "VisitDateandTime"
  getVisitDateAndTime() {

    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
      }
    });
  }
  //#endregion
  //#region "autoRecord"
  autoRecordedDuring(i: any) {

    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (x == i) {
          this.recordedduring = res[x].recordedDuring;
          this.visitID = res[x].VisitId;
          this.addInsuranceForm.get("RecordedDuring").setValue(this.recordedduring);

        }
      }
    });
  }
    //#endregion
  //#region "ProviderName"
  getProviderName() {

    this.newPatientService.GetProviderNames(this.facilityId).then(result => {
      this.recordedBy = result;
    })
  }
      //#endregion
  //#region "Relationship"
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
    this.addInsuranceForm.reset();
    this.addInsuranceForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ViewFileUpload = [];
    this.FileUploadNames = [];
    this.FileUpload = [];
    this.recordedduring = "";
  }
   //#endregion
   //#region "Close"
  dialogClose(): void {
    this.matDialog.close();
  }
     //#endregion
   //#region "Send date"
  sendDateWithTime() {

    this.getDate = new Date(this.addInsuranceForm.get("RecordedDate").value);

    if (this.addInsuranceForm.get("RecordedDate").value != "") {
      if (this.addInsuranceForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.addInsuranceForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.addInsuranceForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.addInsuranceForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.addInsuranceForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.addInsuranceForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.addInsuranceForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }
    //#endregion
   //#region "Visit Date"

  visitdate() {
    if (this.addInsuranceForm.get('VisitDateandTime').value > 0) {

    }

    else {
      this.util.showMessage('', '  Please select visit Date & Time', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)

    }
  }
   //#endregion
   //#region "File Upload"
  public FileUploadFunction(file): void {
    let files = file.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUpload.push(Temporaryfiles);
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
          this.ViewFileUpload.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename); //file name storing...
        }
      }
      this.attachement.nativeElement.value = '';
    }
  }
    //#endregion
   //#region "Remove"
  public RemoveFile(fileName,index): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.FileUploadNames.splice(index, 1);
          let viewFile: clsViewFile = new clsViewFile();
          viewFile.FileName = fileName;

          let temporaryFileView: Array<clsViewFile> = [];
          for (const tempFileView of this.ViewFileUpload) {
            if (tempFileView.FileName != fileName) {
              temporaryFileView.push(tempFileView);
            }
          }
          this.ViewFileUpload = [];
          this.ViewFileUpload = temporaryFileView;

          let temporaryFileupload: Array<File> = [];
          for (const tempFile of this.FileUpload) {
            if (tempFile.name != fileName) {
              temporaryFileupload.push(tempFile);
            }
          }
          this.FileUpload = [];
          this.FileUpload = temporaryFileupload;
        }
      }
    )
  };
  //#endregion
  ////////////////////////////////////

  //UploadFile() { }
  //requiredFileChange(evt: any) { }

    //upload(files) {

  //  if (files.length === 0) {
  //    return;
  //  }
  //  this.fileNameDemo = null;
  //  this.filesizeDemo = null;
  //  this.fileToUpload = <File>files[0];
  //  this.fileNameDemo = <File>files[0].name;
  //  this.filesizeDemo = Math.round(this.fileToUpload.size / 1024) + " KB";
  //}
  //onFileChanged(event: any) {
  //  this.ArrayOfSelectedFile = [];
  //  this.selectedFile = event.target.files;
  //  this.ArrayOfSelectedFile.push(event.target.files);
  //}

  //removeSelectedFile(index) {
  //  this.ArrayOfSelectedFile.splice(index, 1);
  //}
  //RemoveRequiredFile() {
  //  this.fileNameDemo = null;
  //  this.filesizeDemo = null;
  //}
}

