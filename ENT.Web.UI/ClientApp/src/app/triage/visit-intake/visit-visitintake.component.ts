//#region "List of imports "
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { MatAutocompleteTrigger, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { TableConfig } from "src/app/ux/columnConfig";
import { TriageService } from "src/app/triage/triage.service";
import { PatientVitalsModel } from "src/app/triage/models/patientVitalsModel";
import { PatientAllergyModel } from "src/app/triage/models/PatientAllergyModel";
import { PatientProblemListModel } from "src/app/triage/models/patientProblemListModel";
import { PatientSocialHistoryModel } from "src/app/triage/models/patientSocialHistoryModel";
import { NutritionAssessmentModel } from "src/app/triage/models/nutritionAssessmentModel";
import { FunctionalCognitiveModel } from "src/app/triage/models/functionalCognitiveModel";
import { PatientROSModel } from "src/app/triage/models/patientROSModel";
import { CustomHttpService } from "src/app/core/custom-http.service";
import { TriageVitalsCommonComponent } from "src/app/triage/triage-vitals-common.component";
import { NursingSignOffModel } from "src/app/triage/models/nursingSignOffModel";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { signOffMOdel } from "../../triage/models/signoffModel";
import { NewPatientService } from "src/app/patient/newPatient.service";
import { clsViewFile } from '../../patient/models/clsViewFile';
import { medicationModel } from "src/app/triage/models/medicationModel";
import { VisitService } from "src/app/visit/visit.service";
import { VisitViewPatientHistoryComponent } from "src/app/visit/visit-view-history/visit-viewPatientHistory.component";
import { UpdateAllergyComponent } from "./update-allergy/update-allergy.component";
import { UpdateProblemListTriageComponent } from "./update-problem-list/update-problem-list.component";
import { updateNutritionComponent } from "./update-nutrition/update-nutrition.component";
import { DomSanitizer } from '@angular/platform-browser';
//#endregion

@Component({
  selector: "app-VisitVisitintakeComponent",
  templateUrl: "visit-Visitintake.component.html",
  styleUrls: ["./visit-Visitintake.component.css"],
})

export class VisitVisitintakeComponent implements OnInit {

  //#region "Property Declaration"

  vitalForm: FormGroup;
  allergyForm: FormGroup;
  problemListForm: FormGroup;
  medicationForm: FormGroup;
  socialHistoryForm: FormGroup;
  rosForm: FormGroup;
  nutritionForm: FormGroup;
  functionCogForm: FormGroup;
  nursingForm: FormGroup;

  tableConfig: TableConfig = new TableConfig();
  visitIntakeData: any;
  patientId: number;
  visitId: number;
  patientvisitHistoryList: any;
  visitIntake: any;
  visitDandt: any[] = [];
  facilityId: number = 0;
  recordby: any[] = [];
  allergyStatusvalue: any;
  EatRegularlyvalue: any;
  IntakeCategoryValue: any;
  vitalDate: Date;
  vitalTimeHH: number;
  vitalTimeMin: number;
  isShow: boolean = false;
  isShow1: boolean = false;
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
  prescriptionOrderTypes: any;
  medicationUnits: any;
  medicationRoutes: any;
  medicationStatus: any;
  isAllergy = false;
  allergiesCollection = [];
  isProblemList = false;
  problemListCollection = [];
  isMedication = false;
  medicationCollection = [];
  isNutrition = false;
  nutritionCollection = [];
  show3: boolean = false;
  show4: boolean = false;
  show5: boolean = false;
  show6: boolean = false;
  show7: boolean = false;
  show8: boolean = false;
  show9: boolean = false;
  show10: boolean = false;
  show11: boolean = false;
  show12: boolean = false;
  show13: boolean = false;
  show14: boolean = false;
  smoking: any;
  drinking: any;
  recordedDuringVital: any = "";
  recordedDuringAllergy: any = "";
  recordedDuringProblemList: any = "";
  recordedDuringNutrition: any = "";
  recordedDuringRos: any = "";
  recordedDuringMedication: any = "";
  allergyrecord: any = "";
  allergyVisitDateandTime: any = "";
  medicationVisitDate: any = "";
  RosVisitDate: any = "";
  nutritionVisitDateandTime: any = "";
  nursingrecordedDuring: any = "";
  nursingVisitDate: any = "";
  problemstatusvalue: any;
  PatientPositionvalue: any;
  TemperatureLocationvalue: any;
  PainScaleValue: any;
  allergyDateTime: Date = new Date();
  nursedatesTime: Date;
  balanceList: any;
  mobilitieslist: any;
  cognitiveModelICDCode: any;
  recordedDuringcognitive: string = "";
  visitcognitiveID: any;
  cognitivecpt: any;
  Gaitvalue: any;
  problemlistVisitDateandTime: any = "";
  vitalVisitDateandTime: any = "";
  socialVisitDateandTime: any = "";
  socialrecordedDuring: any = "";
  functionvisitDateTime: any = "";
  filedata: any;
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
  signoffForm: FormGroup;
  vitalsModel: PatientVitalsModel = new PatientVitalsModel();
  allergiesModel: PatientAllergyModel = new PatientAllergyModel();
  problemListModel: PatientProblemListModel = new PatientProblemListModel();
  medicationHistoryModel: medicationModel = new medicationModel();
  medicationModelCollection: medicationModel[] = [];
  socialHistoryModel: PatientSocialHistoryModel = new PatientSocialHistoryModel();
  rosModel: PatientROSModel = new PatientROSModel();
  nutritionModel: NutritionAssessmentModel = new NutritionAssessmentModel();
  functCognitiveModel: FunctionalCognitiveModel = new FunctionalCognitiveModel();
  nursingSignOffModel: NursingSignOffModel = new NursingSignOffModel();
  signoffModel: signOffMOdel = new signOffMOdel();
  icdTool: string;
  cptTool: string;
  formdataArray: Array<FormData> = [];
  profilePics: any;
  imageFlag: boolean = true;
  FileUploadNursing: Array<File> = [];
  FileUploadProblemList: Array<File> = [];
  ViewFileNursing: Array<clsViewFile> = [];
  ViewFileProblemList: Array<clsViewFile> = [];
  signoffButton: boolean = false;
  hold: any;
  discontinue: any;
  refill: boolean;
  notes: boolean;
  drugName: any;
  diagnosisName: any;
  routeName: any;
  route: any;
  setValue: any;
  problemListSaveBtn: boolean = false;
  AllergySaveBtn: boolean = false;
  NutritionSaveBtn: boolean = false;
  showParticularRes: boolean = false;
  @ViewChild('multipleNursing', { static: true }) attachment: any;
  @ViewChild('multipleProblemList', { static: false }) attachmentProblemList: any;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICD: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCode', { static: false, read: MatAutocompleteTrigger }) triggerSnomed: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDCodeProblemList', { static: false, read: MatAutocompleteTrigger }) triggerICDProblemList: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCodeProblemList', { static: false, read: MatAutocompleteTrigger }) triggerSnomedProblemList: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerICDFunction: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerCPTFunction: MatAutocompleteTrigger;

  FileUploadProblemListNames: any[] = [];
  FileUploadNursingNames: any[] = [];

  itemNameList = [];
  diagnosisNameList = [];

  itemDrugId: number;
  itemDiagnosisId: number;
  //#endregion

  //#region "Constructor"
  constructor(
    private newPatientSvc: NewPatientService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private visitSvc: VisitService,
    private triageService: TriageService,
    private activeRoute: ActivatedRoute,
    private customHttpSvc: CustomHttpService,
    private util: UtilService,
    private sanitizer: DomSanitizer,
  ) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = false;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;

    this.tableConfig.columnConfig = [
      {
        PropertyName: "PatientName",
        DisplayName: "Patient Name",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "VisitDate",
        DisplayName: "Visit Date",
        DisplayMode: "DateTime",
        FormatString: "dd-MM-yyyy",
        LinkUrl: "",
      },
      {
        PropertyName: "Visittime",
        DisplayName: "Visit Time",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "ToConsult",
        DisplayName: "To Consult",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "urgencyType",
        DisplayName: "Urgency",
        DisplayMode: "Text",
        LinkUrl: "",
      },
    ];
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.activeRoute.params.subscribe((params) => {
      (this.patientId = params["PatientId"]),
        (this.visitId = params["VisitId"]);
    });

    this.signoffForm = this._formBuilder.group({
      UserName: ["", Validators.required],
      Password: ["", Validators.required],
    });

    this.vitalsFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.allergiesFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.problemlistFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.medicationFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.historyFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.rosFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.nutritionFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.functionalFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.nursingSignOffFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.nursingSignOff = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });

    this.vitalForm = this._formBuilder.group({
      PatientId: [""],
      VisitId: [""],
      VitalsId: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ["", Validators.required],
      VisitDateandTime: [""],
      recordedDuring: [""],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' })],
      Height: [""],
      Weight: [""],
      BMI: [""],
      WaistCircumference: [""],
      BPSystolic: [""],
      BPDiastolic: [""],
      BPLocationID: [""],
      PatientPosition: [""],
      Temperature: ["", Validators.required],
      TemperatureLocation: [""],
      HeartRate: [""],
      RespiratoryRate: [""],
      O2Saturation: [""],
      BloodsugarRandom: [""],
      BloodsugarFasting: [""],
      BloodSugarPostpardinal: [""],
      PainArea: [""],
      PainScale: [""],
      HeadCircumference: [""],
      LastMealtakenon: [""],
      LastMealdetails: [""],
      IsBloodPressure: ["", Validators.required],
      IsDiabetic: ["", Validators.required],
      Notes: [""],
    });

    this.allergyForm = this._formBuilder.group({
      allergiesModel: this._formBuilder.array([this.dynamicAllergiesControl()])
    });

    this.problemListForm = this._formBuilder.group({
      problemCollection: this._formBuilder.array([
        this.dynamicProblemListControls()
      ])
    });


    this.medicationForm = this._formBuilder.group({
      RecordedDateMedication: [new Date(), Validators.required],
      RecordedTimemedication: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      RecordedByMedication: ["", Validators.required],

      medicationModel: this._formBuilder.array([
        this.dynamicMedicationControl(),
      ]),
    });

    this.socialHistoryForm = this._formBuilder.group({
      PatientId: [""],
      VisitId: [""],
      SocialHistoryId: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ["", Validators.required],
      recordedDuring: [""],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      VisitDateandTime: [""],
      Smoking: [""],
      CigarettesPerDay: [""],
      Drinking: [""],
      ConsumptionPerDay: [""],
      DrugHabitsDetails: [""],
      LifeStyleDetails: [""],
      CountriesVisited: [""],
      DailyActivities: [""],
      AdditionalNotes: [""]
    });

    this.rosForm = this._formBuilder.group({
      PatientID: [""],
      VisitID: [""],
      ROSID: [""],
      VisitDate: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [""],
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

    this.nutritionForm = this._formBuilder.group({
      nutritionCollection: this._formBuilder.array([
        this.dynamicNutritionControl(),
      ])
    });

    this.functionCogForm = this._formBuilder.group({
      PatientID: [""],
      VisitID: [""],
      CognitiveID: [""],
      VisitDateandTime: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [""],
      RecordedBy: ["", Validators.required],
      Gait: [""],
      GaitNotes: [""],
      Balance: [""],
      BalanceNotes: [""],
      NeuromuscularNotes: [""],
      Mobility: [""],
      MobilitySupportDevice: [""],
      MobilityNotes: [""],
      Functionalstatus: [""],
      Cognitivestatus: [""],
      PrimaryDiagnosisNotes: [""],
      ICD10: [""],
      PrimaryProcedure: [""],
      CPT: [""],
      Physicianname: [""],
      Hospital: [""],
    });

    this.nursingForm = this._formBuilder.group({
      NursingId: [""],
      PatientID: [""],
      VisitID: [""],
      VisitDate: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [""],
      RecordedBy: ["", Validators.required],
      ObservationsNotes: [""],
      FirstaidOrDressingsNotes: [""],
      NursingProceduresNotes: [""],
      NursingNotes: [""],
      AdditionalInformation: [""],
    });

    this.bindAllProblemTypes();
    this.bindAllFoodIntakeTypes();
    this.getVisitsbyPatientID();
    this.getPatientVisitByVisitId();
    this.getVisitForPatient();
    this.getProviderNames();
    this.bindAllTreatmentCodes();
    this.bindBPLocations();
    this.bindAllergyTypes();
    this.bindAllergySeverities();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.bindAllFacilitiesForTriage();
    this.bindAllProvidersForTriage();
    this.bindAllAppointmentTypes();
    this.bindAllAppointmentStatuses();
    this.bindPrescriptionOrderTypes();
    this.bindMedicationRoutes();
    this.bindMedicationUnits();
    this.bindMedicationStatus();
    this.getvisitIntakeDataforVisit();
    this.getproblemstatusvalue();
    this.getPatientPositionvalue();
    this.getTemperatureLocationvalue();
    this.getPainScaleValue();
    this.getDrinking();
    this.getSmoking();
    this.getallergyStatusvalue();
    this.getIntakeCategoryValue();
    this.getEatRegularlyvalue();
    this.getBalanceListforIntake();
    this.GetMobilitiesforIntake();
    this.GetGaitvalue();
    this.bindRoute();
  }

  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
        allergy.controls[0].get("ICD10").setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
        allergy.controls[0].get("SNOMED").setValue('');
      }
    });

    this.triggerICDProblemList.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
        problemList.controls[0].get("ICD10Code").setValue('');
      }
    });

    this.triggerSnomedProblemList.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
        problemList.controls[0].get("SNOMEDCode").setValue('');
      }
    });
    this.triggerICDFunction.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.functionCogForm.get("ICD10").setValue('');
      }
    });

    this.triggerCPTFunction.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.functionCogForm.get("CPT").setValue('');
      }
    });
  }
  //#endregion

  //#region "get Dynamic Form Controls"

  dynamicMedicationControl(): FormGroup {
    return this._formBuilder.group({
      PatientmedicationId: [0],
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
    return <FormArray>this.medicationForm.get('medicationModel');
  }

  getePrescriptionDynamic() {
    return <FormArray>this.medicationForm.get('medicationModel');
  }

  dynamicAllergiesControl(): FormGroup {
    return this._formBuilder.group({
      AllergyTypeDesc: [""],
      AllergyTypeID: [""],
      Name: [""],
      Allergydescription: [""],
      Aggravatedby: [""],
      Alleviatedby: [""],
      Onsetdate: [""],
      AllergySeverityID: [""],
      AllergySeverityDesc: [""],
      Reaction: [""],
      Status: [""],
      ICD10: [""],
      SNOMED: [""],
      Notes: [""],
      VisitDateandTime: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [""],
      RecordedBy: ["", Validators.required],
      //NoNewAllergic: ['']
    });
  }

  getdynamicAllergiesControls() {
    return <FormArray>this.allergyForm.get("allergiesModel");
  }

  dynamicProblemListControls(): FormGroup {
    return this._formBuilder.group({
      ProblemlistId: [""],
      ProblemTypeDesc: [""],
      ProblemTypeID: [""],
      ProblemDescription: [""],
      ICD10Code: [""],
      SNOMEDCode: [""],
      Aggravatedby: [""],
      DiagnosedDate: [""],
      ResolvedDate: [""],
      Status: [""],
      AttendingPhysican: [""],
      AlleviatedBy: [""],
      FileName: [""],
      Notes: [""],
      VisitDateandTime: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [''],
      RecordedBy: ["", Validators.required],
      FileUpload: []
    });
  }

  getdynamicProblemListControls() {
    return <FormArray>this.problemListForm.get("problemCollection");
  }

  dynamicNutritionControl(): FormGroup {
    return this._formBuilder.group({
      FoodIntakeTypeDesc: [""],
      NutritionAssessmentID: [""],
      VisitId: [""],
      VisitDateandTime: [""],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }), Validators.required],
      recordedDuring: [""],
      RecordedBy: ["", Validators.required],
      PatientId: [""],
      IntakeCategory: [""],
      FoodIntakeTypeID: [""],
      EatRegularly: [""],
      RegularMeals: [""],
      Carvings: [""],
      DislikedIntake: [""],
      FoodAllergies: [""],
      Notes: [""],
      FoodName: [""],
      Units: [""],
      Frequency: [""],
      NutritionNotes: [""],
    });
  }

  getdynamicNutritionControls() {
    return <FormArray>this.nutritionForm.get("nutritionCollection");
  }
  //#endregion

  //#region "List of get Methods"
  getVisitDateAndTime() {
    this.triageService.getOneAdmittingPhysician(this.visitId).then((res) => {
      this.socialVisitDateandTime = res.VisitDateandTime;
      this.socialrecordedDuring = res.recordedDuring;
    });
  }
  getproblemstatusvalue() {
    this.triageService.getproblemstatusvalue().then((res) => {
      this.problemstatusvalue = res;
    });
  }
  getPatientPositionvalue() {
    this.triageService.getPatientPositionvalue().then((res) => {
      this.PatientPositionvalue = res;
    });
  }
  getTemperatureLocationvalue() {
    this.triageService.getTemperatureLocationvalue().then((res) => {
      this.TemperatureLocationvalue = res;
    });
  }
  getPainScaleValue() {
    this.triageService.getPainScaleValue().then((res) => {
      this.PainScaleValue = res;
    });
  }
  getVisitForPatient() {
    this.triageService.getVisitForPatient(this.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
      }
    });
  }
  getProviderNames() {
    this.triageService.getProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }
  getBalanceListforIntake() {
    this.triageService.GetBalanceListforIntake().then((res) => {
      this.balanceList = res;
    });
  }

  GetMobilitiesforIntake() {
    this.triageService.GetMobilitiesforIntake().then((res) => {
      this.mobilitieslist = res;
    });
  }

  GetGaitvalue() {
    this.triageService.GetGaitvalue().then((res) => {
      this.Gaitvalue = res;
    });
  }
  getallergyStatusvalue() {
    this.triageService.getallergyStatusvalue().then((res) => {
      this.allergyStatusvalue = res;
    });
  }
  getIntakeCategoryValue() {
    this.triageService.getIntakeCategoryValue().then((res) => {
      this.IntakeCategoryValue = res;
    });
  }
  getEatRegularlyvalue() {
    this.triageService.getEatRegularlyvalue().then((res) => {
      this.EatRegularlyvalue = res;
    });
  }
  getSmoking() {
    this.triageService.getsmoking().then((res) => {
      this.smoking = res;
    });
  }

  getDrinking() {
    this.triageService.getdrinking().then((res) => {
      this.drinking = res;
    });
  }

  ros101() {
    if (this.rosForm.get("GeneralOthers").value == false) {
      this.show3 = true;
    } else {
      this.show3 = false;
    }
  }
  ros2() {
    if (this.rosForm.get("SkinOthers").value == false) {
      this.show4 = true;
    } else {
      this.show4 = false;
    }
  }
  ros3() {
    if (this.rosForm.get("Others").value == false) {
      this.show5 = true;
    } else {
      this.show5 = false;
    }
  }
  ros4() {
    if (this.rosForm.get("EarOthers").value == false) {
      this.show6 = true;
    } else {
      this.show6 = false;
    }
  }
  ros5() {
    if (this.rosForm.get("EyeOthers").value == false) {
      this.show7 = true;
    } else {
      this.show7 = false;
    }
  }
  ros6() {
    if (this.rosForm.get("NoseOthers").value == false) {
      this.show8 = true;
    } else {
      this.show8 = false;
    }
  }
  ros7() {
    if (this.rosForm.get("ThroatOthers").value == false) {
      this.show9 = true;
    } else {
      this.show9 = false;
    }
  }
  ros8() {
    if (this.rosForm.get("NeckOthers").value == false) {
      this.show10 = true;
    } else {
      this.show10 = false;
    }
  }
  ros9() {
    if (this.rosForm.get("RespiratoryOthers").value == false) {
      this.show11 = true;
    } else {
      this.show11 = false;
    }
  }
  ros10() {
    if (this.rosForm.get("NeurologicOthers").value == false) {
      this.show12 = true;
    } else {
      this.show12 = false;
    }
  }
  ros11() {
    if (this.rosForm.get("HematologicOthers").value == false) {
      this.show13 = true;
    } else {
      this.show13 = false;
    }
  }
  ros12() {
    if (this.rosForm.get("PsychiatricOthers").value == false) {
      this.show14 = true;
    } else {
      this.show14 = false;
    }
  }

  getVisitsbyPatientID() {
    this.visitSvc.getVisitsbyPatientID(this.patientId).then((res) => {
      this.patientvisitHistoryList = res;
      if (this.patientvisitHistoryList.length == 0) {
        this.showParticularRes = false;
      }
      else {
        this.showParticularRes = true;
      }
    });
  }

  getPatientVisitByVisitId() {
    this.visitSvc.getPatientVisitByVisitId(this.visitId).then((res) => { });
  }

  //#endregion

  //#region "Visit history view/open"
  openEditReport(element) {
    this.triageService.getVisitIntakeDataForVisit(element.Item.PatientId, element.Item.VisitId).then((res) => {
      this.visitIntake = res;
      const dialogRef = this.dialog.open(TriageVitalsCommonComponent, {
        data: this.visitIntake,
        height: "auto",
      });
      dialogRef.afterClosed().subscribe((result) => { });
    });
  }

  openVisitViewReport(element: any) {
    this.visitSvc.getPatientVisitByVisitId(element.Item.VisitId).then((data) => {
      var visitDetails = data;
      const dialogRef = this.dialog.open(VisitViewPatientHistoryComponent, {
        data: visitDetails,
        width: "1200px",
      });
    });
  }
  //#endregion

  //#region "back navigation button Function"
  back() {
    this.router.navigate(["home/triage/triagelist"]);
  }
  //#endregion

  //#region "List Of Bind Methods"
  bindBPLocations() {
    this.triageService.getAllBPLocations().then((data) => {
      this.BPLocation = data;
      this.vitalForm.get("BPLocationID").setValue(this.BPLocation[0].BPLocationId);
    });
  }

  bindAllergyTypes() {
    this.triageService.getAllergyTypes().then((data) => {
      this.allergyType = data;
      const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
      allergy.controls[0].get("AllergyTypeID").setValue(this.allergyType[0].AllergyTypeID);
    });
  }

  bindAllergySeverities() {
    this.triageService.getAllergySeverities().then((data) => {
      this.AllergySeverities = data;
      const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
      allergy.controls[0].get("AllergySeverityID").setValue(this.AllergySeverities[0].AllergySeverityId)
    });
  }

  bindAllDiagnosisCodes() {
    const allergyICDCode = <FormArray>(this.allergyForm.controls["allergiesModel"]);

    for (var i = 0; i < allergyICDCode.length; i++) {
      if (
        allergyICDCode.controls[i].get("ICD10").value != null &&
        allergyICDCode.controls[i].get("ICD10").value != " "
      ) {
        allergyICDCode.controls[i].get("ICD10").valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllDiagnosisCodes(key).then((data) => {
                this.diagnosisCode = data;
              });
            }
          }
        });
      }
    }

    const problem = <FormArray>(
      this.problemListForm.controls["problemCollection"]
    );
    for (var i = 0; i < problem.length; i++) {
      if (
        problem.controls[i].get("ICD10Code").value != null &&
        problem.controls[i].get("ICD10Code").value != " "
      ) {
        problem.controls[i]
          .get("ICD10Code")
          .valueChanges.subscribe((key: string) => {
            if (key != null) {
              if (key.length > 2) {
                this.triageService.getAllDiagnosisCodes(key).then((data) => {
                  this.diagnosisCode = data;
                });
              }
            }
          });
      }
    }
    if (
      this.functionCogForm.get("ICD10").value != null &&
      this.functionCogForm.get("ICD10").value != " "
    ) {
      this.functionCogForm.get("ICD10").valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.triageService.getAllDiagnosisCodes(key).then((data) => {
              this.diagnosisCode = data;
              this.cognitiveModelICDCode = data;
            });
          }
          else {
            this.icdTool = null;
          }
        }
      });
    }
  }

  setICDTool(value1, value2) {
    this.icdTool = value1 + ' ' + value2;
  }

  bindAllSnomedCTCodes() {
    const allergy = <FormArray>this.allergyForm.controls["allergiesModel"];
    for (var i = 0; i < allergy.length; i++) {
      if (
        allergy.controls[i].get("SNOMED").value != null &&
        allergy.controls[i].get("SNOMED").value != " "
      ) {
        allergy.controls[i].get("SNOMED").valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllSnomedCTCodes(key).then((data) => {
                this.snomedCTCode = data;
              });
            }
          }
        });
      }
    }

    const problem = <FormArray>(
      this.problemListForm.controls["problemCollection"]
    );
    for (var i = 0; i < problem.length; i++) {
      if (
        problem.controls[i].get("SNOMEDCode").value != null &&
        problem.controls[i].get("SNOMEDCode").value != " "
      ) {
        problem.controls[i].get("SNOMEDCode").valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllSnomedCTCodes(key).then((data) => {
                this.snomedCTCode = data;
              });
            }
          }
        });
      }
    }

    if (
      this.functionCogForm.get("CPT").value != null &&
      this.functionCogForm.get("CPT").value != " "
    ) {
      this.functionCogForm.get("CPT")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllSnomedCTCodes(key).then((data) => {
                this.snomedCTCode = data;
              });
            }
          }
        });
    }
  }

  bindAllTreatmentCodes() {
    this.functionCogForm.get("CPT")
      .valueChanges.subscribe((key1: string) => {
        if (key1 != null) {
          if (key1.length > 2) {
            this.triageService.getAllTreatmentCodes(key1).then((data) => {
              this.cognitivecpt = data;
            });
          }
          else {
            this.cptTool = null;
          }
        }
      });
  }

  setCPTTooltip(value1, value2) {
    this.cptTool = value1 + ' ' + value2;
  }

  bindAllFoodIntakeTypes() {
    this.triageService.getAllFoodIntakeTypes().then((data) => {
      this.foodIntakeTypes = data;
      const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]);
      nutrition.controls[0].get("FoodIntakeTypeID").setValue(this.foodIntakeTypes[0].FoodIntaketypeID);
    });
  }

  bindAllFacilitiesForTriage() {
    this.triageService.getAllFacilitiesForTriage().then((data) => {
      this.facilities = data;
    });
  }

  bindAllProvidersForTriage() {
    this.triageService.getAllProvidersForTriage().then((data) => {
      this.providers = data;
    });
  }

  bindAllAppointmentTypes() {
    this.triageService.getAllAppointmentTypes().then((data) => {
      this.appointmentTypes = data;
    });
  }

  bindAllAppointmentStatuses() {
    this.triageService.getAllAppointmentStatuses().then((data) => {
      this.appointmentStatuses = data;
    });
  }

  bindAllProblemTypes() {
    this.triageService.getAllProblemTypes().then((data) => {
      this.problemTypes = data;
      const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);

      problemList.controls[0].get("ProblemTypeID").setValue(this.problemTypes[0].ProblemTypeId)


    });
  }

  bindPrescriptionOrderTypes() {
    this.triageService.getAllPrescriptionOrderTypes().then((data) => {
      this.prescriptionOrderTypes = data;
    });
  }

  bindMedicationUnits() {
    this.triageService.getMedicationUnits().then((data) => {
      this.medicationUnits = data;
    });
  }

  bindMedicationRoutes() {
    this.triageService.getMedicationRoutes().then((data) => {
      this.medicationRoutes = data;
    });
  }

  bindMedicationStatus() {
    this.triageService.getAllMedicationStatus().then((data) => {
      this.medicationStatus = data;
    });
  }
  //#endregion

  //#region "Set Values - Get All Data for initial Bind"
  getvisitIntakeDataforVisit() {
    this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      this.visitIntakeData = res;
      if (this.visitIntakeData != null) {
        //vitals
        if (this.visitIntakeData.vitalModel.PatientId != 0) {
          this.vitalVisitDateandTime = this.visitIntakeData.vitalModel.visitDateandTime;
          this.recordedDuringVital = this.visitIntakeData.vitalModel.recordedDuring;
          this.vitalForm.get("RecordedDate").setValue(new Date(this.visitIntakeData.vitalModel.RecordedDate));
          this.vitalForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.vitalModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
          this.vitalForm.get("RecordedBy").setValue(this.visitIntakeData.vitalModel.RecordedBy);
          this.vitalForm.get("Height").setValue(this.visitIntakeData.vitalModel.Height == 0 ? "" : this.visitIntakeData.vitalModel.Height);
          this.vitalForm.get("Weight").setValue(this.visitIntakeData.vitalModel.Weight == 0 ? "" : this.visitIntakeData.vitalModel.Weight);
          this.vitalForm.get("BMI").setValue(this.visitIntakeData.vitalModel.BMI == 0 ? "" : this.visitIntakeData.vitalModel.BMI);
          this.vitalForm.get("WaistCircumference").setValue((this.visitIntakeData.vitalModel.WaistCircumference));
          this.vitalForm.get("BPSystolic").setValue(this.visitIntakeData.vitalModel.BPSystolic == 0 ? "" : this.visitIntakeData.vitalModel.BPSystolic);
          this.vitalForm.get("BPDiastolic").setValue(this.visitIntakeData.vitalModel.BPDiastolic == 0 ? "" : this.visitIntakeData.vitalModel.BPDiastolic);
          //    this.vitalForm.get("BPLocationID").setValue(this.visitIntakeData.vitalModel.BPLocationID );
          this.vitalForm.get("PatientPosition").setValue(this.visitIntakeData.vitalModel.PatientPosition == 0 ? "" : this.visitIntakeData.vitalModel.PatientPosition);
          this.vitalForm.get("Temperature").setValue(this.visitIntakeData.vitalModel.Temperature == 0 ? "" : this.visitIntakeData.vitalModel.Temperature);
          this.vitalForm.get("TemperatureLocation").setValue(this.visitIntakeData.vitalModel.TemperatureLocation == 0 ? "" : this.visitIntakeData.vitalModel.TemperatureLocation);
          this.vitalForm.get("HeartRate").setValue(this.visitIntakeData.vitalModel.HeartRate == 0 ? "" : this.visitIntakeData.vitalModel.HeartRate);
          this.vitalForm.get("RespiratoryRate").setValue(this.visitIntakeData.vitalModel.RespiratoryRate == 0 ? "" : this.visitIntakeData.vitalModel.RespiratoryRate);
          this.vitalForm.get("O2Saturation").setValue(this.visitIntakeData.vitalModel.O2Saturation == 0 ? "" : this.visitIntakeData.vitalModel.O2Saturation);
          this.vitalForm.get("BloodsugarRandom").setValue(this.visitIntakeData.vitalModel.BloodsugarRandom == 0 ? "" : this.visitIntakeData.vitalModel.BloodsugarRandom);
          this.vitalForm.get("BloodsugarFasting").setValue(this.visitIntakeData.vitalModel.BloodsugarFasting == 0 ? "" : this.visitIntakeData.vitalModel.BloodsugarFasting);
          this.vitalForm.get("BloodSugarPostpardinal").setValue(this.visitIntakeData.vitalModel.BloodSugarPostpardinal == 0 ? "" : this.visitIntakeData.vitalModel.BloodSugarPostpardinal);
          this.vitalForm.get("PainArea").setValue(this.visitIntakeData.vitalModel.PainArea);
          this.vitalForm.get("PainScale").setValue(this.visitIntakeData.vitalModel.PainScale == 0 ? "" : this.visitIntakeData.vitalModel.PainScale);
          this.vitalForm.get("HeadCircumference").setValue(this.visitIntakeData.vitalModel.HeadCircumference == 0 ? "" : this.visitIntakeData.vitalModel.HeadCircumference);
          this.vitalForm.get("LastMealtakenon").setValue(this.visitIntakeData.vitalModel.LastMealtakenon);
          this.vitalForm.get("LastMealdetails").setValue(this.visitIntakeData.vitalModel.LastMealdetails);
          this.vitalForm.get("IsDiabetic").setValue(this.visitIntakeData.vitalModel.IsDiabetic);
          this.vitalForm.get("IsBloodPressure").setValue(this.visitIntakeData.vitalModel.IsBloodPressure);
          this.vitalForm.get("Notes").setValue(this.visitIntakeData.vitalModel.Notes);
        }

        if (this.visitIntakeData.vitalModel.VisitId == 0) {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.vitalVisitDateandTime = res.VisitDateandTime;
              this.recordedDuringVital = res.recordedDuring;
            }
          });
        }

        if ((this.visitIntakeData.vitalModel != null && this.visitIntakeData.vitalModel.signOffstatus == "Yes")
          || this.visitIntakeData.nursingModel.signOffstatus == "Yes"
          || this.visitIntakeData.cognitiveModel.signOffstatus == "Yes"
          || (this.visitIntakeData.allergiesModel.length > 0 && this.visitIntakeData.allergiesModel[0].signOffstatus == "Yes")
          || this.visitIntakeData.rosModel.signOffstatus == "Yes"
          || this.visitIntakeData.socialModel.signOffstatus == "Yes"
          || (this.visitIntakeData.nutritionCollection.length > 0 && this.visitIntakeData.nutritionCollection[0].signOffstatus == "Yes")
          || (this.visitIntakeData.medicationModel.length > 0 && this.visitIntakeData.medicationModel[0].signOffstatus == "Yes")
          || (this.visitIntakeData.problemCollection.length > 0 && this.visitIntakeData.problemCollection[0].signOffstatus == "Yes")) {
          this.isShow = true;
          this.isShow1 = true;
          this.signoffButton = true;
          this.vitalForm.disable();
          this.allergyForm.disable();
          this.problemListForm.disable();
          this.medicationForm.disable();
          this.medicationForm.controls['medicationModel'].disable();
          this.socialHistoryForm.disable();
          this.rosForm.disable();
          this.nutritionForm.disable();
          this.functionCogForm.disable();
          this.nursingForm.disable();
        }
        //allergies
        if (this.visitIntakeData.allergiesModel.length != 0) {
          if (this.visitIntakeData.allergiesModel.length == 1) {
            const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
            for (var i = 0; i < allergy.length; i++) {
              allergy.controls[i].get("AllergyTypeID").setValue(this.visitIntakeData.allergiesModel[0].AllergyTypeID);
              allergy.controls[i].get("RecordedDate").setValue(new Date(this.visitIntakeData.allergiesModel[0].RecordedDate));
              allergy.controls[i].get("RecordedTime").setValue(new Date(this.visitIntakeData.allergiesModel[0].RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
              this.allergyVisitDateandTime = this.visitIntakeData.allergiesModel[0].visitDateandTime;
              this.allergyrecord = this.visitIntakeData.allergiesModel[0].recordedDuring;
              allergy.controls[i].get("RecordedBy").setValue(this.visitIntakeData.allergiesModel[0].RecordedBy);
              allergy.controls[i].get("Name").setValue(this.visitIntakeData.allergiesModel[0].Name);
              allergy.controls[i].get("Allergydescription").setValue(this.visitIntakeData.allergiesModel[0].Allergydescription);
              allergy.controls[i].get("Aggravatedby").setValue(this.visitIntakeData.allergiesModel[0].Aggravatedby);
              allergy.controls[i].get("Alleviatedby").setValue(this.visitIntakeData.allergiesModel[0].Alleviatedby);
              allergy.controls[i].get("Onsetdate").setValue(this.visitIntakeData.allergiesModel[0].Onsetdate);
              allergy.controls[i].get("AllergySeverityID").setValue(this.visitIntakeData.allergiesModel[0].AllergySeverityID);
              allergy.controls[i].get("Reaction").setValue(this.visitIntakeData.allergiesModel[0].Reaction);
              allergy.controls[i].get("Status").setValue(this.visitIntakeData.allergiesModel[0].Status);
              allergy.controls[i].get("ICD10").setValue(this.visitIntakeData.allergiesModel[0].ICD10);
              allergy.controls[i].get("SNOMED").setValue(this.visitIntakeData.allergiesModel[0].SNOMED);
              allergy.controls[i].get("Notes").setValue(this.visitIntakeData.allergiesModel[0].Notes);
            }
          } else if (this.visitIntakeData.allergiesModel.length > 1) {
            this.isAllergy = true;
            this.allergiesCollection = this.visitIntakeData.allergiesModel;
            this.allergyVisitDateandTime = this.visitIntakeData.allergiesModel[0].visitDateandTime;
            this.allergyrecord = this.visitIntakeData.allergiesModel[0].recordedDuring;
          }
        }
        if (this.visitIntakeData.allergiesModel.length == 0) {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.allergyVisitDateandTime = res.VisitDateandTime;
              this.allergyrecord = res.recordedDuring;
            }
          });
        }


        //problemlist
        if (this.visitIntakeData.problemCollection.length != 0) {
          if (this.visitIntakeData.problemCollection.length == 1) {
            const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]
            );
            for (var i = 0; i < problemList.length; i++) {
              if (this.visitIntakeData.problemCollection[0].filePath.length > 0) {
                this.setFileDataProblemList(this.visitIntakeData.problemCollection[0].filePath);
              }
              problemList.controls[i].get("Aggravatedby").setValue(this.visitIntakeData.problemCollection[0].Aggravatedby);
              this.problemlistVisitDateandTime = this.visitIntakeData.problemCollection[0].visitDateandTime;
              this.recordedDuringProblemList = this.visitIntakeData.problemCollection[0].recordedDuring;
              problemList.controls[i].get("RecordedDate").setValue(new Date(this.visitIntakeData.problemCollection[0].RecordedDate));
              problemList.controls[i].get("RecordedTime").setValue(new Date(this.visitIntakeData.problemCollection[0].RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
              problemList.controls[i].get("RecordedBy").setValue(this.visitIntakeData.problemCollection[0].RecordedBy); problemList.controls[i].get("ProblemTypeID").setValue(this.visitIntakeData.problemCollection[0].ProblemTypeID);
              problemList.controls[i].get("ProblemDescription").setValue(this.visitIntakeData.problemCollection[0].ProblemDescription);
              problemList.controls[i].get("ICD10Code").setValue(this.visitIntakeData.problemCollection[0].ICD10Code);
              problemList.controls[i].get("SNOMEDCode").setValue(this.visitIntakeData.problemCollection[0].SNOMEDCode);
              problemList.controls[i].get("AlleviatedBy").setValue(this.visitIntakeData.problemCollection[0].AlleviatedBy);
              problemList.controls[i].get("DiagnosedDate").setValue(this.visitIntakeData.problemCollection[0].DiagnosedDate);
              problemList.controls[i].get("Status").setValue((this.visitIntakeData.problemCollection[0].Status));
              problemList.controls[i].get("ResolvedDate").setValue(this.visitIntakeData.problemCollection[0].ResolvedDate);
              problemList.controls[i].get("AttendingPhysican").setValue(this.visitIntakeData.problemCollection[0].AttendingPhysican);
              problemList.controls[i].get("Notes").setValue(this.visitIntakeData.problemCollection[0].Notes);
            }
          } else if (this.visitIntakeData.problemCollection.length > 1) {
            this.problemListCollection = this.visitIntakeData.problemCollection;

            this.isProblemList = true;
            this.problemlistVisitDateandTime = this.visitIntakeData.problemCollection[0].visitDateandTime;
            this.recordedDuringProblemList = this.visitIntakeData.problemCollection[0].recordedDuring;

            for (let index = 0; index < this.problemListCollection.length; index++) {
              this.problemListCollection[index].file = this.bindFileData(this.problemListCollection[index].filePath);
              this.problemListCollection.splice(index, 1, this.problemListCollection[index])
            }
          }
        } else {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.problemlistVisitDateandTime = res.VisitDateandTime;
              this.recordedDuringProblemList = res.recordedDuring;
            }
          });
        }
        //social
        if (this.visitIntakeData.socialModel.PatientId != 0) {
          this.socialVisitDateandTime = this.visitIntakeData.socialModel.visitDateandTime;
          this.socialrecordedDuring = this.visitIntakeData.socialModel.recordedDuring;
          this.socialHistoryForm.get("RecordedDate").setValue(new Date(this.visitIntakeData.socialModel.RecordedDate));
          this.socialHistoryForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.socialModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
          this.socialHistoryForm.get("RecordedBy").setValue(this.visitIntakeData.socialModel.RecordedBy);
          this.socialHistoryForm.get("Smoking").setValue(this.visitIntakeData.socialModel.Smoking);
          this.socialHistoryForm.get("CigarettesPerDay").setValue(this.visitIntakeData.socialModel.CigarettesPerDay);
          this.socialHistoryForm.get("Drinking").setValue(this.visitIntakeData.socialModel.Drinking);
          this.socialHistoryForm.get("ConsumptionPerDay").setValue(this.visitIntakeData.socialModel.ConsumptionPerDay);
          this.socialHistoryForm.get("DrugHabitsDetails").setValue(this.visitIntakeData.socialModel.DrugHabitsDetails);
          this.socialHistoryForm.get("LifeStyleDetails").setValue(this.visitIntakeData.socialModel.LifeStyleDetails);
          this.socialHistoryForm.get("CountriesVisited").setValue(this.visitIntakeData.socialModel.CountriesVisited);
          this.socialHistoryForm.get("DailyActivities").setValue(this.visitIntakeData.socialModel.DailyActivities);
          this.socialHistoryForm.get("AdditionalNotes").setValue(this.visitIntakeData.socialModel.AdditionalNotes);
        } else {
          this.getVisitDateAndTime();
        }
        //ros set
        if (this.visitIntakeData.rosModel.PatientID != 0) {
          if (this.visitIntakeData.rosModel) {
            if (this.visitIntakeData.rosModel.GeneralothersComments) {
              this.show3 = true;
            }
            if (this.visitIntakeData.rosModel.SkinothersComments) {
              this.show4 = true;
            }
            if (this.visitIntakeData.rosModel.HeadothersComments) {
              this.show5 = true;
            }
            if (this.visitIntakeData.rosModel.EarothersComments) {
              this.show6 = true;
            }
            if (this.visitIntakeData.rosModel.EyesothersComments) {
              this.show7 = true;
            }
            if (this.visitIntakeData.rosModel.NoseothersComments) {
              this.show8 = true;
            }
            if (this.visitIntakeData.rosModel.ThroatothersComments) {
              this.show9 = true;
            }
            if (this.visitIntakeData.rosModel.NeckothersComments) {
              this.show10 = true;
            }
            if (this.visitIntakeData.rosModel.Respiratoryotherscomments) {
              this.show11 = true;
            }
            if (this.visitIntakeData.rosModel.Neurologicotherscomments) {
              this.show12 = true;
            }
            if (this.visitIntakeData.rosModel.Hematologicotherscomments) {
              this.show13 = true;
            }
            if (this.visitIntakeData.rosModel.Psychiatricotherscomments) {
              this.show14 = true;
            }
          }
          this.rosForm.get("RecordedDate").setValue(new Date(this.visitIntakeData.rosModel.RecordedDate));
          this.rosForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.rosModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
          this.rosForm.get("RecordedBy").setValue(this.visitIntakeData.rosModel.RecordedBy);

          this.RosVisitDate = this.visitIntakeData.rosModel.visitDateandTime;
          this.recordedDuringRos = this.visitIntakeData.rosModel.recordedDuring;

          //General
          this.rosForm.get("Weightlossorgain").setValue(this.visitIntakeData.rosModel.Weightlossorgain);
          this.rosForm.get("Feverorchills").setValue(this.visitIntakeData.rosModel.Feverorchills);
          this.rosForm.get("Troublesleeping").setValue(this.visitIntakeData.rosModel.Troublesleeping);
          this.rosForm.get("Fatigue").setValue(this.visitIntakeData.rosModel.Fatigue);
          this.rosForm.get("GeneralWeakness").setValue(this.visitIntakeData.rosModel.GeneralWeakness);
          this.rosForm.get("GeneralOthers").setValue(this.visitIntakeData.rosModel.GeneralOthers);
          this.rosForm.get("GeneralothersComments").setValue(this.visitIntakeData.rosModel.GeneralothersComments);

          //skin
          this.rosForm.get("Rashes").setValue(this.visitIntakeData.rosModel.Rashes);
          this.rosForm.get("SkinItching").setValue(this.visitIntakeData.rosModel.SkinItching);
          this.rosForm.get("Colorchanges").setValue(this.visitIntakeData.rosModel.Colorchanges);
          this.rosForm.get("SkinLumps").setValue(this.visitIntakeData.rosModel.SkinLumps);
          this.rosForm.get("Dryness").setValue(this.visitIntakeData.rosModel.Dryness);
          this.rosForm.get("Hairandnailchanges").setValue(this.visitIntakeData.rosModel.Hairandnailchanges);
          this.rosForm.get("SkinOthers").setValue(this.visitIntakeData.rosModel.SkinOthers);
          this.rosForm.get("SkinothersComments").setValue(this.visitIntakeData.rosModel.SkinothersComments);

          //Head
          this.rosForm.get("Headache").setValue(this.visitIntakeData.rosModel.Headache);
          this.rosForm.get("Headinjury").setValue(this.visitIntakeData.rosModel.Headinjury);
          this.rosForm.get("Others").setValue(this.visitIntakeData.rosModel.Others);
          this.rosForm.get("HeadothersComments").setValue(this.visitIntakeData.rosModel.HeadothersComments);

          //Ears
          this.rosForm.get("Decreasedhearing").setValue(this.visitIntakeData.rosModel.Decreasedhearing);
          this.rosForm.get("Earache").setValue(this.visitIntakeData.rosModel.Earache);
          this.rosForm.get("Ringinginears").setValue(this.visitIntakeData.rosModel.Ringinginears);
          this.rosForm.get("Drainage").setValue(this.visitIntakeData.rosModel.Drainage);
          this.rosForm.get("EarOthers").setValue(this.visitIntakeData.rosModel.EarOthers);
          this.rosForm.get("EarothersComments").setValue(this.visitIntakeData.rosModel.EarothersComments);

          //Eyes
          this.rosForm.get("Vision").setValue(this.visitIntakeData.rosModel.Vision);
          this.rosForm.get("Blurryordoublevision").setValue(this.visitIntakeData.rosModel.Blurryordoublevision);
          this.rosForm.get("Cataracts").setValue(this.visitIntakeData.rosModel.Cataracts);
          this.rosForm.get("Glassesorcontacts").setValue(this.visitIntakeData.rosModel.Glassesorcontacts);
          this.rosForm.get("Flashinglights").setValue(this.visitIntakeData.rosModel.Flashinglights);
          this.rosForm.get("Lasteyeexam").setValue(this.visitIntakeData.rosModel.Lasteyeexam);
          this.rosForm.get("EyePain").setValue(this.visitIntakeData.rosModel.EyePain);
          this.rosForm.get("Specks").setValue(this.visitIntakeData.rosModel.Specks);
          this.rosForm.get("Redness").setValue(this.visitIntakeData.rosModel.Redness);
          this.rosForm.get("Glaucoma").setValue(this.visitIntakeData.rosModel.Glaucoma);
          this.rosForm.get("EyeOthers").setValue(this.visitIntakeData.rosModel.EyeOthers);
          this.rosForm.get("EyesothersComments").setValue(this.visitIntakeData.rosModel.EyesothersComments);

          //Nose
          this.rosForm.get("Stuffiness").setValue(this.visitIntakeData.rosModel.Stuffiness);
          this.rosForm.get("NoseItching").setValue(this.visitIntakeData.rosModel.NoseItching);
          this.rosForm.get("Nosebleeds").setValue(this.visitIntakeData.rosModel.Nosebleeds);
          this.rosForm.get("Discharge").setValue(this.visitIntakeData.rosModel.Discharge);
          this.rosForm.get("Hayfever").setValue(this.visitIntakeData.rosModel.Hayfever);
          this.rosForm.get("Sinuspain").setValue(this.visitIntakeData.rosModel.Sinuspain);
          this.rosForm.get("NoseOthers").setValue(this.visitIntakeData.rosModel.NoseOthers);
          this.rosForm.get("NoseothersComments").setValue(this.visitIntakeData.rosModel.NoseothersComments);

          //Throat
          this.rosForm.get("Teeth").setValue(this.visitIntakeData.rosModel.Teeth);
          this.rosForm.get("Soretongue").setValue(this.visitIntakeData.rosModel.Soretongue);
          this.rosForm.get("Thrush").setValue(this.visitIntakeData.rosModel.Thrush);
          this.rosForm.get("Gums").setValue(this.visitIntakeData.rosModel.Gums);
          this.rosForm.get("Drymouth").setValue(this.visitIntakeData.rosModel.Drymouth);
          this.rosForm.get("Nonhealingsores").setValue(this.visitIntakeData.rosModel.Nonhealingsores);
          this.rosForm.get("Bleeding").setValue(this.visitIntakeData.rosModel.Bleeding);
          this.rosForm.get("Sorethroat").setValue(this.visitIntakeData.rosModel.Sorethroat);
          this.rosForm.get("Sinus").setValue(this.visitIntakeData.rosModel.Sinus);
          this.rosForm.get("Lastdentalexam").setValue(this.visitIntakeData.rosModel.Lastdentalexam);
          //    this.patientROSform.get('Lastdentalexamdate').setValue(this.visitIntakeData.rosModel.Lastdentalexamdate);
          this.rosForm.get("Dentures").setValue(this.visitIntakeData.rosModel.Dentures);
          this.rosForm.get("Hoarseness").setValue(this.visitIntakeData.rosModel.Hoarseness);
          this.rosForm.get("ThroatOthers").setValue(this.visitIntakeData.rosModel.ThroatOthers);
          this.rosForm.get("ThroatothersComments").setValue(this.visitIntakeData.rosModel.ThroatothersComments);

          //Neck
          this.rosForm.get("NeckLumps").setValue(this.visitIntakeData.rosModel.NeckLumps);
          this.rosForm.get("NeckPain").setValue(this.visitIntakeData.rosModel.NeckPain);
          this.rosForm.get("Swollenglands").setValue(this.visitIntakeData.rosModel.Swollenglands);
          this.rosForm.get("Stiffness").setValue(this.visitIntakeData.rosModel.Stiffness);
          this.rosForm.get("NeckOthers").setValue(this.visitIntakeData.rosModel.NeckOthers);
          this.rosForm.get("NeckothersComments").setValue(this.visitIntakeData.rosModel.NeckothersComments);

          //Respiratory
          this.rosForm.get("Cough").setValue(this.visitIntakeData.rosModel.Cough);
          this.rosForm.get("Coughingupblood").setValue(this.visitIntakeData.rosModel.Coughingupblood);
          this.rosForm.get("Wheezing").setValue(this.visitIntakeData.rosModel.Wheezing);
          this.rosForm.get("Sputum").setValue(this.visitIntakeData.rosModel.Sputum);
          this.rosForm.get("Shortnessofbreath").setValue(this.visitIntakeData.rosModel.Shortnessofbreath);
          this.rosForm.get("Painfulbreathing").setValue(this.visitIntakeData.rosModel.Painfulbreathing);
          this.rosForm.get("RespiratoryOthers").setValue(this.visitIntakeData.rosModel.RespiratoryOthers);
          this.rosForm.get("Respiratoryotherscomments").setValue(this.visitIntakeData.rosModel.Respiratoryotherscomments);

          //Neurology
          this.rosForm.get("Dizziness").setValue(this.visitIntakeData.rosModel.Dizziness);
          this.rosForm.get("Weakness").setValue(this.visitIntakeData.rosModel.Weakness);
          this.rosForm.get("Tremor").setValue(this.visitIntakeData.rosModel.Tremor);
          this.rosForm.get("Fainting").setValue(this.visitIntakeData.rosModel.Fainting);
          this.rosForm.get("Numbness").setValue(this.visitIntakeData.rosModel.Numbness);
          this.rosForm.get("Seizures").setValue(this.visitIntakeData.rosModel.Seizures);
          this.rosForm.get("Tingling").setValue(this.visitIntakeData.rosModel.Tingling);
          this.rosForm.get("NeurologicOthers").setValue(this.visitIntakeData.rosModel.NeurologicOthers);
          this.rosForm.get("Neurologicotherscomments").setValue(this.visitIntakeData.rosModel.Neurologicotherscomments);

          //Hematologic
          this.rosForm.get("Easeofbruising").setValue(this.visitIntakeData.rosModel.Easeofbruising);
          this.rosForm.get("Easeofbleeding").setValue(this.visitIntakeData.rosModel.Easeofbleeding);
          this.rosForm.get("HematologicOthers").setValue(this.visitIntakeData.rosModel.HematologicOthers);
          this.rosForm.get("Hematologicotherscomments").setValue(this.visitIntakeData.rosModel.Hematologicotherscomments);

          //Psychiatric
          this.rosForm.get("Nervousness").setValue(this.visitIntakeData.rosModel.Nervousness);
          this.rosForm.get("Memoryloss").setValue(this.visitIntakeData.rosModel.Memoryloss);
          this.rosForm.get("Stress").setValue(this.visitIntakeData.rosModel.Stress);
          this.rosForm.get("Depression").setValue(this.visitIntakeData.rosModel.Depression);
          this.rosForm.get("PsychiatricOthers").setValue(this.visitIntakeData.rosModel.PsychiatricOthers);
          this.rosForm.get("Psychiatricotherscomments").setValue(this.visitIntakeData.rosModel.Psychiatricotherscomments);
        }
        if (this.visitIntakeData.rosModel.PatientID == 0) {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.RosVisitDate = res.VisitDateandTime;
              this.recordedDuringRos = res.recordedDuring;
            }
          });
        }
        //nutrition set
        if (this.visitIntakeData.nutritionCollection != null) {
          if (this.visitIntakeData.nutritionCollection.length == 1) {
            const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]
            );
            for (var i = 0; i < nutrition.length; i++) {
              this.nutritionVisitDateandTime = this.visitIntakeData.nutritionCollection[0].visitDateandTime;
              this.recordedDuringNutrition = this.visitIntakeData.nutritionCollection[0].recordedDuring;
              nutrition.controls[i].get("RecordedDate").setValue(new Date(this.visitIntakeData.nutritionCollection[0].RecordedDate));
              nutrition.controls[i].get("RecordedTime").setValue(new Date(this.visitIntakeData.nutritionCollection[0].RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
              nutrition.controls[i].get("RecordedBy").setValue(this.visitIntakeData.nutritionCollection[0].RecordedBy);
              nutrition.controls[i].get("IntakeCategory").setValue(this.visitIntakeData.nutritionCollection[0].IntakeCategory);
              nutrition.controls[i].get("EatRegularly").setValue(this.visitIntakeData.nutritionCollection[0].EatRegularly);
              nutrition.controls[i].get("RegularMeals").setValue(this.visitIntakeData.nutritionCollection[0].RegularMeals);
              nutrition.controls[i].get("Carvings").setValue(this.visitIntakeData.nutritionCollection[0].Carvings);
              nutrition.controls[i].get("DislikedIntake").setValue(this.visitIntakeData.nutritionCollection[0].DislikedIntake);
              nutrition.controls[i].get("FoodAllergies").setValue(this.visitIntakeData.nutritionCollection[0].FoodAllergies);
              nutrition.controls[i].get("Notes").setValue(this.visitIntakeData.nutritionCollection[0].Notes);
              nutrition.controls[i].get("FoodIntakeTypeID").setValue(this.visitIntakeData.nutritionCollection[0].FoodIntakeTypeID);
              nutrition.controls[i].get("FoodName").setValue(this.visitIntakeData.nutritionCollection[0].FoodName);
              nutrition.controls[i].get("Units").setValue(this.visitIntakeData.nutritionCollection[0].Units);
              nutrition.controls[i].get("Frequency").setValue(this.visitIntakeData.nutritionCollection[0].Frequency);
              nutrition.controls[i].get("NutritionNotes").setValue(this.visitIntakeData.nutritionCollection[0].NutritionNotes);
            }
          } else if (this.visitIntakeData.nutritionCollection.length > 1) {
            this.nutritionVisitDateandTime = this.visitIntakeData.nutritionCollection[0].visitDateandTime;
            this.recordedDuringNutrition = this.visitIntakeData.nutritionCollection[0].recordedDuring;
            this.nutritionCollection = this.visitIntakeData.nutritionCollection;
            this.isNutrition = true;
          }
        }
        if (this.visitIntakeData.nutritionCollection.length == 0) {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.nutritionVisitDateandTime = res.VisitDateandTime;
              this.recordedDuringNutrition = res.recordedDuring;
            }
          });
        }
        //cognitiveModel set
        if (this.visitIntakeData.cognitiveModel.PatientID != 0) {
          this.functionvisitDateTime = this.visitIntakeData.cognitiveModel.visitDateandTime;
          this.functionCogForm.get("RecordedDate").setValue(new Date(this.visitIntakeData.cognitiveModel.RecordedDate));
          this.functionCogForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.cognitiveModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
          this.recordedDuringcognitive = this.visitIntakeData.cognitiveModel.recordedDuring;
          this.functionCogForm.get("RecordedBy").setValue(this.visitIntakeData.cognitiveModel.RecordedBy);
          this.functionCogForm.get("Gait").setValue(this.visitIntakeData.cognitiveModel.Gait);
          this.functionCogForm.get("GaitNotes").setValue(this.visitIntakeData.cognitiveModel.GaitNotes);
          this.functionCogForm.get("Balance").setValue(this.visitIntakeData.cognitiveModel.Balance);
          this.functionCogForm.get("BalanceNotes").setValue(this.visitIntakeData.cognitiveModel.BalanceNotes);
          this.functionCogForm.get("NeuromuscularNotes").setValue(this.visitIntakeData.cognitiveModel.NeuromuscularNotes);
          this.functionCogForm.get("Mobility").setValue(this.visitIntakeData.cognitiveModel.Mobility);
          this.functionCogForm.get("MobilitySupportDevice").setValue(this.visitIntakeData.cognitiveModel.MobilitySupportDevice);
          this.functionCogForm.get("MobilityNotes").setValue(this.visitIntakeData.cognitiveModel.MobilityNotes);
          this.functionCogForm.get("Functionalstatus").setValue(this.visitIntakeData.cognitiveModel.Functionalstatus);
          this.functionCogForm.get("Cognitivestatus").setValue(this.visitIntakeData.cognitiveModel.Cognitivestatus);
          this.functionCogForm.get("PrimaryDiagnosisNotes").setValue(this.visitIntakeData.cognitiveModel.PrimaryDiagnosisNotes);
          this.functionCogForm.get("ICD10").setValue(this.visitIntakeData.cognitiveModel.ICD10);
          this.icdTool = this.visitIntakeData.cognitiveModel.ICD10;
          this.functionCogForm.get("PrimaryProcedure").setValue(this.visitIntakeData.cognitiveModel.PrimaryProcedure);
          this.functionCogForm.get("CPT").setValue(this.visitIntakeData.cognitiveModel.CPT);
          this.cptTool = this.visitIntakeData.cognitiveModel.CPT;
          this.functionCogForm.get("Physicianname").setValue(this.visitIntakeData.cognitiveModel.Physicianname);
          this.functionCogForm.get("Hospital").setValue(this.visitIntakeData.cognitiveModel.Hospital);
          this.functionCogForm.get("CognitiveID").setValue(this.visitIntakeData.cognitiveModel.CognitiveID);
        } else {
          this.triageService.getVisitRecordById(this.visitId).then((data) => {
            this.functionvisitDateTime = data.VisitDateandTime;
            //this.cognitivevDate=data.VisitDateandTime;
            this.recordedDuringcognitive = data.recordedDuring;
          });
        }
        //nurse

        if (this.visitIntakeData.nursingModel.PatientID != 0) {
          if (this.visitIntakeData.nursingModel.nursingFile.length > 0) {
            this.setFileDataNursing(this.visitIntakeData.nursingModel.nursingFile);
          }
          this.nursingVisitDate = this.visitIntakeData.nursingModel.visitDateandTime;
          this.nursingrecordedDuring = this.visitIntakeData.nursingModel.RecordedBy;
          this.nursingForm.get("RecordedDate").setValue(this.visitIntakeData.nursingModel.RecordedDate);
          this.nursingForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.nursingModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
          this.nursingForm.get("RecordedBy").setValue(this.visitIntakeData.nursingModel.RecordedBy);
          this.nursingForm.get("ObservationsNotes").setValue(this.visitIntakeData.nursingModel.ObservationsNotes);
          this.nursingForm.get("FirstaidOrDressingsNotes").setValue(this.visitIntakeData.nursingModel.FirstaidOrDressingsNotes);
          this.nursingForm.get("NursingProceduresNotes").setValue(this.visitIntakeData.nursingModel.NursingProceduresNotes);
          this.nursingForm.get("NursingNotes").setValue(this.visitIntakeData.nursingModel.NursingNotes);
          this.nursingForm.get("AdditionalInformation").setValue(this.visitIntakeData.nursingModel.AdditionalInformation);

        } else {
          this.triageService.getVisitRecordById(this.visitId).then((res) => {
            if (res) {
              this.nursingVisitDate = res.VisitDateandTime;
              this.nursingrecordedDuring = res.recordedDuring;
            }
          });
        }
      }
    });

  }
  //#endregion

  //#region "Vital save function "
  addUpdateVitalsforVisit() {
    if (this.vitalForm.valid) {

      this.vitalsModel = new PatientVitalsModel();

      this.vitalsModel.VitalsId = 0;
      this.vitalsModel.PatientId = this.patientId;
      this.vitalsModel.VisitId = this.visitId;
      this.vitalsModel.RecordedDate = this.BindDateWithTime(this.vitalForm.get("RecordedDate").value, this.vitalForm.get("RecordedTime").value);
      this.vitalsModel.RecordedBy = this.vitalForm.get("RecordedBy").value;
      this.vitalsModel.Height = this.vitalForm.get("Height").value == "" ? 0 : this.vitalForm.get("Height").value;
      this.vitalsModel.Weight = this.vitalForm.get("Weight").value == "" ? 0 : this.vitalForm.get("Weight").value;
      this.vitalsModel.BMI = this.vitalForm.get("BMI").value == "" ? 0 : this.vitalForm.get("BMI").value;
      this.vitalsModel.WaistCircumference = this.vitalForm.get("WaistCircumference").value;
      this.vitalsModel.BPSystolic = this.vitalForm.get("BPSystolic").value == "" ? 0 : this.vitalForm.get("BPSystolic").value;
      this.vitalsModel.BPDiastolic = this.vitalForm.get("BPDiastolic").value == "" ? 0 : this.vitalForm.get("BPDiastolic").value;
      this.vitalsModel.BPLocationID = this.vitalForm.get("BPLocationID").value;
      this.vitalsModel.PatientPosition = this.vitalForm.get("PatientPosition").value == "" ? 0 : this.vitalForm.get("PatientPosition").value;
      this.vitalsModel.Temperature = this.vitalForm.get("Temperature").value == "" ? 0 : this.vitalForm.get("Temperature").value;
      this.vitalsModel.TemperatureLocation = this.vitalForm.get("TemperatureLocation").value == "" ? 0 : this.vitalForm.get("TemperatureLocation").value;
      this.vitalsModel.HeartRate = this.vitalForm.get("HeartRate").value == "" ? 0 : this.vitalForm.get("HeartRate").value;
      this.vitalsModel.RespiratoryRate = this.vitalForm.get("RespiratoryRate").value == "" ? 0 : this.vitalForm.get("RespiratoryRate").value;
      this.vitalsModel.O2Saturation = this.vitalForm.get("O2Saturation").value == "" ? 0 : this.vitalForm.get("O2Saturation").value;
      this.vitalsModel.BloodsugarRandom = this.vitalForm.get("BloodsugarRandom").value == "" ? 0 : this.vitalForm.get("BloodsugarRandom").value;
      this.vitalsModel.BloodsugarFasting = this.vitalForm.get("BloodsugarFasting").value == "" ? 0 : this.vitalForm.get("BloodsugarFasting").value;
      this.vitalsModel.BloodSugarPostpardinal = this.vitalForm.get("BloodSugarPostpardinal").value == "" ? 0 : this.vitalForm.get("BloodSugarPostpardinal").value;
      this.vitalsModel.PainArea = this.vitalForm.get("PainArea").value;
      this.vitalsModel.PainScale = this.vitalForm.get("PainScale").value == "" ? 0 : this.vitalForm.get("PainScale").value;
      this.vitalsModel.HeadCircumference = this.vitalForm.get("HeadCircumference").value == "" ? 0 : this.vitalForm.get("HeadCircumference").value;
      this.vitalsModel.LastMealdetails = this.vitalForm.get("LastMealdetails").value;
      this.vitalsModel.LastMealtakenon = this.vitalForm.get("LastMealtakenon").value;
      this.vitalsModel.IsBloodPressure = this.vitalForm.get("IsBloodPressure").value;
      this.vitalsModel.IsDiabetic = this.vitalForm.get("IsDiabetic").value;
      this.vitalsModel.Notes = this.vitalForm.get("Notes").value;

      this.triageService.addUpdateVitalsforVisit(this.vitalsModel).then((res) => {
        if (res != null) {
          this.util.showMessage("Success", "Vitals details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });

        } else {
          this.util.showMessage("Error", "Vitals details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }
  //#endregion

  //#region "allergy save function"

  allergyAddAnother() {

    const allergy = <FormArray>this.allergyForm.controls["allergiesModel"];
    if (this.allergyForm.controls["allergiesModel"].valid) {

      this.allergiesModel = new PatientAllergyModel();

      if (this.visitIntakeData.allergiesModel != null) {
        if (this.visitIntakeData.allergiesModel.length == 1 && this.allergiesCollection.length == 0) {
          this.allergiesModel.AllergyId = (this.visitIntakeData.allergiesModel[0].AllergyId) > 0 ? this.visitIntakeData.allergiesModel[0].AllergyId : 0;
        } else {
          this.allergiesModel.AllergyId = 0;
        }
      }
      this.allergiesModel.visitDateandTime = this.allergyVisitDateandTime ? this.allergyVisitDateandTime : "";
      this.allergiesModel.recordedDuring = this.allergyrecord ? this.allergyrecord : "";
      this.allergiesModel.PatientId = this.patientId;
      this.allergiesModel.VisitId = this.visitId;
      this.allergiesModel.AllergyTypeID = allergy.controls[0].get("AllergyTypeID").value;
      this.allergiesModel.AllergySeverityID = allergy.controls[0].get("AllergySeverityID").value;
      this.allergiesModel.AllergyTypeDesc = this.allergyType.find(x => (x.AllergyTypeID == this.allergiesModel.AllergyTypeID)).AllergyTypeDescription;
      this.allergiesModel.AllergySeverityDesc = this.AllergySeverities.find(x => (x.AllergySeverityId == this.allergiesModel.AllergySeverityID)).AllergySeverityDescription;
      this.allergiesModel.Name = allergy.controls[0].get("Name").value;
      this.allergiesModel.Allergydescription = allergy.controls[0].get("Allergydescription").value;
      this.allergiesModel.Aggravatedby = allergy.controls[0].get("Aggravatedby").value;
      this.allergiesModel.Alleviatedby = allergy.controls[0].get("Alleviatedby").value;
      this.allergiesModel.Onsetdate = allergy.controls[0].get("Onsetdate").value;
      this.allergiesModel.Reaction = allergy.controls[0].get("Reaction").value;
      this.allergiesModel.Status = allergy.controls[0].get("Status").value;
      this.allergiesModel.RecordedDate = this.BindDateWithTime(allergy.controls[0].get("RecordedDate").value, allergy.controls[0].get("RecordedTime").value);
      this.allergiesModel.RecordedBy = allergy.controls[0].get("RecordedBy").value;
      this.allergiesModel.ICD10 = allergy.controls[0].get("ICD10").value;
      this.allergiesModel.SNOMED = allergy.controls[0].get("SNOMED").value;
      this.allergiesModel.Notes = allergy.controls[0].get("Notes").value;

      this.allergiesCollection.push(this.allergiesModel);
      this.allergyForm.controls["allergiesModel"].reset();
      this.isAllergy = true;
      allergy.controls[0].get("RecordedBy").setValue(this.allergiesModel.RecordedBy);
      allergy.controls[0].get("RecordedDate").setValue(new Date());
      allergy.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
      allergy.controls[0].get("AllergySeverityID").setValue(this.AllergySeverities[0].AllergySeverityId);
      allergy.controls[0].get("AllergyTypeID").setValue(this.allergyType[0].AllergyTypeID);

      // this.triageService.addSingleAllergyRecord(this.allergiesModel).then((res) => {
      //   if (res) {
      //     this.util.showMessage("Success", "Allergy details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
      //     this.allergyForm.controls["allergiesModel"].reset();
      //     const allergy = <FormArray>this.allergyForm.controls["allergiesModel"];
      //     allergy.controls[0].get("RecordedDate").setValue(new Date());
      //     allergy.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      //     allergy.controls[0].get("AllergySeverityID").setValue(this.AllergySeverities[0].AllergySeverityId);
      //     allergy.controls[0].get("AllergyTypeID").setValue(this.allergyType[0].AllergyTypeID);

      //     this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      //       this.allergiesCollection = res.allergiesModel;
      //       this.isAllergy = true;
      //     });
      //   } else {
      //     this.util.showMessage("Error", "Allergy details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
      //   }
      // });

    } else {
      allergy.controls[0].get("RecordedBy").markAsTouched();
    }

  }


  allergySave() {

    if (this.allergiesCollection.length > 0) {
      this.triageService.addUpdateAllergyCollection(this.allergiesCollection).then((res) => {
        if (res != null) {
          this.util.showMessage("Success", "Allergy details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
        } else {
          this.util.showMessage("Error", "Allergy details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
        }
      })
    } else {
      this.allergyAddAnother();
      if (this.allergiesCollection.length > 0) {
        this.triageService.addUpdateAllergyCollection(this.allergiesCollection).then((res) => {
          if (res != null) {
            this.util.showMessage("Success", "Allergy details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
          } else {
            this.util.showMessage("Error", "Allergy details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);

          }
        })
      }
    }
  }
  //#endregion

  //#region "Problem list Save Function"
  problemlistAddAnother() {
    const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
    if (problemList.valid) {

      this.problemListModel = new PatientProblemListModel();
      if (this.visitIntakeData.problemCollection != null) {
        if (this.visitIntakeData.problemCollection.length == 1 && this.problemListCollection.length == 0) {
          this.problemListModel.ProblemlistId = (this.visitIntakeData.problemCollection[0].ProblemlistId) > 0 ? this.visitIntakeData.problemCollection[0].ProblemlistId : 0;
        } else {
          this.problemListModel.ProblemlistId = 0;
        }
      }
      this.problemListModel.PatientId = this.patientId;
      this.problemListModel.VisitId = this.visitId;
      this.problemListModel.ProblemTypeID = problemList.controls[0].get("ProblemTypeID").value;
      this.problemListModel.ProblemTypeDesc = problemList.controls[0].get("ProblemTypeDesc").value;
      this.problemListModel.ProblemDescription = problemList.controls[0].get("ProblemDescription").value;
      this.problemListModel.ICD10Code = problemList.controls[0].get("ICD10Code").value;
      this.problemListModel.SNOMEDCode = problemList.controls[0].get("SNOMEDCode").value;
      this.problemListModel.Aggravatedby = problemList.controls[0].get("Aggravatedby").value;
      this.problemListModel.DiagnosedDate = problemList.controls[0].get("DiagnosedDate").value;
      this.problemListModel.ResolvedDate = problemList.controls[0].get("ResolvedDate").value;
      this.problemListModel.Status = problemList.controls[0].get("Status").value;
      this.problemListModel.AttendingPhysican = problemList.controls[0].get("AttendingPhysican").value;
      this.problemListModel.AlleviatedBy = problemList.controls[0].get("AlleviatedBy").value;
      this.problemListModel.Notes = problemList.controls[0].get("Notes").value;
      this.problemListModel.RecordedDate = this.BindDateWithTime(problemList.controls[0].get("RecordedDate").value, problemList.controls[0].get("RecordedTime").value);
      this.problemListModel.RecordedBy = problemList.controls[0].get("RecordedBy").value;
      this.problemListModel.FileUpload = this.FileUploadProblemList;
      this.problemListModel.ViewFileProblemList = this.ViewFileProblemList;
      this.problemListModel.visitDateandTime = this.problemlistVisitDateandTime;
      this.problemListModel.recordedDuring = this.recordedDuringProblemList;
      this.problemListCollection.push(this.problemListModel);
      this.FileUploadProblemList = [];
      this.ViewFileProblemList = [];
      this.FileUploadProblemListNames = [];
      this.isProblemList = true;
      this.problemListForm.controls["problemCollection"].reset();
      problemList.controls[0].get("RecordedDate").setValue(new Date());
      problemList.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
      problemList.controls[0].get("ProblemTypeID").setValue(this.problemTypes[0].ProblemTypeId);
      problemList.controls[0].get("RecordedBy").setValue(this.problemListModel.RecordedBy);
      // this.triageService.addSingleProblemListRecord(this.problemListModel).then((res) => {
      //   if (res != null) {
      //     if (res.ProblemlistId) {

      //       const formData = new FormData();
      //       this.FileUploadProblemList.forEach(file => {
      //         formData.append('file', file, file.name);
      //       });

      //       if (this.FileUploadProblemList != null && this.FileUploadProblemList.length > 0) {
      //         this.triageService.FileUpload(formData, res.ProblemlistId, "Patient/ProblemList").then((res) => {
      //         });
      //       }

      //       this.util.showMessage("", "Problem List saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
      //       this.FileUploadProblemList = [];
      //       this.ViewFileProblemList = [];
      //       this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      //         this.problemListCollection = res.problemCollection;
      //         for (let index = 0; index < this.problemListCollection.length; index++) {
      //           this.problemListCollection[index].file = this.bindFileData(this.problemListCollection[index].filePath);
      //           this.problemListCollection.splice(index, 1, this.problemListCollection[index])
      //         }

      //         this.isProblemList = true;
      //         this.problemListForm.controls["problemCollection"].reset();
      //         problemList.controls[0].get("RecordedDate").setValue(new Date());
      //         problemList.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      //         problemList.controls[0].get("ProblemTypeID").setValue(this.problemTypes[0].ProblemTypeId);
      //       });
      //     }
      //   } else {
      //     this.util.showMessage("Error", "Problem List details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
      //   }
      // });
    }
  }

  problemListSave() {//addUpdateProblemListCollection

    if (this.problemListCollection.length > 0) {
      this.triageService.addUpdateProblemListCollection(this.problemListCollection).then((res) => {

        if (res != null) {

          for (let i = 0; i < res.length; i++) {
            if (this.problemListCollection[i].FileUpload) {
              let FileToUpload = this.problemListCollection[i].FileUpload;
              const formData = new FormData();
              FileToUpload.forEach(file => {
                formData.append('file', file, file.name);
              });

              if (FileToUpload != null && FileToUpload.length > 0) {
                this.triageService.FileUpload(formData, res[i].ProblemlistId, "Patient/ProblemList").then((res) => {
                });
              }
            }
          }

          this.util.showMessage("Success", "Problem List saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
        } else {
          this.util.showMessage("Error", "Problem List Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
        }
      })
    } else {
      this.problemlistAddAnother();
      if (this.problemListCollection.length > 0) {
        this.triageService.addUpdateProblemListCollection(this.problemListCollection).then((res) => {
          if (res != null) {
            0
            this.util.showMessage("Success", "Problem List saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
          } else {
            this.util.showMessage("Error", "Problem List Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);

          }
        })
      }
    }
  }
  //#endregion

  //#region "Social histry save function"
  addUpdateSocialHistory() {
    if (this.socialHistoryForm.valid) {

      this.socialHistoryModel = new PatientSocialHistoryModel();
      this.socialHistoryModel.PatientId = this.patientId;
      this.socialHistoryModel.VisitId = this.visitId;
      this.socialHistoryModel.SocialHistoryId = 0;
      this.socialHistoryModel.RecordedDate = this.BindDateWithTime(this.socialHistoryForm.get("RecordedDate").value, this.socialHistoryForm.get("RecordedTime").value);
      this.socialHistoryModel.RecordedBy = this.socialHistoryForm.get("RecordedBy").value;
      this.socialHistoryModel.Smoking = this.socialHistoryForm.get("Smoking").value == "" ? 0 : this.socialHistoryForm.get("Smoking").value;
      this.socialHistoryModel.CigarettesPerDay = this.socialHistoryForm.get("CigarettesPerDay").value == "" ? 0 : this.socialHistoryForm.get("CigarettesPerDay").value;
      this.socialHistoryModel.Drinking = this.socialHistoryForm.get("Drinking").value == "" ? 0 : this.socialHistoryForm.get("Drinking").value;
      this.socialHistoryModel.ConsumptionPerDay = this.socialHistoryForm.get("ConsumptionPerDay").value == "" ? 0 : this.socialHistoryForm.get("ConsumptionPerDay").value;
      this.socialHistoryModel.DrugHabitsDetails = this.socialHistoryForm.get("DrugHabitsDetails").value;
      this.socialHistoryModel.LifeStyleDetails = this.socialHistoryForm.get("LifeStyleDetails").value;
      this.socialHistoryModel.CountriesVisited = this.socialHistoryForm.get("CountriesVisited").value;
      this.socialHistoryModel.DailyActivities = this.socialHistoryForm.get("DailyActivities").value;
      this.socialHistoryModel.AdditionalNotes = this.socialHistoryForm.get("AdditionalNotes").value;

      this.triageService.addUpdateSocialHistoryForVisit(this.socialHistoryModel).then((res) => {
        if (res != null) {
          this.util.showMessage("", "Social History details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });

        } else {
          this.util.showMessage("", "Social History details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });

        }
      });
    }
  }
  //#endregion

  //#region "Ros Save Function"
  addUpdateROS() {
    if (this.rosForm.valid) {
      this.rosForm.get("PatientID").setValue(this.patientId);
      this.rosForm.get("VisitID").setValue(this.visitId);
      this.rosForm.get("ROSID").setValue(0);
      this.rosModel = this.rosForm.value;

      this.rosModel.RecordedDate = this.BindDateWithTime(this.rosForm.get("RecordedDate").value, this.rosForm.get("RecordedTime").value);
      this.triageService.addUpdateROSForVisit(this.rosModel).then((res) => {
        if (res) {
          this.util.showMessage("Success", "ROS details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        } else {
          this.util.showMessage("Error", "ROS details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }
  //#endregion

  //#region "Nutrition Save Function"

  nutritionAddAnother() {
    const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]);
    if (this.nutritionForm.controls['nutritionCollection'].valid) {
      this.nutritionModel = new NutritionAssessmentModel();
      if (this.visitIntakeData.nutritionCollection != null) {
        if (this.visitIntakeData.nutritionCollection.length == 1 && this.nutritionCollection.length == 0) {
          this.nutritionModel.NutritionAssessmentID = (this.visitIntakeData.nutritionCollection[0].NutritionAssessmentID) > 0 ? this.visitIntakeData.nutritionCollection[0].NutritionAssessmentID : 0;
        } else {
          this.nutritionModel.NutritionAssessmentID = 0;
        }
      }
      this.nutritionModel.PatientId = this.patientId;
      this.nutritionModel.VisitId = this.visitId;
      this.nutritionModel.RecordedDate = this.BindDateWithTime(nutrition.controls[0].get("RecordedDate").value, nutrition.controls[0].get("RecordedTime").value);
      //this.nutritionModel.recordedDuring = this.recordedDuringNutrition;
      this.nutritionModel.RecordedBy = nutrition.controls[0].get("RecordedBy").value;
      this.nutritionModel.FoodIntakeTypeID = nutrition.controls[0].get("FoodIntakeTypeID").value;
      this.nutritionModel.FoodIntakeTypeDesc = this.foodIntakeTypes.find(x => x.FoodIntaketypeID == this.nutritionModel.FoodIntakeTypeID).FoodIntakeTypeDescription;
      this.nutritionModel.IntakeCategory = nutrition.controls[0].get("IntakeCategory").value;
      this.nutritionModel.EatRegularly = nutrition.controls[0].get("EatRegularly").value;
      this.nutritionModel.RegularMeals = nutrition.controls[0].get("RegularMeals").value;
      this.nutritionModel.Carvings = nutrition.controls[0].get("Carvings").value;
      this.nutritionModel.DislikedIntake = nutrition.controls[0].get("DislikedIntake").value;
      this.nutritionModel.FoodAllergies = nutrition.controls[0].get("FoodAllergies").value;
      this.nutritionModel.Notes = nutrition.controls[0].get("Notes").value;
      this.nutritionModel.FoodName = nutrition.controls[0].get("FoodName").value;
      this.nutritionModel.Units = nutrition.controls[0].get("Units").value;
      this.nutritionModel.Frequency = nutrition.controls[0].get("Frequency").value == "" ? 0 : nutrition.controls[0].get("Frequency").value;
      this.nutritionModel.NutritionNotes = nutrition.controls[0].get("NutritionNotes").value;
      this.nutritionModel.visitDateandTime = this.nutritionVisitDateandTime ? this.nutritionVisitDateandTime : "";
      this.nutritionModel.recordedDuring = this.recordedDuringNutrition ? this.recordedDuringNutrition : "";

      this.nutritionCollection.push(this.nutritionModel);
      this.isNutrition = true;
      this.nutritionForm.controls["nutritionCollection"].reset();
      nutrition.controls[0].get("FoodIntakeTypeID").setValue(this.foodIntakeTypes[0].FoodIntaketypeID);
      nutrition.controls[0].get("RecordedDate").setValue(new Date());
      nutrition.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
      nutrition.controls[0].get("RecordedBy").setValue(this.nutritionModel.RecordedBy);

      // this.triageService.addSingleNutritionRecord(this.nutritionModel).then((res) => {
      //   if (res != null) {
      //     this.util.showMessage("", "Nutrition details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
      //     this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      //       this.nutritionCollection = res.nutritionCollection;
      //       this.isNutrition = true;

      //       this.nutritionForm.controls["nutritionCollection"].reset();
      //       nutrition.controls[0].get("FoodIntakeTypeID").setValue(this.foodIntakeTypes[0].FoodIntaketypeID);
      //       nutrition.controls[0].get("RecordedDate").setValue(new Date());
      //       nutrition.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));

      //     });
      //   } else {
      //     this.util.showMessage("", "Nutrition details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });

      //   }
      // });
    } else {
      nutrition.controls[0].get("RecordedBy").markAsTouched();
    }
  }

  nutritionSave() {
    if (this.nutritionCollection.length > 0) {
      this.triageService.addUpdateNutritionCollection(this.nutritionCollection).then((res) => {
        if (res != null) {
          this.util.showMessage("Success", "Nutrition details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
        } else {
          this.util.showMessage("Error", "Nutrition details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
        }
      })
    } else {
      this.nutritionAddAnother();
      if (this.nutritionCollection.length > 0) {
        this.triageService.addUpdateNutritionCollection(this.nutritionCollection).then((res) => {
          if (res != null) {
            this.util.showMessage("Success", "Nutrition details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
          } else {
            this.util.showMessage("Error", "Nutrition details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);

          }
        })
      }
    }
  }

  //#endregion

  //#region "Cognitive Save Function "
  addFunctionalCognitive() {
    if (this.functionCogForm.valid) {

      this.functCognitiveModel = new FunctionalCognitiveModel();
      this.functCognitiveModel.CognitiveID = 0;
      this.functCognitiveModel.PatientID = this.patientId;
      this.functCognitiveModel.VisitID = this.visitId;
      this.functCognitiveModel.RecordedDate = this.BindDateWithTime(this.functionCogForm.get("RecordedDate").value, this.functionCogForm.get("RecordedTime").value);
      this.functCognitiveModel.RecordedBy = this.functionCogForm.get("RecordedBy").value;
      this.functCognitiveModel.Gait = this.functionCogForm.get("Gait").value == "" ? 0 : this.functionCogForm.get("Gait").value;
      this.functCognitiveModel.GaitNotes = this.functionCogForm.get("GaitNotes").value;
      this.functCognitiveModel.Balance = this.functionCogForm.get("Balance").value;
      this.functCognitiveModel.BalanceNotes = this.functionCogForm.get("BalanceNotes").value;
      this.functCognitiveModel.NeuromuscularNotes = this.functionCogForm.get("NeuromuscularNotes").value;
      this.functCognitiveModel.Mobility = this.functionCogForm.get("Mobility").value;
      this.functCognitiveModel.MobilitySupportDevice = this.functionCogForm.get("MobilitySupportDevice").value;
      this.functCognitiveModel.MobilityNotes = this.functionCogForm.get("MobilityNotes").value;
      this.functCognitiveModel.Functionalstatus = this.functionCogForm.get("Functionalstatus").value;
      this.functCognitiveModel.Cognitivestatus = this.functionCogForm.get("Cognitivestatus").value;
      this.functCognitiveModel.PrimaryDiagnosisNotes = this.functionCogForm.get("PrimaryDiagnosisNotes").value;
      this.functCognitiveModel.ICD10 = this.functionCogForm.get("ICD10").value;
      this.functCognitiveModel.CPT = this.functionCogForm.get("CPT").value;
      this.functCognitiveModel.PrimaryProcedure = this.functionCogForm.get("PrimaryProcedure").value;
      this.functCognitiveModel.Physicianname = this.functionCogForm.get("Physicianname").value;
      this.functCognitiveModel.Hospital = this.functionCogForm.get("Hospital").value;

      this.triageService.addUpdateFunctionalandCognitiveForVisit(this.functCognitiveModel).then((res) => {
        if (res != null) {
          this.util.showMessage("Success", "Functional & Cognitive details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });

        } else {
          this.util.showMessage("Error", "Functional & Cognitive details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });

        }
      });
    }
  }
  //#endregion

  //#region "Nursing SignOff Save Function"
  addNursingSignOff() {
    if (this.nursingForm.valid) {
      this.nursingForm.get("PatientID").setValue(this.patientId);
      this.nursingForm.get("VisitID").setValue(this.visitId);
      this.nursingForm.get("NursingId").setValue(0);
      this.nursingSignOffModel = new NursingSignOffModel();
      this.nursingSignOffModel.NursingId = 0;
      this.nursingSignOffModel.PatientID = this.patientId;
      this.nursingSignOffModel.VisitID = this.visitId;
      this.nursingSignOffModel.RecordedDate = this.BindDateWithTime(this.nursingForm.get("RecordedDate").value, this.nursingForm.get("RecordedTime").value);
      this.nursingSignOffModel.RecordedBy = this.nursingForm.get("RecordedBy").value;
      this.nursingSignOffModel.ObservationsNotes = this.nursingForm.get("ObservationsNotes").value;
      this.nursingSignOffModel.FirstaidOrDressingsNotes = this.nursingForm.get("FirstaidOrDressingsNotes").value;
      this.nursingSignOffModel.NursingProceduresNotes = this.nursingForm.get("NursingProceduresNotes").value;
      this.nursingSignOffModel.NursingNotes = this.nursingForm.get("NursingNotes").value;
      this.nursingSignOffModel.AdditionalInformation = this.nursingForm.get("AdditionalInformation").value;

      this.triageService.addUpdateNursingSignOffData(this.nursingSignOffModel).then((data) => {
        if (data.NursingId) {

          const formData = new FormData();
          this.FileUploadNursing.forEach(file => {
            formData.append('file', file, file.name);
          });

          if (this.FileUploadNursing != null && this.FileUploadNursing.length > 0) {
            this.triageService.FileUpload(formData, data.NursingId, "Patient/NursingSignoff").then((res) => { });
          }

          this.util.showMessage("", "Nursing Signoff saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        } else {
          this.util.showMessage("", "Nursing Signoff details Not saved ", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }
  //#endregion

  //#region "Sign off function"
  signOffModel() {
    if (this.signoffForm.valid) {
      this.signoffModel.VisitId = this.visitId;
      this.signoffModel.ScreenName = "intake";
      this.signoffModel.UserName = this.signoffForm.get("UserName").value;
      this.signoffModel.Password = this.signoffForm.get("Password").value;

      this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.triageService.signoffModel(this.signoffModel).then((data) => {
            if (data.status == "Intake signOff Success") {
              this.isShow = true;
              this.isShow1 = true;
              this.signoffButton = true;
              this.vitalForm.disable();
              this.allergyForm.disable();
              this.problemListForm.disable();
              this.medicationForm.disable();
              this.medicationForm.controls['medicationModel'].disable();
              this.socialHistoryForm.disable();
              this.rosForm.disable();
              this.nutritionForm.disable();
              this.functionCogForm.disable();
              this.nursingForm.disable();

              this.util.showMessage("Success", data.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
            } else {
              this.util.showMessage("Error!!", data.status, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
            }
          });
        }
      });
    }
  }
  //#endregion

  //#region "Clear the nurse sign off"
  closeDialogRef() {
    this.nursingForm.reset();
    this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      this.visitIntakeData = res;

      if (this.visitIntakeData.nursingModel.PatientID != 0) {
        if (this.visitIntakeData.nursingModel.nursingFile.length > 0) {
          this.setFileDataNursing(this.visitIntakeData.nursingModel.nursingFile);
        }
        this.nursingVisitDate = this.visitIntakeData.nursingModel.visitDateandTime;
        this.nursingrecordedDuring = this.visitIntakeData.nursingModel.RecordedBy;

        this.nursingForm.get("RecordedDate").setValue(this.visitIntakeData.nursingModel.RecordedDate);
        this.nursingForm.get("RecordedTime").setValue(new Date(this.visitIntakeData.nursingModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));

        this.nursingForm.get("RecordedBy").setValue(this.visitIntakeData.nursingModel.RecordedBy);
        this.nursingForm.get("ObservationsNotes").setValue(this.visitIntakeData.nursingModel.ObservationsNotes);
        this.nursingForm.get("FirstaidOrDressingsNotes").setValue(this.visitIntakeData.nursingModel.FirstaidOrDressingsNotes);
        this.nursingForm.get("NursingProceduresNotes").setValue(this.visitIntakeData.nursingModel.NursingProceduresNotes);
        this.nursingForm.get("NursingNotes").setValue(this.visitIntakeData.nursingModel.NursingNotes);
        this.nursingForm.get("AdditionalInformation").setValue(this.visitIntakeData.nursingModel.AdditionalInformation);
      } else {
        this.triageService.getVisitRecordById(this.visitId).then((res) => {
          if (res) {
            this.nursingVisitDate = res.VisitDateandTime;
            this.nursingrecordedDuring = res.recordedDuring;
          }
        });
      }
    });
  }
  //#endregion

  //#region Allergy Edit And Update
  EditAllergy(data: any, index) {
    let json = data;

    const dialogRef = this.dialog.open(UpdateAllergyComponent, {
      data: json,
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //   this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        this.allergiesCollection.splice(index, 1, result);

        // const allergy = <FormArray>this.allergyForm.controls["allergiesModel"];
        // allergy.controls[0].get("RecordedDate").setValue(new Date());
        // allergy.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        // allergy.controls[0].get("AllergySeverityID").setValue(this.AllergySeverities[0].AllergySeverityId);
        // allergy.controls[0].get("AllergyTypeID").setValue(this.allergyType[0].AllergyTypeID);
        // this.isAllergy = true;
        // this.AllergySaveBtn = false
        // });
      }
    });
  }
  //#endregion Allergy Edit And Update

  //#region ProblemList Edit And Update
  //ProblemList
  EditProblemList(data: any, index) {

    let json = data;

    const dialogRef = this.dialog.open(UpdateProblemListTriageComponent, {
      data: json,
      height: 'auto',
      width: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        this.problemListCollection.splice(index, 1, result)
        // this.isProblemList = true;
        // this.problemListSaveBtn = false;
        // for (let index = 0; index < this.problemListCollection.length; index++) {
        //   this.problemListCollection[index].file = this.bindFileData(this.problemListCollection[index].filePath);
        //   this.problemListCollection.splice(index, 1, this.problemListCollection[index])
        // }


        // this.problemListForm.controls["problemCollection"].reset();
        // const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
        // problemList.controls[0].get("RecordedDate").setValue(new Date());
        // problemList.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        // problemList.controls[0].get("ProblemTypeID").setValue(this.problemTypes[0].ProblemTypeId);
        // });
      }
    });
  }

  //#endregion ProblemList Edit And Update

  //#region Nutrition Edit And Update
  //Nutrition
  Editnutrition(data: any, index) {
    let json = data;

    const dialogRef = this.dialog.open(updateNutritionComponent, {
      data: json,
      height: 'auto',
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //   this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        this.nutritionCollection.splice(index, 1, result);
        //this.nutritionForm.controls["nutritionCollection"].reset();
        // this.isAllergy = true;
        // this.NutritionSaveBtn = false;

        // const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]);
        // nutrition.controls[0].get("FoodIntakeTypeID").setValue(this.foodIntakeTypes[0].FoodIntaketypeID);
        // nutrition.controls[0].get("RecordedDate").setValue(new Date());
        // nutrition.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        // });
      }
    });
  }
  //#endregion Nutrition Edit And Update

  //#region "delete in Collection"
  deleteAllergy(data: any, i) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
      if (res == true) {
        this.allergiesCollection.splice(i, 1);
        // this.triageService.deleteAllergySingleRecord(data.AllergyId).then((res) => {
        //   if (res) {
        //     this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        //       this.allergiesCollection = res.allergiesModel;

        //       const allergy = <FormArray>this.allergyForm.controls["allergiesModel"];
        //       allergy.controls[0].get("RecordedDate").setValue(new Date());
        //       allergy.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        //       allergy.controls[0].get("AllergySeverityID").setValue(this.AllergySeverities[0].AllergySeverityId);
        //       allergy.controls[0].get("AllergyTypeID").setValue(this.allergyType[0].AllergyTypeID);
        //       this.isAllergy = true;
        //       this.AllergySaveBtn = false
        //     });
        //   }
        // });
      }
    });
  }

  deleteProblemList(data: any, i) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
      if (res == true) {
        this.problemListCollection.splice(i, 1);
        // this.triageService.DeletePatientProblemRecord(data.ProblemlistId).then((res) => {
        //   if (res) {
        //     this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        //       this.problemListCollection = res.problemCollection;
        //       this.isProblemList = true;
        //       this.problemListSaveBtn = false;
        //       for (let index = 0; index < this.problemListCollection.length; index++) {
        //         this.problemListCollection[index].file = this.bindFileData(this.problemListCollection[index].filePath);
        //         this.problemListCollection.splice(index, 1, this.problemListCollection[index])
        //       }

        //       this.problemListForm.controls["problemCollection"].reset();
        //       const problemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
        //       problemList.controls[0].get("RecordedDate").setValue(new Date());
        //       problemList.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        //       problemList.controls[0].get("ProblemTypeID").setValue(this.problemTypes[0].ProblemTypeId);
        //     });
        //   }
        // });
      }
    });
  }

  deleteNutrition(data: any, i) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
      if (res == true) {
        this.nutritionCollection.splice(i, 1);
        // this.triageService.DeleteNutritionRecord(data.NutritionAssessmentID).then((res) => {
        //   if (res) {
        //     this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
        //       this.nutritionCollection = res.nutritionCollection;
        //       this.nutritionForm.controls["nutritionCollection"].reset();
        //       this.isAllergy = true;
        //       this.NutritionSaveBtn = false;

        //       const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]);
        //       nutrition.controls[0].get("FoodIntakeTypeID").setValue(this.foodIntakeTypes[0].FoodIntaketypeID);
        //       nutrition.controls[0].get("RecordedDate").setValue(new Date());
        //       nutrition.controls[0].get("RecordedTime").setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        //     });
        //   }
        // });
      }
    });
  }
  //#endregion

  //#region "Stepper Previous"
  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
  }
  //#endregion

  //#region Medication Full Functions
  getDrugList(index) {
    const control = <FormArray>this.medicationForm.controls['medicationModel'];
    let key = control.controls[index].get('ItemDrugName').value;
    if (key != null && key.length > 2) {
      this.triageService.getDrugCode(key).then(data => {
        this.drugName = data;

      });
    }
    else {
      this.drugName = null;
    }
  }

  getDiagnosisList(index) {
    const control = <FormArray>this.medicationForm.controls['medicationModel'];
    let key = control.controls[index].get('Diagnosis').value;
    if (key != null && key.length > 2) {
      this.triageService.getDiagnosisCode(key).then(data => {
        this.diagnosisName = data;
      });
    }
    else {
      this.diagnosisName = null;
    }
  }

  onRemoveRow(rowIndex: number, row: any) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
      if (res) {
        // if (row.value.PatientmedicationId > 0) {
        //   this.triageService.DeleteMedicationRecord(row.value.PatientmedicationId);
        // }
        this.ePrescriptionDynamic.removeAt(rowIndex);
      }
    });
  }

  onAddRow() {
    this.ePrescriptionDynamic.push(this.dynamicMedicationControl());
    this.drugName = null;
    this.diagnosisName = null;
  }

  bindRoute() {
    this.triageService.getRoute().then(data => {
      this.routeName = data;
      this.setValueMedication();
    });
  }

  setRouteTooltip(index) {
    const arr = <FormArray>this.medicationForm.controls['medicationModel'];
    this.route = arr.controls[index].get('Route').value;
    for (const option of this.routeName) {
      if (this.route == option.RouteCode) {
        arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
      }
    }
  }

  setValueMedication() {
    this.triageService.getVisitIntakeDataForVisit(this.patientId, this.visitId).then((res) => {
      this.setValue = res;
      if (res != null) {
        if (this.setValue.medicationModel != undefined && this.setValue.medicationModel != null) {
          for (let i = 0; i < this.setValue.medicationModel.length; i++) {
            this.ePrescriptionDynamic.push(this.dynamicMedicationControl());
            const control = <FormArray>this.medicationForm.controls['medicationModel'];

            this.medicationForm.get("RecordedDateMedication").setValue(new Date(this.setValue.medicationModel[0].RecordedDate));
            this.medicationForm.get("RecordedTimemedication").setValue(new Date(this.setValue.medicationModel[0].RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
            this.medicationForm.get("RecordedByMedication").setValue(this.setValue.medicationModel[0].RecordedBy);

            control.controls[i].get('ItemDrugName').setValue(this.setValue.medicationModel[i].DrugName);
            control.controls[i].get('Route').setValue(this.setValue.medicationModel[i].MedicationRouteCode);

            for (const option of this.routeName) {
              if (control.controls[i].get('Route').value == option.RouteCode) {
                control.controls[i].get('routeTooltip').setValue(option.RouteDescription);
              }
            }
            control.controls[i].get('PatientmedicationId').setValue(this.setValue.medicationModel[i].PatientmedicationId);
            control.controls[i].get('Diagnosis').setValue(this.setValue.medicationModel[i].ICDCode);
            control.controls[i].get('Qty').setValue(this.setValue.medicationModel[i].TotalQuantity);
            control.controls[i].get('Days').setValue(this.setValue.medicationModel[i].NoOfDays);
            control.controls[i].get('Morning').setValue(this.setValue.medicationModel[i].Morning);
            control.controls[i].get('Brunch').setValue(this.setValue.medicationModel[i].Brunch);
            control.controls[i].get('Noon').setValue(this.setValue.medicationModel[i].Noon);
            control.controls[i].get('Evening').setValue(this.setValue.medicationModel[i].Evening);
            control.controls[i].get('Night').setValue(this.setValue.medicationModel[i].Night);
            control.controls[i].get('Before').setValue(this.setValue.medicationModel[i].Before);
            control.controls[i].get('After').setValue(this.setValue.medicationModel[i].After);
            control.controls[i].get('SIG').setValue(this.setValue.medicationModel[i].SIG);

            if (this.setValue.medicationModel[i].Start == true) {
              control.controls[i].get('MedicationStatus').setValue("start");
            }
            if (this.setValue.medicationModel[i].Hold == true) {
              control.controls[i].get('MedicationStatus').setValue("hold");
            }
            if (this.setValue.medicationModel[i].Continued == true) {
              control.controls[i].get('MedicationStatus').setValue("continue");
            }
            if (this.setValue.medicationModel[i].DisContinue == true) {
              control.controls[i].get('MedicationStatus').setValue("discontinue");
            }
            this.ePrescriptionDynamic.removeAt(this.setValue.medicationModel.length);
          }
        }

        if ((this.visitIntakeData.vitalModel != null && this.visitIntakeData.vitalModel.signOffstatus == "Yes")
          || this.visitIntakeData.nursingModel.signOffstatus == "Yes"
          || this.visitIntakeData.cognitiveModel.signOffstatus == "Yes"
          || (this.visitIntakeData.allergiesModel.length > 0 && this.visitIntakeData.allergiesModel[0].signOffstatus == "Yes")
          || this.visitIntakeData.rosModel.signOffstatus == "Yes"
          || this.visitIntakeData.socialModel.signOffstatus == "Yes"
          || (this.visitIntakeData.nutritionCollection.length > 0 && this.visitIntakeData.nutritionCollection[0].signOffstatus == "Yes")
          || (this.visitIntakeData.medicationModel.length > 0 && this.visitIntakeData.medicationModel[0].signOffstatus == "Yes")
          || (this.visitIntakeData.problemCollection.length > 0 && this.visitIntakeData.problemCollection[0].signOffstatus == "Yes")) {
          this.isShow = true;
          this.isShow1 = true;
          this.signoffButton = true;
          this.medicationForm.disable();
          this.medicationForm.controls['medicationModel'].disable();
        }
      }
    });
  }

  BindDateWithTime(date: Date, time: any): any {
    let datetemp = new Date(date);
    let getTimeHH;
    let getTimeMin;
    if (date) {
      if (time.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(time.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          getTimeHH = 12;
        } else {
          getTimeHH = parseInt(time.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (time.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(time.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          getTimeHH = 0;
        } else {
          getTimeHH = parseInt(time.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      getTimeMin = parseInt(time.toString().split(" ")[0].toString().split(":")[1]);
      datetemp.setHours(getTimeHH, getTimeMin, 0, 0);
    }

    return datetemp;
  }

  submitDataMedication() {
    if (this.medicationForm.controls['medicationModel'].valid
      && this.medicationForm.get("RecordedDateMedication").value
      && this.medicationForm.get("RecordedTimemedication").value
      && this.medicationForm.get("RecordedByMedication").value) {
      this.medicationModelCollection = [];
      const control = <FormArray>this.medicationForm.controls['medicationModel'];
      for (let index = 0; index < control.controls.length; index++) {
        let row = control.controls[index];
        this.medicationHistoryModel = new medicationModel();

        if (this.setValue.medicationModel[index] != undefined && this.setValue.medicationModel[index] != null) {
          if (this.setValue.medicationModel[index].PatientmedicationId > 0) {
            this.medicationHistoryModel.PatientmedicationId = this.setValue.medicationModel[index].PatientmedicationId;
          }
        }
        else {
          this.medicationHistoryModel.PatientmedicationId = 0;
        }

        this.medicationHistoryModel.PatientId = this.patientId,
          this.medicationHistoryModel.VisitId = this.visitId,
          this.medicationHistoryModel.RecordedDate = this.BindDateWithTime(this.medicationForm.get("RecordedDateMedication").value, this.medicationForm.get("RecordedTimemedication").value),
          this.medicationHistoryModel.RecordedBy = this.medicationForm.get("RecordedByMedication").value,
          this.medicationHistoryModel.DrugName = row.get('ItemDrugName').value,
          this.medicationHistoryModel.MedicationRouteCode = row.get('Route').value,
          this.medicationHistoryModel.ICDCode = row.get('Diagnosis').value,
          this.medicationHistoryModel.TotalQuantity = row.get('Qty').value,
          this.medicationHistoryModel.NoOfDays = row.get('Days').value,
          this.medicationHistoryModel.Morning = row.get('Morning').value,
          this.medicationHistoryModel.Brunch = row.get('Brunch').value,
          this.medicationHistoryModel.Noon = row.get('Noon').value,
          this.medicationHistoryModel.Evening = row.get('Evening').value,
          this.medicationHistoryModel.Night = row.get('Night').value,
          this.medicationHistoryModel.Before = row.get('Before').value,
          this.medicationHistoryModel.After = row.get('After').value,
          this.medicationHistoryModel.Start = row.get('MedicationStatus').value == "start" ? true : false,
          this.medicationHistoryModel.Hold = row.get('MedicationStatus').value == "hold" ? true : false,
          this.medicationHistoryModel.Continued = row.get('MedicationStatus').value == "continue" ? true : false,
          this.medicationHistoryModel.DisContinue = row.get('MedicationStatus').value == "discontinue" ? true : false,
          this.medicationHistoryModel.SIG = row.get('SIG').value

        this.medicationModelCollection.push(this.medicationHistoryModel);
      }
      this.triageService.addUpdateMedicationTriage(this.medicationModelCollection).then((res) => {

        if (res != null) {
          this.util.showMessage('Success', 'Medication History saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        } else {
          this.util.showMessage('Error', 'Medication History Not saved', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
        }

      });
    }
  }
  //#endregion Medication Full Functions

  //#region Allergy description

  toSetAllergyDesc(AllergyTypeDescription: String, index: number) {
    const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
    allergy.controls[index].get("AllergyTypeDesc").setValue(AllergyTypeDescription);
  }

  toSetAllergySeverity(description: String, index: number) {
    const allergy = <FormArray>(this.allergyForm.controls["allergiesModel"]);
    allergy.controls[index].get("AllergySeverityDesc").setValue(description);
  }
  //#endregion Allergy

  //#region Problem Type description

  toSetProblemTypeDesc(description: String) {
    const ProblemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
    ProblemList.controls[0].get("ProblemTypeDesc").setValue(description);
  }
  //#endregion Problem Type description

  //#region Nutition Assesment description

  tosetFoodIntakeTypeDesc(description: String) {
    const nutrition = <FormArray>(this.nutritionForm.controls["nutritionCollection"]);
    nutrition.controls[0].get("FoodIntakeTypeDesc").setValue(description);
  }

  //#endregion Nutition Assesment description

  //#region File Upload problemList
  public FileUploadProblemListMethod(file: any): void {
    const ProblemList = <FormArray>(this.problemListForm.controls["problemCollection"]);
    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUploadProblemList.push(Temporaryfiles);
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Temporaryfiles.name;
        let lowerCaseFilename = (viewFile.FileName).toLowerCase();
        viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
        let fileUrl = URL.createObjectURL(Temporaryfiles);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        let ConfrimFile = (this.FileUploadProblemListNames.length > 0) ? this.FileUploadProblemListNames.includes(lowerCaseFilename) : false;
        if (ConfrimFile) {
          this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
          });
        } else {
          this.ViewFileProblemList.push(viewFile);
          this.FileUploadProblemListNames.push(lowerCaseFilename);
        }
      }
      this.attachmentProblemList.nativeElement.value = '';
    }
  }

  RemoveFileProblemList(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadProblemListNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];

        this.ViewFileProblemList.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];

            let deletePath = (property.FileUrl.split(a)[0]);
            this.triageService.RemoveFile(deletePath, fileName).then(res => { })
          }
        });

        for (const tempFile of this.ViewFileProblemList) {
          if (tempFile.FileName != fileName) {
            temporaryFile.push(tempFile);
          }
        }
        this.ViewFileProblemList = [];
        this.ViewFileProblemList = temporaryFile;

        for (const tempFile of this.FileUploadProblemList) {
          if (tempFile.name != fileName) {
            temporaryFileupload.push(tempFile);
          }
        }
        this.FileUploadProblemList = [];
        this.FileUploadProblemList = temporaryFileupload;
      }
    });
  }

  setFileDataProblemList(Filedata) {
    this.ViewFileProblemList = [];
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
      this.FileUploadProblemListNames.push(lowerCaseFilename); //file name storing...
      this.ViewFileProblemList.push(viewFile);
    }
  }

  bindFileData(Filedata) {
    if (Filedata.length > 0) {
      let ViewFileCollection: Array<clsViewFile> = [];
      for (let i = 0; i < Filedata.length; i++) {
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Filedata[i].FileName;
        viewFile.Size = Filedata[i].FileSize;
        viewFile.FileUrl = Filedata[i].FileUrl
        viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
        const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
        let FileData = new Blob([byteArray], { type: Filedata[i].FileType });
        let fileUrl = URL.createObjectURL(FileData);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        ViewFileCollection.push(viewFile);
      }
      return ViewFileCollection;
    }
  }

  //#endregion File Upload

  //#region File Upload Nursing
  public FileUploadNursingMethod(file: any): void {
    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUploadNursing.push(Temporaryfiles);
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Temporaryfiles.name;
        let lowerCaseFilename = (viewFile.FileName).toLowerCase();
        viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
        let fileUrl = URL.createObjectURL(Temporaryfiles);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        let ConfrimFile = (this.FileUploadNursingNames.length > 0) ? this.FileUploadNursingNames.includes(lowerCaseFilename) : false;
        if (ConfrimFile) {
          this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
          });
        } else {
          this.ViewFileNursing.push(viewFile);
          this.FileUploadNursingNames.push(lowerCaseFilename);
        }
      }
      this.attachment.nativeElement.value = '';
    }
  }

  RemoveFileNursing(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNursingNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];

        this.ViewFileNursing.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];

            let deletePath = (property.FileUrl.split(a)[0]);
            this.triageService.RemoveFile(deletePath, fileName).then(res => { })
          }
        });

        for (const tempFile of this.ViewFileNursing) {
          if (tempFile.FileName != fileName) {
            temporaryFile.push(tempFile);
          }
        }
        this.ViewFileNursing = [];
        this.ViewFileNursing = temporaryFile;

        for (const tempFile of this.FileUploadNursing) {
          if (tempFile.name != fileName) {
            temporaryFileupload.push(tempFile);
          }
        }
        this.FileUploadNursing = [];
        this.FileUploadNursing = temporaryFileupload;
      }
    });
  }

  setFileDataNursing(Filedata) {
    this.ViewFileNursing = [];
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
      this.FileUploadNursingNames.push(lowerCaseFilename); //file name storing...
      this.ViewFileNursing.push(viewFile);
    }
  }

  //#endregion File Upload

  autoResetDrug(value, index) {
    const items = <FormArray>this.medicationForm.controls['medicationModel'];
    if (!this.itemNameList.includes(value)) {
      items.controls[index].get('ItemDrugName').setValue('');
    }
  }

  DrugId(DrugCodeID, NDCCode, Description, index) {
    this.itemDrugId = DrugCodeID;
    this.itemNameList[index] = NDCCode + '/' + Description;
  }

  DiagnosisId(DiagnosisCodeID, ICDCode, Description, index) {

    this.itemDiagnosisId = DiagnosisCodeID;
    this.diagnosisNameList[index] = ICDCode + '-' + Description;
  }


  autoResetDiagnosis(value, index) {
    const items = <FormArray>this.medicationForm.controls['medicationModel'];
    if (!this.diagnosisNameList.includes(value)) {
      items.controls[index].get('Diagnosis').setValue('');
    }
  }
}
