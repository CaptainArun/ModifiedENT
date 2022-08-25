using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.StaticFiles;

namespace ENT.WebApi.DAL.Services
{
    public class TenantMasterService : ITenantMasterService
    {
        public readonly IUnitOfWork uow;
        public readonly IGlobalUnitOfWork gUow;
        private readonly IHttpContextAccessor httpContextAccessor;

        public TenantMasterService(IUnitOfWork _uow, IGlobalUnitOfWork _gUow, IHttpContextAccessor _httpContextAccessor)
        {
            uow = _uow;
            gUow = _gUow;
            httpContextAccessor = _httpContextAccessor;
        }

        #region Gender

        //// <summary>
        ///// Get Genders
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Gender>. if Collection of Genders = success. else = failure</returns>
        public List<Gender> GetAllGender()
        {
            var genders = this.uow.GenericRepository<Gender>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return genders;
        }

        //// <summary>
        ///// Get Gender by ID
        ///// </summary>
        ///// <param>int genderID</param>
        ///// <returns>Gender. if record of Gender for given Id = success. else = failure</returns>
        public Gender GetGenderbyID(int genderID)
        {
            var genderRecord = this.uow.GenericRepository<Gender>().Table().Where(x => x.GenderID == genderID).FirstOrDefault();

            return genderRecord;
        }

        //// <summary>
        ///// Delete Gender by ID
        ///// </summary>
        ///// <param>int genderID</param>
        ///// <returns>Gender. if record of Gender Deleted for Given ID = success. else = failure</returns>
        public Gender DeleteGenderRecord(int genderID)
        {
            var gender = this.uow.GenericRepository<Gender>().Table().Where(x => x.GenderID == genderID).FirstOrDefault();

            if (gender != null)
            {
                gender.IsActive = false;

                this.uow.GenericRepository<Gender>().Update(gender);
                this.uow.Save();
            }

            return gender;
        }

        //// <summary>
        ///// Add or Update Gender
        ///// </summary>
        ///// <param>Gender gender</param>
        ///// <returns>Gender. if record of Gender is added or updated = success. else = failure</returns>  
        public Gender AddUpdateGender(Gender gender)
        {
            var genderData = this.uow.GenericRepository<Gender>().Table().Where(x => x.GenderCode == gender.GenderCode).FirstOrDefault();

            if (genderData == null)
            {
                genderData = new Gender();

                genderData.GenderCode = gender.GenderCode;
                genderData.GenderDesc = gender.GenderDesc;
                genderData.OrderNo = gender.OrderNo;
                genderData.IsActive = true;
                genderData.Createddate = DateTime.Now;
                genderData.CreatedBy = "User";

                this.uow.GenericRepository<Gender>().Insert(genderData);
            }
            else
            {
                genderData.GenderDesc = gender.GenderDesc;
                genderData.OrderNo = gender.OrderNo;
                genderData.IsActive = true;
                genderData.ModifiedDate = DateTime.Now;
                genderData.ModifiedBy = "User";

                this.uow.GenericRepository<Gender>().Update(genderData);
            }
            this.uow.Save();
            gender.GenderID = genderData.GenderID;

            return gender;
        }

        #endregion

        #region Address Type

        //// <summary>
        ///// Get Address Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AddressType>. if Collection of AddressType = success. else = failure</returns>
        public List<AddressType> GetAllAddressTypes()
        {
            var addressTypes = this.uow.GenericRepository<AddressType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return addressTypes;
        }

        //// <summary>
        ///// Get AddressType by ID
        ///// </summary>
        ///// <param>int addressTypeID</param>
        ///// <returns>AddressType. if record of AddressType for given Id = success. else = failure</returns>
        public AddressType GetAddressTypebyID(int addressTypeID)
        {
            var addressTypeRecord = this.uow.GenericRepository<AddressType>().Table().Where(x => x.AddressTypeId == addressTypeID).FirstOrDefault();

            return addressTypeRecord;
        }

        //// <summary>
        ///// Delete AddressType by ID
        ///// </summary>
        ///// <param>int addressTypeID</param>
        ///// <returns>AddressType. if record of AddressType Deleted for Given ID = success. else = failure</returns>
        public AddressType DeleteAddressTypeRecord(int addressTypeID)
        {
            var addressType = this.uow.GenericRepository<AddressType>().Table().Where(x => x.AddressTypeId == addressTypeID).FirstOrDefault();

            if (addressType != null)
            {
                addressType.IsActive = false;

                this.uow.GenericRepository<AddressType>().Update(addressType);
                this.uow.Save();
            }

            return addressType;
        }

        //// <summary>
        ///// Add or Update AddressType
        ///// </summary>
        ///// <param>AddressType addressType</param>
        ///// <returns>AddressType. if record of AddressType is added or updated = success. else = failure</returns>  
        public AddressType AddUpdateAddressType(AddressType addressType)
        {
            var addressTypeData = this.uow.GenericRepository<AddressType>().Table().Where(x => x.AddressTypeCode == addressType.AddressTypeCode).FirstOrDefault();

            if (addressTypeData == null)
            {
                addressTypeData = new AddressType();

                addressTypeData.AddressTypeCode = addressType.AddressTypeCode;
                addressTypeData.AddressTypeDescription = addressType.AddressTypeDescription;
                addressTypeData.OrderNo = addressType.OrderNo;
                addressTypeData.IsActive = true;
                addressTypeData.CreatedDate = DateTime.Now;
                addressTypeData.CreatedBy = "User";

                this.uow.GenericRepository<AddressType>().Insert(addressTypeData);
            }
            else
            {
                addressTypeData.AddressTypeDescription = addressType.AddressTypeDescription;
                addressTypeData.OrderNo = addressType.OrderNo;
                addressTypeData.IsActive = true;
                addressTypeData.ModifiedDate = DateTime.Now;
                addressTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<AddressType>().Update(addressTypeData);
            }
            this.uow.Save();
            addressType.AddressTypeId = addressTypeData.AddressTypeId;

            return addressType;
        }

        #endregion

        #region Country

        //// <summary>
        ///// Get Countries
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Country>. if Collection of Country = success. else = failure</returns>
        public List<Country> GetAllCountries()
        {
            var countries = this.uow.GenericRepository<Country>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return countries;
        }

        //// <summary>
        ///// Get Country by ID
        ///// </summary>
        ///// <param>int countryID</param>
        ///// <returns>Country. if record of Country for given Id = success. else = failure</returns>
        public Country GetCountrybyID(int countryID)
        {
            var countryRecord = this.uow.GenericRepository<Country>().Table().Where(x => x.CountryId == countryID).FirstOrDefault();

            return countryRecord;
        }

        //// <summary>
        ///// Delete Country by ID
        ///// </summary>
        ///// <param>int countryID</param>
        ///// <returns>Country. if record of Country Deleted for Given ID = success. else = failure</returns>
        public Country DeleteCountryRecord(int countryID)
        {
            var country = this.uow.GenericRepository<Country>().Table().Where(x => x.CountryId == countryID).FirstOrDefault();

            if (country != null)
            {
                country.IsActive = false;

                this.uow.GenericRepository<Country>().Update(country);
                this.uow.Save();
            }

            return country;
        }

        //// <summary>
        ///// Add or Update Country
        ///// </summary>
        ///// <param>Country country</param>
        ///// <returns>Country. if record of Country is added or updated = success. else = failure</returns>  
        public Country AddUpdateCountry(Country country)
        {
            var countryData = this.uow.GenericRepository<Country>().Table().Where(x => x.CountryCode == country.CountryCode).FirstOrDefault();

            if (countryData == null)
            {
                countryData = new Country();

                countryData.CountryCode = country.CountryCode;
                countryData.CountryDescription = country.CountryDescription;
                countryData.OrderNo = country.OrderNo;
                countryData.IsActive = true;
                countryData.CreatedDate = DateTime.Now;
                countryData.CreatedBy = "User";

                this.uow.GenericRepository<Country>().Insert(countryData);
            }
            else
            {
                countryData.CountryDescription = country.CountryDescription;
                countryData.OrderNo = country.OrderNo;
                countryData.IsActive = true;
                countryData.ModifiedDate = DateTime.Now;
                countryData.ModifiedBy = "User";

                this.uow.GenericRepository<Country>().Update(countryData);
            }
            this.uow.Save();
            country.CountryId = countryData.CountryId;

            return country;
        }

        #endregion

        #region Language

        //// <summary>
        ///// Get Languages
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Language>. if Collection of Language = success. else = failure</returns>
        public List<Language> GetAllLanguages()
        {
            var languages = this.uow.GenericRepository<Language>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return languages;
        }

        //// <summary>
        ///// Get Language by ID
        ///// </summary>
        ///// <param>int languageID</param>
        ///// <returns>Language. if record of Language for given Id = success. else = failure</returns>
        public Language GetLanguagebyID(int languageID)
        {
            var languageRecord = this.uow.GenericRepository<Language>().Table().Where(x => x.LanguageId == languageID).FirstOrDefault();

            return languageRecord;
        }

        //// <summary>
        ///// Delete Language by ID
        ///// </summary>
        ///// <param>int languageID</param>
        ///// <returns>Language. if record of Language Deleted for Given ID = success. else = failure</returns>
        public Language DeleteLanguageRecord(int languageID)
        {
            var language = this.uow.GenericRepository<Language>().Table().Where(x => x.LanguageId == languageID).FirstOrDefault();

            if (language != null)
            {
                language.IsActive = false;

                this.uow.GenericRepository<Language>().Update(language);
                this.uow.Save();
            }

            return language;
        }

        //// <summary>
        ///// Add or Update Language
        ///// </summary>
        ///// <param>Language language</param>
        ///// <returns>Language. if record of Language is added or updated = success. else = failure</returns>  
        public Language AddUpdateLanguage(Language language)
        {
            var languageData = this.uow.GenericRepository<Language>().Table().Where(x => x.LanguageCode == language.LanguageCode).FirstOrDefault();

            if (languageData == null)
            {
                languageData = new Language();

                languageData.LanguageCode = language.LanguageCode;
                languageData.LanguageDescription = language.LanguageDescription;
                languageData.OrderNo = language.OrderNo;
                languageData.IsActive = true;
                languageData.CreatedDate = DateTime.Now;
                languageData.CreatedBy = "User";

                this.uow.GenericRepository<Language>().Insert(languageData);
            }
            else
            {
                languageData.LanguageDescription = language.LanguageDescription;
                languageData.OrderNo = language.OrderNo;
                languageData.IsActive = true;
                languageData.ModifiedDate = DateTime.Now;
                languageData.ModifiedBy = "User";

                this.uow.GenericRepository<Language>().Update(languageData);
            }
            this.uow.Save();
            language.LanguageId = languageData.LanguageId;

            return language;
        }

        #endregion

        #region State

        //// <summary>
        ///// Get States
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<State>. if Collection of State = success. else = failure</returns>
        public List<State> GetAllStates()
        {
            var states = this.uow.GenericRepository<State>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return states;
        }

        //// <summary>
        ///// Get State by ID
        ///// </summary>
        ///// <param>int stateID</param>
        ///// <returns>State. if record of State for given Id = success. else = failure</returns>
        public State GetStatebyID(int stateID)
        {
            var stateRecord = this.uow.GenericRepository<State>().Table().Where(x => x.StateId == stateID).FirstOrDefault();

            return stateRecord;
        }

        //// <summary>
        ///// Delete State by ID
        ///// </summary>
        ///// <param>int stateID</param>
        ///// <returns>State. if record of State Deleted for Given ID = success. else = failure</returns>
        public State DeleteStateRecord(int stateID)
        {
            var state = this.uow.GenericRepository<State>().Table().Where(x => x.StateId == stateID).FirstOrDefault();

            if (state != null)
            {
                state.IsActive = false;

                this.uow.GenericRepository<State>().Update(state);
                this.uow.Save();
            }

            return state;
        }

        //// <summary>
        ///// Add or Update State
        ///// </summary>
        ///// <param>State state</param>
        ///// <returns>State. if record of State is added or updated = success. else = failure</returns>  
        public State AddUpdateState(State state)
        {
            var stateData = this.uow.GenericRepository<State>().Table().Where(x => x.StateCode == state.StateCode).FirstOrDefault();

            if (stateData == null)
            {
                stateData = new State();

                stateData.StateCode = state.StateCode;
                stateData.StateDescription = state.StateDescription;
                stateData.OrderNo = state.OrderNo;
                stateData.IsActive = true;
                stateData.CreatedDate = DateTime.Now;
                stateData.CreatedBy = "User";

                this.uow.GenericRepository<State>().Insert(stateData);
            }
            else
            {
                stateData.StateDescription = state.StateDescription;
                stateData.OrderNo = state.OrderNo;
                stateData.IsActive = true;
                stateData.ModifiedDate = DateTime.Now;
                stateData.ModifiedBy = "User";

                this.uow.GenericRepository<State>().Update(stateData);
            }
            this.uow.Save();
            state.StateId = stateData.StateId;

            return state;
        }

        #endregion

        #region Payment Type

        //// <summary>
        ///// Get Payment Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PaymentType>. if Collection of PaymentType = success. else = failure</returns>
        public List<PaymentType> GetAllPaymentTypes()
        {
            var paymentTypes = this.uow.GenericRepository<PaymentType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return paymentTypes;
        }

        //// <summary>
        ///// Get PaymentType by ID
        ///// </summary>
        ///// <param>int paymentTypeID</param>
        ///// <returns>PaymentType. if record of PaymentType for given Id = success. else = failure</returns>
        public PaymentType GetPaymentTypebyID(int paymentTypeID)
        {
            var paymentTypeRecord = this.uow.GenericRepository<PaymentType>().Table().Where(x => x.PaymentTypeId == paymentTypeID).FirstOrDefault();

            return paymentTypeRecord;
        }

        //// <summary>
        ///// Delete PaymentType by ID
        ///// </summary>
        ///// <param>int paymentTypeID</param>
        ///// <returns>PaymentType. if record of PaymentType Deleted for Given ID = success. else = failure</returns>
        public PaymentType DeletePaymentTypeRecord(int paymentTypeID)
        {
            var paymentType = this.uow.GenericRepository<PaymentType>().Table().Where(x => x.PaymentTypeId == paymentTypeID).FirstOrDefault();

            if (paymentType != null)
            {
                paymentType.IsActive = false;

                this.uow.GenericRepository<PaymentType>().Update(paymentType);
                this.uow.Save();
            }

            return paymentType;
        }

        //// <summary>
        ///// Add or Update PaymentType
        ///// </summary>
        ///// <param>PaymentType paymentType</param>
        ///// <returns>PaymentType. if record of PaymentType is added or updated = success. else = failure</returns>  
        public PaymentType AddUpdatePaymentType(PaymentType paymentType)
        {
            var paymentTypeData = this.uow.GenericRepository<PaymentType>().Table().Where(x => x.PaymentTypeCode == paymentType.PaymentTypeCode).FirstOrDefault();

            if (paymentTypeData == null)
            {
                paymentTypeData = new PaymentType();

                paymentTypeData.PaymentTypeCode = paymentType.PaymentTypeCode;
                paymentTypeData.PaymentTypeDescription = paymentType.PaymentTypeDescription;
                paymentTypeData.OrderNo = paymentType.OrderNo;
                paymentTypeData.IsActive = true;
                paymentTypeData.CreatedDate = DateTime.Now;
                paymentTypeData.CreatedBy = "User";

                this.uow.GenericRepository<PaymentType>().Insert(paymentTypeData);
            }
            else
            {
                paymentTypeData.PaymentTypeDescription = paymentType.PaymentTypeDescription;
                paymentTypeData.OrderNo = paymentType.OrderNo;
                paymentTypeData.IsActive = true;
                paymentTypeData.ModifiedDate = DateTime.Now;
                paymentTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<PaymentType>().Update(paymentTypeData);
            }
            this.uow.Save();
            paymentType.PaymentTypeId = paymentTypeData.PaymentTypeId;

            return paymentType;
        }

        #endregion

        #region Salutation

        //// <summary>
        ///// Get Salutations
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Salutation>. if Collection of Salutation = success. else = failure</returns>
        public List<Salutation> GetAllSalutations()
        {
            var salutations = this.uow.GenericRepository<Salutation>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return salutations;
        }

        //// <summary>
        ///// Get Salutation by ID
        ///// </summary>
        ///// <param>int salutationID</param>
        ///// <returns>Salutation. if record of Salutation for given Id = success. else = failure</returns>
        public Salutation GetSalutationbyID(int salutationID)
        {
            var salutationRecord = this.uow.GenericRepository<Salutation>().Table().Where(x => x.SalutationID == salutationID).FirstOrDefault();

            return salutationRecord;
        }

        //// <summary>
        ///// Delete Salutation by ID
        ///// </summary>
        ///// <param>int salutationID</param>
        ///// <returns>Salutation. if record of Salutation Deleted for Given ID = success. else = failure</returns>
        public Salutation DeleteSalutationRecord(int salutationID)
        {
            var salutation = this.uow.GenericRepository<Salutation>().Table().Where(x => x.SalutationID == salutationID).FirstOrDefault();

            if (salutation != null)
            {
                salutation.IsActive = false;

                this.uow.GenericRepository<Salutation>().Update(salutation);
                this.uow.Save();
            }

            return salutation;
        }

        //// <summary>
        ///// Add or Update Salutation
        ///// </summary>
        ///// <param>Salutation salutation</param>
        ///// <returns>Salutation. if record of Salutation is added or updated = success. else = failure</returns>  
        public Salutation AddUpdateSalutation(Salutation salutation)
        {
            var salutationData = this.uow.GenericRepository<Salutation>().Table().Where(x => x.SalutationCode == salutation.SalutationCode).FirstOrDefault();

            if (salutationData == null)
            {
                salutationData = new Salutation();

                salutationData.SalutationCode = salutation.SalutationCode;
                salutationData.SalutationDesc = salutation.SalutationDesc;
                salutationData.OrderNo = salutation.OrderNo;
                salutationData.IsActive = true;
                salutationData.Createddate = DateTime.Now;
                salutationData.CreatedBy = "User";

                this.uow.GenericRepository<Salutation>().Insert(salutationData);
            }
            else
            {
                salutationData.SalutationDesc = salutation.SalutationDesc;
                salutationData.OrderNo = salutation.OrderNo;
                salutationData.IsActive = true;
                salutationData.ModifiedDate = DateTime.Now;
                salutationData.ModifiedBy = "User";

                this.uow.GenericRepository<Salutation>().Update(salutationData);
            }
            this.uow.Save();
            salutation.SalutationID = salutationData.SalutationID;

            return salutation;
        }

        #endregion

        #region Notes table label mapping

        //// <summary>
        ///// Get Notes table label mapping values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Notestablelabelmapping>. if Collection of Notes table label mappings = success. else = failure</returns>
        public List<Notestablelabelmapping> GetAllNotestablelabelmapping()
        {
            var notesTablelabelmappings = this.uow.GenericRepository<Notestablelabelmapping>().Table().Where(x => x.IsActive != false).ToList();

            return notesTablelabelmappings;
        }

        //// <summary>
        ///// Get Notes table label mapping by ID
        ///// </summary>
        ///// <param>int noteStablelabelmappingID</param>
        ///// <returns>Notestablelabelmapping. if record of Notes table label mapping for given Id = success. else = failure</returns>
        public Notestablelabelmapping GetNotestablelabelmappingbyID(int notesTablelabelmappingID)
        {
            var notesTablelabelmappingRecord = this.uow.GenericRepository<Notestablelabelmapping>().Table().Where(x => x.Noteslabelmappingid == notesTablelabelmappingID).FirstOrDefault();

            return notesTablelabelmappingRecord;
        }

        //// <summary>
        ///// Delete Notes table label mapping by ID
        ///// </summary>
        ///// <param>int noteStablelabelmappingID</param>
        ///// <returns>Notestablelabelmapping. if record of Notes table label mapping Deleted for Given ID = success. else = failure</returns>
        public Notestablelabelmapping DeleteNotestablelabelmappingRecord(int notesTablelabelmappingID)
        {
            var notesTablelabelmapping = this.uow.GenericRepository<Notestablelabelmapping>().Table().Where(x => x.Noteslabelmappingid == notesTablelabelmappingID).FirstOrDefault();

            if (notesTablelabelmapping != null)
            {
                notesTablelabelmapping.IsActive = false;

                this.uow.GenericRepository<Notestablelabelmapping>().Update(notesTablelabelmapping);
                this.uow.Save();
            }

            return notesTablelabelmapping;
        }

        //// <summary>
        ///// Add or Update Notes table label mapping
        ///// </summary>
        ///// <param>Notestablelabelmapping noteStablelabelmapping</param>
        ///// <returns>Notestablelabelmapping. if record of Notes table label mapping is added or updated = success. else = failure</returns>  
        public Notestablelabelmapping AddUpdateNotestablelabelmapping(Notestablelabelmapping notesTablelabelmapping)
        {
            var notesTablelabelmappingData = this.uow.GenericRepository<Notestablelabelmapping>().Table().Where(x => x.Tablename == notesTablelabelmapping.Tablename).FirstOrDefault();

            if (notesTablelabelmappingData == null)
            {
                notesTablelabelmappingData = new Notestablelabelmapping();

                notesTablelabelmappingData.Tablename = notesTablelabelmapping.Tablename;
                notesTablelabelmappingData.Noteslabel = notesTablelabelmapping.Noteslabel;
                notesTablelabelmappingData.IsActive = true;
                notesTablelabelmappingData.Createddate = DateTime.Now;
                notesTablelabelmappingData.Createdby = "User";

                this.uow.GenericRepository<Notestablelabelmapping>().Insert(notesTablelabelmappingData);
            }
            else
            {
                notesTablelabelmappingData.Noteslabel = notesTablelabelmapping.Noteslabel;
                notesTablelabelmappingData.IsActive = true;
                notesTablelabelmappingData.Modifieddate = DateTime.Now;
                notesTablelabelmappingData.Modifiedby = "User";

                this.uow.GenericRepository<Notestablelabelmapping>().Update(notesTablelabelmappingData);
            }
            this.uow.Save();
            notesTablelabelmapping.Noteslabelmappingid = notesTablelabelmappingData.Noteslabelmappingid;

            return notesTablelabelmapping;
        }

        #endregion

        #region Room Master

        //// <summary>
        ///// Get Room Master Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RoomMaster>. if Collection of Room Masters = success. else = failure</returns>
        public List<RoomMaster> GetAllRoomMaster()
        {
            var roomMasters = this.uow.GenericRepository<RoomMaster>().Table().Where(x => x.IsActive != false).ToList();

            return roomMasters;
        }

        //// <summary>
        ///// Get Room Master by ID
        ///// </summary>
        ///// <param>int roomMasterID</param>
        ///// <returns>RoomMaster. if record of Room Master for given Id = success. else = failure</returns>
        public RoomMaster GetRoomMasterbyID(int roomTypeID)
        {
            var roomMasterRecord = this.uow.GenericRepository<RoomMaster>().Table().Where(x => x.Roomtypeid == roomTypeID).FirstOrDefault();

            return roomMasterRecord;
        }

        //// <summary>
        ///// Delete Room Master by ID
        ///// </summary>
        ///// <param>int roomMasterID</param>
        ///// <returns>RoomMaster. if record of Room Master Deleted for Given ID = success. else = failure</returns>
        public RoomMaster DeleteRoomMasterRecord(int roomTypeID)
        {
            var roomMaster = this.uow.GenericRepository<RoomMaster>().Table().Where(x => x.Roomtypeid == roomTypeID).FirstOrDefault();

            if (roomMaster != null)
            {
                roomMaster.IsActive = false;

                this.uow.GenericRepository<RoomMaster>().Update(roomMaster);
                this.uow.Save();
            }

            return roomMaster;
        }

        //// <summary>
        ///// Add or Update Room Master
        ///// </summary>
        ///// <param>RoomMaster roomMaster</param>
        ///// <returns>RoomMaster. if record of Room Master is added or updated = success. else = failure</returns>  
        public RoomMaster AddUpdateRoomMaster(RoomMaster roomMaster)
        {
            var roomMasterData = this.uow.GenericRepository<RoomMaster>().Table().Where(x => x.Roomtype == roomMaster.Roomtype).FirstOrDefault();

            if (roomMasterData == null)
            {
                roomMasterData = new RoomMaster();

                roomMasterData.Roomtype = roomMaster.Roomtype;
                roomMasterData.IsActive = true;
                roomMasterData.Createddate = DateTime.Now;
                roomMasterData.Createdby = "User";

                this.uow.GenericRepository<RoomMaster>().Insert(roomMasterData);
            }
            else
            {
                roomMasterData.Roomtype = roomMaster.Roomtype;
                roomMasterData.IsActive = true;
                roomMasterData.Modifieddate = DateTime.Now;
                roomMasterData.Modifiedby = "User";

                this.uow.GenericRepository<RoomMaster>().Update(roomMasterData);
            }
            this.uow.Save();
            roomMaster.Roomtypeid = roomMasterData.Roomtypeid;

            return roomMaster;
        }

        #endregion

        #region Tenant Speciality

        ///// <summary>
        ///// Get Tenant Speciality List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TenantSpeciality>. if Collection of TenantSpeciality = success. else = failure</returns>
        public List<TenantSpeciality> GetTenantSpecialityList()
        {
            var tenantSpecialities = this.uow.GenericRepository<TenantSpeciality>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return tenantSpecialities;
        }

        ///// <summary>
        ///// Get Tenant Speciality Record by ID
        ///// </summary>
        ///// <param>int tenantSpecialityId</param>
        ///// <returns>TenantSpeciality. if Collection of TenantSpeciality = success. else = failure</returns>
        public TenantSpeciality GetTenantSpecialityRecordbyID(int tenantSpecialityId)
        {
            var tenantSpeciality = this.uow.GenericRepository<TenantSpeciality>().Table().Where(x => x.TenantSpecialityID == tenantSpecialityId).FirstOrDefault();
            return tenantSpeciality;
        }

        //// <summary>
        ///// Delete Tenant Speciality by ID
        ///// </summary>
        ///// <param>int tenantSpecialityID</param>
        ///// <returns>TenantSpeciality. if record of Tenant Speciality Deleted for Given ID = success. else = failure</returns>
        public TenantSpeciality DeleteTenantSpecialityRecord(int tenantSpecialityID)
        {
            var tenantSpeciality = this.uow.GenericRepository<TenantSpeciality>().Table().Where(x => x.TenantSpecialityID == tenantSpecialityID).FirstOrDefault();

            if (tenantSpeciality != null)
            {
                tenantSpeciality.IsActive = false;

                this.uow.GenericRepository<TenantSpeciality>().Update(tenantSpeciality);
                this.uow.Save();
            }

            return tenantSpeciality;
        }

        //// <summary>
        ///// Add or Update Tenant Speciality
        ///// </summary>
        ///// <param>TenantSpeciality tenantSpeciality</param>
        ///// <returns>TenantSpeciality. if record of Tenant Speciality is added or updated = success. else = failure</returns>  
        public TenantSpeciality AddUpdateTenantSpeciality(TenantSpeciality tenantSpeciality)
        {
            var tenantSpecialityData = this.uow.GenericRepository<TenantSpeciality>().Table().Where(x => x.TenantSpecialityCode == tenantSpeciality.TenantSpecialityCode).FirstOrDefault();

            if (tenantSpecialityData == null)
            {
                tenantSpecialityData = new TenantSpeciality();

                tenantSpecialityData.TenantSpecialityCode = tenantSpeciality.TenantSpecialityCode;
                tenantSpecialityData.TenantSpecialityDescription = tenantSpeciality.TenantSpecialityDescription;
                tenantSpecialityData.OrderNo = tenantSpeciality.OrderNo;
                tenantSpecialityData.IsActive = true;
                tenantSpecialityData.Createddate = DateTime.Now;
                tenantSpecialityData.CreatedBy = "User";

                this.uow.GenericRepository<TenantSpeciality>().Insert(tenantSpecialityData);
            }
            else
            {
                tenantSpecialityData.TenantSpecialityDescription = tenantSpeciality.TenantSpecialityDescription;
                tenantSpecialityData.OrderNo = tenantSpeciality.OrderNo;
                tenantSpecialityData.IsActive = true;
                tenantSpecialityData.ModifiedDate = DateTime.Now;
                tenantSpecialityData.ModifiedBy = "User";

                this.uow.GenericRepository<TenantSpeciality>().Update(tenantSpecialityData);
            }
            this.uow.Save();
            tenantSpeciality.TenantSpecialityID = tenantSpecialityData.TenantSpecialityID;

            return tenantSpeciality;
        }

        #endregion

        #region Patient Arrival Condition

        ///// <summary> 
        ///// Get All Patient Arrival Conditions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalCondition>. if Collection of PatientArrivalCondition = success. else = failure</returns>
        public List<PatientArrivalCondition> GetPatientArrivalConditions()
        {
            var conditions = this.uow.GenericRepository<PatientArrivalCondition>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return conditions;
        }

        //// <summary>
        ///// Get Arrival Condition by ID
        ///// </summary>
        ///// <param>int arrivalConditionID</param>
        ///// <returns>PatientArrivalCondition. if record of Arrival Condition for given Id = success. else = failure</returns>
        public PatientArrivalCondition GetPatientArrivalConditionbyId(int arrivalConditionID)
        {
            var arrivalcondition = this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == arrivalConditionID);
            return arrivalcondition;
        }

        //// <summary>
        ///// Delete Arrival Condition by ID
        ///// </summary>
        ///// <param>int arrivalConditionID</param>
        ///// <returns>PatientArrivalCondition. if record of Arrival Condition Deleted for Given ID = success. else = failure</returns>
        public PatientArrivalCondition DeletePatientArrivalConditionRecord(int arrivalConditionID)
        {
            var arrivalcondition = this.uow.GenericRepository<PatientArrivalCondition>().Table().Where(x => x.PatientArrivalConditionId == arrivalConditionID).FirstOrDefault();

            if (arrivalcondition != null)
            {
                arrivalcondition.IsActive = false;

                this.uow.GenericRepository<PatientArrivalCondition>().Update(arrivalcondition);
                this.uow.Save();
            }

            return arrivalcondition;
        }

        //// <summary>
        ///// Add or Update Arrival Condition
        ///// </summary>
        ///// <param>PatientArrivalCondition arrivalCondition</param>
        ///// <returns>Salutation. if record of Salutation is added or updated = success. else = failure</returns>  
        public PatientArrivalCondition AddUpdateArrivalCondition(PatientArrivalCondition arrivalCondition)
        {
            var arrivalconditionData = this.uow.GenericRepository<PatientArrivalCondition>().Table().Where(x => x.Patientarrivalconditioncode == arrivalCondition.Patientarrivalconditioncode).FirstOrDefault();

            if (arrivalconditionData == null)
            {
                arrivalconditionData = new PatientArrivalCondition();

                arrivalconditionData.Patientarrivalconditioncode = arrivalCondition.Patientarrivalconditioncode;
                arrivalconditionData.PatientArrivalconditionDescription = arrivalCondition.PatientArrivalconditionDescription;
                arrivalconditionData.OrderNo = arrivalCondition.OrderNo;
                arrivalconditionData.IsActive = true;
                arrivalconditionData.CreatedDate = DateTime.Now;
                arrivalconditionData.CreatedBy = "User";

                this.uow.GenericRepository<PatientArrivalCondition>().Insert(arrivalconditionData);
            }
            else
            {
                arrivalconditionData.PatientArrivalconditionDescription = arrivalCondition.PatientArrivalconditionDescription;
                arrivalconditionData.OrderNo = arrivalCondition.OrderNo;
                arrivalconditionData.IsActive = true;
                arrivalconditionData.ModifiedDate = DateTime.Now;
                arrivalconditionData.ModifiedBy = "User";

                this.uow.GenericRepository<PatientArrivalCondition>().Update(arrivalconditionData);
            }
            this.uow.Save();
            arrivalCondition.PatientArrivalConditionId = arrivalconditionData.PatientArrivalConditionId;

            return arrivalCondition;
        }

        #endregion

        #region Recorded During

        ///// <summary> 
        ///// Get All Recorded During options
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RecordedDuring>. if Collection of Recorded During options = success. else = failure</returns>
        public List<RecordedDuring> GetRecordedDuringList()
        {
            var recordedDurings = this.uow.GenericRepository<RecordedDuring>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return recordedDurings;
        }

