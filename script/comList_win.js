
var urlList=[];
var upFlag=0;//列表记录数，点上传按钮会将记录行数赋给它，每次成功上传公司信息，则upFlag--当它为0则上传成功
var upPicFlag=[];
var upSuccess=1;//上传出现意外的标识
var orcpNum=0;
var sevUrl = $api.getStorage('sevUrl');

apiready = function(){
		 fs = api.require('fs');
		arcProgress = api.require('arcProgress');
		imageBrowser=api.require('imageBrowser');
		UIListView = api.require('UIListView');
		db = api.require('db');
		comListShow();
		keyBack();
		getComData();
		//$("#back").click(back);
		document.getElementById('back').onclick=back;
		$("#up").click(upAll);
		
		$api.fixStatusBar( $api.dom('header') );
		//openUpFrm();
	};
	
function openUpFrm(){
	api.openFrame({
                    name:'up_mark_frm',
                    url:'up_mark_frm.html',
                    rect:{
                        x:api.frameWidth-70,
                        y:api.frameHeight/2-100,
                        w:60,
                        h:60

                    },
                    pageParam: {
        				name: 'comList_win',
    				},
                    bounces:false,
                    vScrollBarEnabled:false,
                    hScrollBarEnabled:false
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
 


function openOrcp() {
	arcProgress.open({
		type : 'crescent ',
		centerX : api.winWidth -70,
		centerY : 50,
		radius : 15,
		bgColor : '#c0c0c0',
		pgColor : '#ffffff',
		loopWidth : 3,
		//fixedOn:UIListView,
	}, function(ret, err) {
		//arcProgress.setValue({
			//id : 1,
			//value : 50
		//});
		orcpNum=ret.id;
		//alert("orcpNum"+orcpNum);
		!function(id, value){
            var si=setInterval(function(){

                if(value > 100){
                    value %= 100;
                }
				if(upSuccess==0)
				{
					//alert("上传失败！ si"+si);
					clearInterval(si)
					alert("上传失败！ 请检查网络状态!");
					arcProgress.close({
						id : id
					});
					return ;
				}
				if(upFlag==0)//所有公司上传完成后停止进度条
				{
						//upDone();
						//alert("上传完成");
						clearInterval(si);
						arcProgress.close({
						id : id
					});
					comListShow();
					return ;
				}
                arcProgress.setValue({
                    id: id,
                    value: value ++
                });
            }, 30);
        }(orcpNum, 0);
	});
}



function openImageBrowser(imgs) {
	imageBrowser.openImages({
		imageUrls : imgs,
		showList : false,
		activeIndex : 0
	});
}

	function udDel(indNum) {
		
		UIListView.deleteItem({
			index : indNum-0+1
		}, function(ret, err) {
			alert("删除" + (indNum-0+1));
		});
		
		//
		//alert("indNum"+indNum);
	}


function picScan(num) {//获取这一行的数据的comId
	currentIndex=num;
	UIListView.getDataByIndex({
		index : num
	}, function(ret, err) {
		if (ret) {
			//ret.data[0]			
				var comId=ret.data.icon;
				currentComId=comId;
				getPicData(comId);
						
			//alert(JSON.stringify(ret.data.icon));
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function getComData() {
	db.openDatabase({
		name : 'app'
	}, function(ret, err) {
		//coding...
		if (ret.status) {
			var sql = "select * from company";
			db.selectSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				var rdata = ret.data;
				//alert("company:" + rdata.length + ",comId:" + rdata[0].comId);
				for (var i = 0; i < rdata.length; i++) {
					insertToList(rdata[i]);
				}

			});
		}
	});

}

function insertToList(rdata) {
	UIListView.insertItem({
		//index : 2,
		data : {
			imgPath : 'http://d.hiphotos.baidu.com/image/pic/item/4d086e061d950a7b29a788c209d162d9f2d3c922.jpg',
			title : rdata.comId,
			subTitle : rdata.address,
			remark : rdata.createAt,
			icon:rdata.comId,
			rightBtns : [{
				title : '删除'
			}]
		}

	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
		} else {
			alert(JSON.stringify(err));
		}
	});
}



//*****************************************上传*******************************/
//把一个公司的公司信息以及这个公司的图片和图片信息作为一个整体来上传，只有当着整个模块都上传成功了，才删除公司信息
//图片文件和图片信息上传成功则直接删除本地记录
function deleteFromList(index) {
	UIListView.deleteItem({
		index : index
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
		} else {
			alert(JSON.stringify(err));
		}
	});
}

	// 上传图片
	// url：上传的url地址
	// data：上传的文件
	// callback：上传成功返回地址
//http://192.168.2.103:8086/img/me.jpg

	function uploadFile(curIndex,url, data) {

		//alert("uploadFile/url:" + url + ";data.url:" + data.url);
		api.ajax({
			url : url,
			method : 'post',
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			data : {
				//values: {
				//name: 'haha'
				//}
				files : {
					file : data.url
				}
			}
		}, function(ret, err) {
			//alert("ret.status:"+ JSON.stringify(ret)+"ret.err:"+JSON.stringify(err));
			
				//api.alert({msg : JSON.stringify(ret)});
				if (ret.status == 1) {
					
					//alert("上传成功后服务器返回的地址：" + ret.path);
	            	upLoadPicInfo(curIndex,data,ret.path);//图片上传成功后，则上传该图片的信息
				} else if (ret.status == 0) {
					alert("上传失败");
				}
			
		});
	}



function upLoadPicInfo(curIndex,data,serverImg){
	//alert("upLoadPicInfo comId:"+comId);
	var picId=data.picId;
	var comId=data.comId;
	var picName=data.picName;
	var picurl=serverImg;
	var createAt=data.createAt;
	var url_native=data.url;

	//var upurl='http://218.93.25.58:8086/ajax/recPicInfo.ashx';
	var upurl=sevUrl.url+"recPicInfo.ashx";
		api.ajax({
			url : upurl,
			method : 'post',
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			data : {
				values: { 
        			comId: comId,
        			picName: picName,
        			picurl: picurl,
        			createAt: createAt,           			
    			}
				//files : {
					//file : data
				//}
			}
		}, function(ret, err) {
			if(ret.status==1){
				//alert("图片信息上传成功");
				upPicFlag[curIndex]--;
				delOnePicsFile(url_native);
				delOnePics(picId);
				//alert("upPicFlag[curIndex]:"+upPicFlag[curIndex]);
				if(upPicFlag[curIndex]==0){
					upLoadCom(curIndex,comId);//picUpNums==0则表示这个公司的图片文件和图片信息上传完成，则开始上传公司信息。
				}
			}else{
				//alert("图片信息上传ret.status"+ret.status);
				upSuccess=0;
			}
			
		});	

}

function upLoadCom(curIndex,comId){
	//alert("uploadCom  comId:"+comId);
	try{
	var sql = "select * from company where comId='"+comId+"'";
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		
		var comId=ret.data[0].comId;
		var comName=ret.data[0].comName;
		var address=ret.data[0].address;
		var city=ret.data[0].city;
		var tel=ret.data[0].tel;
		var comment=ret.data[0].comment;
		var comLinker=ret.data[0].comLinker;
		var linePrice=ret.data[0].linePrice;
		var zbr=ret.data[0].zbr;
		var createAt=ret.data[0].createAt;
		//alert("upLoadCom  comName:"+comName);
		//var upurl='http://218.93.25.58:8086/ajax/recCom.ashx';
		var upurl=sevUrl.url+"recCom.ashx";
			api.ajax({
				url : upurl,
				method : 'post',
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				data : {
					
					values: { 
            			comId: comId,
            			comName: comName,
            			address: address,  
            			city:city,
            			tel:tel,
            			comment:comment,
            			comLinker:comLinker,
            			linePrice:linePrice, 
            			zbr:zbr,
            			createAt:createAt,      			
        			}
					//files : {
						//file : data
					//}
				}
			}, function(ret, err) {
				if(ret.status==1){
					//alert("公司信息上传成功");
					//upDone();	
					delOneCom(comId);//公司信息上传成功后则在数据库中删除该条数据
					deleteFromList(curIndex);//当前行公司信息上传成功后，则在列表中删除该行数据
					upFlag--
				}else{
					upSuccess=0;
				}
			});	
	});
	}catch( ex){}
}


function getPicData_row(curIndex,comId) {
	
	var sql = "select * from pic where comId='"+comId+"'";
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		//alert("getPicData_row"+JSON.stringify(ret));
		
		var rdata = ret.data;
		var picUpNums=rdata.length;//每个公司需要上传的图片信息数量
		upPicFlag.push(picUpNums);
		if(picUpNums>0){//若公司图片数量大于0则允许上传
			//alert("pic:" + rdata.length + ",rdata:" + rdata[0].url);
			for (var i = 0; i < rdata.length; i++) {
				
				//url='http://218.93.25.58:8086/ajax/recPic.ashx';
				var url=sevUrl.url+"recPic.ashx";
				
				uploadFile(curIndex,url, rdata[i]);
			}

		}
		else{
			upFlag--;
		}
		
	});
	
}

