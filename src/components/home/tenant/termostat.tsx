"use client";
import React, { useState } from 'react';
import { setContTemp } from "@/lib/queryHelper";
import { changeTempOnTerm } from "@/actions";
import { Card } from "@/components/ui/card";

export const Thermostat = ({
    session,
    nodeID,
    currentValue,
    }: {
    session: string
    nodeID: string;
    currentValue: {termotemp: number | null};

}) => {

    const temperatureUrls = new Map([
        [19, '/rules/rules/activate/66192781f8ae26a22e0ebdd8'],
        [20, '/rules/rules/activate/66192789f8ae26a22e0ebdda'],
        [21, '/rules/rules/activate/6619278cf8ae26a22e0ebddd'],
        [22, '/rules/rules/activate/66192790f8ae26a22e0ebddf'],
    ]);

    const initialTermotemp = currentValue.termotemp ?? 0
    const [temperatureValue, setTemperatureValue] = useState(initialTermotemp);
   // setContTemp(session, nodeID, currentValue, 19)

    const increaseTemperature = async () => {
        const newTemperature = temperatureValue + 1;
        setTemperatureValue(newTemperature);
        const url = temperatureUrls.get(newTemperature);
        if (url) {
            const response = await changeTempOnTerm(session, url);
            setContTemp(session, nodeID, currentValue, newTemperature)
        }
    };
    const decreaseTemperature = async () => {
        const newTemperature = temperatureValue - 1;
        setTemperatureValue(newTemperature);
        const url = temperatureUrls.get(newTemperature);
        if (url) {
            const response = await changeTempOnTerm(session, url);
            console.log("Temperature change response:", response);
            setContTemp(session, nodeID, currentValue, newTemperature)
        }
    };



    return (
        <Card className="w-64  rounded-2xl pt-4 bg-muted justify-center">
            <div className="temperature-display-container h-2/3 flex items-center justify-center">
                <div className="flex items-center justify-center  text-white text-center text-4xl  transition duration-500">
                    {temperatureValue}°C
                </div>
            </div>
            <div className="button-container flex justify-between items-center px-4">
                <button
                    onClick={decreaseTemperature}
                    className={`bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 focus:outline-none ${temperatureValue <= 19 ? 'disabled:bg-gray-800' : ''
                        }`}
                    disabled={temperatureValue <= 19}
                >
                    -
                </button>
                <button
                    onClick={increaseTemperature}
                    className={`bg-gray-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none hover:bg-gray-800 ${temperatureValue >= 22 ? 'disabled:bg-gray-800' : ''
                        }`}
                    disabled={temperatureValue >= 22}
                >
                    +
                </button>
            </div>
        </Card>

    );
};