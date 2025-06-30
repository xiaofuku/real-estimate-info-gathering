# Hangman Game - API Documentation

## Project Overview

This is a simple command-line hangman game implementation in Python. The game allows players to guess letters to reveal a hidden word, with visual feedback showing a hangman being drawn for incorrect guesses.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Public APIs](#public-apis)
- [Functions](#functions)
- [Examples](#examples)
- [Game Rules](#game-rules)
- [Contributing](#contributing)

## Installation

No external dependencies are required. This project uses only Python standard library.

### Requirements
- Python 3.x

### Setup
```bash
git clone <repository-url>
cd hangman
python hangman.py
```

## Quick Start

```python
from hangman import hangman

# Start a game with the word "cat"
hangman("cat")
```

## Public APIs

### Functions

#### `hangman(word)`

The main game function that implements the hangman game logic.

**Parameters:**
- `word` (str): The word that the player needs to guess. Must be a non-empty string.

**Returns:**
- None (void function)

**Behavior:**
- Starts an interactive command-line hangman game
- Displays the hangman stages as wrong guesses accumulate
- Shows the current state of the word with guessed letters revealed
- Ends when the player either wins (guesses all letters) or loses (7 wrong guesses)

**Side Effects:**
- Prints to console
- Reads user input from stdin
- Modifies internal game state during execution

## Examples

### Basic Usage

```python
# Simple game with a 3-letter word
hangman("cat")
```

### Game Flow Example

```
Welcome to Hangman

Guess a letter: a
__ a __


Guess a letter: t
__ a t


Guess a letter: c
c a t

You win!
c a t
```

### Losing Game Example

```
Welcome to Hangman

Guess a letter: x
__ __ __

________        

Guess a letter: y
__ __ __

________        
|               

Guess a letter: z
__ __ __

________        
|               
|        |      

# ... continues until 7 wrong guesses ...

You lose! It was cat.
```

## Game Rules

1. **Objective**: Guess all letters in the hidden word before the hangman drawing is completed
2. **Wrong Guesses**: Players can make up to 6 wrong guesses before losing
3. **Input**: Single letters only
4. **Case Sensitivity**: The game is case-sensitive
5. **Winning**: Reveal all letters in the word
6. **Losing**: Make 7 wrong guesses (complete the hangman drawing)

## Game States

### Hangman Drawing Stages

The game uses 7 stages to draw the hangman:

1. Empty gallows
2. Base: `________`
3. Pole: `|`
4. Top beam: `|        |`
5. Head: `|        0`
6. Body and arms: `|       /|\`
7. Legs: `|       / \`

### Board Representation

- Unguessed letters: `__`
- Guessed letters: The actual letter
- Incorrect guesses: Tracked internally, displayed as hangman stages

## Internal Implementation Details

### Data Structures

1. **stages** (list): Contains ASCII art for hangman drawing progression
2. **rletters** (list): Mutable copy of the word for tracking guessed letters
3. **board** (list): Display representation showing guessed/unguessed letters
4. **wrong** (int): Counter for incorrect guesses
5. **win** (bool): Flag to track game completion status

### Algorithm Flow

1. Initialize game state (stages, board, counters)
2. Enter main game loop while wrong guesses < 6
3. Prompt user for letter input
4. Check if letter exists in word
5. Update board if correct, increment wrong counter if incorrect
6. Display current board state and hangman drawing
7. Check win condition (no blanks remaining)
8. End game with win/lose message

## Error Handling

### Current Limitations

- No input validation for non-letter characters
- No handling of multi-character input
- No protection against repeated guesses
- Case-sensitive matching only

### Potential Improvements

```python
def improved_hangman(word):
    # Add input validation
    word = word.lower().strip()
    
    # Track guessed letters
    guessed_letters = set()
    
    # Validate input
    if not word.isalpha():
        raise ValueError("Word must contain only letters")
```

## Testing Examples

### Test Cases

```python
# Test with different word lengths
hangman("a")        # Single letter
hangman("hello")    # Common word
hangman("python")   # Programming term

# Edge cases to consider
hangman("aaa")      # Repeated letters
hangman("xyz")      # Uncommon letters
```

## API Contract

### Function Signature
```python
def hangman(word: str) -> None:
    """
    Starts an interactive hangman game.
    
    Args:
        word (str): The target word for players to guess
        
    Returns:
        None: Function handles all I/O internally
        
    Raises:
        No explicit exceptions (current implementation)
    """
```

### Input Requirements

- **word**: Must be a string
- **User input**: Single characters during gameplay

### Output Format

- Console-based interactive game
- ASCII art hangman drawing
- Status messages (win/lose)
- Current word state display

## Performance Characteristics

- **Time Complexity**: O(n) where n is the length of the word
- **Space Complexity**: O(n) for storing word copies and board state
- **I/O Operations**: Interactive, blocking on user input

## Contributing

When contributing to this project:

1. Maintain the simple, educational nature of the code
2. Add input validation for production use
3. Consider adding unit tests
4. Document any new functions following this format
5. Preserve the ASCII art hangman drawing feature

## License

This code is provided as educational material. See the source file header for attribution information.