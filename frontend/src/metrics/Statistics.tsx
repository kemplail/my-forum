import { Navigate } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import { useGetEvolutionNbLikesQuery, useGetEvolutionNbPostsQuery, useGetNbCommentsPostedQuery, useGetNbCommentsReceivedQuery, useGetNbLikesOnPostQuery, useGetNbPostsPerUserQuery, useGetNbPostsQuery } from "src/store/rtk/metrics";
import Title from "src/textelements/Title";
import { Chart } from "react-google-charts";
import moment from "moment";

export function Statistics() {

  const dateSevenDays = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
  const dateAlltime = moment().subtract(31, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();

  const accesstoken = useAppSelector((state) => state.user.access_token);

  const { data: evolutionNbPosts, isLoading: isLoadingEvolutionNbPosts } = useGetEvolutionNbPostsQuery(dateSevenDays);
  const { data: evolutionNbLikes, isLoading: isLoadingEvolutionNbLikes } = useGetEvolutionNbLikesQuery(dateSevenDays);
  const { data: nbPostsPerUser, isLoading: isLoadingNbPostsPerUser } = useGetNbPostsPerUserQuery();
  const { data: nbPosts, isLoading: isLoadingNbPosts } = useGetNbPostsQuery(dateAlltime);
  const { data: nbLikesOnPostSevenD, isLoading: isLoadingNbLikesOnPostSevenD } = useGetNbLikesOnPostQuery(dateSevenDays);
  const { data: nbLikesOnPostAllTime, isLoading: isLoadingNbLikesOnPostAllTime } = useGetNbLikesOnPostQuery(dateAlltime);
  const { data: nbCommentsReceivedSevenD, isLoading: isLoadingNbCommentsReceivedSevenD } = useGetNbCommentsReceivedQuery(dateSevenDays);
  const { data: nbCommentsReceivedAllTime, isLoading: isLoadingNbCommentsReceivedAllTime } = useGetNbCommentsReceivedQuery(dateAlltime);
  const { data: nbCommentsPostedAllTime, isLoading: isLoadingNbCommentsPostedAllTime } = useGetNbCommentsPostedQuery(dateAlltime);

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

  if (nbPostsPerUser) {
    optionsPieChart = {
      title: "Répartition du nombre de posts publiés par utilisateur",
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
        width: "100%",
        height: "65%"
      },
      fontName: "Roboto"
    };
  }

  //Graph évolution 

  if (accesstoken) {
    return (
      <div className="p-4">

        <Title>Statistiques</Title>

        <div className="p-2 bg-blue-200 shadow rounded-md">

          <h2 className="text-lg italic mt-4 mb-4 ml-4">Mes graphiques</h2>

          <div className="grid grid-cols-3 gap-2">

            {!isLoadingEvolutionNbPosts && evolutionNbPosts ?

              <div>
                <Chart
                  chartType="LineChart"
                  data={evolutionNbPosts.data}
                  options={optionsEvolutionNbPosts}
                  height="400px"
                  legendToggle
                />
              </div>

              : "Loading..."

            }

            {!isLoadingNbPostsPerUser && nbPostsPerUser ?

              <div className="p-2 bg-white">

                <Chart
                  chartType="PieChart"
                  data={nbPostsPerUser.data}
                  options={optionsPieChart}
                  graph_id="PieChart"
                  height="380px"
                  legend_toggle
                />

              </div>

              : "Loading..."

            }

            {!isLoadingEvolutionNbLikes && evolutionNbLikes ?

              <div>
                <Chart
                  chartType="LineChart"
                  data={evolutionNbLikes.data}
                  options={optionsEvolutionNbLikes}
                  height="400px"
                  legendToggle
                />
              </div>

              : "Loading..."

            }

          </div>

          <h2 className="text-lg italic mt-4 mb-4 ml-4">Mes Statistiques textuelles</h2>

          <div className="bg-slate-100 space-y-2 p-4">

            <span className="block">Nombre de posts publiés : <span className="font-bold">{ !isLoadingNbPosts && nbPosts }</span> </span>
            <span className="block">Nombre de commentaires publiés : <span className="font-bold">{ !isLoadingNbCommentsPostedAllTime && nbCommentsPostedAllTime }</span> </span>
            <span className="block">Nombre de likes reçus (sur vos posts) depuis 7 jours : <span className="font-bold">{ !isLoadingNbLikesOnPostSevenD && nbLikesOnPostSevenD }</span></span>
            <span className="block">Nombre de likes reçus au total : <span className="font-bold">{ !isLoadingNbLikesOnPostAllTime && nbLikesOnPostAllTime }</span></span>
            <span className="block">Nombre de commentaires reçus depuis 7 jours : <span className="font-bold">{ !isLoadingNbCommentsReceivedSevenD && nbCommentsReceivedSevenD }</span></span>
            <span className="block">Nombre de commentaires reçus au total : <span className="font-bold">{ !isLoadingNbCommentsReceivedAllTime && nbCommentsReceivedAllTime}</span></span>

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