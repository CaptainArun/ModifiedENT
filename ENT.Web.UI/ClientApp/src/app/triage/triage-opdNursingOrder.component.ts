import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { OPDNursingOrderModel } from './models/opdNursingOrderModel';
import { OPDNursingMedicationModel } from './models/opdNursingMedicationModel';
import { TriageService } from './triage.service';
import { CustomHttpService } from '../core/custom-http.service';

@Component({
  selector: 'triage-opdNursingOrderComponent',
  templateUrl: 'triage-opdNursingOrder.component.html'
})

export class TriageOPDNursingOrderComponent implements OnInit {

  OPDNursingOrdersForm: FormGroup;
  isMedication = false;
  isMinorProcedure = false;
  isNursingCare = false;

  opdNursingOrderModel: OPDNursingOrderModel = new OPDNursingOrderModel();
  opdNursingMedicationModel: OPDNursingMedicationModel = new OPDNursingMedicationModel();

  constructor(public dialogRef: MatDialogRef<TriageOPDNursingOrderComponent>, private fb: FormBuilder, private customHttpSvc: CustomHttpService, private triageSvc: TriageService) { }

  dynamicMedicationControls(): FormGroup {
    return this.fb.group({
      Drugname: [''],
      DispenseformId: [''],
      SelectedDiagnosis: [''],
      Quantity: [''],
      MedicationTime: [''],
      MedicationTimePeriod: [''],
      DoneBy: [''],
      SIGNotes: ['']
    });
  }
   medicationcontrols() {
    return <FormArray>this.OPDNursingOrdersForm.get('opdnursingMedications');
  }
  get medicationControls() {
    return <FormArray>this.OPDNursingOrdersForm.get('opdnursingMedications');
  }

  MinorProcedure(): FormGroup {
    return this.fb.group({
      Proceduretype: [''],
      ProcedureNotes: [''],
    })
  }
   minorprocedureControl() {
    return <FormArray>this.OPDNursingOrdersForm.get('OpdMinorProcedure');
  }

  get minorprocedureControls() {
    return <FormArray>this.OPDNursingOrdersForm.get('OpdMinorProcedure');
  }

  NursingCare(): FormGroup {
    return this.fb.group({

      Instructiontype: [''],
      NursingNotes: [''],
    })
  }
  Nursingcontrols() {
    return <FormArray>this.OPDNursingOrdersForm.get('OpdNursingcare');
  }

  get NursingControls() {
    return <FormArray>this.OPDNursingOrdersForm.get('OpdNursingcare');
  }

