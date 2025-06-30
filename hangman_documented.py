#!/usr/bin/env python3
"""
Hangman Game Implementation

A simple command-line hangman game with ASCII art visualization.
This module provides a single function `hangman()` that implements
a complete hangman game experience.

Author: Referenced from "The Self-Taught Programmer"
Contact: cory[at]theselftaughtprogrammer.io

Example:
    Run the game directly:
        $ python hangman.py
    
    Or import and use:
        >>> from hangman import hangman
        >>> hangman("python")

Requirements:
    - Python 3.x
    - No external dependencies
"""

from typing import List


def hangman(word: str) -> None:
    """
    Start an interactive hangman game in the terminal.
    
    This function implements a complete hangman game where the player
    guesses letters to reveal a hidden word. Wrong guesses result in
    drawing parts of a hangman. The game ends when either all letters
    are guessed (win) or the hangman drawing is completed (lose).
    
    Args:
        word (str): The target word that players need to guess.
                   Should contain only alphabetic characters.
    
    Returns:
        None: This function handles all I/O operations internally
              and doesn't return any value.
    
    Side Effects:
        - Prints game state and messages to stdout
        - Reads user input from stdin
        - Blocks until game completion
    
    Game Rules:
        - Players can make up to 6 wrong guesses
        - Each wrong guess adds a part to the hangman drawing
        - Case-sensitive letter matching
        - Win by revealing all letters
        - Lose by completing the hangman (7 wrong guesses)
    
    Examples:
        >>> hangman("cat")
        Welcome to Hangman
        
        Guess a letter: a
        __ a __
        
        >>> hangman("hello")
        Welcome to Hangman
        
        Guess a letter: e
        __ e __ __ __
    
    Note:
        This implementation has some limitations:
        - No input validation for non-alphabetic characters
        - No protection against repeated guesses
        - Only handles the first occurrence of repeated letters
        - Case-sensitive matching only
    """
    # Initialize game state variables
    wrong: int = 0  # Counter for incorrect guesses
    
    # ASCII art stages for hangman drawing progression
    # Each stage represents a step towards completion
    stages: List[str] = [
        "",                      # 0: Initial empty state
        "________        ",       # 1: Gallows base
        "|               ",       # 2: Vertical support pole
        "|        |      ",       # 3: Horizontal beam
        "|        0      ",       # 4: Head
        "|       /|\     ",       # 5: Body with arms
        "|       / \     ",       # 6: Legs (game over)
        "|               "        # 7: Final state (unused)
    ]
    
    # Create mutable copy of word for tracking guessed letters
    # We'll replace guessed letters with '$' to mark them as found
    rletters: List[str] = list(word)
    
    # Initialize display board with blanks for each letter
    # This represents what the player sees
    board: List[str] = ["__"] * len(word)
    
    # Flag to track if player has won
    win: bool = False
    
    # Game introduction
    print("Welcome to Hangman")
    
    # Main game loop - continue while wrong guesses < max allowed
    # Maximum wrong guesses = len(stages) - 1 = 6
    while wrong < len(stages) - 1:
        print("\n")  # Add spacing for readability
        
        # Get player's letter guess
        msg: str = "Guess a letter"
        char: str = input(msg)
        
        # Check if guessed letter exists in the word
        if char in rletters:
            # Correct guess: find letter position and reveal it
            cind: int = rletters.index(char)  # Find first occurrence
            board[cind] = char                # Show letter on board
            rletters[cind] = '$'             # Mark as guessed (prevents re-guessing same position)
        else:
            # Wrong guess: increment error counter
            wrong += 1
        
        # Display current game state
        print((" ".join(board)))  # Show current word progress
        
        # Display hangman drawing up to current wrong guess count
        e: int = wrong + 1
        print("\n".join(stages[0:e]))
        
        # Check win condition: no more blanks in board
        if "__" not in board:
            print("You win!")
            print(" ".join(board))
            win = True
            break  # Exit game loop
    
    # Handle loss condition (exited loop due to too many wrong guesses)
    if not win:
        # Display final hangman drawing
        print("\n".join(stages[0:wrong]))
        # Reveal the correct word
        print("You lose! It was {}.".format(word))


# Example execution - runs when script is executed directly
if __name__ == "__main__":
    # Start a game with the word "cat" as demonstration
    hangman("cat")