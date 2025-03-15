// import React from "react";
import { Card, CardContent } from "../../components/ui/card";

export const LoadingScreen = (): JSX.Element => {
  // Data for the loading dots
  const loadingDots = [
    { position: "top-3.5 left-3.5" },
    { position: "top-3.5 left-[62px]" },
    { position: "top-[62px] left-[62px]" },
    { position: "top-[62px] left-3.5" },
  ];

  return (
    <div className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f5f2ec] w-full max-w-[393px] h-[852px] relative flex flex-col items-center justify-center">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0 flex flex-col items-center">
            <div className="relative w-[100px] h-[100px] mb-8">
              {loadingDots.map((dot, index) => (
                <div
                  key={index}
                  className={`absolute w-6 h-6 bg-[#d9d9d9] rounded-xl ${dot.position}`}
                />
              ))}
            </div>
            <div className="font-medium text-[#4d3c30] text-xl text-center tracking-[0] leading-normal font-['Rubik',Helvetica]">
              Scanning...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
