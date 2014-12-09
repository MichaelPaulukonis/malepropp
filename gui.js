var gui = function() {

    // TODO: these are information popups
    // grab the information from the original, or rewrite
    var popup = function(url) {
        window.open(url+".html", "win", "toolbar=0,location=0,directories=0,status=0,menubar=1,scrollbars=1,resizable=1,width=300,height=300");
    };

    var popup2 = function(url) {
        window.open(url+".html", "win", "toolbar=0,location=0,directories=0,status=0,menubar=1,scrollbars=1,resizable=1,width=350,height=400");
    };

    return {
        popup: popup,
        popup2: popup2
    };

}();


var preset = function(presets) {

    var propp = storyGen.resetProppFunctions(false); // ARGH these are all now true!

    for (var i = 0; i < presets.functions.length; i++) {

        var func = presets.functions[i];
        var subFunc;
        if (typeof func === 'object') {
            subFunc = func[1];
            func = func[0];
        }
        // sadly, we are discarding the subfuntion in the gui
        // so altough we can fine-grain a preset, we can't use it in the gui...
        // we can't just say "use the preset if selected"
        // becasue we wan't to play with the presets, adding and subtracting in the gui
        // SO: need to store sub-funcs in the gui
        // and why not make them selectable, then....
        propp[func].active = true;


    }

    return propp;
};


var pushPreset = function(setname) {
    if (!storyGen.presets[setname]) { return; }

    var story = preset(storyGen.presets[setname]);
    // pushSettingsToGui(story);
    pushSettingsToGuiNew(storyGen.presets[setname]);

};

// old-fashioned method
var pushSettingsToGui = function(proppFunctions) {

    for (var index in proppFunctions) {
        window.document.myform[index].checked = proppFunctions[index].active;
    }

    // set the radios
    // http://stackoverflow.com/questions/871063/how-to-set-radio-option-checked-onload-with-jquery

};


// take in array of functions
// if element is string, it is an active function
// if element is array, it is a function with a sub-Function
// further parameters not yet handled
// radio button options (globals) not yet handled
var pushSettingsToGuiNew = function(funcs) {

    // TODO: clear the settings

    for (var index in funcs.functions) {

        var func = funcs.functions[index];
        var subFunc;
        if (typeof func === 'object') {
            subFunc = func[1];
            func = func[0];
        }

        window.document.myform[func].checked = true;

        if (subFunc) {
            var id;

            switch (func) {
            case 'func8':
                id = 'func8subfunc';
                break;

            }

            if (id) {
                $('#' + id).val(subFunc);
            }

        }

    }

    window.document.myform.bossfight.checked = funcs.bossfight;


};

var getFunctionsFromGui = function() {

    // proppFunctions is defined in propp.js
    // this is an external dependency to the GUI
    // to the extant that without that file, the GUI has no purpose
    // propp.js should be able to function w/o the GUI, however...
    var funcs = storyGen.resetProppFunctions();
    var f = [];
    for (var index in funcs) {
        funcs[index].active = window.document.myform[index].checked;
    }

    var herog = $('input[name=herogender][type=radio]:checked').val();
    var villaing = $('input[name=villaingender][type=radio]:checked').val();
    var peopleg = $('input[name=peoplegender][type=radio]:checked').val();
    var bossfight = window.document.myform.bossfight.checked;

    // TOO LATE - not in the array, which has to be in order. DANG.
    // funcs = storyGen.enforceRules(funcs);
    pushSettingsToGui(funcs);

    // this is awkward....
    // and how do we handle sub-funcs???
    for (index in funcs) {
        if (index === 'func8') {
            var subFunc = 'func8subfunc';
            var sf = $('#' + subFunc).val();
            var sfv;
            if (sf.toLowerCase() !== 'random') {
                sfv = sf;
                f.push([index, sfv]);
            } else {
                f.push(index);
            }
        } else {
            if (window.document.myform[index].checked) { f.push(index); }
        }
    }

    return {
        herogender: herog,
        villaingender: villaing,
        peoplegender: peopleg,
        functions: funcs,   // object with [funcn].active
        funcs: f,           // array-based list
        bossfight: bossfight
    };

};

var shoveToGui = function(tale) {

    window.document.myform.output.value = tale.title.toUpperCase() + '\n\n' + tale.tale;

};

var guiGet = function() {

    var settings = getFunctionsFromGui();

    var selectedTheme = $('input[name=theme][type=radio]:checked').val();
    settings.verbtense = $('input[name=tense][type=radio]:checked').val();

    var theme = {};
    switch(selectedTheme) {
    case 'office':
        theme = {
            bank: businessbank,
            templates: businessTemplates
        };
        break;

    case 'test':
        theme = {
            bank: defaultbank(words),
            templates: nTemplates
        };
        break;

    case 'original':
        theme = {
            bank: defaultbank(words), // although it won't be used...
            templates: defaultTemplates
        };
    };

    // STILL EXPECTS THE story['funcn'].active stuff to be present. OUTCH
    // WHY ARE WE PASSING THE SETTINGS IN TWICE ?!?!!?!
    var sg = new storyGen(settings);
    var tale = sg.generate(settings, theme);

    shoveToGui(tale);
};

$('#selectall').click(function() {
    var funcs = $('input[type=checkbox]');
    funcs.each(function(index, element) {
        $(element).prop('checked', true);
    });
});

// TODO: use the preset when generating
// no, when selected update the gui....
// and then get rid of the other links
$(document).ready(function() {

    var inp = $('#presets');
    var ps = storyGen.presets;
    $.each(ps, function(key) {
        inp.append($('<option />').val(key).text(key));
    });

    inp.change(function() {
        var preset = $(this).val();
        if (preset !== 'manual') {
            pushPreset(preset);
        }
        // alert('selected!');
    });

    var s = $('#func8subfunc');
    var sf = world.func8subfuncs;
    $.each(world.func8subfuncs, function(key,value) {
        s.append($('<option />').val(value).text(value));
    });


});
