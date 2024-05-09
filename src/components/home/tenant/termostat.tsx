"use client";
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";

export const Thermostat = () => {
    const [temperatureValue, setTemperatureValue] = useState(20);
   
    const increaseTemperature = () => {
        const newTemperature = temperatureValue + 1;
        setTemperatureValue(newTemperature);

    };

    const decreaseTemperature = () => {
        const newTemperature = temperatureValue - 1;
        setTemperatureValue(newTemperature);
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
                        className={`bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 focus:outline-none ${
                            temperatureValue <= 19 ? 'disabled:bg-gray-800' : ''
                        }`}
                        disabled={temperatureValue <= 19}
                    >
                        -
                    </button>
                    <button
                        onClick={increaseTemperature}
                        className={`bg-gray-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none hover:bg-gray-800 ${
                            temperatureValue >= 22 ? 'disabled:bg-gray-800' : ''
                        }`}
                        disabled={temperatureValue >= 22}
                    >
                        +
                    </button>
                </div>
            </Card>
    
    );
};