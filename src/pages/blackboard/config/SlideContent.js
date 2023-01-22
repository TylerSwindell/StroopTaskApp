import {colorOptionsObj} from "./TextSettings"
const data = {
    slides: [
        {
            slideText: `Throughout this task, you will 
                        be presented with words in different 
                        color "inks." You are asked to press 
                        the corresponding key for the color 
                        of the ink used for the word,  
                        <br> 
                        "<span class="${colorOptionsObj.redText}">R</span>" for <span class="${colorOptionsObj.redText}">red</span> ink
                        <br> 
                        "<span class="${colorOptionsObj.yellowText}">Y</span>" for <span class="${colorOptionsObj.yellowText}">yellow</span> ink
                        <br> 
                        "<span class="${colorOptionsObj.greenText}">G</span>" for <span class="${colorOptionsObj.greenText}">green</span> ink
                        <br> 
                        "<span class="${colorOptionsObj.blueText}">B</span>" for <span class="${colorOptionsObj.blueText}">blue</span> ink
                        <br> <br> 
                        For example, "<span class="${colorOptionsObj.redText}">Green</span>" would be 
                        "<span class="${colorOptionsObj.redText}">R</span>" 
                        since it is printed in <span class="${colorOptionsObj.redText}">red</span> ink.`,
            continueText: "PRESS 'SPACE' TO CONTINUE",
            continueKeys: "space"
        },
        {
            slideText: `You will get ten practice words before your real task perfomance is recorded. 
                        Between each word, a fixation cross will be breifly presented. 
                        You should not press anything when presented with the cross, the task will proceed automatically. 
                        Similarly, if you do not indicate ink color within the limited time period, 
                        your response will automatically be recorded as <span class="${colorOptionsObj.redText}">incorrect</span> and the task will proceed to the next word. 
                        You will not be notified whether your response is correct or incorrect.`,
            continueText: "PRESS 'SPACE' TO CONTINUE",
            continueKeys: "space"
        },
        {
            slideText: `Practice Task Beginning...`,
            continueText: "PRESS 'SPACE' TO BEGIN PRACTICE",
            continueKeys: "space"
        }
    ],
    final: {
        slideText: `The practice round is complete. 
                    <br> <br>
                    You will now begin the final trial that will be recorded.`,
        continueText: "PRESS 'SPACE' TO BEGIN",
        continueKeys: "space"
    }
}

export default data