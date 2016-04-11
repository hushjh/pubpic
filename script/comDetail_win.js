
apiready = function(){
	imageBrowser = api.require('imageBrowser');
	fs = api.require('fs');
	db = api.require('db');
	UIScrollPicture = api.require('UIScrollPicture');
	imageFilter = api.require('imageFilter');
	keyBack();
	//$("#back").click(back);	
	paths=api.pageParam.urlList;
	comId=api.pageParam.comId;
	//alert("api.pageParam: paths"+JSON.stringify(paths));
	//alert("api.pageParam comId:"+JSON.stringify(comId));
	//scrollPic();
	getComData();
	picList();
	//$("#save").click(save);
	openSaveFrm();
	openHeaderFrm();
};

function openHeaderFrm(){
	api.openFrame({
                    name:'comDetail_header_frm',
                    url:'comDetail_header_frm.html',
                    rect:{
                        x:0,
                        y:0,
                        w:api.frameWidth,
                        h:70

                    },
                    pageParam: {
        				name: 'comDetail_win',
    				},
                    bounces:false,
                    vScrollBarEnabled:false,
                    hScrollBarEnabled:false
                });
}

function openSaveFrm(){
	api.openFrame({
                    name:'save_mark_frm',
                    url:'save_mark_frm.html',
                    rect:{
                        x:api.frameWidth-70,
                        y:api.frameHeight/2-100,
                        w:60,
                        h:60

                    },
                    pageParam: {
        				name: 'comDetail_win',
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
		name : 'comList_win',
		url : 'comList_win.html',
		reload: true,
		pageParam : {
			name : 'test'
		}
	});
	});
	
}
function back() {

	api.openWin({
		name : 'comList_win',
		url : 'comList_win.html',
		reload : true,
		pageParam : {
			name : 'test'
		}
	});

}

function picList(){
	var normalW = $("#addpic img").width();
	for(var i=0;i<paths.length;i++)
	{
		var showImgHtml = '<li class="aui-list-view-cell aui-img aui-col-xs-4"><img class="aui-img-object" src="' + paths[i] + '" style="width:' + normalW + 'px;height:' + normalW + 'px;"></li>';
								// 追加图片
		$("#addpic").before(showImgHtml);
	}
}

function save(){//保存公司信息
	var linePrice=$("#linePrice").val();
	var tel=$("#tel").val();
	var comLinker=$("#comLinker").val();
	var comId = $("#comId").val();
	var comName = $("#comName").val();
	var comment = $("#comment").val();
	var address = $("#address").val();
	//var city = $("#city").text();
	
	linePrice=linePrice.replace("'","");
	tel=tel.replace("'","");
	comLinker=comLinker.replace("'","");
	//comId=comId.replace("'","");
	comName=linePrice.replace("'","");
	comment=comment.replace("'","");
	address=address.replace("'","");
	//city=city.replace("'","");
	
	var sql="update company set linePrice='"+linePrice+"',tel='"+tel+"',comLinker='"+comLinker+"',comName='"+comName+"',comment='"+comment+"',address='"+address+"' where comId='"+comId+"'";
	db.executeSql({
	    name:'app',
	    sql:sql
    },function(ret,err){
    	//coding...
    	if(ret.status){
    		alert("保存成功!");
    	}
    	
    });
}

function getComData() {
	$("#comId").val(comId);
	db.openDatabase({
		name : 'app'
	}, function(ret, err) {
		//coding...
		if (ret.status) {
			var sql = "select * from pic where comId='" + comId + "'";
			db.selectSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				//alert("ret:"+JSON.stringify(ret));
				//alert("company:" + rdata.length + ",comId:" + rdata[0].comId);
				if (ret.data.length>0) {
					var rdata = ret.data;
					$("#createAt").val(rdata[0].createAt);
				} else {
					$("#createAt").val(getNowFormatDate());
				}
				

			});
		}
		if (ret.status) {
			var sql = "select * from company where comId='" + comId + "'";
			db.selectSql({
				name : 'app',
				sql : sql
			}, function(ret, err) {
				var rdata = ret.data;
				//alert("company:" + rdata.length + ",comId:" + rdata[0].comId);
				$("#comName").val(rdata[0].comName);
				$("#address").val(rdata[0].address);
				$("#tel").val(rdata[0].tel);
				$("#comLinker").val(rdata[0].comLinker);
				$("#comment").val(rdata[0].comment);
				$("#linePrice").val(rdata[0].linePrice);
			});
		}
	});
}

// 获取当前的时间，拼接成2015-11-09这样的格式，主要用于对图片进行时间分类
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate
	return currentdate;
}


