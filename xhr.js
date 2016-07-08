/**
 * Created by ivanoreh on 4/14/16.
 */

var XHR = new function() {
	this.post = function(url, data, callback){
		var xmlHttp = new XMLHttpRequest();
		
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				console.log(xmlHttp.responseText);
				var resp = {};
				try{
					resp = JSON.parse(xmlHttp.response);
				} catch(e){
					resp['status'] = xmlHttp.status;
				}
				callback(resp);
			}
		};

		xmlHttp.open("POST", url, true); // true for asynchronous, "http://localhost:3000/hrki/look/"
		//var postObj = {hid: 'uniqueID', newLook : 'sdafasdf', locations: [[45,16], [44,15]]};

		xmlHttp.setRequestHeader("Content-type", "application/json");
		xmlHttp.send(JSON.stringify(data));
	};	
	
	this.get = function(url, callback, data){
		var xmlHttp = new XMLHttpRequest();

		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				console.log(xmlHttp.responseText);
				var resp = {};
				try{
					resp = JSON.parse(xmlHttp.response);
				} catch(e){
					resp['status'] = xmlHttp.status;
				}
				callback(resp);
			}
		};

		xmlHttp.open("GET", url, true); // true for asynchronous, "http://localhost:3000/hrki/look/"
		//var postObj = {hid: 'uniqueID', newLook : 'sdafasdf', locations: [[45,16], [44,15]]};
		//xmlHttp.withCredentials = true; // cookies
		try{
			data = JSON.stringify(data);
		} catch(e){
			data = null;
		}
		xmlHttp.send(data);
	}
};


//XHR.post("http://localhost:3000/locations", {hid: 'uniqueID', locations: [{latitude: 45, longitude: 16}, {latitude: 44.24223, longitude: 15.87734},{latitude: 45, longitude: 16}]});

