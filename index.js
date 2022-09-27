var MAX_POINTS=0;
var questions_to_answer=[];
var points=0;
var interval;
var time=0;


const QUESTIONS=[
    Question("What does HTML stand for?",[
        ["HyperTextMarkupLanguage",true],
        ["HighTensileMetalLace",false],
        ["HyperTextMarkdownLanguage",false],
    ]),
    Question("What can Javascript do?",[
        ["Style the HTML",true],
        ["Manipulate the DOM",true],
        ["Calculate the trajectory of a space shuttle",true],
        ["Serve web pages",true],
        ["Take you to the moon",false],
        ["Run BLAZINGLY FAST programs",false],
        ["Do your homework",false],
    ],true),
    Question("What is an abstraction?",[
        ["A simplicication of a more complex process",true],
        ["An abstract, complex, hard to understand concept",false],
        ["Modern art",false],
        ["A style of music",false],
    ]),
];
const LEADERBOARD=document.getElementById("leaderboard");
const POINTS_AREA=document.getElementById("points_area");
const POINTS_TEXT=document.getElementById("points_text");
const QUESTION_AREA=document.getElementById("question_area");
const QUESTION_TITLE=document.getElementById("question_title");
const QUESTION_ANSWER_LIST=document.getElementById("question_answer_list");
const SUBMIT_BUTTON=document.getElementById("submit_button");
const START_BUTTON=document.getElementById("start_quiz");
const RESTART_BUTTON=document.getElementById("restart_quiz");
const LEADERBOARD_BUTTON=document.getElementById("leaderboard_button");
const NAME_INPUT=document.getElementById("name_input");
const SCORE_SUBMIT_BUTTON=document.getElementById("score_submit_button");
const TIMER=document.getElementById("time");


