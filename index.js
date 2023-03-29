const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]"); //all checkboxes with inpur type as checkbox

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; //string of symbols to generate passwords


//initially values
let password = "";     //password is empty at start
let passwordLength = 10;  //the value when the page is loaded
let checkCount = 0;
handleSlider();

//set strength circle color to grey
setIndicator("#ccc");


//sets passwordLength on the UI after sliding
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// sets color and shadow of strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// passed two values to get a random password between them
function getRndInteger(min, max) {
    
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRndInteger(0,9);  //func. called to get random no. between 0-9
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))  //func. called for random lower case letter an changed the ascii value to string
}

function generateUpperCase() {  //upper case random character
    return String.fromCharCode(getRndInteger(65,91))  
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


// some rules to calculate the strength of the password
function calcStrength() {

    // initially all checked box value given false before clicked
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // check condition if the checkbox is being clicked
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    // calculating which check boxes are being selected  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// copying the content using coping call to copyAPI to copy password to clipboard
async function copyContent() {

    // try catch used for error handling
    try {
        // navigator.clipboard.writeText() methood returns a promise if the text is copied or not to clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    //to make copy span visible by using active class in css
    copyMsg.classList.add("active");

    // timout for the copied displayed by active class
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    // cond. if the checkboxes are changed to check
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition if the length of password is less than than the checkboxes selected
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        // handleSlider called cause the password length changes
        handleSlider();
    }
}

// eventListene on the checkboxes for a count of checkboxes uding loop
// here we called the handleCheckBoxChange() func. if the checkboxes value changes
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// eventListener on the slider
// e is the slider value
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


// eventListener on copy button when passwod generated
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

// password now generates here adding an eventListener of click event
generateBtn.addEventListener('click', () => {

    //none of the checkbox are selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    // created a function array that keeps the random generated characters
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
    
});