# QuickGather - A Social Media Application for Event Planning

## Overview 
QuickGather is a social media app designed to simplify event planning with friends. Users can join/create a group by entering their mood, availability, budget, and preferred travel distance. 
The app then generates group ‘stats,’ providing individual and collective insights to help everyone find common ground and plan events more efficiently. 

https://quickgather-5069dcada862.herokuapp.com/

## Tech Stack
- Backend : Python (Flask), Gunicorn
- Frontend : React-Bootstrap, CSS
- Database and ORMs : PostgreSQL, SQLAlchemy
- Tools : AWS S3, RDS, Heroku


  

## Design & SQL Relationships
> In this section, I'll walk you through the Database Schema.

![alt text](DB.png)
- ### Strcuture
  - User
    - The User Table is a central component of the application's user management system. It stores essential authentication data including unique usernames and encrypted passwords, as well as contact information like email addresses. The table also maintains a link to each user's profile picture in the S3 object storage. Through its relationships with other tables, particularly the many-to-many association with the Blog table, it keeps track of the groups or blogs a user has joined.
  - Blog
    - The Blog table stores essential details about each group or blog created in the system. At its core, it captures the group's identity through a unique title, limited to 30 characters to ensure concise and manageable names. Accompanying the title is a more extensive description field, implemented as a Text type to accommodate detailed explanations of the group's purpose, guidelines, or any other relevant information. This description provides context and helps potential members understand the group's focus and objectives.
A key feature of the Blog table is its ability to maintain associations with users. Through a many-to-many relationship implemented via the user_channel association table, the Blog model can efficiently track all users who are members of or associated with each group. This relationship is bidirectional, allowing for easy querying of a group's members as well as the groups a particular user belongs to.
  - User_Chanel
      - This association table contains two primary columns: user_id and blog_id, which reference the respective ids in the User and Blog tables. By maintaining these connections, user_channel enables the system to efficiently track which users belong to which blogs and vice versa, without the need to modify the main User or Blog tables directly. This design allows for flexible membership management, where users can join multiple groups and groups can have multiple members, all managed through simple entries in the user_channel table. 
  - ChatMessage
    - The ChatMessage Table stores all communication within the application's group system. It captures and organizes each individual message sent in any group conversation. The table's structure includes fields for the actual message content, ensuring that all dialogue is preserved. It also stores a reference to the specific group (blog) where the message was posted, enabling efficient retrieval of conversations within each group context. The inclusion of a timestamp for each message allows for chronological ordering and time-based queries. Additionally, the table maintains a link to the user who authored each message, facilitating user-specific message tracking. This design enables the application to support robust group discussions and maintain conversation history.
  - User_info
    - The User_info Table functions stores information for group-specific user data within the application. It captures and maintains a set of dynamic attributes for each user that can vary depending on the group context. This table allows for the storage of user-specific information such as their current mood, budget constraints, relevant dates, and travel preferences, all of which may differ from one group to another. By linking user IDs with group IDs, the table creates a flexible structure where a single user can have distinct profiles or statuses across multiple groups. This design enables personalized user experiences within each group, supports targeted content delivery, and facilitates group-specific analytics.
## Extra Backend Details : 
> In this section, I'll walk you through the structure of the backend architecture and a detailed implementation of a few selected features.

I opted for Flask to develop my REST API backend interface. The primary reason for selecting this framework was its microservice architecture. I wanted to avoid the predefined backend structure typical of frameworks like Django.
My goal was to have the freedom to explore, learn, and gradually incorporate new features along with CRUD operations into the website as I progressed. I will discuss a few of the many features I implemented in the site along with the REST Api Architecture :

- ### Architecture 
    I chose to implement a microservice architecture using REST APIs with the flask_restx library. To structure the application, I divided the api namespaces into three primary categories:
    
    ```python
        api = Api(app, doc='/docs')
        api.add_namespace(blog_ns)
        api.add_namespace(auth_ns)
        api.add_namespace(user_ns)
    ```
    
    - blog: This namespace handles all operations related to groups, including creation, joining, deletion, and modification.
    - auth: Responsible for managing authentication requests, this namespace deals with user validation and account creation. It also deals with creating and refreshing access tokens/refresh tokens for user auth.
    - user: This namespace focuses on personal user details, such as modifying profiles and uploading profile pictures.
    

