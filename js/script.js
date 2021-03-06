var bigDiff = 0; //0= ez, 1 = med 2 = hard
var bigBoard = [];
var currentBoard = [];
var remainingHints = 3;
var showRedText = false;

function initBoard()
{    
    document.getElementById("winmsgbox").classList.remove("moveright");

    //initlise and complete board
    var theboard = seedboard();
    theboard = solve(theboard);
    bigBoard = arrcopy(theboard);

    //0bomb
    theboard = zeroDay(theboard); 
    currentBoard = arrcopy(theboard);

    remainingHints = (-bigDiff + 3);
    document.getElementById("hintsText").innerHTML = "Remaining Hints: " + remainingHints;


    var boxRef = document.getElementsByName("box");
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (theboard[i][j] == 0)
            {
                getBox(i,j, boxRef).value = null;
                getBox(i,j, boxRef).readOnly = false;
            }
            else
            {
                getBox(i,j, boxRef).value = theboard[i][j];
                getBox(i,j, boxRef).readOnly = true;
            }

            getBox(i,j, boxRef).style.color = "black";
       }
    }

}

function seedboard()
{
    var theboard = ClearBoard();



    for (i = 1; i < 10; i++)
    {  
        theboard[getRndInteger(0, 9)][getRndInteger(0, 9)] = i;
    }

    if (Qunsolvable(theboard) == true)
    {
        while (Qunsolvable(theboard) == true)
        {
            theboard = ClearBoard();
            for (i = 0; i < 10; i++)
            {  
                theboard[getRndInteger(0, 9)][getRndInteger(0, 9)] = i;
            }
        }
    }

    return(theboard);
}

function solve(theArray)
{
    var tmparr = arrcopy(theArray);

    var i = 0;
    var ans = Search(tmparr);

   while (i < ans[2].length)
   {
        tmparr = arrcopy(theArray);
       //console.log(ans[2][i] + " at pos " + ans[1] + "- " + (i+1) + " outta " + ans[2].length);
          // console.log(theArray.toString());

       tmparr[ans[1][0]][ans[1][1]] = ans[2][i];
      // console.log("deeper");

       var tmpdepth = depth(tmparr, ans);
       if (tmpdepth[1] == true)
       {
          // console.log("game over");
           tmparr = tmpdepth[0];
           break;
       }

       i++;
   }

    return (tmparr);
}

function depth(theArray, ans)
{
    var i = 0;

    var tmparr = arrcopy(theArray);

    


    while (i < ans[2].length)
    {
        //console.log("testing " + ans[2][i] + " at pos " + ans[1] + "- " + (i + 1)  +  " out of " + ans[2].length);
              //  console.log(theArray.toString());


        tmparr = arrcopy(theArray);
        tmparr[ans[1][0]][ans[1][1]] = ans[2][i];
        //console.log("search");
        let tmpans = Search(tmparr);
        tmparr = tmpans[0];

        i++;


        if (tmpans[2] == 0 || tmpans[3] == false || Qunsolvable(tmparr) == true)
        {
            //console.log("skip");
        }
        else if (checkSolved(tmparr) == true)
        {
           // console.log("win");

            return {0: tmparr, 1: true};
        }
        else
        {
            //console.log("deepr");
            
            var tmpdepth = depth(arrcopy(tmparr), tmpans);

            if (tmpdepth[1] == true)
            {
              // console.log("win");

               return {0: tmpdepth[0], 1: true};
            }
        }


    }

   // console.log("shallower");

    return {0: arrcopy(theArray), 1: false};
}

