function initBoard()
{    
    /*var theboard = ClearBoard();
    while(unsolvable(theboard) == true)
    {
        theboard = seedboard();
        solve(theboard, true);

    }*/



    theboard = seedboard();
    theboard = solve(theboard, true);

    var boxRef = document.getElementsByName("box");
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            getBox(i,j, boxRef).value = theboard[i][j];
            getBox(i,j, boxRef).readOnly = true;
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
               theboard[getRndInteger(0, 9)][getRndInteger(0, 9)] = getRndInteger(1, 10);
            }
        }
    }

    console.log(theboard);


    
        /*var num = 1;
        var count = 0;
        var count2 = 0;

        for (var i = 0; i < 9; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                theboard[j][i] = num;
                num ++;

                count++;

                if (count % 9 == 0)
                {
                    num = num + 3; 
                    count2++;

                    if (count2 % 3 == 0)
                    {
                        num++;
                    }
                }
                
                while (num > 9)
                {
                    num = num - 9;
                }

            }
        }*/

    /*theboard[0][1] = 0;
    theboard[2][2] = 0;
    theboard[8][5] = 0;
    theboard[8][7] = 0;
    theboard[5][7] = 0;*/

    /*for (var i = 0; i < 80; i++)
    {
        theboard[getRndInteger(0, 9)][getRndInteger(0, 9)] = 0;
    }*/

    return(theboard);
}

function solve(theArray, isGeneratingSwitch)
{
    var tmparr = theArray;

    console.log(theArray.toString());
    var i = 0;
    var ans = Search(tmparr);

   while (i < ans[2].length)
   {
       tmparr = theArray;
       console.log(ans[2][i] + " at pos " + ans[1] + "- " + (i+1) + " outta " + ans[2].length);
       tmparr[ans[1][0]][ans[1][1]] = ans[2][i];
       console.log("deeper");

       var tmpdepth = depth(tmparr, ans);
       if (tmpdepth[1] == true)
       {
           console.log("game over");
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

    var tmparr = theArray;
    


    while (i < ans[2].length)
    {
        console.log("testing " + ans[2][i] + " at pos " + ans[1] + "- " + (i + 1)  +  " out of " + ans[2].length);

        tmparr = theArray;
        tmparr[ans[1][0]][ans[1][1]] = ans[2][i];
        var comp = tmparr;
        console.log("search");
        let tmpans = Search(tmparr);
        tmparr = tmpans[0];

        i++;


        if (tmpans[2] == 0 || tmpans[3] == false || Qunsolvable(tmparr) == true)
        {
            console.log("skip");
            //tmparr = theArray;
        }
        else if (checkSolved(tmparr) == true)
        {
            console.log("win");

            return {0: tmparr, 1: true};
        }
        else
        {
            console.log("deepr");
            
            var tmpdepth = depth(tmparr, tmpans);

            if (tmpdepth[1] == true)
            {
               console.log("win");

               return {0: tmpdepth[0], 1: true};
            }
        }


    }

    console.log("shallower");

    return {0: theArray, 1: false};
}

function Search(theArray)
{
    var tmparr = theArray;
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

                //console.log(possibly + " valid BOX from pos " + j + " " + i);


                if (possibly.length >= 1)
                {
                    possibly = QVboxCheck(tmparr, j , i , possibly)
                    possibly = removezeros(possibly);


                    //console.log(possibly + " valid V from pos " + j + " " + i);


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
                            console.log("no H possible positions at position " + j + " " + i);
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
                        console.log("no V possible positions at position " + j + " " + i);
                        break bigmomma;
                    }

                }
                else if (possibly.length == 0)
                {
                    valid = false;
                    console.log("no B possible positions at position " + j + " " + i);
                    break bigmomma;
                }

            }
        }
    }

    tmparr = theArray


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

