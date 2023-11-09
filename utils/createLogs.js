const path = require("path");
const date = require("date-and-time");

/**
 * This function will create a log file
 *
 * @param  {Array}   errors        Data to be printed
 * @param  {Array}   errors_details Error Details to be printed
 * @param  {string}  file_name     File's name
 * @param  {string}  folder_name   Folder name with sub path
 * @return {void}
 */
module.exports.createLogFile = async (
  fn,
  errors,
  errors_details,
  file_name = "log_",
  folder_name = "error_logs"
) => {
  const logpath = path.join(__dirname, "../logs/", folder_name);
  fs.mkdirSync(logpath, { recursive: true });

  const currentDate = new Date();
  const dateString = date.format(currentDate, "DD.MM.YYYY");
  file_name += `_${dateString}.log`;

  const formattedDate = date.format(currentDate, "MMMM D, YYYY, h:mm A");

  const remote_address = DevMode == "local" ? "localhost" : DevMode;

  let mode = `Mode: ${remote_address} \n`;
  let datetime = `Date: ${formattedDate} \n`;
  let function_name = `Function: ${fn} \n`;
  let message = `Error: ${errors} \n`;
  let details = `Error Details: ${errors_details} \n`;
  // Something to write to txt log
  const log = `-------START OF ERROR------\n
      ${mode} ${datetime} ${function_name} ${message} ${details}
      -------END OF ERROR------\n`;

  // Save string to log, use 'a' flag to append.
  fs.writeFileSync(path.join(logpath, file_name), log, { flag: "a" });
  return true;
};

