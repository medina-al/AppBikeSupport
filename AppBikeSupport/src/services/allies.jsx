import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//GET USERS
export async function getAllies(allyId,status) {
    console.log("Get allies service: "+apiBaseUrl);
    try {
      let query="";
      if (status != null) query=query+"&status="+status;
  
      let url=(allyId==null)?`${apiBaseUrl}allies/?${query}`:`${apiBaseUrl}users/${allyId}?${query}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  