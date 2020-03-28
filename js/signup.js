// Page Ready Actions
$(document).ready(function() {
    // 
    // Redirect to HTTPS (Activated from Apache Server)
    // if (location.protocol != "https:") {
    //     location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    // }
    // 
    // Hide McDagan in iOS (Hide with HTML Comment)
    // if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
    //     $("#McDagan").remove();
    // }
    // 
    // Remove Placeholders from selects (Removed to Improve User-Reachability)
    // $("select.form-control").each(function() {
    //     $(this).one("focus", function() {
    //         $(this).find("option").first().remove();
    //     });
    // });
    // 
    // Initialize Copy Debug Info
    $(".copy-debug").each(function() {
        new ClipboardJS(".btn", {
            container: $(this)[0]
        });
    });
    // Textarea Auto Expand
}).one("focus.autoExpand", "textarea.autoExpand", function() {
    var savedValue = this.value;
    this.value = "";
    this.baseScrollHeight = this.scrollHeight;
    this.value = savedValue;
}).on("input.autoExpand", "textarea.autoExpand", function() {
    var minRows = this.getAttribute("data-min-rows") | 0,
        rows;
    this.rows = minRows;
    rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 24);
    this.rows = minRows + rows;
});

// Show Invalid Message
function showInvalidMsg(element, query) {
    $("#" + element.attr("name") + "-invalid").text(query);
    element.addClass("is-invalid");
}

$(".form-control").on("change paste keyup blur", function() {
    if (universalValidator($(this))) {
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
    } else {
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
});


// Validators
function validateName() {
    if ($("#name").val() === "") {
        showInvalidMsg($("#name"), "你忘記填你的名字啦，大大");
        return false;
    }
    var engNumRegExpID = /[a-zA-Z0-9]/,
        correctRegExpID = /^[\u4e00-\u9fa5]{2,5}$/;
    if (engNumRegExpID.test($("#name").val())) {
        showInvalidMsg($("#name"), "名字請不要加中文以外的東西，Okay?");
        return false;
    }
    if ($("#name").val().length < 2) {
        showInvalidMsg($("#name"), "這個短的有點中二，我覺得不行");
        return false;
    }
    if ($("#name").val().length > 5) {
        showInvalidMsg($("#name"), "你的名字長度簡直跟你的逼格一樣高了XD");
        return false;
    }
    if (!correctRegExpID.test($("#name").val())) {
        showInvalidMsg($("#name"), "你的名字就是哪裡怪怪的，檢查一下吧");
        return false;
    }
    return true;
}

function validateSSN() {
    if ($("#ssn").val() === "") {
        showInvalidMsg($("#ssn"), "你忘記填身分證字號啦，大大");
        return false;
    }
    var letters = new Array("A", "B", "C", "D",
            "E", "F", "G", "H", "J", "K", "L", "M",
            "N", "P", "Q", "R", "S", "T", "U", "V",
            "X", "Y", "W", "Z", "I", "O"),
        multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1),
        nums = new Array(2),
        total = 0;

    // Check Styles
    var regExpID = /^[a-z](1|2)\d{8}$/i;
    if (!regExpID.test($("#ssn").val())) {
        showInvalidMsg($("#ssn"), "格式有錯ㄛ");
        return false;
    }

    // Validate Calculation
    for (var i = 0; i < 26; i++) {
        if ($("#ssn").val().charAt(0).toUpperCase() == letters[i]) {
            var firstNum = i + 10;
            nums[0] = Math.floor(firstNum / 10);
            nums[1] = firstNum - (nums[0] * 10);
            break;
        }
    }
    for (var i = 0; i < multiply.length; i++) {
        if (i < 2) {
            total += nums[i] * multiply[i];
        } else {
            total += parseInt($("#ssn").val().charAt(i - 1)) *
                multiply[i];
        }
    }
    if ((10 - (total % 10)) != $("#ssn").val().charAt(9) && total % 10 != 0) {
        showInvalidMsg($("#ssn"), "這位仁兄，你該不會是偷渡來的?");
        return false;
    }
    return true;
}

