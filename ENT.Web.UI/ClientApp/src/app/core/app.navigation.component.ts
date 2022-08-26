import { Component, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'app-navigation',
  templateUrl: 'app.navigation.component.html'
})

export class AppNavigationComponent implements OnInit {
  @Output()
  menuClick = new EventEmitter<any>();
  menuVals = [];
  constructor() { }

  navigation(event: any) {    
    this.menuClick.emit(event);
  }

  ngOnInit() {
    this.menuVals = [
      { "Id": 0, "Title": "Dashboard", "Url": "dashboard/employee", "isOpen": null, "Items": [], "Icon": "<div class=\"dashboardicon\" />" },
      { "Id": 1, "Title": "Appointments", "Url": "appointments", "isOpen": null, "Items": [], "Icon": "<div class=\"appointmenticon\" />" },
      { "Id": 2, "Title": "Admissions", "Url": "admission", "isOpen": null, "Items": [], "Icon": "<div class=\"admissionsicon\" />" },
      { "Id": 3, "Title": "Patient", "Url": "newPatient", "isOpen": null, "Items": [], "Icon": "<div class=\"patienticon\" />" },
      { "Id": 4, "Title": "Visit", "Url": "visits", "isOpen": null, "Items": [], "Icon": "<div class=\"visiticon\" />" },
      { "Id": 5, "Title": "Triage", "Url": "triage", "isOpen": null, "Items": [], "Icon": "<div class=\"triageicon\" />" },
      { "Id": 6, "Title": "Audiology Procedures", "Url": "audiology", "isOpen": null, "Items": [], "Icon": "<div class=\"audiologyProcicon\" />" },
      { "Id": 7, "Title": "Pre-Procedure Care", "Url": "procedure", "isOpen": null, "Items": [], "Icon": "<div class=\"PreProcedureicon\" />" },
      { "Id": 8, "Title": "Post-Procedure-Care", "Url": "post-procedure-care", "isOpen": null, "Items": [], "Icon": "<div class=\"PostProcedureicon\" />" },
      { "Id": 9, "Title": "Discharge", "Url": "discharge", "isOpen": null, "Items": [], "Icon": "<div class=\"dischargeicon\" />" },
      { "Id": 10, "Title": "e-Prescription", "Url": "e-prescription", "isOpen": null, "Items": [], "Icon": "<div class=\"eprescriptionicon\" />" },
      { "Id": 11, "Title": "e-Lab", "Url": "e-lab", "isOpen": null, "Items": [], "Icon": "<div class=\"elabicon\" />" },
      { "Id": 12, "Title": "Billing & Payments", "Url": "billing", "isOpen": null, "Items": [], "Icon": "<div class=\"BillingPaymentsicon\" />" },
      { "Id": 13, "Title": "Physician", "Url": "physician", "isOpen": null, "Items": [], "Icon": "<div class=\"physicianicon\" />" },
     // { "Id": 13, "Title": "Physician", "Url": "physician/physicianlist",  "isOpen": null, "Items": [], "Icon": "<div class=\"physicianicon\" />" },

      { "Id": 14, "Title": "Staff", "Url": "staff", "isOpen": null, "Items": [], "Icon": "<div class=\"Stafficon\" />" },
      { "Id": 15, "Title": "Call Center", "Url": "callCenter", "isOpen": null, "Items": [], "Icon": "<div class=\"callcentericon\" />"},
    //{ "Id": 17, "Title": "Settings", "Url": "setting", "isOpen": null, "Items": [], "Icon": "<div class=\"settingicon\" />"},
      { "Id": 16, "Title": "Master", "Url": "configuration/mastersdata", "isOpen": null, "Items": [], "Icon": "<div class=\"settingicon\" />" },
    ]
  }
}
