//CSS
import './App.css';

// React
import {useCallback, useEffect, useState} from "react";

// Dados
import {wordsList} from "./data/words"

//Componentes
import StartScreen from "./Components/StartScreen"
import Game from "./Components/Game"
import GameOver from "./Components/GameOver"

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]); //Letras Certas
  const [wrongLetters, setWrongLetters] = useState([]); //Letras Erradas
  const [guesses, setGuesses] = useState(guessesQty); //Tentativas
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // console.log(category)

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);

    return {word,category}
  },[words])

  // starts the secret word 
  const startGame = useCallback(() => {
    //Limpando todos os states
    clearLetterStates()

    // pick word and pick category
    const {word, category} = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((a) => a.toLowerCase())

    console.log(word,category)
    console.log(wordLetters)

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {
      const normalizedLetter = letter.toLowerCase()

      //check if letter has already been utilized
    if(
      guessedLetters.includes(normalizedLetter) ||  
      wrongLetters.includes(normalizedLetter)
      ){
        return;
      }

      // push guessed letter or remove a guess - Identificando se a letra está certa/errada
      if(letters.includes(normalizedLetter)){
          setGuessedLetters((actualGuessedLetters) => [
            ...actualGuessedLetters,
            normalizedLetter
          ])
      }else{
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);

        //Caso a pessoa erre, será diminuído o número de chanecs.o
        setGuesses((actualGuesses) => actualGuesses - 1);

      }
    };

    // console.log("Certas: "+guessedLetters)
    // console.log("Erradas: "+wrongLetters)

    const clearLetterStates = () => {
      setGuessedLetters([]);
      setWrongLetters([]);
    }

    //Verifica a pontuação, se for 0 finaliza a partida resetando todos os states e setGameStage recebe state de novo jogo
    useEffect(() => {
      if(guesses <= 0){
        //reset all states
        clearLetterStates()

        setGameStage(stages[2].name);

      }
    },[guesses])

  // verifica condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length){
      //Adicionar Score
      setScore((actualScore) => actualScore += 100)

      //restart jogo
      startGame();

    }

  },[guessedLetters, letters, startGame])

  // reiniciar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
       
        {gameStage == 'start' && <StartScreen startGame={startGame}/>}
        
        {gameStage == 'game' && (
          <Game 
          verifyLetter   = {verifyLetter} 
          pickedWord     = {pickedWord}
          pickedCategory = {pickedCategory}
          letters        = {letters}
          guessedLetters = {guessedLetters}
          wrongLetters   = {wrongLetters}
          guesses        = {guesses} 
          score          = {score}
          />
        )}

        {gameStage == 'end' && <GameOver retry={retry} score={score}/>}

    </div>
  );
}

export default App;
