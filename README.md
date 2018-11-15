# Bot
A basic express.js &amp; MongoDB based bot. That can provide answers based on a dataset and learn from user feedback.

## Installation 
Ensure Git and Node are installed on your machine. Then: 
Git clone `https://github.com/up730418/Bot`
Move to the Bot folder then `npm install`

## Starting the bot
Ensure Mongodb is installed and running. Instructions on how to do this can be found at : https://docs.mongodb.com/manual/installation/

Then `npm start`

Once you have started the server navigate to `localhost:8080` and the bot should welcome you!

## Loading Data to the bot
To add questions and answers to the bot view `services.js line 21`. If this line is uncommented it will add a new question/answer to the Bot when the `npm start` command is run. You may copy this line multiple times to add multiple records. Note: ensure that you only load each question/answer once else you will have duplicate data in the database wich will cause issues.

Alternetivly to this you can load data directly into the database in bfollowing way:
- Load questions in to the faq collection in following format: `[{ "question": "Do you like Cheese", "answer": 1}]`
- Load answers in to the answers collection in following format: `[{ "answer": "No one likes Cheese", "id": 1}]`

Done you should now have a fully functunal Bot!! Happy Questioning!

## To Do
- Restructure database. The current implementation works but could be vastly improved
- Make it smarter. Currently only one `no` reply is needed to make the bot not serve an answer for a question. This could lead to the bot being abused fairly easily.
- Add a web interface for adding questions and answers
- Improve the bots UI
- Split up the `getResponse` function into smaller functions for easier maintainability
- Create functions that will allow the bot to check the database for updates periodically/onchange so multiple instances can be created.
- 
