var cvs = document.getElementById("cvs");
var ctx = cvs.getContext('2d');
var span = document.getElementById("num");
var span1 = document.getElementById("time");
var span2 = document.getElementById("life");
var imgs = document.getElementById("imgs");
var img7 = document.getElementById("person");
var myAudio = document.getElementById("myAudio");
var body = document.getElementsByTagName("body")[0];
var gGame = null;
function jump() {
    location.href = "index.html";
}
function onLoad() {
    gGame = new Game();
    gGame.render();
    gGame.update();
    gGame.updateTime();
    myAudio.play();
}
function Game() {
    var _this = this;
    this.frame = 0;
    this.frame1 = 0;
    this.frame2 = 0;
    this.lastFrame = 0;
    this.lastFrame1 = 0;
    this.lastFrame2 = 0;
    this.CDCode = 30;
    this.CDCode1 = 120;
    this.CDCode2 = 300;
    this.person = null;
    this.progress = null;
    this.bulltes = [];
    this.treasures = [];
    this.gems = [];
    this.tools = [];
    this.num = 0;
    this.time = 0;
    this.life = 3;
    this.flag = 0;
    this.render = function () {
        _this.person = new Person();
        _this.progress = new Progress();
    };
    this.update = function () {
            _this.frame++;
            _this.frame1++;
            _this.frame2++;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.beginPath();
            _this.person.updateFrame();
            _this.person.updatePos();
            _this.person.draw();
            ctx.moveTo(20, 150);
            ctx.lineTo(320, 150);
            ctx.lineCap = 'round';
            ctx.lineWidth = 15;
            ctx.strokeStyle = "white";
            ctx.stroke();
            if (_this.frame >= _this.lastFrame + _this.CDCode) {
                _this.bulltes.push(new Bullet());
                _this.lastFrame = _this.frame;
            }
            if (_this.frame1 >= _this.lastFrame1 + _this.CDCode1) {
                _this.treasures.push(new Treasure());
                _this.lastFrame1 = _this.frame1;
            }
            if (_this.frame2 >= _this.lastFrame2 + _this.CDCode2) {
                _this.gems.push(new Gem());
                _this.lastFrame2 = _this.frame2;
            }
            /*画炮弹*/
            _this.bulltes.forEach(function (val, index) {
                val.updatePos();
                val.draw();
                val.updateStatus();
                if (val.dead) {
                    _this.bulltes.splice(index, 1);
                }
                if (_this.flag == 0) {
                    if (Math.abs(val.y + 100 - _this.person.top) <= 30 && Math.abs(val.x - _this.person.left + 80) <= 20) {
                        ctx.beginPath();
                        ctx.drawImage(imgs, val.x, val.y);
                        _this.bulltes.splice(index, 1);
                        _this.life--;
                        span2.innerHTML = _this.life;
                        if (_this.life == 0) {
                            body.innerHTML = "";
                            var div = document.createElement("div");
                            div.id = "box";
                            body.appendChild(div);
                            var img = document.createElement("img");
                            img.id = "yuan";
                            img.src = "./元宝.png";
                            box.appendChild(img);
                            var img5 = document.createElement("img");
                            img5.id = "img5";
                            img5.src = "./again.png";
                            img5.onclick = function () {
                                location.reload();
                            };
                            box.appendChild(img5);
                            var img6 = document.createElement("img");
                            img6.id = "img6";
                            img6.src = "./主页.png";
                            img6.onclick = function () {
                                location.href = 'index.html';
                            };
                            box.appendChild(img6);
                            var span3 = document.createElement("span");
                            span3.id = "text1";
                            span3.innerHTML = "Survival Time:" + _this.time + "s";
                            box.appendChild(span3);
                            var span4 = document.createElement("span");
                            span4.id = "text2";
                            span4.innerHTML = "勇士";
                            box.appendChild(span4);
                            var span5 = document.createElement("span");
                            span5.id = "text3";
                            span5.innerHTML = "很遗憾你只寻得" + _this.num + "个";
                            box.appendChild(span5);
                        }
                    }
                }
            });
            /*画元宝*/
            _this.treasures.forEach(function (item, index) {
                if (item.dead == false) {
                    item.draw();
                } else {
                    _this.treasures.splice(index, 1);
                }
                if (Math.abs(_this.person.left - 50 - item.x) <= 20) {
                    _this.treasures.splice(index, 1);
                    _this.num++;
                    span.innerHTML = _this.num;
                }
            });
            /*画宝石*/
            _this.gems.forEach(function (temp, index) {
                if (temp.dead == false) {
                    temp.draw();
                } else {
                    _this.gems.splice(index, 1);
                }
                if (Math.abs(_this.person.left - 50 - temp.x) <= 20) {
                    _this.gems.splice(index, 1);
                    _this.progress.updateLength();
                }
            });
            /*宝石条满使用道具*/
            if (_this.progress.x >= 320) {
                _this.tools.push(new Tool());
                _this.progress.x = 0;
            }
            /*画道具*/
            _this.tools.forEach(function (tt, index) {
                if (tt.dead == false) {
                    tt.draw(_this.person.left, _this.person.top);
                    _this.flag = 1;
                } else {
                    _this.tools.splice(index, 1);
                    _this.flag = 0;
                }
            });
            _this.progress.draw();
            window.requestAnimationFrame(_this.update);
        }
        ;
        /*计时器*/
        this.updateTime = function () {
            var time = setInterval(function () {
                _this.time++;
                span1.innerHTML = _this.time;
                for (var i = 1; i < 20; i++) {
                    if (_this.time == 20 * i) {
                        _this.CDCode -= 5;
                    }
                     if (_this.CDCode <= 0){
                         _this.CDCode = 10;
                     }
                }
            }, 1000);
        }
    }
