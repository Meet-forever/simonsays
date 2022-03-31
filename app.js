const st_sp_btn = document.getElementById('st_sp_btn');
const colors = [['lightgreen', 'green'], ['lightblue', 'blue'], ['lightcoral', 'red'], ['rgb(255, 255, 124', 'yellow']];
let music = null;
const WAITTIME = 500;
const PLAYTIME = 1000;
let currentLoop = 1; 
let limit = 8; // Limit of the game
let playOn = false; // When computer is playing, player won't be allowed to play
let store = []; // Current unique sequence to remember


const color_music = (index, status, time = 1) =>{
    if(status){
        // Change Color
        document.getElementById(colors[index][1]).style.backgroundColor = colors[index][1]
        // Start Music for a particular color
        music = document.getElementById(`${colors[index][1]}aud`)
        music.play()
        music.loop = true
        // When computer playing
        if(time > 1){ 
            setTimeout(()=>{
                document.getElementById(colors[index][1]).style.backgroundColor = colors[index][0]
                music.pause()
                music.loop = false
                music.currentTime = 0
            }, time)
        }
    }
    else{    
        // Back to Original Color
        document.getElementById(colors[index][1]).style.backgroundColor = colors[index][0]
        if(music){
        // Stop Music for a particular color
            music.pause()
            music.currentTime = 0
            music.loop = false
        }
    }
};

colors.forEach((i, index) => document.getElementById(i[1]).addEventListener('mousedown', ()=>{
    if(!playOn)color_music(index, true)
}));

colors.forEach((i, index) => document.getElementById(i[1]).addEventListener('mouseup', ()=>{
    if(!playOn)color_music(index, false)
}));

const playerInput = async(e)=>{
    if(store.length == 0){
        st_sp_btn.click()
    }
    else{
        if(colors[store[0]][1] === e.target.id){
            store.shift()
            if(store.length === 0){ 
                await new Promise(r => setTimeout(r, PLAYTIME)); // Wait for the next round
                colors.forEach(i => document.getElementById(i[1]).removeEventListener('click', playerInput))
                currentLoop++;
                if(currentLoop > limit)st_sp_btn.click() // After game limit stop the game
                else play(currentLoop)
            }
        }
        else{
            let ar = new Audio("./gameOver.wav");
            ar.play()
            st_sp_btn.click()
        }
    }
}


const play = async(currentLoop) => {
    playOn = true // Stop player from using the color buttons 
    for(let i = 0; i < currentLoop; i++){
        const rand = Math.floor(Math.random()*colors.length);
        store.push(rand);
        color_music(rand, true, PLAYTIME);
        await new Promise(resolve => setTimeout(resolve,PLAYTIME+WAITTIME));
    }
    playOn = false // Now player can use color button
    colors.forEach(i => document.getElementById(i[1]).addEventListener('click', playerInput))
}


st_sp_btn.addEventListener('click', ()=>{
    if(st_sp_btn.innerText === 'Start'){
        st_sp_btn.innerText = 'Stop'
        play(currentLoop)
    }
    else{
        st_sp_btn.innerText = 'Start'
        store = []
        currentLoop = 1
        playOn = false
        // Since game is over, don't listen to click events 
        colors.forEach(i => document.getElementById(i[1]).removeEventListener('click', playerInput))
    }
})