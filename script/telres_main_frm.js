

apiready = function(){
		$("#reg").click(reg);
	};



function checkPhone(phone) {
	var res = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
	return res;
}

function checkInput(){
	var $phone=$("#phone");
	var $vcode=$("#vcode");
	if($.trim($phone.val())==""){
		$phone.focus();
		api.toast({
	        msg:'手机号不能为空！'
        });
	}else if(!checkPhone($.trim($phone.val()))){
		$phone.focus();
		api.toast({
	        msg:'你输入的手机号码不正确！'
        });
	}else if($.trim($vcode.val())==""){
		$vcode.focus();
		api.toast({
	        msg:'验证码不能为空!'
        });
	}
	
}

function reg(){
	checkInput();
}