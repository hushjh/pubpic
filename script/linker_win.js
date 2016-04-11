
apiready = function(){
		
		openLinker_frm();
		keyBack();
};

function openLinker_frm(){
	var header=$api.byId('header');
	var headerPos=$api.offset(header);
	api.openFrame({
		name : 'linker_frm',
		url : 'linker_frm.html',
		rect : {
			x : 0,
			y : headerPos.h,
			w : api.winWidth,
			h : api.winHeight - headerPos.h
		},
		pageParam : {},
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false
	});
}


function keyBack() {
	//alert("keyBcak  function");
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//alert("aip.openWin");
		api.openWin({
		name : 'main_win',
		url : 'main_win.html',
		pageParam : {
			name : 'test'
		}
	});
	});
}
