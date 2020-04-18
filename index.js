
class Myvue{
    constructor(options){
        this.data = options.data;
        this.dep = new Dep();
        var id = options.el;
        this.observe();
        var Dom = this.VnodeContainer(document.querySelector(id));
        document.querySelector(id).appendChild(Dom);
    }
    VnodeContainer(node,flag){ // 虚拟DOM容器
        var flag = flag || document.createDocumentFragment();
        var child;
        while(child = node.firstChild){
            this.compile(child);
            flag.appendChild(child);
            this.VnodeContainer(child,flag);
        }
        return flag;
    }
    compile(node){ // 编译DOM
        let reg = /\{\{(.*)\}\}/g;
        if(node.nodeType === 1){ // 元素类型
            let attr = node.attributes;
            for(let i=0;i<attr.length;i++){
                if(attr[i].nodeName === 'v-model'){
                    let name = attr[i].nodeValue;
                    node.addEventListener('input',(e)=>{
                        this.data[name] = e.target.value;
                    });
                    node.value = this.data[name];

                    this.dep.add(new Watcher(this.data,node,name));
                }
            }
        }
        if(node.nodeType === 3){ // text类型节点
            if(reg.test(node.nodeValue)){
                let name = RegExp.$1; // 匹配到的字符串
                name = name.trim();
                node.nodeValue = this.data[name];

                this.dep.add(new Watcher(this.data,node,name));
            }
        }
    }
    observe(){
        Object.keys(this.data).forEach((el)=>{
            this.definePropertyInit(this.data,el,this.data[el]);
        });
    }
    definePropertyInit(target,key,value){ // 将data做成响应式的
        
        Object.defineProperty(target,key,{
            get:()=>{
                return value;
            },
            set:(newVal)=>{
                if(newVal === value) return;
                value = newVal;
                this.dep.notify(); // 更新
            }
        });
    }
}
class Dep{ // 发布者
    constructor(){
        this.subs = [];
    }
    add(sub){
        this.subs.push(sub);
    }
    notify(){
        this.subs.forEach((el)=>{
            el.update();
        });
    }
}
class Watcher{ // 观察者（订阅者）
    constructor(vm,node,name){
        Dep.global = this;
        this.vm = vm;
        this.node = node;
        this.name = name;
        this.update();
    }
    update(){
        this.get();
        switch (this.node.nodeType) {
            case 1: // 标签元素
                this.node.value = this.value;
                break;
            case 3: // 文本
                this.node.nodeValue = this.value;
                break;
            default: break;
        }
    }
    get(){
        this.value = this.vm[this.name];
    }
}

let vm = new Myvue({
    el: '#app',
    data: {
        msg: 'hello'
    }
})