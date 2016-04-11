
var sevUrl = $api.getStorage('sevUrl');
var  addr="定位中...";
var lon='119.952100';
var lat='31.820300';
apiready = function(){
	
	client = new Resource("A6907697189627", "5544860C-3918-E329-6338-67772D0CD2B5");
	client.setHeaders("authorization",$api.getStorage('token'));
	bMap=api.require('bMap');		
	//actionButton = api.require('actionButton');	
	MNActionButton = api.require('MNActionButton');
	actbtnOpen();
	//openMain_frm();
	//exit_app();
	//tapTest();
	
	//openActBtn_main_frm();
	//tolaunch();
	//console();
	
	setInterval(locationBk,300000);
	
	gotoBk();
};

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

//后台定位

	function locationBk() {
		if (ifStartLocation()) {//判断是否能连网，能连则定位
			var timestamp = getNowFormatDate();
			var userinfo = $api.getStorage('user');
			var userName = userinfo.userName;

			bMap.getLocation({
				accuracy : '10m',
				autoStop : true,
				filter : 1
			}, function(ret, err) {
				if (ret.status) {
					lon = ret.lon;
					lat = ret.lat;
					bMap.getNameFromCoords({
						lon : ret.lon,
						lat : ret.lat
					}, function(ret, err) {
						if (ret.status) {
							// 设置给位置
							addr = ret.address;
							var upurl = sevUrl.url + "userPosition.ashx";
							api.ajax({
								url : upurl,
								method : 'post',
								timeout : 30,
								dataType : 'json',
								data : {
									values : {
										userName : userName,
										lat : lat,
										lon : lon,
										timestamp : timestamp,
										addr : addr
									}
								}
							}, function(ret, err) {
								//alert(JSON.stringify(ret) + JSON.stringify(err));
								switch(ret.status) {
									case 1:
										break;
									case 0:
										alert("记录失败！");
										break;
								}
							});
						}
					});
				} else {
					//alert("无法获取当前位置:" + err.code);
				}
			});
		}

		//setInterval(locationBkGet,10000);
	}



function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if (hour >= 1 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minute >= 0 && minute <= 9) {
		minute = "0" + minute;
	}
	if (second >= 0 && second <= 9) {
		second = "0" + second;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate+"/"+hour+seperator2+minute+seperator2+second;
	return currentdate;
}

function gotoBk() {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//alert("aip.openWin");
		//api.closeWin();
		api.toLauncher();
	});
		

}

function tapTest() {
	api.addEventListener({
		name : 'tap'
	}, function(ret, err) {
		//operation
		actBtnOpen();
	});
}

/*
function tolaunch() {

	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//operation
		api.toLauncher();
		alert("tolauncher");
	});
	
}*/

/*
function console() {
	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		//operation
		setInterval(show1,1000);
	});
}

function show1(){
	alert("houtai  zhixing");
}

*/


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

/*
function actBtnOpen() {

	actionButton.open({
		items :  [{
			bgColor : '#FFC0CB',
			title : '采集信息',
			image : 'widget://res/actionSheet_icon2.png'
		}, {
			bgColor : '#DB7093',
			title : '查看公司',
			image : 'widget://res/actionSheet_icon3.png'
		} ],
		topHeight : 200,
		//fixedOn:'main_win',
		pageControl : {
			activeColor : '#778899',
			inactiveColor : '#DDA0DD'
		}
	}, function(ret, err) {
		//api.alert({
			//msg : ret.index
		//});
		switch(ret.index){
			//case 0:
			//openfrmLinker_win();
			//api.closeWin();
			//break;
			case 0:
			openfrmPubpic_win();
			//api.closeWin();
			break;
			case 1:
			openComLIst_win();
			break;
			//case 3:
			//openOneself_win();
			//break;
			//case 4:
			//openTelres_win();
			//break;
			
		}
	});
}

*/


