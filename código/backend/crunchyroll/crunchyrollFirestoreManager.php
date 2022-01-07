<?php
require_once '../utilities/firestoreManagerClass.php';

class CrunchyrollFirestoreManager extends FirestoreManager {


    public function __construct() {
        parent::__construct();
    }

    public function upload_data($array_from_xml) {
        $array_episodes = $array_from_xml["channel"]["item"];
        foreach ($array_episodes as $episode) {
            $docRef = $this->db->collection('animes/'.$episode['crunchyrollSeriesTitle'].'/episodes')->document($episode['crunchyrollMediaId']);
            $docRef->set($episode);
            printf('Added data to the episode document in the anime episodes collection.' . PHP_EOL);
        }
        
    }

    public function retrieve_subscribers($anime_title){
        $subscribers = [];
        // TODO: Consulta compleja where
        // user.subscriptions[] contains reference to anime
        $usersRef = $this->db->collection('users');
        $subscriptionsQuery = $usersRef->where('subscriptions','array-contains', $this->db->collection('animes')->document($anime_title));
        // $subscriptionsQuery = $usersRef->where('email','=','abigael-hf@hotmail.com');
        $snapshot = $subscriptionsQuery->documents();
        foreach ($snapshot as $user) {
            $user_data = $user->data();
            printf('Document data for document %s:' . PHP_EOL, $user->id());
            var_dump($user_data);
            printf(PHP_EOL);
            array_push($subscribers,$user_data);
        }
        printf('Retrieved subscribers users documents from the users collection.' . PHP_EOL);
        return $subscribers;
        
    }

}