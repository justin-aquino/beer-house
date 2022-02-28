# Beer House
GA- SEI Project 2
## Why I chose this project.
For my second GA Project, I decided to build a fullstack app that tracks the artisan beers the user has tried. The inspiration behind the app goes back to my experience as a chef where after every busy shift, employees share a few pints of beer while cleaning the kitchen to reward ourselves for our hard work. 

# Routes

| Method | Path | Purpose |
| ------ | -------------- | -------------------------------- |
| GET | / | Landing Page | Shows a carousel of beer photos, and about page.
| POST | /SignUp | Sign up page and redirect to login page. |
| POST | /Login | login page and redirect to tracker page. |
| GET | /user | displays the user's dashboard , username, email, password.  |
| GET | /user/tracker | shows the user's tracker list |
| GET | /user/tracker/:id | shows the user's tracked beer details |
| GET | /beer | display beer list, including search bar and function |
| GET | /beer/:id | shows untracked beer's details |
| POST | /user/tracker/new | form to add a new beer in the beer tracker list.|
| PUT | /user/tracker/:id/update | Updates the chosen beer. |

## As a user, I want to be able to:
1. Search different beers and read their description.
2. Track the beer I have tried and rate them.
3. Rate/ make a review of the beer that I tried.

## MVP 
1. Fetch from punk api.
2. Display and search data.
3. Add beer to tracker list.
    In the tracker list:
        a. Form to add beer that is not in the api.
        b. Delete a beer from the list.
        c. Update the added beer.
4. In show.ejs, render the following:
        a. name
        b. manufacturer
        c. type
        d. user review
        e. rating
5. Sign up, Log in where user can only access their own beer tracker.

## STRETCH GOALS
1. Be able to write and post comments about the reviews the users make.
2. Make a trending beer page where you can upvote and downvote beers.



## ERDS

![An ERD of my project](./ERD.drawio.png)

## WIREFRAME 
![Landing Page](./wireframes/landing.jpeg)
![Other Pages Wireframe](./wireframes/wf2.jpeg)

## TECH STACK AND API:
> I plan on using Express, Node, Postgresql, EJS, Bootstrap/ Other CSS Frameworks to build the app, and Punk API for the beer database.