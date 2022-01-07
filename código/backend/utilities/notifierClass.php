<?php
require_once "Mail.php";


class Notifier {

    private $default_email = [
        'headers' => [
            'To' => 'abigael-hf@hotmail.com',
            'From' =>  'My Anime <info@abigaelheredia.es>',
            'Subject' => 'El episodio de [nombre del anime] ya está disponible',
        ],
        'body' => '
            <html>
            <head>
            <title>Recordatorio de cumpleaños para Agosto</title>
            </head>
            <body>
            <p>¡Estos son los cumpleaños para Agosto!</p>
            <table>
                <tr>
                <th>Quien</th><th>Día</th><th>Mes</th><th>Año</th>
                </tr>
                <tr>
                <td>Joe</td><td>3</td><td>Agosto</td><td>1970</td>
                </tr>
                <tr>
                <td>Sally</td><td>17</td><td>Agosto</td><td>1973</td>
                </tr>
            </table>
            </body>
            </html>
        '
    ];
    private $configuration = [];
    private $smtp;

    public function __construct() {
        
        $this->configuration = [
            'username' => $_ENV['SMTP_USERNAME'],
            'password' => $_ENV['SMTP_PASSWORD'],
            'host' => $_ENV['SMTP_HOST'],
            'port' => $_ENV['SMTP_PORT'],
            'auth' => true
        ];

        $this->smtp = Mail::factory('smtp', $this->configuration);

    }
    
    public function notify_subscribers($episode,$firestore_manager) {
        $subscribers = $firestore_manager->get_subscribed_users();

        foreach ($subscribers as $subscriber_email) {
            $email = $this->prepare_email($subscriber_email, $episode);
            $this->send_email($email);

        }
    }

    private function prepare_email($subscriber_email, $episode) {
        $prepared_email = $this->default_email;
        $prepared_email['headers']['To'] = $subscriber_email;
        $prepared_email['headers']['Subject'] = 'El episodio '.$episode['number'].' de '.$episode['serieTitle'].' ya está disponible';
        
        $prepared_email['body'] = '
            Hola ^^, ya tienes el episodio número '.$episode['number'].'
            de '.$episode['serieTitle'].' listo para que lo puedas ver 
            cuando quieras en la plataforma de '.$episode['platform']
        ;
        return $prepared_email;
    }

    private function send_email($email) {
        $result = $this->smtp->send($email['headers']['To'], $email['headers'], $email['body']);

        if (PEAR::isError($result)) {
            $this->set_log($result->getMessage());

        } else {
            $this->set_log('Message successfully sent!');

        }
    }



}