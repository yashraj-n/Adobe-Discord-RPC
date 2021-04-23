let project = document.getElementById("project-name");
let description = document.getElementById("details");
let start_btn = document.getElementById("initialize");
let application = document.getElementById("application");
let timeElapsedShow = document.getElementById("time_e");
let ipcRendrer = require("electron").ipcRenderer;

project.onchange = length_check;
description.onchange = length_check

function length_check() {
    if (project.value.length > 2 && description.value.length > 4) {
        start_btn.disabled = false;
    } else {
        start_btn.disabled = true;
    }
}

function restart() {
    ipcRendrer.send("restart", ";-;")
}

function rpc_inititalize() {

    ipcRendrer.send("rpc-initialize", JSON.stringify({
        project: project.value,
        description: description.value,
        application: application.value,
        time: (timeElapsedShow.value === "Yes" ? true : false)
    }))
}

