var LOCAL_STORAGE_KEY = `secret-santa-${new Date().getFullYear()}`;

function initalizeTable() {
    let savedTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedTable === null)
        return;
    
    for (let i = 0; i < savedTable.length; i++) {
        let savedRow = savedTable[i];
        let tbody = document.getElementById("participants").getElementsByTagName('tbody')[0];
        let htmlRow = tbody.insertRow();
        let participantCell = htmlRow.insertCell(0);
        participantCell.contentEditable = true;
        participantCell.textContent = savedRow[0];
        participantCell.onkeyup = delay(onKeyUp, 500);
        let soCell = htmlRow.insertCell(1);
        soCell.contentEditable = true;
        soCell.textContent = savedRow[1];
        soCell.onkeyup = delay(onKeyUp, 500);
        let lastYearSelectionCell = htmlRow.insertCell(2);
        lastYearSelectionCell.contentEditable = true;
        lastYearSelectionCell.textContent = savedRow[2];
        lastYearSelectionCell.onkeyup = delay(onKeyUp, 500);
    }

    synchronizeTables();
}

// Courtesy of https://stackoverflow.com/a/1909508
function delay(fn, ms) {
    let timer = 0;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    }
}

function synchronizeTables() {
    // Set assignment table to match participant table
    let participantTable = document.getElementById("participants");
    let assignmentTable = document.getElementById("assignments");
    let newTBody = document.createElement("tbody");
    for (let i = 1; i < participantTable.rows.length; i++) {
        let row = participantTable.rows[i];
        let participant = row.cells[0].textContent;
        let htmlRow = newTBody.insertRow();
        let participantCell = htmlRow.insertCell(0);
        participantCell.textContent = participant;
        let recipientCell = htmlRow.insertCell(1);
    }
    let oldTBody = assignmentTable.getElementsByTagName('tbody')[0];
    if (oldTBody) {
        oldTBody.parentNode.replaceChild(newTBody, oldTBody);
    }
}

function onKeyUp(element) {
    let participantTable = document.getElementById("participants");
    // Validate uniqueness of participants
    let participants = new Set();
    // Start at 1 to skip header
    for (let i = 1; i < participantTable.rows.length; i++) {
        let row = participantTable.rows[i];
        let participant = row.cells[0].textContent;
        if (!participants.has(participant)) {
            participants.add(participant);
        } else {
            alert("duplicate participants! that will be tough :(");
        }
    }

    // Set payload to save to local storage
    let payload = [];
    for (let i = 1; i < participantTable.rows.length; i++) {
        let row = participantTable.rows[i];
        let participant = row.cells[0].textContent;
        // assignmentTable.rows[i].cells[0].textContent = participant;
        let significantOther = row.cells[1].textContent;
        let lastYearSelection = row.cells[2].textContent;
        payload.push([participant, significantOther, lastYearSelection]);
    }

    // Save to local storage
    console.log(`saving: ${JSON.stringify(payload)}`);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    synchronizeTables();
}

function applyAssignments(assignments) {
    let assignmentTable = document.getElementById("assignments");
    for (let i = 1; i < assignmentTable.rows.length; i++) {
        let row = assignmentTable.rows[i];
        let participant = row.cells[0].textContent;
        row.cells[1].textContent = assignments[participant];
    }
}

function assign() {
    // Validate selections for SOs and last year selections
    let savedTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedTable === null) {
        alert("no data saved, cannot assign!");
        return;
    }
    
    let assignments = {};
    let done = false;
    let numAttempts = 0;
    let maxAttempts = 10;
    while (!done && numAttempts < maxAttempts) {
        assignments = {};
        let unassigned = new Set();
        let blockLists = {};
        for (let i = 0; i < savedTable.length; i++) {
            let row = savedTable[i];
            let participant = row[0];
            assignments[participant] = null;
            unassigned.add(participant);
            blockLists[participant] = [participant, row[1], row[2]];
        }
        
        let ctr = 0;
        let assignmentsArray = Object.keys(assignments);
        while (ctr <= assignmentsArray.length) {
            let participant = assignmentsArray[ctr];
            // Check if all remaining unassigned are in blocklist, in which case we need to short circuit and restart the entire assignment
            let eligbleSelections = [...unassigned].filter(x => !blockLists[participant].includes(x));
            if (eligbleSelections.length === 0) {
                console.log(`attempt #${numAttempts}: no eligble selections left, unable to assign!`);
                break;
            }

            let randomSelection = eligbleSelections[Math.floor(Math.random() * eligbleSelections.length)];
            assignments[participant] = randomSelection;
            unassigned.delete(randomSelection);
            blockLists[randomSelection].push(participant);
            // Only increment if a valid participant was selected
            ctr++;
        };

        if (unassigned.size === 0) {
            done = true;
        }

        numAttempts++;
    }

    if (numAttempts === maxAttempts) {
        alert("max number of attempts reached :(");
    } else {
        console.log(`assignments: ${JSON.stringify(assignments)}`);
        applyAssignments(assignments);
    }
}

function addParticipant() {
    let tbody = document.getElementById("participants").getElementsByTagName('tbody')[0];
    let row = tbody.insertRow();
    let participantCell = row.insertCell(0);
    participantCell.contentEditable = true;
    participantCell.onkeyup = delay(onKeyUp, 500);
    let soCell = row.insertCell(1);
    soCell.contentEditable = true;
    soCell.onkeyup = delay(onKeyUp, 500);
    let lastYearSelectionCell = row.insertCell(2);
    lastYearSelectionCell.contentEditable = true;
    lastYearSelectionCell.onkeyup = delay(onKeyUp, 500);
}

window.onload = function() {
    initalizeTable();
};