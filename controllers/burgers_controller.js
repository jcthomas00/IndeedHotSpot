//file to route http requests to model functions
const axios = require('axios'),
	db = require("../config/connection.js"),
	express = require("express"),
	router = express.Router();


//root get route
router.get("/", (req, res)=>{
		const hotspots = [];
		//wrap the returned array in an object 
		db.get().then( data => {
			data.forEach(doc => {
				hotspots.push({id: doc.id, keywords: doc.data().keywords, locations: doc.data().locations});
		});
			//send object to handlebar for rendering
			res.render("index", {hotspots});
			//console.log(hotspots);		
		});
//});
}); 

let keywords = ""
//root post route
router.post("/", (req, res)=>{
	keywords = req.body.newKeywords;
	getIndeedJobs();
	//call the model function to insert query	
	// db.add({
	// 	keywords: req.body.newKeywords,
	// 	locations: [{place: req.body.newPlace, count: req.body.newCount}]
	// });
	res.redirect("/");	
});
let responses = [];

const getIndeedJobs = () => {
	axios.get('https://api.indeed.com/ads/apisearch', {
    params: {
      publisher: '1211867702868069',
			v: '2',
			format: 'json',
			l: ' houston, tx',
			q: keywords,
			limit: '24',
			start: 1
	//		,radius: '20'
    }
  })
  .then((response) => {
		const data = response.data,
			totalResults = data.totalResults,
			maxResults = Math.ceil(totalResults/24);
		let counter = 0;
		console.log(data);
		// let reqArray = [];
		// for (i=0; i<maxResults; i++) {

		// }

		for (result of data.results) {
			console.log(result.formattedLocation)
			responses.push(result.formattedLocation)
		}
		console.log("totalResults: "+data.totalResults);
		for (i=1; i<maxResults; i++){
					axios.get('https://api.indeed.com/ads/apisearch', {
					params: {
						publisher: '1211867702868069',
						v: '2',
						format: 'json',
						l: 'houston, tx',
						q: keywords,
						limit: '24',
						start: i*24
					}	
				}).then(response => {
					for (result in response.data.results) {
						responses.push(result.formattedLocation)
					}
					console.log(responses.length);
					counter++;
					if(counter===maxResults-1){
						console.log("Response: "+responses)
					}
				}).catch(function (error) {
					console.log(error);
				});
			}
	})
  .catch(function (error) {
    console.log(error);
  });
}

//package the router for use by the server
module.exports = router;