function Search(theArray)
{
    var tmparr = arrcopy(theArray);
    var shortestpossibility = [1,2,3,4,5,6,7,8,9];
    var shortestpos = [0,0]
    var valid = true;

    bigmomma: for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (tmparr[j][i] == 0)
            {
                var possibly = [1,2,3,4,5,6,7,8,9];
                possibly = QboxCheck(tmparr, j , i, possibly);
                possibly = removezeros(possibly);
                if (possibly.length >= 1)
                {
                    possibly = QVboxCheck(tmparr, j , i , possibly)
                    possibly = removezeros(possibly);
                    if (possibly.length >= 1)
                    {
                        possibly = QHboxCheck(tmparr, j , i, possibly)
                        possibly = removezeros(possibly);

                        if (possibly.length > 1)
                        {
                            if (shortestpossibility.length >= possibly.length)
                            {
                                shortestpossibility = possibly;
                                shortestpos = [j ,i];
                            }
                        }
                        else if (possibly.length == 0)
                        {
                            //console.log("no H possible positions at position " + j + " " + i);
                            valid = false;
                            break bigmomma;
                        }
                        else
                        {
                            shortestpossibility = possibly;
                            shortestpos = [j , i];
                            break bigmomma;
                        }
                    }    
                    else if (possibly.length == 0)
                    {
                        valid = false;
                      // console.log("no V possible positions at position " + j + " " + i);
                        break bigmomma;
                    }

                }
                else if (possibly.length == 0)
                {
                    valid = false;
                   // console.log("no B possible positions at position " + j + " " + i);
                    break bigmomma;
                }

            }
        }
    }

    tmparr = arrcopy(theArray);


    if (valid == false)
    {
        shortestpossibility = [];
        shortestpos = [];
    }
    else
    {
        tmparr[shortestpos[0]][shortestpos[1]] = shortestpossibility[0];
    }


    return {0: tmparr, 1: shortestpos, 2: shortestpossibility, 3: valid};
}

function checkSolved(theArray)
{
    var tmparr = theArray;

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (theArray[j][i] == 0)
            {
                return(false);
            }
        }
    }

    return(true);
}

function Qunsolvable(theArray)
{
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (theArray[j][i] != 0)
            {
                var possible = true;

                var tmpbox = Boxarray(theArray, j, i);
                tmpbox = removezeros(tmpbox);

                for (var k = 1; k < 10; k++)
                {
                    if (arraycheck(tmpbox, k) == false)
                    {
                        possible = false;
                    }
                }

                tmpbox = Varray(theArray, j , i);
                tmpbox = removezeros(tmpbox);

                for (var k = 1; k < 10; k++)
                {
                    if (arraycheck(tmpbox, k) == false)
                    {
                        possible = false;
                    }
                }
                

                tmpbox = Harray(theArray, j , i);                  
                tmpbox = removezeros(tmpbox);

                
                for (var k = 1; k < 10; k++)
                {
                    if (arraycheck(tmpbox, k) == false)
                    {
                        possible = false;
                    }
                }
                

                if (possible == false)
                {
                    return (true);
                }

            }
        }
    }

    return(false);
}

//checks the array for dublicate numbers
function arraycheck(testArray, testaginst)
{
    var count = 0;
    
    var test = testArray;

    for (var i = 0; i < test.length; i++)
    {
        if (test[i] == testaginst)
        {
            count++;
        }   
    }

    if (count > 1)
    {
        return (false)
    }
    return (true)
}

//gets the vertical line of the vien posiotn
function Varray(theArray, x, y)
{
    var temp1 = [0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < 9; i++)
    {
        temp1[i] = theArray[x][i]
    }

    return(temp1)
}

//get the horozontal line of the given posion
function Harray(theArray, x, y) 
{
    var temp1 = [0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < 9; i++)
    {
        temp1[i] = theArray[i][y]
    }

    return(temp1)
}

