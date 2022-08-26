import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PhysicianService } from './physician.service';
import { PhysicianModel } from './models/physicianModel';
import { PhysicianContactInfoModel } from './models/physicianContactInfoModel';
import { PhysicianAddressModel } from './models/physicianAddressModel';
import { PhysicianEducationalDetailsModel } from './models/physicianEducationalDetailsModel';
import { PhysicianFamilyDetailsModel } from './models/physicianFamilyDetailsModel';
import { PhysicianLanguageModel } from './models/physicianLanguageModel';
import { PhysicianExtraActivitiesModel } from './models/physicianExtraActivitiesModel';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../patient/models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { PhysicianEducationComponent } from './Physician-education/physician-education.component';
import { PhysicianFamilyComponent } from './Physician-family/physician-family.component';
import { PhysicianLanguageComponent } from './Physician-language/physician-language.component';
import { PhysicianExtraActivityComponent } from './Physician-extraactivities/physician-extraactivity.component';
import { PhysicianAddressDetailComponent } from './Physician-addressdetail/physician-addressdetail.component';
import { physicianContactDetailComponent } from './Physician-contact/physician-contact.component';
import { imageCropComponent } from '../image-crop/image-crop.component';
@Component({
  selector: 'physician-address',
  templateUrl: './physician-address.component.html',
  styleUrls: ['./physician-address.component.css']
})

export class PhysicianAddressComponent implements OnInit {

  //#region "property declaration"
  startDate = new Date((new Date().getFullYear()-20),12,0);
  endDate= new Date((new Date().getFullYear()-80), 12, 0);
  physicianAddressForm: FormGroup;
  physicianModel: PhysicianModel = new PhysicianModel();
  contactInfoModel: PhysicianContactInfoModel = new PhysicianContactInfoModel();
  addressModel: PhysicianAddressModel = new PhysicianAddressModel();
  educationalModel: PhysicianEducationalDetailsModel = new PhysicianEducationalDetailsModel();
  familyDetailsModel: PhysicianFamilyDetailsModel = new PhysicianFamilyDetailsModel();
  languageModel: PhysicianLanguageModel = new PhysicianLanguageModel();
  extraActivitiesModel: PhysicianExtraActivitiesModel = new PhysicianExtraActivitiesModel();
  personalFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  educationalFormGroup: FormGroup;
  familyFormGroup: FormGroup;
  languageFormGroup: FormGroup;
  contactForm: FormGroup;
  addressForm: FormGroup;
  educationalForm: FormGroup;
  familyForm: FormGroup;
  languageForm: FormGroup;
  extraActivityForm: FormGroup;
  providerId: number;
  facilityDetails: any;
  providerDetailById: any;
  gender: any;
  address: any;
  country: any;
  state: any;
  language: any;
  contactInfoShow = false;
  contactInfoList = [];
  facilitytooltip: any[] = [];
  addressShow = false;
  addressList = [];
  languageShow = false;
  extraActivityShow = false;
  languageList = [];
  extraActivityList = [];
  familyDetailsShow = false;
  familyDetailsList = [];
  educationalShow = false;
  educationList = [];
  Facilityidvalues:Array<Number> =[];
  submitData: any;
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  profilePics: any;
  imageFlag: boolean = true;
  bindAge: any;
  bindDOB: any;
  Facility: any;
  Role: any;
  facilityvalue: any;
  formData: FormData;
  localUrl: any;
  ViewSignUpload: clsViewFile;
  ImgUpload: File;
  signPic: any;
  showSign: boolean = false;
  noSign: boolean = false;
  img: any;
  //addanother: boolean = false;
  //addanotheraddress: boolean = false;
  //addanothereducation: boolean = false;
  //addanotherfamily: boolean = false;
  //addanotherlanguage: boolean = false;
  //addanotheractivity: boolean = false;
  //edit: boolean = false;
  //hideArray: Array<boolean> = [];
  //hideedit: Array<boolean> = [];
  //hideeducational: Array<boolean> = [];
  //hidefamily: Array<boolean> = [];
  //hidelanguage: Array<boolean> = [];
  //hideactivity: Array<boolean> = [];
  //dataindex: any;

  @ViewChild('image', { static: false }) attachement: any;
  
  //#endregion

  //#region "constructor"
  constructor(private router: Router, public dialog: MatDialog, private util: UtilService, private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder, private physicianservice: PhysicianService, private activeRoute: ActivatedRoute, private sanitizer: DomSanitizer) { }
  //#endregion
  
  //#region "Contact FormGroup"
  dynamicContactInfoControls(): FormGroup {
    return this._formBuilder.group({
      ProviderContactID: [''],
      ProviderID: [''],
      CellNumber: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      WhatsAppNumber: ['', Validators.required],
      EmergencyContactNumber: ['', Validators.required],
      TelephoneNo: [''],
      Fax: [''],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      samecellno: [''],
    });
  }

  getDynamicContactInfo() {
    return <FormArray>this.contactForm.get('providerContacts');
  }
  //#endregion

  //#region "Address FormGroup"
  dynamicAddressControls(): FormGroup {
    return this._formBuilder.group({
      ProviderAddressID: [''],
      ProviderID: [''],
      AddressType: ['', Validators.required],
      DoorOrApartmentNo: ['', Validators.required],
      ApartmentNameOrHouseName: [''],
      StreetName: [''],
      Locality: [''],
      Town: ['', Validators.required],
      City: [''],
      District: [''],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      PinCode: ['']
    });
  }
  getDynamicAddress() {
    return <FormArray>this.addressForm.get('providerAddresses');
  }
  //#endregion

  //#region "Education FormGroup"
  dynamicEducationalDetailsControls(): FormGroup {
    return this._formBuilder.group({
      ProviderEducationId: [''],
      ProviderID: [''],
      EducationType: ['', Validators.required],
      BoardorUniversity: ['', Validators.required],
      MonthandYearOfPassing: ['', Validators.required],
      NameOfSchoolorCollege: ['', Validators.required],
      MainSubjects: ['', Validators.required],
      PercentageofMarks: ['', Validators.required],
      HonoursorScholarshipHeading: [''],
      ProjectWorkUndertakenHeading: [''],
      PublicationsorPapers: [''],
      Qualification: ['', Validators.required],
      DurationOfQualification: ['', Validators.required],
      NameOfInstitution: ['', Validators.required],
      PlaceOfInstitution: [''],
      RegisterationAuthority: [''],
      RegisterationNumber: ['', Validators.required],
      ExpiryOfRegisterationNumber: ['', Validators.required],
    });
  }

  getDynamicEducationalDetails() {
    return <FormArray>this.educationalForm.get('educations');
  }
  //#endregion

  //#region "family FormGroup"
  dynamicFamilyDetailsControls(): FormGroup {
    return this._formBuilder.group({
      ProviderFamilyDetailId: [''],
      ProviderID: [''],
      FullName: ['', Validators.required],
      Age: ['', Validators.required],
      RelationShip: ['', Validators.required],
      Occupation: [''],
      Notes: ['']
    });
  }

  getDynamicFamilyDetails() {
    return <FormArray>this.familyForm.get('familyDetails');
  }
  //#endregion

