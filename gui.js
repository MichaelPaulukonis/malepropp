import businessbank from "./lib/business.wordbank.js";
import defaultTemplates from "./lib/default.templates.js";
import storyGen from "./lib/propp.js";
import businessTemplates from "./lib/templates.business.js";
import descriptiveTemplates from "./lib/templates.descriptive.js";
import nTemplates from "./lib/templates.js";
import defaultbank from "./lib/wordbank.test.js";
import words from "./lib/words.js";

var world = storyGen.world;

var gui = (function () {
  // TODO: these are information popups
  // grab the information from the original, or rewrite
  var popup = function (url) {
    window.open(
      url + ".html",
      "win",
      "toolbar=0,location=0,directories=0,status=0,menubar=1,scrollbars=1,resizable=1,width=300,height=300",
    );
  };

  var popup2 = function (url) {
    window.open(
      url + ".html",
      "win",
      "toolbar=0,location=0,directories=0,status=0,menubar=1,scrollbars=1,resizable=1,width=350,height=400",
    );
  };

  var setall = function (toggle) {
    var funcs = document.querySelectorAll("input[type=checkbox]");
    funcs.forEach(function (element) {
      element.checked = toggle;
    });
  };

  var randomize = function () {
    var funcs = document.querySelectorAll("input[type=checkbox]");
    funcs.forEach(function (element) {
      element.checked = Math.random() < 0.5;
    });
  };

  return {
    popup: popup,
    popup2: popup2,
    setall: setall,
    randomize: randomize,
  };
})();

