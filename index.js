var playerName 
function returnText(){
    playerName = document.getElementById('inputPlayerName').value;
    alert(playerName)
}

import * as testname from './test.json';
const {name} = testname;
console.log(name); // output 'testing'