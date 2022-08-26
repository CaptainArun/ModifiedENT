import { elabOrderItemModel } from "./elabOrderItemModel";

export class eLabOrderStatusModel {
    public eLabOrderStatusId: number;
    public eLabOrderId: number;
    public SampleCollectedDate: Date;
    public ReportDate: Date;
    public ReportStatus: string;
    public Notes: string;
    public ApprovedBy: number;
    public itemsModel: elabOrderItemModel[];
}
