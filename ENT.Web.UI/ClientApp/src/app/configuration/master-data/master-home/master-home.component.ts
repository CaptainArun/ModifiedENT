import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-home',
  templateUrl: './master-home.component.html',
  styleUrls: ['./master-home.component.css']
})

export class MasterHomeComponent implements OnInit {

  subMenuVals = [];

  ngOnInit() {

    this.subMenuVals = [
      { "Id": 1, "Title": "Specialty", "Url": "Specialty", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 2, "Title": "Procedure Type", "Url": "ProcedureType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 3, "Title": "Procedure Name(Short)", "Url": "ProcedureName", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 4, "Title": "Patient Arrival By", "Url": "patientArrivalBy", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 5, "Title": "Initial Admission Status", "Url": "InitialAdmissionStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 6, "Title": "Admission Type", "Url": "AdmissionType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },

      { "Id": 7, "Title": "Salutation", "Url": "Salutation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 8, "Title": "Hospital", "Url": "Hospital", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 9, "Title": "To Consult", "Url": "ToConsult", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 10, "Title": "Appointment Type", "Url": "AppointmentType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 11, "Title": "Gender", "Url": "Gender", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },

      { "Id": 12, "Title": "Visit type", "Url": "VisitType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 13, "Title": "Urgency", "Url": "Urgency", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 14, "Title": "Patient Arrival Condition", "Url": "PatientArrivalCondition", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 15, "Title": "Consultation type", "Url": "Consultationtype", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 16, "Title": "Appointment", "Url": "Appointment", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 17, "Title": "Visit status", "Url": "Visitstatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 18, "Title": "Recorded During", "Url": "Recordedduring", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 68, "Title": "Roles", "Url": "Role", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 69, "Title": "Facility", "Url": "facility", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 70, "Title": "Staff User Type", "Url": "staffUserType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" }, 
      { "Id": 71, "Title": "Staff Activity Type", "Url": "staffActivityType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" }, 
      //patient Demographics
      { "Id": 19, "Title": "Patient Type", "Url": "PatientType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 20, "Title": "Patient Category", "Url": "PatientCategory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 21, "Title": "Identification Id Type", "Url": "Identification Id Type", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 22, "Title": "Martial Status", "Url": "MartialStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 23, "Title": "Contact Type", "Url": "ContactType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 24, "Title": "Religion", "Url": "Religion", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 25, "Title": "Race", "Url": "Race", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 26, "Title": "BloodGroup", "Url": "BloodGroup", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 27, "Title": "Insurance Type", "Url": "Insurance", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 28, "Title": "Insurance Category", "Url": "InsuranceCategory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 29, "Title": "RelationShip to Patient", "Url": "relationshipToPatient", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 30, "Title": "Smoking Status", "Url": "SmokingStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 31, "Title": "Drinking Status", "Url": "DrinkingStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 32, "Title": "Family History Status", "Url": "FamilyHistoryStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 33, "Title": "Illness Types", "Url": "IllnessType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },

      // Patient HealthHistory
      { "Id": 34, "Title": "Location Bp", "Url": "locationBp", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 35, "Title": "Patient Position", "Url": "patientPosition", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 36, "Title": "Temperature Location", "Url": "temperatureLocation", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 37, "Title": "Pain Scale(Level)", "Url": "PainScale", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 38, "Title": "Allergy Type", "Url": "Allergytype", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 39, "Title": "Severity", "Url": "Severity", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 40, "Title": "Problem Type", "Url": "ProblemType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 41, "Title": "Problem Status", "Url": "ProblemStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 42, "Title": "Dispense Form", "Url": "DispenseForm", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 43, "Title": "Dosage Form", "Url": "DosageForm", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      
      { "Id": 44, "Title": "Allergy Status", "Url": "AllergyStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 45, "Title": "Food Intake Category", "Url": "foodIntakeCategory", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 46, "Title": "Food Intake Type", "Url": "foodIntakeType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 47, "Title": "Patient Eat Regularly", "Url": "patientEatRegularly", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 48, "Title": "Medication Route", "Url": "medicationRoute", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 49, "Title": "Medication Status", "Url": "medicationStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 50, "Title": "Medication Units", "Url": "medicationUnits", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      

      // Patient Visit
      { "Id": 51, "Title": "Problem Area", "Url": "ProblemArea", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 52, "Title": "Symptoms", "Url": "Symptoms", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 53, "Title": "Status", "Url": "Status", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 54, "Title": "Treatment Type", "Url": "TreatmentType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 55, "Title": "Requested Procedure", "Url": "RequestedProcedure", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 56, "Title": "Procedure Status", "Url": "ProcedureStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 57, "Title": "Progress", "Url": "Progress", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 58, "Title": "Gait", "Url": "Gait", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 59, "Title": "Mobility", "Url": "Mobility", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 60, "Title": "Balance", "Url": "Balance", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
     
      { "Id": 61, "Title": "Radiology Procedure Requested ", "Url": "radiologyProcedureRequested", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 62, "Title": "Radiology Type", "Url": "RadiologyType", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 63, "Title": "Report Status", "Url": "reportFormat", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 64, "Title": "Section", "Url": "section", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 65, "Title": "Referred Lab", "Url": "referredLab", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 66, "Title": "Body Site", "Url": "bodySite", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
      { "Id": 66, "Title": "Billing status", "Url": "billingStatus", "isOpen": null, "Items": [], "Icon": "<img  src = 'assets/images/patientprofile/profile.png' />" },
    ]

  }
}
