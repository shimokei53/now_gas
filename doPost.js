function doPost(e) {
  var verificationToken = e.parameter.token;
  if (verificationToken != PropertiesService.getScriptProperties().getProperty("verificationToken")) {
     throw new Error('Invalid token');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var username = e.parameter.user_name;
  var sheet = ss.getSheetByName(username);
  if (!sheet) {
    var template = ss.getSheetByName('template');
    var sheet = template.copyTo(ss);
    sheet.setName(username)
    sheet.showSheet();
  }

  var params = e.parameter.text.split(' ');
  var today = new Date();  

  sheet.insertRowBefore(1);
  sheet.getRange('A1:B1').setNumberFormats([['yyyy/MM/dd','HH:mm:ss']]);
  sheet.getRange('A1:E1').setValues([[today,today,params[0],"",""]]);
  sheet.getRange('D2:E2').setValues([["=B1-B2", "=D2"]]);
  var url = ss.getUrl() + "#gid=" + sheet.getSheetId();
  var response = {
    "response_type": "in_channel",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": params[0]
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "SpreadSheetsで確認"
          },
          "url": url
        }
      }
    ]
  };
  
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
