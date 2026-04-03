## Git Talking - a channel-based Q&A forum

Git Talking helps developers ask questions in channels for different topics which allows for threaded responses, attachments, and a voting system. 

# Features
- Channel-based seperation for different topics
- Threaded replies
- Voting system (upvotes and downvotes) to grade responses and posts
- Ability to attach images and screenshots to provide more context for posts/answers
- Search capabilities to allow users to filter or find specific posts/replies
- Admin Features to delete any channels, posts, users, replies etc. 

# Environment/Libraries/Languages/Tools Used
- WSL2 on Windows 11
- NextJS 
- NodeJS 
- TypeScript 
- CSS
- PostgreSQL v15-alpine
- Docker

# Project Structure

```
Git-Talking/
├── db
└── git-talking
    ├── app
    │   ├── admin
    │   ├── channels
    │   │   └── [id]
    │   ├── login
    │   ├── posts
    │   │   └── [id]
    │   ├── search
    │   └── signup
    ├── components
    ├── lib
    │   └── auth
    └── public
```

# Steps to build and run

- Make sure you have Docker Desktop and Docker Compose installed. (I developed this using Docker Desktop).
  
- clone the repository
```bash
git clone https://github.com/ethan-almeida/GitTalking.git
cd GitTalking
```

- create a .env file and place it in in git-talking/ NOT Git-Talking/. Make sure the following variables are in the .env file:-
```env
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_NAME=
DB_PORT=
SESSION_SECRET=
```
Note: DB_HOST must be called "db"

- If using Docker (which let's be honest, you probably are), run the following commands to start the backend:-

```bash
cd ..
docker compose up --build #this command is for actually building the containers
```


# Additional Details

- The ports I used while developing were Port: 3000 for the frontend (this is what actually is in the URL bar), and Port:5432 to host the database on.
- The schema I used for this database is located in the db/ folder called schema.sql (pretty obvious) as well as the seed data called seed.sql (maybe less obvious?)
- There is an admin mode in this project which can be used to delete any posts, channels, replies. However you will need to sign up with an account and then give it admin privileges via the Docker terminal.
	Steps to do this:-
	1. Open a new terminal and run the command below:-
	```bash
	docker exec -it git-talking-db-1 psql -U <username> -d <database_name>
	
	```
	
	2. After running you should see <database_name># on the left side, now run this command below:-
	```sql
	UPDATE users SET role = "admin" WHERE email = "<your-email>@email.com" #you should see UPDATE 1 as output
	```
	
	3. Then run "\q" to exit the db shell and your account should now have admin privileges.

# Demo Link
- https://youtu.be/LOMSEmPQ0sI

  
    
