import { HomeIcon } from "lucide-react";
// import React from "react";
import { Card, CardContent } from "../../components/ui/card";

// Define plant diagnosis data for mapping
const plantDiagnoses = [
  {
    id: 1,
    plantName: "Aloe Vera",
    diagnosis: "Overwatering",
    dateScan: "15th March 2025",
    image: "https://c.animaapp.com/2RogqAVu/img/overwatered-aloe-vera@2x.png",
    imageAlt: "Overwatered aloe",
    symptoms: [
      "Yellow/ Browning Leaf Edges",
      "Drooping and Flattening Leaves",
      "Pale Green Leaves",
    ],
  },
  {
    id: 2,
    plantName: "Orchids",
    diagnosis: "Sunburn",
    dateScan: "12th March 2025",
    image: "https://c.animaapp.com/2RogqAVu/img/image-1@2x.png",
    imageAlt: "Sunburned orchid",
    symptoms: [
      "Clear yellow-orange discolouration on leaf tissues",
      "Distinct bleached/burnt patch on leaf",
      "Beginning yellowing of adjacent leaf edges",
    ],
  },
  {
    id: 3,
    plantName: "Lemon Tree",
    diagnosis: "Underwatered",
    dateScan: "17h February 2025",
    image: "https://c.animaapp.com/2RogqAVu/img/image-2@2x.png",
    imageAlt: "Underwatered lemon tree",
    symptoms: [
      "Significant leaf wilting and drooping",
      "Curling leaf edges and overall limp appearance",
      "Healthy fruits despite stressed foliage",
    ],
  },
];

export const History = (): JSX.Element => {
  console.log("History page rendered");
  return (
    <div className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f5f2ec] w-full max-w-[393px] relative py-4 px-4">
        {/* Header with logo and home button */}
        <header className="relative w-full flex justify-between items-center mb-4">
          <div className="flex items-center">
            {/* Logo image */}
            <img 
              src="/api/placeholder/200/60" 
              alt="PlantMedic Logo" 
              className="h-12 w-auto object-contain"
            />
            {/* Note: In production, replace the placeholder with the actual logo URL */}
            {/* For example: src="https://example.com/plantmedic-logo.png" */}
          </div>
          
          {/* Home button */}
          <div className="w-10 h-10 bg-[#8B6E4E] rounded-md flex items-center justify-center">
            <HomeIcon className="w-6 h-6 text-white" />
          </div>
        </header>

        {/* History title */}
        <h1 className="font-medium text-[25px] text-[#4d3c30] text-center mb-6">
          History
        </h1>

        {/* Plant diagnosis cards */}
        <div className="flex flex-col gap-4">
          {plantDiagnoses.map((plant) => (
            <Card
              key={plant.id}
              className="w-full bg-white rounded-xl border-none shadow-sm overflow-hidden"
            >
              <CardContent className="p-3">
                <div className="flex">
                  {/* Plant image */}
                  <div className="flex-shrink-0 mr-4">
                    <img
                      className="w-24 h-24 object-cover rounded-md"
                      alt={plant.imageAlt}
                      src={plant.image}
                    />
                  </div>
                  
                  {/* Plant information */}
                  <div className="flex flex-col">
                    {/* Plant name */}
                    <h2 className="font-['Rubik',Helvetica] font-medium text-xl text-[#4d3c30]">
                      {plant.plantName}
                    </h2>
                    
                    {/* Diagnosis */}
                    <h3 className="font-['Rubik',Helvetica] font-medium text-base text-[#4d3c30] mt-1">
                      {plant.diagnosis}
                    </h3>
                    
                    {/* Date scanned */}
                    <p className="font-['Rubik',Helvetica] font-light text-xs text-[#4d3c30] mt-1">
                      Date Scanned : {plant.dateScan}
                    </p>
                    
                    {/* Symptoms */}
                    <div className="mt-2">
                      <p className="font-['Rubik',Helvetica] font-medium text-xs text-[#4d3c30]">
                        Key Symptoms Detected:
                      </p>
                      <ul className="mt-1">
                        {plant.symptoms.map((symptom, index) => (
                          <li 
                            key={index} 
                            className="font-['Rubik',Helvetica] font-light text-xs text-[#4d3c30] leading-tight"
                          >
                            • {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
