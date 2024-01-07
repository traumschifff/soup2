function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parse the request body to get the JSON data
  var jsonData = JSON.parse(e.postData.contents);
  
  // Get the email from the parsed JSON
  var email = jsonData.email;
  
  var data = [new Date(), email];
  sheet.appendRow(data);
  
  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}