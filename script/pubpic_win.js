var urlList=[];
var inputFlag=0;
var userinfo = $api.getStorage('user');
apiready = function() {
	/*	document.getElementById('imgActSheet').onclick=sheet;
	function sheet(){
	api.actionSheet({
	title : '选择图片来源',
	buttons : ['优雅自拍', '浏览相册']
	}, function(ret, err) {
	var index = ret.buttonIndex;
	});
	}*/
	// 引入多选模块
	fs = api.require('fs');
	db = api.require('db');
	uiMediaScanner = api.require('UIMediaScanner');
	imageFilter = api.require('imageFilter');
	imageBrowser = api.require('imageBrowser');
	bMap = api.require('bMap');

	// 判断是否是IOS系统
	isIOS = api.systemType == "ios" ? true : false;
	// 获取当前位置
	getAddr();
	setdt();
	//$("#back").click(back);
	//$("#getComId").click(getComId);
	//document.getElementById('save').onclick = save;
	//createTable();
	urlList = [];
	keyBack();
	getComId();
	//$("#imgActSheet").click(getPic);
	openSaveFrm();
	openHeaderFrm();
}; 

function inputCheck(){
	var linePrice = $("#linePrice").val().toString();
	var tel = $("#tel").val();
	var comLinker = $("#comLinker").val();
	var comName = $("#comName").val();
	
	if(linePrice !='' && tel !='' && comLinker != '' && comName != ''){
		inputFlag=1;
	}else{
		alert("公司名称或公司联系人或联系电话或线路和价格不能为空！");
		inputFlag=0;
	}
}