        //// <summary>
        ///// Get Recorded During by ID
        ///// </summary>
        ///// <param>int recordedDuringID</param>
        ///// <returns>RecordedDuring. if record of Recorded During for given Id = success. else = failure</returns>
        public RecordedDuring GetRecordedDuringbyId(int recordedDuringID)
        {
            var recordedDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == recordedDuringID);
            return recordedDuring;
        }

        //// <summary>
        ///// Delete Recorded During by ID
        ///// </summary>
        ///// <param>int recordedDuringID</param>
        ///// <returns>RecordedDuring. if record of Recorded During Deleted for Given ID = success. else = failure</returns>
        public RecordedDuring DeleteRecordedDuringRecord(int recordedDuringID)
        {
            var recordedDuring = this.uow.GenericRepository<RecordedDuring>().Table().Where(x => x.RecordedDuringId == recordedDuringID).FirstOrDefault();

            if (recordedDuring != null)
            {
                recordedDuring.IsActive = false;

                this.uow.GenericRepository<RecordedDuring>().Update(recordedDuring);
                this.uow.Save();
            }

            return recordedDuring;
        }

        //// <summary>
        ///// Add or Update Recorded During
        ///// </summary>
        ///// <param>RecordedDuring recordedDuring</param>
        ///// <returns>RecordedDuring. if record of RecordedDuring is added or updated = success. else = failure</returns>  
        public RecordedDuring AddUpdateRecordedDuring(RecordedDuring recordedDuring)
        {
            var recordedDuringData = this.uow.GenericRepository<RecordedDuring>().Table().Where(x => x.RecordedDuringCode == recordedDuring.RecordedDuringCode).FirstOrDefault();

            if (recordedDuringData == null)
            {
                recordedDuringData = new RecordedDuring();

                recordedDuringData.RecordedDuringCode = recordedDuring.RecordedDuringCode;
                recordedDuringData.RecordedDuringDescription = recordedDuring.RecordedDuringDescription;
                recordedDuringData.OrderNo = recordedDuring.OrderNo;
                recordedDuringData.IsActive = true;
                recordedDuringData.CreatedDate = DateTime.Now;
                recordedDuringData.CreatedBy = "User";

                this.uow.GenericRepository<RecordedDuring>().Insert(recordedDuringData);
            }
            else
            {
                recordedDuringData.RecordedDuringDescription = recordedDuring.RecordedDuringDescription;
                recordedDuringData.OrderNo = recordedDuring.OrderNo;
                recordedDuringData.IsActive = true;
                recordedDuringData.ModifiedDate = DateTime.Now;
                recordedDuringData.ModifiedBy = "User";

                this.uow.GenericRepository<RecordedDuring>().Update(recordedDuringData);
            }
            this.uow.Save();
            recordedDuring.RecordedDuringId = recordedDuringData.RecordedDuringId;

            return recordedDuring;
        }

        #endregion

        #region Urgency Type

        ///// <summary> 
        ///// Get All Urgency Type options
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of Urgency Type options = success. else = failure</returns>
        public List<UrgencyType> GetUrgencyTypeList()
        {
            var urgencyTypes = this.uow.GenericRepository<UrgencyType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return urgencyTypes;
        }

        //// <summary>
        ///// Get Urgency Type by ID
        ///// </summary>
        ///// <param>int urgencyTypeID</param>
        ///// <returns>UrgencyType. if record of Urgency Type for given Id = success. else = failure</returns>
        public UrgencyType GetUrgencyTypebyId(int urgencyTypeID)
        {
            var urgencyType = this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == urgencyTypeID);
            return urgencyType;
        }

        //// <summary>
        ///// Delete Urgency Type by ID
        ///// </summary>
        ///// <param>int urgencyTypeID</param>
        ///// <returns>UrgencyType. if record of Urgency Type Deleted for Given ID = success. else = failure</returns>
        public UrgencyType DeleteUrgencyTypeRecord(int urgencyTypeID)
        {
            var urgencyType = this.uow.GenericRepository<UrgencyType>().Table().Where(x => x.UrgencyTypeId == urgencyTypeID).FirstOrDefault();

            if (urgencyType != null)
            {
                urgencyType.IsActive = false;

                this.uow.GenericRepository<UrgencyType>().Update(urgencyType);
                this.uow.Save();
            }

            return urgencyType;
        }

        //// <summary>
        ///// Add or Update Urgency Type
        ///// </summary>
        ///// <param>UrgencyType urgencyType</param>
        ///// <returns>UrgencyType. if record of UrgencyType is added or updated = success. else = failure</returns>  
        public UrgencyType AddUpdateUrgencyType(UrgencyType urgencyType)
        {
            var urgencyTypeData = this.uow.GenericRepository<UrgencyType>().Table().Where(x => x.UrgencyTypeCode == urgencyType.UrgencyTypeCode).FirstOrDefault();

            if (urgencyTypeData == null)
            {
                urgencyTypeData = new UrgencyType();

                urgencyTypeData.UrgencyTypeCode = urgencyType.UrgencyTypeCode;
                urgencyTypeData.UrgencyTypeDescription = urgencyType.UrgencyTypeDescription;
                urgencyTypeData.OrderNo = urgencyType.OrderNo;
                urgencyTypeData.IsActive = true;
                urgencyTypeData.CreatedDate = DateTime.Now;
                urgencyTypeData.CreatedBy = "User";

                this.uow.GenericRepository<UrgencyType>().Insert(urgencyTypeData);
            }
            else
            {
                urgencyTypeData.UrgencyTypeDescription = urgencyType.UrgencyTypeDescription;
                urgencyTypeData.OrderNo = urgencyType.OrderNo;
                urgencyTypeData.IsActive = true;
                urgencyTypeData.ModifiedDate = DateTime.Now;
                urgencyTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<UrgencyType>().Update(urgencyTypeData);
            }
            this.uow.Save();
            urgencyType.UrgencyTypeId = urgencyTypeData.UrgencyTypeId;

            return urgencyType;
        }

        #endregion

        #region Visit Type

        ///// <summary>
        ///// Get Visit Type List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitType>. if Collection of VisitType = success. else = failure</returns>
        public List<VisitType> GetVisitTypeList()
        {
            var visitTypes = this.uow.GenericRepository<VisitType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return visitTypes;
        }

        ///// <summary>
        ///// Get Visit Type Record by ID
        ///// </summary>
        ///// <param>int visitTypeId</param>
        ///// <returns>VisitType. if Collection of VisitType = success. else = failure</returns>
        public VisitType GetVisitTypeRecordbyID(int visitTypeId)
        {
            var visitType = this.uow.GenericRepository<VisitType>().Table().Where(x => x.VisitTypeId == visitTypeId).FirstOrDefault();
            return visitType;
        }

        //// <summary>
        ///// Delete Visit Type by ID
        ///// </summary>
        ///// <param>int visitTypeID</param>
        ///// <returns>VisitType. if record of Visit Type Deleted for Given ID = success. else = failure</returns>
        public VisitType DeleteVisitTypeRecord(int visitTypeID)
        {
            var visitType = this.uow.GenericRepository<VisitType>().Table().Where(x => x.VisitTypeId == visitTypeID).FirstOrDefault();

            if (visitType != null)
            {
                visitType.IsActive = false;

                this.uow.GenericRepository<VisitType>().Update(visitType);
                this.uow.Save();
            }

            return visitType;
        }

        //// <summary>
        ///// Add or Update Visit Type
        ///// </summary>
        ///// <param>VisitType visitType</param>
        ///// <returns>VisitType. if record of Visit Type is added or updated = success. else = failure</returns>  
        public VisitType AddUpdateVisitType(VisitType visitType)
        {
            var visitTypeData = this.uow.GenericRepository<VisitType>().Table().Where(x => x.VisitTypeCode == visitType.VisitTypeCode).FirstOrDefault();

            if (visitTypeData == null)
            {
                visitTypeData = new VisitType();

                visitTypeData.VisitTypeCode = visitType.VisitTypeCode;
                visitTypeData.VisitTypeDescription = visitType.VisitTypeDescription;
                visitTypeData.OrderNo = visitType.OrderNo;
                visitTypeData.IsActive = true;
                visitTypeData.Createddate = DateTime.Now;
                visitTypeData.CreatedBy = "User";

                this.uow.GenericRepository<VisitType>().Insert(visitTypeData);
            }
            else
            {
                visitTypeData.VisitTypeDescription = visitType.VisitTypeDescription;
                visitTypeData.OrderNo = visitType.OrderNo;
                visitTypeData.IsActive = true;
                visitTypeData.Modifieddate = DateTime.Now;
                visitTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<VisitType>().Update(visitTypeData);
            }
            this.uow.Save();
            visitType.VisitTypeId = visitTypeData.VisitTypeId;

            return visitType;
        }
        #endregion

        #region Visit Status

        ///// <summary>
        ///// Get Visit Status List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitStatus>. if Collection of VisitStatus = success. else = failure</returns>
        public List<VisitStatus> GetVisitStatusList()
        {
            var visitStatuses = this.uow.GenericRepository<VisitStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return visitStatuses;
        }

        ///// <summary>
        ///// Get Visit Status Record by ID
        ///// </summary>
        ///// <param>int visitStatusId</param>
        ///// <returns>VisitStatus. if Collection of VisitStatus = success. else = failure</returns>
        public VisitStatus GetVisitStatusRecordbyID(int visitStatusId)
        {
            var visitStatus = this.uow.GenericRepository<VisitStatus>().Table().Where(x => x.VisitStatusId == visitStatusId).FirstOrDefault();
            return visitStatus;
        }

        //// <summary>
        ///// Delete Visit Status by ID
        ///// </summary>
        ///// <param>int visitStatusID</param>
        ///// <returns>VisitStatus. if record of Visit Status Deleted for Given ID = success. else = failure</returns>
        public VisitStatus DeleteVisitStatusRecord(int visitStatusID)
        {
            var visitStatus = this.uow.GenericRepository<VisitStatus>().Table().Where(x => x.VisitStatusId == visitStatusID).FirstOrDefault();

            if (visitStatus != null)
            {
                visitStatus.IsActive = false;

                this.uow.GenericRepository<VisitStatus>().Update(visitStatus);
                this.uow.Save();
            }

            return visitStatus;
        }

        //// <summary>
        ///// Add or Update Visit Status
        ///// </summary>
        ///// <param>VisitStatus visitStatus</param>
        ///// <returns>VisitStatus. if record of Visit Status is added or updated = success. else = failure</returns>  
        public VisitStatus AddUpdateVisitStatus(VisitStatus visitStatus)
        {
            var visitStatusData = this.uow.GenericRepository<VisitStatus>().Table().Where(x => x.VisitStatusCode == visitStatus.VisitStatusCode).FirstOrDefault();

            if (visitStatusData == null)
            {
                visitStatusData = new VisitStatus();

                visitStatusData.VisitStatusCode = visitStatus.VisitStatusCode;
                visitStatusData.VisitStatusDescription = visitStatus.VisitStatusDescription;
                visitStatusData.OrderNo = visitStatus.OrderNo;
                visitStatusData.IsActive = true;
                visitStatusData.CreatedDate = DateTime.Now;
                visitStatusData.CreatedBy = "User";

                this.uow.GenericRepository<VisitStatus>().Insert(visitStatusData);
            }
            else
            {
                visitStatusData.VisitStatusDescription = visitStatus.VisitStatusDescription;
                visitStatusData.OrderNo = visitStatus.OrderNo;
                visitStatusData.IsActive = true;
                visitStatusData.ModifiedDate = DateTime.Now;
                visitStatusData.ModifiedBy = "User";

                this.uow.GenericRepository<VisitStatus>().Update(visitStatusData);
            }
            this.uow.Save();
            visitStatus.VisitStatusId = visitStatusData.VisitStatusId;

            return visitStatus;
        }

        #endregion

        #region Consultation Type

        ///// <summary> 
        ///// Get All Consultation Type options
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ConsultationType>. if Collection of Consultation Type options = success. else = failure</returns>
        public List<ConsultationType> GetConsultationTypeList()
        {
            var consultationTypes = this.uow.GenericRepository<ConsultationType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return consultationTypes;
        }

        //// <summary>
        ///// Get Consultation Type by ID
        ///// </summary>
        ///// <param>int consultationTypeID</param>
        ///// <returns>ConsultationType. if record of Consultation Type for given Id = success. else = failure</returns>
        public ConsultationType GetConsultationTypebyId(int consultationTypeID)
        {
            var consultationType = this.uow.GenericRepository<ConsultationType>().Table().FirstOrDefault(x => x.ConsultationTypeId == consultationTypeID);
            return consultationType;
        }

        //// <summary>
        ///// Delete Consultation Type by ID
        ///// </summary>
        ///// <param>int consultationTypeID</param>
        ///// <returns>ConsultationType. if record of Consultation Type Deleted for Given ID = success. else = failure</returns>
        public ConsultationType DeleteConsultationTypeRecord(int consultationTypeID)
        {
            var consultationType = this.uow.GenericRepository<ConsultationType>().Table().Where(x => x.ConsultationTypeId == consultationTypeID).FirstOrDefault();

            if (consultationType != null)
            {
                consultationType.IsActive = false;

                this.uow.GenericRepository<ConsultationType>().Update(consultationType);
                this.uow.Save();
            }

            return consultationType;
        }

        //// <summary>
        ///// Add or Update Consultation Type
        ///// </summary>
        ///// <param>ConsultationType consultationType</param>
        ///// <returns>ConsultationType. if record of ConsultationType is added or updated = success. else = failure</returns>  
        public ConsultationType AddUpdateConsultationType(ConsultationType consultationType)
        {
            var consultationTypeData = this.uow.GenericRepository<ConsultationType>().Table().Where(x => x.ConsultationTypeCode == consultationType.ConsultationTypeCode).FirstOrDefault();

            if (consultationTypeData == null)
            {
                consultationTypeData = new ConsultationType();

                consultationTypeData.ConsultationTypeCode = consultationType.ConsultationTypeCode;
                consultationTypeData.ConsultationTypeDescription = consultationType.ConsultationTypeDescription;
                consultationTypeData.OrderNo = consultationType.OrderNo;
                consultationTypeData.IsActive = true;
                consultationTypeData.CreatedDate = DateTime.Now;
                consultationTypeData.CreatedBy = "User";

                this.uow.GenericRepository<ConsultationType>().Insert(consultationTypeData);
            }
            else
            {
                consultationTypeData.ConsultationTypeDescription = consultationType.ConsultationTypeDescription;
                consultationTypeData.OrderNo = consultationType.OrderNo;
                consultationTypeData.IsActive = true;
                consultationTypeData.ModifiedDate = DateTime.Now;
                consultationTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<ConsultationType>().Update(consultationTypeData);
            }
            this.uow.Save();
            consultationType.ConsultationTypeId = consultationTypeData.ConsultationTypeId;

            return consultationType;
        }

        #endregion

        #region Appointment Booked

        ///// <summary> 
        ///// Get All Appointment Booked options
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentBooked>. if Collection of Appointment Booked options = success. else = failure</returns>
        public List<AppointmentBooked> GetAppointmentBookedList()
        {
            var appointmentsBooked = this.uow.GenericRepository<AppointmentBooked>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return appointmentsBooked;
        }

        //// <summary>
        ///// Get Appointment Booked by ID
        ///// </summary>
        ///// <param>int appointmentBookedID</param>
        ///// <returns>AppointmentBooked. if record of Appointment Booked for given Id = success. else = failure</returns>
        public AppointmentBooked GetAppointmentBookedbyId(int appointmentBookedID)
        {
            var appointmentBooked = this.uow.GenericRepository<AppointmentBooked>().Table().FirstOrDefault(x => x.AppointmentBookedId == appointmentBookedID);
            return appointmentBooked;
        }

        //// <summary>
        ///// Delete Appointment Booked by ID
        ///// </summary>
        ///// <param>int appointmentBookedID</param>
        ///// <returns>AppointmentBooked. if record of Appointment Booked Deleted for Given ID = success. else = failure</returns>
        public AppointmentBooked DeleteAppointmentBookedRecord(int appointmentBookedID)
        {
            var appointmentBooked = this.uow.GenericRepository<AppointmentBooked>().Table().Where(x => x.AppointmentBookedId == appointmentBookedID).FirstOrDefault();

            if (appointmentBooked != null)
            {
                appointmentBooked.IsActive = false;

                this.uow.GenericRepository<AppointmentBooked>().Update(appointmentBooked);
                this.uow.Save();
            }

            return appointmentBooked;
        }

        //// <summary>
        ///// Add or Update Appointment Booked
        ///// </summary>
        ///// <param>AppointmentBooked appointmentBooked</param>
        ///// <returns>AppointmentBooked. if record of AppointmentBooked is added or updated = success. else = failure</returns>  
        public AppointmentBooked AddUpdateAppointmentBooked(AppointmentBooked appointmentBooked)
        {
            var appointmentBookedData = this.uow.GenericRepository<AppointmentBooked>().Table().Where(x => x.AppointmentBookedCode == appointmentBooked.AppointmentBookedCode).FirstOrDefault();

            if (appointmentBookedData == null)
            {
                appointmentBookedData = new AppointmentBooked();

                appointmentBookedData.AppointmentBookedCode = appointmentBooked.AppointmentBookedCode;
                appointmentBookedData.AppointmentBookedDescription = appointmentBooked.AppointmentBookedDescription;
                appointmentBookedData.OrderNo = appointmentBooked.OrderNo;
                appointmentBookedData.IsActive = true;
                appointmentBookedData.CreatedDate = DateTime.Now;
                appointmentBookedData.CreatedBy = "User";

                this.uow.GenericRepository<AppointmentBooked>().Insert(appointmentBookedData);
            }
            else
            {
                appointmentBookedData.AppointmentBookedDescription = appointmentBooked.AppointmentBookedDescription;
                appointmentBookedData.OrderNo = appointmentBooked.OrderNo;
                appointmentBookedData.IsActive = true;
                appointmentBookedData.ModifiedDate = DateTime.Now;
                appointmentBookedData.ModifiedBy = "User";

                this.uow.GenericRepository<AppointmentBooked>().Update(appointmentBookedData);
            }
            this.uow.Save();
            appointmentBooked.AppointmentBookedId = appointmentBookedData.AppointmentBookedId;

            return appointmentBooked;
        }

        #endregion

        #region Appointment Type

        ///// <summary>
        ///// Get Appointment Type List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentType>. if Collection of AppointmentTypes = success. else = failure</returns>
        public List<AppointmentType> GetAppointmentTypeList()
        {
            var appointTypes = this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return appointTypes;
        }

        ///// <summary>
        ///// Get Appointment Type Record by ID
        ///// </summary>
        ///// <param>int appointmentTypeId</param>
        ///// <returns>AppointmentType. if Record of AppointmentType by ID = success. else = failure</returns>
        public AppointmentType GetAppointmentTypeByID(int appointmentTypeId)
        {
            var appointType = this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == appointmentTypeId).FirstOrDefault();
            return appointType;
        }

        ///// <summary>
        ///// Delete Appointment Type Record by ID
        ///// </summary>
        ///// <param>int appointmentTypeId</param>
        ///// <returns>AppointmentType. if Record of AppointmentType is deleted = success. else = failure</returns>
        public AppointmentType DeleteAppointmentTypeRecord(int appointmentTypeId)
        {
            var appointType = this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == appointmentTypeId).FirstOrDefault();

            if (appointType != null)
            {
                appointType.IsActive = false;
                this.uow.GenericRepository<AppointmentType>().Update(appointType);
                this.uow.Save();
            }

            return appointType;
        }

        //// <summary>
        ///// Add or Update Appointment Type
        ///// </summary>
        ///// <param>AppointmentType appointmentType</param>
        ///// <returns>AppointmentType. if record of AppointmentType is added or updated = success. else = failure</returns>  
        public AppointmentType AddUpdateAppointmentType(AppointmentType appointmentType)
        {
            var appointType = this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeCode == appointmentType.AppointmentTypeCode).FirstOrDefault();

            if (appointType == null)
            {
                appointType = new AppointmentType();

                appointType.AppointmentTypeCode = appointmentType.AppointmentTypeCode;
                appointType.AppointmentTypeDescription = appointmentType.AppointmentTypeDescription;
                appointType.OrderNo = appointmentType.OrderNo;
                appointType.IsActive = true;
                appointType.CreatedDate = DateTime.Now;
                appointType.CreatedBy = "User";

                this.uow.GenericRepository<AppointmentType>().Insert(appointType);
            }
            else
            {
                appointType.AppointmentTypeDescription = appointmentType.AppointmentTypeDescription;
                appointType.OrderNo = appointmentType.OrderNo;
                appointType.IsActive = true;
                appointType.ModifiedDate = DateTime.Now;
                appointType.ModifiedBy = "User";

                this.uow.GenericRepository<AppointmentType>().Update(appointType);
            }
            this.uow.Save();
            appointmentType.AppointmentTypeId = appointType.AppointmentTypeId;

            return appointmentType;
        }

        #endregion

        #region Appointment Status

        ///// <summary>
        ///// Get AppointmentStatus List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentStatus>. if Collection of AppointmentStatus = success. else = failure</returns>
        public List<AppointmentStatus> GetAppointmentStatusList()
        {
            var AppointStatuses = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return AppointStatuses;
        }

        ///// <summary>
        ///// Get AppointmentStatus by ID
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>AppointmentStatus. if Record of AppointmentStatus for Given Id = success. else = failure</returns>
        public AppointmentStatus GetAppointmentStatusbyID(int appointmentStatusId)
        {
            var appointStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == appointmentStatusId).FirstOrDefault();
            return appointStatus;
        }

        ///// <summary>
        ///// Delete AppointmentStatus by ID
        ///// </summary>
        ///// <param>int appointmentStatusId</param>
        ///// <returns>AppointmentStatus. if Record of AppointmentStatus for Given Id = success. else = failure</returns>
        public AppointmentStatus DeleteAppointmentRecord(int appointmentStatusId)
        {
            var appointStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == appointmentStatusId).FirstOrDefault();

            if (appointStatus != null)
            {
                appointStatus.IsActive = false;
                this.uow.GenericRepository<AppointmentStatus>().Update(appointStatus);
                this.uow.Save();
            }

            return appointStatus;
        }

        //// <summary>
        ///// Add or Update Appointment Type
        ///// </summary>
        ///// <param>AppointmentStatus appointmentStatus</param>
        ///// <returns>AppointmentStatus. if record of AppointmentStatus is added or updated = success. else = failure</returns>  
        public AppointmentStatus AddUpdateAppointmentStatus(AppointmentStatus appointmentStatus)
        {
            var appointStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusCode == appointmentStatus.AppointmentStatusCode).FirstOrDefault();

            if (appointStatus == null)
            {
                appointStatus = new AppointmentStatus();

                appointStatus.AppointmentStatusCode = appointmentStatus.AppointmentStatusCode;
                appointStatus.AppointmentStatusDescription = appointmentStatus.AppointmentStatusDescription;
                appointStatus.OrderNo = appointmentStatus.OrderNo;
                appointStatus.IsActive = true;
                appointStatus.CreatedDate = DateTime.Now;
                appointStatus.CreatedBy = "User";

                this.uow.GenericRepository<AppointmentStatus>().Insert(appointStatus);
            }
            else
            {
                appointStatus.AppointmentStatusDescription = appointmentStatus.AppointmentStatusDescription;
                appointStatus.OrderNo = appointmentStatus.OrderNo;
                appointStatus.IsActive = true;
                appointStatus.ModifiedDate = DateTime.Now;
                appointStatus.ModifiedBy = "User";

                this.uow.GenericRepository<AppointmentStatus>().Update(appointStatus);
            }
            this.uow.Save();
            appointmentStatus.AppointmentStatusId = appointStatus.AppointmentStatusId;

            return appointmentStatus;
        }

        #endregion

        #region Patient 

        #region Relationshiptopatient       

        //// <summary>
        ///// Get Relationships to patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Relationshiptopatient>. if collection of Relationship to patient = success. else = failure</returns>
        public List<Relationshiptopatient> GetRelationstoPatient()
        {
            var Relations = this.uow.GenericRepository<Relationshiptopatient>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return Relations;
        }

        //// <summary>
        ///// Get Relationship to patient by ID
        ///// </summary>
        ///// <param>int rspID</param>
        ///// <returns>Relationshiptopatient. if record of Relationshiptopatient for given Id = success. else = failure</returns>
        public Relationshiptopatient GetRelationshiptopatientbyID(int rspID)
        {
            var relationRecord = this.uow.GenericRepository<Relationshiptopatient>().Table().Where(x => x.RSPId == rspID).FirstOrDefault();

            return relationRecord;
        }

        //// <summary>
        ///// Delete Relationship Record by ID
        ///// </summary>
        ///// <param>int rspID</param>
        ///// <returns>Relationshiptopatient. if record of Relationship to patient Deleted for Given ID = success. else = failure</returns>
        public Relationshiptopatient DeleteRelationshiptopatientRecord(int rspID)
        {
            var relationRecord = this.uow.GenericRepository<Relationshiptopatient>().Table().Where(x => x.RSPId == rspID).FirstOrDefault();

            if (relationRecord != null)
            {
                relationRecord.IsActive = false;

                this.uow.GenericRepository<Relationshiptopatient>().Update(relationRecord);
                this.uow.Save();
            }

            return relationRecord;
        }

        //// <summary>
        ///// Add or Update Relationshiptopatient
        ///// </summary>
        ///// <param>Relationshiptopatient relationshiptopatient</param>
        ///// <returns>Relationshiptopatient. if record of Relationshiptopatient is added or updated = success. else = failure</returns>  
        public Relationshiptopatient AddUpdateRelationshiptopatient(Relationshiptopatient relationshiptopatient)
        {
            var relationData = this.uow.GenericRepository<Relationshiptopatient>().Table().Where(x => x.RSPCode == relationshiptopatient.RSPCode).FirstOrDefault();

            if (relationData == null)
            {
                relationData = new Relationshiptopatient();

                relationData.RSPCode = relationshiptopatient.RSPCode;
                relationData.RSPDescription = relationshiptopatient.RSPDescription;
                relationData.OrderNo = relationshiptopatient.OrderNo;
                relationData.IsActive = true;
                relationData.CreatedDate = DateTime.Now;
                relationData.CreatedBy = "User";

                this.uow.GenericRepository<Relationshiptopatient>().Insert(relationData);
            }
            else
            {
                relationData.RSPDescription = relationshiptopatient.RSPDescription;
                relationData.OrderNo = relationshiptopatient.OrderNo;
                relationData.IsActive = true;
                relationData.ModifiedDate = DateTime.Now;
                relationData.ModifiedBy = "User";

                this.uow.GenericRepository<Relationshiptopatient>().Update(relationData);
            }
            this.uow.Save();
            relationshiptopatient.RSPId = relationData.RSPId;

            return relationshiptopatient;
        }

        #endregion

        #region IdentificationIdType

        ///// <summary>
        ///// Get All available IdentificationTypes for patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<IdentificationIdType>. if Collection of IdentificationTypes = success. else = failure</returns>
        public List<IdentificationIdType> GetAllIdentificationTypes()
        {
            var Ids = this.uow.GenericRepository<IdentificationIdType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return Ids;
        }

        //// <summary>
        ///// Get Identification Id Type by ID
        ///// </summary>
        ///// <param>int iDTID</param>
        ///// <returns>IdentificationIdType. if record of IdentificationIdType for given Id = success. else = failure</returns>
        public IdentificationIdType GetIdentificationIdTypebyID(int iDTID)
        {
            var identificationRecord = this.uow.GenericRepository<IdentificationIdType>().Table().Where(x => x.IDTId == iDTID).FirstOrDefault();

            return identificationRecord;
        }

        //// <summary>
        ///// Delete Identification Id Type by ID
        ///// </summary>
        ///// <param>int iDTID</param>
        ///// <returns>IdentificationIdType. if record of Identification Id Type Deleted for Given ID = success. else = failure</returns>
        public IdentificationIdType DeleteIdentificationIdTypeRecord(int iDTID)
        {
            var identificationRecord = this.uow.GenericRepository<IdentificationIdType>().Table().Where(x => x.IDTId == iDTID).FirstOrDefault();

            if (identificationRecord != null)
            {
                identificationRecord.IsActive = false;

                this.uow.GenericRepository<IdentificationIdType>().Update(identificationRecord);
                this.uow.Save();
            }

            return identificationRecord;
        }

        //// <summary>
        ///// Add or Update Identification Id Type
        ///// </summary>
        ///// <param>IdentificationIdType identificationIdType</param>
        ///// <returns>IdentificationIdType. if record of Identification Id Type is added or updated = success. else = failure</returns>  
        public IdentificationIdType AddUpdateIdentificationIdType(IdentificationIdType identificationIdType)
        {
            var identificationRecord = this.uow.GenericRepository<IdentificationIdType>().Table().Where(x => x.IDTCode == identificationIdType.IDTCode).FirstOrDefault();

            if (identificationRecord == null)
            {
                identificationRecord = new IdentificationIdType();

                identificationRecord.IDTCode = identificationIdType.IDTCode;
                identificationRecord.IDTDescription = identificationIdType.IDTDescription;
                identificationRecord.OrderNo = identificationIdType.OrderNo;
                identificationRecord.IsActive = true;
                identificationRecord.CreatedDate = DateTime.Now;
                identificationRecord.CreatedBy = "User";

                this.uow.GenericRepository<IdentificationIdType>().Insert(identificationRecord);
            }
            else
            {
                identificationRecord.IDTDescription = identificationIdType.IDTDescription;
                identificationRecord.OrderNo = identificationIdType.OrderNo;
                identificationRecord.IsActive = true;
                identificationRecord.ModifiedDate = DateTime.Now;
                identificationRecord.ModifiedBy = "User";

                this.uow.GenericRepository<IdentificationIdType>().Update(identificationRecord);
            }
            this.uow.Save();
            identificationIdType.IDTId = identificationRecord.IDTId;

            return identificationIdType;
        }

        #endregion

        #region PatientCategory

        ///// <summary>
        ///// Get All PatientCategories
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientCategory>. if Collection of PatientCategory = success. else = failure</returns>
        public List<PatientCategory> GetPatientCategories()
        {
            var categories = this.uow.GenericRepository<PatientCategory>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return categories;
        }

        //// <summary>
        ///// Get PatientCategory by ID
        ///// </summary>
        ///// <param>int patientCategoryID</param>
        ///// <returns>PatientCategory. if record of PatientCategory for given Id = success. else = failure</returns>
        public PatientCategory GetPatientCategorybyID(int patientCategoryID)
        {
            var patientCategoryRecord = this.uow.GenericRepository<PatientCategory>().Table().Where(x => x.PatientCategoryID == patientCategoryID).FirstOrDefault();

            return patientCategoryRecord;
        }

        //// <summary>
        ///// Delete PatientCategory by ID
        ///// </summary>
        ///// <param>int patientCategoryID</param>
        ///// <returns>PatientCategory. if record of PatientCategory Deleted for Given ID = success. else = failure</returns>
        public PatientCategory DeletePatientCategoryRecord(int patientCategoryID)
        {
            var patientCategoryRecord = this.uow.GenericRepository<PatientCategory>().Table().Where(x => x.PatientCategoryID == patientCategoryID).FirstOrDefault();

            if (patientCategoryRecord != null)
            {
                patientCategoryRecord.IsActive = false;

                this.uow.GenericRepository<PatientCategory>().Update(patientCategoryRecord);
                this.uow.Save();
            }

            return patientCategoryRecord;
        }

        //// <summary>
        ///// Add or Update PatientCategory
        ///// </summary>
        ///// <param>PatientCategory patientCategory</param>
        ///// <returns>PatientCategory. if record of PatientCategory is added or updated = success. else = failure</returns>  
        public PatientCategory AddUpdatePatientCategory(PatientCategory patientCategory)
        {
            var patientCategoryRecord = this.uow.GenericRepository<PatientCategory>().Table().Where(x => x.PatientCategoryCode == patientCategory.PatientCategoryCode).FirstOrDefault();

            if (patientCategoryRecord == null)
            {
                patientCategoryRecord = new PatientCategory();

                patientCategoryRecord.PatientCategoryCode = patientCategory.PatientCategoryCode;
                patientCategoryRecord.PatientCategoryDesc = patientCategory.PatientCategoryDesc;
                patientCategoryRecord.OrderNo = patientCategory.OrderNo;
                patientCategoryRecord.IsActive = true;
                patientCategoryRecord.Createddate = DateTime.Now;
                patientCategoryRecord.CreatedBy = "User";

                this.uow.GenericRepository<PatientCategory>().Insert(patientCategoryRecord);
            }
            else
            {
                patientCategoryRecord.PatientCategoryDesc = patientCategory.PatientCategoryDesc;
                patientCategoryRecord.OrderNo = patientCategory.OrderNo;
                patientCategoryRecord.IsActive = true;
                patientCategoryRecord.ModifiedDate = DateTime.Now;
                patientCategoryRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientCategory>().Update(patientCategoryRecord);
            }
            this.uow.Save();
            patientCategory.PatientCategoryID = patientCategoryRecord.PatientCategoryID;

            return patientCategory;
        }

        #endregion

        #region PatientType

        ///// <summary>
        ///// Get All PatientTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientType>. if Collection of PatientTypes = success. else = failure</returns>
        public List<PatientType> GetPatientTypes()
        {
            var types = this.uow.GenericRepository<PatientType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return types;
        }

        //// <summary>
        ///// Get PatientType by ID
        ///// </summary>
        ///// <param>int patientTypeID</param>
        ///// <returns>PatientType. if record of PatientType for given Id = success. else = failure</returns>
        public PatientType GetPatientTypebyID(int patientTypeID)
        {
            var patientTypeRecord = this.uow.GenericRepository<PatientType>().Table().Where(x => x.PatientTypeID == patientTypeID).FirstOrDefault();

            return patientTypeRecord;
        }

        //// <summary>
        ///// Delete PatientType by ID
        ///// </summary>
        ///// <param>int patientTypeID</param>
        ///// <returns>PatientType. if record of PatientType Deleted for Given ID = success. else = failure</returns>
        public PatientType DeletePatientTypeRecord(int patientTypeID)
        {
            var patientTypeRecord = this.uow.GenericRepository<PatientType>().Table().Where(x => x.PatientTypeID == patientTypeID).FirstOrDefault();

            if (patientTypeRecord != null)
            {
                patientTypeRecord.IsActive = false;

                this.uow.GenericRepository<PatientType>().Update(patientTypeRecord);
                this.uow.Save();
            }

            return patientTypeRecord;
        }

        //// <summary>
        ///// Add or Update PatientType
        ///// </summary>
        ///// <param>PatientType patientType</param>
        ///// <returns>PatientType. if record of PatientType is added or updated = success. else = failure</returns>  
        public PatientType AddUpdatePatientType(PatientType patientType)
        {
            var patientTypeRecord = this.uow.GenericRepository<PatientType>().Table().Where(x => x.PatientTypeCode == patientType.PatientTypeCode).FirstOrDefault();

            if (patientTypeRecord == null)
            {
                patientTypeRecord = new PatientType();

                patientTypeRecord.PatientTypeCode = patientType.PatientTypeCode;
                patientTypeRecord.PatientTypeDesc = patientType.PatientTypeDesc;
                patientTypeRecord.OrderNo = patientType.OrderNo;
                patientTypeRecord.IsActive = true;
                patientTypeRecord.Createddate = DateTime.Now;
                patientTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<PatientType>().Insert(patientTypeRecord);
            }
            else
            {
                patientTypeRecord.PatientTypeDesc = patientType.PatientTypeDesc;
                patientTypeRecord.OrderNo = patientType.OrderNo;
                patientTypeRecord.IsActive = true;
                patientTypeRecord.ModifiedDate = DateTime.Now;
                patientTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientType>().Update(patientTypeRecord);
            }
            this.uow.Save();
            patientType.PatientTypeID = patientTypeRecord.PatientTypeID;

            return patientType;
        }

        #endregion

        #region MaritalStatus

        ///// <summary>
        ///// Get All Marital Statuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MaritalStatus>. if Collection of Marital Status = success. else = failure</returns>
        public List<MaritalStatus> GetMaritalStatuses()
        {
            var maritalStatuses = this.uow.GenericRepository<MaritalStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return maritalStatuses;
        }

        //// <summary>
        ///// Get Marital Status by ID
        ///// </summary>
        ///// <param>int maritalStatusID</param>
        ///// <returns>MaritalStatus. if record of Marital Status for given Id = success. else = failure</returns>
        public MaritalStatus GetMaritalStatusbyID(int maritalStatusID)
        {
            var maritalStatusRecord = this.uow.GenericRepository<MaritalStatus>().Table().Where(x => x.MaritalStatusID == maritalStatusID).FirstOrDefault();

            return maritalStatusRecord;
        }

        //// <summary>
        ///// Delete Marital Status by ID
        ///// </summary>
        ///// <param>int maritalStatusID</param>
        ///// <returns>MaritalStatus. if record of MaritalStatus Deleted for Given ID = success. else = failure</returns>
        public MaritalStatus DeleteMaritalStatusRecord(int maritalStatusID)
        {
            var maritalStatusRecord = this.uow.GenericRepository<MaritalStatus>().Table().Where(x => x.MaritalStatusID == maritalStatusID).FirstOrDefault();

            if (maritalStatusRecord != null)
            {
                maritalStatusRecord.IsActive = false;

                this.uow.GenericRepository<MaritalStatus>().Update(maritalStatusRecord);
                this.uow.Save();
            }

            return maritalStatusRecord;
        }

        //// <summary>
        ///// Add or Update MaritalStatus
        ///// </summary>
        ///// <param>MaritalStatus maritalStatus</param>
        ///// <returns>MaritalStatus. if record of MaritalStatus is added or updated = success. else = failure</returns>  
        public MaritalStatus AddUpdateMaritalStatus(MaritalStatus maritalStatus)
        {
            var maritalStatusRecord = this.uow.GenericRepository<MaritalStatus>().Table().Where(x => x.MaritalStatusCode == maritalStatus.MaritalStatusCode).FirstOrDefault();

            if (maritalStatusRecord == null)
            {
                maritalStatusRecord = new MaritalStatus();

                maritalStatusRecord.MaritalStatusCode = maritalStatus.MaritalStatusCode;
                maritalStatusRecord.MaritalStatusDesc = maritalStatus.MaritalStatusDesc;
                maritalStatusRecord.OrderNo = maritalStatus.OrderNo;
                maritalStatusRecord.IsActive = true;
                maritalStatusRecord.Createddate = DateTime.Now;
                maritalStatusRecord.CreatedBy = "User";

                this.uow.GenericRepository<MaritalStatus>().Insert(maritalStatusRecord);
            }
            else
            {
                maritalStatusRecord.MaritalStatusDesc = maritalStatus.MaritalStatusDesc;
                maritalStatusRecord.OrderNo = maritalStatus.OrderNo;
                maritalStatusRecord.IsActive = true;
                maritalStatusRecord.ModifiedDate = DateTime.Now;
                maritalStatusRecord.ModifiedBy = "User";

                this.uow.GenericRepository<MaritalStatus>().Update(maritalStatusRecord);
            }
            this.uow.Save();
            maritalStatus.MaritalStatusID = maritalStatusRecord.MaritalStatusID;

            return maritalStatus;
        }

        #endregion

        #region ContactType

        ///// <summary>
        ///// Get All Contact Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ContactType>. if Collection of Contact Types = success. else = failure</returns>
        public List<ContactType> GetContactTypes()
        {
            var contactTypes = this.uow.GenericRepository<ContactType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return contactTypes;
        }

        //// <summary>
        ///// Get Contact Type by ID
        ///// </summary>
        ///// <param>int contactTypeID</param>
        ///// <returns>ContactType. if record of Contact Type for given Id = success. else = failure</returns>
        public ContactType GetContactTypebyID(int contactTypeID)
        {
            var contactTypeRecord = this.uow.GenericRepository<ContactType>().Table().Where(x => x.ContactTypeId == contactTypeID).FirstOrDefault();

            return contactTypeRecord;
        }

        //// <summary>
        ///// Delete Contact Type by ID
        ///// </summary>
        ///// <param>int contactTypeID</param>
        ///// <returns>ContactType. if record of Contact Type Deleted for Given ID = success. else = failure</returns>
        public ContactType DeleteContactTypeRecord(int contactTypeID)
        {
            var contactTypeRecord = this.uow.GenericRepository<ContactType>().Table().Where(x => x.ContactTypeId == contactTypeID).FirstOrDefault();

            if (contactTypeRecord != null)
            {
                contactTypeRecord.IsActive = false;

                this.uow.GenericRepository<ContactType>().Update(contactTypeRecord);
                this.uow.Save();
            }

            return contactTypeRecord;
        }

        //// <summary>
        ///// Add or Update Contact Type
        ///// </summary>
        ///// <param>ContactType contactType</param>
        ///// <returns>ContactType. if record of Contact Type is added or updated = success. else = failure</returns>  
        public ContactType AddUpdateContactType(ContactType contactType)
        {
            var contactTypeRecord = this.uow.GenericRepository<ContactType>().Table().Where(x => x.ContactTypeCode == contactType.ContactTypeCode).FirstOrDefault();

            if (contactTypeRecord == null)
            {
                contactTypeRecord = new ContactType();

                contactTypeRecord.ContactTypeCode = contactType.ContactTypeCode;
                contactTypeRecord.ContactTypeDesc = contactType.ContactTypeDesc;
                contactTypeRecord.OrderNo = contactType.OrderNo;
                contactTypeRecord.IsActive = true;
                contactTypeRecord.Createddate = DateTime.Now;
                contactTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<ContactType>().Insert(contactTypeRecord);
            }
            else
            {
                contactTypeRecord.ContactTypeDesc = contactType.ContactTypeDesc;
                contactTypeRecord.OrderNo = contactType.OrderNo;
                contactTypeRecord.IsActive = true;
                contactTypeRecord.ModifiedDate = DateTime.Now;
                contactTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ContactType>().Update(contactTypeRecord);
            }
            this.uow.Save();
            contactType.ContactTypeId = contactTypeRecord.ContactTypeId;

            return contactType;
        }

        #endregion

        #region Religion

        ///// <summary>
        ///// Get All Religions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Religion>. if Collection of Religion = success. else = failure</returns>
        public List<Religion> GetReligions()
        {
            var religions = this.uow.GenericRepository<Religion>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return religions;
        }

        //// <summary>
        ///// Get Religion by ID
        ///// </summary>
        ///// <param>int religionID</param>
        ///// <returns>Religion. if record of Religion for given Id = success. else = failure</returns>
        public Religion GetReligionbyID(int religionID)
        {
            var religionRecord = this.uow.GenericRepository<Religion>().Table().Where(x => x.ReligionID == religionID).FirstOrDefault();

            return religionRecord;
        }

        //// <summary>
        ///// Delete Religion by ID
        ///// </summary>
        ///// <param>int religionID</param>
        ///// <returns>Religion. if record of Religion Deleted for Given ID = success. else = failure</returns>
        public Religion DeleteReligionRecord(int religionID)
        {
            var religionRecord = this.uow.GenericRepository<Religion>().Table().Where(x => x.ReligionID == religionID).FirstOrDefault();

            if (religionRecord != null)
            {
                religionRecord.IsActive = false;

                this.uow.GenericRepository<Religion>().Update(religionRecord);
                this.uow.Save();
            }

            return religionRecord;
        }

        //// <summary>
        ///// Add or Update religion
        ///// </summary>
        ///// <param>Religion religion</param>
        ///// <returns>Religion. if record of Religion is added or updated = success. else = failure</returns>  
        public Religion AddUpdateReligion(Religion religion)
        {
            var religionRecord = this.uow.GenericRepository<Religion>().Table().Where(x => x.ReligionCode == religion.ReligionCode).FirstOrDefault();

            if (religionRecord == null)
            {
                religionRecord = new Religion();

                religionRecord.ReligionCode = religion.ReligionCode;
                religionRecord.ReligionDesc = religion.ReligionDesc;
                religionRecord.OrderNo = religion.OrderNo;
                religionRecord.IsActive = true;
                religionRecord.Createddate = DateTime.Now;
                religionRecord.CreatedBy = "User";

                this.uow.GenericRepository<Religion>().Insert(religionRecord);
            }
            else
            {
                religionRecord.ReligionDesc = religion.ReligionDesc;
                religionRecord.OrderNo = religion.OrderNo;
                religionRecord.IsActive = true;
                religionRecord.ModifiedDate = DateTime.Now;
                religionRecord.ModifiedBy = "User";

                this.uow.GenericRepository<Religion>().Update(religionRecord);
            }
            this.uow.Save();
            religion.ReligionID = religionRecord.ReligionID;

            return religion;
        }

        #endregion

        #region Race

        ///// <summary>
        ///// Get All Races
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Race>. if Collection of Race = success. else = failure</returns>
        public List<Race> GetRaces()
        {
            var races = this.uow.GenericRepository<Race>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return races;
        }

        //// <summary>
        ///// Get Race by ID
        ///// </summary>
        ///// <param>int raceID</param>
        ///// <returns>Race. if record of Race for given Id = success. else = failure</returns>
        public Race GetRacebyID(int raceID)
        {
            var raceRecord = this.uow.GenericRepository<Race>().Table().Where(x => x.RaceID == raceID).FirstOrDefault();

            return raceRecord;
        }

        //// <summary>
        ///// Delete Race by ID
        ///// </summary>
        ///// <param>int raceID</param>
        ///// <returns>Race. if record of Race Deleted for Given ID = success. else = failure</returns>
        public Race DeleteRaceRecord(int raceID)
        {
            var raceRecord = this.uow.GenericRepository<Race>().Table().Where(x => x.RaceID == raceID).FirstOrDefault();

            if (raceRecord != null)
            {
                raceRecord.IsActive = false;

                this.uow.GenericRepository<Race>().Update(raceRecord);
                this.uow.Save();
            }

            return raceRecord;
        }

        //// <summary>
        ///// Add or Update race
        ///// </summary>
        ///// <param>Race race</param>
        ///// <returns>Race. if record of Race is added or updated = success. else = failure</returns>  
        public Race AddUpdateRace(Race race)
        {
            var raceRecord = this.uow.GenericRepository<Race>().Table().Where(x => x.RaceCode == race.RaceCode).FirstOrDefault();

            if (raceRecord == null)
            {
                raceRecord = new Race();

                raceRecord.RaceCode = race.RaceCode;
                raceRecord.RaceDesc = race.RaceDesc;
                raceRecord.OrderNo = race.OrderNo;
                raceRecord.IsActive = true;
                raceRecord.Createddate = DateTime.Now;
                raceRecord.CreatedBy = "User";

                this.uow.GenericRepository<Race>().Insert(raceRecord);
            }
            else
            {
                raceRecord.RaceDesc = race.RaceDesc;
                raceRecord.OrderNo = race.OrderNo;
                raceRecord.IsActive = true;
                raceRecord.ModifiedDate = DateTime.Now;
                raceRecord.ModifiedBy = "User";

                this.uow.GenericRepository<Race>().Update(raceRecord);
            }
            this.uow.Save();
            race.RaceID = raceRecord.RaceID;

            return race;
        }

        #endregion

        #region Family History Status Master

        ///// <summary>
        ///// Get All Family History Status Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FamilyHistoryStatusMaster>. if Collection of Family History Status Master = success. else = failure</returns>
        public List<FamilyHistoryStatusMaster> GetFamilyHistoryStatusMasterList()
        {
            var familyHistoryStatusMasters = this.uow.GenericRepository<FamilyHistoryStatusMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return familyHistoryStatusMasters;
        }

        ///// <summary>
        ///// Get Family History Status Master by Id
        ///// </summary>
        ///// <param>int familyHistoryStatusId</param>
        ///// <returns>FamilyHistoryStatusMaster. if Family History Status Master record by Id = success. else = failure</returns>
        public FamilyHistoryStatusMaster GetFamilyHistoryStatusMasterbyId(int familyHistoryStatusId)
        {
            var familyHistoryStatusMaster = this.uow.GenericRepository<FamilyHistoryStatusMaster>().Table().Where(x => x.FamilyHistoryStatusID == familyHistoryStatusId).FirstOrDefault();
            return familyHistoryStatusMaster;
        }

        ///// <summary>
        ///// Delete Family History Status Master Record by Id
        ///// </summary>
        ///// <param>int familyHistoryStatusId</param>
        ///// <returns>FamilyHistoryStatusMaster. if Family History Status Master record deleted for given Id = success. else = failure</returns>
        public FamilyHistoryStatusMaster DeleteFamilyHistoryStatusMasterRecord(int familyHistoryStatusId)
        {
            var familyHistoryStatusMaster = this.uow.GenericRepository<FamilyHistoryStatusMaster>().Table().Where(x => x.FamilyHistoryStatusID == familyHistoryStatusId).FirstOrDefault();

            if (familyHistoryStatusMaster != null)
            {
                familyHistoryStatusMaster.IsActive = false;
                this.uow.GenericRepository<FamilyHistoryStatusMaster>().Update(familyHistoryStatusMaster);
                this.uow.Save();
            }

            return familyHistoryStatusMaster;
        }

        //// <summary>
        ///// Add or Update Family History Status Master
        ///// </summary>
        ///// <param>FamilyHistoryStatusMaster familyHistoryStatusMaster</param>
        ///// <returns>FamilyHistoryStatusMaster. if record of Family History Status Master is added or updated = success. else = failure</returns>  
        public FamilyHistoryStatusMaster AddUpdateFamilyHistoryStatusMaster(FamilyHistoryStatusMaster familyHistoryStatusMaster)
        {
            var familyHistoryStatusMasterData = this.uow.GenericRepository<FamilyHistoryStatusMaster>().Table().Where(x => x.FamilyHistoryStatusCode == familyHistoryStatusMaster.FamilyHistoryStatusCode).FirstOrDefault();

            if (familyHistoryStatusMasterData == null)
            {
                familyHistoryStatusMasterData = new FamilyHistoryStatusMaster();

                familyHistoryStatusMasterData.FamilyHistoryStatusCode = familyHistoryStatusMaster.FamilyHistoryStatusCode;
                familyHistoryStatusMasterData.FamilyHistoryStatusDesc = familyHistoryStatusMaster.FamilyHistoryStatusDesc;
                familyHistoryStatusMasterData.OrderNo = familyHistoryStatusMaster.OrderNo;
                familyHistoryStatusMasterData.IsActive = true;
                familyHistoryStatusMasterData.Createddate = DateTime.Now;
                familyHistoryStatusMasterData.CreatedBy = "User";

                this.uow.GenericRepository<FamilyHistoryStatusMaster>().Insert(familyHistoryStatusMasterData);
            }
            else
            {
                familyHistoryStatusMasterData.FamilyHistoryStatusDesc = familyHistoryStatusMaster.FamilyHistoryStatusDesc;
                familyHistoryStatusMasterData.OrderNo = familyHistoryStatusMaster.OrderNo;
                familyHistoryStatusMasterData.IsActive = true;
                familyHistoryStatusMasterData.ModifiedDate = DateTime.Now;
                familyHistoryStatusMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<FamilyHistoryStatusMaster>().Update(familyHistoryStatusMasterData);
            }
            this.uow.Save();
            familyHistoryStatusMaster.FamilyHistoryStatusID = familyHistoryStatusMasterData.FamilyHistoryStatusID;

            return familyHistoryStatusMaster;
        }

        #endregion

        #region BloodGroup

        ///// <summary>
        ///// Get All BloodGroups
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BloodGroup>. if Collection of BloodGroups = success. else = failure</returns>
        public List<BloodGroup> GetAllBloodGroups()
        {
            var bloodGroups = this.uow.GenericRepository<BloodGroup>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return bloodGroups;
        }

        //// <summary>
        ///// Get BloodGroup by ID
        ///// </summary>
        ///// <param>int bloodGroupID</param>
        ///// <returns>BloodGroup. if record of BloodGroup for given Id = success. else = failure</returns>
        public BloodGroup GetBloodGroupbyID(int bloodGroupID)
        {
            var bloodGroupRecord = this.uow.GenericRepository<BloodGroup>().Table().Where(x => x.BloodGroupID == bloodGroupID).FirstOrDefault();

            return bloodGroupRecord;
        }

        //// <summary>
        ///// Delete BloodGroup by ID
        ///// </summary>
        ///// <param>int bloodGroupID</param>
        ///// <returns>BloodGroup. if record of BloodGroup Deleted for Given ID = success. else = failure</returns>
        public BloodGroup DeleteBloodGroupRecord(int bloodGroupID)
        {
            var bloodGroupRecord = this.uow.GenericRepository<BloodGroup>().Table().Where(x => x.BloodGroupID == bloodGroupID).FirstOrDefault();

            if (bloodGroupRecord != null)
            {
                bloodGroupRecord.IsActive = false;

                this.uow.GenericRepository<BloodGroup>().Update(bloodGroupRecord);
                this.uow.Save();
            }

            return bloodGroupRecord;
        }

        //// <summary>
        ///// Add or Update Blood Group
        ///// </summary>
        ///// <param>BloodGroup bloodGroup</param>
        ///// <returns>BloodGroup. if record of BloodGroup is added or updated = success. else = failure</returns>  
        public BloodGroup AddUpdateBloodGroup(BloodGroup bloodGroup)
        {
            var bloodGroupRecord = this.uow.GenericRepository<BloodGroup>().Table().Where(x => x.BloodGroupCode == bloodGroup.BloodGroupCode).FirstOrDefault();

            if (bloodGroupRecord == null)
            {
                bloodGroupRecord = new BloodGroup();

                bloodGroupRecord.BloodGroupCode = bloodGroup.BloodGroupCode;
                bloodGroupRecord.BloodGroupDesc = bloodGroup.BloodGroupDesc;
                bloodGroupRecord.OrderNo = bloodGroup.OrderNo;
                bloodGroupRecord.IsActive = true;
                bloodGroupRecord.Createddate = DateTime.Now;
                bloodGroupRecord.CreatedBy = "User";

                this.uow.GenericRepository<BloodGroup>().Insert(bloodGroupRecord);
            }
            else
            {
                bloodGroupRecord.BloodGroupDesc = bloodGroup.BloodGroupDesc;
                bloodGroupRecord.OrderNo = bloodGroup.OrderNo;
                bloodGroupRecord.IsActive = true;
                bloodGroupRecord.ModifiedDate = DateTime.Now;
                bloodGroupRecord.ModifiedBy = "User";

                this.uow.GenericRepository<BloodGroup>().Update(bloodGroupRecord);
            }
            this.uow.Save();
            bloodGroup.BloodGroupID = bloodGroupRecord.BloodGroupID;

            return bloodGroup;
        }

        #endregion

        #region IllnessType

        ///// <summary>
        ///// Get All Illness Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<IllnessType>. if Collection of IllnessTypes = success. else = failure</returns>
        public List<IllnessType> GetAllIllnessTypes()
        {
            var illnessTypes = this.uow.GenericRepository<IllnessType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return illnessTypes;
        }

        //// <summary>
        ///// Get IllnessType by ID
        ///// </summary>
        ///// <param>int illnessTypeID</param>
        ///// <returns>IllnessType. if record of IllnessType for given Id = success. else = failure</returns>
        public IllnessType GetIllnessTypebyID(int illnessTypeID)
        {
            var illnessTypeRecord = this.uow.GenericRepository<IllnessType>().Table().Where(x => x.IllnessTypeID == illnessTypeID).FirstOrDefault();

            return illnessTypeRecord;
        }

        //// <summary>
        ///// Delete IllnessType by ID
        ///// </summary>
        ///// <param>int illnessTypeID</param>
        ///// <returns>IllnessType. if record of IllnessType Deleted for Given ID = success. else = failure</returns>
        public IllnessType DeleteIllnessTypeRecord(int illnessTypeID)
        {
            var illnessTypeRecord = this.uow.GenericRepository<IllnessType>().Table().Where(x => x.IllnessTypeID == illnessTypeID).FirstOrDefault();

            if (illnessTypeRecord != null)
            {
                illnessTypeRecord.IsActive = false;

                this.uow.GenericRepository<IllnessType>().Update(illnessTypeRecord);
                this.uow.Save();
            }

            return illnessTypeRecord;
        }

        //// <summary>
        ///// Add or Update Illness Type
        ///// </summary>
        ///// <param>IllnessType illnessType</param>
        ///// <returns>IllnessType. if record of IllnessType is added or updated = success. else = failure</returns>  
        public IllnessType AddUpdateIllnessType(IllnessType illnessType)
        {
            var illnessTypeRecord = this.uow.GenericRepository<IllnessType>().Table().Where(x => x.IllnessTypeCode == illnessType.IllnessTypeCode).FirstOrDefault();

            if (illnessTypeRecord == null)
            {
                illnessTypeRecord = new IllnessType();

                illnessTypeRecord.IllnessTypeCode = illnessType.IllnessTypeCode;
                illnessTypeRecord.IllnessTypeDesc = illnessType.IllnessTypeDesc;
                illnessTypeRecord.OrderNo = illnessType.OrderNo;
                illnessTypeRecord.IsActive = true;
                illnessTypeRecord.Createddate = DateTime.Now;
                illnessTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<IllnessType>().Insert(illnessTypeRecord);
            }
            else
            {
                illnessTypeRecord.IllnessTypeDesc = illnessType.IllnessTypeDesc;
                illnessTypeRecord.OrderNo = illnessType.OrderNo;
                illnessTypeRecord.IsActive = true;
                illnessTypeRecord.ModifiedDate = DateTime.Now;
                illnessTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<IllnessType>().Update(illnessTypeRecord);
            }
            this.uow.Save();
            illnessType.IllnessTypeID = illnessTypeRecord.IllnessTypeID;

            return illnessType;
        }

        #endregion

        #region InsuranceType

        ///// <summary>
        ///// Get All Insurance Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<InsuranceType>. if Collection of Insurance Types = success. else = failure</returns>
        public List<InsuranceType> GetAllInsuranceTypes()
        {
            var insuranceTypes = this.uow.GenericRepository<InsuranceType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return insuranceTypes;
        }

        //// <summary>
        ///// Get InsuranceType by ID
        ///// </summary>
        ///// <param>int insuranceTypeID</param>
        ///// <returns>InsuranceType. if record of InsuranceType for given Id = success. else = failure</returns>
        public InsuranceType GetInsuranceTypebyID(int insuranceTypeID)
        {
            var insuranceTypeRecord = this.uow.GenericRepository<InsuranceType>().Table().Where(x => x.InsuranceTypeID == insuranceTypeID).FirstOrDefault();

            return insuranceTypeRecord;
        }

        //// <summary>
        ///// Delete InsuranceType by ID
        ///// </summary>
        ///// <param>int insuranceTypeID</param>
        ///// <returns>InsuranceType. if record of InsuranceType Deleted for Given ID = success. else = failure</returns>
        public InsuranceType DeleteInsuranceTypeRecord(int insuranceTypeID)
        {
            var insuranceTypeRecord = this.uow.GenericRepository<InsuranceType>().Table().Where(x => x.InsuranceTypeID == insuranceTypeID).FirstOrDefault();

            if (insuranceTypeRecord != null)
            {
                insuranceTypeRecord.IsActive = false;

                this.uow.GenericRepository<InsuranceType>().Update(insuranceTypeRecord);
                this.uow.Save();
            }

            return insuranceTypeRecord;
        }

        //// <summary>
        ///// Add or Update Insurance Type
        ///// </summary>
        ///// <param>InsuranceType insuranceType</param>
        ///// <returns>InsuranceType. if record of InsuranceType is added or updated = success. else = failure</returns>  
        public InsuranceType AddUpdateInsuranceType(InsuranceType insuranceType)
        {
            var insuranceTypeRecord = this.uow.GenericRepository<InsuranceType>().Table().Where(x => x.InsuranceTypeCode == insuranceType.InsuranceTypeCode).FirstOrDefault();

            if (insuranceTypeRecord == null)
            {
                insuranceTypeRecord = new InsuranceType();

                insuranceTypeRecord.InsuranceTypeCode = insuranceType.InsuranceTypeCode;
                insuranceTypeRecord.InsuranceTypeDesc = insuranceType.InsuranceTypeDesc;
                insuranceTypeRecord.OrderNo = insuranceType.OrderNo;
                insuranceTypeRecord.IsActive = true;
                insuranceTypeRecord.Createddate = DateTime.Now;
                insuranceTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<InsuranceType>().Insert(insuranceTypeRecord);
            }
            else
            {
                insuranceTypeRecord.InsuranceTypeDesc = insuranceType.InsuranceTypeDesc;
                insuranceTypeRecord.OrderNo = insuranceType.OrderNo;
                insuranceTypeRecord.IsActive = true;
                insuranceTypeRecord.ModifiedDate = DateTime.Now;
                insuranceTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<InsuranceType>().Update(insuranceTypeRecord);
            }
            this.uow.Save();
            insuranceType.InsuranceTypeID = insuranceTypeRecord.InsuranceTypeID;

            return insuranceType;
        }

        #endregion

        #region InsuranceCategory

        ///// <summary>
        ///// Get All Insurance Categories
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<InsuranceCategory>. if Collection of Insurance Categories = success. else = failure</returns>
        public List<InsuranceCategory> GetAllInsuranceCategories()
        {
            var insuranceCategories = this.uow.GenericRepository<InsuranceCategory>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return insuranceCategories;
        }

        //// <summary>
        ///// Get InsuranceCategory by ID
        ///// </summary>
        ///// <param>int insuranceCategoryID</param>
        ///// <returns>InsuranceCategory. if record of InsuranceCategory for given Id = success. else = failure</returns>
        public InsuranceCategory GetInsuranceCategorybyID(int insuranceCategoryID)
        {
            var insuranceCategoryRecord = this.uow.GenericRepository<InsuranceCategory>().Table().Where(x => x.InsuranceCategoryID == insuranceCategoryID).FirstOrDefault();

            return insuranceCategoryRecord;
        }

        //// <summary>
        ///// Delete Insurance Category by ID
        ///// </summary>
        ///// <param>int insuranceCategoryID</param>
        ///// <returns>InsuranceCategory. if record of InsuranceCategory Deleted for Given ID = success. else = failure</returns>
        public InsuranceCategory DeleteInsuranceCategoryRecord(int insuranceCategoryID)
        {
            var insuranceCategoryRecord = this.uow.GenericRepository<InsuranceCategory>().Table().Where(x => x.InsuranceCategoryID == insuranceCategoryID).FirstOrDefault();

            if (insuranceCategoryRecord != null)
            {
                insuranceCategoryRecord.IsActive = false;

                this.uow.GenericRepository<InsuranceCategory>().Update(insuranceCategoryRecord);
                this.uow.Save();
            }

            return insuranceCategoryRecord;
        }

        //// <summary>
        ///// Add or Update Insurance Category
        ///// </summary>
        ///// <param>InsuranceCategory insuranceCategory</param>
        ///// <returns>InsuranceCategory. if record of InsuranceCategory is added or updated = success. else = failure</returns>  
        public InsuranceCategory AddUpdateInsuranceCategory(InsuranceCategory insuranceCategory)
        {
            var insuranceCategoryRecord = this.uow.GenericRepository<InsuranceCategory>().Table().Where(x => x.InsuranceCategoryCode == insuranceCategory.InsuranceCategoryCode).FirstOrDefault();

            if (insuranceCategoryRecord == null)
            {
                insuranceCategoryRecord = new InsuranceCategory();

                insuranceCategoryRecord.InsuranceCategoryCode = insuranceCategory.InsuranceCategoryCode;
                insuranceCategoryRecord.InsuranceCategoryDesc = insuranceCategory.InsuranceCategoryDesc;
                insuranceCategoryRecord.OrderNo = insuranceCategory.OrderNo;
                insuranceCategoryRecord.IsActive = true;
                insuranceCategoryRecord.Createddate = DateTime.Now;
                insuranceCategoryRecord.CreatedBy = "User";

                this.uow.GenericRepository<InsuranceCategory>().Insert(insuranceCategoryRecord);
            }
            else
            {
                insuranceCategoryRecord.InsuranceCategoryDesc = insuranceCategory.InsuranceCategoryDesc;
                insuranceCategoryRecord.OrderNo = insuranceCategory.OrderNo;
                insuranceCategoryRecord.IsActive = true;
                insuranceCategoryRecord.ModifiedDate = DateTime.Now;
                insuranceCategoryRecord.ModifiedBy = "User";

                this.uow.GenericRepository<InsuranceCategory>().Update(insuranceCategoryRecord);
            }
            this.uow.Save();
            insuranceCategory.InsuranceCategoryID = insuranceCategoryRecord.InsuranceCategoryID;

            return insuranceCategory;
        }

        #endregion

        #region Document Type

        ///// <summary>
        ///// Get All Document Type
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DocumentType>. if Collection of Document Types = success. else = failure</returns>
        public List<DocumentType> GetAllDocumentType()
        {
            var documentType = this.uow.GenericRepository<DocumentType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return documentType;
        }

        //// <summary>
        ///// Get Document Type by ID
        ///// </summary>
        ///// <param>int documentTypeID</param>
        ///// <returns>DocumentType. if record of Document Type for given Id = success. else = failure</returns>
        public DocumentType GetDocumentTypebyID(int documentTypeID)
        {
            var documentTypeRecord = this.uow.GenericRepository<DocumentType>().Table()
                                                .Where(x => x.DocumentTypeId == documentTypeID).FirstOrDefault();

            return documentTypeRecord;
        }

        //// <summary>
        ///// Delete Document Type by ID
        ///// </summary>
        ///// <param>int documentTypeID</param>
        ///// <returns>DocumentType. if record of Document Type deleted for given Id = success. else = failure</returns>
        public DocumentType DeleteDocumentTypebyID(int documentTypeID)
        {
            var documentTypeRecord = this.uow.GenericRepository<DocumentType>().Table().Where(x => x.DocumentTypeId == documentTypeID).FirstOrDefault();

            if (documentTypeRecord != null)
            {
                documentTypeRecord.IsActive = false;

                this.uow.GenericRepository<DocumentType>().Update(documentTypeRecord);
                this.uow.Save();
            }

            return documentTypeRecord;
        }

        //// <summary>
        ///// Add or Update Document Type
        ///// </summary>
        ///// <param>DocumentType documentType</param>
        ///// <returns>DocumentType. if record of Document Type is added or updated = success. else = failure</returns>  
        public DocumentType AddUpdateDocumentType(DocumentType documentType)
        {
            var documentTypeRecord = this.uow.GenericRepository<DocumentType>().Table().Where(x => x.DocumentTypeCode == documentType.DocumentTypeCode).FirstOrDefault();

            if (documentTypeRecord == null)
            {
                documentTypeRecord = new DocumentType();

                documentTypeRecord.DocumentTypeCode = documentType.DocumentTypeCode;
                documentTypeRecord.DocumentTypeDescription = documentType.DocumentTypeDescription;
                documentTypeRecord.OrderNo = documentType.OrderNo;
                documentTypeRecord.IsActive = true;
                documentTypeRecord.CreatedDate = DateTime.Now;
                documentTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<DocumentType>().Insert(documentTypeRecord);
            }
            else
            {
                documentTypeRecord.DocumentTypeDescription = documentType.DocumentTypeDescription;
                documentTypeRecord.OrderNo = documentType.OrderNo;
                documentTypeRecord.IsActive = true;
                documentTypeRecord.ModifiedDate = DateTime.Now;
                documentTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<DocumentType>().Update(documentTypeRecord);
            }
            this.uow.Save();
            documentType.DocumentTypeId = documentTypeRecord.DocumentTypeId;

            return documentType;
        }

        #endregion

        #region Radiology Master

        #region Radiology Procedure Requested

        ///// <summary>
        ///// Get All Radiology Procedures Requested
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RadiologyProcedureRequested>. if Collection of Radiology Procedures Requested = success. else = failure</returns>
        public List<RadiologyProcedureRequested> GetAllRadiologyProcedureRequested()
        {
            var radiologyProcedureRequested = this.uow.GenericRepository<RadiologyProcedureRequested>().Table()
                                                .Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return radiologyProcedureRequested;
        }

        //// <summary>
        ///// Get Radiology Procedure Requested by ID
        ///// </summary>
        ///// <param>int radiologyProcedureRequestedID</param>
        ///// <returns>RadiologyProcedureRequested. if record of Radiology Procedure Requested for given Id = success. else = failure</returns>
        public RadiologyProcedureRequested GetRadiologyProcedureRequestedbyID(int radiologyProcedureRequestedID)
        {
            var radiologyProcedureRecord = this.uow.GenericRepository<RadiologyProcedureRequested>().Table()
                                                .Where(x => x.RadiologyProcedureRequestedID == radiologyProcedureRequestedID).FirstOrDefault();

            return radiologyProcedureRecord;
        }

        //// <summary>
        ///// Delete Radiology Procedure Requested by ID
        ///// </summary>
        ///// <param>int radiologyProcedureRequestedID</param>
        ///// <returns>RadiologyProcedureRequested. if record of Radiology Procedure Requested deleted for given Id = success. else = failure</returns>
        public RadiologyProcedureRequested DeleteRadiologyProcedureRequestedRecord(int radiologyProcedureRequestedID)
        {
            var radiologyProcedureRecord = this.uow.GenericRepository<RadiologyProcedureRequested>().Table().Where(x => x.RadiologyProcedureRequestedID == radiologyProcedureRequestedID).FirstOrDefault();

            if (radiologyProcedureRecord != null)
            {
                radiologyProcedureRecord.IsActive = false;

                this.uow.GenericRepository<RadiologyProcedureRequested>().Update(radiologyProcedureRecord);
                this.uow.Save();
            }

            return radiologyProcedureRecord;
        }

        //// <summary>
        ///// Add or Update Radiology Procedure Requested
        ///// </summary>
        ///// <param>RadiologyProcedureRequested radiologyProcedureRequested</param>
        ///// <returns>RadiologyProcedureRequested. if record of RadiologyProcedureRequested is added or updated = success. else = failure</returns>  
        public RadiologyProcedureRequested AddUpdateRadiologyProcedureRequested(RadiologyProcedureRequested radiologyProcedureRequested)
        {
            var radiologyProcedureRecord = this.uow.GenericRepository<RadiologyProcedureRequested>().Table().Where(x => x.RadiologyProcedureRequestedCode == radiologyProcedureRequested.RadiologyProcedureRequestedCode).FirstOrDefault();

            if (radiologyProcedureRecord == null)
            {
                radiologyProcedureRecord = new RadiologyProcedureRequested();

                radiologyProcedureRecord.RadiologyProcedureRequestedCode = radiologyProcedureRequested.RadiologyProcedureRequestedCode;
                radiologyProcedureRecord.RadiologyProcedureRequestedDesc = radiologyProcedureRequested.RadiologyProcedureRequestedDesc;
                radiologyProcedureRecord.OrderNo = radiologyProcedureRequested.OrderNo;
                radiologyProcedureRecord.IsActive = true;
                radiologyProcedureRecord.Createddate = DateTime.Now;
                radiologyProcedureRecord.CreatedBy = "User";

                this.uow.GenericRepository<RadiologyProcedureRequested>().Insert(radiologyProcedureRecord);
            }
            else
            {
                radiologyProcedureRecord.RadiologyProcedureRequestedDesc = radiologyProcedureRequested.RadiologyProcedureRequestedDesc;
                radiologyProcedureRecord.OrderNo = radiologyProcedureRequested.OrderNo;
                radiologyProcedureRecord.IsActive = true;
                radiologyProcedureRecord.ModifiedDate = DateTime.Now;
                radiologyProcedureRecord.ModifiedBy = "User";

                this.uow.GenericRepository<RadiologyProcedureRequested>().Update(radiologyProcedureRecord);
            }
            this.uow.Save();
            radiologyProcedureRequested.RadiologyProcedureRequestedID = radiologyProcedureRecord.RadiologyProcedureRequestedID;

            return radiologyProcedureRequested;
        }

        #endregion

        #region Radiology Type

        ///// <summary>
        ///// Get All Radiology Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RadiologyType>. if Collection of Radiology Types = success. else = failure</returns>
        public List<RadiologyType> GetAllRadiologyType()
        {
            var radiologyType = this.uow.GenericRepository<RadiologyType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return radiologyType;
        }

        //// <summary>
        ///// Get Radiology Type by ID
        ///// </summary>
        ///// <param>int radiologyTypeID</param>
        ///// <returns>RadiologyType. if record of Radiology Type for given Id = success. else = failure</returns>
        public RadiologyType GetRadiologyTypebyID(int radiologyTypeID)
        {
            var radiologyTypeRecord = this.uow.GenericRepository<RadiologyType>().Table()
                                                .Where(x => x.RadiologyTypeID == radiologyTypeID).FirstOrDefault();

            return radiologyTypeRecord;
        }

        //// <summary>
        ///// Delete Radiology Type by ID
        ///// </summary>
        ///// <param>int radiologyTypeID</param>
        ///// <returns>RadiologyType. if record of Radiology Type deleted for given Id = success. else = failure</returns>
        public RadiologyType DeleteRadiologyTypeRecord(int radiologyTypeID)
        {
            var radiologyTypeRecord = this.uow.GenericRepository<RadiologyType>().Table().Where(x => x.RadiologyTypeID == radiologyTypeID).FirstOrDefault();

            if (radiologyTypeRecord != null)
            {
                radiologyTypeRecord.IsActive = false;

                this.uow.GenericRepository<RadiologyType>().Update(radiologyTypeRecord);
                this.uow.Save();
            }

            return radiologyTypeRecord;
        }

        //// <summary>
        ///// Add or Update Radiology Type
        ///// </summary>
        ///// <param>RadiologyType radiologyType</param>
        ///// <returns>RadiologyType. if record of Radiology Type is added or updated = success. else = failure</returns>  
        public RadiologyType AddUpdateRadiologyType(RadiologyType radiologyType)
        {
            var radiologyTypeRecord = this.uow.GenericRepository<RadiologyType>().Table().Where(x => x.RadiologyTypeCode == radiologyType.RadiologyTypeCode).FirstOrDefault();

            if (radiologyTypeRecord == null)
            {
                radiologyTypeRecord = new RadiologyType();

                radiologyTypeRecord.RadiologyTypeCode = radiologyType.RadiologyTypeCode;
                radiologyTypeRecord.RadiologyTypeDesc = radiologyType.RadiologyTypeDesc;
                radiologyTypeRecord.OrderNo = radiologyType.OrderNo;
                radiologyTypeRecord.IsActive = true;
                radiologyTypeRecord.Createddate = DateTime.Now;
                radiologyTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<RadiologyType>().Insert(radiologyTypeRecord);
            }
            else
            {
                radiologyTypeRecord.RadiologyTypeDesc = radiologyType.RadiologyTypeDesc;
                radiologyTypeRecord.OrderNo = radiologyType.OrderNo;
                radiologyTypeRecord.IsActive = true;
                radiologyTypeRecord.ModifiedDate = DateTime.Now;
                radiologyTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<RadiologyType>().Update(radiologyTypeRecord);
            }
            this.uow.Save();
            radiologyType.RadiologyTypeID = radiologyTypeRecord.RadiologyTypeID;

            return radiologyType;
        }

        #endregion

        #region Referred Lab

        ///// <summary>
        ///// Get All Referred Lab
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ReferredLab>. if Collection of Referred Labs = success. else = failure</returns>
        public List<ReferredLab> GetAllReferredLab()
        {
            var referredLab = this.uow.GenericRepository<ReferredLab>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return referredLab;
        }

        //// <summary>
        ///// Get Referred Lab by ID
        ///// </summary>
        ///// <param>int referredLabID</param>
        ///// <returns>ReferredLab. if record of Referred Lab for given Id = success. else = failure</returns>
        public ReferredLab GetReferredLabbyID(int referredLabID)
        {
            var referredLabRecord = this.uow.GenericRepository<ReferredLab>().Table()
                                                .Where(x => x.ReferredLabID == referredLabID).FirstOrDefault();

            return referredLabRecord;
        }

        //// <summary>
        ///// Delete Referred Lab by ID
        ///// </summary>
        ///// <param>int referredLabID</param>
        ///// <returns>ReferredLab. if record of Referred Lab deleted for given Id = success. else = failure</returns>
        public ReferredLab DeleteReferredLabRecord(int referredLabID)
        {
            var referredLabRecord = this.uow.GenericRepository<ReferredLab>().Table().Where(x => x.ReferredLabID == referredLabID).FirstOrDefault();

            if (referredLabRecord != null)
            {
                referredLabRecord.IsActive = false;

                this.uow.GenericRepository<ReferredLab>().Update(referredLabRecord);
                this.uow.Save();
            }

            return referredLabRecord;
        }

        //// <summary>
        ///// Add or Update Referred Lab
        ///// </summary>
        ///// <param>ReferredLab referredLab</param>
        ///// <returns>ReferredLab. if record of Referred Lab is added or updated = success. else = failure</returns>  
        public ReferredLab AddUpdateReferredLab(ReferredLab referredLab)
        {
            var referredLabRecord = this.uow.GenericRepository<ReferredLab>().Table().Where(x => x.ReferredLabCode == referredLab.ReferredLabCode).FirstOrDefault();

            if (referredLabRecord == null)
            {
                referredLabRecord = new ReferredLab();

                referredLabRecord.ReferredLabCode = referredLab.ReferredLabCode;
                referredLabRecord.ReferredLabDesc = referredLab.ReferredLabDesc;
                referredLabRecord.OrderNo = referredLab.OrderNo;
                referredLabRecord.IsActive = true;
                referredLabRecord.Createddate = DateTime.Now;
                referredLabRecord.CreatedBy = "User";

                this.uow.GenericRepository<ReferredLab>().Insert(referredLabRecord);
            }
            else
            {
                referredLabRecord.ReferredLabDesc = referredLab.ReferredLabDesc;
                referredLabRecord.OrderNo = referredLab.OrderNo;
                referredLabRecord.IsActive = true;
                referredLabRecord.ModifiedDate = DateTime.Now;
                referredLabRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ReferredLab>().Update(referredLabRecord);
            }
            this.uow.Save();
            referredLab.ReferredLabID = referredLabRecord.ReferredLabID;

            return referredLab;
        }

        #endregion

        #region Body Section

        ///// <summary>
        ///// Get All Body Section
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BodySection>. if Collection of Body Sections = success. else = failure</returns>
        public List<BodySection> GetAllBodySection()
        {
            var bodySection = this.uow.GenericRepository<BodySection>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return bodySection;
        }

        //// <summary>
        ///// Get Body Section by ID
        ///// </summary>
        ///// <param>int bodySectionID</param>
        ///// <returns>BodySection. if record of Body Section for given Id = success. else = failure</returns>
        public BodySection GetBodySectionbyID(int bodySectionID)
        {
            var bodySectionRecord = this.uow.GenericRepository<BodySection>().Table()
                                                .Where(x => x.BodySectionID == bodySectionID).FirstOrDefault();

            return bodySectionRecord;
        }

        //// <summary>
        ///// Delete Body Section by ID
        ///// </summary>
        ///// <param>int bodySectionID</param>
        ///// <returns>BodySection. if record of Body Section deleted for given Id = success. else = failure</returns>
        public BodySection DeleteBodySectionbyID(int bodySectionID)
        {
            var bodySectionRecord = this.uow.GenericRepository<BodySection>().Table().Where(x => x.BodySectionID == bodySectionID).FirstOrDefault();

            if (bodySectionRecord != null)
            {
                bodySectionRecord.IsActive = false;

                this.uow.GenericRepository<BodySection>().Update(bodySectionRecord);
                this.uow.Save();
            }

            return bodySectionRecord;
        }

        //// <summary>
        ///// Add or Update Body Section
        ///// </summary>
        ///// <param>BodySection bodySection</param>
        ///// <returns>BodySection. if record of Body Section is added or updated = success. else = failure</returns>  
        public BodySection AddUpdateBodySection(BodySection bodySection)
        {
            var bodySectionRecord = this.uow.GenericRepository<BodySection>().Table().Where(x => x.BodySectionCode == bodySection.BodySectionCode).FirstOrDefault();

            if (bodySectionRecord == null)
            {
                bodySectionRecord = new BodySection();

                bodySectionRecord.BodySectionCode = bodySection.BodySectionCode;
                bodySectionRecord.BodySectionDesc = bodySection.BodySectionDesc;
                bodySectionRecord.OrderNo = bodySection.OrderNo;
                bodySectionRecord.IsActive = true;
                bodySectionRecord.Createddate = DateTime.Now;
                bodySectionRecord.CreatedBy = "User";

                this.uow.GenericRepository<BodySection>().Insert(bodySectionRecord);
            }
            else
            {
                bodySectionRecord.BodySectionDesc = bodySection.BodySectionDesc;
                bodySectionRecord.OrderNo = bodySection.OrderNo;
                bodySectionRecord.IsActive = true;
                bodySectionRecord.ModifiedDate = DateTime.Now;
                bodySectionRecord.ModifiedBy = "User";

                this.uow.GenericRepository<BodySection>().Update(bodySectionRecord);
            }
            this.uow.Save();
            bodySection.BodySectionID = bodySectionRecord.BodySectionID;

            return bodySection;
        }

        #endregion

        #region Report Format

        ///// <summary>
        ///// Get All Report Format
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ReportFormat>. if Collection of Report Formats = success. else = failure</returns>
        public List<ReportFormat> GetAllReportFormat()
        {
            var reportFormat = this.uow.GenericRepository<ReportFormat>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return reportFormat;
        }

        //// <summary>
        ///// Get Report Format by ID
        ///// </summary>
        ///// <param>int reportFormatID</param>
        ///// <returns>ReportFormat. if record of Report Format for given Id = success. else = failure</returns>
        public ReportFormat GetReportFormatbyID(int reportFormatID)
        {
            var reportFormatRecord = this.uow.GenericRepository<ReportFormat>().Table()
                                                .Where(x => x.ReportFormatID == reportFormatID).FirstOrDefault();

            return reportFormatRecord;
        }

        //// <summary>
        ///// Delete Report Format by ID
        ///// </summary>
        ///// <param>int reportFormatID</param>
        ///// <returns>ReportFormat. if record of Report Format deleted for given Id = success. else = failure</returns>
        public ReportFormat DeleteReportFormatbyID(int reportFormatID)
        {
            var reportFormatRecord = this.uow.GenericRepository<ReportFormat>().Table().Where(x => x.ReportFormatID == reportFormatID).FirstOrDefault();

            if (reportFormatRecord != null)
            {
                reportFormatRecord.IsActive = false;

                this.uow.GenericRepository<ReportFormat>().Update(reportFormatRecord);
                this.uow.Save();
            }

            return reportFormatRecord;
        }

        //// <summary>
        ///// Add or Update Report Format
        ///// </summary>
        ///// <param>ReportFormat reportFormat</param>
        ///// <returns>ReportFormat. if record of Report Format is added or updated = success. else = failure</returns>  
        public ReportFormat AddUpdateReportFormat(ReportFormat reportFormat)
        {
            var reportFormatRecord = this.uow.GenericRepository<ReportFormat>().Table().Where(x => x.ReportFormatCode == reportFormat.ReportFormatCode).FirstOrDefault();

            if (reportFormatRecord == null)
            {
                reportFormatRecord = new ReportFormat();

                reportFormatRecord.ReportFormatCode = reportFormat.ReportFormatCode;
                reportFormatRecord.ReportFormatDesc = reportFormat.ReportFormatDesc;
                reportFormatRecord.OrderNo = reportFormat.OrderNo;
                reportFormatRecord.IsActive = true;
                reportFormatRecord.Createddate = DateTime.Now;
                reportFormatRecord.CreatedBy = "User";

                this.uow.GenericRepository<ReportFormat>().Insert(reportFormatRecord);
            }
            else
            {
                reportFormatRecord.ReportFormatDesc = reportFormat.ReportFormatDesc;
                reportFormatRecord.OrderNo = reportFormat.OrderNo;
                reportFormatRecord.IsActive = true;
                reportFormatRecord.ModifiedDate = DateTime.Now;
                reportFormatRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ReportFormat>().Update(reportFormatRecord);
            }
            this.uow.Save();
            reportFormat.ReportFormatID = reportFormatRecord.ReportFormatID;

            return reportFormat;
        }

        #endregion

        #endregion

        #region Immunization Master

        #region Body Site

        ///// <summary>
        ///// Get All Body Site
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BodySite>. if Collection of Body Sites = success. else = failure</returns>
        public List<BodySite> GetAllBodySite()
        {
            var bodySite = this.uow.GenericRepository<BodySite>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return bodySite;
        }

        //// <summary>
        ///// Get Body Site by ID
        ///// </summary>
        ///// <param>int bodySiteID</param>
        ///// <returns>BodySite. if record of Body Site for given Id = success. else = failure</returns>
        public BodySite GetBodySitebyID(int bodySiteID)
        {
            var bodySiteRecord = this.uow.GenericRepository<BodySite>().Table()
                                                .Where(x => x.BodySiteID == bodySiteID).FirstOrDefault();

            return bodySiteRecord;
        }

        //// <summary>
        ///// Delete Body Site by ID
        ///// </summary>
        ///// <param>int bodySiteID</param>
        ///// <returns>BodySite. if record of Body Site deleted for given Id = success. else = failure</returns>
        public BodySite DeleteBodySitebyID(int bodySiteID)
        {
            var bodySiteRecord = this.uow.GenericRepository<BodySite>().Table().Where(x => x.BodySiteID == bodySiteID).FirstOrDefault();

            if (bodySiteRecord != null)
            {
                bodySiteRecord.IsActive = false;

                this.uow.GenericRepository<BodySite>().Update(bodySiteRecord);
                this.uow.Save();
            }

            return bodySiteRecord;
        }

        //// <summary>
        ///// Add or Update Body Site
        ///// </summary>
        ///// <param>BodySite bodySite</param>
        ///// <returns>BodySite. if record of Body Site is added or updated = success. else = failure</returns>  
        public BodySite AddUpdateBodySite(BodySite bodySite)
        {
            var bodySiteRecord = this.uow.GenericRepository<BodySite>().Table().Where(x => x.BodySiteCode == bodySite.BodySiteCode).FirstOrDefault();

            if (bodySiteRecord == null)
            {
                bodySiteRecord = new BodySite();

                bodySiteRecord.BodySiteCode = bodySite.BodySiteCode;
                bodySiteRecord.BodySiteDesc = bodySite.BodySiteDesc;
                bodySiteRecord.OrderNo = bodySite.OrderNo;
                bodySiteRecord.IsActive = true;
                bodySiteRecord.Createddate = DateTime.Now;
                bodySiteRecord.CreatedBy = "User";

                this.uow.GenericRepository<BodySite>().Insert(bodySiteRecord);
            }
            else
            {
                bodySiteRecord.BodySiteDesc = bodySite.BodySiteDesc;
                bodySiteRecord.OrderNo = bodySite.OrderNo;
                bodySiteRecord.IsActive = true;
                bodySiteRecord.ModifiedDate = DateTime.Now;
                bodySiteRecord.ModifiedBy = "User";

                this.uow.GenericRepository<BodySite>().Update(bodySiteRecord);
            }
            this.uow.Save();
            bodySite.BodySiteID = bodySiteRecord.BodySiteID;

            return bodySite;
        }

        #endregion

        #endregion

        #endregion

        #region Auto Generating Numbers

        //// <summary>
        ///// Get Auto - generated MR number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated MR number = success. else = failure</returns>
        public string GetMRNo()
        {
            string mRnumber = string.Empty;
            int mNo = 0;

            var getMRCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                               where common.CommonMasterCode.ToLower().Trim() == "mrno"
                               select common).FirstOrDefault();

            if (getMRCommon != null)
            {
                mRnumber = getMRCommon.CurrentIncNo;

                mRnumber = mRnumber.Split(new[] { "MR" }, StringSplitOptions.None)[1];

                mNo = Convert.ToInt32(mRnumber) + 1;
            }
            else
            {
                mRnumber = "0";
            }

            if (mRnumber.Length > 1)
            {
                mRnumber = mNo.ToString();

                if (mNo <= 9) { mRnumber = mRnumber = "MR000000" + mNo.ToString(); }
                else if (mNo <= 99) { mRnumber = "MR00000" + mNo.ToString(); }
                else if (mNo <= 999) { mRnumber = "MR0000" + mNo.ToString(); }
                else if (mNo <= 9999) { mRnumber = "MR000" + mNo.ToString(); }
                else if (mNo <= 99999) { mRnumber = "MR00" + mNo.ToString(); }
                else if (mNo <= 999999) { mRnumber = "MR0" + mNo.ToString(); }
                else { mRnumber = mRnumber = "MR" + mNo.ToString(); }
            }

            return mRnumber;
        }

        //// <summary>
        ///// Get Auto - generated Admission number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Admission number = success. else = failure</returns>
        public string GetAdmissionNo()
        {
            string admnumber = string.Empty;
            int aDMNo = 0;

            var getADMCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                where common.CommonMasterCode.ToLower().Trim() == "admno"
                                select common).FirstOrDefault();

            if (getADMCommon != null)
            {
                admnumber = getADMCommon.CurrentIncNo;

                admnumber = admnumber.Split(new[] { "AD" }, StringSplitOptions.None)[1];

                aDMNo = Convert.ToInt32(admnumber) + 1;
            }
            else
            {
                admnumber = "0";
            }

            if (admnumber.Length > 1)
            {
                admnumber = aDMNo.ToString();

                if (aDMNo <= 9) { admnumber = admnumber = "AD000000" + aDMNo.ToString(); }
                else if (aDMNo <= 99) { admnumber = "AD00000" + aDMNo.ToString(); }
                else if (aDMNo <= 999) { admnumber = "AD0000" + aDMNo.ToString(); }
                else if (aDMNo <= 9999) { admnumber = "AD000" + aDMNo.ToString(); }
                else if (aDMNo <= 99999) { admnumber = "AD00" + aDMNo.ToString(); }
                else if (aDMNo <= 999999) { admnumber = "AD0" + aDMNo.ToString(); }
                else { admnumber = admnumber = "AD" + aDMNo.ToString(); }
            }

            return admnumber;
        }

        //// <summary>
        ///// Get Auto - generated Medication number or (RX No)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Medication number = success. else = failure</returns>
        public string GetMedicationNo()
        {
            string mednumber = string.Empty;
            int rXNo = 0;

            var getRXCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                               where common.CommonMasterCode.ToLower().Trim() == "rxno"
                               select common).FirstOrDefault();

            if (getRXCommon != null)
            {
                mednumber = getRXCommon.CurrentIncNo;

                mednumber = mednumber.Split(new[] { "RX" }, StringSplitOptions.None)[1];

                rXNo = Convert.ToInt32(mednumber) + 1;
            }
            else
            {
                mednumber = "0";
            }

            if (mednumber.Length > 1)
            {
                mednumber = rXNo.ToString();

                if (rXNo <= 9) { mednumber = mednumber = "RX000000" + rXNo.ToString(); }
                else if (rXNo <= 99) { mednumber = "RX00000" + rXNo.ToString(); }
                else if (rXNo <= 999) { mednumber = "RX0000" + rXNo.ToString(); }
                else if (rXNo <= 9999) { mednumber = "RX000" + rXNo.ToString(); }
                else if (rXNo <= 99999) { mednumber = "RX00" + rXNo.ToString(); }
                else if (rXNo <= 999999) { mednumber = "RX0" + rXNo.ToString(); }
                else { mednumber = mednumber = "RX" + rXNo.ToString(); }
            }

            return mednumber;
        }

        //// <summary>
        ///// Get Auto - generated Lab Order number or (LB No)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated LabOrder number = success. else = failure</returns>
        public string GetLabOrderNo()
        {
            string labnumber = string.Empty;
            int lBNo = 0;

            var getLabCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                where common.CommonMasterCode.ToLower().Trim() == "lbno"
                                select common).FirstOrDefault();

            if (getLabCommon != null)
            {
                labnumber = getLabCommon.CurrentIncNo;

                labnumber = labnumber.Split(new[] { "LB" }, StringSplitOptions.None)[1];

                lBNo = Convert.ToInt32(labnumber) + 1;
            }
            else
            {
                labnumber = "0";
            }

            if (labnumber.Length > 1)
            {
                labnumber = lBNo.ToString();

                if (lBNo <= 9) { labnumber = labnumber = "LB000000" + lBNo.ToString(); }
                else if (lBNo <= 99) { labnumber = "LB00000" + lBNo.ToString(); }
                else if (lBNo <= 999) { labnumber = "LB0000" + lBNo.ToString(); }
                else if (lBNo <= 9999) { labnumber = "LB000" + lBNo.ToString(); }
                else if (lBNo <= 99999) { labnumber = "LB00" + lBNo.ToString(); }
                else if (lBNo <= 999999) { labnumber = "LB0" + lBNo.ToString(); }
                else { labnumber = labnumber = "LB" + lBNo.ToString(); }
            }

            return labnumber;
        }

        //// <summary>
        ///// Get Auto - generated Receipt number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Receipt number = success. else = failure</returns>
        public string GetReceiptNo()
        {
            string rcptnumber = string.Empty;
            int rCPTNo = 0;

            var getRCPTCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "recno"
                                 select common).FirstOrDefault();

            if (getRCPTCommon != null)
            {
                rcptnumber = getRCPTCommon.CurrentIncNo;

                rcptnumber = rcptnumber.Split(new[] { "RPT" }, StringSplitOptions.None)[1];

                rCPTNo = Convert.ToInt32(rcptnumber) + 1;
            }
            else
            {
                rcptnumber = "0";
            }

            if (rcptnumber.Length > 1)
            {
                rcptnumber = rCPTNo.ToString();

                if (rCPTNo <= 9) { rcptnumber = rcptnumber = "RPT000000" + rCPTNo.ToString(); }
                else if (rCPTNo <= 99) { rcptnumber = "RPT00000" + rCPTNo.ToString(); }
                else if (rCPTNo <= 999) { rcptnumber = "RPT0000" + rCPTNo.ToString(); }
                else if (rCPTNo <= 9999) { rcptnumber = "RPT000" + rCPTNo.ToString(); }
                else if (rCPTNo <= 99999) { rcptnumber = "RPT00" + rCPTNo.ToString(); }
                else if (rCPTNo <= 999999) { rcptnumber = "RPT0" + rCPTNo.ToString(); }
                else { rcptnumber = rcptnumber = "RPT" + rCPTNo.ToString(); }
            }

            return rcptnumber;
        }

        //// <summary>
        ///// Get Auto - generated Bill number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Bill number = success. else = failure</returns>
        public string GetBillNo()
        {
            string billnumber = string.Empty;
            int bILLNo = 0;

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "bilno"
                                 select common).FirstOrDefault();

            if (getBILLCommon != null)
            {
                billnumber = getBILLCommon.CurrentIncNo;

                billnumber = billnumber.Split(new[] { "BL" }, StringSplitOptions.None)[1];

                bILLNo = Convert.ToInt32(billnumber) + 1;
            }
            else
            {
                billnumber = "0";
            }

            if (billnumber.Length > 1)
            {
                billnumber = bILLNo.ToString();

                if (bILLNo <= 9) { billnumber = billnumber = "BL000000" + bILLNo.ToString(); }
                else if (bILLNo <= 99) { billnumber = "BL00000" + bILLNo.ToString(); }
                else if (bILLNo <= 999) { billnumber = "BL0000" + bILLNo.ToString(); }
                else if (bILLNo <= 9999) { billnumber = "BL000" + bILLNo.ToString(); }
                else if (bILLNo <= 99999) { billnumber = "BL00" + bILLNo.ToString(); }
                else if (bILLNo <= 999999) { billnumber = "BL0" + bILLNo.ToString(); }
                else { billnumber = billnumber = "BL" + bILLNo.ToString(); }
            }

            return billnumber;
        }

        //// <summary>
        ///// Get Auto - generated Appointment number - Appointment no.
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Appointment number = success. else = failure</returns>
        public string GetAppointmentNo()
        {
            string AppointmentNo = string.Empty;
            int APTno = 0;

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "aptno"
                                 select common).FirstOrDefault();

            if (getBILLCommon != null)
            {
                AppointmentNo = getBILLCommon.CurrentIncNo;

                AppointmentNo = AppointmentNo.Split(new[] { "APT" }, StringSplitOptions.None)[1];

                APTno = Convert.ToInt32(AppointmentNo) + 1;
            }
            else
            {
                AppointmentNo = "0";
            }

            if (AppointmentNo.Length > 1)
            {
                AppointmentNo = APTno.ToString();

                if (APTno <= 9) { AppointmentNo = AppointmentNo = "APT000000" + APTno.ToString(); }
                else if (APTno <= 99) { AppointmentNo = "APT00000" + APTno.ToString(); }
                else if (APTno <= 999) { AppointmentNo = "APT0000" + APTno.ToString(); }
                else if (APTno <= 9999) { AppointmentNo = "APT000" + APTno.ToString(); }
                else if (APTno <= 99999) { AppointmentNo = "APT00" + APTno.ToString(); }
                else if (APTno <= 999999) { AppointmentNo = "APT0" + APTno.ToString(); }
                else { AppointmentNo = AppointmentNo = "APT" + APTno.ToString(); }
            }

            return AppointmentNo;
        }

        //// <summary>
        ///// Get Auto - generated Visit Number - Visit no.
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Visit number = success. else = failure</returns>
        public string GetVisitNo()
        {
            string VisitNo = string.Empty;
            int VSTNo = 0;

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "vstno"
                                 select common).FirstOrDefault();

            if (getBILLCommon != null)
            {
                VisitNo = getBILLCommon.CurrentIncNo;

                VisitNo = VisitNo.Split(new[] { "VST" }, StringSplitOptions.None)[1];

                VSTNo = Convert.ToInt32(VisitNo) + 1;
            }
            else
            {
                VisitNo = "0";
            }

            if (VisitNo.Length > 1)
            {
                VisitNo = VSTNo.ToString();

                if (VSTNo <= 9) { VisitNo = VisitNo = "VST000000" + VSTNo.ToString(); }
                else if (VSTNo <= 99) { VisitNo = "VST00000" + VSTNo.ToString(); }
                else if (VSTNo <= 999) { VisitNo = "VST0000" + VSTNo.ToString(); }
                else if (VSTNo <= 9999) { VisitNo = "VST000" + VSTNo.ToString(); }
                else if (VSTNo <= 99999) { VisitNo = "VST00" + VSTNo.ToString(); }
                else if (VSTNo <= 999999) { VisitNo = "VST0" + VSTNo.ToString(); }
                else { VisitNo = VisitNo = "VST" + VSTNo.ToString(); }
            }

            return VisitNo;
        }

        //// <summary>
        ///// Get Auto - generated Employee Number - Employee no.
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Employee number = success. else = failure</returns>
        public string GetEmployeeNo()
        {
            string EmployeeNo = string.Empty;
            int EMPNo = 0;

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "empno"
                                 select common).FirstOrDefault();

            if (getBILLCommon != null)
            {
                EmployeeNo = getBILLCommon.CurrentIncNo;

                EmployeeNo = EmployeeNo.Split(new[] { "EMP" }, StringSplitOptions.None)[1];

                EMPNo = Convert.ToInt32(EmployeeNo) + 1;
            }
            else
            {
                EmployeeNo = "0";
            }

            if (EmployeeNo.Length > 1)
            {
                EmployeeNo = EMPNo.ToString();

                if (EMPNo <= 9) { EmployeeNo = EmployeeNo = "EMP000000" + EMPNo.ToString(); }
                else if (EMPNo <= 99) { EmployeeNo = "EMP00000" + EMPNo.ToString(); }
                else if (EMPNo <= 999) { EmployeeNo = "EMP0000" + EMPNo.ToString(); }
                else if (EMPNo <= 9999) { EmployeeNo = "EMP000" + EMPNo.ToString(); }
                else if (EMPNo <= 99999) { EmployeeNo = "EMP00" + EMPNo.ToString(); }
                else if (EMPNo <= 999999) { EmployeeNo = "EMP0" + EMPNo.ToString(); }
                else { EmployeeNo = EmployeeNo = "EMP" + EMPNo.ToString(); }
            }

            return EmployeeNo;
        }

        ///// <summary>
        ///// Get Appointment Numbers for  Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Appointment Numbers for given searchKey = success. else = failure</returns>
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            List<string> AppointmentNo = new List<string>();

            var AppointmentNos = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (AppointmentNos.Count() > 0)
            {
                foreach (var data in AppointmentNos)
                {
                    if (!AppointmentNo.Contains(data.AppointmentNo))
                    {
                        AppointmentNo.Add(data.AppointmentNo);
                    }
                }
            }

            return AppointmentNo.Distinct().ToList();
        }

        ///// <summary>
        ///// Get Admission Numbers for  Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Admission Numbers for given searchKey = success. else = failure</returns>
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            List<string> admissionNos = new List<string>();

            var admData = this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false).ToList();

            var admNumbers = (from adm in admData
                              where (searchKey == null || (adm.AdmissionNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))
                              select adm
                              ).Select(x => x.AdmissionNo).ToList();

            if (admNumbers.Count() > 0)
            {
                foreach (var data in admNumbers)
                {
                    if (!admissionNos.Contains(data))
                    {
                        admissionNos.Add(data);
                    }
                }
            }

            return admissionNos;
        }

        ///// <summary>
        ///// Get Visit Numbers for  Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Visit Numbers for given searchKey = success. else = failure</returns>
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            List<string> VisitNos = new List<string>();

            var Visitnumbers = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (Visitnumbers.Count() > 0)
            {
                foreach (var data in Visitnumbers)
                {
                    if (!VisitNos.Contains(data.VisitNo))
                    {
                        VisitNos.Add(data.VisitNo);
                    }
                }
            }

            return VisitNos.Distinct().ToList();
        }

        #endregion

        #region Admission Master

        #region Admission Type

        //// <summary>
        ///// Get All AdmissionTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionType>. if Collection of Admission Types = success. else = failure</returns>
        public List<AdmissionType> GetAllAdmissionTypes()
        {
            var admissionTypes = this.uow.GenericRepository<AdmissionType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return admissionTypes;
        }

        //// <summary>
        ///// Get AdmissionType by ID
        ///// </summary>
        ///// <param>int admissionTypeID</param>
        ///// <returns>AdmissionType. if record of Admission Type for Given ID = success. else = failure</returns>
        public AdmissionType GetAdmissionTypebyID(int admissionTypeID)
        {
            var admissionType = this.uow.GenericRepository<AdmissionType>().Table().Where(x => x.AdmissionTypeID == admissionTypeID).FirstOrDefault();

            return admissionType;
        }

        //// <summary>
        ///// Delete AdmissionType by ID
        ///// </summary>
        ///// <param>int admissionTypeID</param>
        ///// <returns>AdmissionType. if record of Admission Type Deleted for Given ID = success. else = failure</returns>
        public AdmissionType DeleteAdmissionTypeRecord(int admissionTypeID)
        {
            var admissionType = this.uow.GenericRepository<AdmissionType>().Table().Where(x => x.AdmissionTypeID == admissionTypeID).FirstOrDefault();

            if (admissionType != null)
            {
                admissionType.IsActive = false;

                this.uow.GenericRepository<AdmissionType>().Update(admissionType);
                this.uow.Save();
            }

            return admissionType;
        }

        //// <summary>
        ///// Add or Update AdmissionTypes
        ///// </summary>
        ///// <param>AdmissionType admissionType</param>
        ///// <returns>AdmissionType. if record of Admission Type is added or updated = success. else = failure</returns>  
        public AdmissionType AddUpdateAdmissionType(AdmissionType admissionType)
        {
            var admission = this.uow.GenericRepository<AdmissionType>().Table().Where(x => x.AdmissionTypeCode == admissionType.AdmissionTypeCode).FirstOrDefault();

            if (admission == null)
            {
                admission = new AdmissionType();

                admission.AdmissionTypeCode = admissionType.AdmissionTypeCode;
                admission.AdmissionTypeDesc = admissionType.AdmissionTypeDesc;
                admission.OrderNo = admissionType.OrderNo;
                admission.IsActive = true;
                admission.CreatedBy = "User";
                admission.Createddate = DateTime.Now;

                this.uow.GenericRepository<AdmissionType>().Insert(admission);
            }
            else
            {
                admission.AdmissionTypeDesc = admissionType.AdmissionTypeDesc;
                admission.OrderNo = admissionType.OrderNo;
                admission.IsActive = true;
                admission.ModifiedBy = "User";
                admission.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<AdmissionType>().Update(admission);

            }
            this.uow.Save();


            return admission;
        }

        #endregion

        #region Admission Status

        //// <summary>
        ///// Get All AdmissionStatus
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionStatus>. if Collection of Admission Status = success. else = failure</returns>
        public List<AdmissionStatus> GetAllAdmissionStatus()
        {
            var admissionStatus = this.uow.GenericRepository<AdmissionStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return admissionStatus;
        }

        //// <summary>
        ///// Get AdmissionStatus by ID
        ///// </summary>
        ///// <param>int admissionStatusID</param>
        ///// <returns>AdmissionStatus. if record of Admission Status for Given ID = success. else = failure</returns>
        public AdmissionStatus GetAdmissionStatusbyID(int admissionStatusID)
        {
            var admissionStatus = this.uow.GenericRepository<AdmissionStatus>().Table().Where(x => x.AdmissionStatusID == admissionStatusID).FirstOrDefault();

            return admissionStatus;
        }

        //// <summary>
        ///// Add or Update AdmissionStatus
        ///// </summary>
        ///// <param>AdmissionStatus admissionStatus</param>
        ///// <returns>AdmissionStatus. if record of Admission Status is added or updated = success. else = failure</returns>  
        public AdmissionStatus AddUpdateAdmissionStatus(AdmissionStatus admissionStatus)
        {
            var admission = this.uow.GenericRepository<AdmissionStatus>().Table().Where(x => x.AdmissionStatusCode == admissionStatus.AdmissionStatusCode).FirstOrDefault();

            if (admission == null)
            {
                admission = new AdmissionStatus();

                admission.AdmissionStatusCode = admissionStatus.AdmissionStatusCode;
                admission.AdmissionStatusDesc = admissionStatus.AdmissionStatusDesc;
                admission.OrderNo = admissionStatus.OrderNo;
                admission.IsActive = true;
                admission.CreatedBy = "User";
                admission.Createddate = DateTime.Now;

                this.uow.GenericRepository<AdmissionStatus>().Insert(admission);
            }
            else
            {
                admission.AdmissionStatusDesc = admissionStatus.AdmissionStatusDesc;
                admission.OrderNo = admissionStatus.OrderNo;
                admission.IsActive = true;
                admission.ModifiedBy = "User";
                admission.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<AdmissionStatus>().Update(admission);

            }
            this.uow.Save();


            return admission;
        }

        //// <summary>
        ///// Delete AdmissionStatus by ID
        ///// </summary>
        ///// <param>int admissionStatusID</param>
        ///// <returns>AdmissionStatus. if record of Admission Status Deleted for Given ID = success. else = failure</returns>
        public AdmissionStatus DeleteAdmissionStatusRecord(int admissionStatusID)
        {
            var admissionStatus = this.uow.GenericRepository<AdmissionStatus>().Table().Where(x => x.AdmissionStatusID == admissionStatusID).FirstOrDefault();

            if (admissionStatus != null)
            {
                admissionStatus.IsActive = false;

                this.uow.GenericRepository<AdmissionStatus>().Update(admissionStatus);
                this.uow.Save();
            }

            return admissionStatus;
        }

        #endregion

        #region Patient Arrival by

        //// <summary>
        ///// Get All Patient Arrival by values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalBy>. if Collection of Patient Arrival By = success. else = failure</returns>
        public List<PatientArrivalBy> GetPatientArrivalbyValues()
        {
            var arrivalbyValues = this.uow.GenericRepository<PatientArrivalBy>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return arrivalbyValues;
        }

        //// <summary>
        ///// Get Patient Arrival by value by ID
        ///// </summary>
        ///// <param>int arrivalbyID</param>
        ///// <returns>PatientArrivalBy. if record of Patient Arrival by value for Given ID = success. else = failure</returns>
        public PatientArrivalBy GetPatientArrivalbyRecordbyID(int arrivalbyID)
        {
            var arrivalbyRecord = this.uow.GenericRepository<PatientArrivalBy>().Table().Where(x => x.PABID == arrivalbyID).FirstOrDefault();

            return arrivalbyRecord;
        }

        //// <summary>
        ///// Add or Update Patient Arrival By Record
        ///// </summary>
        ///// <param>PatientArrivalBy patientArrival</param>
        ///// <returns>PatientArrivalBy. if record of Patient Arrival By is added or updated = success. else = failure</returns>  
        public PatientArrivalBy AddUpdatePatientArrivalbyRecord(PatientArrivalBy patientArrival)
        {
            var arrivalbyRecord = this.uow.GenericRepository<PatientArrivalBy>().Table().Where(x => x.PABCode == patientArrival.PABCode).FirstOrDefault();

            if (arrivalbyRecord == null)
            {
                arrivalbyRecord = new PatientArrivalBy();

                arrivalbyRecord.PABCode = patientArrival.PABCode;
                arrivalbyRecord.PABDesc = patientArrival.PABDesc;
                arrivalbyRecord.OrderNo = patientArrival.OrderNo;
                arrivalbyRecord.IsActive = true;
                arrivalbyRecord.Createddate = DateTime.Now;
                arrivalbyRecord.CreatedBy = "User";

                this.uow.GenericRepository<PatientArrivalBy>().Insert(arrivalbyRecord);
            }
            else
            {
                arrivalbyRecord.PABDesc = patientArrival.PABDesc;
                arrivalbyRecord.OrderNo = patientArrival.OrderNo;
                arrivalbyRecord.IsActive = true;
                arrivalbyRecord.ModifiedDate = DateTime.Now;
                arrivalbyRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientArrivalBy>().Update(arrivalbyRecord);
            }
            this.uow.Save();
            patientArrival.PABID = arrivalbyRecord.PABID;

            return patientArrival;
        }

        //// <summary>
        ///// Delete Patient Arrival By Record by ID
        ///// </summary>
        ///// <param>int arrivalbyID</param>
        ///// <returns>PatientArrivalBy. if record of Patient Arrival By Deleted for Given ID = success. else = failure</returns>
        public PatientArrivalBy DeletePatientArrivalByRecordbyId(int arrivalbyID)
        {
            var arrivalBy = this.uow.GenericRepository<PatientArrivalBy>().Table().Where(x => x.PABID == arrivalbyID).FirstOrDefault();

            if (arrivalBy != null)
            {
                arrivalBy.IsActive = false;

                this.uow.GenericRepository<PatientArrivalBy>().Update(arrivalBy);
                this.uow.Save();
            }

            return arrivalBy;
        }

        #endregion

        #endregion

        #region Triage Master

        #region Allergy Type

        ///// <summary>
        ///// Get All Allergy Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergyType>. if Collection of AllergyType = success. else = failure</returns>
        public List<AllergyType> GetAllAllergyTypes()
        {
            var allergyTypes = this.uow.GenericRepository<AllergyType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return allergyTypes;
        }

        ///// <summary>
        ///// Get Allergy Type by Id
        ///// </summary>
        ///// <param>int allergyTypeId</param>
        ///// <returns>AllergyType. if AllergyType record by Id = success. else = failure</returns>
        public AllergyType GetAllergyTypebyId(int allergyTypeId)
        {
            var allergyType = this.uow.GenericRepository<AllergyType>().Table().Where(x => x.AllergyTypeID == allergyTypeId).FirstOrDefault();
            return allergyType;
        }

        ///// <summary>
        ///// Delete Allergy Type Record by Id
        ///// </summary>
        ///// <param>int allergyTypeId</param>
        ///// <returns>AllergyType. if AllergyType record deleted for given Id = success. else = failure</returns>
        public AllergyType DeleteAllergyTypeRecord(int allergyTypeId)
        {
            var allergyType = this.uow.GenericRepository<AllergyType>().Table().Where(x => x.AllergyTypeID == allergyTypeId).FirstOrDefault();

            if (allergyType != null)
            {
                allergyType.IsActive = false;
                this.uow.GenericRepository<AllergyType>().Update(allergyType);
                this.uow.Save();
            }

            return allergyType;
        }

        //// <summary>
        ///// Add or Update Allergy Type
        ///// </summary>
        ///// <param>AllergyType allergyType</param>
        ///// <returns>AllergyType. if record of Allergy Type is added or updated = success. else = failure</returns>  
        public AllergyType AddUpdateAllergyType(AllergyType allergyType)
        {
            var allergyTypeData = this.uow.GenericRepository<AllergyType>().Table().Where(x => x.AllergyTypeCode == allergyType.AllergyTypeCode).FirstOrDefault();

            if (allergyTypeData == null)
            {
                allergyTypeData = new AllergyType();

                allergyTypeData.AllergyTypeCode = allergyType.AllergyTypeCode;
                allergyTypeData.AllergyTypeDescription = allergyType.AllergyTypeDescription;
                allergyTypeData.OrderNo = allergyType.OrderNo;
                allergyTypeData.IsActive = true;
                allergyTypeData.CreatedDate = DateTime.Now;
                allergyTypeData.CreatedBy = "User";

                this.uow.GenericRepository<AllergyType>().Insert(allergyTypeData);
            }
            else
            {
                allergyTypeData.AllergyTypeDescription = allergyType.AllergyTypeDescription;
                allergyTypeData.OrderNo = allergyType.OrderNo;
                allergyTypeData.IsActive = true;
                allergyTypeData.ModifiedDate = DateTime.Now;
                allergyTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<AllergyType>().Update(allergyTypeData);
            }
            this.uow.Save();
            allergyType.AllergyTypeID = allergyTypeData.AllergyTypeID;

            return allergyType;
        }

        #endregion

        #region Allergy Severity

        ///// <summary>
        ///// Get All Allergy Severities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergySeverity>. if Collection of AllergySeverity = success. else = failure</returns>
        public List<AllergySeverity> GetAllergySeverities()
        {
            var allergySeverities = this.uow.GenericRepository<AllergySeverity>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return allergySeverities;
        }

        ///// <summary>
        ///// Get Allergy Severity by Id
        ///// </summary>
        ///// <param>int allergySeverityId</param>
        ///// <returns>AllergySeverity. if Allergy Severity record by Id = success. else = failure</returns>
        public AllergySeverity GetAllergySeveritybyId(int allergySeverityId)
        {
            var allergySeverity = this.uow.GenericRepository<AllergySeverity>().Table().Where(x => x.AllergySeverityId == allergySeverityId).FirstOrDefault();
            return allergySeverity;
        }

        ///// <summary>
        ///// Delete Allergy Severity Record by Id
        ///// </summary>
        ///// <param>int allergySeverityId</param>
        ///// <returns>AllergySeverity. if Allergy Severity record deleted for given Id = success. else = failure</returns>
        public AllergySeverity DeleteAllergySeverityRecord(int allergySeverityId)
        {
            var allergySeverity = this.uow.GenericRepository<AllergySeverity>().Table().Where(x => x.AllergySeverityId == allergySeverityId).FirstOrDefault();

            if (allergySeverity != null)
            {
                allergySeverity.IsActive = false;
                this.uow.GenericRepository<AllergySeverity>().Update(allergySeverity);
                this.uow.Save();
            }

            return allergySeverity;
        }

        //// <summary>
        ///// Add or Update Allergy Severity
        ///// </summary>
        ///// <param>AllergySeverity allergySeverity</param>
        ///// <returns>AllergySeverity. if record of Allergy Severity is added or updated = success. else = failure</returns>  
        public AllergySeverity AddUpdateAllergySeverity(AllergySeverity allergySeverity)
        {
            var allergySeverityData = this.uow.GenericRepository<AllergySeverity>().Table().Where(x => x.AllergySeverityCode == allergySeverity.AllergySeverityCode).FirstOrDefault();

            if (allergySeverityData == null)
            {
                allergySeverityData = new AllergySeverity();

                allergySeverityData.AllergySeverityCode = allergySeverity.AllergySeverityCode;
                allergySeverityData.AllergySeverityDescription = allergySeverity.AllergySeverityDescription;
                allergySeverityData.OrderNo = allergySeverity.OrderNo;
                allergySeverityData.IsActive = true;
                allergySeverityData.CreatedDate = DateTime.Now;
                allergySeverityData.CreatedBy = "User";

                this.uow.GenericRepository<AllergySeverity>().Insert(allergySeverityData);
            }
            else
            {
                allergySeverityData.AllergySeverityDescription = allergySeverity.AllergySeverityDescription;
                allergySeverityData.OrderNo = allergySeverity.OrderNo;
                allergySeverityData.IsActive = true;
                allergySeverityData.ModifiedDate = DateTime.Now;
                allergySeverityData.ModifiedBy = "User";

                this.uow.GenericRepository<AllergySeverity>().Update(allergySeverityData);
            }
            this.uow.Save();
            allergySeverity.AllergySeverityId = allergySeverityData.AllergySeverityId;

            return allergySeverity;
        }

        #endregion

        #region Allergy Status Master

        ///// <summary>
        ///// Get All Allergy Status Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergyStatusMaster>. if Collection of Allergy Status Master = success. else = failure</returns>
        public List<AllergyStatusMaster> GetAllergyStatusMasterList()
        {
            var allergyStatusMasters = this.uow.GenericRepository<AllergyStatusMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return allergyStatusMasters;
        }

        ///// <summary>
        ///// Get Allergy Status Master by Id
        ///// </summary>
        ///// <param>int allergyStatusMasterId</param>
        ///// <returns>AllergyStatusMaster. if Allergy Status Master record by Id = success. else = failure</returns>
        public AllergyStatusMaster GetAllergyStatusMasterbyId(int allergyStatusMasterId)
        {
            var allergyStatusMaster = this.uow.GenericRepository<AllergyStatusMaster>().Table().Where(x => x.AllergyStatusMasterID == allergyStatusMasterId).FirstOrDefault();
            return allergyStatusMaster;
        }

        ///// <summary>
        ///// Delete Allergy Status Master Record by Id
        ///// </summary>
        ///// <param>int allergyStatusMasterId</param>
        ///// <returns>AllergyStatusMaster. if Allergy Status Master record deleted for given Id = success. else = failure</returns>
        public AllergyStatusMaster DeleteAllergyStatusMasterRecord(int allergyStatusMasterId)
        {
            var allergyStatusMaster = this.uow.GenericRepository<AllergyStatusMaster>().Table().Where(x => x.AllergyStatusMasterID == allergyStatusMasterId).FirstOrDefault();

            if (allergyStatusMaster != null)
            {
                allergyStatusMaster.IsActive = false;
                this.uow.GenericRepository<AllergyStatusMaster>().Update(allergyStatusMaster);
                this.uow.Save();
            }

            return allergyStatusMaster;
        }

        //// <summary>
        ///// Add or Update Allergy Status Master
        ///// </summary>
        ///// <param>AllergyStatusMaster allergyStatusMaster</param>
        ///// <returns>AllergyStatusMaster. if record of Allergy Status Master is added or updated = success. else = failure</returns>  
        public AllergyStatusMaster AddUpdateAllergyStatusMaster(AllergyStatusMaster allergyStatusMaster)
        {
            var allergyStatusMasterData = this.uow.GenericRepository<AllergyStatusMaster>().Table().Where(x => x.AllergyStatusMasterCode == allergyStatusMaster.AllergyStatusMasterCode).FirstOrDefault();

            if (allergyStatusMasterData == null)
            {
                allergyStatusMasterData = new AllergyStatusMaster();

                allergyStatusMasterData.AllergyStatusMasterCode = allergyStatusMaster.AllergyStatusMasterCode;
                allergyStatusMasterData.AllergyStatusMasterDesc = allergyStatusMaster.AllergyStatusMasterDesc;
                allergyStatusMasterData.OrderNo = allergyStatusMaster.OrderNo;
                allergyStatusMasterData.IsActive = true;
                allergyStatusMasterData.Createddate = DateTime.Now;
                allergyStatusMasterData.CreatedBy = "User";

                this.uow.GenericRepository<AllergyStatusMaster>().Insert(allergyStatusMasterData);
            }
            else
            {
                allergyStatusMasterData.AllergyStatusMasterDesc = allergyStatusMaster.AllergyStatusMasterDesc;
                allergyStatusMasterData.OrderNo = allergyStatusMaster.OrderNo;
                allergyStatusMasterData.IsActive = true;
                allergyStatusMasterData.ModifiedDate = DateTime.Now;
                allergyStatusMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<AllergyStatusMaster>().Update(allergyStatusMasterData);
            }
            this.uow.Save();
            allergyStatusMaster.AllergyStatusMasterID = allergyStatusMasterData.AllergyStatusMasterID;

            return allergyStatusMaster;
        }

        #endregion

        #region BP Location

        ///// <summary>
        ///// Get All BP Location
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BPLocation>. if Collection of BP Location = success. else = failure</returns>
        public List<BPLocation> GetBPLocationList()
        {
            var bPLocations = this.uow.GenericRepository<BPLocation>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return bPLocations;
        }

        ///// <summary>
        ///// Get BP Location by Id
        ///// </summary>
        ///// <param>int bPLocationId</param>
        ///// <returns>BPLocation. if BP Location record by Id = success. else = failure</returns>
        public BPLocation GetBPLocationbyId(int bPLocationId)
        {
            var bPLocation = this.uow.GenericRepository<BPLocation>().Table().Where(x => x.BPLocationId == bPLocationId).FirstOrDefault();
            return bPLocation;
        }

        ///// <summary>
        ///// Delete BP Location Record by Id
        ///// </summary>
        ///// <param>int bPLocationId</param>
        ///// <returns>BPLocation. if BP Location record deleted for given Id = success. else = failure</returns>
        public BPLocation DeleteBPLocationRecord(int bPLocationId)
        {
            var bPLocation = this.uow.GenericRepository<BPLocation>().Table().Where(x => x.BPLocationId == bPLocationId).FirstOrDefault();

            if (bPLocation != null)
            {
                bPLocation.IsActive = false;
                this.uow.GenericRepository<BPLocation>().Update(bPLocation);
                this.uow.Save();
            }

            return bPLocation;
        }

        //// <summary>
        ///// Add or Update BP Location
        ///// </summary>
        ///// <param>BPLocation bPLocation</param>
        ///// <returns>BPLocation. if record of BP Location is added or updated = success. else = failure</returns>  
        public BPLocation AddUpdateBPLocation(BPLocation bPLocation)
        {
            var bPLocationData = this.uow.GenericRepository<BPLocation>().Table().Where(x => x.BPLocationCode == bPLocation.BPLocationCode).FirstOrDefault();

            if (bPLocationData == null)
            {
                bPLocationData = new BPLocation();

                bPLocationData.BPLocationCode = bPLocation.BPLocationCode;
                bPLocationData.BPLocationDescription = bPLocation.BPLocationDescription;
                bPLocationData.OrderNo = bPLocation.OrderNo;
                bPLocationData.IsActive = true;
                bPLocationData.CreatedDate = DateTime.Now;
                bPLocationData.CreatedBy = "User";

                this.uow.GenericRepository<BPLocation>().Insert(bPLocationData);
            }
            else
            {
                bPLocationData.BPLocationDescription = bPLocation.BPLocationDescription;
                bPLocationData.OrderNo = bPLocation.OrderNo;
                bPLocationData.IsActive = true;
                bPLocationData.ModifiedDate = DateTime.Now;
                bPLocationData.ModifiedBy = "User";

                this.uow.GenericRepository<BPLocation>().Update(bPLocationData);
            }
            this.uow.Save();
            bPLocation.BPLocationId = bPLocationData.BPLocationId;

            return bPLocation;
        }

        #endregion

        #region Food Intake Type

        ///// <summary>
        ///// Get All Food Intake Type
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FoodIntakeType>. if Collection of Food Intake Type = success. else = failure</returns>
        public List<FoodIntakeType> GetFoodIntakeTypeList()
        {
            var foodIntakeTypes = this.uow.GenericRepository<FoodIntakeType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return foodIntakeTypes;
        }

        ///// <summary>
        ///// Get Food Intake Type by Id
        ///// </summary>
        ///// <param>int foodIntakeTypeId</param>
        ///// <returns>FoodIntakeType. if Food Intake Type record by Id = success. else = failure</returns>
        public FoodIntakeType GetFoodIntakeTypebyId(int foodIntakeTypeId)
        {
            var foodIntakeType = this.uow.GenericRepository<FoodIntakeType>().Table().Where(x => x.FoodIntaketypeID == foodIntakeTypeId).FirstOrDefault();
            return foodIntakeType;
        }

        ///// <summary>
        ///// Delete Food Intake Type Record by Id
        ///// </summary>
        ///// <param>int foodIntakeTypeId</param>
        ///// <returns>FoodIntakeType. if Food Intake Type record deleted for given Id = success. else = failure</returns>
        public FoodIntakeType DeleteFoodIntakeTypeRecord(int foodIntakeTypeId)
        {
            var foodIntakeType = this.uow.GenericRepository<FoodIntakeType>().Table().Where(x => x.FoodIntaketypeID == foodIntakeTypeId).FirstOrDefault();

            if (foodIntakeType != null)
            {
                foodIntakeType.IsActive = false;
                this.uow.GenericRepository<FoodIntakeType>().Update(foodIntakeType);
                this.uow.Save();
            }

            return foodIntakeType;
        }

        //// <summary>
        ///// Add or Update Food Intake Type
        ///// </summary>
        ///// <param>FoodIntakeType foodIntakeType</param>
        ///// <returns>FoodIntakeType. if record of Food Intake Type is added or updated = success. else = failure</returns>  
        public FoodIntakeType AddUpdateFoodIntakeType(FoodIntakeType foodIntakeType)
        {
            var foodIntakeTypeData = this.uow.GenericRepository<FoodIntakeType>().Table().Where(x => x.FoodIntakeTypeCode == foodIntakeType.FoodIntakeTypeCode).FirstOrDefault();

            if (foodIntakeTypeData == null)
            {
                foodIntakeTypeData = new FoodIntakeType();

                foodIntakeTypeData.FoodIntakeTypeCode = foodIntakeType.FoodIntakeTypeCode;
                foodIntakeTypeData.FoodIntakeTypeDescription = foodIntakeType.FoodIntakeTypeDescription;
                foodIntakeTypeData.OrderNo = foodIntakeType.OrderNo;
                foodIntakeTypeData.IsActive = true;
                foodIntakeTypeData.CreatedDate = DateTime.Now;
                foodIntakeTypeData.CreatedBy = "User";

                this.uow.GenericRepository<FoodIntakeType>().Insert(foodIntakeTypeData);
            }
            else
            {
                foodIntakeTypeData.FoodIntakeTypeDescription = foodIntakeType.FoodIntakeTypeDescription;
                foodIntakeTypeData.OrderNo = foodIntakeType.OrderNo;
                foodIntakeTypeData.IsActive = true;
                foodIntakeTypeData.ModifiedDate = DateTime.Now;
                foodIntakeTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<FoodIntakeType>().Update(foodIntakeTypeData);
            }
            this.uow.Save();
            foodIntakeType.FoodIntaketypeID = foodIntakeTypeData.FoodIntaketypeID;

            return foodIntakeType;
        }

        #endregion

        #region Patient Eat Master

        ///// <summary>
        ///// Get Patient Eat Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientEatMaster>. if Collection of Patient Eat Master = success. else = failure</returns>
        public List<PatientEatMaster> GetPatientEatMasterList()
        {
            var patientEatMasters = this.uow.GenericRepository<PatientEatMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return patientEatMasters;
        }

        ///// <summary>
        ///// Get Patient Eat Master by Id
        ///// </summary>
        ///// <param>int patientEatMasterId</param>
        ///// <returns>PatientEatMaster. if Patient Eat Master record by Id = success. else = failure</returns>
        public PatientEatMaster GetPatientEatMasterbyId(int patientEatMasterId)
        {
            var patientEatMaster = this.uow.GenericRepository<PatientEatMaster>().Table().Where(x => x.PatientEatMasterID == patientEatMasterId).FirstOrDefault();
            return patientEatMaster;
        }

        ///// <summary>
        ///// Delete Patient Eat Master Record by Id
        ///// </summary>
        ///// <param>int patientEatMasterId</param>
        ///// <returns>PatientEatMaster. if Patient Eat Master record deleted for given Id = success. else = failure</returns>
        public PatientEatMaster DeletePatientEatMasterRecord(int patientEatMasterId)
        {
            var patientEatMaster = this.uow.GenericRepository<PatientEatMaster>().Table().Where(x => x.PatientEatMasterID == patientEatMasterId).FirstOrDefault();

            if (patientEatMaster != null)
            {
                patientEatMaster.IsActive = false;
                this.uow.GenericRepository<PatientEatMaster>().Update(patientEatMaster);
                this.uow.Save();
            }

            return patientEatMaster;
        }

        //// <summary>
        ///// Add or Update Patient Eat Master
        ///// </summary>
        ///// <param>PatientEatMaster patientEatMaster</param>
        ///// <returns>PatientEatMaster. if record of Patient Eat Master is added or updated = success. else = failure</returns>  
        public PatientEatMaster AddUpdatePatientEatMaster(PatientEatMaster patientEatMaster)
        {
            var patientEatMasterData = this.uow.GenericRepository<PatientEatMaster>().Table().Where(x => x.PatientEatMasterCode == patientEatMaster.PatientEatMasterCode).FirstOrDefault();

            if (patientEatMasterData == null)
            {
                patientEatMasterData = new PatientEatMaster();

                patientEatMasterData.PatientEatMasterCode = patientEatMaster.PatientEatMasterCode;
                patientEatMasterData.PatientEatMasterDesc = patientEatMaster.PatientEatMasterDesc;
                patientEatMasterData.OrderNo = patientEatMaster.OrderNo;
                patientEatMasterData.IsActive = true;
                patientEatMasterData.Createddate = DateTime.Now;
                patientEatMasterData.CreatedBy = "User";

                this.uow.GenericRepository<PatientEatMaster>().Insert(patientEatMasterData);
            }
            else
            {
                patientEatMasterData.PatientEatMasterDesc = patientEatMaster.PatientEatMasterDesc;
                patientEatMasterData.OrderNo = patientEatMaster.OrderNo;
                patientEatMasterData.IsActive = true;
                patientEatMasterData.ModifiedDate = DateTime.Now;
                patientEatMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<PatientEatMaster>().Update(patientEatMasterData);
            }
            this.uow.Save();
            patientEatMaster.PatientEatMasterID = patientEatMasterData.PatientEatMasterID;

            return patientEatMaster;
        }

        #endregion

        #region Food Intake category Master

        ///// <summary>
        ///// Get All Food Intake Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FoodIntakeMaster>. if Collection of Food Intake Master = success. else = failure</returns>
        public List<FoodIntakeMaster> GetFoodIntakeMasterList()
        {
            var foodIntakeMasters = this.uow.GenericRepository<FoodIntakeMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return foodIntakeMasters;
        }

        ///// <summary>
        ///// Get Food Intake Master by Id
        ///// </summary>
        ///// <param>int foodIntakeMasterId</param>
        ///// <returns>FoodIntakeMaster. if Food Intake Master record by Id = success. else = failure</returns>
        public FoodIntakeMaster GetFoodIntakeMasterbyId(int foodIntakeMasterId)
        {
            var foodIntakeMaster = this.uow.GenericRepository<FoodIntakeMaster>().Table().Where(x => x.FoodIntakeMasterID == foodIntakeMasterId).FirstOrDefault();
            return foodIntakeMaster;
        }

        ///// <summary>
        ///// Delete Food Intake Master Record by Id
        ///// </summary>
        ///// <param>int foodIntakeMasterId</param>
        ///// <returns>FoodIntakeMaster. if Food Intake Master record deleted for given Id = success. else = failure</returns>
        public FoodIntakeMaster DeleteFoodIntakeMasterRecord(int foodIntakeMasterId)
        {
            var foodIntakeMaster = this.uow.GenericRepository<FoodIntakeMaster>().Table().Where(x => x.FoodIntakeMasterID == foodIntakeMasterId).FirstOrDefault();

            if (foodIntakeMaster != null)
            {
                foodIntakeMaster.IsActive = false;
                this.uow.GenericRepository<FoodIntakeMaster>().Update(foodIntakeMaster);
                this.uow.Save();
            }

            return foodIntakeMaster;
        }

        //// <summary>
        ///// Add or Update Food Intake Master
        ///// </summary>
        ///// <param>FoodIntakeMaster foodIntakeMaster</param>
        ///// <returns>FoodIntakeMaster. if record of Food Intake Master is added or updated = success. else = failure</returns>  
        public FoodIntakeMaster AddUpdateFoodIntakeMaster(FoodIntakeMaster foodIntakeMaster)
        {
            var foodIntakeMasterData = this.uow.GenericRepository<FoodIntakeMaster>().Table().Where(x => x.FoodIntakeMasterCode == foodIntakeMaster.FoodIntakeMasterCode).FirstOrDefault();

            if (foodIntakeMasterData == null)
            {
                foodIntakeMasterData = new FoodIntakeMaster();

                foodIntakeMasterData.FoodIntakeMasterCode = foodIntakeMaster.FoodIntakeMasterCode;
                foodIntakeMasterData.FoodIntakeMasterDesc = foodIntakeMaster.FoodIntakeMasterDesc;
                foodIntakeMasterData.OrderNo = foodIntakeMaster.OrderNo;
                foodIntakeMasterData.IsActive = true;
                foodIntakeMasterData.Createddate = DateTime.Now;
                foodIntakeMasterData.CreatedBy = "User";

                this.uow.GenericRepository<FoodIntakeMaster>().Insert(foodIntakeMasterData);
            }
            else
            {
                foodIntakeMasterData.FoodIntakeMasterDesc = foodIntakeMaster.FoodIntakeMasterDesc;
                foodIntakeMasterData.OrderNo = foodIntakeMaster.OrderNo;
                foodIntakeMasterData.IsActive = true;
                foodIntakeMasterData.ModifiedDate = DateTime.Now;
                foodIntakeMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<FoodIntakeMaster>().Update(foodIntakeMasterData);
            }
            this.uow.Save();
            foodIntakeMaster.FoodIntakeMasterID = foodIntakeMasterData.FoodIntakeMasterID;

            return foodIntakeMaster;
        }

        #endregion

        #region FCBalance

        //// <summary>
        ///// Get All Balance values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FCBalance>. if Collection of Balance values = success. else = failure</returns>
        public List<FCBalance> GetAllBalanceList()
        {
            var fcBalances = this.uow.GenericRepository<FCBalance>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return fcBalances;
        }

        //// <summary>
        ///// Get FC Balance by ID
        ///// </summary>
        ///// <param>int fcbalanceID</param>
        ///// <returns>FCBalance. if record of FCBalance for given Id = success. else = failure</returns>
        public FCBalance GetFCBalancebyID(int fcbalanceID)
        {
            var balanceRecord = this.uow.GenericRepository<FCBalance>().Table().Where(x => x.FCBalanceID == fcbalanceID).FirstOrDefault();

            return balanceRecord;
        }

        //// <summary>
        ///// Delete FC Balance by ID
        ///// </summary>
        ///// <param>int fcbalanceID</param>
        ///// <returns>FCBalance. if record of FCBalance Deleted for Given ID = success. else = failure</returns>
        public FCBalance DeleteFCBalanceRecord(int fcbalanceID)
        {
            var fcbalanceRecord = this.uow.GenericRepository<FCBalance>().Table().Where(x => x.FCBalanceID == fcbalanceID).FirstOrDefault();

            if (fcbalanceRecord != null)
            {
                fcbalanceRecord.IsActive = false;

                this.uow.GenericRepository<FCBalance>().Update(fcbalanceRecord);
                this.uow.Save();
            }

            return fcbalanceRecord;
        }

        //// <summary>
        ///// Add or Update FC Balance
        ///// </summary>
        ///// <param>FCBalance fcbalance</param>
        ///// <returns>FCBalance. if record of FCBalance is added or updated = success. else = failure</returns>  
        public FCBalance AddUpdateFCBalance(FCBalance fcbalance)
        {
            var fcbalanceRecord = this.uow.GenericRepository<FCBalance>().Table().Where(x => x.FCBalanceCode == fcbalance.FCBalanceCode).FirstOrDefault();

            if (fcbalanceRecord == null)
            {
                fcbalanceRecord = new FCBalance();

                fcbalanceRecord.FCBalanceCode = fcbalance.FCBalanceCode;
                fcbalanceRecord.FCBalanceDesc = fcbalance.FCBalanceDesc;
                fcbalanceRecord.OrderNo = fcbalance.OrderNo;
                fcbalanceRecord.IsActive = true;
                fcbalanceRecord.Createddate = DateTime.Now;
                fcbalanceRecord.CreatedBy = "User";

                this.uow.GenericRepository<FCBalance>().Insert(fcbalanceRecord);
            }
            else
            {
                fcbalanceRecord.FCBalanceDesc = fcbalance.FCBalanceDesc;
                fcbalanceRecord.OrderNo = fcbalance.OrderNo;
                fcbalanceRecord.IsActive = true;
                fcbalanceRecord.ModifiedDate = DateTime.Now;
                fcbalanceRecord.ModifiedBy = "User";

                this.uow.GenericRepository<FCBalance>().Update(fcbalanceRecord);
            }
            this.uow.Save();
            fcbalance.FCBalanceID = fcbalanceRecord.FCBalanceID;

            return fcbalance;
        }

        #endregion

        #region FCMobility

        //// <summary>
        ///// Get All Mobilities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FCMobility>. if Collection of Mobilities = success. else = failure</returns>
        public List<FCMobility> GetAllMobilities()
        {
            var fcMobilities = this.uow.GenericRepository<FCMobility>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return fcMobilities;
        }

        //// <summary>
        ///// Get FC Mobility by ID
        ///// </summary>
        ///// <param>int fcmobilityID</param>
        ///// <returns>FCMobility. if record of FCMobility for given Id = success. else = failure</returns>
        public FCMobility GetFCMobilitybyID(int fcmobilityID)
        {
            var mobilityRecord = this.uow.GenericRepository<FCMobility>().Table().Where(x => x.FCMobilityID == fcmobilityID).FirstOrDefault();

            return mobilityRecord;
        }

        //// <summary>
        ///// Delete FC Mobility by ID
        ///// </summary>
        ///// <param>int fcmobilityID</param>
        ///// <returns>FCMobility. if record of FCMobility Deleted for Given ID = success. else = failure</returns>
        public FCMobility DeleteFCMobilityRecord(int fcmobilityID)
        {
            var fcmobilityRecord = this.uow.GenericRepository<FCMobility>().Table().Where(x => x.FCMobilityID == fcmobilityID).FirstOrDefault();

            if (fcmobilityRecord != null)
            {
                fcmobilityRecord.IsActive = false;

                this.uow.GenericRepository<FCMobility>().Update(fcmobilityRecord);
                this.uow.Save();
            }

            return fcmobilityRecord;
        }

        //// <summary>
        ///// Add or Update FC Mobility
        ///// </summary>
        ///// <param>FCMobility fcmobility</param>
        ///// <returns>FCMobility. if record of FCMobility is added or updated = success. else = failure</returns>  
        public FCMobility AddUpdateFCMobility(FCMobility fcmobility)
        {
            var fcmobilityRecord = this.uow.GenericRepository<FCMobility>().Table().Where(x => x.FCMobilityCode == fcmobility.FCMobilityCode).FirstOrDefault();

            if (fcmobilityRecord == null)
            {
                fcmobilityRecord = new FCMobility();

                fcmobilityRecord.FCMobilityCode = fcmobility.FCMobilityCode;
                fcmobilityRecord.FCMobilityDesc = fcmobility.FCMobilityDesc;
                fcmobilityRecord.OrderNo = fcmobility.OrderNo;
                fcmobilityRecord.IsActive = true;
                fcmobilityRecord.Createddate = DateTime.Now;
                fcmobilityRecord.CreatedBy = "User";

                this.uow.GenericRepository<FCMobility>().Insert(fcmobilityRecord);
            }
            else
            {
                fcmobilityRecord.FCMobilityDesc = fcmobility.FCMobilityDesc;
                fcmobilityRecord.OrderNo = fcmobility.OrderNo;
                fcmobilityRecord.IsActive = true;
                fcmobilityRecord.ModifiedDate = DateTime.Now;
                fcmobilityRecord.ModifiedBy = "User";

                this.uow.GenericRepository<FCMobility>().Update(fcmobilityRecord);
            }
            this.uow.Save();
            fcmobility.FCMobilityID = fcmobilityRecord.FCMobilityID;

            return fcmobility;
        }

        #endregion

        #region PainScale

        //// <summary>
        ///// Get All Pain Scales
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PainScale>. if Collection of Pain Scales = success. else = failure</returns>
        public List<PainScale> GetAllPainScales()
        {
            var painScales = this.uow.GenericRepository<PainScale>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return painScales;
        }

        //// <summary>
        ///// Get Pain Scale by ID
        ///// </summary>
        ///// <param>int painScaleID</param>
        ///// <returns>PainScale. if record of PainScale for given Id = success. else = failure</returns>
        public PainScale GetPainScalebyID(int painScaleID)
        {
            var painScaleRecord = this.uow.GenericRepository<PainScale>().Table().Where(x => x.PainScaleID == painScaleID).FirstOrDefault();

            return painScaleRecord;
        }

        //// <summary>
        ///// Delete Pain Scale by ID
        ///// </summary>
        ///// <param>int painScaleID</param>
        ///// <returns>PainScale. if record of PainScale Deleted for Given ID = success. else = failure</returns>
        public PainScale DeletePainScaleRecord(int painScaleID)
        {
            var painScaleRecord = this.uow.GenericRepository<PainScale>().Table().Where(x => x.PainScaleID == painScaleID).FirstOrDefault();

            if (painScaleRecord != null)
            {
                painScaleRecord.IsActive = false;

                this.uow.GenericRepository<PainScale>().Update(painScaleRecord);
                this.uow.Save();
            }

            return painScaleRecord;
        }

        //// <summary>
        ///// Add or Update Pain Scale
        ///// </summary>
        ///// <param>PainScale painScale</param>
        ///// <returns>PainScale. if record of PainScale is added or updated = success. else = failure</returns>  
        public PainScale AddUpdatePainScale(PainScale painScale)
        {
            var painScaleRecord = this.uow.GenericRepository<PainScale>().Table().Where(x => x.PainScaleCode == painScale.PainScaleCode).FirstOrDefault();

            if (painScaleRecord == null)
            {
                painScaleRecord = new PainScale();

                painScaleRecord.PainScaleCode = painScale.PainScaleCode;
                painScaleRecord.PainScaleDesc = painScale.PainScaleDesc;
                painScaleRecord.OrderNo = painScale.OrderNo;
                painScaleRecord.IsActive = true;
                painScaleRecord.Createddate = DateTime.Now;
                painScaleRecord.CreatedBy = "User";

                this.uow.GenericRepository<PainScale>().Insert(painScaleRecord);
            }
            else
            {
                painScaleRecord.PainScaleDesc = painScale.PainScaleDesc;
                painScaleRecord.OrderNo = painScale.OrderNo;
                painScaleRecord.IsActive = true;
                painScaleRecord.ModifiedDate = DateTime.Now;
                painScaleRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PainScale>().Update(painScaleRecord);
            }
            this.uow.Save();
            painScale.PainScaleID = painScaleRecord.PainScaleID;

            return painScale;
        }

        #endregion

        #region Gait Master

        //// <summary>
        ///// Get All Gait Values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<GaitMaster>. if Collection of Gait Values = success. else = failure</returns>
        public List<GaitMaster> GetAllGaitMasters()
        {
            var gaitValues = this.uow.GenericRepository<GaitMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return gaitValues;
        }

        //// <summary>
        ///// Get Gait Value by ID
        ///// </summary>
        ///// <param>int gaitValueID</param>
        ///// <returns>GaitMaster. if record of GaitMaster for given Id = success. else = failure</returns>
        public GaitMaster GetGaitMasterbyID(int gaitMasterID)
        {
            var gaitValueRecord = this.uow.GenericRepository<GaitMaster>().Table().Where(x => x.GaitMasterID == gaitMasterID).FirstOrDefault();

            return gaitValueRecord;
        }

        //// <summary>
        ///// Delete Gait Value by ID
        ///// </summary>
        ///// <param>int gaitValueID</param>
        ///// <returns>GaitMaster. if record of GaitMaster Deleted for Given ID = success. else = failure</returns>
        public GaitMaster DeleteGaitMasterRecord(int gaitMasterID)
        {
            var gaitValueRecord = this.uow.GenericRepository<GaitMaster>().Table().Where(x => x.GaitMasterID == gaitMasterID).FirstOrDefault();

            if (gaitValueRecord != null)
            {
                gaitValueRecord.IsActive = false;

                this.uow.GenericRepository<GaitMaster>().Update(gaitValueRecord);
                this.uow.Save();
            }

            return gaitValueRecord;
        }

        //// <summary>
        ///// Add or Update Gait Value
        ///// </summary>
        ///// <param>GaitMaster gaitValue</param>
        ///// <returns>GaitMaster. if record of GaitMaster is added or updated = success. else = failure</returns>  
        public GaitMaster AddUpdateGaitMaster(GaitMaster gaitMaster)
        {
            var gaitValueRecord = this.uow.GenericRepository<GaitMaster>().Table().Where(x => x.GaitMasterCode == gaitMaster.GaitMasterCode).FirstOrDefault();

            if (gaitValueRecord == null)
            {
                gaitValueRecord = new GaitMaster();

                gaitValueRecord.GaitMasterCode = gaitMaster.GaitMasterCode;
                gaitValueRecord.GaitMasterDesc = gaitMaster.GaitMasterDesc;
                gaitValueRecord.OrderNo = gaitMaster.OrderNo;
                gaitValueRecord.IsActive = true;
                gaitValueRecord.Createddate = DateTime.Now;
                gaitValueRecord.CreatedBy = "User";

                this.uow.GenericRepository<GaitMaster>().Insert(gaitValueRecord);
            }
            else
            {
                gaitValueRecord.GaitMasterDesc = gaitMaster.GaitMasterDesc;
                gaitValueRecord.OrderNo = gaitMaster.OrderNo;
                gaitValueRecord.IsActive = true;
                gaitValueRecord.ModifiedDate = DateTime.Now;
                gaitValueRecord.ModifiedBy = "User";

                this.uow.GenericRepository<GaitMaster>().Update(gaitValueRecord);
            }
            this.uow.Save();
            gaitMaster.GaitMasterID = gaitValueRecord.GaitMasterID;

            return gaitMaster;
        }

        #endregion

        #region Treatment Type Master

        //// <summary>
        ///// Get All Treatment Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TreatmentTypeMaster>. if Collection of Treatment Types = success. else = failure</returns>
        public List<TreatmentTypeMaster> GetAllTreatmentTypes()
        {
            var treatmentTypes = this.uow.GenericRepository<TreatmentTypeMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return treatmentTypes;
        }

        //// <summary>
        ///// Get Treatment Type by ID
        ///// </summary>
        ///// <param>int treatmentTypeID</param>
        ///// <returns>TreatmentTypeMaster. if record of TreatmentType Master for given Id = success. else = failure</returns>
        public TreatmentTypeMaster GetTreatmentTypebyID(int treatmentTypeID)
        {
            var treatmentTypeRecord = this.uow.GenericRepository<TreatmentTypeMaster>().Table().Where(x => x.TreatmentTypeID == treatmentTypeID).FirstOrDefault();

            return treatmentTypeRecord;
        }

        //// <summary>
        ///// Delete Treatment Type by ID
        ///// </summary>
        ///// <param>int treatmentTypeID</param>
        ///// <returns>TreatmentTypeMaster. if record of TreatmentType Master Deleted for Given ID = success. else = failure</returns>
        public TreatmentTypeMaster DeleteTreatmentTypeRecord(int treatmentTypeID)
        {
            var treatmentTypeRecord = this.uow.GenericRepository<TreatmentTypeMaster>().Table().Where(x => x.TreatmentTypeID == treatmentTypeID).FirstOrDefault();

            if (treatmentTypeRecord != null)
            {
                treatmentTypeRecord.IsActive = false;

                this.uow.GenericRepository<TreatmentTypeMaster>().Update(treatmentTypeRecord);
                this.uow.Save();
            }

            return treatmentTypeRecord;
        }

        //// <summary>
        ///// Add or Update Treatment Type
        ///// </summary>
        ///// <param>TreatmentTypeMaster treatmentType</param>
        ///// <returns>TreatmentTypeMaster. if record of TreatmentTypeMaster is added or updated = success. else = failure</returns>  
        public TreatmentTypeMaster AddUpdateTreatmentType(TreatmentTypeMaster treatmentType)
        {
            var treatmentTypeRecord = this.uow.GenericRepository<TreatmentTypeMaster>().Table().Where(x => x.TreatmentTypeCode == treatmentType.TreatmentTypeCode).FirstOrDefault();

            if (treatmentTypeRecord == null)
            {
                treatmentTypeRecord = new TreatmentTypeMaster();

                treatmentTypeRecord.TreatmentTypeCode = treatmentType.TreatmentTypeCode;
                treatmentTypeRecord.TreatmentTypeDesc = treatmentType.TreatmentTypeDesc;
                treatmentTypeRecord.OrderNo = treatmentType.OrderNo;
                treatmentTypeRecord.IsActive = true;
                treatmentTypeRecord.Createddate = DateTime.Now;
                treatmentTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<TreatmentTypeMaster>().Insert(treatmentTypeRecord);
            }
            else
            {
                treatmentTypeRecord.TreatmentTypeDesc = treatmentType.TreatmentTypeDesc;
                treatmentTypeRecord.OrderNo = treatmentType.OrderNo;
                treatmentTypeRecord.IsActive = true;
                treatmentTypeRecord.ModifiedDate = DateTime.Now;
                treatmentTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<TreatmentTypeMaster>().Update(treatmentTypeRecord);
            }
            this.uow.Save();
            treatmentType.TreatmentTypeID = treatmentTypeRecord.TreatmentTypeID;

            return treatmentType;
        }

        #endregion

        #region Drinking Master

        ///// <summary>
        ///// Get All Drinking Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrinkingMaster>. if Collection of Drinking Master = success. else = failure</returns>
        public List<DrinkingMaster> GetDrinkingMasterList()
        {
            var drinkingMasters = this.uow.GenericRepository<DrinkingMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return drinkingMasters;
        }

        ///// <summary>
        ///// Get Drinking Master by Id
        ///// </summary>
        ///// <param>int drinkingMasterId</param>
        ///// <returns>DrinkingMaster. if Drinking Master record by Id = success. else = failure</returns>
        public DrinkingMaster GetDrinkingMasterbyId(int drinkingMasterId)
        {
            var drinkingMaster = this.uow.GenericRepository<DrinkingMaster>().Table().Where(x => x.DrinkingMasterID == drinkingMasterId).FirstOrDefault();
            return drinkingMaster;
        }

        ///// <summary>
        ///// Delete Drinking Master Record by Id
        ///// </summary>
        ///// <param>int drinkingMasterId</param>
        ///// <returns>DrinkingMaster. if Drinking Master record deleted for given Id = success. else = failure</returns>
        public DrinkingMaster DeleteDrinkingMasterRecord(int drinkingMasterId)
        {
            var drinkingMaster = this.uow.GenericRepository<DrinkingMaster>().Table().Where(x => x.DrinkingMasterID == drinkingMasterId).FirstOrDefault();

            if (drinkingMaster != null)
            {
                drinkingMaster.IsActive = false;
                this.uow.GenericRepository<DrinkingMaster>().Update(drinkingMaster);
                this.uow.Save();
            }

            return drinkingMaster;
        }

        //// <summary>
        ///// Add or Update Drinking Master
        ///// </summary>
        ///// <param>DrinkingMaster drinkingMaster</param>
        ///// <returns>DrinkingMaster. if record of Drinking Master is added or updated = success. else = failure</returns>  
        public DrinkingMaster AddUpdateDrinkingMaster(DrinkingMaster drinkingMaster)
        {
            var drinkingMasterData = this.uow.GenericRepository<DrinkingMaster>().Table().Where(x => x.DrinkingMasterCode == drinkingMaster.DrinkingMasterCode).FirstOrDefault();

            if (drinkingMasterData == null)
            {
                drinkingMasterData = new DrinkingMaster();

                drinkingMasterData.DrinkingMasterCode = drinkingMaster.DrinkingMasterCode;
                drinkingMasterData.DrinkingMasterDesc = drinkingMaster.DrinkingMasterDesc;
                drinkingMasterData.OrderNo = drinkingMaster.OrderNo;
                drinkingMasterData.IsActive = true;
                drinkingMasterData.Createddate = DateTime.Now;
                drinkingMasterData.CreatedBy = "User";

                this.uow.GenericRepository<DrinkingMaster>().Insert(drinkingMasterData);
            }
            else
            {
                drinkingMasterData.DrinkingMasterDesc = drinkingMaster.DrinkingMasterDesc;
                drinkingMasterData.OrderNo = drinkingMaster.OrderNo;
                drinkingMasterData.IsActive = true;
                drinkingMasterData.ModifiedDate = DateTime.Now;
                drinkingMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<DrinkingMaster>().Update(drinkingMasterData);
            }
            this.uow.Save();
            drinkingMaster.DrinkingMasterID = drinkingMasterData.DrinkingMasterID;

            return drinkingMaster;
        }

        #endregion

        #region Smoking Master

        ///// <summary>
        ///// Get All Smoking Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<SmokingMaster>. if Collection of Smoking Master = success. else = failure</returns>
        public List<SmokingMaster> GetSmokingMasterList()
        {
            var smokingMasters = this.uow.GenericRepository<SmokingMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return smokingMasters;
        }

        ///// <summary>
        ///// Get Smoking Master by Id
        ///// </summary>
        ///// <param>int smokingMasterId</param>
        ///// <returns>SmokingMaster. if Smoking Master record by Id = success. else = failure</returns>
        public SmokingMaster GetSmokingMasterbyId(int smokingMasterId)
        {
            var smokingMaster = this.uow.GenericRepository<SmokingMaster>().Table().Where(x => x.SmokingMasterID == smokingMasterId).FirstOrDefault();
            return smokingMaster;
        }

        ///// <summary>
        ///// Delete Smoking Master Record by Id
        ///// </summary>
        ///// <param>int smokingMasterId</param>
        ///// <returns>SmokingMaster. if Smoking Master record deleted for given Id = success. else = failure</returns>
        public SmokingMaster DeleteSmokingMasterRecord(int smokingMasterId)
        {
            var smokingMaster = this.uow.GenericRepository<SmokingMaster>().Table().Where(x => x.SmokingMasterID == smokingMasterId).FirstOrDefault();

            if (smokingMaster != null)
            {
                smokingMaster.IsActive = false;
                this.uow.GenericRepository<SmokingMaster>().Update(smokingMaster);
                this.uow.Save();
            }

            return smokingMaster;
        }

        //// <summary>
        ///// Add or Update Smoking Master
        ///// </summary>
        ///// <param>SmokingMaster smokingMaster</param>
        ///// <returns>SmokingMaster. if record of Smoking Master is added or updated = success. else = failure</returns>  
        public SmokingMaster AddUpdateSmokingMaster(SmokingMaster smokingMaster)
        {
            var smokingMasterData = this.uow.GenericRepository<SmokingMaster>().Table().Where(x => x.SmokingMasterCode == smokingMaster.SmokingMasterCode).FirstOrDefault();

            if (smokingMasterData == null)
            {
                smokingMasterData = new SmokingMaster();

                smokingMasterData.SmokingMasterCode = smokingMaster.SmokingMasterCode;
                smokingMasterData.SmokingMasterDesc = smokingMaster.SmokingMasterDesc;
                smokingMasterData.OrderNo = smokingMaster.OrderNo;
                smokingMasterData.IsActive = true;
                smokingMasterData.Createddate = DateTime.Now;
                smokingMasterData.CreatedBy = "User";

                this.uow.GenericRepository<SmokingMaster>().Insert(smokingMasterData);
            }
            else
            {
                smokingMasterData.SmokingMasterDesc = smokingMaster.SmokingMasterDesc;
                smokingMasterData.OrderNo = smokingMaster.OrderNo;
                smokingMasterData.IsActive = true;
                smokingMasterData.ModifiedDate = DateTime.Now;
                smokingMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<SmokingMaster>().Update(smokingMasterData);
            }
            this.uow.Save();
            smokingMaster.SmokingMasterID = smokingMasterData.SmokingMasterID;

            return smokingMaster;
        }

        #endregion

        #region PatientPosition

        //// <summary>
        ///// Get All Patient Positions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientPosition>. if Collection of Patient Positions = success. else = failure</returns>
        public List<PatientPosition> GetAllPatientPositions()
        {
            var patientPositions = this.uow.GenericRepository<PatientPosition>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return patientPositions;
        }

        //// <summary>
        ///// Get Patient Position by ID
        ///// </summary>
        ///// <param>int patientPositionID</param>
        ///// <returns>PatientPosition. if record of PatientPosition for given Id = success. else = failure</returns>
        public PatientPosition GetPatientPositionbyID(int patientPositionID)
        {
            var patientPositionRecord = this.uow.GenericRepository<PatientPosition>().Table().Where(x => x.PatientPositionID == patientPositionID).FirstOrDefault();

            return patientPositionRecord;
        }

        //// <summary>
        ///// Delete Patient Position by ID
        ///// </summary>
        ///// <param>int patientPositionID</param>
        ///// <returns>PatientPosition. if record of PatientPosition Deleted for Given ID = success. else = failure</returns>
        public PatientPosition DeletePatientPositionRecord(int patientPositionID)
        {
            var patientPositionRecord = this.uow.GenericRepository<PatientPosition>().Table().Where(x => x.PatientPositionID == patientPositionID).FirstOrDefault();

            if (patientPositionRecord != null)
            {
                patientPositionRecord.IsActive = false;

                this.uow.GenericRepository<PatientPosition>().Update(patientPositionRecord);
                this.uow.Save();
            }

            return patientPositionRecord;
        }

        //// <summary>
        ///// Add or Update Patient Position
        ///// </summary>
        ///// <param>PatientPosition patientPosition</param>
        ///// <returns>PatientPosition. if record of PatientPosition is added or updated = success. else = failure</returns>  
        public PatientPosition AddUpdatePatientPosition(PatientPosition patientPosition)
        {
            var patientPositionRecord = this.uow.GenericRepository<PatientPosition>().Table().Where(x => x.PatientPositionCode == patientPosition.PatientPositionCode).FirstOrDefault();

            if (patientPositionRecord == null)
            {
                patientPositionRecord = new PatientPosition();

                patientPositionRecord.PatientPositionCode = patientPosition.PatientPositionCode;
                patientPositionRecord.PatientPositionDesc = patientPosition.PatientPositionDesc;
                patientPositionRecord.OrderNo = patientPosition.OrderNo;
                patientPositionRecord.IsActive = true;
                patientPositionRecord.Createddate = DateTime.Now;
                patientPositionRecord.CreatedBy = "User";

                this.uow.GenericRepository<PatientPosition>().Insert(patientPositionRecord);
            }
            else
            {
                patientPositionRecord.PatientPositionDesc = patientPosition.PatientPositionDesc;
                patientPositionRecord.OrderNo = patientPosition.OrderNo;
                patientPositionRecord.IsActive = true;
                patientPositionRecord.ModifiedDate = DateTime.Now;
                patientPositionRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientPosition>().Update(patientPositionRecord);
            }
            this.uow.Save();
            patientPosition.PatientPositionID = patientPositionRecord.PatientPositionID;

            return patientPosition;
        }

        #endregion

        #region ProblemStatus

        //// <summary>
        ///// Get All Problem Statuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemStatus>. if Collection of Problem Statuses = success. else = failure</returns>
        public List<ProblemStatus> GetAllProblemStatuses()
        {
            var problemStatuses = this.uow.GenericRepository<ProblemStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return problemStatuses;
        }

        //// <summary>
        ///// Get Problem Status by ID
        ///// </summary>
        ///// <param>int problemStatusID</param>
        ///// <returns>ProblemStatus. if record of ProblemStatus for given Id = success. else = failure</returns>
        public ProblemStatus GetProblemStatusbyID(int problemStatusID)
        {
            var problemStatusRecord = this.uow.GenericRepository<ProblemStatus>().Table().Where(x => x.ProblemStatusID == problemStatusID).FirstOrDefault();

            return problemStatusRecord;
        }

        //// <summary>
        ///// Delete Problem Status by ID
        ///// </summary>
        ///// <param>int problemStatusID</param>
        ///// <returns>ProblemStatus. if record of ProblemStatus Deleted for Given ID = success. else = failure</returns>
        public ProblemStatus DeleteProblemStatusRecord(int problemStatusID)
        {
            var problemStatusRecord = this.uow.GenericRepository<ProblemStatus>().Table().Where(x => x.ProblemStatusID == problemStatusID).FirstOrDefault();

            if (problemStatusRecord != null)
            {
                problemStatusRecord.IsActive = false;

                this.uow.GenericRepository<ProblemStatus>().Update(problemStatusRecord);
                this.uow.Save();
            }

            return problemStatusRecord;
        }

        //// <summary>
        ///// Add or Update Problem Status
        ///// </summary>
        ///// <param>ProblemStatus problemStatus</param>
        ///// <returns>ProblemStatus. if record of ProblemStatus is added or updated = success. else = failure</returns>  
        public ProblemStatus AddUpdateProblemStatus(ProblemStatus problemStatus)
        {
            var problemStatusRecord = this.uow.GenericRepository<ProblemStatus>().Table().Where(x => x.ProblemStatusCode == problemStatus.ProblemStatusCode).FirstOrDefault();

            if (problemStatusRecord == null)
            {
                problemStatusRecord = new ProblemStatus();

                problemStatusRecord.ProblemStatusCode = problemStatus.ProblemStatusCode;
                problemStatusRecord.ProblemStatusDesc = problemStatus.ProblemStatusDesc;
                problemStatusRecord.OrderNo = problemStatus.OrderNo;
                problemStatusRecord.IsActive = true;
                problemStatusRecord.Createddate = DateTime.Now;
                problemStatusRecord.CreatedBy = "User";

                this.uow.GenericRepository<ProblemStatus>().Insert(problemStatusRecord);
            }
            else
            {
                problemStatusRecord.ProblemStatusDesc = problemStatus.ProblemStatusDesc;
                problemStatusRecord.OrderNo = problemStatus.OrderNo;
                problemStatusRecord.IsActive = true;
                problemStatusRecord.ModifiedDate = DateTime.Now;
                problemStatusRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ProblemStatus>().Update(problemStatusRecord);
            }
            this.uow.Save();
            problemStatus.ProblemStatusID = problemStatusRecord.ProblemStatusID;

            return problemStatus;
        }

        #endregion

        #region TemperatureLocation

        //// <summary>
        ///// Get All Temperature Locations
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TemperatureLocation>. if Collection of Temperature Locations = success. else = failure</returns>
        public List<TemperatureLocation> GetAllTemperatureLocations()
        {
            var temperatureLocations = this.uow.GenericRepository<TemperatureLocation>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return temperatureLocations;
        }

        //// <summary>
        ///// Get Temperature Location by ID
        ///// </summary>
        ///// <param>int temperatureLocationID</param>
        ///// <returns>TemperatureLocation. if record of TemperatureLocation for given Id = success. else = failure</returns>
        public TemperatureLocation GetTemperatureLocationbyID(int temperatureLocationID)
        {
            var temperatureLocationRecord = this.uow.GenericRepository<TemperatureLocation>().Table().Where(x => x.TemperatureLocationID == temperatureLocationID).FirstOrDefault();

            return temperatureLocationRecord;
        }

        //// <summary>
        ///// Delete Temperature Location by ID
        ///// </summary>
        ///// <param>int temperatureLocationID</param>
        ///// <returns>TemperatureLocation. if record of TemperatureLocation Deleted for Given ID = success. else = failure</returns>
        public TemperatureLocation DeleteTemperatureLocationRecord(int temperatureLocationID)
        {
            var temperatureLocationRecord = this.uow.GenericRepository<TemperatureLocation>().Table().Where(x => x.TemperatureLocationID == temperatureLocationID).FirstOrDefault();

            if (temperatureLocationRecord != null)
            {
                temperatureLocationRecord.IsActive = false;

                this.uow.GenericRepository<TemperatureLocation>().Update(temperatureLocationRecord);
                this.uow.Save();
            }

            return temperatureLocationRecord;
        }

        //// <summary>
        ///// Add or Update Temperature Location
        ///// </summary>
        ///// <param>TemperatureLocation temperatureLocation</param>
        ///// <returns>TemperatureLocation. if record of TemperatureLocation is added or updated = success. else = failure</returns>  
        public TemperatureLocation AddUpdateTemperatureLocation(TemperatureLocation temperatureLocation)
        {
            var temperatureLocationRecord = this.uow.GenericRepository<TemperatureLocation>().Table().Where(x => x.TemperatureLocationCode == temperatureLocation.TemperatureLocationCode).FirstOrDefault();

            if (temperatureLocationRecord == null)
            {
                temperatureLocationRecord = new TemperatureLocation();

                temperatureLocationRecord.TemperatureLocationCode = temperatureLocation.TemperatureLocationCode;
                temperatureLocationRecord.TemperatureLocationDesc = temperatureLocation.TemperatureLocationDesc;
                temperatureLocationRecord.OrderNo = temperatureLocation.OrderNo;
                temperatureLocationRecord.IsActive = true;
                temperatureLocationRecord.Createddate = DateTime.Now;
                temperatureLocationRecord.CreatedBy = "User";

                this.uow.GenericRepository<TemperatureLocation>().Insert(temperatureLocationRecord);
            }
            else
            {
                temperatureLocationRecord.TemperatureLocationDesc = temperatureLocation.TemperatureLocationDesc;
                temperatureLocationRecord.OrderNo = temperatureLocation.OrderNo;
                temperatureLocationRecord.IsActive = true;
                temperatureLocationRecord.ModifiedDate = DateTime.Now;
                temperatureLocationRecord.ModifiedBy = "User";

                this.uow.GenericRepository<TemperatureLocation>().Update(temperatureLocationRecord);
            }
            this.uow.Save();
            temperatureLocation.TemperatureLocationID = temperatureLocationRecord.TemperatureLocationID;

            return temperatureLocation;
        }

        #endregion

        #region ProcedureStatus

        //// <summary>
        ///// Get All ProcedureStatuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureStatus>. if Collection of Procedure Status = success. else = failure</returns>
        public List<ProcedureStatus> GetAllProcedureStatuses()
        {
            var procedureStatuses = this.uow.GenericRepository<ProcedureStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return procedureStatuses;
        }

        //// <summary>
        ///// Get Procedure Status by ID
        ///// </summary>
        ///// <param>int procedureStatusID</param>
        ///// <returns>ProcedureStatus. if record of ProcedureStatus for given Id = success. else = failure</returns>
        public ProcedureStatus GetProcedureStatusbyID(int procedureStatusID)
        {
            var procedureStatusRecord = this.uow.GenericRepository<ProcedureStatus>().Table().Where(x => x.ProcedureStatusID == procedureStatusID).FirstOrDefault();

            return procedureStatusRecord;
        }

        //// <summary>
        ///// Delete Procedure Status by ID
        ///// </summary>
        ///// <param>int procedureStatusID</param>
        ///// <returns>ProcedureStatus. if record of ProcedureStatus Deleted for Given ID = success. else = failure</returns>
        public ProcedureStatus DeleteProcedureStatusRecord(int procedureStatusID)
        {
            var procedureStatusRecord = this.uow.GenericRepository<ProcedureStatus>().Table().Where(x => x.ProcedureStatusID == procedureStatusID).FirstOrDefault();

            if (procedureStatusRecord != null)
            {
                procedureStatusRecord.IsActive = false;

                this.uow.GenericRepository<ProcedureStatus>().Update(procedureStatusRecord);
                this.uow.Save();
            }

            return procedureStatusRecord;
        }

        //// <summary>
        ///// Add or Update Procedure Status
        ///// </summary>
        ///// <param>ProcedureStatus procedureStatus</param>
        ///// <returns>ProcedureStatus. if record of ProcedureStatus is added or updated = success. else = failure</returns>  
        public ProcedureStatus AddUpdateProcedureStatus(ProcedureStatus procedureStatus)
        {
            var procedureStatusRecord = this.uow.GenericRepository<ProcedureStatus>().Table().Where(x => x.ProcedureStatusCode == procedureStatus.ProcedureStatusCode).FirstOrDefault();

            if (procedureStatusRecord == null)
            {
                procedureStatusRecord = new ProcedureStatus();

                procedureStatusRecord.ProcedureStatusCode = procedureStatus.ProcedureStatusCode;
                procedureStatusRecord.ProcedureStatusDesc = procedureStatus.ProcedureStatusDesc;
                procedureStatusRecord.OrderNo = procedureStatus.OrderNo;
                procedureStatusRecord.IsActive = true;
                procedureStatusRecord.Createddate = DateTime.Now;
                procedureStatusRecord.CreatedBy = "User";

                this.uow.GenericRepository<ProcedureStatus>().Insert(procedureStatusRecord);
            }
            else
            {
                procedureStatusRecord.ProcedureStatusDesc = procedureStatus.ProcedureStatusDesc;
                procedureStatusRecord.OrderNo = procedureStatus.OrderNo;
                procedureStatusRecord.IsActive = true;
                procedureStatusRecord.ModifiedDate = DateTime.Now;
                procedureStatusRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ProcedureStatus>().Update(procedureStatusRecord);
            }
            this.uow.Save();
            procedureStatus.ProcedureStatusID = procedureStatusRecord.ProcedureStatusID;

            return procedureStatus;
        }

        #endregion

        #region ProcedureType

        //// <summary>
        ///// Get All Procedure Type
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureType>. if Collection of Procedure Type = success. else = failure</returns>
        public List<ProcedureType> GetAllProcedureTypes()
        {
            var procedureTypes = this.uow.GenericRepository<ProcedureType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return procedureTypes;
        }

        //// <summary>
        ///// Get Procedure Type by ID
        ///// </summary>
        ///// <param>int procedureTypeID</param>
        ///// <returns>ProcedureType. if record of ProcedureType for given Id = success. else = failure</returns>
        public ProcedureType GetProcedureTypebyID(int procedureTypeID)
        {
            var procedureTypeRecord = this.uow.GenericRepository<ProcedureType>().Table().Where(x => x.ProcedureTypeID == procedureTypeID).FirstOrDefault();

            return procedureTypeRecord;
        }

        //// <summary>
        ///// Delete Procedure Type by ID
        ///// </summary>
        ///// <param>int procedureTypeID</param>
        ///// <returns>ProcedureType. if record of ProcedureType Deleted for Given ID = success. else = failure</returns>
        public ProcedureType DeleteProcedureTypeRecord(int procedureTypeID)
        {
            var procedureTypeRecord = this.uow.GenericRepository<ProcedureType>().Table().Where(x => x.ProcedureTypeID == procedureTypeID).FirstOrDefault();

            if (procedureTypeRecord != null)
            {
                procedureTypeRecord.IsActive = false;

                this.uow.GenericRepository<ProcedureType>().Update(procedureTypeRecord);
                this.uow.Save();
            }

            return procedureTypeRecord;
        }

        //// <summary>
        ///// Add or Update Procedure Type
        ///// </summary>
        ///// <param>ProcedureType procedureType</param>
        ///// <returns>ProcedureType. if record of ProcedureType is added or updated = success. else = failure</returns>  
        public ProcedureType AddUpdateProcedureType(ProcedureType procedureType)
        {
            var procedureTypeRecord = this.uow.GenericRepository<ProcedureType>().Table().Where(x => x.ProcedureTypeCode == procedureType.ProcedureTypeCode).FirstOrDefault();

            if (procedureTypeRecord == null)
            {
                procedureTypeRecord = new ProcedureType();

                procedureTypeRecord.ProcedureTypeCode = procedureType.ProcedureTypeCode;
                procedureTypeRecord.ProcedureTypeDesc = procedureType.ProcedureTypeDesc;
                procedureTypeRecord.OrderNo = procedureType.OrderNo;
                procedureTypeRecord.IsActive = true;
                procedureTypeRecord.Createddate = DateTime.Now;
                procedureTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<ProcedureType>().Insert(procedureTypeRecord);
            }
            else
            {
                procedureTypeRecord.ProcedureTypeDesc = procedureType.ProcedureTypeDesc;
                procedureTypeRecord.OrderNo = procedureType.OrderNo;
                procedureTypeRecord.IsActive = true;
                procedureTypeRecord.ModifiedDate = DateTime.Now;
                procedureTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ProcedureType>().Update(procedureTypeRecord);
            }
            this.uow.Save();
            procedureType.ProcedureTypeID = procedureTypeRecord.ProcedureTypeID;

            return procedureType;
        }

        #endregion

        #region Procedures

        //// <summary>
        ///// Get All Procedures
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Procedures>. if Collection of Procedures = success. else = failure</returns>
        public List<Procedures> GetAllProcedures(string searchkey)
        {
            List<Procedures> procedures = new List<Procedures>();

            procedures = (from proc in this.uow.GenericRepository<Procedures>().Table().Where(x => x.IsActive != false)
                          where (searchkey == null
                          || (proc.ProcedureCode.ToLower().Trim().Contains(searchkey.ToLower().Trim()) || proc.ProcedureDesc.ToLower().Trim().Contains(searchkey.ToLower().Trim())))
                          select proc).OrderBy(x => x.OrderNo).ToList();

            return procedures;
        }

        //// <summary>
        ///// Get Procedure by ID
        ///// </summary>
        ///// <param>int proceduresID</param>
        ///// <returns>Procedures. if record of Procedure for given Id = success. else = failure</returns>
        public Procedures GetProceduresbyID(int procedureID)
        {
            var procedureRecord = this.uow.GenericRepository<Procedures>().Table().Where(x => x.ProcedureID == procedureID).FirstOrDefault();

            return procedureRecord;
        }

        //// <summary>
        ///// Delete Procedure by ID
        ///// </summary>
        ///// <param>int procedureID</param>
        ///// <returns>Procedures. if record of Procedure Deleted for Given ID = success. else = failure</returns>
        public Procedures DeleteProceduresRecord(int procedureID)
        {
            var procedureRecord = this.uow.GenericRepository<Procedures>().Table().Where(x => x.ProcedureID == procedureID).FirstOrDefault();

            if (procedureRecord != null)
            {
                procedureRecord.IsActive = false;

                this.uow.GenericRepository<Procedures>().Update(procedureRecord);
                this.uow.Save();
            }

            return procedureRecord;
        }

        //// <summary>
        ///// Add or Update Procedure
        ///// </summary>
        ///// <param>Procedures procedures</param>
        ///// <returns>Procedures. if record of Procedure is added or updated = success. else = failure</returns>  
        public Procedures AddUpdateProcedures(Procedures procedures)
        {
            var procedureRecord = this.uow.GenericRepository<Procedures>().Table().Where(x => x.ProcedureCode == procedures.ProcedureCode).FirstOrDefault();

            if (procedureRecord == null)
            {
                procedureRecord = new Procedures();

                procedureRecord.ProcedureCode = procedures.ProcedureCode;
                procedureRecord.ProcedureDesc = procedures.ProcedureDesc;
                procedureRecord.OrderNo = procedures.OrderNo;
                procedureRecord.IsActive = true;
                procedureRecord.Createddate = DateTime.Now;
                procedureRecord.CreatedBy = "User";

                this.uow.GenericRepository<Procedures>().Insert(procedureRecord);
            }
            else
            {
                procedureRecord.ProcedureDesc = procedures.ProcedureDesc;
                procedureRecord.OrderNo = procedures.OrderNo;
                procedureRecord.IsActive = true;
                procedureRecord.ModifiedDate = DateTime.Now;
                procedureRecord.ModifiedBy = "User";

                this.uow.GenericRepository<Procedures>().Update(procedureRecord);
            }
            this.uow.Save();
            procedures.ProcedureID = procedureRecord.ProcedureID;

            return procedures;
        }

        #endregion

        #region Care Plan Status Master

        ///// <summary>
        ///// Get Care Plan Status Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CarePlanStatusMaster>. if Collection of Care Plan Status Master = success. else = failure</returns>
        public List<CarePlanStatusMaster> GetCarePlanStatusMasterList()
        {
            var carePlanStatusMasters = this.uow.GenericRepository<CarePlanStatusMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return carePlanStatusMasters;
        }

        ///// <summary>
        ///// Get Care Plan Status Master by Id
        ///// </summary>
        ///// <param>int carePlanStatusId</param>
        ///// <returns>CarePlanStatusMaster. if Care Plan Status Master record by Id = success. else = failure</returns>
        public CarePlanStatusMaster GetCarePlanStatusMasterbyId(int carePlanStatusId)
        {
            var carePlanStatusMaster = this.uow.GenericRepository<CarePlanStatusMaster>().Table().Where(x => x.CarePlanStatusID == carePlanStatusId).FirstOrDefault();
            return carePlanStatusMaster;
        }

        ///// <summary>
        ///// Delete Care Plan Status Master Record by Id
        ///// </summary>
        ///// <param>int carePlanStatusId</param>
        ///// <returns>CarePlanStatusMaster. if Care Plan Status Master record deleted for given Id = success. else = failure</returns>
        public CarePlanStatusMaster DeleteCarePlanStatusMasterRecord(int carePlanStatusId)
        {
            var carePlanStatusMaster = this.uow.GenericRepository<CarePlanStatusMaster>().Table().Where(x => x.CarePlanStatusID == carePlanStatusId).FirstOrDefault();

            if (carePlanStatusMaster != null)
            {
                carePlanStatusMaster.IsActive = false;
                this.uow.GenericRepository<CarePlanStatusMaster>().Update(carePlanStatusMaster);
                this.uow.Save();
            }

            return carePlanStatusMaster;
        }

        //// <summary>
        ///// Add or Update Care Plan Status Master
        ///// </summary>
        ///// <param>CarePlanStatusMaster carePlanStatusMaster</param>
        ///// <returns>CarePlanStatusMaster. if record of Care Plan Status Master is added or updated = success. else = failure</returns>  
        public CarePlanStatusMaster AddUpdateCarePlanStatusMaster(CarePlanStatusMaster carePlanStatusMaster)
        {
            var carePlanStatusMasterData = this.uow.GenericRepository<CarePlanStatusMaster>().Table().Where(x => x.CarePlanStatusCode == carePlanStatusMaster.CarePlanStatusCode).FirstOrDefault();

            if (carePlanStatusMasterData == null)
            {
                carePlanStatusMasterData = new CarePlanStatusMaster();

                carePlanStatusMasterData.CarePlanStatusCode = carePlanStatusMaster.CarePlanStatusCode;
                carePlanStatusMasterData.CarePlanStatusDesc = carePlanStatusMaster.CarePlanStatusDesc;
                carePlanStatusMasterData.OrderNo = carePlanStatusMaster.OrderNo;
                carePlanStatusMasterData.IsActive = true;
                carePlanStatusMasterData.Createddate = DateTime.Now;
                carePlanStatusMasterData.CreatedBy = "User";

                this.uow.GenericRepository<CarePlanStatusMaster>().Insert(carePlanStatusMasterData);
            }
            else
            {
                carePlanStatusMasterData.CarePlanStatusDesc = carePlanStatusMaster.CarePlanStatusDesc;
                carePlanStatusMasterData.OrderNo = carePlanStatusMaster.OrderNo;
                carePlanStatusMasterData.IsActive = true;
                carePlanStatusMasterData.ModifiedDate = DateTime.Now;
                carePlanStatusMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<CarePlanStatusMaster>().Update(carePlanStatusMasterData);
            }
            this.uow.Save();
            carePlanStatusMaster.CarePlanStatusID = carePlanStatusMasterData.CarePlanStatusID;

            return carePlanStatusMaster;
        }

        #endregion

        #region Care Plan Progress Master

        ///// <summary>
        ///// Get Care Plan Progress Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CarePlanProgressMaster>. if Collection of Care Plan Progress Master = success. else = failure</returns>
        public List<CarePlanProgressMaster> GetCarePlanProgressMasterList()
        {
            var carePlanProgressMasters = this.uow.GenericRepository<CarePlanProgressMaster>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return carePlanProgressMasters;
        }

        ///// <summary>
        ///// Get Care Plan Progress Master by Id
        ///// </summary>
        ///// <param>int carePlanProgressId</param>
        ///// <returns>CarePlanProgressMaster. if Care Plan Progress Master record by Id = success. else = failure</returns>
        public CarePlanProgressMaster GetCarePlanProgressMasterbyId(int carePlanProgressId)
        {
            var carePlanProgressMaster = this.uow.GenericRepository<CarePlanProgressMaster>().Table().Where(x => x.CarePlanProgressID == carePlanProgressId).FirstOrDefault();
            return carePlanProgressMaster;
        }

        ///// <summary>
        ///// Delete Care Plan Progress Master Record by Id
        ///// </summary>
        ///// <param>int carePlanProgressId</param>
        ///// <returns>CarePlanProgressMaster. if Care Plan Progress Master record deleted for given Id = success. else = failure</returns>
        public CarePlanProgressMaster DeleteCarePlanProgressMasterRecord(int carePlanProgressId)
        {
            var carePlanProgressMaster = this.uow.GenericRepository<CarePlanProgressMaster>().Table().Where(x => x.CarePlanProgressID == carePlanProgressId).FirstOrDefault();

            if (carePlanProgressMaster != null)
            {
                carePlanProgressMaster.IsActive = false;
                this.uow.GenericRepository<CarePlanProgressMaster>().Update(carePlanProgressMaster);
                this.uow.Save();
            }

            return carePlanProgressMaster;
        }

        //// <summary>
        ///// Add or Update Care Plan Progress Master
        ///// </summary>
        ///// <param>CarePlanProgressMaster carePlanProgressMaster</param>
        ///// <returns>CarePlanProgressMaster. if record of Care Plan Progress Master is added or updated = success. else = failure</returns>  
        public CarePlanProgressMaster AddUpdateCarePlanProgressMaster(CarePlanProgressMaster carePlanProgressMaster)
        {
            var carePlanProgressMasterData = this.uow.GenericRepository<CarePlanProgressMaster>().Table().Where(x => x.CarePlanProgressCode == carePlanProgressMaster.CarePlanProgressCode).FirstOrDefault();

            if (carePlanProgressMasterData == null)
            {
                carePlanProgressMasterData = new CarePlanProgressMaster();

                carePlanProgressMasterData.CarePlanProgressCode = carePlanProgressMaster.CarePlanProgressCode;
                carePlanProgressMasterData.CarePlanProgressDesc = carePlanProgressMaster.CarePlanProgressDesc;
                carePlanProgressMasterData.OrderNo = carePlanProgressMaster.OrderNo;
                carePlanProgressMasterData.IsActive = true;
                carePlanProgressMasterData.Createddate = DateTime.Now;
                carePlanProgressMasterData.CreatedBy = "User";

                this.uow.GenericRepository<CarePlanProgressMaster>().Insert(carePlanProgressMasterData);
            }
            else
            {
                carePlanProgressMasterData.CarePlanProgressDesc = carePlanProgressMaster.CarePlanProgressDesc;
                carePlanProgressMasterData.OrderNo = carePlanProgressMaster.OrderNo;
                carePlanProgressMasterData.IsActive = true;
                carePlanProgressMasterData.ModifiedDate = DateTime.Now;
                carePlanProgressMasterData.ModifiedBy = "User";

                this.uow.GenericRepository<CarePlanProgressMaster>().Update(carePlanProgressMasterData);
            }
            this.uow.Save();
            carePlanProgressMaster.CarePlanProgressID = carePlanProgressMasterData.CarePlanProgressID;

            return carePlanProgressMaster;
        }

        #endregion

        #region Symptoms

        ///// <summary>
        ///// Get Symptoms List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Symptoms>. if Collection of Symptoms = success. else = failure</returns>
        public List<Symptoms> GetSymptomsList()
        {
            var symptoms = this.uow.GenericRepository<Symptoms>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return symptoms;
        }

        ///// <summary>
        ///// Get Symptom by ID
        ///// </summary>
        ///// <param>int symptomId</param>
        ///// <returns>Symptoms. if Record of Symptoms by Id = success. else = failure</returns>
        public Symptoms GetSymptombyID(int symptomId)
        {
            var symptom = this.uow.GenericRepository<Symptoms>().Table().Where(x => x.SymptomsId == symptomId).FirstOrDefault();
            return symptom;
        }

        ///// <summary>
        ///// Delete Symptom by ID
        ///// </summary>
        ///// <param>int symptomId</param>
        ///// <returns>Symptoms. if Record of Symptoms Deleted for given Id = success. else = failure</returns>
        public Symptoms DeleteSymptomRecord(int symptomId)
        {
            var symptom = this.uow.GenericRepository<Symptoms>().Table().Where(x => x.SymptomsId == symptomId).FirstOrDefault();

            if (symptom != null)
            {
                symptom.IsActive = false;
                this.uow.GenericRepository<Symptoms>().Update(symptom);
                this.uow.Save();
            }

            return symptom;
        }

        //// <summary>
        ///// Add or Update Symptoms
        ///// </summary>
        ///// <param>Symptoms symptoms</param>
        ///// <returns>Symptoms. if record of Symptoms is added or updated = success. else = failure</returns>  
        public Symptoms AddUpdateSymptoms(Symptoms symptoms)
        {
            var symptomsRecord = this.uow.GenericRepository<Symptoms>().Table().Where(x => x.SymptomsCode == symptoms.SymptomsCode).FirstOrDefault();

            if (symptomsRecord == null)
            {
                symptomsRecord = new Symptoms();

                symptomsRecord.SymptomsCode = symptoms.SymptomsCode;
                symptomsRecord.SymptomsDescription = symptoms.SymptomsDescription;
                symptomsRecord.OrderNo = symptoms.OrderNo;
                symptomsRecord.IsActive = true;
                symptomsRecord.CreatedDate = DateTime.Now;
                symptomsRecord.CreatedBy = "User";

                this.uow.GenericRepository<Symptoms>().Insert(symptomsRecord);
            }
            else
            {
                symptomsRecord.SymptomsDescription = symptoms.SymptomsDescription;
                symptomsRecord.OrderNo = symptoms.OrderNo;
                symptomsRecord.IsActive = true;
                symptomsRecord.ModifiedDate = DateTime.Now;
                symptomsRecord.ModifiedBy = "User";

                this.uow.GenericRepository<Symptoms>().Update(symptomsRecord);
            }
            this.uow.Save();
            symptoms.SymptomsId = symptomsRecord.SymptomsId;

            return symptoms;
        }

        #endregion

        #region Problem Area

        //// <summary>
        ///// Get All Problem Areas
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemArea>. if Collection of Problem Areas = success. else = failure</returns>
        public List<ProblemArea> GetAllProblemAreas()
        {
            var ProblemAreas = this.uow.GenericRepository<ProblemArea>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return ProblemAreas;
        }

        //// <summary>
        ///// Get Problem Area by ID
        ///// </summary>
        ///// <param>int problemAreaID</param>
        ///// <returns>ProblemArea. if record of ProblemArea for given Id = success. else = failure</returns>
        public ProblemArea GetProblemAreabyID(int problemAreaID)
        {
            var problemAreaRecord = this.uow.GenericRepository<ProblemArea>().Table().Where(x => x.ProblemAreaId == problemAreaID).FirstOrDefault();

            return problemAreaRecord;
        }

        //// <summary>
        ///// Delete Problem Area by ID
        ///// </summary>
        ///// <param>int problemAreaID</param>
        ///// <returns>ProblemArea. if record of ProblemArea Deleted for Given ID = success. else = failure</returns>
        public ProblemArea DeleteProblemAreaRecord(int problemAreaID)
        {
            var problemAreaRecord = this.uow.GenericRepository<ProblemArea>().Table().Where(x => x.ProblemAreaId == problemAreaID).FirstOrDefault();

            if (problemAreaRecord != null)
            {
                problemAreaRecord.IsActive = false;

                this.uow.GenericRepository<ProblemArea>().Update(problemAreaRecord);
                this.uow.Save();
            }

            return problemAreaRecord;
        }

        //// <summary>
        ///// Add or Update Problem Area
        ///// </summary>
        ///// <param>ProblemArea problemArea</param>
        ///// <returns>ProblemArea. if record of ProblemArea is added or updated = success. else = failure</returns>  
        public ProblemArea AddUpdateProblemArea(ProblemArea problemArea)
        {
            var problemAreaRecord = this.uow.GenericRepository<ProblemArea>().Table().Where(x => x.ProblemAreaCode == problemArea.ProblemAreaCode).FirstOrDefault();

            if (problemAreaRecord == null)
            {
                problemAreaRecord = new ProblemArea();

                problemAreaRecord.ProblemAreaCode = problemArea.ProblemAreaCode;
                problemAreaRecord.ProblemAreaDescription = problemArea.ProblemAreaDescription;
                problemAreaRecord.OrderNo = problemArea.OrderNo;
                problemAreaRecord.IsActive = true;
                problemAreaRecord.CreatedDate = DateTime.Now;
                problemAreaRecord.CreatedBy = "User";

                this.uow.GenericRepository<ProblemArea>().Insert(problemAreaRecord);
            }
            else
            {
                problemAreaRecord.ProblemAreaDescription = problemArea.ProblemAreaDescription;
                problemAreaRecord.OrderNo = problemArea.OrderNo;
                problemAreaRecord.IsActive = true;
                problemAreaRecord.ModifiedDate = DateTime.Now;
                problemAreaRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ProblemArea>().Update(problemAreaRecord);
            }
            this.uow.Save();
            problemArea.ProblemAreaId = problemAreaRecord.ProblemAreaId;

            return problemArea;
        }

        #endregion

        #region Problem Type

        //// <summary>
        ///// Get All Problem Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemType>. if Collection of Problem Types = success. else = failure</returns>
        public List<ProblemType> GetProblemTypeList()
        {
            var ProblemTypes = this.uow.GenericRepository<ProblemType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return ProblemTypes;
        }

        //// <summary>
        ///// Get Problem Type by ID
        ///// </summary>
        ///// <param>int problemTypeID</param>
        ///// <returns>ProblemType. if record of ProblemType for given Id = success. else = failure</returns>
        public ProblemType GetProblemTypebyID(int problemTypeID)
        {
            var problemTypeRecord = this.uow.GenericRepository<ProblemType>().Table().Where(x => x.ProblemTypeId == problemTypeID).FirstOrDefault();

            return problemTypeRecord;
        }

        //// <summary>
        ///// Delete Problem Type by ID
        ///// </summary>
        ///// <param>int problemTypeID</param>
        ///// <returns>ProblemType. if record of ProblemType Deleted for Given ID = success. else = failure</returns>
        public ProblemType DeleteProblemTypeRecord(int problemTypeID)
        {
            var problemTypeRecord = this.uow.GenericRepository<ProblemType>().Table().Where(x => x.ProblemTypeId == problemTypeID).FirstOrDefault();

            if (problemTypeRecord != null)
            {
                problemTypeRecord.IsActive = false;

                this.uow.GenericRepository<ProblemType>().Update(problemTypeRecord);
                this.uow.Save();
            }

            return problemTypeRecord;
        }

        //// <summary>
        ///// Add or Update Problem Type
        ///// </summary>
        ///// <param>ProblemType problemType</param>
        ///// <returns>ProblemType. if record of ProblemType is added or updated = success. else = failure</returns>  
        public ProblemType AddUpdateProblemType(ProblemType problemType)
        {
            var problemTypeRecord = this.uow.GenericRepository<ProblemType>().Table().Where(x => x.ProblemTypeCode == problemType.ProblemTypeCode).FirstOrDefault();

            if (problemTypeRecord == null)
            {
                problemTypeRecord = new ProblemType();

                problemTypeRecord.ProblemTypeCode = problemType.ProblemTypeCode;
                problemTypeRecord.ProblemTypeDescription = problemType.ProblemTypeDescription;
                problemTypeRecord.OrderNo = problemType.OrderNo;
                problemTypeRecord.IsActive = true;
                problemTypeRecord.CreatedDate = DateTime.Now;
                problemTypeRecord.CreatedBy = "User";

                this.uow.GenericRepository<ProblemType>().Insert(problemTypeRecord);
            }
            else
            {
                problemTypeRecord.ProblemTypeDescription = problemType.ProblemTypeDescription;
                problemTypeRecord.OrderNo = problemType.OrderNo;
                problemTypeRecord.IsActive = true;
                problemTypeRecord.ModifiedDate = DateTime.Now;
                problemTypeRecord.ModifiedBy = "User";

                this.uow.GenericRepository<ProblemType>().Update(problemTypeRecord);
            }
            this.uow.Save();
            problemType.ProblemTypeId = problemTypeRecord.ProblemTypeId;

            return problemType;
        }

        #endregion

        #region Requested Procedure

        //// <summary>
        ///// Get All Requested Procedures
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RequestedProcedure>. if Collection of Requested Procedures = success. else = failure</returns>
        public List<RequestedProcedure> GetRequestedProcedureList()
        {
            var RequestedProcedures = this.uow.GenericRepository<RequestedProcedure>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return RequestedProcedures;
        }

        //// <summary>
        ///// Get Requested Procedure by ID
        ///// </summary>
        ///// <param>int requestedProcedureID</param>
        ///// <returns>RequestedProcedure. if record of RequestedProcedure for given Id = success. else = failure</returns>
        public RequestedProcedure GetRequestedProcedurebyID(int requestedProcedureID)
        {
            var requestedProcedureRecord = this.uow.GenericRepository<RequestedProcedure>().Table().Where(x => x.RequestedProcedureId == requestedProcedureID).FirstOrDefault();

            return requestedProcedureRecord;
        }

        //// <summary>
        ///// Delete Requested Procedure by ID
        ///// </summary>
        ///// <param>int requestedProcedureID</param>
        ///// <returns>RequestedProcedure. if record of RequestedProcedure Deleted for Given ID = success. else = failure</returns>
        public RequestedProcedure DeleteRequestedProcedureRecord(int requestedProcedureID)
        {
            var requestedProcedureRecord = this.uow.GenericRepository<RequestedProcedure>().Table().Where(x => x.RequestedProcedureId == requestedProcedureID).FirstOrDefault();

            if (requestedProcedureRecord != null)
            {
                requestedProcedureRecord.IsActive = false;

                this.uow.GenericRepository<RequestedProcedure>().Update(requestedProcedureRecord);
                this.uow.Save();
            }

            return requestedProcedureRecord;
        }

        //// <summary>
        ///// Add or Update Requested Procedure
        ///// </summary>
        ///// <param>RequestedProcedure requestedProcedure</param>
        ///// <returns>RequestedProcedure. if record of RequestedProcedure is added or updated = success. else = failure</returns>  
        public RequestedProcedure AddUpdateRequestedProcedure(RequestedProcedure requestedProcedure)
        {
            var requestedProcedureRecord = this.uow.GenericRepository<RequestedProcedure>().Table().Where(x => x.RequestedProcedureCode == requestedProcedure.RequestedProcedureCode).FirstOrDefault();

            if (requestedProcedureRecord == null)
            {
                requestedProcedureRecord = new RequestedProcedure();

                requestedProcedureRecord.RequestedProcedureCode = requestedProcedure.RequestedProcedureCode;
                requestedProcedureRecord.RequestedProcedureDescription = requestedProcedure.RequestedProcedureDescription;
                requestedProcedureRecord.OrderNo = requestedProcedure.OrderNo;
                requestedProcedureRecord.IsActive = true;
                requestedProcedureRecord.CreatedDate = DateTime.Now;
                requestedProcedureRecord.CreatedBy = "User";

                this.uow.GenericRepository<RequestedProcedure>().Insert(requestedProcedureRecord);
            }
            else
            {
                requestedProcedureRecord.RequestedProcedureDescription = requestedProcedure.RequestedProcedureDescription;
                requestedProcedureRecord.OrderNo = requestedProcedure.OrderNo;
                requestedProcedureRecord.IsActive = true;
                requestedProcedureRecord.ModifiedDate = DateTime.Now;
                requestedProcedureRecord.ModifiedBy = "User";

                this.uow.GenericRepository<RequestedProcedure>().Update(requestedProcedureRecord);
            }
            this.uow.Save();
            requestedProcedure.RequestedProcedureId = requestedProcedureRecord.RequestedProcedureId;

            return requestedProcedure;
        }

        #endregion

        #region Dispense Form

        //// <summary>
        ///// Get All Dispense Forms
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DispenseForm>. if Collection of Dispense Forms = success. else = failure</returns>
        public List<DispenseForm> GetDispenseFormList()
        {
            var DispenseForms = this.uow.GenericRepository<DispenseForm>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return DispenseForms;
        }

        //// <summary>
        ///// Get Dispense Form by ID
        ///// </summary>
        ///// <param>int dispenseFormID</param>
        ///// <returns>DispenseForm. if record of DispenseForm for given Id = success. else = failure</returns>
        public DispenseForm GetDispenseFormbyID(int dispenseFormID)
        {
            var dispenseFormRecord = this.uow.GenericRepository<DispenseForm>().Table().Where(x => x.DispenseFormID == dispenseFormID).FirstOrDefault();

            return dispenseFormRecord;
        }

        //// <summary>
        ///// Delete Dispense Form by ID
        ///// </summary>
        ///// <param>int dispenseFormID</param>
        ///// <returns>DispenseForm. if record of DispenseForm Deleted for Given ID = success. else = failure</returns>
        public DispenseForm DeleteDispenseFormRecord(int dispenseFormID)
        {
            var dispenseFormRecord = this.uow.GenericRepository<DispenseForm>().Table().Where(x => x.DispenseFormID == dispenseFormID).FirstOrDefault();

            if (dispenseFormRecord != null)
            {
                dispenseFormRecord.IsActive = false;

                this.uow.GenericRepository<DispenseForm>().Update(dispenseFormRecord);
                this.uow.Save();
            }

            return dispenseFormRecord;
        }

        //// <summary>
        ///// Add or Update Dispense Form
        ///// </summary>
        ///// <param>DispenseForm dispenseForm</param>
        ///// <returns>DispenseForm. if record of DispenseForm is added or updated = success. else = failure</returns>  
        public DispenseForm AddUpdateDispenseForm(DispenseForm dispenseForm)
        {
            var dispenseFormRecord = this.uow.GenericRepository<DispenseForm>().Table().Where(x => x.DispenseFormCode == dispenseForm.DispenseFormCode).FirstOrDefault();

            if (dispenseFormRecord == null)
            {
                dispenseFormRecord = new DispenseForm();

                dispenseFormRecord.DispenseFormCode = dispenseForm.DispenseFormCode;
                dispenseFormRecord.DispenseFormDescription = dispenseForm.DispenseFormDescription;
                dispenseFormRecord.OrderNo = dispenseForm.OrderNo;
                dispenseFormRecord.IsActive = true;
                dispenseFormRecord.CreatedDate = DateTime.Now;
                dispenseFormRecord.CreatedBy = "User";

                this.uow.GenericRepository<DispenseForm>().Insert(dispenseFormRecord);
            }
            else
            {
                dispenseFormRecord.DispenseFormDescription = dispenseForm.DispenseFormDescription;
                dispenseFormRecord.OrderNo = dispenseForm.OrderNo;
                dispenseFormRecord.IsActive = true;
                dispenseFormRecord.ModifiedDate = DateTime.Now;
                dispenseFormRecord.ModifiedBy = "User";

                this.uow.GenericRepository<DispenseForm>().Update(dispenseFormRecord);
            }
            this.uow.Save();
            dispenseForm.DispenseFormID = dispenseFormRecord.DispenseFormID;

            return dispenseForm;
        }

        #endregion

        #region Dosage Form

        //// <summary>
        ///// Get All Dosage Forms
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DosageForm>. if Collection of Dosage Forms = success. else = failure</returns>
        public List<DosageForm> GetDosageFormList()
        {
            var DosageForms = this.uow.GenericRepository<DosageForm>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return DosageForms;
        }

        //// <summary>
        ///// Get Dosage Form by ID
        ///// </summary>
        ///// <param>int dosageFormID</param>
        ///// <returns>DosageForm. if record of DosageForm for given Id = success. else = failure</returns>
        public DosageForm GetDosageFormbyID(int dosageFormID)
        {
            var dosageFormRecord = this.uow.GenericRepository<DosageForm>().Table().Where(x => x.DosageFormID == dosageFormID).FirstOrDefault();

            return dosageFormRecord;
        }

        //// <summary>
        ///// Delete Dosage Form by ID
        ///// </summary>
        ///// <param>int dosageFormID</param>
        ///// <returns>DosageForm. if record of DosageForm Deleted for Given ID = success. else = failure</returns>
        public DosageForm DeleteDosageFormRecord(int dosageFormID)
        {
            var dosageFormRecord = this.uow.GenericRepository<DosageForm>().Table().Where(x => x.DosageFormID == dosageFormID).FirstOrDefault();

            if (dosageFormRecord != null)
            {
                dosageFormRecord.IsActive = false;

                this.uow.GenericRepository<DosageForm>().Update(dosageFormRecord);
                this.uow.Save();
            }

            return dosageFormRecord;
        }

        //// <summary>
        ///// Add or Update Dosage Form
        ///// </summary>
        ///// <param>DosageForm dosageForm</param>
        ///// <returns>DosageForm. if record of DosageForm is added or updated = success. else = failure</returns>  
        public DosageForm AddUpdateDosageForm(DosageForm dosageForm)
        {
            var dosageFormRecord = this.uow.GenericRepository<DosageForm>().Table().Where(x => x.DosageFormCode == dosageForm.DosageFormCode).FirstOrDefault();

            if (dosageFormRecord == null)
            {
                dosageFormRecord = new DosageForm();

                dosageFormRecord.DosageFormCode = dosageForm.DosageFormCode;
                dosageFormRecord.DosageFormDescription = dosageForm.DosageFormDescription;
                dosageFormRecord.OrderNo = dosageForm.OrderNo;
                dosageFormRecord.IsActive = true;
                dosageFormRecord.CreatedDate = DateTime.Now;
                dosageFormRecord.CreatedBy = "User";

                this.uow.GenericRepository<DosageForm>().Insert(dosageFormRecord);
            }
            else
            {
                dosageFormRecord.DosageFormDescription = dosageForm.DosageFormDescription;
                dosageFormRecord.OrderNo = dosageForm.OrderNo;
                dosageFormRecord.IsActive = true;
                dosageFormRecord.ModifiedDate = DateTime.Now;
                dosageFormRecord.ModifiedBy = "User";

                this.uow.GenericRepository<DosageForm>().Update(dosageFormRecord);
            }
            this.uow.Save();
            dosageForm.DosageFormID = dosageFormRecord.DosageFormID;

            return dosageForm;
        }

        #endregion

        #region Prescription Order Type

        ///// <summary>
        ///// Get Prescription Order Type List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PrescriptionOrderType>. if Collection of PrescriptionOrderType = success. else = failure</returns>
        public List<PrescriptionOrderType> GetPrescriptionOrderTypeList()
        {
            var prescriptionTypes = this.uow.GenericRepository<PrescriptionOrderType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return prescriptionTypes;
        }

        ///// <summary>
        ///// Get Prescription Order Type Record by Id
        ///// </summary>
        ///// <param>int prescriptionOrderTypeId</param>
        ///// <returns>PrescriptionOrderType. if Record of PrescriptionOrderType by ID = success. else = failure</returns>
        public PrescriptionOrderType GetPrescriptionOrderTypebyID(int prescriptionOrderTypeId)
        {
            var prescriptionType = this.uow.GenericRepository<PrescriptionOrderType>().Table().Where(x => x.PrescriptionOrderTypeId == prescriptionOrderTypeId).FirstOrDefault();
            return prescriptionType;
        }

        ///// <summary>
        ///// Delete Prescription Order Type Record by Id
        ///// </summary>
        ///// <param>int prescriptionOrderTypeId</param>
        ///// <returns>PrescriptionOrderType. if Record of PrescriptionOrderType by ID = success. else = failure</returns>
        public PrescriptionOrderType DeletePrescriptionOrderTypeRecord(int prescriptionOrderTypeId)
        {
            var prescriptionType = this.uow.GenericRepository<PrescriptionOrderType>().Table().Where(x => x.PrescriptionOrderTypeId == prescriptionOrderTypeId).FirstOrDefault();

            if (prescriptionType != null)
            {
                prescriptionType.IsActive = false;

                this.uow.GenericRepository<PrescriptionOrderType>().Update(prescriptionType);
                this.uow.Save();
            }

            return prescriptionType;
        }

        //// <summary>
        ///// Add or Update Prescription Order Type
        ///// </summary>
        ///// <param>PrescriptionOrderType prescriptionOrderType</param>
        ///// <returns>PrescriptionOrderType. if record of PrescriptionOrderType is added or updated = success. else = failure</returns>  
        public PrescriptionOrderType AddUpdatePrescriptionOrderType(PrescriptionOrderType prescriptionOrderType)
        {
            var prescriptionType = this.uow.GenericRepository<PrescriptionOrderType>().Table().Where(x => x.PrescriptionOrderTypeCode == prescriptionOrderType.PrescriptionOrderTypeCode).FirstOrDefault();

            if (prescriptionType == null)
            {
                prescriptionType = new PrescriptionOrderType();

                prescriptionType.PrescriptionOrderTypeCode = prescriptionOrderType.PrescriptionOrderTypeCode;
                prescriptionType.PrescriptionOrderTypeDescription = prescriptionOrderType.PrescriptionOrderTypeCode;
                prescriptionType.OrderNo = prescriptionOrderType.OrderNo;
                prescriptionType.IsActive = true;
                prescriptionType.CreatedDate = DateTime.Now;
                prescriptionType.CreatedBy = "User";

                this.uow.GenericRepository<PrescriptionOrderType>().Insert(prescriptionType);
            }
            else
            {
                prescriptionType.PrescriptionOrderTypeDescription = prescriptionOrderType.PrescriptionOrderTypeCode;
                prescriptionType.OrderNo = prescriptionOrderType.OrderNo;
                prescriptionType.IsActive = true;
                prescriptionType.ModifiedDate = DateTime.Now;
                prescriptionType.ModifiedBy = "User";

                this.uow.GenericRepository<PrescriptionOrderType>().Update(prescriptionType);
            }
            this.uow.Save();
            prescriptionOrderType.PrescriptionOrderTypeId = prescriptionType.PrescriptionOrderTypeId;

            return prescriptionOrderType;
        }

        #endregion

        #region Medication Units

        ///// <summary>
        ///// Get Medication Unit List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationUnits>. if Collection of MedicationUnits = success. else = failure</returns>
        public List<MedicationUnits> GetMedicationUnitList()
        {
            var medicationUnits = this.uow.GenericRepository<MedicationUnits>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return medicationUnits;
        }

        ///// <summary>
        ///// Get Medication Unit by ID
        ///// </summary>
        ///// <param>int medicationUnitsId</param>
        ///// <returns>MedicationUnits. if Record of MedicationUnits by ID = success. else = failure</returns>
        public MedicationUnits GetMedicationUnitbyID(int medicationUnitsId)
        {
            var medicationUnit = this.uow.GenericRepository<MedicationUnits>().Table().Where(x => x.MedicationUnitsId == medicationUnitsId).FirstOrDefault();
            return medicationUnit;
        }

        ///// <summary>
        ///// Delete Medication Unit Record by ID
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>MedicationUnits. if Record of MedicationUnits is Deleted = success. else = failure</returns>
        public MedicationUnits DeleteMedicationUnit(int medicationUnitsId)
        {
            var medicationUnit = this.uow.GenericRepository<MedicationUnits>().Table().Where(x => x.MedicationUnitsId == medicationUnitsId).FirstOrDefault();

            if (medicationUnit != null)
            {
                medicationUnit.IsActive = false;
                this.uow.GenericRepository<MedicationUnits>().Update(medicationUnit);
                this.uow.Save();
            }

            return medicationUnit;
        }

        //// <summary>
        ///// Add or Update Medication Unit
        ///// </summary>
        ///// <param>MedicationUnits medicationUnits</param>
        ///// <returns>MedicationUnits. if record of MedicationUnits is added or updated = success. else = failure</returns>  
        public MedicationUnits AddUpdateMedicationUnit(MedicationUnits medicationUnits)
        {
            var medicationUnit = this.uow.GenericRepository<MedicationUnits>().Table().Where(x => x.MedicationUnitsCode == medicationUnits.MedicationUnitsCode).FirstOrDefault();

            if (medicationUnit == null)
            {
                medicationUnit = new MedicationUnits();

                medicationUnit.MedicationUnitsCode = medicationUnits.MedicationUnitsCode;
                medicationUnit.MedicationUnitsDescription = medicationUnits.MedicationUnitsDescription;
                medicationUnit.OrderNo = medicationUnits.OrderNo;
                medicationUnit.IsActive = true;
                medicationUnit.CreatedDate = DateTime.Now;
                medicationUnit.CreatedBy = "User";

                this.uow.GenericRepository<MedicationUnits>().Insert(medicationUnit);
            }
            else
            {
                medicationUnit.MedicationUnitsDescription = medicationUnits.MedicationUnitsDescription;
                medicationUnit.OrderNo = medicationUnits.OrderNo;
                medicationUnit.IsActive = true;
                medicationUnit.ModifiedDate = DateTime.Now;
                medicationUnit.ModifiedBy = "User";

                this.uow.GenericRepository<MedicationUnits>().Update(medicationUnit);
            }
            this.uow.Save();
            medicationUnits.MedicationUnitsId = medicationUnit.MedicationUnitsId;

            return medicationUnits;
        }

        #endregion

        #region Medication Route

        ///// <summary>
        ///// Get Medication Route List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of Medication Route = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRouteList()
        {
            var medicationRoutes = this.uow.GenericRepository<MedicationRoute>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return medicationRoutes;
        }

        ///// <summary>
        ///// Get Medication Route by ID
        ///// </summary>
        ///// <param>int medicationRouteId</param>
        ///// <returns>MedicationRoute. if Record of Medication Route by ID = success. else = failure</returns>
        public MedicationRoute GetMedicationRoutebyID(int medicationRouteId)
        {
            var medicationRoute = this.uow.GenericRepository<MedicationRoute>().Table().Where(x => x.RouteId == medicationRouteId).FirstOrDefault();
            return medicationRoute;
        }

        ///// <summary>
        ///// Delete Medication Route Record by ID
        ///// </summary>
        ///// <param>int medicationRouteId</param>
        ///// <returns>MedicationRoute. if Record of Medication Route is Deleted = success. else = failure</returns>
        public MedicationRoute DeleteMedicationRoute(int medicationRouteId)
        {
            var medicationRoute = this.uow.GenericRepository<MedicationRoute>().Table().Where(x => x.RouteId == medicationRouteId).FirstOrDefault();

            if (medicationRoute != null)
            {
                medicationRoute.IsActive = false;
                this.uow.GenericRepository<MedicationRoute>().Update(medicationRoute);
                this.uow.Save();
            }

            return medicationRoute;
        }

        //// <summary>
        ///// Add or Update Medication Route
        ///// </summary>
        ///// <param>MedicationRoute medicationRouteData</param>
        ///// <returns>MedicationRoute. if record of Medication Route is added or updated = success. else = failure</returns>  
        public MedicationRoute AddUpdateMedicationRoute(MedicationRoute medicationRouteData)
        {
            var medicationRoute = this.uow.GenericRepository<MedicationRoute>().Table().Where(x => x.RouteCode == medicationRouteData.RouteCode).FirstOrDefault();

            if (medicationRoute == null)
            {
                medicationRoute = new MedicationRoute();

                medicationRoute.RouteCode = medicationRouteData.RouteCode;
                medicationRoute.RouteDescription = medicationRouteData.RouteDescription;
                medicationRoute.OrderNo = medicationRouteData.OrderNo;
                medicationRoute.IsActive = true;
                medicationRoute.CreatedDate = DateTime.Now;
                medicationRoute.CreatedBy = "User";

                this.uow.GenericRepository<MedicationRoute>().Insert(medicationRoute);
            }
            else
            {
                medicationRoute.RouteDescription = medicationRouteData.RouteDescription;
                medicationRoute.OrderNo = medicationRouteData.OrderNo;
                medicationRoute.IsActive = true;
                medicationRoute.ModifiedDate = DateTime.Now;
                medicationRoute.ModifiedBy = "User";

                this.uow.GenericRepository<MedicationRoute>().Update(medicationRoute);
            }
            this.uow.Save();
            medicationRouteData.RouteId = medicationRoute.RouteId;

            return medicationRouteData;
        }

        #endregion

        #region Medication Status

        ///// <summary>
        ///// Get Medication Status list
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationStatus>. if Collection of MedicationStatus = success. else = failure</returns>
        public List<MedicationStatus> GetMedicationStatusList()
        {
            var medicationStatusList = this.uow.GenericRepository<MedicationStatus>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return medicationStatusList;
        }

        ///// <summary>
        ///// Get Medication Status Record
        ///// </summary>
        ///// <param>int medicationStatusId</param>
        ///// <returns>MedicationStatus. if Record of MedicationStatus by ID = success. else = failure</returns>
        public MedicationStatus GetMedicationStatusbyID(int medicationStatusId)
        {
            var medicationStatusList = this.uow.GenericRepository<MedicationStatus>().Table().Where(x => x.MedicationStatusId == medicationStatusId).FirstOrDefault();
            return medicationStatusList;
        }

        ///// <summary>
        ///// Delete Medication Status Record
        ///// </summary>
        ///// <param>int medicationStatusId</param>
        ///// <returns>MedicationStatus. if Record of MedicationStatus for given ID is deleted = success. else = failure</returns>
        public MedicationStatus DeleteMedicationStatusbyID(int medicationStatusId)
        {
            var medicationStatusRecord = this.uow.GenericRepository<MedicationStatus>().Table().Where(x => x.MedicationStatusId == medicationStatusId).FirstOrDefault();

            if (medicationStatusRecord != null)
            {
                medicationStatusRecord.IsActive = false;
                this.uow.GenericRepository<MedicationStatus>().Update(medicationStatusRecord);
                this.uow.Save();
            }

            return medicationStatusRecord;
        }

        //// <summary>
        ///// Add or Update Medication Status
        ///// </summary>
        ///// <param>MedicationStatus medicationStatusData</param>
        ///// <returns>MedicationStatus. if record of Medication Status is added or updated = success. else = failure</returns>  
        public MedicationStatus AddUpdateMedicationStatus(MedicationStatus medicationStatusData)
        {
            var medicationStatus = this.uow.GenericRepository<MedicationStatus>().Table().Where(x => x.MedicationStatusCode == medicationStatusData.MedicationStatusCode).FirstOrDefault();

            if (medicationStatus == null)
            {
                medicationStatus = new MedicationStatus();

                medicationStatus.MedicationStatusCode = medicationStatusData.MedicationStatusCode;
                medicationStatus.MedicationstatusDescription = medicationStatusData.MedicationstatusDescription;
                medicationStatus.OrderNo = medicationStatusData.OrderNo;
                medicationStatus.IsActive = true;
                medicationStatus.CreatedDate = DateTime.Now;
                medicationStatus.CreatedBy = "User";

                this.uow.GenericRepository<MedicationStatus>().Insert(medicationStatus);
            }
            else
            {
                medicationStatus.MedicationstatusDescription = medicationStatusData.MedicationstatusDescription;
                medicationStatus.OrderNo = medicationStatusData.OrderNo;
                medicationStatus.IsActive = true;
                medicationStatus.ModifiedDate = DateTime.Now;
                medicationStatus.ModifiedBy = "User";

                this.uow.GenericRepository<MedicationStatus>().Update(medicationStatus);
            }
            this.uow.Save();
            medicationStatusData.MedicationStatusId = medicationStatus.MedicationStatusId;

            return medicationStatusData;
        }

        #endregion

        #endregion

        #region Departments

        ///// <summary>
        ///// Get All Departments name
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Departments>. if Collection of Departments = success. else = failure</returns>
        public List<Departments> GetDepartmentList()
        {
            var departments = this.uow.GenericRepository<Departments>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();

            return departments;
        }

        ///// <summary>
        ///// Get Department by ID
        ///// </summary>
        ///// <param>int departmentID</param>
        ///// <returns>Departments. if Record of Department by ID = success. else = failure</returns>
        public Departments GetDepartmentbyID(int departmentID)
        {
            var department = this.uow.GenericRepository<Departments>().Table().Where(x => x.DepartmentID == departmentID).FirstOrDefault();

            return department;
        }

        ///// <summary>
        ///// Delete Department Record
        ///// </summary>
        ///// <param>int departmentID</param>
        ///// <returns>Departments. if Record of Department for given ID is deleted = success. else = failure</returns>
        public Departments DeleteDepartmentRecord(int departmentID)
        {
            var department = this.uow.GenericRepository<Departments>().Table().Where(x => x.DepartmentID == departmentID).FirstOrDefault();

            if (department != null)
            {
                department.IsActive = false;
                this.uow.GenericRepository<Departments>().Update(department);
                this.uow.Save();
            }

            return department;
        }

        ///// <summary>
        ///// Add or Update Department Record
        ///// </summary>
        ///// <param>Departments department</param>
        ///// <returns>Departments. if Record of Department added or updated = success. else = failure</returns>
        public Departments AddUpdateDepartment(Departments departmentData)
        {
            var department = this.uow.GenericRepository<Departments>().Table().Where(x => x.DepartCode == departmentData.DepartCode).FirstOrDefault();

            if (department == null)
            {
                department = new Departments();

                department.DepartCode = departmentData.DepartCode;
                department.DepartmentDesc = departmentData.DepartmentDesc;
                department.OrderNo = departmentData.OrderNo;
                department.IsActive = true;
                department.Createddate = DateTime.Now;
                department.CreatedBy = "User";

                this.uow.GenericRepository<Departments>().Insert(department);
            }
            else
            {
                department.DepartmentDesc = departmentData.DepartmentDesc;
                department.OrderNo = departmentData.OrderNo;
                department.IsActive = true;
                department.ModifiedDate = DateTime.Now;
                department.ModifiedBy = "User";

                this.uow.GenericRepository<Departments>().Update(department);
            }
            this.uow.Save();
            departmentData.DepartmentID = department.DepartmentID;

            return departmentData;
        }

        #endregion

        #region UserType

        ///// <summary>
        ///// Get UserType List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UserType>. if Collection of UserType = success. else = failure</returns>
        public List<UserType> GetUserType()
        {
            var userType = this.uow.GenericRepository<UserType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return userType;
        }

        ///// <summary>
        ///// Get UserType Record by ID
        ///// </summary>
        ///// <param>int userTypeId</param>
        ///// <returns>UserType. if Record of UserType = success. else = failure</returns>
        public UserType GetUserTypeRecordbyID(int userTypeId)
        {
            var userType = this.uow.GenericRepository<UserType>().Table().Where(x => x.UserTypeId == userTypeId).FirstOrDefault();
            return userType;
        }

        //// <summary>
        ///// Delete UserTypeId by ID
        ///// </summary>
        ///// <param>int userTypeId</param>
        ///// <returns>UserTypeId. if record of UserTypeId Deleted for Given ID = success. else = failure</returns>
        public UserType DeleteUserTypeRecord(int userTypeId)
        {
            var userType = this.uow.GenericRepository<UserType>().Table().Where(x => x.UserTypeId == userTypeId).FirstOrDefault();

            if (userType != null)
            {
                userType.IsActive = false;

                this.uow.GenericRepository<UserType>().Update(userType);
                this.uow.Save();
            }

            return userType;
        }

        //// <summary>
        ///// Add or Update userType
        ///// </summary>
        ///// <param>UserType userType</param>
        ///// <returns>UserType. if record of UserType is added or updated = success. else = failure</returns>  
        public UserType AddUpdateUserType(UserType userType)
        {
            var userTypeData = this.uow.GenericRepository<UserType>().Table().Where(x => x.UserTypeCode == userType.UserTypeCode).FirstOrDefault();

            if (userTypeData == null)
            {
                userTypeData = new UserType();

                userTypeData.UserTypeCode = userType.UserTypeCode;
                userTypeData.UserTypeDescription = userType.UserTypeDescription;
                userTypeData.OrderNo = userType.OrderNo;
                userTypeData.IsActive = true;
                userTypeData.CreatedDate = DateTime.Now;
                userTypeData.CreatedBy = "User";

                this.uow.GenericRepository<UserType>().Insert(userTypeData);
            }
            else
            {
                userTypeData.UserTypeDescription = userType.UserTypeDescription;
                userTypeData.OrderNo = userType.OrderNo;
                userTypeData.IsActive = true;
                userTypeData.ModifiedDate = DateTime.Now;
                userTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<UserType>().Update(userTypeData);
            }
            this.uow.Save();
            userType.UserTypeId = userTypeData.UserTypeId;

            return userType;
        }

        #endregion

        # region EmpExtracurricularActivitiesType

        ///// <summary>
        ///// Get EmpExtracurricularActivitiesType List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<EmpExtracurricularActivitiesType>. if Collection of EmpExtracurricularActivitiesType = success. else = failure</returns>
        public List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType()
        {
            var Type = this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Table().Where(x => x.IsActive != false).OrderBy(x => x.OrderNo).ToList();
            return Type;
        }

        ///// <summary>
        ///// Get EmpExtracurricularActivitiesType Record by ID
        ///// </summary>
        ///// <param>int ActivityTypeId</param>
        ///// <returns>EmpExtracurricularActivitiesType. if Collection of EmpExtracurricularActivitiesType = success. else = failure</returns>
        public EmpExtracurricularActivitiesType GetEmpExtracurricularActivitiesTypeRecordbyID(int activityTypeId)
        {
            var Type = this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Table().Where(x => x.ActivityTypeId == activityTypeId).FirstOrDefault();
            return Type;
        }

        //// <summary>
        ///// Delete ActivityTypeId by ID
        ///// </summary>
        ///// <param>int activityTypeId</param>
        ///// <returns>EmpExtracurricularActivitiesType. if record of EmpExtracurricularActivitiesType Deleted for Given ID = success. else = failure</returns>
        public EmpExtracurricularActivitiesType DeleteEmpExtracurricularActivitiesTypeRecord(int activityTypeId)
        {
            var Type = this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Table().Where(x => x.ActivityTypeId == activityTypeId).FirstOrDefault();

            if (Type != null)
            {
                Type.IsActive = false;

                this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Update(Type);
                this.uow.Save();
            }

            return Type;
        }

        //// <summary>
        ///// Add or Update EmpExtracurricularActivitiesType
        ///// </summary>
        ///// <param>EmpExtracurricularActivitiesType EmpExtracurricularActivitiesType</param>
        ///// <returns>EmpExtracurricularActivitiesType. if record of EmpExtracurricularActivitiesType is added or updated = success. else = failure</returns>  
        public EmpExtracurricularActivitiesType AddUpdateEmpExtracurricularActivitiesType(EmpExtracurricularActivitiesType ActivityType)
        {
            var ActivityTypeData = this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Table().Where(x => x.ActivityTypeCode == ActivityType.ActivityTypeCode).FirstOrDefault();

            if (ActivityTypeData == null)
            {
                ActivityTypeData = new EmpExtracurricularActivitiesType();

                ActivityTypeData.ActivityTypeCode = ActivityType.ActivityTypeCode;
                ActivityTypeData.ActivityTypeDescription = ActivityType.ActivityTypeDescription;
                ActivityTypeData.OrderNo = ActivityType.OrderNo;
                ActivityTypeData.IsActive = true;
                ActivityTypeData.CreatedDate = DateTime.Now;
                ActivityTypeData.CreatedBy = "User";

                this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Insert(ActivityTypeData);
            }
            else
            {
                ActivityTypeData.ActivityTypeDescription = ActivityType.ActivityTypeDescription;
                ActivityTypeData.OrderNo = ActivityType.OrderNo;
                ActivityTypeData.IsActive = true;
                ActivityTypeData.ModifiedDate = DateTime.Now;
                ActivityTypeData.ModifiedBy = "User";

                this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Update(ActivityTypeData);
            }
            this.uow.Save();
            ActivityType.ActivityTypeId = ActivityTypeData.ActivityTypeId;

            return ActivityType;
        }

        #endregion

        #region E-Lab Master status

        ///// <summary>
        ///// Get Lab Master Status List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabMasterStatus>. if Collection of eLab Master Status = success. else = failure</returns>
        public List<eLabMasterStatus> GetELabStatusList()
        {
            var eLabStatusList = this.uow.GenericRepository<eLabMasterStatus>().Table().Where(x => x.IsActive != false).ToList();

            return eLabStatusList;
        }

        ///// <summary>
        ///// Get Lab Master Status Record by ID
        ///// </summary>
        ///// <param>int eLabMasterStatusID</param>
        ///// <returns>eLabMasterStatus. if record of eLab Master Status for given id = success. else = failure</returns>
        public eLabMasterStatus GetELabStatusRecordbyId(int eLabMasterStatusID)
        {
            var eLabStatus = this.uow.GenericRepository<eLabMasterStatus>().Table().Where(x => x.LabMasterStatusId == eLabMasterStatusID).FirstOrDefault();

            return eLabStatus;
        }

        ///// <summary>
        ///// Delete Lab Master Status Record by ID
        ///// </summary>
        ///// <param>int eLabMasterStatusID</param>
        ///// <returns>eLabMasterStatus. if record of eLab Master Status Deleted for given id = success. else = failure</returns>
        public eLabMasterStatus DeleteELabStatusRecordbyId(int eLabMasterStatusID)
        {
            var eLabStatus = this.uow.GenericRepository<eLabMasterStatus>().Table().Where(x => x.LabMasterStatusId == eLabMasterStatusID).FirstOrDefault();

            if (eLabStatus != null)
            {
                eLabStatus.IsActive = false;

                this.uow.GenericRepository<eLabMasterStatus>().Update(eLabStatus);
                this.uow.Save();
            }

            return eLabStatus;
        }

        //// <summary>
        ///// Add or Update eLab Master Status
        ///// </summary>
        ///// <param>eLabMasterStatus elabMasterStatusData</param>
        ///// <returns>eLabMasterStatus. if record of eLabMaster Status is added or updated = success. else = failure</returns>  
        public eLabMasterStatus AddUpdateELabMasterStatus(eLabMasterStatus elabMasterStatusData)
        {
            var elabMasterStatus = this.uow.GenericRepository<eLabMasterStatus>().Table().Where(x => x.LabMasterStatusCode == elabMasterStatusData.LabMasterStatusCode).FirstOrDefault();

            if (elabMasterStatus == null)
            {
                elabMasterStatus = new eLabMasterStatus();

                elabMasterStatus.LabMasterStatusCode = elabMasterStatusData.LabMasterStatusCode;
                elabMasterStatus.LabMasterStatusDescription = elabMasterStatusData.LabMasterStatusDescription;
                elabMasterStatus.OrderNo = elabMasterStatusData.OrderNo;
                elabMasterStatus.IsActive = true;
                elabMasterStatus.CreatedDate = DateTime.Now;
                elabMasterStatus.CreatedBy = "User";

                this.uow.GenericRepository<eLabMasterStatus>().Insert(elabMasterStatus);
            }
            else
            {
                elabMasterStatus.LabMasterStatusDescription = elabMasterStatusData.LabMasterStatusDescription;
                elabMasterStatus.OrderNo = elabMasterStatusData.OrderNo;
                elabMasterStatus.IsActive = true;
                elabMasterStatus.ModifiedDate = DateTime.Now;
                elabMasterStatus.ModifiedBy = "User";

                this.uow.GenericRepository<eLabMasterStatus>().Update(elabMasterStatus);
            }
            this.uow.Save();
            elabMasterStatusData.LabMasterStatusId = elabMasterStatus.LabMasterStatusId;

            return elabMasterStatusData;
        }

        #endregion

        #region Billing Master status

        ///// <summary>
        ///// Get Billing Master Status List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingMasterStatus>. if Collection of Billing Master Status = success. else = failure</returns>
        public List<BillingMasterStatus> GetBillingStatusList()
        {
            var billingStatusList = this.uow.GenericRepository<BillingMasterStatus>().Table().Where(x => x.IsActive != false).ToList();

            return billingStatusList;
        }

        ///// <summary>
        ///// Get Billing Master Status Record by ID
        ///// </summary>
        ///// <param>int BillingMasterStatusID</param>
        ///// <returns>BillingMasterStatus. if record of Billing Master Status for given id = success. else = failure</returns>
        public BillingMasterStatus GetBillingStatusRecordbyId(int BillingMasterStatusID)
        {
            var billingStatus = this.uow.GenericRepository<BillingMasterStatus>().Table().Where(x => x.BillingMasterStatusId == BillingMasterStatusID).FirstOrDefault();

            return billingStatus;
        }

        ///// <summary>
        ///// Delete Billing Master Status Record by ID
        ///// </summary>
        ///// <param>int BillingMasterStatusID</param>
        ///// <returns>BillingMasterStatus. if record of Billing Master Status Deleted for given id = success. else = failure</returns>
        public BillingMasterStatus DeleteBillingStatusRecordbyId(int BillingMasterStatusID)
        {
            var billingStatus = this.uow.GenericRepository<BillingMasterStatus>().Table().Where(x => x.BillingMasterStatusId == BillingMasterStatusID).FirstOrDefault();

            if (billingStatus != null)
            {
                billingStatus.IsActive = false;

                this.uow.GenericRepository<BillingMasterStatus>().Update(billingStatus);
                this.uow.Save();
            }

            return billingStatus;
        }

        //// <summary>
        ///// Add or Update Billing Master Status
        ///// </summary>
        ///// <param>BillingMasterStatus billingMasterStatusData</param>
        ///// <returns>BillingMasterStatus. if record of BillingMaster Status is added or updated = success. else = failure</returns>  
        public BillingMasterStatus AddUpdateBillingMasterStatus(BillingMasterStatus billingMasterStatusData)
        {
            var billingMasterStatus = this.uow.GenericRepository<BillingMasterStatus>().Table().Where(x => x.BillingMasterStatusCode == billingMasterStatusData.BillingMasterStatusCode).FirstOrDefault();

            if (billingMasterStatus == null)
            {
                billingMasterStatus = new BillingMasterStatus();

                billingMasterStatus.BillingMasterStatusCode = billingMasterStatusData.BillingMasterStatusCode;
                billingMasterStatus.BillingMasterStatusDescription = billingMasterStatusData.BillingMasterStatusDescription;
                billingMasterStatus.OrderNo = billingMasterStatusData.OrderNo;
                billingMasterStatus.IsActive = true;
                billingMasterStatus.CreatedDate = DateTime.Now;
                billingMasterStatus.CreatedBy = "User";

                this.uow.GenericRepository<BillingMasterStatus>().Insert(billingMasterStatus);
            }
            else
            {
                billingMasterStatus.BillingMasterStatusDescription = billingMasterStatusData.BillingMasterStatusDescription;
                billingMasterStatus.OrderNo = billingMasterStatusData.OrderNo;
                billingMasterStatus.IsActive = true;
                billingMasterStatus.ModifiedDate = DateTime.Now;
                billingMasterStatus.ModifiedBy = "User";

                this.uow.GenericRepository<BillingMasterStatus>().Update(billingMasterStatus);
            }
            this.uow.Save();
            billingMasterStatusData.BillingMasterStatusId = billingMasterStatus.BillingMasterStatusId;

            return billingMasterStatusData;
        }

        #endregion
              
        #region Roles

        ///// <summary>
        ///// Get Roles List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Roles>. if Collection of Roles = success. else = failure</returns>
        public List<Roles> GetRolesList()
        {
            var rolesList = this.uow.GenericRepository<Roles>().Table().ToList();

            return rolesList;
        }

        ///// <summary>
        ///// Get Roles Record by ID
        ///// </summary>
        ///// <param>int roleID</param>
        ///// <returns>Roles. if record of Roles for given id = success. else = failure</returns>
        public Roles GetRoleRecordbyId(int roleID)
        {
            var role = this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == roleID).FirstOrDefault();

            return role;
        }

        /////// <summary>
        /////// Delete Role Record by ID
        /////// </summary>
        /////// <param>int roleID</param>
        /////// <returns>Roles. if record of Roles Deleted for given id = success. else = failure</returns>
        //public Roles DeleteRolesRecordbyId(int roleID)
        //{
        //    var role = this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == roleID).FirstOrDefault();

        //    if (role != null)
        //    {
        //        role.IsActive = false;

        //        this.uow.GenericRepository<Roles>().Update(role);
        //        this.uow.Save();
        //    }

        //    return role;
        //}

        //// <summary>
        ///// Add or Update Role
        ///// </summary>
        ///// <param>Roles roleData</param>
        ///// <returns>Roles. if record of Roles is added or updated = success. else = failure</returns>  
        public Roles AddUpdateRole(Roles roleData)
        {
            var roleRecord = this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleName.ToLower().Trim() == roleData.RoleName.ToLower().Trim()).FirstOrDefault();

            if (roleRecord == null)
            {
                roleRecord = new Roles();

                roleRecord.RoleName = roleData.RoleName;
                roleRecord.RoleDescription = roleData.RoleDescription;
                roleRecord.OrderNo = roleData.OrderNo;
                roleRecord.Createddate = DateTime.Now;
                roleRecord.Createdby = "User";

                this.uow.GenericRepository<Roles>().Insert(roleRecord);
            }
            else
            {
                roleRecord.RoleDescription = roleData.RoleDescription;
                roleRecord.OrderNo = roleData.OrderNo;
                roleRecord.Modifieddate = DateTime.Now;
                roleRecord.Modifiedby = "User";

                this.uow.GenericRepository<Roles>().Update(roleRecord);
            }
            this.uow.Save();
            roleData.RoleId = roleRecord.RoleId;

            return roleData;
        }

        #endregion

        #region users & roles

        ///// <summary>
        ///// Get User Roles
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AspNetUsers>. if Collection of AspNetUsers = success. else = failure</returns>
        public List<AspNetUsers> GetUsersforRoleSetup(string searchKey)
        {
            var dBname = this.httpContextAccessor.HttpContext.Request.Headers["DatabaseName"];

            var data = (from ten in this.gUow.GlobalGenericRepository<Tenants>().Table().Where(x => x.Tenantdbname.ToLower().Trim() == dBname.ToString().ToLower().Trim())
                        join tenSetup in this.gUow.GlobalGenericRepository<UserTenantSetup>().Table()
                        on ten.TenantId equals tenSetup.TenantId
                        join users in this.gUow.GlobalGenericRepository<AspNetUsers>().Table()
                        on tenSetup.UserId.ToLower().Trim() equals users.Id.ToLower().Trim()
                        where (searchKey == null
                        || (users.UserName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || users.Email.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                        )
                        select users).ToList();

            return data;
        }

        //// <summary>
        ///// Add or Update User Role
        ///// </summary>
        ///// <param>userrole userRoleData</param>
        ///// <returns>userrole. if record of userrole is added or updated = success. else = failure</returns>  
        public userroleModel AddUpdateUserrole(userroleModel userRoleData)
        {
            var userRecord = this.uow.GenericRepository<userrole>().Table().
                            Where(x => x.Userid.ToLower().Trim() == userRoleData.Userid.ToLower().Trim()
                            & x.Roleid == userRoleData.Roleid).FirstOrDefault();

            if (userRecord == null)
            {
                userRecord = new userrole();

                userRecord.Userid = userRoleData.Userid;
                userRecord.Roleid = userRoleData.Roleid;
                userRecord.Deleted = false;
                userRecord.Createddate = DateTime.Now;
                userRecord.Createdby = "User";

                this.uow.GenericRepository<userrole>().Insert(userRecord);
            }
            else
            {
                //userRecord.Userid = userRoleData.Userid;
                userRecord.Roleid = userRoleData.Roleid;
                userRecord.Deleted = false;
                userRecord.Modifieddate = DateTime.Now;
                userRecord.Modifiedby = "User";

                this.uow.GenericRepository<userrole>().Update(userRecord);
            }
            this.uow.Save();
            userRoleData.Userroleid = userRecord.Userroleid;

            return userRoleData;
        }

        //// <summary>
        ///// Add or Update User Roles
        ///// </summary>
        ///// <param>IEnumerable<userroleModel> userRoleCollection</param>
        ///// <returns>List<userroleModel>. if records of userrole is added or updated = success. else = failure</returns>  
        public List<userroleModel> AddUpdateUserRoles(IEnumerable<userroleModel> userRoleCollection)
        {
            List<userroleModel> userRecords = new List<userroleModel>();

            if (userRoleCollection.Count() > 0)
            {
                var roleRecords = this.uow.GenericRepository<userrole>().Table().
                                    Where(x => x.Userid.ToLower().Trim() == userRoleCollection.FirstOrDefault().Userid.ToLower().Trim()).ToList();
                userroleModel Record = new userroleModel();

                if (roleRecords.Count() == 0)
                {
                    foreach (var data in userRoleCollection)
                    {
                        Record = this.AddUpdateUserrole(data);

                        userRecords.Add(Record);
                    }
                }
                else
                {
                    foreach (var set in roleRecords)
                    {
                        this.uow.GenericRepository<userrole>().Delete(set);
                    }
                    this.uow.Save();

                    foreach (var data in userRoleCollection)
                    {
                        Record = this.AddUpdateUserrole(data);

                        userRecords.Add(Record);
                    }
                }
            }

            return userRecords;
        }

        ///// <summary>
        ///// Get User Roles
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<userrole>. if Collection of userrole = success. else = failure</returns>
        public List<userroleModel> GetRolesForUserbyId(string UserId)
        {
            var userRoles = (from uRole in this.uow.GenericRepository<userrole>().Table().
                             Where(x => x.Userid.ToLower().Trim() == UserId.ToLower().Trim() & x.Deleted != true)
                             join roles in this.uow.GenericRepository<Roles>().Table()
                             on uRole.Roleid equals roles.RoleId

                             select new
                             {
                                 uRole.Userroleid,
                                 uRole.Userid,
                                 uRole.Roleid,
                                 roles.RoleName,
                                 roles.RoleDescription

                             }).AsEnumerable().Select(URM => new userroleModel
                             {
                                 Userroleid = URM.Userroleid,
                                 Userid = URM.Userid,
                                 Roleid = URM.Roleid,
                                 RoleName = URM.RoleName + " - " + URM.RoleDescription

                             }).ToList();

            return userRoles;
        }

        #endregion

        #region Facility

        //// <summary>
        ///// Get Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Speciality>. if Collection of Speciality = success. else = failure</returns>
        public List<Speciality> GetAllSpecialities()
        {
            var specialities = this.gUow.GlobalGenericRepository<Speciality>().Table().ToList();

            return specialities;
        }

        //// <summary>
        ///// Get Facility
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Gender>. if Collection of Facility = success. else = failure</returns>
        public List<FacilityModel> GetAllFacilities()
        {
            var facilities = (from facData in this.uow.GenericRepository<Facility>().Table()
                              select new
                              {
                                  facData.FacilityId,
                                  facData.FacilityName,
                                  facData.FacilityNumber,
                                  facData.SpecialityId,
                                  facData.AddressLine1,
                                  facData.AddressLine2,
                                  facData.City,
                                  facData.State,
                                  facData.Country,
                                  facData.PINCode,
                                  facData.Telephone,
                                  facData.AlternativeTelphone,
                                  facData.Email

                              }).AsEnumerable().Select(FAC => new FacilityModel
                              {
                                  FacilityId = FAC.FacilityId,
                                  FacilityName = FAC.FacilityName,
                                  FacilityNumber = FAC.FacilityNumber,
                                  SpecialityId = FAC.SpecialityId,
                                  Specialities = (FAC.SpecialityId != null && FAC.SpecialityId != "") ? (FAC.SpecialityId.Contains(",") ? (this.GetSpecialitiesforFacility(FAC.SpecialityId))
                                                    : this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(FAC.SpecialityId)).SpecialityDescription
                                                    ) : "",
                                  SpecialityArray = (FAC.SpecialityId != null && FAC.SpecialityId != "") ? this.GetSpecialityArrayforFacility(FAC.SpecialityId) : new List<int>(),
                                  AddressLine1 = FAC.AddressLine1,
                                  AddressLine2 = FAC.AddressLine2,
                                  City = FAC.City,
                                  State = FAC.State,
                                  Country = FAC.Country,
                                  PINCode = FAC.PINCode,
                                  Telephone = FAC.Telephone,
                                  AlternativeTelphone = FAC.AlternativeTelphone,
                                  Email = FAC.Email

                              }).ToList();

            return facilities;
        }

        //// <summary>
        ///// Get Facility by ID
        ///// </summary>
        ///// <param>int facilityId</param>
        ///// <returns>Facility. if record of Facility for given Id = success. else = failure</returns>
        public FacilityModel GetFacilitybyID(int facilityId)
        {
            var facilityRecord = (from facData in this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == facilityId)
                                  select new
                                  {
                                      facData.FacilityId,
                                      facData.FacilityName,
                                      facData.FacilityNumber,
                                      facData.SpecialityId,
                                      facData.AddressLine1,
                                      facData.AddressLine2,
                                      facData.City,
                                      facData.State,
                                      facData.Country,
                                      facData.PINCode,
                                      facData.Telephone,
                                      facData.AlternativeTelphone,
                                      facData.Email

                                  }).AsEnumerable().Select(FAC => new FacilityModel
                                  {
                                      FacilityId = FAC.FacilityId,
                                      FacilityName = FAC.FacilityName,
                                      FacilityNumber = FAC.FacilityNumber,
                                      SpecialityId = FAC.SpecialityId,
                                      Specialities = (FAC.SpecialityId != null && FAC.SpecialityId != "") ? (FAC.SpecialityId.Contains(",") ? (this.GetSpecialitiesforFacility(FAC.SpecialityId))
                                                        : this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(FAC.SpecialityId)).SpecialityDescription
                                                        ) : "",
                                      SpecialityArray = (FAC.SpecialityId != null && FAC.SpecialityId != "") ? this.GetSpecialityArrayforFacility(FAC.SpecialityId) : new List<int>(),
                                      AddressLine1 = FAC.AddressLine1,
                                      AddressLine2 = FAC.AddressLine2,
                                      City = FAC.City,
                                      State = FAC.State,
                                      Country = FAC.Country,
                                      PINCode = FAC.PINCode,
                                      Telephone = FAC.Telephone,
                                      AlternativeTelphone = FAC.AlternativeTelphone,
                                      Email = FAC.Email

                                  }).FirstOrDefault();

            return facilityRecord;
        }

        ///// <summary>
        ///// Get speciality names
        ///// </summary>
        ///// <param>string specialityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public string GetSpecialitiesforFacility(string specialityID)
        {
            string SpecialitiesName = "";
            string[] specialityIds = specialityID.Split(',');
            if (specialityIds.Length > 0)
            {
                for (int i = 0; i < specialityIds.Length; i++)
                {
                    if (specialityIds[i] != null && specialityIds[i] != "" && Convert.ToInt32(specialityIds[i]) > 0)
                    {
                        if (i + 1 == specialityIds.Length)
                        {
                            if (SpecialitiesName == null || SpecialitiesName == "")
                            {
                                SpecialitiesName = this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(specialityIds[i])).SpecialityDescription;
                            }
                            else
                            {
                                SpecialitiesName = SpecialitiesName + this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(specialityIds[i])).SpecialityDescription;
                            }
                        }
                        else
                        {
                            if (SpecialitiesName == null || SpecialitiesName == "")
                            {
                                SpecialitiesName = this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(specialityIds[i])).SpecialityDescription + ", ";
                            }
                            else
                            {
                                SpecialitiesName = SpecialitiesName + this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(specialityIds[i])).SpecialityDescription + ", ";
                            }
                        }
                    }
                }
            }
            return SpecialitiesName;
        }

        ///// <summary>
        ///// Get speciality names
        ///// </summary>
        ///// <param>string specialityID</param>
        ///// <returns>List<int>. if facility names for given FacilityId = success. else = failure</returns>
        public List<int> GetSpecialityArrayforFacility(string specialityID)
        {
            List<int> specialityArray = new List<int>();
            if (specialityID.Contains(","))
            {
                string[] specialityIds = specialityID.Split(',');
                if (specialityIds.Length > 0)
                {
                    for (int i = 0; i < specialityIds.Length; i++)
                    {
                        if (specialityIds[i] != null && specialityIds[i] != "")
                        {
                            if (Convert.ToInt32(specialityIds[i]) > 0 && !(specialityArray.Contains(Convert.ToInt32(specialityIds[i]))))
                            {
                                specialityArray.Add(Convert.ToInt32(specialityIds[i]));
                            }
                        }
                    }
                }
            }
            else
            {
                var specData = this.gUow.GlobalGenericRepository<Speciality>().Table().FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(specialityID)).SpecialityID;
                specialityArray.Add(specData);
            }
            return specialityArray;
        }

        //// <summary>
        ///// Add or Update Facility
        ///// </summary>
        ///// <param>Facility facility</param>
        ///// <returns>Facility. if record of facility is added or updated = success. else = failure</returns>  
        public FacilityModel AddUpdateFacility(FacilityModel facility)
        {
            var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == facility.FacilityId).FirstOrDefault();

            if (facilityData == null)
            {
                facilityData = new Facility();

                facilityData.FacilityName = facility.FacilityName;
                facilityData.FacilityNumber = facility.FacilityNumber;
                facilityData.SpecialityId = facility.SpecialityId;
                facilityData.AddressLine1 = facility.AddressLine1;
                facilityData.AddressLine2 = facility.AddressLine2;
                facilityData.City = facility.City;
                facilityData.State = facility.State;
                facilityData.Country = facility.Country;
                facilityData.PINCode = facility.PINCode;
                facilityData.Telephone = facility.Telephone;
                facilityData.AlternativeTelphone = facility.AlternativeTelphone;
                facilityData.Email = facility.Email;
                facilityData.CreatedDate = DateTime.Now;
                facilityData.Createdby = "User";

                this.uow.GenericRepository<Facility>().Insert(facilityData);
            }
            else
            {
                facilityData.FacilityName = facility.FacilityName;
                facilityData.FacilityNumber = facility.FacilityNumber;
                facilityData.SpecialityId = facility.SpecialityId;
                facilityData.AddressLine1 = facility.AddressLine1;
                facilityData.AddressLine2 = facility.AddressLine2;
                facilityData.City = facility.City;
                facilityData.State = facility.State;
                facilityData.Country = facility.Country;
                facilityData.PINCode = facility.PINCode;
                facilityData.Telephone = facility.Telephone;
                facilityData.AlternativeTelphone = facility.AlternativeTelphone;
                facilityData.Email = facility.Email;
                facilityData.ModifiedDate = DateTime.Now;
                facilityData.Modifiedby = "User";

                this.uow.GenericRepository<Facility>().Update(facilityData);
            }
            this.uow.Save();
            facility.FacilityId = facilityData.FacilityId;

            return facility;
        }

        #endregion

        #region File Access

        //// <summary>
        ///// Upload A File
        ///// </summary>
        ///// <param>(IFormFile file, string modulePath)</param>
        public void WriteFile(IFormFile file, string modulePath)
        {
            string fileName;
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                fileName = file.FileName.Split(extension)[0] + extension; //Create a new Name for the file due to security reasons.

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), modulePath);

                if (Directory.Exists(pathBuilt))
                {
                    string[] fileEntries = Directory.GetFiles(modulePath);

                    for (int i = 0; i < fileEntries.Length; i++)
                    {
                        string FilePath = fileEntries[i].Replace(Directory.GetCurrentDirectory(), "");
                        FilePath = FilePath.Replace("\\", "/");

                        if (File.Exists(Path.Combine(FilePath)))
                        {
                            File.Delete(Path.Combine(FilePath));
                        }
                    }
                }

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), modulePath, fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
            catch (Exception e)
            {
                string mess = e.Message;
            }

        }

        //// <summary>
        ///// Upload multiple Files
        ///// </summary>
        ///// <param>(IFormFile file, string modulePath)</param>
        public void WriteMultipleFiles(List<IFormFile> Files, string curHostedPath)
        {
            try
            {
                if (Files.Count() > 0)
                {
                    foreach (var file in Files)
                    {
                        if (!Directory.Exists(curHostedPath))
                        {
                            Directory.CreateDirectory(curHostedPath);
                        }

                        var path = Path.Combine(curHostedPath, file.FileName);

                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                string mess = e.Message;
            }

        }

        //// <summary>
        ///// Get A File by pathName
        ///// </summary>
        ///// <param>(string modulePath)</param>
        ///// <returns>List<string>. if path and FileName = success. else = failure</returns>
        public List<string> GetFile(string modulePath)
        {
            List<string> returnFileDetails = new List<string>();
            var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), modulePath);

            if (Directory.Exists(pathBuilt))
            {
                string FilePath, FileName;
                string[] fileEntries = Directory.GetFiles(pathBuilt);
                if (fileEntries.Length > 0)
                {
                    FileName = Path.GetFileName(fileEntries[0]);
                    FilePath = fileEntries[0].Replace(Directory.GetCurrentDirectory(), "");
                    FilePath = FilePath.Replace("\\", "/");

                    returnFileDetails.Add(FileName);
                    returnFileDetails.Add(FilePath);
                }
            }
            return returnFileDetails;
        }

        //// <summary>
        ///// Get Files in A List 
        ///// </summary>
        ///// <param>(string modulePath)</param>
        ///// <returns>List<clsViewFile>. if clsViewFile fields included filepath and FileName = success. else = failure</returns>
        public List<clsViewFile> GetFiles(string modulePath)
        {
            List<clsViewFile> viewLst = new List<clsViewFile>();
            try
            {
                const string DefaultContentType = "application/octet-stream";
                if (Directory.Exists(modulePath))
                {
                    string[] fileEntries = Directory.GetFiles(modulePath);

                    for (int i = 0; i < fileEntries.Length; i++)
                    {
                        clsViewFile vwFile = new clsViewFile();
                        FileInfo file = new FileInfo(fileEntries[i]);
                        FileStream reader = new FileStream(fileEntries[i], FileMode.Open, FileAccess.Read);

                        var provider = new FileExtensionContentTypeProvider();
                        if (!provider.TryGetContentType(fileEntries[i], out string contentType))
                        {
                            contentType = DefaultContentType;
                        }

                        vwFile.FileUrl = fileEntries[i].Replace("\\", "/");
                        vwFile.FileName = Path.GetFileName(fileEntries[i]);
                        vwFile.FileType = contentType;
                        vwFile.FileSize = Convert.ToString(file.Length / 1024) + " KB";

                        byte[] buffer = new byte[reader.Length];
                        reader.Read(buffer, 0, (int)reader.Length);
                        reader.ReadByte();
                        var b = Convert.ToBase64String(buffer);
                        vwFile.ActualFile = b;
                        viewLst.Add(vwFile);
                        reader.Dispose();
                    }
                }
            }
            catch (Exception ex)
            {
                string message = ex.Message;
            }
            return viewLst;
        }

        //// <summary>
        ///// Delete A File by pathName
        ///// </summary>
        ///// <param>(string path, string fileName)</param>
        ///// <returns>List<string>. if path and status = success. else = failure</returns>
        public List<string> DeleteFile(string path, string fileName)
        {
            List<string> filestatus = new List<string>();

            string status;
            if (Directory.Exists(path))
            {
                if (File.Exists(Path.Combine(path, fileName)))
                {
                    File.Delete(Path.Combine(path, fileName));
                }

                status = "File deleted";
            }
            else
            {
                status = "File does not exist";
            }
            filestatus.Add(path);
            filestatus.Add(status);

            return filestatus;
        }

        public List<string> GetFileforDownload(string modulePath)
        {
            List<string> fileString = new List<string>();

            //FileStream stream = new FileStream(modulePath, FileMode.Open, FileAccess.Read);
            byte[] bytes = System.IO.File.ReadAllBytes(modulePath);
            var fileContent = Convert.ToBase64String(bytes);

            fileString.Add(fileContent);

            return fileString;
        }

        #endregion

    }
}
