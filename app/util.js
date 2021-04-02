const initGame = async (db) => {
  await db.collection('game').insertOne({
    letter1: '_',
    letter2: '_',
    letter3: '_',
    letter4: '_',
    guessIndex: 0,
    guessedLetter: [],
  })
}

const resetGame = async (db) => {
  await db.collection('game').drop()
}

module.exports = {
  initGame,
  resetGame,
}
