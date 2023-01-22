import { colorOptions, textOptions } from "../../config/TextSettings"

const HIGH = (colorOptions.length-1), LOW = 1;

export const getRandomStroopText = () => {
    const {textCode, colorCode, congruent} = generateRandomCodes()
    return {
        text: textOptions[textCode],
        color: colorOptions[colorCode],
        congruent
    }
}

export const  generateRandomCodes = () => {
    const textCode = (Math.floor(Math.random() * HIGH) + LOW)
    const colorCode = (Math.floor(Math.random() * HIGH) + LOW)
    return ({ textCode, colorCode,
        congruent: (colorCode === textCode)
    })
}