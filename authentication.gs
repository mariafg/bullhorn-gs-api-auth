var CLIENTID = "YOUR-CLIENTID-GOES-HERE";
var USER = "YOUR-USERNAME-GOES-HERE";//this is the username of the account with access to the API
var PASSWORD = "YOUR-PASSWORD-GOES-HERE"; //this is the password of the account with access to the API
var SECRET = "YOUR-SECRET-GOES-HERE";
var TOKEN = "";
var CODE = "";
var REFRESH = "";

function getAuthorisation() {
  // got inspiration form here: https://github.com/g105b/bullhorn/blob/master/api/auth.php
  var data = {
    "response_type" : "code",
    "client_id" : CLIENTID,
    "username" : USER,
    "password" : PASSWORD,
    "action" : "Login",
  };
  var shortUrl = "https://auth.bullhornstaffing.com/oauth/authorize"; 
  var options = {
    'method' : 'post',
    'payload': data,
    "followRedirects" : false,
    'muteHttpExceptions': true
  };
  
  //https://stackoverflow.com/questions/27098169/what-google-appsscript-method-is-used-to-get-the-url-of-a-redirect
  var response = UrlFetchApp.fetch(shortUrl,options);

  CODE = getCodeFromRedirectUrl(response.getHeaders()['Location']);

}

function getCodeFromRedirectUrl(text){
  var firstSplit = text.split("?code=");
  if (firstSplit.length ==2){
    var firstChunk = firstSplit[1];
    var secondSplit = firstChunk.split("&client_id");
    if (secondSplit.length ==2){
      var code = secondSplit[0];
      return code;
    }
  }
  return null;
}

function getAccessCodeForSession(){
  getAuthorisation();
  
  var url = "https://auth.bullhornstaffing.com/oauth/token?grant_type=authorization_code&code=" + CODE + "&client_id=" + CLIENTID + "&client_secret=" + SECRET;
  var options = {
   'method' : 'post',
   'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url,options);
  if (response.getResponseCode() == 200){
    var json = JSON.parse(response.getContentText())
    var token = json.access_token;
    REFRESH = json.refresh_token;
  }
}

function getTokenFromRefreshCode(){
  getAccessCodeForSession();
  var url = "https://auth.bullhornstaffing.com/oauth/token?grant_type=refresh_token&refresh_token=" + REFRESH + "&client_id=" + CLIENTID + "&client_secret=" + SECRET;
  var options = {
   'method' : 'post',
   'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url,options);

  if (response.getResponseCode() == 200){
    var json = JSON.parse(response.getContentText())
    var token = json.access_token;
    TOKEN = token;
    return token;
  }

}

function BHlogin(){
  var token = TOKEN!=""?TOKEN:getTokenFromRefreshCode();
  var url = "https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token=" + token;
  var options = {
   'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url,options);
  if (response.getResponseCode() == 200){
    var json = JSON.parse(response.getContentText());
    var BhRestToken = json.BhRestToken;
    var restUrl = json.restUrl;
    return [BhRestToken,restUrl];
  }
}

