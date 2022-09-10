var density = 700 * 700
var speedOfDisappearing = 0.03
var area = 130 //It means the radius of ellipses
var choice = 2

function setup() {
    createCanvas(windowWidth, windowHeight)
    pixelDensity(1)
    background(255, 255, 255)
    frameRate = 30
}

function draw() {
    let numbers = width * height / (density * 1.0) 
    if (numbers < 1 && frameCount % int(1 / numbers) == 0)
        draw_ellipse()
    if (numbers > 1)
        numbers++
    while (numbers > 1) {
        draw_ellipse()
        numbers--
    }
    loadPixels() 
    colorMode(RGB, 255, 255, 255) 
    let d = pixelDensity()  
    for(let x = 0;x < width;x++)
    {
        for(let y = 0;y < height;y++)
        {
            for (let i = 0; i < d; i++) 
            { 
                for (let j = 0; j < d; j++) 
                {
                    index = 4 * ((y * d + j) * width * d + (x * d + i))  
                    pixels[index] = lerp(pixels[index], 255, speedOfDisappearing)
                    pixels[index+1] = lerp(pixels[index+1], 255, speedOfDisappearing)
                    pixels[index+2] = lerp(pixels[index+2], 255, speedOfDisappearing)
                    pixels[index+3] = lerp(pixels[index+3], 255, speedOfDisappearing)
                }
            }
        }
    }
    updatePixels() 
}

function get_size() {
    let x = float(Math.random() * 2) 
    let y = 1 / 2.0 * pow(x - 1, 3) + 1.5 
    return int(area / 2 * y) 
}

function draw_ellipse() {
    colorMode(HSB, 360, 100, 100) 
    c = color("#007781") 
    switch (choice) {
        case 0: c = color(int(Math.random() * 360), 70, 100)  //Rainbow
            break 
        case 1: c = color("#007781")  //Blue like rain
            break 
        case 2: c = color("#930731")  //Red like a rose
            break 
        case 3: c = color("#059821")  //Green like grass
            break 
    }
    fill(c) 
    noStroke() 
    let XOfEllipse = int(Math.random() * width) 
    let YOfEllipse = int(Math.random() * height) 
    let area = get_size() 
    ellipse(XOfEllipse, YOfEllipse, area, area) 
}

function mouseClicked()
{
    choice = (choice + 1) % 4
}