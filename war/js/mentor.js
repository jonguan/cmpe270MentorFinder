 

  

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


function displayConnectionsErrors(error) { /* do nothing */ }
	
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
	   