function getCurData(i){//获取当前行的数据
	var curIndex=i;
	UIListView.getDataByIndex({
		index : curIndex
	}, function(ret, err) {
		if (ret) {
			//ret.data[0]			
				var comId=ret.data.icon;
				getPicData_row(curIndex,comId);
				//alert("getCurData:curIndex:"+curIndex+"comId:"+comId);		
			//alert(JSON.stringify(ret.data.icon));
		} else {
			alert(JSON.stringify(err));
		}
	});
}
	function upAll() {//点击上传按钮
		//openOrcp();
		if(ifStartLocation()){
			UIListView.getCount(function(ret) {
			//alert(JSON.stringify(ret));
				var comNum = ret.count;
				upFlag=comNum;
				//alert("upall ret.count"+ret.count);
				if (comNum > 0) {
					openOrcp();
					for (var i = 0; i < comNum; i++) {
								getCurData(i);
	
					}
				} else {
					alert("没文件没动力!");
					arcProgress.close({
							id : orcpNum
						});
				}
	
			});
		}else{
			alert("当前无网络");
		}
		
	}
	
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
	
function delOneCom(comId)//从数据库中删除一项的公司记录
{
	var sql="delete from company where comId='"+comId+"'";
	db.executeSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				//alert("从数据库中删除一项的公司记录");
			});
}

