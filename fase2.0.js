// Selecionando todos os elementos necessários
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

start_btn.onclick = () => info_box.classList.add("activeInfo");
exit_btn.onclick = () => info_box.classList.remove("activeInfo");
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuetions(0);
    queCounter(1);
    startTimer(timeValue);
    startTimerLine(widthValue);
};

function redirectToDefeat() {
    window.location.href = "derrota1.html";
}

function redirectToVictory() {
    window.location.href = "vitória_fase2.html";
}

// Quando o usuário seleciona uma opção
function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correcAns = questions[que_count].answer;
    const allOptions = option_list.children.length;

    if (userAns === correcAns) {
        userScore += 1;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag);
        redirectToDefeat(); // derrota imediata
        return;
    }

    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }

    next_btn.classList.add("show"); // Só aparece se acertou
}

function startTimer(time) {
    counter = setInterval(() => {
        timeCount.textContent = time < 10 ? "0" + time : time;
        time--;
        if (time < 0) {
            clearInterval(counter);
            clearInterval(counterLine);
            redirectToDefeat();
        }
    }, 1000);
}

function startTimerLine(time) {
    counterLine = setInterval(() => {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) clearInterval(counterLine);
    }, 29);
}

function queCounter(index) {
    bottom_ques_counter.innerHTML =
        '<span><p>' + index + "</p> de <p>" + questions.length + "</p> Questões</span>";
}

function showQuetions(index) {
    const que_text = document.querySelector(".que_text");
    que_text.innerHTML = '<span>' + questions[index].numb + ". " + questions[index].question + "</span>";
    
    option_list.innerHTML =
        '<div class="option"><span>' + questions[index].options[0] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[1] + "</span></div>";

    const option = option_list.querySelectorAll(".option");
    option.forEach((opt) => opt.setAttribute("onclick", "optionSelected(this)"));
}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Tempo restante";
};

quit_quiz.onclick = () => window.location.reload();

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Próxima pergunta
next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuetions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Tempo restante";
        next_btn.classList.remove("show");
    } else {
        // Última pergunta foi respondida corretamente → vitória
        redirectToVictory();
    }
};
