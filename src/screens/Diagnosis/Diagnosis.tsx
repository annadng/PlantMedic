import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const Diagnosis = () => {
  const location = useLocation();
  const [diagnosisData, setDiagnosisData] = useState(null);
  
  useEffect(() => {
    // Get diagnosis data from location state or use default
    if (location.state?.diagnosis) {
      setDiagnosisData(location.state.diagnosis);
    } else {
      // Use fallback data if no diagnosis was passed
      setDiagnosisData({
        plantName: "Aloe Vera",
        imageUrl: "https://c.animaapp.com/VBDOleiy/img/overwatered-aloe-vera@2x.png",
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        issueType: "Overwatering",
        symptoms: [
          "Yellow/ Browning Leaf Edges",
          "Drooping and Flattening Leaves",
          "Pale Green Leaves",
        ],
        careTips: [
          "Stop watering immediately to prevent further damage",
          "Move the plant to a bright location with indirect sunlight",
          "Remove the plant from its pot and gently shake off excess soil",
          "Inspect roots thoroughly, trimming any black, mushy, or foul-smelling roots with clean scissors",
          "Allow the bare-root plant to air dry for 1-2 days in a warm, dry location",
          "Repot in a well-draining cactus or succulent mix, preferably in a terracotta pot with drainage holes",
          "Add perlite or coarse sand to the soil mix to improve drainage (about 50% soil, 50% drainage material)",
        ],
      });
    }
  }, [location]);

  // If diagnosis data is not loaded yet, show loading state
  if (!diagnosisData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f2ec]">
        <p>Loading diagnosis data...</p>
      </div>
    );
  }

  // Destructure the diagnosis data for easier access, with fallback values
  const { 
    plantName = "Aloe Vera", 
    issueType = "Overwatering", 
    symptoms = [
      "Yellow/ Browning Leaf Edges",
      "Drooping and Flattening Leaves",
      "Pale Green Leaves",
    ], 
    careTips = [
      "Stop watering immediately to prevent further damage",
      "Move the plant to a bright location with indirect sunlight",
      "Remove the plant from its pot and gently shake off excess soil",
    ], 
    imageUrl = "https://c.animaapp.com/VBDOleiy/img/overwatered-aloe-vera@2x.png", 
    date = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    confidence = 0.92
  } = diagnosisData || {};

  return (
    <main className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f5f2ec] w-full max-w-[393px] h-[852px] relative flex flex-col items-center">
        <div className="w-full px-8 pt-8 pb-4 flex justify-between items-center">
          <h1 className="font-medium text-[25px] text-[#4d3c30] text-center tracking-[0] leading-normal underline font-['Rubik',Helvetica]">
            {plantName}
          </h1>
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-[43px] w-[43px]">
              <HomeIcon className="h-6 w-6 text-[#4d3c30]" />
            </Button>
          </Link>
        </div>

        <div className="w-[276px] h-[368px] mb-4">
          <img
            className="w-full h-full object-cover"
            alt={`${plantName} plant`}
            src={imageUrl}
          />
        </div>

        <Card className="w-[380px] bg-white rounded-t-[40px] shadow-md border-none mt-auto">
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-[15px]">
                Date: {date}
              </p>

              <h2 className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-xl text-center">
                {issueType}
              </h2>

              {confidence && (
                <p className="font-['Rubik',Helvetica] text-sm text-center text-[#4d3c30]">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              )}

              <div>
                <h3 className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-[15px] mb-1">
                  Key Symptoms Detected:
                </h3>
                <ul className="font-['Rubik',Helvetica] font-normal text-[#4d3c30] text-xs leading-[18px]">
                  {symptoms && symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-[15px] mb-1">
                  Care Tips:
                </h3>
                <ul className="font-['Rubik',Helvetica] font-normal text-[#4d3c30] text-xs leading-[18px]">
                  {careTips && careTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );