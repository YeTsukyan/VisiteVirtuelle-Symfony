<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testCheckPassword(){
        $client = static::createClient();
        
        $crawler = $client->request(
            'GET',
            '/en/register'
            );
        
        $form = $crawler->selectButton('S\'inscrire')->form();
        
        $form['user[email]'] = 'toto@email.com';
        $form['user[username]'] = 'usernametest';
        $form['user[fullName]'] = 'John Doe';
        $form['user[password][first]'] = 'pass1';
        $form['user[password][second]'] = 'pass2';
        
        $crawler = $client->submit($form);
        
        //echo $client->getResponse()->getContent();
        
        
        $this->assertEquals(1,
            $crawler->filter('li:contains("This value is not valid.")')->count()
            );
    }
}
