export const checkEnv = () => {
  checkEnvironmentVariable('CALENDARIFIC_API_KEY');
  checkEnvironmentVariable('REDIS_HOST');
  checkEnvironmentVariable('REDIS_PORT');
  checkEnvironmentVariable('REDIS_USERNAME');
  checkEnvironmentVariable('REDIS_PASSWORD');
  checkEnvironmentVariable('REDIS_DB_NUMBER');
};
const checkEnvironmentVariable = function (variable: string) {
  if (process.env[variable]===undefined) {
    console.log(`FATAL ERROR: ${variable} is not defined.`);
    process.exit(1);
  }
};
