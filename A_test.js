function a_test_1() {
    Logger.log(getLastRow({row: 8}))
}


function a_test_2() {
  var lastRowData = getLastRow({row: 1})[0];
  var rawData = getTrippleLuckRawData();
  var content_text = `\`${lastRowData[4]} - ${lastRowData[5]}\` [링크](${getTrippleLuckRawData_URL})\n \`10만원\`\n ${lastRowData[6]}번\n\n \`100만원\`\n ${lastRowData[7]}번\n\n \`500만원\`\n ${lastRowData[8]}번\n\n \`1억원\`\n ${lastRowData[9]}번\n\n \`5억원\`\n ${lastRowData[10]}번`;
  content_text += "\n\n" + convertWinnersListData(rawData);

  const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
  Logger.log(jsonData)
  // saveDataToSpreadsheet(jsonData, rawData)

  Logger.log(content_text);
}




// Logger.log(getLastRow({row: 8}))
// [[2024.12.31, Sat Dec 30 01:21:52 GMT+08:27 1899, tjd**5, 100,000원, 2025년, 1차, 0.0, 0.0, 0.0, 0.0, 0.0, f], [2024.12.31, Sat Dec 30 01:21:52 GMT+08:27 1899, h34**3, 1,000,000원, 2025년, 1차, 0.0, 0.0, 0.0, 0.0, 0.0, f], [2024.12.31, Sat Dec 30 01:21:52 GMT+08:27 1899, s2n**2, 100,000원, 2025년, 1차, 0.0, 0.0, 0.0, 0.0, 0.0, f], [2024.12.31, Sat Dec 30 01:21:52 GMT+08:27 1899, bju**5, 1,000,000원, 2025년, 1차, 0.0, 0.0, 0.0, 0.0, 0.0, f], [2025.01.02, Sat Dec 30 11:57:52 GMT+08:27 1899, skw**3, 100,000원, 2025년, 1차, 1.0, 0.0, 0.0, 0.0, 0.0, f], [2025.01.02, Sat Dec 30 15:57:52 GMT+08:27 1899, kdj**7, 100,000원, 2025년, 1차, 3.0, 1.0, 0.0, 0.0, 0.0, f], [2025.01.02, Sat Dec 30 15:57:52 GMT+08:27 1899, pio**4, 100,000원, 2025년, 1차, 3.0, 1.0, 0.0, 0.0, 0.0, f], [2025.01.02, Sat Dec 30 15:57:52 GMT+08:27 1899, pd3**2, 1,000,000원, 2025년, 1차, 3.0, 1.0, 0.0, 0.0, 0.0, f]]



// var rawData = getTrippleLuckRawData();
// const jsonData = JSON.parse(convertWinnersListDataJson(rawData));
// Logger.log(jsonData)
// [{prize_year=2025년, prize_number=1차, amount=100,000원, date=2025.01.02, time=18:05, user=cha**0}, {prize_year=2025년, date=2025.01.02, prize_number=1차, time=18:05, user=pd3**2, amount=1,000,000원}, {user=pio**4, prize_year=2025년, date=2025.01.02, time=18:05, amount=100,000원, prize_number=1차}, {date=2025.01.02, time=18:05, prize_number=1차, prize_year=2025년, user=kdj**7, amount=100,000원}, {amount=100,000원, prize_number=1차, prize_year=2025년, user=skw**3, time=18:05, date=2025.01.02}, {date=2024.12.31, time=18:05, amount=1,000,000원, prize_number=1차, user=bju**5, prize_year=2025년}, {user=s2n**2, date=2024.12.31, prize_number=1차, time=18:05, prize_year=2025년, amount=100,000원}, {prize_number=1차, prize_year=2025년, time=18:05, date=2024.12.31, amount=1,000,000원, user=h34**3}]