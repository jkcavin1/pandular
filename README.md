# pandular
Panda 3D compiled into an Angular JS app

To get running:

Install node.js: https://nodejs.org/en/

git clone https://github.com/jkcavin1/pandular.git

cd into the pandular/ directory

run: npm install

run: https-server ./app


the site is served at the bottom url displayed in your console, something like localhost:8080 or 127.0.0.1:8080



go to localhost:8080/#!/code-editor to load a script into the Ace code editor
the root url automatically serves this script:

from appmain import Game
app = Game()
app.run()

you can see this in the autoRun function in panda-canvas/panda-canvas.component.js
you can build your own into the Asm JS interpreter by adding to the freezify.py script and rebuilding.

example:
freezer.addModule('appmain', filename="path/to/your/game.py")


This is based on the rdb's work found here which is where you'll find more instructions to build Asm JS.
https://discourse.panda3d.org/t/panda3d-webgl-port/14858

It's comprised of Panda 3D, Ace code editor, and Angular JS.
