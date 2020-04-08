let data = {
    msg: 'hello'
};

function Observe(obj){
    if(Object.prototype.toString(obj) === '[object Object]'){ // 如果是对象
        for(let key in obj){
            Object.defineProperty(obj,key,{
                get(){
                    return obj[key];
                },
                set(newVal){
                    console.log(111)
                    if(newVal === obj[key]) return;
                    obj[key] = newVal;
                },
                configurable: true, // 是否配置，及可否删除
                enumerable: true, // 是否可枚举
            });
            // Observe(obj[key]);
        }
    }
}
Observe(data);

data.msg = 'qqq'
