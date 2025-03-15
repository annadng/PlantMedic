import { ArrowLeft } from "lucide-react";
// import { ArrowLeft, UploadIcon } from "lucide-react";
// import React from "react";
// import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const Scan = (): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100">
      <div className="relative w-full max-w-[393px] h-full overflow-hidden">
        {/* Full-screen plant image background */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url(https://c.animaapp.com/UiWGNsHI/img/overwatered-aloe-vera.png)" }}
        >
          {/* Plant title at the top */}
          <div className="absolute top-14 left-0 right-0 flex justify-center">
            <Card className="bg-white rounded-xl shadow-sm w-48 py-2">
              <CardContent className="p-0 flex items-center justify-center">
                <h1 className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-2xl text-center underline">
                  Aloe Vera
                </h1>
              </CardContent>
            </Card>
          </div>

          {/* Bottom action panel */}
          <div className="absolute bottom-0 left-0 right-0 h-52 flex items-center justify-center">
            <div 
              className="w-full h-full bg-no-repeat bg-cover"
              style={{ backgroundImage: "url(https://c.animaapp.com/UiWGNsHI/img/main-background-box.svg)" }}
            >
              {/* Navigation buttons container */}
              <div className="relative w-full h-full flex items-center justify-between px-10">
                {/* Back button */}
                <button className="w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors">
                  <ArrowLeft size={32} />
                </button>

                {/* Scan button with label */}
                <div className="flex flex-col items-center">
                  <Button 
                    className="w-20 h-20 bg-[#7d9b76] hover:bg-[#6c8a65] rounded-md flex items-center justify-center mb-3"
                  >
                    <div className="text-white">
                      {/* Camera/scan icon using CSS */}
                      <div className="w-10 h-8 border-2 border-white rounded-sm flex items-center justify-center">
                        <div className="w-6 h-4 border border-white rounded-sm"></div>
                      </div>
                    </div>
                  </Button>
                  <span className="font-['Rubik',Helvetica] font-medium text-[#635c5c] text-base">
                    Scan Plant
                  </span>
                </div>

                {/* Upload button */}
                <button className="w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
