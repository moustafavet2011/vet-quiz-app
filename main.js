//set the variables
let questionCountSpan = document.querySelector(".quiz-info .count span");
let categorySpan = document.querySelector(".category span");
let bullets = document.querySelector(".bullets");
let spanBox = document.querySelector(".bullets .spans-box");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit");
let theResultsContainer = document.querySelector(".results");
let countDownTimer = document.querySelector(".bullets .countdown");
let restartBtn = document.querySelector(".restart");
//set the options
let qIndex = 0;
let currentIndex = 0;
let right = 0;
let wrong = 0;
let countDownInterval;

//Create the function that get the questions
function getQuestions(){
    //create a request for the api
    let myRequest = new XMLHttpRequest();

    //check for the request parameters
    myRequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){

            //get an object from the response to deal with it
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            createBullets(qCount)
            //call the add question data function
            addQuestionsData(questionObject[currentIndex], qCount);
            //call the count down timer function
            countdown(45, qCount);
            qNumber(currentIndex + 1, qCount);
            //Handle the category of question before the click
            handleCategory(questionObject[currentIndex] , qCount);
            //submit answer function
            submitBtn.onclick = () => {

                //get the right answer
                let rightAnswer = questionObject[currentIndex].right_answer;
                //increase current index
                currentIndex ++ ;
                //Handle the category of question after the click
                handleCategory(questionObject[currentIndex] , qCount);
                //check the answer if it is correct
                qNumber(currentIndex + 1, qCount);
                checkAnswer(rightAnswer, qCount);
                //remove old question title
                quizArea.innerHTML = '';
                //remove old question's answers
                answersArea.innerHTML = '';
                addQuestionsData(questionObject[currentIndex], qCount);

                //call the handle bullets classes function
                handleBullets();

                //call the count down timer with the click on submit button
                clearInterval(countDownInterval);
                countdown(45, qCount);
                //call the show result function
                showResult(qCount);
            }

        }
    };
    // open the request with get method and the url
    myRequest.open("GET", "questions.json", true);
    //send the request
    myRequest.send();
}
getQuestions();

//Create the function that create the bullets
function createBullets(num) {
    // questionCountSpan.innerHTML = num ;
    //create span through a loop
    for(let i=0; i< num ; i++) {
        //check if it is the first bullet to add on class

        //create the spans for the bullets
        let  spanBullet = document.createElement("span");
        if(i === 0) {
            spanBullet.className = "on";
        }
        //Append the spans to the main div
        spanBox.appendChild(spanBullet);
    }
};

//Set the add questions data function
function addQuestionsData(obj, count) {
    if(currentIndex < count){
            //Create H2 to add the title
    let qTitle = document.createElement("h2");
    //create the title text
    let titleText = document.createTextNode(obj.title);
    //append the title text to the headings
    qTitle.appendChild(titleText);
    //Append the heading to the quiz area
    quizArea.appendChild(qTitle);

    //Create the answers

    for(let i = 1; i <= 5; i++){
    
        //create the main div
        let answerDiv = document.createElement("div");
        //give it a class
        answerDiv.className = "answer";
        // create the input element
        answerInput = document.createElement("input");
        // give it a class and id and data attribute
        answerInput.name = "question";
        answerInput.type = "radio";
        answerInput.id = `answer_${i}`;
        answerInput.dataset.answer = obj[`answer_${i}`];
        //create label element
        let answerLabel = document.createElement("label");
        //add an for attribute
        answerLabel.htmlFor = `answer_${i}`;
        //create labelText
        let labelText = document.createTextNode(obj[`answer_${i}`]);
        answerLabel.appendChild(labelText);
        //append the answer input element and the label element to the answer div
        answerDiv.appendChild(answerInput);
        answerDiv.appendChild(answerLabel);
        //append the answer div to the main answers area
        answersArea.appendChild(answerDiv);
    }
    }

}

function checkAnswer(rAnswer, count){
    //get all the answers

    let allAnswers = document.getElementsByName("question");
    let theChosenAnswer ;

    allAnswers.forEach((answer)=>{
        if(answer.checked){
            theChosenAnswer = answer.dataset.answer;
            if(theChosenAnswer === rAnswer){
                right ++;
            }
            else{
                wrong ++;
            }
        }
    });
}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans-box span");
    let bulletsSpansArray = Array.from(bulletsSpans);
    bulletsSpansArray.forEach((span, index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    });

}
function showResult(count){
    let theResults ;
    if(currentIndex ===count){
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        restartBtn.style.display = "block";
            if (right > count / 2 && right < count) {
                theResults = `<span class="good">Good</span>, ${right} Right answer/s From ${count} questions`;
            } else if (right === count) {
                theResults = `<span class="perfect">Perfect</span>, All Answers Is Right`;
            } else {
                theResults = `<span class="bad">Bad</span>, ${right} Right answer/s From ${count} questions`;
            }

    theResultsContainer.innerHTML = theResults;
    theResultsContainer.style.padding = "10px";
    theResultsContainer.style.backgroundColor = "white";
    theResultsContainer.style.marginTop = "10px"
        }
}
//set the count down function
function countdown(duration, count) {
    if(currentIndex < count) {
        let minutes , seconds ;
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes ;
            seconds = seconds < 10 ? `0${seconds}` : seconds ;

            countDownTimer.innerHTML = `${minutes} : ${seconds}`;
            if(--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }

        },1000);
    }
}
//set the question number handler
function qNumber(index , count) {
    questionCountSpan.innerHTML =  `${index} of ${count}`;
    if(index>count){
        questionCountSpan.innerHTML = count ;
    }
}
//set the restart button
restartBtn.onclick = () => {
    location.reload();
}
//set the category handle function
function handleCategory(element , count){

    if(currentIndex < count){
        categorySpan.innerHTML = element.category;

    }

}