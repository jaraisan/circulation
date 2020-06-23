*
* Script for calculating trend statistics for the area defined by the user
* 
function T_trends (args)
*
* read arguments
*
* Number of month
*
k = subwrd(args,1)  
*  
*** Letter for figure
letter = subwrd(args,2)
*** Month
month = subwrd(args,3)
*** Vpage borders
x1 = subwrd(args,4)
x2 = subwrd(args,5)
y1 = subwrd(args,6)
y2 = subwrd(args,7)
*
* Time period
*
t1 = subwrd(args,8)
t2 = subwrd(args,9)
*
'set z 'k''
'd explvar'
line1=sublin(result,1)
explvar=subwrd(line1,4)
explvar100=math_nint(explvar)/100
print explvar100  
*
'd bobs'
line1=sublin(result,1)
trendobs=subwrd(line1,4)
print trendobs
trendobs10=math_nint(10*(t2-t1)*trendobs)/10
print trendobs10
*
'd bpred'
line1=sublin(result,1)
trendpred=subwrd(line1,4)
print trendpred
trendpred10=math_nint(10*(t2-t1)*trendpred)/10
print trendpred10
trendres10=math_nint(10*(t2-t1)*(trendobs-trendpred))/10
*  
'set vpage 'x1' 'x2' 'y1' 'y2''
'set grads off'
'set grid off'
*
* This will only work for the predetermined vpage size  
*  
'set parea 1.0 7.5 0.55 5.45'
*
* Find out y axis ranges and offsets for the plot
*
'set t 1'
'd max(obs,t='t1',t='t2')'
line1=sublin(result,2)
max1=subwrd(line1,4)
'd max(pred,t='t1',t='t2')'
line1=sublin(result,2)
max2=subwrd(line1,4)
max=max1
if(max2 > max1)
  max = max2
endif
print max
*
'd min(obs,t='t1',t='t2')'
line1=sublin(result,2)
min1=subwrd(line1,4)
'd min(pred,t='t1',t='t2')'
line1=sublin(result,2)
min2=subwrd(line1,4)
min=min1
if(min2 < min1)
  min = min2
endif
print min
*
* For defining offset: find out the minimum difference of either
* obs-(obs-pred) or pred-(obs-pred). Subtract 0.5 degrees for convenience
* + round downwards
*
'd min(obs-(obs-pred),t='t1',t='t2')'  
line1=sublin(result,2)
min1=subwrd(line1,4)
'd min(pred-(obs-pred),t='t1',t='t2')'  
line1=sublin(result,2)
min2=subwrd(line1,4)  
offset=min1
if(min2 < min1)
  offset = min2
endif
print offset
offset=math_int(offset-0.5)
*
* Find out the minimum and maximum of obs-pred.
*
'd min(obs-pred,t='t1',t='t2')'  
line1=sublin(result,2)
min1=subwrd(line1,4)
'd min(obs-pred,t='t1',t='t2')'  
line1=sublin(result,2)
min2=subwrd(line1,4)  
min_res=min1
if(min2 < min1)
  min_res = min2
endif
print min
'd max(obs-pred,t='t1',t='t2')'  
line1=sublin(result,2)
max1=subwrd(line1,4)
'd max(obs-pred,t='t1',t='t2')'  
line1=sublin(result,2)
max2=subwrd(line1,4)  
max_res=max1
if(max2 > max1)
  max_res = max2
endif
print max_res
*
totalrange=(max-min_res-offset)
print totalrange
*
* Round values for axis limits. Add some room for upper and lower labels.
*
upper=math_int(max+0.07*totalrange+1)
lower=math_int(max-1.07*totalrange)
*
print lower
print upper
*
* Lowest value of obs/pred (downward rounded) +
* Highest value of obs-pred (upward rounded)
*
step=math_int(totalrange/16)+1  
lower_op=math_int(min)
if(lower_op > offset)
  lower_op = offset
endif
upper_res=math_int(max_res+1)
lower_res=lower-offset
top_res=lower_res+(upper-lower)
*
* Round the numbers on the y axis to multiplies of step
*
llower_op=step*(math_int(lower_op/step+0.9999))
uupper=step*(math_int(upper/step))
llower_res=step*(math_int(lower_res/step+0.9999))
uupper_res=step*(math_int(upper_res/step))
*
* Dark grey for residual T  
*  
'set rgb 16 80 80 80'
*  
'set t 't1' 't2''
*
'set vpage 'x1' 'x2' 'y1' 'y2''
'set parea 1.0 7.5 0.55 5.45'
'set vrange 'lower' 'upper''
'set ylab off'
'set xlopts 1 4 0.15'
*
'exec line obs 0 7 1 2 0.0'
'exec line pred 0 7 1 4 0.0'
'exec line obs-pred+'offset' 0 10 1 16 0.0'
'exec line 0*obs 0 3 1 1 0.0'
'exec line 0*obs+'offset' 0 3 1 1 0.0'
'exec line aobs+time*bobs 0 8 5 2 0.0'
'exec line apred+time*bpred 0 8 5 4 0.0'
'exec line aobspred+time*bobspred+'offset' 0 10 5 16 0.0'
*
run' 'ticks3' 'left' 'lower' 'upper' 'llower_op' 'uupper' 'step' 'out' '0.07' '0.17' '5' '5
run' 'ticks3' 'right' 'lower_res' 'top_res' 'llower_res' 'uupper_res' 'step' 'out' '0.07' '0.17' '5' '5
*
'set string 1 c 5 90'
'set strsiz 0.2 0.2'
'draw string 0.25 3.82 `3D`0T (`3.`0C)'
'set string 1 c 5 -90'
'set strsiz 0.18 0.18'
'draw string 8.28 1.6 ERA5-Pred (`3.`0C)'
*
'set strsiz 0.22 0.22'
'set string 1 c 5 0'
'draw string 4.25 0.11 Year'
*
'set strsiz 0.22 0.22'
'set string 2 l 5 0'
'draw string 1.05 5.27 ERA5 ('trendobs10'`3.`0C)'
'set string 4 l 5 0'
'draw string 3.8 5.27 Pred ('trendpred10'`3.`0C)'
'set string 16 r 5 0'
'draw string 7.4 0.78 ERA5-Pred ('trendres10'`3.`0C)'
*
'set string 1 bl 6 0'
'set strsiz 0.27 0.28'
'draw string 1.0 5.55 ('letter') 'month' (ExplVar: 'explvar100')'
