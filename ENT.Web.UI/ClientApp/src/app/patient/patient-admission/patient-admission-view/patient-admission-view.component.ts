import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-admission-view-record',
  templateUrl: './patient-admission-view.component.html',
  styleUrls: ['./patient-admission-view.component.css']
})
export class PatientAdmissionViewRecordComponent implements OnInit {
 //#region "property declaration"
  PatientListForm: FormGroup;
  getTime: string;
  fitness: any;
  blood: any;
//#endregion
 //#region "Constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<PatientAdmissionViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
//#endregion

//#region "ngOnInit"
  ngOnInit() {
    this.getTime = new Date(this.data.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
      //this.setMedicationView();
    this.ansthesiafitness();
    this.bloodrequired();
  }
//#endregion
  //#region "Close"

  dialogClose(): void {
    this.dialogRef.close();
  }
    //#endregion
  //#region "set ansthesiafitness"

  ansthesiafitness() {
    if (this.data.AnesthesiaFitnessRequired == true) {
      this.fitness = "yes"
    } else if (this.data.AnesthesiaFitnessRequired == false){
      this.fitness = "No"
    }
  }
      //#endregion
    //#region "set bloodrequired"

  bloodrequired() {
  if (this.data.BloodRequired == true) {
    this.blood = "yes"
  }
  else if (this.data.BloodRequired == false) {
    this.blood = "No"
  }
  }
        //#endregion

}
