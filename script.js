
let Player = (sign) => {
   this.sign = sign;

   const getSign = () => {
      return sign;
   };

   return { getSign }
};

let gameBoardSetup = (() => {
   let board = ["", "", "", "", "", "", "", "", ""];

   let boardInterface = document.querySelector(".game-board").querySelectorAll(".box");

   boardInterface.forEach(box => box.addEventListener("click", (index) => markFieldBackend(index)));

   const markFieldBackend = (index, sign) => {
      if (index > board.length) return;
      board[index] = sign;
   };

   const getField = (index) => {
      if (index > board.length) return;
      return board[index]
   }

   const resetBoard = () => {
      for (let i = 0; i < board.length; i++) {
         board[i] = '';
      }
   }

   const getCurrentBoard = () => {
      /*for(i=0; i<=board.length; i++){

      }*/
      return board;
   }

   return { markFieldBackend, getField, resetBoard, getCurrentBoard }
})();

let displayController = (() => {
   let roundMessage = document.getElementById("round-message");
   let playerSelector = document.querySelectorAll(".control");
   let preGameInterface = document.querySelector(".pre-game");
   let gameInterface = document.querySelector(".game");
   let dropdown = document.querySelector('.dropdown');
   let boardInterface = document.querySelector(".game-board").querySelectorAll(".box");
   let restartBtn = document.querySelector(".restart-btn");
   let player;
   let computer;
   let currentMode= 'easyMode';
   let gameModeIndicator = document.getElementById("game-mode");
   //mode selection variables
   let multiplayer = document.getElementById("multiplayer");
   let easyMode = document.getElementById("easy-mode");
   //let hardMode = document.getElementById("hard-mode");

   

   //event Binding
   //change Platform
   playerSelector.forEach(selector => selector.addEventListener("click", () => {
      preGameInterface.classList.toggle('inactive');
      gameInterface.classList.toggle('inactive');
      dropdown.classList.remove('inactive');
   }));
   //get player sign
   playerSelector.forEach(selector => selector.addEventListener("click", (e) => { setPlayerSign(e) }));
   //mark field, play a round, check if the game is over  
   boardInterface.forEach(box => box.addEventListener("click", (e) => { if(gameLogic.getIsOver() || e.target.textContent !== '') return;
                                                                        if(currentMode === 'easyMode'){
                                                                           gameLogic.easyMode(e.target.dataset.box);
                                                                        }else if(currentMode === 'multiplayer'){
                                                                           gameLogic.multiplayerMode(e.target.dataset.box);
                                                                        }
                                                                        markField();
                                                                      }));

  multiplayer.addEventListener("click",()=> {  currentMode='multiplayer';
                                               reset();
                                               gameModeIndicator.textContent= 'Multiplayer';});
   easyMode.addEventListener("click", ()=> { currentMode='easyMode';
                                             reset();
                                             gameModeIndicator.textContent= 'Easy Mode';});
   //hardMode.addEventListener("click", hardMode);

   //restart button logic
   restartBtn.addEventListener("click", () => reset());

   const markField = () => {
      for (let i = 0; i < boardInterface.length; i++) {
         boardInterface[i].textContent = gameBoardSetup.getField(i);
      }
   };

   //Setting game messages
   const setRoundMessage = () => {
      roundMessage.textContent = `It's ${gameLogic.getCurrentPlayer()}'s Turn`;
      console.log(gameLogic.getCurrentPlayer())
   }

   const setWinningMessage = () => {
      roundMessage.textContent = `${gameLogic.getCurrentPlayer()} has Won !!!`;
   }

   const setDrawMessage = () => {
      roundMessage.textContent = "It's a Draw !!";
   }

   const resetMessage = () => {
      if(currentMode ==='multiplayer'){
         roundMessage.textContent = "It's Player1's Turn"
      }else if(currentMode ==='easyMode'){
         roundMessage.textContent = "It's Player's Turn"
      }
   }

   //Setting players signs
   const setPlayerSign = (e) => {
      player = e.target.dataset.select;
      if (player === 'X') {
         computer = 'O';
      } else { computer = 'X' };
   }

   const reset = () => {
      gameBoardSetup.resetBoard();
      gameLogic.reset();
      markField();
      resetMessage();
   }

   //Getting players signs
   let getPlayerSign = () => { return player; }
   let getComputerSign = () => { return computer; }

   let getCurrentMode = () => {return currentMode}

   return { getPlayerSign, getComputerSign, setRoundMessage, setWinningMessage, setDrawMessage, getCurrentMode }
})();


   let gameLogic = (() => {
      let currentPlayer;
      let player;
      let computer;
      let round = 1;
      let isOver = false;
      
      let getCurrentPlayer= ()=>{
         return currentPlayer;
      }

      let getCurrentPlayerSign = () => {
         if (currentPlayer === 'Player') {
            return player.getSign();
         } else {
            return computer.getSign();
         }
      }

   function multiplayerMode(index){
      currentPlayer= 'Player1'
      //checking if it's the player round or computer round
      let getCurrentPlayerSign = () => {
         return round % 2 === 1 ? player.getSign() : computer.getSign();
      }
      //Setting the current player for the round message
      //reversed the current player, because the round doesn't change until i click a cell, which results in unaccurate current player
      let getCurrentPlayer = () => {
         //return round % 2 === 1 ? currentPlayer='Player1' : currentPlayer='Player2';
         return round % 2 === 1 ? currentPlayer='Player2' : currentPlayer='Player1';
      }

      function play(index) {
         //getting the players signs, and setting them up
         player1 = Player(displayController.getPlayerSign());
         player2 = Player(displayController.getComputerSign());
         gameBoardSetup.markFieldBackend(index, getCurrentPlayerSign());
         

         //checking for winning cases every round
         if (checkWinner(Number(index))) {
            displayController.setWinningMessage();
            isOver = true;
            return;
         };
         if (round === 9) {
            displayController.setDrawMessage();
            isOver = true;
            return;
         };
         round++;
         displayController.setRoundMessage();
        }
         getCurrentPlayer();
         play(index);
  
      }

   function easyMode(index){

      const play = (index) =>{
         currentPlayer = 'Player';
         //getting the players signs, and setting them up
         player = Player(displayController.getPlayerSign());
         computer = Player(displayController.getComputerSign());
         gameBoardSetup.markFieldBackend(index, getCurrentPlayerSign());

         //checking for winning cases every round
         if (checkWinner(Number(index))) {
            displayController.setWinningMessage();
            isOver = true;
            return;
         };
         if (round === 9) {
            displayController.setDrawMessage();
            isOver = true;
            return;
         };
         round++;
         displayController.setRoundMessage();
         computerPlay(); 
      }

      //computer play logic
   const computerPlay = () => {
      currentPlayer = 'Computer';
      let boardReplica = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      let currentBoard = gameBoardSetup.getCurrentBoard();
      let emptyCells = [];
      //make a board replica
      for (i = 0; i < currentBoard.length; i++) {
         if (currentBoard[i] === '') continue;
         boardReplica[i] = currentBoard[i];
      }
      //get the empty cells indexes from the board
      for (i = 0; i < boardReplica.length; i++) {
         if (boardReplica[i] !== "X" && boardReplica[i] !== "O") {
            emptyCells.push(boardReplica[i]);
         }
      }
      //choose a random empty cell
      let randomCell = Math.floor(Math.random() * emptyCells.length);
      //mark the chosen random cell in the backend
      gameBoardSetup.markFieldBackend(emptyCells[randomCell], getCurrentPlayerSign());

      if (checkWinner(emptyCells[randomCell])) {
         displayController.setWinningMessage();
         isOver = true;
         return;
      };
      //checking if it's the player round or computer round
      if (round === 9) {
         displayController.setDrawMessage();
         isOver = true;
         return;
      };
      round++;
      currentPlayer = 'Player';
      displayController.setRoundMessage();
      }

      let getCurrentPlayerSign = () => {
         if (currentPlayer === 'Player') {
            return player.getSign();
         } else {
            return computer.getSign();
         }
      }
      //Setting the current player
      let getCurrentPlayer = () => {
         return currentPlayer;
         }
         
         play(index);
   }

      
      
   //check for winning function
   const checkWinner = (boxIndex) => {
      const winCombinations = [
         [0, 1, 2],
         [3, 4, 5],
         [6, 7, 8],
         [0, 3, 6],
         [1, 4, 7],
         [2, 5, 8],
         [0, 4, 8],
         [2, 4, 6],
      ];
      return winCombinations
         .filter((combination) => combination.includes(boxIndex))
         .some((possibleCombination) =>
            possibleCombination.every(
               (index) => gameBoardSetup.getField(index) === getCurrentPlayerSign()
            )
         )
   }

   const getIsOver = () => {
      return isOver;
   }

   const reset = () => {
      round = 1;
      isOver = false;
   }

   return {getCurrentPlayer, getCurrentPlayerSign, multiplayerMode, easyMode, getIsOver, reset}
})();




