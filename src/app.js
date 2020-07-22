const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

//using partitials
const hbs = require('hbs')

const app = express()
//the following line is to get the port number from heroku 
// and use a default if it is not running in heroku
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
// with the next line we can change the path where express 
// looks for the hbs files (views is the default and 
// it doesn't have to be specified this is in case we want
// to use a different one)
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req,res)=>{
    res.render('index',{
        title: 'Weather app',
        name: "Belen Robot"
    })
})

app.get('/about', ( req, res ) => {
    res.render('about', {
        title: 'About',
        name: 'Belen Robot'
    })
} )

app.get('/help', (req, res) => {
    res.render('help',{
        title: 'Help',
        message: 'This is a weather service: go to weather page and type your location!',
        name: 'Belen Robot'
    })
})

//This function is never used because index.html is the default
// app.get( '',( req, res)=>{
//     res.send('<h1>Hello express!</h1>')
// })

// app.get('/help',(req, res)=>{
//     res.send({
//         name: "belen",
//         age: 46
//     })
// })

// app.get('/about',(req, res)=>{
//     res.send('<h1 style="color:blue;">About page!</h1>')
// })

app.get('/weather',(req, res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide address'
        })
    }
    const address = req.query.address
    
    geocode(address,(error, {longitude,latitude,location}={})=>{
        if (error){
            return res.send({
                error: error
            })
        } 

        forecast(latitude, longitude, (error, forecastData="") => {
            if(error){
                return res.send({
                    error: error
                })
            }
            res.send({
                forecast: forecastData,
                address: address,
                location: location
            })
        })

    })
    
    
    
})

app.get('/products', (req,res) =>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res)=> {
    res.render('error404',{
        tittle: 'Help Not FOUND',
        message: 'Help article not found',
        name: 'Belen Robot'
    })
})

//This has to be the last handler 
//since it will match anything else is not handled
app.get('*', (req, res) =>{
    res.render('error404',{
        title: 404,
        message: 'Page not found',
        name: 'Belen Robot'
    })
})

//app.com
//app.com/help
//app.com/about
// ...

app.listen(port, ()=>{
    console.log('Server is up on port '+ port +'.')
})