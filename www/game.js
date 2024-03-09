window.addEventListener("orientationchange",function(){
    screen.orientation.lock('portrait');//一直保持竖屏
});
    
function getId(str){
    return document.getElementById(str);
}

var widthid =getId('width');//宽度的id
var heightid =getId('height');//高度的id
var startid =getId('start');//开始游戏的id
var goalid=getId('goal');//目标的id
var gameboard =getId('gameboard');//游戏板的id
var scoreboard=getId('score');//分数板的id
var body=document.body;//获取body
var kuan=5,gao=5;//宽和高
var thisscore=0,score=0;//本次得分,总得分
var k=0,q=0;//计数
var divWidth;
var divHeight;
var divLeft;
var divTop;

var idArray=new Array(8);
for(i=0;i<8;i++){
    idArray[i]=new Array(10);
}//与id匹配的数组 批量处理id
for(i=0;i<8;i++){
    for(j=0;j<10;j++){
        idArray[i][j] = document.createElement("div");//创造div
        idArray[i][j].id=(i+1)*10+j;//给每一个div创id
    }
}
for(i=0;i<8;i++){
    for(j=0;j<10;j++){
        idArray[i][j].now=0;//增加一个now键，0表示该div未被选中，1表示选中
    }
}

var shu=new Array(10);
for(i=0;i<10;i++){
    shu[i]=new Array(12);
}//内容数组 先高后宽,扩大一圈
for(i=0;i<10;i++){
    for(j=0;j<12;j++){
        shu[i][j]=0;
    }
}
var shuValue=function(){//给shu数组赋值
    for(i=1;i<9;i++){
        for(j=1;j<11;j++){
            shu[i][j]=Math.round(Math.random()*(3-1)+1);
        }
    }
}
shuValue();

var shuToArray=function(){//对应id的div数值与shu数组中的值对应起来
    for(i=0;i<8;i++){
    for(j=0;j<10;j++){
        idArray[i][j].value=shu[i+1][j+1];
    }
}
}
shuToArray();

var panduan=new Array(10);
for(i=0;i<10;i++){
    panduan[i]=new Array(12);
}//判断数组，用来判断合成
var panduanToZero=function(){//将panduan数组置零
    for(i=0;i<10;i++){
    for(j=0;j<12;j++){
        panduan[i][j]=0;
    }
}
}
panduanToZero();

