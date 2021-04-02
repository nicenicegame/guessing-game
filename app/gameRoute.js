const express = require('express')
const { letterStyle, buttonStyle } = require('./styles')
const { initGame, resetGame } = require('./util')

const gameRoute = express.Router()

const letters = ['A', 'B', 'C', 'D']

gameRoute.get('/', (req, res) => {
  const body = `
    <h1>MongoDB Exercises - Array</h1>
    <h2>Alphabet Guessing Game v1.0</h2>
  
    <a href="/step1">Start</a>
    `
  res.send(body)
})

gameRoute.get('/step:stepNumber', async (req, res) => {
  const step = req.params.stepNumber

  const db = req.app.locals.db
  const game = await db.collection('game').findOne()

  if (!game) {
    initGame(db)
    res.redirect('/step1')
  } else {
    if (+step === 1) {
      const guessingLetter = [
        game.letter1,
        game.letter2,
        game.letter3,
        game.letter4,
      ]

      res.send(`
          <form method="POST" action="/step1">
            <h1>Please enter alphabet for guessing.</h1>

            <p style="margin: 2rem 0;">
              ${guessingLetter
                .map(
                  (letter) =>
                    `<span
                      style="${letterStyle}"
                      >${letter}</span>`
                )
                .join(' ')}
            </p>

            ${
              !guessingLetter.includes('_')
                ? `
                  <a href="/step2" style="margin-right: 1rem;">Let's Guess!</a>
                  <a href="/reset">Reset</a>
                  `
                : `${letters
                    .map(
                      (letter) =>
                        `<button style="${buttonStyle}" type="submit" name="guess" value="${letter}">${letter}</button>`
                    )
                    .join(' ')}
                  `
            }
          </form>
        `)
    } else if (+step === 2) {
      res.send(`
          <h1>You are on step ${step}</h1>
          <a href="/step1">Back</a>
          `)
    }
  }
})

gameRoute.post('/step:stepNumber', async (req, res) => {
  const step = req.params.stepNumber
  const db = req.app.locals.db

  if (+step === 1) {
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
  } else if (+step === 2) {
  }
})

gameRoute.get('/reset', async (req, res) => {
  const db = req.app.locals.db
  resetGame(db)
  res.redirect('/step1')
})

module.exports = gameRoute
