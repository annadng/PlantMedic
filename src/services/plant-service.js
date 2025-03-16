import {
  fetchPlants,
  fetchPlantById,
  fetchPlantIssues,
  fetchPlantIssueById,
  fetchPlantIssuesByPlant,
  fetchIssueTypes,
  addScan,
  prepareImageForUpload
} from './airtableService';

// Get all plants
export const getAllPlants = async () => {
  const plants = await fetchPlants();
  return plants.map(record => ({
    id: record.id,
    ...record.fields
  }));
};

// Get plant by ID
export const getPlantById = async (plantId) => {
  const plant = await fetchPlantById(plantId);
  if (!plant) return null;
  
  return {
    id: plant.id,
    ...plant.fields
  };
};

// Get all plant issues (diagnoses)
export const getAllPlantIssues = async () => {
  const issues = await fetchPlantIssues();
  return issues.map(record => ({
    id: record.id,
    ...record.fields,
  }));
};

// Get specific plant issue by ID
export const getPlantIssueById = async (issueId) => {
  const issue = await fetchPlantIssueById(issueId);
  if (!issue) return null;
  
  return {
    id: issue.id,
    ...issue.fields
  };
};

// Get all issues for a specific plant
export const getIssuesForPlant = async (plantId) => {
  const issues = await fetchPlantIssuesByPlant(plantId);
  return issues.map(record => ({
    id: record.id,
    ...record.fields
  }));
};

// Get all issue types
export const getAllIssueTypes = async () => {
  const issueTypes = await fetchIssueTypes();
  return issueTypes.map(record => ({
    id: record.id,
    ...record.fields
  }));
};

// Record a new plant scan
export const recordPlantScan = async ({ userId, plantId, plantIssueId, imageFile, notes = "" }) => {
  try {
    // Process the image file if one is provided
    let scanImage = null;
    if (imageFile) {
      scanImage = await prepareImageForUpload(imageFile);
    }
    
    // Create the scan record
    const scanData = {
      User: [userId], // Airtable expects linked fields as arrays
      Plant: [plantId],
      Plant_Issue: [plantIssueId],
      Scan_Date: new Date().toISOString(),
      Notes: notes
    };
    
    // Only add the image if we have one
    if (scanImage) {
      scanData.Scan_Image = scanImage;
    }
    
    // Add the scan to Airtable
    const newScan = await addScan(scanData);
    return newScan;
  } catch (error) {
    console.error("Error recording plant scan:", error);
    throw error;
  }
};

// Simulate a plant diagnosis (for your hackathon demo)
// In a real app, this would connect to your ML model API
export const diagnosePlant = async (imageFile, plantName = null) => {
  // This is a mock function that would normally call your ML model
  // For the hackathon, we'll return a hardcoded diagnosis
  
  // Wait a bit to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // If we have a plant name, return diagnosis for that plant
  // Otherwise use a default
  if (plantName === "Aloe Vera") {
    return {
      plantId: "rec1", // Use the actual Airtable ID from your base
      plantName: "Aloe Vera",
      issueId: "rec1", // Use the actual Airtable ID from your base
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
      confidence: 0.92, // 92% confidence score
    };
  } else if (plantName === "Orchid") {
    return {
      plantId: "recXXXXXXXXX3",
      plantName: "Orchid",
      issueId: "recXXXXXXXXX4",
      issueType: "Sunburn",
      symptoms: [
        "Clear yellow-orange discolouration on leaf tissues",
        "Distinct bleached/burnt patch on leaf",
        "Beginning yellowing of adjacent leaf edges",
      ],
      careTips: [
        "Move the plant away from direct sunlight immediately",
        "Place in a location with bright, indirect light",
        "Do not remove damaged leaves unless completely dead",
        "Ensure good air circulation around the plant",
        "Maintain regular watering schedule to support recovery"
      ],
      confidence: 0.85,
    };
  } else {
    // Default diagnosis
    return {
      plantId: "recXXXXXXXXX5",
      plantName: "Unknown Plant",
      issueId: "recXXXXXXXXX6",
      issueType: "Underwatering",
      symptoms: [
        "Wilting or drooping leaves",
        "Dry, crispy leaf edges",
        "Slow growth",
        "Leaves falling off"
      ],
      careTips: [
        "Water thoroughly until water runs from drainage holes",
        "Establish a regular watering schedule",
        "Consider using a moisture meter to monitor soil moisture",
        "Add a layer of mulch to help retain moisture"
      ],
      confidence: 0.75,
    };
  }
};
