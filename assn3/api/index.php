index.php 
<?php
require('../includes/library.php');

// Determine allowed origins
$allowedOrigins = ['http://localhost:5173', 'https://loki.trentu.ca'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$actualOrigin = in_array($origin, $allowedOrigins) ? $origin : 'https://loki.trentu.ca';

header("Access-Control-Allow-Origin: $actualOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, x-api-key, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$pdo = connectdb();
$uri = parse_url($_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];
define('__BASE__', '/~ahmedsaleh/3430/assn/assn3/api/');
$endpoint = str_replace(__BASE__, "", $uri["path"]);

// Utility functions
function response($status, $message, $data = [])
{
    $json = json_encode($data);
    header("Content-Type: application/json; charset=UTF-8");
    header("HTTP/1.1 $status $message");
    header("Content-Length: " . strlen($json));
    echo $json;
    exit();
}

function handleQuery($pdo, $query, $params = [], $fetch = true)
{
    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        return $fetch ? $stmt->fetchAll(PDO::FETCH_ASSOC) : true;
    } catch (PDOException $e) {
        error_log("SQL Error: " . $e->getMessage());
        response(500, "Internal Server Error", ["error" => "Database error"]);
    }
}

function validateFields($data, $requiredFields)
{
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            response(400, "Bad Request", ["error" => "Missing field: $field"]);
        }
    }
}

