import axios from "axios";
import { getCookie } from "./user";

//Get allies
export async function getAllies(allyId) {
  try {
    //const userId = await getCookie("userId");
    const url = allyId ? `allies/${allyId}` : `allies`;
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}

//Get ally by userId
export async function getAllyByUser() {
  try {
    const userId = await getCookie("userId");
    const { data } = await axios.get(`allies/user/${userId}`);
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}

//Create ally
export async function createAlly(body) {
  try {
    const { data } = await axios.post(`allies`, body);
    return data;
  } catch (error) {
    return error;
  }
}

//Edit ally
export async function editAlly(allyId, body) {
  try {
    const { data } = await axios.put("allies/" + allyId, body);
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}

//Associate user to ally
export async function associateUser(allyId, userId, userType) {
  try {
    const { data } = await axios.put(
      "allies/" + allyId + "/" + userId + "/" + userType
    );
    return data;
  } catch (error) {
    return error;
  }
}

//Handle ally images
export async function handleAllyImage(allyId, imageId, image) {
  try {
    let body={};
    body.ally = image;
    const { data } = await axios.post(
      "allies/image/" + allyId + "/" + imageId,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
}
