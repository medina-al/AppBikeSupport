import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//GET ALL OR A SINGLE LIST
export async function getLists(global) {
    console.log("Get lists services");
  try {
    const { data } = await axios.get(`${apiBaseUrl}listsMaster/${global}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
