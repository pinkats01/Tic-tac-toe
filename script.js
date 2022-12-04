








let Player = (sign) => {
   /*let playerSelector = document.querySelectorAll(".control");
   let player;
   let computer;

   playerSelector.forEach(selector => selector.addEventListener("click",(e)=> setPlayerSign(e)));

   function setPlayerSign(e){
      player= e.target.dataset.select;

      if(player === 'X'){
         computer= 'O';
      } else {computer= 'X'};
   }

   const getPlayerSign= ()=> player;
   const getComputerSign= ()=> computer;*/
   this.sign= sign;

   const getSign= ()=>{
      return sign;
   };

   return{getSign}
};

let gameBoardSetup= (() =>{
   
      let board = ["", "", "", "", "", "", "", "", ""];
      let draw= false;
      
      let boardInterface = document.querySelector(".game-board").querySelectorAll(".box");

      boardInterface.forEach(box =>box.addEventListener("click", (index)=> markFieldBackend(index)));

      const markFieldBackend= (index, sign)=>{
            if (index > board.length) return;
            board[index] = sign;
      };

      const getField= (index)=>{
         if (index > board.length) return;
         return board[index]
      }

      const resetBoard= ()=>{
         for(let i=0; i<board.length; i++){
            board[i] = '';
         }
      }

      return{markFieldBackend, getField, resetBoard}
})();

let displayController= (()=>{
      
   let roundMessage = document.getElementById("round-message");
   let playerSelector = document.querySelectorAll(".control");
   let preGameInterface = document.querySelector(".pre-game");
   let gameInterface = document.querySelector(".game");
   let boardInterface = document.querySelector(".game-board").querySelectorAll(".box");
   let restartBtn = document.querySelector(".restart-btn");
   let player;
   let computer;


   //event Binding

   //change Platform
   playerSelector.forEach(selector => selector.addEventListener("click",()=> {
      preGameInterface.classList.toggle('inactive');
      gameInterface.classList.toggle('inactive');
   }));
   //get player sign
   playerSelector.forEach(selector => selector.addEventListener("click",(e)=> {setPlayerSign(e)}));

   boardInterface.forEach(box =>box.addEventListener("click", (e)=> {  if( gameLogic.getIsOver() || e.target.textContent !== '') return;
                                                                       gameLogic.playRound(e.target.dataset.box);
                                                                       markField()}));

   restartBtn.addEventListener("click",()=> reset());
     
   const markField = () =>{
        for(let i=0; i < boardInterface.length; i++){
           boardInterface[i].textContent = gameBoardSetup.getField(i);
        }
   };

   const setRoundMessage= ()=> {
      roundMessage.textContent = `It's ${gameLogic.getCurrentPlayer()}'s Turn`
   }

   const setResultMessage= ()=>{
      roundMessage.textContent = `${gameLogic.getCurrentPlayer()} has Won !!!`;
   }
   
   const setDrawMessage= ()=>{
      roundMessage.textContent = "It's a Draw !!";
   }

   const resetMessage = ()=>{
      roundMessage.textContent = "It's Player's Turn" 
   }

   const setPlayerSign =(e) =>{
      player= e.target.dataset.select;
  
      if(player === 'X'){
         computer= 'O';
      } else {computer= 'X'};
   };

   const reset = ()=>{
      gameBoardSetup.resetBoard();
      gameLogic.reset();
      markField();
      resetMessage();
   }

     
   let getPlayerSign= ()=> { return player;}
   let getComputerSign= ()=> { return computer;}
  
   return {getPlayerSign, getComputerSign, setRoundMessage, setResultMessage, setDrawMessage}
})();


let gameLogic= (() => {
     let player;
     let computer;
     let round= 1;
     let isOver = false;

     function playRound(index){
        player= Player(displayController.getPlayerSign());
        computer= Player(displayController.getComputerSign());

        gameBoardSetup.markFieldBackend(index, getCurrentPlayerSign());

        if(checkWinner(Number(index))){
           displayController.setResultMessage();
           isOver = true;
           return;
        };
        if(round === 9){
           displayController.setDrawMessage();
           isOver = true;
           return;
        };
        
        round++;  
        displayController.setRoundMessage();
     }

     let getCurrentPlayerSign= ()=>{
         return round % 2 === 1 ? player.getSign() : computer.getSign();
     }
     
     const getCurrentPlayer= ()=>{
         if(getCurrentPlayerSign() === player.getSign()){
           return'Player'
         } else {
           return 'Computer'
         }
        }

     const checkWinner= (boxIndex)=> {
      const winCombinations= [
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

   const getIsOver = ()=>{
      return isOver;
   }

   const reset= ()=>{
      round = 1;
      isOver = false;
   }
   
   return{getCurrentPlayer, getCurrentPlayerSign, playRound, getIsOver, reset}
})();
