// getTrippleLuckRawData()
// 트리플럭 사이트에서 raw데이터 가져오기

// 트리플럭 사이트에서 raw데이터 가져오기
function getTrippleLuckRawData() {
  var url = getTrippleLuckRawData_URL;
  
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText("EUC-KR"); // 인코딩을 EUC-KR로 지정
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  return document
}

// 스프레드시트에서 제일마지막부터 N개 행 데이터 가져오기
function getLastRow({spreadsheetId=id_spreadsheet_tripleLuckData, sheetName=new Date().getFullYear(), row=8}) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  var last5Rows = sheet.getRange(lastRow-row+1, 1, row, sheet.getLastColumn()).getValues();
  return last5Rows;
}