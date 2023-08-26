const { Console } = require("console");
const fs = require("fs");

function response(request_body, response_body, method) {
  var date_file = new Date();

  var log_date =
    date_file.getFullYear() +
    "-" +
    ("0" + (date_file.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date_file.getDate()).slice(-2) +
    "-" +
    ("0" + date_file.getHours()).slice(-2);

  const logger = new Console({
    stdout: fs.createWriteStream(
      `${process.env.LOGS_PATH}${log_date}_normal_log.txt`,
      { flags: "a" }
    ),
    stderr: fs.createWriteStream(
      `${process.env.LOGS_PATH}${log_date}_error_log.txt`,
      { flags: "a" }
    ),
    inspectOptions: {
      depth: null,
    },
  });

  var date = new Date();

  var log_date =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2) +
    "." +
    ("0" + date.getMilliseconds()).slice(-2);

  if (response_body.success == false) {
    message = "❌ Error ❌";
  } else {
    message = "😃 Success 😃";
  }
  log_final = {
    message,
    log_date,
    method,
    request_body,
    response_body,
  };
  if (method != "getLists") {
    if (response_body.success == false) {
      logger.error(log_final);
    } else {
      logger.log(log_final);
    }
  }
  if(method!='getLists') console.log(log_final);

  // if (response_body.status >= 200 && response_body.status < 300) success = true;
  return {
    title: response_body.title,
    data: response_body.data,
    status: response_body.status,
    success: response_body.status >= 200 && response_body.status < 300,
    // success: response_body.success,
  };
}
module.exports = response;
