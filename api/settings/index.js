module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const migrosApi = process.env.MIGROS_API;
  const triggerApi = process.env.TRIGGER_API;

  context.res = {
    status: 200,
    body: { migrosApi, triggerApi },
  };
};
