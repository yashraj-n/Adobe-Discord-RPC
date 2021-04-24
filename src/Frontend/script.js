let project = document.getElementById("project-name");
let description = document.getElementById("details");
let start_btn = document.getElementById("initialize");
let application = document.getElementById("application");
let timeElapsedShow = document.getElementById("time_e");
let ipcRendrer = require("electron").ipcRenderer;
let pre_app = document.getElementById("pre-app-name");
let pre_project = document.getElementById("pre-project");
let pre_desc = document.getElementById("pre-details");
let pre_app_logo = document.getElementById('pre-app-logo');
let pre_creds = document.getElementById("pre-creds");
let time_elapsed = document.getElementById('pre-time');

project.onchange = project_l;
description.onchange = desc_l;

timeElapsedShow.onchange = () => {
    if (timeElapsedShow.value === 'Yes') {
        time_elapsed.style.display = "block";
    } else {
        time_elapsed.style.display = "none";
    }
}

application.onchange = (e) => {
    pre_app.innerText = `Adobe ${e.target.value}`;
    switch (e.target.value) {
        case "After Effects":
            pre_app_logo.src = "../Assets/ae.png";
            break;
        case "Premier Pro":
            pre_app_logo.src = "../Assets/pr.png";
            break;
        case "Photoshop":
            pre_app_logo.src = "../Assets/ps.png";
            break;
        case "Illustrator":
            pre_app_logo.src = "../Assets/ai.png";
            break
        default:
            alert("wtf?")
            break;
    }
}

pre_app_logo.onmouseover = () => {
    pre_creds.style.display = "block"
}

pre_app_logo.onmouseleave = () => {
    pre_creds.style.display = "none"
}

function project_l(e) {
    pre_project.innerText = e.target.value
    if (project.value.length > 2 && description.value.length > 2) {
        start_btn.disabled = false;
    } else {
        start_btn.disabled = true;
    }
}

function desc_l(e) {
    pre_desc.innerText = e.target.value;
    if (description.value.length > 2 && project.value.length > 2) {
        start_btn.disabled = false;
    } else {
        start_btn.disabled = true;
    }
}


function restart() {
    ipcRendrer.send("restart", ";-;")
}

function rpc_inititalize() {
    start_btn.classList.remove("btn-secondary");
    start_btn.classList.add("btn-danger")
    start_btn.innerText = "Stop";
    start_btn.disabled = true;

    ipcRendrer.send("rpc-initialize", JSON.stringify({
        project: project.value,
        description: description.value,
        application: application.value,
        time: (timeElapsedShow.value === "Yes" ? true : false)
    }));

    setTimeout(() => {
        start_btn.disabled = false;
        start_btn.onclick = restart;
    }, 5000);
}

