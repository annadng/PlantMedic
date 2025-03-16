import axios from "axios";

// Create environment variables in a .env file with these values
// Use process.env in a Node.js environment or import.meta.env in Vite
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || "YOUR_API_KEY";
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "appK4c7AaDouGVGbz";

// Table names as defined in your Airtable base
const TABLES = {
  PLANTS: "Plants",
  ISSUE_TYPES: "Issue_Types",
  PLANT_ISSUES: "Plant_Specific_Issues",
  USERS: "Users",
  SCANS: "Scan History"  // Note: space instead of underscore
};

// Create a base axios instance for Airtable API
const airtableAPI = (table) => axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Generic functions to fetch records from any table
const fetchRecords = async (table) => {
  try {
    const response = await airtableAPI(table).get("?view=Grid%20view");
    return response.data.records;
  } catch (error) {
    console.error(`Error fetching ${table} data:`, error);
    return [];
  }
};

// Generic function to fetch a single record
const fetchRecord = async (table, recordId) => {
  try {
    const response = await airtableAPI(table).get(`/${recordId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${table} record:`, error);
    return null;
  }
};

// Generic function to add a record to any table
const addRecord = async (table, fields) => {
  try {
    const response = await airtableAPI(table).post("/", {
      records: [{ fields }],
    });
    return response.data.records[0];
  } catch (error) {
    console.error(`Error adding ${table} record:`, error);
    return null;
  }
};

// Generic function to update a record
const updateRecord = async (table, recordId, fields) => {
  try {
    const response = await airtableAPI(table).patch("/", {
      records: [{ id: recordId, fields }],
    });
    return response.data.records[0];
  } catch (error) {
    console.error(`Error updating ${table} record:`, error);
    return null;
  }
};

// Specific functions for your tables

// Plants
export const fetchPlants = () => fetchRecords(TABLES.PLANTS);
export const fetchPlantById = (id) => fetchRecord(TABLES.PLANTS, id);
export const addPlant = (plant) => addRecord(TABLES.PLANTS, plant);

// Issue Types
export const fetchIssueTypes = () => fetchRecords(TABLES.ISSUE_TYPES);
export const fetchIssueTypeById = (id) => fetchRecord(TABLES.ISSUE_TYPES, id);

// Plant-Specific Issues
export const fetchPlantIssues = () => fetchRecords(TABLES.PLANT_ISSUES);
export const fetchPlantIssueById = (id) => fetchRecord(TABLES.PLANT_ISSUES, id);
export const fetchPlantIssuesByPlant = async (plantId) => {
  try {
    const formula = encodeURIComponent(`{Plant} = '${plantId}'`);
    const response = await airtableAPI(TABLES.PLANT_ISSUES).get(`?filterByFormula=${formula}`);
    return response.data.records;
  } catch (error) {
    console.error("Error fetching plant issues by plant:", error);
    return [];
  }
};

// Users
export const fetchUsers = () => fetchRecords(TABLES.USERS);
export const fetchUserById = (id) => fetchRecord(TABLES.USERS, id);
export const fetchUserByName = async (name) => {
  try {
    const formula = encodeURIComponent(`{Name} = '${name}'`);
    const response = await airtableAPI(TABLES.USERS).get(`?filterByFormula=${formula}`);
    return response.data.records.length > 0 ? response.data.records[0] : null;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
};
export const addUser = (user) => addRecord(TABLES.USERS, user);

// Scan History
export const fetchScans = () => fetchRecords(TABLES.SCANS);
export const fetchScanById = (id) => fetchRecord(TABLES.SCANS, id);
export const fetchScansByUser = async (userId) => {
  try {
    // Filter records where the linked User field matches userId
    const formula = encodeURIComponent(`{User} = '${userId}'`);
    const response = await airtableAPI(TABLES.SCANS).get(`?filterByFormula=${formula}&sort%5B0%5D%5Bfield%5D=Scan_Date&sort%5B0%5D%5Bdirection%5D=desc`);
    return response.data.records;
  } catch (error) {
    console.error("Error fetching scans by user:", error);
    return [];
  }
};

export const addScan = async (scan) => {
  // Add a record to the Scan_History table
  return addRecord(TABLES.SCANS, scan);
};

// Attempt to convert an image file to a base64 string for Airtable
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to prepare image for Airtable upload
export const prepareImageForUpload = async (imageFile) => {
  try {
    const base64 = await fileToBase64(imageFile);
    return [
      {
        url: base64,
        filename: imageFile.name,
      },
    ];
  } catch (error) {
    console.error("Error preparing image for upload:", error);
    return null;
  }
};