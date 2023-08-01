# Blood on the Clocktower Bot -- To-do List

## Overview 

- Here you will find all features to be added as well as bug-fixes to be made to existing features. 
- You may contribute on such features provided you follow Project's as well as Github's `Code of Conduct`.
- Also, it is recommended that you mention in your pull request exactly what changes you have made, if it solves any bugs or adds any features (as listed below) in order to ensure that your work gets properly integrated with the code. 
- If you discover any bug fixes or glitches during operation of this bot which has not been listed here, do not hesitate to let us know! Either through discord, email or contacting through github directly. 

## Development Improvements

### Improvements to Nomination Timer 
- Force ending day must disable use of day-time command. 
- Nominations should not be possible once day ends whether forcefully or normally.
- observe the behaviour of nomination timer logic; when bot restarts, during operation and a new nomination.
-  Check nomination timer logic, what it does when bot off and comes back, and ongoing still on,
or if new nomination started

### Automatic Removal of Roles After Game ends
- remove all game-related roles of players such as `playing`, `town-square` or `room-specific` roles.  

### Channel Archives
- Add a fixed limit of `50` to limit number of channels created to not cross `50`.
- Add `/check-limit` to make sure how many channels can be created before limit is reached.
- Introduce automatic archiving of channels, e.g., when game ends. 

### Miscellaneous
- Be able to see `Daytime Remaining` as well as `Day <number>` (which In-game day it is when command is run) in `/room-history`.
- Beautify `/time-left` command. 
- slash command to manually insert values to `Nominations Table`.
- Send a message when the last nomination is taking place (last nomination may be calculated by using conditionals on `time-remaining`).


## Gameplay features

### Rock Paper Scissors
- `Rock Paper Scissors` slash command, may be represented as `/rps`. Enables users to perform `Rock Paper Scissors` between two players. 
- Multiple users may initiate `rock paper scissors` at same time, However, only `two` users are allowed per round. 

### Status of Active Rooms
- By the use of a slash command, be able to see which users are actively participating in rooms. 
- It should also highlight which players are in each room.

### Execution Status 
- when an execution occurs, bot should change its status to display which player is being executed.

### Night Time Remaining
- By using a slash command, e.g., `/night-time`, display time remaining till night ends.
- or merge it with `/time-remaining` so that, it will display daytime during day and vice versa.

### Vote Skip
- By use of slash command, e.g., `/vote-skip`, a player can skip voting for that particular day.

## Bugs & Glitches

- Bot gives `Town Square` role to itself when game begins or `Town Square` role is given to everyone on the server.
- Rooms transfer occuring twice, possibly due to code running a second time. Room transfer sometimes fails due to occuring twice.
- `/leave-room` is prone to bugging out.
- `/room-history` is prone to bugging out.
- `/create-rooms` bugs out after crossing a specific limit of rooms created `approx. 50`.
- `rooms creation` occuring too fast, may lead to rate limitations.
- `Rapid Room Creation` leads to no one being able to vote.