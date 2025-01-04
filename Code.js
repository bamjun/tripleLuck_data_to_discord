// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataSaveToSpreadsheet() {
  var rawData = getTrippleLuckRawData();
  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
  saveDataToSpreadsheet(jsonData, rawData)
}


function scrapeLottoDataToDiscord() {
  var rawData = getTrippleLuckRawData();
  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
  saveDataToSpreadsheet(jsonData, rawData)

  var lastRowData = getLastRow({row: 1})[0];
  
  if (parseInt(lastRowData[9]) == 0 || parseInt(lastRowData[9]) % 2 != 0) {
    return;
  }
  if ((parseInt(lastRowData[9]) == 2 && parseInt(lastRowData[10]) == 1) || (parseInt(lastRowData[9]) == 4 && parseInt(lastRowData[10]) == 2) || (parseInt(lastRowData[9]) == 6 && parseInt(lastRowData[10]) == 3) || (parseInt(lastRowData[9]) == 8 && parseInt(lastRowData[10]) == 4)) {
    return;
  }
  
  var content_text = `\`${lastRowData[4]} - ${lastRowData[5]}\` [❇️링크](${getTrippleLuckRawData_URL})  [❇️시트](${url_spreadsheet_tripleLuckData})\n \`10만원 - ${lastRowData[6]}번\`\n \`100만원 - ${lastRowData[7]}번\`\n \`500만원 - ${lastRowData[8]}번\`\n \`1억원 - ${lastRowData[9]}번\`\n \`5억원 - ${lastRowData[10]}번\`\n`;
  content_text += "\`\`\`\n \n\`\`\`" + convertWinnersListData(rawData);
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

  
  var lastRowData_8 = getLastRow({row: 8});

  // jsonData를 배열로 변환
  let jsonArray = JSON.parse(JSON.stringify(jsonData));
  
  // lastRowData_8의 각 행에 대해 검사
  outerLoop: for (let i = 7; i >= 0; i--) {
    const existingRow = lastRowData_8[i];
    
    // jsonArray의 각 항목에 대해 검사
    for (let j = 0; j < jsonArray.length; j++) {
      const item = jsonArray[j];
      
      // date, amount, user가 모두 일치하는지 확인
      if (item.date === existingRow[0] && 
          item.amount === existingRow[3] && 
          item.user === existingRow[2]) {
        
        // 일치하는 항목이 있으면 해당 인덱스까지의 모든 항목 제거
        jsonArray.splice(j, 7);
        break outerLoop;  // 외부 루프도 종료
      }
    }
  }
  
  // 필터링된 jsonArray를 다시 jsonData에 할당
  jsonData = jsonArray;

  var lastRowData = lastRowData_8[7];



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
