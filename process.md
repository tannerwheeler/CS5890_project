## Basic Info
### PROJECT TITLE??

Names: 

Daniel Mortenson AXXXXXXX email

Tanner Wheeler A01770306 tanner.wheeler@aggiemail.usu.edu

Repository: [https://github.com/tannerwheeler/CS5890_project](https://github.com/tannerwheeler/CS5890_project)

## Background and Motivation

## Project Objectives
This visulization is to help understand the steps each simulation (I don't know exactly what to call your project) takes.  The simulator has been made using C++.  The visualization will be constructed using Javascript and d3.  With the design the viewer should be able to see trends that lead to team success or reward.  The viewer should also be able to see stats on each team given a specific time location during a simulation.  This will help give the game designers and viewers necessary information towards understanding what is occuring during the game and why a team wins while another team loses.

## Data
The data for this visualization is gathered during each simulation.  The simulation generates a binary file of information.  The file will contain time stamps.  At each time stamp the locations and stats of the team units are recorded.  Information such as health, food, supplies, and reward are recorded for each unit.  The number of units for the simulation can vary.  The game can be played with a small amount of links and nodes, 10 nodes, or a large amount of links and nodes, 1000 nodes.  

## Data Processing
The data will be complete. Because the simulation provides the information needed there should not be any values that are missing or that need approximating.  From the data the overall stats for the team will be available.  This will be a summary of health o

## Visualization Design

The first idea is to create a link node graph with the different links as the paths the units of the simulation travel.  The nodes do not contain information except the places where links meet.  The information for each link can be represented by the color of the graph.  This is in a heat map style with the color representing the attribute of the given variable.  This could be the number of one team in a link compared with the other.  The different attributes represted in the heat map will be selected from the two tables.  If the user were to click on an attribute the given attribute values would be displayed on the links.  This can be seen in Figure 1.  Below the link node graph in Figure 1, there is line chart that will show the overall stats for the given attribute.  This can also be linked to specific links that the user can choose.
<img src="VIS fig1-page-001.jpg">

The second idea is similar to the first.  The difference comes in the stroke width of the each link.  This allows the user to see one more attribute.  This can be the amount difference between each group at the link.  This also allows the user to see the main stream paths for the units throughout the graph.  At the bottom of Figure 2 the line graph is replaced with the stacked area chart.  The comparisons that come from the area chart aren't as clear as the line chart because the spatial position is not on the same scale position.
<img src="VIS fig2-page-001.jpg">

The third idea is creating a pie chart for each link.  The pie chart will contain the display the percentage of the attribute for each team at the given node.  The stroke of the pie chart or even the link can still display which team contains the most units on the link.  The pie charts are not as easy to read as the heat map layout.  The pie charts can display which team is doing better at a specific node, but it does not give specific values for the attribute.  The pie chart can become a problem when it comes to scaling the number of links in the graph.  If there are thousands of links in the graph then the pie charts will be overlapping each other and unviewable.  This same problem can come from using a bar chart at the bottom of Figure 3 instead of an stacked area chart or line chart.  The bar charts for each time stamp can be scaled to fit the page, but the amount of time stamps can make the bars thin and hard to read.
<img src="VIS fig3-page-001.jpg">

Our design will incorporate a few of the different aspects from each figure.  From all three figures we will have the two tables showing the general stats of each team at a given time stamp.

<img src="VIS fig1-page-002.jpg"><img src="VIS fig1-page-004">

## Must-Have Features

## Optional Features

## Project Schedule

