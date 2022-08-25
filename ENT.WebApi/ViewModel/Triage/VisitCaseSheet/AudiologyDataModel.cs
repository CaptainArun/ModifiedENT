using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AudiologyDataModel
    {
        public ASSRTestModel assrTestData { get; set; }
        public BERATestModel beraTestData { get; set; }
        public ElectrocochleographyModel electrocochleographyData { get; set; }
        public HearingAidTrialModel hearingAidData { get; set; }
        public OAETestModel oaeTestData { get; set; }
        public SpeechTherapyModel speechTherapyData { get; set; }
        public SpeechtherapySpecialtestsModel speechSpecialTestData { get; set; }
        public TinnitusmaskingModel tinnitusMaskingData { get; set; }
        public TuningForkTestModel tuningForkTestData { get; set; }
        public TympanometryModel tympanometryData { get; set; }
        public string VisitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public int FacilityId { get; set; }
        public string facilityName { get; set; }
        public string VisitNo { get; set; }
    }
}
