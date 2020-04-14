const covid19ImpactEstimator = (data) => {
  const {
    region,
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds
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

  const hospitalBeds = totalHospitalBeds * 0.35;

  /* challenge 1 */

  // impact
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * daysConversionRatio;

  // severeImpact
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * daysConversionRatio;

  /* challenge 2 */

  const infected = impact.currentlyInfected * daysConversionRatio;
  const severeInfected = severeImpact.currentlyInfected * daysConversionRatio;

  // impact
  impact.severeCasesByRequestedTime = Math.trunc(0.15 * infected);
  impact.hospitalBedsByRequestedTime = Math.trunc(
    hospitalBeds - 0.15 * infected
  );

  // severeImpact
  severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severeInfected);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    hospitalBeds - 0.15 * severeInfected
  );

  /* challenege 3 */
  // impact
  impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = Math.trunc(
    (impact.infectionsByRequestedTime
      * avgDailyIncomeInUSD
      * avgDailyIncomePopulation)
      / numberOfDays
  );

  // severeImpact
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  severeImpact.dollarsInFlight = Math.trunc(
    (severeImpact.infectionsByRequestedTime
      * avgDailyIncomeInUSD
      * avgDailyIncomePopulation)
      / numberOfDays
  );

  result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

export default covid19ImpactEstimator;
