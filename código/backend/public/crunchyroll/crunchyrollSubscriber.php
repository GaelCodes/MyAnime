<?php

// // Block Only for development
// require_once '../vendor/autoload.php'; 
// $dotenv = Dotenv\Dotenv::createImmutable('./../');
// $dotenv->safeLoad();
// // Block Only for development
require_once '../utilities/subscriberClass.php';

class CrunchyrollSubscriber extends Subscriber {

    public function __construct() {
        parent::__construct();
    }

    public function process_new_feed_content() {
        // Capturo el contenido del body
        // y lo guardo en el output_file
        $this->set_body_content();
        $this->save_body_content();
                
        // Convierto el contenido del body de XML a JSON
        // y lo guardo en el output_file del conversor
        require_once('./crunchyrollConversor.php');
        $this->conversor = new CrunchyrollConversor($this->get_body_content());
        $this->conversor->convert_to_json();
        $this->conversor->save_json();
        
        
        
        
        
        
        
        // Compruebo si viene del HUB de Google

        $HEADERS = getallheaders();
        $all_header_to_string = json_encode($HEADERS);

        $received_sha1 = $HEADERS['X-Hub-Signature'];

        $generated_sha1 = sha1($this->get_body_content());
        $generated_sha1 = hash_hmac('sha1',$this->get_body_content(), $_ENV['HUB_SECRET']);
        $generated_sha1 = "sha1=".$generated_sha1;


        if ( $generated_sha1 === $received_sha1) {
            $this->set_log("\nLos sha1 SI coincidieron, sha1s: \n");
            $this->set_log("RECIBIDO: ".$received_sha1);
            $this->set_log("\n GENERADO :".$generated_sha1."\n");

            // Si viene del HUB de Google Subo el JSON a Firestore
            require_once('./crunchyrollFirestoreManager.php');
            $this->firestore_manager = new CrunchyrollFirestoreManager();
            $this->firestore_manager->upload_data($this->conversor->get_array());


        } else {
            $this->set_log("\nLos sha1 NO coincidieron, sha1s: \n");
            $this->set_log("RECIBIDO: ".$received_sha1);
            $this->set_log("\n GENERADO :".$generated_sha1."\n");

        }
        
        
        
        
        $this->return_ok();
    }

}

$subscriber = new CrunchyrollSubscriber();
$subscriber->process_request();