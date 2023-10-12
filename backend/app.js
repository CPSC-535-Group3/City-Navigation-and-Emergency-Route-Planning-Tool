const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const graph = {

}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse the URL and handle query parameters
    const { pathname, query } = parsedUrl;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if ( pathname == '/routes') {
        if (req.method == 'GET') {
            const start = query.start;
            const end = query.end;

            if (!start || !end) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing start or end' }));
                return;
            }

            // make sure start and end are valid in the graph
            if (!graph[start] || !graph[end]) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid start or end' }));
                return;
            }

            // get the shortest path from start to end
            const shortestPath = floydWarshall(start, end);

            res.statusCode = 200;
            // const message = `Hello, ${query.name || 'World'}!`;
            res.end(JSON.stringify({
                "start": start,
                "end": end,
                "path": shortestPath,
                "is_success": shortestPath.length > 0
            }));
        } else {
            // Handle other methods, is meant to use block some ediges.

            // TODO
            // graph

            res.statusCode = 200;
            res.end(JSON.stringify({ "is_success": true }));
        }
    }
    else {
        // Handle other routes or methods
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const floydWarshall = (source, destination) => {
    const n = graph.length;

    // Initialize the distance and path matrices
    const dist = [];
    const path = [];

    for (let i = 0; i < n; i++) {
        dist[i] = [];
        path[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                dist[i][j] = 0; // Distance from a node to itself is 0
            } else if (graph[i][j] !== undefined) {
                dist[i][j] = graph[i][j]; // Direct edge exists
            } else {
                dist[i][j] = Infinity; // No direct edge
            }
            path[i][j] = j; // Initialize path matrix with direct routes
        }
    }

    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    path[i][j] = path[i][k]; // Update the intermediate node in the path
                }
            }
        }
    }

    // If there is no path from source to destination, return an empty array
    if (dist[source][destination] === Infinity) {
        return [];
    }

    // Reconstruct the path
    const reconstructedPath = [source];
    while (source !== destination) {
        source = path[source][destination];
        reconstructedPath.push(source);
    }

    return reconstructedPath;
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
