import { Link } from 'react-router-dom';
import Title from './textelements/Title';

import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { useAppSelector } from './hooks';
import { LoggedDashboard } from './auth/LoggedDashboard';
import { NotLoggedDashboard } from './auth/NotLoggedDashboard';

export function Home() {

    const accesstoken = useAppSelector((state) => state.user.access_token);

    return(
        <div className='home p-4'>
            <Title>Bienvenue sur myForum !</Title>
            <p className='flex'>
                <QuestionMarkCircleIcon className='h-12 w-12'/>
                <div className='ml-6'>
                    myForum est un projet réalisé dans le cadre d'un stage en Software Engineering au sein de l'entreprise Namkin afin de se familiariser
                    avec les technologies utilisées dans le cadre du développement de la plateforme SaaS Olympe. <br/><br/>
                    Bonne visite !
                </div>
            </p>

            {
                accesstoken ?
                <LoggedDashboard /> :
                <NotLoggedDashboard />
            }

        </div>
    )

}