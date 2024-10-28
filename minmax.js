const gameContainer = document.getElementById('game');
        const message = document.getElementById('message');
        const resetButton = document.getElementById('resetButton');
        const gridSizeButtons = document.querySelectorAll('.grid-size-button');
        let board = [];
        let isGameOver = false;
        let gridSize = 3;

        // Initialize the game
        window.onload = function() {
            // Set default active button
            document.querySelector(`.grid-size-button[data-size="${gridSize}"]`).classList.add('active');
            createBoard();
        }

        // Event Listeners
        gridSizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                gridSizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                gridSize = parseInt(this.dataset.size);
                createBoard();
            });
        });

        resetButton.addEventListener('click', createBoard);

        function createBoard() {
            gameContainer.innerHTML = '';
            board = Array(gridSize * gridSize).fill('');
            isGameOver = false;
            message.textContent = '';
            gameContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
            gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

            for (let i = 0; i < board.length; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.index = i;
                cell.addEventListener('click', playerMove);
                gameContainer.appendChild(cell);
            }
        }

        function playerMove(event) {
            const index = event.target.dataset.index;
            if (board[index] === '' && !isGameOver) {
                board[index] = 'X';
                event.target.textContent = 'X';
                event.target.style.pointerEvents = 'none';
                if (checkWin('X')) {
                    endGame('You win!');
                } else if (isBoardFull()) {
                    endGame('It\'s a tie!');
                } else {
                    setTimeout(computerMove, 300);
                }
            }
        }

        function computerMove() {
            const index = bestMove();
            board[index] = 'O';
            const cell = document.querySelector(`.cell[data-index='${index}']`);
            cell.textContent = 'O';
            cell.style.pointerEvents = 'none';
            if (checkWin('O')) {
                endGame('Computer wins!');
            } else if (isBoardFull()) {
                endGame('It\'s a tie!');
            }
        }

        function bestMove() {
            const maxDepth = gridSize === 3 ? Infinity : 3;
            let bestScore = -Infinity;
            let move;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, 0, false, -Infinity, Infinity, maxDepth);
                    board[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
            return move;
        }

        function minimax(newBoard, depth, isMaximizing, alpha, beta, maxDepth) {
            let result = checkWinner();
            if (result !== null || depth === maxDepth) {
                const scores = { 'X': -10, 'O': 10, 'tie': 0 };
                return scores[result] || 0;
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < newBoard.length; i++) {
                    if (newBoard[i] === '') {
                        newBoard[i] = 'O';
                        let score = minimax(newBoard, depth + 1, false, alpha, beta, maxDepth);
                        newBoard[i] = '';
                        bestScore = Math.max(score, bestScore);
                        alpha = Math.max(alpha, score);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < newBoard.length; i++) {
                    if (newBoard[i] === '') {
                        newBoard[i] = 'X';
                        let score = minimax(newBoard, depth + 1, true, alpha, beta, maxDepth);
                        newBoard[i] = '';
                        bestScore = Math.min(score, bestScore);
                        beta = Math.min(beta, score);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                return bestScore;
            }
        }

        function checkWin(player) {
            const combinations = generateWinningCombinations();
            for (let combo of combinations) {
                if (combo.every(index => board[index] === player)) {
                    return true;
                }
            }
            return false;
        }

        function generateWinningCombinations() {
            let combinations = [];

            // Rows
            for (let i = 0; i < gridSize; i++) {
                let row = [];
                for (let j = 0; j < gridSize; j++) {
                    row.push(i * gridSize + j);
                }
                combinations.push(row);
            }

            // Columns
            for (let i = 0; i < gridSize; i++) {
                let col = [];
                for (let j = 0; j < gridSize; j++) {
                    col.push(i + j * gridSize);
                }
                combinations.push(col);
            }

            // Diagonals
            let diag1 = [];
            let diag2 = [];
            for (let i = 0; i < gridSize; i++) {
                diag1.push(i * gridSize + i);
                diag2.push((i + 1) * (gridSize - 1));
            }
            combinations.push(diag1, diag2);

            return combinations;
        }

        function checkWinner() {
            if (checkWin('X')) {
                return 'X';
            } else if (checkWin('O')) {
                return 'O';
            } else if (isBoardFull()) {
                return 'tie';
            } else {
                return null;
            }
        }

        function isBoardFull() {
            return board.every(cell => cell !== '');
        }

        function endGame(text) {
            isGameOver = true;
            message.textContent = text;
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.pointerEvents = 'none';
            });
        }