var preset = function (presets) {
  var propp = storyGen.resetProppFunctions(false); // ARGH these are all now true!

  for (var i = 0; i < presets.functions.length; i++) {
    var func = presets.functions[i];
    var subFunc;
    if (typeof func === "object") {
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

var pushPreset = function (setname) {
  if (!storyGen.presets[setname]) {
    return;
  }

  var story = preset(storyGen.presets[setname]);
  // pushSettingsToGui(story);
  pushSettingsToGuiNew(storyGen.presets[setname]);
};

// old-fashioned method
var pushSettingsToGui = function (proppFunctions) {
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
var pushSettingsToGuiNew = function (funcs, toggle) {
  toggle = toggle || true;

  gui.setall(false);

  for (var index in funcs.functions) {
    var func = funcs.functions[index];
    var subFunc;
    if (typeof func === "object") {
      subFunc = func[1];
      func = func[0];
    }

    window.document.myform[func].checked = toggle;

    if (subFunc) {
      var id;

      switch (func) {
        case "func8":
          id = "func8subfunc";
          break;
      }

      if (id) {
        document.getElementById(id).value = subFunc;
      }
    }
  }

  window.document.myform.bossfight.checked = funcs.bossfight;
};

var getFunctionsFromGui = function () {
  // proppFunctions is defined in propp.js
  // this is an external dependency to the GUI
  // to the extant that without that file, the GUI has no purpose
  // propp.js should be able to function w/o the GUI, however...
  var funcs = storyGen.resetProppFunctions();
  var f = [];
  for (var index in funcs) {
    funcs[index].active = window.document.myform[index].checked;
  }

  var herog = document.querySelector(
    "input[name=herogender][type=radio]:checked",
  ).value;
  var villaing = document.querySelector(
    "input[name=villaingender][type=radio]:checked",
  ).value;
  var peopleg = document.querySelector(
    "input[name=peoplegender][type=radio]:checked",
  ).value;
  var bossfight = window.document.myform.bossfight.checked;

  // TOO LATE - not in the array, which has to be in order. DANG.
  // funcs = storyGen.enforceRules(funcs);
  pushSettingsToGui(funcs);

  // this is awkward....
  // and how do we handle sub-funcs???
  for (index in funcs) {
    if (window.document.myform[index].checked) {
      if (index === "func8") {
        var subFunc = "func8subfunc";
        var sf = document.getElementById(subFunc).value;
        var sfv;
        if (sf.toLowerCase() !== "random") {
          sfv = sf;
          f.push([index, sfv]);
        } else {
          f.push(index);
        }
      } else {
        f.push(index);
      }
    }
  }

  return {
    herogender: herog,
    villaingender: villaing,
    peoplegender: peopleg,
    functions: funcs, // object with [funcn].active
    funcs: f, // array-based list
    bossfight: bossfight,
  };
};

var shoveToGui = function (tale) {
  // not every theme defines a title generator (eg. descriptive/skeleton
  // theme) - tale.title can be undefined
  var title = tale.title ? tale.title.toUpperCase() : "(untitled)";
  window.document.myform.output.value = title + "\n\n" + tale.tale;
};

var guiGet = function () {
  var settings = getFunctionsFromGui();

  settings.conclusion = true;

  var selectedTheme = document.querySelector(
    "input[name=theme][type=radio]:checked",
  ).value;
  settings.verbtense = document.querySelector(
    "input[name=tense][type=radio]:checked",
  ).value;

  var theme = {};
  switch (selectedTheme) {
    case "office":
      theme = {
        bank: businessbank(words),
        templates: businessTemplates,
      };
      break;

    case "test":
      theme = {
        bank: defaultbank(words),
        templates: nTemplates,
      };
      break;

    case "descriptive":
      theme = {
        bank: defaultbank(words),
        templates: descriptiveTemplates,
      };
      break;

    case "original":
      theme = {
        bank: defaultbank(words), // although it won't be used...
        templates: defaultTemplates,
      };
  }

  // STILL EXPECTS THE story['funcn'].active stuff to be present. OUTCH
  // WHY ARE WE PASSING THE SETTINGS IN TWICE ?!?!!?!
  var sg = new storyGen(settings);
  var tale = sg.generate(settings, theme);

  shoveToGui(tale);
};

// TODO: no element with id="selectall" exists in index.html - this has
// always been dead code (jQuery no-op'd silently on it; guarded here to
// keep that same behavior). Either add the element or delete this block.
var selectAllBtn = document.getElementById("selectall");
if (selectAllBtn) {
  selectAllBtn.addEventListener("click", function () {
    gui.setall(true);
  });
}

// TODO: use the preset when generating
// no, when selected update the gui....
// and then get rid of the other links
document.addEventListener("DOMContentLoaded", function () {
  var inp = document.getElementById("presets");
  var ps = storyGen.presets;

  var unselectedOpt = document.createElement("option");
  unselectedOpt.value = "unselected";
  unselectedOpt.textContent = "-- Select a preset --";
  inp.appendChild(unselectedOpt);

  var selectallOpt = document.createElement("option");
  selectallOpt.value = "selectall";
  selectallOpt.textContent = "Select all";
  inp.appendChild(selectallOpt);

  Object.keys(ps).forEach(function (key) {
    var opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    inp.appendChild(opt);
  });

  inp.addEventListener("change", function () {
    var preset = this.value;
    if (preset === "unselected") {
      gui.setall(false);
    } else if (preset === "selectall") {
      gui.setall(true);
    } else if (preset !== "manual") {
      pushPreset(preset);
    }
  });

  var randomBtn = document.getElementById("randomize");
  if (randomBtn) {
    randomBtn.addEventListener("click", function () {
      inp.value = "unselected";
      gui.randomize();
    });
  }

  var clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      inp.value = "unselected";
      gui.setall(false);
      document.getElementById("func8subfunc").selectedIndex = 0;
      document.getElementById("r1").checked = true;
      document.getElementById("herogenderfemale").checked = true;
      document.getElementById("villaingenderfemale").checked = true;
      document.getElementById("peoplegenderfemale").checked = true;
      document.getElementById("tensepast").checked = true;
      window.document.myform.output.value = "";
    });
  }

  var THEME_STORAGE_KEY = "malepropp-theme";

  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    var updateThemeToggleLabel = function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      themeToggleBtn.textContent = isDark
        ? "Switch to light"
        : "Switch to dark";
    };
    updateThemeToggleLabel();

    themeToggleBtn.addEventListener("click", function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? "light" : "dark");
      } catch (e) {}
      updateThemeToggleLabel();
    });
  }

  var s = document.getElementById("func8subfunc");
  Object.keys(world.func8subfuncs).forEach(function (key) {
    var value = world.func8subfuncs[key];
    var opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    s.appendChild(opt);
  });
});
