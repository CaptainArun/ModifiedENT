import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PatientAllergyModel } from './models/PatientAllergyModel';
import { PatientProblemListModel } from './models/patientProblemListModel';
import { PatientMedicationHistoryModel } from './models/patientMedicationHistoryModel';
import { NutritionAssessmentModel } from './models/nutritionAssessmentModel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TriageService } from './triage.service';
import { CustomHttpService } from '../core/custom-http.service';
import { PatientVitalsModel } from './models/patientVitalsModel';
import { PatientSocialHistoryModel } from './models/patientSocialHistoryModel';
import { PatientROSModel } from './models/patientROSModel';
import { FunctionalCognitiveModel } from './models/functionalCognitiveModel';
import { NursingSignOffModel } from './models/nursingSignOffModel';

@Component({
  selector: 'triage-vitals-common',
  templateUrl: 'triage-vitals-common.component.html'
})

export class TriageVitalsCommonComponent implements OnInit {

  updateProgressNotesForm: FormGroup; 
  vitalsModel: PatientVitalsModel = new PatientVitalsModel();
  allergiesModel: PatientAllergyModel = new PatientAllergyModel();
  problemListModel: PatientProblemListModel = new PatientProblemListModel();
  medicationModel: PatientMedicationHistoryModel = new PatientMedicationHistoryModel();
  socialHistoryModel: PatientSocialHistoryModel = new PatientSocialHistoryModel();
  rosModel: PatientROSModel = new PatientROSModel();
  nutritionModel: NutritionAssessmentModel = new NutritionAssessmentModel();
  functCognitiveModel: FunctionalCognitiveModel = new FunctionalCognitiveModel();
  nursingModel: NursingSignOffModel = new NursingSignOffModel();

  vitalsFormGroup: FormGroup;
  allergiesFormGroup: FormGroup;
  problemlistFormGroup: FormGroup;
  medicationFormGroup: FormGroup;
  historyFormGroup: FormGroup;
  rosFormGroup: FormGroup;
  nutritionFormGroup: FormGroup;
  functionalFormGroup: FormGroup;
  nursingSignOffFormGroup: FormGroup;
  nursingSignOff: FormGroup;

  BPLocation: any;
  allergyType: any;
  AllergySeverities: any;
  diagnosisCode: any;
  snomedCTCode: any;
  foodIntakeTypes: any;
  facilities: any;
  providers: any;
  problemTypes: any;
  appointmentTypes: any;
  appointmentStatuses: any;
  currentPatientId: any;

  isAllergy = false;
  allergiesCollection = [];
  isProblemList = false;
  problemListCollection = [];
  isMedication = false;
  medicationCollection = [];
  isNutrition = false;
  nutritionCollection = [];

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


