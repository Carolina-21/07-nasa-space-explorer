// Find our date picker inputs on the page
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

// Set up the valid NASA APOD date range
setupDateInputs(startInput, endInput);

// ================================
// NASA APOD Gallery
// ================================

const API_KEY = "YOUR_NASA_API_KEY";
const API_URL = "https://api.nasa.gov/planetary/apod";

// Get elements from the HTML
const getImagesButton = document.getElementById("get-images");
const gallery = document.getElementById("gallery");

// ================================
// Random Space Facts
// ================================

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

function displayRandomFact() {
  const factElement = document.getElementById("space-fact");

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
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    gallery.innerHTML = `
      <p class="error-message">
        Please select both a start date and an end date.
      </p>
    `;
    return;
  }

  // Show loading message
  gallery.innerHTML = `
    <p class="loading-message">
      🔄 Loading space photos...
    </p>
  `;

  // Build NASA API request
  const url =
    `${API_URL}?api_key=${API_KEY}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}` +
    `&thumbs=true`;

  console.log("NASA request URL:", url);

  try {
    const response = await fetch(url);

    console.log("NASA response:", response);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    console.log("NASA data:", data);

    displayGallery(data);

  } catch (error) {
    console.error("Error fetching NASA data:", error);

    gallery.innerHTML = `
      <p class="error-message">
        🚀 Houston, we have a problem!
        Unable to load the space images.
        Please try again.
      </p>
    `;
  }
}

// ================================
// Display Gallery
// ================================

function displayGallery(data) {
  gallery.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    gallery.innerHTML = `
      <p>No space images were found for this date range.</p>
    `;
    return;
  }

  data.forEach((item) => {
    const galleryItem = document.createElement("article");

    galleryItem.classList.add("gallery-item");

    // Image entries
    if (item.media_type === "image") {
      galleryItem.innerHTML = `
        <img
          src="${item.url}"
          alt="${item.title}"
          class="gallery-image"
          loading="lazy"
        >

        <div class="gallery-info">
          <h2>${item.title}</h2>
          <p>${formatDate(item.date)}</p>
        </div>
      `;

      galleryItem.addEventListener("click", () => {
        openModal(item);
      });
    }

    // Video entries
    else if (item.media_type === "video") {
      const previewImage =
        item.thumbnail_url ||
        "https://images-assets.nasa.gov/image/PIA12348/PIA12348~medium.jpg";

      galleryItem.innerHTML = `
        <div class="video-preview">

          <img
            src="${previewImage}"
            alt="Video preview for ${item.title}"
            class="gallery-image"
            loading="lazy"
          >

          <div class="video-icon">
            ▶
          </div>

        </div>

        <div class="gallery-info">

          <h2>${item.title}</h2>

          <p>
            ${formatDate(item.date)}
          </p>

          <span class="video-label">
            🎥 NASA Video
          </span>

        </div>
      `;

      galleryItem.addEventListener("click", () => {
        openModal(item);
      });
    }

    gallery.appendChild(galleryItem);
  });
}

// ================================
// Modal
// ================================

function openModal(item) {
  const modal = document.createElement("div");

  modal.classList.add("modal");

  let mediaContent = "";

  if (item.media_type === "image") {
    const largeImage = item.hdurl || item.url;

    mediaContent = `
      <img
        src="${largeImage}"
        alt="${item.title}"
        class="modal-image"
      >
    `;
  } else {
    mediaContent = `
      <div class="video-container">

        <iframe
          src="${item.url}"
          title="${item.title}"
          allowfullscreen>
        </iframe>

      </div>

      <a
        href="${item.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="video-link"
      >
        Watch NASA Video ↗
      </a>
    `;
  }

  modal.innerHTML = `
    <div class="modal-content">

      <button
        class="close-modal"
        aria-label="Close modal"
      >
        &times;
      </button>

      ${mediaContent}

      <div class="modal-text">

        <h2>
          ${item.title}
        </h2>

        <p class="modal-date">
          ${formatDate(item.date)}
        </p>

        <p class="modal-explanation">
          ${item.explanation}
        </p>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const closeButton =
    modal.querySelector(".close-modal");

  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

// ================================
// Date Formatting
// ================================

function formatDate(dateString) {
  const date =
    new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

// ================================
// Button Event
// ================================

getImagesButton.addEventListener(
  "click",
  getSpaceImages
);