apiready = function(){
	personalCenter = api.require('personalCenter');	
	peCenter();
	keyBack();
	document.getElementById('back').onclick=back;
	};
	
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
function peCenter() {
	personalCenter.open({
		imgPath : 'widget://res/me.jpg',
		placeholderImg : 'widget://res/me.jpg',
		btnArray : [{
			bgImg : 'widget://res/personal_btn_nor.png',
			selectedImg : 'widget://res/personal_btn_sele.png',
			title: '朋友圈 ',                
    		count: '999'
		}, {
			bgImg : 'widget://res/personal_btn_nor.png',
			selectedImg : 'widget://res/personal_btn_sele.png',
			title: '朋友圈 ',                
    		count: '999'
		}, {
			bgImg : 'widget://res/personal_btn_nor.png',
			selectedImg : 'widget://res/personal_btn_sele.png',
			title: '朋友圈 ',                
    		count: '999'
		}],
		userName:"莱昂纳多",
		subTitle:"积分:999",
		//showLeftBtn:true,
		//showRightBtn:true
	}, function(ret, err) {
		if (ret) {
			alert(JSON.stringify(ret));
		} else {
			alert(JSON.stringify(err));
		}
	});
}
