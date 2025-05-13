import React from 'react'
import Nutritional from '../components/Nutritional'
import Timer from '../components/Timer'

const Home = () => {
  return (
    <div>
      <Nutritional />
      <Timer onComplete={() => alert("완료!")}/>
    </div>
  )
}

export default Home