var sleep = function (delay) {//sleep函数?
  let start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

var getColor=function(value){//对应数字对应一个颜色
    var r=0,g=0,b=0;
    switch(value){
        case 1:r=255;g=182;b=193;break;/*粉*/case 2:r=0;g=255;b=255;break;/*青*/case 4:r=0;g=0;b=255;break;/*蓝*/case 3:r=139;g=69;b=19;break;/*黄*/
        case 5:r=220;g=220;b=220;break;/*灰*/case 6:r=220;g=20;b=60;break;/*红*/case 7:r=30;g=144;b=255;break;/*蓝*/case 9:r=0;g=128;b=128;break;/*绿*/
        case 8:r=255;g=215;b=0;break;/*黄*/case 10:r=255;g=0;b=255;break;/*红*/case 11:r=0;g=255;b=0;break;/*青*/case 12:r=210;g=105;b=30;break;/*黄*/
        case 13:r=128;g=0;b=128;break;/*紫*/case 14:r=135;g=206;b=235;break;/*蓝*/case 15:r=222;g=184;b=135;break;/*澄*/case 16:r=211;g=211;b=211;break;/*灰*/
        case 17:r=240;g=248;b=255;break;/*蓝*/case 19:r=0;g=250;b=154;break;/*绿*/case 18:r=128;g=128;b=0;break;/*皇*/case 20:r=255;g=105;b=180;break;/*粉*/
    }
    
    let a=r.toString(16);
    let d=g.toString(16);
    let c= b.toString(16);
    if(r==0){
        a='0'+r.toString(16);
    }
    if(g==0){
        d='0'+g.toString(16);
    }
    if(b==0){
        c='0'+b.toString(16);
    }
    var colorHex =a+d+c;//转成16进制
    return "#"+colorHex;//动态改变颜色
}

var di=function(shu,panduan,ifhang,iflie){//递归获得处理好的panduan数组
    //ifhang1-8 iflie1-10
    var i;
    for (i = -1; i <= 1; i = i + 2) {
        if (shu[(ifhang + i)][iflie] == shu[ifhang][iflie]&&panduan[(ifhang + i) ][iflie]!=1&&ifhang+i<=gao) {//上下两个
            panduan[(ifhang + i)][iflie] = 1;
            di(shu,panduan, ifhang + i, iflie);
        }
        if (shu[(ifhang)][iflie+i] == shu[ifhang][iflie]&& panduan[(ifhang)][ iflie + i] != 1&&iflie+i<=kuan) {//左右两个
            panduan[(ifhang) ][iflie + i] = 1;
            di(shu,panduan, ifhang, iflie+i);
        }
    }
}

var ifcon=function() {//判断能不能继续合成
	let i, j;
	let k=0;

	for (i = 1; i < gao ; i++) {
		for (j = 1; j < kuan; j++) {
			if (!(shu[i][j] == shu[i - 1][j] || shu[i][j] == shu[i + 1][j] || shu[i][j] == shu[i][j - 1] || shu[i][j] == shu[i][j + 1]));
			else {
				k = 1;
			}
		}
	}
    for(i=gao,j=1;j<kuan;j++){
        if (!(shu[i][j] == shu[i - 1][j] || shu[i][j] == shu[i][j - 1] || shu[i][j] == shu[i][j + 1]));//不用和下面的比
		else {
			k = 1;
		}
    }
    for(i=1,j=kuan;i<gao;i++){
        if (!(shu[i][j] == shu[i - 1][j] || shu[i][j] == shu[i + 1][j] || shu[i][j] == shu[i][j - 1]));//不用和右边的比
		else {
			k = 1;
		}
    }
    for(i=gao,j=kuan;i<=gao&&j<=kuan;i++,j++){
        if (!(shu[i][j] == shu[i - 1][j] || shu[i][j] == shu[i][j - 1]));//不用和右边和下面的比
		else {
			k = 1;
		}
    }
	if (k == 0) {//不能再合成
		alert('无法再合成，游戏结束');
		return 0;
	}
	return 1;
}

var reachgoal=function(){//达到合成目标
    let maxNumber=shu[1][1];

    for (i = 1; i < gao + 1; i++) {
        for (j = 1; j < kuan + 1; j++) {
            if (shu[i][j] > maxNumber) {
                maxNumber = shu[i][j];
            }
        }
    }
    if(maxNumber==goalid.value){
        alert('已经达到合成目标 '+maxNumber+' \n'+"向下一个目标进发！");
        goalid.value++;
    }
}

var find=function(thisid){//找到相邻一样数字的div,panduan数组置1
    let leftmark=parseInt(thisid / 10);
    let rightmark=parseInt(thisid % 10+1);
    if(leftmark==gao&&rightmark!=parseInt(kuan)&&
        shu[leftmark][rightmark]!=shu[leftmark-1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark-1]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark+1]){//不用和下一行对比
        alert("无匹配");
        panduan[leftmark][rightmark]=1;
        return 1;
    }
    else if(leftmark==gao&&rightmark==parseInt(kuan)&&
        shu[leftmark][rightmark]!=shu[leftmark-1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark-1])//不用和下一行和后一个比
        {
        alert("无匹配");
        panduan[leftmark][rightmark]=1;
        return 1;
    }
    else if(rightmark==parseInt(kuan)&&leftmark!=gao&&
        shu[leftmark][rightmark]!=shu[leftmark-1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark+1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark-1])//不用和后一个比
        {
        alert("无匹配");
        panduan[leftmark][rightmark]=1;
        return 1;
    }
    else if(shu[leftmark][rightmark]!=shu[leftmark-1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark+1][rightmark]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark-1]&&
        shu[leftmark][rightmark]!=shu[leftmark][rightmark+1])
        {
        alert("无匹配");
        panduan[leftmark][rightmark]=1;
        return 1;
    }
    else{
        panduan[parseInt(thisid / 10)][parseInt(thisid % 10+1)]=1;//注意如果没有匹配的要归零，最后要处理
        di(shu,panduan,parseInt(thisid / 10),parseInt(thisid % 10+1));//此处panduan数组处理完毕
        for(i=1;i<9;i++){
            for(j=1;j<11;j++){
                if(panduan[i][j]==1){
                    idArray[i-1][j-1].style.setProperty('outline-color','white');
                    idArray[i-1][j-1].style.setProperty('color','white');//同样数字数组置白
                }
            }
        }//此处方块涂白完毕
        return 2;
    }
}

