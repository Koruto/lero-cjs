# Blood on the Clocktower Bot -- To-do List

## Overview 

- Here you will find all features to be added as well as bug-fixes to be made to existing features. 
- You may contribute on such features provided you follow Project's as well as Github's `Code of Conduct`
- Also, it is recommended that you mention in your pull request exactly what changes you have made, if it solves any bugs or adds any features (as listed below) in order to ensure that your work gets properly integrated with the code. 
- If you discover any bug fixes or glitches during operation of this bot which has not been listed here, do not hesitate to let us know! Either through discord, email or simply a comment on this repository. 

## Development Improvements

### Improvements to Nomination Timer 
- Force ending day must disable use of day-time command. 
- Nominations should not be possible once day ends whether forcefully or normally.

### Automatic Removal of Roles After Game ends
- remove all game-related roles of players such as `playing`, `town-square` or `room-specific` roles.  

## Gameplay features

### Rock Paper Scissors
- `Rock Paper Scissors` slash command, may be represented as `/rps`. Enables users to perform `Rock Paper Scissors` between two players. 
- Multiple users may initiate `rock paper scissors` at same time, However, only `two` users are allowed per round. 

### Room Status slash command
- By the use of a slash command, be able to see which users are actively participating in rooms. 
- It should also highlight which players are in each room.

### Execution Status 
- when an execution occurs, bot should change its status to display which player is being executed

## Bugs & Glitches

- Bot gives `Town Square` role to itself when game begins or `Town Square` role is given to everyone on the server.
- Rooms transfer occuring twice, possibly due to code running a second time. Room transfer sometimes fails due to occuring twice.
- `/leave-room` is prone to bugging out.
- `/room-history` is prone to bugging out.
- `/create-rooms` bugs out after crossing a specific limit of rooms created `approx. 50`.
- `rooms creation` occuring too fast, may lead to rate limitations.
- `Rapid Room Creation` leads to no one being able to vote 