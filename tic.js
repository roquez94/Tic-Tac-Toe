//will accept mark X or O and find index of cell
//Factory that takes name
let playerFactory = (name, mark) => {
    let playTurn = (board, cell) => {
        let idx = board.cells.findIndex(position => position === cell);
        if (board.boardArray[idx] === '') {
            board.render();
            return idx;
        }
        return null;
    };
    return {name, mark, playTurn};
}

//board module, holds 9 positions of the game & winning spots
let boardModule = (function(){
    let boardArray = ['', '', '', '', '', '', '', '', ''];

    let gameBoard = document.querySelector('.gameboard');

    //makes an array using div cells class
    let cells = Array.from(document.querySelectorAll('.cell'));
    let winner = null;

    //make the value of the html cells equal to the board array
    let render = () => {
        boardArray.forEach((mark, idx) => {
            cells[idx].textContent = boardArray[idx];
        });
    };

    //resets the board making all values to an empty string
    let reset = () => {
        boardArray = ['', '', '', '', '', '', '', '', ''];
    };

    //checks winning positions in TicTacToe game (3 marks in a row)
    checkWin = () => {
        let winArrays = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        winArrays.forEach((combo) => {
            if (boardArray[combo[0]]
                && boardArray[combo[0]] === boardArray[combo[1]]
                && boardArray[combo[0]] === boardArray[combo[2]] ) {
                    winner = 'current';
                }
        });
        return winner || (boardArray.includes('') ? null : 'Tie');
    };

    return {render, gameBoard, cells, boardArray, checkWin, reset};
}) ();

//gamePlay module  -- game logic
let gamePlay = ( function(){
    //interact with DOM to get player names
    let player1Name = document.querySelector('#player1');
    let player2Name = document.querySelector('#player2');
    let form = document.querySelector('.player-info');
    let resetBtn = document.querySelector('#reset');

    //switch turns between players
    let currentPlayer;
    let player1;
    let player2;

    let switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    //control the game round, checks if winner or tie
    let gameRound = () => {
        let board = boardModule;
        let gameStatus = document.querySelector('.game-status');
        if (currentPlayer.name !== ''){
            gameStatus.textContent = `${currentPlayer.name}'s Turn`;
        } else {
            gameStatus.textContent = 'Board: ';
        }

        board.gameBoard.addEventListener('click', (e) => {
            e.preventDefault();
            let play = currentPlayer.playTurn(board, e.target);
            
            if (play !== null) {
                board.boardArray[play] = `${currentPlayer.mark}`;
                board.render();
                let winStatus = board.checkWin();
                if (winStatus === 'Tie') {
                    gameStatus.textContent = 'Tie!';
                } else if (winStatus === null) {
                    switchTurn();
                    gameStatus.textContent = `${currentPlayer.name}'s Turn`;
                } else {
                    gameStatus.textContent = `Winner is ${currentPlayer.name}`;
                    board.reset();
                    board.render();
                }
            }
        });
    };

    //gameInit method will initialize the game
    let gameInit = () => {
        if (player1Name.value !== '' && player2Name.value !== ''){
            player1 = playerFactory(player1Name.value, '🥓');
            player2 = playerFactory(player2Name.value, '🥞');
            currentPlayer = player1;
            gameRound();
        }
    };

    //hides the playerInfo form after hitting play/submit button
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (player1Name.value !== '' && player2Name.value !== ''){
            gameInit();
            form.classList.add('hidden');

            document.querySelector('.place').classList.remove('hidden');
            } else {
                window.location.reload();
            }
    });

    resetBtn.addEventListener('click', ()=> {
        document.querySelector('.game-status').textContent = 'Board: ';
        document.querySelector('#player1').value = '';
        document.querySelector('#player2').value = '';
        window.location.reload();
    });
    return {gameInit};

}) ();

gamePlay.gameInit();