var bing=function(ifhang,iflie){//合并div,得到处理好的shu数组和未处理好的panduan数组
    let bingNum=0;//合并的个数,用于计分

    for (i = 1; i < gao + 1; i++) {
        for (j = 1; j < kuan+1; j++) {
            if (panduan[i][j] == 1) {
                bingNum++;
                if (i!=ifhang || j!=iflie) {
                    shu[i][j] = 0;//shu数组清零
                    idArray[i-1][j-1].style.setProperty('opacity',0);
                }
            }
        }
    }
    thisscore=bingNum*3*shu[ifhang][iflie];
    score+=thisscore;
    scoreboard.innerHTML="本次得分 : "+thisscore+" ;总得分 : "+score;

    shu[ifhang][iflie]++;//选定div数值加1
    panduan[ifhang][iflie]=0;//panduan数组归零
    idArray[ifhang-1][iflie-1].value++;
    idArray[ifhang-1][iflie-1].innerHTML=shu[ifhang][iflie];//显示数字加一
    idArray[ifhang-1][iflie-1].style.setProperty('opacity',1);
    idArray[ifhang-1][iflie-1].style.setProperty('background-color',getColor(idArray[ifhang-1][iflie-1].value));
}

var luo = function(){//下落div，获得处理好的panduan数组（全0）
    for (i = 1; i < gao + 1; i++) {
        for (j = 1; j < kuan + 1; j++) {
            if (panduan[i][j] == 1) {
                panduan[i][j] = 0;//panduan数组清零
                for (k = i; k > 0; k--) {
                    shu[k][j] = shu[k - 1][j];//下落操作
                    if(k>1){
                        idArray[k-1][j-1].value=idArray[k-1-1][j-1].value;
                    }
                    else{
                        idArray[k-1][j-1].value=0;//同时要处理shu和idarray.value
                    }
                    if (k > 1) {
                        idArray[k-1-1][j-1].innerHTML=null;//上方的div清零
                        idArray[k-1-1][j-1].style.setProperty('opacity',0);
                        
                        if(idArray[k-1][j-1].value!=0){
                            idArray[k-1][j-1].innerHTML=idArray[k-1][j-1].value;
                            idArray[k-1][j-1].style.setProperty('opacity',1);
                            idArray[k-1][j-1].style.setProperty('outline-color','black');
                            idArray[k-1][j-1].style.setProperty('color','black');
                            var theColor=getColor(idArray[k-1][j-1].value);
                            idArray[k-1][j-1].style.setProperty('background-color',theColor);//颜色
                        }
                        else{
                            idArray[k-1][j-1].innerHTML=null;
                            idArray[k-1][j-1].style.setProperty('opacity',0);//颜色
                        }
                    }
                }
            }
        }
    }
}

