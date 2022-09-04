var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0
var pageContentEl = document.querySelector("#page-content");
var tasksInprogressEl = document.querySelector("#task-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function (event) {
    
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;

    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput === "" || !taskTypeInput === "") {
        alert("You need to fill out the task form!");
        return false;
    }

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectIndex = 0;

    var isEdit = formEl.hasAttribute("data-task-id");
        //has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
     // no data attribute, so create object as normal and pass to createTaskEl 
    else {
        var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
     };

        //send it as an arguement to createTaskEl
        createTaskEl(taskDataObj);
    
    }
};

var createTaskEl = function(taskDataObj) {

    var listItemEl = document.createElement("li");
    listItemEl.classname = "task-item";
   

   //add task id as a custom attribute
   listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    taskActionsEl.push(taskDataObj);

    saveTasks();

    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions"; 

    // Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent =statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    };

    return actionContainerEl;
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        // get the elements's task id
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {

    //find task list item based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    var statusValue = event.target.value.toLowerCase();
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress"){
        tasksInprogressEl.appendChild(taskSelected);
    } else if (statusValue === "competed") {
        taskCompletedEl.appendChild(taskSelected);
    }

    //update task's in tasks array
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var deleteTask = function(taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i =0; i < tasks.length; i++) {
        //if tsk[i].id doesnt match the calue of taskId, lets keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as  updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var editTask = function(taskId) {
    console.log(taskId);

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);
    
    document.querySelector("input[name='task-name']").value =  taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    formEl.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId); 
};

var completeEditTask = function(taskName, taskType, taskId) {
  //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
   //set new values
   taskSelected.querySelector("h3.task-name").textContent = taskName;
   taskSelected.querySelector("span.task-type").textContent = taskType;

// loop through tasks array and task objects with new content
for(var i =0; i < taskButtonHandler.length; i++) {
    if  (task[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        task[i].type = taskType;
    }
};

   alert("Task Updated!");
   //reset the form by removiing Id and changing button text back to normal
   formEl.removeAttribute("data-task-id");
   document.querySelector("save-task").textContent = "Add Task";

   saveTasks();
};

var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);