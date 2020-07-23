module.exports = async (ctx, cb) => {

  const axios = require('axios')
  const FormData = require('form-data')
  const moment = require('moment')

  async function getLeaderboardRows() {

    const start = moment().startOf('month').format('MM/DD/YYYY')
    const end = moment().add(1, 'month').startOf('month').format('MM/DD/YYYY')
    const params = JSON.stringify({ date_start: start, date_end: end })
    
    const form = new FormData()
    form.append('params', params)

    const config = {
      baseURL: '{DOMAIN}',
      url: '/admin/plugins/explorer/queries/{QUERY_ID}/run',
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
        'Api-Key': ctx.secrets.apiKey,
        'Api-Username': ctx.secrets.apiUsername,
        ...form.getHeaders()
      },
      data: form
    }

    try {
      const response = await axios(config)
      return response.data.rows
    }
    catch (error) {
      console.error(error)
      cb(null, { text: `¯\\_(ツ)_/¯  Oops...there was an error. Please contact #community for more info.` })
    }
  }

  const leaderboardRows = await getLeaderboardRows()

  if(ctx.body.text) {
    const email = ctx.body.text
    const matchingRow = leaderboardRows.find(i => i[2] === email)
    const response = matchingRow ? `🏆 DSE Community Leaderboard\n\n ${matchingRow[1]} (${matchingRow[2]}) currently has ${matchingRow[6]} pts` : `We couldn't find an email address matching \`${email}\`.`
    cb(null, { text: response })
  }

  const leaderboardTopThree = leaderboardRows.slice(0, 3)
  const leaderboard = leaderboardTopThree.map( row => ({ name: row[1], email: row[2], score: row[6] }))

  const response = `
  🏆 DSE Community Leaderboard

  🥇 ${leaderboard[0].name} (${leaderboard[0].email}) - ${leaderboard[0].score} pts

  🥈 ${leaderboard[1].name} (${leaderboard[1].email}) - ${leaderboard[1].score} pts

  🥉 ${leaderboard[2].name} (${leaderboard[2].email}) - ${leaderboard[2].score} pts

  To see the score for a specific email, use \`/wt dse-community-leaderboard {email}\``

  cb(null, { text: response, response_type: 'in_channel' })
}