function validateGender() {
    if ($("#gender").val() === "性別") {
        showInvalidMsg($("#gender"), "我們尊重你的性別，但還是麻煩填一下唄");
        return false;
    }
    if ($("#gender").val() != "Male" && $("#gender").val() != "Female" && $("#gender").val() != "Other") {
        showInvalidMsg($("#gender"), "我們都給你含蓄的選項了，你還要亂填?");
        return false;
    }
    return true;
}

function validatePhone() {
    if ($("#phone").val() === "") {
        showInvalidMsg($("#phone"), "你忘記填你的手機啦，大大");
        return false;
    }
    var MobileRegExpID = /^[09]{2}[0-9]{8}$/,
        CableRegExpID = /^(02|03|037|04|049|05|06|07|08|082|0826|0836|089)[0-9]{5,8}$/;
    if (CableRegExpID.test($("#phone").val())) {
        showInvalidMsg($("#phone"), "麻煩請填手機ㄛ");
        return false;
    }
    if (!MobileRegExpID.test($("#phone").val())) {
        showInvalidMsg($("#phone"), "格式有錯ㄛ");
        return false;
    }
    return true;
}

function validateEmail() {
    if ($("#email").val() === "") {
        showInvalidMsg($("#email"), "你忘記填你的Email啦，大大");
        return false;
    }
    var regExpID = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regExpID.test($("#email").val())) {
        showInvalidMsg($("#email"), "格式有錯ㄛ");
        return false;
    }
    return true;
}

function validateStudentID() {
    if ($("#studentID").val() === "") {
        showInvalidMsg($("#studentID"), "你忘記填學號啦，大大");
        return false;
    }
    // Check Length
    if ($("#studentID").val().length != 7) {
        showInvalidMsg($("#studentID"), "你的學號長度怎麼怪怪的?");
        return false;
    }
    // Check Year
    if (parseInt($("#studentID").val().substring(0, 3)) > 107) {
        showInvalidMsg($("#studentID"), "來自未來的客倌，您別鬧了");
        return false;
    } else if (parseInt($("#studentID").val().substring(0, 3)) < 107) {
        showInvalidMsg($("#studentID"), "身為老屁股，別鬧了吧");
        return false;
    }
    // Check Department
    if (!($("#studentID").val().startsWith("10714") || $("#studentID").val().startsWith("10715") || $("#studentID").val().startsWith("10733") ||
            $("#studentID").val().startsWith("10716") || $("#studentID").val().startsWith("10717") ||
            $("#studentID").val().startsWith("10718") || $("#studentID").val().startsWith("10720") ||
            $("#studentID").val().startsWith("10735"))) {
        showInvalidMsg($("#studentID"), "本營隊只開放給資訊學院的學生參加\n請再次核對您的學號");
        return false;
    }
    return true;
}

function validateAddress() {
    if ($("#address").val() === "") {
        showInvalidMsg($("#address"), "你忘記填你家地址啦，大大");
        return false;
    }
    return true;
}

function validateEatingHabbit() {
    if ($("#eatingHabbit").val() === "飲食習慣") {
        showInvalidMsg($("#eatingHabbit"), "哩甲菜欸?");
        return false;
    }
    if ($("#eatingHabbit").val() != "non-vegan" && $("#eatingHabbit").val() != "vegan" && $("#eatingHabbit").val() != "McDagan") {
        showInvalidMsg($("#eatingHabbit"), "2選1到底是有多難??????");
        return false;
    }
    return true;
}

function validateShirtSize() {
    if ($("#shirtSize").val() === "衣服尺寸") {
        showInvalidMsg($("#shirtSize"), "你不選的話，我們只好發給你浩克Size囉");
        return false;
    }
    if ($("#shirtSize").val() != "S" && $("#shirtSize").val() != "M" && $("#shirtSize").val() != "L" && $("#shirtSize").val() != "XL" && $("#shirtSize").val() != "2XL") {
        showInvalidMsg($("#shirtSize"), "我知道我們沒有XS也沒有3XL，但是還是不要亂改好ㄇ");
        return false;
    }
    return true;
}

function validateTransportation() {
    if ($("#transportation").val() === "交通方式") {
        showInvalidMsg($("#transportation"), "你是想空降膩?");
        return false;
    }
    if ($("#transportation").val() != "self" && $("#transportation").val() != "parent" && $("#transportation").val() != "Neili Station") {
        showInvalidMsg($("#transportation"), "這樣太危險");
        return false;
    }
    return true;
}

