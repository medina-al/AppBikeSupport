import axios from "axios";

//Get recommendations
export async function getRecommendations() {
  try {
    const { data } = await axios.get(`recommendations`);
    return data;
  } catch (error) {
    return error;
  }
}

//Create recommendation
export async function createRecommendation(body) {
  try {
    const { data } = await axios.post(`recommendations`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
}

//Edit recommendation
export async function editRecommendation(recId, body) {
  try {
    const { data } = await axios.put("recommendations/" + recId, body);
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}

//Handle recommendation images
export async function handleRecImage(recId, imageId, image) {
  try {
    let body = {};
    body.recommendation = image;
    const { data } = await axios.put(
      "recommendations/image/" + recId + "/" + imageId,
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
