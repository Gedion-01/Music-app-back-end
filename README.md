# Music App Backend

A Back-end fo web application for streaming and enjoying music.

## Installation

### Using npm

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gedion-01/Music-app-back-end.git
   ```

3. **Navigate into the directory:**
   ```bash
   cd Music-app-back-end
   ```

5. **Install dependencies:**
    ```bash
    npm install
    ```

6. **Development Scripts:**
   - `npm run build`: Builds the production-ready optimized bundle of the application.
   - `npm run start`: Starts the development server. You can view your application locally by navigating to `http://localhost:5000`
   

### Using Docker

1. **Clone the repository:**
    ```bash
   git clone https://github.com/Gedion-01/Music-app-back-end.git
   ```
2. **Navigate into the directory:**
   ```bash
   cd Music-app-back-end
   ```
3. **Build the Docker image:**
   ```bash
   docker build -t  <name-for-your-docker-image> .
   ```

4. **Run the Docker container:**
   ```bash
   docker run -p 5000:5000 <docker-image-id>
   ```



## Features

- You can upload songs
- List out all songs
- Get songs by genre
- Update songs
- Remove song
- Search for song
- It can return statistical data like number of songs, artists, genres ETC..
