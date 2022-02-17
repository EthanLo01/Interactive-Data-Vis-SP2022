const label = document.getElementById("pet-label")
const label_0 = document.getElementById("pet-label_0")
const label_1 = document.getElementById("pet-label_1")
const label_2 = document.getElementById("pet-label_2")
const button = document.getElementById('pet-submit')


var counter =  0;
let counter_c =  0;
let counter_d =  0;
let counter_p =  0;

function petNameUpdate0() {

    console.log(counter_c)

    counter += 1
    counter_c += 1

    label.innerText = "All your pets are " + counter + "."
    label_0.innerText = `You have ${counter_c} cats.`
    
}

function petNameUpdate1() {



    counter += 1
    counter_d = counter_d+1

    label.innerText = "All your pets are " + counter + "."
    label_1.innerText = `You have ${counter_d} pigs.`
    
}

function petNameUpdate2() {

    console.log(counter_c)

    counter += 1
    counter_p += 1

    label.innerText = "All your pets are " + counter + "."
    label_2.innerText = `You have ${counter_p} pigs.`
    
}

