<?php
require_once '../utilities/notifierClass.php';

class CrunchyrollNotifier extends Notifier {


    public function __construct() {
        parent::__construct();
    }

    
    protected function prepare_email($subscriber_email, $episode) {
        $prepared_email = $this->default_email;

        $prepared_email['headers']['To'] = $subscriber_email;
        $prepared_email['headers']['Subject'] = 'Hay nuevo episodio de tu anime favorito listo';
        $prepared_email['body'] = '
        <!DOCTYPE html>
        <html lang="es">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        
        <body>
        
            <style>
                * {
                    max-width: 100%;
                    box-sizing: border-box;
                }
                
                body {
                    background: linear-gradient( 0deg, rgb(26 21 40) 0%, rgb(63 55 96) 20%);
                    color: white;
                    margin: 0;
                    font-family: Roboto, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;
                }
                /* Inicio Header */
                
                header {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background-color: rgba(13, 0, 27, 0.678);
                }
                /* Fin Header */
                /* Inicio Main */
                
                main section {
                    display: flex;
                    text-align: center;
                    flex-flow: column nowrap;
                    align-items: center;
                }
                
                section .episodeCard {
                    width: 50%;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: flex-end !important;
                    align-items: center;
                    padding: 1em;
                    margin: 0.5em 0;
                    border-radius: 1em;
                    /* Only for debug */
                    background-color: #181146;
                    -webkit-box-shadow: 6px 4px 2px 0px #0000005c;
                    box-shadow: 6px 4px 2px 0px #0000005c;
                    color: gray;
                }
                
                .episodeCard .episodeIndex {
                    color: white;
                    max-width: 100%;
                }
                
                .episodeCard .episodeViewNowButton {
                    background-color: #433699;
                    color: white;
                    padding: 0.6em;
                    border-radius: 1em;
                    border: none;
                    text-decoration: none;
                    width: 50%;
                    text-align: center;
                }
                
                .episodeCard .episodeViewNowButton:hover {
                    background-color: #594f99;
                }
                /* Fin Main */
                /* Inicio Footer */
                
                footer {
                    padding: 5em 2em;
                    display: flex;
                    flex-flow: row nowrap;
                    text-align: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.678);
                    color: rgba(219, 219, 219, 0.932);
                }
                /* Fin Footer */
            </style>
        
            <header>
                <h1>MyAnime <br> Tu notificador de anime favorito</h1>
            </header>
        
            <main>
                <section>
                    <h2 class="saludo"> ¡Hey! </h2>
                    <h2> Tu anime está listo <br> ¡ Disfrútalo ! </h2>
        
                    <li class="episodeCard">
                        <img class="episodeThumbnail" src="'.$episode['mediaThumbnail'][0]['@attributes']['url'].'">
                        <p class="episodeVersionTitle">'.$episode['version'].'</p>
                        <p class="episodeNumber">Episodio '.$episode['crunchyrollEpisodeNumber'].'</p>
                        <a target="_blank" class="episodeViewNowButton" href="'.$episode['link'].'">Ver ahora</a>
                    </li>
        
                </section>
            </main>
        
            <footer>
                <p>My Footer</p>
            </footer>
        
        
        </body>
        
        </html>';
        return $prepared_email;
        
    }

}