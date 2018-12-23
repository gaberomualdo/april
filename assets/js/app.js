var tasks_list;
var subjects_list;

function select_box_select(button){
  button.parentElement.querySelector("button.active").classList.remove("active");
  button.classList.add("active");
}
function refresh_tasks_list(){
  tasks_list = JSON.parse(localStorage.getItem("april_tasks_list")) || [
    {
      subject: "English",
      due_date: "23 January 2018",
      content: "23 assigment",
      index: 0
    },
    {
      subject: "Social Studies",
      due_date: "12 January 2018",
      content: "12 assigment",
      index: 1
    },
    {
      subject: "Spanish",
      due_date: "23 January 2018",
      content: "23 assigment",
      index: 2
    },
    {
      subject: "English",
      due_date: "25 January 2018",
      content: "25 assigment",
      index: 3
    },
  ];
  subjects_list = JSON.parse(localStorage.getItem("april_subjects_list")) || [
    "English",
    "Social Studies",
    "Math",
    "Science"
  ];

  document.querySelector("div.container ul.tasks").innerHTML = "";
  var sorted_set = {};
  tasks_list.forEach(function(task){
    if(document.querySelector("div.container div.sort_by button.active").innerText == "Due Date"){
      if(!sorted_set[task.due_date]){
        sorted_set[task.due_date] = [];
      }
      sorted_set[task.due_date].push(task);
    }else{
      if(!sorted_set[task.subject]){
        sorted_set[task.subject] = [];
      }
      sorted_set[task.subject].push(task);
    }
  });
  var sorted_keys = Object.keys(sorted_set);
  var sorted_values = Object.values(sorted_set);
  if(document.querySelector("div.container div.sort_by button.active").innerText == "Due Date"){
    sorted_keys.sort(function(a, b){
      var date_a = new Date(a);
      var date_b = new Date(b);
      return date_a.getTime()-date_b.getTime();
    });
    sorted_keys.forEach(function(key, key_index){
      var original_index = Object.keys(sorted_set).indexOf(key);
      sorted_values[key_index] = Object.values(sorted_set)[original_index];
    });
  }
  sorted_keys.forEach(function(key, key_index){
    document.querySelector("div.container ul.tasks").innerHTML += "<p>" + key + "</p>";
    sorted_values[key_index].forEach(function(task, task_index){
      var meta;
      if(document.querySelector("div.container div.sort_by button.active").innerText == "Due Date") {
        meta = task.subject;
      }else{
        meta = task.due_date;
      }
      document.querySelector("div.container ul.tasks").innerHTML += "<li><strong>" + meta + "</strong><span>" + task.content + '</span><button onclick="remove_task(this)" task_index="' + task.index + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg></button></li>';
    });
  });
  if(document.querySelector("div.container div.sort_by button.active").innerText == "Due Date") {
    document.querySelector("div.container ul.tasks").classList.remove("sort_subject");
  }else{
    document.querySelector("div.container ul.tasks").classList.add("sort_subject");
  }
}
function remove_task(button){
  tasks_list.splice(button.getAttribute("task_index"), 1);
  tasks_list.forEach(function(task, task_index){
    tasks_list[task_index].index = task_index;
  });
  push_to_db();
  refresh_tasks_list();
}
function push_to_db(){
  localStorage.setItem("april_tasks_list", JSON.stringify(tasks_list));
  localStorage.setItem("april_subjects_list", JSON.stringify(subjects_list));
}
window.onload = refresh_tasks_list;

function add(button){
  if(button.parentElement.classList.contains("add_type_subject")){
    subjects_list.push(button.parentElement.querySelector(".subject_name input").value);
    push_to_db();
  }else{
    var pushObj = {
      due_date: new Date(button.parentElement.querySelector(".due_date input").value).toString().split(" ").slice(0,3).join(" "),
      subject: button.parentElement.querySelector(".subject button.active").innerText,
      content: button.parentElement.querySelector("p.content input").value,
      index: tasks_list.length
    };
    console.log(pushObj);
    tasks_list.push(pushObj);
    push_to_db();
  }
  reset_modal_values(button);
  refresh_tasks_list();
  button.parentElement.parentElement.classList.remove('active');
}
function reset_modal_values(button){
  button.parentElement.querySelector(".due_date input").value = "";
  button.parentElement.querySelector(".subject_name input").value = "";
  button.parentElement.querySelector("p.content input").value = "";
  button.parentElement.querySelector("div.add_type button:nth-child(2)").parentElement.parentElement.classList.remove('add_type_subject');
  select_box_select(button.parentElement.querySelector("div.add_type button:nth-child(2)"));
}
