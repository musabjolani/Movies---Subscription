const jsonFile = require("jsonfile");

const getAllFileData = async (filePath) => {
  try {
    return await jsonFile.readFile(filePath);
  } catch (error) {
    return []; // Return an empty array if the file does not exist
  }
};

const updateFile = async (filePath, data) => {
  console.log("data", data);
  await jsonFile.writeFile(filePath, data);
  return "File Updated";
};

module.exports = { getAllFileData, updateFile };
