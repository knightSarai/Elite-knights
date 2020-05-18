# Elite-knights
training camp directory API's
Elite knights API Specifications
Create the backend for a sessions directory website. 
The frontend/UI will be created later (future work). 
All of the functionality below needs to be fully implemented in this project.
training camps
List all training camps in the database
Pagination
Select specific fields in result
Limit number of results
Filter by fields
Search training camps by radius from zip code.    
Use a geocoder to get exact location and coords from a single address field
Get single training camps
Create new training camps
Authenticated users only
Must have the role "trainer" or "manager"
Only one training camp per trainer(manager can create more)
Field validation via Mongoose
Upload a photo for training camp
Trainer only
Photo will be uploaded to local filesystem
Update training camp
Trainer only
Validation on update
Delete training camp
Trainer only
Calculate the average cost of all programs for a training camp
Calculate the average rating from the reviews for a training camp
Programmes 
List all programs for training camp
List all programs in general
Pagination, filtering, etc
Get single program
Create new program
Authenticated users only
Must have the role "trainer" or "manager"
Only the owner or an manager can create a program for a training camp
Trainer can create multiple programs.
Update program
Owner only
Delete program
Owner only
Reviews
List all reviews for a training camp
List all reviews in general
Pagination, filtering, etc
Get a single review
Create a review
Authenticated users only
Must have the role "user" or "admin" (no trainer)
Update review
Owner only
Delete review
Owner only
Users & Authentication
Authentication will be done using JWT/cookies
JWT and cookie should expire in 30 days
User registration
Register as a "user" or "trainer"
Once registered, a token will be sent along with a cookie (token = xxx)
Passwords must be hashed
User login
User can login with email and password
Plain text password will compare with stored hashed password
Once logged in, a token will be sent along with a cookie (token = xxx)
User logout
Cookie will be sent to set token = none
Get user
Route to get the currently logged in user (via token)
Password reset (lost password)
User can request to reset password
A hashed token will be emailed to the users registered email address
A put request can be made to the generated url to reset password
The token will expire after 10 minutes
Update user info
Authenticated user only
Separate route to update password
User CRUD
Admin only
Users can only be made admin by updating the database field manually

