using ENT.WebApi.Entities;
using ENT.WebApi.Entities.Logging;
using ENT.WebApi.Mapping;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.Data.Context
{
    public class AppDbContext : DbContext
    {
        public static string ConnectionString { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder dbbuilder)
        {
            if (!string.IsNullOrEmpty(ConnectionString))
            {
                dbbuilder.UseSqlServer(ConnectionString);
            }              
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.ApplyConfiguration(new ActionMap());
            modelBuilder.ApplyConfiguration(new ModulesMap());
            modelBuilder.ApplyConfiguration(new RolesMap());
            modelBuilder.ApplyConfiguration(new RoleScreenPermissionMappingMap());
            modelBuilder.ApplyConfiguration(new ScreenMap());
            modelBuilder.ApplyConfiguration(new userroleMap());
            modelBuilder.ApplyConfiguration(new PatientMap());
            modelBuilder.ApplyConfiguration(new FacilityMap());

            modelBuilder.ApplyConfiguration(new EmployeeMap());
            modelBuilder.ApplyConfiguration(new EmployeeAddressInfoMap());
            modelBuilder.ApplyConfiguration(new EmployeeCampusMap());
            modelBuilder.ApplyConfiguration(new EmployeeEducationInfoMap());
            modelBuilder.ApplyConfiguration(new EmployeeFamilyInfoMap());
            modelBuilder.ApplyConfiguration(new EmployeeHobbyInfoMap());
            modelBuilder.ApplyConfiguration(new EmployeeLanguageInfoMap());
            modelBuilder.ApplyConfiguration(new EmployeeWorkHistoryMap());

            modelBuilder.ApplyConfiguration(new ProviderMap());
            modelBuilder.ApplyConfiguration(new ProviderAddressMap());
            modelBuilder.ApplyConfiguration(new ProviderContactMap());
            modelBuilder.ApplyConfiguration(new ProviderEducationMap());
            modelBuilder.ApplyConfiguration(new ProviderFamilyDetailsMap());
            modelBuilder.ApplyConfiguration(new ProviderLanguagesMap());
            modelBuilder.ApplyConfiguration(new ProviderExtraActivitiesMap());
            modelBuilder.ApplyConfiguration(new ProviderSpecialityMap());
            modelBuilder.ApplyConfiguration(new ProviderScheduleMap());
            modelBuilder.ApplyConfiguration(new ProviderVacationMap());
            modelBuilder.ApplyConfiguration(new ProviderDiagnosisCodeMap());
            modelBuilder.ApplyConfiguration(new ProviderTreatmentCodeMap());

            modelBuilder.ApplyConfiguration(new PatientDemographicMap());
            modelBuilder.ApplyConfiguration(new PatientAppointmentMap());
            modelBuilder.ApplyConfiguration(new CallCenterMap());
            modelBuilder.ApplyConfiguration(new RecurrenceAppointmentMap());

            modelBuilder.ApplyConfiguration(new PatientVisitMap());
            modelBuilder.ApplyConfiguration(new VisitPaymentDetailsMap());
            modelBuilder.ApplyConfiguration(new VisitPaymentMap());
            modelBuilder.ApplyConfiguration(new VisitSignOffMap());

            modelBuilder.ApplyConfiguration(new FamilyHealthHistoryMap());
            modelBuilder.ApplyConfiguration(new PatientWorkHistoryMap());
            modelBuilder.ApplyConfiguration(new HospitalizationHistoryMap());
            modelBuilder.ApplyConfiguration(new PhysicalExamMap());
            modelBuilder.ApplyConfiguration(new DocumentManagementMap());
            modelBuilder.ApplyConfiguration(new PatientInsuranceMap());
            modelBuilder.ApplyConfiguration(new PatientImmunizationMap());
            modelBuilder.ApplyConfiguration(new RadiologyOrderMap());
            
            modelBuilder.ApplyConfiguration(new PatientVitalsMap());
            modelBuilder.ApplyConfiguration(new PatientAllergyMap());
            modelBuilder.ApplyConfiguration(new PatientProblemListMap());
            modelBuilder.ApplyConfiguration(new PatientMedicationHistoryMap());
            modelBuilder.ApplyConfiguration(new PatientSocialHistoryMap());
            modelBuilder.ApplyConfiguration(new ROSMap());
            modelBuilder.ApplyConfiguration(new NutritionAssessmentMap());
            modelBuilder.ApplyConfiguration(new NursingSignOffMap());
            modelBuilder.ApplyConfiguration(new CognitiveMap());
            modelBuilder.ApplyConfiguration(new DiagnosisMap());
            modelBuilder.ApplyConfiguration(new CaseSheetProcedureMap());
            modelBuilder.ApplyConfiguration(new CarePlanMap());
            modelBuilder.ApplyConfiguration(new OPDNursingordersMap());
            modelBuilder.ApplyConfiguration(new AudiologyRequestMap());
            modelBuilder.ApplyConfiguration(new ProcedureRequestMap());

            modelBuilder.ApplyConfiguration(new TuningForkTestMap());
            modelBuilder.ApplyConfiguration(new SpeechtherapySpecialtestsMap());
            modelBuilder.ApplyConfiguration(new TympanometryMap());
            modelBuilder.ApplyConfiguration(new OAETestMap());
            modelBuilder.ApplyConfiguration(new SpeechTherapyMap());
            modelBuilder.ApplyConfiguration(new ASSRTestMap());
            modelBuilder.ApplyConfiguration(new BERATestMap());
            modelBuilder.ApplyConfiguration(new HearingAidTrialMap());
            modelBuilder.ApplyConfiguration(new TinnitusmaskingMap());
            modelBuilder.ApplyConfiguration(new ElectrocochleographyMap());

            modelBuilder.ApplyConfiguration(new AdmissionsMap());
            modelBuilder.ApplyConfiguration(new AdmissionPaymentMap());
            modelBuilder.ApplyConfiguration(new AdmissionPaymentDetailsMap());

            modelBuilder.ApplyConfiguration(new BillingMasterMap());
            modelBuilder.ApplyConfiguration(new BillingSubMasterMap());
            modelBuilder.ApplyConfiguration(new BillingSetupMasterMap());

            modelBuilder.ApplyConfiguration(new DrugChartMap());
            modelBuilder.ApplyConfiguration(new PreProcedureMap());
            modelBuilder.ApplyConfiguration(new AnesthesiafitnessMap());
            modelBuilder.ApplyConfiguration(new PostProcedureCaseSheetMap());

            modelBuilder.ApplyConfiguration(new DischargeSummaryMap());

            modelBuilder.ApplyConfiguration(new MedicationRequestsMap());
            modelBuilder.ApplyConfiguration(new MedicationRequestItemsMap());

            modelBuilder.ApplyConfiguration(new eLabRequestMap());
            modelBuilder.ApplyConfiguration(new eLabRequestItemsMap());

            modelBuilder.ApplyConfiguration(new eLabOrderMap());
            modelBuilder.ApplyConfiguration(new eLabOrderItemsMap());
            modelBuilder.ApplyConfiguration(new eLabOrderStatusMap());

            modelBuilder.ApplyConfiguration(new MedicationsMap());
            modelBuilder.ApplyConfiguration(new MedicationItemsMap());

            modelBuilder.ApplyConfiguration(new eLabMasterMap());
            modelBuilder.ApplyConfiguration(new eLabSubMasterMap());
            modelBuilder.ApplyConfiguration(new eLabSetupMasterMap());

            //modelBuilder.ApplyConfiguration(new DBAuditMap());
            modelBuilder.Entity<DBAudit>().ToTable("DBAudit");

            modelBuilder.Entity<Departments>().ToTable("Departments", "Master");

            modelBuilder.Entity<EmpExtracurricularActivitiesType>().ToTable("EmpExtracurricularActivitiesType", "Master");
            modelBuilder.Entity<UserType>().ToTable("UserType", "Master");

            modelBuilder.Entity<Gender>().ToTable("Gender", "Master");
            modelBuilder.Entity<AddressType>().ToTable("AddressType", "Master");
            modelBuilder.Entity<Country>().ToTable("Country", "Master");
            modelBuilder.Entity<Language>().ToTable("Language", "Master");
            modelBuilder.Entity<State>().ToTable("State", "Master");
            modelBuilder.Entity<PaymentType>().ToTable("PaymentType", "Master");
            modelBuilder.Entity<Relationshiptopatient>().ToTable("Relationshiptopatient", "Master");
            modelBuilder.Entity<IdentificationIdType>().ToTable("IdentificationIdType", "Master");
            modelBuilder.Entity<PatientType>().ToTable("PatientType", "Master");
            modelBuilder.Entity<PatientCategory>().ToTable("PatientCategory", "Master");
            modelBuilder.Entity<Salutation>().ToTable("Salutation", "Master");
            modelBuilder.Entity<MaritalStatus>().ToTable("MaritalStatus", "Master");
            modelBuilder.Entity<ContactType>().ToTable("ContactType", "Master");
            modelBuilder.Entity<BloodGroup>().ToTable("BloodGroup", "Master");
            modelBuilder.Entity<Religion>().ToTable("Religion", "Master");
            modelBuilder.Entity<Race>().ToTable("Race", "Master");
            modelBuilder.Entity<FamilyHistoryStatusMaster>().ToTable("FamilyHistoryStatusMaster", "Master");

            modelBuilder.Entity<PatientArrivalCondition>().ToTable("PatientArrivalCondition", "Master");
            modelBuilder.Entity<UrgencyType>().ToTable("UrgencyType", "Master");
            modelBuilder.Entity<VisitStatus>().ToTable("VisitStatus", "Master");
            modelBuilder.Entity<RecordedDuring>().ToTable("RecordedDuring", "Master");
            modelBuilder.Entity<VisitType>().ToTable("VisitType", "Master");
            modelBuilder.Entity<ConsultationType>().ToTable("ConsultationType", "Master");
            modelBuilder.Entity<AppointmentBooked>().ToTable("AppointmentBooked", "Master");

            modelBuilder.Entity<BPLocation>().ToTable("BPLocation", "Master");
            modelBuilder.Entity<ProblemType>().ToTable("ProblemType", "Master");
            modelBuilder.Entity<ProblemArea>().ToTable("ProblemArea", "Master");
            modelBuilder.Entity<Symptoms>().ToTable("Symptoms", "Master");
            modelBuilder.Entity<RequestedProcedure>().ToTable("RequestedProcedure", "Master");
            modelBuilder.Entity<AllergyType>().ToTable("AllergyType", "Master");
            modelBuilder.Entity<AllergySeverity>().ToTable("AllergySeverity", "Master");
            modelBuilder.Entity<AllergyStatusMaster>().ToTable("AllergyStatusMaster", "Master");
            modelBuilder.Entity<PatientPosition>().ToTable("PatientPosition", "Master");
            modelBuilder.Entity<TemperatureLocation>().ToTable("TemperatureLocation", "Master");
            modelBuilder.Entity<PainScale>().ToTable("PainScale", "Master");
            modelBuilder.Entity<ProblemStatus>().ToTable("ProblemStatus", "Master");
            modelBuilder.Entity<FCBalance>().ToTable("FCBalance", "Master");
            modelBuilder.Entity<FCMobility>().ToTable("FCMobility", "Master");
            modelBuilder.Entity<ProcedureType>().ToTable("ProcedureType", "Master");
            modelBuilder.Entity<FoodIntakeType>().ToTable("FoodIntakeType", "Master");
            modelBuilder.Entity<FoodIntakeMaster>().ToTable("FoodIntakeMaster", "Master");
            modelBuilder.Entity<ProcedureStatus>().ToTable("ProcedureStatus", "Master");
            modelBuilder.Entity<Procedures>().ToTable("Procedures", "Master");
            modelBuilder.Entity<GaitMaster>().ToTable("GaitMaster", "Master");
            modelBuilder.Entity<TreatmentTypeMaster>().ToTable("TreatmentTypeMaster", "Master");
            modelBuilder.Entity<DrinkingMaster>().ToTable("DrinkingMaster", "Master");
            modelBuilder.Entity<SmokingMaster>().ToTable("SmokingMaster", "Master");
            modelBuilder.Entity<PatientEatMaster>().ToTable("PatientEatMaster", "Master");
            modelBuilder.Entity<CarePlanStatusMaster>().ToTable("CarePlanStatusMaster", "Master");
            modelBuilder.Entity<CarePlanProgressMaster>().ToTable("CarePlanProgressMaster", "Master");
            modelBuilder.Entity<MedicationStatus>().ToTable("MedicationStatus", "Master");
            modelBuilder.Entity<MedicationUnits>().ToTable("MedicationUnits", "Master");
            modelBuilder.Entity<MedicationRoute>().ToTable("MedicationRoute", "Master");
            modelBuilder.Entity<PrescriptionOrderType>().ToTable("PrescriptionOrderType", "Master");
            modelBuilder.Entity<DosageForm>().ToTable("DosageForm", "Master");
            modelBuilder.Entity<DispenseForm>().ToTable("DispenseForm", "Master");

            modelBuilder.Entity<AdmissionType>().ToTable("AdmissionType", "Master");
            modelBuilder.Entity<AdmissionStatus>().ToTable("AdmissionStatus", "Master");
            modelBuilder.Entity<PatientArrivalBy>().ToTable("PatientArrivalBy", "Master");

            modelBuilder.Entity<AppointmentType>().ToTable("AppointmentType", "Master");
            modelBuilder.Entity<AppointmentStatus>().ToTable("AppointmentStatus", "Master");

            modelBuilder.Entity<IllnessType>().ToTable("IllnessType", "Master");
            modelBuilder.Entity<InsuranceCategory>().ToTable("InsuranceCategory", "Master");
            modelBuilder.Entity<InsuranceType>().ToTable("InsuranceType", "Master");
            modelBuilder.Entity<RadiologyProcedureRequested>().ToTable("RadiologyProcedureRequested", "Master");
            modelBuilder.Entity<RadiologyType>().ToTable("RadiologyType", "Master");
            modelBuilder.Entity<ReferredLab>().ToTable("ReferredLab", "Master");
            modelBuilder.Entity<ReportFormat>().ToTable("ReportFormat", "Master");
            modelBuilder.Entity<BodySection>().ToTable("BodySection", "Master");
            modelBuilder.Entity<BodySite>().ToTable("BodySite", "Master");
            modelBuilder.Entity<DocumentType>().ToTable("DocumentType", "Master");

            modelBuilder.Entity<CommonMaster>().ToTable("CommonMaster", "Master");
            modelBuilder.Entity<TenantSpeciality>().ToTable("TenantSpeciality", "Master");
            modelBuilder.Entity<Notestablelabelmapping>().ToTable("Notestablelabelmapping", "Master");
            modelBuilder.Entity<RoomMaster>().ToTable("RoomMaster", "Master");

            modelBuilder.Entity<eLabMasterStatus>().ToTable("eLabMasterStatus", "Master");
            modelBuilder.Entity<BillingMasterStatus>().ToTable("BillingMasterStatus", "Master");
        }
    }
}
