// --------------------------------------------------------
// set up the canvas object
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// --------------------------------------------------------
// the data
data = {
    start_year: 2015,
    end_year: 2021,
    date_of_birth: "August 22, 1995",
    homes: [],
    relationships: [],
    events: [],
}
num_years = data.end_year - data.start_year + 1

// dimension specification
year_height_px = 110
canvas_width_px = 800
canvas_height_px = num_years * year_height_px
timeline_x0 = 75
timeline_x1 = canvas_width_px - 75
timeline_width_px = timeline_x1 - timeline_x0

// set the dimensions
ctx.canvas.height = canvas_height_px
ctx.canvas.width = canvas_width_px

// --------------------------------------------------------
// helper functions
function drawTick(x,y,height) {
    x = Math.ceil(x) // fix aliasing weirdness
    ctx.strokeStyle = "#333"
    ctx.lineWidth = '1'
    ctx.beginPath();
    ctx.moveTo(x, y-height/2);
    ctx.lineTo(x, y); // y+height/2
    ctx.closePath();
    ctx.stroke();
}

function drawTimeline(i) {
    y = Math.ceil((i+.5)*year_height_px)

    ctx.strokeStyle = "#333"
    ctx.lineWidth = '1'
    ctx.beginPath()
    ctx.moveTo(timeline_x0, y)
    ctx.lineTo(timeline_x1, y)
    ctx.stroke()

    tick_heights = [15,8,8]; // [major, minor, minor]
    for(k=0; k<12; k++) {
        tick_x = timeline_x0 + k*timeline_width_px/12;
        drawTick(tick_x, y, tick_heights[k%3])
    }
}

// --------------------------------------------------------
// draw
for(i = 0; i < num_years; i++) {

    year = data.start_year + i

    // background color
    ctx.fillStyle = ['#ffffff','#eeeeee'][i%2] // zebra
    ctx.fillRect(timeline_x0, i*year_height_px, 800, year_height_px)

    // timeline with tick marks
    drawTimeline(i)

    // year number
    ctx.font = '20px sans-serif'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#444'
    ctx.fillText(year, timeline_x0/2, (i+.5)*year_height_px+1)

    // age
    // bit of a mess but it's ACCURATE now
    dob = new Date(data.date_of_birth)
    leapyear = 0;
    if(year%4 == 0) {leapyear = 1}
    monthdays = [31,28+leapyear,31,30,31,30,31,31,30,31,30,31]
    function add(a,b) {return a+b}
    dayofyear = monthdays.slice(0,dob.getMonth()).reduce(add,0) + dob.getDate()
    // dayofyear = (365/12)*dob.getMonth() + dob.getDate() // approximate
    age = year - dob.getFullYear()
    x = timeline_x0 + dayofyear/365*timeline_width_px
    ctx.font = '15px sans-serif'
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#444'
    ctx.fillText(age, x, (i+.5)*year_height_px-12)
    ctx.beginPath()
    ctx.arc(x, (i+.5)*year_height_px, 4, 0, Math.PI * 2)
    ctx.fill()
}