$("#imgslist").on("tap", "li:not(#addpic)", function() {
	// 定义一个数组，存储需要预览的图片
	var browerImgs = [];
	$("#imgslist li:not(#addpic)").each(function() {
		// 将图片追加到数组中
		browerImgs.push($(this).find("img").attr("src"));
	});
	// 调用图片预览函数
	openImageBrowser(browerImgs);
});

// 打开图片浏览
// imgs：需要预览的图片集合
function openImageBrowser(imgs) {
	imageBrowser.openImages({
		imageUrls : imgs,
		showList : false,
		activeIndex : 0
	});
}


function saveAuto(picUrlCurrent) {
	var comId = $("#comId").val();
	//var comName = $("#comName").val();
	//var comment = $("#comment").val();
	var address = $("#address").val();
	//var city = $("#city").text();
	var picName = '';
	var url = picUrlCurrent;
	var createAt = $("#createAt").val();

	var sql = "insert into pic(comId,picName,url,createAt)values('" + comId +  "','" + picName + "','" + url + "','" + createAt + "')";

	db.executeSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if (ret.status) {
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});

}


Zepto(function($) {
	// 获取图片宽高
	var normalW = $("#addpic img").width();
	// 添加图片绑定点击事件
	$("#imgslist").on("tap", "#addpic", function() {
		
					// 打开拍照
					api.getPicture({
						sourceType : "camera",
						encodingType : "jpg",
						destinationType : "url",
						mediaValue : "pic",
						quality : 50,
						saveToPhotoAlbum : true
					}, function(ret, err) {
						if (ret && ret.data) {
							// 拍照返回的本地路径
							var returnUrl = ret.data;
							// 图片压缩
							imgCompress(returnUrl, 0.5, 0.5, getExt(returnUrl), function(compressImg) {
								var showImgHtml = '<li class="aui-list-view-cell aui-img aui-col-xs-4"><img class="aui-img-object" src="' + compressImg + '" style="width:' + normalW + 'px;height:' + normalW + 'px;"></li>';
								// 追加图片
								$("#addpic").before(showImgHtml);
								//urlList.push(compressImg);
								saveAuto(compressImg);
							});
						} else {
							api.toast({
								msg : '没有选择，或者选择出错'
							});
						}
					});
	});
});

var uiMediaScanner = null, imageFilter = null;
var isIOS = false;
// 生成guid,主要用于生成随机文件名
function NewGuid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// 获取当前的时间，拼接成2015-11-09这样的格式，主要用于对图片进行时间分类
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate
	return currentdate;
}

// 获取文件拓展名
function getExt(fileName) {
	return fileName.substring(fileName.lastIndexOf('.') + 1);
}

// 图片压缩
// imgsrc：源图片的路径
// quality：图片压缩质量，一般建议0.5
// scale：图片压缩比例，也是建议0.5
// ext：源图片拓展名
// callback：转换成功之后回调函数
function imgCompress(imgsrc, quality, scale, ext, callback) {
	// 压缩文件的保存目录
	var savePath = api.cacheDir + "/" + getNowFormatDate() + "/";
	// 压缩文件生成的随机文件名称
	var savename = NewGuid() + "." + ext;
	imageFilter.compress({
		img : imgsrc,
		quality : quality,
		scale : quality,
		save : {
			album : false,
			imgPath : savePath,
			imgName : savename
		}
	}, function(ret, err) {
		if (ret) {
			callback(savePath + savename);
			
			fs.remove({
					path : imgsrc
				}, function(ret, err) {
					if (ret.status) {
						//alert("图片删除成功");
						//alert(JSON.stringify(ret));
					} else {
						alert(JSON.stringify(err));
					}
				});
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function scrollPic() {
	//var urlList=[];
	//var paths=new Array();
	//for(var i=0;i<urlList.length;i++){
		//paths.push(urlList[i]);
	//}
	//alert("paths:"+paths);
	UIScrollPicture.open({
		rect : {
			x : 0,
			y : 45,
			w : api.winWidth,
			h : 300
		},
		//data : {
			//paths : ['widget://res/img/ic/slide1.jpg', 'widget://res/img/ic/slide2.jpg', 'widget://res/img/ic/slide5.jpg', 'widget://res/img/ic/slide3.jpg', 'widget://res/img/ic/slide4.jpg'],
			//captions : ['title1', 'title2', 'title3', 'title4', 'title5']
		//},
		data:{
			paths:paths,
			//captions:['title1','title2']
		},
		styles : {
			//caption : {
				
			//},
			indicator : {
				align : 'center',
				color : '#FFFFFF',
				activeColor : '#DA70D6'
			}
		},
		placeholderImg : 'widget://res/slide1.jpg',
		contentMode : 'scaleToFill',
		interval : 3,
		loop : true,
		fixedOn : api.frameName,
		fixed : false
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
		} else {
			alert(JSON.stringify(err));
		}
	});

}
