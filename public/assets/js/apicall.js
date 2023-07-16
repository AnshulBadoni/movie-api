document.addEventListener('DOMContentLoaded', () => {
    getUsers();
  
    // Add event listener to the parent element of the delete buttons
    const usersTable = document.getElementById('users-table');
    usersTable.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-btn')) {
        handleDelete(event);
      }
    });
    usersTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
          handleEdit(event);
        }
      });

      });
  
  async function getUsers() {
    try {
      const response = await fetch('http://localhost:5000/allcharacters'); // Replace with your API endpoint
      const data = await response.json();
      const usersTable = document.getElementById('users-table');
  
      data.forEach(user => {
        const row = createUserRow(user);
        usersTable.querySelector('tbody').appendChild(row);
      });
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  }
  
  function createUserRow(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="min-width">
        <div class="lead">
          <div class="lead-image">
            <img style="object-fit:fill;" src="${user.image}" alt="" />
          </div>
        </div>
      </td>
      <td class="min-width user-name">
        <p>${user.name}</p>
      </td>
      <td class="min-width">
        <p>${user.description}</p>
      </td>
      <td class="min-width">
        <p>${user._id}</p>
      </td>
      <td>
      <div class="action justify-content-end">
        <button class="more-btn ml-10 dropdown-toggle" data-id="moreAction${user._id}" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="lni lni-more-alt"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction${user._id}">
          <li class="dropdown-item">
            <a href="#0" class="delete-btn text-danger" data-id="${user._id}">Remove</a>
          </li>
          <li class="dropdown-item">
            <a href="#0" class="edit-btn text-primary" data-id="${user._id}">Edit</a>
          </li>
        </ul>
      </div>
    </td>
    `;
    return row;
  }
  
  async function handleDelete(event) {
    if (event.target.classList.contains('delete-btn')) {
      const userId = event.target.getAttribute('data-id');
      try {
        const response = await fetch(`http://localhost:5000/characters/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Remove the deleted row from the table
          const row = event.target.closest('tr');
          row.parentNode.removeChild(row);
        } else {
          const data = await response.json();
          console.log('Error deleting user:', data.error);
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
    }
  }
  async function handleEdit(event) {
    if (event.target.classList.contains('edit-btn')) {
      const userId = event.target.getAttribute('data-id');
      window.location.href = `update.html?id=${userId}`;
    }
  }
  // to get number of users 
  async function getTotalUsers() {
    try {
      const response = await fetch('http://localhost:5000/allcharacters'); // Replace with your API endpoint
      const data = await response.json();
      
      // Get the total number of users
      const totalUsers = data.length;
      document.getElementById('totalUsers').textContent = totalUsers;
  
      // Get the details of the latest user
      const latestUser = data[data.length - 1];
      document.getElementById('latestUserName').textContent = latestUser.name;
      document.getElementById('latestUserId').textContent = latestUser._id;
      document.getElementById('latestUserImage').src = latestUser.image;
      document.getElementById('latestUserDescription').textContent = latestUser.description;
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  }

  getTotalUsers();  

  async function getcurrentadmin() {
    try {
      const response = await fetch('http://localhost:5000/allcharacters'); // Replace with your API endpoint
      const data = await response.json();
      
      // Get the total number of users
      const totalUsers = data.length;
      document.getElementById('totalUsers').textContent = totalUsers;
  
      // Get the details of the latest user
      const latestUser = data[data.length - 1];
      document.getElementById('latestUserName').textContent = latestUser.name;
      document.getElementById('latestUserId').textContent = latestUser._id;
      document.getElementById('latestUserImage').src = latestUser.image;
      document.getElementById('latestUserVideo').src = latestUser.image;
      document.getElementById('latestUserDescription').textContent = latestUser.description;
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  }

  getTotalUsers();  

// search
var searchInput = document.getElementById("searchBox");

searchInput.addEventListener("keypress", function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    // console.log('pressed')
    searchTable();
  }
});

  function searchTable() {
    var input = document.getElementById("searchBox").value.toLowerCase();
    var table = document.getElementById("users-table");
    var rows = table.getElementsByTagName("tr");
    
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName("td");
      
      if (cells.length > 0) {
        var username = cells[1].innerText.toLowerCase();
        
        if (username.includes(input)) {
          rows[i].style.display = "";
        } else {
          rows[i].style.display = "none";
        }
      }
    }
  }
  // dark mode
  // Function to toggle dark mode
// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  const isDarkModeEnabled = body.classList.toggle("dark-mode");

  // Store the dark mode preference in localStorage
  localStorage.setItem("darkMode", isDarkModeEnabled);

  // Hide the content to avoid flickering
  const content = document.getElementById("content");
  content.style.visibility = "hidden";

  // Wait for a short delay and then show the content
  setTimeout(() => {
    content.style.visibility = "visible";
  }, 200);
}

// Function to check if dark mode preference is stored and apply it
function applyDarkModePreference() {
  const body = document.body;
  const darkModePreference = localStorage.getItem("darkMode");

  if (darkModePreference === "true") {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}

// Apply dark mode preference on page load
applyDarkModePreference();
