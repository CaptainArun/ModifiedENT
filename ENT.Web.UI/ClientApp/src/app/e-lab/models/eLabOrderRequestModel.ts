export class orderRequestModel{
        public LabOrderID : number;
        public LabOrderNo : string;
        public VisitID : number;
        public AdmissionID : number;
        public LabPhysician : number;
        public LabOrderStatus : string;
        public RequestedFrom : string;
        public UserName : string;
        public Password : string;
        
        public labOrderItems : [];
}