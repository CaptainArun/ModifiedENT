using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface ITenantMasterService
    {

        #region Gender
        List<Gender> GetAllGender();
        Gender GetGenderbyID(int genderID);
        Gender DeleteGenderRecord(int genderID);
        Gender AddUpdateGender(Gender gender);

        #endregion

        #region Address Type

        List<AddressType> GetAllAddressTypes();
        AddressType GetAddressTypebyID(int addressTypeID);
        AddressType DeleteAddressTypeRecord(int addressTypeID);
        AddressType AddUpdateAddressType(AddressType addressType);

        #endregion

        #region Country

        List<Country> GetAllCountries();
        Country GetCountrybyID(int countryID);
        Country DeleteCountryRecord(int countryID);
        Country AddUpdateCountry(Country country);

        #endregion

        #region Language

        List<Language> GetAllLanguages();
        Language GetLanguagebyID(int languageID);
        Language DeleteLanguageRecord(int languageID);
        Language AddUpdateLanguage(Language language);

        #endregion

        #region State

        List<State> GetAllStates();
        State GetStatebyID(int stateID);
        State DeleteStateRecord(int stateID);
        State AddUpdateState(State state);

        #endregion

        #region Payment Type

        List<PaymentType> GetAllPaymentTypes();
        PaymentType GetPaymentTypebyID(int paymentTypeID);
        PaymentType DeletePaymentTypeRecord(int paymentTypeID);
        PaymentType AddUpdatePaymentType(PaymentType paymentType);

        #endregion

        #region Salutation

        List<Salutation> GetAllSalutations();
        Salutation GetSalutationbyID(int salutationID);
        Salutation DeleteSalutationRecord(int salutationID);
        Salutation AddUpdateSalutation(Salutation salutation);

        #endregion

        #region Notes table label mapping

        List<Notestablelabelmapping> GetAllNotestablelabelmapping();
        Notestablelabelmapping GetNotestablelabelmappingbyID(int notesTablelabelmappingID);
        Notestablelabelmapping DeleteNotestablelabelmappingRecord(int notesTablelabelmappingID);
        Notestablelabelmapping AddUpdateNotestablelabelmapping(Notestablelabelmapping notesTablelabelmapping);

        #endregion

        #region Room Master

        List<RoomMaster> GetAllRoomMaster();
        RoomMaster GetRoomMasterbyID(int roomTypeID);
        RoomMaster DeleteRoomMasterRecord(int roomTypeID);
        RoomMaster AddUpdateRoomMaster(RoomMaster roomMaster);

        #endregion

        #region Tenant Speciality

        List<TenantSpeciality> GetTenantSpecialityList();
        TenantSpeciality GetTenantSpecialityRecordbyID(int tenantSpecialityId);
        TenantSpeciality DeleteTenantSpecialityRecord(int tenantSpecialityID);
        TenantSpeciality AddUpdateTenantSpeciality(TenantSpeciality tenantSpeciality);

        #endregion

        #region Patient Arrival Condition

        List<PatientArrivalCondition> GetPatientArrivalConditions();
        PatientArrivalCondition GetPatientArrivalConditionbyId(int arrivalConditionID);
        PatientArrivalCondition DeletePatientArrivalConditionRecord(int arrivalConditionID);
        PatientArrivalCondition AddUpdateArrivalCondition(PatientArrivalCondition arrivalCondition);

        #endregion

        #region Recorded During 

        List<RecordedDuring> GetRecordedDuringList();
        RecordedDuring GetRecordedDuringbyId(int recordedDuringID);
        RecordedDuring DeleteRecordedDuringRecord(int recordedDuringID);
        RecordedDuring AddUpdateRecordedDuring(RecordedDuring recordedDuring);

        #endregion

        #region Urgency Type

        List<UrgencyType> GetUrgencyTypeList();
        UrgencyType GetUrgencyTypebyId(int urgencyTypeID);
        UrgencyType DeleteUrgencyTypeRecord(int urgencyTypeID);
        UrgencyType AddUpdateUrgencyType(UrgencyType urgencyType);

        #endregion

        #region Visit Type

        List<VisitType> GetVisitTypeList();
        VisitType GetVisitTypeRecordbyID(int visitTypeId);
        VisitType DeleteVisitTypeRecord(int visitTypeID);
        VisitType AddUpdateVisitType(VisitType visitType);

        #endregion

        #region Visit Status

        List<VisitStatus> GetVisitStatusList();
        VisitStatus GetVisitStatusRecordbyID(int visitStatusId);
        VisitStatus DeleteVisitStatusRecord(int visitStatusID);
        VisitStatus AddUpdateVisitStatus(VisitStatus visitStatus);

        #endregion

        #region Consultation Type

        List<ConsultationType> GetConsultationTypeList();
        ConsultationType GetConsultationTypebyId(int consultationTypeID);
        ConsultationType DeleteConsultationTypeRecord(int consultationTypeID);
        ConsultationType AddUpdateConsultationType(ConsultationType consultationType);

        #endregion

        #region Appointment Booked

        List<AppointmentBooked> GetAppointmentBookedList();
        AppointmentBooked GetAppointmentBookedbyId(int appointmentBookedID);
        AppointmentBooked DeleteAppointmentBookedRecord(int appointmentBookedID);
        AppointmentBooked AddUpdateAppointmentBooked(AppointmentBooked appointmentBooked);

        #endregion

        #region Appointment Type

        List<AppointmentType> GetAppointmentTypeList();
        AppointmentType GetAppointmentTypeByID(int appointmentTypeId);
        AppointmentType DeleteAppointmentTypeRecord(int appointmentTypeId);
        AppointmentType AddUpdateAppointmentType(AppointmentType appointmentType);

        #endregion

        #region Appointment Status

        List<AppointmentStatus> GetAppointmentStatusList();
        AppointmentStatus GetAppointmentStatusbyID(int appointmentStatusId);
        AppointmentStatus DeleteAppointmentRecord(int appointmentStatusId);
        AppointmentStatus AddUpdateAppointmentStatus(AppointmentStatus appointmentStatus);

        #endregion

        #region Patient

        #region Relationshiptopatient       
        List<Relationshiptopatient> GetRelationstoPatient();
        Relationshiptopatient GetRelationshiptopatientbyID(int rspID);
        Relationshiptopatient DeleteRelationshiptopatientRecord(int rspID);
        Relationshiptopatient AddUpdateRelationshiptopatient(Relationshiptopatient relationshiptopatient);

        #endregion

        #region IdentificationIdType

        List<IdentificationIdType> GetAllIdentificationTypes();
        IdentificationIdType GetIdentificationIdTypebyID(int iDTID);
        IdentificationIdType DeleteIdentificationIdTypeRecord(int iDTID);
        IdentificationIdType AddUpdateIdentificationIdType(IdentificationIdType identificationIdType);

        #endregion

        #region PatientCategory

        List<PatientCategory> GetPatientCategories();
        PatientCategory GetPatientCategorybyID(int patientCategoryID);
        PatientCategory DeletePatientCategoryRecord(int patientCategoryID);
        PatientCategory AddUpdatePatientCategory(PatientCategory patientCategory);

        #endregion

        #region PatientType

        List<PatientType> GetPatientTypes();
        PatientType GetPatientTypebyID(int patientTypeID);
        PatientType DeletePatientTypeRecord(int patientTypeID);
        PatientType AddUpdatePatientType(PatientType patientType);

        #endregion

        #region MaritalStatus

        List<MaritalStatus> GetMaritalStatuses();
        MaritalStatus GetMaritalStatusbyID(int maritalStatusID);
        MaritalStatus DeleteMaritalStatusRecord(int maritalStatusID);
        MaritalStatus AddUpdateMaritalStatus(MaritalStatus maritalStatus);

        #endregion

        #region ContactType

        List<ContactType> GetContactTypes();
        ContactType GetContactTypebyID(int contactTypeID);
        ContactType DeleteContactTypeRecord(int contactTypeID);
        ContactType AddUpdateContactType(ContactType contactType);

        #endregion

        #region Religion

        List<Religion> GetReligions();
        Religion GetReligionbyID(int religionID);
        Religion DeleteReligionRecord(int religionID);
        Religion AddUpdateReligion(Religion religion);

        #endregion

        #region Race

        List<Race> GetRaces();
        Race GetRacebyID(int raceID);
        Race DeleteRaceRecord(int raceID);
        Race AddUpdateRace(Race race);

        #endregion

        #region Family History Status Master

        List<FamilyHistoryStatusMaster> GetFamilyHistoryStatusMasterList();
        FamilyHistoryStatusMaster GetFamilyHistoryStatusMasterbyId(int familyHistoryStatusId);
        FamilyHistoryStatusMaster DeleteFamilyHistoryStatusMasterRecord(int familyHistoryStatusId);
        FamilyHistoryStatusMaster AddUpdateFamilyHistoryStatusMaster(FamilyHistoryStatusMaster familyHistoryStatusMaster);

        #endregion

        #region BloodGroup

        List<BloodGroup> GetAllBloodGroups();
        BloodGroup GetBloodGroupbyID(int bloodGroupID);
        BloodGroup DeleteBloodGroupRecord(int bloodGroupID);
        BloodGroup AddUpdateBloodGroup(BloodGroup bloodGroup);

        #endregion

        #region IllnessType

        List<IllnessType> GetAllIllnessTypes();
        IllnessType GetIllnessTypebyID(int illnessTypeID);
        IllnessType DeleteIllnessTypeRecord(int illnessTypeID);
        IllnessType AddUpdateIllnessType(IllnessType illnessType);

        #endregion

        #region InsuranceType

        List<InsuranceType> GetAllInsuranceTypes();
        InsuranceType GetInsuranceTypebyID(int insuranceTypeID);
        InsuranceType DeleteInsuranceTypeRecord(int insuranceTypeID);
        InsuranceType AddUpdateInsuranceType(InsuranceType insuranceType);

        #endregion

        #region InsuranceCategory

        List<InsuranceCategory> GetAllInsuranceCategories();
        InsuranceCategory GetInsuranceCategorybyID(int insuranceCategoryID);
        InsuranceCategory DeleteInsuranceCategoryRecord(int insuranceCategoryID);
        InsuranceCategory AddUpdateInsuranceCategory(InsuranceCategory insuranceCategory);

        #endregion

        #region Document Type

        List<DocumentType> GetAllDocumentType();
        DocumentType GetDocumentTypebyID(int documentTypeID);
        DocumentType DeleteDocumentTypebyID(int documentTypeID);
        DocumentType AddUpdateDocumentType(DocumentType documentType);

        #endregion

        #region Rediology Master

        #region Radiology Procedure Requested

        List<RadiologyProcedureRequested> GetAllRadiologyProcedureRequested();
        RadiologyProcedureRequested GetRadiologyProcedureRequestedbyID(int radiologyProcedureRequestedID);
        RadiologyProcedureRequested DeleteRadiologyProcedureRequestedRecord(int radiologyProcedureRequestedID);
        RadiologyProcedureRequested AddUpdateRadiologyProcedureRequested(RadiologyProcedureRequested radiologyProcedureRequested);

        #endregion

        #region Radiology Type

        List<RadiologyType> GetAllRadiologyType();
        RadiologyType GetRadiologyTypebyID(int radiologyTypeID);
        RadiologyType DeleteRadiologyTypeRecord(int radiologyTypeID);
        RadiologyType AddUpdateRadiologyType(RadiologyType radiologyType);

        #endregion

        #region Referred Lab

        List<ReferredLab> GetAllReferredLab();
        ReferredLab GetReferredLabbyID(int referredLabID);
        ReferredLab DeleteReferredLabRecord(int referredLabID);
        ReferredLab AddUpdateReferredLab(ReferredLab referredLab);

        #endregion

        #region Body Section

        List<BodySection> GetAllBodySection();
        BodySection GetBodySectionbyID(int bodySectionID);
        BodySection DeleteBodySectionbyID(int bodySectionID);
        BodySection AddUpdateBodySection(BodySection bodySection);

        #endregion

        #region Report Format

        List<ReportFormat> GetAllReportFormat();
        ReportFormat GetReportFormatbyID(int reportFormatID);
        ReportFormat DeleteReportFormatbyID(int reportFormatID);
        ReportFormat AddUpdateReportFormat(ReportFormat reportFormat);

        #endregion

        #endregion

        #region Immunization Master

        #region Body Site

        List<BodySite> GetAllBodySite();
        BodySite GetBodySitebyID(int bodySiteID);
        BodySite DeleteBodySitebyID(int bodySiteID);
        BodySite AddUpdateBodySite(BodySite bodySite);

        #endregion

        #endregion

        #endregion

        #region Auto Generating Numbers

        string GetMRNo();
        string GetAdmissionNo();
        string GetMedicationNo();
        string GetLabOrderNo();
        string GetReceiptNo();
        string GetBillNo();
        string GetAppointmentNo();
        string GetVisitNo();
        string GetEmployeeNo();
        List<string> GetAppointmentNumbersbySearch(string searchKey);
        List<string> GetAdmissionNumbersbySearch(string searchKey);
        List<string> GetVisitNumbersbySearch(string searchKey);

        #endregion

        #region Admission Master

        #region Admission Type

        List<AdmissionType> GetAllAdmissionTypes();
        AdmissionType GetAdmissionTypebyID(int admissionTypeID);
        AdmissionType DeleteAdmissionTypeRecord(int admissionTypeID);
        AdmissionType AddUpdateAdmissionType(AdmissionType admissionType);

        #endregion

        #region Admission Status

        List<AdmissionStatus> GetAllAdmissionStatus();
        AdmissionStatus GetAdmissionStatusbyID(int admissionStatusID);
        AdmissionStatus AddUpdateAdmissionStatus(AdmissionStatus admissionStatus);
        AdmissionStatus DeleteAdmissionStatusRecord(int admissionStatusID);

        #endregion

        #region Patient Arrival by

        List<PatientArrivalBy> GetPatientArrivalbyValues();
        PatientArrivalBy GetPatientArrivalbyRecordbyID(int arrivalbyID);
        PatientArrivalBy AddUpdatePatientArrivalbyRecord(PatientArrivalBy patientArrival);
        PatientArrivalBy DeletePatientArrivalByRecordbyId(int arrivalbyID);

        #endregion

        #endregion

        #region Triage Master

        #region Allergy Type

        List<AllergyType> GetAllAllergyTypes();
        AllergyType GetAllergyTypebyId(int allergyTypeId);
        AllergyType DeleteAllergyTypeRecord(int allergyTypeId);
        AllergyType AddUpdateAllergyType(AllergyType allergyType);

        #endregion

        #region Allergy Severity

        List<AllergySeverity> GetAllergySeverities();
        AllergySeverity GetAllergySeveritybyId(int allergySeverityId);
        AllergySeverity DeleteAllergySeverityRecord(int allergySeverityId);
        AllergySeverity AddUpdateAllergySeverity(AllergySeverity allergySeverity);

        #endregion

        #region Allergy Status Master

        List<AllergyStatusMaster> GetAllergyStatusMasterList();
        AllergyStatusMaster GetAllergyStatusMasterbyId(int allergyStatusMasterId);
        AllergyStatusMaster DeleteAllergyStatusMasterRecord(int allergyStatusMasterId);
        AllergyStatusMaster AddUpdateAllergyStatusMaster(AllergyStatusMaster allergyStatusMaster);

        #endregion

        #region BP Location

        List<BPLocation> GetBPLocationList();
        BPLocation GetBPLocationbyId(int bPLocationId);
        BPLocation DeleteBPLocationRecord(int bPLocationId);
        BPLocation AddUpdateBPLocation(BPLocation bPLocation);

        #endregion

        #region Food Intake Type

        List<FoodIntakeType> GetFoodIntakeTypeList();
        FoodIntakeType GetFoodIntakeTypebyId(int foodIntakeTypeId);
        FoodIntakeType DeleteFoodIntakeTypeRecord(int foodIntakeTypeId);
        FoodIntakeType AddUpdateFoodIntakeType(FoodIntakeType foodIntakeType);

        #endregion

        #region Patient Eat Master

        List<PatientEatMaster> GetPatientEatMasterList();
        PatientEatMaster GetPatientEatMasterbyId(int patientEatMasterId);
        PatientEatMaster DeletePatientEatMasterRecord(int patientEatMasterId);
        PatientEatMaster AddUpdatePatientEatMaster(PatientEatMaster patientEatMaster);

        #endregion

        #region Food Intake Category Master

        List<FoodIntakeMaster> GetFoodIntakeMasterList();
        FoodIntakeMaster GetFoodIntakeMasterbyId(int foodIntakeMasterId);
        FoodIntakeMaster DeleteFoodIntakeMasterRecord(int foodIntakeMasterId);
        FoodIntakeMaster AddUpdateFoodIntakeMaster(FoodIntakeMaster foodIntakeMaster);

        #endregion

        #region FCBalance

        List<FCBalance> GetAllBalanceList();
        FCBalance GetFCBalancebyID(int fcbalanceID);
        FCBalance DeleteFCBalanceRecord(int fcbalanceID);
        FCBalance AddUpdateFCBalance(FCBalance fcbalance);

        #endregion

        #region FCMobility

        List<FCMobility> GetAllMobilities();
        FCMobility GetFCMobilitybyID(int fcmobilityID);
        FCMobility DeleteFCMobilityRecord(int fcmobilityID);
        FCMobility AddUpdateFCMobility(FCMobility fcmobility);

        #endregion

        #region PainScale

        List<PainScale> GetAllPainScales();
        PainScale GetPainScalebyID(int painScaleID);
        PainScale DeletePainScaleRecord(int painScaleID);
        PainScale AddUpdatePainScale(PainScale painScale);

        #endregion

        #region Gait Master

        List<GaitMaster> GetAllGaitMasters();
        GaitMaster GetGaitMasterbyID(int gaitMasterID);
        GaitMaster DeleteGaitMasterRecord(int gaitMasterID);
        GaitMaster AddUpdateGaitMaster(GaitMaster gaitMaster);

        #endregion

        #region Treatment Type

        List<TreatmentTypeMaster> GetAllTreatmentTypes();
        TreatmentTypeMaster GetTreatmentTypebyID(int treatmentTypeID);
        TreatmentTypeMaster DeleteTreatmentTypeRecord(int treatmentTypeID);
        TreatmentTypeMaster AddUpdateTreatmentType(TreatmentTypeMaster treatmentType);

        #endregion

        #region Drinking Master

        List<DrinkingMaster> GetDrinkingMasterList();
        DrinkingMaster GetDrinkingMasterbyId(int drinkingMasterId);
        DrinkingMaster DeleteDrinkingMasterRecord(int drinkingMasterId);
        DrinkingMaster AddUpdateDrinkingMaster(DrinkingMaster drinkingMaster);

        #endregion

        #region Smoking Master

        List<SmokingMaster> GetSmokingMasterList();
        SmokingMaster GetSmokingMasterbyId(int smokingMasterId);
        SmokingMaster DeleteSmokingMasterRecord(int smokingMasterId);
        SmokingMaster AddUpdateSmokingMaster(SmokingMaster smokingMaster);

        #endregion

        #region PatientPosition

        List<PatientPosition> GetAllPatientPositions();
        PatientPosition GetPatientPositionbyID(int patientPositionID);
        PatientPosition DeletePatientPositionRecord(int patientPositionID);
        PatientPosition AddUpdatePatientPosition(PatientPosition patientPosition);

        #endregion

        #region ProblemStatus

        List<ProblemStatus> GetAllProblemStatuses();
        ProblemStatus GetProblemStatusbyID(int problemStatusID);
        ProblemStatus DeleteProblemStatusRecord(int problemStatusID);
        ProblemStatus AddUpdateProblemStatus(ProblemStatus problemStatus);

        #endregion

        #region TemperatureLocation

        List<TemperatureLocation> GetAllTemperatureLocations();
        TemperatureLocation GetTemperatureLocationbyID(int temperatureLocationID);
        TemperatureLocation DeleteTemperatureLocationRecord(int temperatureLocationID);
        TemperatureLocation AddUpdateTemperatureLocation(TemperatureLocation temperatureLocation);


        #endregion

        #region ProcedureStatus

        List<ProcedureStatus> GetAllProcedureStatuses();
        ProcedureStatus GetProcedureStatusbyID(int procedureStatusID);
        ProcedureStatus DeleteProcedureStatusRecord(int procedureStatusID);
        ProcedureStatus AddUpdateProcedureStatus(ProcedureStatus procedureStatus);

        #endregion

        #region ProcedureType

        List<ProcedureType> GetAllProcedureTypes();
        ProcedureType GetProcedureTypebyID(int procedureTypeID);
        ProcedureType DeleteProcedureTypeRecord(int procedureTypeID);
        ProcedureType AddUpdateProcedureType(ProcedureType procedureType);

        #endregion

        #region Procedures

        List<Procedures> GetAllProcedures(string searchkey);
        Procedures GetProceduresbyID(int procedureID);
        Procedures DeleteProceduresRecord(int procedureID);
        Procedures AddUpdateProcedures(Procedures procedures);

        #endregion

        #region Care Plan Status Master

        List<CarePlanStatusMaster> GetCarePlanStatusMasterList();
        CarePlanStatusMaster GetCarePlanStatusMasterbyId(int carePlanStatusId);
        CarePlanStatusMaster DeleteCarePlanStatusMasterRecord(int carePlanStatusId);
        CarePlanStatusMaster AddUpdateCarePlanStatusMaster(CarePlanStatusMaster carePlanStatusMaster);

        #endregion

        #region Care Plan Progress Master

        List<CarePlanProgressMaster> GetCarePlanProgressMasterList();
        CarePlanProgressMaster GetCarePlanProgressMasterbyId(int carePlanProgressId);
        CarePlanProgressMaster DeleteCarePlanProgressMasterRecord(int carePlanProgressId);
        CarePlanProgressMaster AddUpdateCarePlanProgressMaster(CarePlanProgressMaster carePlanProgressMaster);

        #endregion

        #region Symptoms

        List<Symptoms> GetSymptomsList();
        Symptoms GetSymptombyID(int symptomId);
        Symptoms DeleteSymptomRecord(int symptomId);
        Symptoms AddUpdateSymptoms(Symptoms symptoms);

        #endregion

        #region Problem Area

        List<ProblemArea> GetAllProblemAreas();
        ProblemArea GetProblemAreabyID(int problemAreaID);
        ProblemArea DeleteProblemAreaRecord(int problemAreaID);
        ProblemArea AddUpdateProblemArea(ProblemArea problemArea);

        #endregion

        #region Problem Type

        List<ProblemType> GetProblemTypeList();
        ProblemType GetProblemTypebyID(int problemTypeID);
        ProblemType DeleteProblemTypeRecord(int problemTypeID);
        ProblemType AddUpdateProblemType(ProblemType problemType);

        #endregion

        #region Requested Procedure

        List<RequestedProcedure> GetRequestedProcedureList();
        RequestedProcedure GetRequestedProcedurebyID(int requestedProcedureID);
        RequestedProcedure DeleteRequestedProcedureRecord(int requestedProcedureID);
        RequestedProcedure AddUpdateRequestedProcedure(RequestedProcedure requestedProcedure);

        #endregion

        #region Dispense Form

        List<DispenseForm> GetDispenseFormList();
        DispenseForm GetDispenseFormbyID(int dispenseFormID);
        DispenseForm DeleteDispenseFormRecord(int dispenseFormID);
        DispenseForm AddUpdateDispenseForm(DispenseForm dispenseForm);

        #endregion

        #region Dosage Form

        List<DosageForm> GetDosageFormList();
        DosageForm GetDosageFormbyID(int dosageFormID);
        DosageForm DeleteDosageFormRecord(int dosageFormID);
        DosageForm AddUpdateDosageForm(DosageForm dosageForm);

        #endregion

        #region Prescription Order Type

        List<PrescriptionOrderType> GetPrescriptionOrderTypeList();
        PrescriptionOrderType GetPrescriptionOrderTypebyID(int prescriptionOrderTypeId);
        PrescriptionOrderType DeletePrescriptionOrderTypeRecord(int prescriptionOrderTypeId);
        PrescriptionOrderType AddUpdatePrescriptionOrderType(PrescriptionOrderType prescriptionOrderType);

        #endregion

        #region Medication Units

        List<MedicationUnits> GetMedicationUnitList();
        MedicationUnits GetMedicationUnitbyID(int medicationUnitsId);
        MedicationUnits DeleteMedicationUnit(int medicationUnitsId);
        MedicationUnits AddUpdateMedicationUnit(MedicationUnits medicationUnits);

        #endregion

        #region Medication Route

        List<MedicationRoute> GetMedicationRouteList();
        MedicationRoute GetMedicationRoutebyID(int medicationRouteId);
        MedicationRoute DeleteMedicationRoute(int medicationRouteId);
        MedicationRoute AddUpdateMedicationRoute(MedicationRoute medicationRouteData);

        #endregion

        #region Medication Status

        List<MedicationStatus> GetMedicationStatusList();
        MedicationStatus GetMedicationStatusbyID(int medicationStatusId);
        MedicationStatus DeleteMedicationStatusbyID(int medicationStatusId);
        MedicationStatus AddUpdateMedicationStatus(MedicationStatus medicationStatusData);

        #endregion

        #endregion

        #region Departments

        List<Departments> GetDepartmentList();
        Departments GetDepartmentbyID(int departmentID);
        Departments DeleteDepartmentRecord(int departmentID);
        Departments AddUpdateDepartment(Departments departmentData);

        #endregion

        #region User type

        List<UserType> GetUserType();
        UserType GetUserTypeRecordbyID(int userTypeId);
        UserType DeleteUserTypeRecord(int userTypeId);
        UserType AddUpdateUserType(UserType userType);

        #endregion

        #region EmpExtracurricularActivitiesType

        List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType();
        EmpExtracurricularActivitiesType GetEmpExtracurricularActivitiesTypeRecordbyID(int activityTypeId);
        EmpExtracurricularActivitiesType DeleteEmpExtracurricularActivitiesTypeRecord(int activityTypeId);
        EmpExtracurricularActivitiesType AddUpdateEmpExtracurricularActivitiesType(EmpExtracurricularActivitiesType ActivityType);

        #endregion

        #region E lab status master

        List<eLabMasterStatus> GetELabStatusList();
        eLabMasterStatus GetELabStatusRecordbyId(int eLabMasterStatusID);
        eLabMasterStatus DeleteELabStatusRecordbyId(int eLabMasterStatusID);
        eLabMasterStatus AddUpdateELabMasterStatus(eLabMasterStatus elabMasterStatusData);

        #endregion

        #region Billing Master

        List<BillingMasterStatus> GetBillingStatusList();
        BillingMasterStatus GetBillingStatusRecordbyId(int BillingMasterStatusID);
        BillingMasterStatus DeleteBillingStatusRecordbyId(int BillingMasterStatusID);
        BillingMasterStatus AddUpdateBillingMasterStatus(BillingMasterStatus billingMasterStatusData);

        #endregion

        #region File Access

        void WriteFile(IFormFile file, string moduleName);
        void WriteMultipleFiles(List<IFormFile> Files, string modulePath);
        List<string> GetFile(string modulePath);
        List<clsViewFile> GetFiles(string modulePath);
        List<string> DeleteFile(string path, string fileName);

        #endregion

        #region Roles

        List<Roles> GetRolesList();
        Roles GetRoleRecordbyId(int roleID);
        Roles AddUpdateRole(Roles roleData);

        #endregion

        #region Users & roles

        List<AspNetUsers> GetUsersforRoleSetup(string searchKey);
        List<userroleModel> AddUpdateUserRoles(IEnumerable<userroleModel> userRoleCollection);
        List<userroleModel> GetRolesForUserbyId(string UserId);

        #endregion

        #region Facility

        List<Speciality> GetAllSpecialities();
        List<FacilityModel> GetAllFacilities();
        FacilityModel GetFacilitybyID(int facilityId);
        FacilityModel AddUpdateFacility(FacilityModel facility);
        string GetSpecialitiesforFacility(string specialityID);

        #endregion


    }
}
   