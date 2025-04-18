function a_test2_1() {
  var jsonData = JSON.parse(fetchPostData()); // JSON 문자열을 JavaScript 객체로 변환
  jsonData.result.reverse(); 
  addJsonDataToSheetById({
    spreadsheetId: id_google_sheet_for_semas,
    sheetName: "direct",
    jsonData: jsonData
  });
}


function a_test2_2() {
  getLastRow({row: 1})[0];
}

function a_test2_3() {
  sheetName = new Date().getFullYear()
  Logger.log(String(sheetName))
}