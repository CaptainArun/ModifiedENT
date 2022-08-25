using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;

namespace ENT.WebApi.DAL.Services
{
    public class UtilityService : IUtilityService
    {
        public readonly IUnitOfWork uow;
        public readonly IGlobalUnitOfWork gUow;
        public readonly SignInManager<AspNetUsers> signInManager;
        public readonly UserManager<AspNetUsers> userManager;
        public readonly IHttpContextAccessor httpContextAccessor;
        public readonly IConfiguration iConfiguration;

        public UtilityService(IUnitOfWork _uow, IGlobalUnitOfWork _gUow, SignInManager<AspNetUsers> _signInManager, UserManager<AspNetUsers> _userManager, IHttpContextAccessor _httpContextAccessor, IConfiguration _iConfiguration)
        {
            uow = _uow;
            gUow = _gUow;
            httpContextAccessor = _httpContextAccessor;
            iConfiguration = _iConfiguration;
            signInManager = _signInManager;
            userManager = _userManager;
        }

        ///// <summary>
        ///// Get UserId by Current User's Email
        ///// </summary>
        ///// <param>string Email</param>
        ///// <returns>string. if UserId related to the given EmailId = success. else = failure</returns>
        public string GetUserId(string Email)
        {
            string UserId = this.uow.GenericRepository<Employee>().Table().SingleOrDefault(x => x.EMail.ToLower().Trim() == Email.ToLower().Trim()).UserId;
            return UserId;
        }

        ///// <summary>
        ///// Get Current User
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if Current User = success. else = failure</returns>
        public async Task<string> GetProviderUserId()
        {
            var user = await userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);
            string UserId = "";

            Provider provData = new Provider();
            provData = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim());

            if (provData != null)
            {
                UserId = provData.UserID;
            }

