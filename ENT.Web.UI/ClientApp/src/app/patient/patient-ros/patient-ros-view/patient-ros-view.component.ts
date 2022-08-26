import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PatientROSModel } from "../../../triage/models/patientROSModel";
import { CustomHttpService } from "../../../core/custom-http.service";
import { NewPatientService } from "../../newPatient.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TriageService } from "../../../triage/triage.service";

@Component({
  selector: "app-patient-ros-view",
  templateUrl: "./patient-ros-view.component.html",
  styleUrls: ["./patient-ros-view.component.css"],
})
export class PatientROSViewComponent implements OnInit {
  patientROSform: FormGroup;
  patientROSmodel: PatientROSModel = new PatientROSModel();
  patientId: number = 1;
  visitId: number;
  patientById = [];
  patientvisitHistoryList: any;
  visitIntake: any;
  recordedDuring: any = "";
  visitID: number;
  visitDandt: any[] = [];
  facilityId: number = 0;
  recordby: any[] = [];
  cpt: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  recordeddate: any;
  disable: boolean = true;
  constructor(
    public customHttpSvc: CustomHttpService,
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public dialogRef: MatDialogRef<PatientROSViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any,
    public triageSvc: TriageService
  ) {
  }

  ngOnInit() {
    this.patientROSform = this.fb.group({
      PatientID: [""],
      VisitID: [""],
      ROSID: [""],
      VisitDate: [""],
      RecordedDate: [""],
      RecordedTime: [""],
      recordedDuring: [""],
      RecordedBy: [""],
      visitDateandTime: [""],

      //ROSGeneral
      Weightlossorgain: [""],
      Feverorchills: [""],
      Troublesleeping: [""],
      Fatigue: [""],
      GeneralWeakness: [""],
      GeneralOthers: [""],
      GeneralothersComments: [""],

      //ROS Skin
      Rashes: [""],
      SkinItching: [""],
      Colorchanges: [""],
      SkinLumps: [""],
      Dryness: [""],
      Hairandnailchanges: [""],
      SkinOthers: [""],
      SkinothersComments: [""],

      //ROSHead
      Headache: [""],
      Headinjury: [""],
      Others: [""],
      HeadothersComments: [""],

      //ROS Ears
      Decreasedhearing: [""],
      Earache: [""],
      Ringinginears: [""],
      Drainage: [""],
      EarOthers: [""],
      EarothersComments: [""],

      //ROS Eyes
      Vision: [""],
      Blurryordoublevision: [""],
      Cataracts: [""],
      Glassesorcontacts: [""],
      Flashinglights: [""],
      Lasteyeexam: [""],
      EyePain: [""],
      Specks: [""],
      Redness: [""],
      Glaucoma: [""],
      EyeOthers: [""],
      EyesothersComments: [""],

      //ROS Nose
      Stuffiness: [""],
      NoseItching: [""],
      Nosebleeds: [""],
      Discharge: [""],
      Hayfever: [""],
      Sinuspain: [""],
      NoseOthers: [""],
      NoseothersComments: [""],

      //ROS Throat
      Teeth: [""],
      Soretongue: [""],
      Thrush: [""],
      Gums: [""],
      Drymouth: [""],
      Nonhealingsores: [""],
      Bleeding: [""],
      Sorethroat: [""],
      Sinus: [""],
      Lastdentalexam: [""],
      Dentures: [""],
      Hoarseness: [""],
      ThroatOthers: [""],
      ThroatothersComments: [""],

      //ROS Neck
      NeckLumps: [""],
      NeckPain: [""],
      Swollenglands: [""],
      Stiffness: [""],
      NeckOthers: [""],
      NeckothersComments: [""],

      //ROS Respiratory
      Cough: [""],
      Coughingupblood: [""],
      Wheezing: [""],
      Sputum: [""],
      Shortnessofbreath: [""],
      Painfulbreathing: [""],
      RespiratoryOthers: [""],
      Respiratoryotherscomments: [""],

      //ROS Neurologic
      Dizziness: [""],
      Weakness: [""],
      Tremor: [""],
      Fainting: [""],
      Numbness: [""],
      Seizures: [""],
      Tingling: [""],
      NeurologicOthers: [""],
      Neurologicotherscomments: [""],

      //ROS Hematologic
      Easeofbruising: [""],
      Easeofbleeding: [""],
      HematologicOthers: [""],
      Hematologicotherscomments: [""],

      //ROS Psychiatric
      Nervousness: [""],
      Memoryloss: [""],
      Stress: [""],
      Depression: [""],
      PsychiatricOthers: [""],
      Psychiatricotherscomments: [""],
    });

    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.getVisitForPatient();
    this.getProviderNames();
    this.setPatientROS();
    this.patientROSform.disable();
  }

