<?php
require_once('../XMLToJSONConversorClass.php');

class CrunchyrollConversor {
    private $outputFile = "./receivedFeeds/feedConverted.json";
    private $XMLToJsonConversor;
    private $json_string;

    public function __construct($raw_xml) {
        $this->XMLToJsonConversor = new XMLToJsonConversor($raw_xml);
        $this->json_string =  $this->XMLToJsonConversor->convertToJson();
    }

    public function save_json() {
        echo 'JSON EN JSON CONVERTER:';
        echo $this->json_string;
        file_put_contents($this->outputFile,$this->json_string);
    }

    public function get_json() {
        return $this->json_string;
    }

}