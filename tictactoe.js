var onTictactoe = new tictactoe();

function tictactoe () {
  const myImage = ["url('image/cross.png')", "url('image/circle.png')"];
  const playerOne = new ThePlayer(myImage[0]);
  const playerTwo = new ThePlayer(myImage[1]);
  this.myHandler = new TheHandler(playerOne, playerTwo);
}

function TheHandler (playerOne, playerTwo) {

  let theBoard =  new TheBoard(playerOne, playerTwo)

  let myPopup = document.getElementById("popup-1");
  let myStart = document.getElementById('inplay');
  let myNames = document.querySelector(".myname");

  myPopup.classList.add("active");
  replay ();

  myStart.addEventListener('click', function(){
    myPopup.classList.remove("active");
    myNames.firstElementChild.innerHTML = "<span id='myturn'>Nothing</span> make your move"

    let nameOne = document.getElementById("player_1").value;
    let nameTwo = document.getElementById("player_2").value;
    let players = [nameOne, nameTwo];

    playerOne.name = players[Math.floor(Math.random() * players.length)];
    playerTwo.name = (playerOne.name === players[0]) ? players[1] : players[0]

    document.querySelector("#myturn").textContent = playerOne.name;
    theBoard.trigger();
    })
}

function TheBoard (playerOne, playerTwo) {
  const theCells = ["#one", "#two", "#three",
                  "#four", "#five", "#six",
                  "#seven", "#eight", "#nine"];
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

  this.trigger = function () {
      let inPlayerOne = playerOne;
      let inPlayerTwo = playerTwo;
      let myTurn = true;
      let image = inPlayerOne.image;
      let tieCond = [];

      for (let cell of theCells) {

        let myCell = document.querySelector(cell);
        myCell.addEventListener("click", function () {
          if (myCell.style.backgroundImage == "") {
            myCell.style.backgroundImage = image;
            tieCond.push(cell)
            console.log("overall move " + tieCond)
          }
        })

        const observer = new MutationObserver(mutations => {

          let EmptyOn = checkingEmpty();

          if (runIt === true) {

            mutation = myMutation(cell, image, myTurn, theCells, inPlayerOne, inPlayerTwo);
            [myTurn, image, cell, inPlayerOne, inPlayerTwo, currentPlayer, sortedMove] = mutation;

            console.log(currentPlayer.name + " moves: " + sortedMove);

            let checker = (arr, target) => target.every(v => arr.includes(v));

            for (let winCond of winCombo) {

              if (checker(sortedMove, winCond) === true && EmptyOn === false) {
                theWinner(currentPlayer)
                runIt = false;
                console.log("The winner " + currentPlayer);
              }

              else if (tieCond.length === 9 && checker(sortedMove, winCond) === false && EmptyOn === false){
                theTie();
                runIt = false;
                console.log("We have a tie");
              }

              else if (EmptyOn === true) {
                tieCond = [];
                inPlayerOne.move = [];
                inPlayerTwo.move = [];
                console.log("Got restarted");
              }

            }
            console.log(myTurn)
          }

          else if (runIt === false && EmptyOn === true ) {
            runIt = true;
            myTurn = true;
          }
        })

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
  document.getElementById("popup-1").classList.add("active");
  replay()
}

function theTie () {
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

function checkingEmpty () {
  const isRestarting = (currentValue) => currentValue.style.backgroundImage === "";
  const myTDs = [];
  document.querySelectorAll('td').forEach(item => myTDs.push(item));
  return(myTDs.every(isRestarting))
}
