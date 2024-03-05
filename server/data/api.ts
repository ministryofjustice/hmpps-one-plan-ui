import config from '../config'

export type Plan = {
  reference: string
  type: string
  objectives?: Objective[]
}

export type Objective = {
  reference: string
}

const baseUrl = config.apis.onePlanApi.url

function withAuth(token: string, init: RequestInit): RequestInit {
  return {
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...init,
  }
}

export async function getObjectiveData(token: string) {
  const plans = fetch(
    `${baseUrl}/person/12345678/plans?includeObjectivesAndSteps=true`,
    withAuth(token, {
      method: 'GET',
    }),
  ).then(res => res.json())

  const objectiveData = fetch(
    `${baseUrl}/person/12345678/objectives?includeSteps=true`,
    withAuth(token, {
      method: 'GET',
    }),
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

async function deletePlans(token: string) {
  const planRes = await fetch(`${baseUrl}/person/12345678/plans`, withAuth(token, { method: 'GET' }))
  const plans = (await planRes.json()) as Plan[]
  await Promise.all(
    plans.map(plan => {
      return fetch(
        `${baseUrl}/person/12345678/plans/${plan.reference}`,
        withAuth(token, { method: 'DELETE', mode: 'cors' }),
      )
    }),
  )
}

async function deleteObjectives(token: string) {
  const objectiveRes = await fetch(`${baseUrl}/person/12345678/objectives`, withAuth(token, { method: 'GET' }))
  const objectives = (await objectiveRes.json()) as Objective[]
  await Promise.all(
    objectives.map(objective => {
      return fetch(
        `${baseUrl}/person/12345678/objectives/${objective.reference}`,
        withAuth(token, { method: 'DELETE', mode: 'cors' }),
      )
    }),
  )
}

export async function resetDemoData(token: string) {
  await Promise.all([deletePlans(token), deleteObjectives(token)])
}
