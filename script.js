
    // YouTube API Key setup
    const YOUTUBE_API_KEY = 'AIzaSyBKM288BJ3PyXFsr1od8hxiYu045ywISic'; // Replace with your actual API key

    // Get DOM elements
    const musicButton = document.querySelector('.music-button');
    const homeButton = document.querySelector('.home-button');
    const aiButton = document.querySelector('.ai-button');
    const musicPopup = document.getElementById('music-popup');
    const musicSearch = document.getElementById('music-search');
    const searchButton = document.querySelector('.search-button');
    const musicResults = document.querySelector('.music-results');

    // Initialize YouTube API
    function initYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = 'https://www.googleapis.com/youtube/v3/search';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Search YouTube for music
    async function searchYouTubeMusic(query) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query + " music")}&type=video&key=${YOUTUBE_API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            return [];
        }
    }

    // Display search results
    function displaySearchResults(results) {
        // Clear previous results
        musicResults.innerHTML = '';

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.classList.add('song-item');
            noResults.textContent = 'No results found';
            musicResults.appendChild(noResults);
            return;
        }

        results.forEach(result => {
            const songItem = document.createElement('div');
            songItem.classList.add('song-item');

            // Create thumbnail image
            const thumbnail = document.createElement('img');
            thumbnail.src = result.snippet.thumbnails.default.url;
            thumbnail.alt = result.snippet.title;
            thumbnail.style.width = '60px';
            thumbnail.style.marginRight = '10px';
            thumbnail.style.verticalAlign = 'middle';

            // Create song title
            const songTitle = document.createElement('span');
            songTitle.textContent = result.snippet.title;

            // Add elements to song item
            songItem.appendChild(thumbnail);
            songItem.appendChild(songTitle);

            // Add click event to play the song
            songItem.addEventListener('click', () => {
                playSong(result.id.videoId, result.snippet.title);
            });

            musicResults.appendChild(songItem);
        });
    }

    // Play the selected song
    function playSong(videoId, title) {
        // Create a custom event to handle song playback
        const event = new CustomEvent('songSelected', {
            detail: {
                videoId: videoId,
                title: title
            }
        });
        document.dispatchEvent(event);

        // Update iframe with the selected video
        const iframe = document.querySelector('.iframe-container iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else {
            alert(`Now playing: ${title}`);
        }

        // Close the popup
        musicPopup.style.display = 'none';
        homeButton.style.display = 'none';
        musicButton.style.display = 'block';
        localStorage.setItem('musicButtonState', 'music');
    }

    // Perform search when button is clicked or Enter key is pressed
    function performSearch() {
        const searchTerm = musicSearch.value.trim();
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        // Show loading indicator
        musicResults.innerHTML = '<div class="song-item">Searching...</div>';

        // Search YouTube
        searchYouTubeMusic(searchTerm)
            .then(results => {
                displaySearchResults(results);
            })
            .catch(error => {
                console.error('Error:', error);
                musicResults.innerHTML = '<div class="song-item">Error searching. Please try again.</div>';
            });
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize YouTube API
        initYouTubeAPI();

        // Check for saved state in localStorage and set the initial button states
        const musicButtonState = localStorage.getItem('musicButtonState');
        const aiButtonState = localStorage.getItem('aiButtonState');

        if (musicButtonState === 'home') {
            homeButton.style.display = 'block';
            musicButton.style.display = 'none';
            musicPopup.style.display = 'flex'; // Show the popup
        } else {
            musicButton.style.display = 'block';
            homeButton.style.display = 'none';
        }

        

        // Clear the music results initially
        musicResults.innerHTML = '';
    });

    // Event listener for the music button
    musicButton.addEventListener('click', () => {
        musicPopup.style.display = 'flex'; // Show the popup

        // Focus on the search input when opened
        setTimeout(() => {
            musicSearch.focus();
        }, 300);

        // Switch to home button
        musicButton.style.display = 'none';
        homeButton.style.display = 'block';

        // Save the state in localStorage
        localStorage.setItem('musicButtonState', 'home');
    });

    // Event listener for the home button
    homeButton.addEventListener('click', () => {
        musicPopup.style.display = 'none'; // Close the popup

        // Switch to music button
        homeButton.style.display = 'none';
        musicButton.style.display = 'block';

        // Save the state in localStorage
        localStorage.setItem('musicButtonState', 'music');
    });

    // Close the popup when clicked outside of the card
    musicPopup.addEventListener('click', (e) => {
        if (e.target === musicPopup) {
            musicPopup.style.display = 'none'; // Close the popup

            // Switch to music button
            homeButton.style.display = 'none';
            musicButton.style.display = 'block';

            // Save the state in localStorage
            localStorage.setItem('musicButtonState', 'music');
        }
    });

    // Search button click event
    searchButton.addEventListener('click', performSearch);

    // Search on Enter key press
    musicSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    
    