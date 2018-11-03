const botMongoDB = require('./mongo-db')
const stringSimilarityJs = require("string-similarity-js")

let faq = []
let answers = []
// List of questions that where answered incorrectly and the  
let incorrectAnswers = []
//List of questions asked that the program had no response to
let noResult = []


module.exports.setupInstance = async(db) => {
	//Check we have the correct collections in out datadase
	const collectionsToCheck = ["faq", "answers", "incorrectAnswer", "noAnswer"]
	let collectionsCorect = await botMongoDB.checkBotCollections(db, collectionsToCheck)
	//load all data the bot wants into memory
	faq = await botMongoDB.getAllFaq(db)
	answers = await botMongoDB.getAllAnswers(db)
	incorrectAnswers = await botMongoDB.getAllIncorrectAnswers(db)
	//Creat a new question answer combo example
	//module.exports.createNewQuestionAnswer("How hot is Da Bomb", "Scoville Heat Units (SHU): 50,000 - 250,000")
}

module.exports.saveIncorrectAnswer = async(db, question, answerId) => {
    // Use connect method to connect to the Server
	return saveIncorrectAnswer = await botMongoDB.createIncorrectAnswer(db, question, answerId)
}

module.exports.saveNoResult = async(db, answer) => {
    // Use connect method to connect to the Server
    let noResult = await botMongoDB.createNoAnswer(db, answer)
}

module.exports.saveCorrectAnswer = async(db, question, answerId) => {
	let corrSave = await botMongoDB.createFaq(db, question, answerId)

}

module.exports.createNewQuestionAnswer = async(db, question, answer) => {
	let newAnswer = await botMongoDB.createNewQA(db, question, answer)
	faq.push({"question": question, "answer": newAnswer})
	answers.push({"answer": answer, "id": newAnswer})

}


module.exports.getResponse = (db, question, lastQuestion, lastAnswer) => {
	if(question.includes('&')){
		question = question.toString().split('&')[1].toLowerCase().trim()

		switch(question) {
			case("yes"):
				let exactQuestionAlreadyExists = faq.find((q) => {return q.question == lastQuestion})
				if(!exactQuestionAlreadyExists && lastAnswer !== "na"){
					faq.push({"question": lastQuestion, "answer": lastAnswer})
				}
				module.exports.saveCorrectAnswer(db, lastQuestion, lastAnswer)
				return {response: "Good to know. Please enter your next question:", answer: "na"}
				break

			case("no"):
				if(lastAnswer != "na") {
					incorrectAnswers.push({question: lastQuestion, answer: parseInt(lastAnswer)})	
				}
				module.exports.saveIncorrectAnswer(db, lastQuestion, parseInt(lastAnswer))
				return {response: "Thank you for your feedback. Your query has been logged and will be looked into. \nPlease enter your next question:", answer: "na"}
				break

			case("inc"):
				return {response: JSON.stringify(incorrectAnswers), answer: "na"}
				break

			case("faq"):
				return {response: JSON.stringify(faq), answer: "na"}
				break

			case("add"):
				return {response: JSON.stringify(noResult), answer: "na"}
				break

			case("welcome"):
				return {response: "Welcome to ROB BOT. What is your question?", answer: "na"}
				break
				
			default:
				return {response: "I cant do that!", answer: "na"}


		}

	} else {
		//Setup our closest match placeholder
		closest = {"score":0, "question": "", "answer": null, "input": null}
		
		//Remove rubish from the end of our input
		question = question.toString().trim()
		
		//Add the inputed string to our object
		closest.input = question.toString()

		//Check similarity
		faq.forEach(qa => {
			// Check similarity score
			let similarityScore = stringSimilarityJs.stringSimilarity(question.toString(), qa.question)
			
			//If its a closer match than the one we already have. Update 
			if(closest.score <= similarityScore){

				let closeToIncorrectResponseList = []

				//Check to see if this question closely matches a 
				//Question that was answered incorrectly earlier
			 	incorrectAnswers.forEach(icqa => {

					let incorrectSimilarityScore = stringSimilarityJs.stringSimilarity(question.toString(), icqa.question)
					//If its very close to an incorrect answer
					//Add the id of the answer that was given to an array
					if(incorrectSimilarityScore >= 0.8){
						closeToIncorrectResponseList.push(icqa.answer)
					}
				})
				//If this has not been given as an incorrect answer earlier
				//Set this as the new closest match
				if(!closeToIncorrectResponseList.includes(qa.answer) ){ 
					closest.score = similarityScore
					closest.question = qa.question
					closest.answer = qa.answer
				}	
			}
		} )
		// If we have a good match return an answer
		if(closest.answer !== null && closest.score >= 0.2){
			//Get the answer the bot should respond with
			const answerToSend = answers.find(answer => {return closest.answer == answer.id})		
			return {response: answerToSend.answer + "\n\nWas this answer Correct? (Type: &yes for yes &no for no)", answer: closest.answer}

		} else {
			noResult.push(question)
			module.exports.saveNoResult(db, question)
			return {response: "Sorry I cant help you with that! \nRephrasing your question might help. If not please enter another question.", answer: "na"}
		}

	}

}