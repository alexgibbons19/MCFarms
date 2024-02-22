<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home Page</title>
  <style>
    /* CSS styles for the layout */
    .container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 50px;
    }
    .giant-box {
      border: 1px solid black;
      padding: 20px;
      margin-bottom: 20px;
      width: 80%;
      max-width: 600px;
      text-align: center;
      position: relative;
    }
    .square-box {
      border: 1px solid black;
      padding: 10px;
      margin-bottom: 20px;
      width: 40%;
      max-width: 200px;
      text-align: center;
    }
    .rectangle {
      border: 1px solid black;
      margin-top: 20px;
      padding: 20px;
      width: 80%;
      max-width: 600px;
      text-align: center;
    }
    .flex-container {
      display: flex;
      justify-content: space-between;
    }
    .notification-box {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .menu-button {
      position: absolute;
      top: 10px;
      left: 10px;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
    }
    .menu-icon {
      font-size: 24px; /* Adjust the size as needed */
    }
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 120px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content a:hover {
      background-color: #f1f1f1;
    }
    .show {
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Home Page title -->
    <h1>Home Page</h1>
    <!-- Giant box -->
    <div class="giant-box">
      <!-- Burger menu button -->
      <button class="menu-button" onclick="toggleMenu()">
        &#9776; <!-- Unicode character for burger menu icon -->
      </button>
      <!-- Dropdown content -->
      <div id="dropdownMenu" class="dropdown-content">
        <a href="#" onclick="goToPage('home')">Home</a>
        <a href="#" onclick="goToPage('weather')">Weather</a>
        <a href="#" onclick="goToPage('inventory')">Inventory</a>
        <a href="#" onclick="goToPage('calendar')">Calendar</a>
        <a href="#" onclick="goToPage('reminders')">Reminders</a>
        <a href="#" onclick="goToPage('optimalCrops')">Optimal Crops</a>
      </div>
      <!-- Notification bell box -->
      <div class="notification-box">
        <img src="https://cdn3.vectorstock.com/i/1000x1000/79/72/notification-bell-icon-vector-34877972.jpg" alt="Bell Icon" width="30">
      </div>
      <h2>MC Farm</h2>
      <div class="flex-container">
        <!-- Weather square-box -->
        <div class="square-box" style="margin-right: 10px;">
          <h3>Weather</h3>
          <img src="https://cdn2.iconfinder.com/data/icons/weather-color-2/500/weather-02-512.png" alt="Weather Icon" width="50">
          <p>Riverdale</p>
          <p>25°C</p> <!-- Example temperature -->
        </div>
        <!-- Inventory square-box -->
        <div class="square-box" style="margin-left: 10px;">
          <h3>Inventory</h3>
          <p>Corn: 188</p>
          <p>Wheat: 238</p>
          <p>Tomatoes: 327</p>
        </div>
      </div>
      <!-- Reminders rectangle -->
      <div class="rectangle" style="margin: 0 auto;">
        <!-- Reminders -->
        <h3>Reminders</h3>
        <p>28 Days to harvest Corn 245</p>
        <hr>
        <p>30 Days to sell Tomatoes</p>
      </div>
    </div>
  </div>
  <script>
    function toggleMenu() {
      var dropdownMenu = document.getElementById("dropdownMenu");
      dropdownMenu.classList.toggle("show");
    }


    function goToPage(page) {
      alert("Navigating to " + page);
      // Implement your navigation logic here
    }


    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.menu-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  </script>
</body>
</html>
