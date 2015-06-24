/**
 * Created by 飞 on 15-3-23.
 */
(function(qn, $){
    var form,
        redaySubmit,
        blurs = [];
    if(!$) {
        throw new ReferenceError("$ is undefined, please include jQuery.js first");
    }
    qn.initCheck = function(formId){
        var validateInput = $("#"+formId+" input[validate]");
        //var blurs = [];
        form = formId;

        for (var i = 0; i < validateInput.length; i++) {
            blurs[i] = (function(i) {
                return function() {
                    var input = validateInput.eq(i);
                    var inputText = input.val();
                    var placeholder = input.attr("placeholder");
                    var $tip = input.parent().next();
                    var validate = input.attr("validate");
                    var validateString = "{" + validate + "}";
                    var validateObj = eval('(' + validateString + ')');


                    if((validateObj.regex) != undefined ){

                        if(validateObj.required){

                            if((validateObj.regex).test(inputText)){

                                if((validateObj.ajax) != undefined) {

                                    checkResult.checkAjax(validateObj,inputText,input,$tip);
                                } else{

                                    checkResult.getSuccess(input,$tip);
                                    return true;
                                }
                            }else{

                                checkResult.getDanger(input,placeholder,$tip);
                                return false;
                            }
                        } else {

                            if(((validateObj.regex).test(inputText)) || inputText === ""){

                                if((validateObj.ajax) != undefined) {

                                    checkResult.checkAjax(validateObj,inputText,input,$tip);
                                } else{

                                    checkResult.getSuccess(input,$tip);
                                    return true;
                                }
                            }else{

                                checkResult.getDanger(input,placeholder,$tip);
                                return false;
                            }
                        }
                    }
                    if(validateObj.equalTo != undefined){

                        var password = $("#"+validateObj.equalTo).val();
                        if(validateObj.required){

                            if((inputText == password) && password ){

                                checkResult.getSuccess(input,$tip);
                                return true;
                            } else {

                                checkResult.getDanger(input,placeholder,$tip);
                                return false;
                            }
                        } else {
                            if((inputText == password)){

                                checkResult.getSuccess(input,$tip);
                                return true;
                            } else {

                                checkResult.getDanger(input,placeholder,$tip);
                                return false;
                            }
                        }
                    }
                };
            })(i);
            validateInput[i].onblur = blurs[i];
        }
        //表单提交验证
        $("#"+formId).submit(function(){
            redaySubmit = true;

            blurs[0]();
            blurs[1]();
            blurs[2]();

            return false;

        })
    }
    //验证用户名存在与否以及验证结果
    var checkResult = {
        checkAjax:function(validateObj,inputText,input,$tip){
            var username = validateObj.ajax.paramName;
            var error = validateObj.ajax.errorMessage;
            var param = {};
            param[username] = inputText;

            $.ajax({
                url: validateObj.ajax.url+"?",
                dataType: "jsonp",
                jsonpCallback:"func",
                data: param,
                success: function(data){
                    if(data.results){
                        checkResult.getDanger(input,error,$tip);
                    } else {
                        checkResult.getSuccess(input,$tip);

                        if(redaySubmit){
                            var count = 0;
                            for(var j = 1;j < blurs.length; j++){
                                if(blurs[j]()){
                                    count++;
                                }
                            }
                            count ==2 && $("#"+form).get(0).submit();
                            console.log("submit...");
                        }

                    }
                    redaySubmit = false;
                }
            })
        },
        getSuccess: function(input,$tip){

            input.removeClass("danger").addClass("success");
            $tip.css({background:"url(http://6.url.cn/zc/chs/img/ok.png) 0 20px no-repeat"});
            $tip.text("");
        },
        getDanger: function(input,placeholder,$tip){

            input.removeClass("success").addClass("danger");
            $tip.text(placeholder);
            $tip.css({color: "#FC504E",background:"url(http://6.url.cn/zc/chs/img/pwd_sprite.png?v=10030) 0 -332px no-repeat"});
        }
    }

    if(!window.qn){
        window.qn = qn;
    }

})(window.qn || {}, window.$)
