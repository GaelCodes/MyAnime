<?php
// References: https://firebase.google.com/docs/firestore/quickstart?hl=es

// 1
// 
// Entorno de desarrollo
//  Configura la variable de entorno GOOGLE_APPLICATION_CREDENTIALS (en el .env file)
// $_SERVER["GOOGLE_APPLICATION_CREDENTIALS"] = '/path/to/your/my-anime-service-key.json';
// 
// Entorno de producción
//  Configura una cuenta de servicio.

// 2
// Instala y habilita la extensión de gRPC para PHP, que necesitarás para usar la biblioteca cliente.

// 3
// Agrega la biblioteca PHP de Cloud Firestore a tu app:

// Carga automáticamente las clases de Firestore requeridas 
// con el autoloader de composer 

//autoload de composer
// require '../vendor/autoload.php';

// Inicializa una instancia de Cloud Firestore:
use Google\Cloud\Firestore\FirestoreClient;

class FirestoreManager  {
    protected $db;

    public function __construct() {
        $this->create_db_client('my-anime-499f8');
    }

    // Initialize Cloud Firestore
    private function create_db_client(string $projectId) {
        // Create the Cloud Firestore client
        $this->db = new FirestoreClient([
            'projectId' => $projectId
        ]);

        printf('Created Cloud Firestore client with default project ID.' . PHP_EOL);
    }


    public function upload_data($array_episode) {
        $docRef = $this->db->collection('samples/php/users')->document('lovelace');
        $docRef->set($array_episode);
        printf('Added data to the lovelace document in the users collection.' . PHP_EOL);
    }

    public function retrieve_subscribers($anime_id){
        $usersRef = $this->db->collection('samples/php/users');
        $snapshot = $usersRef->documents();
        foreach ($snapshot as $user) {
            printf('User: %s' . PHP_EOL, $user->id());
            printf('First: %s' . PHP_EOL, $user['first']);

            if (!empty($user['middle'])) {
                printf('Middle: %s' . PHP_EOL, $user['middle']);

            }
            printf('Last: %s' . PHP_EOL, $user['last']);
            printf('Born: %d' . PHP_EOL, $user['born']);
            printf(PHP_EOL);

        }
        printf('Retrieved and printed out all documents from the users collection.' . PHP_EOL);
    }

}