  getVisitForPatient() {
    this.newpatsvc.GetVisitsForPatient(this.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    });
  }

  RecordedDuring(index: any) {
    this.newpatsvc.GetVisitsForPatient(this.patientId).then((data) => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          //this.visitID = data[i].VisitId;
        }
      }
    });
  }

  getProviderNames() {
    this.newpatsvc.GetProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }

  setPatientROS() {
    this.patientROSform.get("ROSID").setValue(this.data1.ROSID);
    this.patientROSform.get("PatientID").setValue(this.data1.PatientID);
    this.patientROSform.get("VisitID").setValue(this.data1.VisitID);
    this.patientROSform
      .get("visitDateandTime")
      .setValue(this.data1.visitDateandTime);
    this.patientROSform
      .get("RecordedDate")
      .setValue(new Date(this.data1.RecordedDate));
    this.patientROSform.get("RecordedBy").setValue(this.data1.RecordedBy);
    this.patientROSform
      .get("RecordedTime")
      .setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.patientROSform
      .get("recordedDuring")
      .setValue(this.data1.recordedDuring);

    //General
    this.patientROSform
      .get("Weightlossorgain")
      .setValue(this.data1.Weightlossorgain);
    this.patientROSform.get("Feverorchills").setValue(this.data1.Feverorchills);
    this.patientROSform
      .get("Troublesleeping")
      .setValue(this.data1.Troublesleeping);
    this.patientROSform.get("Fatigue").setValue(this.data1.Fatigue);
    this.patientROSform
      .get("GeneralWeakness")
      .setValue(this.data1.GeneralWeakness);
    this.patientROSform.get("GeneralOthers").setValue(this.data1.GeneralOthers);
    this.patientROSform
      .get("GeneralothersComments")
      .setValue(this.data1.GeneralothersComments);

    //skin
    this.patientROSform.get("Rashes").setValue(this.data1.Rashes);
    this.patientROSform.get("SkinItching").setValue(this.data1.SkinItching);
    this.patientROSform.get("Colorchanges").setValue(this.data1.Colorchanges);
    this.patientROSform.get("SkinLumps").setValue(this.data1.SkinLumps);
    this.patientROSform.get("Dryness").setValue(this.data1.Dryness);
    this.patientROSform
      .get("Hairandnailchanges")
      .setValue(this.data1.Hairandnailchanges);
    this.patientROSform.get("SkinOthers").setValue(this.data1.SkinOthers);
    this.patientROSform
      .get("SkinothersComments")
      .setValue(this.data1.SkinothersComments);

    //Head
    this.patientROSform.get("Headache").setValue(this.data1.Headache);
    this.patientROSform.get("Headinjury").setValue(this.data1.Headinjury);
    this.patientROSform.get("Others").setValue(this.data1.Others);
    this.patientROSform
      .get("HeadothersComments")
      .setValue(this.data1.HeadothersComments);

    //Ears
    this.patientROSform
      .get("Decreasedhearing")
      .setValue(this.data1.Decreasedhearing);
    this.patientROSform.get("Earache").setValue(this.data1.Earache);
    this.patientROSform.get("Ringinginears").setValue(this.data1.Ringinginears);
    this.patientROSform.get("Drainage").setValue(this.data1.Drainage);
    this.patientROSform.get("EarOthers").setValue(this.data1.EarOthers);
    this.patientROSform
      .get("EarothersComments")
      .setValue(this.data1.EarothersComments);

    //Eyes
    this.patientROSform.get("Vision").setValue(this.data1.Vision);
    this.patientROSform
      .get("Blurryordoublevision")
      .setValue(this.data1.Blurryordoublevision);
    this.patientROSform.get("Cataracts").setValue(this.data1.Cataracts);
    this.patientROSform
      .get("Glassesorcontacts")
      .setValue(this.data1.Glassesorcontacts);
    this.patientROSform
      .get("Flashinglights")
      .setValue(this.data1.Flashinglights);
    this.patientROSform.get("Lasteyeexam").setValue(this.data1.Lasteyeexam);
    this.patientROSform.get("EyePain").setValue(this.data1.EyePain);
    this.patientROSform.get("Specks").setValue(this.data1.Specks);
    this.patientROSform.get("Redness").setValue(this.data1.Redness);
    this.patientROSform.get("Glaucoma").setValue(this.data1.Glaucoma);
    this.patientROSform.get("EyeOthers").setValue(this.data1.EyeOthers);
    this.patientROSform
      .get("EyesothersComments")
      .setValue(this.data1.EyesothersComments);

    //Nose
    this.patientROSform.get("Stuffiness").setValue(this.data1.Stuffiness);
    this.patientROSform.get("NoseItching").setValue(this.data1.NoseItching);
    this.patientROSform.get("Nosebleeds").setValue(this.data1.Nosebleeds);
    this.patientROSform.get("Discharge").setValue(this.data1.Discharge);
    this.patientROSform.get("Hayfever").setValue(this.data1.Hayfever);
    this.patientROSform.get("Sinuspain").setValue(this.data1.Sinuspain);
    this.patientROSform.get("NoseOthers").setValue(this.data1.NoseOthers);
    this.patientROSform
      .get("NoseothersComments")
      .setValue(this.data1.NoseothersComments);

    //Throat
    this.patientROSform.get("Teeth").setValue(this.data1.Teeth);
    this.patientROSform.get("Soretongue").setValue(this.data1.Soretongue);
    this.patientROSform.get("Thrush").setValue(this.data1.Thrush);
    this.patientROSform.get("Gums").setValue(this.data1.Gums);
    this.patientROSform.get("Drymouth").setValue(this.data1.Drymouth);
    this.patientROSform
      .get("Nonhealingsores")
      .setValue(this.data1.Nonhealingsores);
    this.patientROSform.get("Bleeding").setValue(this.data1.Bleeding);
    this.patientROSform.get("Sorethroat").setValue(this.data1.Sorethroat);
    this.patientROSform.get("Sinus").setValue(this.data1.Sinus);
    this.patientROSform
      .get("Lastdentalexam")
      .setValue(this.data1.Lastdentalexam);
    //    this.patientROSform.get('Lastdentalexamdate').setValue(this.data1.Lastdentalexamdate);
    this.patientROSform.get("Dentures").setValue(this.data1.Dentures);
    this.patientROSform.get("Hoarseness").setValue(this.data1.Hoarseness);
    this.patientROSform.get("ThroatOthers").setValue(this.data1.ThroatOthers);
    this.patientROSform
      .get("ThroatothersComments")
      .setValue(this.data1.ThroatothersComments);

    //Neck
    this.patientROSform.get("NeckLumps").setValue(this.data1.NeckLumps);
    this.patientROSform.get("NeckPain").setValue(this.data1.NeckPain);
    this.patientROSform.get("Swollenglands").setValue(this.data1.Swollenglands);
    this.patientROSform.get("Stiffness").setValue(this.data1.Stiffness);
    this.patientROSform.get("NeckOthers").setValue(this.data1.NeckOthers);
    this.patientROSform
      .get("NeckothersComments")
      .setValue(this.data1.NeckothersComments);

    //Respiratory
    this.patientROSform.get("Cough").setValue(this.data1.Cough);
    this.patientROSform
      .get("Coughingupblood")
      .setValue(this.data1.Coughingupblood);
    this.patientROSform.get("Wheezing").setValue(this.data1.Wheezing);
    this.patientROSform.get("Sputum").setValue(this.data1.Sputum);
    this.patientROSform
      .get("Shortnessofbreath")
      .setValue(this.data1.Shortnessofbreath);
    this.patientROSform
      .get("Painfulbreathing")
      .setValue(this.data1.Painfulbreathing);
    this.patientROSform
      .get("RespiratoryOthers")
      .setValue(this.data1.RespiratoryOthers);
    this.patientROSform
      .get("Respiratoryotherscomments")
      .setValue(this.data1.Respiratoryotherscomments);

    //Neurology
    this.patientROSform.get("Dizziness").setValue(this.data1.Dizziness);
    this.patientROSform.get("Weakness").setValue(this.data1.Weakness);
    this.patientROSform.get("Tremor").setValue(this.data1.Tremor);
    this.patientROSform.get("Fainting").setValue(this.data1.Fainting);
    this.patientROSform.get("Numbness").setValue(this.data1.Numbness);
    this.patientROSform.get("Seizures").setValue(this.data1.Seizures);
    this.patientROSform.get("Tingling").setValue(this.data1.Tingling);
    this.patientROSform
      .get("NeurologicOthers")
      .setValue(this.data1.NeurologicOthers);
    this.patientROSform
      .get("Neurologicotherscomments")
      .setValue(this.data1.Neurologicotherscomments);

    //Hematologic
    this.patientROSform
      .get("Easeofbruising")
      .setValue(this.data1.Easeofbruising);
    this.patientROSform
      .get("Easeofbleeding")
      .setValue(this.data1.Easeofbleeding);
    this.patientROSform
      .get("HematologicOthers")
      .setValue(this.data1.HematologicOthers);
    this.patientROSform
      .get("Hematologicotherscomments")
      .setValue(this.data1.Hematologicotherscomments);

    //Psychiatric
    this.patientROSform.get("Nervousness").setValue(this.data1.Nervousness);
    this.patientROSform.get("Memoryloss").setValue(this.data1.Memoryloss);
    this.patientROSform.get("Stress").setValue(this.data1.Stress);
    this.patientROSform.get("Depression").setValue(this.data1.Depression);
    this.patientROSform
      .get("PsychiatricOthers")
      .setValue(this.data1.PsychiatricOthers);
    this.patientROSform
      .get("Psychiatricotherscomments")
      .setValue(this.data1.Psychiatricotherscomments);
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
