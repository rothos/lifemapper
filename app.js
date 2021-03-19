// --------------------------------------------------------
// set up the canvas object
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --------------------------------------------------------
// the data
data = {
    start_year: 2015,
    end_year: 2021,
    date_of_birth: "August 22, 1995",
    homes: [
        {
            start_date: "October 22, 2015",
            end_date: "15 June, 2016",
            text: "Paris"
        },
        {
            start_date: "September 1, 2016",
            end_date: "August 31, 2018",
            text: "New Haven"
        }
    ],
    jobs: [
        {
            start_date: "March 11, 2016",
            end_date: "September 28, 2017",
            text: "bellhop"
        }
    ],
    relationships: [
        {
            start_date: "June 12, 2016",
            end_date: "July 8, 2018",
            text: "Alex"
        },
        {
            start_date: "December 4, 2017",
            end_date: "present",
            text: "Bo"
        },
        {
            start_date: "July 21, 2018",
            end_date: "September 2, 2019",
            text: "Cas"
        },
        {
            start_date: "July 21, 2018",
            end_date: "November 19, 2018",
            text: "Di"
        },
        {
            start_date: "November 19, 2018",
            end_date: "April 1, 2019",
            text: "Ez"
        }
    ],
    events: [
        {
            date: "April 6, 2019",
            text: "got married"
        },
        {
            date: "February 15, 2016",
            text: "bought a car"
        },
        {
            date: "November 25, 2020",
            text: "got covid"
        }
    ]
}

// --------------------------------------------------------
// the styles
styles = {
    events_color: "#b4a"
}


// --------------------------------------------------------
// setting up the code box and its events

// put the data in the code box
datacode = document.getElementById('datacode')
datacode.value = JSON.stringify(data, null, 4)

// put the styles in the code box
stylescode = document.getElementById('stylescode')
stylescode.value = JSON.stringify(styles, null, 4)

// add an event listener to redraw the lifemap each time
// the code is changed
datacode.addEventListener('input', function() {
    clearCanvas()
    data = JSON.parse(datacode.value)
    styles = JSON.parse(stylescode.value)
    drawLifemap(data, styles)
})

// add an event listener to redraw the lifemap each time
// the code is changed
stylescode.addEventListener('input', function() {
    clearCanvas()
    data = JSON.parse(datacode.value)
    styles = JSON.parse(stylescode.value)
    drawLifemap(data, styles)
})


