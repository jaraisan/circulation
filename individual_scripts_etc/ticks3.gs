
************************************************************************
* GrADS-skripti viivojen vetelyyn x- ja y-akselille.
* Kutsu muotoa 
*       run ticks2 axis valmin valmax first dval last pos length size lineth labth
* missa
*   axis = left / right / bottom / top
*   valmin, valmax = muuttujan pienin ja suurin arvo ko. akselilla  
*   first = ensimmäinen tulostettava arvo
*   dval  = arvojen plottausvali
*   last = viimeinen tulostettava arvo
*   pos   = in / mid / out = viivan sijainti plotin reunaan nahden
*   length = viivojen pituus  
*   size   = lukuarvojen plottauskoko (0.00 > ei plotata)
*   lineth = viivojen paksuus
*   labth  = labelien paksuus
*                                                           (PR 26032003) 
************************************************************************
  function ticks (args)
  axis   = subwrd(args,1)
  valmin = subwrd(args,2)
  valmax = subwrd(args,3)
  first  = subwrd(args,4)
  last   = subwrd(args,5)
  dval   = subwrd(args,6)
  pos    = subwrd(args,7)
  length = subwrd(args,8)
  size   = subwrd(args,9)
  lineth = subwrd(args,10)
  labth  = subwrd(args,11)

  'query gxinfo'
  rec3 = sublin(result,3)
  rec4 = sublin(result,4)
  xlow = subwrd(rec3,4)
  xhi  = subwrd(rec3,6)
  ylow = subwrd(rec4,4)
  yhi  = subwrd(rec4,6)

  if (pos='out') 
    f1 = 1
    f2 = 0 
  endif  

  if (pos='mid') 
    f1 = 0.5
    f2 = 0.5
  endif  

  if (pos='in') 
    f1 = 0
    f2 = 1
  endif  

********************
* y-akselin asteikko
********************
  if (axis="left" | axis="right") 
    if (axis="left")
       x1 = xlow - f1*length
       x2 = xlow + f2*length
       x3 = x1 - 0.00-0.5*size
      'set string 1 r 'labth ' 0'
    endif
    if (axis="right")
       x1 = xhi - f2*length
       x2 = xhi + f1*length  
       x3 = x2 + 0.00+0.5*size
      'set string 1 l 'labth ' 0'
    endif
    dy = dval/(valmax-valmin) * (yhi-ylow) - 0.0000001
*    y = ylow
     y = ylow + (first-valmin) * (yhi-ylow) / (valmax-valmin)  
    val = first
    'set strsiz 'size
    'set line 1 1 'lineth
    while (y<yhi) 
      'draw line 'x1' 'y' 'x2' 'y
       if (size > 0.01) 
        'draw string 'x3' 'y' 'val
       endif
       y = y + dy
       val = val + dval
       if(val>last)
         y=yhi
       endif  
    endwhile
  endif

********************
* x-akselin asteikko
********************
  if (axis="bottom" | axis="top") 
    if (axis="bottom")
       y1 = ylow - f1*length
       y2 = ylow + f2*length
       y3 = y1 - 0.0 -0.5*size
      'set string 1 tc 'labth ' 0'
    endif
    if (axis="top")
       y1 = yhi - f2*length
       y2 = yhi + f1*length  
       y3 = y2 + 0.00 +0.5*size
      'set string 1 bc 'labth ' 0'
    endif    
    dx = dval/(valmax-valmin) * (xhi-xlow) - 0.0000001
*    x = xlow
     x = xlow + (first-valmin) * (xhi-xlow) / (valmax-valmin)  
    val = first 
    'set strsiz 'size
    'set line 1 1 'lineth
    while (x<xhi) 
      'draw line 'x' 'y1' 'x' 'y2
       if (size > 0.01) 
         'draw string 'x' 'y3' 'val
       endif
       x = x + dx
       val = val + dval  
    endwhile
  endif

