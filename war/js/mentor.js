
/*
 * Load
 */
function onLinkedInLoad() {
	IN.Event.on(IN, "auth", onLinkedInAuth);
}

/*
 * Authorization
 */

function onLinkedInAuth() {
	$('#searchBar').html('<input style' + '="height: 24px;" class="box17" type="text" size="40">' +
			' <button onclick="searchTitle()">Search Mentor</button></input>');
	IN.API.Profile("me")
	.fields("firstName", "lastName", "positions", "industry", "headline")
	.result(displayProfiles);	 
}

/*
 * Self
 */

function searchTitle(member){
	var keywords = $('input').val();
	if(keywords == ""){
		keywords = member.headline;
	}

	console.log(keywords);

	IN.API.PeopleSearch()
	.fields("firstName", "lastName", "positions", "industry", "siteStandardProfileRequest","public-profile-url")
	.params({"keywords":  keywords})
	.result(displayPeopleSearch)
	.error(displayPeopleSearchError);
}


/*
 * Connections
 */

function displayConnections(connections) {
	var connectionsDiv = document.getElementById("connections");

	var members = connections.values; // The list of members you are connected to
	for (var member in members) {
		connectionsDiv.innerHTML += "<p>" + members[member].firstName + " " + members[member].lastName 
		+ " works in the " + members[member].industry + " industry" ;
	} 
}


function setConnections(connections) {
	var profileDiv = document.getElementById("connections");

	var start = connections._start + 1; // because humans count from 1, not 0.
	var range = connections._start + connections._count;
	profileDiv.innerHTML = "<p>Displaying " + start + "-" + range + " of " + connections._total + " connections.</p>";

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

/*
 * Profiles
 */
function displayProfiles(profiles) {
	var profilesDiv = document.getElementById("profiles");

	var members = profiles.values;
	for (var member in members) {
		profilesDiv.innerHTML += "<p>Recommended mentors for " + members[member].firstName + " " + members[member].lastName + ":</p>"; 
		/*  + " in the " + members[member].industry + " industry.";*/
	}

	searchTitle(members[0]);

}


function displayProfilesErrors(error) {
	profilesDiv = document.getElementById("profiles");
	profilesDiv.innerHTML = "<p>Oops! An invalid profile was detected!</p>";
	console.log(error);
}


/*
 * People Search
 */
function displayPeopleSearch(peopleSearch) {
	$('#peopleSearch').html("");
	// Loop through the people returned
	var members = peopleSearch.people.values;
	//console.log(members);
	var resultsHtml = "";
	for (var member in members) {

		// Look through result to make name and url.
		var nameText = members[member].firstName + " " + members[member].lastName;
		var url = members[member].publicProfileUrl;
		resultsHtml += '<sc'+'ript type="IN/MemberProfile" data-id="'+url+'" data-format="inline" data-related="false"></sc'+'ript>';        
	}
	$('#peopleSearch').append(resultsHtml);
	//the below statement needs to be explicitly called to interpret and parse
	//the inline script tags as the linked in api parses the dom onle on load.
	IN.parse($("#peopleSearch")[0]);

}

function displayPeopleSearchError(error){
	profilesDiv = document.getElementById("errors");
	profilesDiv.innerHTML = "<p>An error occurred when searching for mentors. Please ensure that you are signed in to LinkedIn.</p>";
	console.log(error);
}