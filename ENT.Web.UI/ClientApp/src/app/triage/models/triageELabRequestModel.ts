import { TriageELabRequestItemsModel } from "./triageELabRequestItemsModel";

export class TriageELabRequestModel {
    public LabRequestID: number;
    public VisitID: number;
    public AdmissionID: number;
    public RequestedDate: Date;
    public RequestedBy: string;
    public LabOrderStatus: string;
    public labRequestItems: TriageELabRequestItemsModel[];
}