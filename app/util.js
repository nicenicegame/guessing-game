const initGame = async (db) => {
  await db.collection('game').insertOne({
    secret1: '_',
    secret2: '_',
    secret3: '_',
    secret4: '_',
    guess1: '_',
    guess2: '_',
    guess3: '_',
    guess4: '_',
    secretIndex: 0,
    guessIndex: 0,
    count: 0,
    correct: null,
  })
}

const resetGame = async (db) => {
  await db.collection('game').drop()
}

const getGuessLetters = (game) => {
  return [game.guess1, game.guess2, game.guess3, game.guess4]
}

const getSecretLetters = (game) => {
  return [game.secret1, game.secret2, game.secret3, game.secret4]
}

module.exports = {
  initGame,
  resetGame,
  getGuessLetters,
  getSecretLetters,
}