var fill=function(){//补全div，获得处理好的shu数组
    let maxNumber=shu[1][1];

    for (i = 1; i < gao + 1; i++) {
        for (j = 1; j < kuan + 1; j++) {
            if (shu[i][j] > maxNumber) {
                maxNumber = shu[i][j];
            }
        }
    }

    for (i = 1; i < gao + 1; i++) {
        for (j=1;j<kuan+1;j++) {
            if (shu[i][j] ==0) {
                {
                    var base;
                    switch (maxNumber) {//为shu[i][j]赋值
                        case 3:
                            shu[i][j] = Math.round(Math.random()*(3-1)+1);
                            break;
                        case 4:
                            base = Math.round(Math.random()*(9));
                            if (base >= 0 && base <= 8) {
                                shu[i][j] = Math.round(Math.random()*(3-1)+1);
                            }
                            else if (base == 9) {
                                shu[i][j] = 4;
                            }
                            break;
                        case 5:
                            base = Math.round(Math.random()*(100-1)+1);
                            if (base >= 1 && base <= 75) {
                                shu[i][j] = Math.round(Math.random()*(3-1)+1);
                            }
                            else if (base >= 76 && base <= 90) {
                                shu[i][j] = 4;
                            }
                            else if (base >= 91 && base <= 100) {
                                shu[i][j] = 5;
                            }
                            break;
                        case 6:
                            base = Math.round(Math.random()*(100-1)+1);
                            if (base >= 1 && base <= 80) {
                                shu[i][j] = Math.round(Math.random()*(4-1)+1);
                            }
                            else if (base >= 81 && base <= 95) {
                                shu[i][j] = 5;
                            }
                            else if (base >= 96 && base <= 100) {
                                shu[i][j] = 6;
                            }
                            break;
                        default:
                            base = Math.round(Math.random()*(100-1)+1);
                            if (base >= 1 && base <= 80) {
                                shu[i][j] = Math.round(Math.random()*(maxNumber-3)+1);
                            }
                            else if (base >= 81 && base <= 90) {
                                shu[i][j] = maxNumber - 2;
                            }
                            else if (base >= 91 && base <= 95) {
                                shu[i][j] = maxNumber - 1;
                            }
                            else if (base >= 96 && base <= 100) {
                                shu[i][j] = maxNumber;
                            }
                            break;
                    }
                }
                //为shu赋值完毕
                idArray[i-1][j-1].value=shu[i][j];
                idArray[i-1][j-1].innerHTML=idArray[i-1][j-1].value;
                idArray[i-1][j-1].style.setProperty('opacity',1);
                idArray[i-1][j-1].style.setProperty('outline-color','black');
                idArray[i-1][j-1].style.setProperty('color','black');
                idArray[i-1][j-1].style.background=getColor(idArray[i-1][j-1].value);//颜色
                
            }
        }
    }
}

var reset=function(){
    for(i=1;i<=gao;i++){
        for(j=1;j<=kuan;j++){
            if(panduan[i][j]==1){
                panduan[i][j]=0;
                idArray[i-1][j-1].style.setProperty('outline-color','black');
                idArray[i-1][j-1].style.setProperty('color','black');
            }
        }
    }
}

var clear=function(){//游戏结束清除
    let ifconfirm=confirm("游戏结束,恭喜你获得总分 "+score+"  !!\n是否重制？");
    if(ifconfirm==1){
        location.reload();
    }
    else{
        return 1;
    }

}

var enter=function(Object){//回车确认
    //此时已经被control调用,已经按了一次回车
    var thisId = parseInt(Object.id);//获得这个div的id
    var findResult=0;
    findResult=find(thisId);//找到相邻div
    document.onkeydown=function(ev){//键盘操作
        var ev=ev||event;
        if(ev.keyCode==37){
            reset();
            let newObject;
            if(parseInt(thisId-1)%10==9){
                newObject=getId(parseInt(thisId+kuan-1));//环绕
            }
            else{
                newObject=getId(parseInt(thisId-1));//获得新Object
            }
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
            control(newObject);
        }
        else if(ev.keyCode==38){
            reset();
            let newObject;
            if(parseInt(thisId-10)<10){
                newObject=getId(parseInt(thisId+(gao-1)*10));//环绕
            }
            else{
                newObject=getId(parseInt(thisId-10));//获得新Object
            }    
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
            control(newObject);
        }
        else if(ev.keyCode==39){
            reset();
            let newObject;
            if(parseInt(thisId+1)%10>=kuan){
                newObject=getId(parseInt(thisId-kuan+1));//环绕
            }
            else{
                newObject=getId(parseInt(thisId+1));//获得新Object
            }
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
            control(newObject);
        }
        else if(ev.keyCode==40){
            reset();
            let newObject;
            if(parseInt(thisId+10)>=(gao+1)*10){
                newObject=getId(parseInt(thisId-(gao-1)*10));//环绕
            }
            else{
                newObject=getId(parseInt(thisId+10));//获得新Object
            }
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
            control(newObject);
        }
        else if(ev.keyCode==13&&findResult==2){
            bing(parseInt(thisId / 10),parseInt(thisId % 10+1));
            setTimeout(luo,100);
            setTimeout(fill,200);
            findResult=0;
            control(Object);
        }
    }
    Object.onclick=function(){//鼠标操作
        if(findResult==2){
            bing(parseInt(thisId / 10),parseInt(thisId % 10+1));
            setTimeout(luo,100);
            setTimeout(fill,200);
            findResult=0;
            control(Object);
        }
    }
    Object.onmouseout=function(){
        reset();
        control(Object);
    }
}