  //#region "language FormGroup"
  dynamicLanguageControls(): FormGroup {
    return this._formBuilder.group({
      ProviderLanguageId: [''],
      ProviderID: [''],
      Language: ['', Validators.required],
      IsSpeak: [false],
      SpeakingLevel: [0],
      IsRead: [false],
      ReadingLevel: [0],
      IsWrite: [false],
      WritingLevel: [0]
    });
  }

  getDynamicLanguage() {
    return <FormArray>this.languageForm.get('languages');
  }
  //#endregion

  //#region "extra Activity FormGroup"
  dynamicExtraActivitiesControls(): FormGroup {
    return this._formBuilder.group({
      ProviderActivityId: [''],
      ProviderID: [''],
      NatureOfActivity: ['', Validators.required],
      YearOfParticipation: ['', Validators.required],
      PrizesorAwards: ['', Validators.required],
      StrengthandAreaneedImprovement: ['']
    });
  }

  getDynamicExtraActivities() {
    return <FormArray>this.extraActivityForm.get('extraActivities');
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.activeRoute.params.subscribe(param => {
      this.providerId = param['ProviderId'];
    });
    this.physicianAddressForm = this._formBuilder.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: [''],
      NamePrefix: [''],
      NameSuffix: [''],
      Title: [''],
      BirthDate: [''],
      Gender: ['', Validators.required],
      PhoneNumber: [''],
      // PersonalEmail: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z]+\\.)+[a-zA-Z]{2,6}$")]],
      PersonalEmail: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\.]+@[a-z]+\\.[a-z\.]{2,6}")]],
      IsActive: [false],
      Language: [''],
      PreferredLanguage: [''],
      MothersMaidenName: [''],
      WebsiteName: [''],
      PhysicianAge: ['', Validators.required],
      facility: ['', Validators.required],
      Role: ['', Validators.required],
    });
    // ContactInfo
    this.contactForm = this._formBuilder.group({
      providerContacts: this._formBuilder.array([
        this.dynamicContactInfoControls()
      ])
    });
    // address
    this.addressForm = this._formBuilder.group({
      providerAddresses: this._formBuilder.array([
        this.dynamicAddressControls()
      ])
    });
    // EducationalDetails
    this.educationalForm = this._formBuilder.group({
      educations: this._formBuilder.array([
        this.dynamicEducationalDetailsControls()
      ])
    });
    // FamilyDetails
    this.familyForm = this._formBuilder.group({
      familyDetails: this._formBuilder.array([
        this.dynamicFamilyDetailsControls()
      ])
    });
    // language
    this.languageForm = this._formBuilder.group({
      languages: this._formBuilder.array([

        this.dynamicLanguageControls()
      ])
    });
    // extra activity
    this.extraActivityForm = this._formBuilder.group({
      extraActivities: this._formBuilder.array([
        this.dynamicExtraActivitiesControls()
      ])
    });

    this.facilityDetails = JSON.parse(localStorage.getItem('DBdetails'));
    this.getPhysicianDetailsById();

    this.personalFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.contactFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.addressFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.educationalFormGroup = this._formBuilder.group({
      fourCtrl: ['', Validators.required]
    });
    this.familyFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    }); this.languageFormGroup = this._formBuilder.group({
      sixCtrl: ['', Validators.required]

    });
    const language = <FormArray>(this.languageForm.controls["languages"]);
    language.controls[0].get('SpeakingLevel').disable();
    language.controls[0].get('ReadingLevel').disable();
    language.controls[0].get('WritingLevel').disable();
    this.getGenderforPhysician();
    this.getAddressforPhysician();
    this.getCountryforPhysician();
    this.getStateforPhysician();
    this.getlanguageforPhysician();
   // this.getFacility();
    this.getrole();
    this.getAllFacility();
  }
  //#endregion

  //#region "Set Physician Address"
  getPhysicianDetailsById() {
    this.physicianservice.getPhysicianById(this.providerId).then(data => {
      if (data != undefined && data != null) {
        this.providerDetailById = data;
        this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data.ProviderImage);
        this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
        this.signPic = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data.SignatureImage);
        this.signPic = [this.signPic.changingThisBreaksApplicationSecurity];
        this.img = data.SignatureImage;
        if (this.img != null) {
          this.showSign = true;
        }
        else {
          this.showSign = false;
        }
        this.physicianAddressForm.get('FirstName').setValue(data.FirstName);
        this.physicianAddressForm.get('MiddleName').setValue(data.MiddleName);
        this.physicianAddressForm.get('LastName').setValue(data.LastName);
        this.physicianAddressForm.get('NamePrefix').setValue(data.NamePrefix);
        this.physicianAddressForm.get('NameSuffix').setValue(data.NameSuffix);
        this.physicianAddressForm.get('Title').setValue(data.Title);
        this.physicianAddressForm.get('BirthDate').setValue(data.BirthDate);
        this.physicianAddressForm.get('PhysicianAge').setValue(data.Age);
        this.physicianAddressForm.get('Gender').setValue(data.Gender);
        this.physicianAddressForm.get('PhoneNumber').setValue(data.PhoneNumber);
        this.physicianAddressForm.get('PersonalEmail').setValue(data.PersonalEmail);
        this.physicianAddressForm.get('IsActive').setValue(data.IsActive);
        this.physicianAddressForm.get('Language').setValue(data.Language);

        //for (let i = 0; i < data.FacilityId.split(',').length; i++) {
        //  this.array.push(parseInt(data.FacilityId.split(',')[i]));
        //}
        this.Facilityidvalues = [];
        if (data.FacilityId.includes(',')) {
          for (let a of data.FacilityId.split(',')) {
            this.Facilityidvalues.push(parseInt(a))
          }
        } else {
          this.Facilityidvalues.push(parseInt(data.FacilityId))
        }
        this.physicianAddressForm.get('facility').setValue(this.Facilityidvalues);
        this.facilitytooltip = data.FacilityName;
        this.physicianAddressForm.get('Role').setValue(data.RoleId);
        this.physicianAddressForm.get('PreferredLanguage').setValue(data.PreferredLanguage);
        this.physicianAddressForm.get('Language').setValue(data.Language);
        this.physicianAddressForm.get('MothersMaidenName').setValue(data.MotherMaiden);
        this.physicianAddressForm.get('WebsiteName').setValue(data.WebSiteName);
        if (data.providerAddresses != undefined && data.providerAddresses != null && data.providerAddresses.length > 0) {
          this.addressShow = true;
          this.addressList = data.providerAddresses;
        }
        if (data.providerContacts != undefined && data.providerContacts != null && data.providerContacts.length > 0) {
          this.contactInfoShow = true;
          this.contactInfoList = data.providerContacts;
        }
        if (data.educations != undefined && data.educations != null && data.educations.length > 0) {
          this.educationalShow = true;
          this.educationList = data.educations;
        }
        if (data.familyDetails != undefined && data.familyDetails != null && data.familyDetails.length > 0) {
          this.familyDetailsShow = true;
          this.familyDetailsList = data.familyDetails;
        }
        if (data.languages != undefined && data.languages != null && data.languages.length > 0) {
          this.languageShow = true;
          this.languageList = data.languages;
        }
        if (data.extraActivities != undefined && data.extraActivities != null && data.extraActivities.length > 0) {
          this.extraActivityShow = true;
          this.extraActivityList = data.extraActivities;
        }
      }
    });
  }
  //#endregion
  
  //#region "Save Contact declaration
  addUpdateContactInfo(contactdetails?:any) {
   // this.edit = false;
    const contact = <FormArray>this.contactForm.controls['providerContacts'];
    contact.controls[0].get('CellNumber').markAsTouched;
    contact.controls[0].get('PhoneNumber').markAsTouched;
    contact.controls[0].get('WhatsAppNumber').markAsTouched;
    if (this.contactForm.valid) {
      this.contactInfoShow = true;
      const contact = <FormArray>this.contactForm.controls['providerContacts'];
      for (let i = 0; i < contact.length; i++) {
        this.contactInfoModel = new PhysicianContactInfoModel();
        this.contactInfoModel.ProviderID = this.providerId;
        this.contactInfoModel.ProviderContactID = contact.controls[i].get('ProviderContactID').value ? contact.controls[i].get('ProviderContactID').value : 0;
        this.contactInfoModel.CellNumber = contact.controls[i].get('CellNumber').value;
        this.contactInfoModel.PhoneNumber = contact.controls[i].get('PhoneNumber').value;
        this.contactInfoModel.WhatsAppNumber = contact.controls[i].get('WhatsAppNumber').value;
        this.contactInfoModel.EmergencyContactNumber = contact.controls[i].get('EmergencyContactNumber').value;
        this.contactInfoModel.TelephoneNo = contact.controls[i].get('TelephoneNo').value;
        this.contactInfoModel.Fax = contact.controls[i].get('Fax').value;
        this.contactInfoModel.Email = contact.controls[i].get('Email').value;
        if (this.contactInfoList.length == 0) {
          this.contactInfoList.push(this.contactInfoModel);
          this.contactForm.controls['providerContacts'].reset();
          break;
        } else {
          for (let i = 0; i < this.contactInfoList.length; i++) {
            if (this.contactInfoModel.ProviderContactID) {
              if (this.contactInfoList[i].ProviderContactID == this.contactInfoModel.ProviderContactID) {
                this.contactInfoList.push(this.contactInfoModel);
                this.contactForm.controls['providerContacts'].reset();
                break;
              } else {
                this.contactInfoList[i] = this.contactInfoList[i];
              }
            } else {
              this.contactInfoList.push(this.contactInfoModel);
              this.contactForm.controls['providerContacts'].reset();
              break;
            }
          }
        }
      }
    } else {
      if (contactdetails == 'submit') {
        this.contactForm.markAllAsTouched();
      }
    }
  }
  //#endregion
  
  
  //#region "Save Address"
  addUpdateAddress(Address?: any) {
    if (this.addressForm.valid) {
      this.addressShow = true;
      const address = <FormArray>this.addressForm.controls['providerAddresses'];
      for (let i = 0; i < address.length; i++) {
        this.addressModel = new PhysicianAddressModel();
        this.addressModel.ProviderID = this.providerId;
        this.addressModel.ProviderAddressID = address.controls[i].get('ProviderAddressID').value ? address.controls[i].get('ProviderAddressID').value : 0;
        this.addressModel.AddressType = address.controls[i].get('AddressType').value;
        this.addressModel.DoorOrApartmentNo = address.controls[i].get('DoorOrApartmentNo').value;
        this.addressModel.ApartmentNameOrHouseName = address.controls[i].get('ApartmentNameOrHouseName').value;
        this.addressModel.StreetName = address.controls[i].get('StreetName').value;
        this.addressModel.Locality = address.controls[i].get('Locality').value;
        this.addressModel.Town = address.controls[i].get('Town').value;
        this.addressModel.City = address.controls[i].get('City').value;
        this.addressModel.District = address.controls[i].get('District').value;
        this.addressModel.State = address.controls[i].get('State').value;
        this.addressModel.Country = address.controls[i].get('Country').value;
        this.addressModel.PinCode = address.controls[i].get('PinCode').value;
        if (this.addressList.length == 0) {
          this.addressList.push(this.addressModel);
          this.addressForm.clearValidators();
          this.addressForm.reset();
          break;
        } else {
          for (let i = 0; i < this.addressList.length; i++) {
            if (this.addressModel.ProviderAddressID) {
              if (this.addressList[i].ProviderAddressID == this.addressModel.ProviderAddressID) {
                // this.addressList[i] = this.addressModel;
                this.addressList.push(this.addressModel);
                this.addressForm.clearValidators();
                this.addressForm.reset();
                break;
              } else {
                this.addressList[i] = this.addressList[i];
              }
            } else {
              this.addressList.push(this.addressModel);
              this.addressForm.clearValidators();
              this.addressForm.reset();
              break;
            }
          }
        }
      }
    }
    else {
      if (Address == "submit") {
        this.addressForm.markAllAsTouched();
      }
    }
  }
  //#endregion

  //#region "Save Education"
  addUpdateEducationalDetails(Education?: any) {

    if (this.educationalForm.valid) {
      this.educationalShow = true;
      const education = <FormArray>this.educationalForm.controls['educations'];
      for (let i = 0; i < education.length; i++) {
        this.educationalModel = new PhysicianEducationalDetailsModel();
        this.educationalModel.ProviderID = this.providerId;
        this.educationalModel.ProviderEducationId = education.controls[i].get('ProviderEducationId').value ? education.controls[i].get('ProviderEducationId').value : 0;
        this.educationalModel.EducationType = education.controls[i].get('EducationType').value;
        this.educationalModel.BoardorUniversity = education.controls[i].get('BoardorUniversity').value;
        this.educationalModel.MonthandYearOfPassing = education.controls[i].get('MonthandYearOfPassing').value;
        this.educationalModel.NameOfSchoolorCollege = education.controls[i].get('NameOfSchoolorCollege').value;
        this.educationalModel.MainSubjects = education.controls[i].get('MainSubjects').value;
        this.educationalModel.PercentageofMarks = education.controls[i].get('PercentageofMarks').value;
        this.educationalModel.HonoursorScholarshipHeading = education.controls[i].get('HonoursorScholarshipHeading').value;
        this.educationalModel.ProjectWorkUndertakenHeading = education.controls[i].get('ProjectWorkUndertakenHeading').value;
        this.educationalModel.PublicationsorPapers = education.controls[i].get('PublicationsorPapers').value;
        this.educationalModel.Qualification = education.controls[i].get('Qualification').value;
        this.educationalModel.DurationOfQualification = education.controls[i].get('DurationOfQualification').value;
        this.educationalModel.NameOfInstitution = education.controls[i].get('NameOfInstitution').value;
        this.educationalModel.PlaceOfInstitution = education.controls[i].get('PlaceOfInstitution').value;
        this.educationalModel.RegisterationAuthority = education.controls[i].get('RegisterationAuthority').value;
        this.educationalModel.RegisterationNumber = education.controls[i].get('RegisterationNumber').value;
        this.educationalModel.ExpiryOfRegisterationNumber = education.controls[i].get('ExpiryOfRegisterationNumber').value;
        if (this.educationList.length == 0) {
          this.educationList.push(this.educationalModel);
          this.educationalForm.controls['educations'].reset();
          break;
        } else {
          for (let i = 0; i < this.educationList.length; i++) {
            if (this.educationalModel.ProviderEducationId > 0) {
              if (this.educationList[i].ProviderEducationId == this.educationalModel.ProviderEducationId) {
                this.educationList.push(this.educationalModel);
                this.educationalForm.controls['educations'].reset();
                break;
              } else {
                this.educationList[i] = this.educationList[i];
              }
            } else {
              this.educationList.push(this.educationalModel);
              this.educationalForm.controls['educations'].reset();
              break;
            }
          }
        }
      }
    } else {
      if (Education == "submit") {
        this.educationalForm.markAllAsTouched();
      }
    }
  }
  //#endregion

  //#region "Save family Detail"
  addUpdateFamilyDetails(Family?:any) {
    if (this.familyForm.valid) {
      this.familyDetailsShow = true;
      const familyDetail = <FormArray>this.familyForm.controls['familyDetails'];
      for (let i = 0; i < familyDetail.length; i++) {
        this.familyDetailsModel = new PhysicianFamilyDetailsModel();

        this.familyDetailsModel.ProviderID = this.providerId;
        this.familyDetailsModel.ProviderFamilyDetailId = familyDetail.controls[i].get('ProviderFamilyDetailId').value ? familyDetail.controls[i].get('ProviderFamilyDetailId').value : 0;
        this.familyDetailsModel.FullName = familyDetail.controls[i].get('FullName').value;
        this.familyDetailsModel.Age = familyDetail.controls[i].get('Age').value;
        this.familyDetailsModel.RelationShip = familyDetail.controls[i].get('RelationShip').value;
        this.familyDetailsModel.Occupation = familyDetail.controls[i].get('Occupation').value;
        this.familyDetailsModel.Notes = familyDetail.controls[i].get('Notes').value;

        if (this.familyDetailsList.length == 0) {
          this.familyDetailsList.push(this.familyDetailsModel);
          this.familyForm.controls['familyDetails'].reset();
          break;
        } else {
          for (let i = 0; i < this.familyDetailsList.length; i++) {
            if (this.familyDetailsModel.ProviderFamilyDetailId) {
              if (this.familyDetailsList[i].ProviderFamilyDetailId == this.familyDetailsModel.ProviderFamilyDetailId) {
                this.familyDetailsList.push(this.familyDetailsModel);
                this.familyForm.controls['familyDetails'].reset();
                break;
              } else {
                this.familyDetailsList[i] = this.familyDetailsList[i];
              }
            } else {
              this.familyDetailsList.push(this.familyDetailsModel);
              this.familyForm.controls['familyDetails'].reset();
              break;
            }
          }
        }
      }
    } else {
      if (Family =='submit')
      this.familyForm.markAllAsTouched();
    }
  }
  //#endregion

  //#region "Save Language"
  addUpdateLanguage(language?: any) {
    if (this.languageForm.valid) {
      this.languageShow = true;
      const language = <FormArray>this.languageForm.controls['languages'];
      for (let i = 0; i < language.length; i++) {
        this.languageModel = new PhysicianLanguageModel();
        this.languageModel.ProviderID = this.providerId;
        this.languageModel.ProviderLanguageId = language.controls[i].get('ProviderLanguageId').value ? language.controls[i].get('ProviderLanguageId').value : 0;
        this.languageModel.IsSpeak = language.controls[i].get('IsSpeak').value;
        this.languageModel.Language = language.controls[i].get('Language').value;
        // this.languageModel.SpeakingLevel = parseInt(language.controls[i].get('SpeakingLevel').value);
        this.languageModel.IsRead = language.controls[i].get('IsRead').value;
        // this.languageModel.ReadingLevel = parseInt(language.controls[i].get('ReadingLevel').value);
        this.languageModel.IsWrite = language.controls[i].get('IsWrite').value;
        this.languageModel.WritingLevel = parseInt(language.controls[i].get('WritingLevel').value) ? language.controls[i].get('WritingLevel').value : 0;
        // this.languageModel.WritingLevel = parseInt(language.controls[i].get('WritingLevel').value);
        //if (language.controls[i].get('WritingLevel').value) {
        //  this.languageModel.WritingLevel = parseInt(language.controls[i].get('WritingLevel').value);
        //} else {
        //  this.languageModel.WritingLevel = 0;
        //}
        if (language.controls[i].get('ReadingLevel').value) {
          this.languageModel.ReadingLevel = parseInt(language.controls[i].get('ReadingLevel').value);
        } else {
          this.languageModel.ReadingLevel = 0;
        }
        if (language.controls[i].get('SpeakingLevel').value) {
          this.languageModel.SpeakingLevel = parseInt(language.controls[i].get('SpeakingLevel').value);
        } else {
          this.languageModel.SpeakingLevel = 0;
        }
        if (this.languageList.length == 0) {
          this.languageList.push(this.languageModel);
          this.languageForm.controls['languages'].reset();
          const language = <FormArray>(this.languageForm.controls["languages"]);
          language.controls[0].get('SpeakingLevel').disable();
          language.controls[0].get('ReadingLevel').disable();
          language.controls[0].get('WritingLevel').disable();
          break;
        } else {
          for (let i = 0; i < this.languageList.length; i++) {
            if (this.languageModel.ProviderLanguageId) {
              if (this.languageList[i].ProviderLanguageId == this.languageModel.ProviderLanguageId) {
                this.languageList.push(this.languageModel);
                this.languageForm.controls['languages'].reset();
                const language = <FormArray>(this.languageForm.controls["languages"]);
                language.controls[0].get('SpeakingLevel').disable();
                language.controls[0].get('ReadingLevel').disable();
                language.controls[0].get('WritingLevel').disable();
                break;
              } else {
                this.languageList[i] = this.languageList[i];
              }
            } else {
              this.languageList.push(this.languageModel);
              this.languageForm.controls['languages'].reset();
              const language = <FormArray>(this.languageForm.controls["languages"]);
              language.controls[0].get('SpeakingLevel').disable();
              language.controls[0].get('ReadingLevel').disable();
              language.controls[0].get('WritingLevel').disable();
              break;
            }
          }
        }
      }
    } else {
      if (language == 'submit') {
        this.languageForm.markAllAsTouched();
      }
    }
  }
  //#endregion

  //#region "Extra Activity"
  addUpdateExtraActivities(extraActivity?:any) {
    if (this.extraActivityForm.valid) {
      this.extraActivityShow = true;
      const extraActivity = <FormArray>this.extraActivityForm.controls['extraActivities'];
      for (let i = 0; i < extraActivity.length; i++) {
        this.extraActivitiesModel = new PhysicianExtraActivitiesModel();
        this.extraActivitiesModel.ProviderID = this.providerId;
        this.extraActivitiesModel.ProviderActivityId = extraActivity.controls[i].get('ProviderActivityId').value ? extraActivity.controls[i].get('ProviderActivityId').value : 0;
        this.extraActivitiesModel.NatureOfActivity = extraActivity.controls[i].get('NatureOfActivity').value;
        this.extraActivitiesModel.YearOfParticipation = extraActivity.controls[i].get('YearOfParticipation').value;
        this.extraActivitiesModel.PrizesorAwards = extraActivity.controls[i].get('PrizesorAwards').value;
        this.extraActivitiesModel.StrengthandAreaneedImprovement = extraActivity.controls[i].get('StrengthandAreaneedImprovement').value;
        if (this.extraActivityList.length == 0) {
          this.extraActivityList.push(this.extraActivitiesModel);
          this.extraActivityForm.controls['extraActivities'].reset();
          break;
        } else {
          for (let i = 0; i < this.extraActivityList.length; i++) {
            if (this.extraActivitiesModel.ProviderActivityId) {
              if (this.extraActivityList[i].ProviderActivityId == this.extraActivitiesModel.ProviderActivityId) {
                // this.extraActivityList[i] = this.extraActivitiesModel;
                this.extraActivityList.push(this.extraActivitiesModel);
                this.extraActivityForm.controls['extraActivities'].reset();
                break;
              } else {
                this.extraActivityList[i] = this.extraActivityList[i];
              }
            } else {
              this.extraActivityList.push(this.extraActivitiesModel);
              this.extraActivityForm.controls['extraActivities'].reset();
              break;
            }
          }
        }
      }
    } else {
      if (extraActivity == 'submit') {
        this.extraActivityForm.markAllAsTouched();
      }
    }
  }
  //#endregion

  //#region "Submit"
  addPhysicianDetails() {
    if (this.physicianAddressForm.valid) {
      this.physicianModel.ProviderID = this.providerId;
      this.physicianModel.UserID = this.facilityDetails.Id;
      this.physicianModel.FacilityId = this.physicianAddressForm.get('facility').value.toString();
      this.physicianModel.RoleId = this.physicianAddressForm.get('Role').value
      this.physicianModel.FirstName = this.physicianAddressForm.get('FirstName').value;
      this.physicianModel.LastName = this.physicianAddressForm.get('LastName').value;
      this.physicianModel.MiddleName = this.physicianAddressForm.get('MiddleName').value;
      this.physicianModel.NamePrefix = this.physicianAddressForm.get('NamePrefix').value;
      this.physicianModel.NameSuffix = this.physicianAddressForm.get('NameSuffix').value;
      this.physicianModel.Title = this.physicianAddressForm.get('Title').value;
      this.physicianModel.BirthDate = this.physicianAddressForm.get('BirthDate').value;
      this.physicianModel.Gender = this.physicianAddressForm.get('Gender').value;
      this.physicianModel.PhoneNumber = this.physicianAddressForm.get('PhoneNumber').value;
      this.physicianModel.PersonalEmail = this.physicianAddressForm.get('PersonalEmail').value;
      this.physicianModel.IsActive = this.physicianAddressForm.get('IsActive').value;
      this.physicianModel.Language = this.physicianAddressForm.get('Language').value;
      this.physicianModel.PreferredLanguage = this.physicianAddressForm.get('PreferredLanguage').value;
      this.physicianModel.MotherMaiden = this.physicianAddressForm.get('MothersMaidenName').value;
      this.physicianModel.WebSiteName = this.physicianAddressForm.get('WebsiteName').value;
      this.physicianModel.providerContacts = this.contactInfoList;
      this.physicianModel.providerAddresses = this.addressList;
      this.physicianModel.educations = this.educationList;
      this.physicianModel.familyDetails = this.familyDetailsList;
      this.physicianModel.languages = this.languageList;
      this.physicianModel.extraActivities = this.extraActivityList;  
      this.physicianservice.addUpdatePhysician(this.physicianModel).then((res) => {
        if (this.ImgUpload != null && !this.imageFlag) {
          this.physicianservice.FileUpload(this.formData, res.ProviderID, "Provider").then((res) => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', 'Physician details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.getPhysicianById(this.providerId);
                  this.imageFlag = true;
                  this.router.navigate(['/home/physician/physicianlist']);
                }
              });
            }
          });
          const signData = new FormData();
          signData.append('file', this.ImgUpload, this.ImgUpload.name);
          this.physicianservice.FileUpload(signData, res.ProviderID, "Provider/Signature").then((res) => { });
        }
        else if (!this.imageFlag) {
          this.physicianservice.FileUpload(this.formData, res.ProviderID, "Provider").then((res) => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', 'Physician details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.getPhysicianById(this.providerId);
                  this.imageFlag = true;
                  this.router.navigate(['/home/physician/physicianlist']);
                }
              });
            }
          });
        }
        else if (this.ImgUpload != null) {
          const signData = new FormData();
          signData.append('file', this.ImgUpload, this.ImgUpload.name);
          this.physicianservice.FileUpload(signData, res.ProviderID, "Provider/Signature").then((res) => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', 'Physician details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => { 
                if (res) {
                  this.router.navigate(['/home/physician/physicianlist']);
                }
              });
            }
          });
        }
        else if (this.ImgUpload == null && this.imageFlag) {
          this.util.showMessage('', 'Physician details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
            if (res) {
              this.router.navigate(['/home/physician/physicianlist']);
            }
          });
        }
      });

      // this.physicianservice.addUpdatePhysician(this.physicianModel).then((res) => {
      //   // if (this.FileUpload == null || this.FileUpload == undefined) {
      //   //   this.util.showMessage('', ' Physician Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
      //   //     if (res) {
      //   //       this.router.navigate(['/home/physician/physicianlist']);
      //   //     }
      //   //     // this.getPhysicianDetailsById();
      //   //   });
      //   // }
      //   if (!this.imageFlag) {
      //     //  const formData = new FormData();
      //     //   formData.append('file', this.FileUpload, this.FileUpload.name);
      //     this.physicianservice.FileUpload(this.formData, res.ProviderID, "Provider").then((res) => {
      //       if (res = "File successfully uploaded") {
      //         this.util.showMessage('', ' Physician Details  saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
      //           if (res) {
      //             this.getPhysicianById(this.providerId);
      //             this.imageFlag = true;
      //             // this.getPhysicianDetailsById();
      //             this.router.navigate(['/home/physician/physicianlist']);
      //           }
      //         });
      //       }
      //     })
      //   } else {
      //     this.util.showMessage('', 'Physician Details  saved successfully', BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
      //       if (res) {
      //         this.router.navigate(['/home/physician/physicianlist']);
      //       }
      //     });
      //   }
      // });
    }
  }
    //#endregion

   //#region "Value changes for refresh doctor card"
  getPhysicianById(providerId) {
    this.physicianservice.getPhysicianById(providerId).then(data => {
      this.submitData = data;
    });
  }
  //#endregion

  //#region "Delete"
  deleteContactInfo(data) {
    this.contactInfoList.splice(this.contactInfoList.indexOf(data), 1);
  }
  deleteAddress(data) {
    this.addressList.splice(this.addressList.indexOf(data), 1);
  }
  deleteEducationalDetails(data) {
    this.educationList.splice(this.educationList.indexOf(data), 1);
  }
  deleteFamilyDetails(data) {
    this.familyDetailsList.splice(this.familyDetailsList.indexOf(data), 1);
  }
  deleteLanguage(data) {
    this.languageList.splice(this.languageList.indexOf(data), 1);
  }
  deleteExtraCurricularActivities(data) {
    this.extraActivityList.splice(this.extraActivityList.indexOf(data), 1);
  }
  //#endregion

  //#region "Clear"
  clear() {
    this.physicianAddressForm.reset();
    this.getPhysicianDetailsById();
  }
  //#endregion

  //#region "Gender"
  getGenderforPhysician() {
    this.physicianservice.getGenderforPhysician().then(res => {
      this.gender = res;
    })
  }
  //#endregion

  //#region "Address"
  getAddressforPhysician() {
    this.physicianservice.getAddressforPhysician().then(res => {
      this.address = res;
    })
  }
  //#endregion

  //#region "Country"
  getCountryforPhysician() {
    this.physicianservice.getCountryforPhysician().then(res => {
      this.country = res;
    })
  }
  //#endregion

  //#region "State"
  getStateforPhysician() {
    this.physicianservice.getStateforPhysician().then(res => {
      this.state = res;
    })
  }
  //#endregion

  //#region "Language"
  getlanguageforPhysician() {
    this.physicianservice.getLanguageforPhysician().then(res => {
      this.language = res;
    })
  }
  //#endregion

  //#region "Speak"
  onwrite() {
    const language = <FormArray>(this.languageForm.controls["languages"]);
    if (language.controls[0].get('IsWrite').value) {
      language.controls[0].get('WritingLevel').enable();
      language.controls[0].get('WritingLevel').setValidators(Validators.required)
    } else {
      language.controls[0].get('WritingLevel').disable();
    }
  }
  //#endregion

  ////#region "write"
  //onIswrite() {
  //  const language = <FormArray>(this.languageForm.controls["languages"]);
  //  if (language.controls[0].get('IsWrite').value) {
  //    language.controls[0].get('WritingLevel').enable();
  //  } else {
  //    language.controls[0].get('WritingLevel').disable();
  //  }
  //}
  ////#endregion

  //#region "read"
  onspeak(event: any) {
    const language = <FormArray>(this.languageForm.controls["languages"]);
    if (language.controls[0].get('IsSpeak').value) {
      language.controls[0].get('SpeakingLevel').enable();
      language.controls[0].get('SpeakingLevel').setValidators(Validators.required)
    } else {
      language.controls[0].get('SpeakingLevel').disable();
    }
  }
  //#endregion

  ////#region "set speaking level"
  //onIsSpeak() {
  //  const language = <FormArray>(this.languageForm.controls["languages"]);
  //  if (language.controls[0].get('IsSpeak').value) {
  //    language.controls[0].get('SpeakingLevel').enable();
  //  } else {
  //    language.controls[0].get('SpeakingLevel').disable();
  //  }
  //}
  ////#endregion

  //#region "write"
  onread() {
    const language = <FormArray>(this.languageForm.controls["languages"]);
    if (language.controls[0].get('IsRead').value) {
      language.controls[0].get('ReadingLevel').enable();
      language.controls[0].get('ReadingLevel').setValidators(Validators.required)
    } else {
      language.controls[0].get('ReadingLevel').disable();
    }
  }
  //#endregion

  ////#region "set write"
  //onIsread() {
  //  const language = <FormArray>(this.languageForm.controls["languages"]);
  //  if (language.controls[0].get('IsRead').value) {
  //    language.controls[0].get('ReadingLevel').enable();
  //  } else {
  //    language.controls[0].get('ReadingLevel').disable();
  //  }
  //}
  ////#endregion

  //#region "back"
  back() {
    this.router.navigate(['/home/physician/physicianlist']);
  }
  //#endregion

  //#region "Stepper Previous"
  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
    this.addUpdateContactInfo();
    this.addUpdateAddress();
    this.addUpdateEducationalDetails();
    this.addUpdateFamilyDetails();
    this.addUpdateLanguage();
    this.addUpdateExtraActivities();
  }
  //#endregion

  //#region "Language Previous"
  languageprevious() {
    this.addUpdateLanguage();
    this.addUpdateExtraActivities();
  }
  //#endregion

  //#region "Image Upload"
  public imageUpload(file): void {
    this.convertToBase64(file);
    let files = file.target.files
    if (files.length === 0) {
      this.util.showMessage("Error!!", " please choose an image format ", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
      return;
    }
    if (files[0].type.match(/image.*/)) {
      let Temporaryfiles: File = <File>files[0];
      this.FileUpload = (Temporaryfiles);

      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Temporaryfiles.name;
      viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
      this.ViewFileUpload = (viewFile);
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl(this.profilePics);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
      if (this.profilePics) {
        this.imageFlag = false;
      } else {
        this.imageFlag = true;
      }
    } else {
      this.util.showMessage("error!!", "not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
    }

  }
  //#endregion

  //#region "Upload"
  convertToBase64(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.profilePics = (<FileReader>event.target).result;
      }
    }
  }
  //#endregion

  // //#region "Remove"
  //public RemoveFile(): void {
  //  this.ViewFileUpload = (null);
  //  this.imageFlag = (null);
  //  this.FileUpload = (null);
  //  this.profilePics = null;
  //  if (this.profilePics) {
  //    this.imageFlag = false;
  //  } else {
  //    this.imageFlag = true;
  //  }
  //}
  ////#endregion

  //#region 'Sign Upload'
  signUpload(file) {
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
      }
      reader.readAsDataURL(file.target.files[0]);
    }
    let files = file.target.files;
    if (files.length === 0) {
      this.util.showMessage("Error!!", "Please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
      return;
    }
    if (files[0].type.match(/image.*/)) {
      let Temporaryfiles: File = <File>files[0];
      this.ImgUpload = (Temporaryfiles);

      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Temporaryfiles.name;
      viewFile.Size = Math.round(Temporaryfiles.size / 1024) + "KB";
      this.ViewSignUpload = (viewFile);
      // To edit signature
      this.signPic = this.sanitizer.bypassSecurityTrustResourceUrl(this.signPic);
      this.signPic = [this.signPic.changingThisBreaksApplicationSecurity];
      if (this.signPic) {
        this.showSign = false;
      }
      else {
        this.showSign = true;
      }
      // end
      this.noSign = true;
    } else {
      this.util.showMessage("Error!!", "Not an image format, please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
    }
  }
  //#endregion

  //#region "Dob"
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.physicianAddressForm.get('BirthDate').value).getFullYear();
    this.physicianAddressForm.get('PhysicianAge').setValue(this.bindAge);
  }
  //#endregion

  //#region "Age"
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.physicianAddressForm.get('PhysicianAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.physicianAddressForm.get('BirthDate').setValue(this.bindDOB);
  }
    //#endregion

 // // #region "Facility"
 // getFacility() {
 //   this.physicianservice.getFacility().then(res => {
 //     this.Facility = res;
 //   })
 // }
 ////#endregion

  // #region "All Facility"
  getAllFacility() {
    this.physicianservice.getAllFacility().then(res => {
      this.Facility = res;
    })
  }
  //#endregion

  // #region "role"
  getrole() {
    this.physicianservice.getRole().then(res => {
      this.Role = res;
    })
  }
    //#endregion

  // #region "Facility Change ToolTip"
  setFacility() {
    this.facilitytooltip = [];
    this.facilityvalue = this.physicianAddressForm.get('facility').value;
    for (const option of this.Facility) {
      for (const i of this.facilityvalue) {
        if (i == option.FacilityId) {
          this.facilitytooltip.push(option.FacilityName);
        }
      }
    }
  }
  //#endregion

   // #region "Contact"
  openContact(contact, i) {
    const dialogRef = this.dialog.open(physicianContactDetailComponent, {
      data: contact,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contactInfoList.splice(i, 1, result);
      }
      // let staffAddressModel = new StaffAddressModel();
      // staffAddressModel = result;
      //  let a= this.addressModelCollection.indexOf(Addressconatct);
      //  this.addressModelCollection[a] = (result);
      //
    });
  }
  //#endregion

   // #region "Education"
  openEducation(education, i) {
    const dialogRef = this.dialog.open(PhysicianEducationComponent, {
      data: education,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.educationList.splice(i, 1, result);
      }
    });
  }
    //#endregion

  // #region "Family"
  openFamily(family, i) {
    const dialogRef = this.dialog.open(PhysicianFamilyComponent, {
      data: family,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.familyDetailsList.splice(i, 1, result);
      }
    });
  }
    //#endregion
  // #region "Language"
  openLanguage(language, i) {
    const dialogRef = this.dialog.open(PhysicianLanguageComponent, {
      data: language,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.languageList.splice(i, 1, result);
      }
    });
  }
    //#endregion


  // #region "Extra Activities"
  openExtraActivity(extraactivity, i) {
    const dialogRef = this.dialog.open(PhysicianExtraActivityComponent, {
      data: extraactivity,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.extraActivityList.splice(i, 1, result);
      }
    });
  }
    //#endregion

  // #region "Address"
  openAddress(address, i) {
    const dialogRef = this.dialog.open(PhysicianAddressDetailComponent, {
      data: address,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addressList.splice(i, 1, result);
      }
    });
  }
    //#endregion

  //#region "Cell No"
  samecell() {
    const contact = <FormArray>(this.contactForm.controls["providerContacts"]);
    if (contact.controls[0].get('samecellno').value) {
      contact.controls[0].get('WhatsAppNumber').setValue(contact.controls[0].get('CellNumber').value);
    } else {
      contact.controls[0].get('WhatsAppNumber').setValue("");
    }

  }
  //#endregion

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.physicianAddressForm.get('FirstName').value,
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