  ngOnInit() {
    this.OPDNursingOrdersForm = this.fb.group({
      opdnursingMedications: this.fb.array([
        this.dynamicMedicationControls()
      ]),
      OpdMinorProcedure: this.fb.array([
        this.MinorProcedure()
      ]),
      OpdNursingcare: this.fb.array([
        this.NursingCare()
      ])
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.medicationChange();
    this.getOpdNursingData();
  }

  getOpdNursingData() {
    this.triageSvc.getOPDNursingDataForVisit(1).then(data => data);
  }

  medicationChange() {
    this.isMedication = true;
    this.isMinorProcedure = false;
    this.isNursingCare = false;
    document.getElementById("medication").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("medication").style.color = "#fff";
    document.getElementById("minorprocedure").style.background = "#fff";
    document.getElementById("minorprocedure").style.color = "#717c8c";
    document.getElementById("nursingcare").style.background = "#fff";
    document.getElementById("nursingcare").style.color = "#717c8c";
  }
  minorProcedureChange() {
    this.isMinorProcedure = true;
    this.isMedication = false;
    this.isNursingCare = false;
    document.getElementById("minorprocedure").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("minorprocedure").style.color = "#fff";
    document.getElementById("medication").style.background = "#fff";
    document.getElementById("medication").style.color = "#717c8c";
    document.getElementById("nursingcare").style.background = "#fff";
    document.getElementById("nursingcare").style.color = "#717c8c";
  }
  nursingCareChange() {
    this.isNursingCare = true;
    this.isMedication = false;
    this.isMinorProcedure = false;
    document.getElementById("nursingcare").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("nursingcare").style.color = "#fff";
    document.getElementById("minorprocedure").style.background = "#fff";
    document.getElementById("minorprocedure").style.color = "#717c8c";
    document.getElementById("medication").style.background = "#fff";
    document.getElementById("medication").style.color = "#717c8c";
  }

  //medicationChange(event: any) {
  //  if (event.checked) {
  //    this.isMedication = true;
  //  } else {
  //    this.isMedication = false;
  //  }
  //}

  addMedicationRow() {
    if (this.isMedication == true) {
      this.medicationControls.push(this.dynamicMedicationControls());
    }
  }
  addProcedureRow() {
    this.minorprocedureControls.push(this.MinorProcedure());
  }

  addNursingRow() {
    this.NursingControls.push(this.NursingCare());
  }
  onRemoveRowLabOrder(rowIndex: number) {
    this.medicationControls.removeAt(rowIndex);

  }
  onRemoveaddprocedure(rowIndex: number) {
    this.minorprocedureControls.removeAt(rowIndex);
  }
  onRemoveNursingorder(rowIndex: number) {
    this.NursingControls.removeAt(rowIndex);
  }
  //minorProcedureChange(event: any) {
  //  if (event.checked) {
  //    this.isMinorProcedure = true;
  //  } else {
  //    this.isMinorProcedure = false;
  //  }
  //}
  //nursingCareChange(event: any) {
  //  if (event.checked) {
  //    this.isNursingCare = true;
  //  } else {
  //    this.isNursingCare = false;
  //  }
  //}

  closeDialog() {
    this.dialogRef.close();
  }
  dialogClose() {
    this.dialogRef.close();
  }
  addUpdateOPDNursingOrder() {

    this.opdNursingOrderModel.OPDNOId = 0;
    this.opdNursingOrderModel.VisitID = 1;
    this.opdNursingOrderModel.CaseSheetID = 1;
    this.opdNursingOrderModel.ChiefComplaint = "";
    this.opdNursingOrderModel.ICD10 = 1;
    this.opdNursingOrderModel.Proceduretype = this.OPDNursingOrdersForm.get('Proceduretype').value;
    this.opdNursingOrderModel.ProcedureNotes = this.OPDNursingOrdersForm.get('ProcedureNotes').value;
    this.opdNursingOrderModel.Instructiontype = this.OPDNursingOrdersForm.get('Instructiontype').value;
    this.opdNursingOrderModel.NursingNotes = this.OPDNursingOrdersForm.get('NursingNotes').value;

    const medication = <FormArray>this.OPDNursingOrdersForm.controls['opdnursingMedications'];

    this.opdNursingMedicationModel = new OPDNursingMedicationModel();
    this.opdNursingOrderModel.opdnursingMedications = [];
    for (let i = 0; i < medication.length; i++) {
      this.opdNursingMedicationModel.NursingMedicationID = 0;
      this.opdNursingMedicationModel.OPDNOId = 1;
      this.opdNursingMedicationModel.Drugname = medication.controls[i].get('Drugname').value;
      this.opdNursingMedicationModel.DispenseformId = medication.controls[i].get('DispenseformId').value;
      this.opdNursingMedicationModel.SelectedDiagnosis = medication.controls[i].get('SelectedDiagnosis').value;
      this.opdNursingMedicationModel.Quantity = medication.controls[i].get('Quantity').value;
      this.opdNursingMedicationModel.MedicationTime = medication.controls[i].get('MedicationTime').value;
      this.opdNursingMedicationModel.DoneBy = medication.controls[i].get('DoneBy').value;
      this.opdNursingMedicationModel.SIGNotes = medication.controls[i].get('SIGNotes').value;

      if (medication.controls[i].get('MedicationTimePeriod').value == "Before") {
        this.opdNursingMedicationModel.Before = true;
        this.opdNursingMedicationModel.After = false;
      } else {
        this.opdNursingMedicationModel.After = true;
        this.opdNursingMedicationModel.Before = false;
      }
      this.opdNursingOrderModel.opdnursingMedications.push(this.opdNursingMedicationModel);
    }

    this.triageSvc.addUpdateOPDNursingOrders(this.opdNursingOrderModel).then(data => {
      this.OPDNursingOrdersForm.reset();
    });


  }
}
