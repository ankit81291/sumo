
var app = (function() {
    var teamData = [
       {
          team:'Engineering',
          employees:[
             'Lawana Fan',
             'Larry Rainer',
             'Rahul Malik',
             'Leah Shumway'
          ]
       },
       {
          team:'Executive',
          employees:[
             'Rohan Gupta',
             'Ronda Dean',
             'Robby Maharaj'
          ]
       },
       {
          team:'Finance',
          employees:[
             'Caleb Brown',
             'Carol Smithson',
             'Carl Sorensen'
          ]
       },
       {
          team:'Sales',
          employees:[
             'Ankit Jain',
             'Anjali Maulingkar'
          ]
       }
    ];
    var teamMap = {}, selectedTeam = "";
    function createTeamMap() {
      if(!teamMap || Object.keys(teamMap).length === 0) {
        teamMap = {};
        teamData.forEach(function(obj) {
          teamMap[obj.team] = obj.employees;
        });
      }
      return teamMap;
    }

    function createSelectOption(value, text) {
      var option = document.createElement("option");
      option.text = text || value;
      option.value = value;
      return option;
    }

    function populateTeamDropdown() {
      var teamSelectBox = document.getElementById('team-select');
      for(var team in teamMap) {
        teamSelectBox.add(createSelectOption(team));
      }
    }

    function clearEmployees() {
      var employeeField = document.getElementById('employee-text');
      employeeField.value = "";
      employeeField.classList.remove('disabled');
    }

    function setEmployeeAutocompleteOptions(options) {
      var autocompleteOptions = document.getElementById('autocomplete-options');
      autocompleteOptions.innerHTML = "";
      options.forEach(function(opt) {
        var childDiv = document.createElement('div');
        childDiv.className = 'option';
        childDiv.innerHTML = opt;
        autocompleteOptions.appendChild(childDiv);
      });
    }

    function onTeamSelect(selectObj) {
      selectedTeam = selectObj.value;
      clearEmployees();
      setEmployeeAutocompleteOptions(teamMap[selectedTeam]);
    }


    function showEmployeeAutocompleteOptions() {
      var autocompleteOptions = document.getElementById('autocomplete-options');
      var employeeField = document.getElementById('employee-text');
      var rect = employeeField.getBoundingClientRect();
      autocompleteOptions.style.display = "block";
      autocompleteOptions.style.top = rect.top + rect.height + "px";
      autocompleteOptions.style.left = rect.left + "px";
    }

    function hideEmployeeAutocompleteOptions() {
      var autocompleteOptions = document.getElementById('autocomplete-options');
      autocompleteOptions.style.display = "none";
    }

    function selectEmployee(evt) {
      var employee = evt.target.innerHTML;
      var employeeField = document.getElementById('employee-text');
      employeeField.value = employee;
      hideEmployeeAutocompleteOptions();
    }

    function filterEmployeeOptions() {
      var val = document.getElementById('employee-text').value;
      var filtered = teamMap[selectedTeam];
      if(val) {
        filtered = teamMap[selectedTeam].filter(function(opt) {
          return opt.toLowerCase().indexOf(val.toLowerCase()) !== -1;
        });
      }
      setEmployeeAutocompleteOptions(filtered);
    }

    function stopPropagate(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    function delayCall(fn) {
      var timeout;
      return function() {
        if(timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(fn, 200);
      };
    }

    function addListeners() {
        var autocompleteOptions = document.getElementById('autocomplete-options');
        autocompleteOptions.addEventListener('click', selectEmployee);

        var employeeField = document.getElementById('employee-text');
        employeeField.addEventListener("focus", showEmployeeAutocompleteOptions);
        employeeField.addEventListener("keydown", delayCall(filterEmployeeOptions));
        employeeField.addEventListener('click', stopPropagate);

        document.body.addEventListener('click', hideEmployeeAutocompleteOptions);

    }

    function onSubmit() {
      //validation
      if(selectedTeam) {
        var employeeField = document.getElementById('employee-text');
        var data = teamMap[selectedTeam];
        if(data.indexOf(employeeField.value) === -1) {
          alert("employee does not match");
        } else {
          alert("Success!");
        }
      } else {
        alert("Select a team!");
      }
    }

    function onCancel() {
      //check changed
      var employeeField = document.getElementById('employee-text');
      if(selectedTeam || employeeField.value) {
        alert("Edit in progress!");
      }
    }


    /* Initialize the app and start kick of the lifecycle
        @type function
        @public
    */
    function appInit() {
        createTeamMap();
        populateTeamDropdown();
        addListeners();
    }

    return {
        init: appInit,
        onTeamSelect: onTeamSelect,
        onSubmit: onSubmit,
        onCancel: onCancel
    };
})();

window.addEventListener("DOMContentLoaded", app.init, false);
