import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//CREATE ACCOUNT
export async function createAccount(body) {
  console.log("Create account services: "+apiBaseUrl);
  try {
    const { data } = await axios.post(`${apiBaseUrl}users/createAccount`, body, {
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

//VERIFY ACCOUNT
export async function verifyAccount(body) {
  console.log("Verify account service");
  try {
    const { data } = await axios.post(`${apiBaseUrl}users/verifyAccount`, body);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
