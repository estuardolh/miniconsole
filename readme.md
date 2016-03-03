miniconsole
===========
doc:
```javascript
void miniconsole.draw();
void miniconsole.update();
void miniconsole.video.plot(x, y, intensity );
void miniconsole.video.set_it(x, y, it );
boolean miniconsole.input.iskeydown( key_name );
boolean miniconsole.input.istouch( x, y, w, h );
boolean miniconsole.input.click( x, y, w, h );
void miniconsole.setFPS( fps );
```

examples:

drawing an array:
```javascript
miniconsole.video.set_it( 0, 0,
[
  [0,2,0],
  [2,2,2],
  [1,0,1],
]);
```
![mini console5](./screenshots/miniconsole5.PNG)

random outs:

![mini console1](./screenshots/miniconsole1.PNG)
![mini console2](./screenshots/miniconsole2.PNG)
![mini console3](./screenshots/miniconsole3.PNG)
![mini console3](./screenshots/miniconsole4.PNG)