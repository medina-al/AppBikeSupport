import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//GET SINGLE OR ALL ASSISTS
export async function getAssist(userId, userType, assistId) {
  console.log("Get Assists service", apiBaseUrl);
  try {
    const url = assistId
      ? `${apiBaseUrl}assists/${userId}/${userType}/${assistId}`
      : `${apiBaseUrl}assists/${userId}/${userType}/`;
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//GET OPEN ASSISTS
export async function getOpenAssists(userId) {
  console.log("Get close Assists services", apiBaseUrl);
  try {
    const { data } = await axios.get(`${apiBaseUrl}assists/open/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//ASSIGN ASSIST
export async function assignAssist(assistId,userId) {
  console.log("Accept assist service", apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}assists/assign/${assistId}/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//CLOSE ASSIST
export async function closeAssist(assistId,body) {
  console.log("Close assist service", apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}assists/close/${assistId}/`,body);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//CANCEL ASSIST
export async function cancelAssist(assistId,body) {
  console.log("Cancel assist service", apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}assists/cancel/${assistId}/`,body);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//CREATE NEW ASSIST
export async function createAssist(body) {
  console.log("Create Assists service");
  try {
    const { data } = await axios.post(
      `${apiBaseUrl}assists/`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//RATE ASSIST
export async function rateAssist(assistId,body) {
  console.log("Rate assist service", apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}assists/rate/${assistId}/`,body);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
