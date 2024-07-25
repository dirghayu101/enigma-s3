# Things to be done for final presentation:
- Tagging algorithm working from the user interface.
    - Should be able to create a new snippet.
    - Should be able to update/overwrite an existing snippet. -> Add new tags? Modify summary? -> Delete tags?
- Search should be working from the user interface.





Task: Authentication & authorization setup: - Login, Signup and other user functionalities.
- Authentication requires a fully functional website. It is troublesome to have a partially working website setup with user authentication & authorization.



# Work that needs to be done in the frontend:
- End goal: I should be able to login and sign-up my user. Then I should be able to pass some authentication to a sample lambda function. I should be able to figure out how to verify the token and all of that. For every page I load, I should be able to retrieve the authentication token.


# Plan to reach the end goal:
1. Verify that the authentication and authorization functionality is working properly throughout your backend. Test it with signing in new users and experimenting there. Write a test lambda and try to integrate that to see if the token is passing properly and whether if it is getting verified by cognito. Get response from that test lambda on the user side after the token getting authorized by cognito middleware.

Note: Test it with test lambda, search and tagging are too complicated.

2. Fix tagging algorithm. It should be integrating well on the user side.


Last:
3. Fix search algorithm. It should be working well on the user side.

4. Finish.



Task: Verify that the authentication and authorization functionality is working properly throughout your backend. Test it with signing in new users and experimenting there. Write a test lambda and try to integrate that to see if the token is passing properly and whether if it is getting verified by cognito. Get response from that test lambda on the user side after the token getting authorized by cognito middleware.

# To do:
- Test search algo with only one user in the database and 10 snippets.
- In the insertsnip page, add validations for tag.
- S3 verification of login flow functionality with cognito.