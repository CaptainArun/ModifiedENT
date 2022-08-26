import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AnesthesiafitnessModel } from "../../models/AnesthesiafitnessModel";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ProcedureService } from "../../procedure.service";
import { ProcedureCareSignOffModel } from "../../models/preProcedureCareSignOffModel";
import { CustomHttpService } from "../../../core/custom-http.service";

@Component({
  selector: "pre-procedure-ansthesia",
  templateUrl: "./pre-procedure-ansthesia.component.html",
  styleUrls: ["./pre-procedure-ansthesia.component.css"],
})
export class PreProcedureAnsthesiaComponent implements OnInit {

  //#region Property Declaration 

  anesthesiafitnessClearaneForm: FormGroup;
  AnesthesiafitnessModel: AnesthesiafitnessModel = new AnesthesiafitnessModel();
  ProcedureCareSignOffModel: ProcedureCareSignOffModel = new ProcedureCareSignOffModel();
  value: any;
  admissionNumber: number = 0;
  anesthesia: boolean = false;
  IsSignOff: boolean = false;

  //#endregion Property Declaration

  //#region Constructor
  constructor(private util: UtilService, public dialogRef: MatDialogRef<PreProcedureAnsthesiaComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public fb: FormBuilder, private ProcedureService: ProcedureService) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.anesthesiafitnessClearaneForm = this.fb.group({
      AnesthesiafitnessId: [""],
      PatientId: [""],
      VisitID: [""],
      CaseSheetID: [""],
      WNLRespiratory: [false],
      Cough: [false],
      Dyspnea: [false],
      Dry: [false],
      RecentURILRTI: [false],
      OSA: [false],
      Productive: [false],
      TB: [false],
      COPD: [false],
      Asthma: [false],
      Pneumonia: [false],
      Fever: [false],
      WNLNeuroMusculoskeletal: [false],
      RhArthritisGOUT: [false],
      CVATIA: [false],
      Seizures: [false],
      ScoliosisKyphosis: [false],
      HeadInjury: [false],
      PsychDisorder: [false],
      MuscleWeakness: [false],
      Paralysis: [false],
      WNLCardio: [false],
      Hypertension: [false],
      DOE: [false],
      Pacemarker: [false],
      RheumaticFever: [false],
      OrthopneaPND: [false],
      CADAnginaMI: [false],
      ExerciseTolerance: [false],
      WNLRenalEndocrine: [false],
      RenalInsufficiency: [false],
      ThyroidDisease: [false],
      Diabetes: [false],
      WNLGastrointestinal: [false],
      Vomiting: [false],
      Cirrhosis: [false],
      Diarrhea: [false],
      GERD: [false],
      WNLOthers: [false],
      HeamatDisorder: [false],
      Radiotherapy: [false],
      Immunosuppressant: [false],
      Pregnancy: [false],
      Chemotherapy: [false],
      SteroidUse: [false],
      Smoking: [false],
      Alcohol: [false],
      Allergies: [false],
      LA: [false],
      GA: [false],
      RA: [false],
      NA: [false],
      SignificantDetails: [""],
      CurrentMedications: [""],
      Pulse: [""],
      Clubbing: [""],
      IntubationSimpleDifficult: [""],
      BP: ["", Validators.required],
      Cyanosis: [""],
      ShortNeck: [""],
      RR: [""],
      Icterus: [""],
      MouthOpening: [""],
      Temp: ["", Validators.required],
      Obesity: [""],
      MPClass: [""],
      Pallor: [""],
      ODH: [""],
      Thyromental: [""],
      LooseTooth: [""],
      Distance: [""],
      ArtificialDentures: [""],
      DifficultVenousAccess: [""],
      AnesthesiaFitnessnotes: [""],
      AnesthesiaFitnessClearedCheck: ["", Validators.required],
      Password: [''],
      UserName: [localStorage.getItem('LoggedinUser')],
    });

