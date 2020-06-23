*
* Script for calculating trend statistics for the area defined by the user
* 
function T_trends (args)
*
area = subwrd(args,1)
lon1 = subwrd(args,2)
lon2 = subwrd(args,3)
lat1 = subwrd(args,4)
lat2 = subwrd(args,5)
*
* Choice of years: not implemented in this version, because would require 
* CMIP5 data for individual years (more than 800 MB in total)
*  
*year1 = subwrd(args,6)
*year2 = subwrd(args,7)
year1 = 1979
year2 = 2018
fig = subwrd(args,6)
*
if(lon2<lon1)
  lon2=lon2+360  
  say 'Warning: adding lon2 by 360 degrees to ' lon2
endif
if(lat1<-90)
  say 'Warning: increasing lat1 to -90'
  lat1=-90
endif
if(lat2>90)
  say 'Warning: reducing lat2 to 90'  
  lat2=90
endif
*
* aave cannot deal with lon1=lon2, lat1=lat2  
* To enable single grid box values, widen the ranges a bit in this case
* (does not affect the results)
*
llon1=lon1
llon2=lon2
if(llon1=llon2)
  llon1=llon1-0.001
  llon2=llon2+0.001
endif
llat1=lat1
llat2=lat2
if(llat1=llat2)
  llat1=llat1-0.001
  llat2=llat2+0.001
endif  
*
* Not needed as far as years cannot be chosen by the user
*  
*if(year1<1979)
*  say 'Warning: increasing year1 to 1979'
*  year1=1979
*endif
*if(year2>2018)
*  say 'Warning: reducing year2 to 2018'  
*  year2=2018
*endif
*
say 'Minimum longitude: ' lon1
say 'Maximum longitude: ' lon2
say 'Minimum latitude: ' lat1
say 'Maximum latitude: ' lat2
say 'First year: ' year1
say 'Last year: ' year2
t1=year1-1978
t2=year2-1978
nt=t2-t1
* 
* Opening files
*
'reinit' 
'open T_anomalies_ERA5_1979-2018.ctl'
'open T_anomalies_circ_1979-2018.ctl'
'open T_trends_CMIP5_42mod_1979-2018.ctl'
*
'set x 1'
'set y 1'
*
'set z 1 12'
'set t 1 40'
'set e 1' 
*
'define obs=aave(tanom.1,lon='llon1',lon='llon2',lat='llat1',lat='llat2')'
'define pred=aave(tanom.2,lon='llon1',lon='llon2',lat='llat1',lat='llat2')'
'define time=sum(1+0*obs,t-39,t+0)'
*
* Calculate trends
*
'set z 1 12'
'exec trends obs pred time 't1' 't2''  
*
* The 42 CMIP5 models are on time axis in their file (due to problems with the ensemble dimension in netcdf)
*  
'set dfile 3'
'set t 1 42'
'define cmip5=aave(b.3,lon='llon1',lon='llon2',lat='llat1',lat='llat2')'
*
'set t 1'
'mcmip5=ave(cmip5,t=1,t=42)'
'scmip5=42/41*sqrt(ave(pow(cmip5-mcmip5,2),t=1,t=42))'
*
* name for title
*
* Explained variance:
*
'set z 1'
'explvar=100*(1-ave(dvarobspred,z=1,z=12)/ave(dvarobs,z=1,z=12))'
'd explvar'
line1=sublin(result,1)
explvar=subwrd(line1,4)
rc = valnum(explvar)
print rc
print explvar
explvar100=math_nint(explvar)/100
print explvar100
'set z 1 12'
*
'set imprun off2'
*
* This only works in older grads versions:
*
'enable print fig'fig''
*
'set vpage off'
'set string 1 l 5 0'
'set strsiz 0.115 0.125'
'draw string 0.5 10.47 'area''
'set strsiz 0.105 0.115'
'draw string 0.5 10.27 Lat = ' lat1 ' to 'lat2'; Lon = ' lon1 ' to 'lon2 ''
*'draw string 0.5 10.3 Years ' year1'-'year2' '
'set xlopts 1 5 0.18'
'set ylopts 1 5 0.18'
'set z 0.5 12.5'
'set vpage 0 4.25 8.4 10.1'
'set parea 1 8 0.7 3'
'set xyrev on'
'set vrange 0 1.0001'
'set ylint 0.2'
'set gxout print'
'exec line 1-dvarobspred/dvarobs 3 6 1 1 0.15'
'set string 1 bl 6 0'
'set strsiz 0.19 0.21'
'draw string 1.0 3.1 (a) Explained variance (mean='explvar100')'
'set strsiz 0.2 0.2'
'set string 1 c 6 0'
'draw string 7.4 0.2 Month'
*
'set vpage 0 4.25 5.5 8.5'
'set parea 1 8 0.7 5.5'
*
* Find out the range of values for defining the limits of the y axis?
*
'set z 1'
'd max('nt'*bobs,z=1,z=12)'
line1=sublin(result,2)
max1=subwrd(line1,4)
'd min('nt'*bobs,z=1,z=12)'
line1=sublin(result,2)
min1=subwrd(line1,4)
'd 'nt'*max(bpred+1.686*stdbobspred,z=1,z=12)'
line1=sublin(result,2)
max2=subwrd(line1,4)
'd 'nt'*min(bpred-1.686*stdbobspred,z=1,z=12)'
line1=sublin(result,2)
min2=subwrd(line1,4)
*
min=0
if(min1 < min)
  min = min1
