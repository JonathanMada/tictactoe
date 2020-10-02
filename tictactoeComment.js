var onTictactoe = new tictactoe();
// onTictactoe.myHandler;

function tictactoe () {
  const myImage = ["url('image/cross.png')", "url('image/circle.png')"];
  const playerOne = new ThePlayer(myImage[0]);
  const playerTwo = new ThePlayer(myImage[1]);
  this.myHandler = new TheHandler(playerOne, playerTwo);
}

function TheHandler (playerOne, playerTwo) {

  // We initiate the board
  let theBoard =  new TheBoard(playerOne, playerTwo)

  // Reassigning the nodes to variables
  let myPopup = document.getElementById("popup-1");
  let myStart = document.getElementById('inplay');
  let myNames = document.querySelector(".myname");

  // Initializing the App
  myPopup.classList.add("active");
  replay ();

  // This starts the App and enters the names
  myStart.addEventListener('click', function(){
    myPopup.classList.remove("active");
    myNames.firstElementChild.innerHTML = "<span id='myturn'>Nothing</span> make your move"

    // Collect the names
    let nameOne = document.getElementById("player_1").value;
    let nameTwo = document.getElementById("player_2").value;
    var players = [nameOne, nameTwo];
    // Randomize the turn
    playerOne.name = players[Math.floor(Math.random() * players.length)];
    playerTwo.name = (playerOne.name === players[0]) ? players[1] : players[0]

    // We change the name to the one that gets to start
    // We call the function clicker of the board to make it interactive
    document.querySelector("#myturn").textContent = playerOne.name;
    theBoard.trigger();
    })
}

function TheBoard (playerOne, playerTwo) {
  // This are the cells on the board
  const theCells = ["#one", "#two", "#three",
                  "#four", "#five", "#six",
                  "#seven", "#eight", "#nine"];
  // This are the winning combination possible
  const winCombo = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];
  let runIt = true;

  // this method gets activated once called
  // this function is local, so we cannot affect the global value
  // But we can use and access there values
  this.trigger = function () {
      let inPlayerOne = playerOne; // Here we reassign the player 1 values
      let inPlayerTwo = playerTwo; // Here we reassign the player 2 values
      let myTurn = true; // This helps us to alternate the turn between the players
      let image = inPlayerOne.image; // This sets the background of each cell && We always start with the player one
      let tieCond = []; // This gathers which cells have been marked

      // set the event for each cells
      for (let cell of theCells) {

        // here we add an addEventListener to each cells
        // changes the background Image (style)
        let myCell = document.querySelector(cell);
        myCell.addEventListener("click", function () {
          if (myCell.style.backgroundImage == "") {
            myCell.style.backgroundImage = image; // For each cell that has been clicked it gets a new background
            tieCond.push(cell) // This pushes the cells that have been marked to tieCond
            console.log("overall move " + tieCond)
          }
        })

        // This MutationObserver observe:
        // The change for each cells
        // When it gets a new background the mutation is observed and this function activates
        const observer = new MutationObserver(mutations => {

          // This calls the function that verifies if all cell are without backgroundImage
          let EmptyOn = checkingEmpty();

          // This turns into false when we have a winner or a tie
          // we need to verify if someone won
          // we need to verify also if there is a tie
          if (runIt === true) {

            // this is the function we call once we observe a mutation in the DOM
            mutation = myMutation(cell, image, myTurn, theCells, inPlayerOne, inPlayerTwo);

            // here we assign the new value gotten from the mutation
            // these are all the initial values
            // we need to reassign them with destructuring assignment
            [myTurn, image, cell, inPlayerOne, inPlayerTwo, currentPlayer, sortedMove] = mutation;

            console.log(currentPlayer.name + " moves: " + sortedMove);

            // The win checker starts here, try to change it as a function
            let checker = (arr, target) => target.every(v => arr.includes(v));

            // Here starts the comparison
            for (let winCond of winCombo) {

              // WIN COND - This checks if the current player has a winning combo
              if (checker(sortedMove, winCond) === true && EmptyOn !== true) {
                theWinner(currentPlayer) // This is also triggering the mutation
                runIt = false;
              }

              // TIE COND - This takes care of the tie condition
              else if (tieCond.length === 9 && checker(sortedMove, winCond) !== true){
                theTie(); // This is also triggering the mutation
                runIt = false;
              }

              // RESTART - this checks if we have restared of not
              else if (EmptyOn === true) {
                // we reinitialize everything
                tieCond = [];
                inPlayerOne.move = [];
                inPlayerTwo.move = [];
                console.log("Got restarted");
              }

            }
            console.log(myTurn)
          }

          // This checks to replay the game, empty the cells without reinitializing everything
          else if (EmptyOn === true && runIt === false) {
            runIt = true;
            myTurn = true;
          }
        })

        // MutationObserver Parameter settings
        observer.observe(myCell, { attributes : true, attributeFilter: ["style"]})
      }
    }
}

function myMutation(cell, image, turn, cells, playerOne, playerTwo) {
  turn = !turn;
  image = (turn === true) ? playerOne.image : playerTwo.image;
  let myturn = document.querySelector('#myturn');
  myturn.textContent = (turn === true) ? playerOne.name : playerTwo.name;
  let currentPlayer = (turn === true) ? playerTwo : playerOne;
  let move = cells.indexOf(cell);
  currentPlayer.move.push(move);
  let sortedMove = currentPlayer.move.sort((a, b) => a - b);
  return [turn, image, cell, playerOne, playerTwo, currentPlayer, sortedMove];
}

function ThePlayer (image) {
  this.name = undefined;
  this.image = image;
  this.move = [];
}

function theWinner(player) {
  // the modication in the popup when we win
  let winContent = "\
  <h1 class='text-success' style='font-size: 1.6rem;'><span id='winner'>Nothing</span> you won</h1>\
  <div class='row'>\
    <div class='col-12 my-4'>\
      <img class='img-fluid win' src='image/reward.png'>\
    </div>\
    <div class='col-12'>\
      <button class='btn btn-secondary' type='button' name='button' onclick='location.reload()'>Restart</button>\
      <button class='replay btn btn-success' type='button' name='button'>Replay</button>\
    </div>\
  </div>\
  ";
  document.getElementById("myContent").innerHTML = winContent;
  document.getElementById("winner").textContent = player.name;
  // the popup should appear
  document.getElementById("popup-1").classList.add("active");
  replay()
}

function theTie () {
  // the modication in the popup when we have a tie
  let tieContent = "\
  <h1 class='text-success' style='font-size: 1.6rem;'>Seems we have a tie!</h1>\
  <div class='row'>\
    <div class='col-12 mt-3 mb-4'>\
      <img class='img-fluid win' src='image/white-flag.png'>\
    </div>\
    <div class='col-12'>\
      <button class='btn btn-secondary' type='button' name='button' onclick='location.reload()'>Restart</button>\
      <button class='replay btn btn-success' type='button' name='button'>Replay</button>\
    </div>\
  </div>\
  ";
  document.getElementById("myContent").innerHTML = tieContent;
  document.getElementById("popup-1").classList.add("active");
  replay();
}

function replay () {
  document.querySelector('.replay').addEventListener('click', function() {
    document.getElementById("popup-1").classList.remove("active")
    document.querySelectorAll('td').forEach(tdCells => tdCells.style.backgroundImage = "");
  })
}

// This function checks if every cell has no background and empty
function checkingEmpty () {
  const isRestarting = (currentValue) => currentValue.style.backgroundImage === "";
  const myTDs = [];
  document.querySelectorAll('td').forEach(item => myTDs.push(item));
  return(myTDs.every(isRestarting))
}
