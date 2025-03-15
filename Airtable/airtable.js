import axios from "axios";

const AIRTABLE_PAT = process.env.REACT_APP_AIRTABLE_PAT;  // Replace with your actual token
const AIRTABLE_BASE_ID = "appK4c7AaDouGVGbz"

const airtableAPI = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${"Plants"}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_PAT}`,
    "Content-Type": "application/json",
  },
});

// Fetch records
export const fetchPlants = async () => {
  try {
    const response = await airtableAPI.get();
    return response.data.records;  // Returns an array of records
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Add a new plant
export const addPlant = async (newPlant) => {
  try {
    const response = await airtableAPI.post("/", {
      records: [{ fields: newPlant }],
    });
    return response.data;
  } catch (error) {
    console.error("Error adding data:", error);
    return null;
  }
};
