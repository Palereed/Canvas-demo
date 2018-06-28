function addHandler(element, type, handler){
    if ( element.addEventListener ) {
      element.addEventListener(type, handler, false);
    } else if ( element.attachEvent ) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
}
addHandler(window, "load" , function(){
  clock();
  shineStar();
  rotatPiece();
  luckPan();
  ballHit();
})

//时钟
function clock () {
  var clock    = document.getElementById("clock");
  var drawit   = clock.getContext("2d");
  var initialx = 150; //表盘坐标
  var initialy = 150;   
  var radius   = 130; //表盘半径
  var hlength  = radius - 65; //时针长度
  var mlength  = radius - 40;
  var slength  = radius - 15;
  setInterval( function () {
    drawit.clearRect(0, 0, 400, 400)
    //表盘代码。
    drawit.beginPath();
    drawit.arc(initialx, initialy, radius, 0, Math.PI*2);
    //填充颜色必须定义在绘制图像之前,在其后面定义则会影响不到,fillStyle与strokeStyle。
    drawit.strokeStyle = "#3b3b3b";
    //环形渐变
    var colorslow = drawit.createRadialGradient(initialx, initialy, radius, initialx, initialy, radius + 5);
    //渐变颜色设置。
    colorslow.addColorStop(0, "#3b3b3b");
    colorslow.addColorStop(1, "white"); 
    drawit.fillStyle = colorslow;
    drawit.fillRect(0, 0, 400, 400);
    drawit.stroke();
    //刻度代码。角度是自己决定的。自己决定哪里为0度,再结合三角函数来进行运算。这里是以右为0度。
    drawit.beginPath();
    for( i=0; i<360; i+=30 ){
      //三角函数只识别弧度,2pi*角度/360。
      var kx = initialx + radius * Math.cos(Math.PI * 2 * i / 360); 
      //随着角度的变化,正负也会改变,这就是三角函数的优势。
      var ky = initialy + radius * Math.sin(Math.PI * 2 * i / 360); 
      //角度最开始是从最底部,逆时针开始的。
      var endx = kx - 8 * Math.cos(Math.PI * 2 * i / 360); 
      var endy = ky - 8 * Math.sin(Math.PI * 2 * i / 360);
      drawit.moveTo(kx,ky);
      drawit.lineTo(endx,endy);
    }
    for( i=0; i<360; i+=6 ) {
      var kx = initialx + radius * Math.cos(Math.PI * 2 * i / 360); 
      var ky = initialy + radius * Math.sin(Math.PI * 2 * i / 360); 
      var endx = kx-3 * Math.cos(Math.PI * 2 * i / 360); 
      var endy = ky-3 * Math.sin(Math.PI * 2 * i / 360);
      drawit.moveTo(kx,ky);
      drawit.lineTo(endx,endy);
    }
    drawit.strokeStyle = "white";
    drawit.lineWidth = "3";
    //端点增加修饰。round弧度 square方形 butt默认
    drawit.lineCap = "round"; 
    drawit.stroke();
    //指针中心。
    drawit.beginPath();
    drawit.arc(initialx, initialy, 12, 0, Math.PI * 2, true);
    drawit.fillStyle = "white";
    drawit.fill();
    //时针,这里是以向上为0度,这样就不用减角度了。
    drawit.beginPath();
    var now = new Date();
    //一小时为30°。
    var h   = Math.abs(now.getHours() + now.getMinutes() / 60) * 30;
    var hx  = initialx + hlength * Math.sin(Math.PI * 2 * h / 360);
    var hy  = initialy - hlength * Math.cos(Math.PI * 2 * h / 360);
    drawit.moveTo(initialx,initialy);
    drawit.lineTo(hx,hy);
    drawit.lineWidth = 10;
    drawit.stroke();
    //分针
    drawit.beginPath();
    var m  = now.getMinutes() * 6;
    var mx = initialx + mlength * Math.sin(Math.PI * 2 * m / 360);
    var my = initialy - mlength * Math.cos(Math.PI * 2 * m / 360);
    drawit.moveTo(initialx,initialy);
    drawit.lineTo(mx,my);
    drawit.lineWidth = 10;
    drawit.stroke();
    //秒针
    drawit.beginPath();
    drawit.arc(initialx, initialy , 5, 0, Math.PI * 2, true);
    drawit.fillStyle = "red";
    drawit.fill();
    drawit.beginPath();
    var s  = now.getSeconds() * 6;
    var sx = initialx + slength * Math.sin(Math.PI * 2 * s / 360);
    var sy = initialy - slength * Math.cos(Math.PI * 2 * s / 360);
    drawit.moveTo(initialx,initialy);
    drawit.lineTo(sx,sy);
    drawit.lineWidth = 5;
    drawit.strokeStyle = "red";
    drawit.stroke();
  }, 500)
}

