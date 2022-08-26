export class MedicationItemsModel {
    public MedicationItemsId: number;
    public MedicationID: number;
    public DrugName: string;
    public MedicationRouteCode: string;
    public ICDCode: string;
    public TotalQuantity: number;
    public NoOfDays: number;
    public Morning: boolean;
    public Brunch: boolean;
    public Noon: boolean;
    public Evening: boolean;
    public Night: boolean;
    public Before: boolean;
    public After: boolean;
    public Start: boolean;
    public Hold: boolean;
    public Continued: boolean;
    public DisContinue: boolean;
    public SIG: string;
}