import { ArrowLeft, UploadIcon, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useUser } from "../../contexts/UserContext";
import { diagnosePlant, recordPlantScan } from "../../services/plantService";
import { LoadingScreen } from "../LoadingScreen";

export const Scan = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [scanning, setScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [plantName, setPlantName] = useState("Aloe Vera"); // Default for demo
  
  // Create a reference to the hidden file input element
  const fileInputRef = useRef(null);
  
  // Handler for when scan button is clicked
  const handleScanClick = () => {
    // In a real app, this would activate the camera
    // For the hackathon, we'll simulate scanning with a timeout
    setScanning(true);
    
    // Simulate a scan taking place
    setTimeout(() => {
      processScan();
    }, 2000);
  };
  
  // Handler for file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };
  
  // Trigger the file input when the upload button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Process the scan and navigate to results
  const processScan = async () => {
    try {
      // If no user is logged in, redirect to login (for a real app)
      if (!currentUser) {
        console.error("No user logged in");
        return;
      }
      
      // Use the selected image file, or a placeholder for demo purposes
      const imageFile = selectedImage || null;
      
      // Use the plant service to diagnose the plant
      const diagnosis = await diagnosePlant(imageFile, plantName);
      
      // For the hackathon demo, we'll record the scan if possible but
      // continue even if it fails since this is a demo
      try {
        if (diagnosis && currentUser.id) {
          await recordPlantScan({
            userId: currentUser.id,
            plantId: diagnosis.plantId,
            plantIssueId: diagnosis.issueId,
            imageFile: imageFile,
          });
        }
      } catch (scanError) {
        console.error("Error recording scan:", scanError);
        // Continue anyway for the demo
      }
      
      // Navigate to diagnosis page
      navigate("/Diagnosis", { state: { diagnosis } });
    } catch (error) {
      console.error("Error processing scan:", error);
      setScanning(false);
      // Handle error (show error message to user)
    }
  };
  
  // If scanning is in progress, show the loading screen
  if (scanning) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100">
      <div className="relative w-full max-w-[393px] h-full overflow-hidden">
        {/* Full-screen plant image background or preview */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: previewUrl 
              ? `url(${previewUrl})` 
              : "url(https://c.animaapp.com/UiWGNsHI/img/overwatered-aloe-vera.png)" 
          }}
        >
          {/* Plant title at the top */}
          <div className="absolute top-14 left-0 right-0 flex justify-center">
            <Card className="bg-white rounded-xl shadow-sm w-48 py-2">
              <CardContent className="p-0 flex items-center justify-center">
                <h1 className="font-['Rubik',Helvetica] font-medium text-[#4d3c30] text-2xl text-center underline">
                  {plantName}
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
                <Link to="/">
                  <button className="w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={32} />
                  </button>
                </Link>
                
                {/* Scan button with label */}
                <div className="flex flex-col items-center">
                  <Button 
                    className="w-20 h-20 bg-[#7d9b76] hover:bg-[#6c8a65] rounded-md flex items-center justify-center mb-3"
                    onClick={handleScanClick}
                  >
                    <div className="text-white">
                      <Camera size={32} />
                    </div>
                  </Button>
                  <span className="font-['Rubik',Helvetica] font-medium text-[#635c5c] text-base">
                    Scan Plant
                  </span>
                </div>

                {/* Upload button - Now functional */}
                <button 
                  className="w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={handleUploadClick}
                >
                  <UploadIcon size={32} />
                  
                  {/* Hidden file input */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};