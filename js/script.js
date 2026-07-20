// Find our date picker inputs on the page
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days
// - Restrict dates to NASA's APOD archive
setupDateInputs(startInput, endInput);

// ================================
// NASA APOD Gallery
// ================================

// NASA API information
const API_KEY = "YOUR_NASA_API_KEY";
const API_URL = "https://api.nasa.gov/planetary/apod";

// Get the remaining elements from the HTML
const getImagesButton = document.getElementById("get-images");
const gallery = document.getElementById("gallery");

// Random space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "The Sun contains more than 99% of the mass in our solar system.",
  "One million Earths could fit inside the Sun.",
  "There are more stars in the universe than grains of sand on Earth's beaches.",
  "Neutron stars can spin hundreds of times per second.",
  "The footprints left by astronauts on the Moon could remain there for millions of years.",
  "Jupiter is the largest planet in our solar system.",
  "Light from the Sun takes about eight minutes to reach Earth.",
  "Mars is home to Olympus Mons, the largest volcano in our solar system.",
  "Saturn's average density is lower than the density of water."
];

// Display a random space fact when the page loads
function displayRandomFact() {
  const factElement = document.getElementById("space-fact");

  // Stop the function if the HTML does not contain a space-fact element
  if (!factElement) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * spaceFacts.length);

  factElement.textContent =
    `🚀 Did You Know? ${spaceFacts[randomIndex]}`;
}

displayRandomFact();

// ================================
// Fetch NASA APOD Data
// ================================

async function getSpaceImages() {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Make sure both dates were selected
  if (!startDate || !endDate) {
    gallery.innerHTML = `
      <p class="error-message">
        Please select both a start date and an end date.
      </p>
    `;
    return;
  }

  // Show loading message while waiting for NASA
  gallery.innerHTML = `
    <p class="loading-message">
      🔄 Loading space photos...
    </p>
  `;

  // Build NASA APOD API URL
  const url =
    `${API_URL}?api_key=${API_KEY}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}` +
    `&thumbs=true`;

  try {
    // Send request to NASA
    const response = await fetch(url);

    // Check for an unsuccessful response
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    // Convert NASA's response into JavaScript data
    const data = await response.json();

    // Send the data to the gallery function
    displayGallery(data);

  } catch (error) {
    console.error("Error fetching NASA data:", error);

    gallery.innerHTML = `
      <p class="error-message">
        🚀 Houston, we have a problem!
        Unable to load the space images. Please try again.
      </p>
    `;
  }
  getImagesButton.addEventListener("click", getSpaceImages);
}