// --------------------------------------------------------
// the main draw function
function drawLifemap(data, styles) {

    // --------------------------------------------------------
    // dimension specification
    year_height_px = 120
    canvas_width_px = 800
    num_years = data.end_year - data.start_year + 1
    canvas_height_px = num_years * year_height_px
    timeline_x0 = 75
    timeline_x1 = canvas_width_px - 60
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

    function dateX(date, leapyear=false) {
        if(leapyear) {
            leapdays = 1;
        } else {
            leapdays = 0;
        }
        monthdays = [31,28+leapdays,31,30,31,30,31,31,30,31,30,31]
        function add(a,b) { return a+b }
        dayofyear = monthdays.slice(0,date.getMonth()).reduce(add,0) + date.getDate()
        x = timeline_x0 + dayofyear/365*timeline_width_px
        return x
    }

    function getDateObj(datestring) {
        if(datestring.toLowerCase() == "present") {
            return new Date(Date.now())
        }
        return new Date(datestring)
    }

    // --------------------------------------------------------
    // draw

    // the basics
    for(i = 0; i < num_years; i++) {

        year = data.start_year + i

        // background color
        ctx.fillStyle = ['#fcfcfc','#eaeaea'][i%2] // zebra
        ctx.fillRect(0, i*year_height_px,
            canvas_width_px,
            year_height_px)

        // timeline with tick marks
        drawTimeline(i)

        // year number
        ctx.font = '20px sans-serif'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#444'
        ctx.fillText(year, timeline_x0/2, (i+.5)*year_height_px+1)

        // age
        dob = new Date(data.date_of_birth)
        x = dateX(dob, year%4==0)
        age = year - dob.getFullYear()
        ctx.font = '15px sans-serif'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#444'
        ctx.fillText(age, x, (i+.5)*year_height_px-12)
        ctx.beginPath()
        ctx.arc(x, (i+.5)*year_height_px, 4, 0, Math.PI * 2)
        ctx.fill()
    }

    // events
    for(k = 0; k < data.events.length; k++) {
        event = data.events[k]
        date = new Date(event.date)
        x = dateX(date, year%4==0)
        yearN = date.getFullYear() - data.start_year
        ctx.font = '15px sans-serif'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'center'
        ctx.fillStyle = styles.events_color
        ctx.fillText(event.text, x, (yearN+.5)*year_height_px-12)
        ctx.beginPath()
        ctx.arc(x, (yearN+.5)*year_height_px, 4, 0, Math.PI * 2)
        ctx.fill()
    }

    // homes
    for(k = 0; k < data.homes.length; k++) {
        home = data.homes[k]
        d0 = new Date(home.start_date)
        d1 = getDateObj(home.end_date)
        yr0 = d0.getFullYear()
        yr1 = d1.getFullYear()
        yrk = yr0
        while(yrk <= yr1) {
            if(yrk == yr0) {
                x0 = dateX(d0, year%4==0)
            } else {
                x0 = timeline_x0
            }
            if(yrk == yr1) {
                x1 = dateX(d1, year%4==0)
            } else {
                x1 = timeline_x1
            }
            y = (yrk-data.start_year+.5)*year_height_px
            ctx.fillStyle = ['#6bb','#6c8'][k%2]
            ctx.fillRect(x0, y+27, x1-x0, 20)

            ctx.font = '14px sans-serif'
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#333'
            ctx.fillText(home.text, (x0+x1)/2, y+27+11)

            yrk++
        }
    }

    // jobs
    for(k = 0; k < data.jobs.length; k++) {
        job = data.jobs[k]
        d0 = new Date(job.start_date)
        d1 = getDateObj(job.end_date)
        yr0 = d0.getFullYear()
        yr1 = d1.getFullYear()
        yrk = yr0
        while(yrk <= yr1) {
            if(yrk == yr0) {
                x0 = dateX(d0, year%4==0)
            } else {
                x0 = timeline_x0
            }
            if(yrk == yr1) {
                x1 = dateX(d1, year%4==0)
            } else {
                x1 = timeline_x1
            }
            y = (yrk-data.start_year+.5)*year_height_px
            ctx.fillStyle = ['#dd8', '#dd8'][k%2]
            ctx.fillRect(x0, y+11, x1-x0, 12)

            ctx.font = '14px sans-serif'
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#333'
            ctx.fillText(job.text, (x0+x1)/2, y+7+11)

            yrk++
        }
    }

    // relationships
    // first: loop through and calculate the offset of each
    for(k = 0; k < data.relationships.length; k++) {
        relk = data.relationships[k]

        if(k == 0) {
            relk._offset = 0
            continue
        }

        d0 = new Date(relk.start_date).getTime()
        d1 = getDateObj(relk.end_date).getTime()

        offsets = []
        for(r = 0; r < k; r++) {
            relr = data.relationships[r]
            r0 = new Date(relr.start_date).getTime()
            r1 = getDateObj(relr.end_date).getTime()
            if(    (r0 >= d0 && r0 < d1)
                || (r1 > d0 && r1 <= d1)
                || (r0 <= d0 && r1 >= d1) ) {
                offsets.push(relr._offset)
            }
        }
        offset = 0
        while(offsets.includes(offset)) { offset++ }
        data.relationships[k]._offset = offset
    }

    // then: draw relationships
    for(k = 0; k < data.relationships.length; k++) {
        rel = data.relationships[k]
        d0 = new Date(rel.start_date)
        d1 = getDateObj(rel.end_date)
        yr0 = d0.getFullYear()
        yr1 = d1.getFullYear()
        yrk = yr0
        while(yrk <= yr1) {
            if(yrk == yr0) {
                x0 = dateX(d0, year%4==0)
            } else {
                x0 = timeline_x0
            }
            if(yrk == yr1) {
                x1 = dateX(d1, year%4==0)
            } else {
                x1 = timeline_x1
            }
            y = (yrk-data.start_year+.5)*year_height_px

            yprime = rel._offset*8

            ctx.fillStyle = ['#fab', '#fba'][k%2]
            ctx.fillRect(x0, y-yprime-34, x1-x0, 5)

            ctx.font = '14px sans-serif'
            ctx.textBaseline = 'alphabetic'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#333'
            ctx.fillText(rel.text, (x0+x1)/2, y+7-yprime-34)

            yrk++
        }
    }

}

// let er rip
drawLifemap(data, styles);
