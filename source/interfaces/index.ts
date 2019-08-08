import { RESTDataSource } from 'apollo-datasource-rest';

import TicketsAPI from "../components/ticket/TicketsApi.datasource";


export interface IMoviesDataSource extends RESTDataSource {
	getApiKey(): string
}

export interface IGraphQLCustomDataSources {
	ticketsAPI: TicketsAPI
}

export interface IGraphQLCustomResolversContext {
  dataSources: IGraphQLCustomDataSources;
}