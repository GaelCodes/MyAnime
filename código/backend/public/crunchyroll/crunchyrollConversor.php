<?php
require_once '../utilities/conversorClass.php';

class CrunchyrollConversor extends Conversor {
    private $version_pattern = '/(.*) - Episode .* -/';
    private $language_pattern = '/\((\w*).*\) - Episode .* -/';

    public function __construct($xml_string) {
        parent::__construct($xml_string);
    }

    public function convert_to_json() {
        parent::convert_to_json();

        $this->generateLanguage();
        $this->generateVersion();
        $this->generateSubtitles();
    }

    public function generateVersion() {
        $xmlArray = $this->get_array();        
        $episodesArray = $xmlArray["channel"]["item"];

        foreach ($episodesArray as &$episode) {
            // La versión se obtendrá a partir del contenido de crunchyrollSeriesTitle y
            // concatenado por el idioma y la palabra Dub entre paréntesis en caso de ser un doblaje
            //
            // en Attack on Titan Final Season - Episode 78 - Two Brothers
            // la versión resulta ser Attack on Titan
            //
            // en Attack on Titan Final Season (Spanish Dub) - Episode 78 - Two Brothers
            // la versión resulta ser Attack on Titan (Spanish Dub)
            
            if ($episode["language"] != "Japanese") {
                $episode["version"] = $episode["crunchyrollSeriesTitle"]." (".$episode["language"]." Dub)";

            } else {
                $episode["version"] = $episode["crunchyrollSeriesTitle"];
            }
        }

        $xmlArray["channel"]["item"] = $episodesArray;


        unset($episode); // rompe la referencia con el último elemento
        unset($episodesArray); // rompe la referencia
        $this->update_json($xmlArray);

    }

    public function generateLanguage() {
        $xmlArray = $this->get_array();
        $episodesArray = $xmlArray["channel"]["item"];
        
        foreach ($episodesArray as &$episode) {
            // La agrupación del patrón que contendrá el idioma será el 1
            // 
            // en Platinum End (German Dub) - Episode 8 - Symbol of Promise
            // el idioma resulta ser German
            preg_match($this->language_pattern,$episode["title"],$matches);
            
            // Si no tiene coincidencia significa que es
            // la versión original, por lo tanto el idioma
            // será japonés por defecto
            if (isset($matches[1])) {
                $episode["language"] = $matches[1];

            } else {
                $episode["language"] = "Japanese";
                
            }
        }

        $xmlArray["channel"]["item"] = $episodesArray;

        unset($episode); // rompe la referencia con el último elemento
        unset($episodesArray); // rompe la referencia
        $this->update_json($xmlArray);
    }

    public function generateSubtitles() {
        $xmlArray = $this->get_array();
        $episodesArray = $xmlArray["channel"]["item"];
        
        foreach ($episodesArray as &$episode) {
            // Convierte la string crunchyrollSubtitleLanguages en un array
            // 
            // Entonces "en - us,es - la,pt - br" se convierte 
            // en Array('en - us','es - la','pt - br')

            $subtitles_string = $episode["crunchyrollSubtitleLanguages"];
            $episode["subtitles"] = preg_split('/,/',$subtitles_string);
        }

        $xmlArray["channel"]["item"] = $episodesArray;
        unset($episode); // rompe la referencia con el último elemento
        unset($episodesArray); // rompe la referencia
        $this->update_json($xmlArray);
    }

    private function update_json($xmlArray) {
        $this->json_string = json_encode($xmlArray);
    }

}