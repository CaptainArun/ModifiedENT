import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewPatientRegModel } from '../models/newPatientRegModel';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NewPatientService } from '../newPatient.service';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../core/custom-http.service';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { DomSanitizer } from "@angular/platform-browser";
import { clsViewFile } from '../models/clsViewFile';
import { imageCropComponent } from 'src/app/image-crop/image-crop.component';

@Component({
  selector: 'newPatient-editRecord',
  templateUrl: 'newPatient-editRecord.component.html',
  styleUrls: ['./newPatient-editRecord.component.css']
})
export class NewPatientEditRecordComponent implements OnInit {

  maxDate = new Date();

  //#region Property declaration
  patientRegistrationForm: FormGroup;
  elementType = 'url';
  patientList: any;
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel();
  identificationType: any;
  patientRelations: any;
  RegisterAt: string = "Primary Hospital";
  searchKey: any;
  searchData: any;
  key: any;
  value: any;
  name: any;
  tenname: any;
  getSpecificHeaderSearch = [];
  subMenuVals: any;
  identification: any;
  identificationDetail: any;
  contact: any;
  secondarycontact: any;
  profilePics: any;
  kinprimarycontact: any;
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  patientCategory: any;
  patientType: any;
  maritalStatus: any;
  religion: any;
  race: any;
  gender: any;
  salution: any;
  contactType: any;
  bloodGroup: any;
  bindAge: number;
  bindDOB: Date;
  qrReaderValue: NewPatientRegModel;
  qrreader: string;
  imageFlag: boolean = true;
  FacilityName: any;
  facilityIdValue: any;
  formData: any;
  stateValue: any;
  countryValue: any;
  enableInput: boolean = true;
  enableInput2: boolean = true;
  //#endregion Property declaration

