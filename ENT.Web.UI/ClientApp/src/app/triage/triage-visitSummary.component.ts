import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableConfig } from '../ux/columnConfig';
import { TriageService } from './triage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService } from '../core/custom-http.service';
import { NewPatientService } from '../patient/newPatient.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'triage-visitsummary',
  templateUrl: 'triage-visitSummary.component.html'
})

export class TriageVisitSummaryComponent implements OnInit {

  tableConfig1: TableConfig = new TableConfig;
  tableConfig2: TableConfig = new TableConfig;
  tableConfig3: TableConfig = new TableConfig;
  tableConfig4: TableConfig = new TableConfig;

  rosForm: FormGroup;
  patientId: any;
  VisitId: any;
  isLinear = false;
  visiteIntakeList: any;
  visitDateAndTime: any[] = [];
  recordedDuring: any;
  visitID: any;
  facilityId: number;
  recordedby: any;
  selected = 'option1';
  disableSelect = true;
  vitalsFormGroup: FormGroup;
  allergiesFormGroup: FormGroup;
  problemlistFormGroup: FormGroup;
  medicationFormGroup: FormGroup;
  historyFormGroup: FormGroup;
  rosFormGroup: FormGroup;
  nutritionFormGroup: FormGroup;
  functionalFormGroup: FormGroup;
  nursingSignOffFormGroup: FormGroup;
  IsBloodPressure: string;
  IsDiabetic: string;
  Gaitvalue: any = "";
  Gaitvaluedata: any;
  routeName: any;