- ### Features (Some of them)
    - **Authentication for Login/Signup using Email Verification and JWT** :
      - User authentication was one of the first features I implemented after setting up the initial DB schema with SQLAlchemy. The initial User auth structure followed a very simple CRUD interface. The user would interact with the frontend form and send
        a POST request to the server after the form was validated in the frontend. The sign-up POST Request would check if the username already exist in the DB. We do this check by searching through imported User Table Model and query searching the username. If it exists,
        then it returns a jsonified message indicating that the username is already in use. If it does not exist, then we proccess the request and add the user details to the database.
      - After implementing the core authentication system, I focused on adding a preliminary email verification functionality for the sign-up feature. I utilized the flask_mail library, a wrapper for the SMTP library, which presented new learning opportunities and challenges. The primary obstacle I encountered
        was a circular import issue when trying to import the mail instance from main.py to auth.py. To resolve this, I created helper functions in main.py that were called within the process_signup function in auth.py, effectively preventing the circular import error.
        Once this was resolved, I successfully integrated both the mail and serializer instances. The resulting email verification system sends a serialized confirmation link to the user via email. The link is serialized in such a way that it contains the user signup information. When the user clicks this link, it triggers a request
        to the confirm_email function, which authenticates the token. If the token is valid, it's deserialized to extract the original signup request details, which are then sent as a POST request to the signup function. The sign-up function then stores the user
        details onto the DB and returns a response to the frontend.
      - Finally, I realized that the backend was taking too long (7-10 seconds) to process new sign-ups. During this time, users weren’t receiving any confirmation that they should check their email, leaving them stuck waiting after signing up. To address this,
        I decided to implement threading. I split the sign-up process into two parts: one to validate the credentials (e.g., checking if the username and email are valid), and the other to handle sending the verification email, authenticating it, and adding the user to the database.

        ```python
        #Note:
        #This is just a psudo implementation of what I did. Visit the repo for the code.
        
        def post(self):
            #Check if username exists or not
            db_user = User.query.filter_by(username=username).first()
            if db_user is not None:
                return {"message":"Username exists"}
    
            # Wrap the process_signup function with the current request context
            # Define the async function
            @copy_current_request_context
            def async_process_signup(data):
                process_signup(data)
    
            # Start the async process in a separate thread
            thread = Thread(target=async_process_signup, args=(data,))
            thread.start()
    
            return {"message": "Singup is being proccessed"}
        ```
        
    - **Chatting feature based on group number using SocketIO** :
      - The backend of the chatting feature was done using the flask_socketio library. I utlized multiple socket events to maintin the chat functionality. I have represented the psudocode of what takes place as I found it easier to explain it this way.
      - ```python
        #Note:
        #This is just a psudo implementation of what I did. Visit the repo for the code.

        # This event is triggered when a client joins a specific chat room.
        @socketio.on('join')
        def on_join(data):
          # Join the room so that it only broadcasts messages to this room upon connection.
          join_room(room)
        
          # Emit a join confirm event to the other end of the socket connection.
          emit('join_confirm', {'message':message}, room)
        
          # As soon the user joins a chat, all the previous chats should be visible.
          # Fetch all the messages in the room from the table 'ChatMessage' and emit it.
          messages = ChatMessage.get(room)
          emit('message_history', {'messages' : ['username': msg.user, 'msg': msg.message  for msg in messages]})


        # This event is triggered when a client leaves a specific chat room.
        @socketio.on('leave')
        def on_leave(data):
          # Leave the room so that it does not broadcasts message to the room anymore.
          leave(room)
        
          # Emit a leave confirm message to the other end of the event socket connection.
          emit('leave_confirm', {"message":message}, room)


        # This event is triggered when a client sends a message in a specific chat room.
        @socketio.on('message)
        def on_message(data):
          # When a message is sent we add a new message entry to the the DB.
          new_message = ChatMessage(user_id, blog_id, message)
          db.session.add(new_message)
          db.session.commit()
          
          # Broadcast the message to all clients in the room
          emit('message_confirm', {'msg': message_text, 'username': username}, room=room)
        ```
    
    - **Profile Pic Upload/Fetch by connecting to object Storage(S3)** :
      - I chose to store user profile pictures in S3 Object Storage to avoid cluttering the backend server. To do this, I set up an S3 bucket and added the necessary credentials to the .env file.
        I also uploaded a default profile picture to S3, which is stored as the default image path in the User table. After configuring an IAM user with read and write permissions, I connected the S3 bucket to the backend using the Boto3 library.
        This was done in the user namespace of the API interface. Whenever the user uploads a picture through the frontend interface, a post request is sent to the Upload function in the user namespace. The request contains a username and a file.
        The first thing is to check the validity of it. If it is not an image then we would not upload it to the bucket.
        
        ```python

          #Function to check the validity of the file.
          def allowed_file(filename):
              ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
              return '.' in filename and \
                     filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
        
        ```
        If the file passes the validation, it is uploaded to the S3 bucket, and the new file path from the bucket is saved to the database where user details are stored.
        
        ```python

          # Set up the IAM user config 
          s3 = boto3.client('s3', aws_access_key_id = config('AWS_ACCESS_KEY_ID'), aws_secret_access_key= config('AWS_SECRET_ACCESS_KEY'))

          def post(self):
            file = request.files['picture']
            user_name = request.form.get('user_name')

            # Initial check for the file code
            if file and allowed_file(file.filename):
                filename = user_name + secure_filename(file.filename)
                s3.upload_fileobj(file, config("S3_BUCKET"), filename)
    
                # Update user's profile picture in database
                user = User.query.filter_by(username=user_name).first()
                if user:
                    user.picture = f'https://{config("S3_BUCKET")}.s3.amazonaws.com/{filename}'
                    user.save()
        
        ```
    
    - **Date Algorithm to find and return a common date and time amongst Users in a Group** :
      - The primary objective of the date algorithm was to identify common dates and times among all the users in a group. The challenge was in differentiating between multiple dates available for each user and those of other users.
        In other words, instead of treating each date as an isolated instance, the algorithm needed to consider all the available dates for each user and find potential overlaps with the dates of other users, creating multiple combinations to determine the common availability.
      - We start by retrieving all the dates and duration entered by the users in the group and store them in a list. Each user entry retrieved is of the format `List[List[str, str]]` , where each inner list represents a date-time (yy:mm:dd:hh:mm) and the associated duration (hh:mm)
        for that specific day in a string format. The dates for each user is individually fetched from the database and stored in a list. This list of all the user entries (`List[List[List[str, str]]]`) are then passed on to the date-time algorithm to identify and return common dates.
      - The date-time algorithm leverages the `datetime` library. Given that dates and durations are stored in a `List[str, str]` format, we use the `datetime` and `timedelta` functions to convert these strings into workable date and duration objects. Thus we write down a few helper functions to do so.
        Using the helper functions, we generate a range for all the dates when a user is available by taking the input `List[List[date, duration]]` and converting it into `List[List[start_time, end_time]]`, where `start_time` represents the initial date, and `end_time` is calculated by
        adding the duration to the `start_time`.
        
        ```python
        
          # Converts an ISO date string to a Datetime object.
          def set_date(iso_date: str) -> datetime:
              return datetime.fromisoformat(iso_date)

          # Splits the the duration('hh:mm') into a list of ['hh', 'mm']
          def setHoursandMins(duration: str) -> List[int]:
              return [int(input) for input in duration.split(':')]
          
          # List[[List[date:str, duration:str]] -> List[List[start_time:datetime, end_time:datetime]]
          # Converts the list of strings into a list of time range. 
          def set_dates(user_dates: List[List[str]]):
              all_ranges = [
                  (set_date(other_user_dates[0]),
                      set_date(other_user_dates[0]) + timedelta(hours=setHoursandMins(other_user_dates[1])[0],
                                                                  minutes=setHoursandMins(other_user_dates[1])[1]))
                  for other_user_dates in user_dates
              ]
          
              return all_ranges
        
        ```
      - Next, we use our helper functions within the common_find algorithm to return a list of common dates and times. The common_find algorithm initializes an empty list called potential_dates that will store all the overlapping time ranges among all users. The algorithm first          iterates over each user's entries, and within that loop, it goes through each individual date and duration entry for that user. This step ensures that all possible time ranges for each user's date and duration are compared with those of every other user.
        Once we've filled in all possible ranges for a user's date, we compare them to find the latest start time and the earliest end time, determining the time range that works for a specific user date when compared to all other users' dates.
        After this process is repeated for all dates and potential_dates is populated, we generate a final list of date ranges to display. During this step, we convert the date-time data types into strings and remove any duplicate ranges.
        
        ```python
          def common_time(users_dates: List[List[List[str]]]) -> Optional[List[List[datetime]]]:
            potential_dates = []
        
            for i, user_dates in enumerate(users_dates):
                for j, date_time in enumerate(user_dates):
                    all_ranges = [
                        (set_date(other_user_dates[k][0]),
                         set_date(other_user_dates[k][0]) + timedelta(hours=setHoursandMins(other_user_dates[k][1])[0],
                                                                      minutes=setHoursandMins(other_user_dates[k][1])[1]))
                        for other_user_dates in users_dates
                        for k in range(len(other_user_dates))

                        # The if statement compares dates from other users and not the same user
                        if (other_user_dates != user_dates or k == j)
                    ]
        
                    if all_ranges:
                        latest_start = max(start for start, _ in all_ranges)
                        earliest_end = min(end for _, end in all_ranges)
        
                        # Check if there's a valid overlap
                        if latest_start < earliest_end:
                            potential_dates.append([latest_start, earliest_end])
        
            potential_dates_collect = []
            potential_dates_final = []
            # Removes Duplicates and creates new list of string time ranges
            for i in potential_dates:
                date_string = i[0].isoformat()+i[1].isoformat()
                if date_string not in potential_dates_collect:
                    potential_dates_final.append(i)
                    potential_dates_collect.append(date_string)
        
            return potential_dates_final
        ```

