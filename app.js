module.exports = async (ctx, cb) => {

  const axios = require('axios')

  async function getLeaderboardRows() {

    const config = {
      baseURL: '{DOMAIN}',
      url: '/admin/plugins/explorer/queries/{QUERY_ID}/run',
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
        'Api-Key': ctx.secrets.apiKey,
        'Api-Username': ctx.secrets.apiUsername
      }
    }

    try {
      const response = await axios(config)
      return response.data.rows
    }
    catch (error) {
      console.error(error)
      cb(null, { text: `¯\\_(ツ)_/¯  Oops...there was an error.` })
    }
  }

  const leaderboardRows = await getLeaderboardRows()
  const leaderboardTopThree = leaderboardRows.slice(0, 3)
  const leaderboard = leaderboardTopThree.map( row => ({ name: row[1], email: row[2], score: row[6] }))

  const response = `
  🏆 Your Community Leaderboard

  🥇 ${leaderboard[0].name} (${leaderboard[0].email}) - ${leaderboard[0].score} pts

  🥈 ${leaderboard[1].name} (${leaderboard[1].email}) - ${leaderboard[1].score} pts

  🥉 ${leaderboard[2].name} (${leaderboard[2].email}) - ${leaderboard[2].score} pts`


  cb(null, { text: response })
}

