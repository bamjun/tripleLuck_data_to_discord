// 트리플럭 사이트에서 raw데이터 가져오기
// function getTrippleLuckRawData()

// extract static data from url
// function dataCrawlingGetRawData(url)

// 트리플럭 사이트에서 raw데이터 가져오기

/**
 * Workers에서 JSON 받아서 "document"만 반환
 */
function getTrippleLuckRawData() {
  const res = UrlFetchApp.fetch(WORKER_URL, {
    method: 'get',
    headers: { 'Accept': 'application/json' },
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('Request failed: ' + code + ' / ' + res.getContentText());
  }

  const data = JSON.parse(res.getContentText()); // UTF-8 JSON
  return data.document || '';
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

// post https://ols.semas.or.kr/ols/man/SMAN051M/search.do


// bltwtrTitNm=&searchStd=1&pageNo=1&type=1




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
