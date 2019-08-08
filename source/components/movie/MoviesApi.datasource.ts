import { HTTPCache, RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import ObjectHelpers from '../../helpers/object'
import { IMoviesDataSource } from '../../interfaces'

class TicketsAPI extends RESTDataSource implements IMoviesDataSource {
  private apiKey = '3b4ea366';
  constructor() {
    super();
    this.baseURL = `http://www.omdbapi.com/`
    this.httpCache = new HTTPCache() // https://github.com/apollographql/apollo-server/issues/2240#issuecomment-508516969
  }

  public willSendRequest(request:RequestOptions) {
    request.params.set('apikey', this.apiKey);
  }

  public async searchMovies(query: { t: string, y?: string }) {
    const path = `?type=movie&${ObjectHelpers.convertObjectToQueryString(query)}`;
    let result = null;
    try {
      result = await this.get(path);
    } catch (err) {
      console.dir(err);
    }
    return result && result.Response === 'True' ? result : null
  }

  public getApiKey() {
    return this.apiKey; // TODO: get from config
  }

  protected setApiKey(key : string) {
    this.apiKey = key;
  }
}

export default TicketsAPI;
