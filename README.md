# Hangman Game

A simple command-line hangman game implementation in Python featuring ASCII art and interactive gameplay.

## 🎮 Features

- Interactive command-line interface
- ASCII art hangman drawing that progresses with wrong guesses
- Simple and educational code structure
- No external dependencies required

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd hangman

# Run the game
python hangman.py
```

## 🎯 How to Play

1. The game will display blanks representing letters in a hidden word
2. Guess letters one at a time
3. Correct guesses reveal the letter's position(s) in the word
4. Wrong guesses add parts to the hangman drawing
5. Win by guessing all letters before the drawing is complete
6. Lose if you make 7 wrong guesses

## 📖 Documentation

For comprehensive API documentation, function references, and detailed examples, see:

**[📚 API Documentation](./API_DOCUMENTATION.md)**

## 🔧 Usage as a Module

```python
from hangman import hangman

# Start a game with your chosen word
hangman("python")
hangman("programming")
hangman("challenge")
```

## 🎲 Example Game

```
Welcome to Hangman

Guess a letter: e
__ __ e

Guess a letter: t
__ __ e

________        

Guess a letter: h
__ h e

Guess a letter: t
t h e

You win!
t h e
```

## 📋 Requirements

- Python 3.x
- No external libraries required

## 🤝 Contributing

Contributions are welcome! Please see the [API Documentation](./API_DOCUMENTATION.md) for development guidelines and coding standards.

## 📝 License

Educational code - see source file for attribution.

---

*Thanks for checking out this hangman implementation! 🎉*