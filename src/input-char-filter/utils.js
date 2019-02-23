var utils = utils || (function () {

    var AcceptCharsRules = {
        Name: /^[A-Za-zА-Яа-яёЁ\-]+?$/,
        Email: /^[A-Za-z0-9!#$%&'*\+\-\/=?^_`{|}~.@]+?$/,
        Login: /^[A-Za-z0-9_\-\.@\(\)\[\]\?]+?$/,
        Address: /^[A-Za-zА-Яа-яёЁ0-9"_\-\.,\(\)\s]+?$/,
        Phone: /^[0-9\-\(\)]+?$/,
        ApplicationName: /^[0-9A-Za-z_\-\.\s)\(]+?$/,
        LatNumbersSpecialSymbols: /^[0-9A-Za-z~!@#\$%^&\*\(\)-=\+_\{\}\[\]«»"'№;%:\?\\\|/\.,\<\>\s]+?$/,        
        RusLatNumbersSpecialSymbols: /^[0-9A-Za-zА-Яа-яЁё~!@#\$%^&\*\(\)-=\+_\{\}\[\]«»"'№;%:\?\\\|/\.,\<\>\s]+?$/,
        PasswordSymbols: /^[0-9A-Za-z!@#$%^&*?_~\-()]+?$/,
        Unp: /^[0-9]+?$/
    }

    var charFilterForInput = function (nameInput, regExp, errMsg, errMsgPaste, errMsgEmptyStr, replacementByEmptyString) {
        $("input[name = '"+ nameInput + "']")
            .biaInputCharFilter({rule: regExp,
                 errorMessage: errMsg || "",
                 errorMessagePaste: errMsgPaste || "",
                 errorMessageEmptyStringPaste: errMsgEmptyStr || "",
                 replacementByEmptyString: replacementByEmptyString });
    };

    var charFilterForInputReplaceByEmptyString = function(input) {

        var ruleStr = AcceptCharsRules[$(input).attr("data-mask-name")];

        $(input).biaInputCharFilter({rule: ruleStr,
                errorMessage: "Ввод недопустимых символов",
                errorMessagePaste: "Недопустимые символы были удалены",
                replacementByEmptyString: true });
    }

    var charFilterForInputReplaceByWhiteSpace = function(input) {

        var ruleStr = AcceptCharsRules[$(input).attr("data-mask-name")];

        $(input).biaInputCharFilter({rule: ruleStr,
                errorMessage: "Ввод недопустимых символов",
                errorMessagePaste: "Во вставленном тексте запрещенные символы заменены на пробелы",
                replacementByEmptyString: false });
    }

    var isBrowserIE = function () {
        var ua = window.navigator.userAgent;
        var is_ie = /MSIE|Trident/.test(ua);
        return is_ie;
    }

    return {
        charFilterForInput: charFilterForInput,
        charFilterForInputReplaceByEmptyString: charFilterForInputReplaceByEmptyString,
        charFilterForInputReplaceByWhiteSpace: charFilterForInputReplaceByWhiteSpace
    }
}());