function validateBed() {
    if ($("#bed").val() === "寢具") {
        showInvalidMsg($("#bed"), "你忘記選寢具資訊啦，大大");
        return false;
    }
    if ($("#bed").val() != "Ordered" && $("#bed").val() != "Prepared") {
        showInvalidMsg($("#bed"), "好啦好啦都去睡地板 (怒)");
        return false;
    }
    return true;
}

function validateECName() {
    if ($("#ec_name").val() === "") {
        showInvalidMsg($("#ec_name"), "你忘記填緊急聯絡人啦，大大");
        return false;
    }
    var engNumRegExpID = /[a-zA-Z0-9]/,
        correctRegExpID = /^[\u4e00-\u9fa5]{2,5}$/;
    if (engNumRegExpID.test($("#ec_name").val())) {
        showInvalidMsg($("#ec_name"), "名字請不要加中文以外的東西，Okay?");
        return false;
    }
    if ($("#ec_name").val().length < 2) {
        showInvalidMsg($("#ec_name"), "沒有人名字這麼短的吧!?");
        return false;
    }
    if ($("#ec_name").val().length > 5) {
        showInvalidMsg($("#ec_name"), "不管他是誰，名字長這麼長不太優吧");
        return false;
    }
    if (!correctRegExpID.test($("#ec_name").val())) {
        showInvalidMsg($("#ec_name"), "你的名字就是哪裡怪怪的，檢查一下吧");
        return false;
    }
    return true;
}

function validateECPhone() {
    if ($("#ec_phone").val() === "") {
        showInvalidMsg($("#ec_phone"), "你忘記填緊急聯絡人電話啦，大大");
        return false;
    }
    var MobileRegExpID = /^[09]{2}[0-9]{8}$/,
        CableRegExpID = /^(02|03|037|04|049|05|06|07|08|082|0826|0836|089)[0-9]{5,8}$/;
    if (CableRegExpID.test($("#ec_phone").val())) {
        showInvalidMsg($("#ec_phone"), "麻煩請填手機ㄛ");
        return false;
    }
    if (!MobileRegExpID.test($("#ec_phone").val())) {
        showInvalidMsg($("#ec_phone"), "格式有錯ㄛ");
        return false;
    }
    return true;
}

function validateECRelationship() {
    if ($("#ec_relationship").val() === "") {
        showInvalidMsg($("#ec_relationship"), "你忘記填緊急聯絡人關係啦，大大");
        return false;
    }
    var engNumRegExpID = /[a-zA-Z0-9]/,
        correctRegExpID = /^[\u4e00-\u9fa5]{1,5}$/;
    if (engNumRegExpID.test($("#name").val())) {
        showInvalidMsg($("#name"), "你們的關係有複雜到需要用別種語言說明?");
        return false;
    }
    if ($("#ec_relationship").val().length > 6) {
        showInvalidMsg($("#ec_relationship"), "我知道你們關係複雜，但麻煩簡明扼要好嗎?");
        return false;
    } else if (!correctRegExpID.test($("#ec_relationship").val())) {
        showInvalidMsg($("#ec_relationship"), "你的緊急聯絡人關係就是哪裡怪怪的，檢查一下吧");
        return false;
    }
    return true;
}

// Calling Validator Respectively
function universalValidator(element) {
    if (element.attr("name") == "name") {
        return validateName();
    } else if (element.attr("name") == "ssn") {
        return validateSSN();
    } else if (element.attr("name") == "gender") {
        return validateGender();
    } else if (element.attr("name") == "phone") {
        return validatePhone();
    } else if (element.attr("name") == "email") {
        return validateEmail();
    } else if (element.attr("name") == "studentID") {
        return validateStudentID();
    } else if (element.attr("name") == "address") {
        return validateAddress();
    } else if (element.attr("name") == "eatingHabbit") {
        return validateEatingHabbit();
    } else if (element.attr("name") == "disease") {
        return true;
    } else if (element.attr("name") == "shirtSize") {
        return validateShirtSize();
    } else if (element.attr("name") == "transportation") {
        return validateTransportation();
    } else if (element.attr("name") == "bed") {
        return validateBed();
    } else if (element.attr("name") == "ec_name") {
        return validateECName();
    } else if (element.attr("name") == "ec_phone") {
        return validateECPhone();
    } else if (element.attr("name") == "ec_relationship") {
        return validateECRelationship();
    } else if (element.attr("name") == "addtionMessage") {
        return true;
    } else {
        console.log("Unexpected Caller");
        return false;
    }
}

