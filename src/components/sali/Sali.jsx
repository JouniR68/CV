import trainingData from "../../../data/six.json";


const TrainingPlan = () => {
  return (
    <div>
      <h1>Harjoitteluohjelma</h1>
      <p>Kesto: {trainingData.ohjelma.kesto}</p>
      <p>Tavoite: {trainingData.ohjelma.tavoite}</p>
      <h2>Aikataulu</h2>
      <div className = "sali">
      {trainingData.ohjelma.aikataulu.map((day) => (
        <div key={day.päivä}>
          <h3>Päivä {day.päivä}: {day.painotus}</h3>
          <p>Lämmittely: {day.lämmittely}</p>
          <ul>
            {day.liikkeet && day.liikkeet.map((exercise, index) => (
              <li key={index}>{exercise.nimi} - {exercise.sarjat} sarja x {exercise.toistot} toistot</li>
            ))}
          </ul>
        </div>
      ))}
      </div>
      
    </div>
  );
};

export default TrainingPlan;
