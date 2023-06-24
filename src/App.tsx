import { useEffect, useRef, useState } from "react";
import results from './assets/undraw_winners_ao2o 2.svg'
import quiz from './assets/undraw_adventure_4hum 1.svg'

interface ICountry {
  flags: Flags
  name: Name
  capital: string[]
}

interface Flags {
  png: string
  svg: string
  alt: string
}

interface Name {
  common: string
  official: string
  nativeName: NativeName
}

interface NativeName {
  ara: Ara
}

interface Ara {
  official: string
  common: string
}

function App() {

  const allCountries = useRef<ICountry[]>([])
  const correctAnswer = useRef<ICountry>()
  const userAnswer = useRef<string>()
  const correctCount = useRef(0)
  const isCorrectClicked = useRef(true)
  const flagQuestion = useRef(false)
  const [answers, setAnswers] = useState<ICountry[]>([])
  const [answerClicked, setAnswerClicked] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchCountries(); // Fetch data on component mount
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital');
      const jsonData = await response.json();
      allCountries.current = jsonData;
      getRandomElements(jsonData)
    } finally {
    }
  };

  const getIndex = (index: number) => {
    if (index === 0)
      return 'A'
    else if (index === 1)
      return 'B'
    else if (index === 2)
      return 'C'
    else if (index === 3)
      return 'D'
    return ''
  }

  const getRandomElements = (array: ICountry[]) => {
    const shuffled = array.slice(); // Create a copy of the array

    shuffled.sort(() => Math.random() - 0.5); // Shuffle the array

    const randomIndex = Math.floor(Math.random() * 4); // 0 to 3
    correctAnswer.current = shuffled[randomIndex]
    flagQuestion.current = Math.random() > 0.5

    setAnswers(shuffled.slice(0, 4)); // Return the first 4 elements
  };

  const onAnswerClick = (name: string) => {
    if (!answerClicked) {
      userAnswer.current = name
      setAnswerClicked(true)
      if (correctAnswer.current?.name.common === name)
        correctCount.current += 1
      else
        isCorrectClicked.current = false
    }
  }

  const onNextClick = () => {
    setAnswerClicked(false)
    if (isCorrectClicked.current === true) {
      getRandomElements(allCountries.current)
    } else {
      setShowResults(true)
    }
  }

  const onRetryClick = () => {
    getRandomElements(allCountries.current)
    setShowResults(false)
    correctCount.current = 0
    isCorrectClicked.current = true
  }

  return (
    <>
      <main>
        <h1>Country Quiz</h1>
        <div className={`quiz ${answerClicked ? 'pb-4' : ''}`}>
          {showResults ?
            <div className="results">
              <img src={results} />
              <h2>Results</h2>
              <p>You got <span>{correctCount.current}</span> correct answers</p>
              <button onClick={onRetryClick}>Try again</button>
            </div>
            :
            <>
              {flagQuestion.current === true ?
                <>
                  <img className="flag" src={correctAnswer.current?.flags.svg} alt={correctAnswer.current?.flags.alt} />
                  <h2>Which country does this flag belong to?  </h2>
                </>
                :
                <h2>{correctAnswer.current?.capital} is the capital of</h2>
              }
              {answers.map((answer, i) => {
                return (
                  <div key={i}
                    className={`answer ${answerClicked ? answer.name.common === correctAnswer.current?.name.common ? 'correct clicked' : answer.name.common === userAnswer.current ? 'wrong clicked' : 'clicked' : ''}`}
                    onClick={() => onAnswerClick(answer.name.common)}
                  >
                    <span>{getIndex(i)}</span>
                    <span>{answer.name.common}</span>
                  </div>
                )
              })}
              {answerClicked &&
                <div className="button-container">
                  <button onClick={onNextClick}>Next</button>
                </div>
              }
              <img src={quiz} className="adventure" />
            </>
          }
        </div>
      </main>
      <footer>created by MSultan9 - devChallenges.io</footer>
    </>
  )
}

export default App
