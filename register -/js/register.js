(function (doc, win) {//自适应布局
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
//					console.log(docEl.style.fontSize);
	};
				
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
				
})(document, window);
//<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	var host="http://www.xibei.yskjpay.com/xb-mer/";
	var regUrl=host+"MerChants/mergeOrInsertForHtml";
	var bindUrl=host+"MerChants/setMerChantsForHtml";
	var loginUrl =host + "MerChants/login.shtml";
	var phone="";
	var myphone="";
	var appId="";
	var institutionNo="";
	var wait = 60;

	

	var merChantId="";
	function GetQueryString(name){

		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	//时间 
	function time(o){//倒计时
		if (wait == 0){
			o.disabled = false; 
			o.innerHTML = '验证码';
			wait = 60; 
		}else{
			o.disabled = true;
			o.innerHTML = wait + "s";
			wait--; 
			setTimeout(function(){ 
				time(document.getElementById('btn'));//循环调用 
			},1000) 
		} 
	}
	
	$("#btn").click(function(){
	  IsTel()
	});
	
	//document.getElementById('btn').onclik = function(){IsTel(this)}
	function IsTel(){
        var re1=new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/);
        var retu1 = $('#phone').val().match(re1);
        if(retu1){
            time(document.getElementById('btn'));
	    toReg();
        }else{
            alert('手机号格式错误')
        }
    }
	$("#reg").click(function(){
	  IsCode()
	});
	//document.getElementById('reg').onclick = function(){IsCode(this)}
	function IsCode(){
        var re2=new RegExp(/^[0-9]{6}$/);
        var retu2 = $('#code').val().match(re2);
        var re1=new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/);
        var retu1 = $('#phone').val().match(re1);
        if(!retu1){
            alert('手机号格式错误')
        }else if(!retu2){
            alert('验证码格式错误')
        }else{
        	login();
        }
    }

	function toReg(){
		//看似是发验证码，其实是注册
		myphone=$("#phone").val();
		$.ajax({
			url : regUrl+"?merMp="+myphone+"&institutionId="+institutionNo+"&appId="+appId,
			type : 'POST',
			//data: '{"merMp": '+myphone+', "institutionId": '+institutionNo+', "appId": '+appId+'}',
			async : false,
			cache : false,
			contentType : "application/json;charset=utf-8",
			processData : false,
			success : function(data){		
				merChantId=data.data;	
			},
			error : function(data){
				alert(data.respDesc);
			}  
		});
	}
	function login(){
		var code=$("#code").val();
		$.ajax({
			url : loginUrl+"?merMp="+myphone+"&merChantId="+merChantId +"&identifying=" + code,
			type : 'POST',
			//data: '{"merMp": '+myphone+', " merChantId": '+merChantId+'}',
			async : false,
			cache : false,
			contentType : "application/json",
			processData : false,
			success : function(data) {
				if(data.respCode=='0000'){
					toBind()
				}else{
					alert(data.respDesc);
				}
			},
			error : function(data) {
				alert(data.respDesc);
			}
		});
}
	function toBind(){
		//看似是注册，其实是绑定
		$.ajax({
			url : bindUrl+"?merMp="+phone+"&merChantId="+merChantId,
			type : 'POST',
			//data: '{"merMp": '+phone+', " merChantId": '+merChantId+'}',
			async : false,
			cache : false,
			contentType : "application/json",
			processData : false,
			success : function(data) {
				if(data.respCode=='0000'){
					$("#phone").val() == '';
					$("#code").val() == '';
					alert('成功');
				}else{
					alert(data.respCode)
				}
			},
			error : function(data) {
				alert("error:链接服务器失败");
			}
		});
	}
	$(function(){
		phone=GetQueryString("merMp");
		appId=GetQueryString("appId");
		institutionNo=GetQueryString("institutionId");

	});