var ifclear=0;

var control=function(Object){//上下左右键控制系统,鼠标控制
    var ObjectId=parseInt(Object.id);//原本div的id
    var newObject=Object;

    if(ifclear==0){
    Object.now=1;
    document.onkeydown=function(ev){//键盘操作
        var ev=ev||event;
        if(ev.keyCode==37){//左
            Object.now=0;
            Object.style.setProperty('color','black');
            Object.style.setProperty('outline-color','black');//复原
            
            if(parseInt(ObjectId-1)%10==9){
                newObject=getId(parseInt(ObjectId+kuan-1));//环绕
            }
            else{
                newObject=getId(parseInt(ObjectId-1));//获得新Object
            }
            newObject.now=1;
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
        }
        else if(ev.keyCode==38){//上
            Object.now=0;
            Object.style.setProperty('color','black');
            Object.style.setProperty('outline-color','black');//复原

            if(parseInt(ObjectId-10)<10){
                newObject=getId(parseInt(ObjectId+(gao-1)*10));//环绕
            }
            else{
                newObject=getId(parseInt(ObjectId-10));//获得新Object
            }    
            newObject.now=1;
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
        }
        else if(ev.keyCode==39){//右
            Object.now=0;
            Object.style.setProperty('color','black');
            Object.style.setProperty('outline-color','black');//复原

            if(parseInt(ObjectId+1)%10>=kuan||parseInt(ObjectId)%10==9){
                newObject=getId(parseInt(ObjectId-kuan+1));//环绕
            }
            else{
                newObject=getId(parseInt(ObjectId+1));//获得新Object
            }
            newObject.now=1;
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
        }
        else if(ev.keyCode==40){//下
            Object.now=0;
            Object.style.setProperty('color','black');
            Object.style.setProperty('outline-color','black');//复原

            if(parseInt(ObjectId+10)>=(gao+1)*10){
                newObject=getId(parseInt(ObjectId-(gao-1)*10));//环绕
            }
            else{
                newObject=getId(parseInt(ObjectId+10));//获得新Object
            }
            newObject.now=1;
            newObject.style.setProperty('color','white');
            newObject.style.setProperty('outline-color','white');//变白
        }
        if(ev.keyCode!=13){
            control(newObject);
        }
        else{
            newObject.new=0;
            enter(newObject);
        }
    }
    for(i=0;i<gao;i++){//鼠标操作
        for(j=0;j<kuan;j++){
            idArray[i][j].onmouseover=function(){
                for(i=0;i<gao;i++){
                    for(j=0;j<kuan;j++){
                        if(idArray[i][j].now==1){
                            idArray[i][j].now=0;
                            idArray[i][j].style.setProperty('color','black');
                            idArray[i][j].style.setProperty('outline-color','black');//先把原本的标黑
                            idArray[i][j].style.setProperty('cursor','default');//设置鼠标悬浮样式
                        }
                    }
                }

                this.now=1;
                this.style.setProperty('color','white');
                this.style.setProperty('outline-color','white');
                this.style.setProperty('cursor','pointer');//设置鼠标悬浮样式
                newObject=this;
                control(newObject);
            }
            idArray[i][j].onclick=function(){
                newObject=this;
                if(this.now==1&&this.id%10<kuan&&parseInt(this.id/10)<=gao){
                    newObject.now=0;
                    enter(newObject);
                }
                
            }
        }
    }

    reachgoal();

    setTimeout(() => {
        let ifcontinue=ifcon();
        if(ifcontinue==0){
            ifclear=clear();
        }
    }, 300);
    }
}

