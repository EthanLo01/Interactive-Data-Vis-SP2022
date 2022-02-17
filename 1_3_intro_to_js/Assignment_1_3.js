console.log('hello world');

const myName=("Ethan")
console.log(myName)

const label = document.getElementById("pet-label")
const input = document.getElementById("pet-input")
const button = document.getElementById('pet-submit')

let petName;
var counter =  0
function petNameUpdate() {
    petName = input.value
    console.log(petName)

    counter += 1
    label.innerText = counter
    button.innerText = "Name it again."
    input.value = ""
}

