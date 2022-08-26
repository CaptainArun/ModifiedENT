import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'newPatient-home',
  templateUrl: 'newPatient-home.component.html', 
  styleUrls: ['./newPatient-home.component.css']
})

export class NewPatientHomeComponent implements OnInit {
  subMenuVals = [];
  subMenuMedical = [];

  ngOnInit() {
    this.subMenuVals = [      
      { "Id": 1, "Title": "Patient Profile", "Url": "profile", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 2, "Title": "Insurance", "Url": "insurance", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/insurance.png' />" },
      { "Id": 3, "Title": "Work History", "Url": "workhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/workhistory.png' />" },
      { "Id": 5, "Title": "Family Information", "Url": "familyinformation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/familyinformation.png' />" },
      { "Id": 6, "Title": "Imports & Exports", "Url": "importsexports", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/imports.png' />" },
    ],
    this.subMenuMedical = [
      { "Id": 1, "Title": "Allergy", "Url": "allergy", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Allergy.png' />" },
      { "Id": 3, "Title": "Admission", "Url": "addmission", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/admission.png' />" },
      { "Id": 2, "Title": "Documents", "Url": "patientdocuments", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/common/documents.png' />" },
      { "Id": 5, "Title": "Diagnosis Identified", "Url": "diagnosisidentified", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/diagnosis-Identified.png' />" },
      { "Id": 6, "Title": "Discharge Summary", "Url": "dischargesummary", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/discharge_summary.png' />" },
      { "Id": 7, "Title": "Diagnosis & Assessment", "Url": "diagnosisassessment", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/diagnosis-assessment.png' />" },
      { "Id": 9, "Title": "Functional & cognitive", "Url": "functionalcognitive", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/cognitive.png' />" },
      { "Id": 10, "Title": "Family Health History", "Url": "familyhealthhstory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/family-health-history.png' />" },
      { "Id": 12, "Title": "Hospitalization History", "Url": "hospitalizationhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/hospitalization-history.png' />" },
      { "Id": 13, "Title": "Immunization", "Url": "immunization", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Immunization.png' />" },      
      { "Id": 14, "Title": "Medication", "Url": "medication", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Medication.png' />" },
      { "Id": 17, "Title": "Problems / Systemic Disease ", "Url": "problemlist", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/problems.png' />" },
      { "Id": 18, "Title": "Procedure Performed", "Url": "procedures", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/procedure.png' />" },
      { "Id": 21, "Title": "Physiotherapy", "Url": "physiotherapy", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/physiotherapy.png' />" },
      { "Id": 23, "Title": "Patient Visit", "Url": "patientvisit", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 24, "Title": "Physical Exam", "Url": "physicaleexamination", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/physical-exam.png' />" },
      { "Id": 25, "Title": "Radiology", "Url": "radiology", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/radiology.png' />" },
      { "Id": 26, "Title": "Referrals", "Url": "referral", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/referrals.png' />" },
      { "Id": 27, "Title": "Social history", "Url": "socialhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/SocialHistory.png' />" },      
      { "Id": 28, "Title": "Scheduled Tests", "Url": "scheduledtests", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/sceduletest.png' />" },             
      { "Id": 29, "Title": "SOAP Notes", "Url": "soapnotes", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/soap-notes.png' />" },
      { "Id": 30, "Title": "Surgical History", "Url": "surgicalhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/surgical-history.png' />" },
      { "Id": 31, "Title": "Vitals ", "Url": "vitals", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/vitalinformation.png' />" },
      { "Id": 32, "Title": "Visit Summary", "Url": "visitsummary", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/visit.png' />" },
      { "Id": 33, "Title": "Audiology", "Url": "audiology", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/audiology.png' />" },
      { "Id": 34, "Title": "e-Prescription", "Url": "e-prescription", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/e-prescription.png' />" },
      { "Id": 35, "Title": "Discharge", "Url": "discharge", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/discharge.png' />" },

            ]
  }
}
