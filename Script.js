var taskObj = {
    key: "projects",
  
    addProject: function () {
      if (document.getElementById("add-project").value == "") {
        swal("Please enter User name");
        return false;
      }
  
      var option = "";
      if (localStorage.getItem(this.key) == null) {
        localStorage.setItem(this.key, "[]");
      }
  
      var data = JSON.parse(localStorage.getItem(this.key));
  
      var project = {
        id: data.length,
        name: document.getElementById("add-project").value,
        tasks: [],
      };
  
      data.push(project);
      localStorage.setItem(this.key, JSON.stringify(data));
  
      this.loadAllProjects();
  
      this.showAllTasks();
    },
  
    getAllProjects: function () {
      if (localStorage.getItem(this.key) == null) {
        localStorage.setItem(this.key, "[]");
      }
      return JSON.parse(localStorage.getItem(this.key));
    },
  
    getProject: function (id) {
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        if (projects[a].id == id) {
          return projects[a];
        }
      }
      return null;
    },
  
    loadAllProjects: function () {
      var projects = taskObj.getAllProjects();
      projects = projects.reverse();
      var html = "<option value=''>Select User</option>";
      for (var a = 0; a < projects.length; a++) {
        html +=
          "<option value='" +
          projects[a].id +
          "'>" +
          projects[a].name +
          "</option>";
      }
      document.getElementById("add-task-project").innerHTML = html;
      document.getElementById(
        "form-task-hour-calculator-all-projects"
      ).innerHTML = html;
    },
  
    addTask: function (form) {
      var project = form.project.value;
      var task = form.task.value;
  
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        if (projects[a].id == project) {
          var taskObj = {
            id: projects[a].tasks.length,
            name: task,
            status: "Progress",
            isStarted: false,
            logs: [],
            started: this.getCurrentTimeInTaskStartEndFormat(),
            ended: "",
          };
          projects[a].tasks.push(taskObj);
          break;
        }
      }
  
      localStorage.setItem(this.key, JSON.stringify(projects));
  
      jQuery("#addTaskModal").modal("hide");
      jQuery(".modal-backdrop").remove();
  
      this.showAllTasks();
  
      return false;
    },
  
    showAllTasks: function () {
      var html = "";
  
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        projects[a].tasks = projects[a].tasks.reverse();
  
        for (var b = 0; b < projects[a].tasks.length; b++) {
          html += "<tr>";
          html += "<td>" + projects[a].tasks[b].name + "</td>";
          html += "<td>" + projects[a].name + "</td>";
          if (projects[a].tasks[b].isStarted) {
            html += "<td><label class='started'>Started</label></td>";
          } else {
            if (projects[a].tasks[b].status == "Completed") {
              html +=
                "<td><label class='completed'>" +
                projects[a].tasks[b].status +
                "</label></td>";
            } else {
              html += "<td>" + projects[a].tasks[b].status + "</td>";
            }
          }
        if (willDelete) {
          var projects = this.getAllProjects();
          for (var a = 0; a < projects.length; a++) {
            if (projects[a].id == self.project.value) {
              projects.splice(a, 1);
              localStorage.setItem(this.key, JSON.stringify(projects));
  
              this.loadAllProjects();
              this.showAllTasks();
  
              break;
            }
          }
        } else {
          self.project.value = "";
        }
      });
      return false;
    },
  };
  
  window.addEventListener("load", function () {
    taskObj.loadAllProjects();
    taskObj.showAllTasks();
  
    setInterval(function () {
      var dataStarted = document.querySelectorAll("td[data-started]");
      for (var i = 0; i < dataStarted.length; i++) {
        var dataStartedObj = dataStarted[i].getAttribute("data-started");
        var dataStartedObj = JSON.parse(dataStartedObj);
        dataStartedObj.duration++;
  
        var hours = Math.floor(dataStartedObj.duration / 3600) % 24;
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = Math.floor(dataStartedObj.duration / 60) % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var seconds = dataStartedObj.duration % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        dataStarted[i].innerHTML = hours + ":" + minutes + ":" + seconds;
  
        var projects = taskObj.getAllProjects();
        for (var a = 0; a < projects.length; a++) {
          if (projects[a].id == dataStartedObj.project) {
            for (var b = 0; b < projects[a].tasks.length; b++) {
              if (projects[a].tasks[b].id == dataStartedObj.task) {
                for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                  if (c == projects[a].tasks[b].logs.length - 1) {
                    projects[a].tasks[b].logs[c].endTime = new Date().getTime();
  
                    window.localStorage.setItem(
                      taskObj.key,
                      JSON.stringify(projects)
                    );
  
                    dataStarted[i].setAttribute(
                      "data-started",
                      JSON.stringify(dataStartedObj)
                    );
  
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    }, 1000);
  })
