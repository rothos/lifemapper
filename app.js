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
    end_year: "present",
    date_of_birth: "August 22, 1995",
    include_birthdays: true,
    ribbons: {
        homes: [
            {
                start_date: "October 22, 2015",
                end_date: "15 June, 2016",
                text: "Paris"
            },
            {
                start_date: "15 June, 2016",
                end_date: "Sept 1, 2018",
                text: "New Haven"
            },
            {
                start_date: "Sept 1, 2018",
                end_date: "January 9, 2020",
                text: "Zanzibar"
            },
            {
                start_date: "9 Jan 2020",
                end_date: "23 March 2020",
                text: "Maui"
            },
            {
                start_date: "23 March 2020",
                end_date: "present",
                text: "Zanzibar"
            }
        ],
        jobs: [
            {
                start_date: "March 11, 2016",
                end_date: "15 June, 2016",
                text: "bellhop"
            },
            {
                start_date: "September 28, 2016",
                end_date: "April 9, 2018",
                text: "tutor"
            },
            {
                start_date: "July 4, 2018",
                end_date: "April 9, 2020",
                text: "pop star"
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
        ]
    },
    events: [
        {
            date: "August 6, 2019",
            text: "got married",
            styles: {
                text_xoffset: -20
            }
        },
        {
            date: "February 15, 2016",
            text: "bought a car"
        },
        {
            date: "November 25, 2020",
            text: "got covid",
            styles: {
                canvas_styles: {
                    fillStyle: "red"
                }
            }
        }
    ]
}