endif
if(min2 < min1)
  min = min2
endif
max=0
if(max1 > max)
  max=max1
endif
if(max2 > max1)
  max = max2
endif
print min1
print min2
print min
print max1
print max2
print max
*
* Reserve extra 15% of space for the labels
*
lower=math_int(min)
max=lower+(max-lower)*1.15
upper=math_int(max+1)
print lower
print upper
*
'set z 0.5 12.5'
*
'set xyrev on'
'set vrange 'lower' 'upper' '
'set ylint 1' 
'set gxout bar'
'set barbase 0'
'set bargap 20'
'set ccolor 2'
'd 'nt'*bobs'
'set bargap 40'
'set ccolor 4'
'd 'nt'*bpred'
'set gxout errbar'
'set bargap 75'
'set ccolor 1'
'set cthick 5'
'd 'nt'*(bpred-1.686*stdbobspred);'nt'*(bpred+1.686*stdbobspred)'
'define zero=0'
'exec line zero 0 3 1 1 0.0'
*
'set strsiz 0.2 0.2'
'set string 1 c 6 0'
'draw string 7.4 0.2 Month'
'set string 1 c 6 90'
'draw string 0.3 3.0 Trend [`3.`0C ('nt' yr)`a-1`n]'
*
'set line 2 1 5'
'draw recf 1.1 5.2 2.0 5.4'
'set line 4 1 5'
'draw recf 1.1 4.9 2.0 5.1'
'set strsiz 0.18 0.18'
'set string 1 l 6 0'
'draw string 2.1 5.3 Trend in ERA5'
'draw string 2.1 5.0 Effect of circulation change'
*
'set string 1 bl 6 0'
'set strsiz 0.19 0.21'
'draw string 1.0 5.58 (b) T trends'
*
'set z 1'
'd max('nt'*(bobs-bpred+1.686*stdbobspred),z=1,z=12)'
line1=sublin(result,2)
max1=subwrd(line1,4)
'd min('nt'*(bobs-bpred-1.686*stdbobspred),z=1,z=12)'
line1=sublin(result,2)
min1=subwrd(line1,4)
min=min1
if(min1 > 0)
  min = 0
endif
max=max1
if(max1 < 0)
  max = 0
