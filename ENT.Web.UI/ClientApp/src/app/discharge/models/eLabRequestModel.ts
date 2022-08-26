import { ELabRequestItemsModel } from "./eLabRequestItemsModel";

export class ELabRequestModel {
    public LabRequestID: number;
    public VisitID: number;
    public AdmissionID: number;
    public RequestedDate: Date;
    public RequestedBy: string;
    public LabOrderStatus: string;
    public labRequestItems: ELabRequestItemsModel[];
}