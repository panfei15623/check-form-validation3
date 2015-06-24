/**
 * Created by mengchen on 2015/3/30.
 */
(function(qn, $) {
    "use strict";

    if (!$) {
        throw new ReferenceError("please import jQuery First.");
    }

    var $validateForm,
        $elements = [],
        validateFuncs = [],
        regexObj = {
            email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g,
            mobile:/^\d{11}$/
        };

    var ajaxValidate = function(url, param) {
        var result = false;
        $.ajax({
            url : url,
            dataType : "json",
            async : false,
            data : param,
            success : function(data) {
                result = !data.result;
            }
        });
        return result;
    };

    qn.initCheck = function(formId) {
        $validateForm = $("#" + formId);
        $elements = $validateForm.find("input[validate]");

        $elements.each(function(index, element) {
            var validateObj = eval("({" + $(element).attr("validate") + "})");
            var validateFunc = function() {

                var result = false;

                var ajaxParam = {};
                if (validateObj.ajax) {
                    ajaxParam[validateObj.ajax.paramName] = $(element).val();
                }
                var ajaxValidateResult = true;

                if ((validateObj.required || $(element).val()) && (
                    (validateObj.required && !$(element).val())
                    || (validateObj.regex && !(new RegExp(validateObj.regex).test($(element).val())))
                    || (validateObj.equalTo && $(element).val() != $("#" + validateObj.equalTo).val())
                    || validateObj.ajax && !(ajaxValidateResult = ajaxValidate(validateObj.ajax.url, ajaxParam))
                    || (validateObj.type  && !(new RegExp(regexObj[validateObj.type]).test($(element).val())))
                    )){

                    $(element).removeClass("success").addClass("danger");
                    $(element).parent().next().css({background:"url(/warning.png) 0 17px no-repeat"}).html("<span class='ks-red'>" +
                        (ajaxValidateResult ? $(element).attr("placeholder") : validateObj.ajax.errorMessage) +
                    "</span>");
                } else {
                    $(element).removeClass("danger").addClass("success");
                    $(element).parent().next().html("<span class='ks-green'>成功</span>");
                    $(element).parent().next().css({background:"url(/ok.png) 0 20px no-repeat"});
                    result = true;
                }

                return result;
            };

            validateFuncs[index] = validateFunc;
            $(element).bind("blur", validateFunc);
        });

        $validateForm.bind("submit", function() {
            var passedElementCount = 0;
            for (var i = 0; i < validateFuncs.length; i++) {
                if (validateFuncs[i]()) {
                    passedElementCount++;
                }
            }
            return passedElementCount == $elements.length;
        });
    };

    if (!window.qn) {
        window.qn = qn;
    }

})(window.qn || {}, window.jQuery);