startid.onclick=function start(){
    shuValue();//给shu赋值
    shuToArray();//给array赋值
    panduanToZero();//panduan数组置零
    kuan=parseInt(widthid.value);
    gao=parseInt(heightid.value);
    ifclear=0;
    if(kuan==0){
        kuan=5;
    }
    if(gao==0){
        gao=5;
    }

    thisscore=0;//复原
    score=0;//复原
    scoreboard.innerHTML="本次得分 : "+thisscore+" ;总得分 : "+score;
    gameboard.innerHTML=null;//复原
    for(i=0;i<8;i++){//复原
        for(j=0;j<10;j++){
            idArray[i][j].innerHTML=null;
            idArray[i][j].now=0;
            idArray[i][j].style.background='white';
            idArray[i][j].style.setProperty('opacity',0);
            idArray[i][j].onmouseover=function(){
                idArray[i][j].style.setProperty('cursor','default');
            }
        }
    }

    let boardWidth=window.innerWidth;
    divWidth=(boardWidth*1.0)*33.0/(45.5*parseInt(kuan)+19.0);//div宽度
    divLeft=divWidth*1.0/3.0;
    divHeight=divWidth*23.0/22.0;
    divTop=divLeft*23.0/22.0;
    let boardHeight=(divHeight*10.0/22.0)*2+parseInt(gao)*divHeight+(parseInt(gao)-1)*divTop;
    let outOffsetOne=-divWidth*1.0/6.0;//边框
    let outOffsetTwo=-divWidth*1.0/7.0;//箱子
    let fontSize=divWidth*1.0/3.0;
    gameboard.style.width=boardWidth+'px';
    gameboard.style.height=boardHeight+'px';//显现最外边框
    gameboard.style.setProperty('animation','showon 1000ms');
    gameboard.style.setProperty('-webkit-animation','showon 1000ms');
    gameboard.style.setProperty('border','4px solid black');
    gameboard.style.setProperty('outline','2px dashed black');
    gameboard.style.setProperty('outline-offset',outOffsetOne+"px");
    for(i=0;i<parseInt(gao);i++){
        for(j=0;j<parseInt(kuan);j++){
            gameboard.appendChild(idArray[i][j]);//加入子div元素
        }
    }

    for(i=0;i<gao;i++){
        for(j=0;j<kuan;j++){
            idArray[i][j].innerHTML=idArray[i][j].value;//显现div上的数字
        }
    }
    for(i=0;i<gao;i++){
        for(j=0;j<kuan;j++){
            idArray[i][j].style.setProperty('animation','showon 1000ms');
            idArray[i][j].style.setProperty('-webkit-animation','showon 1000ms');
            idArray[i][j].style.background=getColor(idArray[i][j].value);//赋颜色
            idArray[i][j].style.setProperty('opacity',1);
            idArray[i][j].style.setProperty('border-color','black');
            idArray[i][j].style.setProperty('color','black');
            idArray[i][j].style.setProperty('outline-color','black');            
            idArray[i][j].style.setProperty('width',divWidth+'px');
            idArray[i][j].style.setProperty('height',divHeight+'px');
            idArray[i][j].style.setProperty('margin-left',divLeft+'px');
            idArray[i][j].style.setProperty('margin-top',divTop+'px');
            idArray[i][j].style.setProperty('line-height',divHeight+"px");
            idArray[i][j].style.setProperty('outline-offset',outOffsetTwo+"px");
            idArray[i][j].style.setProperty('font-size',fontSize+"px");
        }
    }
    idArray[0][0].style.setProperty('color','white');
    idArray[0][0].style.setProperty('outline-color','white');
    idArray[0][0].now=1;

    console.log(shu);
    console.log(panduan);
    control(idArray[0][0]);
}

