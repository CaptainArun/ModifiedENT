import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPatientService } from '../../../patient/newPatient.service';

@Component({
  selector: 'app-new-admission-view-record',
  templateUrl: './new-admission-view-record.component.html',
  styleUrls: ['./new-admission-view-record.component.css']
})
export class NewAdmissionViewRecordComponent implements OnInit {

  getTime: string;
  getDate: Date;
  fitness: any;
  blood: any;
  constructor(public newPatientService: NewPatientService, public MatDialogRef: MatDialogRef<NewAdmissionViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.getTime = new Date(this.data.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
    this.getDate = new Date(this.data.AdmissionDate);
    this.ansthesiafitness();
    this.bloodrequired();
  }
  //close
  dialogClose(): void {
    this.MatDialogRef.close();
  }
  //#region " set ansthesiafitness"
  ansthesiafitness() {
    if (this.data.AnesthesiaFitnessRequired == true) {
      this.fitness = "yes"
    } else if (this.data.AnesthesiaFitnessRequired == false) {
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
