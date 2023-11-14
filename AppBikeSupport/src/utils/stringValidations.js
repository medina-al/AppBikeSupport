export function validateStringLength(field, inputString, length, type) {
  if (type === "min") {
    if(inputString.length >= length){
        return "OK";
    }else{
        return field+ " debe ser de al menos "+length+" carácteres";
    }
  } else if (type === "max") {
    if(inputString.length <= length){
        return "OK";
    }else{
        return field+ " debe ser máximo de "+length+" carácteres";
    }
  } else if(type==="exact"){
    if(inputString.length == length){
        return "OK";
    }else{
        return field+ " debe ser exactamente de "+length+" carácteres";
    }
  }
}

export function validateEmail(email) {
  const regExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (regExp.test(email)) {
    return true;
  } else {
    return false;
  }
}
