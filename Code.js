function scrapeLottoDataToDiscord() {
  var url = 'https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21';
  
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText("EUC-KR"); // 인코딩을 EUC-KR로 지정
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  
  // Use regex to extract the specific <tr> content
  var regex = /<tbody>[\s\S]*?<tr>[\s\S]*?<td.*?>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>[\s\S]*?<\/tbody>/;
  var matches = document.match(regex);
  
  if (matches) {
    var data1 = matches[1]; // 1등 당첨 현황
    var data2 = matches[2]; // 판매수량
    var data3 = matches[3]; // 판매율
    
    // Send the data to Discord
    sendToDiscord(data1, data2, data3);
  } else {
    Logger.log('No matching data found');
  }
}


function sendToDiscord(data1, data2, data3) {
  var discordUrl = discord_hook_url; // Replace with your Discord webhook URL
  var payload = {
    content: `Data 1: ${data1}\nData 2: ${data2}\nData 3: ${data3}`
  };
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(discordUrl, options);
}
