using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using System.IO;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class TenantMasterController : Controller
    {
        public readonly ITenantMasterService iTenantMasterService;

        public TenantMasterController(ITenantMasterService _iTenantMasterService)
        {
            iTenantMasterService = _iTenantMasterService;
        }

        #region Gender

        [HttpGet]
        public List<Gender> GetAllGender()
        {
            return this.iTenantMasterService.GetAllGender();
        }

        [HttpGet]
        public Gender GetGenderbyID(int genderID)
        {
            return this.iTenantMasterService.GetGenderbyID(genderID);
        }

        [HttpGet]
        public Gender DeleteGenderRecord(int genderID)
        {
            return this.iTenantMasterService.DeleteGenderRecord(genderID);
        }

        [HttpPost]
        public Gender AddUpdateGender(Gender gender)
        {
            return this.iTenantMasterService.AddUpdateGender(gender);
        }

        #endregion

        #region Address Type

        [HttpGet]
        public List<AddressType> GetAllAddressTypes()
        {
            return this.iTenantMasterService.GetAllAddressTypes();
        }

        [HttpGet]
        public AddressType GetAddressTypebyID(int addressTypeID)
        {
            return this.iTenantMasterService.GetAddressTypebyID(addressTypeID);
        }

        [HttpGet]
        public AddressType DeleteAddressTypeRecord(int addressTypeID)
        {
            return this.iTenantMasterService.DeleteAddressTypeRecord(addressTypeID);
        }

        [HttpPost]
        public AddressType AddUpdateAddressType(AddressType addressType)
        {
            return this.iTenantMasterService.AddUpdateAddressType(addressType);
        }

        #endregion

        #region Country

        [HttpGet]
        public List<Country> GetAllCountries()
        {
            return this.iTenantMasterService.GetAllCountries();
        }

        [HttpGet]
        public Country GetCountrybyID(int countryID)
        {
            return this.iTenantMasterService.GetCountrybyID(countryID);
        }

        [HttpGet]
        public Country DeleteCountryRecord(int countryID)
        {
            return this.iTenantMasterService.DeleteCountryRecord(countryID);
        }

        [HttpPost]
        public Country AddUpdateCountry(Country country)
        {
            return this.iTenantMasterService.AddUpdateCountry(country);
        }

        #endregion

        #region Language

        [HttpGet]
        public List<Language> GetAllLanguages()
        {
            return this.iTenantMasterService.GetAllLanguages();
        }

        [HttpGet]
        public Language GetLanguagebyID(int languageID)
        {
            return this.iTenantMasterService.GetLanguagebyID(languageID);
        }

        [HttpGet]
        public Language DeleteLanguageRecord(int languageID)
        {
            return this.iTenantMasterService.DeleteLanguageRecord(languageID);
        }

        [HttpPost]
        public Language AddUpdateLanguage(Language language)
        {
            return this.iTenantMasterService.AddUpdateLanguage(language);
        }

        #endregion

        #region State

        [HttpGet]
        public List<State> GetAllStates()
        {
            return this.iTenantMasterService.GetAllStates();
        }

        [HttpGet]
        public State GetStatebyID(int stateID)
        {
            return this.iTenantMasterService.GetStatebyID(stateID);
        }

        [HttpGet]
        public State DeleteStateRecord(int stateID)
        {
            return this.iTenantMasterService.DeleteStateRecord(stateID);
        }

        [HttpPost]
        public State AddUpdateState(State state)
        {
            return this.iTenantMasterService.AddUpdateState(state);
        }

        #endregion

        #region Payment Type

        [HttpGet]
        public List<PaymentType> GetAllPaymentTypes()
        {
            return this.iTenantMasterService.GetAllPaymentTypes();
        }

        [HttpGet]
        public PaymentType GetPaymentTypebyID(int paymentTypeID)
        {
            return this.iTenantMasterService.GetPaymentTypebyID(paymentTypeID);
        }

        [HttpGet]
        public PaymentType DeletePaymentTypeRecord(int paymentTypeID)
        {
            return this.iTenantMasterService.DeletePaymentTypeRecord(paymentTypeID);
        }

        [HttpPost]
        public PaymentType AddUpdatePaymentType(PaymentType paymentType)
        {
            return this.iTenantMasterService.AddUpdatePaymentType(paymentType);
        }

        #endregion

        #region Salutation

        [HttpGet]
        public List<Salutation> GetAllSalutations()
        {
            return this.iTenantMasterService.GetAllSalutations();
        }

        [HttpGet]
        public Salutation GetSalutationbyID(int salutationID)
        {
            return this.iTenantMasterService.GetSalutationbyID(salutationID);
        }

        [HttpGet]
        public Salutation DeleteSalutationRecord(int salutationID)
        {
            return this.iTenantMasterService.DeleteSalutationRecord(salutationID);
        }

        [HttpPost]
        public Salutation AddUpdateSalutation(Salutation salutation)
        {
            return this.iTenantMasterService.AddUpdateSalutation(salutation);
        }

        #endregion

        #region Notes table label mapping

        [HttpGet]
        public List<Notestablelabelmapping> GetAllNotestablelabelmapping()
        {
            return this.iTenantMasterService.GetAllNotestablelabelmapping();
        }

        [HttpGet]
        public Notestablelabelmapping GetNotestablelabelmappingbyID(int noteStablelabelmappingID)
        {
            return this.iTenantMasterService.GetNotestablelabelmappingbyID(noteStablelabelmappingID);
        }

        [HttpGet]
        public Notestablelabelmapping DeleteNotestablelabelmappingRecord(int notesTablelabelmappingID)
        {
            return this.iTenantMasterService.DeleteNotestablelabelmappingRecord(notesTablelabelmappingID);
        }

        [HttpPost]
        public Notestablelabelmapping AddUpdateNotestablelabelmapping(Notestablelabelmapping notesTablelabelmapping)
        {
            return this.iTenantMasterService.AddUpdateNotestablelabelmapping(notesTablelabelmapping);
        }

        #endregion

        #region Room Master

        [HttpGet]
        public List<RoomMaster> GetAllRoomMaster()
        {
            return this.iTenantMasterService.GetAllRoomMaster();
        }

        [HttpGet]
        public RoomMaster GetRoomMasterbyID(int roomTypeID)
        {
            return this.iTenantMasterService.GetRoomMasterbyID(roomTypeID);
        }

        [HttpGet]
        public RoomMaster DeleteRoomMasterRecord(int roomTypeID)
        {
            return this.iTenantMasterService.DeleteRoomMasterRecord(roomTypeID);
        }

        [HttpPost]
        public RoomMaster AddUpdateRoomMaster(RoomMaster roomMaster)
        {
            return this.iTenantMasterService.AddUpdateRoomMaster(roomMaster);
        }

        #endregion

        #region Tenant Speciality

        [HttpGet]
        public List<TenantSpeciality> GetTenantSpecialityList()
        {
            return this.iTenantMasterService.GetTenantSpecialityList();
        }

        [HttpGet]
        public TenantSpeciality GetTenantSpecialityRecordbyID(int tenantSpecialityId)
        {
            return this.iTenantMasterService.GetTenantSpecialityRecordbyID(tenantSpecialityId);
        }

        [HttpGet]
        public TenantSpeciality DeleteTenantSpecialityRecord(int tenantSpecialityID)
        {
            return this.iTenantMasterService.DeleteTenantSpecialityRecord(tenantSpecialityID);
        }

        [HttpPost]
        public TenantSpeciality AddUpdateTenantSpeciality(TenantSpeciality tenantSpeciality)
        {
            return this.iTenantMasterService.AddUpdateTenantSpeciality(tenantSpeciality);
        }

        #endregion

        #region Patient Arrival Condition

        [HttpGet]
        public List<PatientArrivalCondition> GetPatientArrivalConditions()
        {
            return this.iTenantMasterService.GetPatientArrivalConditions();
        }

        [HttpGet]
        public PatientArrivalCondition GetPatientArrivalConditionbyId(int arrivalConditionID)
        {
            return this.iTenantMasterService.GetPatientArrivalConditionbyId(arrivalConditionID);
        }

        [HttpGet]
        public PatientArrivalCondition DeletePatientArrivalConditionRecord(int arrivalConditionID)
        {
            return this.iTenantMasterService.DeletePatientArrivalConditionRecord(arrivalConditionID);
        }

        [HttpPost]
        public PatientArrivalCondition AddUpdateArrivalCondition(PatientArrivalCondition arrivalCondition)
        {
            return this.iTenantMasterService.AddUpdateArrivalCondition(arrivalCondition);
        }

        #endregion

        #region Recorded During 

        [HttpGet]
        public List<RecordedDuring> GetRecordedDuringList()
        {
            return this.iTenantMasterService.GetRecordedDuringList();
        }

        [HttpGet]
        public RecordedDuring GetRecordedDuringbyId(int recordedDuringID)
        {
            return this.iTenantMasterService.GetRecordedDuringbyId(recordedDuringID);
        }

        [HttpGet]
        public RecordedDuring DeleteRecordedDuringRecord(int recordedDuringID)
        {
            return this.iTenantMasterService.DeleteRecordedDuringRecord(recordedDuringID);
        }

        [HttpPost]
        public RecordedDuring AddUpdateRecordedDuring(RecordedDuring recordedDuring)
        {
            return this.iTenantMasterService.AddUpdateRecordedDuring(recordedDuring);
        }

        #endregion

        #region Urgency Type

        [HttpGet]
        public List<UrgencyType> GetUrgencyTypeList()
        {
            return this.iTenantMasterService.GetUrgencyTypeList();
        }

        [HttpGet]
        public UrgencyType GetUrgencyTypebyId(int urgencyTypeID)
        {
            return this.iTenantMasterService.GetUrgencyTypebyId(urgencyTypeID);
        }

        [HttpGet]
        public UrgencyType DeleteUrgencyTypeRecord(int urgencyTypeID)
        {
            return this.iTenantMasterService.DeleteUrgencyTypeRecord(urgencyTypeID);
        }

        [HttpPost]
        public UrgencyType AddUpdateUrgencyType(UrgencyType urgencyType)
        {
            return this.iTenantMasterService.AddUpdateUrgencyType(urgencyType);
        }

        #endregion

        #region Visit Type

        [HttpGet]
        public List<VisitType> GetVisitTypeList()
        {
            return this.iTenantMasterService.GetVisitTypeList();
        }

        [HttpGet]
        public VisitType GetVisitTypeRecordbyID(int visitTypeId)
        {
            return this.iTenantMasterService.GetVisitTypeRecordbyID(visitTypeId);
        }

        [HttpGet]
        public VisitType DeleteVisitTypeRecord(int visitTypeID)
        {
            return this.iTenantMasterService.DeleteVisitTypeRecord(visitTypeID);
        }

        [HttpPost]
        public VisitType AddUpdateVisitType(VisitType visitType)
        {
            return this.iTenantMasterService.AddUpdateVisitType(visitType);
        }

        #endregion

        #region Visit Status

        [HttpGet]
        public List<VisitStatus> GetVisitStatusList()
        {
            return this.iTenantMasterService.GetVisitStatusList();
        }

        [HttpGet]
        public VisitStatus GetVisitStatusRecordbyID(int visitStatusId)
        {
            return this.iTenantMasterService.GetVisitStatusRecordbyID(visitStatusId);
        }

        [HttpGet]
        public VisitStatus DeleteVisitStatusRecord(int visitStatusID)
        {
            return this.iTenantMasterService.DeleteVisitStatusRecord(visitStatusID);
        }

        [HttpPost]
        public VisitStatus AddUpdateVisitStatus(VisitStatus visitStatus)
        {
            return this.iTenantMasterService.AddUpdateVisitStatus(visitStatus);
        }

        #endregion

        #region Consultation Type

        [HttpGet]
        public List<ConsultationType> GetConsultationTypeList()
        {
            return this.iTenantMasterService.GetConsultationTypeList();
        }

        [HttpGet]
        public ConsultationType GetConsultationTypebyId(int consultationTypeID)
        {
            return this.iTenantMasterService.GetConsultationTypebyId(consultationTypeID);
        }

        [HttpGet]
        public ConsultationType DeleteConsultationTypeRecord(int consultationTypeID)
        {
            return this.iTenantMasterService.DeleteConsultationTypeRecord(consultationTypeID);
        }

        [HttpPost]
        public ConsultationType AddUpdateConsultationType(ConsultationType consultationType)
        {
            return this.iTenantMasterService.AddUpdateConsultationType(consultationType);
        }

        #endregion

        #region Appointment Booked

        [HttpGet]
        public List<AppointmentBooked> GetAppointmentBookedList()
        {
            return this.iTenantMasterService.GetAppointmentBookedList();
        }

        [HttpGet]
        public AppointmentBooked GetAppointmentBookedbyId(int appointmentBookedID)
        {
            return this.iTenantMasterService.GetAppointmentBookedbyId(appointmentBookedID);
        }

        [HttpGet]
        public AppointmentBooked DeleteAppointmentBookedRecord(int appointmentBookedID)
        {
            return this.iTenantMasterService.DeleteAppointmentBookedRecord(appointmentBookedID);
        }

        [HttpPost]
        public AppointmentBooked AddUpdateAppointmentBooked(AppointmentBooked appointmentBooked)
        {
            return this.iTenantMasterService.AddUpdateAppointmentBooked(appointmentBooked);
        }

        #endregion

        #region Appointment Type

        [HttpGet]
        public List<AppointmentType> GetAppointmentTypeList()
        {
            return this.iTenantMasterService.GetAppointmentTypeList();
        }

        [HttpGet]
        public AppointmentType GetAppointmentTypeByID(int appointmentTypeId)
        {
            return this.iTenantMasterService.GetAppointmentTypeByID(appointmentTypeId);
        }

        [HttpGet]
        public AppointmentType DeleteAppointmentTypeRecord(int appointmentTypeId)
        {
            return this.iTenantMasterService.DeleteAppointmentTypeRecord(appointmentTypeId);
        }

        [HttpPost]
        public AppointmentType AddUpdateAppointmentType(AppointmentType appointmentType)
        {
            return this.iTenantMasterService.AddUpdateAppointmentType(appointmentType);
        }

        #endregion

        #region Appointment Status

        [HttpGet]
        public List<AppointmentStatus> GetAppointmentStatusList()
        {
            return this.iTenantMasterService.GetAppointmentStatusList();
        }

        [HttpGet]
        public AppointmentStatus GetAppointmentStatusbyID(int appointmentStatusId)
        {
            return this.iTenantMasterService.GetAppointmentStatusbyID(appointmentStatusId);
        }

        [HttpGet]
        public AppointmentStatus DeleteAppointmentRecord(int appointmentStatusId)
        {
            return this.iTenantMasterService.DeleteAppointmentRecord(appointmentStatusId);
        }

        [HttpPost]
        public AppointmentStatus AddUpdateAppointmentStatus(AppointmentStatus appointmentStatus)
        {
            return this.iTenantMasterService.AddUpdateAppointmentStatus(appointmentStatus);
        }

        #endregion

        #region Patient

        #region Relationshiptopatient       
        [HttpGet]
        public List<Relationshiptopatient> GetRelationstoPatient()
        {
            return this.iTenantMasterService.GetRelationstoPatient();
        }

        [HttpGet]
        public Relationshiptopatient GetRelationshiptopatientbyID(int rspID)
        {
            return this.iTenantMasterService.GetRelationshiptopatientbyID(rspID);
        }

        [HttpGet]
        public Relationshiptopatient DeleteRelationshiptopatientRecord(int rspID)
        {
            return this.iTenantMasterService.DeleteRelationshiptopatientRecord(rspID);
        }

        [HttpPost]
        public Relationshiptopatient AddUpdateRelationshiptopatient(Relationshiptopatient relationshiptopatient)
        {
            return this.iTenantMasterService.AddUpdateRelationshiptopatient(relationshiptopatient);
        }

        #endregion

        #region IdentificationIdType

        [HttpGet]
        public List<IdentificationIdType> GetAllIdentificationTypes()
        {
            return this.iTenantMasterService.GetAllIdentificationTypes();
        }

        [HttpGet]
        public IdentificationIdType GetIdentificationIdTypebyID(int iDTID)
        {
            return this.iTenantMasterService.GetIdentificationIdTypebyID(iDTID);
        }

        [HttpGet]
        public IdentificationIdType DeleteIdentificationIdTypeRecord(int iDTID)
        {
            return this.iTenantMasterService.DeleteIdentificationIdTypeRecord(iDTID);
        }

        [HttpPost]
        public IdentificationIdType AddUpdateIdentificationIdType(IdentificationIdType identificationIdType)
        {
            return this.iTenantMasterService.AddUpdateIdentificationIdType(identificationIdType);
        }

        #endregion

        #region PatientCategory

        [HttpGet]
        public List<PatientCategory> GetPatientCategories()
        {
            return this.iTenantMasterService.GetPatientCategories();
        }

        [HttpGet]
        public PatientCategory GetPatientCategorybyID(int patientCategoryID)
        {
            return this.iTenantMasterService.GetPatientCategorybyID(patientCategoryID);
        }

        [HttpGet]
        public PatientCategory DeletePatientCategoryRecord(int patientCategoryID)
        {
            return this.iTenantMasterService.DeletePatientCategoryRecord(patientCategoryID);
        }

        [HttpPost]
        public PatientCategory AddUpdatePatientCategory(PatientCategory patientCategory)
        {
            return this.iTenantMasterService.AddUpdatePatientCategory(patientCategory);
        }

        #endregion

        #region PatientType

        [HttpGet]
        public List<PatientType> GetPatientTypes()
        {
            return this.iTenantMasterService.GetPatientTypes();
        }

        [HttpGet]
        public PatientType GetPatientTypebyID(int patientTypeID)
        {
            return this.iTenantMasterService.GetPatientTypebyID(patientTypeID);
        }

        [HttpGet]
        public PatientType DeletePatientTypeRecord(int patientTypeID)
        {
            return this.iTenantMasterService.DeletePatientTypeRecord(patientTypeID);
        }

        [HttpPost]
        public PatientType AddUpdatePatientType(PatientType patientType)
        {
            return this.iTenantMasterService.AddUpdatePatientType(patientType);
        }

        #endregion

        #region MaritalStatus

        [HttpGet]
        public List<MaritalStatus> GetMaritalStatuses()
        {
            return this.iTenantMasterService.GetMaritalStatuses();
        }

        [HttpGet]
        public MaritalStatus GetMaritalStatusbyID(int maritalStatusID)
        {
            return this.iTenantMasterService.GetMaritalStatusbyID(maritalStatusID);
        }

        [HttpGet]
        public MaritalStatus DeleteMaritalStatusRecord(int maritalStatusID)
        {
            return this.iTenantMasterService.DeleteMaritalStatusRecord(maritalStatusID);
        }

        [HttpPost]
        public MaritalStatus AddUpdateMaritalStatus(MaritalStatus maritalStatus)
        {
            return this.iTenantMasterService.AddUpdateMaritalStatus(maritalStatus);
        }

        #endregion

        #region ContactType

        [HttpGet]
        public List<ContactType> GetContactTypes()
        {
            return this.iTenantMasterService.GetContactTypes();
        }

        [HttpGet]
        public ContactType GetContactTypebyID(int contactTypeID)
        {
            return this.iTenantMasterService.GetContactTypebyID(contactTypeID);
        }

        [HttpGet]
        public ContactType DeleteContactTypeRecord(int contactTypeID)
        {
            return this.iTenantMasterService.DeleteContactTypeRecord(contactTypeID);
        }

        [HttpPost]
        public ContactType AddUpdateContactType(ContactType contactType)
        {
            return this.iTenantMasterService.AddUpdateContactType(contactType);
        }

        #endregion

        #region Religion

        [HttpGet]
        public List<Religion> GetReligions()
        {
            return this.iTenantMasterService.GetReligions();
        }

        [HttpGet]
        public Religion GetReligionbyID(int religionID)
        {
            return this.iTenantMasterService.GetReligionbyID(religionID);
        }

        [HttpGet]
        public Religion DeleteReligionRecord(int religionID)
        {
            return this.iTenantMasterService.DeleteReligionRecord(religionID);
        }

        [HttpPost]
        public Religion AddUpdateReligion(Religion religion)
        {
            return this.iTenantMasterService.AddUpdateReligion(religion);
        }

        #endregion

        #region Race

        [HttpGet]
        public List<Race> GetRaces()
        {
            return this.iTenantMasterService.GetRaces();
        }

        [HttpGet]
        public Race GetRacebyID(int raceID)
        {
            return this.iTenantMasterService.GetRacebyID(raceID);
        }

        [HttpGet]
        public Race DeleteRaceRecord(int raceID)
        {
            return this.iTenantMasterService.DeleteRaceRecord(raceID);
        }

        [HttpPost]
        public Race AddUpdateRace(Race race)
        {
            return this.iTenantMasterService.AddUpdateRace(race);
        }

        #endregion

        #region Family History Status Master

        [HttpGet]
        public List<FamilyHistoryStatusMaster> GetFamilyHistoryStatusMasterList()
        {
            return this.iTenantMasterService.GetFamilyHistoryStatusMasterList();
        }

        [HttpGet]
        public FamilyHistoryStatusMaster GetFamilyHistoryStatusMasterbyId(int familyHistoryStatusId)
        {
            return this.iTenantMasterService.GetFamilyHistoryStatusMasterbyId(familyHistoryStatusId);
        }

        [HttpGet]
        public FamilyHistoryStatusMaster DeleteFamilyHistoryStatusMasterRecord(int familyHistoryStatusId)
        {
            return this.iTenantMasterService.DeleteFamilyHistoryStatusMasterRecord(familyHistoryStatusId);
        }

        [HttpPost]
        public FamilyHistoryStatusMaster AddUpdateFamilyHistoryStatusMaster(FamilyHistoryStatusMaster familyHistoryStatusMaster)
        {
            return this.iTenantMasterService.AddUpdateFamilyHistoryStatusMaster(familyHistoryStatusMaster);
        }

        #endregion

        #region BloodGroup

        [HttpGet]
        public List<BloodGroup> GetAllBloodGroups()
        {
            return this.iTenantMasterService.GetAllBloodGroups();
        }

        [HttpGet]
        public BloodGroup GetBloodGroupbyID(int bloodGroupID)
        {
            return this.iTenantMasterService.GetBloodGroupbyID(bloodGroupID);
        }

        [HttpGet]
        public BloodGroup DeleteBloodGroupRecord(int bloodGroupID)
        {
            return this.iTenantMasterService.DeleteBloodGroupRecord(bloodGroupID);
        }

        [HttpPost]
        public BloodGroup AddUpdateBloodGroup(BloodGroup bloodGroup)
        {
            return this.iTenantMasterService.AddUpdateBloodGroup(bloodGroup);
        }

        #endregion

        #region IllnessType

        [HttpGet]
        public List<IllnessType> GetAllIllnessTypes()
        {
            return this.iTenantMasterService.GetAllIllnessTypes();
        }

        [HttpGet]
        public IllnessType GetIllnessTypebyID(int illnessTypeID)
        {
            return this.iTenantMasterService.GetIllnessTypebyID(illnessTypeID);
        }

        [HttpGet]
        public IllnessType DeleteIllnessTypeRecord(int illnessTypeID)
        {
            return this.iTenantMasterService.DeleteIllnessTypeRecord(illnessTypeID);
        }

        [HttpPost]
        public IllnessType AddUpdateIllnessType(IllnessType illnessType)
        {
            return this.iTenantMasterService.AddUpdateIllnessType(illnessType);
        }

        #endregion

        #region InsuranceType

        [HttpGet]
        public List<InsuranceType> GetAllInsuranceTypes()
        {
            return this.iTenantMasterService.GetAllInsuranceTypes();
        }

        [HttpGet]
        public InsuranceType GetInsuranceTypebyID(int insuranceTypeID)
        {
            return this.iTenantMasterService.GetInsuranceTypebyID(insuranceTypeID);
        }

        [HttpGet]
        public InsuranceType DeleteInsuranceTypeRecord(int insuranceTypeID)
        {
            return this.iTenantMasterService.DeleteInsuranceTypeRecord(insuranceTypeID);
        }

        [HttpPost]
        public InsuranceType AddUpdateInsuranceType(InsuranceType insuranceType)
        {
            return this.iTenantMasterService.AddUpdateInsuranceType(insuranceType);
        }

        #endregion

        #region InsuranceCategory

        [HttpGet]
        public List<InsuranceCategory> GetAllInsuranceCategories()
        {
            return this.iTenantMasterService.GetAllInsuranceCategories();
        }

        [HttpGet]
        public InsuranceCategory GetInsuranceCategorybyID(int insuranceCategoryID)
        {
            return this.iTenantMasterService.GetInsuranceCategorybyID(insuranceCategoryID);
        }

        [HttpGet]
        public InsuranceCategory DeleteInsuranceCategoryRecord(int insuranceCategoryID)
        {
            return this.iTenantMasterService.DeleteInsuranceCategoryRecord(insuranceCategoryID);
        }

        [HttpPost]
        public InsuranceCategory AddUpdateInsuranceCategory(InsuranceCategory insuranceCategory)
        {
            return this.iTenantMasterService.AddUpdateInsuranceCategory(insuranceCategory);
        }

        #endregion

        #region Document Type

        [HttpGet]
        public List<DocumentType> GetAllDocumentType()
        {
            return this.iTenantMasterService.GetAllDocumentType();
        }

        [HttpGet]
        public DocumentType GetDocumentTypebyID(int documentTypeID)
        {
            return this.iTenantMasterService.GetDocumentTypebyID(documentTypeID);
        }

        [HttpGet]
        public DocumentType DeleteDocumentTypebyID(int documentTypeID)
        {
            return this.iTenantMasterService.DeleteDocumentTypebyID(documentTypeID);
        }

        [HttpPost]
        public DocumentType AddUpdateDocumentType(DocumentType documentType)
        {
            return this.iTenantMasterService.AddUpdateDocumentType(documentType);
        }

        #endregion

        #region Rediology Master

        #region Radiology Procedure Requested

        [HttpGet]
        public List<RadiologyProcedureRequested> GetAllRadiologyProcedureRequested()
        {
            return this.iTenantMasterService.GetAllRadiologyProcedureRequested();
        }

        [HttpGet]
        public RadiologyProcedureRequested GetRadiologyProcedureRequestedbyID(int radiologyProcedureRequestedID)
        {
            return this.iTenantMasterService.GetRadiologyProcedureRequestedbyID(radiologyProcedureRequestedID);
        }

        [HttpGet]
        public RadiologyProcedureRequested DeleteRadiologyProcedureRequestedRecord(int radiologyProcedureRequestedID)
        {
            return this.iTenantMasterService.DeleteRadiologyProcedureRequestedRecord(radiologyProcedureRequestedID);
        }

        [HttpPost]
        public RadiologyProcedureRequested AddUpdateRadiologyProcedureRequested(RadiologyProcedureRequested radiologyProcedureRequested)
        {
            return this.iTenantMasterService.AddUpdateRadiologyProcedureRequested(radiologyProcedureRequested);
        }

        #endregion

        #region Radiology Type

        [HttpGet]
        public List<RadiologyType> GetAllRadiologyType()
        {
            return this.iTenantMasterService.GetAllRadiologyType();
        }

        [HttpGet]
        public RadiologyType GetRadiologyTypebyID(int radiologyTypeID)
        {
            return this.iTenantMasterService.GetRadiologyTypebyID(radiologyTypeID);
        }

        [HttpGet]
        public RadiologyType DeleteRadiologyTypeRecord(int radiologyTypeID)
        {
            return this.iTenantMasterService.DeleteRadiologyTypeRecord(radiologyTypeID);
        }

        [HttpPost]
        public RadiologyType AddUpdateRadiologyType(RadiologyType radiologyType)
        {
            return this.iTenantMasterService.AddUpdateRadiologyType(radiologyType);
        }

        #endregion

        #region Referred Lab

        [HttpGet]
        public List<ReferredLab> GetAllReferredLab()
        {
            return this.iTenantMasterService.GetAllReferredLab();
        }

        [HttpGet]
        public ReferredLab GetReferredLabbyID(int referredLabID)
        {
            return this.iTenantMasterService.GetReferredLabbyID(referredLabID);
        }

        [HttpGet]
        public ReferredLab DeleteReferredLabRecord(int referredLabID)
        {
            return this.iTenantMasterService.DeleteReferredLabRecord(referredLabID);
        }

        [HttpPost]
        public ReferredLab AddUpdateReferredLab(ReferredLab referredLab)
        {
            return this.iTenantMasterService.AddUpdateReferredLab(referredLab);
        }

        #endregion

        #region Body Section

        [HttpGet]
        public List<BodySection> GetAllBodySection()
        {
            return this.iTenantMasterService.GetAllBodySection();
        }

        [HttpGet]
        public BodySection GetBodySectionbyID(int bodySectionID)
        {
            return this.iTenantMasterService.GetBodySectionbyID(bodySectionID);
        }

        [HttpGet]
        public BodySection DeleteBodySectionbyID(int bodySectionID)
        {
            return this.iTenantMasterService.DeleteBodySectionbyID(bodySectionID);
        }

        [HttpPost]
        public BodySection AddUpdateBodySection(BodySection bodySection)
        {
            return this.iTenantMasterService.AddUpdateBodySection(bodySection);
        }

        #endregion

        #region Report Format

        [HttpGet]
        public List<ReportFormat> GetAllReportFormat()
        {
            return this.iTenantMasterService.GetAllReportFormat();
        }

        [HttpGet]
        public ReportFormat GetReportFormatbyID(int reportFormatID)
        {
            return this.iTenantMasterService.GetReportFormatbyID(reportFormatID);
        }

        [HttpGet]
        public ReportFormat DeleteReportFormatbyID(int reportFormatID)
        {
            return this.iTenantMasterService.DeleteReportFormatbyID(reportFormatID);
        }

        [HttpPost]
        public ReportFormat AddUpdateReportFormat(ReportFormat reportFormat)
        {
            return this.iTenantMasterService.AddUpdateReportFormat(reportFormat);
        }

        #endregion

        #endregion

        #region Immunization Master

        #region Body Site

        [HttpGet]
        public List<BodySite> GetAllBodySite()
        {
            return this.iTenantMasterService.GetAllBodySite();
        }

        [HttpGet]
        public BodySite GetBodySitebyID(int bodySiteID)
        {
            return this.iTenantMasterService.GetBodySitebyID(bodySiteID);
        }

        [HttpGet]
        public BodySite DeleteBodySitebyID(int bodySiteID)
        {
            return this.iTenantMasterService.DeleteBodySitebyID(bodySiteID);
        }

        [HttpPost]
        public BodySite AddUpdateBodySite(BodySite bodySite)
        {
            return this.iTenantMasterService.AddUpdateBodySite(bodySite);
        }

        #endregion

        #endregion

        #endregion

        #region Admission Master

        #region Admission Type

        [HttpGet]
        public List<AdmissionType> GetAllAdmissionTypes()
        {
            return this.iTenantMasterService.GetAllAdmissionTypes();
        }

        [HttpGet]
        public AdmissionType GetAdmissionTypebyID(int admissionTypeID)
        {

            return this.iTenantMasterService.GetAdmissionTypebyID(admissionTypeID);

        }

        [HttpGet]
        public AdmissionType DeleteAdmissionTypeRecord(int admissionTypeID)
        {
            return this.iTenantMasterService.DeleteAdmissionTypeRecord(admissionTypeID);
        }
        [HttpPost]
        public AdmissionType AddUpdateAdmissionType(AdmissionType admissionType)
        {
            return this.iTenantMasterService.AddUpdateAdmissionType(admissionType);
        }
        #endregion

        #region Admission Status

        [HttpGet]
        public List<AdmissionStatus> GetAllAdmissionStatus()
        {
            return this.iTenantMasterService.GetAllAdmissionStatus();
        }

        [HttpGet]
        public AdmissionStatus GetAdmissionStatusbyID(int admissionStatusID)
        {
            return this.iTenantMasterService.GetAdmissionStatusbyID(admissionStatusID);
        }

        [HttpPost]
        public AdmissionStatus AddUpdateAdmissionStatus(AdmissionStatus admissionStatus)
        {
            return this.iTenantMasterService.AddUpdateAdmissionStatus(admissionStatus);
        }

        [HttpGet]
        public AdmissionStatus DeleteAdmissionStatusRecord(int admissionStatusID)
        {
            return this.iTenantMasterService.DeleteAdmissionStatusRecord(admissionStatusID);
        }

        #endregion

        #region Patient Arrival by

        [HttpGet]
        public List<PatientArrivalBy> GetPatientArrivalbyValues()
        {
            return this.iTenantMasterService.GetPatientArrivalbyValues();
        }

        [HttpGet]
        public PatientArrivalBy GetPatientArrivalbyRecordbyID(int arrivalbyID)
        {
            return this.iTenantMasterService.GetPatientArrivalbyRecordbyID(arrivalbyID);
        }

        [HttpPost]
        public PatientArrivalBy AddUpdatePatientArrivalbyRecord(PatientArrivalBy patientArrival)
        {
            return this.iTenantMasterService.AddUpdatePatientArrivalbyRecord(patientArrival);
        }

        [HttpGet]
        public PatientArrivalBy DeletePatientArrivalByRecordbyId(int arrivalbyID)
        {
            return this.iTenantMasterService.DeletePatientArrivalByRecordbyId(arrivalbyID);
        }

        #endregion

        #endregion


        #region Triage Master

        #region Allergy Type

        [HttpGet]
        public List<AllergyType> GetAllAllergyTypes()
        {
            return this.iTenantMasterService.GetAllAllergyTypes();
        }

        [HttpGet]
        public AllergyType GetAllergyTypebyId(int allergyTypeId)
        {
            return this.iTenantMasterService.GetAllergyTypebyId(allergyTypeId);
        }

        [HttpGet]
        public AllergyType DeleteAllergyTypeRecord(int allergyTypeId)
        {
            return this.iTenantMasterService.DeleteAllergyTypeRecord(allergyTypeId);
        }

        [HttpPost]
        public AllergyType AddUpdateAllergyType(AllergyType allergyType)
        {
            return this.iTenantMasterService.AddUpdateAllergyType(allergyType);
        }

        #endregion

        #region Allergy Severity

        [HttpGet]
        public List<AllergySeverity> GetAllergySeverities()
        {
            return this.iTenantMasterService.GetAllergySeverities();
        }

        [HttpGet]
        public AllergySeverity GetAllergySeveritybyId(int allergySeverityId)
        {
            return this.iTenantMasterService.GetAllergySeveritybyId(allergySeverityId);
        }

        [HttpGet]
        public AllergySeverity DeleteAllergySeverityRecord(int allergySeverityId)
        {
            return this.iTenantMasterService.DeleteAllergySeverityRecord(allergySeverityId);
        }

        [HttpPost]
        public AllergySeverity AddUpdateAllergySeverity(AllergySeverity allergySeverity)
        {
            return this.iTenantMasterService.AddUpdateAllergySeverity(allergySeverity);
        }

        #endregion

        #region Allergy Status Master

        [HttpGet]
        public List<AllergyStatusMaster> GetAllergyStatusMasterList()
        {
            return this.iTenantMasterService.GetAllergyStatusMasterList();
        }

        [HttpGet]
        public AllergyStatusMaster GetAllergyStatusMasterbyId(int allergyStatusMasterId)
        {
            return this.iTenantMasterService.GetAllergyStatusMasterbyId(allergyStatusMasterId);
        }

        [HttpGet]
        public AllergyStatusMaster DeleteAllergyStatusMasterRecord(int allergyStatusMasterId)
        {
            return this.iTenantMasterService.DeleteAllergyStatusMasterRecord(allergyStatusMasterId);
        }

        [HttpPost]
        public AllergyStatusMaster AddUpdateAllergyStatusMaster(AllergyStatusMaster allergyStatusMaster)
        {
            return this.iTenantMasterService.AddUpdateAllergyStatusMaster(allergyStatusMaster);
        }

        #endregion

        #region BP Location

        [HttpGet]
        public List<BPLocation> GetBPLocationList()
        {
            return this.iTenantMasterService.GetBPLocationList();
        }

        [HttpGet]
        public BPLocation GetBPLocationbyId(int bPLocationId)
        {
            return this.iTenantMasterService.GetBPLocationbyId(bPLocationId);
        }

        [HttpGet]
        public BPLocation DeleteBPLocationRecord(int bPLocationId)
        {
            return this.iTenantMasterService.DeleteBPLocationRecord(bPLocationId);
        }

        [HttpPost]
        public BPLocation AddUpdateBPLocation(BPLocation bPLocation)
        {
            return this.iTenantMasterService.AddUpdateBPLocation(bPLocation);
        }

        #endregion

        #region Food Intake Type

        [HttpGet]
        public List<FoodIntakeType> GetFoodIntakeTypeList()
        {
            return this.iTenantMasterService.GetFoodIntakeTypeList();
        }

        [HttpGet]
        public FoodIntakeType GetFoodIntakeTypebyId(int foodIntakeTypeId)
        {
            return this.iTenantMasterService.GetFoodIntakeTypebyId(foodIntakeTypeId);
        }

        [HttpGet]
        public FoodIntakeType DeleteFoodIntakeTypeRecord(int foodIntakeTypeId)
        {
            return this.iTenantMasterService.DeleteFoodIntakeTypeRecord(foodIntakeTypeId);
        }

        [HttpPost]
        public FoodIntakeType AddUpdateFoodIntakeType(FoodIntakeType foodIntakeType)
        {
            return this.iTenantMasterService.AddUpdateFoodIntakeType(foodIntakeType);
        }

        #endregion

        #region Patient Eat Master

        [HttpGet]
        public List<PatientEatMaster> GetPatientEatMasterList()
        {
            return this.iTenantMasterService.GetPatientEatMasterList();
        }

        [HttpGet]
        public PatientEatMaster GetPatientEatMasterbyId(int patientEatMasterId)
        {
            return this.iTenantMasterService.GetPatientEatMasterbyId(patientEatMasterId);
        }

        [HttpGet]
        public PatientEatMaster DeletePatientEatMasterRecord(int patientEatMasterId)
        {
            return this.iTenantMasterService.DeletePatientEatMasterRecord(patientEatMasterId);
        }

        [HttpPost]
        public PatientEatMaster AddUpdatePatientEatMaster(PatientEatMaster patientEatMaster)
        {
            return this.iTenantMasterService.AddUpdatePatientEatMaster(patientEatMaster);
        }

        #endregion

        #region Food Intake Master

        [HttpGet]
        public List<FoodIntakeMaster> GetFoodIntakeMasterList()
        {
            return this.iTenantMasterService.GetFoodIntakeMasterList();
        }

        [HttpGet]
        public FoodIntakeMaster GetFoodIntakeMasterbyId(int foodIntakeMasterId)
        {
            return this.iTenantMasterService.GetFoodIntakeMasterbyId(foodIntakeMasterId);
        }

        [HttpGet]
        public FoodIntakeMaster DeleteFoodIntakeMasterRecord(int foodIntakeMasterId)
        {
            return this.iTenantMasterService.DeleteFoodIntakeMasterRecord(foodIntakeMasterId);
        }

        [HttpPost]
        public FoodIntakeMaster AddUpdateFoodIntakeMaster(FoodIntakeMaster foodIntakeMaster)
        {
            return this.iTenantMasterService.AddUpdateFoodIntakeMaster(foodIntakeMaster);
        }

        #endregion

        #region FCBalance

        [HttpGet]
        public List<FCBalance> GetAllBalanceList()
        {
            return iTenantMasterService.GetAllBalanceList();
        }

        [HttpGet]
        public FCBalance GetFCBalancebyID(int fcbalanceID)
        {
            return iTenantMasterService.GetFCBalancebyID(fcbalanceID);
        }

        [HttpGet]
        public FCBalance DeleteFCBalanceRecord(int fcbalanceID)
        {
            return iTenantMasterService.DeleteFCBalanceRecord(fcbalanceID);
        }

        [HttpPost]
        public FCBalance AddUpdateFCBalance(FCBalance fcbalance)
        {
            return iTenantMasterService.AddUpdateFCBalance(fcbalance);
        }

        #endregion

        #region FCMobility

        [HttpGet]
        public List<FCMobility> GetAllMobilities()
        {
            return iTenantMasterService.GetAllMobilities();
        }

        [HttpGet]
        public FCMobility GetFCMobilitybyID(int fcmobilityID)
        {
            return iTenantMasterService.GetFCMobilitybyID(fcmobilityID);
        }

        [HttpGet]
        public FCMobility DeleteFCMobilityRecord(int fcmobilityID)
        {
            return iTenantMasterService.DeleteFCMobilityRecord(fcmobilityID);
        }

        [HttpPost]
        public FCMobility AddUpdateFCMobility(FCMobility fcmobility)
        {
            return iTenantMasterService.AddUpdateFCMobility(fcmobility);
        }

        #endregion

        #region PainScale

        [HttpGet]
        public List<PainScale> GetAllPainScales()
        {
            return iTenantMasterService.GetAllPainScales();
        }

        [HttpGet]
        public PainScale GetPainScalebyID(int painScaleID)
        {
            return iTenantMasterService.GetPainScalebyID(painScaleID);
        }

        [HttpGet]
        public PainScale DeletePainScaleRecord(int painScaleID)
        {
            return iTenantMasterService.DeletePainScaleRecord(painScaleID);
        }

        [HttpPost]
        public PainScale AddUpdatePainScale(PainScale painScale)
        {
            return iTenantMasterService.AddUpdatePainScale(painScale);
        }

        #endregion

        #region Gait Master

        [HttpGet]
        public List<GaitMaster> GetAllGaitMasters()
        {
            return this.iTenantMasterService.GetAllGaitMasters();
        }

        [HttpGet]
        public GaitMaster GetGaitMasterbyID(int gaitMasterID)
        {
            return this.iTenantMasterService.GetGaitMasterbyID(gaitMasterID);
        }

        [HttpGet]
        public GaitMaster DeleteGaitMasterRecord(int gaitMasterID)
        {
            return this.iTenantMasterService.DeleteGaitMasterRecord(gaitMasterID);
        }

        [HttpPost]
        public GaitMaster AddUpdateGaitMaster(GaitMaster gaitMaster)
        {
            return this.iTenantMasterService.AddUpdateGaitMaster(gaitMaster);
        }

        #endregion

        #region Treatment Type

        [HttpGet]
        public List<TreatmentTypeMaster> GetAllTreatmentTypes()
        {
            return this.iTenantMasterService.GetAllTreatmentTypes();
        }

        [HttpGet]
        public TreatmentTypeMaster GetTreatmentTypebyID(int treatmentTypeID)
        {
            return this.iTenantMasterService.GetTreatmentTypebyID(treatmentTypeID);
        }

        [HttpGet]
        public TreatmentTypeMaster DeleteTreatmentTypeRecord(int treatmentTypeID)
        {
            return this.iTenantMasterService.DeleteTreatmentTypeRecord(treatmentTypeID);
        }

        [HttpPost]
        public TreatmentTypeMaster AddUpdateTreatmentType(TreatmentTypeMaster treatmentType)
        {
            return this.iTenantMasterService.AddUpdateTreatmentType(treatmentType);
        }

        #endregion

        #region Drinking Master

        [HttpGet]
        public List<DrinkingMaster> GetDrinkingMasterList()
        {
            return this.iTenantMasterService.GetDrinkingMasterList();
        }

        [HttpGet]
        public DrinkingMaster GetDrinkingMasterbyId(int drinkingMasterId)
        {
            return this.iTenantMasterService.GetDrinkingMasterbyId(drinkingMasterId);
        }

        [HttpGet]
        public DrinkingMaster DeleteDrinkingMasterRecord(int drinkingMasterId)
        {
            return this.iTenantMasterService.DeleteDrinkingMasterRecord(drinkingMasterId);
        }

        [HttpPost]
        public DrinkingMaster AddUpdateDrinkingMaster(DrinkingMaster drinkingMaster)
        {
            return this.iTenantMasterService.AddUpdateDrinkingMaster(drinkingMaster);
        }

        #endregion

        #region Smoking Master

        [HttpGet]
        public List<SmokingMaster> GetSmokingMasterList()
        {
            return this.iTenantMasterService.GetSmokingMasterList();
        }

        [HttpGet]
        public SmokingMaster GetSmokingMasterbyId(int smokingMasterId)
        {
            return this.iTenantMasterService.GetSmokingMasterbyId(smokingMasterId);
        }

        [HttpGet]
        public SmokingMaster DeleteSmokingMasterRecord(int smokingMasterId)
        {
            return this.iTenantMasterService.DeleteSmokingMasterRecord(smokingMasterId);
        }

        [HttpPost]
        public SmokingMaster AddUpdateSmokingMaster(SmokingMaster smokingMaster)
        {
            return this.iTenantMasterService.AddUpdateSmokingMaster(smokingMaster);
        }

        #endregion

        #region PatientPosition

        [HttpGet]
        public List<PatientPosition> GetAllPatientPositions()
        {
            return iTenantMasterService.GetAllPatientPositions();
        }

        [HttpGet]
        public PatientPosition GetPatientPositionbyID(int patientPositionID)
        {
            return iTenantMasterService.GetPatientPositionbyID(patientPositionID);
        }

        [HttpGet]
        public PatientPosition DeletePatientPositionRecord(int patientPositionID)
        {
            return iTenantMasterService.DeletePatientPositionRecord(patientPositionID);
        }

        [HttpPost]
        public PatientPosition AddUpdatePatientPosition(PatientPosition patientPosition)
        {
            return iTenantMasterService.AddUpdatePatientPosition(patientPosition);
        }

        #endregion

        #region ProblemStatus

        [HttpGet]
        public List<ProblemStatus> GetAllProblemStatuses()
        {
            return iTenantMasterService.GetAllProblemStatuses();
        }

        [HttpGet]
        public ProblemStatus GetProblemStatusbyID(int problemStatusID)
        {
            return iTenantMasterService.GetProblemStatusbyID(problemStatusID);
        }

        [HttpGet]
        public ProblemStatus DeleteProblemStatusRecord(int problemStatusID)
        {
            return iTenantMasterService.DeleteProblemStatusRecord(problemStatusID);
        }

        [HttpPost]
        public ProblemStatus AddUpdateProblemStatus(ProblemStatus problemStatus)
        {
            return iTenantMasterService.AddUpdateProblemStatus(problemStatus);
        }

        #endregion

        #region TemperatureLocation

        [HttpGet]
        public List<TemperatureLocation> GetAllTemperatureLocations()
        {
            return iTenantMasterService.GetAllTemperatureLocations();
        }

        [HttpGet]
        public TemperatureLocation GetTemperatureLocationbyID(int temperatureLocationID)
        {
            return iTenantMasterService.GetTemperatureLocationbyID(temperatureLocationID);
        }

        [HttpGet]
        public TemperatureLocation DeleteTemperatureLocationRecord(int temperatureLocationID)
        {
            return iTenantMasterService.DeleteTemperatureLocationRecord(temperatureLocationID);
        }

        [HttpPost]
        public TemperatureLocation AddUpdateTemperatureLocation(TemperatureLocation temperatureLocation)
        {
            return iTenantMasterService.AddUpdateTemperatureLocation(temperatureLocation);
        }

        #endregion

        #region ProcedureStatus

        [HttpGet]
        public List<ProcedureStatus> GetAllProcedureStatuses()
        {
            return iTenantMasterService.GetAllProcedureStatuses();
        }

        [HttpGet]
        public ProcedureStatus GetProcedureStatusbyID(int procedureStatusID)
        {
            return iTenantMasterService.GetProcedureStatusbyID(procedureStatusID);
        }

        [HttpGet]
        public ProcedureStatus DeleteProcedureStatusRecord(int procedureStatusID)
        {
            return iTenantMasterService.DeleteProcedureStatusRecord(procedureStatusID);
        }

        [HttpPost]
        public ProcedureStatus AddUpdateProcedureStatus(ProcedureStatus procedureStatus)
        {
            return iTenantMasterService.AddUpdateProcedureStatus(procedureStatus);
        }

        #endregion

        #region ProcedureType

        [HttpGet]
        public List<ProcedureType> GetAllProcedureTypes()
        {
            return iTenantMasterService.GetAllProcedureTypes();
        }

        [HttpGet]
        public ProcedureType GetProcedureTypebyID(int procedureTypeID)
        {
            return iTenantMasterService.GetProcedureTypebyID(procedureTypeID);
        }

        [HttpGet]
        public ProcedureType DeleteProcedureTypeRecord(int procedureTypeID)
        {
            return iTenantMasterService.DeleteProcedureTypeRecord(procedureTypeID);
        }

        [HttpPost]
        public ProcedureType AddUpdateProcedureType(ProcedureType procedureType)
        {
            return iTenantMasterService.AddUpdateProcedureType(procedureType);
        }

        #endregion

        #region Procedures

        [HttpGet]
        public List<Procedures> GetAllProcedures(string searchkey)
        {
            return this.iTenantMasterService.GetAllProcedures(searchkey);
        }

        [HttpGet]
        public Procedures GetProceduresbyID(int procedureID)
        {
            return this.iTenantMasterService.GetProceduresbyID(procedureID);
        }

        [HttpGet]
        public Procedures DeleteProceduresRecord(int procedureID)
        {
            return this.iTenantMasterService.DeleteProceduresRecord(procedureID);
        }

        [HttpPost]
        public Procedures AddUpdateProcedures(Procedures procedures)
        {
            return this.iTenantMasterService.AddUpdateProcedures(procedures);
        }

        #endregion

        #region Care Plan Status Master

        [HttpGet]
        public List<CarePlanStatusMaster> GetCarePlanStatusMasterList()
        {
            return this.iTenantMasterService.GetCarePlanStatusMasterList();
        }

        [HttpGet]
        public CarePlanStatusMaster GetCarePlanStatusMasterbyId(int carePlanStatusId)
        {
            return this.iTenantMasterService.GetCarePlanStatusMasterbyId(carePlanStatusId);
        }

        [HttpGet]
        public CarePlanStatusMaster DeleteCarePlanStatusMasterRecord(int carePlanStatusId)
        {
            return this.iTenantMasterService.DeleteCarePlanStatusMasterRecord(carePlanStatusId);
        }

        [HttpPost]
        public CarePlanStatusMaster AddUpdateCarePlanStatusMaster(CarePlanStatusMaster carePlanStatusMaster)
        {
            return this.iTenantMasterService.AddUpdateCarePlanStatusMaster(carePlanStatusMaster);
        }

        #endregion

        #region Care Plan Progress Master

        [HttpGet]
        public List<CarePlanProgressMaster> GetCarePlanProgressMasterList()
        {
            return this.iTenantMasterService.GetCarePlanProgressMasterList();
        }

        [HttpGet]
        public CarePlanProgressMaster GetCarePlanProgressMasterbyId(int carePlanProgressId)
        {
            return this.iTenantMasterService.GetCarePlanProgressMasterbyId(carePlanProgressId);
        }

        [HttpGet]
        public CarePlanProgressMaster DeleteCarePlanProgressMasterRecord(int carePlanProgressId)
        {
            return this.iTenantMasterService.DeleteCarePlanProgressMasterRecord(carePlanProgressId);
        }

        [HttpPost]
        public CarePlanProgressMaster AddUpdateCarePlanProgressMaster(CarePlanProgressMaster carePlanProgressMaster)
        {
            return this.iTenantMasterService.AddUpdateCarePlanProgressMaster(carePlanProgressMaster);
        }

        #endregion

        #region Symptoms

        [HttpGet]
        public List<Symptoms> GetSymptomsList()
        {
            return this.iTenantMasterService.GetSymptomsList();
        }

        [HttpGet]
        public Symptoms GetSymptombyID(int symptomId)
        {
            return this.iTenantMasterService.GetSymptombyID(symptomId);
        }

        [HttpGet]
        public Symptoms DeleteSymptomRecord(int symptomId)
        {
            return this.iTenantMasterService.DeleteSymptomRecord(symptomId);
        }

        [HttpPost]
        public Symptoms AddUpdateSymptoms(Symptoms symptoms)
        {
            return this.iTenantMasterService.AddUpdateSymptoms(symptoms);
        }

        #endregion

        #region Problem Area

        [HttpGet]
        public List<ProblemArea> GetAllProblemAreas()
        {
            return this.iTenantMasterService.GetAllProblemAreas();
        }

        [HttpGet]
        public ProblemArea GetProblemAreabyID(int problemAreaID)
        {
            return this.iTenantMasterService.GetProblemAreabyID(problemAreaID);
        }

        [HttpGet]
        public ProblemArea DeleteProblemAreaRecord(int problemAreaID)
        {
            return this.iTenantMasterService.DeleteProblemAreaRecord(problemAreaID);
        }

        [HttpPost]
        public ProblemArea AddUpdateProblemArea(ProblemArea problemArea)
        {
            return this.iTenantMasterService.AddUpdateProblemArea(problemArea);
        }

        #endregion

        #region Problem Type

        [HttpGet]
        public List<ProblemType> GetProblemTypeList()
        {
            return this.iTenantMasterService.GetProblemTypeList();
        }

        [HttpGet]
        public ProblemType GetProblemTypebyID(int problemTypeID)
        {
            return this.iTenantMasterService.GetProblemTypebyID(problemTypeID);
        }

        [HttpGet]
        public ProblemType DeleteProblemTypeRecord(int problemTypeID)
        {
            return this.iTenantMasterService.DeleteProblemTypeRecord(problemTypeID);
        }

        [HttpPost]
        public ProblemType AddUpdateProblemType(ProblemType problemType)
        {
            return this.iTenantMasterService.AddUpdateProblemType(problemType);
        }

        #endregion

        #region Requested Procedure

        [HttpGet]
        public List<RequestedProcedure> GetRequestedProcedureList()
        {
            return this.iTenantMasterService.GetRequestedProcedureList();
        }

        [HttpGet]
        public RequestedProcedure GetRequestedProcedurebyID(int requestedProcedureID)
        {
            return this.iTenantMasterService.GetRequestedProcedurebyID(requestedProcedureID);
        }

        [HttpGet]
        public RequestedProcedure DeleteRequestedProcedureRecord(int requestedProcedureID)
        {
            return this.iTenantMasterService.DeleteRequestedProcedureRecord(requestedProcedureID);
        }

        [HttpPost]
        public RequestedProcedure AddUpdateRequestedProcedure(RequestedProcedure requestedProcedure)
        {
            return this.iTenantMasterService.AddUpdateRequestedProcedure(requestedProcedure);
        }

        #endregion

        #region Dispense Form

        [HttpGet]
        public List<DispenseForm> GetDispenseFormList()
        {
            return this.iTenantMasterService.GetDispenseFormList();
        }

        [HttpGet]
        public DispenseForm GetDispenseFormbyID(int dispenseFormID)
        {
            return this.iTenantMasterService.GetDispenseFormbyID(dispenseFormID);
        }

        [HttpGet]
        public DispenseForm DeleteDispenseFormRecord(int dispenseFormID)
        {
            return this.iTenantMasterService.DeleteDispenseFormRecord(dispenseFormID);
        }

        [HttpPost]
        public DispenseForm AddUpdateDispenseForm(DispenseForm dispenseForm)
        {
            return this.iTenantMasterService.AddUpdateDispenseForm(dispenseForm);
        }

        #endregion

        #region Dosage Form

        [HttpGet]
        public List<DosageForm> GetDosageFormList()
        {
            return this.iTenantMasterService.GetDosageFormList();
        }

        [HttpGet]
        public DosageForm GetDosageFormbyID(int dosageFormID)
        {
            return this.iTenantMasterService.GetDosageFormbyID(dosageFormID);
        }

        [HttpGet]
        public DosageForm DeleteDosageFormRecord(int dosageFormID)
        {
            return this.iTenantMasterService.DeleteDosageFormRecord(dosageFormID);
        }

        [HttpPost]
        public DosageForm AddUpdateDosageForm(DosageForm dosageForm)
        {
            return this.iTenantMasterService.AddUpdateDosageForm(dosageForm);
        }

        #endregion

        #region Prescription Order Type

        [HttpGet]
        public List<PrescriptionOrderType> GetPrescriptionOrderTypeList()
        {
            return this.iTenantMasterService.GetPrescriptionOrderTypeList();
        }

        [HttpGet]
        public PrescriptionOrderType GetPrescriptionOrderTypebyID(int prescriptionOrderTypeId)
        {
            return this.iTenantMasterService.GetPrescriptionOrderTypebyID(prescriptionOrderTypeId);
        }

        [HttpGet]
        public PrescriptionOrderType DeletePrescriptionOrderTypeRecord(int prescriptionOrderTypeId)
        {
            return this.iTenantMasterService.DeletePrescriptionOrderTypeRecord(prescriptionOrderTypeId);
        }

        [HttpPost]
        public PrescriptionOrderType AddUpdatePrescriptionOrderType(PrescriptionOrderType prescriptionOrderType)
        {
            return this.iTenantMasterService.AddUpdatePrescriptionOrderType(prescriptionOrderType);
        }

        #endregion

        #region Medication Units

        [HttpGet]
        public List<MedicationUnits> GetMedicationUnitList()
        {
            return this.iTenantMasterService.GetMedicationUnitList();
        }

        [HttpGet]
        public MedicationUnits GetMedicationUnitbyID(int medicationUnitsId)
        {
            return this.iTenantMasterService.GetMedicationUnitbyID(medicationUnitsId);
        }

        [HttpGet]
        public MedicationUnits DeleteMedicationUnit(int medicationUnitsId)
        {
            return this.iTenantMasterService.DeleteMedicationUnit(medicationUnitsId);
        }

        [HttpPost]
        public MedicationUnits AddUpdateMedicationUnit(MedicationUnits medicationUnits)
        {
            return this.iTenantMasterService.AddUpdateMedicationUnit(medicationUnits);
        }

        #endregion

        #region Medication Route

        [HttpGet]
        public List<MedicationRoute> GetMedicationRouteList()
        {
            return this.iTenantMasterService.GetMedicationRouteList();
        }

        [HttpGet]
        public MedicationRoute GetMedicationRoutebyID(int medicationRouteId)
        {
            return this.iTenantMasterService.GetMedicationRoutebyID(medicationRouteId);
        }

        [HttpGet]
        public MedicationRoute DeleteMedicationRoute(int medicationRouteId)
        {
            return this.iTenantMasterService.DeleteMedicationRoute(medicationRouteId);
        }

        [HttpPost]
        public MedicationRoute AddUpdateMedicationRoute(MedicationRoute medicationRouteData)
        {
            return this.iTenantMasterService.AddUpdateMedicationRoute(medicationRouteData);
        }

        #endregion

        #region Medication Status

        [HttpGet]
        public List<MedicationStatus> GetMedicationStatusList()
        {
            return this.iTenantMasterService.GetMedicationStatusList();
        }

        [HttpGet]
        public MedicationStatus GetMedicationStatusbyID(int medicationStatusId)
        {
            return this.iTenantMasterService.GetMedicationStatusbyID(medicationStatusId);
        }

        [HttpGet]
        public MedicationStatus DeleteMedicationStatusbyID(int medicationStatusId)
        {
            return this.iTenantMasterService.DeleteMedicationStatusbyID(medicationStatusId);
        }

        [HttpPost]
        public MedicationStatus AddUpdateMedicationStatus(MedicationStatus medicationStatusData)
        {
            return this.iTenantMasterService.AddUpdateMedicationStatus(medicationStatusData);
        }

        #endregion

        #endregion

        #region Departments

        [HttpGet]
        public List<Departments> GetDepartmentList()
        {
            return this.iTenantMasterService.GetDepartmentList();
        }

        [HttpGet]
        public Departments GetDepartmentbyID(int departmentID)
        {
            return this.iTenantMasterService.GetDepartmentbyID(departmentID);
        }

        [HttpGet]
        public Departments DeleteDepartmentRecord(int departmentID)
        {
            return this.iTenantMasterService.DeleteDepartmentRecord(departmentID);
        }

        [HttpPost]
        public Departments AddUpdateDepartment(Departments departmentData)
        {
            return this.iTenantMasterService.AddUpdateDepartment(departmentData);
        }

        #endregion

        #region UserType

        [HttpGet]
        public List<UserType> GetUserType()
        {
            return this.iTenantMasterService.GetUserType();
        }

        [HttpGet]
        public UserType GetUserTypeRecordbyID(int userTypeId)
        {
            return this.iTenantMasterService.GetUserTypeRecordbyID(userTypeId);
        }

        [HttpGet]
        public UserType DeleteUserTypeRecord(int userTypeId)
        {
            return this.iTenantMasterService.DeleteUserTypeRecord(userTypeId);
        }

        [HttpPost]
        public UserType AddUpdateUserType(UserType userType)
        {
            return this.iTenantMasterService.AddUpdateUserType(userType);
        }

        #endregion

        #region EmpExtracurricularActivitiesType

        [HttpGet]
        public List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType()
        {
            return this.iTenantMasterService.GetEmpExtracurricularActivitiesType();
        }

        [HttpGet]
        public EmpExtracurricularActivitiesType GetEmpExtracurricularActivitiesTypeRecordbyID(int activityTypeId)
        {
            return this.iTenantMasterService.GetEmpExtracurricularActivitiesTypeRecordbyID(activityTypeId);
        }

        [HttpGet]
        public EmpExtracurricularActivitiesType DeleteEmpExtracurricularActivitiesTypeRecord(int activityTypeId)
        {
            return this.iTenantMasterService.DeleteEmpExtracurricularActivitiesTypeRecord(activityTypeId);
        }

        [HttpPost]
        public EmpExtracurricularActivitiesType AddUpdateEmpExtracurricularActivitiesType(EmpExtracurricularActivitiesType ActivityType)
        {
            return this.iTenantMasterService.AddUpdateEmpExtracurricularActivitiesType(ActivityType);
        }

        #endregion

        #region E lab status master

        [HttpGet]
        public List<eLabMasterStatus> GetELabStatusList()
        {
            return this.iTenantMasterService.GetELabStatusList();
        }

        [HttpGet]
        public eLabMasterStatus GetELabStatusRecordbyId(int eLabMasterStatusID)
        {
            return this.iTenantMasterService.GetELabStatusRecordbyId(eLabMasterStatusID);
        }

        [HttpGet]
        public eLabMasterStatus DeleteELabStatusRecordbyId(int eLabMasterStatusID)
        {
            return this.iTenantMasterService.DeleteELabStatusRecordbyId(eLabMasterStatusID);
        }

        [HttpPost]
        public eLabMasterStatus AddUpdateELabMasterStatus(eLabMasterStatus elabMasterStatusData)
        {
            return this.iTenantMasterService.AddUpdateELabMasterStatus(elabMasterStatusData);
        }

        #endregion

        #region Billing Master

        [HttpGet]
        public List<BillingMasterStatus> GetBillingStatusList()
        {
            return this.iTenantMasterService.GetBillingStatusList();
        }

        [HttpGet]
        public BillingMasterStatus GetBillingStatusRecordbyId(int BillingMasterStatusID)
        {
            return this.iTenantMasterService.GetBillingStatusRecordbyId(BillingMasterStatusID);
        }

        [HttpGet]
        public BillingMasterStatus DeleteBillingStatusRecordbyId(int BillingMasterStatusID)
        {
            return this.iTenantMasterService.DeleteBillingStatusRecordbyId(BillingMasterStatusID);
        }

        [HttpPost]
        public BillingMasterStatus AddUpdateBillingMasterStatus(BillingMasterStatus billingMasterStatusData)
        {
            return this.iTenantMasterService.AddUpdateBillingMasterStatus(billingMasterStatusData);
        }

        #endregion

        #region File Access

        [HttpPost]
        public void WriteFile(IFormFile file, string moduleName)
        {
            this.iTenantMasterService.WriteFile(file, moduleName);
        }

        [HttpPost]
        public void WriteMultipleFiles(List<IFormFile> Files, string modulePath)
        {
            this.iTenantMasterService.WriteMultipleFiles(Files, modulePath);
        }

        [HttpGet]
        public List<string> GetFile(string modulePath)
        {
            return this.iTenantMasterService.GetFile(modulePath);
        }

        [HttpGet]
        public List<clsViewFile> GetFiles(string modulePath)
        {
            return this.iTenantMasterService.GetFiles(modulePath);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iTenantMasterService.DeleteFile(path, fileName);
        }

        #endregion

        #region Roles

        [HttpGet]
        public List<Roles> GetRolesList()
        {
            return this.iTenantMasterService.GetRolesList();
        }

        [HttpGet]
        public Roles GetRoleRecordbyId(int roleID)
        {
            return this.iTenantMasterService.GetRoleRecordbyId(roleID);
        }

        [HttpPost]
        public Roles AddUpdateRole(Roles roleData)
        {
            return this.iTenantMasterService.AddUpdateRole(roleData);
        }

        #endregion

        #region Users & roles

        [HttpGet]
        public List<AspNetUsers> GetUsersforRoleSetup(string searchKey)
        {
            return this.iTenantMasterService.GetUsersforRoleSetup(searchKey);
        }

        [HttpPost]
        List<userroleModel> AddUpdateUserRoles(IEnumerable<userroleModel> userRoleCollection)
        {
            return this.iTenantMasterService.AddUpdateUserRoles(userRoleCollection);
        }

        [HttpGet]
        public List<userroleModel> GetRolesForUserbyId(string UserId)
        {
            return this.iTenantMasterService.GetRolesForUserbyId(UserId);
        }

        #endregion

        #region Facility

        [HttpGet]
        public List<Speciality> GetAllSpecialities()
        {
            return this.iTenantMasterService.GetAllSpecialities();
        }

        [HttpGet]
        public List<FacilityModel> GetAllFacilities()
        {
            return this.iTenantMasterService.GetAllFacilities();
        }

        [HttpGet]
        public FacilityModel GetFacilitybyID(int facilityId)
        {
            return this.iTenantMasterService.GetFacilitybyID(facilityId);
        }


        [HttpPost]
        public FacilityModel AddUpdateFacility(FacilityModel facility)
        {
            return this.iTenantMasterService.AddUpdateFacility(facility);
        }

        #endregion

    }
}