## Extra Frontend Details
> In this section I will covers the key components and external libraries used. I won't dive into the implementation details to keep the README from becoming too lengthy (ik it already is).

I chose React for the frontend to streamline development. This library reduces the need for extensive JavaScript coding while efficiently managing component updates based on data changes. React's advantages include improved state handling, faster development through JSX syntax, and performance optimization via the virtual DOM.

- ### Routes : Component
  - '/' : HomePage
  - '/Login' : Login
  - '/Signup' : Signup
  - '/createGroup' : CreateGroup
  - '/joinGroup' : JoinGroup
  - '/Profile' : Profile
  - '/Failure' : Failure
  - '/Success' : Success
    
- ### External Libraries/ Componenets Used
  - [React Bootstrap Library](https://react-bootstrap.netlify.app/) : 
    - Container, Rows, Columns : There were the react components from the React-Bootstrap Library that I used alot for styling most of the internal components in my application. These components were particularly helpful because I was already comfortable with Bootsap and, these 
      components use the same syntax as Bootstrap 5. Therefore it was easy to recreate a responsive design with the same syntaxes.
    - Modals: I found the modals component especially useful for implementing "pop-ups" in various features like chatting, updating blogs, and viewing user stats. They significantly streamlined my development process by eliminating the need to create separate components and routes for every minor feature.
    - Buttons: The Buttons component was preferred because it offered predefined styles and additional functionalities beyond what a standard HTML button provides.
    - Alerts : The Alerts component were used as small "pop-ups" to notify users about the success or failure of actions. An action for example would be a login request. The server's response would be parsed and displayed in these alerts to keep users informed on what happened.
    - Forms : The Forms component along with the useForm hook from the [React Hook Form Library](https://react-hook-form.com/) was arguably one of the most valuable component combination for me. The useForm hook provided extensive functionality that goes beyond what a standard HTML form provides. The combination of components exceled in several areas: it supports thorough error checking to ensure data integrity, enables easy design resetting to quickly revert to the initial form layout, and facilitates the registration and submission of form elements. 
  - [React Router Library](https://reactrouter.com/en/main):
    - This library had the neccesary components for routing in the application. We wrap the Router Component over the application and define all the routes through the Routes and Route component. 
  - [MUI Date Picker Library](https://mui.com/x/react-date-pickers/) : 
    This library provided the essential components that were used to provide the GUI for the date time selction while joining or creating a group.  



