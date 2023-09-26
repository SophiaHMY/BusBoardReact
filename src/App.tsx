import React, {useEffect} from 'react';
import './App.css';
import {useState} from 'react';
import {bus} from "./bus";


function StopPointForm() {
    const [buses, setBuses] = useState<bus[]>([]);

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            postcodeInput: { value: string }
        }
        lookupPostcode(formElements.postcodeInput.value)
    }

    async function lookupPostcode(postcode: string) {
        await fetch('https://api.postcodes.io/postcodes/' + postcode)
            .then(response => response.json())
            .then(json => getNearestBusStops(json.result["latitude"], json.result["longitude"]))
    }

    async function getNearestBusStops(lat: string, lon: string) {
        fetch('https://api.tfl.gov.uk/StopPoint/?' + new URLSearchParams({
            lat: lat,
            lon: lon,
            stopTypes: 'NaptanPublicBusCoachTram',
        }))
            .then(response => response.json())
            .then(data => {
                getBusesAtStop(data.stopPoints[0].id)
            })
            .catch(error => console.error(error));
    }

    async function getBusesAtStop(stopCode: string) {

            fetch('https://api.tfl.gov.uk/StopPoint/' + stopCode + '/Arrivals')
                .then(response => response.json())
                .then(data => {
                    let incomingBuses: { destination: string, arrivalTime: string }[] = []
                        data.forEach((bus: { destinationName: string, expectedArrival: string }) => {
                            incomingBuses.push({destination: bus.destinationName, arrivalTime: bus.expectedArrival});
                        });
                    setBuses([...incomingBuses])
                    }
                )
                .catch(error => console.error(error));
           }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter postcode:
                        <input id="postcodeInput" type="text"/>
                    </label>
                </div>

                <button type="submit">Submit form</button>
            </form>
            <div>
                {buses.map(bus =>
                    <h3>
                        {bus.arrivalTime} {bus.destination}
                    </h3>
                )}

            </div>
        </>
    )
}


function App() {
    return (
        <div className="App">
            <h1> Bus Board</h1>
            <StopPointForm/>
        </div>
    );
}

export default App;
