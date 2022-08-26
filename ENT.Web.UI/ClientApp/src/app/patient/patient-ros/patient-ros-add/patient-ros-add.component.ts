import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PatientROSModel } from "../../../triage/models/patientROSModel";
import { NewPatientService } from "../../newPatient.service";
import { TriageService } from "../../../triage/triage.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-patient-ros-add",
  templateUrl: "./patient-ros-add.component.html",
  styleUrls: ["./patient-ros-add.component.css"],
})
export class PatientROSAddComponent implements OnInit {
  patientROSform: FormGroup;
  patientROSmodel: PatientROSModel = new PatientROSModel();
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

  constructor(
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public triageSvc: TriageService,
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<PatientROSAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.getVisitForPatient();
    this.getProviderNames();

    this.patientROSform = this.fb.group({
      PatientID: [""],
      VisitID: [""],
      ROSID: [""],
      VisitDate: ["", Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      recordedDuring: ["", Validators.required],
      RecordedBy: ["", Validators.required],

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
  }

  public show1: boolean = false;
  public show2: boolean = false;
  public show3: boolean = false;
  public show4: boolean = false;
  public show5: boolean = false;
  public show6: boolean = false;
  public show7: boolean = false;
  public show8: boolean = false;
  public show9: boolean = false;
  public show10: boolean = false;
  public show11: boolean = false;
  public show12: boolean = false;
  public show13: boolean = false;
  public show14: boolean = false;
  show = false;

  showDetails() {
    this.show = !this.show;
  }

  ros1111() {
    this.show3 = !this.show3;
  }
  ros2() {
    this.show4 = !this.show4;
  }
  ros3() {
    this.show5 = !this.show5;
  }
  ros4() {
    this.show6 = !this.show6;
  }
  ros5() {
    this.show7 = !this.show7;
  }
  ros6() {
    this.show8 = !this.show8;
  }
  ros7() {
    this.show9 = !this.show9;
  }
  ros8() {
    this.show10 = !this.show10;
  }
  ros9() {
    this.show11 = !this.show11;
  }
  ros10() {
    this.show12 = !this.show12;
  }
  ros11() {
    this.show13 = !this.show13;
  }
  ros12() {
    this.show14 = !this.show14;
  }

  getVisitForPatient() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        //this.visitID = res[i].VisitId;
      }
    });
  }

  RecordedDuring(index: any) {
    this.newpatsvc
      .GetVisitsForPatient(this.newpatsvc.patientId)
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (i == index) {
            this.recordedDuring = data[i].recordedDuring;
            this.visitID = data[i].VisitId;
            this.patientROSform.get("recordedDuring").setValue(this.recordedDuring);
          }
        }
      });
  }

  getProviderNames() {
    this.newpatsvc.GetProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }

  sendDateWithTime() {
    this.getDate = new Date(this.patientROSform.get("RecordedDate").value);

    if (this.patientROSform.get("RecordedDate").value != "") {
      if (
        this.patientROSform
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "pm"
      ) {
        if (
          parseInt(
            this.patientROSform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH =
            parseInt(
              this.patientROSform
                .get("RecordedTime")
                .value.toString()
                .split(" ")[0]
                .toString()
                .split(":")[0]
            ) + 12;
        }
      } else if (
        this.patientROSform
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.patientROSform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(
            this.patientROSform
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(
        this.patientROSform
          .get("RecordedTime")
          .value.toString()
          .split(" ")[0]
          .toString()
          .split(":")[1]
      );
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  addUpdateROS() {
    if (this.patientROSform.valid) {
      this.sendDateWithTime();
      this.patientROSform.get("PatientID").setValue(this.newpatsvc.patientId);
      this.patientROSform.get("VisitID").setValue(this.visitID);
      this.patientROSform.get("ROSID").setValue(0);
      this.patientROSmodel.PatientID = this.newpatsvc.patientId;
      this.patientROSmodel.VisitID = this.visitID;
      this.patientROSmodel.RecordedDate = this.getDateAndTime;
      this.patientROSmodel.RecordedBy = this.patientROSform.get("RecordedBy").value;
      //general
      this.patientROSmodel.Weightlossorgain = this.patientROSform.get("Weightlossorgain").value;
      this.patientROSmodel.Feverorchills = this.patientROSform.get("Feverorchills").value;
      this.patientROSmodel.Troublesleeping = this.patientROSform.get("Troublesleeping").value;
      this.patientROSmodel.Fatigue = this.patientROSform.get("Fatigue").value;
      this.patientROSmodel.GeneralWeakness = this.patientROSform.get("GeneralWeakness").value;
      this.patientROSmodel.GeneralOthers = this.patientROSform.get("GeneralOthers").value;
      if (this.show3) {
        this.patientROSmodel.GeneralothersComments = this.patientROSform.get("GeneralothersComments").value;
      } else {
        this.patientROSmodel.GeneralothersComments = "";
      }

      //skin
      this.patientROSmodel.Rashes = this.patientROSform.get("Rashes").value;
      this.patientROSmodel.SkinItching = this.patientROSform.get("SkinItching").value;
      this.patientROSmodel.Colorchanges = this.patientROSform.get("Colorchanges").value;
      this.patientROSmodel.SkinLumps = this.patientROSform.get("SkinLumps").value;
      this.patientROSmodel.Dryness = this.patientROSform.get("Dryness").value;
      this.patientROSmodel.Hairandnailchanges = this.patientROSform.get("Hairandnailchanges").value;
      this.patientROSmodel.SkinOthers = this.patientROSform.get("SkinOthers").value;
      if (this.show4) {
        this.patientROSmodel.SkinothersComments = this.patientROSform.get("SkinothersComments").value;
      } else {
        this.patientROSmodel.SkinothersComments = "";
      }
      //Head
      this.patientROSmodel.Headache = this.patientROSform.get("Headache").value;
      this.patientROSmodel.Headinjury = this.patientROSform.get("Headinjury").value;
      this.patientROSmodel.Others = this.patientROSform.get("Others").value;
      if (this.show5) {
        this.patientROSmodel.HeadothersComments = this.patientROSform.get("HeadothersComments").value;
      } else {
        this.patientROSmodel.HeadothersComments = "";
      }
      //Ears
      this.patientROSmodel.Decreasedhearing = this.patientROSform.get("Decreasedhearing").value;
      this.patientROSmodel.Earache = this.patientROSform.get("Earache").value;
      this.patientROSmodel.Ringinginears = this.patientROSform.get("Ringinginears").value;
      this.patientROSmodel.Drainage = this.patientROSform.get("Drainage").value;
      this.patientROSmodel.EarOthers = this.patientROSform.get("EarOthers").value;
      if (this.show6) {
        this.patientROSmodel.EarothersComments = this.patientROSform.get("EarothersComments").value;
      } else {
        this.patientROSmodel.EarothersComments = "";
      }
      //Eyes
      this.patientROSmodel.Vision = this.patientROSform.get("Vision").value;
      this.patientROSmodel.Blurryordoublevision = this.patientROSform.get("Blurryordoublevision").value;
      this.patientROSmodel.Cataracts = this.patientROSform.get("Cataracts").value;
      this.patientROSmodel.Glassesorcontacts = this.patientROSform.get("Glassesorcontacts").value;
      this.patientROSmodel.Flashinglights = this.patientROSform.get("Flashinglights").value;
      this.patientROSmodel.Lasteyeexam = this.patientROSform.get("Lasteyeexam").value;
      this.patientROSmodel.EyePain = this.patientROSform.get("EyePain").value;
      this.patientROSmodel.Specks = this.patientROSform.get("Specks").value;
      this.patientROSmodel.Redness = this.patientROSform.get("Redness").value;
      this.patientROSmodel.Glaucoma = this.patientROSform.get("Glaucoma").value;
      this.patientROSmodel.EyeOthers = this.patientROSform.get("EyeOthers").value;

      if (this.show7) {
        this.patientROSmodel.EyesothersComments = this.patientROSform.get("EyesothersComments").value;
      } else {
        this.patientROSmodel.EyesothersComments = "";
      }

      //Nose
      this.patientROSmodel.Stuffiness = this.patientROSform.get("Stuffiness").value;
      this.patientROSmodel.NoseItching = this.patientROSform.get("NoseItching").value;
      this.patientROSmodel.Nosebleeds = this.patientROSform.get("Nosebleeds").value;
      this.patientROSmodel.Discharge = this.patientROSform.get("Discharge").value;
      this.patientROSmodel.Hayfever = this.patientROSform.get("Hayfever").value;
      this.patientROSmodel.Sinuspain = this.patientROSform.get("Sinuspain").value;
      this.patientROSmodel.NoseOthers = this.patientROSform.get("NoseOthers").value;
      if (this.show8) {
        this.patientROSmodel.NoseothersComments = this.patientROSform.get("NoseothersComments").value;
      } else {
        this.patientROSmodel.NoseothersComments = "";
      }

      //Throat
      this.patientROSmodel.Teeth = this.patientROSform.get("Teeth").value;
      this.patientROSmodel.Soretongue = this.patientROSform.get("Soretongue").value;
      this.patientROSmodel.Thrush = this.patientROSform.get("Thrush").value;
      this.patientROSmodel.Gums = this.patientROSform.get("Gums").value;
      this.patientROSmodel.Drymouth = this.patientROSform.get("Drymouth").value;
      this.patientROSmodel.Nonhealingsores = this.patientROSform.get("Nonhealingsores").value;
      this.patientROSmodel.Bleeding = this.patientROSform.get("Bleeding").value;
      this.patientROSmodel.Sorethroat = this.patientROSform.get("Sorethroat").value;
      this.patientROSmodel.Sinus = this.patientROSform.get("Sinus").value;
      this.patientROSmodel.Lastdentalexam = this.patientROSform.get("Lastdentalexam").value;
      //    this.patientROSmodel.Lastdentalexamdate = this.patientROSform.get('Lastdentalexamdate').value;
      this.patientROSmodel.Dentures = this.patientROSform.get("Dentures").value;
      this.patientROSmodel.Hoarseness = this.patientROSform.get("Hoarseness").value;
      this.patientROSmodel.ThroatOthers = this.patientROSform.get("ThroatOthers").value;
      if (this.show9) {
        this.patientROSmodel.ThroatothersComments = this.patientROSform.get("ThroatothersComments").value;
      } else {
        this.patientROSmodel.ThroatothersComments = "";
      }

      //Neck
      this.patientROSmodel.NeckLumps = this.patientROSform.get("NeckLumps").value;
      this.patientROSmodel.NeckPain = this.patientROSform.get("NeckPain").value;
      this.patientROSmodel.Swollenglands = this.patientROSform.get("Swollenglands").value;
      this.patientROSmodel.Stiffness = this.patientROSform.get("Stiffness").value;
      this.patientROSmodel.NeckOthers = this.patientROSform.get("NeckOthers").value;
      if (this.show10) {
        this.patientROSmodel.NeckothersComments = this.patientROSform.get("NeckothersComments").value;
      } else {
        this.patientROSmodel.NeckothersComments = "";
      }

      //Respiratory
      this.patientROSmodel.Cough = this.patientROSform.get("Cough").value;
      this.patientROSmodel.Coughingupblood = this.patientROSform.get("Coughingupblood").value;
      this.patientROSmodel.Wheezing = this.patientROSform.get("Wheezing").value;
      this.patientROSmodel.Sputum = this.patientROSform.get("Sputum").value;
      this.patientROSmodel.Shortnessofbreath = this.patientROSform.get("Shortnessofbreath").value;
      this.patientROSmodel.Painfulbreathing = this.patientROSform.get("Painfulbreathing").value;
      this.patientROSmodel.RespiratoryOthers = this.patientROSform.get("RespiratoryOthers").value;
      if (this.show11) {
        this.patientROSmodel.Respiratoryotherscomments = this.patientROSform.get("Respiratoryotherscomments").value;
      } else {
        this.patientROSmodel.Respiratoryotherscomments = "";
      }

      //Neurology
      this.patientROSmodel.Dizziness = this.patientROSform.get("Dizziness").value;
      this.patientROSmodel.Weakness = this.patientROSform.get("Weakness").value;
      this.patientROSmodel.Tremor = this.patientROSform.get("Tremor").value;
      this.patientROSmodel.Fainting = this.patientROSform.get("Fainting").value;
      this.patientROSmodel.Numbness = this.patientROSform.get("Numbness").value;
      this.patientROSmodel.Seizures = this.patientROSform.get("Seizures").value;
      this.patientROSmodel.Tingling = this.patientROSform.get("Tingling").value;
      this.patientROSmodel.NeurologicOthers =
        this.patientROSform.get("NeurologicOthers").value;
      if (this.show12) {
        this.patientROSmodel.Neurologicotherscomments = this.patientROSform.get("Neurologicotherscomments").value;
      } else {
        this.patientROSmodel.Neurologicotherscomments = "";
      }

      //Hematologic
      this.patientROSmodel.Easeofbruising = this.patientROSform.get("Easeofbruising").value;
      this.patientROSmodel.Easeofbleeding = this.patientROSform.get("Easeofbleeding").value;
      this.patientROSmodel.HematologicOthers = this.patientROSform.get("HematologicOthers").value;
      if (this.show13) {
        this.patientROSmodel.Hematologicotherscomments = this.patientROSform.get("Hematologicotherscomments").value;
      } else {
        this.patientROSmodel.Hematologicotherscomments = "";
      }

      //psychiatric
      this.patientROSmodel.Nervousness = this.patientROSform.get("Nervousness").value;
      this.patientROSmodel.Memoryloss = this.patientROSform.get("Memoryloss").value;
      this.patientROSmodel.Stress = this.patientROSform.get("Stress").value;
      this.patientROSmodel.Depression = this.patientROSform.get("Depression").value;
      this.patientROSmodel.PsychiatricOthers = this.patientROSform.get("PsychiatricOthers").value;
      if (this.show14) {
        this.patientROSmodel.Psychiatricotherscomments = this.patientROSform.get("Psychiatricotherscomments").value;
      } else {
        this.patientROSmodel.Psychiatricotherscomments = "";
      }

      this.triageSvc.addUpdateROSForVisit(this.patientROSmodel).then((res) => {
        this.util.showMessage("", "ROS details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
          .then((res) => { });
        this.dialogRef.close("update");
      });
    }
  }
  cancelForm() {
    this.patientROSform.reset();
    this.recordedDuring = "";
    this.show1 = false;
    this.show2 = false;
    this.show3 = false;
    this.show4 = false;
    this.show5 = false;
    this.show6 = false;
    this.show7 = false;
    this.show8 = false;
    this.show9 = false;
    this.show10 = false;
    this.show11 = false;
    this.show12 = false;
    this.show13 = false;
    this.show14 = false;
    this.show = false;
    this.patientROSform.get('RecordedDate').setValue(new Date());
    this.patientROSform.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
