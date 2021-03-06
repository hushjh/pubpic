var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

var sevUrl = $api.getStorage('sevUrl');

function cancel(el){
	//alert("cancel:"+el.id);
	switch(el.id){
		case userName:
		
		break;
		case userPwd:
		break;
		case userPwd2:
		break;
	}
}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var userName = $api.byId('userName').value;
    var pwd = $api.byId('userPwd').value;
    var pwd2 = $api.byId('userPwd2').value;
    if(userName=='' || pwd=='')
    {
    	api.alert({
            msg: '用户名或密码不能为空!'
        }, function (ret, err) {
            //coding...
        });
        api.hideProgress();
        return;
    }
    if (pwd !== pwd2) {
        api.alert({
            msg: '两次密码不一致'
        }, function (ret, err) {
            //coding...
        });
        api.hideProgress();
        return;
    }
    //var upurl = 'http://192.168.2.104:8086/ajax/register.ashx';
    //var upurl = 'http://218.93.25.58:8086/ajax/register.ashx';
    var upurl=sevUrl.url+"register.ashx";
	api.ajax({
		url : upurl,
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				userName : userName,
				pwd : pwd
			}
			//files : {
			//file : data
			//}
		}
	}, function(ret, err) {
	//alert(JSON.stringify(ret) + JSON.stringify(err));
	switch(ret.status) {
		case 1:
		reg_native(userName, pwd)
		setTimeout(function() {
				api.closeWin();
			}, 100);
			api.openWin({
				name : 'userLogin_win',
				url : 'userLogin.html',
				pageParam : {
					name : 'test'
				}
			});
		break;
		case 2:
		alert("用户名已存在！");
		break;
		case 0:
		alert("注册失败！");
		break;
	}
		api.hideProgress();

	});  
}

function reg_native(username, password){
	var sql="insert into userinfo(username,password)values('"+username+"','"+password+"');";
	db.executeSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if (ret.status) {
			//alert("本地注册成功");
		} else {
//			api.alert({
//				msg : err.msg
//			});
		}
	});
}

function keyBack() {
	//alert("keyBcak  function");
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//alert("aip.openWin");
		//api.closeWin();
		api.openWin({
		name : 'userLogin_win',
		url : 'userLogin.html',
		reload: true,
		pageParam : {
			name : 'test'
		}
	});
	});
	
}

apiready = function () {
	db = api.require('db');
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    client = new Resource("A6907697189627", "5544860C-3918-E329-6338-67772D0CD2B5");
	client.setHeaders("authorization",$api.getStorage('token'));
	keyBack();
};