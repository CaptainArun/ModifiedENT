using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ENT.WebApi.DAL.Services
{
    public class ProviderSetUpService : IProviderSetUpService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public ProviderSetUpService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master for Provider

        ///// <summary>
        ///// Get All Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Speciality>. if Collection of Specialities = success. else = failure</returns>
        public List<Speciality> GetAllSpecialities()
        {
            return this.utilService.GetAllSpecialities();
        }

        ///// <summary>
        ///// Get Roles List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Roles>. if Collection of Roles = success. else = failure</returns>
        public List<Roles> GetAllRoles()
        {
            var roleRecords = this.iTenantMasterService.GetRolesList();

            return roleRecords;
        }

        ///// <summary>
        ///// Get All DiagnosisCodes
        ///// </summary>
        ///// <param>string searchKey, int ProviderID</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCodes = success. else = failure</returns>
        public List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey, int ProviderID)
        {
            List<DiagnosisCode> diagCollection = new List<DiagnosisCode>();

            var diagCodes = this.utilService.GetAllDiagnosisCodesbySearch(searchKey);

            var provDiagCodes = this.GetICDCodesforProvider("", ProviderID).Select(x => x.ICDCode).ToList();

            if (provDiagCodes.Count() > 0)
            {
                foreach (var code in provDiagCodes)
                {
                    var icdCode = this.utilService.GetICDCode(code);

                    if (!diagCollection.Contains(icdCode))
                    {
                        diagCollection.Add(icdCode);
                    }
                }
                return diagCodes.Except(diagCollection).ToList();
            }
            else
            {
                return diagCodes;
            }
        }

        ///// <summary>
        ///// Get All TreatmentCodes
        ///// </summary>
        ///// <param>string searchKey, int ProviderID</param>
        ///// <returns>List<TreatmentCode>. if Collection of TreatmentCodes = success. else = failure</returns>
        public List<TreatmentCode> GetAllTreatmentCodes(string searchKey, int ProviderID)
        {
            List<TreatmentCode> treatCollection = new List<TreatmentCode>();

            var treatCodes = this.utilService.GetTreatmentCodesbySearch(searchKey);

            var provTreatCodes = this.GetCPTCodesforProvider("", ProviderID).Select(x => x.CPTCode).ToList();

            if (provTreatCodes.Count() > 0)
            {
                foreach (var code in provTreatCodes)
                {
                    var cptCode = this.utilService.GetProcedureCode(code);

                    if (!treatCollection.Contains(cptCode))
                    {
                        treatCollection.Add(cptCode);
                    }
                }
                return treatCodes.Except(treatCollection).ToList();
            }
            else
            {
                return treatCodes;
            }
        }

        ///// <summary>
        ///// Get All Facility Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of Facility Data = success. else = failure</returns>
        public List<Facility> GetAllFacilitiesforProvider()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Get the Facility collection
        ///// </summary>
        ///// <param>int providerId</param>
        ///// <returns>List<Facility>. if facility collection = success. else = failure</returns>
        public List<Facility> GetFacilitiesbyProviderId(int providerId)
        {
            List<Facility> facilities = new List<Facility>();
            var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == providerId).FirstOrDefault();

            if (provData != null && (provData.FacilityId != null && provData.FacilityId != ""))
            {
                if (provData.FacilityId.Contains(","))
                {
                    string[] facilityIds = provData.FacilityId.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(provData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        //// <summary>
        ///// Get Genders for Provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Gender>. if Collection of Genders = success. else = failure</returns>
        public List<Gender> GetGenderListforProvider()
        {
            var genders = this.iTenantMasterService.GetAllGender();

            return genders;
        }

        //// <summary>
        ///// Get Address Types for Provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AddressType>. if Collection of AddressType = success. else = failure</returns>
        public List<AddressType> GetAddressTypeListforProvider()
        {
            var addressTypes = this.iTenantMasterService.GetAllAddressTypes();

            return addressTypes;
        }

        //// <summary>
        ///// Get Countries for Provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Country>. if Collection of Country = success. else = failure</returns>
        public List<Country> GetCountryListforProvider()
        {
            var countries = this.iTenantMasterService.GetAllCountries();

            return countries;
        }

        //// <summary>
        ///// Get States for Provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<State>. if Collection of State = success. else = failure</returns>
        public List<State> GetStateListforProvider()
        {
            var states = this.iTenantMasterService.GetAllStates();

            return states;
        }

        //// <summary>
        ///// Get Languages for Provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Language>. if Collection of Language = success. else = failure</returns>
        public List<Language> GetLanguageListforProvider()
        {
            var languages = this.iTenantMasterService.GetAllLanguages();

            return languages;
        }

        #endregion

        #region Provider

        #region Provider Personal Info

        ///// <summary>
        ///// Get All Provider Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderModel>. if Collection of Provider Data = success. else = failure</returns>
        public List<ProviderModel> GetAllProviders()
        {
            List<ProviderModel> ProvModel = new List<ProviderModel>();
            var ProvList = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();

            foreach (var prov in ProvList)
            {
                var fac = (prov.FacilityId != null && prov.FacilityId != "") ? prov.FacilityId : "";
                ProviderModel providerModel = new ProviderModel();

                providerModel.ProviderID = prov.ProviderID;
                providerModel.UserID = prov.UserID;
                providerModel.FacilityId = prov.FacilityId;
                providerModel.RoleId = prov.RoleId;
                providerModel.RoleDescription = prov.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == prov.RoleId).FirstOrDefault().RoleDescription : "";
                providerModel.FirstName = prov.FirstName;
                providerModel.MiddleName = prov.MiddleName;
                providerModel.LastName = prov.LastName;
                providerModel.NamePrefix = prov.NamePrefix;
                providerModel.NameSuffix = prov.NameSuffix;
                providerModel.Title = prov.Title;
                providerModel.BirthDate = prov.BirthDate;
                providerModel.Age = prov.BirthDate != null ? (DateTime.Now.Year - prov.BirthDate.Value.Year) : 0;
                providerModel.Gender = prov.Gender;
                providerModel.PersonalEmail = prov.PersonalEmail;
                providerModel.IsActive = prov.IsActive;
                providerModel.Language = prov.Language;
                providerModel.PreferredLanguage = prov.PreferredLanguage;
                providerModel.MotherMaiden = prov.MotherMaiden;
                providerModel.WebSiteName = prov.WebSiteName;
                providerModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforProvider(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                providerModel.FacilityArray = fac != "" ? this.GetFacilityArray(fac) : new List<int>();
                providerModel.State = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                            this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().State : "";
                providerModel.Pincode = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                        (this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode != null ?
                                        this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode.Value : 0) : 0;
                providerModel.PhoneNumber = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == prov.ProviderID).ToList().Count() > 0 ?
                                            this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == prov.ProviderID).PhoneNumber : "";
                providerModel.providerAddresses = this.GetProviderAddresses(prov.ProviderID);
                providerModel.providerContacts = this.GetProviderContactDetails(prov.ProviderID);
                providerModel.educations = this.GetProviderEducationDetails(prov.ProviderID);
                providerModel.familyDetails = this.GetProviderfamilyDetails(prov.ProviderID);
                providerModel.languages = this.GetProviderLanguages(prov.ProviderID);
                providerModel.extraActivities = this.GetProviderExtraActivities(prov.ProviderID);
                providerModel.ProviderFile = this.GetFile(prov.ProviderID.ToString(), "Provider").Count() > 0 ? this.GetFile(prov.ProviderID.ToString(), "Provider") : new List<clsViewFile>();
                providerModel.ProviderSign = this.GetFile(prov.ProviderID.ToString(), "Provider/Signature").Count() > 0 ? this.GetFile(prov.ProviderID.ToString(), "Provider/Signature").FirstOrDefault().ActualFile : "";

                if (!ProvModel.Contains(providerModel))
                {
                    ProvModel.Add(providerModel);
                }
            }

            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            foreach (var prov in ProvModel)
            {
                var provFacilities = this.utilService.GetFacilitiesbyProviderId(prov.ProviderID);
                if (facList.Count() > 0)
                {
                    foreach (var fac in facList)
                    {
                        var record = provFacilities.Where(x => x.FacilityId == fac.FacilityId).FirstOrDefault();
                        if (record != null && !(ProviderList.Contains(prov)))
                        {
                            ProviderList.Add(prov);
                        }
                    }
                }
                else
                {
                    ProviderList = ProvModel; 
                }
            }

            return ProviderList;
        }

        ///// <summary>
        ///// Get Provider Data by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>ProviderModel. if Provider Data for given Id = success. else = failure</returns>
        public ProviderModel GetProviderById(int ProviderId)
        {
            var prov = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == ProviderId);

            var fac = (prov.FacilityId != null && prov.FacilityId != "") ? prov.FacilityId : "";

            ProviderModel providerModel = new ProviderModel();

            providerModel.ProviderID = prov.ProviderID;
            providerModel.UserID = prov.UserID;
            providerModel.FacilityId = prov.FacilityId;
            providerModel.RoleId = prov.RoleId;
            providerModel.RoleDescription = prov.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == prov.RoleId).FirstOrDefault().RoleDescription : "";
            providerModel.FirstName = prov.FirstName;
            providerModel.MiddleName = prov.MiddleName;
            providerModel.LastName = prov.LastName;
            providerModel.NamePrefix = prov.NamePrefix;
            providerModel.NameSuffix = prov.NameSuffix;
            providerModel.Title = prov.Title;
            providerModel.BirthDate = prov.BirthDate;
            providerModel.Age = prov.BirthDate != null ? (DateTime.Now.Year - prov.BirthDate.Value.Year) : 0;
            providerModel.Gender = prov.Gender;
            providerModel.PersonalEmail = prov.PersonalEmail;
            providerModel.IsActive = prov.IsActive;
            providerModel.Language = prov.Language;
            providerModel.PreferredLanguage = prov.PreferredLanguage;
            providerModel.MotherMaiden = prov.MotherMaiden;
            providerModel.WebSiteName = prov.WebSiteName;
            providerModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforProvider(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
            providerModel.FacilityArray = fac != "" ? this.GetFacilityArray(fac) : new List<int>();
            providerModel.State = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                            this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().State : "";
            providerModel.Pincode = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                        (this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode != null ?
                                        this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode.Value : 0) : 0;
            providerModel.PhoneNumber = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == prov.ProviderID).ToList().Count() > 0 ?
                                            this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == prov.ProviderID).PhoneNumber : "";
            providerModel.providerAddresses = this.GetProviderAddresses(prov.ProviderID);
            providerModel.providerContacts = this.GetProviderContactDetails(prov.ProviderID);
            providerModel.educations = this.GetProviderEducationDetails(prov.ProviderID);
            providerModel.familyDetails = this.GetProviderfamilyDetails(prov.ProviderID);
            providerModel.languages = this.GetProviderLanguages(prov.ProviderID);
            providerModel.extraActivities = this.GetProviderExtraActivities(prov.ProviderID);
            providerModel.ProviderFile = this.GetFile(prov.ProviderID.ToString(), "Provider").Count() > 0 ? this.GetFile(prov.ProviderID.ToString(), "Provider") : new List<clsViewFile>();
            providerModel.ProviderSign = this.GetFile(prov.ProviderID.ToString(), "Provider/Signature").Count() > 0 ? this.GetFile(prov.ProviderID.ToString(), "Provider/Signature").FirstOrDefault().ActualFile : "";

            if (providerModel.ProviderFile.Count() > 0)
            {
                //byte[] bytes = System.IO.File.ReadAllBytes(providerModel.ProviderFile.FirstOrDefault().FileUrl);
                //providerModel.ProviderImage = Convert.ToBase64String(bytes);
                providerModel.ProviderImage = providerModel.ProviderFile.FirstOrDefault().ActualFile;
            }

            return providerModel;
        }

        ///// <summary>
        ///// Get Facility names
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public string GetFacilitiesforProvider(string FacilityId)
        {
            string FacilitiesName = "";
            string[] facilityIds = FacilityId.Split(',');
            if (facilityIds.Length > 0)
            {
                for (int i = 0; i < facilityIds.Length; i++)
                {
                    if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                    {
                        if (i + 1 == facilityIds.Length)
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                        }
                        else
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                        }
                    }
                }
            }
            return FacilitiesName;
        }

        ///// <summary>
        ///// Get Facility Array
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>List<int>. if facility array for given FacilityId = success. else = failure</returns>
        public List<int> GetFacilityArray(string FacilityId)
        {
            List<int> FacilityArray = new List<int>();
            if (FacilityId.Contains(","))
            {
                string[] facilityIds = FacilityId.Split(',');
                if (facilityIds.Length > 0)
                {
                    for (int i = 0; i < facilityIds.Length; i++)
                    {
                        if (Convert.ToInt32(facilityIds[i]) > 0 && !(FacilityArray.Contains(Convert.ToInt32(facilityIds[i]))))
                        {
                            FacilityArray.Add(Convert.ToInt32(facilityIds[i]));
                        }
                    }
                }
            }
            else
            {
                var facData = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(FacilityId)).FacilityId;
                FacilityArray.Add(facData);
            }
            return FacilityArray;
        }

        ///// <summary>
        ///// Get Provider Addresses by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderAddressModel>. if Provider Addresses for given Id = success. else = failure</returns>
        public List<ProviderAddressModel> GetProviderAddresses(int ProviderId)
        {
            var provAddresses = (from address in this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == ProviderId)
                                 select address).AsEnumerable().Select(PAM => new ProviderAddressModel
                                 {
                                     ProviderID = PAM.ProviderID,
                                     ProviderAddressID = PAM.ProviderAddressID,
                                     AddressType = PAM.AddressType,
                                     DoorOrApartmentNo = PAM.DoorOrApartmentNo,
                                     ApartmentNameOrHouseName = PAM.ApartmentNameOrHouseName,
                                     StreetName = PAM.StreetName,
                                     Locality = PAM.Locality,
                                     Town = PAM.Town,
                                     District = PAM.District,
                                     City = PAM.City,
                                     State = PAM.State,
                                     Country = PAM.Country,
                                     PinCode = PAM.PinCode
                                 }).ToList();

            return provAddresses;
        }

        ///// <summary>
        ///// Get Provider Contacts by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderContactModel>. if Provider Contacts for given Id = success. else = failure</returns>
        public List<ProviderContactModel> GetProviderContactDetails(int ProviderId)
        {
            var provContacts = (from contact in this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == ProviderId)
                                select contact).AsEnumerable().Select(PCM => new ProviderContactModel
                                {
                                    ProviderID = PCM.ProviderID,
                                    ProviderContactID = PCM.ProviderContactID,
                                    CellNumber = PCM.CellNumber,
                                    PhoneNumber = PCM.PhoneNumber,
                                    WhatsAppNumber = PCM.WhatsAppNumber,
                                    EmergencyContactNumber = PCM.EmergencyContactNumber,
                                    Fax = PCM.Fax,
                                    Email = PCM.Email,
                                    TelephoneNo = PCM.TelephoneNo

                                }).ToList();
            return provContacts;
        }

        ///// <summary>
        ///// Get Provider Education details by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderEducationModel>. if Provider Education Details for given Id = success. else = failure</returns>
        public List<ProviderEducationModel> GetProviderEducationDetails(int ProviderId)
        {
            var provEducationdetails = (from education in this.uow.GenericRepository<ProviderEducation>().Table().Where(x => x.ProviderID == ProviderId)
                                        select education).AsEnumerable().Select(PEM => new ProviderEducationModel
                                        {
                                            ProviderEducationId = PEM.ProviderEducationId,
                                            ProviderID = PEM.ProviderID,
                                            EducationType = PEM.EducationType,
                                            BoardorUniversity = PEM.BoardorUniversity,
                                            MonthandYearOfPassing = PEM.MonthandYearOfPassing,
                                            NameOfSchoolorCollege = PEM.NameOfSchoolorCollege,
                                            MainSubjects = PEM.MainSubjects,
                                            PercentageofMarks = PEM.PercentageofMarks,
                                            HonoursorScholarshipHeading = PEM.HonoursorScholarshipHeading,
                                            ProjectWorkUndertakenHeading = PEM.ProjectWorkUndertakenHeading,
                                            PublicationsorPapers = PEM.PublicationsorPapers,
                                            Qualification = PEM.Qualification,
                                            DurationOfQualification = PEM.DurationOfQualification,
                                            NameOfInstitution = PEM.NameOfInstitution,
                                            PlaceOfInstitution = PEM.PlaceOfInstitution,
                                            RegisterationAuthority = PEM.RegisterationAuthority,
                                            RegisterationNumber = PEM.RegisterationNumber,
                                            ExpiryOfRegisterationNumber = PEM.ExpiryOfRegisterationNumber

                                        }).ToList();
            return provEducationdetails;
        }

        ///// <summary>
        ///// Get Provider Family details by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderFamilyDetailsModel>. if Provider Family Details for given Id = success. else = failure</returns>
        public List<ProviderFamilyDetailsModel> GetProviderfamilyDetails(int ProviderId)
        {
            var provFamilyDetails = (from family in this.uow.GenericRepository<ProviderFamilyDetails>().Table().Where(x => x.ProviderID == ProviderId)
                                     select family).AsEnumerable().Select(PFM => new ProviderFamilyDetailsModel
                                     {
                                         ProviderFamilyDetailId = PFM.ProviderFamilyDetailId,
                                         ProviderID = PFM.ProviderID,
                                         FullName = PFM.FullName,
                                         Age = PFM.Age,
                                         RelationShip = PFM.RelationShip,
                                         Occupation = PFM.Occupation,
                                         Notes = PFM.Notes

                                     }).ToList();
            return provFamilyDetails;
        }

        ///// <summary>
        ///// Get Provider Languages by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderLanguagesModel>. if Provider Languages for given Id = success. else = failure</returns>
        public List<ProviderLanguagesModel> GetProviderLanguages(int ProviderId)
        {
            var provLanguages = (from lang in this.uow.GenericRepository<ProviderLanguages>().Table().Where(x => x.ProviderID == ProviderId)
                                 select lang).AsEnumerable().Select(PLM => new ProviderLanguagesModel
                                 {
                                     ProviderLanguageId = PLM.ProviderLanguageId,
                                     ProviderID = PLM.ProviderID,
                                     Language = PLM.Language,
                                     IsSpeak = PLM.IsSpeak,
                                     SpeakingLevel = PLM.SpeakingLevel,
                                     IsRead = PLM.IsRead,
                                     ReadingLevel = PLM.ReadingLevel,
                                     IsWrite = PLM.IsWrite,
                                     WritingLevel = PLM.WritingLevel

                                 }).ToList();
            return provLanguages;
        }

        ///// <summary>
        ///// Get Provider Languages by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderLanguagesModel>. if Provider Languages for given Id = success. else = failure</returns>
        public List<ProviderExtraActivitiesModel> GetProviderExtraActivities(int ProviderId)
        {
            var provExtraActivities = (from activity in this.uow.GenericRepository<ProviderExtraActivities>().Table().Where(x => x.ProviderID == ProviderId)
                                       select activity).AsEnumerable().Select(PEAM => new ProviderExtraActivitiesModel
                                       {
                                           ProviderActivityId = PEAM.ProviderActivityId,
                                           ProviderID = PEAM.ProviderID,
                                           NatureOfActivity = PEAM.NatureOfActivity,
                                           YearOfParticipation = PEAM.YearOfParticipation,
                                           PrizesorAwards = PEAM.PrizesorAwards,
                                           StrengthandAreaneedImprovement = PEAM.StrengthandAreaneedImprovement

                                       }).ToList();
            return provExtraActivities;
        }

        ///// <summary>
        ///// Add or Update a Provider data by checking ProviderId
        ///// </summary>
        ///// <param name=ProviderModel>provData(object of ProviderModel)</param>
        ///// <returns>ProviderModel. if a Provider data added or updated = success. else = failure</returns>
        public ProviderModel AddUpdateProvider(ProviderModel provData)
        {
            Provider prov = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == provData.ProviderID).SingleOrDefault();

            if (prov == null)
            {
                string myguid = Guid.NewGuid().ToString();

                prov = new Provider();

                prov.UserID = myguid;
                prov.FacilityId = provData.FacilityId;
                prov.RoleId = provData.RoleId;
                prov.FirstName = provData.FirstName;
                prov.MiddleName = provData.MiddleName;
                prov.LastName = provData.LastName;
                prov.NamePrefix = provData.NamePrefix;
                prov.NameSuffix = provData.NameSuffix;
                prov.Title = provData.Title;
                prov.BirthDate = provData.BirthDate != null ? this.utilService.GetLocalTime(provData.BirthDate.Value) : provData.BirthDate;
                prov.Gender = provData.Gender;
                prov.PersonalEmail = provData.PersonalEmail;
                prov.IsActive = provData.IsActive;
                prov.Language = provData.Language;
                prov.PreferredLanguage = provData.PreferredLanguage;
                prov.MotherMaiden = provData.MotherMaiden;
                prov.WebSiteName = provData.WebSiteName;
                prov.CreatedDate = DateTime.Now;
                prov.CreatedBy = "User";

                this.uow.GenericRepository<Provider>().Insert(prov);
            }
            else
            {
                if (prov.FacilityId.ToLower().Trim() == provData.FacilityId.ToLower().Trim())
                {
                    prov.FacilityId = provData.FacilityId;
                    prov.RoleId = provData.RoleId;
                    prov.FirstName = provData.FirstName;
                    prov.MiddleName = provData.MiddleName;
                    prov.LastName = provData.LastName;
                    prov.NamePrefix = provData.NamePrefix;
                    prov.NameSuffix = provData.NameSuffix;
                    prov.Title = provData.Title;
                    prov.BirthDate = provData.BirthDate != null ? this.utilService.GetLocalTime(provData.BirthDate.Value) : provData.BirthDate;
                    prov.Gender = provData.Gender;
                    prov.PersonalEmail = provData.PersonalEmail;
                    prov.IsActive = provData.IsActive;
                    prov.Language = provData.Language;
                    prov.PreferredLanguage = provData.PreferredLanguage;
                    prov.MotherMaiden = provData.MotherMaiden;
                    prov.WebSiteName = provData.WebSiteName;
                    prov.ModifiedDate = DateTime.Now;
                    prov.ModifiedBy = "User";

                    this.uow.GenericRepository<Provider>().Update(prov);
                }
                else
                {
                    prov.FacilityId = provData.FacilityId;
                    prov.RoleId = provData.RoleId;
                    prov.FirstName = provData.FirstName;
                    prov.MiddleName = provData.MiddleName;
                    prov.LastName = provData.LastName;
                    prov.NamePrefix = provData.NamePrefix;
                    prov.NameSuffix = provData.NameSuffix;
                    prov.Title = provData.Title;
                    prov.BirthDate = provData.BirthDate != null ? this.utilService.GetLocalTime(provData.BirthDate.Value) : provData.BirthDate;
                    prov.Gender = provData.Gender;
                    prov.PersonalEmail = provData.PersonalEmail;
                    prov.IsActive = provData.IsActive;
                    prov.Language = provData.Language;
                    prov.PreferredLanguage = provData.PreferredLanguage;
                    prov.MotherMaiden = provData.MotherMaiden;
                    prov.WebSiteName = provData.WebSiteName;
                    prov.ModifiedDate = DateTime.Now;
                    prov.ModifiedBy = "User";

                    this.uow.GenericRepository<Provider>().Update(prov);
                    this.uow.Save();

                    var oldFacilities = this.GetFacilitiesbyFacilityId(prov.FacilityId);

                    var newFacilities = this.GetFacilitiesbyFacilityId(provData.FacilityId);

                    List<int> facilityIds = new List<int>();

                    foreach (var set in oldFacilities)
                    {
                        var record = newFacilities.Where(x => x.FacilityId == set.FacilityId).FirstOrDefault();
                        if (record == null)
                        {
                            facilityIds.Add(set.FacilityId);
                        }
                    }

                    if (facilityIds.Count() > 0)
                    {
                        foreach (var record in facilityIds)
                        {
                            var proSchedules = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.FacilityID == record & x.ProviderID == prov.ProviderID).ToList();
                            if (proSchedules.Count() > 0)
                            {
                                foreach (var proSched in proSchedules)
                                {
                                    proSched.TerminationDate = DateTime.Now.Date;
                                    proSched.ModifiedDate = DateTime.Now;
                                    proSched.ModifiedBy = "User";

                                    this.uow.GenericRepository<ProviderSchedule>().Update(proSched);
                                }
                                this.uow.Save();
                            }
                        }
                    }
                }
            }
            this.uow.Save();
            provData.ProviderID = prov.ProviderID;
            var status = this.utilService.UpdateGlobalUser(prov.PersonalEmail, prov.UserID);

            if (prov.ProviderID > 0)
            {
                var userRoleData = this.uow.GenericRepository<userrole>().Table().FirstOrDefault(x => x.Userid.ToLower().Trim() == prov.UserID.ToLower().Trim());
                if (userRoleData == null)
                {
                    userRoleData = new userrole();

                    userRoleData.Userid = prov.UserID;
                    userRoleData.Roleid = prov.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Insert(userRoleData);
                }
                else
                {
                    userRoleData.Roleid = prov.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Update(userRoleData);
                }
                this.uow.Save();
            }

            if (provData.providerAddresses.Count() > 0)
            {
                for (int i = 0; i < provData.providerAddresses.Count(); i++)
                {
                    provData.providerAddresses[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderAddressModel>();
                var provAddresses = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == provData.providerAddresses.FirstOrDefault().ProviderID).ToList();

                if (provAddresses.Count() == 0)
                {
                    this.AddUpdateProviderAddresses(provData.providerAddresses);
                }
                else
                {
                    foreach (var set in provAddresses)
                    {
                        var record = provData.providerAddresses.Where(x => x.ProviderAddressID == set.ProviderAddressID).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderAddress>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.providerAddresses)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }

                    this.AddUpdateProviderAddresses(itemsList);
                }
            }

            if (provData.providerContacts.Count() > 0)
            {
                for (int i = 0; i < provData.providerContacts.Count(); i++)
                {
                    provData.providerContacts[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderContactModel>();
                var provContacts = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == provData.providerContacts.FirstOrDefault().ProviderID).ToList();

                if (provContacts.Count() == 0)
                {
                    this.AddUpdateProviderContacts(provData.providerContacts);
                }
                else
                {
                    foreach (var set in provContacts)
                    {
                        var record = provData.providerContacts.Where(x => x.ProviderContactID == set.ProviderContactID).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderContact>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.providerContacts)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }

                    this.AddUpdateProviderContacts(itemsList);
                }
            }

            if (provData.educations.Count() > 0)
            {
                for (int i = 0; i < provData.educations.Count(); i++)
                {
                    provData.educations[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderEducationModel>();
                var provEducations = this.uow.GenericRepository<ProviderEducation>().Table().Where(x => x.ProviderID == provData.educations.FirstOrDefault().ProviderID).ToList();

                if (provEducations.Count() == 0)
                {
                    this.AddUpdateProviderEducationDetails(provData.educations);
                }
                else
                {
                    foreach (var set in provEducations)
                    {
                        var record = provData.educations.Where(x => x.ProviderEducationId == set.ProviderEducationId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderEducation>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.educations)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }

                    this.AddUpdateProviderEducationDetails(itemsList);
                }
            }

            if (provData.familyDetails.Count() > 0)
            {
                for (int i = 0; i < provData.familyDetails.Count(); i++)
                {
                    provData.familyDetails[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderFamilyDetailsModel>();
                var provFamilyDetails = this.uow.GenericRepository<ProviderFamilyDetails>().Table().Where(x => x.ProviderID == provData.familyDetails.FirstOrDefault().ProviderID).ToList();

                if (provFamilyDetails.Count() == 0)
                {
                    this.AddUpdateProviderFamilyDetails(provData.familyDetails);
                }
                else
                {
                    foreach (var set in provFamilyDetails)
                    {
                        var record = provData.familyDetails.Where(x => x.ProviderFamilyDetailId == set.ProviderFamilyDetailId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderFamilyDetails>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.familyDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }

                    this.AddUpdateProviderFamilyDetails(itemsList);
                }
            }

            if (provData.languages.Count() > 0)
            {
                for (int i = 0; i < provData.languages.Count(); i++)
                {
                    provData.languages[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderLanguagesModel>();
                var provLanguages = this.uow.GenericRepository<ProviderLanguages>().Table().Where(x => x.ProviderID == provData.languages.FirstOrDefault().ProviderID).ToList();

                if (provLanguages.Count() == 0)
                {
                    this.AddUpdateProviderLanguages(provData.languages);
                }
                else
                {
                    foreach (var set in provLanguages)
                    {
                        var record = provData.languages.Where(x => x.ProviderLanguageId == set.ProviderLanguageId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderLanguages>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.languages)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }

                    this.AddUpdateProviderLanguages(itemsList);
                }
            }

            if (provData.extraActivities.Count() > 0)
            {

                for (int i = 0; i < provData.extraActivities.Count(); i++)
                {
                    provData.extraActivities[i].ProviderID = prov.ProviderID;
                }

                var itemsList = new List<ProviderExtraActivitiesModel>();
                var provExtraActivities = this.uow.GenericRepository<ProviderExtraActivities>().Table().Where(x => x.ProviderID == provData.extraActivities.FirstOrDefault().ProviderID).ToList();

                if (provExtraActivities.Count() == 0)
                {
                    this.AddUpdateProviderExtraActivities(provData.extraActivities);
                }
                else
                {
                    foreach (var set in provExtraActivities)
                    {
                        var record = provData.extraActivities.Where(x => x.ProviderActivityId == set.ProviderActivityId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<ProviderExtraActivities>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in provData.extraActivities)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateProviderExtraActivities(itemsList);
                }
            }

            return provData;
        }

        ///// <summary>
        ///// Get the Facility (local method)
        ///// </summary>
        ///// <param>string facilityset</param>
        ///// <returns>List<Facility>. if facility collection = success. else = failure</returns>
        public List<Facility> GetFacilitiesbyFacilityId(string facilityset)
        {
            List<Facility> facilities = new List<Facility>();

            if (facilityset != null && facilityset != "")
            {
                if (facilityset.Contains(","))
                {
                    string[] facilityIds = facilityset.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityset)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        ///// <summary>
        ///// Add or Update a Provider Addresses
        ///// </summary>
        ///// <param>List<ProviderAddressModel> providerAddressCollection</param>
        ///// <returns>List<ProviderAddressModel>. if a Provider Address Collection added or updated = success. else = failure</returns>
        public List<ProviderAddressModel> AddUpdateProviderAddresses(List<ProviderAddressModel> providerAddressCollection)
        {
            ProviderAddress provAddress = new ProviderAddress();

            foreach (var address in providerAddressCollection)
            {
                provAddress = this.uow.GenericRepository<ProviderAddress>().Table().FirstOrDefault(x => x.ProviderAddressID == address.ProviderAddressID);
                if (provAddress == null)
                {
                    provAddress = new ProviderAddress();

                    provAddress.ProviderID = address.ProviderID;
                    provAddress.AddressType = address.AddressType;
                    provAddress.DoorOrApartmentNo = address.DoorOrApartmentNo;
                    provAddress.ApartmentNameOrHouseName = address.ApartmentNameOrHouseName;
                    provAddress.StreetName = address.StreetName;
                    provAddress.Locality = address.Locality;
                    provAddress.Town = address.Town;
                    provAddress.District = address.District;
                    provAddress.City = address.City;
                    provAddress.State = address.State;
                    provAddress.Country = address.Country;
                    provAddress.PinCode = address.PinCode;
                    provAddress.CreatedBy = "User";
                    provAddress.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderAddress>().Insert(provAddress);
                }
                else
                {
                    provAddress.AddressType = address.AddressType;
                    provAddress.DoorOrApartmentNo = address.DoorOrApartmentNo;
                    provAddress.ApartmentNameOrHouseName = address.ApartmentNameOrHouseName;
                    provAddress.StreetName = address.StreetName;
                    provAddress.Locality = address.Locality;
                    provAddress.Town = address.Town;
                    provAddress.District = address.District;
                    provAddress.City = address.City;
                    provAddress.State = address.State;
                    provAddress.Country = address.Country;
                    provAddress.PinCode = address.PinCode;
                    provAddress.ModifiedBy = "User";
                    provAddress.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderAddress>().Update(provAddress);
                }
                this.uow.Save();
                address.ProviderAddressID = provAddress.ProviderAddressID;
            }
            return providerAddressCollection;
        }

        ///// <summary>
        ///// Add or Update a Provider Contacts
        ///// </summary>
        ///// <param>List<ProviderContactModel> providerContactCollection</param>
        ///// <returns>List<ProviderContactModel>. if a Provider Contact Collection added or updated = success. else = failure</returns>
        public List<ProviderContactModel> AddUpdateProviderContacts(List<ProviderContactModel> providerContactCollection)
        {
            ProviderContact provContact = new ProviderContact();

            foreach (var contact in providerContactCollection)
            {
                provContact = this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderContactID == contact.ProviderContactID);
                if (provContact == null)
                {
                    provContact = new ProviderContact();

                    provContact.ProviderID = contact.ProviderID;
                    provContact.CellNumber = contact.CellNumber;
                    provContact.PhoneNumber = contact.PhoneNumber;
                    provContact.WhatsAppNumber = contact.WhatsAppNumber;
                    provContact.EmergencyContactNumber = contact.EmergencyContactNumber;
                    provContact.Fax = contact.Fax;
                    provContact.Email = contact.Email;
                    provContact.TelephoneNo = contact.TelephoneNo;
                    provContact.CreatedBy = "User";
                    provContact.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderContact>().Insert(provContact);
                }
                else
                {
                    provContact.CellNumber = contact.CellNumber;
                    provContact.PhoneNumber = contact.PhoneNumber;
                    provContact.WhatsAppNumber = contact.WhatsAppNumber;
                    provContact.EmergencyContactNumber = contact.EmergencyContactNumber;
                    provContact.Fax = contact.Fax;
                    provContact.Email = contact.Email;
                    provContact.TelephoneNo = contact.TelephoneNo;
                    provContact.ModifiedBy = "User";
                    provContact.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderContact>().Update(provContact);
                }
                this.uow.Save();
                contact.ProviderContactID = provContact.ProviderContactID;
            }

            return providerContactCollection;
        }

        ///// <summary>
        ///// Add or Update a Provider Education Details
        ///// </summary>
        ///// <param>List<ProviderEducationModel> educationDetails</param>
        ///// <returns>List<ProviderEducationModel>. if a Provider Education Collection added or updated = success. else = failure</returns>
        public List<ProviderEducationModel> AddUpdateProviderEducationDetails(List<ProviderEducationModel> educationDetails)
        {
            ProviderEducation provEducation = new ProviderEducation();

            foreach (var education in educationDetails)
            {
                provEducation = this.uow.GenericRepository<ProviderEducation>().Table().FirstOrDefault(x => x.ProviderEducationId == education.ProviderEducationId);

                if (provEducation == null)
                {
                    provEducation = new ProviderEducation();

                    provEducation.ProviderID = education.ProviderID;
                    provEducation.EducationType = education.EducationType;
                    provEducation.BoardorUniversity = education.BoardorUniversity;
                    provEducation.MonthandYearOfPassing = education.MonthandYearOfPassing != null ? this.utilService.GetLocalTime(education.MonthandYearOfPassing.Value) : education.MonthandYearOfPassing;
                    provEducation.NameOfSchoolorCollege = education.NameOfSchoolorCollege;
                    provEducation.MainSubjects = education.MainSubjects;
                    provEducation.PercentageofMarks = education.PercentageofMarks;
                    provEducation.HonoursorScholarshipHeading = education.HonoursorScholarshipHeading;
                    provEducation.ProjectWorkUndertakenHeading = education.ProjectWorkUndertakenHeading;
                    provEducation.PublicationsorPapers = education.PublicationsorPapers;
                    provEducation.Qualification = education.Qualification;
                    provEducation.DurationOfQualification = education.DurationOfQualification;
                    provEducation.NameOfInstitution = education.NameOfInstitution;
                    provEducation.PlaceOfInstitution = education.PlaceOfInstitution;
                    provEducation.RegisterationAuthority = education.RegisterationAuthority;
                    provEducation.RegisterationNumber = education.RegisterationNumber;
                    provEducation.ExpiryOfRegisterationNumber = education.ExpiryOfRegisterationNumber;
                    provEducation.CreatedBy = "User";
                    provEducation.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderEducation>().Insert(provEducation);
                }
                else
                {
                    provEducation.EducationType = education.EducationType;
                    provEducation.BoardorUniversity = education.BoardorUniversity;
                    provEducation.MonthandYearOfPassing = education.MonthandYearOfPassing != null ? this.utilService.GetLocalTime(education.MonthandYearOfPassing.Value) : education.MonthandYearOfPassing;
                    provEducation.NameOfSchoolorCollege = education.NameOfSchoolorCollege;
                    provEducation.MainSubjects = education.MainSubjects;
                    provEducation.PercentageofMarks = education.PercentageofMarks;
                    provEducation.HonoursorScholarshipHeading = education.HonoursorScholarshipHeading;
                    provEducation.ProjectWorkUndertakenHeading = education.ProjectWorkUndertakenHeading;
                    provEducation.PublicationsorPapers = education.PublicationsorPapers;
                    provEducation.Qualification = education.Qualification;
                    provEducation.DurationOfQualification = education.DurationOfQualification;
                    provEducation.NameOfInstitution = education.NameOfInstitution;
                    provEducation.PlaceOfInstitution = education.PlaceOfInstitution;
                    provEducation.RegisterationAuthority = education.RegisterationAuthority;
                    provEducation.RegisterationNumber = education.RegisterationNumber;
                    provEducation.ExpiryOfRegisterationNumber = education.ExpiryOfRegisterationNumber;
                    provEducation.ModifiedBy = "User";
                    provEducation.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderEducation>().Update(provEducation);
                }
                this.uow.Save();
                education.ProviderEducationId = provEducation.ProviderEducationId;
            }

            return educationDetails;
        }

        ///// <summary>
        ///// Add or Update a Provider Family Details
        ///// </summary>
        ///// <param>List<ProviderFamilyDetailsModel> familyDetails</param>
        ///// <returns>List<ProviderFamilyDetailsModel>. if a Provider Family Collection added or updated = success. else = failure</returns>
        public List<ProviderFamilyDetailsModel> AddUpdateProviderFamilyDetails(List<ProviderFamilyDetailsModel> familyDetails)
        {
            ProviderFamilyDetails family = new ProviderFamilyDetails();

            foreach (var member in familyDetails)
            {
                family = this.uow.GenericRepository<ProviderFamilyDetails>().Table().FirstOrDefault(x => x.ProviderFamilyDetailId == member.ProviderFamilyDetailId);
                if (family == null)
                {
                    family = new ProviderFamilyDetails();

                    family.ProviderID = member.ProviderID;
                    family.FullName = member.FullName;
                    family.Age = member.Age;
                    family.RelationShip = member.RelationShip;
                    family.Occupation = member.Occupation;
                    family.Notes = member.Notes;
                    family.CreatedBy = "User";
                    family.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderFamilyDetails>().Insert(family);
                }
                else
                {
                    family.FullName = member.FullName;
                    family.Age = member.Age;
                    family.RelationShip = member.RelationShip;
                    family.Occupation = member.Occupation;
                    family.Notes = member.Notes;
                    family.ModifiedBy = "User";
                    family.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderFamilyDetails>().Update(family);
                }
                this.uow.Save();
                member.ProviderFamilyDetailId = family.ProviderFamilyDetailId;
            }
            return familyDetails;
        }

        ///// <summary>
        ///// Add or Update a Provider Language details
        ///// </summary>
        ///// <param>List<ProviderLanguagesModel> familyDetails</param>
        ///// <returns>List<ProviderLanguagesModel>. if a Provider Language Collection added or updated = success. else = failure</returns>
        public List<ProviderLanguagesModel> AddUpdateProviderLanguages(List<ProviderLanguagesModel> languageDetails)
        {
            ProviderLanguages provLanguage = new ProviderLanguages();

            foreach (var language in languageDetails)
            {
                provLanguage = this.uow.GenericRepository<ProviderLanguages>().Table().FirstOrDefault(x => x.ProviderLanguageId == language.ProviderLanguageId);
                if (provLanguage == null)
                {
                    provLanguage = new ProviderLanguages();

                    provLanguage.ProviderID = language.ProviderID;
                    provLanguage.Language = language.Language;
                    provLanguage.IsSpeak = language.IsSpeak;
                    provLanguage.SpeakingLevel = language.SpeakingLevel;
                    provLanguage.IsRead = language.IsRead;
                    provLanguage.ReadingLevel = language.ReadingLevel;
                    provLanguage.IsWrite = language.IsWrite;
                    provLanguage.WritingLevel = language.WritingLevel;
                    provLanguage.CreatedBy = "User";
                    provLanguage.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderLanguages>().Insert(provLanguage);
                }
                else
                {
                    provLanguage.Language = language.Language;
                    provLanguage.IsSpeak = language.IsSpeak;
                    provLanguage.SpeakingLevel = language.SpeakingLevel;
                    provLanguage.IsRead = language.IsRead;
                    provLanguage.ReadingLevel = language.ReadingLevel;
                    provLanguage.IsWrite = language.IsWrite;
                    provLanguage.WritingLevel = language.WritingLevel;
                    provLanguage.ModifiedBy = "User";
                    provLanguage.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderLanguages>().Update(provLanguage);
                }
                this.uow.Save();
                language.ProviderLanguageId = provLanguage.ProviderLanguageId;
            }

            return languageDetails;
        }

        ///// <summary>
        ///// Add or Update a Provider Extra Activities
        ///// </summary>
        ///// <param>List<ProviderExtraActivitiesModel> extraActivities</param>
        ///// <returns>List<ProviderExtraActivitiesModel>. if a Provider Extra Activities Collection added or updated = success. else = failure</returns>
        public List<ProviderExtraActivitiesModel> AddUpdateProviderExtraActivities(List<ProviderExtraActivitiesModel> extraActivities)
        {
            ProviderExtraActivities extra = new ProviderExtraActivities();
            foreach (var activity in extraActivities)
            {
                extra = this.uow.GenericRepository<ProviderExtraActivities>().Table().FirstOrDefault(x => x.ProviderActivityId == activity.ProviderActivityId);
                if (extra == null)
                {
                    extra = new ProviderExtraActivities();

                    extra.ProviderID = activity.ProviderID;
                    extra.NatureOfActivity = activity.NatureOfActivity;
                    extra.YearOfParticipation = activity.YearOfParticipation;
                    extra.PrizesorAwards = activity.PrizesorAwards;
                    extra.StrengthandAreaneedImprovement = activity.StrengthandAreaneedImprovement;
                    extra.CreatedBy = "User";
                    extra.CreatedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderExtraActivities>().Insert(extra);
                }
                else
                {
                    extra.NatureOfActivity = activity.NatureOfActivity;
                    extra.YearOfParticipation = activity.YearOfParticipation;
                    extra.PrizesorAwards = activity.PrizesorAwards;
                    extra.StrengthandAreaneedImprovement = activity.StrengthandAreaneedImprovement;
                    extra.ModifiedBy = "User";
                    extra.ModifiedDate = DateTime.Now;

                    this.uow.GenericRepository<ProviderExtraActivities>().Update(extra);
                }
                this.uow.Save();
                activity.ProviderActivityId = extra.ProviderActivityId;
            }
            return extraActivities;
        }

        #endregion

        ///// <summary>
        ///// Get DiagnosisCodes for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderDiagnosisCodeModel>. if Collection of ProviderDiagnosisCode for given Provider = success. else = failure</returns>
        public List<ProviderDiagnosisCodeModel> GetICDCodesforProvider(string searchKey, int ProviderId)
        {
            var provDiagCodes = (from diag in uow.GenericRepository<ProviderDiagnosisCode>().Table().Where(x => x.Deleted != true)
                                 where diag.ProviderID == ProviderId
                                 join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on diag.ProviderID equals prov.ProviderID
                                 select new
                                 {
                                     diag.ProviderDiagnosisCodeID,
                                     diag.ProviderID,
                                     diag.DiagnosisCodeID,
                                     diag.ICDCode,
                                     diag.CreatedDate,
                                     diag.CreatedBy,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName
                                 }).AsEnumerable().Select(PDCM => new ProviderDiagnosisCodeModel
                                 {
                                     ProviderDiagnosisCodeID = PDCM.ProviderDiagnosisCodeID,
                                     ProviderID = PDCM.ProviderID,
                                     ProviderName = PDCM.FirstName + " " + PDCM.MiddleName + " " + PDCM.LastName,
                                     DiagnosisCodeID = PDCM.DiagnosisCodeID,
                                     ICDCode = PDCM.ICDCode,
                                     diagnosisCodeDesc = this.utilService.GetICDCode(PDCM.ICDCode).Description,
                                     CreatedDate = PDCM.CreatedDate,
                                     CreatedBy = PDCM.CreatedBy

                                 }).ToList();

            var collection = (from icd in provDiagCodes
                              where ((searchKey == null || searchKey == "")
                              || icd.ICDCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || icd.DiagnosisCodeID.ToString().Contains(searchKey.ToLower().Trim())
                              || icd.diagnosisCodeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                              select icd).ToList();

            return collection;
        }

        ///// <summary>
        ///// Add or Update a Provider Diagnosis Codes
        ///// </summary>
        ///// <param name=List<ProviderDiagnosisCodeModel>>provDiagData(object of List<ProviderDiagnosisCodeModel>)</param>
        ///// <returns>ProviderDiagnosisCodeModel. if a Collection of Diagnosis Code added or updated for provider = success. else = failure</returns>
        public IEnumerable<ProviderDiagnosisCodeModel> AddUpdateDiagnosisCodes(IEnumerable<ProviderDiagnosisCodeModel> provDiagData)
        {
            if (provDiagData.Count() > 0)
            {
                var providerDiag = this.uow.GenericRepository<ProviderDiagnosisCode>().Table().Where(x => x.ProviderID == provDiagData.FirstOrDefault().ProviderID).ToList();
                ProviderDiagnosisCode provDiag = new ProviderDiagnosisCode();

                if (providerDiag.Count() == 0)
                {
                    foreach (var diagCode in provDiagData)
                    {
                        provDiag = new ProviderDiagnosisCode();

                        provDiag.ProviderID = diagCode.ProviderID;
                        provDiag.DiagnosisCodeID = diagCode.DiagnosisCodeID;
                        provDiag.ICDCode = diagCode.ICDCode;
                        provDiag.Deleted = false;
                        provDiag.CreatedDate = DateTime.Now;
                        provDiag.CreatedBy = "User";

                        this.uow.GenericRepository<ProviderDiagnosisCode>().Insert(provDiag);
                    }
                }
                else
                {
                    foreach (var diagCode in provDiagData)
                    {
                        provDiag = new ProviderDiagnosisCode();
                        if (diagCode.codeStatus.ToLower().Trim() == "add")
                        {
                            provDiag.ProviderID = diagCode.ProviderID;
                            provDiag.DiagnosisCodeID = diagCode.DiagnosisCodeID;
                            provDiag.ICDCode = diagCode.ICDCode;
                            provDiag.Deleted = false;
                            provDiag.CreatedDate = DateTime.Now;
                            provDiag.CreatedBy = "User";

                            this.uow.GenericRepository<ProviderDiagnosisCode>().Insert(provDiag);
                        }
                        else if (diagCode.codeStatus.ToLower().Trim() == "remove")
                        {
                            provDiag = this.uow.GenericRepository<ProviderDiagnosisCode>().Table().SingleOrDefault(x => x.ProviderDiagnosisCodeID == diagCode.ProviderDiagnosisCodeID);

                            if (provDiag != null)
                            {
                                this.uow.GenericRepository<ProviderDiagnosisCode>().Delete(provDiag);
                                this.uow.Save();
                            }
                        }
                    }
                }
                this.uow.Save();
            }
            return provDiagData;
        }


        ///// <summary>
        ///// Get TreatmentCodes for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderTreatmentCodeModel>. if Collection of ProviderTreatmentCode for given Provider = success. else = failure</returns>
        public List<ProviderTreatmentCodeModel> GetCPTCodesforProvider(string searchKey, int ProviderId)
        {
            var provCPTCodes = (from treat in uow.GenericRepository<ProviderTreatmentCode>().Table().Where(x => x.Deleted != true)
                                where treat.ProviderID == ProviderId
                                join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                on treat.ProviderID equals prov.ProviderID
                                select new
                                {
                                    treat.ProviderID,
                                    treat.ProviderTreatmentCodeID,
                                    treat.TreatmentCodeID,
                                    treat.CPTCode,
                                    treat.CreatedDate,
                                    treat.CreatedBy,
                                    prov.FirstName,
                                    prov.MiddleName,
                                    prov.LastName
                                }).AsEnumerable().Select(PTCM => new ProviderTreatmentCodeModel
                                {
                                    ProviderID = PTCM.ProviderID,
                                    ProviderTreatmentCodeID = PTCM.ProviderTreatmentCodeID,
                                    ProviderName = PTCM.FirstName + " " + PTCM.MiddleName + " " + PTCM.LastName,
                                    TreatmentCodeID = PTCM.TreatmentCodeID,
                                    CPTCode = PTCM.CPTCode,
                                    ProcedureCodeDesc = this.utilService.GetProcedureCode(PTCM.CPTCode).Description,
                                    CreatedDate = PTCM.CreatedDate,
                                    CreatedBy = PTCM.CreatedBy

                                }).ToList();

            var collection = (from cpt in provCPTCodes
                              where ((searchKey == null || searchKey == "")
                              || cpt.CPTCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || cpt.TreatmentCodeID.ToString().Contains(searchKey.ToLower().Trim())
                              || cpt.ProcedureCodeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                              select cpt).ToList();

            return collection;
        }

        ///// <summary>
        ///// Add or Update a Provider Treatment Codes
        ///// </summary>
        ///// <param name=IEnumerable<ProviderTreatmentCodeModel>provCPTData(object of IEnumerable<ProviderTreatmentCodeModel>)</param>
        ///// <returns>ProviderTreatmentCodeModel. if a Collection of Treatment Code added or updated for provider = success. else = failure</returns>
        public IEnumerable<ProviderTreatmentCodeModel> AddUpdateCPTCodes(IEnumerable<ProviderTreatmentCodeModel> provCPTData)
        {
            if (provCPTData.Count() > 0)
            {
                var providerCPT = this.uow.GenericRepository<ProviderTreatmentCode>().Table().Where(x => x.ProviderID == provCPTData.FirstOrDefault().ProviderID).ToList();
                ProviderTreatmentCode provCPT = new ProviderTreatmentCode();

                if (providerCPT.Count() == 0)
                {
                    foreach (var treatCode in provCPTData)
                    {
                        provCPT = new ProviderTreatmentCode();

                        provCPT.ProviderID = treatCode.ProviderID;
                        provCPT.TreatmentCodeID = treatCode.TreatmentCodeID;
                        provCPT.CPTCode = treatCode.CPTCode;
                        provCPT.Deleted = false;
                        provCPT.CreatedDate = DateTime.Now;
                        provCPT.CreatedBy = "User";

                        this.uow.GenericRepository<ProviderTreatmentCode>().Insert(provCPT);
                    }
                }
                else
                {
                    foreach (var treatCode in provCPTData)
                    {
                        provCPT = new ProviderTreatmentCode();
                        if (treatCode.codeStatus.ToLower().Trim() == "add")
                        {
                            provCPT.ProviderID = treatCode.ProviderID;
                            provCPT.TreatmentCodeID = treatCode.TreatmentCodeID;
                            provCPT.CPTCode = treatCode.CPTCode;
                            provCPT.Deleted = false;
                            provCPT.CreatedDate = DateTime.Now;
                            provCPT.CreatedBy = "User";

                            this.uow.GenericRepository<ProviderTreatmentCode>().Insert(provCPT);
                        }
                        else if (treatCode.codeStatus.ToLower().Trim() == "remove")
                        {
                            provCPT = this.uow.GenericRepository<ProviderTreatmentCode>().Table().SingleOrDefault(x => x.ProviderTreatmentCodeID == treatCode.ProviderTreatmentCodeID);

                            if (provCPT != null)
                            {
                                this.uow.GenericRepository<ProviderTreatmentCode>().Delete(provCPT);
                                this.uow.Save();
                            }
                        }
                    }
                }
                this.uow.Save();
            }
            return provCPTData;
        }


        ///// <summary>
        ///// Get Specialities for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderSpecialityModel>. if Collection of Specialities for given Provider = success. else = failure</returns>
        public List<ProviderSpecialityModel> GetProviderSpecialities(int ProviderId)
        {
            var provSpecialities = (from proSpec in uow.GenericRepository<ProviderSpeciality>().Table()
                                    where proSpec.ProviderID == ProviderId
                                    join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on proSpec.ProviderID equals prov.ProviderID
                                    select new
                                    {
                                        proSpec.ProviderSpecialtyID,
                                        proSpec.ProviderID,
                                        proSpec.SpecialityID,
                                        proSpec.SpecialityCode,
                                        proSpec.SpecialityDescription,
                                        proSpec.EffectiveDate,
                                        proSpec.TerminationDate,
                                        proSpec.Createddate,
                                        proSpec.CreatedBy,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName
                                    }).AsEnumerable().OrderBy(x => x.TerminationDate).Select(PSM => new ProviderSpecialityModel
                                    {
                                        ProviderSpecialtyID = PSM.ProviderSpecialtyID,
                                        ProviderID = PSM.ProviderID,
                                        ProviderName = PSM.FirstName + " " + PSM.MiddleName + " " + PSM.LastName,
                                        SpecialityID = PSM.SpecialityID,
                                        SpecialityCode = PSM.SpecialityCode,
                                        SpecialityDescription = PSM.SpecialityDescription,
                                        EffectiveDate = PSM.EffectiveDate,
                                        TerminationDate = PSM.TerminationDate,
                                        Createddate = PSM.Createddate,
                                        CreatedBy = PSM.CreatedBy

                                    }).ToList();
            return provSpecialities;
        }

        ///// <summary>
        ///// Get Speciality and data for given ProviderSpecialityId
        ///// </summary>
        ///// <param>int ProvSpecialityId</param>
        ///// <returns>ProviderSpecialityModel. if Speciality and data for given ProviderSpecialityId = success. else = failure</returns>
        public ProviderSpecialityModel GetProviderSpecialityByID(int ProvSpecialityId)
        {
            var provSpeciality = (from proSpec in uow.GenericRepository<ProviderSpeciality>().Table()
                                  where proSpec.ProviderSpecialtyID == ProvSpecialityId
                                  join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                  on proSpec.ProviderID equals prov.ProviderID
                                  select new
                                  {
                                      proSpec.ProviderSpecialtyID,
                                      proSpec.ProviderID,
                                      proSpec.SpecialityID,
                                      proSpec.SpecialityCode,
                                      proSpec.SpecialityDescription,
                                      proSpec.EffectiveDate,
                                      proSpec.TerminationDate,
                                      proSpec.Createddate,
                                      proSpec.CreatedBy,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName
                                  }).AsEnumerable().Select(PSM => new ProviderSpecialityModel
                                  {
                                      ProviderSpecialtyID = PSM.ProviderSpecialtyID,
                                      ProviderID = PSM.ProviderID,
                                      ProviderName = PSM.FirstName + " " + PSM.MiddleName + " " + PSM.LastName,
                                      SpecialityID = PSM.SpecialityID,
                                      SpecialityCode = PSM.SpecialityCode,
                                      SpecialityDescription = PSM.SpecialityDescription,
                                      EffectiveDate = PSM.EffectiveDate,
                                      TerminationDate = PSM.TerminationDate,
                                      Createddate = PSM.Createddate,
                                      CreatedBy = PSM.CreatedBy

                                  }).SingleOrDefault();
            return provSpeciality;
        }

        ///// <summary>
        ///// Add Speciality for Provider
        ///// </summary>
        ///// <param>ProviderSpecialityModel SpecialityData</param>
        ///// <returns>ProviderSpecialityModel. if Speciality added or updated for provider = success. else = failure</returns>
        public ProviderSpecialityModel AddUpdateProviderSpeciality(ProviderSpecialityModel SpecialityData)
        {
            var Spec = this.uow.GenericRepository<ProviderSpeciality>().Table().SingleOrDefault(x => x.ProviderID == SpecialityData.ProviderID
                        && x.SpecialityID == SpecialityData.SpecialityID);

            if (Spec == null)
            {
                Spec = new ProviderSpeciality();

                Spec.ProviderID = SpecialityData.ProviderID;
                Spec.SpecialityID = SpecialityData.SpecialityID;
                Spec.SpecialityCode = SpecialityData.SpecialityCode.Trim();
                Spec.SpecialityDescription = SpecialityData.SpecialityDescription.Trim();
                Spec.EffectiveDate = SpecialityData.EffectiveDate != null ? this.utilService.GetLocalTime(SpecialityData.EffectiveDate.Value) : SpecialityData.EffectiveDate;
                Spec.TerminationDate = SpecialityData.TerminationDate != null ? this.utilService.GetLocalTime(SpecialityData.TerminationDate.Value) : SpecialityData.TerminationDate;
                Spec.Createddate = DateTime.Now;
                Spec.CreatedBy = "User";

                this.uow.GenericRepository<ProviderSpeciality>().Insert(Spec);
            }
            else
            {
                Spec.EffectiveDate = SpecialityData.EffectiveDate != null ? this.utilService.GetLocalTime(SpecialityData.EffectiveDate.Value) : SpecialityData.EffectiveDate;
                Spec.TerminationDate = SpecialityData.TerminationDate != null ? this.utilService.GetLocalTime(SpecialityData.TerminationDate.Value) : SpecialityData.TerminationDate;
                Spec.ModifiedDate = DateTime.Now;
                Spec.ModifiedBy = "User";

                this.uow.GenericRepository<ProviderSpeciality>().Update(Spec);
            }
            this.uow.Save();

            return SpecialityData;
        }


        ///// <summary>
        ///// Get VacationDetails for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderVacationModel>. if Collection of VacationDetails for given Provider = success. else = failure</returns>
        public List<ProviderVacationModel> GetProviderVacationDetails(int ProviderId)
        {
            var proVacations = (from proVac in uow.GenericRepository<ProviderVacation>().Table()
                                where proVac.ProviderID == ProviderId
                                join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                on proVac.ProviderID equals prov.ProviderID
                                select new
                                {
                                    proVac.ProvidervacationID,
                                    proVac.ProviderID,
                                    proVac.Reason,
                                    proVac.StartDate,
                                    proVac.EndDate,
                                    proVac.Createddate,
                                    proVac.CreatedBy,
                                    prov.FirstName,
                                    prov.MiddleName,
                                    prov.LastName
                                }).AsEnumerable().OrderByDescending(x => x.StartDate).Select(PVM => new ProviderVacationModel
                                {
                                    ProvidervacationID = PVM.ProvidervacationID,
                                    ProviderID = PVM.ProviderID,
                                    ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
                                    Reason = PVM.Reason,
                                    StartDate = PVM.StartDate,
                                    EndDate = PVM.EndDate,
                                    Createddate = PVM.Createddate,
                                    CreatedBy = PVM.CreatedBy

                                }).ToList();
            return proVacations;
        }

        ///// <summary>
        ///// Add vacation for Provider
        ///// </summary>
        ///// <param>ProviderVacationModel VacationData</param>
        ///// <returns>ProviderVacationModel. if vacation added or updated for provider = success. else = failure</returns>
        public ProviderVacationModel AddUpdateVacationDetails(ProviderVacationModel VacationData)
        {
            var vacation = this.uow.GenericRepository<ProviderVacation>().Table().SingleOrDefault(x => x.ProvidervacationID == VacationData.ProvidervacationID);

            if (vacation == null)
            {
                var vacationCheck = (from data in this.uow.GenericRepository<ProviderVacation>().Table()
                                     where (data.ProviderID == VacationData.ProviderID
                                     && ((this.utilService.GetLocalTime(VacationData.StartDate.Value).Date >= data.StartDate.Value.Date && this.utilService.GetLocalTime(VacationData.StartDate.Value).Date <= data.EndDate.Value.Date)
                                     || (this.utilService.GetLocalTime(VacationData.EndDate.Value).Date >= data.StartDate.Value.Date && this.utilService.GetLocalTime(VacationData.EndDate.Value).Date <= data.EndDate.Value.Date))
                                     )
                                     select data).FirstOrDefault();

                if (vacationCheck != null)
                {
                    VacationData.status = "Provider has already applied for vacation on these days";
                }
                else
                {
                    vacation = new ProviderVacation();

                    vacation.ProviderID = VacationData.ProviderID;
                    vacation.Reason = VacationData.Reason;
                    vacation.StartDate = VacationData.StartDate != null ? this.utilService.GetLocalTime(VacationData.StartDate.Value) : VacationData.StartDate;
                    vacation.EndDate = VacationData.EndDate != null ? this.utilService.GetLocalTime(VacationData.EndDate.Value) : VacationData.EndDate;
                    vacation.Createddate = DateTime.Now;
                    vacation.CreatedBy = "User";

                    this.uow.GenericRepository<ProviderVacation>().Insert(vacation);
                    this.uow.Save();
                    VacationData.status = "Vacation details added Successfully";
                }

            }
            else
            {
                var vacationCheck = (from data in this.uow.GenericRepository<ProviderVacation>().Table()
                                     where (data.ProviderID == VacationData.ProviderID
                                     && ((this.utilService.GetLocalTime(VacationData.StartDate.Value).Date >= data.StartDate.Value.Date && this.utilService.GetLocalTime(VacationData.StartDate.Value).Date <= data.EndDate.Value.Date)
                                     || (this.utilService.GetLocalTime(VacationData.EndDate.Value).Date >= data.StartDate.Value.Date && this.utilService.GetLocalTime(VacationData.EndDate.Value).Date <= data.EndDate.Value.Date))
                                     )
                                     select data).FirstOrDefault();

                if (vacationCheck != null && vacationCheck.ProvidervacationID != VacationData.ProvidervacationID)
                {
                    VacationData.status = "Provider has already applied for vacation on these days";
                }
                else
                {
                    vacation.ProviderID = VacationData.ProviderID;
                    vacation.Reason = VacationData.Reason;
                    vacation.StartDate = VacationData.StartDate != null ? this.utilService.GetLocalTime(VacationData.StartDate.Value) : VacationData.StartDate;
                    vacation.EndDate = VacationData.EndDate != null ? this.utilService.GetLocalTime(VacationData.EndDate.Value) : VacationData.EndDate;
                    vacation.ModifiedDate = DateTime.Now;
                    vacation.ModifiedBy = "User";

                    this.uow.GenericRepository<ProviderVacation>().Update(vacation);
                    this.uow.Save();
                    VacationData.status = "Vacation details Updated Successfully";
                }
            }

            if (vacation != null && vacation.ProvidervacationID > 0)
            {
                VacationData.ProvidervacationID = vacation.ProvidervacationID;
            }

            return VacationData;
        }

        ///// <summary>
        ///// Get VacationDetails for given Provider
        ///// </summary>
        ///// <param>int ProVacationId</param>
        ///// <returns>ProviderVacationModel. if VacationDetails for given Provider = success. else = failure</returns>
        public ProviderVacationModel GetVacationDetailforProvider(int ProVacationId)
        {
            var proVacations = (from proVac in uow.GenericRepository<ProviderVacation>().Table()
                                where proVac.ProvidervacationID == ProVacationId
                                join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                on proVac.ProviderID equals prov.ProviderID
                                select new
                                {
                                    proVac.ProvidervacationID,
                                    proVac.ProviderID,
                                    proVac.Reason,
                                    proVac.StartDate,
                                    proVac.EndDate,
                                    proVac.Createddate,
                                    proVac.CreatedBy,
                                    prov.FirstName,
                                    prov.MiddleName,
                                    prov.LastName
                                }).AsEnumerable().Select(PVM => new ProviderVacationModel
                                {
                                    ProvidervacationID = PVM.ProvidervacationID,
                                    ProviderID = PVM.ProviderID,
                                    ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
                                    Reason = PVM.Reason,
                                    StartDate = PVM.StartDate,
                                    EndDate = PVM.EndDate,
                                    Createddate = PVM.Createddate,
                                    CreatedBy = PVM.CreatedBy

                                }).SingleOrDefault();
            return proVacations;
        }

        ///// <summary>
        ///// Get ScheduleDetails for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderScheduleModel>. if Collection of ScheduleDetails for given Provider = success. else = failure</returns>
        public List<ProviderScheduleModel> GetProviderScheduleDetails(int ProviderId, int facilityID)
        {
            var provSchedules = (from provSched in uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ProviderId & x.FacilityID == facilityID)
                                 join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on provSched.ProviderID equals prov.ProviderID
                                 where (provSched.TerminationDate == null || (provSched.TerminationDate != null && provSched.TerminationDate.Value > DateTime.Now.Date))
                                 select new
                                 {
                                     provSched.ProviderID,
                                     provSched.FacilityID,
                                     provSched.TimeSlotDuration,
                                     provSched.BookingPerSlot,
                                     provSched.AppointmentAllowed,
                                     provSched.EffectiveDate,
                                     provSched.TerminationDate,
                                     provSched.CreatedDate,
                                     provSched.CreatedBy,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName,
                                     provSched.AppointmentDay,
                                     provSched.RegularWorkHrsFrom,
                                     provSched.RegularWorkHrsTo,
                                     provSched.BreakHrsFrom1,
                                     provSched.BreakHrsTo1,
                                     provSched.BreakHrsFrom2,
                                     provSched.BreakHrsTo2,
                                     provSched.NoOfSlots,
                                     provSched.BookingPerDay

                                 }).AsEnumerable().Select(PSCM => new ProviderScheduleModel
                                 {
                                     ProviderID = PSCM.ProviderID,
                                     ProviderName = PSCM.FirstName + " " + PSCM.MiddleName + " " + PSCM.LastName,
                                     FacilityID = PSCM.FacilityID,
                                     FacilityName = PSCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PSCM.FacilityID).FacilityName : "",
                                     TimeSlotDuration = PSCM.TimeSlotDuration,
                                     BookingPerSlot = PSCM.BookingPerSlot,
                                     AppointmentAllowed = PSCM.AppointmentAllowed,
                                     EffectiveDate = PSCM.EffectiveDate,
                                     TerminationDate = PSCM.TerminationDate,
                                     CreatedDate = PSCM.CreatedDate,
                                     CreatedBy = PSCM.CreatedBy,
                                     AppointmentDay = PSCM.AppointmentDay,
                                     RegularWorkHrsFrom = PSCM.RegularWorkHrsFrom,
                                     RegularWorkHrsTo = PSCM.RegularWorkHrsTo,
                                     BreakHrsFrom1 = PSCM.BreakHrsFrom1,
                                     BreakHrsTo1 = PSCM.BreakHrsTo1,
                                     BreakHrsFrom2 = PSCM.BreakHrsFrom2,
                                     BreakHrsTo2 = PSCM.BreakHrsTo2,
                                     NoOfSlots = PSCM.NoOfSlots,
                                     BookingPerDay = PSCM.BookingPerDay,

                                 }).ToList();
            return provSchedules;
        }

        ///// <summary>
        ///// Get Schedules for Provider
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>ProviderScheduleModel. if Schedules for given Provider = success. else = failure</returns>
        public ProviderScheduleModel GetProviderSchedules(int ProviderId, int facilityID)
        {
            var provSchedules = (from provSched in uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ProviderId & x.FacilityID == facilityID)
                                 join prov in uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on provSched.ProviderID equals prov.ProviderID
                                 where (provSched.TerminationDate == null || (provSched.TerminationDate != null && provSched.TerminationDate.Value > DateTime.Now.Date))
                                 select new
                                 {
                                     provSched.ProviderID,
                                     provSched.ProviderScheduleID,
                                     provSched.FacilityID,
                                     provSched.TimeSlotDuration,
                                     provSched.BookingPerSlot,
                                     provSched.AppointmentAllowed,
                                     provSched.EffectiveDate,
                                     provSched.TerminationDate,
                                     provSched.CreatedDate,
                                     provSched.CreatedBy,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName

                                 }).AsEnumerable().Select(PSCM => new ProviderScheduleModel
                                 {
                                     ProviderScheduleID = PSCM.ProviderScheduleID,
                                     ProviderID = PSCM.ProviderID,
                                     ProviderName = PSCM.FirstName + " " + PSCM.MiddleName + " " + PSCM.LastName,
                                     FacilityID = PSCM.FacilityID,
                                     FacilityName = PSCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PSCM.FacilityID).FacilityName : "",
                                     TimeSlotDuration = PSCM.TimeSlotDuration,
                                     BookingPerSlot = PSCM.BookingPerSlot,
                                     AppointmentAllowed = PSCM.AppointmentAllowed,
                                     EffectiveDate = PSCM.EffectiveDate,
                                     TerminationDate = PSCM.TerminationDate,
                                     CreatedDate = PSCM.CreatedDate,
                                     CreatedBy = PSCM.CreatedBy,
                                     Items = this.GetSchedulesByProvider(PSCM.ProviderScheduleID)

                                 }).FirstOrDefault();
            return provSchedules;
        }

        ///// <summary>
        ///// Get Collection of Schedule Items for Provider(Local method)
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ScheduleItemsModel>. if Collection of Schedule Items for given Provider = success. else = failure</returns>
        public List<ScheduleItemsModel> GetSchedulesByProvider(int ProviderScheduleID)
        {
            var provSchedules = (from provSched in uow.GenericRepository<ProviderSchedule>().Table()
                                 where provSched.ProviderScheduleID == ProviderScheduleID
                                 select new
                                 {
                                     provSched.AppointmentDay,
                                     provSched.RegularWorkHrsFrom,
                                     provSched.RegularWorkHrsTo,
                                     provSched.BreakHrsFrom1,
                                     provSched.BreakHrsTo1,
                                     provSched.BreakHrsFrom2,
                                     provSched.BreakHrsTo2,
                                     provSched.NoOfSlots,
                                     provSched.BookingPerDay

                                 }).AsEnumerable().Select(SIM => new ScheduleItemsModel
                                 {
                                     AppointmentDay = SIM.AppointmentDay,
                                     RegularWorkHrsFrom = SIM.RegularWorkHrsFrom,
                                     RegularWorkHrsTo = SIM.RegularWorkHrsTo,
                                     BreakHrsFrom1 = SIM.BreakHrsFrom1,
                                     BreakHrsTo1 = SIM.BreakHrsTo1,
                                     BreakHrsFrom2 = SIM.BreakHrsFrom2,
                                     BreakHrsTo2 = SIM.BreakHrsTo2,
                                     NoOfSlots = SIM.NoOfSlots,
                                     BookingPerDay = SIM.BookingPerDay,

                                 }).ToList();
            return provSchedules;
        }

        ///// <summary>
        ///// Add or update Schedules for Provider
        ///// </summary>
        ///// <param>ProviderScheduleModel ScheduleData</param>
        ///// <returns>ProviderScheduleModel. if Schedules added or updated for provider = success. else = failure</returns>
        public ProviderScheduleModel AddUpdateSchedules(ProviderScheduleModel ScheduleData)
        {
            var ScheduledItems = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ScheduleData.ProviderID &&
                                        x.FacilityID == ScheduleData.FacilityID).ToList();
            List<string> days = new List<string>();

            int slotCount = 0;
            if (ScheduledItems.Count() == 0)
            {
                foreach (var item in ScheduleData.Items)
                {
                    var data = new ScheduleItemsModel();

                    data.AppointmentDay = item.AppointmentDay;
                    data.RegularWorkHrsFrom = (item.RegularWorkHrsFrom != null && item.RegularWorkHrsFrom != "" && item.RegularWorkHrsFrom != "00:00:00") ? item.RegularWorkHrsFrom : (item.RegularWorkHrsFrom == "00:00:00" ? null : item.RegularWorkHrsFrom);
                    data.RegularWorkHrsTo = (item.RegularWorkHrsTo != null && item.RegularWorkHrsTo != "" && item.RegularWorkHrsTo != "00:00:00") ? item.RegularWorkHrsTo : (item.RegularWorkHrsTo == "00:00:00" ? null : item.RegularWorkHrsTo);
                    data.BreakHrsFrom1 = (item.BreakHrsFrom1 != null && item.BreakHrsFrom1 != "" && item.BreakHrsFrom1 != "00:00:00") ? item.BreakHrsFrom1 : (item.BreakHrsFrom1 == "00:00:00" ? null : item.BreakHrsFrom1);
                    data.BreakHrsFrom2 = (item.BreakHrsFrom2 != null && item.BreakHrsFrom2 != "" && item.BreakHrsFrom2 != "00:00:00") ? item.BreakHrsFrom2 : (item.BreakHrsFrom2 == "00:00:00" ? null : item.BreakHrsFrom2);
                    data.BreakHrsTo1 = (item.BreakHrsTo1 != null && item.BreakHrsTo1 != "" && item.BreakHrsTo1 != "00:00:00") ? item.BreakHrsTo1 : (item.BreakHrsTo1 == "00:00:00" ? null : item.BreakHrsTo1);
                    data.BreakHrsTo2 = (item.BreakHrsTo2 != null && item.BreakHrsTo2 != "" && item.BreakHrsTo2 != "00:00:00") ? item.BreakHrsTo2 : (item.BreakHrsTo2 == "00:00:00" ? null : item.BreakHrsTo2);

                    slotCount = this.GetTimingsforSchedule(ScheduleData.TimeSlotDuration, data).Count();

                    var scheduleRecord = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ScheduleData.ProviderID &
                                        x.AppointmentDay == item.AppointmentDay &
                                        ((this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                        & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsFrom))
                                        | (this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsTo)
                                        & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsTo))
                                        | (this.GetRailwayTime(x.RegularWorkHrsFrom) >= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                        & this.GetRailwayTime(x.RegularWorkHrsTo) <= this.GetRailwayTime(item.RegularWorkHrsTo))
                                        )).FirstOrDefault();

                    if (scheduleRecord == null)
                    {
                        ProviderSchedule Schedule = new ProviderSchedule();

                        Schedule.ProviderID = ScheduleData.ProviderID;
                        Schedule.FacilityID = ScheduleData.FacilityID;
                        Schedule.EffectiveDate = ScheduleData.EffectiveDate != null ? this.utilService.GetLocalTime(ScheduleData.EffectiveDate.Value) : ScheduleData.EffectiveDate;
                        Schedule.TerminationDate = ScheduleData.TerminationDate != null ? this.utilService.GetLocalTime(ScheduleData.TerminationDate.Value) : ScheduleData.TerminationDate;
                        Schedule.TimeSlotDuration = ScheduleData.TimeSlotDuration;
                        Schedule.BookingPerSlot = ScheduleData.BookingPerSlot;
                        Schedule.AppointmentAllowed = ScheduleData.AppointmentAllowed;
                        Schedule.AppointmentDay = item.AppointmentDay;
                        Schedule.RegularWorkHrsFrom = item.RegularWorkHrsFrom == "00:00:00" ? null : item.RegularWorkHrsFrom;
                        Schedule.RegularWorkHrsTo = item.RegularWorkHrsTo == "00:00:00" ? null : item.RegularWorkHrsTo;
                        Schedule.BreakHrsFrom1 = item.BreakHrsFrom1 == "00:00:00" ? null : item.BreakHrsFrom1;
                        Schedule.BreakHrsFrom2 = item.BreakHrsFrom2 == "00:00:00" ? null : item.BreakHrsFrom2;
                        Schedule.BreakHrsTo1 = item.BreakHrsTo1 == "00:00:00" ? null : item.BreakHrsTo1;
                        Schedule.BreakHrsTo2 = item.BreakHrsTo2 == "00:00:00" ? null : item.BreakHrsTo2;
                        Schedule.NoOfSlots = slotCount;
                        Schedule.BookingPerDay = ScheduleData.BookingPerSlot * slotCount;
                        Schedule.CreatedDate = DateTime.Now;
                        Schedule.CreatedBy = "User";

                        this.uow.GenericRepository<ProviderSchedule>().Insert(Schedule);
                        this.uow.Save();
                    }
                    else
                    {
                        days.Add(item.AppointmentDay);
                    }
                }
                this.uow.Save();
            }
            else
            {
                var data = new ScheduleItemsModel();
                var itemsList = new List<ScheduleItemsModel>();
                foreach (var set in ScheduledItems)
                {
                    var record = ScheduleData.Items.Where(x => x.AppointmentDay.ToLower().Trim() == set.AppointmentDay.ToLower().Trim()).FirstOrDefault();
                    if (record == null)
                    {
                        this.uow.GenericRepository<ProviderSchedule>().Delete(set);
                    }
                    else
                    {
                        itemsList.Add(record);
                    }
                }
                this.uow.Save();

                foreach (var scheduleSet in ScheduleData.Items)
                {
                    if (!itemsList.Contains(scheduleSet))
                    {
                        itemsList.Add(scheduleSet);
                    }
                }
                foreach (var item in itemsList)
                {
                    //this.uow.GenericRepository<ProviderSchedule>().Delete(delItem);
                    //}
                    //this.uow.Save();

                    //foreach (var item in ScheduleData.Items)
                    //{
                    var SchedRecord = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ScheduleData.ProviderID &
                                            x.AppointmentDay.ToLower().Trim() == item.AppointmentDay.ToLower().Trim() & x.FacilityID == ScheduleData.FacilityID).FirstOrDefault();

                    data = new ScheduleItemsModel();

                    data.AppointmentDay = item.AppointmentDay;
                    data.RegularWorkHrsFrom = (item.RegularWorkHrsFrom != null && item.RegularWorkHrsFrom != "" && item.RegularWorkHrsFrom != "00:00:00") ? item.RegularWorkHrsFrom : (item.RegularWorkHrsFrom == "00:00:00" ? null : item.RegularWorkHrsFrom);
                    data.RegularWorkHrsTo = (item.RegularWorkHrsTo != null && item.RegularWorkHrsTo != "" && item.RegularWorkHrsTo != "00:00:00") ? item.RegularWorkHrsTo : (item.RegularWorkHrsTo == "00:00:00" ? null : item.RegularWorkHrsTo);
                    data.BreakHrsFrom1 = (item.BreakHrsFrom1 != null && item.BreakHrsFrom1 != "" && item.BreakHrsFrom1 != "00:00:00") ? item.BreakHrsFrom1 : (item.BreakHrsFrom1 == "00:00:00" ? null : item.BreakHrsFrom1);
                    data.BreakHrsFrom2 = (item.BreakHrsFrom2 != null && item.BreakHrsFrom2 != "" && item.BreakHrsFrom2 != "00:00:00") ? item.BreakHrsFrom2 : (item.BreakHrsFrom2 == "00:00:00" ? null : item.BreakHrsFrom2);
                    data.BreakHrsTo1 = (item.BreakHrsTo1 != null && item.BreakHrsTo1 != "" && item.BreakHrsTo1 != "00:00:00") ? item.BreakHrsTo1 : (item.BreakHrsTo1 == "00:00:00" ? null : item.BreakHrsTo1);
                    data.BreakHrsTo2 = (item.BreakHrsTo2 != null && item.BreakHrsTo2 != "" && item.BreakHrsTo2 != "00:00:00") ? item.BreakHrsTo2 : (item.BreakHrsTo2 == "00:00:00" ? null : item.BreakHrsTo2);

                    slotCount = this.GetTimingsforSchedule(ScheduleData.TimeSlotDuration, data).Count();

                    if (SchedRecord != null)
                    {
                        var scheduleRecord = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ScheduleData.ProviderID &
                                            x.AppointmentDay == item.AppointmentDay & x.ProviderScheduleID != SchedRecord.ProviderScheduleID &
                                            ((this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsFrom))
                                            | (this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsTo)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsTo))
                                            | (this.GetRailwayTime(x.RegularWorkHrsFrom) >= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) <= this.GetRailwayTime(item.RegularWorkHrsTo))
                                            )).FirstOrDefault();

                        if (scheduleRecord == null)
                        {
                            var insItem = this.uow.GenericRepository<ProviderSchedule>().Table().FirstOrDefault(x => x.ProviderScheduleID == SchedRecord.ProviderScheduleID);

                            insItem.ProviderID = ScheduleData.ProviderID;
                            insItem.FacilityID = ScheduleData.FacilityID;
                            insItem.EffectiveDate = ScheduleData.EffectiveDate != null ? this.utilService.GetLocalTime(ScheduleData.EffectiveDate.Value) : ScheduleData.EffectiveDate;
                            insItem.TerminationDate = ScheduleData.TerminationDate != null ? this.utilService.GetLocalTime(ScheduleData.TerminationDate.Value) : ScheduleData.TerminationDate;
                            insItem.TimeSlotDuration = ScheduleData.TimeSlotDuration;
                            insItem.BookingPerSlot = ScheduleData.BookingPerSlot;
                            insItem.AppointmentAllowed = ScheduleData.AppointmentAllowed;
                            insItem.AppointmentDay = item.AppointmentDay;
                            insItem.RegularWorkHrsFrom = item.RegularWorkHrsFrom == "00:00:00" ? null : item.RegularWorkHrsFrom;
                            insItem.RegularWorkHrsTo = item.RegularWorkHrsTo == "00:00:00" ? null : item.RegularWorkHrsTo;
                            insItem.BreakHrsFrom1 = item.BreakHrsFrom1 == "00:00:00" ? null : item.BreakHrsFrom1;
                            insItem.BreakHrsFrom2 = item.BreakHrsFrom2 == "00:00:00" ? null : item.BreakHrsFrom2;
                            insItem.BreakHrsTo1 = item.BreakHrsTo1 == "00:00:00" ? null : item.BreakHrsTo1;
                            insItem.BreakHrsTo2 = item.BreakHrsTo2 == "00:00:00" ? null : item.BreakHrsTo2;
                            insItem.NoOfSlots = slotCount;
                            insItem.BookingPerDay = ScheduleData.BookingPerSlot * slotCount;
                            insItem.ModifiedDate = DateTime.Now;
                            insItem.ModifiedBy = "User";

                            this.uow.GenericRepository<ProviderSchedule>().Update(insItem);
                            this.uow.Save();
                        }
                        else
                        {
                            days.Add(item.AppointmentDay);
                        }
                    }
                    else //if (item.AppointmentDay.ToLower().Trim() != delItem.AppointmentDay.ToLower().Trim())
                    {
                        var scheduleRecord = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ScheduleData.ProviderID &
                                            x.AppointmentDay == item.AppointmentDay &
                                            ((this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsFrom))
                                            | (this.GetRailwayTime(x.RegularWorkHrsFrom) <= this.GetRailwayTime(item.RegularWorkHrsTo)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) >= this.GetRailwayTime(item.RegularWorkHrsTo))
                                            | (this.GetRailwayTime(x.RegularWorkHrsFrom) >= this.GetRailwayTime(item.RegularWorkHrsFrom)
                                            & this.GetRailwayTime(x.RegularWorkHrsTo) <= this.GetRailwayTime(item.RegularWorkHrsTo))
                                            )).FirstOrDefault();

                        if (scheduleRecord == null)
                        {
                            ProviderSchedule Schedule = new ProviderSchedule();

                            Schedule.ProviderID = ScheduleData.ProviderID;
                            Schedule.FacilityID = ScheduleData.FacilityID;
                            Schedule.EffectiveDate = ScheduleData.EffectiveDate != null ? this.utilService.GetLocalTime(ScheduleData.EffectiveDate.Value) : ScheduleData.EffectiveDate;
                            Schedule.TerminationDate = ScheduleData.TerminationDate != null ? this.utilService.GetLocalTime(ScheduleData.TerminationDate.Value) : ScheduleData.TerminationDate;
                            Schedule.TimeSlotDuration = ScheduleData.TimeSlotDuration;
                            Schedule.BookingPerSlot = ScheduleData.BookingPerSlot;
                            Schedule.AppointmentAllowed = ScheduleData.AppointmentAllowed;
                            Schedule.AppointmentDay = item.AppointmentDay;
                            Schedule.RegularWorkHrsFrom = item.RegularWorkHrsFrom == "00:00:00" ? null : item.RegularWorkHrsFrom;
                            Schedule.RegularWorkHrsTo = item.RegularWorkHrsTo == "00:00:00" ? null : item.RegularWorkHrsTo;
                            Schedule.BreakHrsFrom1 = item.BreakHrsFrom1 == "00:00:00" ? null : item.BreakHrsFrom1;
                            Schedule.BreakHrsFrom2 = item.BreakHrsFrom2 == "00:00:00" ? null : item.BreakHrsFrom2;
                            Schedule.BreakHrsTo1 = item.BreakHrsTo1 == "00:00:00" ? null : item.BreakHrsTo1;
                            Schedule.BreakHrsTo2 = item.BreakHrsTo2 == "00:00:00" ? null : item.BreakHrsTo2;
                            Schedule.NoOfSlots = slotCount;
                            Schedule.BookingPerDay = ScheduleData.BookingPerSlot * slotCount;
                            Schedule.CreatedDate = DateTime.Now;
                            Schedule.CreatedBy = "User";

                            this.uow.GenericRepository<ProviderSchedule>().Insert(Schedule);
                            this.uow.Save();
                        }
                        else
                        {
                            days.Add(item.AppointmentDay);
                        }
                    }
                }
                this.uow.Save();
                //}
            }
            if (days.Count() > 0)
            {
                string daynames = "";

                for (int i = 0; i < days.Count(); i++)
                {
                    if (i + 1 == days.Count())
                    {
                        if (daynames == null || daynames == "")
                        {
                            daynames = days[i];
                        }
                        else
                        {
                            daynames = daynames + days[i];
                        }
                    }
                    else
                    {
                        if (daynames == null || daynames == "")
                        {
                            daynames = days[i] + ", ";
                        }
                        else
                        {
                            daynames = daynames + days[i] + ", ";
                        }
                    }
                }

                ScheduleData.TimeavailabilityStatus = "Selected Timing Not available on " + daynames;
            }
            else
            {
                ScheduleData.TimeavailabilityStatus = "Available";
            }


            return ScheduleData;
        }

        ///// <summary>
        ///// Get Timings for Slots
        ///// </summary>
        ///// <param>(int SlotDuration, ScheduleItemsModel)</param>
        ///// <returns>List<string>. if Collection of timings returned for given scheduleItems = success. else = failure</returns>
        public List<string> GetTimingsforSchedule(int SlotDuration, ScheduleItemsModel item)
        {
            List<string> Timings = new List<string>();

            TimeSpan time = new TimeSpan();
            TimeSpan timeSet = new TimeSpan();
            TimeSpan duration = new TimeSpan(0, SlotDuration, 0);

            //if (this.GetRailwayTime(item.RegularWorkHrsFrom) < this.GetRailwayTime(item.RegularWorkHrsTo))
            //{
            time = (item.RegularWorkHrsFrom == "12:00:00 am" || item.RegularWorkHrsFrom == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.RegularWorkHrsFrom);

            if ((item.BreakHrsFrom1 != null && item.BreakHrsFrom1 != "")
                && (item.BreakHrsTo1 != null && item.BreakHrsTo1 != ""))
            {
                timeSet = (item.BreakHrsFrom1 == "12:00:00 am" || item.BreakHrsFrom1 == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.BreakHrsFrom1);

                while (time < timeSet)
                {
                    if (time + duration <= timeSet)
                    {
                        if (!Timings.Contains(time.ToString()))
                        {
                            Timings.Add(time.ToString());
                        }
                    }
                    time = time + duration;
                }

                timeSet = (item.BreakHrsTo1 == "12:00:00 am" || item.BreakHrsTo1 == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.BreakHrsTo1);

                time = timeSet;
            }

            if ((item.BreakHrsFrom2 != null && item.BreakHrsFrom2 != "")
                && (item.BreakHrsTo2 != null && item.BreakHrsTo2 != ""))
            {
                timeSet = (item.BreakHrsFrom2 == "12:00:00 am" || item.BreakHrsFrom2 == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.BreakHrsFrom2);

                while (time < timeSet)
                {
                    if (time + duration <= timeSet)
                    {
                        if (!Timings.Contains(time.ToString()))
                        {
                            Timings.Add(time.ToString());
                        }
                    }
                    time = time + duration;
                }

                timeSet = (item.BreakHrsTo2 == "12:00:00 am" || item.BreakHrsTo2 == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.BreakHrsTo2);

                time = timeSet;
            }
            if (item.RegularWorkHrsTo != null && item.RegularWorkHrsTo != "")
            {
                timeSet = (item.RegularWorkHrsTo == "12:00:00 am" || item.RegularWorkHrsTo == "12:00 am") ? this.GetRailwayTime("00:00 am") : this.GetRailwayTime(item.RegularWorkHrsTo);

                while (time < timeSet)
                {
                    if (time + duration <= timeSet)
                    {
                        if (!Timings.Contains(time.ToString()))
                        {
                            Timings.Add(time.ToString());
                        }
                    }
                    time = time + duration;
                }
            }
            //}
            return Timings;
        }

        ///// <summary>
        ///// Get Time For Schedule as Railway Date
        ///// </summary>
        ///// <param>(string scheduledTime)</param>
        ///// <returns>TimeSpan. if Railway time for given value = success. else = failure</returns>
        public TimeSpan GetRailwayTime(string scheduledTime)
        {
            int Hours = 0;
            int Mins = 0;
            TimeSpan time = new TimeSpan(0, 0, 0);

            string timeSet = scheduledTime.Split(' ')[0];

            if (scheduledTime.ToLower().Trim().Contains("pm") && timeSet.Split(':')[0] != "12")
            {
                Hours = Int32.Parse(timeSet.Split(':')[0]) + 12;
                Mins = Int32.Parse(timeSet.Split(':')[1]);
            }
            else
            {
                Hours = Int32.Parse(timeSet.Split(':')[0]);
                Mins = Int32.Parse(timeSet.Split(':')[1]);
            }
            time = new TimeSpan(Hours, Mins, 0);

            return time;
        }

        ///// <summary>
        ///// Get ProviderDetails by search
        ///// </summary>
        ///// <param>(int ProviderId, int SpecialityId)</param>
        ///// <returns>List<ProviderModel>. if Collection of ProviderDetails for given Provider and speciality = success. else = failure</returns>
        public List<ProviderModel> SearchProvider(int ProviderId, int SpecialityId)
        {
            List<ProviderModel> providerList = new List<ProviderModel>();

            var ProviderData = (from prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)

                                where (ProviderId == 0 || prov.ProviderID == ProviderId)

                                select new
                                {
                                    prov.ProviderID,
                                    prov.UserID,
                                    prov.FacilityId,
                                    prov.RoleId,
                                    prov.FirstName,
                                    prov.MiddleName,
                                    prov.LastName,
                                    prov.NamePrefix,
                                    prov.NameSuffix,
                                    prov.Title,
                                    prov.BirthDate,
                                    prov.Gender,
                                    prov.PersonalEmail,
                                    prov.IsActive,
                                    prov.Language,
                                    prov.PreferredLanguage,
                                    prov.MotherMaiden,
                                    prov.WebSiteName

                                }).AsEnumerable().Select(PM => new ProviderModel
                                {
                                    ProviderID = PM.ProviderID,
                                    ProviderName = PM.FirstName + " " + PM.MiddleName + " " + PM.LastName,
                                    UserID = PM.UserID,
                                    FacilityId = PM.FacilityId,
                                    FacilityName = PM.FacilityId.Contains(",") ? this.GetFacilitiesforProvider(PM.FacilityId) : ((PM.FacilityId != "" && PM.FacilityId != null) ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(PM.FacilityId)).FacilityName) : ""),
                                    FacilityArray = (PM.FacilityId != "" && PM.FacilityId != null) ? this.GetFacilityArray(PM.FacilityId) : new List<int>(),
                                    RoleId = PM.RoleId,
                                    RoleDescription = PM.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == PM.RoleId).FirstOrDefault().RoleDescription : "",
                                    NamePrefix = PM.NamePrefix,
                                    NameSuffix = PM.NameSuffix,
                                    Title = PM.Title,
                                    BirthDate = PM.BirthDate,
                                    Age = PM.BirthDate != null ? (DateTime.Now.Year - PM.BirthDate.Value.Year) : 0,
                                    Gender = PM.Gender,
                                    PersonalEmail = PM.PersonalEmail,
                                    IsActive = PM.IsActive,
                                    Language = PM.Language,
                                    PreferredLanguage = PM.PreferredLanguage,
                                    MotherMaiden = PM.MotherMaiden,
                                    WebSiteName = PM.WebSiteName,
                                    State = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == PM.ProviderID).FirstOrDefault() != null ?
                                            this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == PM.ProviderID).FirstOrDefault().State : "",
                                    Pincode = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == PM.ProviderID).FirstOrDefault() != null ?
                                        (this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == PM.ProviderID).FirstOrDefault().PinCode != null ?
                                        this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == PM.ProviderID).FirstOrDefault().PinCode.Value : 0) : 0,
                                    PhoneNumber = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == PM.ProviderID).ToList().Count() > 0 ?
                                            this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == PM.ProviderID).PhoneNumber : "",
                                    ProviderFile = this.GetFile(PM.ProviderID.ToString(), "Provider").Count() > 0 ? this.GetFile(PM.ProviderID.ToString(), "Provider") : new List<clsViewFile>()

                                }).ToList();

            if (SpecialityId == 0)
            {
                providerList = ProviderData;
            }
            else if (SpecialityId > 0)
            {
                var provSpecialities = this.uow.GenericRepository<ProviderSpeciality>().Table().Where(x => x.SpecialityID == SpecialityId).ToList();

                if (provSpecialities.Count() > 0)
                {
                    List<int> provIds = new List<int>();

                    if (ProviderId == 0)
                    {
                        provIds = provSpecialities.Select(x => x.ProviderID).Distinct().ToList();
                    }
                    else if (ProviderId > 0)
                    {
                        provIds = provSpecialities.Where(x => x.ProviderID == ProviderId).Select(x => x.ProviderID).Distinct().ToList();
                    }
                    foreach (var set in provIds)
                    {
                        ProviderModel data = new ProviderModel();

                        data = ProviderData.Where(x => x.ProviderID == set).FirstOrDefault();
                        
                        if (!providerList.Contains(data))
                        {
                            providerList.Add(data);
                        }
                    }
                }

            }

            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            foreach (var prov in providerList)
            {
                var provFacilities = this.utilService.GetFacilitiesbyProviderId(prov.ProviderID);
                if (facList.Count() > 0)
                {
                    foreach (var fac in facList)
                    {
                        var record = provFacilities.Where(x => x.FacilityId == fac.FacilityId).FirstOrDefault();
                        if (record != null && !(ProviderList.Contains(prov)))
                        {
                            ProviderList.Add(prov);
                        }
                    }
                }
                else
                {
                    if (!ProviderList.Contains(prov))
                    {
                        ProviderList.Add(prov);
                    }
                }
            }

            return ProviderList;
        }

        ///// <summary>
        ///// Get count of total and active providers
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<int>. if counts of total and active providers = success. else = failure</returns>
        public ProviderCountModel ProviderCount()
        {
            ProviderCountModel Counts = new ProviderCountModel();
            var providerdata = this.SearchProvider(0, 0);
            Counts.TotalProviderCount = providerdata.Count();

            Counts.ActiveProviderCount = providerdata.Where(x => x.IsActive != false).ToList().Count();

            return Counts;
        }

        #endregion

        #region File Access

        ///// <summary>
        ///// Get File
        ///// </summary>
        ///// <param>(string Id, string screen)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<clsViewFile> GetFile(string Id, string screen)
        {
            string moduleName = "";
            if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
            {
                hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            //if (hostingEnvironment.WebRootPath != null)
            moduleName = hostingEnvironment.WebRootPath + "\\Documents\\" + screen + "\\" + Id;

            var fileLoc = this.iTenantMasterService.GetFiles(moduleName);

            return fileLoc;
        }

        ///// <summary>
        ///// Delete
        ///// </summary>
        ///// <param>(string path, string fileName)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<string> DeleteFile(string path, string fileName)
        {
            var fileStatus = this.iTenantMasterService.DeleteFile(path, fileName);

            return fileStatus;
        }

        #endregion
    }
}
