const BotSchema = require('../models/bot.model');

/**
 * @description this is an atomic operation for checking & updating the bot's status
 *              if the bot is engaged nothing changes
 * @param {String} id the id of the bot
 * @returns {Promise<boolean>} true if the bot is not engaged
 * @throws {mongoose.Error}
 */
const checkIfFreeAndEngage = async (id) => {
  const filter = { _id: id, status: 'Free' };
  const bot = await BotSchema.findOneAndUpdate(filter, { status: 'Engaged' });

  return (!!bot);
};
const checkIfEngagedAndFree = async (id) => {
  const filter = { _id: id, status: 'Engaged' };
  const bot = await BotSchema.findOneAndUpdate(filter, { status: 'Free' });

  return (!!bot);
};

const getAll = async () => BotSchema.find();

const isEngaged = async (id) => {
  const { status } = await BotSchema.findById(id);

  return status === 'Engaged';
};

module.exports = {
  getAll,
  checkIfFreeAndEngage,
  checkIfEngagedAndFree,
  isEngaged,
};
