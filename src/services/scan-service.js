import { fetchScansByUser, fetchScanById, addScan, prepareImageForUpload } from './airtableService';

// Get all scans for a user
export const getUserScans = async (userId) => {
  try {
    const scans = await fetchScansByUser(userId);
    return scans.map(record => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Error fetching user scans:", error);
    // For the hackathon demo, return sample data if there's an error
    return [];
  }
};

// Get scan details by ID
export const getScanById = async (scanId) => {
  try {
    const scan = await fetchScanById(scanId);
    if (!scan) return null;
    
    return {
      id: scan.id,
      ...scan.fields,
    };
  } catch (error) {
    console.error("Error fetching scan details:", error);
    return null;
  }
};

// Save a new scan
export const saveScan = async (scanData) => {
  try {
    // Handle the image file if provided
    if (scanData.imageFile) {
      scanData.Scan_Image = await prepareImageForUpload(scanData.imageFile);
      delete scanData.imageFile; // Remove the original file from the data
    }
    
    // Ensure linked fields are in the right format
    if (scanData.User && !Array.isArray(scanData.User)) {
      scanData.User = [scanData.User];
    }
    
    if (scanData.Plant && !Array.isArray(scanData.Plant)) {
      scanData.Plant = [scanData.Plant];
    }
    
    if (scanData.Plant_Issue && !Array.isArray(scanData.Plant_Issue)) {
      scanData.Plant_Issue = [scanData.Plant_Issue];
    }
    
    // Set the scan date if not provided
    if (!scanData.Scan_Date) {
      scanData.Scan_Date = new Date().toISOString();
    }
    
    const newScan = await addScan(scanData);
    return newScan;
  } catch (error) {
    console.error("Error saving scan:", error);
    throw error;
  }
};

// Format scan data for display
export const formatScanForDisplay = (scan) => {
  if (!scan) return null;
  
  // Extract the linked record IDs
  const userId = scan.User?.[0];
  const plantId = scan.Plant?.[0];
  const plantIssueId = scan.Plant_Issue?.[0];
  
  // Format the date for display
  const scanDate = scan.Scan_Date ? new Date(scan.Scan_Date) : new Date();
  const formattedDate = scanDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    id: scan.id,
    userId,
    plantId,
    plantIssueId,
    date: formattedDate,
    notes: scan.Notes || '',
    imageUrl: scan.Scan_Image?.[0]?.url || null,
  };
};
