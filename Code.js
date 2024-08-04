// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataToDiscord() {
  var rawData = getTrippleLuckRawData();
  var content_text = convertWinnerLotteryData(rawData);
  content_text += "\n\n" + convertWinnersListData(rawData);

  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
  saveDataToSpreadsheet(jsonData)

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

function saveDataToSpreadsheet(jsonData) {
  // 스프레드시트 ID를 여기에 입력하세요.
  const spreadsheetId = id_spreadsheet_tripleLuckData;

  // 접근할 시트 이름을 지정하세요.
  const sheetName = 'Sheet1';
  
  // 스프레드시트를 열고 시트를 선택합니다.
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  // 현재 시트에 있는 모든 데이터를 가져옵니다.
  const existingData = sheet.getDataRange().getValues();
  
  // 시트의 데이터가 없는 경우, 헤더만 추가하고 끝냅니다.
  if (existingData.length === 0) {
    sheet.appendRow(['date', 'id', 'prize_money']);
  }
  
  // 기존 데이터에서 마지막 줄부터 시작하여 중복 항목을 확인합니다.
  const existingEntries = new Set(existingData.slice(1).map(row => row.join(',')));

  // 새로운 데이터에서 중복을 피하고 추가해야 할 항목을 필터링합니다.
  const newEntries = jsonData
    .map(item => [item.date, item.user, item.amount])
    .filter(row => !existingEntries.has(row.join(',')));
  
  // 필터링된 항목을 시트에 추가합니다. 역순으로 추가합니다.
  for (let i = newEntries.length - 1; i >= 0; i--) {
    sheet.appendRow(newEntries[i]);
  }

  // 성공적으로 저장되었음을 로그에 기록합니다.
  Logger.log('Data successfully saved to the spreadsheet.');
}
