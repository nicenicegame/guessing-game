const express = require('express')
const {
  initGame,
  resetGame,
  getGuessLetters,
  getSecretLetters,
} = require('./util')

const gameRoute = express.Router()

const letters = ['A', 'B', 'C', 'D']

gameRoute.get('/', (req, res) => {
  res.render('index')
})

gameRoute.get('/step:stepNumber', async (req, res) => {
  let game
  const step = req.params.stepNumber
  const db = req.app.locals.db

  try {
    game = await db.collection('game').findOne()
  } catch {
    console.log('Error occurred while starting.')
  }

  if (!game) {
    initGame(db)
    res.redirect('/step1')
  }

  const secretLetters = getSecretLetters(game)
  const guessLetters = getGuessLetters(game)

  res.render('step', {
    step,
    letters,
    game,
    secretLetters,
    guessLetters,
  })
})

gameRoute.post('/step:stepNumber', async (req, res) => {
  const step = req.params.stepNumber
  const db = req.app.locals.db
  const value = req.body.guess
  const game = await db.collection('game').findOne()
  const secretLetters = getSecretLetters(game)

  if (step == 1) {
    const secretNumber = `secret${game.secretIndex + 1}`

    await db
      .collection('game')
      .updateOne(
        {},
        { $set: { [secretNumber]: value, secretIndex: game.secretIndex + 1 } }
      )
    res.redirect('/step1')
  } else if (step == 2) {
    const guessNumber = `guess${game.guessIndex + 1}`

    if (value === secretLetters[game.guessIndex]) {
      await db
        .collection('game')
        .updateOne(
          {},
          {
            $set: {
              [guessNumber]: value,
              guessIndex: game.guessIndex + 1,
              correct: true,
            },
          }
        )
    } else {
      await db
        .collection('game')
        .updateOne({}, { $set: { count: game.count + 1, correct: false } })
    }

    res.redirect('/step2')
  }
})

gameRoute.get('/reset', async (req, res) => {
  const db = req.app.locals.db
  resetGame(db)
  res.redirect('/step1')
})

module.exports = gameRoute
