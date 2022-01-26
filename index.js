const express = require('express')
const app = express()
const port = 8080
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const botServices = require('./services')

// Connection url
const url = 'mongodb://bot-database:27017'
// Database Name
const dbName = 'Bot'
// create Client
const client = new MongoClient(url)
//Setup Database variable
let db

//Setup default for closest
let closest = {"score":0, "question": "", "answer": null, "input": null}

// Handle web inputs
app.get('/askQuestion/:question/:lastQuestion/:lastAnswer', async (req, res) => {
 	const ques = req.params.question
 	const lastQues = req.params.lastQuestion
 	const lastAns = req.params.lastAnswer

 	let responseData = botServices.getResponse(db, ques, lastQues, lastAns)
 	let response = responseData.response
 	let answer = (responseData.answer || responseData.answer == 0)? responseData.answer.toString() : "na"

	res.json({data: response, user: "ROB BOT", lastQuestion: ques, lastAnswer: answer})
})

//Use the html files from static folder
app.use(express.static(path.join(__dirname,'static')))

function startServer() {
	createMongoClient()
}

function createMongoClient() {
	//Start the express server
	client.connect((err, client1) => { 
		startAppServer(err, client1)
	})
}

function startAppServer(error, client1) {

	if(error) {
		console.error(err.stack);
		return;
	}
	try {

		db = client1.db(dbName);
		// console.log(db.collection('faq'))
		botServices.setupInstance(db).then(() => {
			// start the express server
			app.listen(port, (err) => {
			  if (err) {
				console.error('error', err)
			   } else {
				console.log(`app listening on port ${port}`)
			   }
			})	
		})	
	  } catch (err) {
		console.error(err.stack)
	  }
}

startServer()


//Cleanup on server shutdown
function gracefulShutdown(e) {
	console.log("Shutting Down", e)
	client.close()
	process.exit()
}

process.on('uncaughtException', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('exit', gracefulShutdown)