$(() => {
    // ---- Task Class
    class Task {
        constructor(title, bodyText, date, time, id) {
            this.title = title;
            this.bodyText = bodyText;
            this.date = date;
            this.time = time;
            this.id = id;
        }
    }
    // --- Storage
    // Storage: Get current state of localStorage
    function getTasksFromStorage() {
        let Storage
        if (localStorage.getItem('Storage') == null) {
            Storage = []
        } else {
            Storage = JSON.parse(localStorage.getItem('Storage'))
        }
        return Storage
    }
    // Storage: Add task to localStorage
    function addTaskToStorage(task) {
        let Storage = getTasksFromStorage()
        Storage.push(task);
        localStorage.setItem('Storage', JSON.stringify(Storage))
        showAlert('success', 'Task Added')
    }
    // Storage: Remove task from localStorage
    function removeTaskFromStorage(id) {
        let Storage = getTasksFromStorage()
        Storage.forEach((task, index) => {
            if (task.id == id) {
                Storage.splice(index, 1);
            }
            localStorage.setItem('Storage', JSON.stringify(Storage))
        })
    };
    // --- UI
    // UI: Create Note container & add task to board
    function addTaskToBoard(task) {
        const board = document.querySelector('#task-board');
        const div = document.createElement('div');
        div.className = 'task-note container-fixed d-flex flex-column p-2';
        div.style.display = 'none'
        div.id = task.id;
        div.innerHTML =
            `
            <div class="delete-btn btn-danger rounded-circle d-flex justify-content-center
            align-items-center border-right border-left border-dark" style='visibility: hidden;'>
            <i class="fas fa-trash"></i></div>
            <h5 class="mt-5 ml-1 task-title font-weight-bold">${task.title}</h5>
            <div class="task-text"><p>${task.bodyText}</p></div>
            <div class="date-time container mt-3">
            <div class="row d-flex flex-row justify-content-left pl-2">
            <p class="task-footer font-weight-bold mr-3">Date</p>
            <p class="task-footer  ">${task.date}</p>
            </div>
            <div class="row d-flex flex-row justify-content-left pl-2">
            <p class="task-footer font-weight-bold mr-3">Time</p>
            <p class="task-footer  ">${task.time}</p>
            </div>
            </div>
            `
        board.appendChild(div);
        $(`#${task.id}`).fadeIn(500);
    }
    // UI: Shows delete Btn
    function showBtns(el) {
        if (el.classList.contains('task-note')) {
            el.children[0].style.visibility = 'visible'
            setTimeout(() => el.children[0].style.visibility = 'hidden', 1000 * 2)
        }
    }
    // UI: Delete a Note From Display Board & localStorage
    function deleteTaskFromStorageNBoard(el) {
        let elID
        let elIDD
        if (el.classList.contains('delete-btn')) {
            elID = '#' + el.parentElement.id
            $(elID).fadeOut(500, function () {
                removeTaskFromStorage(el.parentElement.id)
                $(this).remove();
                showAlert('success', 'Task Deleted!')
            });
        } else if (el.classList.contains('fa-trash')) {
            elIDD = '#' + el.parentElement.parentElement.id
            $(elIDD).fadeOut(500, function () {
                removeTaskFromStorage(el.parentElement.parentElement.id)
                $(this).remove();
                showAlert('success', 'Task Deleted!')
            });
        }
    };
    // UI: Create & Delete Alert
    function showAlert(color, message) {
        const div = document.createElement('div');
        div.className = `container d-flex justify-content-center col-4 alert alert-${color} border border-${color}`;
        div.innerHTML = message;
        const body = document.querySelector('.body-container')
        const header = document.querySelector('#header')
        body.insertBefore(div, header)
        setTimeout(() => document.querySelector('.alert').remove(), 1000 * 4)
    }
    // UI: load Task Board After App loads!
    function LoadScreen() {
        let Storage = getTasksFromStorage()
        Storage.forEach(task => {
            addTaskToBoard(task)
        })
    };
    // --- Other Funcs
    // Func: function that validates
    // Date and Time inputs are not in the past
    function validateDateNTime(date, time) {
        const inputDate = new Date(`${date} ${time}`)
        const currentDate = new Date()
        console.log(`Input: ${inputDate.getTime()}`);
        console.log(`Current: ${currentDate.getTime()}`);
        return inputDate.getTime() < currentDate.getTime()
    }
    // ---Events
    // Event: Add a Task
    document.querySelector('.create-task-form').addEventListener('submit', (e) => {
        // Cancel default submit
        e.preventDefault();
        // Get inputs
        const title = document.querySelector('#event-title').value;
        const bodyText = document.querySelector('#task-text-input').value;
        const date = document.querySelector('#date-input').value;
        const time = document.querySelector('#time-input').value;
        // Validate Input fields are filled
        if (title === '' || bodyText === '' ||
            date === '' || time === '') {
            showAlert('danger', 'Please fill all the fields')
            // Validate Date and Time entered are Valid
        } else if (validateDateNTime(date, time)) {
            showAlert('danger', `You can't change the past silly! pick a valid Date and Time!`)
        } else {
            // Create a new Task Class Object
            let task = new Task(title, bodyText, date, time, Date.now())
            // Append to Stored Tasks (Local Storage)
            addTaskToStorage(task)
            // Display new Task
            addTaskToBoard(task);
            // Clear Form
            document.querySelector('.create-task-form').reset();
        }
    })
    // Event: Remove task
        // hover on task and show delete btn
    document.querySelector('#task-board').addEventListener('mouseover', (e) => {
        showBtns(e.target)
    })
        // delete task on click
    document.querySelector('#task-board').addEventListener('click', (e) => {
        deleteTaskFromStorageNBoard(e.target)
    });


    // Load Screen: Show all Tusks
    LoadScreen()
})