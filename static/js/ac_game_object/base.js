let AC_GAME_OBJECTS = []
class AcGameObject{
    constructor() { 
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0;
        this.has_call_start = false;
    }
    start() {//初始执行一次
        
    }
    update() {//每一帧都执行一次（除了第一帧以外）
        
    }
    destroy() {//删除当前对象
        for (let i in AC_GAME_OBJECTS) {
            if (AC_GAME_OBJECTS[i] == this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}
let last_timestamp;
let AC_GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
}
requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
export { AcGameObject}