//闪烁星星
function shineStar() {
  var star    = document.getElementById("star");
  var shine   = star.getContext("2d");
  var stararr = [];
  for( var i=0; i<100; i++ ) {
    var  stars = {
      radius1 : 20 + 10 * Math.random(),
      radius2 : 30 + 20 * Math.random(),
      x : 30 + (star.width - 60) * Math.random(),
      y : 30 + (star.height - 60) * Math.random(),
      num : Math.ceil( 5 + 3 * Math.random() ),
      color : "rgb(" + parseInt( 255 * Math.random() ) + "," + parseInt( 255 * Math.random() ) + "," + parseInt( 255 * Math.random() ) + ")",
      angle : 360 * Math.random(),
      changeAngle : -5 + 12 * Math.random()
    };
    stararr.push(stars);
  }
  setInterval( function () {
    shine.clearRect(0, 0, 1100, 500);
    for( var i=0; i<stararr.length; i++ ) {
        stararr[i].angle += stararr[i].changeAngle;
        shine.beginPath();
        //不想影响别的元素的话,需要用save与restore。
        shine.save();
        shine.translate(stararr[i].x, stararr[i].y);
        shine.scale(Math.abs(Math.sin(stararr[i].angle * Math.PI / 180)),Math.abs(Math.sin(stararr[i].angle * Math.PI / 180)))
        //透明度,只能在0-1之间。并且为整个画布透明。
        shine.globalAlpha = Math.abs(Math.sin(stararr[i].angle*Math.PI/180));
        shine.rotate(stararr[i].angle * Math.PI / 180);
        drawstar(0, 0, stararr[i].radius1, stararr[i].radius2, stararr[i].num, stararr[i].color);
        shine.restore();
      }
  }, 50)
  //画星星函数
  //num为几角,radius用来确定构成图形的点。
  function drawstar(x, y, radius1, radius2, num, color){
    var angle = 360 / (num * 2);
    var arr = [];
    //for循环来确定图形各个点
    for( var i=0; i<num*2; i++ ) {
      var stars = {};
      //星星图案可以分为外圆与内圆
      //内圆点，偶数点
      if( i % 2 == 0 ){ 
         stars.pointx = x + radius1 * Math.cos(i * angle * Math.PI / 180);
         stars.pointy = y + radius1 * Math.sin(i * angle * Math.PI / 180);
      }
      //外圆点
      else{ 
         stars.pointx = x + radius2 * Math.cos(i * angle * Math.PI / 180);
         stars.pointy = y + radius2 * Math.sin(i * angle * Math.PI / 180);
      }
      arr.push(stars);
    }
    shine.beginPath();
    shine.moveTo(arr[0].pointx, arr[0].pointy);
    for( var i=1; i<arr.length; i++ ) {
       shine.lineTo(arr[i].pointx, arr[i].pointy)
    }
    shine.closePath();
    shine.fillStyle = color;
    shine.fill();
  }
}

//万花筒
function rotatPiece(){
  var beautiful = document.getElementById("beautiful");
  var draw      = beautiful.getContext("2d");
  var arr       = [];
  setInterval( function () {
    //save与restore是为了确保num即角度不会暴增。
    draw.clearRect(0, 0, 600, 610);
    for ( var i=0; i<arr.length; i++ ) {
      draw.save();
      draw.translate(300,250);
      draw.scale(arr[i].small, arr[i].small)
      draw.rotate(arr[i].angle * Math.PI * 2 / 360);
      draw.beginPath();
      draw.rect(arr[i].center, arr[i].center, 70, 70);
      draw.fillStyle = arr[i].color;
      draw.fill();
      draw.restore();
    }
  }, 30)
  setInterval( function () {
    for ( var i=0; i<arr.length; i++ ) {
      if( arr[i].center <= 0 ){
        //删除抵达中心点的元素块。
        arr.splice(i,1); 
        continue;
      }
      //角度变化
      arr[i].angle += 2;    
      arr[i].center -= 0.4;
      arr[i].small -= 0.002;
      if( arr[i].small <= 0.2 ){
        arr[i].small = 0.2
      }
    }
  }, 30) 
  addHandler(window, "focus", function(){
      creat = setInterval( function () {
      var rect = {
        angle : 0,
        center : 200,
        small : 1,
        color : "rgb(" + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255) + ")"
      }
      arr.push(rect);
    }, 500)
  })
  addHandler(window, "blur", function(){
        clearInterval(creat);
  })
  creat = setInterval( function () {
    var rect = {
      angle : 0,
      center : 200,
      small : 1,
      color : "rgb(" + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255) + ")"
    }
    arr.push(rect);
  }, 500)
  var wonderful = document.getElementById("wonderful")
  var stop      = document.getElementById("stop");
  var mark      = true;
  var creat;
  //标记元素mark避免多次点击开始按钮,setInterval的重复运行。
  wonderful.onclick = function () {
    if ( !mark ) {
      creat = setInterval( function () {
        var rect = {
          angle : 0,
          center : 200,
          small : 1,
          color : "rgb(" + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255 ) + "," + parseInt( Math.random() * 255) + ")"
        }
        arr.push(rect);
      }, 500)
    } else {
      return
    }
  }
  stop.onclick = function () {
        clearInterval(creat);
        mark = false;
  }
}

