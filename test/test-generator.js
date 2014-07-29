var expect = require('chai').expect;
var assert = require('chai').assert;
var lib = require('./test-lib.js');
var fs = require("fs");

var test = new lib.testXML();
test.verbose = false; // log setting

// testing options/cases
var TEST_CCDA_SAMPLES = false;
var TEST_CCD = false;
var TEST_SECTIONS = true;

var supportedComponents = {
    payers: 'payers',
    allergies: 'allergies',
    procedures: 'procedures',
    immunizations: 'immunizations',
    medications: 'medications',
    encounters: 'encounters',
    vitals: 'vitals',
    results: 'results',
    social_history: 'social_history',
    demographics: 'demographics',
    plan_of_care: 'plan_of_care',
    problems: 'problems'
};

// test all ccda samples from ccda_samples (json generated by ccda-explorer)
if (TEST_CCDA_SAMPLES) {
    describe('ccda_samples', function () {
        describe('generating CCDA for all ccda_samples samples', function () {
            it('should produce some xml, at the very least', function () {
                var stats = JSON.parse(fs.readFileSync('ccda-explorer/dump/stats.json')),
                    i = 0,
                    sum = 0;
                for (var sample in stats) {
                    i = stats[sample]["index"];
                    if (i < 3) { // add (i < n) to shorten
                        for (var j = 0; j < stats[sample]["files"].length; j++) {
                            fileNameXML = i + "-" + j + ".xml";
                            if (true) { // replace with j < n to shorten
                                if (fileNameXML === "1-0.xml") { // replace with fileNameXML == "[filename]" to narrow down
                                    var XMLDOMs = test.generateXMLDOMForEntireCCD_v2('ccda-explorer/dump/' + i + "-" + j + ".xml", "ccda_explorer");
                                    sum++;
                                    assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                                    console.log("TOTAL ERRORS: " + test.errors["total"]);
                                }
                            }
                        }
                    }
                }
            });
        });
    });
}

// test whole CCD document
if (TEST_CCD) {
    describe('ccda', function () {
        describe('generating CCDA for entire CCD', function () {
            it('should match entire CCD', function () {
                var XMLDOMs = test.generateXMLDOMForEntireCCD_v2('test/fixtures/files/CCD_1.xml', 'sample_ccda');

                assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                console.log("TOTAL ERRORS: " + test.errors["total"]);
            });
        });
    });
}

// test each section individually
if (TEST_SECTIONS) {
    describe('sections', function () {
        it('should match respective sections', function () {
            Object.keys(supportedComponents).forEach(function (section) {
                if (true) { // add section === "[section]" for specific section
                    var XMLDOMs = test.generateXMLDOM(section);

                    assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                    console.log("ERRORS: " + test.errors["sections"][test.curr_section]);
                }
            });
        });
    });
}

// show the error summary
describe('show errors', function () {
    it('should show error summary', function () {
        console.log("\nERROR SUMMARY: " + JSON.stringify(test.errors, null, 4) + "\n" + JSON.stringify(test.error_settings, null, 4));
    });
});
