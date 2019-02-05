
angular.
    module('pandaCanvas').
    component('pandaCanvas', {
        templateUrl: 'panda-canvas/panda-canvas.template.html',
        controller: function PandaCanvasController(asmService, $scope, $http, $window) {
            var ldtext = document.getElementById('ldtext');
            if (ldtext.innerHTML.includes('you have JavaScript disabled')) {
                $window.location.reload();
            } else {
                ldtext.innerHTML = "Checking browser compatibility...";
            }
            // see panda-canvas.component.js for begginings of reset canvas
            var canvas = document.getElementById(asmConfig.canvasId);
            canvas.contentEditable = true;
            canvas.setAttribute("tabindex", "0");
            // Focus the canvas when the mouse enters it.
            canvas.addEventListener('mouseenter', function () { canvas.focus(); }, false);

            var ldbar = document.getElementById("ldbar");
            var ld = document.getElementById("ld");

            //asmService._print = function (text) {
            //    var element = document.getElementById('console');
            //    if (element) {
            //        //element.innerhtml = '';// should clear once on first run only
            //        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            //        element.innerHTML += '<samp>' + text + '\n</samp>';
            //        element.scrollTop = element.scrollHeight; // focus on bottom
            //    };
            //};
            //asmService._printErr = function (text) {
            //    var element = document.getElementById('console');
            //    if (element) {
            //        element.innerHTML = '';
            //    } // clear browser cache
            //    else {
            //        return;
            //    };
            //    if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');

            //    if (text[0] == ':' && text.indexOf('(warning): ') !== -1 || (text.indexOf("WARNING:") === 0)) {
            //        element.innerHTML += '<samp class="warning">' + text + '\n</samp>';
            //    } else if ((text[0] == ':' && text.indexOf('(error): ') !== -1) || (text.indexOf("ERROR:") === 0) || (text === 'Traceback (most recent call last):') || (text.indexOf('Error: ') > 1) || (text.indexOf('Exception: ') > 1) || (text.indexOf('  File "') === 0)) {
            //        element.innerHTML += '<samp class="error">' + text + '\n</samp>';
            //    } else {
            //        element.innerHTML += '<samp>' + text + '\n</samp>';
            //    }
            //    element.scrollTop = element.scrollHeight; // focus on bottom
            //};

            asmService._setStatus = function setStatus(text) {
                //var newString;
                //if (text.indexOf("Downloading data... (") === 0) {
                //    newString = 'Downloading data...';
                //    var parts = text.substring(21, text.length - 1).split('/');
                //    var percentComplete = (parseInt(parts[0]) / parseInt(parts[1])) * 100
                //    ldbar.style.width = percentComplete + '%';
                //} else {
                //    newString = text;
                //}
                //if (newString != ldtext.innerHTML) {
                //    ldtext.innerHTML = newString;
                //    asmService.Module.print(newString);
                //}
                if (text === 'Done!') {
                    ldtext.innerHTML = 'Click "Run Code" to begin.';
                    //window.setTimeout(asmService.Module.autoRun, 0);
                    $scope.$emit('$engineReady');
                    var canvas = document.getElementById("canvas");
                    canvas.style.height = '100%';
                    canvas.style.width = '100%';
                }
            };

            //asmService._monitorRunDependencies = function monitorRunDependencies(left) {
            //    var ldbar = document.getElementById('ldbar');
            //    if (ldbar) {
            //        //console.log('found ldbar ' + left);
            //        asmService.Module.totalDependencies = Math.max(asmService.Module.totalDependencies, left);
            //        var percentComplete = ((asmService.Module.totalDependencies - left) /
            //                                asmService.Module.totalDependencies) * 100;
            //        ldbar.style.width = percentComplete + '%';
            //    }
            //};
            //window.onload = function () {
            $scope.$watch('$viewContentLoaded', function () {
                var canvas = document.getElementById(asmConfig.canvasId);
                try {
                    gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
                } catch (x) {
                    gl = null;
                    ldtext.innerHTML = "WebGL support is required by this application.";
                }
                if (gl) {
                    ldbar.style.display = "block";
                    $http({
                        method: 'GET',
                        url: asmConfig.EMSCRIPTEN_ASM_URL
                    }).then(function (response) {
                        asmService.Module.setStatus("Loading...");
                        setTimeout(function () {
                            var blob = new Blob([response.data], {
                                type: 'text/javascript'
                            });
                            var script = document.createElement("script");
                            script.type = "text/javascript";
                            script.async = true;
                            script.defer = true;
                            script.src = URL.createObjectURL(blob);
                            //script.text = req.responseText;
                            document.body.appendChild(script);
                        }, 0);
                        //}
                    }, function (error) {
                        console.log(asmConfig.EMSCRIPTEN_ASM_URL + ' error: ' + error);
                    });
                }
            });// window.oneload
            window.onerror = function (event) {
                // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
                ldtext.innerHTML = 'Exception thrown, see JavaScript console';
            }; // window.onerror

            function updateProgress(evt) {
                //console.log('update progress ' + evt.loaded);
                var percentComplete = (evt.loaded / asmConfig.ASM_SIZE) * 100;
                ldbar.style.width = percentComplete + '%';
            }// updateProgress()

            asmService.autoRun = function autoRun() {
                document.getElementById("main").style.display = "none";
                var canvas = document.getElementById(asmConfig.canvasId);
                canvas.style.display = "block";
                //asmService.Module.initCanvas = canvas;

                var stopFunc = Module.cwrap('stopPythonCode', 'number');
                stopFunc();
                //console.log('called autoRun');
                //document.getElementById("console").innerHTML = '';
                var runFunc = Module.cwrap('runPythonCode', 'number', ['string']);
                runFunc('from appmain import Game\napp = Game()\napp.run()');
            }// Module.autoRun
            $scope.$on('$engineReady', asmService.autoRun);

            // The below works for resetting the DOM but the engine isn't rendering
            //var resetCanvas = function () {
            //    var element = document.getElementById('canvas');
            //    element.style.display = 'block';
            //    element = window.canvas_;
            //}
            //var _this = this;
            //if (typeof window.canvas_ !== 'undefined') {
            //    _this.resetCanvas();
            //}
            //$scope.$on('$locationChangeStart', function (event, next, old) {
            //    if ('/' === old.split('!')[1]) {
            //        window.canvas_ = document.getElementById('canvas');
            //    }
            //});
            //$scope.$on('$locationChangeSuccess', function (event, current, old) {
            //    if ('/' === current.split('!')[1]) {
            //        _this.resetCanvas();
            //    }
            //});

        }// PandaCanvasController(asmModule)
    });