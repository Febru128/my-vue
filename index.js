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

    observe(){
        Object.keys(this.data).forEach((el)=>{
            this.definePropertyInit(this.data,el,this.data[el]);
        });
    }

    definePropertyInit(target,key,value){ // 将data做成响应式的
        Object.defineProperty(target,key,{
            get:function(){
                console.log('get到：'+value);
                return value;
            },
            set:function(newVal){
                if(newVal === value) return;
                value = newVal;
                console.log('set成：'+newVal)
            }
        });
    }
}

new Myvue({
    el: '#app',
    data: {
        msg: 'hello'
    }
})