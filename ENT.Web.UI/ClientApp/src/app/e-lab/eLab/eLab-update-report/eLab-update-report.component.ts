
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { clsViewFile } from 'src/app/patient/models/clsViewFile';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { eLabService } from '../../eLab.service';
import { elabOrderItemModel } from '../../models/elabOrderItemModel';
import { eLabOrderStatusModel } from '../../models/updateReportModel';

@Component({
  selector: 'app-eLabUpdateReportComponent',
  templateUrl: './eLab-update-report.component.html',
  styleUrls: ['./eLab-update-report.component.css']
})

export class eLabUpdateReportComponent implements OnInit {

  //#region Property Declaration
  IsSignOff: Boolean = false;
  OrderUpdateForm: FormGroup;
  eLabOrderStatusModel: eLabOrderStatusModel = new eLabOrderStatusModel();
  elabOrderItemModel: elabOrderItemModel = new elabOrderItemModel();
  getDate: Date;
  getTimeHH: number;
  getTimeMin: number;
  getDateAndTime: Date;
  PhysicianName: any;
  PhysicianNumber: any;
  itemModelArray: any = [];
  FileUpload: Array<File> = [];
  ViewFile: Array<clsViewFile> = [];

  FileUploadNames: any[] = [];
  @ViewChild('multiple', { static: true }) attachment: any;
  //#endregion Property Declaration

