<?php

class Subscriber {

    private $output_file = "./receivedFeeds/feed.xml";
    private $log_file = "./logs/domain-example.log";
    private $request_body;
    private $date;
    private $firestore_manager;
    private $conversor;
    private $notifier;

    public function __construct() {
        $now = getdate();
        $this->date = 'Hora: '.$now["hours"].':'.$now["minutes"].':'.$now["seconds"].'   Dia: '.$now["mday"].'/'.$now["mon"].'/'.$now["year"];
    }

    public function process_request () {

        $this->set_log("\n Inicio nueva interacción con el subscriptor [ $this->date ] : \n");

        if( $_GET != null){
            $this->verify_subscription();
        
        } else {
            $this->process_new_feed_content();   
                     
        }

        $this->set_log("\n Fin nueva interacción con el subscriptor [ $this->date ] : \n");
    }

    public function verify_subscription(){
        // Do this to verify subscribe intent (working)
        echo($_GET["hub_challenge"]);
        $this->set_log("\nHubo un nuevo intento de verificación de subscripción: \n");
    }

    public function process_new_feed_content() {
        // Capturo el contenido del body
        // y lo guardo en el output_file
        $this->set_body_content();
        $this->save_body_content();
                
        // Convierto el contenido del body de XML a JSON
        // y lo guardo en el output_file del conversor
        require_once('./conversorClass.php');
        $this->conversor = new Conversor($this->get_body_content());
        $this->conversor->convert_to_json();
        $this->conversor->save_json();
        
        // Subo el JSON a Firestore
        require_once('./firestoreManagerClass.php');
        $this->firestore_manager = new FirestoreManager();
        $this->firestore_manager->upload_data($this->conversor->get_array());

        // Notifico a los usuarios vía email
        require_once('./notifierClass.php');
        $this->notifier = new Notifier();
        $this->notifier->notify_subscribed_users($this->conversor->get_array(), $this->firestore_manager);
        
        $this->return_ok();
    }

    public function set_body_content(){
        $resource_id = fopen("php://input", "r");
        $this->request_body = stream_get_contents($resource_id);
    }

    public function get_body_content(){
        return $this->request_body;
    }

    public function save_body_content() {
        file_put_contents(
            $this->output_file,
            $this->request_body
        );
    }

    private function set_log($string_to_log) {
        error_log($string_to_log,3,$this->log_file);
    }

    public function return_OK() {
        http_response_code(200);
    }

    public function return_Error() {
        http_response_code(500);
    }

}