  constructor(private _formBuilder: FormBuilder, private customHttpSvc: CustomHttpService, private triageSvc: TriageService,
    private dialogRef: MatDialogRef<TriageVitalsCommonComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  dynamicAllergiesControl(): FormGroup {
    return this._formBuilder.group({
      AllergyId: [''],
      PatientId: [''],
      VisitId: [''],  
      AllergyTypeID: [''],
      Name: [''],
      Allergydescription: [''],
      Aggravatedby: [''],
      Allivatedby: [''],
      Onsetdate: [''],
      AllergySeverityID: [''],
      Reaction: [''],
      ICD10: [''],
      SNOMED: [''],
      Notes: [''],
      //NoNewAllergic: ['']
    });
  }
  closeDialogRef() { }
  getDynamicAllergiesControl() {
    return <FormArray>this.updateProgressNotesForm.get('allergiesModel');
  }

  dynamicProblemListControls(): FormGroup {
    return this._formBuilder.group({
      PatientId:[''],
      VisitId: [''],
      ProblemlistId: [''],
      ProblemTypeID: [''],
      ProblemDescription: [''],
      ICD10Code: [''],
      SNOMEDCode: [''],
      Aggravatedby: [''],
      DiagnosedDate: [''],
      ResolvedDate: [''],
      Status: [''],
      AttendingPhysican: [''],
      AlleviatedBy: [''],
      FileName: [''],
      Notes: [''],
      //NoNewProblem: ['']
    });
  }

  getDynamicProblemListControls() {
    return <FormArray>this.updateProgressNotesForm.get('problemCollection');
  }

  dynamicMedicationControls() {
    return this._formBuilder.group({
      PrescribedDate: [''],
      PrescribedTime: [''],
      DrugCode: [''],
      PackageDescription: [''],
      RefusalReason: [''],
      Prescriber: [''],
      SubstitutionDrug: [''],
      MedicationStatus: [''],
      Quantity: [''],
      Units: [''],
      Refill: [''],
      MedicationDiagnosis: [''],
      MedicationSNOMED: [''],
      PrescriptionFor: [''],
      PrescribedDuring: [''],
      PrescriptionOrderType: [''],
      DispenseForm: [''],
      DosageForm: [''],
      Route: [''],
      MedicatedDate: [''],
      MedicatedTime: [''],
      DiscontinuedDate1: [''],
      SIG: [''],
      PatientInstructions: [''],
      SideEffectsDiscussed: [''],
      DispenseAsWritten: [''],
      DiscontinuedDate2: [''],
      ReconcileDate: [''],
      OrderNotPerformed: [''],
      RemindBefore: [''],
      IntervalBetweenMessages: [''],
      NoNewMedication: [''],
    });
  }
  getDynamicMedicationControls() {
    return <FormArray>this.updateProgressNotesForm.get('medicationModel');
  }

  dynamicNutritionControl(): FormGroup {
    return this._formBuilder.group({
      PatientId: [''],
      VisitId: [''],
      NutritionAssessmentID: [''],
      FoodIntakeTypeID: [''],
      EatRegularly: [''],
      RegularMeals: [''],
      Carvings: [''],
      DislikedIntake: [''],
      FoodAllergies: [''],
      Notes: [''],

      //FoodIntakeTypeDesc: [''],
      //IntakeTypeUnits: [''],
      //IntakeTypeFrequency: [''],
      //IntakeTypeNotes: [''],
      //NoNewNutrition: ['']
    });
  }
  getDynamicNutritionControl() {
    return <FormArray>this.updateProgressNotesForm.get('nutritionCollection');
  }
  ngOnInit() {
    this.updateProgressNotesForm = this._formBuilder.group({
      //Vitals
      vitalModel: this._formBuilder.group({
        PatientId: [''],
        VisitId: [''],
        VitalsId:[''],
        Height: [''],
        Weight: [''],
        BMI: [''],
        WaistCircumference: [''],
        BPSystolic: [''],
        BPDiastolic: [''],
        BPLocationID: [''],
        PatientPosition: [''],
        Temperature: [''],
        TemperatureLocation: [''],
        HeartRate: [''],
        RespiratoryRate: [''],
        O2Saturation: [''],
        BloodsugarRandom: [''],
        BloodsugarFasting: [''],
        BloodSugarPostpardinal: [''],
        PainArea: [''],
        PainScale: [''],
        LastMealtakenon: [''],
        LastMealdetails: [''],
        IsBloodPressure: [''],
        IsDiabetic:['']
      }),
      //Allergies
      allergiesModel: this._formBuilder.array([
        this.dynamicAllergiesControl()
      ]),
      //Problem list
      problemCollection: this._formBuilder.array([
        this.dynamicProblemListControls()
      ]),
      //Medication
      medicationModel: this._formBuilder.array([
        this.dynamicMedicationControls()
      ]),
      //Social History
      socialModel: this._formBuilder.group({
        PatientId: [''],
        VisitId: [''],
        SocialHistoryId: [''],
        Smoking: [''],
        SmokingDetails: [''],
        Drinking: [''],
        DrinkingDetails: [''],
        DrugHabitsDetails: [''],
        LifeStyleDetails: [''],
        Others: [''],
       // NoNewSocialHistory: [''],
      }),
      //ROS
      rosModel: this._formBuilder.group({
        PatientID: [''],
        VisitID: [''],
        ROSID: [''],
        //ROSGeneral
        Weightlossorgain : [''],
        Feverorchills : [''],
        Troublesleeping : [''],
        Fatigue : [''],
        GeneralWeakness : [''],
        GeneralOthers : [''],
        GeneralothersComments : [''],
        //ROS Skin
        Rashes : [''],
        SkinItching : [''],
        Colorchanges : [''],
        SkinLumps : [''],
        Dryness : [''],
        Hairandnailchanges : [''],
        SkinOthers : [''],
        SkinothersComments : [''],
        //ROSHead
        Headache : [''],
        Headinjury : [''],
        Others : [''],
        HeadothersComments : [''],
        //ROS Ears
        Decreasedhearing : [''],
        Earache : [''],
        Ringinginears : [''],
        Drainage : [''],
        EarOthers : [''],
        EarothersComments : [''],
        //ROS Eyes
        Vision : [''],
        Blurryordoublevision : [''],
        Cataracts : [''],
        Glassesorcontacts : [''],
        Flashinglights : [''],
        Lasteyeexam : [''],
        EyePain : [''],
        Specks : [''],
        Redness : [''],
        Glaucoma : [''],
        EyeOthers : [''],
        EyesothersComments : [''],
        //ROS Nose
        Stuffiness : [''],
        NoseItching : [''],
        Nosebleeds : [''],
        Discharge : [''],
        Hayfever : [''],
        Sinuspain : [''],
        NoseOthers : [''],
        NoseothersComments : [''],
        //ROS Throat
        Teeth : [''],
        Soretongue : [''],
        Thrush : [''],
        Gums : [''],
        Drymouth : [''],
        Nonhealingsores : [''],
        Bleeding : [''],
        Sorethroat : [''],
        Sinus : [''],
        Lastdentalexam : [''],
        Dentures : [''],
        Hoarseness : [''],
        ThroatOthers : [''],
        ThroatothersComments : [''],
        //ROS Neck
        NeckLumps : [''],
        NeckPain : [''],
        Swollenglands : [''],
        Stiffness : [''],
        NeckOthers : [''],
        NeckothersComments : [''],
        //ROS Respiratory
        Cough : [''],
        Coughingupblood : [''],
        Wheezing : [''],
        Sputum : [''],
        Shortnessofbreath : [''],
        Painfulbreathing : [''],
        RespiratoryOthers : [''],
        Respiratoryotherscomments : [''],
        //ROS Neurologic
        Dizziness : [''],
        Weakness : [''],
        Tremor : [''],
        Fainting : [''],
        Numbness : [''],
        Seizures : [''],
        Tingling : [''],
        NeurologicOthers : [''],
        Neurologicotherscomments : [''],
        //ROS Hematologic
        Easeofbruising : [''],
        Easeofbleeding : [''],
        HematologicOthers : [''],
        Hematologicotherscomments : [''],
        //ROS Psychiatric
        Nervousness : [''],
        Memoryloss : [''],
        Stress : [''],
        Depression : [''],
        PsychiatricOthers : [''],
        Psychiatricotherscomments : [''],
      }),     
      //Nutrition
      nutritionCollection: this._formBuilder.array([
        this.dynamicNutritionControl()
      ]),
      //Functional & Cognitive
      cognitiveModel: this._formBuilder.group({
        PatientID: [''],
        VisitID: [''],
        CognitiveID: [''],
        Gait: [''],
       // IsSideBySide: [''],
        SidebySide: [''],
        //IsSemiTandem: [''],
        Semitandem: [''],
        Neuromuscular: [''],
        Mobilitydevice: [''],
        Functionalstatus: [''],
        Cognitivestatus: [''],
        ICD10: [''],
        SNOMEDCode: [''],
        DiagnosisNotes: [''],
        PrimaryProcedure: [''], 
        Referral: [''],
        Notes: [''],
        Physicianname: [''],
        Hospital: [''],
      }),            
      //Nursing SignOff
      nursingModel: this._formBuilder.group({
        NursingId: [''],
        PatientID: [''],
        VisitID: [''],
        ObservationsNotes: [''],
        FirstaidOrDressingsNotes: [''],
        NursingProceduresNotes: [''],
        NursingNotes: [''],
        AdditionalInformation: [''],
      }),
    });

    
    this.vitalsFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.allergiesFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.problemlistFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.medicationFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.historyFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.rosFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.nutritionFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.functionalFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.nursingSignOffFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.nursingSignOff = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.setValueForVitals();
    this.bindBPLocations();
    this.bindAllergyTypes();
    this.bindAllergySeverities();
    this.bindAllDiagnosisCodes();
    //this.bindAllSnomedCTCodes();
    this.bindAllFoodIntakeTypes();
    this.bindAllFacilitiesForTriage();
    this.bindAllProvidersForTriage();
    this.bindAllAppointmentTypes();
    this.bindAllAppointmentStatuses();
    this.bindAllProblemTypes();
  }
  occasion1() {
    this.show1 = !this.show1;
  }
  occasion2() {
    this.show2 = !this.show2;
  }
  ros1() {
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

  //closeDialogRef() {
  //  this.dialogRef.close();
  //}
  bindBPLocations() {
    this.triageSvc.getAllBPLocations().then(data => {
      this.BPLocation = data;
    });
  }

  bindAllergyTypes() {
    this.triageSvc.getAllergyTypes().then(data => {
      this.allergyType = data;
    });
  }

  bindAllergySeverities() {
    this.triageSvc.getAllergySeverities().then(data => {
      this.AllergySeverities = data;
    });
  }

  bindAllDiagnosisCodes() {
    //this.triageSvc.getAllDiagnosisCodes().then(data => {
    //  this.diagnosisCode = data;
    //});
  }

  bindAllSnomedCTCodes() {
    this.triageSvc.getAllSnomedCTCodes('key').then(data => {
      this.snomedCTCode = data;
    });
  }

  bindAllFoodIntakeTypes() {
    this.triageSvc.getAllFoodIntakeTypes().then(data => {
      this.foodIntakeTypes = data;
    });
  }

  bindAllFacilitiesForTriage() {
    this.triageSvc.getAllFacilitiesForTriage().then(data => {
      this.facilities = data;
    });
  }

  bindAllProvidersForTriage() {
    this.triageSvc.getAllProvidersForTriage().then(data => {
      this.providers = data;
    });
  }

  bindAllAppointmentTypes() {
    this.triageSvc.getAllAppointmentTypes().then(data => {
      this.appointmentTypes = data;
    });
  }

  bindAllAppointmentStatuses() {
    this.triageSvc.getAllAppointmentStatuses().then(data => {
      this.appointmentStatuses = data;
      });
  }

  bindAllProblemTypes() {
    this.triageSvc.getAllProblemTypes().then(data => {
      this.problemTypes = data;
    });
  }

  setValueForVitals() {

    if (this.data.vitalModel != undefined && this.data.vitalModel != null) {
      delete this.data.vitalModel.BPLocation;
      delete this.data.vitalModel.CreatedDate;
      delete this.data.vitalModel.Createdby;
      delete this.data.vitalModel.ModifiedBy;
      delete this.data.vitalModel.ModifiedDate;

      this.updateProgressNotesForm.controls['vitalModel'].setValue(this.data.vitalModel);
    }
    if (this.data.socialModel != undefined && this.data.socialModel != null) {
      delete this.data.socialModel.CreatedBy;
      delete this.data.socialModel.CreatedDate;
      delete this.data.socialModel.ModifiedBy;
      delete this.data.socialModel.ModifiedDate;

      this.updateProgressNotesForm.controls['socialModel'].setValue(this.data.socialModel);
    }

    if (this.data.cognitiveModel != undefined && this.data.cognitiveModel != null) {
      delete this.data.cognitiveModel.CreatedBy;
      delete this.data.cognitiveModel.Createddate;
      delete this.data.cognitiveModel.ModifiedBy;
      delete this.data.cognitiveModel.ModifiedDate;

      this.updateProgressNotesForm.controls['cognitiveModel'].setValue(this.data.cognitiveModel);
    }
    if (this.data.rosModel != undefined && this.data.rosModel != null) {
      delete this.data.rosModel.Lastdentalexamdate;
      delete this.data.rosModel.Createddate;
      delete this.data.rosModel.CreatedBy;
      delete this.data.rosModel.ModifiedDate;
      delete this.data.rosModel.ModifiedBy;

      this.updateProgressNotesForm.controls['rosModel'].setValue(this.data.rosModel);
    }
    if (this.data.nursingModel != undefined && this.data.nursingModel != null) {
      delete this.data.nursingModel.Createddate;
      delete this.data.nursingModel.CreatedBy;
      delete this.data.nursingModel.ModifiedDate;
      delete this.data.nursingModel.ModifiedBy;

      this.updateProgressNotesForm.controls['nursingModel'].setValue(this.data.nursingModel);
    }    
    
    if (this.data.allergiesModel != undefined && this.data.allergiesModel != null) {
      this.isAllergy = true;
      this.allergiesCollection = this.data.allergiesModel;
    }

    if (this.data.problemCollection != undefined && this.data.problemCollection != null) {
      this.isProblemList = true;
      this.problemListCollection = this.data.problemCollection;
    }

    if (this.data.medicationModel != undefined && this.data.medicationModel != null) {
      this.isMedication = true;
      this.medicationCollection = this.data.medicationModel;
    }

    if (this.data.nutritionCollection != undefined && this.data.nutritionCollection != null) {
      this.isNutrition = true;
      this.nutritionCollection = this.data.nutritionCollection;
    }
    
  }

  setFormArrayValue(element: any, tempId: number) {

    if (tempId == 1) {
      delete element.AllergySeverityDesc;
      delete element.AllergyTypeDesc;
      delete element.CreatedDate;
      delete element.Createdby;
      delete element.ModifiedDate;
      delete element.Modifiedby;

      const allergy = <FormArray>this.updateProgressNotesForm.controls['allergiesModel'];
      for (let i = 0; i < allergy.length; i++) {
        allergy.controls[i].setValue(element);
      }
    }

    if (tempId == 3) {
      delete element.CreatedDate;
      delete element.Createdby;
      delete element.ModifiedDate;
      delete element.Modifiedby;
      delete element.ProblemTypeDesc;

      const problem = <FormArray>this.updateProgressNotesForm.controls['problemCollection'];
      for (let i = 0; i < problem.length; i++) {
        problem.controls[i].setValue(element);
      }
    }
    if (tempId == 4) {
      delete element.CreatedDate;
      delete element.Createdby;
      delete element.ModifiedDate;
      delete element.ModifiedBy;
      delete element.FoodIntakeTypeDesc;
     
      const nutrition = <FormArray>this.updateProgressNotesForm.controls['nutritionCollection'];
      for (let i = 0; i < nutrition.length; i++) {
        nutrition.controls[i].setValue(element);
      }
    }
  }
  
  updateVitalsData() {
    
    this.vitalsModel = this.updateProgressNotesForm.get('vitalModel').value;
    this.triageSvc.addUpdateVitalsforVisit(this.vitalsModel).then(res => res);

  } 

  addUpdateAllergy() {
    
    this.isAllergy = true;
    const allergy = <FormArray>this.updateProgressNotesForm.controls['allergiesModel'];

    for (let i = 0; i < allergy.length; i++) {      
        this.allergiesModel = new PatientAllergyModel();
      this.allergiesModel.PatientId = allergy.controls[i].get('PatientId').value;
      this.allergiesModel.VisitId = allergy.controls[i].get('VisitId').value;
        this.allergiesModel.AllergyId = allergy.controls[i].get('AllergyId').value ? allergy.controls[i].get('AllergyId').value:0;        
        this.allergiesModel.AllergyTypeID = allergy.controls[i].get('AllergyTypeID').value;
        this.allergiesModel.Name = allergy.controls[i].get('Name').value;
        this.allergiesModel.Allergydescription = allergy.controls[i].get('Allergydescription').value;
        this.allergiesModel.Aggravatedby = allergy.controls[i].get('Aggravatedby').value;
        this.allergiesModel.Alleviatedby = allergy.controls[i].get('Allivatedby').value;
        this.allergiesModel.Onsetdate = allergy.controls[i].get('Onsetdate').value;
        this.allergiesModel.AllergySeverityID = allergy.controls[i].get('AllergySeverityID').value;
        this.allergiesModel.Reaction = allergy.controls[i].get('Reaction').value;
        this.allergiesModel.ICD10 = allergy.controls[i].get('ICD10').value;
        this.allergiesModel.SNOMED = allergy.controls[i].get('SNOMED').value;
        this.allergiesModel.Notes = allergy.controls[i].get('Notes').value;


      for (let i = 0; i < this.allergiesCollection.length; i++) {
        if (this.allergiesModel.AllergyId) {
          if (this.allergiesCollection[i].AllergyId == this.allergiesModel.AllergyId) {
            this.allergiesCollection[i] = this.allergiesModel;
            this.updateProgressNotesForm.controls['allergiesModel'].reset();
            break;
          } else {
            this.allergiesCollection[i] = this.allergiesCollection[i];
          }
        } else {
          this.allergiesCollection.push(this.allergiesModel);
          this.updateProgressNotesForm.controls['allergiesModel'].reset();
          break;
        }
      }
      }   
  }

  updateAllergyCollection() {
    this.triageSvc.addUpdateAllergyCollection(this.allergiesCollection).then(res => res);
  }
  
  addUpdateProblemList() {

    this.isProblemList = true;
    const problemList = <FormArray>this.updateProgressNotesForm.controls['problemCollection'];
   
    for (let i = 0; i < problemList.length; i++) {
      this.problemListModel = new PatientProblemListModel();
      this.problemListModel.PatientId = problemList.controls[i].get('PatientId').value;
      this.problemListModel.VisitId = problemList.controls[i].get('VisitId').value;
      this.problemListModel.ProblemlistId = problemList.controls[i].get('ProblemlistId').value ? problemList.controls[i].get('ProblemlistId').value : 0;
      this.problemListModel.ProblemTypeID = problemList.controls[i].get('ProblemTypeID').value;
      this.problemListModel.ProblemDescription = problemList.controls[i].get('ProblemDescription').value;
      this.problemListModel.ICD10Code = problemList.controls[i].get('ICD10Code').value;
      this.problemListModel.SNOMEDCode = problemList.controls[i].get('SNOMEDCode').value;
      this.problemListModel.Aggravatedby = problemList.controls[i].get('Aggravatedby').value;
      this.problemListModel.DiagnosedDate = problemList.controls[i].get('DiagnosedDate').value;
      this.problemListModel.ResolvedDate = problemList.controls[i].get('ResolvedDate').value;
      this.problemListModel.Status = problemList.controls[i].get('Status').value;
      this.problemListModel.AttendingPhysican = problemList.controls[i].get('AttendingPhysican').value;
      this.problemListModel.AlleviatedBy = problemList.controls[i].get('AlleviatedBy').value;
      this.problemListModel.FileName = problemList.controls[i].get('FileName').value;
      this.problemListModel.Notes = problemList.controls[i].get('Notes').value;


      for (let i = 0; i < this.problemListCollection.length; i++) {
        if (this.problemListModel.ProblemlistId) {
          if (this.problemListCollection[i].ProblemlistId == this.problemListModel.ProblemlistId) {
            this.problemListCollection[i] = this.problemListModel;
            this.updateProgressNotesForm.controls['problemCollection'].reset();
            break;
          } else {
            this.problemListCollection[i] = this.problemListCollection[i];
          }
        } else {
          this.problemListCollection.push(this.problemListModel);
          this.updateProgressNotesForm.controls['problemCollection'].reset();
          break;
        }
      }
    }  
  }

  updateProblemListCollection() {
    this.triageSvc.addUpdateProblemListCollection(this.problemListCollection).then(res => res);
  }
 
  addUpdateMedication() {

    this.isMedication = true;
    const medication = <FormArray>this.updateProgressNotesForm.controls['dynamicMedication'];
    
      for (let i = 0; i < medication.length; i++) {
        this.medicationModel = new PatientMedicationHistoryModel();
        this.medicationModel.PatientId = 1;
        this.medicationModel.VisitId = 1;
        this.medicationModel.Prescribeddatetime = medication.controls[i].get('PrescribedDate').value;
        this.medicationModel.Drugname = medication.controls[i].get('DrugCode').value;       
        this.medicationModel.Prescriber = medication.controls[i].get('Prescriber').value;       
        this.medicationModel.MedicationStatusId = medication.controls[i].get('MedicationStatus').value;
        this.medicationModel.Quantity = medication.controls[i].get('Quantity').value;
        this.medicationModel.MedicationUnitsId = medication.controls[i].get('Units').value;        
        this.medicationModel.PrescriptionordertypeID = medication.controls[i].get('PrescriptionOrderType').value;
        this.medicationModel.DispenseformId = medication.controls[i].get('DispenseForm').value;
        this.medicationModel.DosageformId = medication.controls[i].get('DosageForm').value;
        this.medicationModel.RouteId = medication.controls[i].get('Route').value;        
        this.medicationModel.PatientInstructions = medication.controls[i].get('PatientInstructions').value;        

        this.medicationCollection.push(this.medicationModel);
        this.updateProgressNotesForm.controls['dynamicMedication'].reset();
    }   
  }

  updateMedicationCollection() {
    this.triageSvc.addUpdateMedicationHistoryCollection(this.medicationCollection).then(res => res);
  }

  updateSocialHistoryData() {
     this.socialHistoryModel = this.updateProgressNotesForm.get('socialModel').value;
    this.triageSvc.addUpdateSocialHistoryForVisit(this.socialHistoryModel).then(res => res);
  }

  updateROSData() {
    this.rosModel = this.updateProgressNotesForm.get('rosModel').value;
    this.triageSvc.addUpdateROSForVisit(this.rosModel).then(res => res);
  } 
  
  addUpdateNutrition() {

    this.isNutrition = true;
    const nutrition = <FormArray>this.updateProgressNotesForm.controls['nutritionCollection'];

    for (let i = 0; i < nutrition.length; i++) {
      this.nutritionModel = new NutritionAssessmentModel();
      this.nutritionModel.PatientId = nutrition.controls[i].get('PatientId').value;
      this.nutritionModel.VisitId = nutrition.controls[i].get('VisitId').value;
      this.nutritionModel.NutritionAssessmentID = nutrition.controls[i].get('NutritionAssessmentID').value ? nutrition.controls[i].get('NutritionAssessmentID').value : 0;
      this.nutritionModel.FoodIntakeTypeID = nutrition.controls[i].get('FoodIntakeTypeID').value;
      this.nutritionModel.EatRegularly = nutrition.controls[i].get('EatRegularly').value;
      this.nutritionModel.RegularMeals = nutrition.controls[i].get('RegularMeals').value;
      this.nutritionModel.Carvings = nutrition.controls[i].get('Carvings').value;
      this.nutritionModel.DislikedIntake = nutrition.controls[i].get('DislikedIntake').value;
      this.nutritionModel.FoodAllergies = nutrition.controls[i].get('FoodAllergies').value;
      this.nutritionModel.Notes = nutrition.controls[i].get('Notes').value;
     
      for (let i = 0; i < this.nutritionCollection.length; i++) {
        if (this.nutritionModel.NutritionAssessmentID) {
          if (this.nutritionCollection[i].NutritionAssessmentID == this.nutritionModel.NutritionAssessmentID) {
            this.nutritionCollection[i] = this.nutritionModel;
            this.updateProgressNotesForm.controls['nutritionCollection'].reset();
            break;
          } else {
            this.nutritionCollection[i] = this.nutritionCollection[i];
          }
        } else {
          this.nutritionCollection.push(this.nutritionModel);
          this.updateProgressNotesForm.controls['nutritionCollection'].reset();
          break;
        }
      }
    }   
      
  }

  updateNutritionCollection() {
    this.triageSvc.addUpdateNutritionCollection(this.nutritionCollection).then(res => res);
  }

  updateFunctionalCognitiveData() {
    this.functCognitiveModel = this.updateProgressNotesForm.get('cognitiveModel').value;
    this.triageSvc.addUpdateFunctionalandCognitiveForVisit(this.functCognitiveModel).then(res => res);
  } 

  updateNursingData() {
    this.nursingModel = this.updateProgressNotesForm.get('nursingModel').value;
    this.triageSvc.addUpdateNursingSignOffData(this.nursingModel).then(res => res);
  }

  deleteAllergy(data:any) {
    this.allergiesCollection.splice(this.allergiesCollection.indexOf(data), 1);
  }
  deleteProblemList(data: any) {
    this.problemListCollection.splice(this.problemListCollection.indexOf(data), 1);
  }
  deleteMedication(data: any) {
    this.medicationCollection.splice(this.medicationCollection.indexOf(data), 1);
  }
  deleteNutrition(data: any) {
    this.nutritionCollection.splice(this.nutritionCollection.indexOf(data), 1);
  }
}