function delOnePics(picId)//从数据库中删除一条图片记录
{
	var sql="delete from pic where picId='"+picId+"'";
	db.executeSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				//alert("从数据库中删除一条图片记录");
			});
}


	function delOnePicsFile(url_native)//在本地删除一条图片文件
	{
		fs.remove({
			path : url_native
		}, function(ret, err) {
			if (ret.status) {
				//alert("在本地删除一条图片");
				//alert(JSON.stringify(ret));
			} else {
				alert(JSON.stringify(err));
			}
		});

	}
	
	/*******************************文件上传*************************************/
									///////////////////////////
/*************************************在app列表中执行删除一条公司信息操作**************************************/
function deleteOneItem(indexNum)//删除列表中的一项数据
{
	//currentIndex=indexNum;
	
	UIListView.getDataByIndex({
		index : indexNum
	}, function(ret, err) {
		if (ret) {
			//ret.data[0]			
				var comId=ret.data.icon;
				//currentComId=comId;
				delOneItemCom(comId);
				delOneItemPicsFile(comId);	
				deleteFromList(indexNum);	
			//alert(JSON.stringify(ret.data.icon));
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function delOneItemCom(comId)//从数据库中删除一项的公司记录
{
	var sql="delete from company where comId='"+comId+"'";
	db.executeSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				
			});
}

function delOneItemPics(comId)//从数据库中删除一项的图片记录
{
	var sql="delete from pic where comId='"+comId+"'";
	db.executeSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				
			});
}

