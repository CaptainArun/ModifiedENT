import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhysicianModel } from './models/physicianModel';
import { PhysicianService } from './physician.service';
import { AuthService } from '../core/auth.service';
import { CustomHttpService } from '../core/custom-http.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../core/util.service';
import { clsViewFile } from '../patient/models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { imageCropComponent } from 'src/app/image-crop/image-crop.component';

@Component({
  selector: 'physician-add',
  templateUrl: './physician-add.component.html',
})
export class PhysicianAddComponent implements OnInit {
  //#region "property declaration"
  addPhysicianForm: FormGroup;
  physicianModel: PhysicianModel = new PhysicianModel();
  //facilityDetails: any;
  gender: any;
  Role: any;
  Facility: any;
  bindAge: any;
  bindDOB: any;
  facilitytooltip: any[] = [];
  facilityvalue: any;
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  profilePics: any;
  ImageBase64: any;
  imageFlag: boolean = true;
  imagebutton: boolean = true;
  formData: any;
  startDate = new Date((new Date().getFullYear()-20),12,0);
  endDate= new Date((new Date().getFullYear()-80), 12, 0);
  //facility: any;
  //#endregion
  //#region "Constructor"
  constructor(private fb: FormBuilder, private util: UtilService, private physicianservice: PhysicianService,
    private authSvc: AuthService, private sanitizer: DomSanitizer, public dialog: MatDialog,
    private customHttpSvc: CustomHttpService, private dialogRef: MatDialogRef<PhysicianAddComponent>) { }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.addPhysicianForm = this.fb.group({
      //ProviderID: [''],
      //UserID: [''],
      //FacilityId: [''],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: [''],
      NamePrefix: [''],
      NameSuffix: [''],
      Title: [''],
      BirthDate: [''],
      Gender: ['', Validators.required],
      PersonalEmail: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      Language: [''],
      PreferredLanguage: [''],
      MothersMaidenName: [''],
      WebsiteName: [''],
      facility: ['',Validators.required],
      Role:['',Validators.required],
      IsActive: [true],
      PhysicianAge: ['', Validators.required],
    });

    //this.facilityDetails = JSON.parse(localStorage.getItem('DBdetails'));
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getGenderforPhysician();
    this.getrole();
    //this.getFacility();
    this.getAllFacility();
  }
  //#endregion
  //#region "Submit"
  addPhysicianDetails() {
    if (this.addPhysicianForm.valid) {
      //this.physicianModel.UserID = this.facilityDetails.Id;
      //this.physicianModel.FacilityId = this.facilityDetails.TenantId;
      this.physicianModel.ProviderID = 0;
      this.physicianModel.FirstName = this.addPhysicianForm.get('FirstName').value;
      this.physicianModel.LastName = this.addPhysicianForm.get('LastName').value;
      this.physicianModel.MiddleName = this.addPhysicianForm.get('MiddleName').value;

      this.physicianModel.NamePrefix = this.addPhysicianForm.get('NamePrefix').value;
      this.physicianModel.NameSuffix = this.addPhysicianForm.get('NameSuffix').value;
      this.physicianModel.Title = this.addPhysicianForm.get('Title').value;
      this.physicianModel.BirthDate = this.addPhysicianForm.get('BirthDate').value;
      this.physicianModel.Age = this.addPhysicianForm.get('PhysicianAge').value;
      this.physicianModel.Gender = this.addPhysicianForm.get('Gender').value;
      this.physicianModel.PersonalEmail = this.addPhysicianForm.get('PersonalEmail').value;
      this.physicianModel.Language = this.addPhysicianForm.get('Language').value;
      this.physicianModel.PreferredLanguage = this.addPhysicianForm.get('PreferredLanguage').value;
      this.physicianModel.MotherMaiden = this.addPhysicianForm.get('MothersMaidenName').value;
      this.physicianModel.WebSiteName = this.addPhysicianForm.get('WebsiteName').value;
      this.physicianModel.IsActive = this.addPhysicianForm.get('IsActive').value;
      this.physicianModel.RoleId = this.addPhysicianForm.get('Role').value;
      this.physicianModel.FacilityId = this.addPhysicianForm.get('facility').value.toString();
      this.physicianservice.addUpdatePhysician(this.physicianModel).then(res => {
        if (this.formData == null) {
          if (res) {
            this.util.showMessage('', ' Physician Add record saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
              if (res) {
                this.dialogRef.close("updated");
              }
            });
          } 
        } if (this.formData != null) {
         
          this.physicianservice.FileUpload(this.formData, res.ProviderID, "Provider").then((res) => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', ' Physician Add record saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.dialogRef.close("updated");
                }
              });
            }
          })
        }
        });

    }
  }
  //#endregion
  //#region "Close"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion

  //#region "File Upload"
  public imageUpload(file): void {
    this.convertToBase64(file);
    let files = file.target.files;

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

      this.ImageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(this.ImageBase64);
      this.ImageBase64 = [this.ImageBase64.changingThisBreaksApplicationSecurity];
      if (this.ImageBase64) {
        this.imageFlag = false;
        this.imagebutton = false;
      } else {
        this.imagebutton = true;
        this.imageFlag = true;
      }
    } else {
      this.util.showMessage("Error!!", "Not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
    }

  }
  //#endregion
  //#region "Remove"
  public RemoveFile(): void {
    this.ViewFileUpload = (null);
    this.FileUpload = (null);
    this.ImageBase64 = null;
    if (this.ImageBase64) {
      this.imageFlag = false;
      this.imagebutton = false;
    } else {
      this.imagebutton = true;
      this.imageFlag = true;
    }
  }
  //#endregion
  //#region "File Upload"
  convertToBase64(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.ImageBase64 = (<FileReader>event.target).result;
      }
    }
  }
   //#endregion

  //#region "Clear"
  clear() {
    this.addPhysicianForm.reset();
  }
  //#endregion
  //#region "Gender"
  getGenderforPhysician() {
    this.physicianservice.getGenderforPhysician().then(res => {
      this.gender = res;
    })
  }
  //#endregion
// // #region "Facility"
//  getFacility() {
//    this.physicianservice.getFacility().then(res => {
//      this.Facility = res;
//    })
//}
// //#endregion
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
  //#region "DOB"
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.addPhysicianForm.get('BirthDate').value).getFullYear();
    this.addPhysicianForm.get('PhysicianAge').setValue(this.bindAge);
  }
  //#endregion
  //#region "Age"
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.addPhysicianForm.get('PhysicianAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.addPhysicianForm.get('BirthDate').setValue(this.bindDOB);
  }
    //#endregion
    //#region "Setfacility"
  setFacility() {
    this.facilitytooltip = [];
    this.facilityvalue = this.addPhysicianForm.get('facility').value;
    for (const option of this.Facility) {
      for (const i of this.facilityvalue) {
        if (i == option.FacilityId) {
          this.facilitytooltip.push(option.FacilityName);
        }
      }
    }
  }
      //#endregion

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.addPhysicianForm.get('FirstName').value,
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
