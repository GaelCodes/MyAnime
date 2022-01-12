<?php
use Google\Cloud\Core\Exception\NotFoundException;
use Google\Cloud\Firestore\FieldValue;
require_once '../utilities/firestoreManagerClass.php';

class CrunchyrollFirestoreManager extends FirestoreManager {


    public function __construct() {
        parent::__construct();
    }

    public function upload_data($array_from_xml) {
        $array_episodes = $array_from_xml["channel"]["item"];

        foreach ($array_episodes as $episode) {
            $episodeRef = $this->db->collection('animes/'.$episode['crunchyrollSeriesTitle'].'/versions/'.$episode['version'].'/episodes')->document('Episode '.$episode['crunchyrollEpisodeNumber']);
            
            try {
                // Intentar actualizar
                $episodeRef->update([
                    [          
                        'path' => 'crunchyrollEpisodeTitle',
                        'value' => $episode['crunchyrollEpisodeTitle']
                    ],
                    [
                        'path' => 'crunchyrollPremiumPubDate',
                        'value' => $episode['crunchyrollPremiumPubDate']
                    ],
                    [
                        'path' => 'subtitles',
                        'value' => $episode['subtitles']
                    ],
                    [
                        'path' => 'link',
                        'value' => $episode['link']
                    ],
                    [
                        'path' => 'mediaThumbnail',
                        'value' => $episode['mediaThumbnail']
                    ],
                    

                ]);

            } catch (NotFoundException $e) {
                require_once('./crunchyrollNotifier.php');
                // Crear documentos y notificar usuarios
                
                // Crear anime
                $anime = array('title' => $episode['crunchyrollSeriesTitle']);
                $animeRef = $this->db->collection('animes')->document($anime['title']);
                $animeRef->set($anime);

                // Crear version de anime
                $version = array(
                    'title' => $episode['version'],
                    'audio' => $episode['language']
                );
                $versionRef = $this->db->collection('animes/'.$anime['title'].'/versions')->document($version['title']);
                $versionRef->set($version);
                
                // Crear episodio
                $episodeRef->set($episode);

                // Actualizar versiones disponibles del episodio
                $originalEpisodeRef = $this->db->collection('animes/'.$episode['crunchyrollSeriesTitle'].'/versions/'.$episode['crunchyrollSeriesTitle'].'/episodes')->document('Episode '.$episode['crunchyrollEpisodeNumber']);
                

                $originalEpisodeRef->update([
                    [          
                        'path' => 'availableVersions',
                        'value' => FieldValue::arrayUnion([$versionRef])
                    ]
                ]);



                // Notificar subscribers
                $this->notifier = new CrunchyrollNotifier();
                $this->notifier->notify_subscribers($episode, $this);

            } finally {
                // TODO: Desarrollar método set_log en clase padre
                //$this->set_log('Added data to the episode document in the episodes collection of the anime version.' . PHP_EOL);

            }


        }
        
    }

    public function retrieve_subscribers($episode){
        
        
        // Query buscar usuarios que estén subscritos a la versión del anime
        // del episodio
        $anime = $episode['crunchyrollSeriesTitle'];
        $anime_version = $episode['version'];
        $users_ref = $this->db->collection('users');
        $anime_version_ref = $this->db->collection('animes/'.$anime.'/versions')->document($anime_version);
        $subscriptions_query = $users_ref->where('subscriptions','array-contains', $anime_version_ref);
        
        $subscribers = [];
        $snapshot = $subscriptions_query->documents();
        foreach ($snapshot as $user) {
            $user_data = $user->data();
            array_push($subscribers,$user_data);

        }

        return $subscribers;        
    }

}