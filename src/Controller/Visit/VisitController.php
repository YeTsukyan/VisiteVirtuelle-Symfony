<?php

/* 
 * This file is part of the Virtual Visit application. 
 * 
 * Vincent Claveau <vinc.claveau@gmail.com> 
 * 
 */ 
  
namespace App\Controller\Visit;

use App\Entity\Visit;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Twig\Environment;

/**
 * @Route("/visit", name="visit_")
 */
class VisitController
{
    /**
     * @Route("/{id}", requirements={"id": "\d+"}, name="show")
     */
    public function show($id, Environment $twig, RegistryInterface $doctrine)
    {
        $visit = $doctrine->getRepository(Visit::class)->find($id);
        
        if (null === $visit) {
            throw new NotFoundHttpException("Visit with ID ".$id." doesn't exist!");
        }
    
        return new Response($twig->render('visit/show.html.twig', [
            'visit' => $visit
        ]));
    }
}