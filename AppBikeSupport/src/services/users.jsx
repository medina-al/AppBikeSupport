import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;


//GET USERS
export async function getUsers(userId,type,status,publicAccount,publicBike) {
  console.log("Get user service: "+apiBaseUrl);
  try {
    let query="";
    if (type != null) query=query+"&type="+type;
    if (status != null) query=query+"&status="+status;
    if (publicAccount != null) query=query+"&publicAccount="+publicAccount;
    if (publicBike != null) query=query+"&publicBike="+publicBike;

    let url=(userId==null)?`${apiBaseUrl}users/?${query}`:`${apiBaseUrl}users/${userId}?${query}`;
    console.log(url);
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

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

//EDIT ACCOUNT
export async function editAccount(userId,body) {
  console.log("Edit account service: "+apiBaseUrl);
  try {
    const { data } = await axios.put(`${apiBaseUrl}users/editAccount/${userId}`, body, {
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
