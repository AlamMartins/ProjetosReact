import css from './Game.css'
import {useState, useRef} from "react";

const Game = ({verifyLetter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score}) => {


    const [letter, setLetter] = useState("");
    const letterInputRef = useRef(null)

    // console.log('1'+verifyLetter, '- 2 '+pickedWord, '- 3 '+pickedCategory,'- 4 '+ letters, '- 5 '+guessedLetters, '- 6 '+wrongLetters, '- 7 '+guesses, '- 8 '+score)

    const handleSubmit = (e) => {
        e.preventDefault();

        verifyLetter(letter)
        setLetter("")
        letterInputRef.current.focus()
    }

  return (
    <div className="game">
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
      {/* <button onClick={verifyLetter}>Finalizar Jogo</button> */}
        <h1>Adivinhe a palavra:</h1>
        <h3 classname="tip">
            Dica sobre a palavra:  <span>{pickedCategory}</span>
        </h3>
        <p>Você ainda tem {guesses} tentativa(s).</p>
        <div className="wordContainer">
            {letters.map((letter,i) => {
                return(guessedLetters.includes(letter) ? (
                    <span key={i} className="letter">
                        {letter}
                    </span>
                ) : (
                    <span key={i} className="blankSquare"></span>
                ))
            })}
        </div>
        <div className="letterContainer">
            <p>Tente adivinhar uma letra da palavra:</p>
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                name="letter" 
                maxLength="1"  
                onChange={(e) => setLetter(e.target.value)}
                required
                value={letter}
                ref={letterInputRef}
                />
                <button>Jogar!</button>
            </form>
        </div>
        <div className="wrongLettersContainer">
            <p>Letras já utilizadas:</p>
            {wrongLetters.map((letter,i) => (
                <span key={i}>{letter},</span>
            ))}
        </div>
    </div>
  )
}

export default Game
