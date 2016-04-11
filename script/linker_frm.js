var uerList;
var location;
var coord="";
apiready = function() {

	bMap=api.require('bMap');
	UIListView = api.require('UIListView');
	
	client = new Resource("A6907697189627", "5544860C-3918-E329-6338-67772D0CD2B5");
	client.setHeaders("authorization",$api.getStorage('token'));

	model = api.require('model');
	query = api.require('query');
	model.config({
		appKey : '5544860C-3918-E329-6338-67772D0CD2B5',//每个app的appkey都不一样，复制的时候要修改
		host : 'https://d.apicloud.com'
	});
	//linkershow();
	getData();
	listFresh();
	linkermore();
	

}; 


/*function getData() {
	query.createQuery(function(ret, err) {
		if (ret && ret.qid) {
			var queryId = ret.qid;
			model.findAll({
				class : "userInfo",
				qid : queryId
			}, function(ret, err) {
			
				dataProcess(ret);
				
				//alert("getdata"+JSON.stringify(ret));
			});
		}
	});

}*/






function getLocation() {
	// 获取当前位置
	bMap.getLocation({
		accuracy : '10m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			bMap.getNameFromCoords({
				lon : ret.lon,
				lat : ret.lat
			}, function(ret, err) {
				if (ret.status) {
					// 设置给位置
					//$(".po").text(ret.address);
				}
			});
		} else {
			alert(err.code);
		}
	});
}




function getData() {
	var UserInfo = client.Factory("userInfo");
	UserInfo.query({
		"filter" : {
			"where" : {},
			"order" : "createAt ASC",
			"skip" : 0,
			"limit" : 20,
			"include" : "position",
			"includefilter" : {
				"position" : {
					
					"order" : "createAt DESC",
					"limit" : 1,
				}
			}
		}
	}, function(ret, err) {
		//return body
		//alert("getdata"+JSON.stringify(ret[2].position[0].city));
		dataProcess(ret);
	})
}




function dataProcess(ret) {
	var datat = [];
	//对象数组；
	//alert(JSON.stringify(ret));
	for (var i = 0; i < ret.length; i++) {
		var temp = new Object();
		temp.imgPath = '';
		temp.title = ret[i].name;
		temp.subTitle = ret[i].work;
		temp.remark = ret[i].position[0].address;
		temp.icon = '';
		//datat.push(temp);
		datat[i] = temp;
			
	}
	linkershow(datat);
}




	
function linkershow(ret){
	UIListView.open({
    rect: {
        x: 0,
        y: 0,
        w : api.winWidth,
		h : api.winHeight 
    },
    data: ret,
    rightBtns: [{
        bgColor: '#388e8e',
        activeBgColor: '',
        width: 70,
        title: '按钮',
        titleSize: 12,
        titleColor: '#fff',
        icon: '',
        iconWidth: 20
    }],
    styles: {
        borderColor: '#696969',
        item: {
            bgColor: '#AFEEEE',
            activeBgColor: '#F5F5F5',
            height: 55.0,
            imgWidth: 40,
            imgHeight: 40,
            imgCorner: 4,
            placeholderImg: '',
            titleSize: 12.0,
            titleColor: '#000',
            subTitleSize: 12.0,
            subTitleColor: '#000', 
            remarkColor: '#000',
            remarkSize: 16,
            remarkIconWidth: 30
        }
    },
    fixedOn: api.frameName
	}, function( ret, err ){
   		if( ret ){
         	//alert( JSON.stringify( ret ) );
   	 	}else{
         	//alert( JSON.stringify( err ) );
    	}
	});
}


	
	
function listFresh() {
	
	UIListView.setRefreshHeader({
		loadingImg : 'widget://res/UIListView_arrow.png',
		bgColor : '#F5F5F5',
		textColor : '#8E8E8E',
		textDown : '下拉可以刷新...',
		textUp : '松开开始刷新...',
		showTime : true
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			
			listReLoad();
		} else {
		
			alert(JSON.stringify(err));
		}
	});
}

function listReLoad() {
	UIListView.reloadData({
		data : [{
			imgPath : 'http://img1.3lian.com/gif/more/11/201206/a5194ba8c27b17def4a7c5495aba5e32.jpg',
			title : '新标题',
			subTitle : '新子标题',
			remark : '新备注',
			icon : ""
		}]
	}, function(ret) {
		if (ret) {
			//alert(JSON.stringify(ret));
		} else {
			//alert(JSON.stringify(err));
		}
	});
}

function linkermore() {
	UIListView.setRefreshFooter({
		loadingImg : 'widget://res/UIListView_arrow.png',
		bgColor : '#F5F5F5',
		textColor : '#8E8E8E',
		textUp : '上拉加载更多...',
		textDown : '松开开始加载...',
		showTime : true
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			addOneLinker();
		} else {
			//alert(JSON.stringify(err));
		}
	});
}

function addOneLinker() {
	UIListView.appendData({
		data : [{
			imgPath : 'http://d.hiphotos.baidu.com/image/pic/item/4d086e061d950a7b29a788c209d162d9f2d3c922.jpg',
			title : '新增标题wsz',
			subTitle : '新增子标题',
			remark : '新增备注增加一条数据'
		}]
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
		} else {
			//alert(JSON.stringify(err));
		}
	});
}