//setupdateeducation(i: number) {
  //  this.addanothereducation = false;
  //  this.dataindex = i;
  // // this.edit = false;
  //  this.hideeducational[i] = false;

  //  const education = <FormArray>this.physicianAddressForm.controls['educations'];
  //  for (let i = 0; i < education.length; i++) {
  //    this.educationalModel = new PhysicianEducationalDetailsModel();
  //    this.educationalModel.ProviderID = this.providerId;
  //    this.educationalModel.ProviderEducationId = education.controls[i].get('ProviderEducationId').value ? education.controls[i].get('ProviderEducationId').value : 0;
  //    this.educationalModel.EducationType = education.controls[i].get('EducationType').value;
  //    this.educationalModel.BoardorUniversity = education.controls[i].get('BoardorUniversity').value;
  //    this.educationalModel.MonthandYearOfPassing = education.controls[i].get('MonthandYearOfPassing').value;
  //    this.educationalModel.NameOfSchoolorCollege = education.controls[i].get('NameOfSchoolorCollege').value;
  //    this.educationalModel.MainSubjects = education.controls[i].get('MainSubjects').value;
  //    this.educationalModel.PercentageofMarks = education.controls[i].get('PercentageofMarks').value;
  //    this.educationalModel.HonoursorScholarshipHeading = education.controls[i].get('HonoursorScholarshipHeading').value;
  //    this.educationalModel.ProjectWorkUndertakenHeading = education.controls[i].get('ProjectWorkUndertakenHeading').value;
  //    this.educationalModel.PublicationsorPapers = education.controls[i].get('PublicationsorPapers').value;
  //    this.educationalModel.Qualification = education.controls[i].get('Qualification').value;
  //    this.educationalModel.DurationOfQualification = education.controls[i].get('DurationOfQualification').value;
  //    this.educationalModel.NameOfInstitution = education.controls[i].get('NameOfInstitution').value;
  //    this.educationalModel.PlaceOfInstitution = education.controls[i].get('PlaceOfInstitution').value;
  //    this.educationalModel.RegisterationAuthority = education.controls[i].get('RegisterationAuthority').value;
  //    this.educationalModel.RegisterationNumber = education.controls[i].get('RegisterationNumber').value;
  //    this.educationalModel.ExpiryOfRegisterationNumber = education.controls[i].get('ExpiryOfRegisterationNumber').value;
  //    this.educationList[this.dataindex] = this.educationalModel;

  //  }
  //  this.physicianAddressForm.controls['educations'].reset();

  //}
  //setupdatefamily(i: number) {
  //  this.addanotherfamily = false;
  //  this.dataindex = i;
  // // this.edit = false;
  //  this.hidefamily[i] = false;

  //  const familyDetail = <FormArray>this.physicianAddressForm.controls['familyDetails'];
  //  for (let i = 0; i < familyDetail.length; i++) {
  //    this.familyDetailsModel = new PhysicianFamilyDetailsModel();

  //    this.familyDetailsModel.ProviderID = this.providerId;
  //    this.familyDetailsModel.ProviderFamilyDetailId = familyDetail.controls[i].get('ProviderFamilyDetailId').value ? familyDetail.controls[i].get('ProviderFamilyDetailId').value : 0;
  //    this.familyDetailsModel.FullName = familyDetail.controls[i].get('FullName').value;
  //    this.familyDetailsModel.Age = familyDetail.controls[i].get('Age').value;
  //    this.familyDetailsModel.RelationShip = familyDetail.controls[i].get('RelationShip').value;
  //    this.familyDetailsModel.Occupation = familyDetail.controls[i].get('Occupation').value;
  //    this.familyDetailsModel.Notes = familyDetail.controls[i].get('Notes').value;
  //    this.familyDetailsList[this.dataindex] = this.familyDetailsModel;

  //  }
  //  this.physicianAddressForm.controls['familyDetails'].reset();

  //}
  //setupdatelanguage(i: number) {
  //  this.addanotherlanguage = false;
  //  this.dataindex = i;
  //  //this.edit = false;
  //  this.hidelanguage[i] = false;

  //  const language = <FormArray>this.physicianAddressForm.controls['languages'];
  //  for (let i = 0; i < language.length; i++) {
  //    this.languageModel = new PhysicianLanguageModel();
  //    this.languageModel.ProviderID = this.providerId;
  //    this.languageModel.ProviderLanguageId = language.controls[i].get('ProviderLanguageId').value ? language.controls[i].get('ProviderLanguageId').value : 0;
  //    this.languageModel.IsSpeak = language.controls[i].get('IsSpeak').value;
  //    this.languageModel.Language = language.controls[i].get('Language').value;
  //    this.languageModel.SpeakingLevel = parseInt(language.controls[i].get('SpeakingLevel').value);
  //    this.languageModel.IsRead = language.controls[i].get('IsRead').value;
  //    this.languageModel.ReadingLevel = parseInt(language.controls[i].get('ReadingLevel').value);
  //    this.languageModel.IsWrite = language.controls[i].get('IsWrite').value;
  //    this.languageModel.WritingLevel = parseInt(language.controls[i].get('WritingLevel').value);
  //    this.languageList[this.dataindex] = this.languageModel;

  //  }
  //  this.physicianAddressForm.controls['languages'].reset();

  //}
  //setupdateactivity(i: number) {
  //  this.addanotheractivity = false;
  //  this.dataindex = i;
  //  //this.edit = false;
  //  this.hideactivity[i] = false;

  //  const extraActivity = <FormArray>this.physicianAddressForm.controls['extraActivities'];
  //  for (let i = 0; i < extraActivity.length; i++) {
  //    this.extraActivitiesModel = new PhysicianExtraActivitiesModel();
  //    this.extraActivitiesModel.ProviderID = this.providerId;
  //    this.extraActivitiesModel.ProviderActivityId = extraActivity.controls[i].get('ProviderActivityId').value ? extraActivity.controls[i].get('ProviderActivityId').value : 0;
  //    this.extraActivitiesModel.NatureOfActivity = extraActivity.controls[i].get('NatureOfActivity').value;
  //    this.extraActivitiesModel.YearOfParticipation = extraActivity.controls[i].get('YearOfParticipation').value;
  //    this.extraActivitiesModel.PrizesorAwards = extraActivity.controls[i].get('PrizesorAwards').value;
  //    this.extraActivitiesModel.StrengthandAreaneedImprovement = extraActivity.controls[i].get('StrengthandAreaneedImprovement').value;
  //    this.extraActivityList[this.dataindex] = this.extraActivitiesModel;
  //  }
  //  this.physicianAddressForm.controls['extraActivities'].reset();

  //}

