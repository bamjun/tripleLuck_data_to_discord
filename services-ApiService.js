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

// extract static data from url
function dataCrawlingGetRawData(url) {
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  return document
}

function fetchPostData() {
  var url = "https://ols.semas.or.kr/ols/man/SMAN051M/search.do";
  
  var payload = {
    "bltwtrTitNm": "",
    "searchStd": "1",
    "pageNo": "1",
    "type": "1"
  };

  var options = {
    "method": "post",
    "payload": payload,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var content = response.getContentText('UTF-8');
    return content;
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}
