import axios, { AxiosResponse } from "axios";

// Define types for the response data from Airtable
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface AirtableResponse<T> {
  records: T[];
}

// Environment variables
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || "YOUR_API_KEY";
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "appK4c7AaDouGVGbz";

// Table names as defined in the Airtable base
const TABLES = {
  PLANTS: "Plants",
  ISSUE_TYPES: "Issue_Types",
  PLANT_ISSUES: "Plant_Specific_Issues",
  USERS: "Users",
  SCANS: "Scan History",
};

// Create a base axios instance for Airtable API
const airtableAPI = (table: string) =>
  axios.create({
    baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

// Generic functions to fetch records from any table
const fetchRecords = async <T>(table: string): Promise<T[]> => {
  try {
    const response: AxiosResponse<AirtableResponse<T>> = await airtableAPI(table).get(
      "?view=Grid%20view"
    );
    return response.data.records || [];
  } catch (error) {
    console.error(`Error fetching ${table} data:`, error);
    return [];
  }
};

// Generic function to fetch a single record
const fetchRecord = async <T>(table: string, recordId: string): Promise<T | null> => {
  try {
    const response: AxiosResponse<AirtableRecord> = await airtableAPI(table).get(`/${recordId}`);
    if (response.data && response.data.id) {
      return { id: response.data.id, fields: response.data.fields } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${table} record:`, error);
    return null;
  }
};

// Generic function to add a record to any table
const addRecord = async <T>(table: string, fields: Record<string, any>): Promise<T | null> => {
  try {
    const response: AxiosResponse<AirtableResponse<T>> = await airtableAPI(table).post("/", {
      records: [{ fields }],
    });
    return response.data.records.length > 0 ? response.data.records[0] : null;
  } catch (error) {
    console.error(`Error adding ${table} record:`, error);
    return null;
  }
};

// Generic function to update a record
const updateRecord = async <T>(
  table: string,
  recordId: string,
  fields: Record<string, any>
): Promise<T | null> => {
  try {
    const response: AxiosResponse<AirtableResponse<T>> = await airtableAPI(table).patch("/", {
      records: [{ id: recordId, fields }],
    });
    return response.data.records.length > 0 ? response.data.records[0] : null;
  } catch (error) {
    console.error(`Error updating ${table} record:`, error);
    return null;
  }
};

// Specific functions for your tables

// Plants
export const fetchPlants = async (): Promise<AirtableRecord[]> => fetchRecords(TABLES.PLANTS);
export const fetchPlantById = async (id: string): Promise<AirtableRecord | null> =>
  fetchRecord(TABLES.PLANTS, id);
export const addPlant = async (plant: Record<string, any>): Promise<AirtableRecord | null> =>
  addRecord(TABLES.PLANTS, plant);

// Issue Types
export const fetchIssueTypes = async (): Promise<AirtableRecord[]> => fetchRecords(TABLES.ISSUE_TYPES);
export const fetchIssueTypeById = async (id: string): Promise<AirtableRecord | null> =>
  fetchRecord(TABLES.ISSUE_TYPES, id);

// Plant-Specific Issues
export const fetchPlantIssues = async (): Promise<AirtableRecord[]> =>
  fetchRecords(TABLES.PLANT_ISSUES);
export const fetchPlantIssueById = async (id: string): Promise<AirtableRecord | null> =>
  fetchRecord(TABLES.PLANT_ISSUES, id);
export const fetchPlantIssuesByPlant = async (plantId: string): Promise<AirtableRecord[]> => {
  try {
    const formula = encodeURIComponent(`{Plant} = '${plantId}'`);
    const response = await airtableAPI(TABLES.PLANT_ISSUES).get(`?filterByFormula=${formula}`);
    return response.data.records.length > 0 ? response.data.records : [];
  } catch (error) {
    console.error("Error fetching plant issues by plant:", error);
    return [];
  }
};

// Users
export const fetchUsers = async (): Promise<AirtableRecord[]> => fetchRecords(TABLES.USERS);
export const fetchUserById = async (id: string): Promise<AirtableRecord | null> =>
  fetchRecord(TABLES.USERS, id);
export const fetchUserByName = async (name: string): Promise<AirtableRecord | null> => {
  try {
    const formula = encodeURIComponent(`{Name} = '${name}'`);
    const response = await airtableAPI(TABLES.USERS).get(`?filterByFormula=${formula}`);
    return response.data.records.length > 0 ? response.data.records[0] : null;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
};
export const addUser = async (user: Record<string, any>): Promise<AirtableRecord | null> =>
  addRecord(TABLES.USERS, user);

// Scan History
export const fetchScans = async (): Promise<AirtableRecord[]> => fetchRecords(TABLES.SCANS);
export const fetchScanById = async (id: string): Promise<AirtableRecord | null> =>
  fetchRecord(TABLES.SCANS, id);
export const fetchScansByUser = async (userId: string): Promise<AirtableRecord[]> => {
  try {
    const formula = encodeURIComponent(`{User} = '${userId}'`);
    const response = await airtableAPI(TABLES.SCANS).get(
      `?filterByFormula=${formula}&sort%5B0%5D%5Bfield%5D=Scan_Date&sort%5B0%5D%5Bdirection%5D=desc`
    );
    return response.data.records.length > 0 ? response.data.records : [];
  } catch (error) {
    console.error("Error fetching scans by user:", error);
    return [];
  }
};

export const addScan = async (scan: Record<string, any>): Promise<AirtableRecord | null> =>
  addRecord(TABLES.SCANS, scan);

// Attempt to convert an image file to a base64 string for Airtable
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to prepare image for Airtable upload
export const prepareImageForUpload = async (imageFile: File): Promise<{ url: string; filename: string }[] | null> => {
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