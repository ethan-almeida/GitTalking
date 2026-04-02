**DESIGN REPORT**


**Architecture**

The app is built using the NextJS App Router.

**Frontend**: React Server Components was used to fetch data directly in the components.
**Backend**: Server Actions was used for creating posts, voting on posts, and uploading screenshots. This aims to keep aspects such as the sensitive logic on the server itself which makes form handling easier.
**Modular design**: The app is divided into multiple routes such as "app/" or reusable UI components such as "components/" or logic such as "lib/". This makes it easy to develop the project and debug any issues if they arise. 

**Database Used**

PostgreSQL was used as the database system for this project. I picked this specific database system because the posting and replies aspect of this project is quite relational. It allows us to enforce them and also helps maintain some form of data integrity.
I did consider using NoSQL but then realized it would be complex to manage the nested replies feature in this project.

**API Implementation**

In Git Talking, I use the Server Actions Feature on Next.JS. So instead of having the traditional REST API approach, I defined actions such as creating a post, creating a reply, voting and creating a channel in actions.ts (very aptly named). In addition to this, I used the pg driver for Postgres which eliminates the need for any additional interface to connect to the database.


**Screenshots and other Packages** 

In this project, I have a 5 MB upload limit for attachments that include PNG, JPEG, JPG, and GIF files. These files are saved to the "public/uploads" directory. I also used libraries such as bcrypt, jose for hashing user passwords, and creation as well as verification of session cookies to authenticate. 