//轮盘抽奖
function luckPan(){
  var turnaround = document.getElementById("turnaround");
  var write      = turnaround.getContext("2d");
  var color      = ["#ba9870", "#f16c4d", "#fed03f", "#76EEC6", "#ff4956", "#5e9ff8"];
  var font       = ["888元", "0.8元", "8.0元", "88.0元", "0.8元", "上天了"]
  var angle      = 0;
  var surprise   = document.getElementById("surprise");
  write.translate(250,250);
  //绘制奖盘
  function creatPan () {
    //表盘区域。
    write.clearRect(-300, -300, 600, 600)
    write.save();
    write.rotate( angle * Math.PI * 2 / 360);
    write.beginPath();
    write.arc(0, 0, 210, 0, Math.PI * 2);
    write.shadowBlur = 0;
    write.shadowOffsetX = 0;
    write.shadowOffsetY = 0;
    write.fillStyle = "#f0ece3"
    write.fill();
    for( i=0; i<=5; i++ ){
       write.beginPath();
       write.moveTo(0,0);
       write.arc(0, 0, 200, (i-1) * Math.PI * 2 / 6, i * Math.PI * 2 / 6);
       //绘制路径首尾连接。
       write.closePath();
       write.fillStyle = color[i];
       write.save();
       write.shadowBlur = 5;
       write.shadowOffsetX = 2;
       write.shadowOffsetY = 0;
       write.shadowColor = "#B8B8B8";
       write.fill();
       write.restore();
    }
    //得奖区域
    for( i=0; i<=5; i++ ) {
       write.beginPath();  
       write.save();
       write.rotate(i * 60 * Math.PI * 2 / 360)
       write.font = "30px 黑体";
       write.fillStyle = "#f0ece3";
       write.shadowBlur = 0;
       write.shadowOffsetX = 0;
       write.shadowOffsetY = 0;
       write.textBaseline = "middle";
       write.fillText(font[i], -40, -150);
       write.restore();
    } 
    write.restore();
    //指针的绘制,使用save与restore来确保指针的旋转不会影响到表盘。  
    write.beginPath();
    //小三角
    write.moveTo(-90,0);
    write.lineTo(0,-105);
    write.lineTo(90,0)
    //指针圆
    write.arc(0, 0, 90, 0, Math.PI * 2)
    write.fillStyle = "#f0ece3";
    write.shadowBlur = 2;
    write.shadowOffsetX = 0;
    write.shadowOffsetY = 0;
    write.shadowColor = '#f0ece3';
    write.fill();
    write.strokeStyle = "#f0ece3";
    write.lineWidth = "3";
    write.stroke();
    //指针说明
    write.save();
    write.textAlign = "center";
    write.font = "30px 黑体";
    write.fillStyle = "black"
    write.fillText("骚年,来转转", 0, 0);
    write.restore();
  }
  creatPan ();
  surprise.onclick = function () {
    var turn = 30 + 20 * Math.random();
    var t = setInterval( function () {
      creatPan ();
      turn *= 0.95;
      angle += turn;
      if( turn <= 0.3 ) {
        clearInterval(t);
        var num = Math.ceil((angle - 30) / 60);
        var con = font[font.length - num];
        if( angle <= 30 ) {
             con = font[0];
        }
        alert("恭喜您,赢取了" + con + "大奖")
      }
      if( angle >= 360 ){
        angle = 0;
      }
    }, 50)
  }
}

//球反弹
function ballHit(){
  var ballhit    = document.getElementById("ballhit");
  var drawimg    = ballhit.getContext("2d");
  var  video     = document.getElementById("video");
  var ball       = document.getElementById("ball");
  var ballradius = 54; //球半径
  var gravity    = 1;  //定义一个重力的参数，即重力加速度
  var speedX; //定义一个X轴方向的速度
  var speedY; //定义一个Y轴方向的速度
  var t;
  ballhit.onclick = function (e) {
    speedX = 8;
    speedY = 10;
    clearInterval(t);
    var posX = e.offsetX;
    var posY = e.offsetY;
    t = setInterval(function(){
      //设置运动速度
      drawimg.clearRect(0, 0, 1100, 600);
      posX += speedX;  //X轴运动速度。
      posY += speedY;  //Y轴运动速度。
      //地面反弹效果。
      if( posY > ballhit.height - ballradius ) {
        speedY *= -0.7; //改变小球方向。
        //粒子低于画布最低端的时候，设置保证其不消失.
        posY = ballhit.height-ballradius; 
        speedX *= 0.8; //模拟地面摩擦效果。
      }
      //添加重力加速度效果
      speedY += gravity;
      drawimg.drawImage(ball,posX,posY,ballradius,ballradius);
    }, 15);
  } 
}