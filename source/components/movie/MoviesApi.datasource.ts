import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

import ObjectHelpers from '../../helpers/object';
import { IMoviesDataSource } from '../../interfaces';

class TicketsAPI extends RESTDataSource implements IMoviesDataSource {
  private apiKey = '3b4ea366';
  constructor() {
    super();
    this.baseURL = 'http://www.omdbapi.com';
  }

  public willSendRequest(request:RequestOptions) {
    request.params.set('apikey', this.apiKey);
  }

  public async searchMovies(query: { title: string, year?: string }) {
    const path = `?type=movie&${ObjectHelpers.convertObjectToQueryString(query)}`;
    return this.get(path);
  }

  public getApiKey() {
    return this.apiKey; // TODO: get from config
  }

  protected setApiKey(key : string) {
    this.apiKey = key;
  }
}

export default TicketsAPI;
