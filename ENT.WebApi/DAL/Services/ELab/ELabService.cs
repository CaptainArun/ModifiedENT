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
using System.Web;
using MimeKit;
using System.Net;
using System.IO;

namespace ENT.WebApi.DAL.Services
{
    public class ELabService : IELabService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public ELabService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master Data

        ///// <summary>
        ///// Get Department List
        ///// </summary>
        ///// <param>searchKey</param>
        ///// <returns>List<Departments>. if Collection of Departments = success. else = failure</returns>
        public List<Departments> GetDepartmentListforELab(string searchKey)
        {
            List<Departments> depart = new List<Departments>();
            if (searchKey != null && searchKey != "")
            {
                depart = this.iTenantMasterService.GetDepartmentList().
                                Where(x => x.IsActive != false & (x.DepartmentID.ToString().Contains(searchKey.ToLower().Trim()) |
                                    x.DepartCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) | x.DepartmentDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))).Take(10).ToList();
            }
            else
            {
                depart = this.iTenantMasterService.GetDepartmentList().
                                Where(x => x.IsActive != false).Take(10).ToList();
            }

            return depart;
        }

        ///// <summary>
        ///// Get Departments name from e-Lab Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Departments>. if Collection of Departments from e-Lab Master for given searchkey = success. else = failure</returns>
        public List<Departments> GetDepartmentsfromMasterforELab(string searchKey)
        {
            List<Departments> departments = new List<Departments>();

            var departIDs = this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false).Select(x => x.DepartmentID).Distinct().Take(10).ToList();

            foreach (var depart in departIDs)
            {
                Departments department = new Departments();

                department.DepartmentID = depart;
                department.DepartmentDesc = this.uow.GenericRepository<Departments>().Table().Where(x => x.DepartmentID == depart).FirstOrDefault().DepartmentDesc;
                department.DepartCode = this.uow.GenericRepository<Departments>().Table().Where(x => x.DepartmentID == depart).FirstOrDefault().DepartCode;
                if (!departments.Contains(department))
                {
                    departments.Add(department);
                }
            }

            var deptList = (from depts in departments
                            where ((searchKey == null || searchKey == "") ||
                            (depts.DepartCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                            depts.DepartmentDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim())))
                            select depts).ToList();

            return deptList;
        }

        ///// <summary>
        ///// Get Lab Master Status List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabMasterStatus>. if Collection of eLab Master Status = success. else = failure</returns>
        public List<eLabMasterStatus> GetStatusesforELab()
        {
            return this.iTenantMasterService.GetELabStatusList();
        }

        //// <summary>
        ///// Get Urgency Types for ELab
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of Urgency Types = success. else = failure</returns>
        public List<UrgencyType> GetUrgencyTypesforELab()
        {
            var Urgencies = this.iTenantMasterService.GetUrgencyTypeList();
            return Urgencies;
        }

        //// <summary>
        ///// Get Auto - generated Lab Order number or (LAB No)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated LabOrder number = success. else = failure</returns>
        public List<string> GetLabOrderNumber()
        {
            List<string> labNumbers = new List<string>();

            var LabNo = this.iTenantMasterService.GetLabOrderNo();

            labNumbers.Add(LabNo);

            return labNumbers;
        }

        #endregion

        #region eLab Master

        ///// <summary>
        ///// Add or Update e-Lab Master data
        ///// </summary>
        ///// <param>eLabMasterModel elabMasterModel</param>
        ///// <returns>eLabMasterModel. if e-Lab Master data added = success. else = failure</returns>
        public eLabMasterModel AddUpdateELabMasterData(eLabMasterModel elabMasterModel)
        {
            var elabMaster = this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.DepartmentID == elabMasterModel.DepartmentID &
                                            x.MasterLabTypeCode == elabMasterModel.MasterLabTypeCode).FirstOrDefault();

            if (elabMaster == null)
            {
                elabMaster = new eLabMaster();

                elabMaster.DepartmentID = elabMasterModel.DepartmentID == 0 ? 1 : elabMasterModel.DepartmentID;
                elabMaster.MasterLabTypeCode = elabMasterModel.MasterLabTypeCode;
                elabMaster.MasterLabType = elabMasterModel.MasterLabType;
                elabMaster.LabTypeDesc = elabMasterModel.LabTypeDesc;
                elabMaster.Status = elabMasterModel.Status;
                elabMaster.OrderNo = elabMasterModel.OrderNo;
                elabMaster.AllowSubMaster = elabMasterModel.AllowSubMaster;
                elabMaster.Units = elabMasterModel.Units;
                elabMaster.NormalRange = elabMasterModel.NormalRange;
                elabMaster.IsActive = true;
                elabMaster.Createddate = DateTime.Now;
                elabMaster.CreatedBy = "User";

                this.uow.GenericRepository<eLabMaster>().Insert(elabMaster);
            }
            else
            {
                elabMaster.MasterLabType = elabMasterModel.MasterLabType;
                elabMaster.LabTypeDesc = elabMasterModel.LabTypeDesc;
                elabMaster.Status = elabMasterModel.Status;
                elabMaster.OrderNo = elabMasterModel.OrderNo;
                elabMaster.AllowSubMaster = elabMasterModel.AllowSubMaster;
                elabMaster.Units = elabMasterModel.Units;
                elabMaster.NormalRange = elabMasterModel.NormalRange;
                elabMaster.IsActive = true;
                elabMaster.ModifiedDate = DateTime.Now;
                elabMaster.ModifiedBy = "User";

                this.uow.GenericRepository<eLabMaster>().Update(elabMaster);
            }
            this.uow.Save();
            elabMasterModel.LabMasterID = elabMaster.LabMasterID;

            return elabMasterModel;
        }

        ///// <summary>
        ///// Get eLab types which are allowed for sub master
        ///// </summary>
        ///// <param>int departmentID, string searchKey</param>
        ///// <returns>List<eLabMasterModel>. if eLab master allowed for Submaster = success. else = failure</returns>
        public List<eLabMasterModel> GetSubMasterallowedELabTypes(int departmentID, string searchKey)
        {
            List<eLabMasterModel> submasterallowedELabList = new List<eLabMasterModel>();
            if (searchKey != null && searchKey != "")
            {
                submasterallowedELabList = this.GetMasterELabTypes(departmentID, null).
                                                Where(x => x.IsActive != false & x.AllowSubMaster == true &
                                                        (x.MasterLabTypeCode.ToLower().Trim().Contains(searchKey.ToLower().Trim())) ||
                                                        (x.MasterLabType.ToLower().Trim().Contains(searchKey.ToLower().Trim())) ||
                                                        (x.LabTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                                        ).ToList();
            }
            else
            {
                submasterallowedELabList = this.GetMasterELabTypes(departmentID, null).
                                                Where(x => x.IsActive != false & x.AllowSubMaster == true).ToList();
            }

            return submasterallowedELabList;
        }

        ///// <summary>
        ///// Get All eLab types by department ID,
        ///// </summary>
        ///// <param>int departmentID</param>
        ///// <returns>List<eLabMasterModel>. if All eLab types for given department ID = success. else = failure</returns>
        public List<eLabMasterModel> GetMasterELabTypes(int departmentID, string searchKey)
        {
            var masterELabList = (from eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false & x.DepartmentID == departmentID)
                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on eLab.DepartmentID equals depart.DepartmentID

                                  where (searchKey == null ||
                                  (eLab.MasterLabTypeCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                  eLab.MasterLabType.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                  eLab.LabTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                  )

                                  select new
                                  {
                                      eLab.LabMasterID,
                                      eLab.DepartmentID,
                                      eLab.MasterLabTypeCode,
                                      eLab.MasterLabType,
                                      eLab.LabTypeDesc,
                                      LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                      eLab.IsActive,
                                      eLab.AllowSubMaster,
                                      eLab.Status,
                                      eLab.OrderNo,
                                      eLab.Units,
                                      eLab.NormalRange,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLM => new eLabMasterModel
                                  {
                                      LabMasterID = eLM.LabMasterID,
                                      DepartmentID = eLM.DepartmentID,
                                      DepartmentDesc = eLM.DepartmentDesc,
                                      MasterLabTypeCode = eLM.MasterLabTypeCode,
                                      MasterLabType = eLM.MasterLabType,
                                      LabTypeDesc = eLM.LabTypeDesc,
                                      LabMasterDesc = eLM.LabMasterDesc,
                                      IsActive = eLM.IsActive,
                                      AllowSubMaster = eLM.AllowSubMaster,
                                      Status = eLM.Status,
                                      OrderNo = eLM.OrderNo,
                                      Units = eLM.Units,
                                      NormalRange = eLM.NormalRange

                                  }).ToList();

            return masterELabList;
        }

        ///// <summary>
        ///// Get All eLab masters
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabMasterModel>. if eLab records = success. else = failure</returns>
        public List<eLabMasterModel> GetELabMasterList()
        {
            var eLabRecords = (from eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)

                               join depart in this.uow.GenericRepository<Departments>().Table()
                               on eLab.DepartmentID equals depart.DepartmentID

                               select new
                               {
                                   eLab.LabMasterID,
                                   eLab.DepartmentID,
                                   eLab.MasterLabTypeCode,
                                   eLab.MasterLabType,
                                   eLab.LabTypeDesc,
                                   LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                   eLab.IsActive,
                                   eLab.AllowSubMaster,
                                   eLab.Status,
                                   eLab.OrderNo,
                                   eLab.Units,
                                   eLab.NormalRange,
                                   depart.DepartmentDesc

                               }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLM => new eLabMasterModel
                               {
                                   LabMasterID = eLM.LabMasterID,
                                   DepartmentID = eLM.DepartmentID,
                                   DepartmentDesc = eLM.DepartmentDesc,
                                   MasterLabTypeCode = eLM.MasterLabTypeCode,
                                   MasterLabType = eLM.MasterLabType,
                                   LabTypeDesc = eLM.LabTypeDesc,
                                   LabMasterDesc = eLM.LabMasterDesc,
                                   IsActive = eLM.IsActive,
                                   AllowSubMaster = eLM.AllowSubMaster,
                                   Status = eLM.Status,
                                   OrderNo = eLM.OrderNo,
                                   Units = eLM.Units,
                                   NormalRange = eLM.NormalRange

                               }).ToList();

            return eLabRecords;
        }

        ///// <summary>
        ///// Get All eLab masters by search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<eLabMasterModel>. if eLab records = success. else = failure</returns>
        public List<eLabMasterModel> GetELabMasterListbySearch(string searchKey)
        {
            var eLabRecords = (from eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)

                               join depart in this.uow.GenericRepository<Departments>().Table()
                               on eLab.DepartmentID equals depart.DepartmentID

                               where (searchKey == null ||
                                  (eLab.MasterLabTypeCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                  eLab.MasterLabType.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                  eLab.LabTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                  )

                               select new
                               {
                                   eLab.LabMasterID,
                                   eLab.DepartmentID,
                                   eLab.MasterLabTypeCode,
                                   eLab.MasterLabType,
                                   eLab.LabTypeDesc,
                                   LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                   eLab.IsActive,
                                   eLab.AllowSubMaster,
                                   eLab.Status,
                                   eLab.OrderNo,
                                   eLab.Units,
                                   eLab.NormalRange,
                                   depart.DepartmentDesc

                               }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLM => new eLabMasterModel
                               {
                                   LabMasterID = eLM.LabMasterID,
                                   DepartmentID = eLM.DepartmentID,
                                   DepartmentDesc = eLM.DepartmentDesc,
                                   MasterLabTypeCode = eLM.MasterLabTypeCode,
                                   MasterLabType = eLM.MasterLabType,
                                   LabTypeDesc = eLM.LabTypeDesc,
                                   LabMasterDesc = eLM.LabMasterDesc,
                                   IsActive = eLM.IsActive,
                                   AllowSubMaster = eLM.AllowSubMaster,
                                   Status = eLM.Status,
                                   OrderNo = eLM.OrderNo,
                                   Units = eLM.Units,
                                   NormalRange = eLM.NormalRange

                               }).ToList();

            return eLabRecords;
        }

        ///// <summary>
        ///// Get eLab master record by ID
        ///// </summary>
        ///// <param>int eLabMasterId</param>
        ///// <returns>eLabMasterModel. if eLab record for given eLabMaster ID = success. else = failure</returns>
        public eLabMasterModel GetELabMasterRecord(int eLabMasterId)
        {
            var eLabRecord = (from eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.LabMasterID == eLabMasterId)

                              join depart in this.uow.GenericRepository<Departments>().Table()
                              on eLab.DepartmentID equals depart.DepartmentID

                              select new
                              {
                                  eLab.LabMasterID,
                                  eLab.DepartmentID,
                                  eLab.MasterLabTypeCode,
                                  eLab.MasterLabType,
                                  eLab.LabTypeDesc,
                                  eLab.IsActive,
                                  eLab.AllowSubMaster,
                                  eLab.Status,
                                  eLab.OrderNo,
                                  eLab.Units,
                                  eLab.NormalRange,
                                  depart.DepartmentDesc,
                                  LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc

                              }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLM => new eLabMasterModel
                              {
                                  LabMasterID = eLM.LabMasterID,
                                  DepartmentID = eLM.DepartmentID,
                                  DepartmentDesc = eLM.DepartmentDesc,
                                  MasterLabTypeCode = eLM.MasterLabTypeCode,
                                  MasterLabType = eLM.MasterLabType,
                                  LabTypeDesc = eLM.LabTypeDesc,
                                  IsActive = eLM.IsActive,
                                  AllowSubMaster = eLM.AllowSubMaster,
                                  Status = eLM.Status,
                                  OrderNo = eLM.OrderNo,
                                  Units = eLM.Units,
                                  NormalRange = eLM.NormalRange,
                                  LabMasterDesc = eLM.LabMasterDesc

                              }).FirstOrDefault();

            return eLabRecord;
        }

        ///// <summary>
        ///// Delete eLab Master Record by ID
        ///// </summary>
        ///// <param>int eLabMasterId</param>
        ///// <returns>eLabMaster. if eLab Master data Record for Given eLabMasterId ID is Deleted = success. else = failure</returns>
        public eLabMaster DeleteELabMasterRecord(int eLabMasterId)
        {
            var eLabRecord = this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.LabMasterID == eLabMasterId).FirstOrDefault();

            if (eLabRecord != null)
            {
                eLabRecord.IsActive = false;

                this.uow.GenericRepository<eLabMaster>().Update(eLabRecord);
                this.uow.Save();
            }
            return eLabRecord;
        }

        #endregion

        #region eLab Sub Master

        ///// <summary>
        ///// Add or Update e-Lab Sub Master data
        ///// </summary>
        ///// <param>eLabSubMasterModel elabSubMasterModel</param>
        ///// <returns>eLabSubMasterModel. if e-Lab Sub Master data added = success. else = failure</returns>
        public eLabSubMasterModel AddUpdateELabSubMasterData(eLabSubMasterModel elabSubMasterModel)
        {
            var elabSubMaster = this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.DepartmentID == elabSubMasterModel.DepartmentID &
                                            x.SubMasterLabCode == elabSubMasterModel.SubMasterLabCode & x.LabMasterId == elabSubMasterModel.LabMasterId).FirstOrDefault();

            if (elabSubMaster == null)
            {
                elabSubMaster = new eLabSubMaster();

                elabSubMaster.DepartmentID = elabSubMasterModel.DepartmentID == 0 ? 1 : elabSubMasterModel.DepartmentID;
                elabSubMaster.LabMasterId = elabSubMasterModel.LabMasterId;
                elabSubMaster.SubMasterLabCode = elabSubMasterModel.SubMasterLabCode;
                elabSubMaster.SubMasterLabType = elabSubMasterModel.SubMasterLabType;
                elabSubMaster.SubMasterLabTypeDesc = elabSubMasterModel.SubMasterLabTypeDesc == null ? "" : elabSubMasterModel.SubMasterLabTypeDesc;
                elabSubMaster.Status = elabSubMasterModel.Status;
                elabSubMaster.OrderNo = elabSubMasterModel.OrderNo;
                elabSubMaster.Units = elabSubMasterModel.Units;
                elabSubMaster.NormalRange = elabSubMasterModel.NormalRange;
                elabSubMaster.IsActive = true;
                elabSubMaster.Createddate = DateTime.Now;
                elabSubMaster.CreatedBy = "User";

                this.uow.GenericRepository<eLabSubMaster>().Insert(elabSubMaster);
            }
            else
            {
                elabSubMaster.SubMasterLabType = elabSubMasterModel.SubMasterLabType;
                elabSubMaster.SubMasterLabTypeDesc = elabSubMasterModel.SubMasterLabTypeDesc == null ? "" : elabSubMasterModel.SubMasterLabTypeDesc;
                elabSubMaster.Status = elabSubMasterModel.Status;
                elabSubMaster.OrderNo = elabSubMasterModel.OrderNo;
                elabSubMaster.Units = elabSubMasterModel.Units;
                elabSubMaster.NormalRange = elabSubMasterModel.NormalRange;
                elabSubMaster.IsActive = true;
                elabSubMaster.ModifiedDate = DateTime.Now;
                elabSubMaster.ModifiedBy = "User";

                this.uow.GenericRepository<eLabSubMaster>().Update(elabSubMaster);
            }
            this.uow.Save();
            elabSubMasterModel.LabSubMasterID = elabSubMaster.LabSubMasterID;

            return elabSubMasterModel;
        }

        ///// <summary>
        ///// Get eLab Sub master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabSubMasterModel>. if eLab Sub record List = success. else = failure</returns>
        public List<eLabSubMasterModel> GetELabSubMasterList()
        {
            var eLabSubMasterList = (from eLabSub in this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.IsActive != false)

                                     join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                     on eLabSub.LabMasterId equals eLab.LabMasterID

                                     join depart in this.uow.GenericRepository<Departments>().Table()
                                     on eLabSub.DepartmentID equals depart.DepartmentID

                                     select new
                                     {
                                         eLabSub.LabSubMasterID,
                                         eLabSub.DepartmentID,
                                         eLabSub.LabMasterId,
                                         LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                         eLabSub.SubMasterLabCode,
                                         eLabSub.SubMasterLabType,
                                         eLabSub.SubMasterLabTypeDesc,
                                         eLabSub.IsActive,
                                         eLabSub.Status,
                                         eLabSub.OrderNo,
                                         eLabSub.Units,
                                         eLabSub.NormalRange,
                                         depart.DepartmentDesc

                                     }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSubMasterModel
                                     {
                                         LabSubMasterID = eLSM.LabSubMasterID,
                                         LabMasterId = eLSM.LabMasterId,
                                         LabMasterDesc = eLSM.LabMasterDesc,
                                         DepartmentID = eLSM.DepartmentID,
                                         DepartmentDesc = eLSM.DepartmentDesc,
                                         SubMasterLabCode = eLSM.SubMasterLabCode,
                                         SubMasterLabType = eLSM.SubMasterLabType,
                                         SubMasterLabTypeDesc = eLSM.SubMasterLabTypeDesc,
                                         IsActive = eLSM.IsActive,
                                         Status = eLSM.Status,
                                         OrderNo = eLSM.OrderNo,
                                         Units = eLSM.Units,
                                         NormalRange = eLSM.NormalRange,
                                         LabSubMasterDesc = (eLSM.SubMasterLabTypeDesc != null && eLSM.SubMasterLabTypeDesc != "") ? (eLSM.SubMasterLabType + " - " + eLSM.SubMasterLabTypeDesc) : eLSM.SubMasterLabType

                                     }).ToList();

            return eLabSubMasterList;
        }

        ///// <summary>
        ///// Get eLab Sub master List by Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<eLabSubMasterModel>. if eLab Sub record List = success. else = failure</returns>
        public List<eLabSubMasterModel> GetELabSubMasterListbySearch(string searchKey)
        {
            var eLabSubMasterList = (from eLabSub in this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.IsActive != false)

                                     join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                     on eLabSub.LabMasterId equals eLab.LabMasterID

                                     join depart in this.uow.GenericRepository<Departments>().Table()
                                     on eLabSub.DepartmentID equals depart.DepartmentID

                                     where (searchKey == null ||
                                        (eLabSub.SubMasterLabCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                        eLabSub.SubMasterLabType.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                        eLabSub.SubMasterLabTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                        )

                                     select new
                                     {
                                         eLabSub.LabSubMasterID,
                                         eLabSub.DepartmentID,
                                         eLabSub.LabMasterId,
                                         LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                         eLabSub.SubMasterLabCode,
                                         eLabSub.SubMasterLabType,
                                         eLabSub.SubMasterLabTypeDesc,
                                         eLabSub.IsActive,
                                         eLabSub.Status,
                                         eLabSub.OrderNo,
                                         eLabSub.Units,
                                         eLabSub.NormalRange,
                                         depart.DepartmentDesc

                                     }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSubMasterModel
                                     {
                                         LabSubMasterID = eLSM.LabSubMasterID,
                                         LabMasterId = eLSM.LabMasterId,
                                         LabMasterDesc = eLSM.LabMasterDesc,
                                         DepartmentID = eLSM.DepartmentID,
                                         DepartmentDesc = eLSM.DepartmentDesc,
                                         SubMasterLabCode = eLSM.SubMasterLabCode,
                                         SubMasterLabType = eLSM.SubMasterLabType,
                                         SubMasterLabTypeDesc = eLSM.SubMasterLabTypeDesc,
                                         IsActive = eLSM.IsActive,
                                         Status = eLSM.Status,
                                         OrderNo = eLSM.OrderNo,
                                         Units = eLSM.Units,
                                         NormalRange = eLSM.NormalRange,
                                         LabSubMasterDesc = (eLSM.SubMasterLabTypeDesc != null && eLSM.SubMasterLabTypeDesc != "") ? (eLSM.SubMasterLabType + " - " + eLSM.SubMasterLabTypeDesc) : eLSM.SubMasterLabType

                                     }).ToList();

            return eLabSubMasterList;
        }

        ///// <summary>
        ///// Get eLab Sub master record by ID
        ///// </summary>
        ///// <param>int eLabSubMasterId</param>
        ///// <returns>eLabSubMasterModel. if eLab Sub record for given eLabMaster ID = success. else = failure</returns>
        public eLabSubMasterModel GetELabSubMasterRecord(int eLabSubMasterId)
        {
            var eLabSubRecord = (from eLabSub in this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.LabSubMasterID == eLabSubMasterId)

                                 join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                 on eLabSub.LabMasterId equals eLab.LabMasterID

                                 join depart in this.uow.GenericRepository<Departments>().Table()
                                 on eLabSub.DepartmentID equals depart.DepartmentID

                                 select new
                                 {
                                     eLabSub.LabSubMasterID,
                                     eLabSub.DepartmentID,
                                     eLabSub.LabMasterId,
                                     LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                     eLabSub.SubMasterLabCode,
                                     eLabSub.SubMasterLabType,
                                     eLabSub.SubMasterLabTypeDesc,
                                     eLabSub.IsActive,
                                     eLabSub.Status,
                                     eLabSub.OrderNo,
                                     eLabSub.Units,
                                     eLabSub.NormalRange,
                                     depart.DepartmentDesc

                                 }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSubMasterModel
                                 {
                                     LabSubMasterID = eLSM.LabSubMasterID,
                                     LabMasterId = eLSM.LabMasterId,
                                     LabMasterDesc = eLSM.LabMasterDesc,
                                     DepartmentID = eLSM.DepartmentID,
                                     DepartmentDesc = eLSM.DepartmentDesc,
                                     SubMasterLabCode = eLSM.SubMasterLabCode,
                                     SubMasterLabType = eLSM.SubMasterLabType,
                                     SubMasterLabTypeDesc = eLSM.SubMasterLabTypeDesc,
                                     IsActive = eLSM.IsActive,
                                     Status = eLSM.Status,
                                     OrderNo = eLSM.OrderNo,
                                     Units = eLSM.Units,
                                     NormalRange = eLSM.NormalRange,
                                     LabSubMasterDesc = (eLSM.SubMasterLabTypeDesc != null && eLSM.SubMasterLabTypeDesc != "") ? (eLSM.SubMasterLabType + " - " + eLSM.SubMasterLabTypeDesc) : eLSM.SubMasterLabType

                                 }).FirstOrDefault();

            return eLabSubRecord;
        }

        ///// <summary>
        ///// Delete eLab Sub Master Record by ID
        ///// </summary>
        ///// <param>int eLabSubMasterId</param>
        ///// <returns>eLabSubMaster. if eLab Sub Master data Record for Given eLabSubMasterId ID is Deleted = success. else = failure</returns>
        public eLabSubMaster DeleteELabSubMasterRecord(int eLabSubMasterId)
        {
            var eLabSubRecord = this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.LabSubMasterID == eLabSubMasterId).FirstOrDefault();

            if (eLabSubRecord != null)
            {
                eLabSubRecord.IsActive = false;

                this.uow.GenericRepository<eLabSubMaster>().Update(eLabSubRecord);
                this.uow.Save();
            }
            return eLabSubRecord;
        }

        #endregion

        #region eLab Setup Master

        ///// <summary>
        ///// Add or Update e-Lab Setup Master data
        ///// </summary>
        ///// <param>eLabSetupMasterModel elabSetupMasterModel</param>
        ///// <returns>eLabSetupMasterModel. if e-Lab Setup Master data added = success. else = failure</returns>
        public eLabSetupMasterModel AddUpdateELabSetupMasterData(eLabSetupMasterModel elabSetupMasterModel)
        {
            var elabSetupMaster = this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.DepartmentID == elabSetupMasterModel.DepartmentID &
                                            x.LabMasterID == elabSetupMasterModel.LabMasterID & x.LabSubMasterID == elabSetupMasterModel.LabSubMasterID).FirstOrDefault();

            if (elabSetupMaster == null)
            {
                elabSetupMaster = new eLabSetupMaster();

                elabSetupMaster.DepartmentID = elabSetupMasterModel.DepartmentID == 0 ? 1 : elabSetupMasterModel.DepartmentID;
                elabSetupMaster.LabMasterID = elabSetupMasterModel.LabMasterID;
                elabSetupMaster.LabSubMasterID = elabSetupMasterModel.LabSubMasterID;
                elabSetupMaster.Status = elabSetupMasterModel.Status;
                elabSetupMaster.OrderNo = elabSetupMasterModel.OrderNo;
                elabSetupMaster.Charges = elabSetupMasterModel.Charges;
                elabSetupMaster.IsActive = true;
                elabSetupMaster.Createddate = DateTime.Now;
                elabSetupMaster.CreatedBy = "User";

                this.uow.GenericRepository<eLabSetupMaster>().Insert(elabSetupMaster);
            }
            else
            {
                elabSetupMaster.Status = elabSetupMasterModel.Status;
                elabSetupMaster.OrderNo = elabSetupMasterModel.OrderNo;
                elabSetupMaster.Charges = elabSetupMasterModel.Charges;
                elabSetupMaster.IsActive = true;
                elabSetupMaster.ModifiedDate = DateTime.Now;
                elabSetupMaster.ModifiedBy = "User";

                this.uow.GenericRepository<eLabSetupMaster>().Update(elabSetupMaster);
            }
            this.uow.Save();
            elabSetupMasterModel.SetupMasterID = elabSetupMaster.SetupMasterID;

            return elabSetupMasterModel;
        }

        ///// <summary>
        ///// Get eLab Setup Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabSetupMasterModel>. if eLab Setup Master List = success. else = failure</returns>
        public List<eLabSetupMasterModel> GetELabSetupMasterList()
        {
            var eLabSetupMasterList = (from eLabSetup in this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.IsActive != false)

                                       join depart in this.uow.GenericRepository<Departments>().Table()
                                        on eLabSetup.DepartmentID equals depart.DepartmentID

                                       join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                       on eLabSetup.LabMasterID equals eLab.LabMasterID

                                       select new
                                       {
                                           eLabSetup.SetupMasterID,
                                           eLabSetup.DepartmentID,
                                           eLabSetup.LabMasterID,
                                           eLabSetup.LabSubMasterID,
                                           eLabSetup.Status,
                                           eLabSetup.OrderNo,
                                           eLabSetup.Charges,
                                           LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                           depart.DepartmentDesc

                                       }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSetupMasterModel
                                       {
                                           SetupMasterID = eLSM.SetupMasterID,
                                           DepartmentID = eLSM.DepartmentID,
                                           DepartmentDesc = eLSM.DepartmentDesc,
                                           LabMasterID = eLSM.LabMasterID,
                                           LabMasterDesc = eLSM.LabMasterDesc,
                                           LabSubMasterID = eLSM.LabSubMasterID,
                                           LabSubMasterDesc = eLSM.LabSubMasterID > 0 ? this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc : "",
                                           Status = eLSM.Status,
                                           OrderNo = eLSM.OrderNo,
                                           Charges = eLSM.Charges,
                                           setupMasterDesc = eLSM.LabSubMasterID > 0 ? (eLSM.LabMasterDesc + " - " + this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc) : eLSM.LabMasterDesc

                                       }).ToList();

            return eLabSetupMasterList;
        }

        ///// <summary>
        ///// Get eLab Setup Master List by Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<eLabSetupMasterModel>. if eLab Setup Master List = success. else = failure</returns>
        public List<eLabSetupMasterModel> GetELabSetupMasterListbySearch(string searchKey)
        {
            var eLabSetupMasterList = (from eLabSetup in this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.IsActive != false)

                                       join depart in this.uow.GenericRepository<Departments>().Table()
                                        on eLabSetup.DepartmentID equals depart.DepartmentID

                                       join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                       on eLabSetup.LabMasterID equals eLab.LabMasterID

                                       select new
                                       {
                                           eLabSetup.SetupMasterID,
                                           eLabSetup.DepartmentID,
                                           eLabSetup.LabMasterID,
                                           eLabSetup.LabSubMasterID,
                                           eLabSetup.Status,
                                           eLabSetup.OrderNo,
                                           eLabSetup.Charges,
                                           LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                           depart.DepartmentDesc

                                       }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSetupMasterModel
                                       {
                                           SetupMasterID = eLSM.SetupMasterID,
                                           DepartmentID = eLSM.DepartmentID,
                                           DepartmentDesc = eLSM.DepartmentDesc,
                                           LabMasterID = eLSM.LabMasterID,
                                           LabMasterDesc = eLSM.LabMasterDesc,
                                           LabSubMasterID = eLSM.LabSubMasterID,
                                           LabSubMasterDesc = eLSM.LabSubMasterID > 0 ? this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc : "",
                                           Status = eLSM.Status,
                                           OrderNo = eLSM.OrderNo,
                                           Charges = eLSM.Charges,
                                           setupMasterDesc = eLSM.LabSubMasterID > 0 ? (eLSM.LabMasterDesc + " - " + this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc) : eLSM.LabMasterDesc

                                       }).ToList();

            var setupMasterData = (from data in eLabSetupMasterList
                                   where (searchKey == null ||
                                        (data.setupMasterDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                        )
                                   select data).ToList();

            return setupMasterData;
        }

        ///// <summary>
        ///// Get eLab Setup Master Record by ID
        ///// </summary>
        ///// <param>int eLabSetupMasterId</param>
        ///// <returns>eLabSetupMasterModel. if eLab Setup Master data Record for Given eLabSetupMaster Id = success. else = failure</returns>
        public eLabSetupMasterModel GetELabSetupMasterRecordbyID(int eLabSetupMasterId)
        {
            var eLabSetupMasterRecord = (from eLabSetup in this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.IsActive != false & x.SetupMasterID == eLabSetupMasterId)

                                         join depart in this.uow.GenericRepository<Departments>().Table()
                                          on eLabSetup.DepartmentID equals depart.DepartmentID

                                         join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                         on eLabSetup.LabMasterID equals eLab.LabMasterID

                                         select new
                                         {
                                             eLabSetup.SetupMasterID,
                                             eLabSetup.DepartmentID,
                                             eLabSetup.LabMasterID,
                                             eLabSetup.LabSubMasterID,
                                             eLabSetup.Status,
                                             eLabSetup.OrderNo,
                                             eLabSetup.Charges,
                                             LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                             depart.DepartmentDesc

                                         }).AsEnumerable().Select(eLSM => new eLabSetupMasterModel
                                         {
                                             SetupMasterID = eLSM.SetupMasterID,
                                             DepartmentID = eLSM.DepartmentID,
                                             DepartmentDesc = eLSM.DepartmentDesc,
                                             LabMasterID = eLSM.LabMasterID,
                                             LabMasterDesc = eLSM.LabMasterDesc,
                                             LabSubMasterID = eLSM.LabSubMasterID,
                                             LabSubMasterDesc = eLSM.LabSubMasterID > 0 ? this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc : "",
                                             Status = eLSM.Status,
                                             OrderNo = eLSM.OrderNo,
                                             Charges = eLSM.Charges,
                                             setupMasterDesc = eLSM.LabSubMasterID > 0 ? (eLSM.LabMasterDesc + " - " + this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc) : eLSM.LabMasterDesc

                                         }).FirstOrDefault();

            return eLabSetupMasterRecord;
        }

        ///// <summary>
        ///// Delete eLab Setup Master Record by ID
        ///// </summary>
        ///// <param>int eLabSetupMasterId</param>
        ///// <returns>eLabSetupMaster. if eLab Setup Master data Record for Given eLabSetupMasterId ID is Deleted = success. else = failure</returns>
        public eLabSetupMaster DeleteELabSetupMasterRecord(int eLabSetupMasterId)
        {
            var eLabSetupRecord = this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.SetupMasterID == eLabSetupMasterId).FirstOrDefault();

            if (eLabSetupRecord != null)
            {
                eLabSetupRecord.IsActive = false;

                this.uow.GenericRepository<eLabSetupMaster>().Update(eLabSetupRecord);
                this.uow.Save();
            }
            return eLabSetupRecord;
        }

        #endregion

        #region Search and Count

        ///// <summary>
        ///// Get Patients for Discharge
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForELab(string searchKey)
        {
            List<Patient> patients = new List<Patient>();
            var facList = this.utilService.GetFacilitiesforUser();

            if (facList.Count() > 0)
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            join fac in facList on patDemo.FacilityId equals fac.FacilityId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();


            }
            else
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();
            }

            return patients;
        }

        ///// <summary>
        ///// Get Providers For Discharge
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Discharge = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforELab(string searchKey)
        {
            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            var providers = (from prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)

                             where (searchKey == null || (prov.FirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                      || prov.MiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                      || prov.LastName.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                             select new
                             {
                                 prov.ProviderID,
                                 prov.UserID,
                                 prov.FirstName,
                                 prov.MiddleName,
                                 prov.LastName

                             }).AsEnumerable().Select(PM => new ProviderModel
                             {
                                 ProviderID = PM.ProviderID,
                                 UserID = PM.UserID,
                                 ProviderName = PM.FirstName + " " + PM.MiddleName + " " + PM.LastName

                             }).ToList();

            foreach (var prov in providers)
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
            }

            return ProviderList.Take(10).ToList();
        }

        ///// <summary>
        ///// Get Lab Order Numbers for Discharge Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Lab Order Numbers for given searchKey = success. else = failure</returns>
        public List<string> GetLabOrderNumbersbySearch(string searchKey)
        {
            List<string> labOrderNumbers = new List<string>();

            var labOrderRecords = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.IsActive != false & x.LabOrderNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (labOrderRecords.Count() > 0)
            {
                foreach (var data in labOrderRecords)
                {
                    if (!labOrderNumbers.Contains(data.LabOrderNo))
                    {
                        labOrderNumbers.Add(data.LabOrderNo);
                    }
                }
            }

            return labOrderNumbers.Distinct().ToList();
        }

        ///// <summary>
        ///// Get Lab Order status for Discharge Search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<string> If Lab Order statuses = success. else = failure</returns>
        public List<string> GetLabOrderStatuses()
        {
            List<string> labOrderStatusList = new List<string>();

            var labOrderRecords = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.IsActive != false).ToList();

            if (labOrderRecords.Count() > 0)
            {
                foreach (var data in labOrderRecords)
                {
                    if (!labOrderStatusList.Contains(data.LabOrderStatus))
                    {
                        labOrderStatusList.Add(data.LabOrderStatus);
                    }
                }
            }

            return labOrderStatusList.Distinct().ToList();
        }

        ///// <summary>
        ///// Get eLab Orders by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<eLabOrderModel>. if Collection of eLabOrderModel = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            int patId = 0;

            var elabOrders = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false)

                              select new
                              {
                                  elabOrder.LabOrderID,
                                  elabOrder.LabOrderNo,
                                  elabOrder.AdmissionID,
                                  elabOrder.VisitID,
                                  elabOrder.LabPhysician,
                                  elabOrder.LabOrderStatus,
                                  elabOrder.RequestedFrom,
                                  elabOrder.SignOff,
                                  elabOrder.SignOffBy,
                                  elabOrder.SignOffDate,
                                  elabOrder.Createddate

                              }).AsEnumerable().Select(eLOM => new eLabOrderModel
                              {
                                  LabOrderID = eLOM.LabOrderID,
                                  LabOrderNo = eLOM.LabOrderNo,
                                  AdmissionID = eLOM.AdmissionID,
                                  VisitID = eLOM.VisitID,
                                  LabPhysician = eLOM.LabPhysician,
                                  LabOrderStatus = eLOM.LabOrderStatus,
                                  RequestedFrom = eLOM.RequestedFrom,
                                  SignOff = eLOM.SignOff,
                                  SignOffBy = eLOM.SignOffBy,
                                  SignOffDate = eLOM.SignOffDate,
                                  Createddate = eLOM.Createddate,
                                  labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                              }).ToList();

            if (elabOrders.Count() > 0)
            {
                for (int i = 0; i < elabOrders.Count(); i++)
                {
                    if (elabOrders[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrders[i].AdmissionID).PatientID;
                    }
                    else if (elabOrders[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrders[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == elabOrders[i].LabPhysician);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrders[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrders[i].AdmissionID);

                    elabOrders[i].patientId = patId;
                    elabOrders[i].patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                    elabOrders[i].physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                    if (admdata != null)
                    {
                        elabOrders[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        elabOrders[i].AdmissionNo = admdata.AdmissionNo;
                        elabOrders[i].FacilityID = admdata.FacilityID;
                        elabOrders[i].ProviderId = admdata.AdmittingPhysician;
                        elabOrders[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    }

                    if (visitdata != null)
                    {
                        elabOrders[i].visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        elabOrders[i].VisitNo = visitdata.VisitNo;
                        elabOrders[i].FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        elabOrders[i].ProviderId = visitdata.ProviderID;
                        elabOrders[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    }
                }
            }
            var elabOrderList = (from order in elabOrders
                                 where (Fromdate.Date <= order.Createddate.Date
                                        && (Todate.Date >= Fromdate.Date && order.Createddate.Date <= Todate.Date)
                                        && (searchModel.PatientId == 0 || order.patientId == searchModel.PatientId)
                                        && (searchModel.ProviderId == 0 || order.LabPhysician == searchModel.ProviderId)
                                        && (searchModel.FacilityId == 0 || order.FacilityID == searchModel.FacilityId)
                                        && ((searchModel.LabOrderNo == null || searchModel.LabOrderNo == "")
                                            || order.LabOrderNo.ToLower().Trim() == searchModel.LabOrderNo.ToLower().Trim())
                                        && ((searchModel.status == null || searchModel.status == "")
                                            || order.LabOrderStatus.ToLower().Trim() == searchModel.status.ToLower().Trim()))
                                 select order).ToList();

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabOrderList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            labOrderCollection = (from lab in elabOrderList
                                                  join fac in facList on lab.FacilityID equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on lab.ProviderId equals prov.ProviderID
                                                  select lab).ToList();
                        }
                        else
                        {
                            labOrderCollection = (from lab in elabOrderList
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on lab.ProviderId equals prov.ProviderID
                                                  select lab).ToList();
                        }
                    }
                    else
                    {
                        labOrderCollection = (from lab in elabOrderList.Where(x => x.FacilityID == searchModel.FacilityId)
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in elabOrderList
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = elabOrderList;
            }

            return labOrderCollection;
        }

        ///// <summary>
        ///// Get eLab Order counts
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>ELabCountModel. if counts E lab and requests  = success. else = failure</returns>
        public ELabCountModel GetELabCounts()
        {
            ELabCountModel labCountModel = new ELabCountModel();

            List<eLabOrderModel> elabOrderCollection = new List<eLabOrderModel>();
            List<eLabRequestModel> elabRequestList = new List<eLabRequestModel>();

            elabOrderCollection = this.GetAllELabOrders();
            elabRequestList = this.GetAllELabRequests();

            labCountModel.TodayeLabOrderCount = elabOrderCollection.Where(x => x.Createddate.Date == DateTime.Now.Date).ToList().Count();
            labCountModel.TodayeLabRequestCount = elabRequestList.Where(x => x.RequestedDate.Value.Date == DateTime.Now.Date & x.LabOrderStatus.ToLower().Trim() == "requested").ToList().Count();

            return labCountModel;
        }

        #endregion

        #region Patient data

        ///// <summary>
        ///// Get Patient Detail By Id
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>PatientDemographicModel. if Patient Data for given PatientId = success. else = failure</returns>
        public PatientDemographicModel GetPatientDetailById(int PatientId)
        {
            PatientDemographicModel demoModel = (from pat in uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                                 join patDemo in uow.GenericRepository<PatientDemographic>().Table()
                                                 on pat.PatientId equals patDemo.PatientId

                                                 select new
                                                 {
                                                     pat.PatientId,
                                                     pat.MRNo,
                                                     pat.PatientFirstName,
                                                     pat.PatientMiddleName,
                                                     pat.PatientLastName,
                                                     pat.PatientDOB,
                                                     pat.PatientAge,
                                                     pat.Gender,
                                                     pat.PrimaryContactNumber,
                                                     pat.PrimaryContactType,
                                                     pat.SecondaryContactNumber,
                                                     pat.SecondaryContactType,
                                                     pat.PatientStatus,
                                                     patDemo.PatientType,
                                                     patDemo.FacilityId,
                                                     patDemo.RegisterationAt,
                                                     patDemo.PatientCategory,
                                                     patDemo.Salutation,
                                                     patDemo.IDTID1,
                                                     patDemo.PatientIdentificationtype1details,
                                                     patDemo.IDTID2,
                                                     patDemo.PatientIdentificationtype2details,
                                                     patDemo.MaritalStatus,
                                                     patDemo.Religion,
                                                     patDemo.Race,
                                                     patDemo.Occupation,
                                                     patDemo.email,
                                                     patDemo.Emergencycontactnumber,
                                                     patDemo.Address1,
                                                     patDemo.Address2,
                                                     patDemo.Village,
                                                     patDemo.Town,
                                                     patDemo.City,
                                                     patDemo.Pincode,
                                                     patDemo.State,
                                                     patDemo.Country,
                                                     patDemo.Bloodgroup,
                                                     patDemo.NKFirstname,
                                                     patDemo.NKSalutation,
                                                     patDemo.NKLastname,
                                                     patDemo.NKPrimarycontactnumber,
                                                     patDemo.NKContactType,
                                                     patDemo.RSPId

                                                 }).AsEnumerable().Select(PDM => new PatientDemographicModel
                                                 {
                                                     PatientId = PDM.PatientId,
                                                     MRNo = PDM.MRNo,
                                                     PatientFirstName = PDM.PatientFirstName,
                                                     PatientMiddleName = PDM.PatientMiddleName,
                                                     PatientLastName = PDM.PatientLastName,
                                                     PatientFullName = PDM.PatientFirstName + " " + PDM.PatientMiddleName + " " + PDM.PatientLastName,
                                                     PatientDOB = PDM.PatientDOB,
                                                     PatientAge = PDM.PatientAge,
                                                     Gender = PDM.Gender,
                                                     PrimaryContactNumber = PDM.PrimaryContactNumber,
                                                     PrimaryContactType = PDM.PrimaryContactType,
                                                     PatientStatus = PDM.PatientStatus,
                                                     SecondaryContactNumber = PDM.SecondaryContactNumber,
                                                     SecondaryContactType = PDM.SecondaryContactType,
                                                     PatientType = PDM.PatientType,
                                                     FacilityId = PDM.FacilityId,
                                                     FacilityName = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == PDM.FacilityId).FirstOrDefault().FacilityName,
                                                     RegisterationAt = PDM.RegisterationAt,
                                                     PatientCategory = PDM.PatientCategory,
                                                     Salutation = PDM.Salutation,
                                                     IDTID1 = PDM.IDTID1,
                                                     PatientIdentificationtype1details = PDM.PatientIdentificationtype1details,
                                                     IDTID2 = PDM.IDTID2,
                                                     PatientIdentificationtype2details = PDM.PatientIdentificationtype2details,
                                                     MaritalStatus = PDM.MaritalStatus,
                                                     Religion = PDM.Religion,
                                                     Race = PDM.Race,
                                                     Occupation = PDM.Occupation,
                                                     email = PDM.email,
                                                     Emergencycontactnumber = PDM.Emergencycontactnumber,
                                                     Address1 = PDM.Address1,
                                                     Address2 = PDM.Address2,
                                                     Village = PDM.Village,
                                                     Town = PDM.Town,
                                                     City = PDM.City,
                                                     Pincode = PDM.Pincode,
                                                     State = PDM.State,
                                                     Country = PDM.Country,
                                                     Bloodgroup = PDM.Bloodgroup,
                                                     NKSalutation = PDM.NKSalutation,
                                                     NKFirstname = PDM.NKFirstname,
                                                     NKLastname = PDM.NKLastname,
                                                     NKPrimarycontactnumber = PDM.NKPrimarycontactnumber,
                                                     NKContactType = PDM.NKContactType,
                                                     RSPId = PDM.RSPId,
                                                     Relationship = PDM.RSPId > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == PDM.RSPId).RSPDescription : "",
                                                     Diabetic = this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId) == null ? " " :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsDiabetic == "N" ? "No" :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsDiabetic == "Y" ? "Yes" : "Unknown")),
                                                     HighBP = this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId) == null ? " " :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsBloodPressure == "N" ? "No" :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsBloodPressure == "Y" ? "Yes" : "Unknown")),
                                                     Gait = this.GetCognitiveforPatient(PDM.PatientId),
                                                     Allergies = this.GetAllergyforPatient(PDM.PatientId)

                                                 }).FirstOrDefault();

            var bills = this.billCalculationforPatient(demoModel.PatientId);

            demoModel.billedAmount = bills[0];
            demoModel.paidAmount = bills[1];
            demoModel.balanceAmount = bills[2];

            return demoModel;
        }

        ///// <summary>
        ///// Get bill details for specific patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<decimal>. if amounts for selected Patient Id = success. else = failure</returns>
        public List<decimal> billCalculationforPatient(int PatientId)
        {
            List<decimal> amounts = new List<decimal>(new decimal[3]);

            var payments = this.GetPaymentParticularsforPatient(PatientId);

            if (payments.Count() > 0)
            {
                foreach (var set in payments)
                {
                    amounts[0] += set.TotalAmount;
                    amounts[1] += set.AmountPaid;
                }
                amounts[2] = amounts[0] - amounts[1];
            }

            return amounts;
        }

        ///// <summary>
        ///// Get All Payment Details
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All payment Detail for given patientId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetPaymentParticularsforPatient(int patientID)
        {
            List<CommonPaymentDetailsModel> paymentParticularCollection = new List<CommonPaymentDetailsModel>();

            var visPaymentDetails = this.GetVisitPaymentDetails().Where(x => x.PatientId == patientID).ToList();

            if (visPaymentDetails.Count() > 0)
            {
                foreach (var data in visPaymentDetails)
                {
                    if (!paymentParticularCollection.Contains(data))
                    {
                        paymentParticularCollection.Add(data);
                    }
                }
            }

            var admPaymentDetails = this.GetAdmissionPaymentDetails().Where(x => x.PatientId == patientID).ToList();

            if (admPaymentDetails.Count() > 0)
            {
                foreach (var set in admPaymentDetails)
                {
                    if (!paymentParticularCollection.Contains(set))
                    {
                        paymentParticularCollection.Add(set);
                    }
                }
            }

            return paymentParticularCollection;
        }

        ///// <summary>
        ///// Get Visit Payment Details for patient Id
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All visit payment Detail for given patientId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetVisitPaymentDetails()
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false)

                                  join payment in this.uow.GenericRepository<VisitPayment>().Table()
                                  on detail.VisitPaymentID equals payment.VisitPaymentID

                                  join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                  on payment.VisitID equals visit.VisitId

                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on visit.PatientId equals pat.PatientId

                                  join prov in this.uow.GenericRepository<Provider>().Table()
                                  on visit.ProviderID equals prov.ProviderID

                                  select new
                                  {
                                      detail.VisitPaymentDetailsID,
                                      detail.VisitPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = CPDM.VisitPaymentDetailsID,
                                      VisitPaymentID = CPDM.VisitPaymentID,
                                      //ReceiptDate = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate,
                                      //ReceiptTime = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      //ReceiptNo = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().GrandTotal,
                                      //Notes = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().Notes,
                                      //SetupMasterID = CPDM.SetupMasterID,
                                      //Charges = CPDM.Charges,
                                      //Refund = CPDM.Refund,
                                      //RefundNotes = CPDM.RefundNotes,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            return paymentDetails;
        }

        ///// <summary>
        ///// Get Admission Payment Details
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All admission payment Details = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetAdmissionPaymentDetails()
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false)

                                  join payment in this.uow.GenericRepository<AdmissionPayment>().Table()
                                  on detail.AdmissionPaymentID equals payment.AdmissionPaymentID

                                  join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                  on payment.AdmissionID equals adm.AdmissionID

                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on adm.PatientID equals pat.PatientId

                                  join prov in this.uow.GenericRepository<Provider>().Table()
                                  on adm.AdmittingPhysician equals prov.ProviderID

                                  select new
                                  {
                                      detail.AdmissionPaymentDetailsID,
                                      detail.AdmissionPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      AdmissionPaymentDetailsID = CPDM.AdmissionPaymentDetailsID,
                                      AdmissionPaymentID = CPDM.AdmissionPaymentID,
                                      //ReceiptDate = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate,
                                      //ReceiptTime = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      //ReceiptNo = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().GrandTotal,
                                      //Notes = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().Notes,
                                      //SetupMasterID = CPDM.SetupMasterID,
                                      //Charges = CPDM.Charges,
                                      //Refund = CPDM.Refund,
                                      //RefundNotes = CPDM.RefundNotes,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            return paymentDetails;
        }

        ///// <summary>
        ///// Get vital data for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>PatientVitals. if vital data for selected Patient Id = success. else = failure</returns>
        public PatientVitals GetPatientVitalsData(int PatientId)
        {
            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.PatientId == PatientId).LastOrDefault();
            return vital;
        }

        ///// <summary>
        ///// Get gait status for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>string. if gait status for selected Patient Id = success. else = failure</returns>
        public string GetCognitiveforPatient(int PatientId)
        {
            string message = " ";
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.PatientID == PatientId).LastOrDefault();

            if (cognitive != null)
            {
                message = cognitive.Gait == null ? " " : (cognitive.Gait.Value == 1 ? "Normal" : "Abnormal");
            }

            return message;
        }

        ///// <summary>
        ///// Get allergy for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>string. if allergy for selected Patient Id = success. else = failure</returns>
        public string GetAllergyforPatient(int PatientId)
        {
            string message = " ";
            var allergies = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false).LastOrDefault();

            if (allergies != null)
            {
                return allergies.Name;
            }

            return message;
        }

        #endregion

        #region E Lab Orders

        ///// <summary>
        ///// Get Visit details by Patient Id
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if list of Visits for given Patient Id = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsbyPatientforELab(int PatientId)
        {
            var visitList = (from visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientId)

                             join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                             on visit.PatientId equals pat.PatientId

                             select new
                             {
                                 visit.VisitId,
                                 visit.VisitNo,
                                 visit.VisitDate,
                                 visit.FacilityID,
                                 visit.ProviderID,
                                 visit.Visittime,
                                 pat.PatientId,
                                 visit.RecordedDuringID

                             }).AsEnumerable().OrderByDescending(x => x.VisitDate).Select(PVM => new PatientVisitModel
                             {
                                 VisitId = PVM.VisitId,
                                 VisitNo = PVM.VisitNo,
                                 PatientId = PVM.PatientId,
                                 FacilityID = PVM.FacilityID,
                                 ProviderID = PVM.ProviderID,
                                 VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                 recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : ""

                             }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in visitList
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in visitList
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visitList
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visitList;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Add or Update e Lab Orders
        ///// </summary>
        ///// <param>(eLabOrderModel elabOrderModel)</param>
        ///// <returns>eLabOrderModel. if Record of eLab Order added or Updated = success. else = failure</returns>
        public eLabOrderModel AddUpdateELabOrder(eLabOrderModel elabOrder)
        {
            var getlabNoCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                  where common.CommonMasterCode.ToLower().Trim() == "lbno"
                                  select common).FirstOrDefault();

            var lbNoCheck = this.uow.GenericRepository<eLabOrder>().Table()
                            .Where(x => x.LabOrderNo.ToLower().Trim() == getlabNoCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = elabOrder.UserName;
            signOffModel.Password = elabOrder.Password;

            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                var result = this.utilService.UserCheck(signOffModel);

                if (result.Result.status.ToLower().Trim() == "valid user")
                {
                    var elabOrderData = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderNo == elabOrder.LabOrderNo).FirstOrDefault();

                    if (elabOrderData == null)
                    {
                        elabOrderData = new eLabOrder();

                        elabOrderData.AdmissionID = elabOrder.AdmissionID;
                        elabOrderData.VisitID = elabOrder.VisitID;
                        elabOrderData.LabOrderNo = lbNoCheck != null ? elabOrder.LabOrderNo : getlabNoCommon.CommonMasterDesc;
                        elabOrderData.LabOrderStatus = "Ordered";
                        elabOrderData.LabPhysician = elabOrder.LabPhysician;
                        elabOrderData.RequestedFrom = (elabOrder.RequestedFrom == null || elabOrder.RequestedFrom == "") ? "Lab Order" : elabOrder.RequestedFrom;
                        elabOrderData.SignOffBy = elabOrder.UserName;
                        elabOrderData.SignOff = true;
                        elabOrderData.SignOffDate = DateTime.Now;
                        elabOrderData.IsActive = true;
                        elabOrderData.Createddate = DateTime.Now;
                        elabOrderData.CreatedBy = "User";

                        this.uow.GenericRepository<eLabOrder>().Insert(elabOrderData);
                        this.uow.Save();

                        getlabNoCommon.CurrentIncNo = elabOrderData.LabOrderNo;
                        this.uow.GenericRepository<CommonMaster>().Update(getlabNoCommon);
                        this.uow.Save();
                    }
                    else
                    {
                        elabOrderData.LabOrderStatus = "Ordered";
                        elabOrderData.RequestedFrom = (elabOrder.RequestedFrom == null || elabOrder.RequestedFrom == "") ? "Lab Order" : elabOrder.RequestedFrom;
                        elabOrderData.SignOffBy = elabOrder.UserName;
                        elabOrderData.SignOff = true;
                        elabOrderData.SignOffDate = DateTime.Now;
                        elabOrderData.IsActive = true;
                        elabOrderData.ModifiedDate = DateTime.Now;
                        elabOrderData.ModifiedBy = "User";

                        this.uow.GenericRepository<eLabOrder>().Update(elabOrderData);
                        this.uow.Save();
                    }
                    elabOrder.LabOrderID = elabOrderData.LabOrderID;
                    elabOrder.ValidationStatus = "Valid User";

                    if (elabOrderData.LabOrderID > 0 && elabOrder.labOrderItems.Count() > 0)
                    {
                        var orderItems = this.uow.GenericRepository<eLabOrderItems>().Table().Where(x => x.LabOrderID == elabOrderData.LabOrderID).ToList();
                        eLabOrderItems orderItemData = new eLabOrderItems();
                        if (orderItems.Count() == 0)
                        {
                            foreach (var data in elabOrder.labOrderItems)
                            {
                                orderItemData = new eLabOrderItems();

                                orderItemData.LabOrderID = elabOrderData.LabOrderID;
                                orderItemData.SetupMasterID = data.SetupMasterID;
                                orderItemData.UrgencyCode = data.UrgencyCode;
                                orderItemData.LabOnDate = this.utilService.GetLocalTime(data.LabOnDate);
                                orderItemData.LabNotes = data.LabNotes;
                                orderItemData.IsActive = true;
                                orderItemData.Createddate = DateTime.Now;
                                orderItemData.CreatedBy = "User";

                                this.uow.GenericRepository<eLabOrderItems>().Insert(orderItemData);
                            }
                        }
                        else
                        {
                            foreach (var set in orderItems)
                            {
                                this.uow.GenericRepository<eLabOrderItems>().Delete(set);
                            }
                            this.uow.Save();

                            foreach (var data in elabOrder.labOrderItems)
                            {
                                orderItemData = new eLabOrderItems();

                                orderItemData.LabOrderID = elabOrderData.LabOrderID;
                                orderItemData.SetupMasterID = data.SetupMasterID;
                                orderItemData.UrgencyCode = data.UrgencyCode;
                                orderItemData.LabOnDate = this.utilService.GetLocalTime(data.LabOnDate);
                                orderItemData.LabNotes = data.LabNotes;
                                orderItemData.IsActive = true;
                                orderItemData.Createddate = DateTime.Now;
                                orderItemData.CreatedBy = "User";

                                this.uow.GenericRepository<eLabOrderItems>().Insert(orderItemData);
                            }
                        }
                        this.uow.Save();

                        //eLabOrderItems orderItemData = new eLabOrderItems();
                        //foreach (var data in elabOrder.labOrderItems)
                        //{
                        //    orderItemData = this.uow.GenericRepository<eLabOrderItems>().Table().FirstOrDefault(x => x.LabOrderItemsID == data.LabOrderItemsID);
                        //    if (orderItemData == null)
                        //    {
                        //        orderItemData = new eLabOrderItems();

                        //        orderItemData.LabOrderID = elabOrderData.LabOrderID;
                        //        orderItemData.SetupMasterID = data.SetupMasterID;
                        //        orderItemData.UrgencyCode = data.UrgencyCode;
                        //        orderItemData.LabOnDate = this.utilService.GetLocalTime(data.LabOnDate);
                        //        orderItemData.LabNotes = data.LabNotes;
                        //        orderItemData.IsActive = true;
                        //        orderItemData.Createddate = DateTime.Now;
                        //        orderItemData.CreatedBy = "User";

                        //        this.uow.GenericRepository<eLabOrderItems>().Insert(orderItemData);
                        //    }
                        //    else
                        //    {
                        //        orderItemData.SetupMasterID = data.SetupMasterID;
                        //        orderItemData.UrgencyCode = data.UrgencyCode;
                        //        orderItemData.LabOnDate = this.utilService.GetLocalTime(data.LabOnDate);
                        //        orderItemData.LabNotes = data.LabNotes;
                        //        orderItemData.IsActive = true;
                        //        orderItemData.ModifiedDate = DateTime.Now;
                        //        orderItemData.ModifiedBy = "User";

                        //        this.uow.GenericRepository<eLabOrderItems>().Update(orderItemData);
                        //    }
                        //    this.uow.Save();
                        //    data.LabOrderID = orderItemData.LabOrderID;
                        //    data.LabOrderItemsID = orderItemData.LabOrderItemsID;
                        //}
                    }
                }
                else
                {
                    elabOrder.ValidationStatus = "Invalid User";
                }
            }
            else
            {
                elabOrder.ValidationStatus = "Please fill both UserName and Password to Verify the User";
            }
            return elabOrder;
        }

        ///// <summary>
        ///// Update e Lab Order Items for Report
        ///// </summary>
        ///// <param>eLabOrderStatusModel orderStatusModel</param>
        ///// <returns>eLabOrderStatusModel. if Record of eLab Order status added or Updated from report = success. else = failure</returns>
        public eLabOrderStatusModel AddUpdateELabOrderStatusReport(eLabOrderStatusModel orderStatusModel)
        {
            var orderStatus = this.uow.GenericRepository<eLabOrderStatus>().Table().Where(x => x.eLabOrderId == orderStatusModel.eLabOrderId).FirstOrDefault();

            var data = this.UpdateELabOrderItems(orderStatusModel.itemsModel);

            if (orderStatus == null)
            {
                orderStatus = new eLabOrderStatus();

                orderStatus.eLabOrderId = orderStatusModel.eLabOrderId;
                orderStatus.SampleCollectedDate = this.utilService.GetLocalTime(orderStatusModel.SampleCollectedDate);
                orderStatus.ReportDate = this.utilService.GetLocalTime(orderStatusModel.ReportDate);
                orderStatus.ReportStatus = orderStatusModel.ReportStatus;
                orderStatus.Notes = orderStatusModel.Notes;
                orderStatus.ApprovedBy = orderStatusModel.ApprovedBy;
                orderStatus.Createddate = DateTime.Now;
                orderStatus.CreatedBy = "User";

                this.uow.GenericRepository<eLabOrderStatus>().Insert(orderStatus);
            }
            else
            {
                orderStatus.SampleCollectedDate = this.utilService.GetLocalTime(orderStatusModel.SampleCollectedDate);
                orderStatus.ReportDate = this.utilService.GetLocalTime(orderStatusModel.ReportDate);
                orderStatus.ReportStatus = orderStatusModel.ReportStatus;
                orderStatus.Notes = orderStatusModel.Notes;
                orderStatus.ApprovedBy = orderStatusModel.ApprovedBy;
                orderStatus.ModifiedDate = DateTime.Now;
                orderStatus.ModifiedBy = "User";

                this.uow.GenericRepository<eLabOrderStatus>().Update(orderStatus);
            }
            this.uow.Save();
            orderStatusModel.eLabOrderStatusId = orderStatus.eLabOrderStatusId;

            orderStatusModel.itemsModel = data;

            return orderStatusModel;
        }

        ///// <summary>
        ///// Get Lab Order status record for patient
        ///// </summary>
        ///// <param>int labOrderId</param>
        ///// <returns>eLabOrderStatusModel. if Records of eLab Order for given lab Order Id = success. else = failure</returns>
        public eLabOrderStatusModel GetELabOrderStatusRecord(int labOrderId)
        {
            var eLabOrderRecord = (from orderStatus in this.uow.GenericRepository<eLabOrderStatus>().Table().Where(x => x.eLabOrderId == labOrderId)
                                   join order in this.uow.GenericRepository<eLabOrder>().Table()
                                   on orderStatus.eLabOrderId equals order.LabOrderID

                                   select new
                                   {
                                       order.LabOrderID,
                                       orderStatus.eLabOrderStatusId,
                                       orderStatus.SampleCollectedDate,
                                       orderStatus.ReportDate,
                                       orderStatus.ReportStatus,
                                       orderStatus.Notes,
                                       orderStatus.ApprovedBy,
                                       orderStatus.SignOffBy,
                                       orderStatus.SignOffDate,
                                       orderStatus.SignOffStatus

                                   }).AsEnumerable().Select(eLSM => new eLabOrderStatusModel
                                   {
                                       eLabOrderId = eLSM.LabOrderID,
                                       eLabOrderStatusId = eLSM.eLabOrderStatusId,
                                       SampleCollectedDate = eLSM.SampleCollectedDate,
                                       ReportDate = eLSM.ReportDate,
                                       ReportStatus = eLSM.ReportStatus,
                                       Notes = eLSM.Notes,
                                       ApprovedBy = eLSM.ApprovedBy,
                                       ApprovedbyPhysician = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == eLSM.ApprovedBy).FirstName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == eLSM.ApprovedBy).MiddleName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == eLSM.ApprovedBy).LastName,
                                       SignOffBy = eLSM.SignOffBy,
                                       SignOffDate = eLSM.SignOffDate,
                                       SignOffStatus = eLSM.SignOffStatus,
                                       filePath = this.GetFile(eLSM.LabOrderID.ToString(), "ELab/Report")

                                   }).FirstOrDefault();

            return eLabOrderRecord;
        }

        ///// <summary>
        ///// Sign off the report page
        ///// </summary>
        ///// <param>string Username, string Password, int labOrderStatusId</param>
        ///// <returns>string. if status returned as string. else = failure</returns>
        public string LabOrderStatusReportSignOff(string Username, string Password, int labOrderStatusId)
        {
            string Status;

            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = Username;
            signOffModel.Password = Password;
            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                var result = this.utilService.UserCheck(signOffModel);

                if (result.Result.status.ToLower().Trim() == "valid user")
                {
                    var orderStatus = this.uow.GenericRepository<eLabOrderStatus>().Table().Where(x => x.eLabOrderStatusId == labOrderStatusId).FirstOrDefault();

                    if (orderStatus != null)
                    {
                        orderStatus.SignOffBy = Username;
                        orderStatus.SignOffDate = DateTime.Now;
                        orderStatus.SignOffStatus = true;

                        this.uow.GenericRepository<eLabOrderStatus>().Update(orderStatus);
                        this.uow.Save();

                        Status = "Signed Off Successfully.";
                    }
                    else
                    {
                        Status = "No record found";
                    }
                }
                else
                {
                    Status = "Invaid User.";
                }
            }
            else
            {
                Status = "Please fill both UserName and Password to Verify the User";
            }

            return Status;
        }

        ///// <summary>
        ///// Update e Lab Order Items for Report
        ///// </summary>
        ///// <param>List<eLabOrderItemsModel> itemsModel</param>
        ///// <returns>List<eLabOrderItemsModel>. if Records of eLab Order Items added or Updated from report = success. else = failure</returns>
        public List<eLabOrderItemsModel> UpdateELabOrderItems(List<eLabOrderItemsModel> itemsModel)
        {
            List<eLabOrderItemsModel> orderItems = new List<eLabOrderItemsModel>();

            if (itemsModel.Count() > 0)
            {
                foreach (var data in itemsModel)
                {
                    eLabOrderItemsModel orderItemModel = new eLabOrderItemsModel();

                    var orderItemData = this.uow.GenericRepository<eLabOrderItems>().Table().Where(x => x.LabOrderItemsID == data.LabOrderItemsID).FirstOrDefault();

                    if (orderItemData != null)
                    {
                        orderItemData.LabOrderID = data.LabOrderID;
                        orderItemData.SetupMasterID = data.SetupMasterID;
                        orderItemData.UrgencyCode = data.UrgencyCode;
                        orderItemData.LabOnDate = this.utilService.GetLocalTime(data.LabOnDate);
                        orderItemData.LabNotes = data.LabNotes;
                        orderItemData.Value = data.Value;
                        orderItemData.IsActive = true;
                        orderItemData.ModifiedDate = DateTime.Now;
                        orderItemData.ModifiedBy = "User";

                        this.uow.GenericRepository<eLabOrderItems>().Update(orderItemData);
                        this.uow.Save();

                        orderItemModel.LabOrderItemsID = orderItemData.LabOrderItemsID;

                        orderItems.Add(orderItemModel);
                    }
                }
            }
            return orderItems;
        }

        ///// <summary>
        ///// Get e Lab Orders for patient
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order for given patientId = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersforPatient(int patientId)
        {
            List<eLabOrderModel> labOrderRecords = new List<eLabOrderModel>();

            var labOrders = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.IsActive != false & x.LabOrderStatus.ToLower().Trim() != "cancelled").ToList();

            if (labOrders.Count() > 0)
            {
                foreach (var data in labOrders)
                {
                    List<eLabOrderModel> labOrderData = new List<eLabOrderModel>();

                    if (data.AdmissionID > 0)
                    {
                        labOrderData = this.GetELabOrdersforAdmission(data.AdmissionID, patientId);
                        foreach (var record in labOrderData)
                        {
                            if (!labOrderRecords.Contains(record))
                            {
                                labOrderRecords.Add(record);
                            }
                        }
                    }
                    else if (data.VisitID > 0)
                    {
                        labOrderData = this.GetELabOrdersforVisit(data.VisitID, patientId);
                        foreach (var record in labOrderData)
                        {
                            if (!labOrderRecords.Contains(record))
                            {
                                labOrderRecords.Add(record);
                            }
                        }
                    }
                }
            }

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (labOrderRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labOrderCollection = (from lab in labOrderRecords
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.LabPhysician equals prov.ProviderID
                                              select lab).ToList();
                    }
                    else
                    {
                        labOrderCollection = (from lab in labOrderRecords
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.LabPhysician equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in labOrderRecords
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = labOrderRecords;
            }

            return labOrderCollection;
        }

        ///// <summary>
        ///// Get All E Lab Orders
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order = success. else = failure</returns>
        public List<eLabOrderModel> GetAllELabOrders()
        {
            int patId = 0;

            var elabOrders = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false)

                              select new
                              {
                                  elabOrder.LabOrderID,
                                  elabOrder.LabOrderNo,
                                  elabOrder.AdmissionID,
                                  elabOrder.VisitID,
                                  elabOrder.LabPhysician,
                                  elabOrder.LabOrderStatus,
                                  elabOrder.RequestedFrom,
                                  elabOrder.SignOff,
                                  elabOrder.SignOffBy,
                                  elabOrder.SignOffDate,
                                  elabOrder.Createddate

                              }).AsEnumerable().Select(eLOM => new eLabOrderModel
                              {
                                  LabOrderID = eLOM.LabOrderID,
                                  LabOrderNo = eLOM.LabOrderNo,
                                  AdmissionID = eLOM.AdmissionID,
                                  VisitID = eLOM.VisitID,
                                  LabPhysician = eLOM.LabPhysician,
                                  LabOrderStatus = eLOM.LabOrderStatus,
                                  RequestedFrom = eLOM.RequestedFrom,
                                  SignOff = eLOM.SignOff,
                                  SignOffBy = eLOM.SignOffBy,
                                  SignOffDate = eLOM.SignOffDate,
                                  Createddate = eLOM.Createddate,
                                  labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                              }).ToList();

            if (elabOrders.Count() > 0)
            {
                for (int i = 0; i < elabOrders.Count(); i++)
                {
                    if (elabOrders[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrders[i].AdmissionID).PatientID;
                    }
                    else if (elabOrders[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrders[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == elabOrders[i].LabPhysician);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrders[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrders[i].AdmissionID);

                    elabOrders[i].patientId = patId;
                    elabOrders[i].patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                    elabOrders[i].physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                    if (admdata != null)
                    {
                        elabOrders[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        elabOrders[i].AdmissionNo = admdata.AdmissionNo;
                        elabOrders[i].FacilityID = admdata.FacilityID;
                        elabOrders[i].ProviderId = admdata.AdmittingPhysician;
                        elabOrders[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    }

                    if (visitdata != null)
                    {
                        elabOrders[i].visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        elabOrders[i].FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        elabOrders[i].ProviderId = visitdata.ProviderID;
                        elabOrders[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    }
                }
            }

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabOrders.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                    else
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in elabOrders
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = elabOrders;
            }

            return labOrderCollection;
        }

        ///// <summary>
        ///// Get E Lab Orders for Home page grid
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersforHomeGrid()
        {
            List<eLabOrderModel> OrderCollection = new List<eLabOrderModel>();

            var eLabOrderRecords = this.GetAllELabOrders();

            if (eLabOrderRecords.Count() > 0)
            {
                var OrderFromVisits = eLabOrderRecords.Where(x => x.VisitID > 0).ToList();

                var OrderNumbersfromVisit = OrderFromVisits.Select(x => x.LabOrderNo).Distinct().ToList();

                foreach (var record in OrderNumbersfromVisit)
                {
                    eLabOrderModel orderModel = new eLabOrderModel();

                    orderModel = OrderFromVisits.Where(x => x.LabOrderNo.ToLower().Trim() == record.ToLower().Trim()).FirstOrDefault();

                    if (!OrderCollection.Contains(orderModel))
                    {
                        OrderCollection.Add(orderModel);
                    }
                }

                var OrderFromAdmissions = eLabOrderRecords.Where(x => x.AdmissionID > 0).ToList();

                var OrderNumbersfromAdmission = OrderFromAdmissions.Select(x => x.LabOrderNo).Distinct().ToList();

                foreach (var set in OrderNumbersfromAdmission)
                {
                    eLabOrderModel orderModel = new eLabOrderModel();

                    orderModel = OrderFromAdmissions.Where(x => x.LabOrderNo.ToLower().Trim() == set.ToLower().Trim()).FirstOrDefault();

                    if (!OrderCollection.Contains(orderModel))
                    {
                        OrderCollection.Add(orderModel);
                    }
                }
            }

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (OrderCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labOrderCollection = (from lab in OrderCollection
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                    else
                    {
                        labOrderCollection = (from lab in OrderCollection
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in OrderCollection
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = OrderCollection;
            }

            return labOrderCollection.OrderBy(x => x.LabOrderNo).ToList();
        }

        ///// <summary>
        ///// Get E Lab Order by Id
        ///// </summary>
        ///// <param>int LabOrderId</param>
        ///// <returns>List<eLabOrderModel>. if Record of eLab Order for given Id = success. else = failure</returns>
        public eLabOrderModel GetELabOrderbyID(int LabOrderId)
        {
            int patId = 0;

            var elabOrderRecord = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderID == LabOrderId)

                                   select new
                                   {
                                       elabOrder.LabOrderID,
                                       elabOrder.LabOrderNo,
                                       elabOrder.AdmissionID,
                                       elabOrder.VisitID,
                                       elabOrder.LabPhysician,
                                       elabOrder.LabOrderStatus,
                                       elabOrder.RequestedFrom,
                                       elabOrder.SignOff,
                                       elabOrder.SignOffBy,
                                       elabOrder.SignOffDate,
                                       elabOrder.Createddate

                                   }).AsEnumerable().Select(eLOM => new eLabOrderModel
                                   {
                                       LabOrderID = eLOM.LabOrderID,
                                       LabOrderNo = eLOM.LabOrderNo,
                                       AdmissionID = eLOM.AdmissionID,
                                       VisitID = eLOM.VisitID,
                                       LabPhysician = eLOM.LabPhysician,
                                       LabOrderStatus = eLOM.LabOrderStatus,
                                       RequestedFrom = eLOM.RequestedFrom,
                                       SignOff = eLOM.SignOff,
                                       SignOffBy = eLOM.SignOffBy,
                                       SignOffDate = eLOM.SignOffDate,
                                       Createddate = eLOM.Createddate,
                                       labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                                   }).FirstOrDefault();

            if (elabOrderRecord != null)
            {

                if (elabOrderRecord.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderRecord.AdmissionID).PatientID;
                }
                else if (elabOrderRecord.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderRecord.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == elabOrderRecord.LabPhysician);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderRecord.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderRecord.AdmissionID);

                elabOrderRecord.patientId = patId;
                elabOrderRecord.patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                elabOrderRecord.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;
                elabOrderRecord.labOrderStatusReport = this.GetELabOrderStatusRecord(elabOrderRecord.LabOrderID);

                if (admdata != null)
                {
                    elabOrderRecord.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    elabOrderRecord.AdmissionNo = admdata.AdmissionNo;
                    elabOrderRecord.FacilityID = admdata.FacilityID;
                    elabOrderRecord.ProviderId = admdata.AdmittingPhysician;
                    elabOrderRecord.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                }

                if (visitdata != null)
                {
                    elabOrderRecord.visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    elabOrderRecord.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    elabOrderRecord.ProviderId = visitdata.ProviderID;
                    elabOrderRecord.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }
            }

            return elabOrderRecord;
        }

        ///// <summary>
        ///// Get e Lab Orders for admission
        ///// </summary>
        ///// <param>int admissionId, int patientId</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order for given admissionId and patientId = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersforAdmission(int admissionId, int patientId)
        {
            var elabOrders = (from elaborder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false & x.AdmissionID == admissionId)

                              join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                              on elaborder.AdmissionID equals adm.AdmissionID

                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                              on adm.PatientID equals pat.PatientId

                              join prov in this.uow.GenericRepository<Provider>().Table()
                              on elaborder.LabPhysician equals prov.ProviderID

                              select new
                              {
                                  elaborder.LabOrderID,
                                  elaborder.LabOrderNo,
                                  elaborder.AdmissionID,
                                  elaborder.VisitID,
                                  elaborder.LabPhysician,
                                  elaborder.LabOrderStatus,
                                  elaborder.RequestedFrom,
                                  elaborder.SignOff,
                                  elaborder.SignOffBy,
                                  elaborder.SignOffDate,
                                  elaborder.Createddate,
                                  adm.AdmissionDateTime,
                                  adm.FacilityID,
                                  adm.AdmittingPhysician,
                                  adm.AdmissionNo,
                                  pat.PatientId,
                                  patName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                  providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

                              }).AsEnumerable().Select(eLOM => new eLabOrderModel
                              {
                                  LabOrderID = eLOM.LabOrderID,
                                  LabOrderNo = eLOM.LabOrderNo,
                                  AdmissionID = eLOM.AdmissionID,
                                  FacilityID = eLOM.FacilityID,
                                  ProviderId = eLOM.AdmittingPhysician,
                                  facilityName = eLOM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLOM.FacilityID).FacilityName : "",
                                  VisitID = eLOM.VisitID,
                                  LabPhysician = eLOM.LabPhysician,
                                  LabOrderStatus = eLOM.LabOrderStatus,
                                  RequestedFrom = eLOM.RequestedFrom,
                                  SignOff = eLOM.SignOff,
                                  SignOffBy = eLOM.SignOffBy,
                                  SignOffDate = eLOM.SignOffDate,
                                  Createddate = eLOM.Createddate,
                                  AdmissionDateandTime = eLOM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + eLOM.AdmissionDateTime.TimeOfDay.ToString(),
                                  patientId = eLOM.PatientId,
                                  patientName = eLOM.patName,
                                  AdmissionNo = eLOM.AdmissionNo,
                                  physicianName = eLOM.providerName,
                                  labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                              }).ToList();

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabOrders.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                    else
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in elabOrders
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = elabOrders;
            }

            return labOrderCollection;
        }

        ///// <summary>
        ///// Get e Lab Orders for visit
        ///// </summary>
        ///// <param>int visitId, int patientId</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order for given visitId and patientId = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersforVisit(int visitId, int patientId)
        {
            var elabOrders = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false & x.VisitID == visitId)

                              join visit in this.uow.GenericRepository<PatientVisit>().Table()
                              on elabOrder.VisitID equals visit.VisitId

                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                              on visit.PatientId equals pat.PatientId

                              join prov in this.uow.GenericRepository<Provider>().Table()
                              on elabOrder.LabPhysician equals prov.ProviderID

                              select new
                              {
                                  elabOrder.LabOrderID,
                                  elabOrder.LabOrderNo,
                                  elabOrder.AdmissionID,
                                  elabOrder.VisitID,
                                  elabOrder.LabPhysician,
                                  elabOrder.LabOrderStatus,
                                  elabOrder.RequestedFrom,
                                  elabOrder.SignOff,
                                  elabOrder.SignOffBy,
                                  elabOrder.SignOffDate,
                                  elabOrder.Createddate,
                                  visit.VisitDate,
                                  visit.FacilityID,
                                  visit.ProviderID,
                                  pat.PatientId,
                                  patName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                  providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

                              }).AsEnumerable().Select(eLOM => new eLabOrderModel
                              {
                                  LabOrderID = eLOM.LabOrderID,
                                  LabOrderNo = eLOM.LabOrderNo,
                                  AdmissionID = eLOM.AdmissionID,
                                  VisitID = eLOM.VisitID,
                                  ProviderId = eLOM.ProviderID,
                                  FacilityID = eLOM.FacilityID > 0 ? eLOM.FacilityID.Value : 0,
                                  facilityName = eLOM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLOM.FacilityID).FacilityName : "",
                                  LabPhysician = eLOM.LabPhysician,
                                  LabOrderStatus = eLOM.LabOrderStatus,
                                  RequestedFrom = eLOM.RequestedFrom,
                                  SignOff = eLOM.SignOff,
                                  SignOffBy = eLOM.SignOffBy,
                                  SignOffDate = eLOM.SignOffDate,
                                  Createddate = eLOM.Createddate,
                                  visitDateandTime = eLOM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + eLOM.VisitDate.TimeOfDay.ToString(),
                                  patientId = eLOM.PatientId,
                                  patientName = eLOM.patName,
                                  physicianName = eLOM.providerName,
                                  labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                              }).ToList();

            List<eLabOrderModel> labOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabOrders.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join fac in facList on lab.FacilityID equals fac.FacilityId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                    else
                    {
                        labOrderCollection = (from lab in elabOrders
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on lab.ProviderId equals prov.ProviderID
                                              select lab).ToList();
                    }
                }
                else
                {
                    labOrderCollection = (from lab in elabOrders
                                          join fac in facList on lab.FacilityID equals fac.FacilityId
                                          select lab).ToList();
                }
            }
            else
            {
                labOrderCollection = elabOrders;
            }

            return labOrderCollection;
        }

        ///// <summary>
        ///// Get e Lab Orders for orderNo
        ///// </summary>
        ///// <param>string orderNo</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order for given orderNo = success. else = failure</returns>
        public eLabOrderModel GetELabOrderforOrderNo(string orderNo)
        {
            int patId = 0;

            var elabOrderData = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false & x.LabOrderNo.ToLower().Trim() == orderNo.ToLower().Trim())

                                 select new
                                 {
                                     elabOrder.LabOrderID,
                                     elabOrder.LabOrderNo,
                                     elabOrder.AdmissionID,
                                     elabOrder.VisitID,
                                     elabOrder.LabPhysician,
                                     elabOrder.LabOrderStatus,
                                     elabOrder.RequestedFrom,
                                     elabOrder.SignOff,
                                     elabOrder.SignOffBy,
                                     elabOrder.SignOffDate,
                                     elabOrder.Createddate

                                 }).AsEnumerable().Select(eLOM => new eLabOrderModel
                                 {
                                     LabOrderID = eLOM.LabOrderID,
                                     LabOrderNo = eLOM.LabOrderNo,
                                     AdmissionID = eLOM.AdmissionID,
                                     VisitID = eLOM.VisitID,
                                     LabPhysician = eLOM.LabPhysician,
                                     LabOrderStatus = eLOM.LabOrderStatus,
                                     RequestedFrom = eLOM.RequestedFrom,
                                     SignOff = eLOM.SignOff,
                                     SignOffBy = eLOM.SignOffBy,
                                     SignOffDate = eLOM.SignOffDate,
                                     Createddate = eLOM.Createddate,
                                     labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                                 }).FirstOrDefault();

            if (elabOrderData != null)
            {

                if (elabOrderData.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderData.AdmissionID).PatientID;
                }
                else if (elabOrderData.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderData.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == elabOrderData.LabPhysician);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderData.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderData.AdmissionID);

                elabOrderData.patientId = patId;
                elabOrderData.patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                elabOrderData.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                if (admdata != null)
                {
                    elabOrderData.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    elabOrderData.AdmissionNo = admdata.AdmissionNo;
                    elabOrderData.FacilityID = admdata.FacilityID;
                    elabOrderData.ProviderId = admdata.AdmittingPhysician;
                    elabOrderData.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                }

                if (visitdata != null)
                {
                    elabOrderData.visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    elabOrderData.VisitNo = visitdata.VisitNo;
                    elabOrderData.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    elabOrderData.ProviderId = visitdata.ProviderID;
                    elabOrderData.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }
            }

            return elabOrderData;
        }

        ///// <summary>
        ///// Get e Lab Order Items for eLabOrderId
        ///// </summary>
        ///// <param>int labOrderId</param>
        ///// <returns>List<eLabOrderItemsModel>. if Records of eLab Order for given labOrderId = success. else = failure</returns>
        public List<eLabOrderItemsModel> GetELabOrderItems(int labOrderId)
        {
            var labOrderItems = (from item in this.uow.GenericRepository<eLabOrderItems>().Table().Where(x => x.LabOrderID == labOrderId)

                                 join setup in this.uow.GenericRepository<eLabSetupMaster>().Table()
                                 on item.SetupMasterID equals setup.SetupMasterID

                                 join urg in this.uow.GenericRepository<UrgencyType>().Table()
                                 on item.UrgencyCode equals urg.UrgencyTypeCode

                                 select new
                                 {
                                     item.LabOrderItemsID,
                                     item.LabOrderID,
                                     item.UrgencyCode,
                                     item.LabOnDate,
                                     item.LabNotes,
                                     item.Value,
                                     item.SetupMasterID,
                                     setup.LabMasterID,
                                     setup.LabSubMasterID,
                                     urg.UrgencyTypeDescription

                                 }).AsEnumerable().OrderBy(x => x.LabOrderItemsID).Select(eLOI => new eLabOrderItemsModel
                                 {
                                     LabOrderItemsID = eLOI.LabOrderItemsID,
                                     LabOrderID = eLOI.LabOrderID,
                                     SetupMasterID = eLOI.SetupMasterID,
                                     setupMasterDesc = eLOI.SetupMasterID > 0 ?
                                                    (this.GetELabSetupMasterRecordbyID(eLOI.SetupMasterID) != null ?
                                                    this.GetELabSetupMasterRecordbyID(eLOI.SetupMasterID).setupMasterDesc : "") : "",
                                     masterTestName = eLOI.LabMasterID > 0 ? this.GetELabMasterRecord(eLOI.LabMasterID).LabMasterDesc : "",
                                     subMasterTestName = eLOI.LabSubMasterID > 0 ? this.GetELabSubMasterRecord(eLOI.LabSubMasterID.Value).LabSubMasterDesc : "",
                                     NormalRange = eLOI.LabSubMasterID > 0 ? this.uow.GenericRepository<eLabSubMaster>().Table().FirstOrDefault(x => x.LabSubMasterID == eLOI.LabSubMasterID.Value).NormalRange :
                                                    (eLOI.LabMasterID > 0 ? this.uow.GenericRepository<eLabMaster>().Table().FirstOrDefault(x => x.LabMasterID == eLOI.LabMasterID).NormalRange : ""),
                                     Value = eLOI.Value,
                                     UrgencyCode = eLOI.UrgencyCode,
                                     LabOnDate = eLOI.LabOnDate,
                                     LabNotes = eLOI.LabNotes,
                                     urgencyDescription = eLOI.UrgencyTypeDescription

                                 }).ToList();

            var record = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderID == labOrderId).FirstOrDefault();

            if (labOrderItems.Count() > 0)
            {
                for (int i = 0; i < labOrderItems.Count(); i++)
                {
                    if (record.VisitID > 0)
                    {
                        labOrderItems[i].patientId = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == record.VisitID).FirstOrDefault().PatientId;
                    }

                    if (record.AdmissionID > 0)
                    {
                        labOrderItems[i].patientId = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == record.AdmissionID).FirstOrDefault().PatientID;
                    }
                }
            }

            return labOrderItems;
        }

        ///// <summary>
        ///// Cancel e Lab Orders for orderNo
        ///// </summary>
        ///// <param>string orderNo</param>
        ///// <returns>eLabOrder. if Record of eLab Order for given orderNo is cancelled = success. else = failure</returns>
        public eLabOrder CancelLabOrder(string orderNo)
        {
            var elabOrder = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderNo.ToLower().Trim() == orderNo.ToLower().Trim()).FirstOrDefault();

            if (elabOrder != null)
            {
                //elabOrder.IsActive = false;
                elabOrder.LabOrderStatus = "Cancelled";

                this.uow.GenericRepository<eLabOrder>().Update(elabOrder);
                this.uow.Save();
            }

            return elabOrder;
        }

        ///// <summary>
        ///// Delete e Lab Orders for orderNo
        ///// </summary>
        ///// <param>string orderNo</param>
        ///// <returns>eLabOrder. if Record of eLab Order for given orderNo is Deleted = success. else = failure</returns>
        public eLabOrder DeleteLabOrderbyId(int labOrderId)
        {
            var elabOrder = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderID == labOrderId).FirstOrDefault();

            if (elabOrder != null)
            {
                elabOrder.IsActive = false;
                elabOrder.LabOrderStatus = "Cancelled";

                this.uow.GenericRepository<eLabOrder>().Update(elabOrder);
                this.uow.Save();
            }

            return elabOrder;
        }

        #endregion

        #region e Lab Request

        ///// <summary>
        ///// Get e Lab Requests for patient
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<eLabRequestModel>. if Records of eLab Request for given visitId = success. else = failure</returns>
        public List<eLabRequestModel> GetELabRequestsforPatient(int patientId)
        {
            int patId = 0;

            var elabRequests = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().
                                Where(x => x.IsActive != false & x.LabOrderStatus.ToLower().Trim() == "requested")

                                select new
                                {
                                    eLabReq.LabRequestID,
                                    eLabReq.AdmissionID,
                                    eLabReq.VisitID,
                                    eLabReq.RequestedDate,
                                    eLabReq.RequestedBy,
                                    eLabReq.LabOrderStatus

                                }).AsEnumerable().Select(eLRM => new eLabRequestModel
                                {
                                    LabRequestID = eLRM.LabRequestID,
                                    AdmissionID = eLRM.AdmissionID,
                                    VisitID = eLRM.VisitID,
                                    RequestedDate = eLRM.RequestedDate,
                                    RequestedBy = eLRM.RequestedBy,
                                    LabOrderStatus = eLRM.LabOrderStatus,
                                    labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                                }).ToList();

            if (elabRequests.Count() > 0)
            {
                for (int i = 0; i < elabRequests.Count(); i++)
                {
                    if (elabRequests[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequests[i].AdmissionID).PatientID;
                    }
                    else if (elabRequests[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequests[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequests[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequests[i].AdmissionID);

                    elabRequests[i].patientId = patId;
                    elabRequests[i].patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;

                    if (admdata != null)
                    {
                        elabRequests[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        elabRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                        elabRequests[i].FacilityId = admdata.FacilityID;
                        elabRequests[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                        elabRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                    }

                    if (visitdata != null)
                    {
                        elabRequests[i].visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        elabRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                        elabRequests[i].FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        elabRequests[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                        elabRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                    }
                }
            }

            List<eLabRequestModel> labRequestCollection = new List<eLabRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labRequestCollection = (from lab in elabRequests
                                                join fac in facList on lab.FacilityId equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on lab.providerId equals prov.ProviderID
                                                select lab).ToList();
                    }
                    else
                    {
                        labRequestCollection = (from lab in elabRequests
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on lab.providerId equals prov.ProviderID
                                                select lab).ToList();
                    }
                }
                else
                {
                    labRequestCollection = (from lab in elabRequests
                                            join fac in facList on lab.FacilityId equals fac.FacilityId
                                            select lab).ToList();
                }
            }
            else
            {
                labRequestCollection = elabRequests;
            }

            return labRequestCollection.Where(x => x.patientId == patientId).ToList();
        }

        ///// <summary>
        ///// Get All e Lab Requests
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<eLabRequestModel>. if Records of eLab Request = success. else = failure</returns>
        public List<eLabRequestModel> GetAllELabRequests()
        {
            int patId = 0;

            var elabRequests = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().
                                Where(x => x.IsActive != false & x.LabOrderStatus.ToLower().Trim() == "requested")

                                select new
                                {
                                    eLabReq.LabRequestID,
                                    eLabReq.AdmissionID,
                                    eLabReq.VisitID,
                                    eLabReq.RequestedDate,
                                    eLabReq.RequestedBy,
                                    eLabReq.LabOrderStatus

                                }).AsEnumerable().Select(eLRM => new eLabRequestModel
                                {
                                    LabRequestID = eLRM.LabRequestID,
                                    AdmissionID = eLRM.AdmissionID,
                                    VisitID = eLRM.VisitID,
                                    RequestedDate = eLRM.RequestedDate,
                                    RequestedBy = eLRM.RequestedBy,
                                    LabOrderStatus = eLRM.LabOrderStatus,
                                    labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                                }).ToList();

            if (elabRequests.Count() > 0)
            {
                for (int i = 0; i < elabRequests.Count(); i++)
                {
                    if (elabRequests[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequests[i].AdmissionID).PatientID;
                    }
                    else if (elabRequests[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequests[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequests[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequests[i].AdmissionID);

                    elabRequests[i].patientId = patId;
                    elabRequests[i].patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;

                    if (admdata != null)
                    {
                        elabRequests[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        elabRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                        elabRequests[i].FacilityId = admdata.FacilityID;
                        elabRequests[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                        elabRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                    }

                    if (visitdata != null)
                    {
                        elabRequests[i].visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        elabRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                        elabRequests[i].FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        elabRequests[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                        elabRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                    }
                }
            }


            List<eLabRequestModel> labRequestCollection = new List<eLabRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (elabRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        labRequestCollection = (from lab in elabRequests
                                                join fac in facList on lab.FacilityId equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on lab.providerId equals prov.ProviderID
                                                select lab).ToList();
                    }
                    else
                    {
                        labRequestCollection = (from lab in elabRequests
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on lab.providerId equals prov.ProviderID
                                                select lab).ToList();
                    }
                }
                else
                {
                    labRequestCollection = (from lab in elabRequests
                                            join fac in facList on lab.FacilityId equals fac.FacilityId
                                            select lab).ToList();
                }
            }
            else
            {
                labRequestCollection = elabRequests;
            }

            return labRequestCollection;
        }

        ///// <summary>
        ///// Get e Lab Requests by Id
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request for given Id = success. else = failure</returns>
        public eLabRequestModel GetELabRequestbyId(int labRequestId)
        {
            int patId = 0;

            var elabRequest = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.LabRequestID == labRequestId)

                               select new
                               {
                                   eLabReq.LabRequestID,
                                   eLabReq.AdmissionID,
                                   eLabReq.VisitID,
                                   eLabReq.RequestedDate,
                                   eLabReq.RequestedBy,
                                   eLabReq.LabOrderStatus

                               }).AsEnumerable().Select(eLRM => new eLabRequestModel
                               {
                                   LabRequestID = eLRM.LabRequestID,
                                   AdmissionID = eLRM.AdmissionID,
                                   VisitID = eLRM.VisitID,
                                   RequestedDate = eLRM.RequestedDate,
                                   RequestedBy = eLRM.RequestedBy,
                                   LabOrderStatus = eLRM.LabOrderStatus,
                                   labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                               }).FirstOrDefault();

            if (elabRequest != null)
            {
                if (elabRequest.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequest.AdmissionID).PatientID;
                }
                else if (elabRequest.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequest.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabRequest.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabRequest.AdmissionID);

                elabRequest.patientId = patId;
                elabRequest.patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;

                if (admdata != null)
                {
                    elabRequest.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    elabRequest.providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                    elabRequest.FacilityId = admdata.FacilityID;
                    elabRequest.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    elabRequest.RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                }

                if (visitdata != null)
                {
                    elabRequest.visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    elabRequest.providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                    elabRequest.FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    elabRequest.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    elabRequest.RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                }
            }

            return elabRequest;
        }

        ///// <summary>
        ///// Get e Lab Request Items by Request Id
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>List<eLabRequestItemsModel>. if Records of eLab Request Items for given Id = success. else = failure</returns>
        public List<eLabRequestItemsModel> GetELabRequestItems(int labRequestId)
        {
            var requestItems = (from item in this.uow.GenericRepository<eLabRequestItems>().Table().Where(x => x.LabRequestID == labRequestId)

                                join urg in this.uow.GenericRepository<UrgencyType>().Table()
                                on item.UrgencyCode equals urg.UrgencyTypeCode

                                select new
                                {
                                    item.LabRequestItemsID,
                                    item.LabRequestID,
                                    item.SetupMasterID,
                                    item.UrgencyCode,
                                    item.LabOnDate,
                                    item.LabNotes,
                                    urg.UrgencyTypeDescription

                                }).AsEnumerable().OrderBy(x => x.LabRequestItemsID).Select(eLRI => new eLabRequestItemsModel
                                {
                                    LabRequestItemsID = eLRI.LabRequestItemsID,
                                    LabRequestID = eLRI.LabRequestID,
                                    SetupMasterID = eLRI.SetupMasterID,
                                    setupMasterDesc = eLRI.SetupMasterID > 0 ?
                                                    (this.GetELabSetupMasterRecordbyID(eLRI.SetupMasterID) != null ?
                                                    this.GetELabSetupMasterRecordbyID(eLRI.SetupMasterID).setupMasterDesc : "") : "",
                                    UrgencyCode = eLRI.UrgencyCode,
                                    LabOnDate = eLRI.LabOnDate,
                                    LabNotes = eLRI.LabNotes,
                                    urgencyDescription = eLRI.UrgencyTypeDescription

                                }).ToList();

            return requestItems;
        }

        ///// <summary>
        ///// Confirm the e-Lab Request to e-Lab Order
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>eLabRequest. if Record of eLab Request confirmed = success. else = failure</returns>
        public eLabRequest ConfirmRequest(int labRequestId)
        {
            var elabRequest = this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.LabRequestID == labRequestId).FirstOrDefault();

            if (elabRequest != null)
            {
                elabRequest.LabOrderStatus = "Confirmed";

                this.uow.GenericRepository<eLabRequest>().Update(elabRequest);
                this.uow.Save();
            }

            return elabRequest;
        }

        ///// <summary>
        ///// Cancel the e-Lab Request
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>eLabRequest. if Record of eLab Request cancelled = success. else = failure</returns>
        public eLabRequest CancelELabRequest(int labRequestId)
        {
            var elabRequest = this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.LabRequestID == labRequestId).FirstOrDefault();

            if (elabRequest != null)
            {
                elabRequest.LabOrderStatus = "Cancelled";

                this.uow.GenericRepository<eLabRequest>().Update(elabRequest);
                this.uow.Save();
            }

            return elabRequest;
        }

        ///// <summary>
        ///// Verifying whether the user is valid or not
        ///// </summary>
        ///// <param>(string userName, string Password)</param>
        ///// <returns>string. if string value = success. else = failure</returns>
        public string UserVerification(string userName, string Password)
        {
            string status = "";

            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = userName;
            signOffModel.Password = Password;

            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                status = this.utilService.UserCheck(signOffModel).Result.status;
            }
            else
            {
                status = "Please fill both UserName and Password to Verify the User";
            }
            return status;
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

        #region Mail and SMS

        ///// <summary>
        ///// Send mail
        ///// </summary>
        ///// <param>(string eMailId, int labOrderId)</param>
        ///// <returns>MessageModel. if filepath = success. else = failure</returns>
        public MessageModel SendMail(string eMailId, int labOrderId)
        {
            MessageModel message = new MessageModel();
            var labDetails = this.GetAllELabOrders().FirstOrDefault(x => x.LabOrderID == labOrderId);
            message.To = eMailId;
            message.Subject = "Lab Order Detail - " + labDetails.LabOrderNo.Trim();
            message.Content = "Dear <b>" + labDetails.patientName + " (" + this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == labDetails.patientId).MRNo.Trim() + ")</b>,<br /><br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your ELab order details for LabOrder# : <b>" + labDetails.LabOrderNo.Trim() + "</b> is shown below:" + "<br /><br /> " + this.GetMailBodyforElabOrder(labOrderId);
            this.utilService.SendEmail(message);

            return message;
        }

        ///// <summary>
        ///// Get mail body
        ///// </summary>
        ///// <param>(int labOrderId)</param>
        ///// <returns>string. if filepath = success. else = failure</returns>
        public string GetMailBodyforElabOrder(int labOrderId)
        {
            var labOrderRecord = this.GetELabOrderbyID(labOrderId);

            string MailBody = "<u><b>ELab Order : Status Report</b></u><br />";

            MailBody += "<table border='0'>";
            MailBody += "<tr><td>Visit / Admission Date</td><td> : "
                        + (labOrderRecord.VisitID > 0 ? this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == labOrderRecord.VisitID).VisitDate : this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == labOrderRecord.AdmissionID).AdmissionDateTime)
                        + "</td><td><b> || </b>Requesting Physician </td><td> : " + labOrderRecord.physicianName + "</td></tr>";
            MailBody += "<tr><td>Requested Date </td><td> : " + labOrderRecord.Createddate + "</td><td><b> || </b>Report Status </td><td> : " + labOrderRecord.labOrderStatusReport.ReportStatus + "</td></tr>";
            MailBody += "</td><td>Report Date </td><td> : " + labOrderRecord.labOrderStatusReport.ReportDate + "</td><td><b> || </b>Approved By </td><td> : " + labOrderRecord.labOrderStatusReport.ApprovedbyPhysician + "</td></tr>";
            MailBody += "</table><br/>";

            if (labOrderRecord.labOrderItems.Count() > 0)
            {
                MailBody += "<u><i>Lab Order Test Details:</i></u><br /><br />";
                MailBody += "<table border='1'>";
                MailBody += "<tr><th>S.No</th><th>Test Name</th><th>Sub Name</th><th>Urgency</th><th>On Date</th><th>Notes</th><th>Value</th><th>Range</th></tr>";
                int Serialno = 1;

                foreach (var Detail in labOrderRecord.labOrderItems)
                {
                    MailBody += "<tr><td> " + Serialno +
                        " </td><td> " + Detail.masterTestName +
                        " </td><td> " + Detail.subMasterTestName +
                        " </td><td> " + Detail.urgencyDescription +
                        " </td><td> " + Detail.LabOnDate +
                        " </td><td> " + Detail.LabNotes +
                        " </td><td> " + Detail.Value +
                        " </td><td> " + Detail.NormalRange + "</td></tr>";
                    Serialno++;

                }
                MailBody += "</table><br/><br/>";
            }
            MailBody += "This is an automated email from ENT Portal. Click <a href=" + "http://ent.eblucare.com/" + ">HERE</a> to login and review this report.<br />";
            MailBody += "Powered By BMS.<br /><br /><br />";

            return MailBody;
        }

        #endregion

    }
}
