import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewPatientRegModel } from '../models/newPatientRegModel';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../models/clsViewFile';
import { Observable, ReplaySubject, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { imageCropComponent } from '../../image-crop/image-crop.component';

@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.css']
})

export class AddNewPatientComponent implements OnInit {
  //@ViewChild('multiple', { static: true }) attachment: any;
  maxDate = new Date();

  //#region Property declaration
  patientRegistrationForm: FormGroup;
  gender: any;
  elementType = 'url';
  qrReaderValue: any;
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel();
  identificationType: any;
  patientRelations: any;
  RegisterAt: string = "Primary Hospital";
  qrreader: any;
  tenantName: string;
  patientCategory: any;
  patientType: any;
  maritalStatus: any;
  religion: any;
  race: any;
  salution: any;
  contactType: any;
  bloodGroup: any;
  bindAge: any;
  bindDOB: Date;
  identification: any;
  identificationDetail: any;
  contact: any;
  secondarycontact: any;
  kinprimarycontact: any;
  stateValue: any;
  countryValue: any;
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  ImageBase64: any;
  imageFlag: boolean = true;
  myimage: Observable<any>;
  facilitiesPatientData: any;
  facilityIdValue: number;
  formData: any;
  validId: any;
  enableInput: boolean = true;
  enableInput2: boolean = true;
  //#endregion Property declaration

  //#region Constructor
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private sanitizer: DomSanitizer, private patientService: NewPatientService, private customHttpSvc: CustomHttpService,
    public DialogRef: MatDialogRef<AddNewPatientComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.patientRegistrationForm = this.fb.group({
      PatientType: ['', Validators.required],
      PatientCategory: [''],
      Salutation: ['', Validators.required],
      PatientFirstName: ['', Validators.required],
      PatientLastName: ['', Validators.required],
      PatientMiddleName: [''],
      PatientDOB: ['', Validators.required],
      PatientAge: ['', Validators.required],
      Gender: ['', Validators.required],
      IDTID1: ['', Validators.required],
      PatientIdentificationtype1details: ['', Validators.required],
      IDTID2: [''],
      PatientIdentificationtype2details: [''],
      MaritalStatus: [''],
      Religion: [''],
      Race: [''],
      Occupation: [''],
      PrimaryContactType: [''],
      PrimaryContactNumber: ['', [Validators.required]],
      SecondaryContactType: [''],
      SecondaryContactNumber: [''],
      email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      Emergencycontactnumber: ['', Validators.required],
      Address1: [''],
      Address2: [''],
      Village: [''],
      Town: [''],
      Pincode: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      Bloodgroup: [''],
      NKSalutation: ['', Validators.required],
      NKFirstname: ['', Validators.required],
      NKLastname: ['', Validators.required],
      NKContactType: [''],
      NKPrimarycontactnumber: ['', Validators.required],
      Relationship: [''],
      Facility: ['']
      //for search
    });

