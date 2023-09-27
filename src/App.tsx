import React, {useEffect} from 'react';
import './App.css';
import {useState} from 'react';
import {bus} from "./bus";
import BasicTable, {createRows} from "./Table";
import {constants} from "./constants";

function StopPointForm() {
    const [buses, setBuses] = useState<bus[]>([]);
    const [stopCode, setStopCode] = useState("");

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            postcodeInput: { value: string }
        }
        lookupPostcode(formElements.postcodeInput.value)
    }

    async function lookupPostcode(postcode: string) {
        await fetch(constants.postcodeApi + postcode)
            .then(response => response.json())
            .then(json => getNearestBusStops(json.result["latitude"], json.result["longitude"]))
    }

    async function getNearestBusStops(lat: string, lon: string) {
        fetch(constants.stopPointApi + "?" + new URLSearchParams({
            lat: lat,
            lon: lon,
            stopTypes: constants.stopTypes,
        }))
            .then(response => response.json())
            .then(data => {
                getBusesAtStop(data.stopPoints[0].id)
            })
            .catch(error => console.error(error));
    }

    async function getBusesAtStop(stopCode: string) {
        setStopCode(stopCode);
        fetch(constants.stopPointApi + stopCode + '/Arrivals')
            .then(response => response.json())
            .then(data => {
                    let incomingBuses: bus[] = []
                    data.forEach((bus: {
                        destinationName: string,
                        expectedArrival: string,
                        timeToStation: number,
                        lineId: string
                    }) => {
                        incomingBuses.push({
                            destination: bus.destinationName,
                            arrivalTime: bus.expectedArrival,
                            timeToStation: bus.timeToStation,
                            busNumber: bus.lineId,
                        });
                    });
                    incomingBuses.sort(function (a, b) {
                        return (a.timeToStation) - (b.timeToStation);
                    });
                    setBuses([...incomingBuses])
                    createRows(incomingBuses)
                }
            )
            .catch(error => console.error(error));
    }

    setInterval(function () {
        if (stopCode) {
            getBusesAtStop(stopCode)
        }
    }, 30000);

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
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <BasicTable/>
            </div>
        </>
    )
}

function App() {
    return (
        <div className="App">
            <h1>Bus Board</h1>
            <StopPointForm/>
        </div>
    );
}

export default App;
