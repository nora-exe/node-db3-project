const db = require('../../data/db-config')

function find() { // EXERCISE A
  return db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .select('sc.*')
      .count('st.step_id as number_of_steps')
      .orderBy('sc.scheme_id', 'asc')
      .groupBy('sc.scheme_id')
}

async function findById(scheme_id) { // EXERCISE B
  const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .select('st.*', 'sc.scheme_name', 'sc.scheme_id')
      .count('st.step_id as number_of_steps')
      .orderBy('st.step_number', 'asc')

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: []
  }

  rows.forEach(row => {
    if (row.step_id) {
      result.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions
      })
    }
  })
  return result
}

async function findSteps(scheme_id) { // EXERCISE C - sort steps by step #; empty array if no steps
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'instructions', 'sc.scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('step_number')

  if (!rows[0].step_id) return []
  return rows
}

function add(scheme) { // EXERCISE D - creates new scheme, resolves to new scheme
  return db('schemes').insert(scheme)
    .then(([scheme_id]) => {
      return db('schemes').where('scheme_id', scheme_id).first()
    })
}

function addStep(scheme_id, step) { // EXERCISE E - add step to scheme, resolves to all steps including new step
  return db('steps').insert({
    ...step,
    scheme_id
  })
    .then(() => {
      return db('steps')
      .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
      .select('step_id', 'step_number', 'instructions', 'scheme_name')
      .orderBy('step_number')
      .where('sc.scheme_id', scheme_id)
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
