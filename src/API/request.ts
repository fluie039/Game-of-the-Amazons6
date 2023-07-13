//post a new player
export async function postNewPlayer(playerName, playerControllable) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'name': playerName,
          'controllable': playerControllable
        })
    };
    return fetch('https://gruppe6.toni-barth.com/players/', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
}
  
//post a new game
export async function postNewGame(maxTurnTime, player1, player2) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "maxTurnTime": maxTurnTime,
            "players": [
                player1,
                player2
            ],
            "board": {
                "gameSizeRows": 10,
                "gameSizeColumns": 10,
                "squares": [
                    [-1, -1, -1, 0, -1, -1, 0, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, 1, -1, -1, 1, -1, -1, -1]
                ]
            }
        })
    };
    return fetch('https://gruppe6.toni-barth.com/games/', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
}
  
//post a new move
export async function postNewMove(playerId, gameId, startRow, startColumn, endRow, endColumn, shotRow, shotColumn) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "move": {
                "start": {
                    "row": startRow,
                    "column": startColumn,
                },
                "end": {
                    "row": endRow,
                    "column": endColumn,
                }
            },
            "shot": {
                "row": shotRow,
                "column": shotColumn,
            }
        })
    };
    return fetch('https://gruppe6.toni-barth.com/move/' + playerId + '/' + gameId, requestOptions)
        .then(response => response.text())
        .then(data => console.log(data));
}

//return the game with the given id in json
export async function getGame(id) {
    let gameJson = await fetch('https://gruppe6.toni-barth.com/games/' + id)
        .then(response => response.json())
        .then(data => {return data})
        .catch(error => console.error(error));
    return gameJson;
}
  
//reset the web page
export async function reset() {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

        })
    };
    console.log('Everything has been reset');
    return fetch('https://gruppe6.toni-barth.com/reset/', requestOptions);
}