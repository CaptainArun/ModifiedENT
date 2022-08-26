import { Component, OnInit } from "@angular/core";
import { NewPatientService } from "../newPatient.service";
import { CustomHttpService } from "../../core/custom-http.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-patient-history",
  templateUrl: "./patient-history.component.html",
  styleUrls: ["./patient-history.component.css"],
})
export class PatientHistoryComponent implements OnInit {
  subMenuVals: any;
  subMenuVals1: any;
  subMenuVals2: any;
  subMenuVals3: any;

  patientId1: number;
  demographicVal: any = {};
  patientId: any;
  constructor(
    public demographicser: NewPatientService,
    public customHttp: CustomHttpService,
    public router: Router,
    public activateRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
    });

    this.subMenuVals = [
      {
        Id: 1,
        Title: "Patient Insurance",
        Url: "../patientInsurance",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/insurance.png' />",
      },
      {
        Id: 2,
        Title: "Patient Work History",
        Url: "../workhistory",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/workhistory.png' />",
      },
      {
        Id: 3,
        Title: "Patient Social History",
        Url: "../socialhistory",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/socialHistory.png' />",
      },
      {
        Id: 4,
        Title: "Patient Family History",
        Url: "../PatientFamilyHistory",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Family_history.png' />",
      },
      //{ "Id": 5, "Title": "Family Information", "Url": "familyinformation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/Patient_Icons/familyinformation.png' />" },
      //{ "Id": 6, "Title": "Imports & Exports", "Url": "importsexports", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/Patient_Icons/imports.png' />" },
      //{ "Id": 7, "Title": "Ledger", "Url": "ledger", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/Patient_Icons/ledger.png' />" }
    ];
    this.subMenuVals1 = [
      {
        Id: 1,
        Title: "Vitals ",
        Url: "../patientVitals",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Vitals.png' />",
      },
      {
        Id: 2,
        Title: "Problem list",
        Url: "../patientProblemlist",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Problem_list.png' />",
      },
      {
        Id: 3,
        Title: "Allergies",
        Url: "../patientAllergy",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Allergy.png' />",
      },
      {
        Id: 4,
        Title: "Medication",
        Url: "../patientMedication",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Medication.png' />",
      },
      {
        Id: 5,
        Title: "ROS",
        Url: "../patientROS",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Ros.png' />",
      },
      {
        Id: 6,
        Title: "Nutrition",
        Url: "../patientNutrition",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Nutrition.png' />",
      },
      {
        Id: 6,
        Title: "Immunization",
        Url: "../Immunization",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Immunization.png' />",
      },
    ];
    this.subMenuVals2 = [
      {
        Id: 1,
        Title: "Patient Visit ",
        Url: "../PatientVisit",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/insurance.png' />",
      },
      {
        Id: 2,
        Title: "Patient Diagnosis",
        Url: "../Diagnosis",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Diagnosis.png' />",
      },
      {
        Id: 3,
        Title: "Patient Procedure",
        Url: "../Procedure",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/patient_procudeure.png' />",
      },
      {
        Id: 4,
        Title: "Patient Care Plan",
        Url: "../PatientCarePlan",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Patient_care.png' />",
      },
      {
        Id: 5,
        Title: "Patient Audiology",
        Url: "../audiology",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Audiology.png' />",
      },
      {
        Id: 6,
        Title: "Patient e-Prescription",
        Url: "../e-prescription",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/e_prescription.png' />",
      },

      {

        Id: 7,
        Title: "Patient e-Lab",
        Url: "../patientELab",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/e_lab.png' />",
      },

      {
        Id: 8,
        Title: "Patient Radiology",
        Url: "../radiology",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/radiology.png' />",
      },
      {
        Id: 9,
        Title: "Patient Function & Cognitive",
        Url: "../patientCognitive",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/cognitive.png' />",
      },
      {
        Id: 10,
        Title: "Patient Physical Exam",
        Url: "../physicalexam",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Physical_exam.png' />",
      },
    ];
    this.subMenuVals3 = [
      {
        Id: 1,
        Title: "Patient Admission ",
        Url: "../PatientAdmission",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/patient_procudeure.png' />",
      },
      {
        Id: 2,
        Title: "Hospitalization History",
        Url: "../hospitalHistory",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/Hospitalization-history.png' />",
      },
      {
        Id: 3,
        Title: "Discharge Summary",
        Url: "../discharge",
        isOpen: null,
        Items: [],
        Icon: "<img  src = 'assets/images/Patient_Icons/workhistory.png' />",
      },
    ];
  }
  back() {
    this.router.navigate(["/home/newPatient"]);
  }
}