// Endpoint handlers
switch (true) {
    case $method === 'GET' && preg_match('/^movies\/(\d+)$/', $endpoint, $matches):
        $movieID = $matches[1];
        $movie = handleQuery($pdo, "SELECT * FROM movies WHERE id = ?", [$movieID]);

        if ($movie) {
            $movie = $movie[0];
            $movie['genres'] = json_decode($movie['genres'], true);
            $movie['production_companies'] = json_decode($movie['production_companies'], true);

            response(200, "OK", ["movie" => $movie]);
        } else {
            response(404, "Not Found", ["error" => "Movie not found"]);
        }
        break;
    case $method === 'POST' && $endpoint === 'updateScore':
        $data = json_decode(file_get_contents("php://input"), true);
        validateFields($data, ['id', 'userID', 'rating', 'notes']);

        // Log received data for 
        error_log("Received updateScore request: " . json_encode($data));

        try {
            $stmt = $pdo->prepare(
                "UPDATE completedWatchList 
                     SET rating = :rating, notes = :notes 
                     WHERE id = :id AND userID = :userID"
            );
            $stmt->execute([
                ':rating' => $data['rating'],
                ':notes' => $data['notes'],
                ':id' => $data['id'],
                ':userID' => $data['userID'],
            ]);

            if ($stmt->rowCount() > 0) {
                response(200, "rating updated successfully", ["updated" => true]);
            } else {
                response(404, "No rows updated", ["updated" => false]);
            }
        } catch (PDOException $e) {
            error_log("SQL Error in updaterating: " . $e->getMessage());
            response(500, "Internal Server Error", ["error" => "Database error"]);
        }
        break;
        
        case $method === 'GET' && $endpoint === 'towatchlist':
            $userID = $_GET['userID'] ?? null;
        
            if (!$userID) {
                response(400, "Bad Request", ["error" => "Missing userID"]);
            }
        
            // Updated query to include the title
            $query = "
                SELECT t.id, t.userID, t.priority, t.notes, m.title, m.poster
                FROM toWatchList t
                JOIN movies m ON t.id = m.id
                WHERE t.userID = :userID
            ";
        
            $params = [':userID' => $userID];
        
            $watchlist = handleQuery($pdo, $query, $params);
        
            if (!$watchlist) {
                response(404, "Not Found", ["error" => "No watchlist found for user"]);
            }
        
            response(200, "OK", $watchlist);
            break;
        
        

    case $method === 'GET' && $endpoint === 'similarMovies':
        $genres = $_GET['genres'] ?? '';
        $companies = $_GET['companies'] ?? '';
        $currentMovieId = $_GET['id'] ?? 0;

        if (empty($genres) && empty($companies)) {
            response(400, "Bad Request", ["error" => "Missing genres or companies"]);
        }

        // Split genres and companies into arrays
        $genreIds = explode(',', $genres);
        $companyIds = explode(',', $companies);

        // Build the JSON_CONTAINS conditions
        $genreCondition = !empty($genres)
            ? implode(' OR ', array_map(fn($id) => "JSON_CONTAINS(genres, JSON_OBJECT('id', $id))", $genreIds))
            : "1=0";
        $companyCondition = !empty($companies)
            ? implode(' OR ', array_map(fn($id) => "JSON_CONTAINS(production_companies, JSON_OBJECT('id', $id))", $companyIds))
            : "1=0";

        // Combine the conditions and query the `movies` table
        $query = "
                SELECT id, title, poster 
                FROM movies 
                WHERE id != :currentMovieId AND ($genreCondition OR $companyCondition)
                LIMIT 10
            ";

        $params = [':currentMovieId' => $currentMovieId];

        $similarMovies = handleQuery($pdo, $query, $params);

        response(200, "OK", ["movies" => $similarMovies ?? []]);
        break;







        case $method === 'GET' && $endpoint === 'movies':
            $search = $_GET['search'] ?? '';
            $genre = $_GET['genre'] ?? '';
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
            $offset = ($page - 1) * $limit;
        
            $query = "SELECT * FROM movies WHERE title LIKE :search";
            $params = [':search' => "%$search%"];
        
            if (!empty($genre)) {
                $query .= " AND JSON_CONTAINS(genres, JSON_OBJECT('name', :genre))";
                $params[':genre'] = $genre;
            }
        
            $query .= " LIMIT :limit OFFSET :offset";
            $params[':limit'] = $limit;
            $params[':offset'] = $offset;
        
            $movies = handleQuery($pdo, $query, $params);
            $totalMovies = handleQuery(
                $pdo,
                "SELECT COUNT(*) as total FROM movies WHERE title LIKE :search",
                [':search' => "%$search%"]
            )[0]['total'] ?? 0;
        
            $totalPages = $totalMovies > 0 ? ceil($totalMovies / $limit) : 1;
        
            response(200, "OK", [
                "movies" => $movies,
                "totalPages" => $totalPages,
                "currentPage" => $page,
            ]);
            break;
        
        
        
        
        
        
        


        case $method === 'POST' && $endpoint === 'completedwatchlist':
            $data = json_decode(file_get_contents("php://input"), true);
            error_log("Received data for completedwatchlist: " . json_encode($data));
        
            validateFields($data, ['id', 'userID', 'rating', 'notes', 'dateInitiallyWatched', 'dateLastWatched', 'timesWatched']);
        
            // Check if the user and movie exist
            $userExists = handleQuery($pdo, "SELECT COUNT(*) as count FROM users WHERE userID = :userID", [':userID' => $data['userID']]);
            if ($userExists[0]['count'] == 0) {
                response(400, "Bad Request", ["error" => "Invalid userID"]);
            }
        
            $movieExists = handleQuery($pdo, "SELECT COUNT(*) as count FROM movies WHERE id = :id", [':id' => $data['id']]);
            if ($movieExists[0]['count'] == 0) {
                response(400, "Bad Request", ["error" => "Invalid movie ID"]);
            }
        
            try {
                // Start a transaction
                $pdo->beginTransaction();
        
                // Insert into completedWatchList
                handleQuery(
                    $pdo,
                    "INSERT INTO completedWatchList (id, userID, rating, notes, dateInitiallyWatched, dateLastWatched, timesWatched) 
                     VALUES (:id, :userID, :rating, :notes, :dateInitiallyWatched, :dateLastWatched, :timesWatched)",
                    [
                        ':id' => $data['id'],
                        ':userID' => $data['userID'],
                        ':rating' => $data['rating'],
                        ':notes' => $data['notes'],
                        ':dateInitiallyWatched' => date('Y-m-d H:i:s', strtotime($data['dateInitiallyWatched'])),
                        ':dateLastWatched' => date('Y-m-d H:i:s', strtotime($data['dateLastWatched'])),
                        ':timesWatched' => $data['timesWatched'],
                    ],
                    false
                );
        
                // Delete from toWatchList
                handleQuery(
                    $pdo,
                    "DELETE FROM toWatchList WHERE id = :id AND userID = :userID",
                    [
                        ':id' => $data['id'],
                        ':userID' => $data['userID'],
                    ],
                    false
                );
        
                // Commit transaction
                $pdo->commit();
        
                response(201, "Created", ["message" => "Movie moved to completedWatchList"]);
            } catch (PDOException $e) {
                $pdo->rollBack();
                error_log("Database Error: " . $e->getMessage());
                response(500, "Internal Server Error", ["error" => "Database error"]);
            }
            break;
        
        
        
        
        
        
    case $method === 'POST' && $endpoint === 'towatchlist':
        $data = json_decode(file_get_contents("php://input"), true);
        validateFields($data, ['id', 'userID', 'priority']);

        // Check if the movie is already in the watchlist
        $existingInWatchlist = handleQuery(
            $pdo,
            "SELECT * FROM toWatchList WHERE id = :id AND userID = :userID",
            [
                ':id' => $data['id'],
                ':userID' => $data['userID']
            ]
        );

        if ($existingInWatchlist) {
            response(400, "Bad Request", ["error" => "Movie is already in the watchlist."]);
        }

        // Check if the movie is already in the completed list
        $existingInCompletedList = handleQuery(
            $pdo,
            "SELECT * FROM completedWatchList WHERE id = :id AND userID = :userID",
            [
                ':id' => $data['id'],
                ':userID' => $data['userID']
            ]
        );

        if ($existingInCompletedList) {
            response(400, "Bad Request", ["error" => "Movie is already in the completed list."]);
        }

        // Add the movie to the watchlist
        handleQuery(
            $pdo,
            "INSERT INTO toWatchList (id, userID, priority, notes) 
                 VALUES (:id, :userID, :priority, :notes)",
            [
                ':id' => $data['id'],
                ':userID' => $data['userID'],
                ':priority' => $data['priority'],
                ':notes' => $data['notes'] ?? null,
            ],
            false
        );

        response(201, "Created", ["message" => "Movie added to Watchlist"]);
        break;


        case $method === 'POST' && $endpoint === 'auth':
            $data = json_decode(file_get_contents("php://input"), true);
            validateFields($data, ['username', 'password']);
        
            // First get the user record by username only
            $user = handleQuery(
                $pdo,
                "SELECT userID, password, api_key FROM users WHERE username = :username",
                [':username' => $data['username']]
            );
        
            if (!$user || !password_verify($data['password'], $user[0]['password'])) {
                response(401, "Unauthorized", ["error" => "Invalid credentials"]);
            }
        
            // Return user data without password
            unset($user[0]['password']);
            response(200, "OK", $user[0]);
            break;
        
    case $method === 'POST' && $endpoint === 'signup':
        $data = json_decode(file_get_contents("php://input"), true);
        validateFields($data, ['username', 'email', 'password']);

        // Check for unique username and email
        $existingUser = handleQuery(
            $pdo,
            "SELECT * FROM users WHERE username = :username OR email = :email",
            [':username' => $data['username'], ':email' => $data['email']]
        );

        if ($existingUser) {
            response(400, "Bad Request", ["error" => "Username or email already exists."]);
        }

        // Generate API key and hash the password
        $apiKey = bin2hex(random_bytes(16));
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insert new user into the database
        handleQuery(
            $pdo,
            "INSERT INTO users (username, email, password, api_key, api_date) 
                 VALUES (:username, :email, :password, :api_key, NOW())",
            [
                ':username' => $data['username'],
                ':email' => $data['email'],
                ':password' => $hashedPassword,
                ':api_key' => $apiKey,
            ],
            false
        );

        response(201, "Created", ["message" => "Account created successfully", "api_key" => $apiKey]);
        break;

    case $method === 'GET' && $endpoint === 'completedwatchlist':
        if (!isset($_GET['userID'])) {
            response(400, "Bad Request", ["error" => "Missing userID"]);
        }
        $userID = $_GET['userID'];
        $sortBy = $_GET['sortBy'] ?? 'dateLastWatched'; // Default sorting by dateLastWatched
        $validSortColumns = ['title', 'dateLastWatched'];

        if (!in_array($sortBy, $validSortColumns)) {
            response(400, "Invalid sorting column");
        }

        $query = "
                SELECT c.id, c.rating AS rating, c.timesWatched, c.notes, c.dateLastWatched,
                       m.title, m.poster, m.genres, m.overview, m.production_companies, 
                       m.release_date, m.runtime
                FROM completedWatchList c
                JOIN movies m ON c.id = m.id
                WHERE c.userID = :userID
                ORDER BY $sortBy ASC
            ";

        $completedMovies = handleQuery($pdo, $query, [':userID' => $userID]);
        response(200, "OK", $completedMovies);
        break;

        case $method === 'POST' && $endpoint === 'updateWatchCount':
            $data = json_decode(file_get_contents("php://input"), true);
        
            // Validate required fields
            validateFields($data, ['id', 'userID']);
        
            // Check if the movie exists in completedWatchList
            $movieExists = handleQuery(
                $pdo,
                "SELECT id FROM completedWatchList WHERE id = :id AND userID = :userID",
                [
                    ':id' => $data['id'],
                    ':userID' => $data['userID']
                ]
            );
        
            if (!$movieExists) {
                response(404, "Not Found", ["error" => "Movie not found in completed list."]);
            }
        
            // Increment the watch count
            try {
                handleQuery(
                    $pdo,
                    "UPDATE completedWatchList 
                     SET timesWatched = timesWatched + 1 
                     WHERE id = :id AND userID = :userID",
                    [
                        ':id' => $data['id'],
                        ':userID' => $data['userID']
                    ],
                    false // No need to fetch data
                );
                response(200, "OK", ["message" => "Watch count updated successfully"]);
            } catch (PDOException $e) {
                error_log("SQL Error in updateWatchCount: " . $e->getMessage());
                response(500, "Internal Server Error", ["error" => "Database error"]);
            }
            break;
        
    case $method === 'POST' && $endpoint === 'updatePriority':
        $data = json_decode(file_get_contents("php://input"), true);
        validateFields($data, ['id', 'userID', 'priority']);

        handleQuery(
            $pdo,
            "UPDATE toWatchList SET priority = :priority WHERE id = :id AND userID = :userID",
            [
                ':priority' => $data['priority'],
                ':id' => $data['id'],
                ':userID' => $data['userID'],
            ],
            false
        );

        response(200, "Priority updated successfully");
        break;
        
        case $method === 'POST' && $endpoint === 'removeFromWatchlist':
            $data = json_decode(file_get_contents("php://input"), true);
            validateFields($data, ['id', 'userID']);
            error_log("POST /removeFromWatchlist received data: " . json_encode($data));
        
            try {
                // Start a transaction to ensure consistency
                $pdo->beginTransaction();
        
                // Delete from `completedWatchList` if it exists
                handleQuery(
                    $pdo,
                    "DELETE FROM completedWatchList WHERE id = :id AND userID = :userID",
                    [
                        ':id' => $data['id'],
                        ':userID' => $data['userID'],
                    ],
                    false
                );
        
                // Delete from `toWatchList` if it exists
                handleQuery(
                    $pdo,
                    "DELETE FROM toWatchList WHERE id = :id AND userID = :userID",
                    [
                        ':id' => $data['id'],
                        ':userID' => $data['userID'],
                    ],
                    false
                );
        
                // Commit the transaction
                $pdo->commit();
        
                response(200, "OK", ["message" => "Movie removed from all watchlists"]);
            } catch (PDOException $e) {
                // Rollback the transaction in case of an error
                $pdo->rollBack();
                error_log("Error in removeFromWatchlist: " . $e->getMessage());
                response(500, "Internal Server Error", ["error" => "Failed to remove movie"]);
            }
            break;
        
        case $method === 'GET' && $endpoint === 'genres':
            try {
                $query = "SELECT genres FROM movies WHERE genres IS NOT NULL";
                $results = handleQuery($pdo, $query);
        
                $genres = [];
                foreach ($results as $result) {
                    // Skip if genres is null or empty
                    if (empty($result['genres'])) {
                        continue;
                    }
        
                    $jsonGenres = json_decode($result['genres'], true);
                    if (is_array($jsonGenres)) {
                        foreach ($jsonGenres as $genre) {
                            if (isset($genre['name']) && !in_array($genre['name'], $genres)) {
                                $genres[] = $genre['name'];
                            }
                        }
                    }
                }
        
                response(200, "OK", $genres);
            } catch (Exception $e) {
                error_log("Error fetching genres: " . $e->getMessage());
                response(500, "Internal Server Error", ["error" => "Failed to fetch genres"]);
            }
            break;
        
        
        




    default:
        response(404, "Not Found", ["error" => "Endpoint not found"]);
}
