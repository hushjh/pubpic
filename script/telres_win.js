apiready = function() {

	fixStatusBar("aui-header", function(headerPos) {
		api.openFrame({
			name : 'telres_main_frm',
			url : 'telres_main_frm.html',
			rect : {
				x : 0,
				y : headerPos.h,
				w : api.winWidth,
				h : api.winHeight - headerPos.h
			},
			pageParam : {
			},
			bounces : true,
			bgColor : 'rgba(0,0,0,0)',
			vScrollBarEnabled : false,
			hScrollBarEnabled : false
		});
	});
};

function fixStatusBar(headerid, callback) {
	var header = $api.byId(headerid);
	var systemType = api.systemType;
	var systemVersion = parseFloat(api.systemVersion);
	if (systemType == "ios" || (systemType == "android" && systemVersion >= 4.4)) {
		if (systemType == "android") {
			header.style.paddingTop = '25px';
		}
		$api.fixStatusBar(header);
	} else {
		$api.fixIos7Bar(header);
	}
	var headerPos = $api.offset(header);
	if ( typeof callback == "function") {
		callback(headerPos);
	}
}


function keyBack() {
	//alert("keyBcak  function");
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//alert("aip.openWin");
		//api.closeWin();
		api.openWin({
		name : 'main_win',
		url : 'main_win.html',
		reload: true,
		pageParam : {
			name : 'test'
		}
	});
	});
	
}

function back() {

	api.openWin({
		name : 'main_win',
		url : 'main_win.html',
		reload : true,
		pageParam : {
			name : 'test'
		}
	});

}




