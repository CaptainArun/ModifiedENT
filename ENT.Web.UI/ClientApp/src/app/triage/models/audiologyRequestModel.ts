export class AudiologyRequestModel {

  public AudiologyRequestID: number;
  public ProviderId: number;
  public VisitID: number;
  public TuningFork: boolean = false;
  public SpecialTest: boolean = false;
  public Tympanometry: boolean = false;
  public OAE: boolean = false;
  public BERA: boolean = false;
  public ASSR: boolean = false;
  public HearingAid: boolean = false;
  public TinnitusMasking: boolean = false;
  public SpeechTherapy: boolean = false;
  public Electrocochleography: boolean = false;
}