    const facilityName: any = JSON.parse(localStorage.getItem('DBdetails'));
    this.tenantName = facilityName.ClientDisplayName + " - " + facilityName.TenantDisplayName;
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getFacilitiesforpatient();
    this.getIdentificationType();
    this.getAllRelationForPatient();
    this.getPatientType();
    this.getPatientcategory();
    this.getPatientMaritalStatus();
    this.getReligionforPatient();
    this.getRaceforPatient();
    this.getSalutionforPatient();
    this.getGenderforPatient();
    this.getContactType();
    this.getBloodGroup();
    this.getStateValue();
    this.getCountryValue();
  }
  //#endregion ngOnInit

  //#region get values

  getFacilitiesforpatient() {
    this.patientService.getFacilitiesforpatient().then(data => {
      this.facilitiesPatientData = data;
    });
  }

  getStateValue() {
    this.patientService.getStateValue().then(res => {
      this.stateValue = res;
    })
  }
  
  getCountryValue() {
    this.patientService.getCountryValue().then(res => {
      this.countryValue = res;
    })
  }

  getIdentificationType() {
    this.patientService.getIdentificationType().then(res => {
      this.identificationType = res;
    });
  }

  getPatientcategory() {
    this.patientService.getPatientCategory().then(res => {
      this.patientCategory = res;
    })
  }

  getPatientType() {
    this.patientService.getPatientType().then(res => {
      this.patientType = res;
    })
  }

  getPatientMaritalStatus() {
    this.patientService.getMaritalStatus().then(res => {
      this.maritalStatus = res;
    })
  }

  getReligionforPatient() {
    this.patientService.getReligionPatient().then(res => {
      this.religion = res;
    })
  }

  getRaceforPatient() {
    this.patientService.getRacesPatient().then(res => {
      this.race = res;
    })
  }

  getGenderforPatient() {
    this.patientService.getGenderforPatient().then(res => {
      this.gender = res;
    })
  }

  getSalutionforPatient() {
    this.patientService.getSalutionforPatient().then(res => {
      this.salution = res;
    })
  }

  getContactType() {
    this.patientService.getContactTypeforPatient().then(res => {
      this.contactType = res;
    })
  }

  getBloodGroup() {
    this.patientService.getBloodGroupforPatient().then(res => {
      this.bloodGroup = res;
    })
  }

  getAllRelationForPatient() {
    this.patientService.getAllRelationship().then(res => {
      this.patientRelations = res;
    });
  }
  //#endregion get values

  //#region Qr Code
  openOcr() { }

  setqrcode() {
    this.patientRegistrationForm.get('PatientFirstName').markAsTouched();
    this.patientRegistrationForm.get('PatientLastName').markAsTouched();
    this.patientRegistrationForm.get('PrimaryContactNumber').markAsTouched();
    this.patientRegistrationForm.get('Salutation').markAsTouched();
    if
      (this.patientRegistrationForm.get('Salutation').value && this.patientRegistrationForm.get('PatientFirstName').value && this.patientRegistrationForm.get('PatientLastName').value && this.patientRegistrationForm.get('PrimaryContactNumber').value) {
      this.newPatientRegModel.Salutation = this.patientRegistrationForm.get('Salutation').value;
      this.newPatientRegModel.PatientFirstName = this.patientRegistrationForm.get('PatientFirstName').value;
      this.newPatientRegModel.PatientLastName = this.patientRegistrationForm.get('PatientLastName').value;
      this.newPatientRegModel.PrimaryContactNumber = this.patientRegistrationForm.get('PrimaryContactNumber').value;
      this.qrReaderValue = this.newPatientRegModel;
      this.qrreader = JSON.stringify(this.qrReaderValue);
    }
  }
  //#endregion Qr Code  

  //#region save function
  addNewPatientReg() {
    if (this.patientRegistrationForm.valid) {
      this.newPatientRegModel.PatientDemographicId = 0;
      this.newPatientRegModel.PatientId = 0;
      this.newPatientRegModel.PatientType = this.patientRegistrationForm.get('PatientType').value;
      this.newPatientRegModel.RegisterationAt = this.RegisterAt;
      this.newPatientRegModel.PatientCategory = this.patientRegistrationForm.get('PatientCategory').value;
      this.newPatientRegModel.Salutation = this.patientRegistrationForm.get('Salutation').value;
      this.newPatientRegModel.PatientFirstName = this.patientRegistrationForm.get('PatientFirstName').value;
      this.newPatientRegModel.PatientLastName = this.patientRegistrationForm.get('PatientLastName').value;
      this.newPatientRegModel.PatientMiddleName = this.patientRegistrationForm.get('PatientMiddleName').value;
      this.newPatientRegModel.PatientDOB = this.patientRegistrationForm.get('PatientDOB').value;
      this.newPatientRegModel.PatientAge = this.patientRegistrationForm.get('PatientAge').value;
      this.newPatientRegModel.Gender = this.patientRegistrationForm.get('Gender').value;
      this.newPatientRegModel.IDTID1 = this.patientRegistrationForm.get('IDTID1').value;
      this.newPatientRegModel.PatientIdentificationtype1details = this.patientRegistrationForm.get('PatientIdentificationtype1details').value;
      if (this.patientRegistrationForm.get('IDTID2').value == "") {
        this.newPatientRegModel.IDTID2 = 0
      } else {
        this.newPatientRegModel.IDTID2 = this.patientRegistrationForm.get('IDTID2').value;
      }
      this.newPatientRegModel.PatientIdentificationtype2details = this.patientRegistrationForm.get('PatientIdentificationtype2details').value;
      this.newPatientRegModel.PrimaryContactType = this.patientRegistrationForm.get('PrimaryContactType').value;
      this.newPatientRegModel.MaritalStatus = this.patientRegistrationForm.get('MaritalStatus').value;
      this.newPatientRegModel.PrimaryContactNumber = this.patientRegistrationForm.get('PrimaryContactNumber').value;
      this.newPatientRegModel.SecondaryContactType = this.patientRegistrationForm.get('SecondaryContactType').value;
      this.newPatientRegModel.SecondaryContactNumber = this.patientRegistrationForm.get('SecondaryContactNumber').value;
      this.newPatientRegModel.email = this.patientRegistrationForm.get('email').value;
      this.newPatientRegModel.Emergencycontactnumber = this.patientRegistrationForm.get('Emergencycontactnumber').value;
      this.newPatientRegModel.Address1 = this.patientRegistrationForm.get('Address1').value;
      this.newPatientRegModel.Address2 = this.patientRegistrationForm.get('Address2').value;
      this.newPatientRegModel.Village = this.patientRegistrationForm.get('Village').value;
      this.newPatientRegModel.Town = this.patientRegistrationForm.get('Town').value;
      this.newPatientRegModel.Pincode = this.patientRegistrationForm.get('Pincode').value;
      this.newPatientRegModel.State = this.patientRegistrationForm.get('State').value;
      this.newPatientRegModel.Country = this.patientRegistrationForm.get('Country').value;
      this.newPatientRegModel.Bloodgroup = this.patientRegistrationForm.get('Bloodgroup').value;
      this.newPatientRegModel.Occupation = this.patientRegistrationForm.get('Occupation').value;
      this.newPatientRegModel.Religion = this.patientRegistrationForm.get('Religion').value;
      this.newPatientRegModel.Race = this.patientRegistrationForm.get('Race').value;
      this.newPatientRegModel.NKSalutation = this.patientRegistrationForm.get('NKSalutation').value;
      this.newPatientRegModel.NKFirstname = this.patientRegistrationForm.get('NKFirstname').value;
      this.newPatientRegModel.NKLastname = this.patientRegistrationForm.get('NKLastname').value;
      this.newPatientRegModel.NKContactType = this.patientRegistrationForm.get('NKContactType').value;
      this.newPatientRegModel.NKPrimarycontactnumber = this.patientRegistrationForm.get('NKPrimarycontactnumber').value;
      this.newPatientRegModel.RSPId = this.patientRegistrationForm.get('Relationship').value;
      this.newPatientRegModel.FacilityId = this.facilityIdValue;

      this.patientService.addUpdatePatientDetail(this.newPatientRegModel).then(data => {

        if (this.formData != null) {
          // const formData = new FormData();
          //  formData.append('file', this.FileUpload, this.FileUpload.name);
          this.patientService.FileUpload(this.formData, data.PatientId, "Patient").then(res => { });
        }

        if (data != null) {
          this.util.showMessage('', 'Patient details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => { this.DialogRef.close("update") }
          );
        }
      });
    }
  }
  //#endregion save function

  //#region other functions
  dialogClose(): void {
    this.DialogRef.close();
  }

  cancelData() {
    this.patientRegistrationForm.reset();
  }

  bindAgetoDOB() {
    this.bindAge = new Date().getFullYear() - new Date(this.patientRegistrationForm.get('PatientDOB').value).getFullYear();
    this.patientRegistrationForm.get('PatientAge').setValue(this.bindAge);
  }

  bindDOBtoAge() {
    this.bindDOB = new Date((new Date().getFullYear() - this.patientRegistrationForm.get('PatientAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.patientRegistrationForm.get('PatientDOB').setValue(this.bindDOB);
  }

  openVisit() {
    this.router.navigate(['/home/opds/visit']);
  }
  //#endregion other functions

  //#region set values for submission
  //Set Identification
  setIdentification(value: any) {
    this.identification = value;
    if (this.identification) {
      this.enableInput = false;
    }
    if (this.identificationDetail == this.identification) {
      this.util.showMessage(" ", "You have already selected " + value + ", please select another option.", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
        if (res == true) {
          this.patientRegistrationForm.get('IDTID1').reset();
          this.identification = '';
          this.enableInput = true;
        }
      });
    }
    if (this.patientRegistrationForm.get('PatientIdentificationtype1details').value) {
      this.patientRegistrationForm.get('PatientIdentificationtype1details').reset();
    }
  }

  valid() {
    if (this.identification == 'Aadhar') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.identification == 'PAN CARD') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/i));
    }
    else if (this.identification == 'DRIVING LICENSE') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
    }
    else if (this.identification == 'VOTER ID') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.identification == 'RATION CARD') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.maxLength(15));
    }
    else if (this.identification == 'STUDENT ID') {
      this.patientRegistrationForm.controls["PatientIdentificationtype1details"].setValidators(Validators.maxLength(10));
    }
  }

  //Set Identification-1
  setIdentificationdetail(value: any) {
    this.identificationDetail = value;
    if (this.identificationDetail) {
      this.enableInput2 = false;
    }
    if (this.identification == this.identificationDetail) {
      this.util.showMessage(" ", "You have already selected " + value + ", please select another option.", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
        if (res == true) {
          this.patientRegistrationForm.get('IDTID2').reset();
          this.identificationDetail = '';
          this.enableInput2 = true;
        }
      });
    }
    if (this.patientRegistrationForm.get('PatientIdentificationtype2details').value) {
      this.patientRegistrationForm.get('PatientIdentificationtype2details').reset();
    }
  }

  valid1() {
    if (this.identificationDetail == 'Aadhar') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.identificationDetail == 'PAN CARD') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/i));
    }
    else if (this.identificationDetail == 'DRIVING LICENSE') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
    }
    else if (this.identificationDetail == 'VOTER ID') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.identificationDetail == 'RATION CARD') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.maxLength(15));
    }
    else if (this.identificationDetail == 'STUDENT ID') {
      this.patientRegistrationForm.controls["PatientIdentificationtype2details"].setValidators(Validators.maxLength(10));
    }
  }

  //Set Contact
  setcontact(value: any) {
    this.contact = value;
  }
  //Set Secondary Contact
  setSecondarycontact(value: any) {
    this.secondarycontact = value;
  }
  //kin Contact
  setkincontact(value: any) {
    this.kinprimarycontact = value;
  }

  emergencyNumberCheck() {
    if ((this.patientRegistrationForm.get('Emergencycontactnumber').value == this.patientRegistrationForm.get('PrimaryContactNumber').value) && (this.patientRegistrationForm.get('PrimaryContactNumber').value != '')) {
      this.util.showMessage(" ", "Emergency Contact Number should not be same as Primary Contact Number", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
        if (res == true) {
          this.patientRegistrationForm.get('Emergencycontactnumber').setValue('');
        }
      });
    }
  }

  primaryNumberCheck() {
    if ((this.patientRegistrationForm.get('PrimaryContactNumber').value == this.patientRegistrationForm.get('Emergencycontactnumber').value) && (this.patientRegistrationForm.get('Emergencycontactnumber').value != '')) {
      this.util.showMessage(" ", "Primary Contact Number should not be same as Emergency Contact Number", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
        if (res == true) {
          this.patientRegistrationForm.get('PrimaryContactNumber').setValue('');
        }
      });
    }
  }
  //#endregion set values

  // public imageUpload(file): void {
  //   this.convertToBase64(file);
  //   let files = file.target.files;
  //   if (files.length === 0) {
  //     this.util.showMessage("Error!!", " please choose an image format ", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
  //     return;
  //   }
  //   if (files[0].type.match(/image.*/)) {
  //     let Temporaryfiles: File = <File>files[0];
  //     this.FileUpload = (Temporaryfiles);
  //     let viewFile: clsViewFile = new clsViewFile();
  //     viewFile.FileName = Temporaryfiles.name;
  //     viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
  //     this.ViewFileUpload = (viewFile);
  //     this.ImageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(this.ImageBase64);
  //     this.ImageBase64 = [this.ImageBase64.changingThisBreaksApplicationSecurity];
  //     if (this.ImageBase64) {
  //       this.imageFlag = false;
  //     } else {
  //       this.imageFlag = true;
  //     }
  //   } else {
  //     this.util.showMessage("Error!!", "Not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
  //   }
  // }
  // public RemoveFile(): void {
  //   this.ViewFileUpload = (null);
  //   this.FileUpload = (null);
  //   this.ImageBase64 = null;
  //   if (this.ImageBase64) {
  //     this.imageFlag = false;
  //   } else {
  //     this.imageFlag = true;
  //   }
  // }

  // convertToBase64(event) {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (event) => {
  //       this.ImageBase64 = (<FileReader>event.target).result;
  //     }
  //   }
  // }

  getfacilitiesIdValue(data) {
    if (data) {
      if (this.facilityIdValue > 0 && this.facilityIdValue != data.FacilityId) {
        let FacilityName = data.FacilityName;
        this.facilityIdValue = data.FacilityId;
        this.patientRegistrationForm.reset();
        this.patientRegistrationForm.get('Facility').setValue(FacilityName);
      }
      else {
        this.facilityIdValue = data.FacilityId;
      }
    }
  }

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.patientRegistrationForm.get('PatientFirstName').value,
      height: '450px',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formData = (result.formData);
        this.ImageBase64 = result.image;
        if (this.ImageBase64) {
          this.imageFlag = false;
        } else {
          this.imageFlag = true;
        }
      }
    });
  }
}