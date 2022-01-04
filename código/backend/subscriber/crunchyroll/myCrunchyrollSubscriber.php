<?php
// Do this to verify subscribe intent
$hoy = getdate();
$myFecha = 'Hora: '.$hoy["hours"].':'.$hoy["minutes"].':'.$hoy["seconds"].'   Dia: '.$hoy["mday"].'/'.$hoy["mon"].'/'.$hoy["year"];
error_log("\n $myFecha  -  Inicio nueva interacción con el subscriptor: \n",3,"./logs/crunchyrollSubscriber.log");


$mySubscriber = new Subscriber();

if( $_GET != null){
    $mySubscriber->verify_subscription();

} else {
    $mySubscriber->set_body_content();
    $valid = true;
    if ($valid) {
        // Guardo el XML
        $mySubscriber->save_body_content();
        
        // Genero y guardo el JSON
        require_once('./myCrunchyrollConversor.php');
        $raw_xml = $mySubscriber->get_body_content();
        $myConversor = new CrunchyrollConversor($raw_xml);
        $myConversor->save_json();

        // Subo el JSON a Firestore
        // $jsonString = $myConversor->get_json();
        // $myUploader = new CrunchyrollUploader($jsonString);
        // $myUploader->upload_json();

        $mySubscriber->return_OK();

    } else {
        $mySubscriber->return_Error();
        error_log("\nHubo algún error estableciendo el contenido de la REQUEST \n",3,"./logs/crunchyrollSubscriber.log");

    }
}



class Subscriber {

    private $ficheroOutput = "./receivedFeeds/feed.xml";
    private $request_body;

    public function __constructor() {

    }

    public function verify_subscription(){
        // Do this to verify subscribe intent (working)
        echo($_GET["hub_challenge"]);
        error_log("\nHubo un nuevo intento de verificación de subscripción: \n",3,"logs/crunchyrollSubscriber.log");
    }

    public function set_body_content(){
        $resource_id = fopen("php://input", "r");
        $this->request_body = stream_get_contents($resource_id);
    }

    public function get_body_content(){
        return $this->request_body;

    }

    public function return_OK() {
        http_response_code(200);
    }

    public function return_Error() {
        http_response_code(500);
    }

    public function save_body_content() {
        file_put_contents(
            $this->ficheroOutput,
            $this->request_body
        );
    }

}

error_log("\n$myFecha  -   Fin nueva interacción con el subscriptor: \n",3,"./logs/crunchyrollSubscriber.log");