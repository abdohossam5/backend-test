import { RESTDataSource } from 'apollo-datasource-rest';

import ObjectHelpers from '../../helpers/object';

class TicketsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets';
  }

  public async getTickets(query: { skip?: number, limit?: number } = {}) {
    let queryStr = '';
    if (query.limit || query.skip) queryStr = `?${ObjectHelpers.convertObjectToQueryString(query)}`;
    return this.get(queryStr);
  }
}

export default TicketsAPI;
