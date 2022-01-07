<?php
class Conversor {

    private $pattern_namespaces = '/(xmlns):(\w*)=/';
    private $pattern_namespace_tag_with_content;
    private $pattern_namespace_empty_tag;
    private $pattern_tags_with_other_tags;
    private $namespaces;
    private $xml;
    private $prepared_xml_string;
    private $formated_xml_string;
    private $outputFile = "./receivedFeeds/feedConverted.json";

    public function __construct($xml_string) {
        $this->prepared_xml_string = $this->prepare_xml_string($xml_string);
        $this->search_namespaces();
    }

    public function convert_to_json() {

        // Renombro las tag de los distintos namespaces
        // </atom:link href="myLink">    =>    </atomLink href="myLink">
        foreach ($this->namespaces as $key => $namespaceName) {

            $this->pattern_tags_with_namespaceName = '/<('.$namespaceName.'):(\w*)( \w*=".*")* *>(.*)<\/\1:\2>/';
            $this->pattern_empty_tags_with_namespaceName = '/<('.$namespaceName.'):(\w*)(.*)\/>/';
            $this->pattern_tags_with_other_tags = '<(\/)?('.$namespaceName.'):(\w*)( \w*=".*")* *>';

            $this->rename_namespace_tags();
        }

        // Convierto la string XML en un objeto SimpleXML
        $this->formated_xml_string = $this->prepared_xml_string;
        $this->xml = simplexml_load_string($this->formated_xml_string);

        // A partir del objeto SimpleXML se puede
        // obtener el json fácilmente
        $this->jsonString = json_encode($this->xml);
    }

    public function get_json() {
        if ($this->json_string == null) {
            $this->convert_to_json();
            return $this->json_string();

        } else {
            return $this->json_string();

        }
    }

    public function get_array() {
        return json_decode($this->get_json());
    }

    public function save_json() {
        file_put_contents($this->outputFile,$this->json_string);
    }

    private function prepare_xml_string($xml_string) {
        // Replace "/><"   for  "/>\n<"
        $patrón = '/\/></';
        $sustitución = '/>\n<';
        return preg_replace($patrón, $sustitución, $xml_string);

    }

    private function search_namespaces() {
        preg_match_all(
            $this->pattern_namespaces,
            $this->prepared_xml_string,
            $this->namespaces);
        // El nombre del namespace coincide con el
        // segundo grupo del patrón
        $this->namespaces = $this->namespaces[2];
    }

    private function rename_namespace_tags() {
        $this->searchAndReplace_namespaces_empty_tags();
        $this->searchAndReplace_namespaces_tags_with_content();
        $this->searchAndReplace_namespaces_tags_with_other_tags();
    }

    private function searchAndReplace_namespaces_tags_with_content() {

        $this->prepared_xml_string = preg_replace_callback(
            $this->pattern_tags_with_namespaceName,
            "XMLToJsonConversor::replace_namespace_tags_with_content",
            $this->prepared_xml_string);
    }

    private function searchAndReplace_namespaces_tags_with_other_tags() {

        $this->prepared_xml_string = preg_replace_callback(
            $this->pattern_tags_with_other_tags,
            "XMLToJsonConversor::replace_namespace_tags_with_other_tags",
            $this->prepared_xml_string);
    }

    public function searchAndReplace_namespaces_empty_tags() {

        $this->prepared_xml_string = preg_replace_callback(
            $this->pattern_empty_tags_with_namespaceName,
            "XMLToJsonConversor::replace_namespace_in_empty_tags",
            $this->prepared_xml_string);
    }

    public static function replace_namespace_in_empty_tags($match) {
        $tagCapitalized = ucfirst($match[2]);
        return "<$match[1]$tagCapitalized $match[3] />";
    }

    public static function replace_namespace_tags_with_content($match) {

        $tagCapitalized = ucfirst($match[2]);
        // echo "\n Replacing: $match[0] \n";
        if (isset($match[3])) {
            // echo " FOR: <$match[1]$tagCapitalized $match[3]>$match[4]</$match[1]$tagCapitalized>";
            return "<$match[1]$tagCapitalized $match[3]>$match[4]</$match[1]$tagCapitalized>";
        } else {
            // echo " FOR: <$m[1]$tagCapitalized>$m[2]</$m[1]$tagCapitalized>";
            return "<$match[1]$tagCapitalized>$match[2]</$match[1]$tagCapitalized>";
        }
    }

    public static function replace_namespace_tags_with_other_tags($match) {

        if($match[1] === "/"){
            // Etiquetas de cierre
            $tagCapitalized = ucfirst($match[3]);
            return "/$match[2]$tagCapitalized";
        } else {
            // Etiquetas de apertura
            $tagCapitalized = ucfirst($match[3]);

            if (isset($match[4])) {
                // Con atributos
                return "$match[2]$tagCapitalized $match[4]";

            } else {
                // Sin atributos
                return "$match[2]$tagCapitalized ";

            }

        }
        
    }

}