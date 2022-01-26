module.exports.getAllFaq = async (db) => {
  const collection = db.collection('faq')
  const data = await collection.find({})

  return data.toArray()
}

module.exports.getAllAnswers = async (db) => {
  const collection = db.collection('answers')
  const data = await collection.find({})

  return data.toArray()
}

module.exports.getAllIncorrectAnswers = async (db) => {
  const collection = db.collection('incorrectAnswer')
  const data = await collection.find({})

  return data.toArray()
}

module.exports.createFaq = async (db, question, answer) => {
  const collection = db.collection('faq')
  const data = await collection.insertOne({
    "question": question,
    "answer": parseInt(answer),
  });

  return data
}

module.exports.createAnswer = async (db, answer, answerId) => {
  const collection = db.collection('answers');
  const data = await collection.insertOne({
    "answer": answer,
    "id": parseInt(answerId),
  });

  return data
}

module.exports.createIncorrectAnswer = async (db, question, answerId) => {
    const collection = db.collection('incorrectAnswer');

    const data = await collection.insertOne({
      "question": question,
      "answerId": parseInt(answerId),
    })

  return data
}

module.exports.createNoAnswer = async (db, answer) => {            
  const collection = await db.collection('noAnswer');
  const data = await collection.insertOne({
    "answer" : answer,
  });

  return data
}

module.exports.checkBotCollections = async (db, collectionsToCheck) => {
  collectionsToCheck.forEach(async (collection) => {
      const existingCollection = await db.collection(collection);
      console.log(existingCollection)
      if(!existingCollection) {
        db.createCollection(collection)
      }

  })
}

module.exports.createNewQA = async (db, question, answer) => {            
  // console.log('here', db)
  const collection = await db.collection('answers');
  //Find the highest id currently stored
  const newestAnswer = await collection.find({}).sort({id:-1}).limit(1).toArray()
  
  //console.log("newestAnswer", newestAnswer, !!newestAnswer.length)
  let nextId = 0;
  try {
    
    nextId = !!newestAnswer.length && (newestAnswer[0].id || newestAnswer[0].id === 0)? newestAnswer[0].id + 1 : 0
  } catch(e) {
    console.error(e);
  }
  //Creat new stuff!
  const newAnswer = await module.exports.createAnswer(db, answer, nextId)
  const newQuestion = await module.exports.createFaq(db, question, nextId)
  return nextId
}