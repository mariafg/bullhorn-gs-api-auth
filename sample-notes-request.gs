function getNotes(){
  var credentials = BHlogin();
  if (credentials){
    var bhToken = credentials[0];
    var bhUrl = credentials[1];
    
    var token = TOKEN!=""?TOKEN:getTokenFromRefreshCode();
    var id = 97182; // candidate or contact id (or I guess whatever entity)
    var url = bhUrl + "query/NoteEntity?where=targetEntityID=" + id + "&fields=note&BhRestToken=" + bhToken;
    
    var options = {
      'method' : 'get',
      'muteHttpExceptions': true
    };
    var response = UrlFetchApp.fetch(url,options);
    
    if (response.getResponseCode()==200){
      var data = JSON.parse(response.getContentText()).data;
      for (var i=0;i<data.length;i++){
        getNote(credentials,data[i].note.id);
      }
    }
  }
}


function getNote(credentials,noteId){

  if (credentials){
    var bhToken = credentials[0];
    var bhUrl = credentials[1];
    var token = TOKEN!=""?TOKEN:getTokenFromRefreshCode();
    var url = bhUrl + "search/Note?fields=*&query=" + noteId + "&BhRestToken=" + bhToken; 
    
    var options = {
      'method' : 'get',
      'muteHttpExceptions': true
    };
    var response = UrlFetchApp.fetch(url,options);
    Logger.log(response.getContentText());
  }
}
