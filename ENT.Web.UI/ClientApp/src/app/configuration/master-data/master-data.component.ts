import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Input } from "hammerjs";

@Component({
  selector: "app-MasterData",
  styleUrls: ["./master-data.component.css"],
  templateUrl: './master-data.component.html'
})

export class MasterDataComponent implements OnInit {

  //#region "Property Declaration"
  public Admissionmenu = [];
  public Appointmentmenu = [];
  public Visitmenu = [];
  public Patientmenu = [];
  public patientDemographics = [];
  public patientHealthHistory = [];
  public patientHospitalization = [];
  public patientPatientVisit = [];
  //#endregion

  constructor() { }

  ngOnInit() {

    this.Admissionmenu = [
      { Id: 1, Title: "Specialty", Url: "../Specialty", isOpen: null, Items: [], Icon: "" },
      { Id: 2, Title: "Procedure Type", Url: "../ProcedureType", isOpen: null, Items: [], Icon: "" },
      { Id: 3, Title: "Procedure Name(Short)", Url: "../ProcedureName", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Patient Arrival By", Url: "../patientArrivalBy", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Initial Admission Status", Url: "../InitialAdmissionStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Admission Type", Url: "../AdmissionType", isOpen: null, Items: [], Icon: "" }
    ];

    this.Appointmentmenu = [
      { Id: 1, Title: "Salutation", Url: "../Salutation", isOpen: null, Items: [], Icon: "" },
     // { Id: 2, Title: "Hospital", Url: "../Hospital", isOpen: null, Items: [], Icon: "" },
    //  { Id: 3, Title: "To Consult", Url: "../ToConsult", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Appointment Type", Url: "../AppointmentType", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Gender", Url: "../Gender", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Roles", Url: "../Role", isOpen: null, Items: [], Icon: "" },
      { Id: 7, Title: "Facility", Url: "../facility", isOpen: null, Items: [], Icon: "" },
      { Id: 8, Title: "Staff User Type", Url: "../staffUserType", isOpen: null, Items: [], Icon: "" },
      { Id: 9, Title: "Staff Activity Type", Url: "../staffActivityType", isOpen: null, Items: [], Icon: "" },
    ];

    this.Visitmenu = [
      { Id: 1, Title: "Patient Arrival Condition", Url: "../PatientArrivalCondition", isOpen: null, Items: [], Icon: "" },
      { Id: 2, Title: "Urgency", Url: "../Urgency", isOpen: null, Items: [], Icon: "" },
      { Id: 3, Title: "Visit type", Url: "../VisitType", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Consultation type", Url: "../Consultationtype", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Appointment", Url: "../Appointment", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Visit status", Url: "../Visitstatus", isOpen: null, Items: [], Icon: "" },
      { Id: 7, Title: "Recorded During", Url: "../Recordedduring", isOpen: null, Items: [], Icon: "" },
      { Id: 15, Title: "Billing status", Url: "../billingStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 16, Title: "Department", Url: "../department", isOpen: null, Items: [], Icon: "" },
      { Id: 17, Title: "Payment Type", Url: "../paymentType", isOpen: null, Items: [], Icon: "" }
    ];

    this.patientDemographics = [
      { Id: 1, Title: "Patient Type", Url: "../PatientType", isOpen: null, Items: [], Icon: "" },
      { Id: 2, Title: "Patient Category ", Url: "../PatientCategory", isOpen: null, Items: [], Icon: "" },
      { Id: 3, Title: "Identification Id Type ", Url: "../IdentificationIdType", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Martial Status ", Url: "../MartialStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Contact Type ", Url: "../ContactType", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Religion ", Url: "../Religion", isOpen: null, Items: [], Icon: "" },
      { Id: 7, Title: "Race ", Url: "../Race", isOpen: null, Items: [], Icon: "" },
      { Id: 8, Title: "Blood Group", Url: "../BloodGroup", isOpen: null, Items: [], Icon: "" },
      { Id: 9, Title: "Insurance Type", Url: "../Insurance", isOpen: null, Items: [], Icon: "" },
      { Id: 10, Title: "Insurance Category", Url: "../InsuranceCategory", isOpen: null, Items: [], Icon: "" },
      { Id: 11, Title: "RelationShip to Patient", Url: "../relationshipToPatient", isOpen: null, Items: [], Icon: "" },
      { Id: 12, Title: "Smoking Status", Url: "../SmokingStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 13, Title: "Drinking Status", Url: "../DrinkingStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 14, Title: "Family History Status", Url: "../FamilyHistoryStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 15, Title: "Illness Types", Url: "../IllnessType", isOpen: null, Items: [], Icon: "" },
      { Id: 16, Title: "Country", Url: "../country", isOpen: null, Items: [], Icon: "" },
      { Id: 17, Title: "State", Url: "../state", isOpen: null, Items: [], Icon: "" },
      { Id: 18, Title: "Address Type", Url: "../addressType", isOpen: null, Items: [], Icon: "" },
      { Id: 19, Title: "Language", Url: "../language", isOpen: null, Items: [], Icon: "" },
    ];

    this.patientHealthHistory = [
      { Id: 1, Title: "Location Bp", Url: "../locationBp", isOpen: null, Items: [], Icon: "" },
      { Id: 2, Title: "Patient Position", Url: "../patientPosition", isOpen: null, Items: [], Icon: "" },
      { Id: 3, Title: "Temperature Location", Url: "../temperatureLocation", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Pain Scale(Level)", Url: "../PainScale", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Allergy Type", Url: "../Allergytype", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Severity", Url: "../Severity", isOpen: null, Items: [], Icon: "" },
      { Id: 7, Title: "Problem Type", Url: "../ProblemType", isOpen: null, Items: [], Icon: "" },
      { Id: 8, Title: "Problem Status", Url: "../ProblemStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 9, Title: "Dispense Form", Url: "../DispenseForm", isOpen: null, Items: [], Icon: "" },
      { Id: 10, Title: "Dosage Form", Url: "../DosageForm", isOpen: null, Items: [], Icon: "" },
      { Id: 11, Title: "Allergy Status", Url: "../AllergyStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 12, Title: "Food Intake Category", Url: "../foodIntakeCategory", isOpen: null, Items: [], Icon: "" },
      { Id: 13, Title: "Food Intake Type", Url: "../foodIntakeType", isOpen: null, Items: [], Icon: "" },
      { Id: 14, Title: "Patient Eat Regularly", Url: "../patientEatRegularly", isOpen: null, Items: [], Icon: "" },
      { Id: 15, Title: "Medication Route", Url: "../medicationRoute", isOpen: null, Items: [], Icon: "" },
      { Id: 16, Title: "Medication Status", Url: "../medicationStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 17, Title: "Medication Units", Url: "../medicationUnits", isOpen: null, Items: [], Icon: "" },
      { Id: 18, Title: "Body Site", Url: "../bodySite", isOpen: null, Items: [], Icon: "" }
    ];

    this.patientPatientVisit = [
      { Id: 1, Title: "Problem Area", Url: "../ProblemArea", isOpen: null, Items: [], Icon: "" },
      { Id: 2, Title: "Symptoms", Url: "../Symptoms", isOpen: null, Items: [], Icon: "" },
      { Id: 3, Title: "Status", Url: "../Status", isOpen: null, Items: [], Icon: "" },
      { Id: 4, Title: "Treatment Type", Url: "../TreatmentType", isOpen: null, Items: [], Icon: "" },
      { Id: 5, Title: "Requested Procedure", Url: "../RequestedProcedure", isOpen: null, Items: [], Icon: "" },
      { Id: 6, Title: "Procedure Status", Url: "../ProcedureStatus", isOpen: null, Items: [], Icon: "" },
      { Id: 7, Title: "Progress", Url: "../Progress", isOpen: null, Items: [], Icon: "" },
      { Id: 8, Title: "Gait", Url: "../Gait", isOpen: null, Items: [], Icon: "" },
      { Id: 9, Title: "Mobility", Url: "../Mobility", isOpen: null, Items: [], Icon: "" },
      { Id: 10, Title: "Balance", Url: "../Balance", isOpen: null, Items: [], Icon: "" },
      { Id: 11, Title: "Radiology Procedure Requested ", Url: "../radiologyProcedureRequested", isOpen: null, Items: [], Icon: "" },
      { Id: 12, Title: "Radiology Type", Url: "../RadiologyType", isOpen: null, Items: [], Icon: "" },
      { Id: 13, Title: "Report Status", Url: "../reportFormat", isOpen: null, Items: [], Icon: "" },
      { Id: 14, Title: "Section", Url: "../section", isOpen: null, Items: [], Icon: "" },
      { Id: 15, Title: "Referred Lab", Url: "../referredLab", isOpen: null, Items: [], Icon: "" }
    ];
  }
}
