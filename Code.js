// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataToDiscord() {
  var matches = getTrippleLuckData();
  if (matches) {
    var data1 = matches[1]; // 1등 당첨 현황
    var data2 = matches[2]; // 판매수량
    var data3 = matches[3]; // 판매율

    var splitdata = data1.split("/");

    var left_winners = Number(splitdata[1].replace(/[^0-9]/g, '')) - Number(splitdata[0].replace(/[^0-9]/g, ''))
    var left_winners = 1
    var sale_count = Number(data2.replace(/[^0-9]/g, ''))
    var percentage = computingWinning(left_winners, sale_count);

    var point_winner = (percentage*1000000).toFixed(2)

    var content_text = `\`당첨\` : ${data1}        \`판매수량\` : ${data2}        \`판매율\` : ${data3}\n\n\`당첨지수\` : ${point_winner}\n\n[링크](https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21)`
    
    // Send the data to Discord
    sendToDiscord(content_text);
  } else {
    Logger.log('No matching data found');
  }
}

function getTrippleLuckData() {
  var url = 'https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21';
  
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText("EUC-KR"); // 인코딩을 EUC-KR로 지정
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  
  // Use regex to extract the specific <tr> content
  var regex = /<tbody>[\s\S]*?<tr>[\s\S]*?<td.*?>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>[\s\S]*?<\/tbody>/;

  return document.match(regex)

}


function computingWinning(total_winners, total_sales) {
  return total_winners / (15000000 - total_sales)
}


function sendToDiscord(content_text) {
  var discordUrl = discord_hook_url; // Replace with your Discord webhook URL
  var payload = {
    content: content_text
  };
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(discordUrl, options);
}
