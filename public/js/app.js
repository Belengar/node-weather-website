// fetch('http://puzzle.mead.io/puzzle').then((response)=> {
//     response.json().then((data)=>{
//         console.log(data)
//     })
// })



const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1') //look for element by id # // .className
const messageTwo = document.querySelector('#message-2') //look for element by id # // .className

//messageOne.textContent = 'From Javascript'

weatherForm.addEventListener('submit',(e)=> {
    e.preventDefault()
    
    const location = search.value
    messageOne.textContent = 'Loading weather info ...'
    messageTwo.textContent = ''
    fetch('http://localhost:3000/weather?address='+location).then((response)=> {
        response.json().then((data)=>{
            if(data.error){
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location 
                messageTwo.textContent = data.forecast
            } 
    
        })
    })
})