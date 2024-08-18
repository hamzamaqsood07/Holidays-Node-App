export const checkEnv = () => {
  checkEnvironmentVariable('CALENDARIFIC_API_KEY');
};
const checkEnvironmentVariable = function (variable: string) {
  if (!process.env[variable]) {
    console.log(`FATAL ERROR: ${variable} is not defined.`);
    process.exit(1);
  }
};
