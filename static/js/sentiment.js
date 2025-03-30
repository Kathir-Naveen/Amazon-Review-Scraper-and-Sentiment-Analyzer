document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the analysis page
    const sentimentMeter = document.getElementById('sentiment-meter');
    const wordCloud = document.getElementById('word-cloud');
    
    if (sentimentMeter && typeof sentimentCompound !== 'undefined') {
        // Create the sentiment meter (semi-circle)
        createSentimentMeter(sentimentCompound);
    }
    
    if (wordCloud && typeof wordCloudData !== 'undefined') {
        // Create the word cloud
        createWordCloud(wordCloudData);
    }
});

// Function to create the sentiment meter using D3.js
function createSentimentMeter(value) {
    // Normalize the compound value to a 0-1 scale for the gauge
    // Compound score is between -1 and 1
    const normalizedValue = (value + 1) / 2;
    
    // Define the SVG dimensions
    const width = document.getElementById('sentiment-meter').clientWidth;
    const height = 150;
    const radius = Math.min(width, height * 2) / 2;
    
    // Create the SVG element
    const svg = d3.select('#sentiment-meter')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height})`);
    
    // Define the gauge arc
    const arc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);
    
    // Create the background gradient
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'gauge-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#d93025');  // Red for negative
    
    gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#fbbc05');  // Yellow for neutral
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#34a853');  // Green for positive
    
    // Add the background arc
    svg.append('path')
        .datum({ endAngle: Math.PI / 2 })
        .style('fill', 'url(#gauge-gradient)')
        .attr('d', arc);
    
    // Define the needle
    const needleLength = radius * 0.85;
    const needleRadius = 5;
    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2]);
    
    const needleAngle = angleScale(normalizedValue);
    
    // Add the needle
    const needle = svg.append('g')
        .attr('transform', `rotate(${needleAngle * 180 / Math.PI})`);
    
    needle.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -needleLength)
        .style('stroke', '#333')
        .style('stroke-width', 3);
    
    needle.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', needleRadius)
        .style('fill', '#333');
    
    // Add the emoji based on sentiment
    let emoji = '😐';  // Default neutral emoji
    
    if (value > 0.05) {
        // Positive
        emoji = value > 0.5 ? '😄' : '🙂';
    } else if (value < -0.05) {
        // Negative
        emoji = value < -0.5 ? '😢' : '🙁';
    }
    
    svg.append('text')
        .attr('x', 0)
        .attr('y', -radius * 0.2)
        .attr('text-anchor', 'middle')
        .style('font-size', '40px')
        .text(emoji);
    
    // Add the score text
    svg.append('text')
        .attr('x', 0)
        .attr('y', -radius * 0.5)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text(`Score: ${(value).toFixed(2)}`);
}

// Function to create the word cloud
function createWordCloud(words) {
    // Clear any existing content first
    d3.select("#word-cloud").html("");
    
    // Set dimensions
    const width = document.getElementById('word-cloud').clientWidth;
    const height = 400;
    
    // Make sure words is parsed as JSON if it's a string
    let wordsData;
    if (typeof words === 'string') {
        try {
            wordsData = JSON.parse(words);
        } catch (e) {
            console.error("Error parsing word cloud data:", e);
            d3.select("#word-cloud-message").style("display", "block");
            return;
        }
    } else {
        wordsData = words;
    }
    
    // Check if words is empty or invalid
    if (!wordsData || !Array.isArray(wordsData) || wordsData.length === 0) {
        d3.select("#word-cloud-message").style("display", "block");
        return;
    }
    
    // Handle different data formats
    const processedWords = wordsData.map(w => {
        // If data is already in correct format
        if (w.text && (w.size !== undefined || w.value !== undefined)) {
            return {
                text: w.text,
                // Scale size relative to the largest word for better visibility
                size: 10 + (Math.min((w.size || w.value || 1), 100) / 3)
            };
        }
        // If data is in [word, value] format
        else if (Array.isArray(w)) {
            return {
                text: w[0],
                size: 10 + (Math.min(w[1], 100) / 3)
            };
        }
        // If data is in {text: "word", size/value/weight: number} format
        else if (typeof w === 'object') {
            const size = w.size || w.value || w.weight || 1;
            return {
                text: w.text || w.word || "unknown",
                size: 10 + (Math.min(size, 100) / 3)
            };
        }
        return null;
    }).filter(w => w !== null);
    
    // If no valid data after processing, show a message
    if (processedWords.length === 0) {
        d3.select("#word-cloud-message").style("display", "block");
        return;
    }
    
    try {
        // Create and add an SVG element to contain the word cloud
        const svg = d3.select("#word-cloud")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        
        // Make sure d3.layout.cloud is available
        if (typeof d3.layout === 'undefined' || typeof d3.layout.cloud === 'undefined') {
            console.error("d3.layout.cloud is not available. Make sure the library is loaded.");
            // Create a simple alternative display
            createSimpleWordDisplay(processedWords, svg, width, height);
            return;
        }
        
        // Configure the layout
        const layout = d3.layout.cloud()
            .size([width, height])
            .words(processedWords)
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => d.size)
            .on("end", words => {
                // Create the word cloud once layout is done
                svg.selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .style("font-size", d => `${d.size}px`)
                    .style("font-family", "Impact")
                    .style("fill", () => {
                        // Use a blue color scheme
                        return d3.interpolateBlues(0.3 + Math.random() * 0.7);
                    })
                    .style("cursor", "pointer")
                    .attr("text-anchor", "middle")
                    .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                    .text(d => d.text)
                    .on("mouseover", function() {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("font-size", d => `${d.size * 1.2}px`)
                            .style("opacity", 0.8);
                    })
                    .on("mouseout", function() {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("font-size", d => `${d.size}px`)
                            .style("opacity", 1);
                    });
            });
        
        // Start the layout
        layout.start();
    } catch (error) {
        console.error("Error creating word cloud:", error);
        // Fall back to simple display
        createSimpleWordDisplay(processedWords, d3.select("#word-cloud"), width, height);
    }
}

// Fallback function to create a simple display of words if the cloud layout fails
function createSimpleWordDisplay(words, container, width, height) {
    // Clear the container
    container.html("");
    
    // Sort words by size (largest first)
    const sortedWords = [...words].sort((a, b) => b.size - a.size);
    
    // Create a simple layout
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    const wordContainer = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);
    
    const columns = 3;
    const wordHeight = 30;
    const wordsPerColumn = Math.ceil(sortedWords.length / columns);
    
    sortedWords.forEach((word, i) => {
        const column = Math.floor(i / wordsPerColumn);
        const row = i % wordsPerColumn;
        
        const x = (column - 1) * (width / 3);
        const y = (row * wordHeight) - (height / 3);
        
        wordContainer.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .style("font-size", `${10 + (word.size / 3)}px`)
            .style("font-family", "Arial")
            .style("fill", d3.interpolateBlues(0.3 + (word.size / 40)))
            .text(word.text);
    });
}

// Add window resize event to make visualizations responsive
window.addEventListener('resize', function() {
    // Clear the containers
    d3.select("#sentiment-meter").html("");
    d3.select("#word-cloud").html("");
    
    // Recreate the visualizations if the data exists
    if (typeof sentimentCompound !== 'undefined') {
        createSentimentMeter(sentimentCompound);
    }
    
    if (typeof wordCloudData !== 'undefined') {
        createWordCloud(wordCloudData);
    }
});