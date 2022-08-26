import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfigService } from '../app.config.service';
import { DatePipe } from "@angular/common";
import { CustomHttpService } from '../core/custom-http.service';
import { EmployeeDatabaseComponent } from '../dashboard/employeeDatabase.component';
import { DomSanitizer } from '@angular/platform-browser';
import { VisitService } from '../visit/visit.service';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit, OnChanges {

  @ViewChild(EmployeeDatabaseComponent, { static: false }) facilityDtl: EmployeeDatabaseComponent;
  @ViewChild('sidenav', { static: true }) public sidenav: MatDrawer;
  @Input() selectedFacility;
  myDate: any;
  screenWidth: number;
  title: String;
  imgPath: string = "";
  showBackNav: Boolean;
  selectedTab: String;
  userName: string;
  facilityName: any;

  openedValue: boolean = false;
  toggleData: boolean = false;
  profilePicdate: boolean;
  profilePics: any;
  tenantName: string;
  routes: any;

  public setTitleFromRoute() {
    //document.getElementsByClassName("dr_sidenav")[0].setAttribute("style", "display:block");
    document.getElementsByClassName("Toggle")[0].setAttribute("style", "display:block");
    // hide by back button By default
    const path = (this.router as any).location.path();

    if (path === '/home/patient') {
      this.title = 'Patient Registration';
      this.imgPath = "assets/images/patient_regist.png";
    }
    else if (path === '/home/newPatient') {
      this.title = 'Patient';
      this.imgPath = "assets/images/MenuWhite_icons/patientHover.png";
    }
    else if (path === '/home/triage/triagelist') {
      this.title = 'Triage List';
      this.imgPath = "assets/images/MenuWhite_icons/traigeHover.png"
    }
    // Discharge
    else if (path === '/home/discharge/dischargelist') {
      this.title = 'Discharge';
    }
    else if (path === '/home/discharge/dischargeprocedure') {
      this.title = 'Discharge Procedure';
    }
    // e-Prescription
    else if (path === '/home/e-prescription') {
      this.title = 'e-Prescription';
      this.imgPath = "assets/images/MenuWhite_icons/e-prescriptionHover.png"
    }

    else if (path === '/home/newPatient/patientHistory/:PatientId') {
      this.title = 'Patient History';
    }

    else if (path === '/home/newPatient/patientHistory/:PatientId/workhistory') {
      this.title = 'Work History';
    }

    else if (path === '/home/configuration') {
      this.title = 'Configuration';
    }
    else if (path === '/home/newPatient/PatientDemographic') {
      this.title = 'Add New Patient';
    }

    else if (path === '/home/appointments') {
      this.title = 'Appointments';
      this.imgPath = "assets/images/MenuWhite_icons/appointmentHover.png";
    }

    else if (path === '/home/post-surgical-list') {
      this.title = 'PostProcedureCare';
    }
    else if (path === '/home/e-prescription') {
      this.title = 'e-Prescription';
    }

    else if (path === '/home/discharge') {
      this.title = 'Discharge Notes';
      this.imgPath = "assets/images/MenuWhite_icons/dischargeHover.png"
    }
    else if (path === '/home/admission') {
      this.title = 'Admissions'
      this.imgPath = "assets/images/MenuWhite_icons/admissionHover.png";
    }
    else if (path === '/home/admission/admissionConvert') {
      this.title = 'Admission Request'
    }
    else if (path === '/home/visits') {
      this.title = 'Visits';
      this.imgPath = "assets/images/MenuWhite_icons/visitHover.png"
    }
    else if (path === '/home/admission/admissionextra') {
      this.title = 'AdmissionrFieldComponent';
    }
    else if (path === '/home/visits/visitIntakeList') {
      this.title = 'Visit Intake List';
    }
    else if (path === '/home/visits/visitIntake') {
      this.title = 'Visit Intake';
    }

    else if (path === '/home/opds/opd') {
      this.title = 'OPD';
    } else if (path === '/home/ot') {
      this.title = 'OT';
    }
    else if (path === '/home/hrms') {
      this.title = 'HRMS';
    }
    else if (path === '/home/helpdesk') {
      this.title = 'HelpDesk';
      this.imgPath = "assets/images/opd-hover.png";
    }
    else if (path === '/home/newPatient/newPatientlist') {
      this.title = 'New Patient List';
      this.imgPath = "assets/images/opd-hover.png";
    }
    else if (path === '/home/physician') {
      this.title = 'Physician List';
      this.imgPath = "assets/images/MenuWhite_icons/physiologyHover.png";
    }

    else if (path === '/home/physician/physicianlist') {
      this.title = 'Physician List';
      this.imgPath = "assets/images/opd-hover.png";
      this.ProfileData();
    }
    else if (path === '/home/physician/physicianschedule') {
      this.title = 'Physician Schedule';
      this.imgPath = "assets/images/opd-hover.png";
    }
    // Patient subdivisions
    else if (path === '/home/patient/profile') {
      this.title = 'Patient / Profile';
    }
    else if (path === '/home/patient/insurance') {
      this.title = 'Patient / Insurance';
    }
    else if (path === '/home/ot/pre-procedure-list') {
      this.title = 'Pre Procedure List';
    }

    else if (path === '/home/patient/workhistory') {
      this.title = 'Patient / Workhistory';
    }
    else if (path === '/home/patient/intakeform') {
      this.title = 'Patient / Intakeform';
    }
    else if (path === '/home/patient/familyinformation') {
      this.title = 'Patient / Familyinformation';
    }
    else if (path === '/home/patient/importsexports') {
      this.title = 'Patient / Importsexports';
    }
    else if (path === '/home/patient/ledger') {
      this.title = 'Patient / Ledger';
    }
    else if (path === '/home/patient/allergy') {
      this.title = 'Patient / Allergy';
    }
    else if (path === '/home/patient/appointments') {
      this.title = 'Patient / Appointments';
    }
    else if (path === '/home/patient/alternativemedicine') {
      this.title = 'Patient / Alternativemedicine';
    }
    else if (path === '/home/patient/addmission') {
      this.title = 'Patient / Addmission';
    }
    else if (path === '/home/patient/careplan') {
      this.title = 'Patient / Careplan';
    }
    else if (path === '/home/patient/patientdocuments') {
      this.title = 'Patient / Patientdocuments';
    }
    else if (path === '/home/patient/diagnosisidentified') {
      this.title = 'Patient / Diagnosisidentified';
    }
    else if (path === '/home/patient/dischargesummary') {
      this.title = 'Patient / Dischargesummary';
    }
    else if (path === '/home/patient/diagnosisassessment') {
      this.title = 'Patient / Diagnosisassessment';
    }
    else if (path === '/home/patient/electronicnotes') {
      this.title = 'Patient / Electronicnotes';
    }

    else if (path === '/home/patient/emarbar') {
      this.title = 'Patient / Emarbar';
    }
    else if (path === '/home/patient/functionalcognitive') {
      this.title = 'Patient / Functionalcognitive';
    }
    else if (path === '/home/patient/familyinformation') {
      this.title = 'Patient / Familyinformation';
    }
    else if (path === '/home/patient/familyhealthhstory') {
      this.title = 'Patient / Familyhealthhstory';
    }
    else if (path === '/home/patient/goals') {
      this.title = 'Patient / Goals';
    }
    else if (path === '/home/patient/hospitalizationhistory') {
      this.title = 'Patient / Hospitalizationhistory';
    }
    else if (path === '/home/patient/immunization') {
      this.title = 'Patient / Immunization';
    }
    else if (path === '/home/patient/laborder') {
      this.title = 'Patient / Laborder';
    }
    else if (path === '/home/patient/medication') {
      this.title = 'Patient / Medication';
    }
    else if (path === '/home/patient/nutritiondetails') {
      this.title = 'Patient / Nutritiondetails';
    }
    else if (path === '/home/patient/nursingnote') {
      this.title = 'Patient / Nursingnote';
    }
    else if (path === '/home/patient/pathology') {
      this.title = 'Patient / Pathology';
    }
    else if (path === '/home/patient/problemlist') {
      this.title = 'Patient / Problemlist';
    }
    else if (path === '/home/patient/procedures') {
      this.title = 'Patient / Procedures';
    }
    else if (path === '/home/patient/progressnotes') {
      this.title = 'Patient / Progressnotes';
    }
    else if (path === '/home/patient/physiotherapy') {
      this.title = 'Patient / Physiotherapy';
    }
    else if (path === '/home/patient/rehabilitation') {
      this.title = 'Patient / Rehabilitation';
    }
    else if (path === '/home/patient/physiciannotes') {
      this.title = 'Patient / Physiciannotes';
    }
    else if (path === '/home/patient/patienteducation') {
      this.title = 'Patient / Patienteducation';
    }
    else if (path === '/home/patient/patientvisit') {
      this.title = 'Patient / Patientvisit';
    }
    else if (path === '/home/patient/patientcareplan') {
      this.title = 'Patient / Patientcareplan';
    }
    else if (path === '/home/patient/physicaleexamination') {
      this.title = 'Patient / Physicaleexamination';
    }
    else if (path === '/home/patient/radiology') {
      this.title = 'Patient / Radiology';
    }
    else if (path === '/home/patient/referral') {
      this.title = 'Patient / Referral';
    }
    else if (path === '/home/patient/socialhistory') {
      this.title = 'Patient / Socialhistory';
    }
    else if (path === '/home/patient/scheduledtests') {
      this.title = 'Patient / Scheduledtests';
    }
    else if (path === '/home/patient/soapnotes') {
      this.title = 'Patient / Soapnotes';
    }
    else if (path === '/home/patient/symptomsreaction') {
      this.title = 'Patient / Symptomsreaction';
    }
    else if (path === '/home/patient/surgicalhistory') {
      this.title = 'Patient / Surgicalhistory';
    }
    else if (path === '/home/patient/scheduledappointments') {
      this.title = 'Patient / Scheduledappointments';
    }
    else if (path === '/home/patient/specialty') {
      this.title = 'Patient / Specialty';
    }
    else if (path === '/home/patient/transitioncaregeneratedlist') {
      this.title = 'Patient / Transitioncaregeneratedlist';
    }
    else if (path === '/home/patient/vitals') {
      this.title = 'Patient / Vitals';
    }
    else if (path === '/home/patient/visitsummary') {
      this.title = 'Patient / Visitsummary';
    }
    else if (path === '/home/patient/workhistory') {
      this.title = 'Patient / Workhistory';
    }
    else if (path === '/home/patient/patientchart') {
      this.title = 'Patient / Patientchart';
    }
    else if (path === '/home/patient/patientprogrames') {
      this.title = 'Patient / Patientprogrames';
    }

    // Appointment Subdivision
    else if (path === '/home/appointments/appointments') {
      this.title = 'Appointments / Appointments';
    }
    else if (path === '/home/appointments/appointmentcalendar') {
      this.title = 'Appointments / Appointment Calendar';
    }

    else if (path.includes('appointmentslist')) {
      this.title = 'Appointments / Appointments List';
    }

    // HelpDesk Subdivision
    else if (path === '/home/helpdesk/helpdesk') {
      this.title = 'Helpdesk / Helpdesk';
    }
    else if (path === '/home/helpdesk/list') {
      this.title = 'Helpdesk / List';
    }
    else if (path === '/home/helpdesk/search') {
      this.title = 'Helpdesk / Search';
    }
    else if (path === '/home/helpdesk/todays-appointments') {
      this.title = 'Helpdesk / Today\'s Appointments';
    }

    // OPDS Subdivision
    else if (path === '/home/opds/visitintake') {
      this.title = 'OPD / Visit Intake';
    }
    else if (path === '/home/triage') {
      this.title = 'Triage';
      this.imgPath = "assets/images/MenuWhite_icons/traigeHover.png";
    }
    else if (path === '/home/opds/opdconsult') {
      this.title = 'OPD / Consult';
    }

    else if (path === '/home/opds/patientlist') {
      this.title = 'OPD / Patient List';
    }
    else if (path === '/home/opds/postprocedurenotes') {
      this.title = 'OPD / Post Procedurenotes';
    }
    else if (path === '/home/opds/dischargenotes') {
      this.title = 'OPD / Dischargenotes';
    } else if (path === '/home/opds/OT') {
      this.title = 'OPD / OT';
    }
    else if (path === '/home/opds/audiology') {
      this.title = 'OPD / Audiology';
    }
    else if (path === '/home/opds/speechtherapy') {
      this.title = 'OPD / Speech Therapy';
    }
    else if (path === '/home/opds/tympanogram') {
      this.title = 'OPD / Tympanogram';
    }
    else if (path === '/home/opds/oaetest') {
      this.title = 'OPD / OAE Test';
    }
    else if (path === '/home/opds/beratest') {
      this.title = 'OPD / BERA Test';
    }
    else if (path === '/home/opds/assrtest') {
      this.title = 'OPD / ASSR Test';
    }
    else if (path === '/home/opds/hearingaidtrial') {
      this.title = 'OPD / Hearing Aid Trial';
    }
    else if (path === '/home/opds/tinnitusmasking') {
      this.title = 'OPD / Tinnitus Masking';
    }
    else if (path === '/home/opds/specialtests') {
      this.title = 'OPD / Special Tests';
    }
    else if (path === '/home/opds/electrocochleography') {
      this.title = 'OPD / Electrocochleography';
    }
    else if (path === '/home/opds/tuningforktest') {
      this.title = 'OPD / Tuning Fork Test';
    }
    else if (path === '/home/opds/physicianconsult') {
      this.title = 'OPD / Physician Case-Assessment Sheet';
    }
    else if (path === '/home/opds/visit') {
      this.title = 'OPD / Visit';
    }
    else if (path === '/home/opds/allergy') {
      this.title = 'OPD / Allergy';
    }
    else if (path === '/home/opds/addmission') {
      this.title = 'OPD / Admission';
    }
    else if (path === '/home/admission/testResult') {
      this.title = 'OPD / Lab Test';
    }
    //Audiology Procedure
    else if (path === '/home/audiology') {
      this.title = 'Audiology Procedures';
      this.imgPath = "assets/images/MenuWhite_icons/audiologyprocedureHover.png";
    }
    // else if (path === '/home/audiology/consultlist') {
    //   this.title = 'Specialty Consultation & Tests';
    // }
    else if (path === '/home/audiology/specialtest') {
      this.title = 'Audiology / Speech Therapy with Special Test';
    }
    else if (path === '/home/audiology/tympanometry') {
      this.title = 'Audiology / Tympanometry';
    }
    else if (path === '/home/audiology/oaetest') {
      this.title = 'Audiology / OAE Test';
    }
    else if (path === '/home/audiology/beratest') {
      this.title = 'Audiology / BERA Test';
    }
    else if (path === '/home/audiology/assrtest') {
      this.title = 'Audiology / ASSR Test';
    }
    else if (path === '/home/audiology/hearingaidtrial') {
      this.title = 'Audiology / Hearing Aid Trial';
    }
    else if (path === '/home/audiology/tinnitusmasking') {
      this.title = 'Audiology / Tinnitus Masking';
    }
    else if (path === '/home/audiology/speechtherapy') {
      this.title = 'Audiology / Speech Therapy';
    }
    else if (path === '/home/audiology/electrocochleography') {
      this.title = 'Audiology / Electrocochleography';
    }
    else if (path === '/home/audiology/tuningforktest') {
      this.title = 'Audiology / Tuning Fork Test';
    }

    else if (path === '/home/consult/consultlist') {
      this.title = 'Consult / Consult List';
    }
    else if (path === '/home/consult/physicianconsult') {
      this.title = 'Consult / Case Sheet';
    }
    else if (path === '/home/opds/patientdocuments') {
      this.title = 'OPD / Patient Documents';
    }
    else if (path === '/home/opds/diagnosisidentified') {
      this.title = 'OPD / Diagnosis Identified';
    }
    else if (path === '/home/opds/dischargesummary') {
      this.title = 'OPD / Discharge Summary';
    }
    else if (path === '/home/opds/diagnosisassessment') {
      this.title = 'OPD / Diagnosis Assessment';
    }
    else if (path === '/home/opds/functionalcognitive') {
      this.title = 'OPD / Functional Cognitive';
    }
    else if (path === '/home/opds/familyhealthhstory') {
      this.title = 'OPD / Family Health Hstory';
    }
    else if (path === '/home/opds/hospitalizationhistory') {
      this.title = 'OPD / Hospitalization History';
    }
    else if (path === '/home/opds/immunization') {
      this.title = 'OPD / Immunization';
    }
    else if (path === '/home/opds/medication') {
      this.title = 'OPD / Medication';
    }
    else if (path === '/home/opds/problemlist') {
      this.title = 'OPD / Problem List';
    }
    else if (path === '/home/opds/procedures') {
      this.title = 'OPD / Procedures';
    }
    else if (path === '/home/procedure') {
      this.title = 'Pre procedure';
      this.imgPath = "assets/images/MenuWhite_icons/pre_procedurecareHover.png"
    }
    else if (path === '/home/opds/physiotherapy') {
      this.title = 'OPD / Physiotherapy';
    }
    else if (path === '/home/opds/patientvisit') {
      this.title = 'OPD / Patient Visit';
    }
    else if (path === '/home/opds/physicaleexamination') {
      this.title = 'OPD / Physicale Examination';
    }
    else if (path === '/home/opds/radiology') {
      this.title = 'OPD / Radiology';
    }
    else if (path === '/home/opds/referral') {
      this.title = 'OPD / Referral';
    }
    else if (path === '/home/opds/socialhistory') {
      this.title = 'OPD / Social History';
    }
    else if (path === '/home/opds/scheduledtests') {
      this.title = 'OPD / Scheduled Tests';
    }
    else if (path === '/home/opds/soapnotes') {
      this.title = 'OPD / Soap Notes';
    }
    else if (path === '/home/opds/surgicalhistory') {
      this.title = 'OPD / Surgical History';
    }
    else if (path === '/home/opds/vitals') {
      this.title = 'OPD / Vitals';
    }
    else if (path === '/home/opds/visitsummary') {
      this.title = 'OPD / Visit Summary';
    }
    //Staff
    else if (path === '/home/staff') {
      this.title = 'Staff';
      this.imgPath = "assets/images/MenuWhite_icons/staffHover.png"
      this.ProfileData();
    }
    else if (path === '/home/staff/staffprofile') {
      this.title = 'Staff / profile';
    }

    // OT Subdivision
    else if (path === '/home/ot/ot') {
      this.title = 'OT / OT Request List';
    }
    else if (path === '/home/ot/postprocedurenotes') {
      this.title = 'OT / Post Procedure Notes';
    }
    else if (path === '/home/ot/dischargenotes') {
      this.title = 'OT / Discharge Notes';
    }
    else if (path === '/home/ot/addmission') {
      this.title = 'OT / Admission';
    }
    else if (path === '/home/procedure/procedure-list') {
      this.title = 'Pre Procedure List';
    }
    else if (path === '/home/ot/calender') {
      this.title = 'OT / OT Schedule & Calendar';
    }
    else if (path === '/home/ot/schedule') {
      this.title = 'OT / OT Schedule List';
    }
    else if (path === '/home/ot/dischargenotes') {
      this.title = 'OT / Discharge Notes';
    }
    else if (path === '/home/ot/observationnotes') {
      this.title = 'OT / Observation Notes';
    }

    else if (path === '/home/ot/pre-surgical-list') {
      this.title = 'Pre Surgical Care';
    }
    else if (path === '/home/post-procedure-care') {
      this.title = 'Post Procedure';
      this.imgPath = "assets/images/MenuWhite_icons/post_procedurecareHover.png"
    }
    else if (path === '/home/ot/anesthesia') {
      this.title = 'Anesthesia';
    }

    else if (path === '/home/callCenter') {
      this.title = 'Call Center';
      this.imgPath = "assets/images/MenuWhite_icons/CallCenterHover.png"
    }

    else if (path === '/home/callCenter/callCenterAppointment') {
      this.title = 'Call Center / Call Center Appointment';
    }
    else if (path === '/home/callCenter/otList') {
      this.title = 'Call Center / OT List';
    }
    else if (path === '/home/callCenter/labList ') {
      this.title = 'Call Center / Lab List';
    }

    else if (path === '/home/e-lab/LabSetup') {
      this.title = 'e-Lab Setup';
    }
    else if (path === '/home/e-lab/LabMaster') {
      this.title = 'e-Lab Master';
    }

    else if (path === '/home/dashboard/doctor') {
      this.title = 'Dashboard';
    }
    else if (path === '/home/dashboard/employee') {
      this.title = 'Dashboard';
      this.imgPath = "assets/images/MenuWhite_icons/dashboardHover.png";
      if (!localStorage.getItem("profilePics")) {
        this.getprofiledata();
      }
    }
    else if (path === '/home/dashboard/database') {

      //document.getElementsByClassName("dr_sidenav")[0].setAttribute("style", "display:none");
      document.getElementsByClassName("Toggle")[0].setAttribute("style", "display:none");
      this.title = 'Facility';
      this.imgPath = ""
    }
    else if (path === '/home/dashboard') {
      this.title = 'Dashboard';
    }
    else if (path === '/home/setting') {
      this.title = 'Provider Daily Calendar Setup';
    }
    else if (path === '/home/e-lab') {
      this.title = 'e-Lab Order';
      this.imgPath = "assets/images/MenuWhite_icons/E-labHover.png"
    }

    else if (path === '/home/billing/billing') {
      this.title = 'Billing & Payments';
      this.imgPath = "assets/images/MenuWhite_icons/paymentHover.png"

    }

    else if (path === '/home/configuration/mastersdata') {
      this.title = 'Master';
      this.imgPath = "assets/images/MenuWhite_icons/settingsHover.png"
    }

    if (path === '/home/dashboard/database') {
      this.toggleData = true;
    }
    else {
      this.toggleData = false;
    }

  }

  ngOnInit() {
    this.getUserProfileData();
  }

  ngOnChanges() {

  }

  constructor(public AppConfig: AppConfigService, private router: Router, private datePipe: DatePipe, private customHttp: CustomHttpService, private visitSvc: VisitService, private sanitizer: DomSanitizer) {

    this.userName = localStorage.getItem('LoggedinUser');

    this.facilityName = localStorage.getItem('DBdetails');

    let tenantName = JSON.parse(localStorage.getItem('DBdetails'));

    this.tenantName = tenantName.TenantName;


    // track login active status on route changed
    this.routes = router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setTitleFromRoute();
      }
    });
    setInterval(() => {
      this.myDate = new Date()
    }, 1000)

    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  toggle() {
    if (this.screenWidth < 840) {
      this.sidenav.toggle();
    }
    else {
      if (this.openedValue) {
        this.openedValue = false;
      }
      else {
        this.openedValue = true;
      }

      //Passing a data for the bmsmenu-item.component through subject...
      this.toggleData ? this.AppConfig.sideNavState.unsubscribe() : this.AppConfig.sideNavState.next(this.openedValue);
    }

  }



  ProfileData() {
    if (localStorage.getItem("profilePics")) {
      this.getprofiledata();
    }
    else {
      this.getprofiledata();
    }
  }

  getprofiledata() {
    this.visitSvc.getUserProfileData().then(data => {
      if (data.length > 0) {
        localStorage.setItem("profilePics", data[0]);
        this.getUserProfileData();
      }
    });
  }

  getUserProfileData() {
    if (localStorage.getItem("profilePics")) {
      let profilePic = localStorage.getItem("profilePics");
      this.profilePicdate = true;
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + profilePic);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
    }
  }

  logoutPage() {
    this.routes.unsubscribe();
    this.customHttp.getDbName('Global_Master');
    this.router.navigate(['/login/']);
    localStorage.clear();
  }
} 
