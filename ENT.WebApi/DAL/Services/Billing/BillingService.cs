using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Services
{
    public class BillingService : IBillingService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;

        public BillingService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data 

        ///// <summary>
        ///// Get All Departments name
        ///// </summary>
        ///// <param>searchKey</param>
        ///// <returns>List<Departments>. if Collection of Departments = success. else = failure</returns>
        public List<Departments> GetDepartmentList(string searchKey)
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
        ///// Get Departments name from Billing Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Departments>. if Collection of Departments from Billing Master for given searchkey = success. else = failure</returns>
        public List<Departments> GetDepartmentsfromMaster(string searchKey)
        {
            List<Departments> departments = new List<Departments>();

            var departIDs = this.uow.GenericRepository<BillingMaster>().Table().Select(x => x.DepartmentID).Distinct().ToList();

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
                            select depts).Take(10).ToList();

            return deptList;
        }

        ///// <summary>
        ///// Get Billing Master Status List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingMasterStatus>. if Collection of Billing Master Status = success. else = failure</returns>
        public List<BillingMasterStatus> GetAllBillingStatuses()
        {
            var billingStatusList = this.iTenantMasterService.GetBillingStatusList();

            return billingStatusList;
        }

        ///// <summary>
        ///// Get Receipt number for Visit Payment 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> List<string>. if Receipt number = success. else = failure</returns>
        public List<string> GetReceiptNumberforBilling()
        {
            List<string> receipts = new List<string>();

            var RcptNo = this.iTenantMasterService.GetReceiptNo();

            receipts.Add(RcptNo);

            return receipts;
        }

        ///// <summary>
        ///// Get Bill number for Visit Payment
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> List<string>. if Bill number = success. else = failure</returns>
        public List<string> GetBillNumberforBilling()
        {
            List<string> bills = new List<string>();

            var billNo = this.iTenantMasterService.GetBillNo();

            bills.Add(billNo);

            return bills;
        }

        //// <summary>
        ///// Get Payment Types for Billing
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PaymentType>. if Collection of PaymentType = success. else = failure</returns>
        public List<PaymentType> GetPaymentTypeListforBilling()
        {
            var paymentTypes = this.iTenantMasterService.GetAllPaymentTypes();

            return paymentTypes;
        }

        #endregion

        #region Billing Master

        ///// <summary>
        ///// Get billing types which are allowed for sub master
        ///// </summary>
        ///// <param>int departmentID, string searchKey</param>
        ///// <returns>List<BillingMasterModel>. if billing master allowed for Submaster = success. else = failure</returns>
        public List<BillingMasterModel> GetSubMasterallowedBillingTypes(int departmentID, string searchKey)
        {
            List<BillingMasterModel> submasterallowedbillingList = new List<BillingMasterModel>();
            if (searchKey != null && searchKey != "")
            {
                submasterallowedbillingList = this.GetMasterBillingTypes(departmentID, null).
                                                Where(x => x.AllowSubMaster == true &
                                                        (x.BillingTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || x.MasterBillingType.ToLower().Trim().Contains(searchKey.ToLower().Trim()))).ToList();
            }
            else
            {
                submasterallowedbillingList = this.GetMasterBillingTypes(departmentID, null).
                                                Where(x => x.AllowSubMaster == true).ToList();
            }

            return submasterallowedbillingList;
        }

        ///// <summary>
        ///// Get All billing types by department ID,
        ///// </summary>
        ///// <param>int departmentID</param>
        ///// <returns>List<BillingMasterModel>. if All billing types for given department ID = success. else = failure</returns>
        public List<BillingMasterModel> GetMasterBillingTypes(int departmentID, string searchKey)
        {
            var masterbillingList = (from bill in this.uow.GenericRepository<BillingMaster>().Table().Where(x => x.IsActive != false & x.DepartmentID == departmentID)
                                     join depart in this.uow.GenericRepository<Departments>().Table()
                                     on bill.DepartmentID equals depart.DepartmentID

                                     where (searchKey == null ||
                                     (bill.MasterBillingType.ToLower().Trim().Contains(searchKey.ToLower().Trim()) ||
                                     bill.BillingTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                                     select new
                                     {
                                         depart.DepartmentDesc,
                                         bill.BillingMasterID,
                                         bill.DepartmentID,
                                         bill.MasterBillingType,
                                         bill.BillingTypeDesc,
                                         bill.Status,
                                         bill.OrderNo,
                                         bill.AllowSubMaster

                                     }).AsEnumerable().Select(BMM => new BillingMasterModel
                                     {
                                         DepartmentName = BMM.DepartmentDesc,
                                         BillingMasterID = BMM.BillingMasterID,
                                         DepartmentID = BMM.DepartmentID,
                                         MasterBillingType = BMM.MasterBillingType,
                                         BillingTypeDesc = BMM.BillingTypeDesc,
                                         Status = BMM.Status,
                                         OrderNo = BMM.OrderNo,
                                         AllowSubMaster = BMM.AllowSubMaster,
                                         Description = BMM.MasterBillingType + " " + BMM.BillingTypeDesc

                                     }).ToList();

            return masterbillingList;
        }

        ///// <summary>
        ///// Add or Update Billing Master data
        ///// </summary>
        ///// <param>BillingMasterModel billingMasterModel</param>
        ///// <returns>BillingMasterModel. if Billing Master data added = success. else = failure</returns>
        public BillingMasterModel AddUpdateBillingMasterData(BillingMasterModel billingMasterModel)
        {
            var billMaster = this.uow.GenericRepository<BillingMaster>().Table().Where(x => x.DepartmentID == billingMasterModel.DepartmentID &
                                            x.MasterBillingType == billingMasterModel.MasterBillingType).FirstOrDefault();

            if (billMaster == null)
            {
                billMaster = new BillingMaster();

                billMaster.DepartmentID = billingMasterModel.DepartmentID == 0 ? 1 : billingMasterModel.DepartmentID;
                billMaster.MasterBillingType = billingMasterModel.MasterBillingType;
                billMaster.BillingTypeDesc = billingMasterModel.BillingTypeDesc;
                billMaster.Status = billingMasterModel.Status;
                billMaster.OrderNo = billingMasterModel.OrderNo;
                billMaster.AllowSubMaster = billingMasterModel.AllowSubMaster;
                billMaster.IsActive = true;
                billMaster.Createddate = DateTime.Now;
                billMaster.CreatedBy = "User";

                this.uow.GenericRepository<BillingMaster>().Insert(billMaster);
            }
            else
            {
                billMaster.DepartmentID = billingMasterModel.DepartmentID == 0 ? 1 : billingMasterModel.DepartmentID;
                billMaster.MasterBillingType = billingMasterModel.MasterBillingType;
                billMaster.BillingTypeDesc = billingMasterModel.BillingTypeDesc;
                billMaster.Status = billingMasterModel.Status;
                billMaster.OrderNo = billingMasterModel.OrderNo;
                billMaster.AllowSubMaster = billingMasterModel.AllowSubMaster;
                billMaster.IsActive = true;
                billMaster.ModifiedDate = DateTime.Now;
                billMaster.ModifiedBy = "User";

                this.uow.GenericRepository<BillingMaster>().Update(billMaster);
            }
            this.uow.Save();
            billingMasterModel.BillingMasterID = billMaster.BillingMasterID;

            return billingMasterModel;
        }

        ///// <summary>
        ///// Get All Billing Master Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingMasterModel>. if Billing Master data List = success. else = failure</returns>
        public List<BillingMasterModel> GetBillingMasterList()
        {
            var billingMasterList = (from bill in this.uow.GenericRepository<BillingMaster>().Table().Where(x => x.IsActive != false)
                                     join depart in this.uow.GenericRepository<Departments>().Table()
                                     on bill.DepartmentID equals depart.DepartmentID

                                     select new
                                     {
                                         depart.DepartmentDesc,
                                         bill.BillingMasterID,
                                         bill.DepartmentID,
                                         bill.MasterBillingType,
                                         bill.BillingTypeDesc,
                                         bill.Status,
                                         bill.OrderNo,
                                         bill.AllowSubMaster

                                     }).AsEnumerable().Select(BMM => new BillingMasterModel
                                     {
                                         DepartmentName = BMM.DepartmentDesc,
                                         BillingMasterID = BMM.BillingMasterID,
                                         DepartmentID = BMM.DepartmentID,
                                         MasterBillingType = BMM.MasterBillingType,
                                         BillingTypeDesc = BMM.BillingTypeDesc,
                                         Status = BMM.Status,
                                         OrderNo = BMM.OrderNo,
                                         AllowSubMaster = BMM.AllowSubMaster,
                                         Description = BMM.MasterBillingType + " " + BMM.BillingTypeDesc

                                     }).ToList();

            return billingMasterList;
        }

        ///// <summary>
        ///// Get Billing Master Record by ID
        ///// </summary>
        ///// <param>int billingMasterID</param>
        ///// <returns>BillingMasterModel. if Billing Master data Record for Given ID = success. else = failure</returns>
        public BillingMasterModel GetBillingMasterRecordbyID(int billingMasterID)
        {
            var billingMasterRecord = (from bill in this.uow.GenericRepository<BillingMaster>().Table().Where(x => x.BillingMasterID == billingMasterID)
                                       join depart in this.uow.GenericRepository<Departments>().Table()
                                       on bill.DepartmentID equals depart.DepartmentID

                                       select new
                                       {
                                           depart.DepartmentDesc,
                                           bill.BillingMasterID,
                                           bill.DepartmentID,
                                           bill.MasterBillingType,
                                           bill.BillingTypeDesc,
                                           bill.Status,
                                           bill.OrderNo,
                                           bill.AllowSubMaster

                                       }).AsEnumerable().Select(BMM => new BillingMasterModel
                                       {
                                           DepartmentName = BMM.DepartmentDesc,
                                           BillingMasterID = BMM.BillingMasterID,
                                           DepartmentID = BMM.DepartmentID,
                                           MasterBillingType = BMM.MasterBillingType,
                                           BillingTypeDesc = BMM.BillingTypeDesc,
                                           Status = BMM.Status,
                                           OrderNo = BMM.OrderNo,
                                           AllowSubMaster = BMM.AllowSubMaster,
                                           Description = BMM.MasterBillingType + " " + BMM.BillingTypeDesc

                                       }).SingleOrDefault();

            return billingMasterRecord;
        }

        ///// <summary>
        ///// Delete Billing Master Record by ID
        ///// </summary>
        ///// <param>int billingMasterID</param>
        ///// <returns>BillingMaster. if Billing Master data Record for Given ID is Deleted = success. else = failure</returns>
        public BillingMaster DeleteBillingMasterRecord(int billingMasterID)
        {
            var billMaster = this.uow.GenericRepository<BillingMaster>().Table().Where(x => x.BillingMasterID == billingMasterID).SingleOrDefault();

            if (billMaster != null)
            {
                billMaster.IsActive = false;

                this.uow.GenericRepository<BillingMaster>().Update(billMaster);
                this.uow.Save();
            }

            return billMaster;
        }

        #endregion

        #region Billing Sub Master

        ///// <summary>
        ///// Add or Update Billing Sub Master data
        ///// </summary>
        ///// <param>BillingSubMasterModel billingsubMasterModel</param>
        ///// <returns>BillingSubMasterModel. if Billing SubMaster data added = success. else = failure</returns>
        public BillingSubMasterModel AddUpdateBillingSubMasterData(BillingSubMasterModel billingsubMasterModel)
        {
            var subMaster = this.uow.GenericRepository<BillingSubMaster>().Table().Where(x => x.DepartmentID == billingsubMasterModel.DepartmentID &
                                            x.MasterBillingType == billingsubMasterModel.MasterBillingType & x.SubMasterBillingType == billingsubMasterModel.SubMasterBillingType).FirstOrDefault();

            if (subMaster == null)
            {
                subMaster = new BillingSubMaster();

                subMaster.DepartmentID = billingsubMasterModel.DepartmentID;
                subMaster.MasterBillingType = billingsubMasterModel.MasterBillingType;
                subMaster.SubMasterBillingType = billingsubMasterModel.SubMasterBillingType;
                subMaster.SubMasterBillingTypeDesc = billingsubMasterModel.SubMasterBillingTypeDesc;
                subMaster.Status = billingsubMasterModel.Status;
                subMaster.OrderNo = billingsubMasterModel.OrderNo;
                subMaster.IsActive = true;
                subMaster.Createddate = DateTime.Now;
                subMaster.CreatedBy = "User";

                this.uow.GenericRepository<BillingSubMaster>().Insert(subMaster);
            }
            else
            {
                //subMaster.SubMasterBillingType = billingsubMasterModel.SubMasterBillingType;
                subMaster.SubMasterBillingTypeDesc = billingsubMasterModel.SubMasterBillingTypeDesc;
                subMaster.Status = billingsubMasterModel.Status;
                subMaster.OrderNo = billingsubMasterModel.OrderNo;
                subMaster.IsActive = true;
                subMaster.ModifiedDate = DateTime.Now;
                subMaster.ModifiedBy = "User";

                this.uow.GenericRepository<BillingSubMaster>().Update(subMaster);
            }
            this.uow.Save();

            billingsubMasterModel.BillingSubMasterID = subMaster.BillingSubMasterID;

            return billingsubMasterModel;
        }

        ///// <summary>
        ///// Get All Billing Sub Master Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingSubMasterModel>. if Billing SubMaster data List = success. else = failure</returns>
        public List<BillingSubMasterModel> GetBillingSubMasterList()
        {
            var billingSubMasterList = (from bill in this.uow.GenericRepository<BillingSubMaster>().Table().Where(x => x.IsActive != false)
                                        join depart in this.uow.GenericRepository<Departments>().Table()
                                        on bill.DepartmentID equals depart.DepartmentID

                                        join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                        on bill.MasterBillingType equals billMaster.BillingMasterID

                                        select new
                                        {
                                            depart.DepartmentDesc,
                                            bill.BillingSubMasterID,
                                            bill.DepartmentID,
                                            bill.MasterBillingType,
                                            bill.SubMasterBillingType,
                                            bill.SubMasterBillingTypeDesc,
                                            bill.Status,
                                            bill.OrderNo,
                                            masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                        }).AsEnumerable().Select(BMM => new BillingSubMasterModel
                                        {
                                            DepartmentName = BMM.DepartmentDesc,
                                            BillingSubMasterID = BMM.BillingSubMasterID,
                                            DepartmentID = BMM.DepartmentID,
                                            MasterBillingType = BMM.MasterBillingType,
                                            SubMasterBillingType = BMM.SubMasterBillingType,
                                            SubMasterBillingTypeDesc = BMM.SubMasterBillingTypeDesc,
                                            Status = BMM.Status,
                                            OrderNo = BMM.OrderNo,
                                            MasterBillingTypeName = BMM.masterBillingTypeName

                                        }).ToList();

            return billingSubMasterList;
        }

        ///// <summary>
        ///// Get Billing SubMaster Record by ID
        ///// </summary>
        ///// <param>int billingSubMasterID</param>
        ///// <returns>BillingSubMasterModel. if Billing Sub Master data Record for Given ID = success. else = failure</returns>
        public BillingSubMasterModel GetBillingSubMasterRecordbyID(int billingSubMasterID)
        {
            var billingSubMasterRecord = (from bill in this.uow.GenericRepository<BillingSubMaster>().Table().Where(x => x.BillingSubMasterID == billingSubMasterID)
                                          join depart in this.uow.GenericRepository<Departments>().Table()
                                          on bill.DepartmentID equals depart.DepartmentID

                                          join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                          on bill.MasterBillingType equals billMaster.BillingMasterID

                                          select new
                                          {
                                              depart.DepartmentDesc,
                                              bill.BillingSubMasterID,
                                              bill.DepartmentID,
                                              bill.MasterBillingType,
                                              bill.SubMasterBillingType,
                                              bill.SubMasterBillingTypeDesc,
                                              bill.Status,
                                              bill.OrderNo,
                                              masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                          }).AsEnumerable().Select(BMM => new BillingSubMasterModel
                                          {
                                              DepartmentName = BMM.DepartmentDesc,
                                              BillingSubMasterID = BMM.BillingSubMasterID,
                                              DepartmentID = BMM.DepartmentID,
                                              MasterBillingType = BMM.MasterBillingType,
                                              SubMasterBillingType = BMM.SubMasterBillingType,
                                              SubMasterBillingTypeDesc = BMM.SubMasterBillingTypeDesc,
                                              Status = BMM.Status,
                                              OrderNo = BMM.OrderNo,
                                              MasterBillingTypeName = BMM.masterBillingTypeName

                                          }).SingleOrDefault();

            return billingSubMasterRecord;
        }

        ///// <summary>
        ///// Get Billing SubMaster Records by Billing Master ID
        ///// </summary>
        ///// <param>int billingMasterID</param>
        ///// <returns>BillingSubMasterModel. if Billing Sub Master data Record for Given ID = success. else = failure</returns>
        public List<string> GetSubMasterBillingTypesforMasterBillingType(int masterBillingID, string searchKey)
        {
            List<string> subMasterbillTypes = new List<string>();
            var billingSubMasters = this.uow.GenericRepository<BillingSubMaster>().Table().
                                    Where(x => x.MasterBillingType == masterBillingID &
                                        (x.SubMasterBillingTypeDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()) |
                                            x.SubMasterBillingType.ToLower().Trim().Contains(searchKey.ToLower().Trim()))).ToList();

            if (billingSubMasters.Count() > 0)
            {
                foreach (var submaster in billingSubMasters)
                {
                    string value = "";

                    value = submaster.SubMasterBillingType != null ? submaster.SubMasterBillingType : "";
                    if (!subMasterbillTypes.Contains(value))
                    {
                        subMasterbillTypes.Add(value);
                    }
                }
            }
            return subMasterbillTypes;
        }

        ///// <summary>
        ///// Delete Billing Sub Master Record by ID
        ///// </summary>
        ///// <param>int billingSubMasterID</param>
        ///// <returns>BillingSubMaster. if Billing Sub Master data Record for Given ID is Deleted = success. else = failure</returns>
        public BillingSubMaster DeleteBillingSubMasterRecord(int billingSubMasterID)
        {
            var billSubMaster = this.uow.GenericRepository<BillingSubMaster>().Table().Where(x => x.BillingSubMasterID == billingSubMasterID).SingleOrDefault();

            if (billSubMaster != null)
            {
                billSubMaster.IsActive = false;

                this.uow.GenericRepository<BillingSubMaster>().Update(billSubMaster);
                this.uow.Save();
            }

            return billSubMaster;
        }

        #endregion

        #region Billing Setup Master

        ///// <summary>
        ///// Add or Update Billing Setup Master data
        ///// </summary>
        ///// <param>BillingSetupMasterModel billingSetupMasterModel</param>
        ///// <returns>BillingSetupMasterModel. if Billing setup Master data added = success. else = failure</returns>
        public BillingSetupMasterModel AddUpdateBillingSetupMasterData(BillingSetupMasterModel billingSetupMasterModel)
        {
            var setupMaster = this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.DepartmentID == billingSetupMasterModel.DepartmentID
                                & x.MasterBillingType == billingSetupMasterModel.MasterBillingType & x.SubMasterBillingType == billingSetupMasterModel.SubMasterBillingType).FirstOrDefault();

            if (setupMaster == null)
            {
                setupMaster = new BillingSetupMaster();

                setupMaster.DepartmentID = billingSetupMasterModel.DepartmentID;
                setupMaster.MasterBillingType = billingSetupMasterModel.MasterBillingType;
                setupMaster.SubMasterBillingType = billingSetupMasterModel.SubMasterBillingType;
                setupMaster.Status = billingSetupMasterModel.Status;
                setupMaster.OrderNo = billingSetupMasterModel.OrderNo;
                setupMaster.AcceptedPaymentMode = billingSetupMasterModel.AcceptedPaymentMode;
                setupMaster.AllowDiscount = billingSetupMasterModel.AllowDiscount;
                setupMaster.AllowPartialPayment = billingSetupMasterModel.AllowPartialPayment;
                setupMaster.UserTypeBilling = billingSetupMasterModel.UserTypeBilling;
                setupMaster.UserType = billingSetupMasterModel.UserType;
                setupMaster.Charges = billingSetupMasterModel.Charges;
                setupMaster.IsActive = true;
                setupMaster.CreatedBy = "User";
                setupMaster.Createddate = DateTime.Now;

                this.uow.GenericRepository<BillingSetupMaster>().Insert(setupMaster);
            }
            else
            {
                setupMaster.Status = billingSetupMasterModel.Status;
                setupMaster.OrderNo = billingSetupMasterModel.OrderNo;
                setupMaster.AcceptedPaymentMode = billingSetupMasterModel.AcceptedPaymentMode;
                setupMaster.AllowDiscount = billingSetupMasterModel.AllowDiscount;
                setupMaster.AllowPartialPayment = billingSetupMasterModel.AllowPartialPayment;
                setupMaster.UserTypeBilling = billingSetupMasterModel.UserTypeBilling;
                setupMaster.UserType = billingSetupMasterModel.UserType;
                setupMaster.Charges = billingSetupMasterModel.Charges;
                setupMaster.IsActive = true;
                setupMaster.ModifiedBy = "User";
                setupMaster.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<BillingSetupMaster>().Update(setupMaster);
            }
            this.uow.Save();
            billingSetupMasterModel.SetupMasterID = setupMaster.SetupMasterID;

            return billingSetupMasterModel;
        }

        ///// <summary>
        ///// Get All Billing SetUp Master Data 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingSetupMasterModel>. if Collection of Billing SetUp Master data = success. else = failure </returns>
        public List<BillingSetupMasterModel> GetAllSetupMasterData()
        {
            var setupMasterCollection = (from setup in this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.IsActive != false)

                                         join depart in this.uow.GenericRepository<Departments>().Table()
                                        on setup.DepartmentID equals depart.DepartmentID

                                         join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                         on setup.MasterBillingType equals billMaster.BillingMasterID

                                         select new
                                         {
                                             depart.DepartmentDesc,
                                             setup.SetupMasterID,
                                             setup.DepartmentID,
                                             setup.MasterBillingType,
                                             setup.SubMasterBillingType,
                                             setup.AcceptedPaymentMode,
                                             setup.AllowDiscount,
                                             setup.AllowPartialPayment,
                                             setup.Status,
                                             setup.OrderNo,
                                             setup.UserTypeBilling,
                                             setup.UserType,
                                             setup.Charges,
                                             masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                         }).AsEnumerable().Select(BSM => new BillingSetupMasterModel
                                         {
                                             SetupMasterID = BSM.SetupMasterID,
                                             DepartmentID = BSM.DepartmentID,
                                             DepartmentName = BSM.DepartmentDesc,
                                             MasterBillingType = BSM.MasterBillingType,
                                             MasterBillingTypeName = BSM.masterBillingTypeName,
                                             SubMasterBillingType = BSM.SubMasterBillingType,
                                             AcceptedPaymentMode = BSM.AcceptedPaymentMode,
                                             AllowDiscount = BSM.AllowDiscount,
                                             AllowPartialPayment = BSM.AllowPartialPayment,
                                             Status = BSM.Status,
                                             OrderNo = BSM.OrderNo,
                                             UserTypeBilling = BSM.UserTypeBilling,
                                             UserType = BSM.UserType,
                                             Charges = BSM.Charges,

                                         }).ToList();

            return setupMasterCollection;
        }

        ///// <summary>
        ///// Get Billing SetUp Master Record by ID
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>BillingSetupMasterModel. if Record of Billing SetUp Master for Given ID = success. else = failure </returns>
        public BillingSetupMasterModel GetSetupMasterRecordbyID(int setupMasterID)
        {
            var setupMasterRecord = (from setup in this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.SetupMasterID == setupMasterID)

                                     join depart in this.uow.GenericRepository<Departments>().Table()
                                     on setup.DepartmentID equals depart.DepartmentID

                                     join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                     on setup.MasterBillingType equals billMaster.BillingMasterID

                                     select new
                                     {
                                         depart.DepartmentDesc,
                                         setup.SetupMasterID,
                                         setup.DepartmentID,
                                         setup.MasterBillingType,
                                         setup.SubMasterBillingType,
                                         setup.AcceptedPaymentMode,
                                         setup.AllowDiscount,
                                         setup.AllowPartialPayment,
                                         setup.Status,
                                         setup.OrderNo,
                                         setup.UserTypeBilling,
                                         setup.UserType,
                                         setup.Charges,
                                         masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                     }).AsEnumerable().Select(BSM => new BillingSetupMasterModel
                                     {
                                         SetupMasterID = BSM.SetupMasterID,
                                         DepartmentID = BSM.DepartmentID,
                                         DepartmentName = BSM.DepartmentDesc,
                                         MasterBillingType = BSM.MasterBillingType,
                                         MasterBillingTypeName = BSM.masterBillingTypeName,
                                         SubMasterBillingType = BSM.SubMasterBillingType,
                                         AcceptedPaymentMode = BSM.AcceptedPaymentMode,
                                         AllowDiscount = BSM.AllowDiscount,
                                         AllowPartialPayment = BSM.AllowPartialPayment,
                                         Status = BSM.Status,
                                         OrderNo = BSM.OrderNo,
                                         UserTypeBilling = BSM.UserTypeBilling,
                                         UserType = BSM.UserType,
                                         Charges = BSM.Charges,

                                     }).SingleOrDefault();

            return setupMasterRecord;
        }

        ///// <summary>
        ///// Delete Billing Setup Master Record by ID
        ///// </summary>
        ///// <param>int setupMasterID</param>
        ///// <returns>BillingSetupMaster. if Billing setup Master data Record for Given ID is Deleted = success. else = failure</returns>
        public BillingSetupMaster DeleteSetUpMasterRecord(int setupMasterID)
        {
            var billsetUpMaster = this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.SetupMasterID == setupMasterID).SingleOrDefault();

            if (billsetUpMaster != null)
            {
                billsetUpMaster.IsActive = false;

                this.uow.GenericRepository<BillingSetupMaster>().Update(billsetUpMaster);
                this.uow.Save();
            }

            return billsetUpMaster;
        }

        #endregion

        #region Billing payment 

        #region Common payment Grid List

        ///// <summary>
        ///// Get both Admission and Visit Payments 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CommonPaymentModel>. if Admission and Visit payments = success. else = failure</returns>
        public List<CommonPaymentModel> GetAllPaymentList()
        {
            List<CommonPaymentModel> paymentList = new List<CommonPaymentModel>();

            var admPaymentCollection = this.GetAdmissionPaymentList();

            var visPaymentCollection = this.GetVisitPaymentList();

            if (admPaymentCollection.Count() > 0)
            {
                foreach (var record in admPaymentCollection)
                {
                    if (!paymentList.Contains(record))
                    {
                        paymentList.Add(record);
                    }
                }
            }

            if (visPaymentCollection.Count() > 0)
            {
                foreach (var data in visPaymentCollection)
                {
                    if (!paymentList.Contains(data))
                    {
                        paymentList.Add(data);
                    }
                }
            }

            return paymentList;
        }

        ///// <summary>
        ///// Get All AdmissionPayments 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CommonPaymentModel>. if All Admission payments = success. else = failure</returns>
        public List<CommonPaymentModel> GetAdmissionPaymentList()
        {
            var admissionPayments = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.IsActive != false)

                                     join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                     on admissionPay.AdmissionID equals admsn.AdmissionID

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on admsn.PatientID equals pat.PatientId

                                     select new
                                     {
                                         admissionPay.AdmissionPaymentID,
                                         admissionPay.AdmissionID,
                                         admissionPay.ReceiptNo,
                                         admissionPay.ReceiptDate,
                                         admissionPay.BillNo,
                                         admissionPay.MiscAmount,
                                         admissionPay.DiscountPercentage,
                                         admissionPay.DiscountAmount,
                                         admissionPay.GrandTotal,
                                         admissionPay.NetAmount,
                                         admissionPay.PaidAmount,
                                         admissionPay.PaymentMode,
                                         admissionPay.Notes,
                                         admissionPay.Createddate,
                                         admissionPay.CreatedBy,
                                         admsn.AdmissionDateTime,
                                         admsn.FacilityID,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         pat.PrimaryContactNumber,
                                         pat.MRNo

                                     }).AsEnumerable().Select(CPM => new CommonPaymentModel
                                     {
                                         AdmissionPaymentID = CPM.AdmissionPaymentID,
                                         AdmissionID = CPM.AdmissionID,
                                         FacilityId = CPM.FacilityID,
                                         facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                         ReceiptNo = CPM.ReceiptNo,
                                         ReceiptDate = CPM.ReceiptDate,
                                         BillNo = CPM.BillNo,
                                         MiscAmount = CPM.MiscAmount,
                                         DiscountPercentage = CPM.DiscountPercentage,
                                         DiscountAmount = CPM.DiscountAmount,
                                         GrandTotal = CPM.GrandTotal,
                                         NetAmount = CPM.NetAmount,
                                         PaidAmount = CPM.PaidAmount,
                                         PaymentMode = CPM.PaymentMode,
                                         Notes = CPM.Notes,
                                         PatientId = CPM.PatientId,
                                         PatientName = CPM.PatientFirstName + " " + CPM.PatientMiddleName + " " + CPM.PatientLastName,
                                         PatientContactNumber = CPM.PrimaryContactNumber,
                                         MRNumber = CPM.MRNo,
                                         CreatedDate = CPM.Createddate,
                                         CreatedBy = CPM.CreatedBy,
                                         AdmissionDateandTime = CPM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + CPM.AdmissionDateTime.TimeOfDay.ToString(),
                                         paymentDetailsList = this.GetAdmissionPaymentDetails(CPM.AdmissionPaymentID)

                                     }).ToList();

            List<CommonPaymentModel> commonPaymentCollection = new List<CommonPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentCollection = (from admPay in admissionPayments
                                                   join fac in facList on admPay.FacilityId equals fac.FacilityId
                                                   join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                   on admPay.AdmissionID equals adm.AdmissionID
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on adm.AdmittingPhysician equals prov.ProviderID
                                                   select admPay).ToList();
                    }
                    else
                    {
                        commonPaymentCollection = (from admPay in admissionPayments
                                                   join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                   on admPay.AdmissionID equals adm.AdmissionID
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on adm.AdmittingPhysician equals prov.ProviderID
                                                   select admPay).ToList();
                    }
                }
                else
                {
                    commonPaymentCollection = (from admPay in admissionPayments
                                               join fac in facList on admPay.FacilityId equals fac.FacilityId
                                               select admPay).ToList();
                }
            }
            else
            {
                commonPaymentCollection = admissionPayments;
            }

            return commonPaymentCollection;
        }

        ///// <summary>
        ///// Get All Admission Payment Detail for admissionPaymentId
        ///// </summary>
        ///// <param>int admissionPaymentId</param>
        ///// <returns>List<AdmissionPaymentDetailsModel>. if All admission payment Detail for given admissionPaymentId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetAdmissionPaymentDetails(int admissionPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false & x.AdmissionPaymentID == admissionPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.AdmissionPaymentID,
                                      detail.AdmissionPaymentDetailsID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      AdmissionPaymentID = CPDM.AdmissionPaymentID,
                                      AdmissionPaymentDetailsID = CPDM.AdmissionPaymentDetailsID,
                                      SetupMasterID = CPDM.SetupMasterID,
                                      Charges = CPDM.Charges,
                                      DepartmentId = CPDM.DepartmentID,
                                      DepartmentName = CPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(CPDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        ///// <summary>
        ///// Get All VisitPayments 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitPaymentModel>. if All visit payments = success. else = failure</returns>
        public List<CommonPaymentModel> GetVisitPaymentList()
        {
            var visitPayments = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.IsActive != false)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on visitPay.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     visitPay.VisitPaymentID,
                                     visitPay.VisitID,
                                     visitPay.ReceiptNo,
                                     visitPay.ReceiptDate,
                                     visitPay.BillNo,
                                     visitPay.MiscAmount,
                                     visitPay.DiscountPercentage,
                                     visitPay.DiscountAmount,
                                     visitPay.GrandTotal,
                                     visitPay.NetAmount,
                                     visitPay.PaidAmount,
                                     visitPay.PaymentMode,
                                     visitPay.Notes,
                                     visit.VisitDate,
                                     visit.FacilityID,
                                     visit.CreatedDate,
                                     visit.Createdby,
                                     pat.PatientId,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo

                                 }).AsEnumerable().Select(CPM => new CommonPaymentModel
                                 {
                                     VisitPaymentID = CPM.VisitPaymentID,
                                     VisitID = CPM.VisitID,
                                     FacilityId = CPM.FacilityID > 0 ? CPM.FacilityID.Value : 0,
                                     facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                     ReceiptNo = CPM.ReceiptNo,
                                     ReceiptDate = CPM.ReceiptDate,
                                     BillNo = CPM.BillNo,
                                     MiscAmount = CPM.MiscAmount,
                                     DiscountPercentage = CPM.DiscountPercentage,
                                     DiscountAmount = CPM.DiscountAmount,
                                     GrandTotal = CPM.GrandTotal,
                                     NetAmount = CPM.NetAmount,
                                     PaidAmount = CPM.PaidAmount,
                                     PaymentMode = CPM.PaymentMode,
                                     Notes = CPM.Notes,
                                     PatientId = CPM.PatientId,
                                     PatientName = CPM.PatientFirstName + " " + CPM.PatientMiddleName + " " + CPM.PatientLastName,
                                     PatientContactNumber = CPM.PrimaryContactNumber,
                                     MRNumber = CPM.MRNo,
                                     CreatedDate = CPM.CreatedDate,
                                     CreatedBy = CPM.Createdby,
                                     VisitDateandTime = CPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CPM.VisitDate.TimeOfDay.ToString(),
                                     paymentDetailsList = this.GetVisitPaymentDetails(CPM.VisitPaymentID)

                                 }).ToList();

            List<CommonPaymentModel> commonPaymentCollection = new List<CommonPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentCollection = (from visPay in visitPayments
                                                   join fac in facList on visPay.FacilityId equals fac.FacilityId
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on visPay.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select visPay).ToList();
                    }
                    else
                    {
                        commonPaymentCollection = (from visPay in visitPayments
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on visPay.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select visPay).ToList();
                    }
                }
                else
                {
                    commonPaymentCollection = (from visPay in visitPayments
                                               join fac in facList on visPay.FacilityId equals fac.FacilityId
                                               select visPay).ToList();
                }
            }
            else
            {
                commonPaymentCollection = visitPayments;
            }

            return commonPaymentCollection;
        }

        ///// <summary>
        ///// Get Visit Payment Details for visitPayment Id
        ///// </summary>
        ///// <param>int visitPaymentId</param>
        ///// <returns>List<VisitPaymentDetailsModel>. if All visit payment Detail for given visitPaymentId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetVisitPaymentDetails(int visitPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false & x.VisitPaymentID == visitPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.VisitPaymentID,
                                      detail.VisitPaymentDetailsID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      VisitPaymentID = CPDM.VisitPaymentID,
                                      VisitPaymentDetailsID = CPDM.VisitPaymentDetailsID,
                                      SetupMasterID = CPDM.SetupMasterID,
                                      Charges = CPDM.Charges,
                                      DepartmentId = CPDM.DepartmentID,
                                      DepartmentName = CPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(CPDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        ///// <summary>
        ///// Delete Admission Payment Record by payment Id
        ///// </summary>
        ///// <param>int admissionPaymentId</param>
        ///// <returns>AdmissionPayment. if admission payment record is deleted given admissionPaymentId = success. else = failure</returns>
        public AdmissionPayment DeleteAdmissionPaymentRecord(int admissionPaymentId)
        {
            var admPayment = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == admissionPaymentId).FirstOrDefault();

            if (admPayment != null)
            {
                admPayment.IsActive = false;

                this.uow.GenericRepository<AdmissionPayment>().Update(admPayment);

                var admPaymentDetails = this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false & x.AdmissionPaymentID == admissionPaymentId).ToList();

                if (admPaymentDetails.Count() > 0)
                {
                    foreach (var data in admPaymentDetails)
                    {
                        data.IsActive = false;

                        this.uow.GenericRepository<AdmissionPaymentDetails>().Update(data);
                    }
                }

                this.uow.Save();
            }

            return admPayment;
        }

        ///// <summary>
        ///// Delete Visit Payment Record by payment Id
        ///// </summary>
        ///// <param>int visitPaymentId</param>
        ///// <returns>VisitPayment. if visit payment record is deleted given visitPaymentId = success. else = failure</returns>
        public VisitPayment DeleteVisitPaymentRecord(int visitPaymentId)
        {
            var visPayment = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == visitPaymentId).FirstOrDefault();

            if (visPayment != null)
            {
                visPayment.IsActive = false;

                this.uow.GenericRepository<VisitPayment>().Update(visPayment);

                var visPaymentDetails = this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false & x.VisitPaymentID == visitPaymentId).ToList();

                if (visPaymentDetails.Count() > 0)
                {
                    foreach (var set in visPaymentDetails)
                    {
                        set.IsActive = false;

                        this.uow.GenericRepository<VisitPaymentDetails>().Update(set);
                    }
                }

                this.uow.Save();
            }

            return visPayment;
        }

        #endregion

        ///// <summary>
        ///// Get Billing particulars from Billing Sub Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingSetupMasterModel>. if Collection of Departments from Billing Master = success. else = failure</returns>
        public List<BillingSetupMasterModel> GetbillingParticulars(int departmentID, string searchKey)
        {
            List<BillingSetupMasterModel> billSetupCollection = new List<BillingSetupMasterModel>();

            var setupMasterCollection = (from setup in this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.DepartmentID == departmentID & x.IsActive != false)

                                         join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                         on setup.MasterBillingType equals billMaster.BillingMasterID

                                         select new
                                         {
                                             setup.SetupMasterID,
                                             setup.MasterBillingType,
                                             subBillingType = (setup.SubMasterBillingType == null || setup.SubMasterBillingType == "") ? "None" : setup.SubMasterBillingType,
                                             setup.Charges,
                                             masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                         }).AsEnumerable().Select(BSM => new BillingSetupMasterModel
                                         {
                                             SetupMasterID = BSM.SetupMasterID,
                                             MasterBillingType = BSM.MasterBillingType,
                                             MasterBillingTypeName = BSM.masterBillingTypeName,
                                             SubMasterBillingType = BSM.subBillingType,
                                             Charges = BSM.Charges,
                                             billingparticularName = BSM.masterBillingTypeName + " - " + BSM.subBillingType

                                         }).ToList();

            billSetupCollection = (from set in setupMasterCollection
                                   where (searchKey == null ||
                                   (set.MasterBillingTypeName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                   || set.SubMasterBillingType.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                   || set.billingparticularName.ToLower().Trim().Contains(searchKey.ToLower().Trim())))
                                   select set).ToList();

            return billSetupCollection;
        }

        #region Patient - Billing Payment

        ///// <summary>
        ///// Get Patients for Billing Payment Search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForBillingandPaymentSearch(string searchKey)
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
        ///// Get Patient Record By Id
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>PatientDemographicModel. if Patient Data for given PatientId = success. else = failure</returns>
        public PatientDemographicModel GetPatientRecordById(int PatientId)
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

            var payments = this.GetAllPaymentParticularsforPatient(PatientId);

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

        #region Visit Payment - Billing Payment

        ///// <summary>
        ///// Add or update a visit payment
        ///// </summary>
        ///// <param>VisitPaymentModel paymentModel(paymentModel--> object of VisitPaymentModel)</param>
        ///// <returns>VisitPaymentModel. if visit payment after insertion and updation = success. else = failure</returns>
        public VisitPaymentModel AddUpdateVisitPaymentfromBilling(VisitPaymentModel paymentModel)
        {
            var visitPayment = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.ReceiptNo.ToLower().Trim() == paymentModel.ReceiptNo.ToLower().Trim()).FirstOrDefault();

            var getRCPTCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "recno"
                                 select common).FirstOrDefault();

            var rcptCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var admsnrcptCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "bilno"
                                 select common).FirstOrDefault();

            var billCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var admsnbillCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (visitPayment == null)
            {
                visitPayment = new VisitPayment();

                visitPayment.VisitID = paymentModel.VisitID;
                visitPayment.ReceiptNo = rcptCheck != null ? paymentModel.ReceiptNo : (admsnrcptCheck != null ? paymentModel.ReceiptNo : getRCPTCommon.CommonMasterDesc);
                visitPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                visitPayment.BillNo = billCheck != null ? paymentModel.BillNo : (admsnbillCheck != null ? paymentModel.BillNo : getBILLCommon.CommonMasterDesc);
                visitPayment.MiscAmount = paymentModel.MiscAmount;
                visitPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                visitPayment.DiscountAmount = paymentModel.DiscountAmount;
                visitPayment.GrandTotal = paymentModel.GrandTotal;
                visitPayment.NetAmount = paymentModel.NetAmount;
                visitPayment.PaidAmount = paymentModel.PaidAmount;
                visitPayment.PaymentMode = paymentModel.PaymentMode;
                visitPayment.Notes = paymentModel.Notes;
                visitPayment.IsActive = true;
                visitPayment.Createddate = DateTime.Now;
                visitPayment.CreatedBy = "User";

                this.uow.GenericRepository<VisitPayment>().Insert(visitPayment);

                this.uow.Save();

                getRCPTCommon.CurrentIncNo = visitPayment.ReceiptNo;
                this.uow.GenericRepository<CommonMaster>().Update(getRCPTCommon);

                getBILLCommon.CurrentIncNo = visitPayment.BillNo;
                this.uow.GenericRepository<CommonMaster>().Update(getBILLCommon);
                this.uow.Save();
            }
            else
            {
                visitPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                visitPayment.MiscAmount = paymentModel.MiscAmount;
                visitPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                visitPayment.DiscountAmount = paymentModel.DiscountAmount;
                visitPayment.GrandTotal = paymentModel.GrandTotal;
                visitPayment.NetAmount = paymentModel.NetAmount;
                visitPayment.PaidAmount = paymentModel.PaidAmount;
                visitPayment.PaymentMode = paymentModel.PaymentMode;
                visitPayment.Notes = paymentModel.Notes;
                visitPayment.IsActive = true;
                visitPayment.ModifiedDate = DateTime.Now;
                visitPayment.ModifiedBy = "User";

                this.uow.GenericRepository<VisitPayment>().Update(visitPayment);
                this.uow.Save();
            }
            paymentModel.VisitPaymentID = visitPayment.VisitPaymentID;

            if (visitPayment.VisitPaymentID > 0)
            {
                if (paymentModel.paymentDetailsItem.Count() > 0)
                {
                    var paymentDetails = this.uow.GenericRepository<VisitPaymentDetails>().Table()
                                        .Where(x => x.VisitPaymentID == visitPayment.VisitPaymentID).ToList();

                    if (paymentDetails.Count() > 0)
                    {
                        foreach (var item in paymentDetails)
                        {
                            this.uow.GenericRepository<VisitPaymentDetails>().Delete(item);
                        }
                        this.uow.Save();

                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            VisitPaymentDetails paymentItem = new VisitPaymentDetails();

                            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    else
                    {
                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            VisitPaymentDetails paymentItem = new VisitPaymentDetails();

                            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    this.uow.Save();
                }

                //if (paymentModel.paymentDetailsItem.Count() > 0)
                //{
                //    VisitPaymentDetails paymentItem = new VisitPaymentDetails();
                //    foreach (var detail in paymentModel.paymentDetailsItem)
                //    {
                //        paymentItem = this.uow.GenericRepository<VisitPaymentDetails>().Table().FirstOrDefault(x => x.VisitPaymentDetailsID == detail.VisitPaymentDetailsID);
                //        if (paymentItem == null)
                //        {
                //            paymentItem = new VisitPaymentDetails();

                //            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.Createddate = DateTime.Now;
                //            paymentItem.CreatedBy = "User";

                //            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                //        }
                //        else
                //        {
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.ModifiedDate = DateTime.Now;
                //            paymentItem.ModifiedBy = "User";

                //            this.uow.GenericRepository<VisitPaymentDetails>().Update(paymentItem);
                //        }
                //        this.uow.Save();
                //        detail.VisitPaymentDetailsID = paymentItem.VisitPaymentDetailsID;
                //    }
                //}
            }

            return paymentModel;
        }

        ///// <summary>
        ///// Get Payment record by visitId
        ///// </summary>
        ///// <param>int visitId</param>
        ///// <returns>VisitPaymentModel. if payment record for given visitId = success. else = failure</returns>
        public VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId)
        {
            var visitPaymentRecord = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == visitPaymentId & x.IsActive != false)

                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on visitPay.VisitID equals visit.VisitId

                                      join pat in this.uow.GenericRepository<Patient>().Table()
                                      on visit.PatientId equals pat.PatientId

                                      select new
                                      {
                                          visitPay.VisitPaymentID,
                                          visitPay.VisitID,
                                          visitPay.ReceiptNo,
                                          visitPay.ReceiptDate,
                                          visitPay.BillNo,
                                          visitPay.MiscAmount,
                                          visitPay.DiscountPercentage,
                                          visitPay.DiscountAmount,
                                          visitPay.GrandTotal,
                                          visitPay.NetAmount,
                                          visitPay.PaidAmount,
                                          visitPay.PaymentMode,
                                          visitPay.Notes,
                                          visit.VisitDate,
                                          visit.FacilityID,
                                          pat.PatientId,
                                          pat.PatientFirstName,
                                          pat.PatientMiddleName,
                                          pat.PatientLastName,
                                          pat.PrimaryContactNumber,
                                          pat.MRNo

                                      }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                      {
                                          VisitPaymentID = VPM.VisitPaymentID,
                                          VisitID = VPM.VisitID,
                                          FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                          facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                          ReceiptNo = VPM.ReceiptNo,
                                          ReceiptDate = VPM.ReceiptDate,
                                          BillNo = VPM.BillNo,
                                          MiscAmount = VPM.MiscAmount,
                                          DiscountPercentage = VPM.DiscountPercentage,
                                          DiscountAmount = VPM.DiscountAmount,
                                          GrandTotal = VPM.GrandTotal,
                                          NetAmount = VPM.NetAmount,
                                          PaidAmount = VPM.PaidAmount,
                                          PaymentMode = VPM.PaymentMode,
                                          Notes = VPM.Notes,
                                          PatientId = VPM.PatientId,
                                          PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                          PatientContactNumber = VPM.PrimaryContactNumber,
                                          MRNumber = VPM.MRNo,
                                          VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                          paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                      }).FirstOrDefault();

            return visitPaymentRecord;
        }

        ///// <summary>
        ///// Get Visit Payment Details for visitPayment Id
        ///// </summary>
        ///// <param>int visitPaymentId</param>
        ///// <returns>List<VisitPaymentDetailsModel>. if All visit payment Detail for given visitPaymentId = success. else = failure</returns>
        public List<VisitPaymentDetailsModel> GetVisitPaymentDetailsbyID(int visitPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false & x.VisitPaymentID == visitPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.VisitPaymentDetailsID,
                                      detail.VisitPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(VPDM => new VisitPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = VPDM.VisitPaymentDetailsID,
                                      VisitPaymentID = VPDM.VisitPaymentID,
                                      SetupMasterID = VPDM.SetupMasterID,
                                      Charges = VPDM.Charges,
                                      DepartmentId = VPDM.DepartmentID,
                                      DepartmentName = VPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(VPDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        #endregion

        #region Admission Payment - Billing Payment

        ///// <summary>
        ///// Add or update a admission payment
        ///// </summary>
        ///// <param>AdmissionPaymentModel paymentModel(paymentModel--> object of AdmissionPaymentModel)</param>
        ///// <returns>AdmissionPaymentModel. if admission payment after insertion and updation = success. else = failure</returns>
        public AdmissionPaymentModel AddUpdateAdmissionPaymentfromBilling(AdmissionPaymentModel paymentModel)
        {
            var admissionPayment = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.ReceiptNo.ToLower().Trim() == paymentModel.ReceiptNo.ToLower().Trim()).FirstOrDefault();

            var getRCPTCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "recno"
                                 select common).FirstOrDefault();

            var visitrcptCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var rcptCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "bilno"
                                 select common).FirstOrDefault();

            var visitbillCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var billCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (admissionPayment == null)
            {
                admissionPayment = new AdmissionPayment();

                admissionPayment.AdmissionID = paymentModel.AdmissionID;
                admissionPayment.ReceiptNo = rcptCheck != null ? paymentModel.ReceiptNo : (visitrcptCheck != null ? paymentModel.ReceiptNo : getRCPTCommon.CommonMasterDesc);
                admissionPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                admissionPayment.BillNo = billCheck != null ? paymentModel.BillNo : (visitbillCheck != null ? paymentModel.BillNo : getBILLCommon.CommonMasterDesc);
                admissionPayment.MiscAmount = paymentModel.MiscAmount;
                admissionPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                admissionPayment.DiscountAmount = paymentModel.DiscountAmount;
                admissionPayment.GrandTotal = paymentModel.GrandTotal;
                admissionPayment.NetAmount = paymentModel.NetAmount;
                admissionPayment.PaidAmount = paymentModel.PaidAmount;
                admissionPayment.PaymentMode = paymentModel.PaymentMode;
                admissionPayment.Notes = paymentModel.Notes;
                admissionPayment.IsActive = true;
                admissionPayment.Createddate = DateTime.Now;
                admissionPayment.CreatedBy = "User";

                this.uow.GenericRepository<AdmissionPayment>().Insert(admissionPayment);

                this.uow.Save();

                getRCPTCommon.CurrentIncNo = admissionPayment.ReceiptNo;
                this.uow.GenericRepository<CommonMaster>().Update(getRCPTCommon);

                getBILLCommon.CurrentIncNo = admissionPayment.BillNo;
                this.uow.GenericRepository<CommonMaster>().Update(getBILLCommon);
                this.uow.Save();
            }
            else
            {
                admissionPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                admissionPayment.MiscAmount = paymentModel.MiscAmount;
                admissionPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                admissionPayment.DiscountAmount = paymentModel.DiscountAmount;
                admissionPayment.GrandTotal = paymentModel.GrandTotal;
                admissionPayment.NetAmount = paymentModel.NetAmount;
                admissionPayment.PaidAmount = paymentModel.PaidAmount;
                admissionPayment.PaymentMode = paymentModel.PaymentMode;
                admissionPayment.Notes = paymentModel.Notes;
                admissionPayment.IsActive = true;
                admissionPayment.ModifiedDate = DateTime.Now;
                admissionPayment.ModifiedBy = "User";

                this.uow.GenericRepository<AdmissionPayment>().Update(admissionPayment);
                this.uow.Save();
            }
            paymentModel.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;

            if (admissionPayment.AdmissionPaymentID > 0)
            {
                if (paymentModel.paymentDetailsItem.Count() > 0)
                {
                    var paymentDetails = this.uow.GenericRepository<AdmissionPaymentDetails>().Table()
                                        .Where(x => x.AdmissionPaymentID == admissionPayment.AdmissionPaymentID).ToList();

                    if (paymentDetails.Count() > 0)
                    {
                        foreach (var item in paymentDetails)
                        {
                            this.uow.GenericRepository<AdmissionPaymentDetails>().Delete(item);
                        }
                        this.uow.Save();

                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();

                            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    else
                    {
                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();

                            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    this.uow.Save();
                }

                //if (paymentModel.paymentDetailsItem.Count() > 0)
                //{
                //    AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();
                //    foreach (var detail in paymentModel.paymentDetailsItem)
                //    {
                //        paymentItem = this.uow.GenericRepository<AdmissionPaymentDetails>().Table().FirstOrDefault(x => x.AdmissionPaymentDetailsID == detail.AdmissionPaymentDetailsID);
                //        if (paymentItem == null)
                //        {
                //            paymentItem = new AdmissionPaymentDetails();

                //            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.Createddate = DateTime.Now;
                //            paymentItem.CreatedBy = "User";

                //            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                //        }
                //        else
                //        {
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.ModifiedDate = DateTime.Now;
                //            paymentItem.ModifiedBy = "User";

                //            this.uow.GenericRepository<AdmissionPaymentDetails>().Update(paymentItem);
                //        }
                //        this.uow.Save();
                //        detail.AdmissionPaymentDetailsID = paymentItem.AdmissionPaymentDetailsID;
                //    }
                //}
            }

            return paymentModel;
        }


        ///// <summary>
        ///// Get Payment record by admissionID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>AdmissionPaymentModel. if payment record for given admissionID = success. else = failure</returns>
        public AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentID)
        {
            var admissionPaymentRecord = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == admissionPaymentID)

                                          join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on admissionPay.AdmissionID equals admsn.AdmissionID

                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                          on admsn.PatientID equals pat.PatientId

                                          select new
                                          {
                                              admissionPay.AdmissionPaymentID,
                                              admissionPay.AdmissionID,
                                              admissionPay.ReceiptNo,
                                              admissionPay.ReceiptDate,
                                              admissionPay.BillNo,
                                              admissionPay.MiscAmount,
                                              admissionPay.DiscountPercentage,
                                              admissionPay.DiscountAmount,
                                              admissionPay.GrandTotal,
                                              admissionPay.NetAmount,
                                              admissionPay.PaidAmount,
                                              admissionPay.PaymentMode,
                                              admissionPay.Notes,
                                              admsn.AdmissionDateTime,
                                              admsn.FacilityID,
                                              pat.PatientId,
                                              pat.PatientFirstName,
                                              pat.PatientMiddleName,
                                              pat.PatientLastName,
                                              pat.PrimaryContactNumber,
                                              pat.MRNo

                                          }).AsEnumerable().Select(APM => new AdmissionPaymentModel
                                          {
                                              AdmissionPaymentID = APM.AdmissionPaymentID,
                                              AdmissionID = APM.AdmissionID,
                                              FacilityId = APM.FacilityID,
                                              facilityName = APM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == APM.FacilityID).FacilityName : "",
                                              ReceiptNo = APM.ReceiptNo,
                                              ReceiptDate = APM.ReceiptDate,
                                              BillNo = APM.BillNo,
                                              MiscAmount = APM.MiscAmount,
                                              DiscountPercentage = APM.DiscountPercentage,
                                              DiscountAmount = APM.DiscountAmount,
                                              GrandTotal = APM.GrandTotal,
                                              NetAmount = APM.NetAmount,
                                              PaidAmount = APM.PaidAmount,
                                              PaymentMode = APM.PaymentMode,
                                              Notes = APM.Notes,
                                              PatientId = APM.PatientId,
                                              PatientName = APM.PatientFirstName + " " + APM.PatientMiddleName + " " + APM.PatientLastName,
                                              PatientContactNumber = APM.PrimaryContactNumber,
                                              MRNumber = APM.MRNo,
                                              AdmissionDateandTime = APM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + APM.AdmissionDateTime.TimeOfDay.ToString(),
                                              paymentDetailsItem = this.GetAdmissionPaymentDetailsbyID(APM.AdmissionPaymentID)

                                          }).FirstOrDefault();

            return admissionPaymentRecord;
        }

        ///// <summary>
        ///// Get All Admission Payment Detail for admissionPaymentId
        ///// </summary>
        ///// <param>int admissionPaymentId</param>
        ///// <returns>List<AdmissionPaymentDetailsModel>. if All admission payment Detail for given admissionPaymentId = success. else = failure</returns>
        public List<AdmissionPaymentDetailsModel> GetAdmissionPaymentDetailsbyID(int admissionPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false & x.AdmissionPaymentID == admissionPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.AdmissionPaymentDetailsID,
                                      detail.AdmissionPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(APDM => new AdmissionPaymentDetailsModel
                                  {
                                      AdmissionPaymentDetailsID = APDM.AdmissionPaymentDetailsID,
                                      AdmissionPaymentID = APDM.AdmissionPaymentID,
                                      SetupMasterID = APDM.SetupMasterID,
                                      Charges = APDM.Charges,
                                      DepartmentId = APDM.DepartmentID,
                                      DepartmentName = APDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(APDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        #endregion

        ///// <summary>
        ///// Get Dates for Visit or Admission from billing payment screen
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>VisitandAdmissionModel. if Visit or Admission collection for given patient id and bill type = success. else = failure</returns>
        public VisitandAdmissionModel GetVisitorAdmissionDetailsforPaymentScreen(string billType, int patientId)
        {
            VisitandAdmissionModel visitOrAdmissions = new VisitandAdmissionModel();

            if (billType.ToLower().Trim().Contains("visit") && patientId > 0)
            {
                visitOrAdmissions.visitCollection = this.GetVisitsbyPatientId(patientId);
            }

            if (billType.ToLower().Trim().Contains("admission") && patientId > 0)
            {
                visitOrAdmissions.admissionCollection = this.GetAdmissionsForPatient(patientId);
            }

            return visitOrAdmissions;
        }

        ///// <summary>
        ///// Get Visit details by Patient Id
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if list of Visits for given Patient Id = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsbyPatientId(int PatientId)
        {
            var visitList = (from visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientId)
                             join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                             on visit.PatientId equals pat.PatientId
                             select new
                             {
                                 visit.VisitId,
                                 visit.VisitNo,
                                 visit.FacilityID,
                                 visit.ProviderID,
                                 visit.VisitDate,
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
                                 FacilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == PVM.FacilityID).FirstOrDefault().FacilityName : "",
                                 VisitDate = PVM.VisitDate,
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
        ///// Get Admissions for a Patient 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<AdmissionsModel>. if Collection of Admissions for given PatientId= success. else = failure</returns>
        public List<AdmissionsModel> GetAdmissionsForPatient(int PatientId)
        {
            var admissionList = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false & x.PatientID == PatientId)
                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                 on admission.PatientID equals pat.PatientId
                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.AdmittingPhysician,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo

                                 }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo

                                 }).ToList();

            List<AdmissionsModel> admissionsCollection = new List<AdmissionsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        admissionsCollection = (from adm in admissionList
                                                join fac in facList on adm.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                    else
                    {
                        admissionsCollection = (from adm in admissionList
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                }
                else
                {
                    admissionsCollection = (from adm in admissionList
                                            join fac in facList on adm.FacilityID equals fac.FacilityId
                                            select adm).ToList();
                }
            }
            else
            {
                admissionsCollection = admissionList;
            }

            return admissionsCollection;
        }

        #region Refund - Billing Payment and Search

        ///// <summary>
        ///// Get Receipt numbers for Refund
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns> List<string>. if Receipt number = success. else = failure</returns>
        public List<string> GetReceiptNumbers(string searchKey)
        {
            List<string> receiptNumbers = new List<string>();

            var visitReceipts = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.IsActive != false & x.ReceiptNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (visitReceipts.Count() > 0)
            {
                foreach (var data in visitReceipts)
                {
                    if (!receiptNumbers.Contains(data.ReceiptNo))
                    {
                        receiptNumbers.Add(data.ReceiptNo);
                    }
                }
            }

            var admReceipts = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.IsActive != false & x.ReceiptNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (admReceipts.Count() > 0)
            {
                foreach (var set in admReceipts)
                {
                    if (!receiptNumbers.Contains(set.ReceiptNo))
                    {
                        receiptNumbers.Add(set.ReceiptNo);
                    }
                }
            }

            return receiptNumbers;
        }

        ///// <summary>
        ///// Get All Payment Details
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All payment Detail for given searchModel = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetAllPaymentParticularsforRefundbySearch(SearchModel searchModel)
        {
            List<CommonPaymentDetailsModel> paymentParticularCollection = new List<CommonPaymentDetailsModel>();

            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var visPaymentDetails = this.GetVisitPaymentDetails();

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

            var admPaymentDetails = this.GetAdmissionPaymentDetails();

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

            var searchResultData = (from search in paymentParticularCollection

                                    where (Fromdate.Date <= search.ReceiptDate.Date
                                        && (Todate.Date >= Fromdate.Date && search.ReceiptDate.Date <= Todate.Date)
                                        && (searchModel.PatientId == 0 || search.PatientId == searchModel.PatientId)
                                        && (searchModel.ProviderId == 0 || search.PatientId == searchModel.ProviderId)
                                        && (searchModel.FacilityId == 0 || search.FacilityID == searchModel.FacilityId)
                                        && ((searchModel.receiptNo == null || searchModel.receiptNo == "") || search.ReceiptNo.ToLower().Trim() == searchModel.receiptNo.ToLower().Trim())
                                        && ((searchModel.AdmissionNo == null || searchModel.AdmissionNo == "") || (search.AdmissionNo != null && search.AdmissionNo != "" && search.AdmissionNo.ToLower().Trim() == searchModel.AdmissionNo.ToLower().Trim()))
                                        && ((searchModel.VisitNo == null || searchModel.VisitNo == "") || (search.VisitNo != null && search.VisitNo != "" && search.VisitNo.ToLower().Trim() == searchModel.VisitNo.ToLower().Trim()))
                                        )
                                    select search).ToList();

            return searchResultData;
        }

        ///// <summary>
        ///// Get All Payment Details
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All payment Detail for given patientId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetAllPaymentParticularsforPatient(int patientID)
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

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.VisitPaymentDetailsID,
                                      detail.VisitPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      visit.FacilityID,
                                      visit.VisitNo,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = CPDM.VisitPaymentDetailsID,
                                      VisitPaymentID = CPDM.VisitPaymentID,
                                      VisitNo = CPDM.VisitNo,
                                      FacilityID = CPDM.FacilityID > 0 ? CPDM.FacilityID.Value : 0,
                                      facilityName = CPDM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPDM.FacilityID).FacilityName : "",
                                      ReceiptDate = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate,
                                      ReceiptTime = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      ReceiptNo = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().GrandTotal,
                                      Notes = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().Notes,
                                      SetupMasterID = CPDM.SetupMasterID,
                                      Charges = CPDM.Charges,
                                      Refund = CPDM.Refund,
                                      RefundNotes = CPDM.RefundNotes,
                                      DepartmentId = CPDM.DepartmentID,
                                      DepartmentName = CPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(CPDM.DepartmentID, null).FirstOrDefault().billingparticularName,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            List<CommonPaymentDetailsModel> commonPaymentDetailCollection = new List<CommonPaymentDetailsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (paymentDetails.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentDetailCollection = (from visPay in paymentDetails
                                                         join fac in facList on visPay.FacilityID equals fac.FacilityId
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on visPay.ProviderId equals prov.ProviderID
                                                         select visPay).ToList();
                    }
                    else
                    {
                        commonPaymentDetailCollection = (from visPay in paymentDetails
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on visPay.ProviderId equals prov.ProviderID
                                                         select visPay).ToList();
                    }
                }
                else
                {
                    commonPaymentDetailCollection = (from visPay in paymentDetails
                                                     join fac in facList on visPay.FacilityID equals fac.FacilityId
                                                     select visPay).ToList();
                }
            }
            else
            {
                commonPaymentDetailCollection = paymentDetails;
            }

            return commonPaymentDetailCollection;
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

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.AdmissionPaymentDetailsID,
                                      detail.AdmissionPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      adm.FacilityID,
                                      adm.AdmissionNo,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      AdmissionPaymentDetailsID = CPDM.AdmissionPaymentDetailsID,
                                      AdmissionPaymentID = CPDM.AdmissionPaymentID,
                                      AdmissionNo = CPDM.AdmissionNo,
                                      FacilityID = CPDM.FacilityID,
                                      facilityName = CPDM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPDM.FacilityID).FacilityName : "",
                                      ReceiptDate = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate,
                                      ReceiptTime = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      ReceiptNo = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().GrandTotal,
                                      Notes = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().Notes,
                                      SetupMasterID = CPDM.SetupMasterID,
                                      Charges = CPDM.Charges,
                                      Refund = CPDM.Refund,
                                      RefundNotes = CPDM.RefundNotes,
                                      DepartmentId = CPDM.DepartmentID,
                                      DepartmentName = CPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticulars(CPDM.DepartmentID, null).FirstOrDefault().billingparticularName,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            List<CommonPaymentDetailsModel> commonPaymentDetailCollection = new List<CommonPaymentDetailsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (paymentDetails.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentDetailCollection = (from admPay in paymentDetails
                                                         join fac in facList on admPay.FacilityID equals fac.FacilityId
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on admPay.ProviderId equals prov.ProviderID
                                                         select admPay).ToList();
                    }
                    else
                    {
                        commonPaymentDetailCollection = (from admPay in paymentDetails
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on admPay.ProviderId equals prov.ProviderID
                                                         select admPay).ToList();
                    }
                }
                else
                {
                    commonPaymentDetailCollection = (from admPay in paymentDetails
                                                     join fac in facList on admPay.FacilityID equals fac.FacilityId
                                                     select admPay).ToList();
                }
            }
            else
            {
                commonPaymentDetailCollection = paymentDetails;
            }
            return commonPaymentDetailCollection;
        }

        ///// <summary>
        ///// Update Particular Item details from Refund screen
        ///// </summary>
        ///// <param>
        public IEnumerable<CommonPaymentDetailsModel> UpdateRefundParticularDetails(IEnumerable<CommonPaymentDetailsModel> refundPaymentCollection)
        {
            if (refundPaymentCollection.Count() > 0)
            {
                foreach (var record in refundPaymentCollection)
                {
                    if (record.VisitPaymentDetailsID > 0)
                    {
                        var detail = this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.VisitPaymentDetailsID == record.VisitPaymentDetailsID).FirstOrDefault();

                        if (detail != null)
                        {
                            detail.Refund = record.Refund;
                            detail.RefundNotes = record.RefundNotes;

                            this.uow.GenericRepository<VisitPaymentDetails>().Update(detail);
                        }
                    }

                    if (record.AdmissionPaymentDetailsID > 0)
                    {
                        var data = this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.AdmissionPaymentDetailsID == record.AdmissionPaymentDetailsID).FirstOrDefault();

                        if (data != null)
                        {
                            data.Refund = record.Refund;
                            data.RefundNotes = record.RefundNotes;

                            this.uow.GenericRepository<AdmissionPaymentDetails>().Update(data);
                        }
                    }
                }

                this.uow.Save();
            }

            return refundPaymentCollection;
        }

        #endregion

        #endregion

    }

}
