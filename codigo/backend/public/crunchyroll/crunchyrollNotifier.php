<?php
require_once '../utilities/notifierClass.php';

class CrunchyrollNotifier extends Notifier {


    public function __construct() {
        parent::__construct();
    }

    
    protected function prepare_email($subscriber_email, $episode) {
        $prepared_email = $this->default_email;

        $headers = array(
            'From'    => 'My Anime <info@abigaelheredia.es>',
            'To' => $subscriber_email,
            'Subject' => 'Hay nuevo episodio de tu anime favorito listo',
            'Content-Type' => 'text/html;charset=utf-8',
            
            );      

        $text = 'Text version of email';

        $html = '
        <!DOCTYPE html>
<html lang="es" style="margin: 0; padding: 0;">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <title></title>

</head>

<body style="margin: 0; padding: 0;">
    <div id="email" style="width: 100%; background: linear-gradient( 0deg, #1a1528 0%, #3f3760 20%); color: #ffffff; margin: 0; padding: 0; font-family: Roboto, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;">

        <!-- Header -->
        <table id="header" role="presentation" border="0" cellspacing="0" width="100%" style="margin: 0; background-color: #0d001bad; padding: 2em; text-align: center; color: #dbdbdbee;" bgcolor="#0d001bad" align="center">
            <tr style="margin: 0; padding: 0;">
                <td style="margin: 0; padding: 0;">
                    <h1 style="margin: 0; padding: 0; font-size: 1rem;">MyAnime <br style="margin: 0; padding: 0;"> Tu notificador de anime favorito</h1>
                </td>
            </tr>
        </table>

        <!-- Main -->
        <table id="main" role="presentation" border="0" cellspacing="0" width="100%" style="margin: 0; text-align: center; padding: 2em; color: #dbdbdbee;" align="center">
            <tr style="margin: 0; padding: 0;">
                <td style="margin: 0; padding: 0;">
                    <h2 class="saludo" style="margin: 0; padding: 0; font-size: 1rem;"> ¡Hey! </h2>
                    <h2 style="margin: 0; padding: 0; font-size: 1rem;"> Tu anime está listo <br style="margin: 0; padding: 0;"> ¡ Disfrútalo ! </h2>
                </td>
            </tr>

            <tr style="margin: 0; padding: 0;">
                <td style="margin: 0; padding: 0;">
                    <!-- EpisodeCard Table -->
                    <table class="episodeCard" style="width: 50%; padding: 1em; text-align: center; margin: 0.5em auto; border-radius: 1em; background-color: #181146; -webkit-box-shadow: 6px 4px 2px 0px #0000005c; box-shadow: 6px 4px 2px 0px #0000005c; color: gray;" width="50%"
                        align="center" bgcolor="#181146">
                        <!-- Thumbnail -->
                        <tr style="margin: 0; padding: 0;">
                            <td style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; text-align: center; padding-top: 1em;" align="center">
                                <img class="episodeThumbnail" src="'.$episode['mediaThumbnail'][0]['@attributes']['url'].'" style="margin: 0; padding: 0; width: 100%;">
                            </td>
                        </tr>

                        <!-- Title -->
                        <tr style="margin: 0; padding: 0;">
                            <td style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; text-align: center; padding-top: 1em;" align="center">
                                <p class="episodeVersionTitle" style="margin: 0 auto; padding: 0; font-size: 0.8rem;">'.$episode['version'].'</p>
                            </td>
                        </tr>

                        <!-- Episode number -->
                        <tr style="margin: 0; padding: 0;">
                            <td style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; text-align: center; padding-top: 1em;" align="center">
                                <p class="episodeNumber" style="margin: 0 auto; padding: 0; font-size: 0.8rem;">Episodio '.$episode['crunchyrollEpisodeNumber'].'</p>
                            </td>
                        </tr>

                        <!-- Button -->
                        <tr style="margin: 0; padding: 0;">
                            <td cellpadding="20%" style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; text-align: center; padding-top: 1em;" align="center">
                                <a target="_blank" class="episodeViewNowButton" href="'.$episode['link'].'" style="margin: 0 auto; background-color: #433699; color: white; padding: 0.6em; border-radius: 1em; border: none; text-decoration: none; width: 50%; text-align: center;">Ver ahora</a>
                            </td>
                        </tr>


                    </table>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <table id="footer" role="presentation" border="0" cellspacing="0" width="100%" style="margin: 0; padding: 2em; background-color: rgba(0, 0, 0, 0.678); color: #dbdbdbee; text-align: center;" bgcolor="rgba(0, 0, 0, 0.678)" align="center">
            <tr style="margin: 0; padding: 0;">
                <td style="margin: 0; padding: 0;">

                    <p style="margin: 0; padding: 0; font-size: 0.8rem;">My Footer</p>

                </td>
            </tr>
        </table>
    </div>
</body>

</html>
       ';

        $crlf = "\n";
        $mime = new Mail_mime(array('eol' => $crlf));
        
        
        
        $mime->setTXTBody($text);
        $mime->setHTMLBody($html);
        
        $mimeparams = [];
        $mimeparams['text_encoding']="8bit";
        $mimeparams['text_charset']="UTF-8";
        $mimeparams['html_charset']="UTF-8";
        $mimeparams['head_charset']="UTF-8";
            
        $prepared_email['body'] = $mime->get($mimeparams);

        // Mail_Mime::headers() has to be called after Mail_Mime::get().
        $headers = $mime->headers($headers);
        $prepared_email['headers'] = $headers;
        return $prepared_email;
        
    }

}