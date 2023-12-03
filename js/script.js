/*
Name: Ryan Politis
Email: Ryan_Politis@student.uml.edu
File: mult_table.js
Date: 11/27/23
GUI Assignment: Implement a multiplication table using forms, javascript, jquery, jquery-ui, and jquery-validate
What the file does: Grabs inputs through text or slider, checks for invalid inputs, then makes a dynamic multiplication table within a tab, make new tabs or delete single or all tabs
*/

// Validator default setup
$.validator.setDefaults({});

// New validator method to check that max value is greater than min value
$.validator.addMethod('greater_than', function (value, element, param) {
  return this.optional(element) || parseInt(value) >= parseInt($(param).val());
});

$().ready(function() {                                                // Wait until DOM is ready
  $("#slider_minx").slider({                                          // Initialize slider for minimum x-value
    min: -50,                                                         // Restrict minimum value to -50  
    max: 50,                                                          // Restrict maximum value to 50
    step: 1,                                                          // Make sure slider can only step by whole numbers
    slide: function(event, ui) {                                      // Update minimum x-value when slider slides
      $("#min_x").val(ui.value);
    }
  });
  $("#min_x").change(function () {                                    // Change the slider value when a minimum x-value is typed in the input box
    $("#slider_minx").slider("value",this.value);
  });

  $("#slider_maxx").slider({                                          // Repeat intialization process for maximum x-value slider
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
      $("#max_x").val(ui.value);
    }
  });
  $("#max_x").change(function () {
    $("#slider_maxx").slider("value",this.value);
  });

  $("#slider_miny").slider({                                          // Repeat initialization process for minimum y-value slider
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
      $("#min_y").val(ui.value);
    }
  });
  $("#min_y").change(function () {
    $("#slider_miny").slider("value",this.value);
  });

  $("#slider_maxy").slider({                                          // Repeat initilization process for maximum y-value slider
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
      $("#max_y").val(ui.value);
    }
  });
  $("#max_y").change(function () {
    $("#slider_maxy").slider("value",this.value);
  });

  $("#tabs").tabs({                                                   // Initiliaze tab and set default home tab active
    active: 0
  });

  $("#input_form").validate({                                         // Validate submitted inputs
    rules: {
      min_x: {
        required: true,                                               // Require a value to be sumbimitted
        number: true,                                                 // Value inputted must be a number
        min: -50,                                                     // Check if value is below minimum amount
        max: 50,                                                      // Check if value is above maximum amount
      },
      max_x: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        greater_than: '#min_x'                                         // Check if minimum x-value is greater than maximum x-value
      },
      min_y: {
        required: true,
        number: true,
        min: -50,
        max: 50
      },
      max_y: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        greater_than: "#min_y"                                         // Check if minimum y-value is greater than maximum y-value
      }
    },
    messages: {
      min_x: {
        required: "Please enter a number!",                           // Error message for if a number is not entered
        number: "Input must be a number!",                            // Error message for if input is not a number
        min: "Your number must be greater than -50!",                 // Error message for if minimum x-value is below minumum bound
        max: "Your number must be less than 50!"                      // Error message for if minimum x-value is above maximum bound
      },
      max_x: {
        required: "Please enter a number!",
        number: "Input must be a number!",
        min: "Your number must be greater than -50!",
        max: "Your number must be less than 50!",
        greater_than: "Maximum X-value must be greater than minimum!"  // Error message if maximum x-value is not greater than minimum x-value
      },
      min_y: {
        required: "Please enter a number!",
        number: "Input must be a number!",
        min: "Your number must be greater than -50!",
        max: "Your number must be less than 50!"
      },
      max_y: {
        required: "Please enter a number!",
        number: "Input must be a number!",
        min: "Your number must be greater than -50!",
        max: "Your number must be less than 50!",
        greater_than: "Maximum Y-value must be greater than minimum!"
      }
    }
  });

  var tab_counter = 1;                                               // Set tab_counter to 1 to represent active home tab at beginning

  $("#adder").click(function() {                                    // Adder function that makes a new tab and dynamic multiplication table when button is clicked
    if ($("#input_form").valid()) {                                   // Check inputs are valid to make sure no invalid tables are created
      tab_counter++;                                                  // Increment tab counter to show another tab has been created
      var newTabName = "Tab " + tab_counter;                          // Placeholder tab name
      $("#tabs_list").append('<li><a href="#tbl' + tab_counter + '">' + newTabName + '</a></li>');        //  Make new tab
      $("#tabs").append('<div id="tbl' + tab_counter + '"><table id="multi_table' + tab_counter + '"></table></div>');        // Append table to tab
      $("#tabs").tabs("refresh");                                             // Refresh tabs
      $("#tabs").tabs("option", "active", -1);                                // Set new tab to be active
      var active = $( "#tabs" ).tabs( "option", "active" ) + 1;               // Grab index of active tab
      update_table(active);                                                   // Update the multiplication table within new tab
    }
  });

  $("#deleter").click(function() {                                        // Deleter function that deletes the current selected tab (cannot delete first home tab)
    var active = $( "#tabs" ).tabs( "option", "active" );                 // Grab the current active tab
    if (tab_counter > 1 && active !== 0) {                                // Check that there are new tabs to delete and current tab is not the home tab
      tab_counter--;                                                      // Decrement tab_counter  
      $("#tabs").find(".ui-tabs-nav li:eq(" + active + ")").remove();     // Remove tab nav
      $("#tabs").find(".ui-tabs-panel:eq(" + active + ")").remove();      // remove tab panel
      $("#tabs").tabs("refresh");                                         // Refresh tabs
      $("#tabs").tabs("option", "active", active - 1);                    // Set previous tab to active
    }
  });

  $("#destroyer").click(function() {                                      // Destroyer function deletes every tab (cannot delete first home tab)
    if (tab_counter > 1) {                                                // Check that there are tabs to delete
      $("#tabs").tabs("option", "active", 0);                             // Set active tab to home tab
      for(var i = 1; tab_counter > i; tab_counter--) {                    // Loop to iterate through tabs and delete them
        $("#tabs").find(".ui-tabs-nav li:eq(" + (tab_counter - 1) + ")").remove();    // Remove tab nav
        $("#tabs").find(".ui-tabs-panel:eq(" + (tab_counter - 1) + ")").remove();     // Remove tab panel
      }
      tabs.tabs( "refresh" );                                               // Refresh tabs
    }
  });

  $("#slider_minx, #slider_maxx, #slider_miny, #slider_maxy").on("slidechange", function (event, ui) {      // Dynamically update table within active tab when slider is moved
    var active = $( "#tabs" ).tabs( "option", "active" ) + 1;
    update_table(active);
  });

  $("#min_x, #max_x, #min_y, #max_y").on("input", function () {                                             // Dynamically update table when input is changed
    var active = $( "#tabs" ).tabs( "option", "active" ) + 1;
    update_table(active);
  });
});

