// 스프레드시트에서 제일마지막부터 N개 행 데이터 가져오기
// function getLastRow({spreadsheetId=id_spreadsheet_tripleLuckData, sheetName=new Date().getFullYear(), row=8})

// 스프레드시트에서 제일마지막부터 N개 행 데이터 가져오기
function getLastRow({spreadsheetId = id_spreadsheet_tripleLuckData, sheetName = new Date().getFullYear(), row = 8}) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(String(sheetName));
  var lastRow = sheet.getLastRow();
  var last5Rows = sheet.getRange(lastRow-row+1, 1, row, sheet.getLastColumn()).getValues();
  return last5Rows;
}




function addJsonDataToSheetById({spreadsheetId="", sheetName="", jsonData=""}) {
  // 스프레드시트 불러오기
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  // 시트가 없으면 생성
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  sheet.clear();

  var data = jsonData.result;

  // 데이터 추가
  data.forEach(function(item) {
    sheet.appendRow([
      item.rnum,
      item.bltwtrTitNm,
      item.bltwtrClcd,
      item.bltwtrSeq,
      item.bbsTypeCd,
      item.loanSeCdNm,
      item.bbsFxnYn || "", // 값이 없을 경우 빈 문자열
      item.frstRegDt
    ]);
  });

  Logger.log("데이터가 성공적으로 추가되었습니다!");
}
