import React, { useState, useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';
import L from "leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { Polyline } from "react-leaflet/Polyline";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from 'react-leaflet/hooks'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';

import MailIcon from '@mui/icons-material/Mail';
import DirectionsIcon from '@mui/icons-material/Directions';
import RemoveRoadIcon from '@mui/icons-material/RemoveRoad';
import RefreshIcon from '@mui/icons-material/Refresh';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


import Drawer from '@mui/material/Drawer';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function App() {
  const [display, setDisplay] = useState('map');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [markers, setMarkers] = useState([]);

  const handleChange = (event, newDisplay) => {
    setDisplay(newDisplay);
  };

  const LocationMarkers = () => {
    const map = useMapEvents({
      click(e) {
        const newMarkers = JSON.parse(JSON.stringify(markers));
        newMarkers.push(e.latlng);
        setMarkers(newMarkers);
      }
    })

    return (
      <div>
        <Polyline positions={markers} />
        {  
          markers.map((position, index) => {
            return (
              <Marker key={`marker-${index}`} position={position}>
                <Popup>
                  Popup
                </Popup>
              </Marker>
            );
          })
        }
      </div>
    );
  }

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setIsDrawerOpen(false)}
      onKeyDown={() => setIsDrawerOpen(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={(event) => {console.log("Find Shortest Path")}}>
            <ListItemIcon>
              <DirectionsIcon />
            </ListItemIcon>
            <ListItemText primary="Find Shortest Path" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={(event) => {console.log("Simulate Blockage")}}>
            <ListItemIcon>
              <RemoveRoadIcon />
            </ListItemIcon>
            <ListItemText primary="Simulate Blockage" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={event => setMarkers([])}>
            <ListItemIcon>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText primary="Reset" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color='primary'>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             City Navigation and Emergency Route Planning Tool
            </Typography>
            <ToggleButtonGroup
              color="secondary"
              value={display}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="map">Map</ToggleButton>
              <ToggleButton value="graph">Graph</ToggleButton>
            </ToggleButtonGroup>
            <Drawer color='primary' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              {list()}
            </Drawer>
          </Toolbar>
        </AppBar>
      </Box>

      {
        {
          'map': 
            <MapContainer
              center={[33.88875, -117.9285]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: "100vw", height: "100vh" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarkers />
            </MapContainer>,
          'graph': <Graph />
        }[display]
      }
    </Container>
  );
}

function Graph(intersections, streets) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize vis.js options and data
    const nodes = new DataSet([
      { id: 1, label: 'Intersection 1' },
      { id: 2, label: 'Intersection 2' },
      { id: 3, label: 'Intersection 3' },
    ]);

    const edges = new DataSet([
      { id: 1, from: 1, to: 2, label: "Main st" },
      { id: 2, from: 2, to: 3, label: "Broadway" },
    ]);

    const data = { nodes, edges };
    const options = { /* Your options here */ };

    // Create the network
    const network = new Network(containerRef.current, data, options);
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>;
}
