# Kulki
I created this remake as a high school project. It's developed in plain TypeScript.
## About Kulki
"Kulki" (ang. "Balls") is a Polish single player logic game. The objective of the game is to remove the titular colored balls from a 9x9 grid. The balls are removed when a row of five or more balls of the same color is formed horizontally, vertically, or diagonally. In each move, three new balls appear randomly on the grid. The color and placement of the new balls are also random. New balls do not appear after a move that results in the removal of a row of balls. The game ends when all the grid spaces are filled with balls and no more moves can be made.
## Installation and launch tutorial
1. Open git bash and run `git clone https://github.com/lythx/kulki.git` OR go to the [project main page](https://github.com/lythx/kulki), click the green button that says "Code", then click "Download ZIP" and extract the downloaded directory.
2. Install [Node](https://nodejs.org) (needed for npm).
3. Open Command Prompt and run `npm install -g typescript` to install TypeScript.
4. Go into the main project directory and run `npx tsc` to build the project.
5. Run the index.html file from the main directory on a local server.  
    EXAMPLE SIMPLE LOCAL SERVER USING VSCODE: 
    - Drag the directory into [Visual Studio Code](https://code.visualstudio.com) 
    - Download the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 
    - Hit ctrl+shift+p, select `>Live Server: Change Live Server workspace` and choose `kulki`  
    - Hit ctrl+shift+p again, select `>Live Server: Open with Live Server`
    - Click the following link: http://localhost:5500
## Screenshots
![1](https://cdn.discordapp.com/attachments/522878388269088782/1099729048059523163/1.png)  

![2](https://cdn.discordapp.com/attachments/522878388269088782/1099729048340533302/2.png)  

![3](https://cdn.discordapp.com/attachments/522878388269088782/1099729047078047844/3.png)  

![4](https://cdn.discordapp.com/attachments/522878388269088782/1099729047363268709/4.png)  

![5](https://cdn.discordapp.com/attachments/522878388269088782/1099742251673997422/5.png)
