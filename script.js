//define holders for the neccessary elements that we will attach event listeners to
var searchButton;
var searchField;
var resultsDiv;

//define holders for the parameters of our ajax calls
var numbersURLbase = "http://numbersapi.com/";
var wolframURLbase = "http://api.wolframalpha.com/v2/query?appid=YOURAPPIDHERE&output=json&format=plaintext&includepodid=Result&input=birthday%20of%20";

//define an array of months that the formatDate function will use
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//define the function that will be called in order to ping the wolfram alpha api
function wolframReq(){
	//add the final part to the wolframalphaURL
	var wolframURL = wolframURLbase + searchField.value;
	console.log(wolframURL);

	$.ajax({
		url: wolframURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("error retrieving data from wolfram alpha");
			console.log(data.status);
		},
		success: function(data){
			console.log(data);
			var birthday;
			if(data.queryresult.numpods!== 0){
				birthday = data.queryresult.pods[0].subpods[0].plaintext;
				birthday = formatDate(birthday);

				//call the numbersreq api with the new date
				numbersReq(birthday);
			}
			else{
				console.log("birthday not found :(");

				var errorString = "<div class = \"results\"><p class = \"dyk\">The birthday of " + searchField.value + " was not found. Are you sure you spelled it correctly?</p></div>";
				$('body').append(errorString);
				$('.results').fadeIn("slow");
			}
		}
	});
};

//define the function that will be called in order to ping the numbers api
function numbersReq(date){
	//construct the numbersURL appropriately using the data passed in
	var numbersURL = numbersURLbase + date.month + "/" + date.day + "/date?json";
	//var numbersURL = "http://numbersapi.com/1337/trivia?notfound=floor&fragment"
	console.log(numbersURL);
	//make the ajax call with the new URL
	$.ajax({
		url: numbersURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("error retrieving data from numbersAPI");
			console.log(data.status);
		},
		success: function(data){
			console.log(data.text);

			var successString = "";
			successString = "<div class = \"results\"><p class = \"dyk\">The birthday of " + searchField.value + " is " + date.monthString + " " + date.dayString + "...</p>";
			successString += "<p>" + data.text + "</p></div>";

			$('body').append(successString);
			$('.results').fadeIn("slow");
		}
	});
};

//function to get date in the appropriate format to hit the numbers api
function formatDate(date){
	var datearr = date.split(',');
	datearr = datearr[1].split(' ');
	var dateObject = {
		monthString : datearr[1],
		dayString : datearr[2],
		month : months.indexOf(datearr[1]) + 1,
		day : datearr[2]
	};
	return dateObject;

};

//make sure our document is loaded before proceeding to do anything else
window.addEventListener("load", function(){
	console.log("document loaded!");
	//once the document is loaded collect elements
	searchButton = document.getElementById("querybutton");
	searchField = document.getElementById("searchbox");
	resultsDiv = document.getElementById("results");

	console.log("elements collected!");

	//attach the event listeners to the various elements
	searchButton.addEventListener("click", function(){
		console.log("searchbutton listener fired!");
		wolframReq();
	});

	searchField.addEventListener("click", function(){
		console.log("user is typing");
	});
});

