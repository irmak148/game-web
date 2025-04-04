exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const game = require('../../server/games/agar');
    const data = JSON.parse(event.body);
    
    // Handle different game events
    switch(data.type) {
      case 'join':
        return {
          statusCode: 200,
          body: JSON.stringify(game.joinGame(data.playerId))
        };
      case 'move':
        return {
          statusCode: 200,
          body: JSON.stringify(game.movePlayer(data.playerId, data.x, data.y))
        };
      case 'leave':
        return {
          statusCode: 200,
          body: JSON.stringify(game.leaveGame(data.playerId))
        };
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid event type' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