////# region "update"
  //setupdate(i: number) {
  //  this.addanother = false;
  //  this.dataindex = i;
  //  //this.edit = false;
  //  this.hideArray[i] = false;


  //    const contact = <FormArray>this.physicianAddressForm.controls['providerContacts'];
  //  for (let i = 0; i < contact.length; i++) {
  //      this.contactInfoModel = new PhysicianContactInfoModel();
  //    this.contactInfoModel.ProviderID = this.providerId;
  //      this.contactInfoModel.ProviderContactID = i;
  //      this.contactInfoModel.CellNumber = contact.controls[i].get('CellNumber').value;
  //      this.contactInfoModel.PhoneNumber = contact.controls[i].get('PhoneNumber').value;
  //      this.contactInfoModel.WhatsAppNumber = contact.controls[i].get('WhatsAppNumber').value;
  //      this.contactInfoModel.EmergencyContactNumber = contact.controls[i].get('EmergencyContactNumber').value;
  //      this.contactInfoModel.TelephoneNo = contact.controls[i].get('TelephoneNo').value;
  //      this.contactInfoModel.Fax = contact.controls[i].get('Fax').value;
  //    this.contactInfoModel.Email = contact.controls[i].get('Email').value;
  //    this.contactInfoList[this.dataindex] = this.contactInfoModel;
  //  }
  //  this.physicianAddressForm.controls['providerContacts'].reset();

  //      }
  //  //#endregion
  ////#region "Edit"
  //setFormArrayValue(element: any, tempId: number, i: number) {
  //  this.edit = true;
  //  this.dataindex = i;
  //  if (tempId == 1) {
  //    this.addanother = true;
  //    this.hideArray[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //    const contact = <FormArray>this.physicianAddressForm.controls['providerContacts'];
  //    contact.controls[0].setValue(element);
  //  }
  //  if (tempId == 2) {
  //    this.addanotheraddress = true;
  //    this.hideedit[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //    const address = <FormArray>this.physicianAddressForm.controls['providerAddresses'];
  //      address.controls[0].setValue(element);
  //  }
  //  if (tempId == 3) {
  //    this.addanothereducation = true;
  //    this.hideeducational[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //    const education = <FormArray>this.physicianAddressForm.controls['educations'];
  //      education.controls[0].setValue(element);
  //  }
  //  if (tempId == 4) {
  //    this.addanotherfamily = true;
  //    this.hidefamily[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //   const family = <FormArray>this.physicianAddressForm.controls['familyDetails'];
  //      family.controls[0].setValue(element);
  //  }
  //  if (tempId == 5) {
  //    this.addanotherlanguage = true;
  //    this.hidelanguage[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //    const language = <FormArray>this.physicianAddressForm.controls['languages'];
  //    language.controls[0].get('Language').setValue(element.Language);
  //    language.controls[0].get('IsSpeak').setValue(element.IsSpeak);
  //    language.controls[0].get('SpeakingLevel').setValue(element.SpeakingLevel.toString());
  //    this.onIsSpeak();
  //    language.controls[0].get('IsRead').setValue(element.IsRead);
  //    language.controls[0].get('ReadingLevel').setValue(element.ReadingLevel.toString());
  //    this.onIsread();
  //    language.controls[0].get('IsWrite').setValue(element.IsWrite);
  //    language.controls[0].get('WritingLevel').setValue(element.WritingLevel.toString());
  //    this.onIswrite();
  //  }
  //  if (tempId == 6) {
  //    this.addanotheractivity = true;
  //    this.hideactivity[i] = this.edit;
  //    delete element.Result;
  //    delete element.Status;
  //    delete element.StatusMessage;
  //    delete element.CreatedDate;
  //    delete element.CreatedBy;
  //    delete element.ModifiedDate;
  //    delete element.ModifiedBy;
  //    const activity = <FormArray>this.physicianAddressForm.controls['extraActivities'];
  //      activity.controls[0].setValue(element);
  //  }
  //}
  ////#endregion

