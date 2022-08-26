import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { clsViewFile } from '../../models/clsViewFile';

@Component({
  selector: 'discharge-view',
  templateUrl: './discharge-view.component.html',
  styleUrls: ['./discharge-view.component.css']
})

export class DischargeViewComponent implements OnInit {
  dischargeSummaryForm: FormGroup;
  listOfImgFiles: Array<clsViewFile> = [];
  fileName: any[] = [];
  // showImg: boolean;
  // picture: any;
  // img: any;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DischargeViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer, public customHttp: CustomHttpService) { }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.dischargeSummaryForm = this.fb.group({
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
    this.dischargeSummaryForm.get('Start').disable();
    this.dischargeSummaryForm.get('Hold').disable();
    this.dischargeSummaryForm.get('Discontinue').disable();
    this.dischargeSummaryForm.get('Notes').disable();
    this.dischargeSummaryForm.get('Refill').disable();
  }

  Medication(): FormGroup {
    return this.fb.group({
      ItemDrugName: [''],
      Route: [null],
      Diagnosis: [''],
      Qty: [''],
      Days: [''],
      Morning: [false, ''],
      Brunch: [false, ''],
      Noon: [false, ''],
      Evening: [false, ''],
      Night: [false, ''],
      Before: [false, ''],
      After: [false, ''],
      MedicationStatus: [''],
      SIG: ['']
    });
  }

  eLabOrder(): FormGroup {
    return this.fb.group({
      SetupMasterID: [''],
      TestName: [''],
      Urgency: [''],
      Date: [''],
      Notes: ['']
    });
  }

  get medicationDynamic() {
    return <FormArray>this.dischargeSummaryForm.get('medication');
  }

  get eLabDynamic() {
    return <FormArray>this.dischargeSummaryForm.get('eLab');
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

  getDischargeRecord() {
      if (this.data != null && this.data != undefined) {
        this.dischargeSummaryForm.get('AdmissionNumber').setValue(this.data.AdmissionNumber);
        this.dischargeSummaryForm.get('RequestedDate').setValue(new Date(this.data.AdmissionDate).toLocaleDateString());
        this.dischargeSummaryForm.get('RecommendedProcedure').setValue(this.data.RecommendedProcedure);
        this.dischargeSummaryForm.get('AdmittingPhysician').setValue(this.data.AdmittingPhysician);
        this.dischargeSummaryForm.get('PreProcedureDiagnosis').setValue(this.data.PreProcedureDiagnosis);
        this.dischargeSummaryForm.get('PlannedProcedure').setValue(this.data.PlannedProcedure);
        this.dischargeSummaryForm.get('Urgency').setValue(this.data.Urgency);
        this.dischargeSummaryForm.get('AnesthesiaFitness').setValue(this.data.AnesthesiaFitnessNotes);
        this.dischargeSummaryForm.get('OtherConsults').setValue(this.data.OtherConsults);
        this.dischargeSummaryForm.get('PostoperativeDiagnosis').setValue(this.data.PostOperativeDiagnosis);
        this.dischargeSummaryForm.get('BloodLossInfo').setValue(this.data.BloodLossInfo);
        this.dischargeSummaryForm.get('Specimens').setValue(this.data.Specimens);
        this.dischargeSummaryForm.get('PainDiscomfortLevel').setValue(this.data.PainLevelNotes);
        this.dischargeSummaryForm.get('Complications').setValue(this.data.Complications);
        this.dischargeSummaryForm.get('Procedure').setValue(this.data.ProcedureNotes);
        this.dischargeSummaryForm.get('AdditionalInfo').setValue(this.data.AdditionalInfo);
        this.dischargeSummaryForm.get('FollowUpDate').setValue(this.data.FollowUpDate);
        this.dischargeSummaryForm.get('FollowUpDetails').setValue(this.data.FollowUpDetails);
        if (this.data.DischargeFile.length > 0 && this.data.DischargeFile != null) {
          this.setImageFiles(this.data.DischargeFile);
        }

        // this.picture = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.data.DischargeImage);
        // this.picture = [this.picture.changingThisBreaksApplicationSecurity];
        // this.img = this.data.DischargeImage;
        // if (this.img != null) {
        //   this.showImg = true;
        // }
        // else {
        //   this.showImg = false;
        // }

        if (this.data.medicationRequest != null && this.data.medicationRequest.medicationRequestItems.length > 0) {
          for (let i = 0; i < this.data.medicationRequest.medicationRequestItems.length; i++) {
            this.medicationDynamic.push(this.Medication());
            const control = <FormArray>this.dischargeSummaryForm.controls['medication'];
            control.controls[i].get('Morning').disable();
            control.controls[i].get('Brunch').disable();
            control.controls[i].get('Noon').disable();
            control.controls[i].get('Evening').disable();
            control.controls[i].get('Night').disable();
            control.controls[i].get('Before').disable();
            control.controls[i].get('After').disable();
            control.controls[i].get('MedicationStatus').disable();
            control.controls[i].get('ItemDrugName').setValue(this.data.medicationRequest.medicationRequestItems[i].DrugName);
            control.controls[i].get('Route').setValue(this.data.medicationRequest.medicationRequestItems[i].MedicationRouteDesc);
            control.controls[i].get('Diagnosis').setValue(this.data.medicationRequest.medicationRequestItems[i].ICDCode);
            control.controls[i].get('Qty').setValue(this.data.medicationRequest.medicationRequestItems[i].TotalQuantity);
            control.controls[i].get('Days').setValue(this.data.medicationRequest.medicationRequestItems[i].NoOfDays);
            control.controls[i].get('Morning').setValue(this.data.medicationRequest.medicationRequestItems[i].Morning);
            control.controls[i].get('Brunch').setValue(this.data.medicationRequest.medicationRequestItems[i].Brunch);
            control.controls[i].get('Noon').setValue(this.data.medicationRequest.medicationRequestItems[i].Noon);
            control.controls[i].get('Evening').setValue(this.data.medicationRequest.medicationRequestItems[i].Evening);
            control.controls[i].get('Night').setValue(this.data.medicationRequest.medicationRequestItems[i].Night);
            control.controls[i].get('Before').setValue(this.data.medicationRequest.medicationRequestItems[i].Before);
            control.controls[i].get('After').setValue(this.data.medicationRequest.medicationRequestItems[i].After);
            control.controls[i].get('SIG').setValue(this.data.medicationRequest.medicationRequestItems[i].SIG);
            if (this.data.medicationRequest.medicationRequestItems[i].Start == true) {
              control.controls[i].get('MedicationStatus').setValue("start");
            }
            if (this.data.medicationRequest.medicationRequestItems[i].Hold == true) {
              control.controls[i].get('MedicationStatus').setValue("hold");
            }
            if (this.data.medicationRequest.medicationRequestItems[i].Continued == true) {
              control.controls[i].get('MedicationStatus').setValue("continue");
            }
            if (this.data.medicationRequest.medicationRequestItems[i].DisContinue == true) {
              control.controls[i].get('MedicationStatus').setValue("discontinue");
            }
            this.medicationDynamic.removeAt(this.data.medicationRequest.medicationRequestItems.length);
          }
          this.dischargeSummaryForm.get('Start').setValue(this.data.medicationRequest.TakeRegularMedication);
          this.dischargeSummaryForm.get('Hold').setValue(this.data.medicationRequest.IsHoldRegularMedication);
          this.dischargeSummaryForm.get('HoldMedication').setValue(this.data.medicationRequest.HoldRegularMedicationNotes);
          this.dischargeSummaryForm.get('Discontinue').setValue(this.data.medicationRequest.IsDiscontinueDrug);
          this.dischargeSummaryForm.get('DiscontinueDrugs').setValue(this.data.medicationRequest.DiscontinueDrugNotes);
          this.dischargeSummaryForm.get('Notes').setValue(this.data.medicationRequest.IsPharmacist);
          this.dischargeSummaryForm.get('NotesPharmacist').setValue(this.data.medicationRequest.PharmacistNotes);
          this.dischargeSummaryForm.get('Refill').setValue(this.data.medicationRequest.IsRefill);
          this.dischargeSummaryForm.get('RefillNumber').setValue(this.data.medicationRequest.RefillCount);
          this.dischargeSummaryForm.get('Date').setValue(this.data.medicationRequest.RefillDate);
          this.dischargeSummaryForm.get('RefillNotes').setValue(this.data.medicationRequest.RefillNotes);
        }

        if (this.data.elabRequest != null && this.data.elabRequest.labRequestItems.length > 0) {
          for (let i = 0; i < this.data.elabRequest.labRequestItems.length; i++) {
            this.eLabDynamic.push(this.eLabOrder());
            const control = <FormArray>this.dischargeSummaryForm.controls['eLab'];
            control.controls[i].get('SetupMasterID').setValue(this.data.elabRequest.labRequestItems[i].SetupMasterID);
            control.controls[i].get('TestName').setValue(this.data.elabRequest.labRequestItems[i].setupMasterDesc);
            control.controls[i].get('Urgency').setValue(this.data.elabRequest.labRequestItems[i].urgencyDescription);
            control.controls[i].get('Date').setValue(this.data.elabRequest.labRequestItems[i].LabOnDate);
            control.controls[i].get('Notes').setValue(this.data.elabRequest.labRequestItems[i].LabNotes);
            this.eLabDynamic.removeAt(this.data.elabRequest.labRequestItems.length);
          }
        }
      }
  }
  
  dialogClose() {
    this.dialogRef.close();
  }

}