/*小人*/
function Person() {
    var _this = this;
    this.currentFrame = 0;
    this.left = cvs.width/2;
    this.y = img7.height/4;
    this.top = cvs.height - img7.height/4;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(img7,_this.currentFrame * img7.width/32,_this.y,img7.width/32,img7.height/4,_this.left,_this.top,img7.width/32,img7.height/4);
    };
    this.updateFrame = function () {
        _this.currentFrame = ++_this.currentFrame >= 32 ? 0 : _this.currentFrame;
    };
    this.updatePos = function () {
        document.onkeydown = function(e){
            switch (e.keyCode) {
                case 37:{
                    if (_this.left >= 0) {
                        _this.left -= 15;
                        _this.y = img7.height / 4;
                    }
                }break;
                case 39:{
                    if (_this.left <= cvs.width - img7.width / 32) {
                        _this.left += 15;
                        _this.y = img7.height / 4 * 2;
                    }
                }break;
            }
        }
    };
}
/*炮弹*/
function Bullet() {
    var _this = this;
    this.x = parseInt(Math.random() * cvs.width);
    this.y = Math.random() * 40;
    this.img = new Image();
    this.img.src = './炮弹.png';
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.x,_this.y);
    };
    this.updatePos = function () {
        _this.y += 10;
    };
    this.updateStatus = function () {
        if (_this.y + 100 >= cvs.height){
            _this.dead = true;
        }
    }
}
/*元宝*/
function Treasure() {
    var _this = this;
    this.t = 0;
    this.img = new Image();
    this.img.src = './元宝.png';
    this.x = parseInt(Math.random() * (cvs.width - _this.img.width));
    this.y = cvs.height - this.img.height + 50;
    this.timer = null;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.x,_this.y);
    };
     _this.timer = setInterval(function () {
                 _this.t++;
                 if (_this.t >= 3){
                    _this.dead = true;
                     clearInterval(_this.timer);
                     _this.t = 0;
                 }
            },1000);
}
/*宝石*/
function Gem() {
    var _this = this;
    this.t = 0;
    this.img = new Image();
    this.img.src = './宝石.png';
    this.x = parseInt(Math.random() * (cvs.width - _this.img.width));
    this.y = cvs.height - this.img.height + 50;
    this.timer = null;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.x,_this.y);
    };
    _this.timer = setInterval(function () {
        _this.t++;
        if (_this.t >= 3){
            _this.dead = true;
            clearInterval(_this.timer);
            _this.t = 0;
        }
    },1000);
}
/*宝石进度条*/
function Progress() {
    var _this = this;
    this.x = 20;
    this.y = 150;
    this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(20,150);
        ctx.lineTo(_this.x,150);
        ctx.lineCap = 'round';
        ctx.lineWidth = 15;
        ctx.strokeStyle = "#83d9ff";
        ctx.stroke();
    };
    this.updateLength = function () {
        if (_this.x < 320){
            _this.x += 50;
        }
        else{
            _this.x = 320;
        }
    }
}
/*道具*/
function Tool() {
    var _this = this;
    this.img = new Image();
    this.img.src = './tool.png';
    this.timer = null;
    this.t = 0;
    this.dead = false;
    this.draw = function (positionX,positionY) {
        ctx.beginPath();
        ctx.drawImage(_this.img,positionX - 40,positionY - 60,100,100);
    };
    this.timer = setInterval(function () {
        _this.t ++;
        if (_this.t >= 10){
            _this.dead = true;
            clearInterval(_this.timer);
            _this.t = 0;
        }
    },1000)
}