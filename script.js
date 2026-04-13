
const tableBody = document.getElementById("projectsTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const resetBtn = document.getElementById("resetBtn");
const spinner = document.getElementById("spinner");
const paginationDiv = document.getElementById("pagination");
const infoDiv = document.getElementById("info");


let allProjects = [];
let currentFiltered = [];
let currentPage = 1;
const itemsPerPage = 10;


function showSpinner(show) {
    spinner.style.display = show ? "block" : "none";
}



function getStatusBadge(status) {
    if(status === "Completed") {
        return '<span class="status-completed">✓ Completed</span>';
    } else {
        return '<span class="status-progress">⚡ In Progress</span>';
    }
}


function getPriorityBadge(priority) {
    if(priority === "High") return '<span class="priority-high">🔴 High</span>';
    if(priority === "Medium") return '<span class="priority-medium">🟠 Medium</span>';
    return '<span class="priority-low">⚪ Low</span>';
}



function displayProjects(projects, page = 1) {
    
    


if(projects.length === 0) {

       
         tableBody.innerHTML = `<tr><td colspan="8" class="text-center">No projects found</td></tr>`;
        paginationDiv.innerHTML = "";
        infoDiv.innerHTML = "";

        
        return;
    }

    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProjects = projects.slice(start, end);


 let rows = "";
    for(let i = 0; i < pageProjects.length; i++) {
        const p = pageProjects[i];
        rows += `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.ProjectName}</strong></td>
                <td>${p.Details}</td>
                <td>${p.startDate}</td>
                <td>${p.EndDate}</td>
                <td>${getPriorityBadge(p.priority)}</td>
                <td><span class="badge bg-info">${p.Department}</span></td>
                <td>${getStatusBadge(p.status)}</td>
            </tr>
        `;
    }
    tableBody.innerHTML = rows;

      infoDiv.innerHTML = `Showing ${start+1} to ${Math.min(end, projects.length)} of ${projects.length} projects`;
    

          buildPagination(totalPages, page);
}


function buildPagination(totalPages, currentPage) {
    if(totalPages <= 1) {
        paginationDiv.innerHTML = "";
        return;
    }
    

let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage-1}">Previous</a>
        </li>
    `;
    
    for(let i = 1; i <= totalPages; i++) {
        if(i === 1 || i === totalPages || (i >= currentPage-1 && i <= currentPage+1)) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        } else if(i === currentPage-2 || i === currentPage+2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">

    <a class="page-link" href="#" data-page="${currentPage+1}">Next</a>
    </li>`;
    
    paginationDiv.innerHTML = html;


document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            if(!isNaN(page) && page >= 1 && page <= totalPages) {
                currentPage = page;
                displayProjects(currentFiltered, currentPage);
            }
        });
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const priorityValue = priorityFilter.value;
    
    currentFiltered = allProjects.filter(project => {
        const matchesSearch = searchTerm === "" || 
            project.ProjectName.toLowerCase().includes(searchTerm) ||
            project.Details.toLowerCase().includes(searchTerm) ||
            project.Department.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusValue === "all" || project.status === statusValue;
        const matchesPriority = priorityValue === "all" || project.priority === priorityValue;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    currentPage = 1;
    displayProjects(currentFiltered, 1);
}    
 

function resetFilters() {
    searchInput.value = "";
    statusFilter.value = "all";
    priorityFilter.value = "all";
    applyFilters();
}





async function fetchAPI() {
         showSpinner(true);
    try {
        const response = await fetch("https://674e84f1635bad45618eebc1.mockapi.io/api/v1/projects");
        const data = await response.json();
       
        
       allProjects = data;
    
       currentFiltered = [...allProjects];
        displayProjects(currentFiltered, 1);

        
 } catch(err) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    } finally {
        showSpinner(false);
    }
}






searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
resetBtn.addEventListener("click", resetFilters);
    
fetchAPI();







    
    
        
        
       