            return UserId;
        }

        ///// <summary>
        ///// Update the User Mail address in GlobalUser
        ///// </summary>
        ///// <param>string Email, string userID</param>
        ///// <returns>string. if the user updated by userID = success. else = failure</returns>
        public string UpdateGlobalUser(string Email, string userID)
        {
            string status = "";

            var user = this.gUow.GlobalGenericRepository<AspNetUsers>().Table().FirstOrDefault(x => x.Id.ToLower().Trim() == userID.ToLower().Trim());

            if(user != null)
            {
                user.UserName = Email;
                user.Email = Email;
                user.NormalizedUserName = Email.ToUpper();
                user.NormalizedEmail = Email.ToUpper();

                this.gUow.GlobalGenericRepository<AspNetUsers>().Update(user);
                this.gUow.Save();
                status = "User record updated";
            }

            return status;
        }

        ///// <summary>
        ///// Get Current User
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if Current User = success. else = failure</returns>
        public string GetUserIDofProvider()
        {
            var user = this.gUow.GlobalGenericRepository<AspNetUsers>().Table().FirstOrDefault(x => x.UserName.ToLower().Trim() == (httpContextAccessor.HttpContext.User.Identity.Name).ToLower().Trim());
            string UserId = "";

            Provider provData = new Provider();
            provData = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim());

            if (provData != null)
            {
                UserId = provData.UserID;
            }

            return UserId;
        }

        public DateTime GetLocalTime(DateTime dateTime)
        {
            int offSet = Convert.ToInt32(httpContextAccessor.HttpContext.Request.Headers["offSet"]) * -1;
            if (dateTime.Kind == DateTimeKind.Utc)
            {
                return dateTime.ToUniversalTime().AddMinutes(offSet);
            }
            //else if(dateTime.Kind == DateTimeKind.Local)
            //{
            //    return dateTime;
            //}
            else
            {
                return dateTime.AddMinutes(offSet);
            }
        }

        ///// <summary>
        ///// Get All TreatmentCodes by search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<TreatmentCode>. if Collection of TreatmentCode by search = success. else = failure</returns>
        public List<TreatmentCode> GetTreatmentCodesbySearch(string searchKey)
        {
            List<TreatmentCode> CPTCodes = new List<TreatmentCode>();

            if (searchKey != null && searchKey != "")
            {
                CPTCodes = (from cpt in this.gUow.GlobalGenericRepository<TreatmentCode>().Table()
                            where (cpt.TreatmentCodeID.ToString().Contains(searchKey.ToLower().Trim()) || cpt.ShortDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                            || cpt.CPTCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || cpt.LongDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                            select cpt).Take(10).ToList();
            }
            else
            {
                CPTCodes = this.gUow.GlobalGenericRepository<TreatmentCode>().Table().Take(25).ToList();
            }
            return CPTCodes;
        }

        ///// <summary>
        ///// Get All Discharge Codes by search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<DischargeCode>. if Collection of Discharge Code by search = success. else = failure</returns>
        public List<DischargeCode> GetDischargeCodesbySearch(string searchKey)
        {
            List<DischargeCode> dischargeCodes = new List<DischargeCode>();

            if (searchKey != null && searchKey != "")
            {
                dischargeCodes = (from discharge in this.gUow.GlobalGenericRepository<DischargeCode>().Table()
                                  where (discharge.DischargeDispositionCodeID.ToString().Contains(searchKey.ToLower().Trim()) || discharge.Code.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                  || discharge.Description.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || discharge.CodeType.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                  select discharge).Take(10).ToList();
            }
            else
            {
                dischargeCodes = this.gUow.GlobalGenericRepository<DischargeCode>().Table().Take(25).ToList();
            }
            return dischargeCodes;
        }

        ///// <summary>
        ///// Get All DiagnosisCodes (ICD codes) by search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCode For Provider = success. else = failure</returns>
        public List<DiagnosisCode> GetAllDiagnosisCodesbySearch(string searchKey)
        {
            List<DiagnosisCode> icdcodes = new List<DiagnosisCode>();
            if (searchKey != null && searchKey != "")
            {
                icdcodes = (from diag in this.gUow.GlobalGenericRepository<DiagnosisCode>().Table()
                            where ((diag.DiagnosisCodeID.ToString().Contains(searchKey.ToLower().Trim()) || diag.ShortDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                         || diag.ICDCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || diag.LongDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())))
                            select diag).Take(10).ToList();
            }
            else
            {
                icdcodes = this.gUow.GlobalGenericRepository<DiagnosisCode>().Table().Take(25).ToList();
            }
            return icdcodes;
        }


        ///// <summary>
        ///// Get All SnomedCTCodes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<SnomedCT>. if Collection of SnomedCT = success. else = failure</returns>
        public List<SnomedCT> GetAllSnomedCTCodes(string searchKey)
        {
            var snomedCTcodes = (from snomed in this.gUow.GlobalGenericRepository<SnomedCT>().Table()
                                 where ((searchKey == null || searchKey == "") ||
                                         snomed.Code.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                         snomed.SnomedCTID.ToString().Contains(searchKey.ToLower().Trim()) ||
                                         snomed.Description.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                 select snomed).Take(10).ToList();
            return snomedCTcodes;
        }

        ///// <summary>
        ///// Get Treatment Code (CPT code)
        ///// </summary>
        ///// <param>string CPTCode</param>
        ///// <returns>TreatmentCode. if TreatmentCode set for Given CPTCode = success. else = failure</returns>
        public TreatmentCode GetProcedureCode(string CPTCode)
        {
            var procedureCode = this.gUow.GlobalGenericRepository<TreatmentCode>().Table().Where(x => x.CPTCode == CPTCode).FirstOrDefault();
            return procedureCode;
        }

        ///// <summary>
        ///// Get Diagnosis Code (ICD code)
        ///// </summary>
        ///// <param>string ICDcode</param>
        ///// <returns>DiagnosisCode. if DiagnosisCode set for Given ICDcode = success. else = failure</returns>
        public DiagnosisCode GetICDCode(string ICDCode)
        {
            var diagCode = this.gUow.GlobalGenericRepository<DiagnosisCode>().Table().Where(x => x.ICDCode == ICDCode).FirstOrDefault();
            return diagCode;
        }

        ///// <summary>
        ///// Get Diagnosis Code (ICD code)
        ///// </summary>
        ///// <param>int DiagCodeID</param>
        ///// <returns>DiagnosisCode. if DiagnosisCode set for Given DiagCodeID = success. else = failure</returns>
        public DiagnosisCode GetICDCodebyID(int DiagCodeID)
        {
            var diagCode = this.gUow.GlobalGenericRepository<DiagnosisCode>().Table().Where(x => x.DiagnosisCodeID == DiagCodeID).FirstOrDefault();
            return diagCode;
        }

        ///// <summary>
        ///// Get All Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Speciality>. if Collection of Specialities = success. else = failure</returns>
        public List<Speciality> GetAllSpecialities()
        {
            var specialities = this.gUow.GlobalGenericRepository<Speciality>().Table().ToList();
            return specialities;
        }

        ///// <summary>
        ///// Get All Drug Codes for search key
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrugCode>. if Collection of DrugCodes search key = success. else = failure</returns>
        public List<DrugCode> GetAllDrugCodes(string searchKey)
        {
            var drugCodes = (from drug in this.gUow.GlobalGenericRepository<DrugCode>().Table()
                             where ((searchKey == null || searchKey == "") ||
                                     drug.NDCCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                     drug.DrugCodeID.ToString().Contains(searchKey.ToLower().Trim()) ||
                                     drug.Description.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                     drug.ShortDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                     )
                             select drug).Take(10).ToList();

            return drugCodes;
        }

        ///// <summary>
        ///// Get the Facility collection for an active logged in user 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if collection for active current user = success. else = failure</returns>
        public async Task<List<Facility>> GetFacilitiesbyUser()
        {
            List<Facility> facilities = new List<Facility>();

            var user = await userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);

            var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
            var EmpData = this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
            if (provData != null && (provData.FacilityId != null && provData.FacilityId != ""))
            {
                //facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                //              join prov in provData
                //              on fac.FacilityId equals prov.FacilityId
                //              select fac).ToList();
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
            else if (EmpData != null && (EmpData.FacilityId != null && EmpData.FacilityId != ""))
            {
                //facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                //              join emp in this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim()).ToList()
                //              on fac.FacilityId equals emp.FacilityId
                //              select fac).ToList();

                if (EmpData.FacilityId.Contains(","))
                {
                    string[] facilityIds = EmpData.FacilityId.Split(',');
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
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(EmpData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        ///// <summary>
        ///// Get the Facility collection for an active logged in user 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if collection for active current user = success. else = failure</returns>
        public List<Facility> GetFacilitiesforUser()
        {
            List<Facility> facilities = new List<Facility>();

            var user = this.gUow.GlobalGenericRepository<AspNetUsers>().Table().FirstOrDefault(x => x.UserName.ToLower().Trim() == (httpContextAccessor.HttpContext.User.Identity.Name).ToLower().Trim());

            var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
            var EmpData = this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
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
            else if (EmpData != null && (EmpData.FacilityId != null && EmpData.FacilityId != ""))
            {
                if (EmpData.FacilityId.Contains(","))
                {
                    string[] facilityIds = EmpData.FacilityId.Split(',');
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
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(EmpData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

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

        ///// <summary>
        ///// Get the Facility collection
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<Facility>. if facility collection = success. else = failure</returns>
        public List<Facility> GetFacilitiesbyEmployeeId(int employeeId)
        {
            List<Facility> facilities = new List<Facility>();
            var empData = this.uow.GenericRepository<Employee>().Table().Where(x => x.EmployeeId == employeeId).FirstOrDefault();

            if (empData != null && (empData.FacilityId != null && empData.FacilityId != ""))
            {
                if (empData.FacilityId.Contains(","))
                {
                    string[] facilityIds = empData.FacilityId.Split(',');
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
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(empData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        #region Module SignOff

        ///// <summary>
        ///// Sign off for Pre procedure and Post Procedure
        ///// </summary>
        ///// <param>ProcedureCareSignOffModel procedureCareSignOffModel</param>
        ///// <returns>Task<ProcedureCareSignOffModel>. if ProcedureCareSignOffModel with status = success. else = failure</returns>
        public async Task<SigningOffModel> ProcedureCareSignOffUpdation(SigningOffModel procedureCareSignOffModel)
        {
            if ((procedureCareSignOffModel.UserName != null && procedureCareSignOffModel.UserName != "") && (procedureCareSignOffModel.Password != null && procedureCareSignOffModel.Password != ""))
            {
                SignInResult signInResult = await signInManager.PasswordSignInAsync(procedureCareSignOffModel.UserName, procedureCareSignOffModel.Password, false, false);

                var anesthFitness = this.uow.GenericRepository<Anesthesiafitness>().Table().FirstOrDefault(x => x.AdmissionId == procedureCareSignOffModel.AdmissionId);

                var preProcDrugCharts = (from preDrug in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.ProcedureType.ToLower().Trim() == "preprocedure")
                                         join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false & x.AdmissionID == procedureCareSignOffModel.AdmissionId)
                                         on preDrug.AdmissionNo equals adm.AdmissionNo
                                         select preDrug).ToList();

                var postProcDrugCharts = (from postDrug in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.ProcedureType.ToLower().Trim() == "postprocedure")
                                          join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false & x.AdmissionID == procedureCareSignOffModel.AdmissionId)
                                          on postDrug.AdmissionNo equals adm.AdmissionNo
                                          select postDrug).ToList();

                var postProcedureCaseSheet = (from postCasesheet in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()
                                              join preProc in this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.AdmissionID == procedureCareSignOffModel.AdmissionId)
                                              on postCasesheet.PreProcedureID equals preProc.PreProcedureID
                                              select postCasesheet).FirstOrDefault();

                try
                {
                    if (signInResult.Succeeded)
                    {
                        if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("anesthesiafitness"))
                        {
                            if (anesthFitness != null)
                            {
                                anesthFitness.SignOffStatus = true;
                                anesthFitness.SignOffBy = procedureCareSignOffModel.UserName;
                                anesthFitness.SignOffDate = DateTime.Now;
                                anesthFitness.ModifiedDate = DateTime.Now;
                                anesthFitness.ModifiedBy = "User";

                                this.uow.GenericRepository<Anesthesiafitness>().Update(anesthFitness);
                                this.uow.Save();

                                procedureCareSignOffModel.status = "Anesthesia Fitness Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Anesthesia Fitness. Signoff not allowed";
                            }
                        }
                        else if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("preproceduredrugchart"))
                        {
                            if (preProcDrugCharts.Count() > 0)
                            {
                                foreach (var data in preProcDrugCharts)
                                {
                                    data.DrugSignOffStatus = true;
                                    data.DrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.DrugSignOffDate = DateTime.Now;
                                    data.ModifiedDate = DateTime.Now;
                                    data.Modifiedby = "User";

                                    this.uow.GenericRepository<DrugChart>().Update(data);
                                }
                                this.uow.Save();
                                procedureCareSignOffModel.status = "Pre Procedure Drug Chart Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Pre Procedure Drug Chart. Sign Off not allowed";
                            }
                        }
                        else if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("postproceduredrugchart"))
                        {
                            if (postProcDrugCharts.Count() > 0)
                            {
                                foreach (var data in postProcDrugCharts)
                                {
                                    data.DrugSignOffStatus = true;
                                    data.DrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.DrugSignOffDate = DateTime.Now;
                                    data.ModifiedDate = DateTime.Now;
                                    data.Modifiedby = "User";

                                    this.uow.GenericRepository<DrugChart>().Update(data);
                                }
                                this.uow.Save();
                                procedureCareSignOffModel.status = "Post Procedure Drug Chart Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Post Procedure Drug Chart. Sign Off not allowed";
                            }
                        }
                        else if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("preprocedureadmindrugchart"))
                        {
                            if (preProcDrugCharts.Count() > 0)
                            {
                                foreach (var data in preProcDrugCharts)
                                {
                                    data.DrugSignOffStatus = true;
                                    data.DrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.DrugSignOffDate = DateTime.Now;
                                    data.AdminDrugSignOffStatus = true;
                                    data.AdminDrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.AdminDrugSignOffDate = DateTime.Now;
                                    data.ModifiedDate = DateTime.Now;
                                    data.Modifiedby = "User";

                                    this.uow.GenericRepository<DrugChart>().Update(data);
                                }
                                this.uow.Save();
                                procedureCareSignOffModel.status = "Pre Procedure Administration Drug Chart Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Pre Procedure Administration Drug Chart. Sign Off not allowed";
                            }
                        }
                        else if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("postprocedureadmindrugchart"))
                        {
                            if (postProcDrugCharts.Count() > 0)
                            {
                                foreach (var data in postProcDrugCharts)
                                {
                                    data.DrugSignOffStatus = true;
                                    data.DrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.DrugSignOffDate = DateTime.Now;
                                    data.AdminDrugSignOffStatus = true;
                                    data.AdminDrugSignOffBy = procedureCareSignOffModel.UserName;
                                    data.AdminDrugSignOffDate = DateTime.Now;
                                    data.ModifiedDate = DateTime.Now;
                                    data.Modifiedby = "User";

                                    this.uow.GenericRepository<DrugChart>().Update(data);
                                }
                                this.uow.Save();
                                procedureCareSignOffModel.status = "Post Procedure Administration Drug Chart Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Post Procedure Administration Drug Chart. Sign Off not allowed";
                            }
                        }
                        else if (procedureCareSignOffModel.ScreenName.ToLower().Trim().Contains("postprocedurecasesheet"))
                        {
                            if (postProcedureCaseSheet != null)
                            {
                                postProcedureCaseSheet.SignOffStatus = true;
                                postProcedureCaseSheet.SignOffUser = procedureCareSignOffModel.UserName;
                                postProcedureCaseSheet.SignOffDate = DateTime.Now;
                                postProcedureCaseSheet.ModifiedDate = DateTime.Now;
                                postProcedureCaseSheet.ModifiedBy = "User";

                                this.uow.GenericRepository<PostProcedureCaseSheet>().Update(postProcedureCaseSheet);
                                this.uow.Save();

                                var preProcedureRecord = this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.PreProcedureID == postProcedureCaseSheet.PreProcedureID).FirstOrDefault();

                                if (preProcedureRecord != null && postProcedureCaseSheet.SignOffStatus == true)
                                {
                                    preProcedureRecord.ProcedureStatus = "Completed";

                                    this.uow.GenericRepository<PreProcedure>().Update(preProcedureRecord);
                                    this.uow.Save();
                                }
                                procedureCareSignOffModel.status = "Post Procedure CaseSheet Signed Off successfully";
                            }
                            else
                            {
                                procedureCareSignOffModel.status = "There is no record for Post Procedure CaseSheet. Sign Off not allowed";
                            }
                        }
                    }
                    else
                    {
                        procedureCareSignOffModel.status = "Invalid UserName or Password";
                    }
                }
                catch (Exception e)
                {
                    string mess = e.Message;
                }
            }
            else
            {
                procedureCareSignOffModel.status = "UserName or Password is Empty. Please fill both to SignOff";
            }

            return procedureCareSignOffModel;
        }

        ///// <summary>
        ///// Sign off for E Lab
        ///// </summary>
        ///// <param>SigningOffModel eLabSignOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status = success. else = failure</returns>
        public async Task<SigningOffModel> UserCheck(SigningOffModel eLabSignOffModel)
        {
            SignInResult signInResult = await signInManager.PasswordSignInAsync(eLabSignOffModel.UserName, eLabSignOffModel.Password, false, false);

            List<eLabOrder> eLabOrders = new List<eLabOrder>();

            try
            {
                if (signInResult.Succeeded)
                {
                    eLabSignOffModel.status = "Valid User";
                }
                else
                {
                    eLabSignOffModel.status = "Invalid UserName or Password";
                }
            }
            catch (Exception e)
            {
                eLabSignOffModel.status = e.Message;
            }

            return eLabSignOffModel;
        }

        ///// <summary>
        ///// Get SigningOffModel with status for Triage
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status = success. else = failure</returns>
        public async Task<SigningOffModel> TriageSignoffUpdation(SigningOffModel signOffModel)
        {
            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                SignInResult signInResult = await signInManager.PasswordSignInAsync(signOffModel.UserName, signOffModel.Password, false, false);

                bool intakeStatus = false;
                bool caseSheetStatus = false;

                try
                {
                    if (signInResult.Succeeded)
                    {
                        VisitSignOff visitSignOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();

                        if (signOffModel.ScreenName.ToLower().Trim() == "intake")
                        {
                            intakeStatus = this.GetDataCheckforIntake(signOffModel.VisitId);

                            if (intakeStatus != true)
                            {
                                signOffModel.status = "There is no record added for Intake. SignOff not allowed";
                            }
                            else
                            {
                                if (visitSignOff == null)
                                {
                                    visitSignOff = new VisitSignOff();

                                    visitSignOff.VisitID = signOffModel.VisitId;
                                    visitSignOff.Intake = true;
                                    visitSignOff.IntakeSignOffBy = signOffModel.UserName;
                                    visitSignOff.IntakeSignOffDate = DateTime.Now;
                                    visitSignOff.Createddate = DateTime.Now;
                                    visitSignOff.CreatedBy = "User";

                                    this.uow.GenericRepository<VisitSignOff>().Insert(visitSignOff);
                                }
                                else
                                {
                                    visitSignOff.Intake = true;
                                    visitSignOff.IntakeSignOffBy = signOffModel.UserName;
                                    visitSignOff.IntakeSignOffDate = DateTime.Now;
                                    visitSignOff.ModifiedDate = DateTime.Now;
                                    visitSignOff.ModifiedBy = "User";

                                    this.uow.GenericRepository<VisitSignOff>().Update(visitSignOff);
                                }
                                this.uow.Save();

                                signOffModel.status = "Intake signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim() == "casesheet")
                        {
                            caseSheetStatus = this.GetDataCheckforCaseSheet(signOffModel.VisitId);

                            if (caseSheetStatus != true)
                            {
                                signOffModel.status = "There is no record added for CaseSheet. SignOff not allowed";
                            }
                            else
                            {
                                if (visitSignOff == null)
                                {
                                    visitSignOff = new VisitSignOff();

                                    visitSignOff.VisitID = signOffModel.VisitId;
                                    visitSignOff.CaseSheet = true;
                                    visitSignOff.CaseSheetSignOffBy = signOffModel.UserName;
                                    visitSignOff.CaseSheetSignOffDate = DateTime.Now;
                                    visitSignOff.Createddate = DateTime.Now;
                                    visitSignOff.CreatedBy = "User";

                                    this.uow.GenericRepository<VisitSignOff>().Insert(visitSignOff);
                                }
                                else
                                {
                                    visitSignOff.CaseSheet = true;
                                    visitSignOff.CaseSheetSignOffBy = signOffModel.UserName;
                                    visitSignOff.CaseSheetSignOffDate = DateTime.Now;
                                    visitSignOff.ModifiedDate = DateTime.Now;
                                    visitSignOff.ModifiedBy = "User";

                                    this.uow.GenericRepository<VisitSignOff>().Update(visitSignOff);
                                }
                                this.uow.Save();

                                signOffModel.status = "Case Sheet signOff Success";
                            }
                        }
                    }
                    else
                    {
                        signOffModel.status = "Invalid UserName or Password";
                    }
                }
                catch (Exception e)
                {
                    string mess = e.Message;
                }
            }
            else
            {
                signOffModel.status = "UserName or Password is Empty. Please fill both to SignOff";
            }

            return signOffModel;
        }

        ///// <summary>
        ///// Get Data check for Intake (Local method)
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>bool. if true or false = success. else = failure</returns>
        public bool GetDataCheckforIntake(int VisitId)
        {
            bool intakeStatus = false;

            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var allergy = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var problem = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var medication = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var social = this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var ros = this.uow.GenericRepository<ROS>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();
            var nutrition = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();
            var nursing = this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();

            if (vital != null || allergy != null || problem != null || medication != null || social != null
                    || ros != null || nutrition != null || cognitive != null || nursing != null)
            {
                intakeStatus = true;
            }

            return intakeStatus;
        }

        ///// <summary>
        ///// Get Data check for Case sheet (Local method)
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>bool. if true or false = success. else = failure</returns>
        public bool GetDataCheckforCaseSheet(int VisitId)
        {
            bool caseSheetStatus = false;

            var diagnosis = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();
            var careplan = this.uow.GenericRepository<CarePlan>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();

            if (diagnosis != null || procedure != null || careplan != null)
            {
                caseSheetStatus = true;
            }

            return caseSheetStatus;
        }

        ///// <summary>
        ///// Get SigningOffModel with status for Audiology
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status = success. else = failure</returns>
        public async Task<SigningOffModel> AudiologySignoff(SigningOffModel signOffModel)
        {
            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                SignInResult signInResult = await signInManager.PasswordSignInAsync(signOffModel.UserName, signOffModel.Password, false, false);

                var assrTest = this.uow.GenericRepository<ASSRTest>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var beraTest = this.uow.GenericRepository<BERATest>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var electrocochleography = this.uow.GenericRepository<Electrocochleography>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var hearingAid = this.uow.GenericRepository<HearingAidTrial>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var oaeTest = this.uow.GenericRepository<OAETest>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var speechTherapy = this.uow.GenericRepository<SpeechTherapy>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var speechSpecialTest = this.uow.GenericRepository<SpeechtherapySpecialtests>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var tinnitusMasking = this.uow.GenericRepository<Tinnitusmasking>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var tuningForkTest = this.uow.GenericRepository<TuningForkTest>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();
                var tympanometry = this.uow.GenericRepository<Tympanometry>().Table().Where(x => x.VisitID == signOffModel.VisitId).FirstOrDefault();

                try
                {
                    if (signInResult.Succeeded)
                    {
                        if (signOffModel.ScreenName.ToLower().Trim().Contains("assr"))
                        {
                            if (assrTest == null)
                            {
                                signOffModel.status = "There is no record added for ASSR Test. SignOff not allowed";
                            }
                            else
                            {
                                assrTest.SignOffBy = signOffModel.UserName;
                                assrTest.SignOffDate = DateTime.Now;
                                assrTest.SignOffStatus = true;

                                this.uow.GenericRepository<ASSRTest>().Update(assrTest);
                                signOffModel.status = "ASSR Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("bera"))
                        {
                            if (beraTest == null)
                            {
                                signOffModel.status = "There is no record added for BERA Test. SignOff not allowed";
                            }
                            else
                            {
                                beraTest.SignOffBy = signOffModel.UserName;
                                beraTest.SignOffDate = DateTime.Now;
                                beraTest.SignOffStatus = true;

                                this.uow.GenericRepository<BERATest>().Update(beraTest);
                                signOffModel.status = "BERA Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("electro"))
                        {
                            if (electrocochleography == null)
                            {
                                signOffModel.status = "There is no record added for electrocochleography Test. SignOff not allowed";

                            }
                            else
                            {
                                electrocochleography.SignOffBy = signOffModel.UserName;
                                electrocochleography.SignOffDate = DateTime.Now;
                                electrocochleography.SignOffStatus = true;

                                this.uow.GenericRepository<Electrocochleography>().Update(electrocochleography);
                                signOffModel.status = "Electrocochleography Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("hearing"))
                        {
                            if (hearingAid == null)
                            {
                                signOffModel.status = "There is no record added for Hearing Aid. SignOff not allowed";
                            }
                            else
                            {
                                hearingAid.SignOffBy = signOffModel.UserName;
                                hearingAid.SignOffDate = DateTime.Now;
                                hearingAid.SignOffStatus = true;

                                this.uow.GenericRepository<HearingAidTrial>().Update(hearingAid);
                                signOffModel.status = "Hearing Aid signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("oae"))
                        {
                            if (oaeTest == null)
                            {
                                signOffModel.status = "There is no record added for OAE Test. SignOff not allowed";
                            }
                            else
                            {
                                oaeTest.SignOffBy = signOffModel.UserName;
                                oaeTest.SignOffDate = DateTime.Now;
                                oaeTest.SignOffStatus = true;

                                this.uow.GenericRepository<OAETest>().Update(oaeTest);
                                signOffModel.status = "OAE Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("speechtherapy")
                                && !(signOffModel.ScreenName.ToLower().Trim().Contains("specialtest")))
                        {
                            if (speechTherapy == null)
                            {
                                signOffModel.status = "There is no record added for Speech Therapy. SignOff not allowed";
                            }
                            else
                            {
                                speechTherapy.SignOffBy = signOffModel.UserName;
                                speechTherapy.SignOffDate = DateTime.Now;
                                speechTherapy.SignOffStatus = true;

                                this.uow.GenericRepository<SpeechTherapy>().Update(speechTherapy);
                                signOffModel.status = "Speech Therapy signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("specialtest"))
                        {
                            if (speechSpecialTest == null)
                            {
                                signOffModel.status = "There is no record added for Speech Therapy Special Test. SignOff not allowed";
                            }
                            else
                            {
                                speechSpecialTest.SignOffBy = signOffModel.UserName;
                                speechSpecialTest.SignOffDate = DateTime.Now;
                                speechSpecialTest.SignOffStatus = true;

                                this.uow.GenericRepository<SpeechtherapySpecialtests>().Update(speechSpecialTest);
                                signOffModel.status = "Speech Therapy Special Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("tinnitus"))
                        {
                            if (tinnitusMasking == null)
                            {
                                signOffModel.status = "There is no record added for Tinnitus Masking. SignOff not allowed";
                            }
                            else
                            {
                                tinnitusMasking.SignOffBy = signOffModel.UserName;
                                tinnitusMasking.SignOffDate = DateTime.Now;
                                tinnitusMasking.SignOffStatus = true;

                                this.uow.GenericRepository<Tinnitusmasking>().Update(tinnitusMasking);
                                signOffModel.status = "Tinnitus Masking signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("tuningfork"))
                        {
                            if (tuningForkTest == null)
                            {
                                signOffModel.status = "There is no record added for Tuning Fork Test. SignOff not allowed";
                            }
                            else
                            {
                                tuningForkTest.SignOffBy = signOffModel.UserName;
                                tuningForkTest.SignOffDate = DateTime.Now;
                                tuningForkTest.SignOffStatus = true;

                                this.uow.GenericRepository<TuningForkTest>().Update(tuningForkTest);
                                signOffModel.status = "Tuning Fork Test signOff Success";
                            }
                        }
                        else if (signOffModel.ScreenName.ToLower().Trim().Contains("tympano"))
                        {
                            if (tympanometry == null)
                            {
                                signOffModel.status = "There is no record added for Tympanometry. SignOff not allowed";
                            }
                            else
                            {
                                tympanometry.SignOffBy = signOffModel.UserName;
                                tympanometry.SignOffDate = DateTime.Now;
                                tympanometry.SignOffStatus = true;

                                this.uow.GenericRepository<Tympanometry>().Update(tympanometry);
                                signOffModel.status = "Tympanometry signOff Success";
                            }
                        }
                        this.uow.Save();
                    }
                    else
                    {
                        signOffModel.status = "Invalid UserName or Password";
                    }
                }
                catch (Exception e)
                {
                    string mess = e.Message;
                }
            }
            else
            {
                signOffModel.status = "UserName or Password is Empty. Please fill both to SignOff";
            }
            return signOffModel;
        }

        ///// <summary>
        ///// Get SigningOffModel with status for Discharge
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status = success. else = failure</returns>
        public async Task<SigningOffModel> DischargeSignOff(SigningOffModel signOffModel)
        {
            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                SignInResult signInResult = await signInManager.PasswordSignInAsync(signOffModel.UserName, signOffModel.Password, false, false);

                var admRecord = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == signOffModel.AdmissionId).FirstOrDefault();

                var dischargeRecord = this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.AdmissionNumber == admRecord.AdmissionNo).FirstOrDefault();

                try
                {
                    if (signInResult.Succeeded)
                    {
                        if (dischargeRecord != null)
                        {
                            dischargeRecord.SignOff = true;
                            dischargeRecord.SignOffBy = signOffModel.UserName;
                            dischargeRecord.SignOffDate = DateTime.Now;
                            dischargeRecord.DischargeStatus = "Completed";
                            dischargeRecord.ModifiedDate = DateTime.Now;
                            dischargeRecord.ModifiedBy = "User";

                            this.uow.GenericRepository<DischargeSummary>().Update(dischargeRecord);
                            this.uow.Save();

                            signOffModel.status = "Discharge signOff Success";
                        }
                        else
                        {
                            signOffModel.status = "There is no record for Discharge Summary. SignOff not allowed";
                        }
                    }
                    else
                    {
                        signOffModel.status = "Invalid UserName or Password";
                    }
                }
                catch (Exception e)
                {
                    string mess = e.Message;
                }
            }
            else
            {
                signOffModel.status = "UserName or Password is Empty. Please fill both to SignOff";
            }

            return signOffModel;
        }

        #endregion

        #region Email

        public void SendEmail(MessageModel message)
        {
            var emailMessage = CreateEmailMessage(message);

            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(MessageModel message)
        {
            List<string> CcList = new List<string>();
            List<string> ToList = new List<string>();
            List<string> BccList = new List<string>();

            if (message.To != "" && message.To != null)
            {
                if (message.To.Contains(",") && message.To.Split(",").Length > 0)
                {
                    string[] ToSet = message.To.Split(",");
                    foreach (var set in ToSet)
                    {
                        if (!ToList.Contains(set))
                        {
                            ToList.Add(set);
                        }
                    }
                }
                else
                {
                    ToList.Add(message.To);
                }
            }

            if (message.Cc != "" && message.Cc != null)
            {
                if (message.Cc.Contains(",") && message.Cc.Split(",").Length > 0)
                {
                    string[] CcSet = message.Cc.Split(",");
                    foreach (var set in CcSet)
                    {
                        if (!CcList.Contains(set))
                        {
                            CcList.Add(set);
                        }
                    }
                }
                else
                {
                    CcList.Add(message.Cc);
                }
            }

            if (message.Bcc != "" && message.Bcc != null)
            {
                if (message.Bcc.Contains(",") && message.Bcc.Split(",").Length > 0)
                {
                    string[] BccSet = message.Bcc.Split(",");
                    foreach (var set in BccSet)
                    {
                        if (!BccList.Contains(set))
                        {
                            BccList.Add(set);
                        }
                    }
                }
                else
                {
                    BccList.Add(message.Bcc);
                }
            }

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(MailboxAddress.Parse(this.iConfiguration["EmailConfiguration:From"]));
            //emailMessage.To.Add(MailboxAddress.Parse(message.To));
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = string.Format("<p>{0}</p>", message.Content) };

            if (ToList.Count() > 0)
            {
                foreach (var record in ToList)
                {
                    var addr = new System.Net.Mail.MailAddress(record);
                    if (record != null && record != "")
                        emailMessage.To.Add(MailboxAddress.Parse(record));
                }
            }

            if (CcList.Count() > 0)
            {
                foreach (var record in CcList)
                {
                    if (record != null && record != "")
                        emailMessage.Cc.Add(MailboxAddress.Parse(record));
                }
            }

            if (BccList.Count() > 0)
            {
                foreach (var record in BccList)
                {
                    if (record != null && record != "")
                        emailMessage.Bcc.Add(MailboxAddress.Parse(record));
                }
            }

            return emailMessage;
        }

        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(this.iConfiguration["EmailConfiguration:SmtpServer"], Convert.ToInt32(this.iConfiguration["EmailConfiguration:Port"]), true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(this.iConfiguration["EmailConfiguration:Username"], this.iConfiguration["EmailConfiguration:Password"]);

                    client.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    //log an error message or throw an exception or both.
                    //throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        //public List<clsViewFile> GetProfileImgFile(string Id, string screen)
        //{
        //    string moduleName = "";

        //    if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
        //    {
        //        hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        //    }

        //    //if (hostingEnvironment.WebRootPath != null)
        //    moduleName = hostingEnvironment.WebRootPath + "\\Documents\\" + screen + "\\" + Id;

        //    var fileLoc = this.iTenantMasterService.GetFiles(moduleName);

        //    if (fileLoc.Count() > 0 && screen.ToLower().Trim() == "patient")
        //    {
        //        //byte[] bytes = System.IO.File.ReadAllBytes(fileLoc.FirstOrDefault().FileUrl);
        //        //this.imageCode = Convert.ToBase64String(bytes);
        //        this.imageCode = fileLoc.FirstOrDefault().ActualFile;
        //    }

        //    return fileLoc;
        //}

        #endregion

    }
}
