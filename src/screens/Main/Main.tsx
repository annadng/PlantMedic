import { SearchIcon } from "lucide-react";
// import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";

export const Main = (): JSX.Element => {
  // Data for feature cards
  const featureCards = [
    {
      title: "Instant Diagnosis",
      description:
        "Real-time identification of plant health and maintenance needs",
      icon: (
        <img
          className="w-[72px] h-[57px]"
          alt="Leaf diagnosis icon"
          src="https://c.animaapp.com/xhN4OijC/img/group@2x.png"
        />
      ),
      link: "/Diagnosis",
    },
    {
      title: "Care Recommendations",
      description:
        "Get precise and personalised care recommendations to help your plants flourish again",
      icon: (
        <img
          className="w-[73px] h-[73px]"
          alt="Information icon"
          src="https://c.animaapp.com/xhN4OijC/img/material-symbols-info-outline-rounded.svg"
        />
      ),
      link: "/care-recommendations",
    },
    {
      title: "ScanIcon History",
      description:
        "Access all your previous plant scans and diagnoses in one convenient place",
      icon: (
        <img
          className="w-[76px] h-[74px]"
          alt="HistoryIcon icon"
          src="https://c.animaapp.com/xhN4OijC/img/material-symbols-history-rounded.svg"
        />
      ),
      link: "/History",
    },
  ];

  return (
    <main className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f5f2ec] w-full max-w-[393px] relative py-8 px-3">
        {/* Header with logo and profile button */}
        <header className="relative w-full h-32 mb-8">
          <img
            className="w-full h-32"
            alt="PlantMedic Logo"
            src="https://c.animaapp.com/xhN4OijC/img/logo-1@2x.png"
          />
          <button className="absolute top-0 right-0">
            <img
              className="w-[43px] h-[43px]"
              alt="Profile button"
              src="https://c.animaapp.com/xhN4OijC/img/profile-button-1.svg"
            />
          </button>
        </header>

        {/* Welcome Card */}
        <Card className="w-full mb-6 bg-[url(https://c.animaapp.com/xhN4OijC/img/main-background-box.svg)] bg-[100%_100%] border-none">
          <CardContent className="p-6">
            <h2 className="font-medium text-[23px] text-[#4d3c30] text-center mb-4 font-['Rubik',Helvetica]">
              Welcome Back Hashi!
            </h2>

            <div className="flex items-center mb-4">
              <div className="flex-1 relative">
                <Input
                  className="pl-10 py-2 h-[62px] bg-neutral-100 rounded-xl font-['Rubik',Helvetica] text-[15px] text-[#8b8686]"
                  placeholder="SearchIcon for plants..."
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#8b8686]" />
              </div>
              <button className="ml-3">
                <img
                  className="w-[62px] h-[62px]"
                  alt="ScanIcon button"
                  src="https://c.animaapp.com/xhN4OijC/img/scan-button.svg"
                />
              </button>
            </div>

            <Button className="w-full h-[39px] bg-[#7d9b76] hover:bg-[#6c8a65] rounded-md font-['Rubik',Helvetica] font-medium text-[15px]">
              View My ScanIcon HistoryIcon
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <h2 className="font-medium text-xl text-[#4d3c30] text-center mb-4 font-['Rubik',Helvetica]">
          About PlantMedic
        </h2>

        {/* Feature Cards */}
        <div className="space-y-4">
          {featureCards.map((card, index) => (
            <Link key={index} to={card.link}>
              <Card
                key={index}
                className="w-full bg-[url(https://c.animaapp.com/xhN4OijC/img/instant-diagnosis-b-box.svg)] bg-[100%_100%] border-none"
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-3">
                    <div className="w-[76px] h-[76px] flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-['Rubik',Helvetica] font-medium text-[15px] text-[#4d3c30] text-center">
                        {card.title}
                      </h3>
                      <p className="font-['Rubik',Helvetica] font-light text-[10px] text-[#4d3c30] text-center mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
