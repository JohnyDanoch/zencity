const botgram = require('botgram');
const { checkIfFreeAndEngage, checkIfEngagedAndFree, isEngaged } = require('./bots.service');

/**
 * @description this function will initialize the telegram bot with re required actions
 * @param {Object} bot
 * @param {String} bot.id bot's id from db
 * @param {String} bot.token unique authentication token given from telegram
 * @param {String} bot.answer the ultimate answer
 * @param {Array} bot.expertise expertise array of strings
 */
const telegramBotInitialization = ({
  _id,
  token,
  expertise,
  answer,
}, io) => {
  const isExpertIn = (topic) => expertise.indexOf(topic) !== -1;
  const ERROR_MSG = 'an error has accured please try again later';

  const bot = botgram(token);
  bot.synced(() => {
    console.log("\nI'm bot username: (%s).", bot.get('firstname'));
    console.log("I'm synced, Talk to me: %s", bot.link());
  });
  bot.command('start', (msg, reply) => {
    reply.text(`hello ${msg.from.firstname}`);
    reply.text(
      `I'm ${bot.get('firstname')} an expert in the following topics : ${expertise}\n`
      + 'To engage with me please enter /engage \n'
      + 'after I\'m engaged successfully you can ask for help on your topic with /askforhelp <topic>\n'
      + 'When you finish free me with entering /disengage \n',
    );
  });
  bot.command('engage', async (_msg, reply) => {
    try {
      if (await checkIfFreeAndEngage(_id)) {
        reply.text('Great I\'m now engaged, you can ask for help now\n'
                   + 'Dont forget to enter /disengage when you finished');
        io.emit('statusChanged');
      } else { reply.text('Sorry im bussy. try again later'); }
    } catch (err) { reply.text(ERROR_MSG); }
  });
  bot.command('disengage', async (__msg, reply) => {
    try {
      if (await checkIfEngagedAndFree(_id)) { reply.text('Great I\'m now free and ready to engage'); } else {
        reply.text('Weird, I\'m already free did you engage me?');
        io.emit('statusChanged');
      }
    } catch (err) {
      reply.text(ERROR_MSG);
    }
  });
  bot.command('askforhelp', async (msg, reply) => {
    try {
      const [topic] = msg.args(1);

      if (!await isEngaged(_id)) {
        reply.text('Please engage before asking for help');
        return;
      }
      if (isExpertIn(topic)) {
        reply.text(`${answer}`);
      } else {
        reply.text(`I'm sorry you need to provide one topics of my expertises : ${expertise}`);
      }
    } catch (err) {
      reply.text(ERROR_MSG);
    }
  });
};

module.exports = {
  telegramBotInitialization,
};