    this.getAnesthesiapatient();
  }
  //#endregion ngOnInit

  //#region Get Values

  //Get Data For Anesthesia of Patient
  getAnesthesiapatient() {
    this.ProcedureService.getAnesthesiapatient(this.data.AdmissionID).then(
      (res) => {
        this.value = res;
        if (this.value) {
          this.admissionNumber = this.value.AnesthesiafitnessId;
          this.anesthesia = this.value.AnesthesiaFitnessCleared;
          if (this.value.AnesthesiaFitnessCleared) {
            this.anesthesiafitnessClearaneForm.get("AnesthesiaFitnessClearedCheck").setValue("Yes");
          } else {
            this.anesthesiafitnessClearaneForm.get("AnesthesiaFitnessClearedCheck").setValue("No");
          }
          this.anesthesiafitnessClearaneForm.get("WNLRespiratory").setValue(this.value.WNLRespiratory);
          this.anesthesiafitnessClearaneForm.get("Cough").setValue(this.value.Cough);
          this.anesthesiafitnessClearaneForm.get("Dyspnea").setValue(this.value.Dyspnea);
          this.anesthesiafitnessClearaneForm.get("Dry").setValue(this.value.Dry);
          this.anesthesiafitnessClearaneForm.get("RecentURILRTI").setValue(this.value.RecentURILRTI);
          this.anesthesiafitnessClearaneForm.get("OSA").setValue(this.value.OSA);
          this.anesthesiafitnessClearaneForm.get("Productive").setValue(this.value.Productive);
          this.anesthesiafitnessClearaneForm.get("TB").setValue(this.value.TB);
          this.anesthesiafitnessClearaneForm.get("COPD").setValue(this.value.COPD);
          this.anesthesiafitnessClearaneForm.get("Asthma").setValue(this.value.Asthma);
          this.anesthesiafitnessClearaneForm.get("Pneumonia").setValue(this.value.Pneumonia);
          this.anesthesiafitnessClearaneForm.get("Fever").setValue(this.value.Fever);
          this.anesthesiafitnessClearaneForm.get("WNLNeuroMusculoskeletal").setValue(this.value.WNLNeuroMusculoskeletal);
          this.anesthesiafitnessClearaneForm.get("RhArthritisGOUT").setValue(this.value.RhArthritisGOUT);
          this.anesthesiafitnessClearaneForm.get("CVATIA").setValue(this.value.CVATIA);
          this.anesthesiafitnessClearaneForm.get("Seizures").setValue(this.value.Seizures);
          this.anesthesiafitnessClearaneForm.get("ScoliosisKyphosis").setValue(this.value.ScoliosisKyphosis);
          this.anesthesiafitnessClearaneForm.get("HeadInjury").setValue(this.value.HeadInjury);
          this.anesthesiafitnessClearaneForm.get("PsychDisorder").setValue(this.value.PsychDisorder);
          this.anesthesiafitnessClearaneForm.get("MuscleWeakness").setValue(this.value.MuscleWeakness);
          this.anesthesiafitnessClearaneForm.get("Paralysis").setValue(this.value.Paralysis);
          this.anesthesiafitnessClearaneForm.get("WNLCardio").setValue(this.value.WNLCardio);
          this.anesthesiafitnessClearaneForm.get("Hypertension").setValue(this.value.Hypertension);
          this.anesthesiafitnessClearaneForm.get("DOE").setValue(this.value.DOE);
          this.anesthesiafitnessClearaneForm.get("Pacemarker").setValue(this.value.Pacemarker);
          this.anesthesiafitnessClearaneForm.get("RheumaticFever").setValue(this.value.RheumaticFever);
          this.anesthesiafitnessClearaneForm.get("OrthopneaPND").setValue(this.value.OrthopneaPND);
          this.anesthesiafitnessClearaneForm.get("CADAnginaMI").setValue(this.value.CADAnginaMI);
          this.anesthesiafitnessClearaneForm.get("ExerciseTolerance").setValue(this.value.ExerciseTolerance);
          this.anesthesiafitnessClearaneForm.get("WNLRenalEndocrine").setValue(this.value.WNLRenalEndocrine);
          this.anesthesiafitnessClearaneForm.get("RenalInsufficiency").setValue(this.value.RenalInsufficiency);
          this.anesthesiafitnessClearaneForm.get("ThyroidDisease").setValue(this.value.ThyroidDisease);
          this.anesthesiafitnessClearaneForm.get("Diabetes").setValue(this.value.Diabetes);
          this.anesthesiafitnessClearaneForm.get("WNLGastrointestinal").setValue(this.value.WNLGastrointestinal);
          this.anesthesiafitnessClearaneForm.get("Vomiting").setValue(this.value.Vomiting);
          this.anesthesiafitnessClearaneForm.get("Cirrhosis").setValue(this.value.Cirrhosis);
          this.anesthesiafitnessClearaneForm.get("Diarrhea").setValue(this.value.Diarrhea);
          this.anesthesiafitnessClearaneForm.get("GERD").setValue(this.value.GERD);
          this.anesthesiafitnessClearaneForm.get("WNLOthers").setValue(this.value.WNLOthers);
          this.anesthesiafitnessClearaneForm.get("HeamatDisorder").setValue(this.value.HeamatDisorder);
          this.anesthesiafitnessClearaneForm.get("Radiotherapy").setValue(this.value.Radiotherapy);
          this.anesthesiafitnessClearaneForm.get("Immunosuppressant").setValue(this.value.Immunosuppressant);
          this.anesthesiafitnessClearaneForm.get("Pregnancy").setValue(this.value.Pregnancy);
          this.anesthesiafitnessClearaneForm.get("Chemotherapy").setValue(this.value.Chemotherapy);
          this.anesthesiafitnessClearaneForm.get("SteroidUse").setValue(this.value.SteroidUse);
          this.anesthesiafitnessClearaneForm.get("Smoking").setValue(this.value.Smoking);
          this.anesthesiafitnessClearaneForm.get("Alcohol").setValue(this.value.Alcohol);
          this.anesthesiafitnessClearaneForm.get("Allergies").setValue(this.value.Allergies);
          this.anesthesiafitnessClearaneForm.get("LA").setValue(this.value.LA);
          this.anesthesiafitnessClearaneForm.get("GA").setValue(this.value.GA);
          this.anesthesiafitnessClearaneForm.get("RA").setValue(this.value.RA);
          this.anesthesiafitnessClearaneForm.get("NA").setValue(this.value.NA);
          this.anesthesiafitnessClearaneForm.get("SignificantDetails").setValue(this.value.SignificantDetails);
          this.anesthesiafitnessClearaneForm.get("CurrentMedications").setValue(this.value.CurrentMedications);
          this.anesthesiafitnessClearaneForm.get("Pulse").setValue(this.value.Pulse);
          this.anesthesiafitnessClearaneForm.get("Clubbing").setValue(this.value.Clubbing);
          this.anesthesiafitnessClearaneForm.get("IntubationSimpleDifficult").setValue(this.value.IntubationSimpleDifficult);
          this.anesthesiafitnessClearaneForm.get("BP").setValue(this.value.BP);
          this.anesthesiafitnessClearaneForm.get("Cyanosis").setValue(this.value.Cyanosis);
          this.anesthesiafitnessClearaneForm.get("ShortNeck").setValue(this.value.ShortNeck);
          this.anesthesiafitnessClearaneForm.get("RR").setValue(this.value.RR);
          this.anesthesiafitnessClearaneForm.get("Icterus").setValue(this.value.Icterus);
          this.anesthesiafitnessClearaneForm.get("MouthOpening").setValue(this.value.MouthOpening);
          this.anesthesiafitnessClearaneForm.get("Temp").setValue(this.value.Temp);
          this.anesthesiafitnessClearaneForm.get("Obesity").setValue(this.value.Obesity);
          this.anesthesiafitnessClearaneForm.get("MPClass").setValue(this.value.MPClass);
          this.anesthesiafitnessClearaneForm.get("Pallor").setValue(this.value.Pallor);
          this.anesthesiafitnessClearaneForm.get("ODH").setValue(this.value.ODH);
          this.anesthesiafitnessClearaneForm.get("Thyromental").setValue(this.value.Thyromental);
          this.anesthesiafitnessClearaneForm.get("LooseTooth").setValue(this.value.LooseTooth);
          this.anesthesiafitnessClearaneForm.get("Distance").setValue(this.value.Distance);
          this.anesthesiafitnessClearaneForm.get("ArtificialDentures").setValue(this.value.ArtificialDentures);
          this.anesthesiafitnessClearaneForm.get("DifficultVenousAccess").setValue(this.value.DifficultVenousAccess);
          this.anesthesiafitnessClearaneForm.get("AnesthesiaFitnessnotes").setValue(this.value.AnesthesiaFitnessnotes);

          if (this.value.SignOffStatus) {
            this.IsSignOff = true;
            this.anesthesiafitnessClearaneForm.disable();
          }
        }
      });
  }
  //#endregion Get Values

  //#region Form Submit
  // Form Submitting
  addUpdateAnesthesiaFitness() {
    if (this.anesthesiafitnessClearaneForm.valid) {
      if (this.anesthesiafitnessClearaneForm.get("AnesthesiaFitnessClearedCheck").value == "Yes") {
        this.anesthesia = true;
      }
      else {
        this.anesthesia = false;
      }

      this.AnesthesiafitnessModel.AnesthesiafitnessId = this.admissionNumber;
      this.AnesthesiafitnessModel.AnesthesiaFitnessCleared = this.anesthesia;
      this.AnesthesiafitnessModel.AdmissionId = this.data.AdmissionID;
      this.AnesthesiafitnessModel.WNLRespiratory = this.anesthesiafitnessClearaneForm.get("WNLRespiratory").value;
      this.AnesthesiafitnessModel.Cough = this.anesthesiafitnessClearaneForm.get("Cough").value;
      this.AnesthesiafitnessModel.Dyspnea = this.anesthesiafitnessClearaneForm.get("Dyspnea").value;
      this.AnesthesiafitnessModel.Dry = this.anesthesiafitnessClearaneForm.get("Dry").value;
      this.AnesthesiafitnessModel.RecentURILRTI = this.anesthesiafitnessClearaneForm.get("RecentURILRTI").value;
      this.AnesthesiafitnessModel.OSA = this.anesthesiafitnessClearaneForm.get("OSA").value;
      this.AnesthesiafitnessModel.Productive = this.anesthesiafitnessClearaneForm.get("Productive").value;
      this.AnesthesiafitnessModel.TB = this.anesthesiafitnessClearaneForm.get("TB").value;
      this.AnesthesiafitnessModel.COPD = this.anesthesiafitnessClearaneForm.get("COPD").value;
      this.AnesthesiafitnessModel.Asthma = this.anesthesiafitnessClearaneForm.get("Asthma").value;
      this.AnesthesiafitnessModel.Pneumonia = this.anesthesiafitnessClearaneForm.get("Pneumonia").value;
      this.AnesthesiafitnessModel.Fever = this.anesthesiafitnessClearaneForm.get("Fever").value;
      this.AnesthesiafitnessModel.WNLNeuroMusculoskeletal = this.anesthesiafitnessClearaneForm.get("WNLNeuroMusculoskeletal").value;
      this.AnesthesiafitnessModel.RhArthritisGOUT = this.anesthesiafitnessClearaneForm.get("RhArthritisGOUT").value;
      this.AnesthesiafitnessModel.CVATIA = this.anesthesiafitnessClearaneForm.get("CVATIA").value;
      this.AnesthesiafitnessModel.Seizures = this.anesthesiafitnessClearaneForm.get("Seizures").value;
      this.AnesthesiafitnessModel.ScoliosisKyphosis = this.anesthesiafitnessClearaneForm.get("ScoliosisKyphosis").value;
      this.AnesthesiafitnessModel.HeadInjury = this.anesthesiafitnessClearaneForm.get("HeadInjury").value;
      this.AnesthesiafitnessModel.PsychDisorder = this.anesthesiafitnessClearaneForm.get("PsychDisorder").value;
      this.AnesthesiafitnessModel.MuscleWeakness = this.anesthesiafitnessClearaneForm.get("MuscleWeakness").value;
      this.AnesthesiafitnessModel.Paralysis = this.anesthesiafitnessClearaneForm.get("Paralysis").value;
      this.AnesthesiafitnessModel.WNLCardio = this.anesthesiafitnessClearaneForm.get("WNLCardio").value;
      this.AnesthesiafitnessModel.Hypertension = this.anesthesiafitnessClearaneForm.get("Hypertension").value;
      this.AnesthesiafitnessModel.DOE = this.anesthesiafitnessClearaneForm.get("DOE").value;
      this.AnesthesiafitnessModel.Pacemarker = this.anesthesiafitnessClearaneForm.get("Pacemarker").value;
      this.AnesthesiafitnessModel.RheumaticFever = this.anesthesiafitnessClearaneForm.get("RheumaticFever").value;
      this.AnesthesiafitnessModel.OrthopneaPND = this.anesthesiafitnessClearaneForm.get("OrthopneaPND").value;
      this.AnesthesiafitnessModel.CADAnginaMI = this.anesthesiafitnessClearaneForm.get("CADAnginaMI").value;
      this.AnesthesiafitnessModel.ExerciseTolerance = this.anesthesiafitnessClearaneForm.get("ExerciseTolerance").value;
      this.AnesthesiafitnessModel.WNLRenalEndocrine = this.anesthesiafitnessClearaneForm.get("WNLRenalEndocrine").value;
      this.AnesthesiafitnessModel.RenalInsufficiency = this.anesthesiafitnessClearaneForm.get("RenalInsufficiency").value;
      this.AnesthesiafitnessModel.ThyroidDisease = this.anesthesiafitnessClearaneForm.get("ThyroidDisease").value;
      this.AnesthesiafitnessModel.Diabetes = this.anesthesiafitnessClearaneForm.get("Diabetes").value;
      this.AnesthesiafitnessModel.WNLGastrointestinal = this.anesthesiafitnessClearaneForm.get("WNLGastrointestinal").value;
      this.AnesthesiafitnessModel.Vomiting = this.anesthesiafitnessClearaneForm.get("Vomiting").value;
      this.AnesthesiafitnessModel.Cirrhosis = this.anesthesiafitnessClearaneForm.get("Cirrhosis").value;
      this.AnesthesiafitnessModel.Diarrhea = this.anesthesiafitnessClearaneForm.get("Diarrhea").value;
      this.AnesthesiafitnessModel.GERD = this.anesthesiafitnessClearaneForm.get("GERD").value;
      this.AnesthesiafitnessModel.WNLOthers = this.anesthesiafitnessClearaneForm.get("WNLOthers").value;
      this.AnesthesiafitnessModel.HeamatDisorder = this.anesthesiafitnessClearaneForm.get("HeamatDisorder").value;
      this.AnesthesiafitnessModel.Radiotherapy = this.anesthesiafitnessClearaneForm.get("Radiotherapy").value;
      this.AnesthesiafitnessModel.Immunosuppressant = this.anesthesiafitnessClearaneForm.get("Immunosuppressant").value;
      this.AnesthesiafitnessModel.Pregnancy = this.anesthesiafitnessClearaneForm.get("Pregnancy").value;
      this.AnesthesiafitnessModel.Chemotherapy = this.anesthesiafitnessClearaneForm.get("Chemotherapy").value;
      this.AnesthesiafitnessModel.SteroidUse = this.anesthesiafitnessClearaneForm.get("SteroidUse").value;
      this.AnesthesiafitnessModel.Smoking = this.anesthesiafitnessClearaneForm.get("Smoking").value;
      this.AnesthesiafitnessModel.Alcohol = this.anesthesiafitnessClearaneForm.get("Alcohol").value;
      this.AnesthesiafitnessModel.Allergies = this.anesthesiafitnessClearaneForm.get("Allergies").value;
      this.AnesthesiafitnessModel.SignificantDetails = this.anesthesiafitnessClearaneForm.get("SignificantDetails").value;
      this.AnesthesiafitnessModel.CurrentMedications = this.anesthesiafitnessClearaneForm.get("CurrentMedications").value;
      this.AnesthesiafitnessModel.LA = this.anesthesiafitnessClearaneForm.get("LA").value;
      this.AnesthesiafitnessModel.GA = this.anesthesiafitnessClearaneForm.get("GA").value;
      this.AnesthesiafitnessModel.RA = this.anesthesiafitnessClearaneForm.get("RA").value;
      this.AnesthesiafitnessModel.NA = this.anesthesiafitnessClearaneForm.get("NA").value;
      this.AnesthesiafitnessModel.Pulse = this.anesthesiafitnessClearaneForm.get("Pulse").value;
      this.AnesthesiafitnessModel.Clubbing = this.anesthesiafitnessClearaneForm.get("Clubbing").value;
      this.AnesthesiafitnessModel.IntubationSimpleDifficult = this.anesthesiafitnessClearaneForm.get("IntubationSimpleDifficult").value;
      this.AnesthesiafitnessModel.BP = this.anesthesiafitnessClearaneForm.get("BP").value;
      this.AnesthesiafitnessModel.Cyanosis = this.anesthesiafitnessClearaneForm.get("Cyanosis").value;
      this.AnesthesiafitnessModel.ShortNeck = this.anesthesiafitnessClearaneForm.get("ShortNeck").value;
      this.AnesthesiafitnessModel.RR = this.anesthesiafitnessClearaneForm.get("RR").value;
      this.AnesthesiafitnessModel.Icterus = this.anesthesiafitnessClearaneForm.get("Icterus").value;
      this.AnesthesiafitnessModel.MouthOpening = this.anesthesiafitnessClearaneForm.get("MouthOpening").value;
      this.AnesthesiafitnessModel.Temp = this.anesthesiafitnessClearaneForm.get("Temp").value;
      this.AnesthesiafitnessModel.Obesity = this.anesthesiafitnessClearaneForm.get("Obesity").value;
      this.AnesthesiafitnessModel.MPClass = this.anesthesiafitnessClearaneForm.get("MPClass").value;
      this.AnesthesiafitnessModel.Pallor = this.anesthesiafitnessClearaneForm.get("Pallor").value;
      this.AnesthesiafitnessModel.ODH = this.anesthesiafitnessClearaneForm.get("ODH").value;
      this.AnesthesiafitnessModel.Thyromental = this.anesthesiafitnessClearaneForm.get("Thyromental").value;
      this.AnesthesiafitnessModel.LooseTooth = this.anesthesiafitnessClearaneForm.get("LooseTooth").value;
      this.AnesthesiafitnessModel.Distance = this.anesthesiafitnessClearaneForm.get("Distance").value;
      this.AnesthesiafitnessModel.ArtificialDentures = this.anesthesiafitnessClearaneForm.get("ArtificialDentures").value;
      this.AnesthesiafitnessModel.DifficultVenousAccess = this.anesthesiafitnessClearaneForm.get("DifficultVenousAccess").value;
      this.AnesthesiafitnessModel.AnesthesiaFitnessnotes = this.anesthesiafitnessClearaneForm.get("AnesthesiaFitnessnotes").value;

      this.ProcedureService.addUpdateAnesthesiaFitness(this.AnesthesiafitnessModel).then((res) => {
        if (res != null && res.AnesthesiafitnessId > 0) {
          this.util.showMessage("", "Ansthesia Fitness details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
        this.dialogRef.close("update");
      });
    }
  }
  //#endregion Form Submit

  //#region other Functions
  //Dialog Close
  dialogClose(): void {
    this.dialogRef.close();
  }

  //reset the Form
  reset() {
    this.anesthesiafitnessClearaneForm.reset();
    this.getAnesthesiapatient();
    this.anesthesiafitnessClearaneForm.get("UserName").setValue(localStorage.getItem('LoggedinUser'));
  }

  //signOff
  signOff() {
    if (this.anesthesiafitnessClearaneForm.get('UserName').value != "" && this.anesthesiafitnessClearaneForm.get('Password').value != "") {
      this.util.showMessage("SignOff", "Are you sure want to SignOff?", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res) => {
        if (res) {
          this.ProcedureCareSignOffModel.AdmissionId = this.data.AdmissionID;
          this.ProcedureCareSignOffModel.ScreenName = "anesthesiafitness";
          this.ProcedureCareSignOffModel.UserName = this.anesthesiafitnessClearaneForm.get('UserName').value;
          this.ProcedureCareSignOffModel.Password = this.anesthesiafitnessClearaneForm.get('Password').value;

          this.ProcedureService.sendSignOffModel(this.ProcedureCareSignOffModel).then((res) => {
            if (res.status == "Anesthesia Fitness Signed Off successfully") {
              this.util.showMessage('Success', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                if (res) {
                  this.anesthesiafitnessClearaneForm.disable();
                  this.IsSignOff = true;
                }
              });
            } else {
              this.util.showMessage('Error!!', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
            }
          });
        }
      });
    } else {
      this.util.showMessage('Error!!', "Invalid Username or password", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
    }
  }
  //#endregion other Functions
}
