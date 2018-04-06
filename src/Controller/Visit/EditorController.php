<?php

/*
 * This file is part of the Virtual Visit application.
 *
 * Vincent Claveau <vinc.claveau@gmail.com>
 *
 */

namespace App\Controller\Visit;

use App\Events;
use App\Entity\User;
use App\Entity\Visit;
use App\Form\VisitType;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Twig\Environment;

/**
 * @Route("/editor", name="visit_editor_")
 */
class EditorController extends Controller
{
    private $project_dir;

    public function __construct(string $project_dir)
    {
        $this->project_dir = $project_dir.'/public/visit/';
    }

    /**
     * @Route("/new", name="new")
     */
    public function new(Request $request, Environment $twig, TokenStorageInterface $tokenStorage, RegistryInterface $doctrine, EventDispatcherInterface $eventDispatcher)
    {
        $visit = new Visit();
        $visit->setOwner($tokenStorage->getToken()->getUser());

        $form = $this->createForm(VisitType::class, $visit);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid())
        {
            // On enregistre la visite dans la base
            $em = $this->getDoctrine()->getManager();
            $em->persist($visit);
            $em->flush();

            //On déclenche l'event
            $event = new GenericEvent($visit);
            $eventDispatcher->dispatch(Events::VISIT_EDITOR_NEW_SUCCESS, $event);

            return $this->redirectToRoute('visit_show', [
                'id' => $visit->getId()
            ]);
        }

        return new Response($twig->render('visit/editor/edit.html.twig', [
            'form' => $form->createView(),
            'visit' => $visit
        ]));
    }

    /**
     * @Route("/{id}", requirements={"id": "\d+"}, name="edit")
     */
    public function edit($id, Request $request, Environment $twig, TokenStorageInterface $tokenStorage, RegistryInterface $doctrine, EventDispatcherInterface $eventDispatcher)
    {
        $visit = $doctrine->getRepository(Visit::class)->find($id);

        if ($visit === null)
        {
            throw new NotFoundHttpException("This visit doesn't exist!");
        }

        $form = $this->createForm(VisitType::class, $visit);
        $form->handleRequest($request);
        //$form->get('cover')->setData($this->project_dir.$id.'/cover.jpg');

        if ($form->isSubmitted() && $form->isValid())
        {
            // On enregistre la visite dans la base
            $em = $this->getDoctrine()->getManager();
            $em->persist($visit);
            $em->flush();

            //On déclenche l'event
            $event = new GenericEvent($visit);
            $eventDispatcher->dispatch(Events::VISIT_EDITOR_EDIT_SUCCESS, $event);

            return $this->redirectToRoute('visit_show', [
                'id' => $visit->getId()
            ]);
        }

        return new Response($twig->render('visit/editor/edit.html.twig', [
            'form' => $form->createView(),
            'visit' => $visit
        ]));
    }

    /**
     * @Route("/test/{id}", requirements={"id": "\d+"}, name="test")
     */
    public function test($id, Request $request, Environment $twig, TokenStorageInterface $tokenStorage, RegistryInterface $doctrine, EventDispatcherInterface $eventDispatcher)
    {
        $visit = $doctrine->getRepository(Visit::class)->find($id);

        if ($visit === null)
        {
            throw new NotFoundHttpException("This visit doesn't exist!");
        }

        return new Response($twig->render('visit/editor/test.html.twig', [
            'visit' => $visit
        ]));
    }
}
