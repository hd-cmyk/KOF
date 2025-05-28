import { AcGameObject } from "../ac_game_object/base.js";
export class Player extends AcGameObject{
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.direction = 1;
        //水平方向和竖直方向的速度
        this.vx = 0;//水平方向的速度
        this.vy = 0;//竖直方向的速度
        this.speedx = 400;//水平速度
        this.speedy = -1000;//跳起的初始速度
        this.gravity = 50;
        this.ctx = this.root.game_map.ctx;//拿到共享的canvas绘制上下文
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3;//0:idle, 1:向前 2.向后 3.跳跃 4.攻击 5.被打 6.死亡
        this.animations = new Map();
        this.frame_current_cnt = 0;//从角色被创建以来，渲染的“总帧数”
    }
    start() {
        
    }
    update_move() {
         this.vy += this.gravity;//速度+=重力加速度
        this.x += this.vx * this.timedelta / 1000;//距离等于速度*时间
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 500) {
            this.y = 500;
            this.vy = 0;
            if(this.status === 3) this.status = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }
    update_direction() {
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }
    update() {
        this.update_control();
        this.update_move();
        this.render();
        this.update_direction();
    }
    render() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height)
        let status = this.status;//动态决定这一次要显示什么动画，因为角色的行为状态不应该变化（比如攻击中不能被打断）
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;
        let obj = this.animations.get(status);
        let k;
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                k = parseInt(this.frame_current_cnt / obj.frame_rate % obj.frame_cnt);
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);               
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);//x轴左右翻转
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);//x轴向右平移
                k = parseInt(this.frame_current_cnt / obj.frame_rate % obj.frame_cnt);
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.width - this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                
                this.ctx.restore();
            }
        }
        
        if (status === 4 && this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
            this.status = 0;
        }
        this.frame_current_cnt++;
    }
    update_control() {
        let w, a, d, space;

        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (this.status === 0 || this.status === 1) {//如果是静止或者移动可以攻击
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }else if (w) {//如果是跳跃，看看向前还是向后
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
            
        }
    }
    // update_direction() {
    //     if (this.status === 0) return;
    //     let players = this.root.players;
    //     if(players[0] && players[1])
    // }
}