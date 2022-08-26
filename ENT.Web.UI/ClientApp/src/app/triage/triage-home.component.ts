import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'triage-home',
  templateUrl: './triage-home.component.html'
})

export class TriageHomeComponent implements OnInit {
  router: any;
  subMenuVals = [];
  subMenuVals1 = [];
  subMenuVals2 = [];
  subMenuVals3 = [];
  subMenuMedical = [];


  ngOnInit() {
    this.subMenuVals = [
      { "Id": 1, "Title": "Physician Consultation", "Url": "physicianconsult", "isOpen": null, },
      { "Id": 2, "Title": "SOAP Notes", "Url": "opdconsult", "isOpen": null, },
      // { "Id": 3, "Title": "Audiology", "Url": "audiology", "isOpen": null, },
      // { "Id": 4, "Title": "Speech Therapy ", "Url": "speechtherapy", "isOpen": null, },
      // { "Id": 5, "Title": "consult4", "Url": "consult4", "isOpen": null, },
      // { "Id": 6, "Title": "consult5", "Url": "consult5", "isOpen": null, },
    ]
    this.subMenuVals1 = [
      { "Id": 1, "Title": "Audiology", "Url": "audiology", "isOpen": null, },
      { "Id": 2, "Title": "Speech Therapy ", "Url": "speechtherapy", "isOpen": null, },
      { "Id": 3, "Title": "Tympanogram", "Url": "tympanogram", "isOpen": null, },
      { "Id": 4, "Title": "OAE Test", "Url": "oaetest", "isOpen": null, },
      { "Id": 5, "Title": "BERA Test", "Url": "beratest", "isOpen": null, },
      { "Id": 6, "Title": "ASSR Test", "Url": "assrtest", "isOpen": null, },
      { "Id": 6, "Title": "Hearing Aid Trial", "Url": "hearingaidtrial", "isOpen": null, },
      { "Id": 6, "Title": "Tinnitus Masking", "Url": "tinnitusmasking", "isOpen": null, },
      { "Id": 7, "Title": "Special Tests", "Url": "specialtests", "isOpen": null, },
      { "Id": 6, "Title": "Electrocochleography", "Url": "electrocochleography", "isOpen": null, },
      { "Id": 7, "Title": "Tuning Fork Test", "Url": "tuningforktest", "isOpen": null, },
    ]
    // this.subMenuVals2 = [
    //   { "Id": 1, "Title": "OT Request List", "Url": "ot", "isOpen": null, },
    //   { "Id": 1, "Title": "Test Results", "Url": "testResult", "isOpen": null, },
    //   { "Id": 2, "Title": "OT Schedule & Calendar", "Url": "calender", "isOpen": null, },
    //   { "Id": 3, "Title": "OT Schedule List", "Url": "schedule", "isOpen": null, },
    //   { "Id": 1, "Title": "Pre Procedure Notes", "Url": "preprocedurenotes", "isOpen": null, },
    //   { "Id": 1, "Title": "Post Procedure Notes", "Url": "postprocedurenotes", "isOpen": null, },
    //   { "Id": 2, "Title": "Observation Notes", "Url": "#", "isOpen": null, },
    //   { "Id": 3, "Title": "Discharge Notes", "Url": "dischargenotes", "isOpen": null, },
    // ]
    this.subMenuVals3 = [
      { "Id": 1, "Title": "Triage", "Url": "triage", "isOpen": null, },
      { "Id": 2, "Title": "Physician Consultation", "Url": "physicianconsult", "isOpen": null, },
      { "Id": 3, "Title": "SOAP Notes", "Url": "opdconsult", "isOpen": null, },
    ]
    this.subMenuMedical = [
      { "Id": 1, "Title": "Allergy", "Url": "allergy", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Allergy.png' />" },
      //{ "Id": 2, "Title": "Appointments", "Url": "appointments", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/common/appointment.png' />" }, 
      //{ "Id": 3, "Title": "Alternative Medicine", "Url": "alternativemedicine", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 3, "Title": "Admission", "Url": "addmission", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/admission.png' />" },
      //{ "Id": 4, "Title": "Care plan", "Url": "careplan", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/care.png' />" },
      { "Id": 2, "Title": "Documents", "Url": "patientdocuments", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/common/documents.png' />" },
      { "Id": 5, "Title": "Diagnosis Identified", "Url": "diagnosisidentified", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/diagnosis-Identified.png' />" },
      { "Id": 6, "Title": "Discharge Summary", "Url": "dischargesummary", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/discharge_summary.png' />" },
      { "Id": 7, "Title": "Diagnosis & Assessment", "Url": "diagnosisassessment", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/diagnosis-assessment.png' />" },
      //{ "Id": 8, "Title": "Electronic Notes", "Url": "electronicnotes", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/electronic-notes.png' />" },
      //{ "Id": 10, "Title": "eMarBar ", "Url": "emarbar", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 9, "Title": "Functional & cognitive", "Url": "functionalcognitive", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/cognitive.png' />" },
      //{ "Id": 12, "Title": "Family Information", "Url": "familyinformation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 10, "Title": "Family Health History", "Url": "familyhealthhstory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/family-health-history.png' />" },
     //{ "Id": 11, "Title": "Goals ", "Url": "goals", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/goals.png' />" },
      { "Id": 12, "Title": "Hospitalization History", "Url": "hospitalizationhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/hospitalization-history.png' />" },
      { "Id": 13, "Title": "Immunization", "Url": "immunization", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Immunization.png' />" },      
      //{ "Id": 18, "Title": "Lab Order ", "Url": "laborder", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 14, "Title": "Medication", "Url": "medication", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/Medication.png' />" },
      //{ "Id": 15, "Title": "Nutrition Details", "Url": "nutritiondetails", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/nutrition.png' />" },
     // { "Id": 16, "Title": "Nursing Notes", "Url": "nursingnote", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/nursing-notes.png' />" },
      //{ "Id": 22, "Title": "Pathology", "Url": "pathology", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 17, "Title": "Problems / Systemic Disease ", "Url": "problemlist", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/problems.png' />" },
      { "Id": 18, "Title": "Procedure Performed", "Url": "procedures", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/procedure.png' />" },
      //{ "Id": 19, "Title": "Progress Notes", "Url": "progressnotes", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/progress.png' />" },      
      { "Id": 21, "Title": "Physiotherapy", "Url": "physiotherapy", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/physiotherapy.png' />" },
      //{ "Id": 28, "Title": "Rehabilitation", "Url": "rehabilitation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      //{ "Id": 29, "Title": "Physician Notes", "Url": "physiciannotes", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      //{ "Id": 22, "Title": "Patient Education", "Url": "patienteducation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/patient-education.png' />" },
      { "Id": 23, "Title": "Patient Visit", "Url": "patientvisit", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 24, "Title": "Physical Exam", "Url": "physicaleexamination", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/physical-exam.png' />" },
      { "Id": 25, "Title": "Radiology", "Url": "radiology", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/radiology.png' />" },
      { "Id": 26, "Title": "Referrals", "Url": "referral", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/referrals.png' />" },
      { "Id": 27, "Title": "Social history", "Url": "socialhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/SocialHistory.png' />" },      
      { "Id": 28, "Title": "Scheduled Tests", "Url": "scheduledtests", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/sceduletest.png' />" },             
      { "Id": 29, "Title": "SOAP Notes", "Url": "soapnotes", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/soap-notes.png' />" },
      //{ "Id": 38, "Title": "Symptoms / Reaction", "Url": "symptomsreaction", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 30, "Title": "Surgical History", "Url": "surgicalhistory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/surgical-history.png' />" },
      //{ "Id": 40, "Title": "Scheduled Appointments", "Url": "scheduledappointments", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      //{ "Id": 41, "Title": "Speciality ", "Url": "speciality ", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      //{ "Id": 42, "Title": "Transition Of Care", "Url": "transitioncare", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      //{ "Id": 43, "Title": "Transition Of Care  Generated  List ", "Url": "transitioncaregeneratedlist", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/ledger.png' />" },
      { "Id": 31, "Title": "Vitals ", "Url": "vitals", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/vitalinformation.png' />" },
      { "Id": 32, "Title": "Visit Summary", "Url": "visitsummary", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/visit.png' />" },
      //{ "Id": 33, "Title": "Work history", "Url": "workhistory", "isOpen": null, "Items": [], "Icon": "<div class=\"p-workhistory\" />" }
         
    ]
  }
}
