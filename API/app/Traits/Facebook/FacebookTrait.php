<?php

namespace App\Traits\Facebook;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use SammyK\LaravelFacebookSdk\LaravelFacebookSdk as Facebook;

trait FacebookTrait
{
    /**
     * Used to switch between users by using their corresponding
     * access fokens for login
     */
    public function setAsCurrentUser()
    {
        try {
            $token = $this->access_token;

            $fb = app(Facebook::class);
            $fb->setDefaultAccessToken($token);

            return $fb;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getProfile(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get('/me/accounts');

        return $response->getDecodedBody();
    }
}