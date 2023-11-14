import axios from "axios";
import { getCookie } from "./user";

//Login
export async function getAssists(assistId) {
  try {
    const userId = await getCookie("userId");
    const userType = await getCookie("userType");
    const url = assistId
    ? `assists/${userId}/${userType}/${assistId}`
    : `assists/${userId}/${userType}/`;
    
    const { data } = await axios.get(url);
    console.log(data)
    return data;
  } catch (error) {
    return error;
  }
}