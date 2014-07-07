// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Functions and objects to manipulate single frequencies and
 *     bands of frequencies.
 */

/**
 * Functions to convert frequencies to human-readable strings.
 */
var Frequencies = (function() {

  /**
   * Converts a frequency to a human-readable format.
   * @param {number} frequency The frequency to convert.
   * @param {boolean} showUnits Whether to show the units (Hz, kHz, MHz, etc.)
   * @param {number=} opt_digits If specified, use a fixed number of digits.
   */
  function humanReadable(frequency, showUnits, opt_digits) {
    var units;
    var suffix;
    if (frequency < 2e3) {
      units = 1;
      suffix = '';
    } else if (frequency < 2e6) {
      units = 1e3;
      suffix = 'k';
    } else if (frequency < 2e9) {
      units = 1e6;
      suffix = 'M';
    } else {
      units = 1e9;
      suffix = 'G';
    }
    if (opt_digits) {
      var number = (frequency / units).toFixed(opt_digits);
    } else {
      var number = String(frequency / units);
    }
    if (showUnits) {
      return number + ' ' + suffix + 'Hz';
    } else {
      return number;
    }
  }

  return {
    humanReadable: humanReadable
  };

})();

/**
 * Default modes.
 */
var Modes = {
  
};

/**
 * Known frequency bands.
 */
var Bands = (function() {
  var WBFM = {modulation: 'WBFM'};

  function fmDisplay(freq, opt_full) {
    return Frequencies.humanReadable(freq, false, 2) + (opt_full ? ' FM' : '');
  }

  function fmInput(input) {
    return input * 1e6;
  }

  var WXFM = {
    modulation: 'NBFM',
    maxF: 10000
  };

  function wxDisplay(freq, opt_full) {
    return (opt_full ? 'WX ' : '') + Math.floor(1 + (freq - 162400000) / 25000);
  }

  function wxInput(input) {
    return Math.floor((input - 1) * 25000) + 162400000;
  }

  return {
    'WW': {
      'FM': new Band('FM', 87500000, 108000000, 100000, WBFM, fmDisplay, fmInput)
    },
    'NA': {
      'FM': new Band('FM', 87500000, 108000000, 100000, WBFM, fmDisplay, fmInput),
      'WX': new Band('WX', 162400000, 162550000, 25000, WXFM, wxDisplay, wxInput)
    },
    'JP': {
      'FM': new Band('FM', 76000000, 90000000, 100000, WBFM, fmDisplay, fmInput)
    },
    'IT': {
      'FM': new Band('FM', 87500000, 108000000, 50000, WBFM, fmDisplay, fmInput)
    }
  };
})();

/**
 * A particular frequency band.
 * @param {string} bandName The band's name
 * @param {number} minF The minimum frequency in the band.
 * @param {number} maxF The maximum frequency in the band.
 * @param {number} stepF The step between channels in the band.
 * @param {Object} mode The band's modulation parameters.
 * @param {function(number, boolean=):string} displayFn A function that takes a frequency
 *     and returns its presentation for display.
 * @param {function(string):number} inputFn A function that take's a display
 *     representation and returns the corresponding frequency.
 * @constructor
 */
function Band(bandName, minF, maxF, stepF, mode, displayFn, inputFn) {
  var name = bandName;
  var min = minF;
  var max = maxF;
  var step = stepF;
  var mode = mode;
  var toDisplayName

  return {
    getName: function() { return name; },
    getMin: function() { return min; },
    getMax: function() { return max; },
    getStep: function() { return step; },
    getMode: function() { return mode; },
    toDisplayName: displayFn,
    fromDisplayName: inputFn
  };
}
