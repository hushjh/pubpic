
var sevUrl = $api.getStorage('sevUrl');
function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function reg() {
    api.openWin({
        name: 'userRegister',
        url: 'userRegister.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

/*
function ensure() {
	api.showProgress({
		title : '正在登录...',
		modal : false
	});
	var name = $api.byId('username').value;
	var pwd = $api.byId('password').value;

	var bodyParam = {
		username : name,
		password : pwd
	}
	var User = factory("user");
	User.login(bodyParam, function(ret, err) {
		if (ret) {
			$api.setStorage('uid', ret.userId);
			$api.setStorage('token', ret.id);
			//setTimeout(function() {
				//api.closeWin();
			//}, 100);
			api.openWin({
				name : 'main_win',
				url : 'main_win.html',
				pageParam : {
					name : 'test'
				}
			});
		} else {
			api.alert({
				msg : err.msg
			});
		}
		api.hideProgress();
	})
}
*/


/*
function ensure() {
	api.showProgress({
		title : '正在登录...',
		modal : false
	});
	var name = $api.byId('username').value;
	var pwd = $api.byId('password').value;
	var UserInfo = client.Factory("userInfo");
	UserInfo.query({
		"filter" : {
			"where" : {
				"name" : name,
				"pwd" : pwd
			},

		}
	}, function(ret, err) {
		//return body
		//alert("ret: " + JSON.stringify(ret) + "\nerr: " + JSON.stringify(err));
		//alert(ret.length);
		
		if (ret.length==1) {
		
			var key = 'user';
			var user = {};
			user.id=ret[0].id;
			user.name = ret[0].name;
			$api.setStorage(key, user);
			var userinfo = $api.getStorage('user');
			//alert("userinfo:"+JSON.stringify(userinfo));
			setTimeout(function() {
				api.closeWin();
			}, 100);
			api.openWin({
				name : 'main_win',
				url : 'main_win.html',
				pageParam : {
					name : 'test'
				}
			});
		}else{
			alert("用户名或密码错误！");
		}
	api.hideProgress();
	})
}
*/
//判断手机连接网络的类型，如果连上网了，则开始定位
function ifStartLocation(){
	
	var connectionType = api.connectionType;
	if(connectionType=='unknown'||connectionType=='none')//连网和断网事件没触发的判断
	{
		return false;
	}else{
		return true;
	}
	
	
}

//离线登陆
function ensure_native(){
	var userName = $api.byId('username').value;
	var pwd = $api.byId('password').value;
	var sql="select * from userinfo where username='"+userName+"' and password='"+pwd+"'";
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if(ret.data.length==1){
			var key = 'user';
			var user = {};
			user.userName = userName;
			user.pwd = pwd;
			$api.setStorage(key, user);
			//var userinfo = $api.getStorage('user');
			//alert("userinfo:"+JSON.stringify(userinfo));
			setTimeout(function() {
				api.closeWin();
			}, 100);
			api.openWin({
				name : 'main_win',
				url : 'main_win.html',
				pageParam : {
					name : 'test'
				}
			});
		}else{
			alert("用户名或密码错误！");
		}
	});
}

function ensure(){
	if(ifStartLocation()){
		ensure_online();
	}else{
		ensure_native();
	}
}

function ensure_online() {
	api.showProgress({
		title : '正在登录...',
		modal : false
	});
	var userName = $api.byId('username').value;
	var pwd = $api.byId('password').value;
	//alert("userName:"+userName+",pwd"+pwd);

	//var upurl='http://218.93.25.58:8086/ajax/recPicInfo.ashx';
	//var upurl = 'http://218.93.25.58:8086/ajax/userLogin.ashx';
	var upurl=sevUrl.url+"userLogin.ashx";
	api.ajax({
		url : upurl,
		method : 'post',
		timeout : 200,
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
		if (ret.status == 1) {
			var key = 'user';
			var user = {};
			user.userName = userName;
			user.pwd = pwd;
			$api.setStorage(key, user);
			//var userinfo = $api.getStorage('user');
			//alert("userinfo:"+JSON.stringify(userinfo));
			setTimeout(function() {
				api.closeWin();
			}, 100);
			api.openWin({
				name : 'main_win',
				url : 'main_win.html',
				pageParam : {
					name : 'test'
				}
			});
			has_native(userName,pwd);
			
		} else {
			//alert("图片信息上传ret.status"+ret.status);
			alert("用户名或密码错误！");
		}
		api.hideProgress();

	});

}

//判断是否已经记录在本地
function has_native(username,password){
	var sql="select * from userinfo where username='"+username+"'";
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		//alert(JSON.stringify(ret));
		if (ret.data.length==1) {//如果本地已记录则，更新就行，
			update_native(username, password);
		} else {//本地没有则 将信息记录在本地
			reg_native(username, password);
		}
	});
}

//跟新本地用户信息
function update_native(username, password){
	var sql="update userinfo set password='"+password+"' where username='"+username+"'";
	db.executeSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if (ret.status) {
		} else {
//			api.alert({
//				msg : err.msg
//			});
		}
	});
}

//将用户登录信息记录在本地数据库
function reg_native(username, password){

	
	var sql="insert into userinfo(username,password)values('"+username+"','"+password+"');";
	db.executeSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if (ret.status) {
		} else {
//			api.alert({
//				msg : err.msg
//			});
		}
	});
}




function exit_app() {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.toast({
			msg : '再按一次返回键退出' + api.appName,
			duration : 2000,
			location : 'bottom'
		});
		api.addEventListener({
			name : 'keyback'
		}, function(ret, err) {
			api.closeWidget({
				id : 'A6907697189627', //你的APPid
				retData : {
					name : 'closeWidget'
				},
				animation : {
					type : 'flip',
					subType : 'from_bottom',
					duration : 500
				},
				silent : true
			});
		});
		setTimeout(function() {
			exit_app();
		}, 3000);
	});
}


function autoFill(){
	var userinfo = $api.getStorage('user');
	//alert(JSON.stringify(userinfo));
	
	if(typeof(userinfo) =="undefined")
	{
		//alert(typeof(userinfo));
		return;
	}
	else
	{
		var userName=userinfo.userName;
		var pwd=userinfo.pwd;
		if(userName !=''){
			$api.byId('username').value=userName;
			$api.byId('password').value=pwd;
			ensure();
			//testa();
		}
	}
	
}


function testa() {
	alert("testa");
	api.ajax({
		url : 'http://www.apicloud.com/',
		method : "get",
		//dataType : 'json'
	}, function(ret, err) {
		alert(JSON.stringify(ret) + JSON.stringify(err));
	});
}


function gotoBk() {
	
		api.toLauncher();

}

apiready = function() {
	var header = $api.byId('header');
    $api.fixIos7Bar(header);

	db = api.require('db');
	bMap=api.require('bMap');
	UIListView = api.require('UIListView');
	
	client = new Resource("A6907697189627", "5544860C-3918-E329-6338-67772D0CD2B5");
	client.setHeaders("authorization",$api.getStorage('token'));
	exit_app()
	autoFill();
	
	
	//alert("login.js");
}; 