  //#region constructor
  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<eLabUpdateReportComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public eLabService: eLabService, private util: UtilService, private sanitizer: DomSanitizer) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.OrderUpdateForm = this.fb.group({
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: [""],
      ApprovedBy: ["", Validators.required],
      ReportStatus: ["", Validators.required],
      ReportTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      ReportDate: [new Date(), Validators.required],
      SampleCollectedDate: [new Date(), Validators.required],
      CommonNotes: [''],
      eLab: this.fb.array([this.eLabOrder()])
    });

    this.GetProviderName();

    if (this.data != null) {
      this.ViewSetValues();
    }

    if (this.data.labOrderStatusReport != null) {
      if (this.data.labOrderStatusReport.SignOffStatus == true) {
        this.OrderUpdateForm.disable();
        this.IsSignOff = true;
      }
    }

  }
  //#endregion ngOnInit

  //#region eLabOrder dynamic controls
  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: [''],
      SubName: [""],
      Urgency: [""],
      OnDate: [""],
      Value: [""],
      Range: [""],
      Notes: [""],
    })
  }
  get eLabOrderDynamic() {
    return <FormArray>this.OrderUpdateForm.get('eLab');
  }

  eLabDynamic() {
    return <FormArray>this.OrderUpdateForm.get('eLab');
  }
  //#endregion eLabOrder dynamic controls

  //#region View Set Values
  ViewSetValues(): void {
    for (let i = 0; i < this.data.labOrderItems.length; i++) {
      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>(this.OrderUpdateForm.controls['eLab']);
      form.controls[i].get('TestName').setValue(this.data.labOrderItems[i].masterTestName);
      form.controls[i].get('SubName').setValue(this.data.labOrderItems[i].subMasterTestName);
      form.controls[i].get('Urgency').setValue(this.data.labOrderItems[i].urgencyDescription);
      form.controls[i].get('OnDate').setValue(new Date(this.data.labOrderItems[i].LabOnDate).toLocaleDateString());
      form.controls[i].get('Notes').setValue(this.data.labOrderItems[i].LabNotes);
      form.controls[i].get('Range').setValue(this.data.labOrderItems[i].NormalRange);

      if (this.data.labOrderItems[i].Value != null) {
        form.controls[i].get('Value').setValue(this.data.labOrderItems[i].Value);
      }

      this.eLabOrderDynamic.removeAt(this.data.labOrderItems.length);
    }

    if (this.data.labOrderStatusReport != null) {
      let data = this.data.labOrderStatusReport;
      this.OrderUpdateForm.get('SampleCollectedDate').setValue(new Date(data.SampleCollectedDate));
      this.OrderUpdateForm.get('ReportDate').setValue(new Date(data.ReportDate));
      this.OrderUpdateForm.get('ReportTime').setValue(new Date(data.ReportDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      this.OrderUpdateForm.get('ReportStatus').setValue(data.ReportStatus);
      this.OrderUpdateForm.get('ApprovedBy').setValue(data.ApprovedbyPhysician);
      this.OrderUpdateForm.get('CommonNotes').setValue(data.Notes);
      this.PhysicianNumber = data.ApprovedBy;

      if (data.filePath.length > 0) { this.setFileData(data.filePath) }
    }
  }
  //#endregion View Set Values

  //#region Get Values
  GetProviderName(): void {
    this.OrderUpdateForm.get('ApprovedBy').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.eLabService.GetProviderName(key).then((res) => {
            this.PhysicianName = res;
          })
        } else {
          this.PhysicianName = null;
          this.PhysicianNumber = 0;
        }
      }
      else {
        this.PhysicianName = null;
        this.PhysicianNumber = 0;
      }
    })
  }
  //#endregion Get Values

  //#region Set Physician Number 
  setPhysicianNameNumber(number: number): void {
    if (number > 0) {
      this.PhysicianNumber = number;
    } else {
      this.PhysicianNumber = 0;
    }
  }
  //#endregion Set Physician Number 

  //#region merge date and time
  sendDateWithTime(date: any, Time: any): Date {
    this.getDate = new Date(date);

    if (date != "") {
      if (Time.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(Time.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(Time.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (Time.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(Time.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(Time.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(Time.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
    return this.getDateAndTime;
  }
  //#endregion merge date and time

  //#region Save Function 
  SaveFunction(): void {
    if (this.OrderUpdateForm.valid && this.PhysicianNumber > 0) {
      const form = <FormArray>(this.OrderUpdateForm.controls['eLab']);
      for (let i = 0; i < form.length; i++) {
        let data = this.data.labOrderItems[i];
        this.elabOrderItemModel = new elabOrderItemModel();
        this.elabOrderItemModel.Value = form.controls[i].get('Value').value;
        this.elabOrderItemModel.LabOrderID = this.data.LabOrderID;
        this.elabOrderItemModel.LabNotes = data.LabNotes;
        this.elabOrderItemModel.LabOnDate = data.LabOnDate;
        this.elabOrderItemModel.UrgencyCode = data.UrgencyCode;
        this.elabOrderItemModel.SetupMasterID = data.SetupMasterID;
        this.elabOrderItemModel.LabOrderItemsID = data.LabOrderItemsID;
        this.itemModelArray.push(this.elabOrderItemModel);
      }

      this.eLabOrderStatusModel.SampleCollectedDate = this.OrderUpdateForm.get('SampleCollectedDate').value;
      this.eLabOrderStatusModel.ReportDate = this.sendDateWithTime(this.OrderUpdateForm.get('ReportDate').value, this.OrderUpdateForm.get('ReportTime').value);
      this.eLabOrderStatusModel.ReportStatus = this.OrderUpdateForm.get('ReportStatus').value;
      this.eLabOrderStatusModel.Notes = this.OrderUpdateForm.get('CommonNotes').value;
      this.eLabOrderStatusModel.ApprovedBy = this.PhysicianNumber;
      this.eLabOrderStatusModel.eLabOrderId = this.data.LabOrderID;
      this.eLabOrderStatusModel.itemsModel = this.itemModelArray;
      this.itemModelArray = [];

      if (this.eLabOrderStatusModel != null) {
        this.eLabService.SaveUpdateReport(this.eLabOrderStatusModel).then((data) => {
          if (data != null && data != undefined) {
            const formData = new FormData();
            this.FileUpload.forEach(file => {
              formData.append('file', file, file.name);
            });
            this.eLabService.FileUploadMultiple(formData, data.eLabOrderId, "ELab/Report").then((res) => {
              this.util.showMessage('', 'Elab Report saved Successfully ', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                if (res === true) {
                  this.dialogRef.close("Updated");
                }
              }
              );
            });
          } else {
            this.util.showMessage('', 'Elab Report Not saved ', BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
          }

        });
      }
    }
  }
  //#endregion Save Function 

  //#region Sign off Function 
  SignOff(): void {
    if (this.data.labOrderStatusReport != null) {
      if (this.OrderUpdateForm.get('UserName').value != "" && this.OrderUpdateForm.get('Password').value && this.data.labOrderStatusReport.eLabOrderStatusId != null) {
        this.eLabService.SignOffUpdateReport(this.OrderUpdateForm.get('UserName').value, this.OrderUpdateForm.get('Password').value, this.data.labOrderStatusReport.eLabOrderStatusId).then((res) => {

          this.util.showMessage('SignOff!!', res[0], BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((data) => {
            if (res[0] == "Signed Off Successfully.") {
              this.OrderUpdateForm.disable();
              this.IsSignOff = true;
            }
          }
          );
        });

      } else {
        this.util.showMessage('Error!!', 'UserName Or Password Invalid', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
      }
    }
    else {
      this.util.showMessage('Error!!', 'No Record Found', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
    }
  }
  //#endregion Sign off Function 


  //#region Other Function 
  resetForm(): void {
    this.OrderUpdateForm.reset();
    this.OrderUpdateForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
    this.OrderUpdateForm.get('ReportTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.OrderUpdateForm.get('SampleCollectedDate').setValue(new Date());
    this.OrderUpdateForm.get('ReportDate').setValue(new Date());
    this.ViewSetValues();
    this.FileUpload = [];
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion Other Function 

  //#region File Upload problemList
  public FileUploadMethod(file: any): void {
    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUpload.push(Temporaryfiles);
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Temporaryfiles.name;
        let lowerCaseFilename = (viewFile.FileName).toLowerCase();
        viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
        let fileUrl = URL.createObjectURL(Temporaryfiles);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        let ConfrimFile = (this.FileUploadNames.length > 0) ? this.FileUploadNames.includes(lowerCaseFilename) : false;
        if (ConfrimFile) {
          this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
          });
        } else {
          this.ViewFile.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename);
        }
      }
      this.attachment.nativeElement.value = '';
    }
  }

  RemoveFile(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];

        this.ViewFile.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];

            let deletePath = (property.FileUrl.split(a)[0]);
            this.eLabService.deleteFile(deletePath, fileName).then(res => { })
          }
        });

        for (const tempFile of this.ViewFile) {
          if (tempFile.FileName != fileName) {
            temporaryFile.push(tempFile);
          }
        }
        this.ViewFile = [];
        this.ViewFile = temporaryFile;

        for (const tempFile of this.FileUpload) {
          if (tempFile.name != fileName) {
            temporaryFileupload.push(tempFile);
          }
        }
        this.FileUpload = [];
        this.FileUpload = temporaryFileupload;
      }
    });
  }
  setFileData(Filedata) {
    this.ViewFile = [];
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      let lowerCaseFilename = (viewFile.FileName).toLowerCase();
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let alpha = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(alpha);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;
      this.FileUploadNames.push(lowerCaseFilename); //file name storing...
      this.ViewFile.push(viewFile);
    }
  }

  //#endregion File Upload

}
