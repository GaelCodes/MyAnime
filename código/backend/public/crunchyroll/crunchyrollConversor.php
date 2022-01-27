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
        $multipleEpisodes = true;

        foreach ($episodesArray as $key => &$episode) {
            // TODO: Arreglo en caliente, es necesario arreglar el diseño

            if ( is_numeric($key) ) {
                // Si la clave es de tipo numérico significa que hay varios items
                # code...
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


            } else {
                // Si el índice no es de tipo numérico signifa que es un solo episodio
                // Por lo tanto, episodesArray, es un array que contiene los datos del único episodio
                $multipleEpisodes = false;
                break;
                
            }            
        }
        


        if (! $multipleEpisodes) {
            // Si no son varios episodios $episodesArray es el array que contiene los datos del único episodio
            // y no varios arrays con los datos de diferentes episodios
            $episode = &$episodesArray;
            
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
        
        unset($episode); // rompe la referencia con el último elemento

        $xmlArray["channel"]["item"] = $episodesArray;


        
        $this->update_json($xmlArray);

    }

    public function generateLanguage() {
        $xmlArray = $this->get_array();
        $episodesArray = $xmlArray["channel"]["item"];
        $multipleEpisodes = true;

        foreach ($episodesArray as $key => &$episode) {
            // TODO: Arreglo en caliente, es necesario arreglar el diseño

            if ( is_numeric($key) ) {
                // Si la clave es de tipo numérico significa que hay varios items
                # code...
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


            } else {
                // Si el índice no es de tipo numérico signifa que es un solo episodio
                // Por lo tanto, episodesArray, es un array que contiene los datos del único episodio
                $multipleEpisodes = false;
                break;
                
            }            
        }
        


        if (! $multipleEpisodes) {
            // Si no son varios episodios $episodesArray es el array que contiene los datos del único episodio
            // y no varios arrays con los datos de diferentes episodios
            $episode = &$episodesArray;
            
            // La agrupación del patrón que contendrá el nombre de la versión será el 1
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

        unset($episode); // rompe la referencia con el último elemento

        $xmlArray["channel"]["item"] = $episodesArray;

        
        $this->update_json($xmlArray);
    }

    public function generateSubtitles() {
        $xmlArray = $this->get_array();
        $episodesArray = $xmlArray["channel"]["item"];
        $multipleEpisodes = true;
        
        foreach ($episodesArray as &$episode) {




            if ( is_numeric($key) ) {
                // Si la clave es de tipo numérico significa que hay varios items
                # code...
                // Convierte la string crunchyrollSubtitleLanguages en un array
                // 
                // Entonces "en - us,es - la,pt - br" se convierte 
                // en Array('en - us','es - la','pt - br')

                $subtitles_string = $episode["crunchyrollSubtitleLanguages"];
                $episode["subtitles"] = preg_split('/,/',$subtitles_string);


            } else {
                // Si el índice no es de tipo numérico signifa que es un solo episodio
                // Por lo tanto, episodesArray, es un array que contiene los datos del único episodio
                $multipleEpisodes = false;
                break;
                
            }   



        }


        if (! $multipleEpisodes) {
            
            $episode = &$episodesArray;
                // Convierte la string crunchyrollSubtitleLanguages en un array
                // 
                // Entonces "en - us,es - la,pt - br" se convierte 
                // en Array('en - us','es - la','pt - br')
            
            $subtitles_string = $episode["crunchyrollSubtitleLanguages"];
            $episode["subtitles"] = preg_split('/,/',$subtitles_string);
        }
        unset($episode); // rompe la referencia con el último elemento

        $xmlArray["channel"]["item"] = $episodesArray;
        $this->update_json($xmlArray);
    }

    private function update_json($xmlArray) {
        $this->json_string = json_encode($xmlArray);
    }

}