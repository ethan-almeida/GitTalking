| Test ID | Feature | Steps to Reproduce | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **User Sign Up** | 1. Navigate to `/signup`.<br>2. Enter Display Name, Email, and Password.<br>3. Click "Sign Up". | User is redirected to Home page. Navbar shows the new Display Name. | **PASS** |
| **2** | **User Login** | 1. Navigate to `/login`.<br>2. Enter valid credentials.<br>3. Click "Log In". | User is redirected to Home page. Session is active. | **PASS** |
| **3** | **Create Channel** | 1. Log in.<br>2. Enter Channel Name on Home page form.<br>3. Click "Create Channel". | New channel appears immediately in the Channel list. | **PASS** |
| **4** | **Create Post** | 1. Select a Channel.<br>2. Fill out Title and Body.<br>3. Click "Post Question". | New post appears at the top of the Post list. | **PASS** |
| **5** | **Nested Reply** | 1. Click on a Post.<br>2. Click "Reply" on the main post.<br>3. Submit text.<br>4. Click "Reply" on that new reply. | Replies are indented correctly, forming a threaded tree view. | **PASS** |
| **6** | **Image Upload** | 1. Create a Post or Reply.<br>2. Select a valid PNG/JPG image (< 5MB) using the file input.<br>3. Submit. | Image appears in the post/reply and opens in a modal when clicked. | **PASS** |
| **7** | **Voting Logic** | 1. Click Upvote on a Post.<br>2. Click Upvote again. | Score increases by 1 on first click. Score returns to 0 on second click (neutral). | **PASS** |
| **8** | **Search Functionality** | 1. Navigate to `/search`.<br>2. Enter a keyword from a post title.<br>3. Submit. | Results display the relevant post. Statistics (Top Poster) are visible. | **PASS** |
| **9** | **Admin Moderation** | 1. Log in as Admin.<br>2. Navigate to `/admin`.<br>3. Click "Delete" on a Channel. | A confirmation prompt appears. Upon confirm, the Channel is removed from the database. | **PASS** |
| **10** | **Access Control** | 1. Log out.<br>2. Attempt to access `/admin` URL directly. | User is redirected to Home (Access Denied). "Log in to reply" prompt is shown on posts. | **PASS** |


