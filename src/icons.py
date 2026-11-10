# App icons: a red hanko-style square with Mt Fuji, drawn with shapes only (no fonts needed)
from PIL import Image, ImageDraw
def icon(size, pad_frac=0.0, path=None):
    S=1024; im=Image.new('RGB',(S,S),'#0f1a2a'); d=ImageDraw.Draw(im)
    p=int(S*pad_frac)
    inner=(p+90,p+90,S-p-90,S-p-90)
    d.rounded_rectangle(inner,radius=int((S-2*p)*0.12),fill='#fbf7ee',outline='#c8352a',width=int((S-2*p)*0.045))
    x0,y0,x1,y1=inner; w=x1-x0; h=y1-y0
    # red sun
    cx,cy,r=x0+w*0.68,y0+h*0.32,w*0.11; d.ellipse((cx-r,cy-r,cx+r,cy+r),fill='#c8352a')
    # Fuji
    base=y0+h*0.80; peak=(x0+w*0.42,y0+h*0.30)
    d.polygon([(x0+w*0.08,base),(peak[0]-w*0.07,peak[1]),(peak[0]+w*0.07,peak[1]),(x0+w*0.80,base)],fill='#1d3a5f')
    d.polygon([(peak[0]-w*0.07,peak[1]),(peak[0]+w*0.07,peak[1]),(peak[0]+w*0.17,peak[1]+h*0.16),(peak[0]+w*0.07,peak[1]+h*0.12),(peak[0],peak[1]+h*0.17),(peak[0]-w*0.08,peak[1]+h*0.11),(peak[0]-w*0.17,peak[1]+h*0.16)],fill='#ffffff')
    # rail line
    d.rectangle((x0+w*0.06,y0+h*0.84,x1-w*0.06,y0+h*0.86),fill='#c8352a')
    im.resize((size,size),Image.LANCZOS).save(path,optimize=True)
icon(192,0,'public/icons/icon-192.png');icon(512,0,'public/icons/icon-512.png');icon(512,0.10,'public/icons/maskable-512.png');icon(180,0,'public/icons/apple-touch-icon.png')
print('icons ok')