function actbtnOpen() {
	MNActionButton.open({
		layout : {
			row : 4, //（可选项）数字类型；每屏显示菜单按钮的行数；默认：2
			col : 4, //（可选项）数字类型；每屏显示菜单按钮的列数；默认：3
			rowSpacing : 60, //（可选项）数字类型；行与行之间的距离；默认：10
			colSpacing : 10, //（可选项）数字类型；列与列之间的距离；默认：10
			offset : 0 //（可选项）数字类型；整个菜单底部距离所属 window 底部的距离，只能为正整数；默认：0
		},
		animation : true, //（可选项）布尔类型；弹出和隐藏菜单时是否带弹出动画效果，true|false；默认：true
		autoHide : false, //（可选项）布尔类型；点击菜单按钮后是否自动隐藏菜单，true|false；默认：true
		styles : {
			maskBg : 'rgba(0,0,0,0.2)', //（可选项）字符串类型；遮罩层背景，支持 rgb，rgba，#，img；默认：rgba(0,0,0,0.2)
			bg : 'widget://image/bg1.jpg', //（可选项）字符串类型；菜单有效区域背景，支持 rgb，rgba，#，img；默认：#fff
			cancelButton : {//（可选项）JSON 对象类型，取消按钮设置
				size : 0, //（可选项）数字类型；底部取消按钮的高和宽；默认：44
				bg : '#fff', //（可选项）字符串类型；取消按钮的 100% 宽度的背景，支持rgb，rgba，#，img；默认：'#fff'
				icon : 'widget://res/action-button-cancel.png' //（可选项）字符串类型：取消按钮的图标，要求本地路径（widget://、fs://）；默认：默认X型图标
			},
			item : {//（可选项）JSON 对象类型，菜单按钮设置
				titleColor : '#888', //（可选项）字符串类型；菜单按钮文字颜色，支持 rgb，rgba，#；默认：#848484
				titleHighlight : 'dd2727', //（可选项）字符串类型；菜单按钮文字高亮颜色，支持 rgb，rgba，#；默认：同 titleColor
				titleSize : 12 //（可选项）数字类型；菜单按钮文字大小，同时也是文字栏所占高度，值为 0 时不显示文字栏；默认：12
			},
			indicator : {//（可选项）JSON 对象类型；页标指示器样式，若不传则不显示该指示器
				color : '#c4c4c4', //（可选项）字符串类型；其它页指示器颜色；支持rgb、rgba、#；默认：'#c4c4c4'
				highlight : '#9e9e9e' //（可选项）字符串类型；当前页指示器颜色；支持rgb、rgba、#；默认：'#9e9e9e'
			}
		},
		items : [{//JSON 对象类型；一个菜单项的设置信息
			icon : 'widget://res/icon1.png', //字符串类型；一个菜单按钮的图标路径，要求本地路径（widget://、fs://）；
			highlight : 'widget://res/highlight1.png', //（可选项）字符串类型；一个菜单按钮的高亮图标路径，要求本地路径（widget://、fs://）；默认：同 icon
			title : '',               //字符串类型；菜单按钮的文字；默认：未设置时不显示，但文字栏仍按 titleSize 设置显示高度
		}, {
			icon : 'widget://image/2.png',
			highlight : 'widget://res/highlight2.png',
			title : ''
		}, {
			icon : 'widget://image/3.png',
			highlight : 'widget://res/highlight3.png',
			title : ''
		}, {
			icon : '',
			highlight : '../image/studio.png',
			title : ''
		}, {
			icon : 'widget://image/local-l.png',
			highlight : 'widget://res/highlight5.png',
			title : '用户分布'
		}, {
			icon : 'widget://image/list_u.png',
			highlight : 'widget://res/highlight6.png',
			title : '公司列表'
		}, {
			icon : 'widget://image/studio.png',
			highlight : 'widget://res/highlight7.png',
			title : '信息采集'
		}, {
			icon : 'widget://image/pedicure.png',
			highlight : 'widget://res/highlight8.png',
			title : '用户轨迹'
		},{
			icon : 'widget://res/icon9.png',
			highlight : 'widget://res/highlight9.png',
			title : ''
		},{
			icon : 'widget://res/icon10.png',
			highlight : 'widget://res/highlight10.png',
			title : ''
		},{
			icon : 'widget://res/icon11.png',
			highlight : 'widget://res/highlight12.png',
			title : ''
		},{
			icon : 'widget://res/icon13.png',
			highlight : 'widget://res/highlight13.png',
			title : ''
		},{
			icon : 'widget://res/icon14.png',
			highlight : 'widget://res/highlight14.png',
			title : ''
		},{
			icon : 'widget://res/icon15.png',
			highlight : 'widget://res/highlight15.png',
			title : ''
		},{
			icon : 'widget://res/icon16.png',
			highlight : 'widget://res/highlight16.png',
			title : ''
		}]
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			switch(ret.index){
			//case 0:
			//openfrmLinker_win();
			//api.closeWin();
			//break;
			case 4:
			openUsersCoord_win();
			break;
			case 5:
			openComLIst_win();
			break;
			case 6:
			openfrmPubpic_win();
			//api.closeWin();
			break;
			case 7:
			openCoordRoute_win();
			//api.closeWin();
			break;
			
			//case 3:
			//openOneself_win();
			//break;
			//case 4:
			//openTelres_win();
			//break;
			
		}
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function openCoordRoute_win(){
	api.openWin({
		name:'coordRoute_win',
		url:'../html/coordRoute/coordRoute_win.html',
		reload:true,
	});
}

function openUsersCoord_win(){
	api.openWin({
		name:'usersCoord_win',
		url:'../html/usersCoord/usersCoord_win.html',
		reload:true,
	});
}

function openTelres_win(){
	api.openWin({
		name:'telres_win',
		url:'telres_win.html',
		reload:true,
	});
}

function openOneself_win(){
	
	api.openWin({
		name : 'Oneself_win',
		url : 'Oneself_win.html',
		reload :true,//刷新页面
		pageParam : {
			name : 'test'
		}
	});
}

function openComLIst_win(){
	api.openWin({
		name : 'comList_win',
		url : 'comList_win.html',
		reload :true,//刷新页面
		pageParam : {
			name : 'test'
		}
	});
	//api.closeWin();
}

function openfrmLinker_win() {
	api.openWin({
		name : 'linker_win',
		url : 'linker_win.html',
		reload :true,//刷新页面
		pageParam : {
			name : 'test'
		}
	});
	//api.closeWin();
}


function openfrmPubpic_win(){
	api.openWin({
		name : 'pubpic_win',
		url : 'pubpic_win.html',
		reload :true,//刷新页面
		pageParam : {
			name : 'test'
		}
	});
	//api.closeWin();
}

