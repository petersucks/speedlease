import fetch from './fetch';

function buildQuery(params) {
  //
  // builds GraphQL query
  //

  let q = '';
  for (let key in params) q += `${key}:"${params[key]}",`;
  
  if (params.update || params.token) { return `{search(${q}){id}}`; } // update search, create search
  else { return `{posts(${q}){date,link,title,locale,price,pics,site,hood,type}}`; } // get posts
}

function graphQL(query) {
  //
  // queries GraphQL
  //

  return fetch('/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query}),
    credentials: 'include',
  })
  .then(resp => {
    if (resp.status !== 200) throw new Error(resp.statusText);
    return resp.json();
  })
  .catch(err => console.error(err));
}

module.exports = { buildQuery, graphQL };