function delOneItemPicsFile(comId)//在本地删除一项图片文件
{
	var picUrlList = [];
		var sql = "select * from pic where comId='"+comId+"'";
		db.selectSql({
			name : 'app',
			sql : sql
		}, function(ret, err) {
			//alert("ret.status"+ret.status);
			//alert("updone ret:" + JSON.stringify(ret));
			delOneItemPics(comId);
			for (var i = 0; i < ret.data.length; i++) {
				//alert("要删除的图片路径" + ret.data[i].url);
				fs.remove({
					path : ret.data[i].url
				}, function(ret, err) {
					if (ret.status) {
						//alert("图片删除成功");
						//alert(JSON.stringify(ret));
					} else {
						alert(JSON.stringify(err));
					}
				});
				}
			});
			
}

/*************************************在app列表中执行删除一条公司信息操作**************************************/
//显示公司信息列表
function comListShow() {
	//var UIListView = api.require('UIListView');
	UIListView.open({
		rect : {
			x : 0,
			y : 65,
			w : api.winWidth,
			h : api.winHeight
		},
		data : [],
		rightBtns : [{
			bgColor : '#388e8e',
			activeBgColor : '',
			width : 70,
			title : '详情',
			titleSize : 12,
			titleColor : '#fff',
			icon : '',
			iconWidth : 20
		},{
			bgColor : '#388e8e',
			activeBgColor : '',
			width : 70,
			title : '上传',
			titleSize : 12,
			titleColor : '#fff',
			icon : '',
			iconWidth : 20
		}],
		styles : {
			borderColor : '#696969',
			item : {
				bgColor : '#AFEEEE',
				activeBgColor : '#F5F5F5',
				height : 55.0,
				imgWidth : 40,
				imgHeight : 40,
				imgCorner : 4,
				placeholderImg : '',
				titleSize : 12.0,
				titleColor : '#000',
				subTitleSize : 12.0,
				subTitleColor : '#000',
				remarkColor : '#000',
				remarkSize : 16,
				remarkIconWidth : 30
			}
		},
		fixedOn : api.frameName
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			switch(ret.btnIndex)
			{
				case 0:
				//getImgs(ret.index);//详情页
				deleteOneItem(ret.index);
				break;
				case 1:
				
				//picScan(ret.index);
				//test();
				break;			
			}
			
			switch(ret.eventType)
			{
				case 'clickContent':
				getImgs(ret.index);//详情页
				break;
			}
		} else {
			//alert(JSON.stringify(err));
		}
	});

}


function getUrlData(comId) {
	var sql = "select * from pic where comId='" + comId + "'";
	
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		//alert(JSON.stringify(ret));
		//alert("详情ret.data[0].url"+ret.data[0].url);
		var rdata = ret.data;
		urlList = [];
		//alert("pic:" + rdata.length + ",rdata:" + rdata[0].url);
		for (var i = 0; i < rdata.length; i++) {
			//insertToList(rdata[i]);
			//var url=rdata[i].url;
			//alert("url"+url);
			urlList.push(rdata[i].url);
		}
		openDetail_win(urlList,comId);
	});
}

function getImgs(num){
	UIListView.getDataByIndex({
		index : num
	}, function(ret, err) {
		if (ret) {
			//ret.data[0]
			var comId=ret.data.icon;
			getUrlData(comId);
			//alert(JSON.stringify(ret.data.icon));
		} else {
			alert(JSON.stringify(err));
		}
	});
}
function openDetail_win(urlList,comId){

	//alert("comlist,urllist:"+JSON.stringify(urlList));
	api.openWin({
		name : 'comDetail_win',
		url : 'comDetail_win.html',
		reload: true,
		pageParam : {
			urlList : urlList,
			comId:comId
		}
	});
}
