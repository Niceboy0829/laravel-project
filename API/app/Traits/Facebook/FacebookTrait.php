<?php

namespace App\Traits\Facebook;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use SammyK\LaravelFacebookSdk\LaravelFacebookSdk as Facebook;
use Laravel\Socialite\Facades\Socialite;

trait FacebookTrait
{
    /**
     * Used to switch between users by using their corresponding
     * access fokens for login
     */
    public function setAsCurrentUser($token = false)
    {
        try {
            $token = $token ? $token : $this->access_token;

            $fb = app(Facebook::class);
            $fb->setDefaultAccessToken($token);

            return $fb;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getProfile(){
        $user = Socialite::driver("facebook")->userFromToken($this->access_token);
        return $user;
    }

    public function getPages(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get('/me/accounts?fields=access_token,picture,name');

        return $response->getDecodedBody();
    }

    public function getGroups(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get('/me/groups?fields=owner,picture,name');

        return $response->getDecodedBody();
    }

    public function getPosts($since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/feed?since={$since}&until={$until}");

        return $response->getDecodedBody();
    }

    public function pageLikes($period='day', $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_fans?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageUnlikes($period){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_fan_removes_unique/{$period}");

        return $response->getDecodedBody();
    }

    public function pageEngagement($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_engaged_users?{$period}&since={$since}&until={$until}");

        return $response->getDecodedBody();
    }

    public function pageLikeReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_like_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageLoveReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_love_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageWowReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_wow_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageHahaReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_haha_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageSorryReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_sorry_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageAngerReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_anger_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pagePostEngagements($period){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_post_engagements/{$period}");

        return $response->getDecodedBody();
    }

    public function postComments($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/comments");

        return $response->getDecodedBody();
    }

    public function postReactions($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/reactions");

        return $response->getDecodedBody();
    }

    public function postShares($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/sharedposts");

        return $response->getDecodedBody();
    }

    public function pageTotalReactions($period){
        $like = $this->pageLikeReactions($period)['data'][0]['values'][1]['value'];
        $love = $this->pageLoveReactions($period)['data'][0]['values'][1]['value'];
        $wow = $this->pageWowReactions($period)['data'][0]['values'][1]['value'];
        $haha = $this->pageHahaReactions($period)['data'][0]['values'][1]['value'];
        $sorry = $this->pageSorryReactions($period)['data'][0]['values'][1]['value'];
        $anger = $this->pageAngerReactions($period)['data'][0]['values'][1]['value'];

        $total = $like+$love+$wow+$haha+$sorry+$anger;

        return $total;

    }

    public function getNonProfileAvatar()
    {
       try{
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("$this->original_id/?fields=picture");
            $data = $response->getDecodedBody();

           if($data){
                return $data["picture"]["data"]["url"];
           }
       }catch(\Exception $e){
            //throw $e;
       }
        
        return "";
    }

    public function getProfileAvatar()
    {
        try{
            $profile = Socialite::driver("facebook")->userFromToken($this->access_token);

            if($profile){
                return $profile->avatar;
            }

        }catch(\Exception $e){
           
        } 
        
        return "";
    }

    public function getAvatar(){
        try{
            $key = $this->id . "-facebookAvatar";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () {
                $avatar = "";
                if($this->account_type == "profile"){
                    $avatar = $this->getProfileAvatar();
                }else{
                    $avatar = $this->getNonProfileAvatar();
                }

                if($avatar){
                    return $avatar;
                }

                return public_path()."/images/dummy_profile.png";
            });
        }catch(\Exception $e){
            getErrorResponse($e, $this->global);
            return false;
        }
    }

    /**
     * @param array $media
     * @return mixed
     */
    public function uploadMedia($media)
    {
        $fb = $this->setAsCurrentUser($this->access_token);
        $response = $fb->post("/{$this->original_id}/photos", $media);
        return $response->getDecodedBody();
    }

        /**
     * @param array $tweet
     * @return mixed
     */
    public function publish($post)
    {
        $fb = $this->setAsCurrentUser($this->access_token);
        $response = $fb->post("/{$this->original_id}/feed", $post);
        return $response->getDecodedBody();
    }

    /**
     * @param object ScheduledPost
     * @return mixed
     */
    public function publishScheduledPost($scheduledPost)
    {
        try{
            $payload = unserialize($scheduledPost->payload);
            $images = $payload['images'];
            $timezone = $payload['scheduled']['publishTimezone'];
            $appUrl = config("app.url");
            $mediaIds = [];
            $mediaCount = 0;
            foreach($images as $image){
                $relativePath = $image['relativePath'];
                $fullPath = $appUrl."/".$relativePath;
                $media = ["url" => $fullPath, "published" => false];
                $uploadResponse = $this->uploadMedia($media);
                $mediaId = $uploadResponse['id'];
                $mediaIds["attached_media[$mediaCount]"] = "{'media_fbid': '$mediaId'}";
                $mediaCount++;
            }
            
            $text = $scheduledPost->content;
            $link = findUrlInText($text);

            if($link){
                $text = str_replace($link, "", $text);
                $post["link"] = $link;
            }

            if($text){
                $post["message"] = $text;
            }

            if($mediaCount > 0){
                $post = array_merge($mediaIds, $post);
            }
            
            $result = $this->publish($post);

            $now = Carbon::now();
            $scheduledPost->posted = 1;
            $scheduledPost->status = null;
            $scheduledPost->scheduled_at = $now;
            $scheduledPost->scheduled_at_original = Carbon::parse($now)->setTimezone($timezone);
            $scheduledPost->save();

            return $result;

        }catch(\Exception $e){
            
            $scheduledPost->posted = 0;
            $scheduledPost->status = -1;
            $scheduledPost->save();

            throw $e;
        }
    }

        /**
     * Synchronize tweets from API
     * 
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncFacebookPosts()
    {
        $posts = $this->getPosts();

        if($posts)
        {
            foreach($posts['data'] as $post)
            {
                $data[] = [
                    'channel_id' => $this->id,
                    'post_id' => $post['id'],
                    'message' => array_key_exists('message', $post) ? $post['message'] : null,
                    'story' => array_key_exists('story', $post) ? $post['story'] : null,
                    'original_created_at' => Carbon::parse($post['created_time'])->toDateTimeString(),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ];
            }

            \DB::table('facebook_posts')->insert($data);
        }


    }

}