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