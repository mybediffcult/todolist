function clear(){
	localStorage.clear();/*导入本地存储*/
	load();/*加载*/
}

function postaction(){
	var title = document.getElementById("title");/*得到Id为title的元素 并赋值给title*/
	if(title.value == "") {
		 alert("内容不能为空");//弹框显示
	}else{
		var data=loadData();
		var todo={"title":title.value,"done":false};
		data.push(todo);//末尾添加
		saveData(data);//保存
		var form=document.getElementById("form");
		form.reset();//重置表单
		load();//加载
	}
}

function loadData(){
	var collection=localStorage.getItem("todo");//获取指定todo的本地存储的值，赋值给collection
	if(collection!=null){
		return JSON.parse(collection);//从字符串中解析出json对象
	}
	else return [];
}

function saveSort(){
	var todolist=document.getElementById("todolist");
	var donelist=document.getElementById("donelist");
	var ts=todolist.getElementsByTagName("p");//返回todolist列表里面"p"标签的对象
	var ds=donelist.getElementsByTagName("p");//返回donelist裂变里面"p"标签的对象
	var data=[];//设置一个名为data的空数组
	for(i=0;i<ts.length; i++){
		var todo={"title":ts[i].innerHTML,"done":false};
		data.unshift(todo);//向数组开头添加一个或者多个元素并返回数组长度
	}
	for(i=0;i<ds.length; i++){
		var todo={"title":ds[i].innerHTML,"done":true};
		data.unshift(todo);
	}
	saveData(data);
}

function saveData(data){
	localStorage.setItem("todo",JSON.stringify(data));//给"todo"添加值 将JSON对象'data'的值转变为字符串
}

function remove(i){
	var data=loadData();
	var todo=data.splice(i,1)[0];//在i元素删除一个元素并把该元素赋值给todo
	saveData(data);
	load();
}

function update(i,field,value){
	var data = loadData();
	var todo = data.splice(i,1)[0];
	todo[field] = value;
	data.splice(i,0,todo);//更新下标为i的元素 
	saveData(data);
	load();
}

function edit(i)
{
	load();
	var p = document.getElementById("p-"+i);
	title = p.innerHTML;
	p.innerHTML="<input id='input-"+i+"' value='"+title+"' />";
	var input = document.getElementById("input-"+i);
	input.setSelectionRange(0,input.value.length);//光标选中某段文字
	input.focus();//得到焦点
	input.onblur =function(){
		if(input.value.length == 0){
			p.innerHTML = title;
			alert("内容不能为空");
		}
		else{
			update(i,"title",input.value);//改变下角标为i的title的值
		}
	};
}

function load(){
	var todolist=document.getElementById("todolist");
	var donelist=document.getElementById("donelist");
	var collection=localStorage.getItem("todo");
	if(collection!=null){
		var data=JSON.parse(collection);
		var todoCount=0;
		var doneCount=0;
		var todoString="";
		var doneString="";
		for (var i = data.length - 1; i >= 0; i--) {
			if(data[i].done){
				doneString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",false)' checked='checked' />"
				+"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
				+"<a class='dcircle' href='javascript:remove("+i+")'>-</a></li>";//编写donestring字符串 有三部分<li><input></input><p></p><a></a></li>
				doneCount++;
			}
			else{
				todoString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",true)' />"
				+"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
				+"<a class='dcircle' href='javascript:remove("+i+")'> - </a></li>";
				todoCount++;
			}
		};
		todocount.innerHTML=todoCount;//赋值
		todolist.innerHTML=todoString;
		donecount.innerHTML=doneCount;
		donelist.innerHTML=doneString;
	}
	else{
		todocount.innerHTML=0;//赋初值
		todolist.innerHTML="";
		donecount.innerHTML=0;
		donelist.innerHTML="";
	}

	var lis=todolist.querySelectorAll('ol li');//选择css里面所有含有ol li 的元素
	[].forEach.call(lis, function(li) {            //详细请见http://www.webhek.com/javascript-foreach-call 这里的作用是遍历lis对每一个li都做相同函数
		li.addEventListener('dragstart', handleDragStart, false);//addEventListener 绑定事件的对象方法 三个参数一个事件名称 一个函数 一个事件捕获
		li.addEventListener('dragover', handleDragOver, false);
		li.addEventListener('drop', handleDrop, false);

		onmouseout =function(){
			saveSort();
		};
	});		
}

window.onload=load;//同意load与onload

window.addEventListener("storage",load,false);

var dragSrcEl = null;//定义移动参数
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); 
  }
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}
