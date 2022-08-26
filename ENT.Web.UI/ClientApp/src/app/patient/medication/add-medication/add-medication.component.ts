import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef } from '@angular/material';
import { TriageService } from '../../../triage/triage.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TriageMedicationRequestsModel } from 'src/app/triage/models/triageMedicationRequestsModel';

@Component({
  selector: 'app-add-medication',
  templateUrl: './add-medication.component.html',
  styleUrls: ['./add-medication.component.css']
})
export class AddMedicationComponent implements OnInit {

  ePrescriptionForm: FormGroup;
  medicationRequestModel: TriageMedicationRequestsModel = new TriageMedicationRequestsModel();
  ePrescriptionData: any;
  hold: boolean = false;
  discontinue: boolean = false;
  notes: boolean = false;
  refill: boolean = false;
  drugName: any;
  routeName: any;
  diagnosisName: any;
  itemDiagnosisId: number;
  setValue: any;
  ePrescriptionDetails: any;
  route: any;
  itemDrugId: any;
  isMedRequestconfirmed: boolean = false;
  visitDateTime: any[] = [];
  visitId: any;
  patientId: any;
  recordedBy: any;
  facilityId: number;
  recordedDuring: any = "";

  constructor(public newPatientService: NewPatientService,
    public fb: FormBuilder,
    public triageSvc: TriageService,
    public custHttp: CustomHttpService,
    public dialogRef: MatDialogRef<AddMedicationComponent>,
    private util: UtilService) { }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));


    this.ePrescriptionForm = this.fb.group({
      VisitDate: ["", Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      RecordedBy: ["", Validators.required],
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
      rows: this.fb.array([this.ePrescription()])
    });

    this.bindVisitDateAndTime();
    this.bindRoute();
    this.bindProviderName();
    // if(this.data.record){
    //   this.setValue = this.data.record;
    //   this.setePrescriptionData();
    // }
    // this.triageSvc.getVisitRecordById(this.data.visitId).then(data => {
    //   this.ePrescriptionDetails = data;
    // });
  }

  //Record During
  RecordedDuring(data: any) {
    this.newPatientService
      .GetVisitsForPatient(this.newPatientService.patientId)
      .then((res) => {
        for (let x = 0; x < res.length; x++) {
          if (x == data) {
            this.recordedDuring = res[x].recordedDuring;
          }
        }
      });
  }

  bindProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then((res) => {
      this.recordedBy = res;
    });
  }

  bindVisitDateAndTime() {
    this.newPatientService
      .GetVisitsForPatient(this.newPatientService.patientId)
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          this.visitDateTime[i] = res[i].VisitDateandTime;
          this.visitId = res[i].VisitId;
        }
      });
  }
  ePrescription(): FormGroup {
    return this.fb.group({
      ItemDrugName: ['', Validators.required],
      Route: [null, Validators.required],
      routeTooltip: [''],
      Diagnosis: ['', Validators.required],
      Qty: ['', Validators.required],
      Days: ['', Validators.required],
      Morning: [false, ''],
      Brunch: [false, ''],
      Noon: [false, ''],
      Evening: [false, ''],
      Night: [false, ''],
      Before: [false, ''],
      After: [false, ''],
      MedicationStatus: ['', Validators.required],
      SIG: ['']
    });
  }

  get ePrescriptionDynamic() {
    return <FormArray>this.ePrescriptionForm.get('rows');
  }

  getDrugList(index) {
    const control = <FormArray>this.ePrescriptionForm.controls['rows'];
    let key = control.controls[index].get('ItemDrugName').value;
    if (key != null && key.length > 2) {
      this.triageSvc.getDrugCode(key).then(data => {
        this.drugName = data;
      });
    }
    else {
      this.drugName = null;
    }
  }

  DrugId(DrugCodeID) {
    this.itemDrugId = DrugCodeID;
  }

  bindRoute() {
    this.triageSvc.getRoute().then(data => {
      this.routeName = data;
    });
  }

  setRouteTooltip(index) {
    const arr = <FormArray>this.ePrescriptionForm.controls['rows'];
    this.route = arr.controls[index].get('Route').value;
    for (const option of this.routeName) {
      if (this.route == option.RouteCode) {
        arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
      }
    }
  }

  getDiagnosisList(index) {
    const control = <FormArray>this.ePrescriptionForm.controls['rows'];
    let key = control.controls[index].get('Diagnosis').value;
    if (key != null && key.length > 2) {
      this.triageSvc.getDiagnosisCode(key).then(data => {
        this.diagnosisName = data;
      });
    }
    else {
      this.diagnosisName = null;
    }
  }

  DiagnosisId(DiagnosisCodeID) {
    this.itemDiagnosisId = DiagnosisCodeID;
  }

  isHold(event) {
    this.hold = event.checked;
    if (this.hold == false) {
      this.resetHold();
    }
  }

  resetHold() {
    this.ePrescriptionForm.get('HoldMedication').reset();
  }

  isDiscontinue(event) {
    this.discontinue = event.checked;
    if (this.discontinue == false) {
      this.resetDiscontinue();
    }
  }

  resetDiscontinue() {
    this.ePrescriptionForm.get('DiscontinueDrugs').reset();
  }

  isNotes(event) {
    this.notes = event.checked;
    if (this.notes == false) {
      this.resetNotes();
    }
  }

  resetNotes() {
    this.ePrescriptionForm.get('NotesPharmacist').reset();
  }

  isRefill(event) {
    this.refill = event.checked;
    if (this.refill == false) {
      this.resetRefill();
    }
  }

  resetRefill() {
    this.ePrescriptionForm.get('RefillNumber').reset();
    this.ePrescriptionForm.get('Date').reset();
    this.ePrescriptionForm.get('RefillNotes').reset();
  }

  onAddRow() {
    this.ePrescriptionDynamic.push(this.ePrescription());
    this.drugName = null;
    this.diagnosisName = null;
  }

  onRemoveRow(rowIndex: number) {
    this.ePrescriptionDynamic.removeAt(rowIndex);
  }

  // setePrescriptionData() {
  //   this.ePrescriptionData = this.setValue;
  //   if (this.setValue != undefined && this.setValue != null) {
  //     for (let i = 0; i < this.setValue.medicationRequestItems.length; i++) {
  //       this.ePrescriptionDynamic.push(this.ePrescription());
  //       const control = <FormArray>this.ePrescriptionForm.controls['rows'];
  //       control.controls[i].get('ItemDrugName').setValue(this.setValue.medicationRequestItems[i].DrugName);
  //       control.controls[i].get('Route').setValue(this.setValue.medicationRequestItems[i].MedicationRouteCode); 
  //       for (const option of this.data.route) {
  //         if (control.controls[i].get('Route').value == option.RouteCode) {
  //           control.controls[i].get('routeTooltip').setValue(option.RouteDescription);
  //         }
  //       }
  //       control.controls[i].get('Diagnosis').setValue(this.setValue.medicationRequestItems[i].ICDCode);
  //       control.controls[i].get('Qty').setValue(this.setValue.medicationRequestItems[i].TotalQuantity);
  //       control.controls[i].get('Days').setValue(this.setValue.medicationRequestItems[i].NoOfDays);
  //       control.controls[i].get('Morning').setValue(this.setValue.medicationRequestItems[i].Morning);
  //       control.controls[i].get('Brunch').setValue(this.setValue.medicationRequestItems[i].Brunch);
  //       control.controls[i].get('Noon').setValue(this.setValue.medicationRequestItems[i].Noon);
  //       control.controls[i].get('Evening').setValue(this.setValue.medicationRequestItems[i].Evening);
  //       control.controls[i].get('Night').setValue(this.setValue.medicationRequestItems[i].Night);
  //       control.controls[i].get('Before').setValue(this.setValue.medicationRequestItems[i].Before);
  //       control.controls[i].get('After').setValue(this.setValue.medicationRequestItems[i].After);
  //       control.controls[i].get('SIG').setValue(this.setValue.medicationRequestItems[i].SIG);
  //       if (this.setValue.medicationRequestItems[i].Start == true) {
  //         control.controls[i].get('MedicationStatus').setValue("start");
  //       }
  //       if (this.setValue.medicationRequestItems[i].Hold == true) {
  //         control.controls[i].get('MedicationStatus').setValue("hold");
  //       }
  //       if (this.setValue.medicationRequestItems[i].Continued == true) {
  //         control.controls[i].get('MedicationStatus').setValue("continue");
  //       }
  //       if (this.setValue.medicationRequestItems[i].DisContinue == true) {
  //         control.controls[i].get('MedicationStatus').setValue("discontinue");
  //       }
  //       this.ePrescriptionDynamic.removeAt(this.setValue.medicationRequestItems.length);
  //     }
  //     this.ePrescriptionForm.get('Start').setValue(this.setValue.TakeRegularMedication);
  //     this.ePrescriptionForm.get('Hold').setValue(this.setValue.IsHoldRegularMedication);
  //     if (this.setValue.IsHoldRegularMedication != false) {
  //       this.hold = true;
  //     }
  //     this.ePrescriptionForm.get('HoldMedication').setValue(this.setValue.HoldRegularMedicationNotes);
  //     this.ePrescriptionForm.get('Discontinue').setValue(this.setValue.IsDiscontinueDrug);
  //     if (this.setValue.IsDiscontinueDrug != false) {
  //       this.discontinue = true;
  //     }
  //     this.ePrescriptionForm.get('DiscontinueDrugs').setValue(this.setValue.DiscontinueDrugNotes);
  //     this.ePrescriptionForm.get('Notes').setValue(this.setValue.IsPharmacist);
  //     if (this.setValue.IsPharmacist != false) {
  //       this.notes = true;
  //     }
  //     this.ePrescriptionForm.get('NotesPharmacist').setValue(this.setValue.PharmacistNotes);
  //     this.ePrescriptionForm.get('Refill').setValue(this.setValue.IsRefill);
  //     if (this.setValue.IsRefill != false) {
  //       this.refill = true;
  //     }
  //     this.ePrescriptionForm.get('RefillNumber').setValue(this.setValue.RefillCount);
  //     this.ePrescriptionForm.get('Date').setValue(this.setValue.RefillDate);
  //     this.ePrescriptionForm.get('RefillNotes').setValue(this.setValue.RefillNotes);

  //     if (this.setValue.MedicationRequestStatus == 'Confirmed' || this.setValue.MedicationRequestStatus == 'Cancelled') {
  //       this.isMedRequestconfirmed = true;
  //       this.ePrescriptionForm.get('rows').disable();
  //       this.ePrescriptionForm.get('Start').disable();
  //       this.ePrescriptionForm.get('Hold').disable();
  //       this.ePrescriptionForm.get('HoldMedication').disable();
  //       this.ePrescriptionForm.get('Discontinue').disable();
  //       this.ePrescriptionForm.get('DiscontinueDrugs').disable();
  //       this.ePrescriptionForm.get('Notes').disable();
  //       this.ePrescriptionForm.get('NotesPharmacist').disable();
  //       this.ePrescriptionForm.get('Refill').disable();
  //       this.ePrescriptionForm.get('RefillNumber').disable();
  //       this.ePrescriptionForm.get('Date').disable();
  //       this.ePrescriptionForm.get('RefillNotes').disable();
  //     }
  //     else {
  //       this.isMedRequestconfirmed = false;
  //     }

  //   }
  // }

  submitData() {
    if (this.ePrescriptionForm.valid && this.ePrescriptionForm.controls['rows'].valid) {
      this.medicationRequestModel.medicationRequestItems = [];
      const control = <FormArray>this.ePrescriptionForm.controls['rows'];
      for (let row of control.controls) {
        this.medicationRequestModel.medicationRequestItems.push({
          MedicationRequestItemId: 0,
          MedicationRequestId: 0,
          DrugName: row.get('ItemDrugName').value,
          MedicationRouteCode: row.get('Route').value,
          ICDCode: row.get('Diagnosis').value,
          TotalQuantity: row.get('Qty').value,
          NoOfDays: row.get('Days').value,
          Morning: row.get('Morning').value,
          Brunch: row.get('Brunch').value,
          Noon: row.get('Noon').value,
          Evening: row.get('Evening').value,
          Night: row.get('Night').value,
          Before: row.get('Before').value,
          After: row.get('After').value,
          Start: row.get('MedicationStatus').value == "start" ? true : false,
          Hold: row.get('MedicationStatus').value == "hold" ? true : false,
          Continued: row.get('MedicationStatus').value == "continue" ? true : false,
          DisContinue: row.get('MedicationStatus').value == "discontinue" ? true : false,
          SIG: row.get('SIG').value
        });
      }
      this.medicationRequestModel.MedicationRequestId = 0;
      this.medicationRequestModel.VisitID = this.visitId;
      this.medicationRequestModel.AdmissionID = 0;
      this.medicationRequestModel.TakeRegularMedication = this.ePrescriptionForm.get('Start').value;
      this.medicationRequestModel.IsHoldRegularMedication = this.ePrescriptionForm.get('Hold').value;
      this.medicationRequestModel.HoldRegularMedicationNotes = this.ePrescriptionForm.get('HoldMedication').value;
      this.medicationRequestModel.IsDiscontinueDrug = this.ePrescriptionForm.get('Discontinue').value;
      this.medicationRequestModel.DiscontinueDrugNotes = this.ePrescriptionForm.get('DiscontinueDrugs').value;
      this.medicationRequestModel.IsPharmacist = this.ePrescriptionForm.get('Notes').value;
      this.medicationRequestModel.PharmacistNotes = this.ePrescriptionForm.get('NotesPharmacist').value;
      this.medicationRequestModel.IsRefill = this.ePrescriptionForm.get('Refill').value;
      this.medicationRequestModel.RefillCount = this.ePrescriptionForm.get('RefillNumber').value;
      this.medicationRequestModel.RefillDate = this.ePrescriptionForm.get('Date').value;
      this.medicationRequestModel.RefillNotes = this.ePrescriptionForm.get('RefillNotes').value;

      this.triageSvc.addUpdateMedicationRequestforVisit(this.medicationRequestModel).then(res => {
        this.util.showMessage('', 'e-Prescription data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => { }
        )
        this.dialogRef.close("update");
      });
    }
  }

  resetForm() {
    this.ePrescriptionForm.reset();
    this.ePrescriptionDynamic.clear();
    this.onAddRow();
    this.hold = false;
    this.discontinue = false;
    this.notes = false;
    this.refill = false;
    //  this.setePrescriptionData();
  }

  dialogClose() {
    this.dialogRef.close();
  }


}

