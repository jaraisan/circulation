*
* Script for plotting monthly time series of actual, circulation-related and
* residual time series over the area defined by the user
* 
function T_series_auto (args)
*
area = subwrd(args,1)
lon1 = subwrd(args,2)
lon2 = subwrd(args,3)
lat1 = subwrd(args,4)
lat2 = subwrd(args,5)
year1 = subwrd(args,6)
year2 = subwrd(args,7)
fig = subwrd(args,8)
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
if(year1<1979)
  say 'Warning: increasing year1 to 1979'
  year1=1979
endif
if(year2>2018)
  say 'Warning: reducing year2 to 2018'  
  year2=2018
endif
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
* Opening file
*
'reinit' 
'open T_anomalies_ERA5_1979-2018.ctl'
'open T_anomalies_circ_1979-2018.ctl'
*
'set x 1'
'set y 1'
*
'set z 1 12'
'set t 1 40'
'set e 1' 
'define obs=aave(tanom.1,lon='llon1',lon='llon2',lat='llat1',lat='llat2')'
'define pred=aave(tanom.2,lon='llon1',lon='llon2',lat='llat1',lat='llat2')'
'define time=sum(1+0*obs,t-39,t+0)'
*
* Calculate trends
*  
'set z 1 12'
'exec trends obs pred time 't1' 't2''
*
* Explained variance:
*
'set z 1 12'
'explvar=100*(1-dvarobspred/dvarobs)'
'set z 1'
'explvarann=100*(1-ave(dvarobspred,z=1,z=12)/ave(dvarobs,z=1,z=12))'
*
'set imprun off2'
*
* This only works in older grads versions:
*
'enable print fig'fig''
*
* Plot the time series for the 12 months individually  
*  
run' 'T_series_mon.gs' '1' 'a' 'January' '0.0' '2.9' '8.3' '10.3' 't1' 't2 
run' 'T_series_mon.gs' '2' 'b' 'February' '2.8' '5.7' '8.3' '10.3' 't1' 't2
run' 'T_series_mon.gs' '3' 'c' 'March' '5.6' '8.5' '8.3' '10.3' 't1' 't2
run' 'T_series_mon.gs' '4' 'd' 'April' '0.0' '2.9' '6.2' '8.2' 't1' 't2
run' 'T_series_mon.gs' '5' 'e' 'May' '2.8' '5.7' '6.2' '8.2' 't1' 't2
run' 'T_series_mon.gs' '6' 'f' 'June' '5.6' '8.5' '6.2' '8.2' 't1' 't2
run' 'T_series_mon.gs' '7' 'g' 'July' '0.0' '2.9' '4.1' '6.1' 't1' 't2
run' 'T_series_mon.gs' '8' 'h' 'August' '2.8' '5.7' '4.1' '6.1' 't1' 't2
run' 'T_series_mon.gs' '9' 'i' 'September' '5.6' '8.5' '4.1' '6.1' 't1' 't2
run' 'T_series_mon.gs' '10' 'j' 'October' '0.0' '2.9' '2.0' '4.0' 't1' 't2
run' 'T_series_mon.gs' '11' 'k' 'November' '2.8' '5.7' '2.0' '4.0' 't1' 't2
run' 'T_series_mon.gs' '12' 'l' 'December' '5.6' '8.5' '2.0' '4.0' 't1' 't2
*
'set vpage off'
'set string 1 l 5 0'
'set strsiz 0.13 0.13'
'draw string 0.2 10.75 'area' (lon='lon1' to 'lon2'; lat='lat1' to 'lat2')'
'draw string 0.2 10.5 Years 'year1' to 'year2''
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
