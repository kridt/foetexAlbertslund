import * as XLSX from "xlsx";

export default function excelToJson(file) {
  // Create a new FileReader object
  const reader = new FileReader();

  // Convert the Excel file to a binary string
  reader.readAsBinaryString(file);

  // When the file is converted, run this code
  reader.onload = function (event) {
    // Create a new XLSX object
    const workbook = XLSX.read(event.target.result, {
      type: "binary",
    });

    // Get the first sheet (by index)
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet to JSON format
    const json = XLSX.utils.sheet_to_json(sheet);

    // Log the JSON object to the console
    localStorage.setItem("potentielNewDatabase", JSON.stringify(json));
    console.log("localstorage set");
    return json;
  };
}
