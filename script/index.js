var upurl1 = 'http://218.93.25.58:8086/ajax/';
var upurl2 = 'http://192.168.2.51:8086/ajax/';

apiready = function() {
	push = api.require('push');
	//bMap = api.require('bMap');
	db = api.require('db');
	openUserLogin();
	createTable();
	setSeverUrl();
/*
	api.removeLaunchView({
		animation : {
			type : 'fade',
			duration : 1
		}
	});
*/
	//locationBk();
	//t();
	//gotoBk();
	pushN();
	//pushListener();
};

function setSeverUrl(){
	var key = 'sevUrl';
	var sevUrl = {};
	//sevUrl.url = 'http://218.93.25.58:8086/ajax/userLogin.ashx';
	sevUrl.url=upurl1;
	
	$api.setStorage(key, sevUrl);
	//var sevUrl = $api.getStorage('sevUrl');
	//alert("sevUrl:"+JSON.stringify(sevUrl));
	//alert("sevUrl:"+sevUrl.url);
}

function pushListener() {
	push.setListener(function(ret, err) {
		if (ret) {
			api.alert({
				msg : ret.data
			});
		}
	});
}

function pushN() {
	push.setPreference({
		notify : true,
		updateCurrent : false,
		//silenceTime : {//晚上10点30到第二天上午9点之间静默
			//startHour : 22,
			//endHour : 9,
			//startMinute : 30,
			//endMinute : 0
		//},
		defaults : 'all'
	});
}

function gotoBk() {
	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		//alert("gotobk");
		//api.toLauncher();
		locationBk();
	});
}


function openUserLogin(){
	
	api.openWin({
        name: 'userLogin_win',
        url: 'html/userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function createTable() {
	db.openDatabase({
		name : 'app'
	}, function(ret, err) {
		if (ret.status) {
			//api.alert({
				//msg : '数据库打开成功'
			//});
			// 创建表（先判断是否存在）
			var sql1 = 'create table if not exists pic(picId int IDENTITY(1,1) PRIMARY KEY, comId nvarchar(50),picName nvarchar(50),url nvarchar(50),createAt nvarchar(50))';
			var sql2 ='create table if not exists company(id int IDENTITY(1,1) PRIMARY KEY, comId nvarchar(50),comName nvarchar(50),address nvarchar(50),city nvarchar(50),tel nvarchar(50),comLinker nvarchar(50),comment nvarchar(50),linePrice nvarchar(50),zbr nvarchar(50),createAt nvarchar(50))';
			db.executeSql({
				name : 'app',
				sql : sql2
			}, function(ret, err) {
				if (ret.status) {
					//api.alert({
						//msg : '创建company表成功'
					//});
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
			db.executeSql({
				name : 'app',
				sql : sql1
			}, function(ret, err) {
				if (ret.status) {
					//api.alert({
						//msg : '创建pic表成功'
					//});
					//test();
					
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
			//离线登陆，创建本地userinfo表
			var sql3='create table if not exists userinfo(id int IDENTITY(1,1) PRIMARY KEY,username nvarchar(50),password nvarchar(50))';
			db.executeSql({
				name : 'app',
				sql : sql3
			}, function(ret, err) {
				if (ret.status) {
					//test();
					
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});
}