  constructor(public fb: FormBuilder, public custHttp: CustomHttpService, public newPatientService: NewPatientService,
    public dialogRef: MatDialogRef<TriageVisitSummaryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public triageService: TriageService, private activeRoute: ActivatedRoute) {


    this.tableConfig1.showPagination = false;
    this.tableConfig1.showView = false;
    this.tableConfig1.showIcon = false;
    this.tableConfig1.showEdit = false;
    this.tableConfig1.showAdd = false;
    this.tableConfig1.showDelete = false;

    this.tableConfig1.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AllergyTypeDesc', DisplayName: 'Allergy Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Name', DisplayName: 'Allergy Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AllergySeverityDesc', DisplayName: 'Severity', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Alleviatedby', DisplayName: 'Alleviated By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Aggravatedby', DisplayName: 'Aggravated By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Reaction', DisplayName: 'Reaction', DisplayMode: 'Text', LinkUrl: '' },
    ];

    this.tableConfig2.showPagination = false;
    this.tableConfig2.showView = false;
    this.tableConfig2.showIcon = false;
    this.tableConfig2.showEdit = false;
    this.tableConfig2.showAdd = false;
    this.tableConfig2.showDelete = false;

    this.tableConfig2.columnConfig = [

      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemTypeDesc', DisplayName: 'Problem Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemDescription', DisplayName: 'Problem Desc', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Status', DisplayName: 'Problem Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ICD10Code', DisplayName: 'ICD Code', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AlleviatedBy', DisplayName: 'Alleviated By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Aggravatedby', DisplayName: 'Aggravated By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DiagnosedDate', DisplayName: 'Diagnosis Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'ResolvedDate', DisplayName: 'Resolved Date', DisplayMode: 'DateTime', FormatString: "dd-MM-yyyy", LinkUrl: '' },
    ];
    this.tableConfig3.showPagination = false;
    this.tableConfig3.showView = false;
    this.tableConfig3.showIcon = false;
    this.tableConfig3.showEdit = false;
    this.tableConfig3.showAdd = false;
    this.tableConfig3.showDelete = false;
    this.tableConfig3.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DrugName', DisplayName: 'Drug Code', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'MedicationRouteCode', DisplayName: 'Route', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: "ICDCode", DisplayName: "Diagnosis code", DisplayMode: "Text", LinkUrl: "", },
      { PropertyName: "TotalQuantity", DisplayName: "Total Quantity", DisplayMode: "Text", LinkUrl: "" },
      { PropertyName: "NoOfDays", DisplayName: "No Of Days", DisplayMode: "Text", LinkUrl: "" },
      { PropertyName: "SIG", DisplayName: "SIG", DisplayMode: "Text", LinkUrl: "", },
      // { PropertyName: "ICD10CodeDesc", DisplayName: "Diagnosis ICD", DisplayMode: "Text", LinkUrl: "", },
      // { PropertyName: "medicationRoute", DisplayName: "Route", DisplayMode: "Text", LinkUrl: "", }     
    ];


    this.tableConfig4.showPagination = false;
    this.tableConfig4.showView = false;
    this.tableConfig4.showIcon = false;
    this.tableConfig4.showEdit = false;
    this.tableConfig4.showAdd = false;
    this.tableConfig4.showDelete = false;

    this.tableConfig4.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: "IntakeCategory", DisplayName: "Category", DisplayMode: "Text", LinkUrl: "" },
      { PropertyName: 'EatRegularly', DisplayName: 'Eating Regularly', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Carvings', DisplayName: 'Cravings', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DislikedIntake', DisplayName: 'Dislikes', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'FoodAllergies', DisplayName: 'Food Allergies', DisplayMode: 'Text', LinkUrl: '' },
    ];
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.activeRoute.params.subscribe(params => {
      this.patientId = params['PatientId'],
        this.VisitId = params['VisitId']
    });

    this.vitalsFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.allergiesFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.problemlistFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.medicationFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.historyFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.rosFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.nutritionFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.functionalFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });
    this.nursingSignOffFormGroup = this.fb.group({
      matStepperTab: ["", Validators.required],
    });

    this.rosForm = this.fb.group(
      {
        VisitDate: [''],
        RecordedDate: [''],
        RecordedTime: [''],
        recordedDuring: [''],
        RecordedBy: [''],

        //ROSGeneral
        Weightlossorgain: [''],
        Feverorchills: [''],
        Troublesleeping: [''],
        Fatigue: [''],
        GeneralWeakness: [''],
        GeneralOthers: [''],
        GeneralothersComments: [''],

        //ROS Skin
        Rashes: [''],
        SkinItching: [''],
        Colorchanges: [''],
        SkinLumps: [''],
        Dryness: [''],
        Hairandnailchanges: [''],
        SkinOthers: [''],
        SkinothersComments: [''],
        // SkinothersComments: [''],

        //ROSHead
        Headache: [''],
        Headinjury: [''],
        Others: [''],
        HeadothersComments: [''],

        //ROS Ears
        Decreasedhearing: [''],
        Earache: [''],
        Ringinginears: [''],
        Drainage: [''],
        EarOthers: [''],
        EarothersComments: [''],

        //ROS Eyes
        Vision: [''],
        Blurryordoublevision: [''],
        Cataracts: [''],
        Glassesorcontacts: [''],
        Flashinglights: [''],
        Lasteyeexam: [''],
        EyePain: [''],
        Specks: [''],
        Redness: [''],
        Glaucoma: [''],
        EyeOthers: [''],
        EyesothersComments: [''],

        //ROS Nose
        Stuffiness: [''],
        NoseItching: [''],
        Nosebleeds: [''],
        Discharge: [''],
        Hayfever: [''],
        Sinuspain: [''],
        NoseOthers: [''],
        NoseothersComments: [''],

        //ROS Throat
        Teeth: [''],
        Soretongue: [''],
        Thrush: [''],
        Gums: [''],
        Drymouth: [''],
        Nonhealingsores: [''],
        Bleeding: [''],
        Sorethroat: [''],
        Sinus: [''],
        Lastdentalexam: [''],
        Dentures: [''],
        Hoarseness: [''],
        ThroatOthers: [''],
        ThroatothersComments: [''],

        //ROS Neck
        NeckLumps: [''],
        NeckPain: [''],
        Swollenglands: [''],
        Stiffness: [''],
        NeckOthers: [''],
        NeckothersComments: [''],

        //ROS Respiratory
        Cough: [''],
        Coughingupblood: [''],
        Wheezing: [''],
        Sputum: [''],
        Shortnessofbreath: [''],
        Painfulbreathing: [''],
        RespiratoryOthers: [''],
        Respiratoryotherscomments: [''],

        //ROS Neurologic
        Dizziness: [''],
        Weakness: [''],
        Tremor: [''],
        Fainting: [''],
        Numbness: [''],
        Seizures: [''],
        Tingling: [''],
        NeurologicOthers: [''],
        Neurologicotherscomments: [''],

        //ROS Hematologic
        Easeofbruising: [''],
        Easeofbleeding: [''],
        HematologicOthers: [''],
        Hematologicotherscomments: [''],

        //ROS Psychiatric
        Nervousness: [''],
        Memoryloss: [''],
        Stress: [''],
        Depression: [''],
        PsychiatricOthers: [''],
        Psychiatricotherscomments: [''],

      });

    this.getProblemList();
    if (this.visiteIntakeList.vitalModel.IsBloodPressure == "y") {
      this.IsBloodPressure = "YES";
    } else if (this.visiteIntakeList.vitalModel.IsBloodPressure == "n") {
      this.IsBloodPressure = "NO";
    } else {
      this.IsBloodPressure = "Unknown"
    }

    if (this.visiteIntakeList.vitalModel.IsDiabetic == "y") {
      this.IsDiabetic = "YES";
    } else if (this.visiteIntakeList.vitalModel.IsDiabetic == "n") {
      this.IsDiabetic = "NO";
    } else {
      this.IsDiabetic = "Unknown";
    }
    this.getGaitValue();
  }

  getProblemList() {
    this.visiteIntakeList = this.data;
    this.setRosFormValue();
  }

  getVisitForPatient() {
    this.newPatientService.GetVisitsForPatient(this.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateAndTime[i] = res[i].VisitDateandTime;
      }
    })
  }

  RecordedDuring(index: any) {
    this.newPatientService.GetVisitsForPatient(this.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
        }
      }
    })
  }

  getProviderNames() {
    this.newPatientService.GetProviderNames(this.facilityId).then(res => {
      this.recordedby = res;
    })
  }
  dialogClose() {
    this.dialogRef.close();
  }

  setRosFormValue() {
    this.rosForm.disable();
    //General
    this.rosForm.get('Weightlossorgain').setValue(this.visiteIntakeList.rosModel.Weightlossorgain);
    this.rosForm.get('Feverorchills').setValue(this.visiteIntakeList.rosModel.Feverorchills);
    this.rosForm.get('Troublesleeping').setValue(this.visiteIntakeList.rosModel.Troublesleeping);
    this.rosForm.get('Fatigue').setValue(this.visiteIntakeList.rosModel.Fatigue);
    this.rosForm.get('GeneralWeakness').setValue(this.visiteIntakeList.rosModel.GeneralWeakness);
    this.rosForm.get('GeneralOthers').setValue(this.visiteIntakeList.rosModel.GeneralOthers);
    this.rosForm.get('GeneralothersComments').setValue(this.visiteIntakeList.rosModel.GeneralothersComments);
    //skin
    this.rosForm.get('Rashes').setValue(this.visiteIntakeList.rosModel.Rashes);
    this.rosForm.get('SkinItching').setValue(this.visiteIntakeList.rosModel.SkinItching);
    this.rosForm.get('Colorchanges').setValue(this.visiteIntakeList.rosModel.Colorchanges);
    this.rosForm.get('SkinLumps').setValue(this.visiteIntakeList.rosModel.SkinLumps);
    this.rosForm.get('Dryness').setValue(this.visiteIntakeList.rosModel.Dryness);
    this.rosForm.get('Hairandnailchanges').setValue(this.visiteIntakeList.rosModel.Hairandnailchanges);
    this.rosForm.get('SkinOthers').setValue(this.visiteIntakeList.rosModel.SkinOthers);
    this.rosForm.get('SkinothersComments').setValue(this.visiteIntakeList.rosModel.SkinothersComments);
    //Head
    this.rosForm.get('Headache').setValue(this.visiteIntakeList.rosModel.Headache);
    this.rosForm.get('Headinjury').setValue(this.visiteIntakeList.rosModel.Headinjury);
    this.rosForm.get('Others').setValue(this.visiteIntakeList.rosModel.Others);
    this.rosForm.get('HeadothersComments').setValue(this.visiteIntakeList.rosModel.HeadothersComments);
    //Ears
    this.rosForm.get('Decreasedhearing').setValue(this.visiteIntakeList.rosModel.Decreasedhearing);
    this.rosForm.get('Earache').setValue(this.visiteIntakeList.rosModel.Earache);
    this.rosForm.get('Ringinginears').setValue(this.visiteIntakeList.rosModel.Ringinginears);
    this.rosForm.get('Drainage').setValue(this.visiteIntakeList.rosModel.Drainage);
    this.rosForm.get('EarOthers').setValue(this.visiteIntakeList.rosModel.EarOthers);
    this.rosForm.get('EarothersComments').setValue(this.visiteIntakeList.rosModel.EarothersComments);
    //Eyes
    this.rosForm.get('Vision').setValue(this.visiteIntakeList.rosModel.Vision);
    this.rosForm.get('Blurryordoublevision').setValue(this.visiteIntakeList.rosModel.Blurryordoublevision);
    this.rosForm.get('Cataracts').setValue(this.visiteIntakeList.rosModel.Cataracts);
    this.rosForm.get('Glassesorcontacts').setValue(this.visiteIntakeList.rosModel.Glassesorcontacts);
    this.rosForm.get('Flashinglights').setValue(this.visiteIntakeList.rosModel.Flashinglights);
    this.rosForm.get('Lasteyeexam').setValue(this.visiteIntakeList.rosModel.Lasteyeexam);
    this.rosForm.get('EyePain').setValue(this.visiteIntakeList.rosModel.EyePain);
    this.rosForm.get('Specks').setValue(this.visiteIntakeList.rosModel.Specks);
    this.rosForm.get('Redness').setValue(this.visiteIntakeList.rosModel.Redness);
    this.rosForm.get('Glaucoma').setValue(this.visiteIntakeList.rosModel.Glaucoma);
    this.rosForm.get('EyeOthers').setValue(this.visiteIntakeList.rosModel.EyeOthers);
    this.rosForm.get('EyesothersComments').setValue(this.visiteIntakeList.rosModel.EyesothersComments);
    //Nose
    this.rosForm.get('Stuffiness').setValue(this.visiteIntakeList.rosModel.Stuffiness);
    this.rosForm.get('NoseItching').setValue(this.visiteIntakeList.rosModel.NoseItching);
    this.rosForm.get('Nosebleeds').setValue(this.visiteIntakeList.rosModel.Nosebleeds);
    this.rosForm.get('Discharge').setValue(this.visiteIntakeList.rosModel.Discharge);
    this.rosForm.get('Hayfever').setValue(this.visiteIntakeList.rosModel.Hayfever);
    this.rosForm.get('Sinuspain').setValue(this.visiteIntakeList.rosModel.Sinuspain);
    this.rosForm.get('NoseOthers').setValue(this.visiteIntakeList.rosModel.NoseOthers);
    this.rosForm.get('NoseothersComments').setValue(this.visiteIntakeList.rosModel.NoseothersComments);
    //Throat
    this.rosForm.get('Teeth').setValue(this.visiteIntakeList.rosModel.Teeth);
    this.rosForm.get('Soretongue').setValue(this.visiteIntakeList.rosModel.Soretongue);
    this.rosForm.get('Thrush').setValue(this.visiteIntakeList.rosModel.Thrush);
    this.rosForm.get('Gums').setValue(this.visiteIntakeList.rosModel.Gums);
    this.rosForm.get('Drymouth').setValue(this.visiteIntakeList.rosModel.Drymouth);
    this.rosForm.get('Nonhealingsores').setValue(this.visiteIntakeList.rosModel.Nonhealingsores);
    this.rosForm.get('Bleeding').setValue(this.visiteIntakeList.rosModel.Bleeding);
    this.rosForm.get('Sorethroat').setValue(this.visiteIntakeList.rosModel.Sorethroat);
    this.rosForm.get('Sinus').setValue(this.visiteIntakeList.rosModel.Sinus);
    this.rosForm.get('Lastdentalexam').setValue(this.visiteIntakeList.rosModel.Lastdentalexam);
    //    this.patientROSform.get('Lastdentalexamdate').setValue(this.visiteIntakeList.vitalModel.Lastdentalexamdate);
    this.rosForm.get('Dentures').setValue(this.visiteIntakeList.rosModel.Dentures);
    this.rosForm.get('Hoarseness').setValue(this.visiteIntakeList.rosModel.Hoarseness);
    this.rosForm.get('ThroatOthers').setValue(this.visiteIntakeList.rosModel.ThroatOthers);
    this.rosForm.get('ThroatothersComments').setValue(this.visiteIntakeList.rosModel.ThroatothersComments);
    //Neck
    this.rosForm.get('NeckLumps').setValue(this.visiteIntakeList.rosModel.NeckLumps);
    this.rosForm.get('NeckPain').setValue(this.visiteIntakeList.rosModel.NeckPain);
    this.rosForm.get('Swollenglands').setValue(this.visiteIntakeList.rosModel.Swollenglands);
    this.rosForm.get('Stiffness').setValue(this.visiteIntakeList.rosModel.Stiffness);
    this.rosForm.get('NeckOthers').setValue(this.visiteIntakeList.rosModel.NeckOthers);
    this.rosForm.get('NeckothersComments').setValue(this.visiteIntakeList.rosModel.NeckothersComments);
    //Respiratory
    this.rosForm.get('Cough').setValue(this.visiteIntakeList.rosModel.Cough);
    this.rosForm.get('Coughingupblood').setValue(this.visiteIntakeList.rosModel.Coughingupblood);
    this.rosForm.get('Wheezing').setValue(this.visiteIntakeList.rosModel.Wheezing);
    this.rosForm.get('Sputum').setValue(this.visiteIntakeList.rosModel.Sputum);
    this.rosForm.get('Shortnessofbreath').setValue(this.visiteIntakeList.rosModel.Shortnessofbreath);
    this.rosForm.get('Painfulbreathing').setValue(this.visiteIntakeList.rosModel.Painfulbreathing);
    this.rosForm.get('RespiratoryOthers').setValue(this.visiteIntakeList.rosModel.RespiratoryOthers);
    this.rosForm.get('Respiratoryotherscomments').setValue(this.visiteIntakeList.rosModel.Respiratoryotherscomments);
    //Neurology
    this.rosForm.get('Dizziness').setValue(this.visiteIntakeList.rosModel.Dizziness);
    this.rosForm.get('Weakness').setValue(this.visiteIntakeList.rosModel.Weakness);
    this.rosForm.get('Tremor').setValue(this.visiteIntakeList.rosModel.Tremor);
    this.rosForm.get('Fainting').setValue(this.visiteIntakeList.rosModel.Fainting);
    this.rosForm.get('Numbness').setValue(this.visiteIntakeList.rosModel.Numbness);
    this.rosForm.get('Seizures').setValue(this.visiteIntakeList.rosModel.Seizures);
    this.rosForm.get('Tingling').setValue(this.visiteIntakeList.rosModel.Tingling);
    this.rosForm.get('NeurologicOthers').setValue(this.visiteIntakeList.rosModel.NeurologicOthers);
    this.rosForm.get('Neurologicotherscomments').setValue(this.visiteIntakeList.rosModel.Neurologicotherscomments);
    //Hematologic
    this.rosForm.get('Easeofbruising').setValue(this.visiteIntakeList.rosModel.Easeofbruising);
    this.rosForm.get('Easeofbleeding').setValue(this.visiteIntakeList.rosModel.Easeofbleeding);
    this.rosForm.get('HematologicOthers').setValue(this.visiteIntakeList.rosModel.HematologicOthers);
    this.rosForm.get('Hematologicotherscomments').setValue(this.visiteIntakeList.rosModel.Hematologicotherscomments);
    //Psychiatric
    this.rosForm.get('Nervousness').setValue(this.visiteIntakeList.rosModel.Nervousness);
    this.rosForm.get('Memoryloss').setValue(this.visiteIntakeList.rosModel.Memoryloss);
    this.rosForm.get('Stress').setValue(this.visiteIntakeList.rosModel.Stress);
    this.rosForm.get('Depression').setValue(this.visiteIntakeList.rosModel.Depression);
    this.rosForm.get('PsychiatricOthers').setValue(this.visiteIntakeList.rosModel.PsychiatricOthers);
    this.rosForm.get('Psychiatricotherscomments').setValue(this.visiteIntakeList.rosModel.Psychiatricotherscomments);
    this.rosForm.get('RecordedTime').setValue(new Date(this.visiteIntakeList.rosModel.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.rosForm.get('RecordedDate').setValue(new Date(this.visiteIntakeList.rosModel.RecordedDate));
    this.rosForm.get('RecordedBy').setValue(this.visiteIntakeList.rosModel.RecordedBy);
    this.rosForm.get('VisitDate').setValue(this.visiteIntakeList.rosModel.visitDateandTime);//recordedDuring
    this.rosForm.get('recordedDuring').setValue(this.visiteIntakeList.rosModel.recordedDuring);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getGaitValue() {
    this.triageService.GetGaitvalue().then((res) => {
      this.Gaitvaluedata = res;
      if (this.visiteIntakeList.cognitiveModel.Gait > 0) {
        this.Gaitvalue = this.Gaitvaluedata.find(x => {
          if (x.GaitMasterID == this.visiteIntakeList.cognitiveModel.Gait) {
            return x.GaitMasterDesc;
          }
        }
        ).GaitMasterDesc;
      }
    });

  }


  onBindItemRoute(event: any) {
    if (event.Item.MedicationRouteCode != null) {
      this.triageService.getRoute().then(data => {
        this.routeName = data;
        event.Item.MedicationRouteCode = this.routeName.find(x => {
          if (x.RouteCode == event.Item.MedicationRouteCode) {
            return x.RouteDescription
          }
        }).RouteDescription
      });
    }
  }
}
