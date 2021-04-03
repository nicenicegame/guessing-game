const express = require('express')
const { letterStyle, buttonStyle } = require('./styles')
const { initGame, resetGame } = require('./util')

const gameRoute = express.Router()

const letters = ['A', 'B', 'C', 'D']

gameRoute.get('/', (req, res) => {
  res.render('index')
})

gameRoute.get('/step:stepNumber', async (req, res) => {
  const step = req.params.stepNumber

  const db = req.app.locals.db
  const game = await db.collection('game').findOne()

  if (!game) {
    initGame(db)
    res.redirect('/step1')
  }

  const guessingLetters = [
    game.letter1,
    game.letter2,
    game.letter3,
    game.letter4,
  ]

  res.render('step', { step, guessingLetters, letters })
})

gameRoute.post('/step:stepNumber', async (req, res) => {
  const step = req.params.stepNumber
  const db = req.app.locals.db

  if (step == 1) {
    const value = req.body.guess
    let guessIndex = null

    const game = await db.collection('game').findOne()
    guessIndex = game.guessIndex

    const letterIndex = `letter${guessIndex + 1}`

    await db
      .collection('game')
      .updateOne(
        { [letterIndex]: '_' },
        { $set: { [letterIndex]: value, guessIndex: guessIndex + 1 } }
      )
    res.redirect('/step1')
  } else if (step == 2) {
  }
})

gameRoute.get('/reset', async (req, res) => {
  const db = req.app.locals.db
  resetGame(db)
  res.redirect('/step1')
})

module.exports = gameRoute