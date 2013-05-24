<?php

//inclue le model de l'application
require_once("class/bases/cApplication.php");


class Application extends cApplication
{
    /*
     * Put here your custom roles (0xFFFF)
     */
    //const MyCustomRole = 0x0001;
    //...
    
    /**
     * @brief Détermine le rôle de l'utilisateur en cours
     */
    function determinateRoles()
    {/*
        // Public par défaut
        $role = cApplication::PublicRole;
        
        // Utilisateur ? (module User)
        if(class_exists("UserModule") && UserModule::getCurrent($user))
            $role |= cApplication::UserRole;
        
        // Administrateur ? (module User)
        if(class_exists("UserModule") && UserModule::getCurrent($user) && $user->getId() == "admin")
            $role |= cApplication::AdminRole;
         */
        // Vous avez tout les droits ! (test seulement)
        $role = cApplication::AnyRole;
       
        //assigne les nouveaux droits
        $this->setRole($role);
    }
    
}

?>
