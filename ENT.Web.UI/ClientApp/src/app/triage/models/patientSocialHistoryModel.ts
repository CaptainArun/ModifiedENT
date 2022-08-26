export class PatientSocialHistoryModel {
  public VisitId: number;
  public PatientId: number;
  public SocialHistoryId: number;
  public RecordedDate: Date;
  public RecordedBy: string;
  public Smoking: number;
  public CigarettesPerDay : number;
  public Drinking: number;
  public ConsumptionPerDay : number;
  public DrugHabitsDetails: string;
  public LifeStyleDetails: string;
  public CountriesVisited: string;
  public DailyActivities : string;
  public AdditionalNotes : string;
}