function update_table(index) {
  if ($("#input_form").valid()) {
    
    document.getElementById("multi_table" + index).innerHTML = "";            // Clears the multiplication table to allow it to be regenerated

    var min_x = document.getElementById("min_x").value;               // Gets the minimum x-value from the first input
    var max_x = document.getElementById("max_x").value;               // Gets the maximum x-value from the second input
    
    var min_y = document.getElementById("min_y").value;               // Gets the minimum y-value from the third input
    var max_y = document.getElementById("max_y").value; 

    var table = document.getElementById('multi_table' + index);               // Grab the multiplication table and put it inside a table variable

    var header_row = table.insertRow();                               // Insert a row for the header of the muliplication table
    header_row.insertCell();                                          // Insert an empty cell in the top left corner
  
    // Main multiplication table loops
    for (var i = min_x; i <= max_x; i++) {                            // Loop to insert column cells into the header row
      var cell = header_row.insertCell();
      cell.textContent = i;                                           // Insert content of cells; numbers should be from minimum x-values to maximum x-values
    }
  
    for (var j = min_y; j <= max_y; j++) {                            // Loop to insert rows of the multiplication table
      var new_row = table.insertRow();
  
      var row_header_cell = new_row.insertCell();                     // Create header row in first column of table
      row_header_cell.textContent = j;                                // Insert content of header row in first column
  
      for (var k = min_x; k <= max_x; k++) {                          // Loop to input multiplication table content
        var cell = new_row.insertCell();                              // Insert cells
        cell.textContent = j * k;                                     // Multiply and insert the content into the cells of table
      }
    }
    var tabName = "[" + min_x + ", " + max_x + ", " + min_y + ", " + max_y + "]";   // Make tab name the values of min_x, max_x, min_y, max_y
    $("#tabs_list li:nth-child(" + (index) + ") a").text(tabName);                  // Set names to tab
  }
}
