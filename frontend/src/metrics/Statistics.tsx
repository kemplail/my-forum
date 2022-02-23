import { Navigate } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import { useGetEvolutionNbLikesQuery, useGetEvolutionNbPostsQuery } from "src/store/rtk/metrics";
import Title from "src/textelements/Title";
import { Chart } from "react-google-charts";
import moment from "moment";

export function Statistics() {

    const date = moment().subtract(7, 'days').set({hour:0,minute:0,second:0,millisecond:0}).toISOString();

    const accesstoken = useAppSelector((state) => state.user.access_token);
    const { data:evolutionNbPosts, isLoading: isLoadingNbPosts } = useGetEvolutionNbPostsQuery(date);

    const { data: evolutionNbLikes, isLoading: isLoadingNbLikes } = useGetEvolutionNbLikesQuery(date);

    //Graph évolution du nombre de posts ces 7 derniers jours

    let optionsEvolutionNbPosts = {};

    if(evolutionNbPosts) {
        optionsEvolutionNbPosts = {
            title: "Evolution du nombre de posts publiés ces 7 derniers jours",
            hAxis: { title: "Date", viewWindow: { min: 0, max: evolutionNbPosts.data.length } },
            vAxis: { title: "Nombre de posts", viewWindow: { min: 0, max: evolutionNbPosts.countMax } },
            legend: "none"
        };
    }

    let optionsEvolutionNbLikes = {};

    if(evolutionNbLikes) {
        optionsEvolutionNbLikes = {
            title: "Evolution du nombre de likes reçus sur vos posts ces 7 derniers jours",
            hAxis: { title: "Date", viewWindow: { min: 0, max: evolutionNbLikes.data.length } },
            vAxis: { title: "Nombre de posts", viewWindow: { min: 0, max: evolutionNbLikes.countMax } },
            legend: "none"
        };
    }

    //Graph évolution 

    if(accesstoken) {
        return (
            <div className="p-4">
                <Title>Statistiques</Title>
                <div className="bg-blue-300 rounded-md shadow p-2">
                    <div className="graphs flex">
                        { !isLoadingNbPosts && evolutionNbPosts ?
                    
                        <Chart
                            chartType="LineChart"
                            data={evolutionNbPosts.data}
                            options={optionsEvolutionNbPosts}
                            width="80%"
                            height="400px"
                            legendToggle
                        />

                            : "Loading..."

                        }

                        { !isLoadingNbLikes && evolutionNbLikes ?
                        
                        <Chart
                        chartType="LineChart"
                        data={evolutionNbLikes.data}
                        options={optionsEvolutionNbLikes}
                        width="80%"
                        height="400px"
                        legendToggle
                        />

                        : "Loading..."
                        
                        }
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <Navigate
            to={`/login/`}
          />
        )
    }

}