const label = document.getElementById("pet-label")
const button = document.getElementById('pet-submit')


var counter =  0;
function petNameUpdate() {

    console.log(counter)

    counter += 1
    label.innerText = "All your pets are " + counter + "."
    
}

