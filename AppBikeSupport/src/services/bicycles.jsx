import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//CREATE BICYCLE
export async function createBicycle(body) {
  console.log("Create bicycle services: "+apiBaseUrl);
  try {
    const { data } = await axios.post(`${apiBaseUrl}bicycles/createBicycle`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//EDIT BICYCLE
export async function editBicycle(userId,body) {
  console.log("Edit bicycle service: "+apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}bicycles/editBicycle/${userId}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}