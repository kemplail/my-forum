import { Navigate } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import { useGetEvolutionNbLikesQuery, useGetEvolutionNbPostsQuery, useGetNbPostsPerUserQuery } from "src/store/rtk/metrics";
import Title from "src/textelements/Title";
import { Chart } from "react-google-charts";
import moment from "moment";

export function Statistics() {

    const date = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();

    const accesstoken = useAppSelector((state) => state.user.access_token);

    const { data: evolutionNbPosts, isLoading: isLoadingNbPosts } = useGetEvolutionNbPostsQuery(date);
    const { data: evolutionNbLikes, isLoading: isLoadingNbLikes } = useGetEvolutionNbLikesQuery(date);
    const { data: nbPostsPerUser, isLoading: isLoadingNbPostsPerUser } = useGetNbPostsPerUserQuery();

    //Graph évolution du nombre de posts ces 7 derniers jours

    let optionsEvolutionNbPosts = {};

    if (evolutionNbPosts) {
        optionsEvolutionNbPosts = {
            title: "Evolution du nombre de posts publiés ces 7 derniers jours",
            hAxis: { title: "Date", viewWindow: { min: 0, max: evolutionNbPosts.data.length } },
            vAxis: { title: "Nombre de posts", viewWindow: { min: 0, max: evolutionNbPosts.countMax } },
            legend: "none"
        };
    }

    let optionsEvolutionNbLikes = {};

    if (evolutionNbLikes) {
        optionsEvolutionNbLikes = {
            title: "Evolution du nombre de likes reçus sur vos posts ces 7 derniers jours",
            hAxis: { title: "Date", viewWindow: { min: 0, max: evolutionNbLikes.data.length } },
            vAxis: { title: "Nombre de posts", viewWindow: { min: 0, max: evolutionNbLikes.countMax } },
            legend: "none"
        };
    }

    let optionsPieChart = {};

    if(nbPostsPerUser) {
        optionsPieChart = {
            title: "",
            pieHole: 0.6,
            slices: [
              {
                color: "#2BB673"
              },
              {
                color: "#d91e48"
              },
              {
                color: "#007fad"
              },
              {
                color: "#e9a227"
              }
            ],
            legend: {
              position: "bottom",
              alignment: "center",
              textStyle: {
                color: "233238",
                fontSize: 14
              }
            },
            tooltip: {
              showColorCode: true
            },
            chartArea: {
              left: 0,
              top: 0,
              width: "100%",
              height: "80%"
            },
            fontName: "Roboto"
          };
    }

    //Graph évolution 

    if (accesstoken) {
        return (
            <div className="p-4">
                <Title>Statistiques</Title>
                <div className="p-2 bg-blue-200 shadow rounded-md space-y-2">
                    {!isLoadingNbPosts && evolutionNbPosts ?

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

                    {!isLoadingNbLikes && evolutionNbLikes ?

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

                    {!isLoadingNbPostsPerUser && nbPostsPerUser ? 
                    
                        <Chart
                            chartType="PieChart"
                            data={nbPostsPerUser.data}
                            options={optionsPieChart}
                            graph_id="PieChart"
                            width={"50%"}
                            height={"315px"}
                            legend_toggle
                        />
                
                        : "Loading..."

                    }

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