function openHeaderFrm(){
	api.openFrame({
                    name:'pubpic_header_frm',
                    url:'pubpic_header_frm.html',
                    rect:{
                        x:0,
                        y:0,
                        w:api.frameWidth,
                        h:70

                    },
                    pageParam: {
        				name: 'pubpic_win',
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
        				name: 'pubpic_win',
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

function t(){
	alert("pubpic frm");
}

function test(){
	var sql = "select * from pic ";
	db.selectSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		alert(JSON.stringify(ret));
		var rdata = ret.data;
		alert("pic:" + rdata.length + ",rdata:" + rdata);
		

	});
}


function getAddr() {
	bMap.getLocation({
		accuracy : '10m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			$(".ll").text(ret.lon+","+ret.lat);
			bMap.getNameFromCoords({
				lon : ret.lon,
				lat : ret.lat
			}, function(ret, err) {
				if (ret.status) {
					// 设置给位置
					$(".po").text(ret.address);
					$("#city").text(ret.city);
					
				}
			});
		} else {
			alert("无法获取当前位置:"+err.code);
		}
	});
}

function getComId(){
	
		//alert("保存成功！");
	var myDate=new Date();
	
	var comId=myDate.getTime()+"tj";
	//var comId=myDate.toLocaleDateString();
	//var comId=myDate.toLocaleTimeString();
	//var comId=myDate.toLocaleString( );
	$("#comId").val(comId);
}

//手动保存成功后弹出的提示框
function openalert_frm(){
	var w=api.winWidth;
	var h=api.winHeight;
	api.openFrame({
	    name: 'alert_frm',
	    url: 'alert_frm.html',
	    rect: {
		    x:w/2-75,
		    y:h/2-50,
		    w:150,
		    h:100
	    }
    });
}
//手动保存公司信息
function save() {
	//inputCheck();
	//if(inputFlag==0){
		//return;
	//}
	//var userinfo = $api.getStorage('user');
	//alert("userinfo:"+JSON.stringify(userinfo));
	
	var createAt = $(".dt").text();
	var zbr=userinfo.userName;
	var linePrice = $("#linePrice").val().toString();
	var tel = $("#tel").val();
	var comLinker = $("#comLinker").val();
	var comId = $("#comId").val();
	var comName = $("#comName").val();
	var comment = $("#comment").val();
	var address = $(".po").text();
	var city = $("#city").text();
//	linePrice=linePrice.replace("'","");
//	tel=tel.replace("'","");
//	comLinker=comLinker.replace("'","");
//	//comId=comId.replace("'","");
//	comName=linePrice.replace("'","");
//	comment=comment.replace("'","");
//	address=address.replace("'","");
//	city=city.replace("'","");
	//alert("linePrice:"+linePrice);
	
	var sql = "insert into company(comId,comName,address,city,tel,comLinker,comment,linePrice,zbr,createAt)values('" + comId + "','" + comName + "','" + address + "','" + city + "','" + tel + "','" + comLinker + "','" + comment + "','" + linePrice +"','" + zbr + "','" + createAt +"')";

	db.executeSql({
		name : 'app',
		sql : sql
	}, function(ret, err) {
		if (ret.status) {
			api.openWin({
				name : 'pubpic_win',
				url : 'pubpic_win.html',
				reload : true, //刷新页面
				pageParam : {
					name : 'test'
				}
			});
			//alert("保存成功！");
			openalert_frm();
			
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});

}



function saveAuto(picUrlCurrent) {
	//alert("saveatuto urlList.length:"+JSON.stringify(urlList.length));
	var comId = $("#comId").val();
	var picName = '';
	var url = picUrlCurrent;
	var createAt = $(".dt").text();
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




function setdt(){
	var date=getNowFormatDate();
	var date=date;
	$(".dt").text(date);
}

// 添加长按方法  长按删除图片
function addPress(obj, index) {
	// 获取目前长按的对象
	var hammertime = new Hammer(obj[0]);
	// 绑定长按对象
	hammertime.on("press", function(e) {
		api.confirm({
			title : '温馨提示',
			msg : '您确定要删除该图片吗？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				// 移除自己
				$(obj).remove();
				api.toast({
					msg : '删除成功！'
				});
			}
		});
	});
}




// 为图片添加点击预览功能,排除添加按钮
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
/*
Zepto(function($) {
	$("#imgslist").on("tap", "#addpic", function() {
		api.actionSheet({
			title : '选择图片来源',
			buttons : ['优雅自拍', '浏览相册']
		}, function(ret, err) {
			var index = ret.buttonIndex;
		});
	});
});
*/
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

/*
function getPic() {
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
				urlList.push(compressImg);
			});
		} else {
			api.toast({
				msg : '没有选择，或者选择出错'
			});
		}
	});
}

*/

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
								urlList.push(compressImg);
								
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

/*
Zepto(function($) {
	// 获取图片宽高
	var normalW = $("#addpic img").width();
	// 添加图片绑定点击事件
	$("#imgslist").on("tap", "#addpic", function() {
		api.actionSheet({
			title : '选择图片来源',
			buttons : ['优雅自拍', '浏览相册']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			switch(index) {
				// 拍照
				case 1:
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
								urlList.push(compressImg);
							});
						} else {
							api.toast({
								msg : '没有选择，或者选择出错'
							});
						}
					});
					break;
				// 打开图片选择器
				case 2:
					urlList = [];
					uiMediaScanner.open({
						type : 'picture',
						column : 4,
						classify : true,
						max : 6,
						sort : {
							key : 'time',
							order : 'desc'
						},
						texts : {
							stateText : '已选*项',
							cancelText : '取消',
							finishText : '完成'
						},
						styles : {
							bg : '#fff',
							mark : {
								icon : '',
								position : 'bottom_left',
								size : 20
							},
							nav : {
								bg : '#b23e4b',
								stateColor : '#fff',
								stateSize : 18,
								cancelBg : 'rgba(0,0,0,0)',
								cancelColor : '#fff',
								cancelSize : 18,
								finishBg : 'rgba(0,0,0,0)',
								finishColor : '#fff',
								finishSize : 18
							}
						}
					}, function(ret) {
						if (ret) {
							for (var i = 0; i < ret.list.length; i++) {
								var selectImg = ret.list[i];
								// 获取图片的路径
								var selectimgPath = selectImg.path;
								var selectimgThumbPath = selectImg.thumbPath;
								// IOS需要将虚拟路径转换为本地路径才可以压缩
								if (isIOS) {
									// 转换为真实路径
									uiMediaScanner.transPath({
										path : selectimgPath
									}, function(transObj) {
										// 图片压缩
										imgCompress(transObj.path, 0.5, 0.5, selectImg.suffix, function(compressImg) {
											$("#addpic").before('<li class="aui-list-view-cell aui-img aui-col-xs-4"><img class="aui-img-object" src="' + compressImg + '" style="width:' + normalW + 'px;height:' + normalW + 'px;"></li>');
										});
									});
								} else {
									// 图片压缩
									imgCompress(selectimgPath, 0.5, 0.5, selectImg.suffix, function(compressImg) {
										// 追加图片
										$("#addpic").before('<li class="aui-list-view-cell aui-img aui-col-xs-4"><img class="aui-img-object" src="' + compressImg + '" style="width:' + normalW + 'px;height:' + normalW + 'px;"></li>');
										 // ########################################  绑定长按事件 ########################
                                        addPress($("#imgslist img[src='" + compressImg + "']").parent("li"));
                                       // ########################################
                                       urlList.push(compressImg);
										//alert("length:"+urlList.length+";compressImg:"+compressImg);
									});
								}
							}
						}
					});
					break;
			}
		});
	});
});

*/