// --------------------------------------------------------
// the styles
// sizes are in px
styles = {
    canvas: {
        width: 800,
        year_height: 150,
        gutter_left: 75,
        gutter_right: 60,
        bg_color: "#fff" // give an array if you want to zebra the bg
    },
    year_numbers: {
        canvas_styles: {
            font: "20px sans-serif",
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "#444"
        },
        text_yoffset: 1
    },
    birthdays: {
        canvas_styles: {
            font: "13px sans-serif",
            textBaseline: "alphabetic",
            textAlign: "center",
            fillStyle: "#444"
        },
        text_yoffset: -8,
        text_xoffset: 0,
        dotsize: 3
    },
    events: {
        canvas_styles: {
            fillStyle: "#b4a",
            font: "13px sans-serif",
            textBaseline: "alphabetic",
            textAlign: "center"
        },
        text_yoffset: -8,
        text_xoffset: 0,
        dotsize: 3
    },
    ribbons: {
        homes: {
            canvas_styles: {
                font: "14px sans-serif",
                textBaseline: "middle",
                textAlign: "center"
            },
            bg_color: ["#2a6f97","#468faf"], // fillStyles for bg
            font_color: "#fff",              // fillStyles for text
            ribbon_yoffset: 22,  // relative to vertical center of timeline
            ribbon_width: 28,    // width (actually height) of ribbon
            text_yoffset: 15     // relative to center of ribbon
        },
        jobs: {
            canvas_styles: {
                font: "14px sans-serif",
                textBaseline: "middle",
                textAlign: "center"
            },
            placeholder_color: "",//""rgb(255,215,0,.3)",
            bg_color: ["#ffac81","#ff928b"], // fillStyles for bg
            font_color: "#333",              // fillStyles for text
            ribbon_yoffset: 8,   // relative to vertical center of timeline
            ribbon_width: 13,    // width (actually height) of ribbon
            text_yoffset: 7      // relative to center of ribbon
        },
        relationships: {
            canvas_styles: {
                font: "12px sans-serif",
                textBaseline: "alphabetic",
                textAlign: "center"
            },
            bg_color: ["#e4c1f9","#a9def9","#ffc8dd","#b8e0d2"],
            font_color: "#333",  // fillStyles for text
            ribbon_yoffset: -28, // relative to vertical center of timeline
            ribbon_width: 5,     // width (actually height) of ribbon
            text_yoffset: 7,     // relative to center of ribbon
            stack_ribbons: true, // stack overlapping ribbons?
            stack_offset: -8     // stack vertical shift in px
        }
    }
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

    // little bit of parsing
    if(data.end_year.toLowerCase() == "present") {
        now = new Date(Date.now())
        data.end_year = now.getFullYear()
    }
    num_years = data.end_year - data.start_year + 1

    // --------------------------------------------------------
    // dimension specification
    year_height_px = styles.canvas.year_height
    canvas_width_px = styles.canvas.width
    canvas_height_px = num_years * year_height_px
    timeline_x0 = styles.canvas.gutter_left
    timeline_x1 = canvas_width_px - styles.canvas.gutter_right
    timeline_width_px = timeline_x1 - timeline_x0

    // set the dimensions
    ctx.canvas.height = canvas_height_px
    ctx.canvas.width = canvas_width_px

    // --------------------------------------------------------
    // helper functions
    function drawTick(x,y,height,color) {
        x = .5 + Math.ceil(x) // fix aliasing weirdness
        ctx.strokeStyle = color
        ctx.lineWidth = '1'
        ctx.beginPath()
        ctx.moveTo(x, y-height/2)
        ctx.lineTo(x, y+height/2)
        ctx.stroke()
    }

    function drawTimeline(i) {
        y = .5 + Math.ceil((i+.5)*year_height_px) // fix aliasing weirdness

        ctx.strokeStyle = "#c8c8c8"
        ctx.lineWidth = '1'
        ctx.beginPath()
        ctx.moveTo(timeline_x0, y)
        ctx.lineTo(timeline_x1, y)
        ctx.stroke()

        tick_heights = [135,108,108] // [major, minor, minor]
        tick_colors = ['#d8d8d8','#ddd','#ddd']
        for(k=0; k<12; k++) {
            tick_x = timeline_x0 + k*timeline_width_px/12;
            drawTick(tick_x, y, tick_heights[k%3], tick_colors[k%3])
        }
    }

    // get the x-coordinate (on the canvas) of a particular date
    // along the timeline
    function dateX(date) {
        if(date.getFullYear() % 4 == 0) {
            leapdays = 1;
        } else {
            leapdays = 0;
        }
        monthdays = [31,28+leapdays,31,30,31,30,31,31,30,31,30,31]
        function add(a,b) { return a+b }
        dayofyear = monthdays.slice(0,date.getMonth()).reduce(add,0) + date.getDate()
        x = timeline_x0 + dayofyear/365*timeline_width_px
        return Math.floor(x)
    }

    function getDateObj(datestring) {
        if(datestring.toLowerCase() == "present") {
            return new Date(Date.now())
        }
        return new Date(datestring)
    }

    function getFillStyle(color_or_colors, k) {
        cc = _.flatten([color_or_colors]) // ensure is array
        return cc[k % cc.length]
    }

    // function for drawing a set of ribbons given some styles
    // (e.g. homes, jobs, relationships)
    function drawRibbons(items, styles) {

        // if we are stacking the ribbons, first need to
        // calculate the stack offsets (vertical shifts for events
        // that occupy overlapping dates, so ribbons don't overlap)
        if(styles.stack_ribbons) {
            for(var k = 0; k < items.length; k++) {
                item = items[k]

                if(k == 0) {
                    item._offset = 0
                    continue
                }

                d0 = new Date(item.start_date).getTime()
                d1 = getDateObj(item.end_date).getTime()

                offsets = []
                for(var i = 0; i < k; i++) {
                    it = items[i]
                    i0 = new Date(it.start_date).getTime()
                    i1 = getDateObj(it.end_date).getTime()
                    if(    (i0 >= d0 && i0 < d1)
                        || (i1 > d0 && i1 <= d1)
                        || (i0 <= d0 && i1 >= d1) ) {
                        offsets.push(it._offset)
                    }
                }
                offset_n = 0
                while(offsets.includes(offset_n)) { offset_n++ }
                item._offset = offset_n

                // now add to its item styles so it will be drawn offset properly
                item.styles = item.styles || {}
                item.styles.ribbon_yoffset = item.styles.ribbon_yoffset || 0
                item.styles.ribbon_yoffset += styles.ribbon_yoffset + (offset_n * styles.stack_offset)
            }
        }

        // draw placeholder ribbon if we are to
        // note: doesn't take into account stackingness of ribbons
        //       and thus a placeholder will only be drawn for the
        //       primary ribbon of any set of stacked ribbons
        if(styles.placeholder_color) {
            ctx.fillStyle = styles.placeholder_color
            for(k = 0; k < data.end_year - data.start_year; k++) {
                ctx.fillRect(timeline_x0,
                    (k+.5)*year_height_px + styles.ribbon_yoffset,
                    timeline_width_px,
                    styles.ribbon_width)
            }
        }

        // now draw each ribbon
        for(var k = 0; k < items.length; k++) {
            item = items[k]
            d0 = new Date(item.start_date)
            d1 = getDateObj(item.end_date)
            yr0 = d0.getFullYear()
            yr1 = d1.getFullYear()
            yrk = yr0
            while(yrk <= yr1) {
                if(yrk == yr0) {
                    x0 = dateX(d0)
                } else {
                    x0 = timeline_x0
                }
                if(yrk == yr1) {
                    // the + 1 creates a pixel gap between adjacent ribbons
                    x1 = dateX(d1)
                    if(x1 < timeline_x1) x1--
                } else {
                    x1 = timeline_x1
                }

                y = Math.floor((yrk-data.start_year+.5)*year_height_px)

                // set the styles
                item_canvas_styles = {}
                try { item_canvas_styles = item.styles.canvas_styles } catch {}
                s = _.merge(_.cloneDeep(styles), item.styles)
                _.merge(ctx, s.canvas_styles)

                ctx.fillStyle = getFillStyle(s.bg_color, k)
                ctx.fillRect(x0, y+s.ribbon_yoffset, x1-x0, s.ribbon_width)

                ctx.fillStyle = getFillStyle(s.font_color, k)
                ctx.fillText(item.text, (x0+x1)/2, y+s.ribbon_yoffset+s.text_yoffset)

                yrk++
            }
        }
    }

    function drawEvents(eventslist, styles) {
        for(var k = 0; k < eventslist.length; k++) {
            event = eventslist[k]
            date = new Date(event.date)
            x = dateX(date)
            yearN = date.getFullYear() - data.start_year

            // set the styles
            event_canvas_styles = {}
            try { event_canvas_styles = event.styles.canvas_styles } catch {}
            s = _.merge(_.cloneDeep(styles), event.styles)
            _.merge(ctx, s.canvas_styles)

            ctx.fillText(event.text,
                x+s.text_xoffset,
                (yearN+.5)*year_height_px+s.text_yoffset)
            ctx.beginPath()
            ctx.arc(x, (yearN+.5)*year_height_px, s.dotsize, 0, Math.PI*2)
            ctx.fill()
        }
    }

    // --------------------------------------------------------
    // draw

    // the basics
    for(i = 0; i < num_years; i++) {
        year = data.start_year + i

        // bg color or zebra stripes
        ctx.fillStyle = getFillStyle(styles.canvas.bg_color, i)
        ctx.fillRect(0, i*year_height_px,
            canvas_width_px,
            year_height_px)

        // timeline with tick marks
        drawTimeline(i)

        // draw year number
        _.merge(ctx, styles.year_numbers.canvas_styles)
        ctx.fillText(year, timeline_x0/2, (i+.5)*year_height_px + styles.year_numbers.text_yoffset)
    }

    // add special events for birthdays
    data["birthdays"] = []
    if(data.include_birthdays) {
        dob = new Date(data.date_of_birth)
        for(i = 0; i < num_years; i++) {
            year = data.start_year + i
            age = year - dob.getFullYear()
            bday = new Date(year+"-"+(dob.getMonth()+1)+"-"+dob.getDate())
            data.birthdays.push({
                date: bday.toDateString(),
                text: age
            })
        }
    }

    // draw the events
    drawEvents(data.birthdays, styles.birthdays)
    drawEvents(data.events, styles.events)

    // draw all ribbons
    ribbon_types = _.keys(data.ribbons)
    for(var k = 0; k < ribbon_types.length; k++) {
        ribbon_type = ribbon_types[k]
        drawRibbons(data.ribbons[ribbon_type], styles.ribbons[ribbon_type])
    }

}

// let er rip
drawLifemap(data, styles);
