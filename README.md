# AIBot
A basic express.js &amp; MongoDB based bot, Dockerized for your convenience. It can provide answers based on a dataset and learn from user feedback.

## Installation 
Ensure Git, Node, Docker and Docker-compose are installed on your machine. Then: 
Git clone `https://github.com/up730418/Bot`
Move to the Bot folder then `npm install`

## Starting the bot
Simply run `docker-compose up`

Once you have started the server navigate to `localhost:8080` and the bot should welcome you!

## Loading Data to the bot
To add questions and answers to the bot uncomment `services.js line 18`. If this line is uncommented it will add a new data to the Bot when the container is started. You can then add/remove data to the object on `services.js line 146` to populate the Bot.

Alternatively to this you can load data directly into the database in following way:
- Load questions in to the faq collection in following format: `[{ "question": "Do you like Cheese", "answer": 1}]`
- Load answers in to the answers collection in following format: `[{ "answer": "No, no one likes Cheese", "id": 1}]`

Done you should now have a fully functional Bot!! Happy Questioning!


## Persisting Data 
Data will remain within the mongo container until it is removed. To persist it beyond that uncomment the `volumes` section of the `db` service in `docker-compose.yml`. You may want to modify the location to suit your needs.

## To Do
- Restructure database. The current implementation works but could be vastly improved.
- Update mongo and the JS mongo driver to current versions.
- Make it smarter. Currently only one `no` reply is needed to make the bot not serve an answer for a question. This could lead to the bot being abused fairly easily.
- Add a web interface for adding questions and answers.
- Improve the bots UI.
- Split up the `getResponse` function into smaller functions for easier maintainability.
- Create functions that will allow the bot to check the database for updates periodically/onchange so multiple instances can be created.
- Add Tests!
