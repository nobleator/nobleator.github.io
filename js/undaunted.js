const localStorageKey = "undaunted-game-state";
// Setting this as a global object so it can be referenced by multiple functions
var db = null;

const initializeDatabase = async () => {
    // https://sql.js.org/#/
    const sqlPromise = initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    const dataPromise = fetch("/db/undaunted.db").then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    db = new SQL.Database(new Uint8Array(buf));
}

const loadGraphData = () => {
    const res = db.exec(`
    select distinct s.id || '[' || s.label || ']' 
        || (CASE WHEN e.label IS NULL THEN ' --- ' ELSE ' --- ' || '|' || e.label || '| ' END) 
        || t.id || '[' || t.label || ']' as x
    from node s
    join edge e on e.source_node_id = s.id 
    join node t on e.target_node_id = t.id
    order by e.id
    `);
    // let out = '%%{init: {"flowchart": {"defaultRenderer": "elk"}, "theme": "dark" } }%%';
    let out = '%%{init: { "theme": "dark" } }%%';
    out += '\nflowchart TD\n';
    out += res[0].values.map(x => x[0]).join('\n');
    return out;
}

const getNodeFamilyIds = (nodeCodes) => {
    // TODO sql.js parameter binding
    // Return nodes that have a relation to the input game state nodes, either as parent, child, or self.
    // The extended relations are required to support game state only input, as briefings and scenarios separate the game states themselves.
    // Every game state has a briefing + scenario, except the R-* states, which have only a briefing.
    // Therefore, the R-* states skip grandchildren.

    const query = `
    with main as (
        select n.id, n.code
        from node n
        where n.code in ('${nodeCodes.join("','")}')
    )
    ,child as (
        select n.id, n.code, m.code as parent
        from node n
        join edge e on e.target_node_id = n.id
        join main m on m.id = e.source_node_id
    )
    ,gchild as (
        select n.id, n.code
        from node n
        join edge e on e.target_node_id = n.id
        join child c on c.id = e.source_node_id
        where c.parent not like 'GS:R-%'
    )
    select m.id
    from main m
    union
    select c.id
    from child c
    union
    select gc.id
    from gchild gc
    `;
    const res = db.exec(query);
    return res.length > 0 ? res[0].values.map(x => x[0]) : [];
}

const getNodePairs = (nodeIds) => {
    // Return all pairs of edges between nodes, where one of the nodes is in the input list
    const query = `
    with cte as (
        select sub.id
        from node sub
        where sub.id in (${nodeIds.join(",")})
    )
    select distinct s.id, t.id
    from node s
    join edge e on e.source_node_id = s.id 
    join node t on e.target_node_id = t.id
    join cte x on x.id = s.id
    join cte y on y.id = t.id
    order by e.id
    `;
    const res = db.exec(query);
    return res.length > 0 ? res[0].values : [];
}

const nodeClickHandler = function() {
    // TODO add events for each node
    // Note: Cannot use arrow function as `this` needs to refer to the element calling the handler
    console.log(`A callback was triggered for node ID ${this.id}`);
};

const drawDiagram = async (graphData) => {
    let element = document.getElementById('graph');
    mermaid.initialize({ 
        startOnLoad: false,
    });
    const { svg } = await mermaid.render('graphDiv', graphData);
    element.innerHTML = svg;

    let panZoom = svgPanZoom('#graphDiv', {
        fit: true,
        contain: false,
        center: true,
        maxZoom: 20,
    });
    panZoom.zoom(2);
};

const applyClickHandlers = () => {
    // Mermaid and Hugo don't seem to play well together with clickable nodes, so this adds click events directly
    let elementsArray = document.querySelectorAll("g.node");
    elementsArray.forEach(function(elem) {
        elem.classList.add("clickable");
        elem.addEventListener("click", nodeClickHandler);
    });
}

const applyPathStyling = (nodeCodes) => {
    // Mermaid node and edge styling is inconsistent with the elk renderer
    // Additionally, using the native styling would require re-rendering on input updates, which is slow
    // So instead, we directly set styles here based on the input path
    const nodeIds = getNodeFamilyIds(nodeCodes);
    let edgeElements = document.querySelectorAll("path.flowchart-link");
    edgeElements.forEach(function(elem) {
        elem.style.stroke = null;
    });

    let nodeElements = document.querySelectorAll("g[id^=flowchart-] > rect");
    nodeElements.forEach(function(elem) {
        elem.style.stroke = null;
    });

    if (nodeIds.length > 0) {
        const nodePairs = getNodePairs(nodeIds);
        const edgeSelector = nodePairs.map(x => `path.flowchart-link.LS-${x[0]}.LE-${x[1]}`).join(',');
        edgeElements = document.querySelectorAll(edgeSelector);
        edgeElements.forEach(function(elem) {
            elem.style.stroke = "#f66";
        });
    
        const nodeSelector = nodeIds.map(x => `g[id^=flowchart-${x}-] > rect`).join(',');
        nodeElements = document.querySelectorAll(nodeSelector);
        nodeElements.forEach(function(elem) {
            elem.style.stroke = "#f66";
        });
    }    
}

const setInput = () => {
    const priorValue = localStorage.getItem(localStorageKey);
    const input = document.getElementById("hypo-game-state");
    if (!input.value) {
        if (priorValue) {
            input.value = priorValue;
        } else {
            input.value = "1a,2a,3b,4a,5b,6a,7b,8a,9b,R-22,10c,11b,12a,13b,14a,15b,END-N";
        }
    }
}

const getInput = () => {
    const input = document.getElementById("hypo-game-state");
    // Game state codes are prefixed with "GS:"
    const nodeCodes = input.value.split(',').map(x => `GS:${x}`);
    return nodeCodes;
}

const handleInputChange = () => {
    const input = document.getElementById("hypo-game-state");
    localStorage.setItem(localStorageKey, input.value);
    const nodeCodes = getInput();
    applyPathStyling(nodeCodes);
}

const errorHandler = (error) => {
    console.error("Error encountered loading graph data:", error);
}

document.addEventListener("DOMContentLoaded", () => {
    // https://mermaid.js.org/config/usage.html#advanced-usage
    mermaid.initialize({ 
        startOnLoad: false,
    });

    initializeDatabase()
        .then(loadGraphData)
        .then(drawDiagram)
        .then(applyClickHandlers)
        .then(setInput)
        .then(getInput)
        .then(applyPathStyling)
        .catch(errorHandler);
    
    document.getElementById("hypo-game-state").addEventListener("keyup", handleInputChange);
}, false);