//setupdateaddress(i: number) {
  //  this.addanotheraddress = false;
  //  this.dataindex = i;
  //  //this.edit = false;
  //  this.hideedit[i] = false;
  //  const address = <FormArray>this.physicianAddressForm.controls['providerAddresses'];
  //  for (let i = 0; i < address.length; i++) {
  //    this.addressModel = new PhysicianAddressModel();
  //    this.addressModel.ProviderID = this.providerId;
  //    this.addressModel.ProviderAddressID = address.controls[i].get('ProviderAddressID').value ? address.controls[i].get('ProviderAddressID').value : 0;
  //    this.addressModel.AddressType = address.controls[i].get('AddressType').value;
  //    this.addressModel.DoorOrApartmentNo = address.controls[i].get('DoorOrApartmentNo').value;
  //    this.addressModel.ApartmentNameOrHouseName = address.controls[i].get('ApartmentNameOrHouseName').value;
  //    this.addressModel.StreetName = address.controls[i].get('StreetName').value;
  //    this.addressModel.Locality = address.controls[i].get('Locality').value;
  //    this.addressModel.Town = address.controls[i].get('Town').value;
  //    this.addressModel.City = address.controls[i].get('City').value;
  //    this.addressModel.District = address.controls[i].get('District').value;
  //    this.addressModel.State = address.controls[i].get('State').value;
  //    this.addressModel.Country = address.controls[i].get('Country').value;
  //    this.addressModel.PinCode = address.controls[i].get('PinCode').value;
  //    this.physicianAddressForm.controls['providerContacts'].reset();
  //    this.addressList[this.dataindex] = this.addressModel;
  //  }
  //  this.physicianAddressForm.controls['providerAddresses'].reset();
  //}
    //#endregion

  //convertFile(file: File): Observable<string> {
  //  const result = new ReplaySubject<string>(1);
  //  const reader = new FileReader();
  //  reader.readAsBinaryString(file);
  //  //reader.onload = (event) => result.next(btoa(event.target.result.toString()));
  //  return result;
  //}
