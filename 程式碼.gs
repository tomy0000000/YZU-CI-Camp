var ss = SpreadsheetApp.getActiveSpreadsheet(),
    sheet = ss.getSheetByName("data"); // "sheet1" 改成你的工作表名稱
function doPost(e) {
    var para = e.parameter,
        method = para.method;
    if (method == "test") return ContentService.createTextOutput("測試");
    if (method == "signup") {
        var result = tryAppend(para);
        return ContentService.createTextOutput(result);
    }
  if(method == "createTask"){
    var result = createTask(para);
    return ContentService.createTextOutput(result);
  }
  if(method == "getStatus"){
    var result = getStatus(para);
    return ContentService.createTextOutput(result);
  }
  if(method == "getRecord"){
    var result = getRecord();
    return ContentService.createTextOutput(result);
  }
}

function doGet(e){
    var para = e.parameter,
        method = para.method;

  if(method == "getStatus"){
    var result = getStatus(para);
    return ContentService.createTextOutput(result);
  }
  if(method == "getRecord"){
    var result = getRecord();
    return ContentService.createTextOutput(result);
  }
}

function tryAppend(data) {
    var msg = valid(data);
    if (msg != true) return msg;
    if (repeated(data)) return "此身分證字號已報名";
    appendData(data);
    return "Success";
}

function valid(data) {
    if (data.name == null) return "缺少欄位：姓名";
    if (data.gender == null) return "缺少欄位：性別";
    if (data.phone == null) return "缺少欄位：聯絡電話";
    if (data.email == null) return "缺少欄位：Email";
    if (data.ssn == null) return "缺少欄位：身分證字號";
    if (data.address == null) return "缺少欄位：住家地址";
    if (data.dept == null) return "缺少欄位：科系";
    if (data.studentID == null) return "缺少欄位：學號";
    if (data.eatingHabbit == null) return "缺少欄位：飲食習慣";
    if (data.shirtSize == null) return "缺少欄位：衣服尺寸";
    if (data.transportation == null) return "缺少欄位：交通方式";
    if (data.bed == null) return "缺少欄位：寢具";
    if (data.ec_name == null) return "缺少欄位：緊急聯絡人姓名";
    if (data.ec_phone == null) return "缺少欄位：緊急聯絡人電話";
    if (data.ec_relationship == null) return "缺少欄位：緊急聯絡人關係";
    return true;
}


// 以身分證字號判定重複
function repeated(data) {
    var all = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getValues();
    var id = data.ssn;
    for (var i in all)
        if (id == all[i][0]) return true;
    return false;
}

function appendData(data) {
    sheet.appendRow([
        new Date().toLocaleString(),
        data.name,
        data.gender,
        data.phone,
        data.email,
        data.ssn,
        data.address,
        data.dept,
        data.studentID,
        data.eatingHabbit,
        data.disease,
        data.shirtSize,
        data.transportation,
        data.bed,
        data.ec_name,
        data.ec_phone,
        data.ec_relationship,
        data.addtionMessage
    ]);
  var detestring = new Date().toLocaleString();
  // var options = {
  // 'method' : 'post',
  // 'payload' : {
  //   msg: "有人報名啦～\n"+data.name+" ("+data.dept+") "+data.gender+"\n"+detestring
  // }
  // };
  // UrlFetchApp.fetch('https://fourzi.herokuapp.com/send', options);
}


var taskSheet = ss.getSheetByName("task");
// 登記繳費確認
function createTask(data){
  if(data.ssn == null || data.ssn == "")
    return "身分證字號不能為空";
  
  if(data.info == null || data.info == "")
    return "請提供正確的繳費資訊";
    
  taskSheet.appendRow([
    new Date().toLocaleString(),
    data.ssn,
    data.info  
  ]);
  
  // Linebot 提示
  // var options = {
  // 'method' : 'post',
  // 'payload' : {
  //   msg: "總務總務～\n有人繳費了快去看看！"
  // }
  // };
  // UrlFetchApp.fetch('https://fourzi.herokuapp.com/send', options);
  return "Success";
}

function getStatus(data){
  var id = data.ssn;
  var index = 0;
  
  var status = {
    name: "",
    register: 0,
    transferred: 0,
    received: 0
  }
  
  var all = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getValues();
  for(var i in all)
    if(all[i][0] == id){
      index = parseInt(i) + 2;
      break;      
    }
  
  if(index == 0)
    return JSON.stringify(status);
  status.register = 1;
  
  status.name = sheet.getRange(index, 2).getValue();
  var asd = taskSheet.getRange(2, 2, taskSheet.getLastRow() - 1, 1).getValues();
  for(var i in asd)
    if(asd[i][0] == id)
      status.transferred = 1;
  
  if(sheet.getRange(index, 19).getValue())
    status.received = 1;
  
  return JSON.stringify(status);
}

function getRecord(){
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();
  return JSON.stringify(data);
}

function test(){
    var all = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getValues();
    for (var i in all)
        Logger.log(all[i][0]);
 
}