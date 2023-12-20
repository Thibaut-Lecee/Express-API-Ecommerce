import {car} from "./types";


export const displayCar = (car: car) => {
    console.log(car);
}

export const calculateKmPerYear = (car: car) => {
    console.log(car.kilometers / (new Date().getFullYear() - car.year));
}