function Boxarray(theArray, x, y)
{
    var box = [0,0];

    if (x > -1 && x < 3)
    {
        if (y > -1 && y < 3)
        {
            //top left 
            box = [0,0];
        }
        else if (y > 2 && y< 6)
        {
            //middle left 
            box = [0,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom left
            box = [0,6];
        }   
    }
    else if (x > 2 && x < 6)
    {
        if (y > -1 && y < 3)
        {
            //top middle
            box = [3,0];
        }
        else if (y > 2 && y< 6)
        {
            //middle middle
            box = [3,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom middle
            box = [3,6];
        }
    }
    else if (x > 5 && x < 9)
    {
        if (y > -1 && y < 3)
        {
            //top right 
            box = [6,0];
        }
        else if (y > 2 && y < 6)
        {
            //middle right
            box = [6,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom right 
            box = [6,6];
        }
    }


    var temp = 0;
    var temp1 = [0,0,0,0,0,0,0,0,0];
    
    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            temp = theArray[j + box[0]][i + box[1]]
            temp1[(i * 3) + j] = temp;
        }
    }


    return(temp1)

}


function QboxCheck(theArray, x, y, possibly)
{
    var box = [0,0];
    var ppossibly = possibly;

    if (x > -1 && x < 3)
    {
        if (y > -1 && y < 3)
        {
            //top left 
            box = [0,0];
        }
        else if (y > 2 && y< 6)
        {
            //middle left 
            box = [0,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom left
            box = [0,6];
        }   
    }
    else if (x > 2 && x < 6)
    {
        if (y > -1 && y < 3)
        {
            //top middle
            box = [3,0];
        }
        else if (y > 2 && y< 6)
        {
            //middle middle
            box = [3,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom middle
            box = [3,6];
        }
    }
    else if (x > 5 && x < 9)
    {
        if (y > -1 && y < 3)
        {
            //top right 
            box = [6,0];
        }
        else if (y > 2 && y < 6)
        {
            //middle right
            box = [6,3];
        }
        else if (y > 5 && y < 9)
        {
            //bottom right 
            box = [6,6];
        }
    }

    var tmp = 0;

    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            tmp = theArray[j + box[0]][i + box[1]];

            if (tmp != 0)
            {
                for (var k = 0; k < ppossibly.length; k++)
                {
                    if (ppossibly[k] == tmp)
                    {
                        ppossibly[k] = 0;
                    }
                }
            }  
        }   
    }

    return (ppossibly);
}

function QVboxCheck(theArray, x, y, possibly)
{
    var tmp = 0;
    var ppossibly = possibly;

    for (var i = 0; i < 9; i++)
    {
        tmp = theArray[x][i]
        if (tmp != 0)
        {
             for (var k = 0; k < ppossibly.length; k++)
            {
                if (ppossibly[k] == tmp)
                {
                    ppossibly[k] = 0;
                }
            }
        }
    }

    return (ppossibly);
}

function QHboxCheck(theArray, x, y, possibly)
{
    var tmp = 0;
    var ppossibly = possibly;

    for (var i = 0; i < 9; i++)
    {
        tmp = theArray[i][y]
        if (tmp != 0)
        {
            for (var k = 0; k < ppossibly.length; k++)
            {
                if (ppossibly[k] == tmp)
                {
                    ppossibly[k] = 0;
                }
            }
        }
    }

    return (ppossibly);
}

function zeroDay(theboard)
{
        var i = 0;
        var x = 0;
        var y = 0;
        var diff2 = bigDiff;
        diff2 += 4;
 
        while (y < 3)
        {
            var num = getRndInteger(diff2, (diff2 + 2));
            

            while (i < num)
            {
                var pos = randboxgen(x, y);
                if (theboard[pos[0]][pos[1]] != 0)
                {
                    theboard[pos[0]][pos[1]] = 0;
                    i++;
                }
            }

            i = 0;
            x++;
            if (x > 2)
            {
                x = 0;
                y++;
            }
        }
        return (theboard)
}

function randboxgen(x, y)
{
    var rand1 = getRndInteger(0, 3);
    var rand2 = getRndInteger(0, 3);
    var pos = [0,0];

    pos[0] = rand1 + (x * 3);
    pos[1] = rand2 + (y * 3);

    return (pos);

}



function removezeros(testArray)
{
    var tmparr = testArray;
    var val = tmparr.length;
    for (var i = val; i > -1; i--)
    {
        if (tmparr[i] == 0)
        {
            tmparr.splice(i, 1);
        }
    }

    return (tmparr);
}

function getBox(x, y, array)
{   
    return(array[(y * 9) + x])
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function arrcopy(OGarr)
{
    var arr = OGarr;
    var arr2 = [];
    
    for (var i = 0; i < arr.length; i++)
    {
        arr2[i] = arr[i].slice();
    }


    return(arr2);
}

function ClearBoard()
{
    let tmpbord = new Array(9);
    for (i = 0; i < tmpbord.length; i++)
    {
        tmpbord[i] = new Array(9);
    }

    for (i = 0; i < 9; i++)
    {
        for (j = 0; j < 9; j++)
        {
            tmpbord[i][j] = 0;
        }
    }
    
    return (tmpbord);
}

function finishBoard()
{
    var boxRef = document.getElementsByName("box");
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (bigBoard[i][j] == 0)
            {
                getBox(i,j, boxRef).value = null;
                getBox(i,j, boxRef).readOnly = false;
            }
            else
            {
                getBox(i,j, boxRef).value = bigBoard[i][j];
                getBox(i,j, boxRef).readOnly = true;
                getBox(i,j, boxRef).style.color = "black";
            }
       }
    }

    currentBoard = arrcopy(bigBoard);
}


//non suduko

