<?php
require_once '../utilities/subscriberClass.php';

$subscriber = new CrunchyrollSubscriber();
$subscriber->process_request();

class CrunchyrollSubscriber extends Subscriber {

    public function __construct() {
        parent::__construct();
    }

}