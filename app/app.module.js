
angular.module('pandaApp', [
    'ngRoute',
    'pandaCanvas',
    'codeEditor',
]).
    factory('asmService', function ($http) {
        console.log('starting factory');

        var ldtext = document.getElementById(asmConfig.loadStatusId);
        ldtext.innerHTML = "";

        var asmService = {};
        // set nested functions with leading underscores
        // to control the asm js Module's standard interface

        asmService._print = typeof blah__
        asmService._print_ = function print(text) {
            if (asmService._print === 'undefined') {
                if (asmConfig.logLevel === 'verbose')
                    console.log('default print recieved: ' + text)
            } else {
                console.log('print new: ' + text);
                asmService._print(text)
            }
        };

        asmService._printErr = typeof blah__
        asmService._printErr_ = function printErr(text) {
            if (asmService._printErr === 'undefined') {
                if (asmConfig.logLevel === 'verbose')
                    console.log('_printErr_ recieved ' + text)
            } else {
                asmService._printErr(text)
            }
        };

        asmService._setStatus = typeof blah__
        asmService._setStatus_ = function setStatus(text) {
            if (asmService._setStatus === 'undefined') {
                if (asmConfig.logLevel === 'verbose')
                    console.log('default setStatus: ' + text);
            } else {
                asmService._setStatus(text);
            }
        }

        asmService._monitorRunDependencies = typeof blah__
        asmService._monitorRunDependencies_ = function (left) {
            if (asmService._monitorRunDependencies === 'undefined') {
                if (asmConfig.logLevel === 'verbose')
                    console.log('default monitorRunDependencies: ' + left);
            } else {
                asmService._monitorRunDependencies(left);
            }
        }

        var Module = {
            preRun: [],
            postRun: [],
            print: (function () { return asmService._print_ } )(),
            printErr: (function () { return asmService._printErr_ } )(),
            canvas: (function canvas() {
                var canvas = document.getElementById(asmConfig.canvasId);
                return canvas;
            })(),
            setStatus: (function () { return asmService._setStatus_ })(),
            totalDependencies: 0,
            monitorRunDependencies: (function () { return asmService._monitorRunDependencies_ })(),
        };// Module init
        window.Module = asmService.Module = Module;

        var memoryInitializer = 'panda-engine/panda-engine27.js.mem';
        if (typeof asmService.Module['locateFile'] === 'function') {
            memoryInitializer = asmService.Module['locateFile'](memoryInitializer);
        } else if (asmService.Module['memoryInitializerPrefixURL']) {
            memoryInitializer = asmService.Module['memoryInitializerPrefixURL'] + memoryInitializer;
        }// if memory init block
        var xhr = asmService.Module['memoryInitializerRequest'] = new XMLHttpRequest();
        xhr.open('GET', memoryInitializer, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {console.log('recived memoryInit memory state: ' + xhr.readyState.toString());}
        };
        xhr.responseType = 'arraybuffer';
        console.log('send request for memoryInit');
        xhr.send(null);
        
        return asmService;
    });
