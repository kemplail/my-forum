import React from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';
import AddPostModal from './AddPostModal';

import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

export function Home(props) {

    return(
        <div className='home p-4'>
            <Title name="Bienvenue sur myForum !" />
            <p className='flex'>
                <QuestionMarkCircleIcon className='h-12 w-12'/>
                <div className='ml-6'>
                    myForum est un projet réalisé dans le cadre d'un stage en Software Engineering au sein de l'entreprise Namkin afin de se familiariser
                    avec les technologies utilisées dans le cadre du développement de la plateforme SaaS Olympe. <br/><br/>
                    Bonne visite !
                </div>
            </p>
            <div className=' grid grid-cols-2 bg-slate-200 rounded-md px-8 py-4 gap-12 ml-60 mr-60 shadow mt-6'>
                <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                    <Link to="/posts">
                        Consulter les derniers posts
                    </Link>
                </div>
                <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                    <Link to=""> 
                        Ajouter un nouveau post
                    </Link>
                </div>
            </div>
        </div>
    )

}