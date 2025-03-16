import { HomeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { getUserScans } from "../../services/scanService";
import { getPlantById, getPlantIssueById } from "../../services/plantService";

export const History = () => {
  const { currentUser } = useUser();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch user's scan history
        const userScans = await getUserScans(currentUser.id);
        
        // Process each scan to get detailed info
        const processedScans = await Promise.all(
          userScans.map(async (scan) => {
            try {
              // Get plant info
              const plantId = scan.Plant?.[0];
              const plantIssueId = scan.Plant_Issue?.[0];
              let plantData = { Name: "Unknown Plant" };
              let issueData = { Name: "Unknown Issue" };
              
              // Get plant data if we have an ID
              if (plantId) {
                const plant = await getPlantById(plantId);
                if (plant) plantData = plant;
              }
              
              // Get plant issue data if we have an ID
              if (plantIssueId) {
                const issue = await getPlantIssueById(plantIssueId);
                if (issue) issueData = issue;
              }
              
              // Format the date nicely
              const scanDate = new Date(scan.Scan_Date);
              const formattedDate = scanDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              
              // Extract image URL if available
              const imageUrl = scan.Scan_Image?.[0]?.url || 
                (plantData.Image?.[0]?.url || "https://c.animaapp.com/2RogqAVu/img/image-2@2x.png");
              
              // Parse symptoms from the issue data
              const symptoms = issueData.Key_Symptoms 
                ? issueData.Key_Symptoms.split('\n').filter(s => s.trim())
                : ["No symptoms recorded"];
              
              return {
                id: scan.id,
                plantName: plantData.Name,
                diagnosis: issueData.Name,
                dateScan: formattedDate,
                image: imageUrl,
                imageAlt: `${issueData.Name} ${plantData.Name}`,
                symptoms,
                notes: scan.Notes || "",
              };
            } catch (error) {
              console.error("Error processing scan:", error);
              return null;
            }
          })
        );
        
        // Filter out any failed scan processing
        setScans(processedScans.filter(Boolean));
      } catch (error) {
        console.error("Error fetching scan history:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScanHistory();
  }, [currentUser]);
  
  // Show a loading state while data is being fetched
  if (loading) {
    return (
      <div className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
        <div className="bg-[#f5f2ec] w-full max-w-[393px] relative py-4 px-4 flex items-center justify-center">
          <p>Loading scan history...</p>
        </div>
      </div>
    );
  }
  
  // If no scans found, show a message
  if (scans.length === 0) {
    return (
      <div className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
        <div className="bg-[#f5f2ec] w-full max-w-[393px] relative py-4 px-4">
          {/* Header with logo and home button */}
          <header className="relative w-full flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img 
                src="https://c.animaapp.com/xhN4OijC/img/logo-1@2x.png" 
                alt="PlantMedic Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            
            <Link to="/">
              <button className="w-10 h-10 bg-[#8B6E4E] rounded-md flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </button>
            </Link>
          </header>

          {/* History title */}
          <h1 className="font-medium text-[25px] text-[#4d3c30] text-center mb-6">
            History
          </h1>
          
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-center text-[#4d3c30]">
              No scan history found. Take your first plant scan!
            </p>
            <Link to="/Scan" className="mt-4">
              <button className="px-4 py-2 bg-[#7d9b76] text-white rounded-md">
                Scan a Plant
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the scan history
  return (
    <div className="bg-[#f5f2ec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f5f2ec] w-full max-w-[393px] relative py-4 px-4">
        {/* Header with logo and home button */}
        <header className="relative w-full flex justify-between items-center mb-4">
          <div className="flex items-center">
            {/* Logo image */}
            <img 
              src="https://c.animaapp.com/xhN4OijC/img/logo-1@2x.png" 
              alt="PlantMedic Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
          
          {/* Home button */}
          <Link to="/">
            <button className="w-10 h-10 bg-[#8B6E4E] rounded-md flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-white" />
            </button>
          </Link>
        </header>

        {/* History title */}
        <h1 className="font-medium text-[25px] text-[#4d3c30] text-center mb-6">
          History
        </h1>

        {/* Plant diagnosis cards */}
        <div className="flex flex-col gap-4">
          {scans.map((scan) => (
            <Card
              key={scan.id}
              className="w-full bg-white rounded-xl border-none shadow-sm overflow-hidden"
            >
              <CardContent className="p-3">
                <div className="flex">
                  {/* Plant image */}
                  <div className="flex-shrink-0 mr-4">
                    <img
                      className="w-24 h-24 object-cover rounded-md"
                      alt={scan.imageAlt}
                      src={scan.image}
                    />
                  </div>
                  
                  {/* Plant information */}
                  <div className="flex flex-col">
                    {/* Plant name */}
                    <h2 className="font-['Rubik',Helvetica] font-medium text-xl text-[#4d3c30]">
                      {scan.plantName}
                    </h2>
                    
                    {/* Diagnosis */}
                    <h3 className="font-['Rubik',Helvetica] font-medium text-base text-[#4d3c30] mt-1">
                      {scan.diagnosis}
                    </h3>
                    
                    {/* Date scanned */}
                    <p className="font-['Rubik',Helvetica] font-light text-xs text-[#4d3c30] mt-1">
                      Date Scanned: {scan.dateScan}
                    </p>
                    
                    {/* Symptoms */}
                    <div className="mt-2">
                      <p className="font-['Rubik',Helvetica] font-medium text-xs text-[#4d3c30]">
                        Key Symptoms Detected:
                      </p>
                      <ul className="mt-1">
                        {scan.symptoms.slice(0, 3).map((symptom, index) => (
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