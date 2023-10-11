#!/bin/bash

# Path to the file containing the Overpass QL query
QUERY_FILE="streets_and_intersections.overpassql"

# Read the query from the file
QUERY=$(cat "$QUERY_FILE")

# Run the query and save the JSON output to a file
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --data "data=${QUERY}" https://overpass-api.de/api/interpreter -o ../data/fullerton_map_data.json

echo "Query completed. Results saved to fullerton_map_data.json"
