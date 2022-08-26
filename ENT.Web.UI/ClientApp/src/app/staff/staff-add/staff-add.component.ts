import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
/*import { log } from 'util';*/
import { StaffProfileModel } from '../models/staffProfileModel';
import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

/*import { StepperSelectionEvent } from '@angular/cdk/stepper';
*/
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { clsViewFile } from '../../patient/models/clsViewFile';

import { DomSanitizer } from '@angular/platform-browser';
import { imageCropComponent } from 'src/app/image-crop/image-crop.component';
@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.css']
})

export class StaffAddComponent implements OnInit {
  //#region "Property Decleartion"
  @ViewChild('autoCompleteSchedulerDepartment', { static: false, read: MatAutocompleteTrigger }) triggerschedule: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('LanguageInput', { static: true }) LanguageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  @ViewChild('autocompleteTrigger', { static: true }) matACTrigger: MatAutocompleteTrigger;
  maxDate=new Date();
  startDate = new Date((new Date().getFullYear()-20),12,0);
  endDate= new Date((new Date().getFullYear()-80), 12, 0);
  removable = true;
  languageDescription: any = [];
  languageArray: any = [];
  filteredLanguage: Observable<string[]> | string;
  languages: any = [];
  //Yeardata: any;
  // currentyear: any
  //yearindex: any;
  //length = 1970;
  // newyear = [new Date().getFullYear()];
  StaffProfileModel: StaffProfileModel = new StaffProfileModel();
  staffaddform: FormGroup;
  Facility: any;
  bindAge: any;
  bindDOB: any;
  role: any;
  salutation: any;
  gender: any;
  Identification: any;
  martialstatus: any;
  bloodgroup: any;
  language: any;
  addresstype: any;
  relation: any;
  contactType: any;
  UserType: any;
  department: any;
  departmentToolTip: any;
  SchedulerdepartmentToolTip: any;
  Schedulerdepartment: any;
  Preferedlanguage: any;
  // preferedlanguageTollTip: any;
  filterValue: any = [];
  //languageid: any;
  preferedlanguageid: any = "";
  departmentid: number;
  Scheduledepartmentid: number;
  autoGenerateEmployeeNo: any = "";
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  profilePics: any;
  imageFlag: boolean = true;
  imagebutton: boolean = true;
  // StaffDetailById: any;
  //staffimage: boolean = true;
  ImageBase64: any;
  facilitytooltip: any[] = [];
  facilityvalue: any;
  formData: any;
  desVal: any;
  //#endregion
  //#region "constructor"
  constructor(private fb: FormBuilder,
    private sanitizer: DomSanitizer, private util: UtilService,
    private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialog: MatDialog,
    public dialogRef: MatDialogRef<StaffAddComponent>, private staffservice: StaffService) {
  }
  //#endregion
  //#region "ng onInit"
  ngOnInit() {

    this.staffaddform = this.fb.group({
      Department: [''],
      Category: [''],
      Role: ['', Validators.required],
      UserType: [''],
      EmployeeNumber: [''],
      DateofJoining: [''],
      SchedulerDepartment: [''],
      AdditionalDetails: [''],
      Salutation: [''],
      Firstname: ['', Validators.required],
      MiddleName: ['', Validators.required],
      //Telephone: [''],
      Lastname: ['', Validators.required],
      //Fax: [''],
      Gender: [''],
      DateofBirth: ['', Validators.required],
      staffAge: ['', Validators.required],
      //MothersMaidenName: [''],
      //WebsiteName: [''],
      Identification: ['',Validators.required ],
      PatientIdentificationtypedetails: ['', Validators.required],
      Identificationname: ['', Validators.required],
      PatientIdentificationtypedetailsname: ['', Validators.required],
      MaritalStatus: [''],
      MothersMaidenName: [''],
      preferedlanguage: [''],
      Bloodgroup: [''],
      IsActive: [true],
      newyear: [new Date().getFullYear()],
      facility: ['', Validators.required],
      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      Drug: [''],
      Email: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      SalutationContact: [''],
      FirstnameConatct: [''],
      LastName: [''],
      cellNoContact: [''],
      EmergencyNoContact: [''],
      TelephoneNoContact: [''],
      Fax: [''],
      RelationshiptoEmployee: [''],
    
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));

    this.getFacility();
    this.getRole();
    this.getSalutation();
    this.getGender();
    this.getIdentification();
    this.getMartialStatus();
    this.getBloodGroup();
    this.getRelation();
    this.getContactType();
    this.getUserType();
    this.getDepartment();
    this.getSchedulerDepartment();
    this.getLanguageMultiselect();
    this.getStaffEmployeeNo();
    //this.getPreferedLanguage();
  }
  //#endregion
  ngAfterViewInit() {
    this.trigger.panelClosingActions.subscribe(Department => {
      if (!(Department && Department.source)) {
        this.staffaddform.get('Department').setValue('');
      }
    });
    this.triggerschedule.panelClosingActions.subscribe(ScheduleDepartment => {
      if (!(ScheduleDepartment && ScheduleDepartment.source)) {
        this.staffaddform.get('SchedulerDepartment').setValue('');
      }
    });
    this.matACTrigger.panelClosingActions.subscribe(preferedlanguage => {
      if (!(preferedlanguage && preferedlanguage.source)) {
        // this.staffaddform.get('preferedlanguage').setValue('');
        //this.languages = [];
        this.LanguageInput.nativeElement.value = '';

      }
    });
  }
  //#region "Clear"
  clear() {
    this.staffaddform.reset();
    this.getStaffEmployeeNo();

  }
  //#endregion
  // #region "Facility"
  getFacility() {
    this.staffservice.getFacility().then(res => {
      this.Facility = res;
    })
  }
  //#endregion
  //#region BindDob
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.staffaddform.get('DateofBirth').value).getFullYear();
    this.staffaddform.get('staffAge').setValue(this.bindAge);
  }
  //#endregion
  //#region BindAge
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.staffaddform.get('staffAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.staffaddform.get('DateofBirth').setValue(this.bindDOB);
  }
  //#endregion
  //#region Role
  getRole() {
    this.staffservice.getRoleForStaff().then(res => {
      this.role = res;
    })
  }
  //#endregion
  //#region Salutation
  getSalutation() {
    this.staffservice.getSalutation().then(res => {
      this.salutation = res;
    })
  }
  //#endregion
  //#region Gender
  getGender() {
    this.staffservice.getGender().then(res => {
      this.gender = res;
    })
  }
  //#endregion
  //#region "Identification"
  getIdentification() {
    this.staffservice.getIdentification().then(res => {
      this.Identification = res;
    })  
  }

  setIdentification(description) {
    this.desVal = description;
    if( this.staffaddform.get('PatientIdentificationtypedetails').value){this.staffaddform.get('PatientIdentificationtypedetails').reset();
     
  }
  }
  setIdentification1(description) {
    this.desVal = description;
    if( this.staffaddform.get('PatientIdentificationtypedetailsname').value){this.staffaddform.get('PatientIdentificationtypedetailsname').reset();
     
  }
  }

  valid()
  {
    if(this.desVal=='Aadhar') {
      this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.desVal=='PAN CARD') {
    this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern( /[A-Z]{5}\d{4}[A-Z]{1}/i));
    }
    else if (this.desVal=='DRIVING LICENSE') {
      this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
     }
    else if (this.desVal=='VOTER ID') {
      this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.desVal=='RATION CARD') {
      this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.maxLength(15));
     }
    else if (this.desVal=='STUDENT ID') {
      this.staffaddform.controls["PatientIdentificationtypedetails"].setValidators(Validators.maxLength(10));
   }
  }
  
  valid1()
  {
    if(this.desVal=='Aadhar') {
      this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.desVal=='PAN CARD') {
    this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern( /[A-Z]{5}\d{4}[A-Z]{1}/i));
    }
    else if (this.desVal=='DRIVING LICENSE') {
      this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
     }
    else if (this.desVal=='VOTER ID') {
      this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.desVal=='RATION CARD') {
      this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.maxLength(15));
     }
    else if (this.desVal=='STUDENT ID') {
      this.staffaddform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.maxLength(10));
   }
  }


  //#endregion
  //#region "Martial"
  getMartialStatus() {
    this.staffservice.getMaritalStatus().then(res => {
      this.martialstatus = res;
    })
  }
  //#endregion
  //#region "BloodGroup"
  getBloodGroup() {
    this.staffservice.getBloodGroup().then(res => {
      this.bloodgroup = res;
    })
  }
  //#endregion
  //#region "Relation"
  getRelation() {
    this.staffservice.getRelation().then(res => {
      this.relation = res;
    })
  }
  //#endregion
  //#region "getContactType"
  getContactType() {
    this.staffservice.getContactType().then(res => {
      this.contactType = res;
    })
  }
  //#endregion
  //#region "whatsappNo"
  whatsapp() {
    if (!this.staffaddform.get('Drug').value) {
      this.staffaddform.get('WhatsAppNumber').setValue(this.staffaddform.get('CellNumber').value);
    } else {
      this.staffaddform.get('WhatsAppNumber').setValue("");
    }
  }
  //#endregion
  //#region "Close"
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion
  //#region "getUserType"
  getUserType() {
    this.staffservice.getUserType().then(res => {
      this.UserType = res;
    })
  }
  //#endregion
  //#region "Department"
  getDepartment() {
    if (this.staffaddform.get('Department').value != null) {
      this.staffaddform.get('Department').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.department = data;
              //this.staffaddform.get('preferedlanguage').setValue('');

            })
          }
          else {
            this.department = null;
            this.departmentToolTip = null;
          }
        } else {
          this.department = null;
          this.departmentToolTip = null;
        }
      })
    }
  }
  //#endregion
  //#region "Set Tooltip"
  setDepartmentToolTip(value, number) {
    this.departmentToolTip = value;
    this.departmentid = number;
  }
  //#endregion "Set Tooltip"
  //#region "Schedule Department"
  getSchedulerDepartment() {
    if (this.staffaddform.get('SchedulerDepartment').value != null) {
      this.staffaddform.get('SchedulerDepartment').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.Schedulerdepartment = data;
              // this.staffaddform.get('preferedlanguage').setValue('');
            })
          }
          else {
            this.Schedulerdepartment = null;
            this.SchedulerdepartmentToolTip = null;
          }
        } else {
          this.Schedulerdepartment = null;
          this.SchedulerdepartmentToolTip = null;
        }
      })
    }
  }
  //#endregion
  //#region "Set Tooltip"
  setSchedulerDepartmentToolTip(value, number) {
    this.SchedulerdepartmentToolTip = value;
    this.Scheduledepartmentid = number;
  }
  //#endregion "Set Tooltip"
  //#region "MultiSelect"
  getLanguageMultiselect() {
    if (this.staffaddform.get('preferedlanguage').value != null) {
      this.staffaddform.get('preferedlanguage').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getPreferedLanguage(key).then(data => {
              this.Preferedlanguage = data;
              //this.filteredLanguage = data;
              //this.staffaddform.get('preferedlanguage').setValue('');
            })
          }
        } else {
          this.Preferedlanguage = [];
        }
      })
    }
  }
  //#endregion
  //#region "MultiSelect Remove"
  remove(language: string, i: number): void {
    const index = this.languages.indexOf(language);
    if (index >= 0) {
      this.languages.splice(index, 1);

      if (this.languageArray.length > 0) {
        this.languageArray.splice(index, 1);
      } else {
        this.languageArray = [];
      }
    } if (this.languages.length == 0) {
      this.staffaddform.get('preferedlanguage').setValue(null);
    }
  }
  //#endregion
  //#region "MultiSelect Select"
  selected(event: MatAutocompleteSelectedEvent): void {
    const languageDescription = event.option.value.LanguageDescription;
    const languageid = event.option.value.LanguageId;
    if (this.languages.includes(languageDescription)) {
      this.languages = [...this.languages.filter((language) => language !== languageDescription)];
      this.languageArray = [...this.languageArray.filter((languages) => languages !== languageid)];
    } else {
      this.languages.push(event.option.value.LanguageDescription);
      this.languageArray.push(event.option.value.LanguageId);
    }

    this.LanguageInput.nativeElement.value = '';
    if (this.languages.length == 0) {
      this.Preferedlanguage = [];
    } else {
      requestAnimationFrame(() => {
        this.openAuto(this.matACTrigger);
      });
    }
  }

  //#endregion
  //#region "AutoComplte panel open"
  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
  }
  //#endregion
  //#region "Staff EmployeeNO"
  getStaffEmployeeNo() {
    this.staffservice.getStaffEmployeeNo().then(res => {
      this.autoGenerateEmployeeNo = res[0];
      this.staffaddform.get('EmployeeNumber').setValue(this.autoGenerateEmployeeNo);
    })
  }
  //#endregion
  //#region "Submit"
  submit() {
    this.preferedlanguageid = "";
    for (let i = 0; i < this.languageArray.length; i++) {
      let id = this.languageArray[i];
      if ((i + 1) < this.languageArray.length) {
        this.preferedlanguageid += id + ',';
      } else {
        this.preferedlanguageid += id;
      }
    }
    if (this.staffaddform.valid) {
      this.StaffProfileModel.EmployeeId = 0;
      this.StaffProfileModel.EmployeeNo = this.staffaddform.get('EmployeeNumber').value;
      this.StaffProfileModel.EmployeeDepartment = this.departmentid;
      this.StaffProfileModel.FacilityId = this.staffaddform.get('facility').value.toString();
      this.StaffProfileModel.RoleId = this.staffaddform.get('Role').value;
      this.StaffProfileModel.EmployeeUserType = this.staffaddform.get('UserType').value;
      this.StaffProfileModel.DOJ = this.staffaddform.get('DateofJoining').value;
      this.StaffProfileModel.SchedulerDepartment = this.Scheduledepartmentid;
      this.StaffProfileModel.AdditionalInfo = this.staffaddform.get('AdditionalDetails').value;
      this.StaffProfileModel.EmployeeSalutation = this.staffaddform.get('Salutation').value;
      this.StaffProfileModel.EmployeeFirstName = this.staffaddform.get('Firstname').value;
      this.StaffProfileModel.EmployeeMiddleName = this.staffaddform.get('MiddleName').value;
      this.StaffProfileModel.EmployeeLastName = this.staffaddform.get('Lastname').value;
      this.StaffProfileModel.Gender = this.staffaddform.get('Gender').value;
      this.StaffProfileModel.EmployeeDOB = this.staffaddform.get('DateofBirth').value;
      this.StaffProfileModel.EmployeeAge = this.staffaddform.get('staffAge').value;
      this.StaffProfileModel.EmployeeIdentificationtype1 = this.staffaddform.get('Identification').value;
      this.StaffProfileModel.EmployeeIdentificationtype1details = this.staffaddform.get('PatientIdentificationtypedetails').value;
      this.StaffProfileModel.EmployeeIdentificationtype2 = this.staffaddform.get('Identificationname').value;
      this.StaffProfileModel.EmployeeIdentificationtype2details = this.staffaddform.get('PatientIdentificationtypedetailsname').value;
      this.StaffProfileModel.MaritalStatus = this.staffaddform.get('MaritalStatus').value;
      this.StaffProfileModel.MothersMaiden = this.staffaddform.get('MothersMaidenName').value;
      this.StaffProfileModel.PreferredLanguage = this.preferedlanguageid;
      this.StaffProfileModel.Bloodgroup = this.staffaddform.get('Bloodgroup').value;
      this.StaffProfileModel.CellNo = this.staffaddform.get('CellNumber').value;
      this.StaffProfileModel.PhoneNo = this.staffaddform.get('PhoneNumber').value;
      this.StaffProfileModel.WhatsAppNo = this.staffaddform.get('WhatsAppNumber').value;
      this.StaffProfileModel.EMail = this.staffaddform.get('Email').value;
      this.StaffProfileModel.EmergencySalutation = this.staffaddform.get('SalutationContact').value;
      this.StaffProfileModel.EmergencyFirstName = this.staffaddform.get('FirstnameConatct').value;
      this.StaffProfileModel.IsActive = this.staffaddform.get('IsActive').value;
      this.StaffProfileModel.EmergencyLastName = this.staffaddform.get('LastName').value;
      this.StaffProfileModel.EmployeeUserType = this.staffaddform.get('UserType').value;
      this.StaffProfileModel.EmergencyContactType = this.staffaddform.get('cellNoContact').value;
      this.StaffProfileModel.EmergencyContactNo = this.staffaddform.get('EmergencyNoContact').value;
      this.StaffProfileModel.TelephoneNo = this.staffaddform.get('TelephoneNoContact').value;
      this.StaffProfileModel.Fax = this.staffaddform.get('Fax').value;
      this.StaffProfileModel.RelationshipToEmployee = this.staffaddform.get('RelationshiptoEmployee').value;
      this.staffservice.addStaff(this.StaffProfileModel).then((res) => {
        if (this.formData == null || this.formData == undefined) {
          this.util.showMessage('', ' Staff Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              this.dialogRef.close("updated");
            }
          );

        }
        if (this.formData != null) {
          // const formData = new FormData();
          // formData.append('file', this.FileUpload, this.FileUpload.name);
          this.staffservice.FileUpload(this.formData, res.EmployeeId, "Staff").then(res => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', ' Staff Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.dialogRef.close("updated");
                }
              });

            } else {
              this.util.showMessage('', res, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.dialogRef.close("updated");
                }
              });
            }

          });
        }
        //if (res) {
        //  this.util.showMessage('', ' Staff Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        //  (res) => {
        //  }
        //  );
        //}
      });
    }
  }
  //#endregion

  // //#region "File Upload"
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
  //       this.imagebutton = false;
  //     } else {
  //       this.imagebutton = true;
  //       this.imageFlag = true;
  //     }
  //   } else {
  //     this.util.showMessage("Error!!", "Not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
  //   }

  // }
  // //#endregion
  // //#region "Remove"
  // public RemoveFile(): void {
  //   this.ViewFileUpload = (null);
  //   this.FileUpload = (null);
  //   this.ImageBase64 = null;
  //   if (this.ImageBase64) {
  //     this.imageFlag = false;
  //     this.imagebutton = false;
  //   } else {
  //     this.imagebutton = true;
  //     this.imageFlag = true;
  //   }
  // }
  //    //#endregion
  // //#region "File Upload"
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
  //  //#endregion

  //#region "Set Facility"

  setFacility() {
    this.facilitytooltip = [];
    this.facilityvalue = this.staffaddform.get('facility').value;
    for (const option of this.Facility) {
      for (const i of this.facilityvalue) {
        if (i == option.FacilityId) {
          this.facilitytooltip.push(option.FacilityName);
        }
      }
    }
  }

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.staffaddform.get('Firstname').value,
      height: '450px',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formData = (result.formData);
        this.ImageBase64 = result.image;
        if (this.profilePics) {
          this.imageFlag = true;
        } else {
          this.imageFlag = false;
        }
      }
    });
  }
}
   //#endregion







  //setLanguageid(number) {
  // //this.languages.push(number);
  //}

  ////#region "Set Tooltip"
  //setPreferedLanguageTooltip(value) {
  //  this.preferedlanguageTollTip = value;
  //}
  ////#endregion "Set Tooltip"
  //getPreferedLanguage() {
  //  if (this.staffaddform.get('preferedlanguage').value != null) {
  //    this.staffaddform.get('preferedlanguage').valueChanges.subscribe((key: string) => {
  //      if (key != null) {
  //        if (key.length > 2) {
  //          this.staffservice.getPreferedLanguage(key).then(data => {
  //            this.Preferedlanguage = data;
  //          })
  //        }
  //        else {
  //          this.preferedlanguage = null;
  //          this.preferedlanguageTollTip = null;
  //        }
  //      } else {
  //        this.preferedlanguage = null;
  //        this.preferedlanguageTollTip = null;
  //      }
  //    })
  //  }
  //}
  //#region "MultiSelect Filter"
  //  this.filteredLanguage = this.staffaddform.get('preferedlanguage').valueChanges.pipe(startWith(null), map((language: string | null) => language ? this._filter(language) : this.Preferedlanguage.slice()));
  //private _filter(value: any): string[] {
  //  if (value.LanguageDescription == undefined) {
  //    const filterValue = value;
  //    for (let i = 0; i < this.Preferedlanguage.LanguageDescription; i++) {
  //      this.languageDescription.push(this.Preferedlanguage[i].LanguageDescription)
  //    }
  //    return this.languageDescription.filter((language) => language.toLowerCase().indexOf(filterValue) >= 0);
  //  } else {
  //    const filterValue = value.LanguageDescription
  //    this.filterValue.push(this.Preferedlanguage[0].LanguageDescription);
  //    return this.filterValue.filter((language) => language.toLowerCase().indexOf(filterValue) >= 0
  //    );
  //  }
  //}
  //#endregion
  //getDepartmentValue() {
  //  if (this.staffaddform.get('Department').value.length > 2) {
  //    this.staffservice.getDepartment(this.staffaddform.get('Department').value).then(data => {
  //      this.department = data;
  //    })
  //  } else {
  //    this.department = null;
  //  }
  //}
  //ngAfterViewInit(): void {
  //  this.staffaddform.get('Department').setValue('');
  //}
