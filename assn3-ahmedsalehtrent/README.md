For this assignment you are going to build a React Front-end to make use of your API from assignment #2. Due to the remaining time in the semester, and the fact that I know everyone is very busy, you are not required to complete front-end interfaces for all the endpoints you completed in assignment #2. Below I've provided an minimal set of required functionality. The architecture/functionality choices you make are part of the process, so rather then listing requirements I've provided a simple set of user stories that identify things I'd "like" to do with your app. You can complete additional functionality (things you'd like to be able to do) for bonus marks (up to 15% of the assignment total), and have a more comprehensive app at the end if you want to use it as a portfolio piece.

Partner Work
To start off, just a quick reminder that you can choose to work on this assignment with a partner (like with A2, I strongly encourage this to give due to time constraints involved in the end of the semester). Choose one Git repo to work out of (and the owner of the repo should invite the other person to collab). Whoever's repo you choose to use should necessary links on Blackboard, letting me know the repo to mark and where to access it on Loki, you must also include the name of your partner. The other person should just submit the name of their partner.

Extensions
As I mentioned in class, due to the exam being on Day 1 (which influences when my marks must be sent to the Dean's Office), I have no flexibility regarding extensions for this assignment. I know everyone is busy, but please use your time wisely and do not count on being able to get an extension if you don't finish by due date. The final day the assignment can be submitted, even with late penalty, is Dec 8th. Please also be aware that I will be mostly out of contact on the 7th and 8th.

Authentication
This application should have a login page that is separate from the page you created in A2, and is instead part of your react front-end. It will use the auth endpoint you created to retrieve the API key based on the user's username and password.

Your API key should be stored globally using useContext (and like with php, if the context does not exist, you should redirect to the login page)

Even with useContext, you will still lose your logged in status if you refresh the page. That is expected behaviour for the assignment given what we've covered, so I don't expect you to attempt to resolve it.

In reality this might be solved with WebTokens, or OAuth. But could in theory also be solved with things you already know. You could use either PHP or JavaScript to put the API key in a cookie, and use JS to check for (and read) the cookie before redirecting to the login page.

A Note About the Movie List
From a UX perspective, you don't really want to show the user 4000 movies all at once.
You can include some sort of pagination as an additional feature, or you can simply limit the number of movies that your /movies end point returns so that you just have a smaller set of movies in your app.
If you didn't already, you may also want to limit that api to only returning a couple of columns rather then everything. That main page is probably only going to display titles and posters and maybe a rating or something (the user would go to an individual movie page to see all the details). You don't have to return everything if you aren't going to use it.
A Couple of Technical Requirements
Make sure to exclude your react build folder from syncing to Loki. (You could choose to work entirely outside the courses directory structure for the build part of this assignment)
You can use the API in your A2 folder (you don't need to copy it into A3)
You are building an Single Page Application and should use React Router for all necessary routing. You should have separate routes for different views. You should also use path variables and url parameters as part of your routes where appropriate.
Keep in mind that React Router isn't installed by default when you use Vite to make a react app. You will need to npm install it (see lecture notes for details)
You must build and deploy your finished application to Loki when your done.
This has not gone flawlessly for everyone in the past, so don't wait until 11:30pm on the due date to try.
You will need to add a CORS header to your JSON responses in your API from A2 (if you don't have it there already) in order to be able to make API requests from your local app. You can see an example of this in the API I provided you for Lab 8. You'll also need an OPTIONS endpoint in your api index file to handle pre-flight requests (see the API lecture notes for details)
It is fine to make additional changes to your API end points if it suits your needs
Minimal Requirements
Reminder: The architecture/functionality choices you make are part of the process (and grade), so rather then listing requirements I've provided a simple set of user stories that identify things I'd "like" to do with your app. You can complete additional functionality (things you'd like to be able to do) for bonus marks (up to 15% of the assignment total), and have a more comprehensive app at the end if you want to use it as a portfolio piece.

User Stories
I want to be able to see all the movies in the catalogue
I want to be able to find more detailed information about a movie
I want to have at least one way to filter the movies in the catalog
i.e Maybe I want to find similar movies (i.e. "other romances", "other movies by Ghibli")
I want be able to search for a specific movie
I want to "quick add" a movie to my plan-to-watch list from the main page, with no notes and a default priority
I want to see all the movies on my watch list sorted by priority
I want to be able to update the priority of a movie on my watchlist
I want be able to mark a movie as watched once I've seen it (which should remove it from my watch list and place it on the completed list)
I want to be able to add a score onto a movie that I've seen (either when moving it to completed or later)
I want to be able to see all my finished movies sorted by score or date watched (developers choice)
I want to be able to update the number of times I've watched a movie on my completed list if I've watched it again.
I want to be able to remove things from my planning list even if I don't end up watching it (e.g., I added the wrong one, or I changed my mind, etc)
I want to have a pleasant user experience when using your application
Anything beyond this would be considered extra and contribute to bonus marks. What would you like your application to do?