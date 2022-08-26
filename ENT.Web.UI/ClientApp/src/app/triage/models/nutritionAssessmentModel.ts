export class NutritionAssessmentModel {
  public NutritionAssessmentID: number;
  public VisitId: number;
  public PatientId: number;
  public RecordedDate: Date;
  public recordedDuring: string;
  public RecordedBy: string;
  public IntakeCategory: string;
  public FoodIntakeTypeID: number;
  public EatRegularly: string;
  public RegularMeals: string;
  public Carvings: string;
  public DislikedIntake: string;
  public FoodAllergies: string;
  public Notes: string;
  public FoodName: string;
  public Units: string;
  public Frequency: number;
  public NutritionNotes: string;
  public FoodIntakeTypeDesc:string;
  public visitDateandTime: string;
}