/// `function Question(text:String,answers:[String],multi_choice:?Bool): QuestionObject`
function Question(text,answers,multi_choice) {
    let is_multi_choice=false;
    if (multi_choice) {
        is_multi_choice=true;
    }
    for (let i=0;i<answers.length;i+=1) {
        if (answers[i][1]) {
            MAX_POINTS+=1;
        }
    }
    let q={
        multi_choice:is_multi_choice,
        question:text,
        answers:answers,
        display_answers:function(question_box,answers_box) {
            question_box.innerText=String(QUESTIONS.length-questions_to_answer.length)+". "+this.question;
            answers_box.replaceChildren();
            let answer_indices=[];
            // Create a list of indices
            for (let i=0;i<this.answers.length;i+=1) {
                answer_indices.push(i);
            }
            console.log(answer_indices);
            while (answer_indices.length>0) {
                let answers_idx=answer_indices.splice(int_rand_range(0,answer_indices.length),1)[0];
                let box=document.createElement("li");
                box.setAttribute("correct",this.answers[answers_idx][1]);

                // Create and append the checkbox or radio button
                let selector_box=document.createElement("input");
                if (this.multi_choice) {
                    selector_box.setAttribute("type","checkbox");
                } else {
                    selector_box.setAttribute("type","radio");
                }
                let selector_box_name="answer"+String(answers_idx);
                selector_box.setAttribute("name","question_answer");
                selector_box.setAttribute("id",selector_box_name);
                box.appendChild(selector_box);

                // Create and append the question text to the question element
                let text=document.createElement("label");
                text.innerText=this.answers[answers_idx][0];
                text.setAttribute("for",selector_box_name);
                box.appendChild(text);
                answers_box.appendChild(box);
            }
        },
    };
    return q;
}
/// Copied from my module03 homework `Clinery1/code_bootcamp_mod03/index.js[12:17]`
/// @min: inclusive minimum value
/// @max: exclusive maximum value
/// @ret: Number
function int_rand_range(min,max) {
    return Math.floor((Math.random()*(max-min))+min);
}
/// `function submit_question(event:Event)`
function submit_question(event) {
    let incorrect=0;
    let correct=0;
    for (let i=0;i<QUESTION_ANSWER_LIST.children.length;i+=1) {
        let should_be_checked=QUESTION_ANSWER_LIST.children[i].getAttribute("correct")==="true";
        if (QUESTION_ANSWER_LIST.children[i].children[0].checked) {
            if (should_be_checked) {
                correct+=1;
            } else {
                incorrect+=1;
            }
        }
    }
    points+=correct;
    time-=incorrect;
    TIMER.innerText=String(time)+" seconds left";
    next_question();
}
function start_quiz() {
    QUESTION_AREA.style.display="";
    POINTS_AREA.style.display="none";
    LEADERBOARD.style.display="none";
    points=0;
    for (let i=0;i<QUESTIONS.length;i+=1) {
        questions_to_answer.push(i);
    }
    let seconds_per_question=5;
    time=seconds_per_question*QUESTIONS.length;
    TIMER.innerText=String(time)+" seconds left";
    interval=setInterval(function() {
        if (time===0) {
            show_points();
        } else {
            time-=1;
            TIMER.innerText=String(time)+" seconds left";
        }
    },1000);
    next_question();
}
function next_question() {
    if (questions_to_answer.length===0) {
        show_points();
    } else {
        let questions_idx=questions_to_answer.splice(int_rand_range(0,questions_to_answer.length),1)[0];
        QUESTIONS[questions_idx].display_answers(QUESTION_TITLE,QUESTION_ANSWER_LIST);
    }
}
function show_points() {
    clearInterval(interval);
    TIMER.innerText="";
    POINTS_AREA.style.display="";
    LEADERBOARD.style.display="none";
    QUESTION_AREA.style.display="none";
    POINTS_TEXT.innerText="Score: "+String(((points/MAX_POINTS)*100).toPrecision(4))+"% "+String(points)+"/"+String(MAX_POINTS)+" points";
}
function show_leaderboard() {
    LEADERBOARD.style.display="";
    START_BUTTON.style.display="";
    POINTS_AREA.style.display="none";
    QUESTION_AREA.style.display="none";
    let people=[];
    for (let i=0;i<localStorage.length;i+=1) {
        let name=localStorage.key(i);
        people.push([name,Number(localStorage.getItem(name))]);
    }
    people.sort(function(a,b){return b[1]-a[1]})
    let list=document.createElement("ol");
    LEADERBOARD.replaceChildren();
    for (let i=0;i<people.length;i+=1) {
        let item=document.createElement("li");
        item.innerText=people[i][0]+": "+String(people[i][1])+"%";
        list.appendChild(item);
    }
    if (people.length>0) {
        LEADERBOARD.appendChild(document.createElement("br"));
    }
    LEADERBOARD.appendChild(list);
    LEADERBOARD.appendChild(document.createElement("br"));
}


SUBMIT_BUTTON.addEventListener("click",submit_question);
SCORE_SUBMIT_BUTTON.addEventListener("click",function() {
    if (NAME_INPUT.value.length===0) {
        alert("Input a name to save your score");
        return;
    }
    let score=((points/MAX_POINTS)*100).toPrecision(4);
    console.log("Submit "+NAME_INPUT.value+" with "+String(score)+"%");
    let previous_score=localStorage.getItem(NAME_INPUT.value);
    if (previous_score===null||previous_score===undefined) {
        localStorage.setItem(NAME_INPUT.value,String(score));
    } else {
        if (Number(previous_score)<score) {
            localStorage.setItem(NAME_INPUT.value,String(score));
        }
    }
    show_leaderboard();
});
let start_function=function(event) {
    event.target.style.display="none";
    QUESTION_AREA.style.display="";
    start_quiz();
};
RESTART_BUTTON.addEventListener("click",start_function);
START_BUTTON.addEventListener("click",start_function);
LEADERBOARD_BUTTON.addEventListener("click",show_leaderboard);
show_leaderboard();
