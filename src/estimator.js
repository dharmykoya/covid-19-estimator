const covid19ImpactEstimator = (data) => {
  const {
    region, reportedCases, periodType, timeToElapse, totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  let result = {};
  const impact = {};
  const severeImpact = {};

  let numberOfDays;

  if (periodType === 'days') {
    numberOfDays = timeToElapse;
  }
  if (periodType === 'weeks') {
    numberOfDays = 7 * timeToElapse;
  }
  if (periodType === 'months') {
    numberOfDays = 30 * timeToElapse;
  }

  const factor = Math.trunc(numberOfDays / 3);
  const daysConversionRatio = Math.trunc(2 ** factor);

  const hospitalAvailableBeds = Math.trunc(totalHospitalBeds * 0.35);

  /* challenge 1 */

  // impact
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * daysConversionRatio;

  // severeImpact
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * daysConversionRatio;

  /* challenge 2 */

  // impact
  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;

  // calculating the number of beds available
  const impactBedCases = hospitalAvailableBeds - impact.severeCasesByRequestedTime;
  impact.hospitalBedsByRequestedTime = impactBedCases - impact.severeCasesByRequestedTime
  //   impact.hospitalBedsByRequestedTime = Math.sign(impactBedCases)
  //     ? hospitalAvailableBeds
  //     : impactBedCases;

  // severeImpact
  severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;

  // calculating the number of beds available
  const severeImpactCasesBed = hospitalAvailableBeds - severeImpact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = severeImpactCasesBed - severeImpact.severeCasesByRequestedTime
  //   severeImpact.hospitalBedsByRequestedTime = Math.sign(severeImpactCasesBed)
  //     ? hospitalAvailableBeds
  //     : severeImpactCasesBed;

  /* challenege 3 */
  // impact
  impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;
  impact.casesForVentilatorsByRequestedTime = 0.02 * impact.infectionsByRequestedTime;

  impact.dollarsInFlight = (impact.infectionsByRequestedTime
    * avgDailyIncomeInUSD * avgDailyIncomePopulation * numberOfDays).toFixed(2);

  // severeImpact
  severeImpact.casesForICUByRequestedTime = 0.05 * severeImpact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime = 0.02 * severeImpact.infectionsByRequestedTime;

  severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime
    * avgDailyIncomeInUSD * avgDailyIncomePopulation * numberOfDays).toFixed(2);


  result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

export default covid19ImpactEstimator;
