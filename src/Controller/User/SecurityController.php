<?php

namespace App\Controller\User;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Twig\Environment;

class SecurityController
{
    /**
     * @Route("/login", name="user_security_login")
     */
    public function login(AuthenticationUtils $helper, Environment $twig) : Response
    {
        return new Response($twig->render('Security/login.html.twig', [
            'last_username' => $helper->getLastUsername(),
            'error' => $helper->getLastAuthenticationError(),
        ]));
    }

    /**
     * @Route("/logout", name="user_security_logout")
     */
    public function logout(): void
    {
        throw new \Exception('This should be never reached!');
    }
}