/**
 * 주어진 데이터를 기반으로 디스코드 메시지를 포맷팅합니다.
 * @param {Object} lastRowData - 스프레드시트의 마지막 행 데이터
 * @param {string} rawData - 원본 데이터
 * @param {string} getTrippleLuckRawData_URL - 트리플럭 데이터 URL
 * @param {string} url_spreadsheet_tripleLuckData - 스프레드시트 URL
 * @returns {string} 포맷팅된 디스코드 메시지
 */
function formatDiscordMessage(lastRowData, rawData, getTrippleLuckRawData_URL, url_spreadsheet_tripleLuckData) {
  // 메시지 포맷

  const percentage_100k = (lastRowData[6]/500*100).toFixed(2);
  const percentage_1m = (lastRowData[7]/200*100).toFixed(2);
  const percentage_5m = (lastRowData[8]/50*100).toFixed(2);
  const percentage_100m = (lastRowData[9]/8*100).toFixed(2);
  const percentage_500m = (lastRowData[10]/4*100).toFixed(2);

  let content_text = `\`${lastRowData[4]} - ${lastRowData[5]}\`\n\n`;
  content_text += `\`10만원 - ${lastRowData[6]}번\`  ${percentage_100k}% \n`;
  content_text += `\`100만원 - ${lastRowData[7]}번\`  ${percentage_1m}% \n`;
  content_text += `\`500만원 - ${lastRowData[8]}번\`  ${percentage_5m}% \n`;
  content_text += `\`1억원 - ${lastRowData[9]}번\`  ${percentage_100m}% \n`;
  content_text += `\`5억원 - ${lastRowData[10]}번\`  ${percentage_500m}% \n`;
  content_text += "```\n```\n" + convertWinnersListData(rawData);
  content_text += `\n [❇️링크](${getTrippleLuckRawData_URL})  -  [❇️시트](${url_spreadsheet_tripleLuckData})`;

  return content_text;
}