endif
lower=math_int(min)
upper=math_int(max+1)
print lower
print upper
*
'set vpage 4.05 8.3 8.4 10.9'  
*'set vpage 0 4.25 3.35 5.85'
'set parea 1 8 0.7 3.9'
*'set parea 1 8 2.3 5.5'
'set xlopts 1 5 0.18'
'set ylopts 1 5 0.18'
*
'set z 0.5 12.5'
*
'set xyrev on'
'set vrange 'lower' 'upper' '
'set ylint 1 8 0.6 5.3'
'set gxout bar'
'set barbase 0'
'set bargap 20'
'set ccolor 15'
'd 'nt'*(bobs-bpred)'
'set gxout errbar'
'set bargap 75'
'set ccolor 1'
'set cthick 5'
'd 'nt'*(bobs-bpred-1.686*stdbobspred);'nt'*(bobs-bpred+1.686*stdbobspred)'
'define zero=0'
'exec line zero 0 3 1 1 0.0'
*
'set strsiz 0.2 0.2'
'set string 1 c 6 0'
'draw string 7.4 0.2 Month'
'set string 1 c 6 90'
'draw string 0.3 2.3 Trend [`3.`0C ('nt' yr)`a-1`n]'
*
'set string 1 bl 6 0'
'set strsiz 0.19 0.21'
'draw string 1.0 3.98 (c) Residual trends'
*
****
*
'set z 1'
'd min('nt'*bobs,z=1,z=12)'
line1=sublin(result,2)
min1=subwrd(line1,4)
'd min('nt'*bobs-bpred,z=1,z=12)'
line1=sublin(result,2)
min2=subwrd(line1,4)
'd min('nt'*(mcmip5-scmip5),z=1,z=12)'
line1=sublin(result,2)
min3=subwrd(line1,4)
'd max('nt'*bobs,z=1,z=12)'
line1=sublin(result,2)
max1=subwrd(line1,4)
'd max('nt'*bobs-bpred,z=1,z=12)'
line1=sublin(result,2)
max2=subwrd(line1,4)
'd max('nt'*(mcmip5+scmip5),z=1,z=12)'
line1=sublin(result,2)
max3=subwrd(line1,4)
*
min=0
if(min1 < min)
  min = min1
endif
if(min2 < min)
  min = min2
endif
if(min3 < min)
  min = min3
endif
max=0
if(max1 > max)
  max=max1
endif
if(max2 > max)
  max = max2
endif
if(max3 > max)
  max = max3
endif
lower=math_int(min)
*
* Reserve extra 15% of space for the labels
*
lower=math_int(min)
max=lower+(max-lower)*1.15
upper=math_int(max+1)
print lower
print upper
*
upper=math_int(max+1)
print min1
print min2
print min3
print lower
print max1
print max2
print max3
print upper
*
'set vpage 4.05 8.3 5.5 8.5'  
*'set vpage 0 4.25 0.4 3.4'
'set parea 1 8 0.7 5.5'
'set xlopts 1 5 0.18'
'set ylopts 1 5 0.18'
*
'set z 0.75 12.25'
*
'set xyrev on'
'set vrange 'lower' 'upper' '
'set ylint 1 8 0.6 5.3'
'set gxout linefill'
'set lfcols 0 92'
'd 'nt'*(mcmip5-scmip5);'nt'*(mcmip5+scmip5)'
'set gxout line'
*
'define zero=0'
'exec line zero 0 3 1 1 0.0'
'exec line 'nt'*bobs 0 6 1 2 0.0'
'exec line 'nt'*(bobs-bpred) 0 6 2 4 0.0'
'exec line 'nt'*mcmip5 0 6 1 1 0.0'
'exec line 'nt'*(mcmip5-scmip5) 0 3 1 1 0.0'
'exec line 'nt'*(mcmip5+scmip5) 0 3 1 1 0.0'
*
'set strsiz 0.2 0.2'
'set string 1 c 6 0'
'draw string 7.4 0.2 Month'
'set string 1 c 6 90'
'draw string 0.3 3.0 Trend [`3.`0C ('nt' yr)`a-1`n]'
*
'set string 1 bl 6 0'
'set strsiz 0.19 0.21'
'draw string 1.0 5.58 (d) Comparison with CMIP5'
*
'set line 2 1 6'
'draw line 1.1 5.3 1.9 5.3'
'set line 4 2 6'
'draw line 1.1 5.0 1.9 5.0'
'set line 1 1 6'
'draw line 3.4 5.3 4.2 5.3'
'set line 92 1 6'
'draw recf 3.4 4.9 4.2 5.1'
'set line 1 1 3'
'draw rec 3.4 4.9 4.2 5.1'
*
'set string 1 l 5 0'
'set strsiz 0.18 0.19'
'draw string 2.0 5.3 ERA5'
'draw string 2.0 5.0 Residual'
'draw string 4.3 5.3 CMIP5 mean'
'draw string 4.3 5.0 CMIP5 mean +/- StDev'
*
* It depends on the GrADS version which of (1) or (2) works ...
*
* Alternative (1)
*  
'print'
'disable print'
*
* Alternative (2)
*  
'gxprint fig'fig'.svg white'
