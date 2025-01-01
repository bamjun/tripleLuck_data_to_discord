// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataToDiscord() {
  var lastRowData = getLastRow({});
  var rawData = getTrippleLuckRawData();
  var content_text = `${lastRowData[4]} - ${lastRowData[5]} 10만원\n ${lastRowData[6]}번\n\n 100만원\n ${lastRowData[7]}번\n\n 500만원\n ${lastRowData[8]}번\n\n 1억원\n ${lastRowData[9]}번\n\n 5억원\n ${lastRowData[10]}번`;
  content_text += "\n\n" + convertWinnersListData(rawData);

  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
  saveDataToSpreadsheet(jsonData, rawData)

  sendToDiscord(content_text);
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

function saveDataToSpreadsheet(jsonData, rawData) {
  var tbodyRegex = /<tbody[^>]*>[\s\S]*?<tr>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<td[^>]*>(.*?)<\/td>/;
  var tbodyMatch = rawData.match(tbodyRegex);
  
  var prize_times = tbodyMatch ? tbodyMatch[4] : ''; // 해당회차에서 몇번 당첨 됐는지

  // 스프레드시트 ID를 여기에 입력하세요.
  const spreadsheetId = id_spreadsheet_tripleLuckData;

  // 접근할 시트 이름을 지정하세요.
  const sheetName = `${new Date().getFullYear()}`;

  // 스프레드시트를 열고 시트를 선택합니다.
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(['date', 'time', 'id', 'prize_money', 'prize_year', 'prize_number', '100k', '1m', '5m', '100m', '500m', 'read']);
  }


  var lastRowData = getLastRow({});
  if (lastRowData[6] == '100k') {
    lastRowData[6] = 0;
  }
  if (lastRowData[7] == '1m') {
    lastRowData[7] = 0;
  }
  if (lastRowData[8] == '5m') {
    lastRowData[8] = 0;
  }
  if (lastRowData[9] == '100m') {
    lastRowData[9] = 0;
  }
  if (lastRowData[10] == '500m') {
    lastRowData[10] = 0;
  }


  // 당첨금액별 카운트를 계산
  const counts = {
    '100k': lastRowData[6],
    '1m': lastRowData[7],
    '5m': lastRowData[8],
    '100m': lastRowData[9],
    '500m': lastRowData[10]
  };

  jsonData.forEach(item => {
    const amount = item.amount;
    switch(amount) {
      case '100,000원':
        counts['100k']++;
        break;
      case '1,000,000원':
        counts['1m']++;
        break;
      case '5,000,000원':
        counts['5m']++;
        break;
      case '100,000,000원':
        counts['100m']++;
        break;
      case '500,000,000원':
        counts['500m']++;
        break;
    }
  });


  var read = 'f';
  if (lastRowData[11] == 't' || prize_times == 3) {
    read = 't';
  } 

  if (read == 't') {
    if (prize_times == 0) {
      counts['100k'] = 0;
      counts['1m'] = 0;
      counts['5m'] = 0;
      counts['100m'] = 0;
      counts['500m'] = 0;
    }
  }

  // jsonData의 각 항목에 카운트 정보 추가
  jsonData = jsonData.map(item => ({
    ...item,
    '100k': counts['100k'],
    '1m': counts['1m'],
    '5m': counts['5m'],
    '100m': counts['100m'],
    '500m': counts['500m'],
    'read': read
  }));

  
  
  // 현재 시트에 있는 모든 데이터를 가져옵니다.
  const existingData = sheet.getDataRange().getValues();
  
  // 시트의 데이터가 없는 경우, 헤더만 추가하고 끝냅니다.
  if (existingData.length === 0) {
    sheet.appendRow(['date', 'time', 'id', 'prize_money', 'prize_year', 'prize_number', '100k', '1m', '5m', '100m', '500m', 'read']);
  }
  
  // 기존 데이터에서 마지막 줄부터 시작하여 중복 항목을 확인합니다.
  // time 컬럼을 제외하고 비교하기 위해 인덱스 0,2,3만 사용
  const existingEntries = new Set(existingData.slice(1).map(row => 
    [row[0], row[2], row[3]].join(',')
  ));

  // 새로운 데이터에서 중복을 피하고 추가해야 할 항목을 필터링합니다.
  const newEntries = jsonData
    .map(item => [item.date, item.time, item.user, item.amount, item.prize_year, item.prize_number, item['100k'], item['1m'], item['5m'], item['100m'], item['500m'], item['read']])
    .filter(row => !existingEntries.has([row[0], row[2], row[3]].join(',')));
  
  // 필터링된 항목을 시트에 추가합니다. 역순으로 추가합니다.
  for (let i = newEntries.length - 1; i >= 0; i--) {
    sheet.appendRow(newEntries[i]);
  }

  // 성공적으로 저장되었음을 로그에 기록합니다.
  Logger.log('Data successfully saved to the spreadsheet.');
}