  //#region Constructor
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private newPatientSvc: NewPatientService, private customHttpSvc: CustomHttpService,
    public DialogRef: MatDialogRef<NewPatientEditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService, private sanitizer: DomSanitizer) { }
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
      PrimaryContactNumber: ['', [Validators.required, Validators.maxLength(12)]],
      SecondaryContactType: [''],
      SecondaryContactNumber: [''],
      email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      Emergencycontactnumber: ['', Validators.required],
      Address1: [''],
      Address2: [''],
      Village: [''],
      Town: [''],
      City: [''],
      Pincode: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      Bloodgroup: [''],
      NKSalutation: ['', Validators.required],
      NKFirstname: ['', Validators.required],
      NKLastname: ['', Validators.required],
      NKContactType: [''],
      NKPrimarycontactnumber: ['', Validators.required],
      Relationship: ['']
    });
    const facilityName: any = JSON.parse(localStorage.getItem('DBdetails'));
    this.name = facilityName.ClientDisplayName;
    this.tenname = facilityName.TenantDisplayName;
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getIdentificationType();
    this.getAllRelationForPatient();
    this.setPatientEditDetail();
    this.getPatientType();
    this.getPatientcategory();
    this.getPatientMaritalStatus();
    this.getReligionforPatient();
    this.getRaceforPatient();
    this.getSalutionforPatient();
    this.getGenderforPatient();
    this.getContactType();
    this.getBloodGroup();
    this.setqrcode();
    this.bindDOBtoAge();
    this.bindAgetoDOB();
    this.getStateValue();
    this.getCountryValue();

    if (this.identificationDetail) {
      this.enableInput2 = false;
    }
    if (this.identification) {
      this.enableInput = false;
    }
  }
  //#endregion ngOnInit

  //identificationType
  openOcr() { }

  //#region Get Methods
  getIdentificationType() {
    this.newPatientSvc.getIdentificationType().then(res => {
      this.identificationType = res;
    });
  }

  //patientCategory
  getPatientcategory() {
    this.newPatientSvc.getPatientCategory().then(res => {
      this.patientCategory = res;
    })
  }

  //patientType
  getPatientType() {
    this.newPatientSvc.getPatientType().then(res => {
      this.patientType = res;
    })
  }

  //maritalStatus
  getPatientMaritalStatus() {
    this.newPatientSvc.getMaritalStatus().then(res => {
      this.maritalStatus = res;
    })
  }

  //religion
  getReligionforPatient() {
    this.newPatientSvc.getReligionPatient().then(res => {
      this.religion = res;
    })
  }

  //race
  getRaceforPatient() {
    this.newPatientSvc.getRacesPatient().then(res => {
      this.race = res;
    })
  }

  //gender
  getGenderforPatient() {
    this.newPatientSvc.getGenderforPatient().then(res => {
      this.gender = res;
    })
  }

  //salution
  getSalutionforPatient() {
    this.newPatientSvc.getSalutionforPatient().then(res => {
      this.salution = res;
    })
  }

  //contactType
  getContactType() {
    this.newPatientSvc.getContactTypeforPatient().then(res => {
      this.contactType = res;
    })
  }

  getStateValue() {
    this.newPatientSvc.getStateValue().then(res => {
      this.stateValue = res;
    })
  }
  
  getCountryValue() {
    this.newPatientSvc.getCountryValue().then(res => {
      this.countryValue = res;
    })
  }

  //bloodGroup
  getBloodGroup() {
    this.newPatientSvc.getBloodGroupforPatient().then(res => {
      this.bloodGroup = res;
    })
  }

  //bindAge
  bindAgetoDOB() {
    this.bindAge = new Date().getFullYear() - new Date(this.patientRegistrationForm.get('PatientDOB').value).getFullYear();
    this.patientRegistrationForm.get('PatientAge').setValue(this.bindAge);
  }

  //bindDOB
  bindDOBtoAge() {
    this.bindDOB = new Date((new Date().getFullYear() - this.patientRegistrationForm.get('PatientAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.patientRegistrationForm.get('PatientDOB').setValue(this.bindDOB);
  }

  //patientRelations
  getAllRelationForPatient() {
    this.newPatientSvc.getAllRelationship().then(res => {
      this.patientRelations = res;
    });
  }

  openVisit() {
    this.router.navigate(['/home/opds/visit']);
  }
  //#endregion Get Methods

  //#region Set Values
  //Set data
  setPatientEditDetail() {
    this.FacilityName = this.data.FacilityName;
    this.facilityIdValue = this.data.FacilityId;
    this.patientRegistrationForm.get('PatientType').setValue(this.data.PatientType);
    this.patientRegistrationForm.get('PatientCategory').setValue(this.data.PatientCategory);
    this.patientRegistrationForm.get('PrimaryContactType').setValue(this.data.PrimaryContactType);
    this.patientRegistrationForm.get('SecondaryContactType').setValue(this.data.SecondaryContactType);
    this.patientRegistrationForm.get('NKSalutation').setValue(this.data.NKSalutation);
    this.patientRegistrationForm.get('NKFirstname').setValue(this.data.NKFirstname);
    this.patientRegistrationForm.get('NKLastname').setValue(this.data.NKLastname);
    this.patientRegistrationForm.get('NKContactType').setValue(this.data.NKContactType);
    this.patientRegistrationForm.get('NKPrimarycontactnumber').setValue(this.data.NKPrimarycontactnumber);
    this.patientRegistrationForm.get('Salutation').setValue(this.data.Salutation);
    this.patientRegistrationForm.get('Religion').setValue(this.data.Religion);
    this.patientRegistrationForm.get('Race').setValue(this.data.Race);
    this.patientRegistrationForm.get('Occupation').setValue(this.data.Occupation);
    this.patientRegistrationForm.get('MaritalStatus').setValue(this.data.MaritalStatus);
    this.patientRegistrationForm.get('PatientFirstName').setValue(this.data.PatientFirstName);
    this.patientRegistrationForm.get('PatientLastName').setValue(this.data.PatientLastName);
    this.patientRegistrationForm.get('PatientMiddleName').setValue(this.data.PatientMiddleName);
    this.patientRegistrationForm.get('PatientDOB').setValue(this.data.PatientDOB);
    this.patientRegistrationForm.get('PatientAge').setValue(this.data.PatientAge);
    this.patientRegistrationForm.get('Gender').setValue(this.data.Gender);
    this.patientRegistrationForm.get('IDTID1').setValue(this.data.IDTID1);
    this.patientRegistrationForm.get('PatientIdentificationtype1details').setValue(this.data.PatientIdentificationtype1details);
    this.patientRegistrationForm.get('IDTID2').setValue(this.data.IDTID2);
    this.patientRegistrationForm.get('PatientIdentificationtype2details').setValue(this.data.PatientIdentificationtype2details);
    this.patientRegistrationForm.get('PrimaryContactNumber').setValue(this.data.PrimaryContactNumber);
    this.patientRegistrationForm.get('SecondaryContactNumber').setValue(this.data.SecondaryContactNumber);
    this.patientRegistrationForm.get('email').setValue(this.data.email);
    this.patientRegistrationForm.get('Emergencycontactnumber').setValue(this.data.Emergencycontactnumber);
    this.patientRegistrationForm.get('Address1').setValue(this.data.Address1);
    this.patientRegistrationForm.get('Address2').setValue(this.data.Address2);
    this.patientRegistrationForm.get('Village').setValue(this.data.Village);
    this.patientRegistrationForm.get('Town').setValue(this.data.Town);
    this.patientRegistrationForm.get('Pincode').setValue(this.data.Pincode);
    this.patientRegistrationForm.get('State').setValue(this.data.State);
    this.patientRegistrationForm.get('Country').setValue(this.data.Country);
    this.patientRegistrationForm.get('Bloodgroup').setValue(this.data.Bloodgroup);
    this.patientRegistrationForm.get('Relationship').setValue(this.data.RSPId);
    this.identification = this.data.IdType1;
    this.identificationDetail = this.data.IdType2;
    this.contact = this.data.NKContactType;
    this.secondarycontact = this.data.SecondaryContactType;
    this.kinprimarycontact = this.data.PrimaryContactType;
    // this.profilePics=this.data.PatientImage;
    this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.data.PatientImage);
    this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
  }
  //#endregion Set Values

  //#region Save Function
  //submit
  addNewPatientReg() {
    if (this.patientRegistrationForm.valid) {
      this.newPatientRegModel.PatientDemographicId = 0;
      this.newPatientRegModel.PatientId = this.data.PatientId;
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
      this.newPatientRegModel.IDTID2 = this.patientRegistrationForm.get('IDTID2').value;
      this.newPatientRegModel.PatientIdentificationtype2details = this.patientRegistrationForm.get('PatientIdentificationtype2details').value;
      this.newPatientRegModel.MaritalStatus = this.patientRegistrationForm.get('MaritalStatus').value;
      this.newPatientRegModel.PrimaryContactType = this.patientRegistrationForm.get('PrimaryContactType').value;
      this.newPatientRegModel.PrimaryContactNumber = this.patientRegistrationForm.get('PrimaryContactNumber').value;
      this.newPatientRegModel.SecondaryContactType = this.patientRegistrationForm.get('SecondaryContactType').value;
      this.newPatientRegModel.SecondaryContactNumber = this.patientRegistrationForm.get('SecondaryContactNumber').value;
      this.newPatientRegModel.email = this.patientRegistrationForm.get('email').value;
      this.newPatientRegModel.Emergencycontactnumber = this.patientRegistrationForm.get('Emergencycontactnumber').value;
      this.newPatientRegModel.Address1 = this.patientRegistrationForm.get('Address1').value;
      this.newPatientRegModel.Address2 = this.patientRegistrationForm.get('Address2').value;
      this.newPatientRegModel.Village = this.patientRegistrationForm.get('Village').value;
      this.newPatientRegModel.Town = this.patientRegistrationForm.get('Town').value;
      this.newPatientRegModel.City = this.patientRegistrationForm.get('City').value;
      this.newPatientRegModel.Pincode = this.patientRegistrationForm.get('Pincode').value;
      this.newPatientRegModel.State = this.patientRegistrationForm.get('State').value;
      this.newPatientRegModel.Country = this.patientRegistrationForm.get('Country').value;
      this.newPatientRegModel.Bloodgroup = this.patientRegistrationForm.get('Bloodgroup').value;
      this.newPatientRegModel.Religion = this.patientRegistrationForm.get('Religion').value;
      this.newPatientRegModel.Race = this.patientRegistrationForm.get('Race').value;
      this.newPatientRegModel.Occupation = this.patientRegistrationForm.get('Occupation').value;
      this.newPatientRegModel.NKSalutation = this.patientRegistrationForm.get('NKSalutation').value;
      this.newPatientRegModel.NKFirstname = this.patientRegistrationForm.get('NKFirstname').value;
      this.newPatientRegModel.NKLastname = this.patientRegistrationForm.get('NKLastname').value;
      this.newPatientRegModel.NKContactType = this.patientRegistrationForm.get('NKContactType').value;
      this.newPatientRegModel.NKPrimarycontactnumber = this.patientRegistrationForm.get('NKPrimarycontactnumber').value;
      this.newPatientRegModel.RSPId = this.patientRegistrationForm.get('Relationship').value;
      this.newPatientRegModel.MRNo = this.data.MRNo;
      this.newPatientRegModel.FacilityId = this.facilityIdValue;
      this.newPatientSvc.addUpdatePatientDetail(this.newPatientRegModel).then(data => {
        if (this.formData != null) {
          // const formData = new FormData();
          // formData.append('file', this.FileUpload, this.FileUpload.name);
          this.newPatientSvc.FileUpload(this.formData, data.PatientId, "Patient").then(res => { })
        }

        this.util.showMessage('', 'Patient details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            this.DialogRef.close("update");
          }
        );

      });
    }
  }
  //#endregion Save Function

  //#region Close Function
  //close
  dialogClose(): void {
    this.DialogRef.close();
  }

  //cancel data
  cancelData() {
    this.patientRegistrationForm.reset();
    this.setPatientEditDetail();
  }

  //Set Identification
  setIdentification(value1) {
    this.identification = value1;
    if (this.identification) {
      this.enableInput = false;
    }
    if (this.identificationDetail == this.identification) {
      this.util.showMessage(" ", "You have already selected " + value1 + ", please select another option.", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
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
  setIdentificationdetail(value1) {
    this.identificationDetail = value1;
    if (this.identificationDetail) {
      this.enableInput2 = false;
    }
    if (this.identification == this.identificationDetail) {
      this.util.showMessage(" ", "You have already selected " + value1 + ", please select another option.", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res: any) => {
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
  setcontact(value1) {
    this.contact = value1;
  }

  //Set Secondary Contact
  setSecondarycontact(value1) {
    this.secondarycontact = value1;
  }

  //kin Contact
  setkincontact(value1) {
    this.kinprimarycontact = value1;
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

  //#endregion Close Function

  // //#region File Upload
  // public imageUpload(file): void {
  //   this.convertToBase64(file);
  //   let files = file.target.files
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

  //     if (this.profilePics) {
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
  //   this.profilePics = null;
  //   if (this.profilePics) {
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
  //       this.profilePics = (<FileReader>event.target).result;        
  //     }
  //   }
  // }

  // //#endregion File Upload

  //#region QrCode
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
  //#endregion QrCode

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.patientRegistrationForm.get('PatientFirstName').value,
      height: '450px',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formData = (result.formData);
        this.profilePics = result.image;
        if (this.profilePics) {
          this.imageFlag = false;
        } else {
          this.imageFlag = true;
        }
      }
    });
  }
}
