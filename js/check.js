var loginedSSN;

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    // return results[1] || 0;
    return (results) ? results[1] : null;
};

$(document).ready(function() {
    function Login() {
        if ($("#ssn").val().length == 10) {
            var data = $("#check-form").serializeArray();
            console.log(data);
            loginedSSN = $("#ssn").val();
            $("#ssn").val("").hide();
            $("#table-container").before('<p id="instruction">Loading...</p>');
            $.ajax({
                type: "post",
                data: data,
                url: "https://script.google.com/macros/s/AKfycbz_FG9PYhppOa4TYcI_tJzQNHowKZ0cCGc6MbIy3-7ol2ipHFY/exec",  // Demo Endpoint
            }).done(function(responseData) {
                // Login Success
                console.log(responseData);
                responseData = JSON.parse(responseData);
                if (responseData.name === "") {
                    // User Not Found, Restore to Login State
                    $("#instruction").remove();
                    $("#ssn").val("").show();
                    $("#ssn-invalid").text("查無此報名資料");
                    $("#ssn").addClass("is-invalid").one("change paste keyup blur", function() {
                        $(this).removeClass("is-invalid");
                    });
                    return;
                }
                // $("#instruction").text("現在要幹嘛？\n請於8/18 (六)前完成");
                $("#table-container").load("html/check-components.html #info-table", function() {
                    // User Found, Load Datas
                    $("#name-box").text("探員 " + responseData.name);
                    var items = ["register", "transferred", "received"];
                    for (var n in items) {
                        if (responseData[items[n]] == 1) {
                            $("#" + items[n]).load("html/check-components.html #check-anime");
                        } else {
                            $("#" + items[n]).load("html/check-components.html #cross-anime");
                        }
                    }
                    // Show Instructions
                    if (responseData.register == 1 && responseData.transferred == 0 && responseData.received == 0) {
                        $("#instruction").text("現在要幹嘛？\n請於8/18 (六)前完成");
                        $("#instruction").append("<a href=\"#\" data-toggle=\"modal\" data-target=\"#instruction-modal\">繳費</a>");
                        $("#instruction a").after("\n完成後請點擊下方「通知已匯款」");
                        $("#notify-cell").text("").append("<a href=\"#\" data-toggle=\"modal\" data-target=\"#notify-modal\">通知已匯款</a>");
                        // Notify Submit
                        $("#submitBtn").click(function() {
                            if ($("#info").val() == "") {
                                $("#info-invalid").text("請輸入資料");
                                $("#info").addClass("is-invalid").one("change paste keyup blur", function() {
                                    $(this).removeClass("is-invalid");
                                });
                                return;
                            }
                            $("#submitBtn").text("傳送中").prop("disabled", true);
                            $("#notify-form input[name='ssn']").val(loginedSSN);
                            var data = $("#notify-form").serializeArray();
                            console.log(data);
                            $.ajax({
                                type: "post",
                                data: data,
                                url: "https://script.google.com/macros/s/AKfycbz_FG9PYhppOa4TYcI_tJzQNHowKZ0cCGc6MbIy3-7ol2ipHFY/exec",  // Demo Endpoint
                            }).done(function(responseData) {
                                // Notify Success
                                console.log(responseData);
                                if (responseData == "Success") {
                                    $("#notify-modal").modal("hide");
                                    $("#transferred").load("html/check-components.html #check-anime");
                                    $("#instruction").text("通知已完成\n款項收到後將會發Email通知");
                                    $("#notify-cell").text("通知已匯款");
                                } else {
                                    $("#submitBtn").append('<i class="fas fa-paper-plane"></i>').after("瓦干達萬歲").prop("disabled", false);
                                    $("#info-invalid").text(responseData);
                                    $("#info").addClass("is-invalid").one("change paste keyup blur", function() {
                                        $(this).removeClass("is-invalid");
                                    });
                                }
                            }).fail(function(responseData) {
                                // Notify Failed
                                console.log(responseData);
                                $("#submitBtn").append('<i class="fas fa-paper-plane"></i>').after("瓦干達萬歲").prop("disabled", false);
                                $("#info-invalid").text("發生了無法預料的意外，請稍後再試");
                                $("#info").addClass("is-invalid").one("change paste keyup blur", function() {
                                    $(this).removeClass("is-invalid");
                                });
                            });
                        });
                    } else if (responseData.register == 1 && responseData.transferred == 1 && responseData.received == 0) {
                        $("#instruction").text("現在要幹嘛？\n您已通知匯款\n款項收到後將會發Email通知");
                    } else if (responseData.register == 1 && responseData.transferred == 1 && responseData.received == 1) {
                        $("#instruction").text("英雄已收到你的報名款項\n報名已完成\n8/20不見不散！\nP.S. 記得再檢查一次");
                        $("#instruction").append("<a href=\"assets/Prepare.pdf\">準備物品清單</a>");
                    }
                });
            }).fail(function(responseData) {
                // Login Failed
                console.log(responseData);
                $("#instruction").remove();
                $("#ssn").val("").show();
                $("#ssn-invalid").text("發生了無法預料的意外，請稍後再試");
                $("#ssn").addClass("is-invalid").one("change paste keyup blur", function() {
                    $(this).removeClass("is-invalid");
                });
            });
        }
    }
    // Auto Login
    if ($.urlParam("ssn")) {
        $("#ssn").val($.urlParam("ssn"));
        Login();
    } else {
        $("#ssn").on("change paste keyup blur", Login);
    }

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
