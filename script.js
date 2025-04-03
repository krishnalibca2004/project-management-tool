// Store data in localStorage
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const addProjectBtn = document.getElementById('addProjectBtn');
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');
const recentProjectsList = document.getElementById('recentProjectsList');
const tasksList = document.getElementById('tasksList');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

// Event Listeners
addProjectBtn.addEventListener('click', () => {
    projectModal.classList.add('active');
});

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewProject();
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

// Functions
function addNewProject() {
    const projectName = document.getElementById('projectName').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectDeadline = document.getElementById('projectDeadline').value;

    const project = {
        id: Date.now(),
        name: projectName,
        description: projectDescription,
        deadline: projectDeadline,
        tasks: [],
        progress: 0
    };

    projects.push(project);
    saveToLocalStorage();
    closeModal();
    updateDashboard();
    renderProjects();
    projectForm.reset();
}

function createTask(projectId) {
    const taskName = prompt('Enter task name:');
    if (!taskName) return;

    const task = {
        id: Date.now(),
        projectId: projectId,
        name: taskName,
        completed: false,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    tasks.push(task);
    const project = projects.find(p => p.id === projectId);
    project.tasks.push(task.id);
    updateProjectProgress(project);
    saveToLocalStorage();
    updateDashboard();
    renderProjects();
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    
    const project = projects.find(p => p.tasks.includes(taskId));
    updateProjectProgress(project);
    
    saveToLocalStorage();
    updateDashboard();
    renderProjects();
}

function updateProjectProgress(project) {
    const projectTasks = tasks.filter(t => project.tasks.includes(t.id));
    const completedTasks = projectTasks.filter(t => t.completed);
    project.progress = projectTasks.length ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
}

function renderProjects() {
    const projectsHTML = projects.map(project => `
        <div class="stat-card">
            <h3>${project.name}</h3>
            <p>Progress: ${project.progress}%</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${project.progress}%"></div>
            </div>
            <p>Deadline: ${project.deadline}</p>
            <p>${project.description}</p>
            <button onclick="createTask(${project.id})" class="btn-primary">
                <i class="fas fa-plus"></i> Add Task
            </button>
            <div class="tasks">
                ${renderProjectTasks(project)}
            </div>
        </div>
    `).join('');

    projectsList.innerHTML = projectsHTML;
    recentProjectsList.innerHTML = projects.slice(-3).map(project => `
        <div class="stat-card">
            <h3>${project.name}</h3>
            <p>Progress: ${project.progress}%</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${project.progress}%"></div>
            </div>
        </div>
    `).join('');
}

function renderProjectTasks(project) {
    const projectTasks = tasks.filter(task => project.tasks.includes(task.id));
    return projectTasks.map(task => `
        <div class="task">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTaskStatus(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
            <span class="task-deadline">Due: ${task.deadline}</span>
        </div>
    `).join('');
}

function updateDashboard() {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('activeTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
}

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active-section');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).classList.add('active-section');

    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.parentElement.classList.add('active');
        }
    });
}

function closeModal() {
    projectModal.classList.remove('active');
}

function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize
updateDashboard();
renderProjects(); 