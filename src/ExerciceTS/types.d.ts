import { brand } from "./enum";

export type car = {
    brand: brand,
    model: model,
    price: number,
    kilometers: number,
    year: number,
}

type model = {
    name: string,
    color: string,
    fuelType: string,
}


