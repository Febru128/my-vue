// function Myvue(options){
//     this.data = options.data;
//     var id = options.el;
//     var dom = 
//     document.getElementById(id).appendChild(Dom);
// }
class Myvue{
    constructor(options){
        this.data = options.data;
        var id = options.el;
        var Dom = this.VnodeContainer(document.querySelector(id));
        document.querySelector(id).appendChild(Dom);
        this.definePropertyInit();
    }

    VnodeContainer(node,flag){ // 虚拟DOM容器
        var flag = flag || document.createDocumentFragment();
        var child;
        while(child = node.firstChild){
            this.compile(child);
            flag.appendChild(child);
            if(child.firstChild){
                this.VnodeContainer(child,flag);
            }
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
                    node.value = this.data[name];
                    node.addEventListener('input',(e)=>{
                        this.data[name] = e.target.value;
                    });
                }
            }
        }
        if(node.nodeType === 3){ // text类型节点
            if(reg.test(node.nodeValue)){
                let name = RegExp.$1; // 匹配到的字符串
                name = name.trim();
                node.nodeValue = this.data[name];
            }
        }
    }

    definePropertyInit(){ // 将data做成响应式的
        let keys = Object.keys(this.data);
        keys.forEach((el)=>{
            console.log(this)
            Object.defineProperty(this.data,el,{
                get(){
                    // console.log(this.data[el])
                    return this.data[el];
                },
                set(newVal){
                    console.log(newVal)
                    // this.data[el] = newVal;
                }
            });
        })
    }
}

new Myvue({
    el: '#app',
    data: {
        msg: 'hello'
    }
})