function setdiff(i)
{
    bigDiff = i;
    if (i ==0)
    {
        document.getElementById("diffSelect").innerHTML = "Easy" + '<span class="caret"></span>';

    }
    else if (i == 1)
    {
        document.getElementById("diffSelect").innerHTML = "Medium" + '<span class="caret"></span>';

    }
    else if (i == 2)
    {
        document.getElementById("diffSelect").innerHTML = "Hard" + '<span class="caret"></span>';

    }
    else if (i == -4)
    {
        document.getElementById("diffSelect").innerHTML = "Super Easy" + '<span class="caret"></span>';

    }
    else
    {
       document.getElementById("diffSelect").innerHTML = "err" +'<span class="caret"></span>';

    }
     

    initBoard();
}

function arrEQarr(arr1, arr2)
{
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (arr1[i][j] != arr2[i][j])
            {
                return (false)
            }
        }
    }
    return (true);
}

function valueChanged(x, y)
{
    var boxRef = document.getElementsByName("box");
    var input = getBox(y,x, boxRef).value;

    if ((input == "h" || input == "H") && remainingHints > 0)
    {
        getBox(y,x, boxRef).value = bigBoard[y][x];
        getBox(y,x, boxRef).readOnly = true;
        currentBoard[y][x] = getBox(y,x, boxRef).value;
        remainingHints--;
        document.getElementById("hintsText").innerHTML = "Remaining Hints: " + remainingHints;

        if (arrEQarr(currentBoard, bigBoard))
        {
            victory();
        }
    }
    else if (!Number.isNaN(parseInt(input)))
    {
        if (parseInt(input) != 0)
        {
            var tmp = arrcopy(solve(currentBoard));

            currentBoard[y][x] = parseInt(input);

            var tmp2 = arrcopy(solve(currentBoard));


            if (checkSolved(tmp2))
            {
                if (arrEQarr(currentBoard, tmp))
                {
                    victory();
                }
                else
                {
                    console.log("valid but not complete");
                }
                bigBoard = arrcopy(tmp);
            }
        }
        else
        {
            getBox(y,x, boxRef).value = "";
        }
    }
    else if (input == "")
    {
        currentBoard[y][x] = 0;
        var tmp = solve(currentBoard);
        if (checkSolved(tmp))
        {
            bigBoard = arrcopy(tmp);
        }
    }
    else
    {
        getBox(y,x, boxRef).value = "";
    }

    if (showRedText == true)
    {
        redText();
    }
    else
    {
        normaltext();
    }
}

function victory()
{
    playanimation();
}

function redText()
{
    var boxRef = document.getElementsByName("box");

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (getBox(i,j, boxRef).readOnly == true)
            {
                getBox(i,j, boxRef).style.color = "black";
            }
            else if (currentBoard[i][j] !=0)
            {
                if (currentBoard[i][j] != bigBoard[i][j])
                {
                    getBox(i,j, boxRef).style.color = "red";
                }
                else
                {
                    getBox(i,j, boxRef).style.color = "blue";
                }
            }
            else
            {
                getBox(i,j, boxRef).style.color = "black";
            }
        }
    }
}

function normaltext()
{
    var boxRef = document.getElementsByName("box");

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (getBox(i,j, boxRef).readOnly == true)
            {
                getBox(i,j, boxRef).style.color = "black";
            }
            else if (currentBoard[i][j] != 0)
            {
                getBox(i,j, boxRef).style.color = "blue";
            }
            else
            {
                getBox(i,j, boxRef).style.color = "black";
            }
        }
    }
}

function showRedTexttoggle()
{
    showRedText = !showRedText;

    if (showRedText == true)
    {
        redText();
        document.getElementById("redtoggle").classList.add('btn-success');
        document.getElementById("redtoggle").classList.remove('btn-danger');
    }
    else
    {
        normaltext();
        document.getElementById("redtoggle").classList.add('btn-danger');
        document.getElementById("redtoggle").classList.remove('btn-success');
    }
}

function playanimation()
{
    document.getElementById("winmsgbox").classList.remove("moveright");


    var boxRef = document.getElementsByName("box");

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            getBox(i,j, boxRef).classList.remove("spin1");
            getBox(i,j, boxRef).classList.remove("spin2");
            void getBox(i,j, boxRef).offsetWidth; 

            if (Math.random() >= 0.5)
            {
                getBox(i,j, boxRef).classList.add("spin1");
            }
            else
            {
                getBox(i,j, boxRef).classList.add("spin2");
            }


        }
    }

    popoutside();
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function popoutside() 
{
   await sleep(2300);
   var element = document.getElementById("winmsgbox");
   element.classList.remove("moveright");
   void element.offsetWidth;
   element.classList.add("moveright");
}

