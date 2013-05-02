/*
 * Global variables
 */
var memberSelf;
var memberId;
var start = 0;
var page = 0;
var numPerPage = 20;

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
	$('#searchBar').html('<input id="textSearch" type="text" style="height: 24px;" class="box17" type="text" size="40"' +
			'onkeydown="if (event.keyCode == 13) resetSearch()"' +'>' +
	' <button onclick="resetSearch()">Search Mentor</button></input>');
//	$('#textSearch').keydown(resetSearch());

	IN.API.Profile("me")
	.fields("firstName", "lastName", "id", "positions", "industry", "headline")
	.result(displayProfiles);	 
}


function logoutCapture(){  
	console.log("Logout");
	IN.User.logout();     
//	IN.User.setNotAuthorized();
//	clearCookies();
	clearPage();
}

function clearCookies(){
	console.log(document.cookie);
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
//	document.cookie = encodeURIComponent("IN_HASH") + "=deleted; expires=" + new Date(0).toUTCString();

}

/*
 * Clear
 */
function clearPage(){
	$('#searchBar').html("");
	$('#profiles').html("");
	$('#peopleSearch').html("");
	$('#connections').html("");
	$('#errors').html("");
}

/*
 * Search
 */
function next(){
	page+=1;
	searchTitle();
}

function prev(){
	page -= 1;
	searchTitle();
}

function resetSearch(){
	console.log("reset search");
	page = 0;
	searchTitle();
}

function searchTitle(member){
	if(memberSelf == null)
	{
		return;
	}
	console.log(member);
	if(member == null){
		member = memberSelf;
	}

	var keywords = $('input').val();
	if(keywords == ""){
		keywords = member.headline;
	}

	if(keywords == "")
	{
		return;
	}

	console.log(keywords);

	IN.API.PeopleSearch()
	.fields("firstName", "lastName", "id", "positions", "industry", "siteStandardProfileRequest","public-profile-url")
	.params({"keywords":  keywords, "start":(start + (page*numPerPage)), "count":numPerPage, "sort":"relevance"})
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
	console.log("display profiles");
	var profilesDiv = document.getElementById("profiles");

	var members = profiles.values;
	for (var member in members) {
		profilesDiv.innerHTML += "<p>Recommended mentors for " + members[member].firstName + " " + 
		members[member].lastName + ":</p>";
		/*  + " in the " + members[member].industry + " industry.";*/
	}
	profilesDiv.innerHTML += '<p>Not you? ' + '<a href="javascript:void(0)" onClick="logoutCapture()">Logout</a> </p>'; 

	memberSelf = members[0];
	memberId = memberSelf.id;
	searchTitle(memberSelf);

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
	console.log(peopleSearch);
	var start = peopleSearch.people._start + 1; // because humans count from 1, not 0.
	var range = peopleSearch.people._start + peopleSearch.people._count;
	var total = peopleSearch.people._total;
	var resultsHtml = "";

	
	if (start >= 0 && range >= 0)
	{
		resultsHtml += "<p>Displaying " + start + "-" + range + " of " + total + " results.</p>";	
	}
	else if(total >= 0)
		{
		resultsHtml += "<p>Displaying " + total + " results.</p>";	
		}

	if(page > 0){
		resultsHtml += '<button onclick="prev()">Prev</button>';		
	}
	if(range < total){
		resultsHtml += '<button onclick="next()">Next</button>';	
	}
	resultsHtml += '<br>';


	for (var member in members) {

		if(members[member].id != memberId)
		{
			// Look through result to make name and url.
			var nameText = members[member].firstName + " " + members[member].lastName;
//			resultsHtml += '<p>' + nameText	+ ' works in the ' + members[member].industry + ' industry.</p>';
			var url = members[member].publicProfileUrl;
//			if (url == null)
//			{
//			url = members[member].siteStandardProfileRequest.url;
//			}
//			resultsHtml += '<p>url = ' + url + '</p>';
			resultsHtml += '<script type="IN/MemberProfile" data-id="'+url+'" data-format="inline" data-related="false"></script>';        
		}
	}

	$('#peopleSearch').append(resultsHtml);
	/* 
	 * the below statement needs to be explicitly called to interpret and parses 
	 * the inline script tags as the linked in api parses the dom only on load.
	 */
	IN.parse($("#peopleSearch")[0]);

}

function displayPeopleSearchError(error){
	profilesDiv = document.getElementById("errors");
	profilesDiv.innerHTML = "<p>An error occurred when searching for mentors. Please ensure that you are signed in to LinkedIn.</p>";
	console.log(error);
}