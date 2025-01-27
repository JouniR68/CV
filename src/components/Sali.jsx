import data from "../../data/treeniplan.json";

const Sali = () => {
    return (
        <div className="sali">
            {data.plan.map((day, dayIndex) => (
                <div key={dayIndex} className="day">
                    {/* Loop through each day's data */}
                    {Object.entries(day).map(([dayName, dayDetails]) => (
                        <div key={dayName} className="day-details">
                            <h2>{dayName}</h2>
                            <p><strong>Tavoite:</strong> {dayDetails.Tavoite}</p>
                            <p><strong>Lämmittely (10 min):</strong> {dayDetails["Lammittely (10 min)"]}</p>
                            <div>
                                <strong>Voimaharjoittelu:</strong>
                                <ul>
                                    {dayDetails.Voimaharjoittelu &&
                                        dayDetails.Voimaharjoittelu.map((exercise, index) => (
                                            <li key={index}>{exercise}</li>
                                        ))}
                                </ul>
                            </div>
                            {dayDetails.HIIT && (
                                <p><strong>HIIT (10-15 min):</strong> {dayDetails.HIIT}</p>
                            )}
                            {dayDetails.Kavely && (
                                <p><strong>Kävely:</strong> {dayDetails.Kavely}</p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sali;
