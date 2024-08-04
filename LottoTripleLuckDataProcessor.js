// getTrippleLuckRawData()
// 트리플럭 사이트에서 raw데이터 가져오기

// convertWinnerLotteryData(rawData)
// 트리플럭 raw데이터를 당첨자 정보만 추출

// convertWinnersListData(rawData)
// 트리플럭 raw데이터에서 당첨자 리스트 추출



// 트리플럭 사이트에서 raw데이터 가져오기
function getTrippleLuckRawData() {
  var url = 'https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21';
  
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText("EUC-KR"); // 인코딩을 EUC-KR로 지정
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  return document
}


// 트리플럭 raw데이터를 당첨자 정보만 추출
function convertWinnerLotteryData(rawData) {
  // Use regex to extract the specific <tr> content
  var regex = /<tbody>[\s\S]*?<tr>[\s\S]*?<td.*?>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>[\s\S]*?<\/tbody>/;
  var matches = rawData.match(regex)

  if (matches) {
    var data_json = {"winners": matches[1], "sale": matches[2], "sale_percent": matches[3]}
    var splitWinnersData = data_json["winners"].split("/");

    var winners = Number(splitWinnersData[0].replace(/[^0-9]/g, ''));
    var sale_count = Number(data_json["sale"].replace(/[^0-9]/g, ''));
    var percentage = 1 / (3750000 * (winners + 1) - sale_count) * 100


    var point_winner = (percentage*10000).toFixed(2)

    var content_text = `\`당첨\` : ${data_json["winners"]}        \`판매수량\` : ${data_json["sale"]}\n\n\`당첨지수\` : ${point_winner}        \`판매율\` : ${data_json["sale_percent"]}\n\n[링크](https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21)`

    return content_text

  } else {
    Logger.log('No matching data found');
    return "No matching data found"
  }
}


// 트리플럭 raw데이터에서 당첨자 리스트 추출
function convertWinnersListData(rawData) {
  // Extract the content within the class="list"
  var listContent = rawData.match(/<div class="list">([\s\S]*?)<\/div>/);
  
  if (listContent) {
    // Extract the <li> elements within the class="list"
    var listItems = listContent[1].match(/<li>[\s\S]*?<\/li>/g);
    
    var data = [];
    for (var i = 0; i < listItems.length; i++) {
      var date = listItems[i].match(/<span>(.*?)<\/span>/)[1];
      var user = listItems[i].match(/<span>(.*?)<\/span>/g)[1].replace(/<span>|<\/span>/g, '');
      var amount = listItems[i].match(/<strong>(.*?)<\/strong>/)[1];
      
      data.push({ date: date, user: user, amount: amount });
    }
    
    // Convert the data array to the desired string format
    var result = data.map(item => `\`${item.date}\` \`${item.user}\` \`${item.amount}\``).join('\n');

    // Optionally, return the formatted string
    return result;
  } else {
    Logger.log('No list found with class="list".');
    return 'No list found';
  }
}


// 트리플럭 raw데이터에서 당첨자 리스트 추출 json 으로 반환
function convertWinnersListDataJson(rawData) {
  // Extract the content within the class="list"
  var listContent = rawData.match(/<div class="list">([\s\S]*?)<\/div>/);
  
  if (listContent) {
    // Extract the <li> elements within the class="list"
    var listItems = listContent[1].match(/<li>[\s\S]*?<\/li>/g);
    
    var data = [];
    for (var i = 0; i < listItems.length; i++) {
      var date = listItems[i].match(/<span>(.*?)<\/span>/)[1];
      var user = listItems[i].match(/<span>(.*?)<\/span>/g)[1].replace(/<span>|<\/span>/g, '');
      var amount = listItems[i].match(/<strong>(.*?)<\/strong>/)[1];
      
      data.push({ date: date, user: user, amount: amount });
    }
    
    // JSON 형식으로 데이터를 반환합니다.
    return JSON.stringify(data, null, 2);
  } else {
    Logger.log('No list found with class="list".');
    return JSON.stringify({ error: 'No list found' });
  }
}