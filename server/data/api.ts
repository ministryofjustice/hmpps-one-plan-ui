export type Plan = {
  reference: string
  type: string
  objectives: Objective[]
}

export type Objective = {
  reference: string
}

export async function getObjectiveData(token: string) {
  const plans = fetch(
    'https://one-plan-api-dev.hmpps.service.justice.gov.uk/person/12345678/plans?includeObjectivesAndSteps=true',
    {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  ).then(res => res.json())

  const objectiveData = fetch(
    `https://one-plan-api-dev.hmpps.service.justice.gov.uk/person/12345678/objectives?includeSteps=true`,
    {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  ).then(res => res.json())

  const planData = (await plans) as Plan[]
  const objectiveRefToPlanType: Record<string, string> = {}
  planData.forEach(plan => {
    plan.objectives.forEach(objective => {
      objectiveRefToPlanType[objective.reference] = plan.type
    })
  })

  return { objectives: await objectiveData, objectiveRefToPlanType }
}
