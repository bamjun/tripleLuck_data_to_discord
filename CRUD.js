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
