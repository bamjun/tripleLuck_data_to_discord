// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataToDiscord() {
  var rawData = getTrippleLuckRawData();
  var content_text = convertWinnerLotteryData(rawData);
  content_text += "\n\n" + convertWinnersListData(rawData);

  sendToDiscord(content_text);
}


function getTrippleLuckRawData() {
  var url = 'https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21';
  
  // Fetch the HTML content of the webpage
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText("EUC-KR"); // 인코딩을 EUC-KR로 지정
  
  // Parse the HTML using HtmlService
  var document = HtmlService.createHtmlOutput(html).getContent();
  return document
}

function convertWinnerLotteryData(rawData) {
  // Use regex to extract the specific <tr> content
  var regex = /<tbody>[\s\S]*?<tr>[\s\S]*?<td.*?>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>[\s\S]*?<\/tbody>/;
  var matches = rawData.match(regex)

  if (matches) {
    var data_json = {"winners": matches[1], "sale": matches[2], "sale_percent": matches[3]}
    var splitWinnersData = data_json["winners"].split("/");

    var left_winners = Number(splitWinnersData[1].replace(/[^0-9]/g, '')) - Number(splitWinnersData[0].replace(/[^0-9]/g, ''));
    var sale_count = Number(data_json["sale"].replace(/[^0-9]/g, ''));
    var percentage = left_winners / (15000000 - sale_count)

    var point_winner = (percentage*1000000).toFixed(2)

    var content_text = `\`당첨\` : ${data_json["winners"]}        \`판매수량\` : ${data_json["sale"]}\n\n\`당첨지수\` : ${point_winner}        \`판매율\` : ${data_json["sale_percent"]}\n\n[링크](https://dhlottery.co.kr/gameInfo.do?method=lottoMainView&lottoId=LI21)`

    return content_text

  } else {
    Logger.log('No matching data found');
    return "No matching data found"
  }
}

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
