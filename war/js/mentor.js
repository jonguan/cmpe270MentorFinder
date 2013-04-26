 

  

// Load
function onLinkedInLoad() {
     IN.Event.on(IN, "auth", onLinkedInAuth);
}

//Authorization

function onLinkedInAuth() {
	  IN.API.Connections("me")
	    .fields("firstName", "lastName", "industry")
	    .result(displayConnections)
	    .error(displayConnectionsErrors);
	}

// Connections
function displayConnections(connections) {
	  var connectionsDiv = document.getElementById("connections");

	  var members = connections.values; // The list of members you are connected to
	  for (var member in members) {
	    connectionsDiv.innerHTML += "<p>" + members[member].firstName + " " + members[member].lastName
	      + " works in the " + members[member].industry + " industry";
	  }     
	}


function setConnections(connections) {
	  var profileDiv = document.getElementById("connections");

	  var start = connections._start + 1; // because humans count from 1, not 0.
	  var range = connections._start + connections._count;
	  connectionsDiv.innerHTML = "<p>Displaying " + start + "-" + range + " of " + connections._total + " connections.</p>";

	  var members = connections.values;
	  for (var member in members) {
	    profileDiv.innerHTML += "<p>" + members[member].firstName + " " + members[member].lastName
	      + " works in the " + members[member].industry + " industry.</p>";
	  }
	}


function displayConnectionsErrors(error) { 
	profilesDiv = document.getElementById("connections");
profilesDiv.innerHTML = "<p>Oops! Error in Connections!</p>";
console.log(error); 
}
	
// Profiles
function displayProfiles(profiles) {
	  var profilesDiv = document.getElementById("profiles");

	  var members = profiles.values;
	  for (var member in members) {
	    profilesDiv.innerHTML += "<p>" + members[member].firstName + " " + members[member].lastName 
	      + " works in the " + members[member].industry + " industry.";
	  }
	}


function displayProfilesErrors(error) {
	  profilesDiv = document.getElementById("profiles");
	  profilesDiv.innerHTML = "<p>Oops! An invalid profile was detected!</p>";
	  console.log(error);
	}
	   