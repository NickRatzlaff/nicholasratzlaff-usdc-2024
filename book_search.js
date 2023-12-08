/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
 function findSearchTermInBooks(searchTerm, scannedTextObj) {

    /* Regex matching searchTerm with zero or more non-alphanumeric 
    chararacters on each side, or at beginning or end of line */
    const regex = new RegExp(`(?:^|\\W)${searchTerm}(?:$|\\W)`);

    var output = {
        "SearchTerm": searchTerm,
        "Results": []
    };

    /* Checks each content object for regex match.
     * If a match is found, add the appropriate info to the output */
    for (i in scannedTextObj) {
        content = scannedTextObj[i].Content;
        for (j in content) {
            if (regex.test(content[j].Text)) {
                output.Results.push(
                    {
                        "ISBN": (scannedTextObj[i].ISBN ? scannedTextObj[i].ISBN : "N/A"),
                        "Page": (content[j].Page ? content[j].Page : "N/A"),
                        "Line": (content[j].Line ? content[j].Line : "N/A")
                    }
                )
            }
        }
    }
    return output; 
}


/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

if (runTests = true) {
    console.log("Running test suite...");
    testInput = getInputObject();

    console.log("\nBasic Results")
    outputTest("One Match", "now", testInput, getOutput("now", 1));
    outputTest("No Match", "NoMatch", testInput, getOutput("NoMatch", 0));
    outputTest("Multiple Matches", "the", testInput, getOutput("the", 3));

    console.log("\nResult Qualification")
    outputTest("Accept Multi-Word Input","simply went on", testInput, getOutput("simply went on", 1));
    outputTest("Accept Search Term with Punctuation", "momentum", testInput, getOutput("momentum", 1));
    outputTest("Reject Non-Matching Case", "Now", testInput, getOutput("Now", 0));
    outputTest("Reject Search Term as Substring", "no", testInput, getOutput("no", 0));

    console.log("\nIrregular Inputs")
    outputTest("Empty Search Term", "", testInput, getOutput("", "All"));
    outputTest("Null Search Term", null, testInput, getOutput(null, 0));
    outputTest("Empty Input Object", "the", [], getOutput("the", 0));
    outputTest("Null Input Object", "the", null, getOutput("the", 0));
    outputTest("Incomplete Input Object", "water", testInput, getOutput("water", "Incomplete"));
}

/**
 * Compares the output of findSearchTermInBooks() to an expected output and 
 * prints the result to the console.
 * @param {string} testName - The name of the test that will be printed to the console.
 * @param {string} testSearchTerm - The search term parameter for findSearchTermInBooks()
 * @param {string} testInput - The scanned object parameter for findSearchTermInBooks() 
 * @param {string} expectedOutput - The predefined output object being compared to the actual output
 * */ 
function outputTest(testName, testSearchTerm, testInput, expectedOutput) {
    const testResult = findSearchTermInBooks(testSearchTerm, testInput); 
    if (JSON.stringify(testResult) === JSON.stringify(expectedOutput)) {
        console.log("PASS: " + testName);
    } else {
        console.log("FAIL: " + testName);
        console.log("Expected:", expectedOutput);
        console.log("Received:", testResult);
    }
}

/** Returns basic input object */
function getInputObject() {
    return [
        {
            "Title": "Twenty Thousand Leagues Under the Sea",
            "ISBN": "9780000528531",
            "Content": [
                {
                    "Page": 31,
                    "Line": 8,
                    "Text": "now simply went on by her own momentum.  The dark-"
                },
                {
                    "Page": 31,
                    "Line": 9,
                    "Text": "ness was then profound; and however good the Canadian\'s"
                },
                {
                    "Page": 31,
                    "Line": 10,
                    "Text": "eyes were, I asked myself how he had managed to see, and"
                } 
            ] 
        },
        {
            "Title": "Harry Potter and the Chamber of Secrets",
            "ISBN": "9780439064866",
            "Content": [
                {
                    "Page": 84,
                    "Line": 15,
                    "Text": "Raindrops the size of bullets thundered on the castle windows for days on end; the"
                },
                {
                    "Page": 84,
                    "Line": 16,
                    "Text": "lake rose and flower beds turned into muddy streams. Hagrid's pumpkins"
                },
                {
                    "Page": 84,
                    "Line": 17,
                    "Text": "swelled to the size of garden sheds. Oliver Wood's enthusiasm for regular training"
                } 
            ] 
        },
        {
            "Title": "All the Light We Cannot See",
            "Content": [
                {
                    "Page": 24,
                    "Text": "In a corner stands two galvanized buckets filled with water. Fill"
                },
                {
                    "Page": 24,
                    "Line": 5,
                    "Text": "them up, her great-uncle has taught her, whenever you can. The bathtub on our"
                },
                {
                    "Line": 6,
                    "Text": "third floor too. Who knows when our water will go out again"
                } 
            ] 
        }
    ]
}

/**
 * Returns one of several predefined output objects to be provided to outputTest() 
 * @param {string} searchTerm - The search term item in the output object
 * @param {number|string} resultSet - Used to select which set of results will be used in the output
 * @returns {JSON} The expected output object
 * */ 
function getOutput(searchTerm, resultSet) {
    const output = {
        "SearchTerm": searchTerm,
        "Results": []
    }

    switch (resultSet) {
        case 0:
            break;
        case 1:
            output.Results.push(
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 8
                }
            )
            break;
        case 2:
            output.Results.push(
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 9
                },
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 10 
                }
            )
            break;
        case 3:
            output.Results.push(
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 9
                },
                {
                    "ISBN": "9780439064866",
                    "Page": 84,
                    "Line": 15
                },
                {
                    "ISBN": "9780439064866",
                    "Page": 84,
                    "Line": 17
                }
            )
            break;
        //Use -1 in case where you want every line in result
        case "All":
            output.Results.push(
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 8
                },
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 9
                },
                {
                    "ISBN": "9780000528531",
                    "Page": 31,
                    "Line": 10
                },
                {
                    "ISBN": "9780439064866",
                    "Page": 84,
                    "Line": 15
                },
                {
                    "ISBN": "9780439064866",
                    "Page": 84,
                    "Line": 16
                },
                {
                    "ISBN": "9780439064866",
                    "Page": 84,
                    "Line": 17
                },
                {
                    "ISBN": "N/A",
                    "Page": 24,
                    "Line": "N/A"
                },
                {
                    "ISBN": "N/A",
                    "Page": 24,
                    "Line": 5
                },
                {
                    "ISBN": "N/A",
                    "Page": "N/A",
                    "Line": 6
                }
            )
            break;
        case "Incomplete":
            output.Results.push(     
                {
                    "ISBN": "N/A",
                    "Page": 24,
                    "Line": "N/A"
                },
                {
                    "ISBN": "N/A",
                    "Page": "N/A",
                    "Line": 6
                }    
            )
            break;
        default:
            break;
    }

    return output;
}
