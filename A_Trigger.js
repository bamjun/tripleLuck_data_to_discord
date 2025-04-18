// git clone https://github.com/bamjun/tripleLuck_data_to_discord.git
// clasp clone "1jhHQfXReVhr4X2qA_eTPGh630v6El_k3qj038at9EBpN2tD4yK2B9DPv"

function scrapeLottoDataToDiscord() {
  var rawData = getTrippleLuckRawData();
  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));

  var check_create_data = saveDataToSpreadsheet(jsonData, rawData)

  var lastRowData = getLastRow({row: 1})[0];


  if (check_create_data == "no-create") {
    Logger.log("no-create")
    return;
  }


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