function universalCheck() {
    $(".form-control").each(function() {
        if (universalValidator($(this))) {
            $(this).addClass("is-valid");
            $(this).removeClass("is-invalid");
        } else {
            $(this).addClass("is-invalid");
            $(this).removeClass("is-valid");
        }
    });
    return ($(".is-invalid").length === 0 && $(".is-valid").length === 16);
}

function exportLogs(data, responseData) {
    var _navigator = {};
    for (var i in navigator) _navigator[i] = navigator[i];
    return "Send Data: " + JSON.stringify(data) +
        "\n\n\n" + "Response Data: " + JSON.stringify(responseData) +
        "\n\n\n" + "Browser Data: " + JSON.stringify(_navigator) +
        "\n\n\n" + "Datetime: " + new Date().toLocaleString();
}

function onSend() {
    $("#success-icon, #failed-icon, #requestBoxFooter button").hide();
    $("#requestBoxMsgTitle").text("資料傳送中...");
    $("#requestBoxMsgBody").text("");
    $("#requestBox").modal("show");
}

function onSuccess(responseData, data) {
    console.log(responseData);
    if (responseData === "Success") {
        $("#success-icon, .success-btn").show();
        $("#requestBox .close").hide();
        $("#requestBoxMsgTitle").text("報名成功");
        $("#requestBoxMsgBody").text("探員 " + $("#name").val() + " 資料已註冊\n超級英雄期待你的到來");
        $("#checkStatusBtn").attr("href", "check.html?ssn="+$("#ssn").val());
    } else {
        $("#failed-icon, .failed-btn").show();
        $("#requestBoxMsgTitle").text("報名失敗");
        $("#requestBoxMsgBody").text("\"" + responseData + "\"\n如有任何問題請私訊粉專");
        exportDebug(data, responseData);
    }
}

function onFailed(responseData, data) {
    console.log(responseData);
    $("#failed-icon, .failed-btn").show();
    $("#requestBoxMsgTitle").text("發生錯誤");
    $("#requestBoxMsgBody").text("請點擊下方任一按鈕\n將複製的錯誤資訊傳送回神盾局總部\n英雄感謝你");
    exportDebug(data, responseData);
}

function exportDebug(data, responseData) {
    var debugInfo = exportLogs(data, responseData);
    $(".copy-debug").attr("data-clipboard-text", debugInfo);
    console.log(debugInfo);
}

// Send Request
$("#submitBtn").click(function() {
    // Validate
    if (!universalCheck()) {
        return;
    }
    // Load Form Data
    var data = $("#signup-form").serializeArray();
    if ($("#studentID").val().startsWith("10714") || $("#studentID").val().startsWith("10715") || $("#studentID").val().startsWith("10733")) {
        data.push({ name: "dept", value: "CSE" });
    } else if ($("#studentID").val().startsWith("10716") || $("#studentID").val().startsWith("10717")) {
        data.push({ name: "dept", value: "IM" });
    } else if ($("#studentID").val().startsWith("10718") || $("#studentID").val().startsWith("10720")) {
        data.push({ name: "dept", value: "IC" });
    } else if ($("#studentID").val().startsWith("10735")) {
        data.push({ name: "dept", value: "IN" });
    }
    // Send Request
    onSend();
    $.ajax({
        type: "post",
        data: data,
        url: "https://script.google.com/macros/s/AKfycbz_FG9PYhppOa4TYcI_tJzQNHowKZ0cCGc6MbIy3-7ol2ipHFY/exec",  // Demo Endpoint
    }).done(onSuccess, data).fail(onFailed, data).always(function(responseData) {
        console.log("Request Sent");
    });
});
